import express from 'express'
import { userController } from './user.contoller'
import { userAuth } from '../../Middleware/auth'


const router = express.Router()

//register
router.post('/register', userController.register)

//verification code
router.post('/verify', userController.verifyCode)

//resend verification code
router.post('/resend', userController.resendCode)

//reset password link
router.post('/reset-password-link', userController.resetPasswordLink)

//reset password
router.post('/reset-password', userController.resetPassword)

//change user password
router.patch('/change/:_id', userAuth, userController.changePassword)

//update profile
router.put('/update/:_id', userAuth, userController.updateUser)

 //login
 router.post('/login', userController.login)

export default router;