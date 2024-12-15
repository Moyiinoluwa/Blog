import express from 'express';
import { adminController } from './admin.controller';
import { adminAuth } from '../../Middleware/auth';


 
const adminRouter = express.Router()

//register
adminRouter.post('/register', adminController.registerAdmin)

//  verification code
adminRouter.post('/verify', adminController.verifyCode)

//resend verification code
adminRouter.post('/resend', adminController.resendCode)

//reset password link
adminRouter.post('/reset-password-link', adminController.resetPasswordLink)

//reset password
adminRouter.post('/reset-password', adminController.resetPassword)

//change user password
adminRouter.patch('/change/:_id', adminAuth,  adminController.changePassword)

//update profile
adminRouter.put('/update/:_id', adminAuth, adminController.updateAdmin)

//delete admin
adminRouter.delete('/delete/:_id', adminAuth, adminController.deleteAdmin)

//get all user
adminRouter.get('/get', adminAuth, adminController.getAllUsers)

//get one user
//adminRouter.get('/get-one', adminController.getOneUser)

//delete user
adminRouter.delete('/delete-user', adminAuth, adminController.deleteUser)

//login
adminRouter.post('/login', adminController.login)


export default adminRouter;