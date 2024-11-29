    
import { mailService } from "./mailer"

 export class Mailer {
    constructor( ) {}
        
        async verificationMail(email: string, verificationCode: string, firstName: string) {
            const subject = 'Email verification'
            const body = `<!DOCTYPE HTML>
            <html>
            <head>
            </head>
            <body>
            <h1>OTP Verification</h1>
            <h1>Hello ${firstName}</h1>
            <h1> Your One Time Password (OTP): ${verificationCode}</h1>
            <P> This password is for a limited time</P>
            <p> If you did not request for OTP kindly ignore this message, your account is safe with us</p>
            </body>
            </html>
            `
            await mailService.sendEmail(email, subject, body)
        }

        async resetLinkMail(email: string, resetLink: string, firstName: string ) {
            const subject = 'Reset Password Link'
            const body = `<!DOCTYPE HTML>
            <html>
            <head>
            </head>
            <body>
            <h1>Reset Link</h1>
            <h1>Hello ${firstName}</h1>
            <h1> Your Reset Link is: ${resetLink}</h1>
            <P> This reset link is for a limited time</P>
            <p> If you did not request for reset link kindly ignore this message, your account is safe with us</p>
            </body>
            </html>
            `
            await mailService.sendEmail(email, subject,  body)
        }
}


export const mailer = new Mailer();