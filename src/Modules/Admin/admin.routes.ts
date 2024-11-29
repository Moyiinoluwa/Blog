import express from 'express';
import { adminController } from './admin.controller';


 
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
adminRouter.patch('/change/:_id', adminController.changePassword)

//update profile
adminRouter.put('/update/:_id', adminController.updateAdmin)

//delete admin
adminRouter.delete('/delete/:_id', adminController.deleteAdmin)

//get all user
adminRouter.get('/get', adminController.getAllUsers)

//get one user
//adminRouter.get('/get-one', adminController.getOneUser)

//delete user
adminRouter.delete('/delete-user', adminController.deleteUser)

export default adminRouter;