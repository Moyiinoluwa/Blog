import { Request, NextFunction } from "express";
import { adminValidator } from "./Validator/admin.validator";
import { adminService } from "./admin.service";
import { userService } from "../User/user.service";


export class AdminController {
    //Register
    public async registerAdmin(req: Request, res: any, next: NextFunction) {
        try {
            const { error } = adminValidator.validateRegister(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message })
            }

            const { message } = await adminService.registerAdmin(req, res)
            if (message) {
                res.status(200).json({ message })
            }
        } catch (error) {
            next(error)
        }
    }

    //VERIFY VERIFICATIOON CODE
    public async verifyCode(req: Request, res: any, next: NextFunction) {
        try {
            const { error } = adminValidator.validateVerificationCode(req.body);
            if (error) {
                res.json({ error: error.details[0].message })
            }

            const { message } = await adminService.verifyCode(req, res)
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

            const { error } = adminValidator.validateResendCode(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message })
            }

            const { message } = await adminService.resendCode(req, res)
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

            const { error } = adminValidator.validateResetPasswordLink(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message })
            }

            const { message } = await adminService.resetPasswordLink(req, res)
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

            const { error } = adminValidator.validateResetPassword(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message })
            }

            const { message } = await adminService.resetPassword(req, res)
            if (message) {
                res.status(200).json({ message })
            }
        } catch (error) {
            next(error)
        }
    }

    //CHANGE PASSWORD
    public async changePassword(req: Request, res: any, next: NextFunction) {
        try {

            const { error } = adminValidator.validateChangePassword(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message })
            }

            const { message } = await adminService.changePassword(req, res)
            if (message) {
                res.status(200).json({ message })
            }

        } catch (error) {
            next(error)
        }
    }

    //UPDATE PROFILE
    public async updateAdmin(req: Request, res: any, next: NextFunction) {
        try {

            const { error } = adminValidator.validateUpdate(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message })
            }

            const { message } = await adminService.updateUser(req, res)
            if (message) {
                res.status(200).json({ message })
            }
        } catch (error) {
            next(error)
        }
    }

    //DELETE PROFILE
    public async deleteAdmin(req: Request, res: any, next: NextFunction) {
        try {
            const { message } = await adminService.deleteUser(req, res)
            if (message) {
                res.status(200).json({ message });
            }

        } catch (error) {
            next(error);
        }
    }


    //GET ALL USERS
    public async getAllUsers(req: Request, res: any, next: NextFunction) {
        try {
            const { all } = await userService.getAll(req, res)
            if (all) {
                res.status(200)
            }

        } catch (error) {
            next(error)
        }
    }

    // //Get one user
    // public async getOneUser(req: Request, res: any, next: NextFunction) {
    //     try {
    //         const { user } = await userService.getUser(req, res)
    //         if(!user) {

    //         }
    //     } catch (error) {
    //         next (error)
    //     }
    // }

     //DELETE PROFILE
     public async deleteUser(req: Request, res: any, next: NextFunction) {
        try {
            const { message } = await adminService.deleteUser(req, res)
            if (message) {
                 res.status(200).json({ message });
            }

        } catch (error) {
            next (error);
        }
    }


}



const adminController = new AdminController()
export { adminController }