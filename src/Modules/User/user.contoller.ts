import { NextFunction } from "express";
import { userValidator } from "./Validator/user.validator";
import { Request } from "express";
import { userService } from "./user.service";
import ApiError from "../../Utils/apiError";
import httpStatus from "http-status";



class UserController {
    //register new user
    public async register(req: Request, res: any, next: NextFunction) {
        try {
            //when error occur
            const { error } = userValidator.validateRegister(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message })
            }

            //if successful
            const { message } = await userService.registerUser(req, res)
            if (message) {
                res.status(200).json({ message })
            }
        } catch (error) {
            next(error)
        }
    }

    //VERIFY USER VERIFICATION CODE
    public async verifyCode(req: Request, res: any, next: NextFunction) {
        try {
            const { error } = userValidator.validateVerificationCode(req.body);
            if (error) {
                res.json({ error: error.details[0].message })
            }

            const { message } = await userService.verifyCode(req, res)
            if (message) {
                res.status(200).json({ message })
            }
        } catch (error) {
            next(error)
        }
    }

    //RESEND VERIFICATION CODE
    public async resendCode(req: Request, res: any, next: NextFunction) {
        try {

            const { error } = userValidator.validateResendCode(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message })
            }

            const { message } = await userService.resendCode(req, res)
            if (message) {
                res.status(200).json({ message })
            }
        } catch (error) {
            next(error)
        }
    }


    //RESET PASSWORD LINK
    public async resetPasswordLink(req: Request, res: any, next: NextFunction) {
        try {

            const { error } = userValidator.validateResetPasswordLink(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message })
            }

            const { message } = await userService.resetPasswordLink(req, res)
            if (message) {
                res.status(200).json({ message })
            }

        } catch (error) {
            next(error)
        }
    }
    
    //RESET PASSWORD
    public async resetPassword(req: Request, res: any, next: NextFunction) {
        try {
            
            const { error } = userValidator.validateResetPassword(req.body);
            if(error) {
                res.status(400).json({ error: error.details[0].message})
            }

            const { message } = await userService.resetPassword(req, res)
            if(message) {
                res.status(200).json({ message })
            }
        } catch (error) {
            next(error)
        }
    }

    //CHANGE PASSWORD
    public async changePassword(req: Request, res: any, next: NextFunction) {
        try {

            const { error } = userValidator.validateChangePassword(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message })
            }

            const { message } = await userService.changePassword(req, res)
            if (message) {
                res.status(200).json({ message })
            }

        } catch (error) {
            next(error)
        }
    }

    //UPDATE PROFILE
    public async updateUser(req: Request, res: any, next: NextFunction) {
        try {

            const { error } = userValidator.validateUpdate(req.body);
            if (error) 
                {
                res.status(400).json({ error: error.details[0].message })
            }

            const { message } = await userService.updateUser(req, res)
            if (message) {
                res.status(200).json({ message })
            }
        } catch (error) {
            next(error)
        }
    }

    //LOGIN
    public async login(req: Request, res: any, next: NextFunction) {
        try {
            const { error } = userValidator.validateLogin(req.body);
            if(error)
                throw new ApiError(httpStatus.NOT_FOUND, error.details[0].message)

            //userlogin sends the response to the user 
            await userService.userLogin(req, res);

        } catch (error) {
            next(error)
        }
    }
   
   
}

const userController = new UserController();
export { userController }