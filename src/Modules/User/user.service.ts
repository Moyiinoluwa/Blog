import { IUser, User } from "../../Model/user/user.model";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { generate2FACode6digits } from "../../Utils/verificationCode";
import { IUserOtp, UserOtp } from "../../Model/user/userOtp.model";
import { mailer } from "../../Mailer/mailer.service";
import { v4 as uuidv4 } from 'uuid';
import Jwt from 'jsonwebtoken';
import { getConfig } from "../../Config/config";
import httpStatus from 'http-status';
import ApiError from "../../Utils/apiError";


const { SECRET_KEY } = getConfig();


export class UserService {
    constructor() { }

    public async registerUser(req: Request, res: Response) {
        try {
            const { firstName, lastName, email, password } = req.body;

            //check if user has registered before
            const userRegistered = await User.findOne({ email: email })
            if (userRegistered)
                throw new ApiError(httpStatus.BAD_REQUEST, 'user already exists')
                
            //hash password
            const hash = await bcrypt.hash(password, 10)

            //create new user
            const newUser = new User();
            newUser.lastName = lastName
            newUser.firstName = firstName
            newUser.email = email
            newUser.password = hash
            newUser.createdAt = new Date();

            //save to database
            await newUser.save();

            //set verification code
            const code = generate2FACode6digits();

            //set expiration time for verification code
            const time = new Date();
            time.setMinutes(time.getMinutes() + 10)

            //save verification code to database
            const otp = new UserOtp();
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
            const userEmail = await UserOtp.findOne({ email: email })
            if (!userEmail)
                throw new ApiError(httpStatus.NOT_FOUND, 'user is not registered') 

            //check if the code is correct
            const userCode = await UserOtp.findOne({ otp: code }) as unknown as IUserOtp
            if (!userCode) 
                throw new ApiError(httpStatus.BAD_REQUEST, 'code is not correct')
                 
            //check if the code has expired
            if (userCode.expirationTime <= new Date()) 
                throw new ApiError(httpStatus.BAD_REQUEST,'code has expired' ) 

            //find the user associated with the email
            const user = await User.findOne({ email: email }) as unknown as IUser
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
            const user = await User.findOne({ email: email }) as unknown as IUser
            if (!user) 
                throw new ApiError(httpStatus.BAD_REQUEST, 'user cannot request for another code ')
                 
            //set verification code
            const userCode = generate2FACode6digits();

            //set expiration time for verification code
            const codeTime = new Date();
            codeTime.setMinutes(codeTime.getMinutes() + 10);

            //save verifiction code to database
            const reSend = new UserOtp();
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
            const user = await User.findOne({ email: email }) as unknown as IUser
            if (!user)
                throw new ApiError(httpStatus.NOT_FOUND, 'user cannot request password link')

            //set the link token
            const linkToken = uuidv4();

            //set reset link
            const resetLink = `http://localhost:3000/user/reset-link?${linkToken}`

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
            const user = await User.findOne({ email: email }) as unknown as IUser
            if (!user) 
                throw new ApiError(httpStatus.NOT_FOUND, 'user cannot reset password, please register')

            //check if link is valid
            if (user.resetLink !== resetLink) 
                throw new ApiError(httpStatus.NOT_FOUND, 'invalid reset link')
             
            //hash password
            const hash = await bcrypt.hash(password, 10)

            //reset password
            user.password = hash;

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

            const { _id } = req.params;

            const { oldPassword, newPassword } = req.body;

            //find user by id
            const user = await User.findById(_id) as unknown as IUser
            if (!user) 
                throw new ApiError(httpStatus.FORBIDDEN, 'user cannot change password, please log in')

            //compare the old password saved with the one user entered
            const passwordMatch = await bcrypt.compare(oldPassword, newPassword)
            if (passwordMatch)
                throw new ApiError(httpStatus.NOT_FOUND, 'old password is incorrect')

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
            const user = await User.findById(_id) as unknown as IUser
            if (!user) 
                throw new ApiError(httpStatus.FORBIDDEN, 'user cannot update profile' )

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


    //GET ALL USERS
    public async getAll(req: Request, res: Response) {
        try {

            //find all registered users
            const users = await User.find()
            if (users.length == 0)
                throw new ApiError(httpStatus.NOT_FOUND,'There are no registered users' )

            return { all: users }
            // return res.status(200).json({ users })

        } catch (error) {
            throw error
        }
    }


    //USER LOGIN
    public async userLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Check if the user is registered
            const user = await User.findOne({ email: email }) as unknown as IUser;
            if (!user) 
                throw new ApiError(httpStatus.NOT_FOUND, 'User cannot login, please log in')

            // Check if the account is verified
            if (!user.isVerified) 
                throw new ApiError(httpStatus.BAD_REQUEST, 'Account is not verified' )

            // Check if the account is locked
            if (user.isLocked)
                throw new ApiError(httpStatus.BAD_REQUEST,'Account is locked' )

            // Compare the password
            const validPassword = await bcrypt.compare(password, user.password);

            // If the password is incorrect
            if (!validPassword) {
                user.loginCount += 1;

                // Check if the user has exceeded login attempts
                if (user.loginCount >= 5) {
                    user.isLocked = true;
                    user.lockedUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); //lock for two hours
                    await user.save();
                    throw new ApiError(httpStatus.BAD_REQUEST, 'Account is locked due to multiple failed login attempts.' )
                }

                // Save the updated login count
                await user.save();

                // Send number of attempt left to the user
                throw new ApiError(httpStatus.BAD_REQUEST,`Incorrect password, You have ${5 - user.loginCount} attempts left,
                     your account will be locked for two hours` )

                // return res.status(401).json({
                //     error: `Incorrect password, You have ${5 - user.loginCount} attempts left,
                //      your account will be locked for two hours` });
            }

            // If the password is correct, reset login attempts and unlock account
            user.loginCount = 0;
            user.isLocked = false;
            await user.save();

            // Generate and return access token
           // const secret = process.env.SECRET_KEY || ''
            const accessToken = Jwt.sign(
                {
                    userId: user._id,
                    email: user.email,
                    role: user.role,
                },
                //'9876543210',
                SECRET_KEY,
                //process.env.SECRET_KEY  
                { expiresIn: '1y' }
            );
            return res.status(200).json({ accessToken });
        } catch (error) {
            throw error;
        }
    }

}



const userService = new UserService();
export { userService }


//Problems to solve
//Resend code(duplicate key error)
//Get all is not sending a response
//Get one
