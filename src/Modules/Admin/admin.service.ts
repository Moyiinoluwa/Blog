import { Request, Response } from "express";
import { Admin, IAdmin } from "../../Model/admin/admin.model";
import bcrypt from 'bcrypt'
import { AdminOtp, IAdminOtp } from "../../Model/admin/adminOtp.model";
import { generate2FACode6digits } from "../../Utils/verificationCode";
import { mailer } from "../../Mailer/mailer.service";
import { v4 as uuidv4 } from 'uuid'
import { IUser, User } from "../../Model/user/user.model";
import Jwt from 'jsonwebtoken';
import { getConfig } from "../../Config/config";
import httpStatus from "http-status";
import ApiError from "../../Utils/apiError";


const { SECRET_KEY } = getConfig();

export class AdminService {
    //REGISTER
    public async registerAdmin(req: Request, res: Response) {
        try {
            const { firstName, lastName, email, password } = req.body;

            //check if user has registered before
            const userRegistered = await Admin.findOne({ email: email })
            if (userRegistered)
                throw new ApiError(httpStatus.FORBIDDEN, 'admin already exists')

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

            return { message: 'admin registered' }

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
            if (!userEmail)
                throw new ApiError(httpStatus.NOT_FOUND, 'admin is not registered')

            //check if the code is correct
            const userCode = await AdminOtp.findOne({ otp: code }) as unknown as IAdminOtp
            if (!userCode)
                throw new ApiError(httpStatus.BAD_GATEWAY, 'code is not correct')

            //check if the code has expired
            if (userCode.expirationTime <= new Date())
                throw new ApiError(httpStatus.FORBIDDEN, 'code has expired')

            //find the user associated with the email
            const user = await Admin.findOne({ email: email }) as unknown as IAdmin
            if (!user)
                throw new ApiError(httpStatus.NOT_FOUND, 'user is not associated to the email the code was sent to')

            //update database
            userCode.verified = true
            user.isVerified = true
            await userCode.save();
            await user.save()

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
            if (!user)
                throw new ApiError(httpStatus.BAD_REQUEST, 'admin cannot request for another code ')

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
            if (!user)
                throw new ApiError(httpStatus.NOT_FOUND, 'admin cannot request password link')

            //set the link token
            const linkToken = uuidv4();

            //set reset link
            const resetLink = `http://localhost:3000/admin/reset-link?${linkToken}`

            //set expiration time for reset link
            const linkTime = new Date();
            linkTime.setMinutes(linkTime.getMinutes() + 10);

            //send to user via mail
            await mailer.resetLinkMail(email, resetLink, user.firstName)

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
            if (!user)
                throw new ApiError(httpStatus.NOT_FOUND, 'admin cannot reset password')

            //check if link is valid
            if (user.resetLink !== resetLink)
                throw new ApiError(httpStatus.FORBIDDEN, 'invalid reset link')

            //hash password
            const hash = await bcrypt.hash(password, 10)

            user.password = hash;

            //save to database
            await user.save()

            return { message: 'admin password reset' }

        } catch (error) {
            throw error
        }
    }

    //CHANGE PASSWORD
    public async changePassword(req: Request, res: Response) {
        try {

            const { _id } = req.params;

            const { oldPassword, newPassword } = req.body;

            //find user by id
            const user = await Admin.findById(_id) as unknown as IAdmin
            if (!user)
                throw new ApiError(httpStatus.NOT_FOUND, 'user cannot change password')

            //compare the old password saved with the one user entered
            const passwordMatch = await bcrypt.compare(oldPassword, newPassword)
            if (!passwordMatch)
                throw new ApiError(httpStatus.BAD_REQUEST, 'old password is incorrect')

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
            const { _id } = req.params;

            const { email, firstName, lastName } = req.body;

            //check if user is registered
            const user = await Admin.findById(_id) as unknown as IAdmin
            if (!user)
                throw new ApiError(httpStatus.BAD_REQUEST, 'user cannot update profile')

            //update profile
            user.email = email;
            user.firstName = firstName;
            user.lastName = lastName;

            //save to database
            await user.save()

            return { message: 'profile updated' }

        } catch (error) {
            throw error
        }
    }

    //DELETE PROFILE
    public async deleteAdmin(req: Request, res: Response) {
        try {
            const { _id } = req.params;

            const user = await Admin.findById(_id) as unknown as IAdmin
            if (!user)
                throw new ApiError(httpStatus.BAD_REQUEST, 'user cannot delete')

            //delete
            await user.deleteOne()

            return { message: 'user deleted' }

        } catch (error) {
            throw error
        }
    }

    //GET ALL USERS
    public async getAll(req: Request, res: Response) {
        try {

            //find all registered users
            const users = await User.find()
            if (users.length == 0)
                throw new ApiError(httpStatus.NOT_FOUND, 'There are no registered users')

            return { all: users }
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
            if (!user) {
                throw new ApiError(httpStatus.NOT_FOUND, 'cannot get this user')
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
            if (!user)
                throw new ApiError(httpStatus.BAD_REQUEST, 'user cannot delete')

            //delete
            await user.deleteOne()

            return { message: 'user deleted' }

        } catch (error) {
            throw error
        }
    }


    //USER LOGIN
    public async adminLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Check if the user is registered
            const admin = await Admin.findOne({ email: email }) as unknown as IUser;
            if (!admin)
                throw new ApiError(httpStatus.NOT_FOUND, 'admin cannot login, please register')

            // Check if the account is verified
            // if (!admin.isVerified) {
            //     return res.status(403).json({ error: 'Account is not verified' });
            // }

            // Check if the account is locked
            if (admin.isLocked)
                throw new ApiError(httpStatus.BAD_REQUEST, 'Account is locked')

            // Compare the password
            const validPassword = await bcrypt.compare(password, admin.password);

            // If the password is incorrect
            if (!validPassword) {
                admin.loginCount += 1;

                // Check if the user has exceeded login attempts
                if (admin.loginCount >= 5) {
                    admin.isLocked = true;
                    admin.lockedUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); //lock for two hours
                    await admin.save();
                    throw new ApiError(httpStatus.FORBIDDEN, 'Account is locked due to multiple failed login attempts.')
                }

                // Save the updated login count
                await admin.save();

                // Send number of attempt left to the user
                throw new ApiError(httpStatus.FORBIDDEN, `Incorrect password, You have ${5 - admin.loginCount} attempts left,
                 your account will be locked for two hours`)
            }

            // If the password is correct, reset login attempts and unlock account
            admin.loginCount = 0;
            admin.isLocked = false;
            await admin.save();

            // const secretKey = process.env.SECRET_KEY || ''
            // console.log(secretKey)
            // Generate and return access token
            const accessToken = Jwt.sign(
                {
                    userId: admin._id,
                    email: admin.email,
                    role: admin.role,
                },
                SECRET_KEY,
                //'9876543210',
                { expiresIn: '1d' }
            );
            return res.status(200).json({ accessToken });
        } catch (error) {
            throw error;
        }
    }


}


const adminService = new AdminService()
export { adminService }
