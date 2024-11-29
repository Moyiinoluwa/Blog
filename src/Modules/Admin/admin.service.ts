import { Request, Response } from "express";
import { Admin, IAdmin } from "../../Model/admin/admin.model";
import bcrypt from 'bcrypt'
import { AdminOtp, IAdminOtp } from "../../Model/admin/adminOtp.model";
import { generate2FACode6digits } from "../../Utils/verificationCode";
import { mailer } from "../../Mailer/mailer.service";
import { v4 as uuidv4 } from 'uuid'
import { IUser, User } from "../../Model/user/user.model";


export class AdminService {
    //REGISTER
    public async registerAdmin(req: Request, res: Response) {
        try {
            const { firstName, lastName, email, password } = req.body;

            //check if user has registered before
            const userRegistered = await Admin.findOne({ email: email })
            if (userRegistered) {
                res.status(400).json({ error: 'user already exists' })
            }

            //hash password
            const hash = await bcrypt.hash(password, 10)

            //create new user
            const newAdmin = new Admin();
            newAdmin.lastName = lastName
            newAdmin.firstName = firstName
            newAdmin.email = email
            newAdmin.password = hash
            newAdmin.createdAt = new Date();

            //save to database
            await newAdmin.save();

            //set verification code
            const code = generate2FACode6digits();

            //set expiration time for verification code
            const time = new Date();
            time.setMinutes(time.getMinutes() + 10)

            //save verification code to database
            const otp = new AdminOtp();
            otp.otp = code;
            otp.email = email;
            otp.verified = false;
            otp.expirationTime = time;
            otp.createdAt = new Date();

            await otp.save();

            //send verification code to user via mail
            await mailer.verificationMail(email, code, firstName)

            return { message: 'user registered' }

        } catch (error) {
            throw error
        }

    }

    //VERIFY OTP
    public async verifyCode(req: Request, res: Response) {
        try {
            const { email, code } = req.body;
            //check if email is regsitered
            const userEmail = await AdminOtp.findOne({ email: email })
            if (!userEmail) {
                res.status(404).json({ error: 'user is not registered' })
            }

            //check if the code is correct
            const userCode = await AdminOtp.findOne({ otp: code }) as unknown as IAdminOtp
            if (!userCode) {
                res.status(404).json({ error: 'code is not correct' })
            }

            //check if the code has expired
            if (userCode.expirationTime <= new Date()) {
                res.status(401).json({ error: 'code has expired' })
            }

            //find the user associated with the email
            const user = await Admin.findOne({ email: email }) as unknown as IAdmin
            if (!user) {
                res.status(404).json({ error: 'user is not associated to the email the code was sent to' })
            }

            //update database
            userCode.verified = true
            user.isVerified = true
            await userCode.save();
            

            return { message: 'code is verified' }

        } catch (error) {
            throw error
        }
    }

    //RESEND VERIFICATION CODE
    public async resendCode(req: Request, res: Response) {
        try {

            const { email } = req.body;

            //check if user is registered
            const user = await Admin.findOne({ email: email }) as unknown as IAdmin
            if (!user) {
                res.status(404).json({ error: 'user cannot request for another code ' })
            }

            //set verification code
            const userCode = generate2FACode6digits();

            //set expiration time for verification code
            const codeTime = new Date();
            codeTime.setMinutes(codeTime.getMinutes() + 10);

            //save verifiction code to database
            const reSend = new AdminOtp();
            reSend.email = email;
            reSend.otp = userCode;
            reSend.expirationTime = codeTime;
            reSend.verified = false;
            reSend.createdAt = new Date();

            await reSend.save();

            //send to user via mail
            await mailer.verificationMail(email, userCode, user.firstName)

            return { message: 'code resent' }

        } catch (error) {
            throw error
        }
    }


     //RESET PASSWORD LINK
     public async resetPasswordLink(req: Request, res: Response) {
        try {
            const { email } = req.body;

            //check if user is registered
            const user = await Admin.findOne({ email: email }) as unknown as IAdmin
            if (!user) {
                res.status(404).json({ error: 'user cannot request password link' })
            }

            //set the link token
            const linkToken = uuidv4();

            //set reset link
            const resetLink = `http://localhost:3000/admin/reset-link?${linkToken}`

            //set expiration time for reset link
            const linkTime = new Date();
            linkTime.setMinutes(linkTime.getMinutes() + 10);

            //send to user via mail
            await  mailer.resetLinkMail(email, resetLink, user.firstName)

            //update database
            user.resetLink = resetLink;
            user.isResetLinkSent = true;
            user.resetLink_expirationTime = linkTime;

            await user.save()
            
            return { message: 'reset link sent' }

        } catch (error) {
            throw error
        }
    }

    //RESET PASSWORD
    public async resetPassword(req: Request, res: Response) {
        try {

            const { email, resetLink, password } = req.body;

            //check if user is registered
            const user = await Admin.findOne({ email: email }) as unknown as IAdmin
            if (!user) {
                res.status(404).json({ error: 'user cannot reset password' })
            }

            //check if link is valid
            if (user.resetLink !== resetLink) {
                res.status(401).json({ error: 'invalid reset link' })
            }

            //hash password
            const hash = await bcrypt.hash(password, 10)


            //save to database
            await user.save()

            return { message: 'user password reset' }

        } catch (error) {
            throw error
        }
    }

    //CHANGE PASSWORD
    public async changePassword(req: Request, res: Response) {
        try {

            const { _id }  = req.params;

            const { oldPassword, newPassword } = req.body;

            //find user by id
            const user = await Admin.findById(_id) as unknown as IAdmin
            if (!user) {
                res.status(404).json({ message: 'user cannot change password' })
            }

            //compare the old password saved with the one user entered
            const passwordMatch = await bcrypt.compare(oldPassword, newPassword)
            if(passwordMatch) {
                res.status(400).json({  message: 'old password is incorrect'})
            }

            //hash new password
            const hash = await bcrypt.hash(newPassword, 10)

            //update databse
            user.password = hash;

            //save to database
            await user.save()

            return { message: 'user password changed' }

        } catch (error) {
            throw error
        }

    }

    //UPDATE USER
    public async updateUser(req: Request, res: Response) {
        try {
            const  {_id}  = req.params;

            const { email, firstName, lastName } = req.body;

            //check if user is registered
            const user = await Admin.findById(_id)  as unknown as IAdmin
            if(!user) {
                res.status(404).json({ message: 'user cannot update profile'})
            }

            //update profile
            user.email = email;
            user.firstName = firstName;
            user.lastName = lastName;

            //save to database
            await user.save()

            return { message: 'profile updated'}

        } catch (error) {
            throw error
        }
    }

     //DELETE PROFILE
     public async deleteAdmin(req: Request, res: Response) {
        try {
                const { _id } = req.params;

            const user = await Admin.findById(_id) as unknown as IAdmin
            if(!user) {
                res.status(404).json({ error: 'user cannot delete'})
            }

            //delete
            await user.deleteOne()

            return { message: 'user deleted'}

        } catch (error) {
            throw error
        }
    }

     //GET ALL USERS
     public async getAll(req: Request, res: Response) {
        try {

            //find all registered users
            const users = await User.find()
            if(users.length == 0) {
                res.status(404).json({ error: 'There are no registered users'})
            }

            return { all: users}
         // return res.status(200).json({ users })

        } catch (error) {
            throw error
        }
    }

    //GET A USER
    public async getUser(req: Request, res: Response) {
        try {

            //find user by id
            const { _id } = req.params;

           const user = await User.findById(_id)
            if(!user) {
                res.status(404).json({ error: 'cannot get this user'})
            } else {
                return { user }
            }

        } catch (error) {
            throw error
        }
    }


     //DELETE PROFILE
     public async deleteUser(req: Request, res: Response) {
        try {
                const { _id } = req.params;

            const user = await User.findById(_id) as unknown as IUser
            if(!user) {
                res.status(404).json({ error: 'user cannot delete'})
            }

            //delete
            await user.deleteOne()

            return { message: 'user deleted'}

        } catch (error) {
            throw error
        }
    }


    
}


const adminService = new AdminService()
export { adminService }
