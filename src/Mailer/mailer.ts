import nodemailer, { Transporter } from 'nodemailer';

class MailService {
  private transporter: nodemailer.Transporter; 

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,  
        pass: process.env.AUTH_PASS 
      }
    });

    // Verify the transporter configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error(error);
      } else {
        console.log(success);
      }
    });
  }

  // Method to send an email
  public async sendEmail(email: string, subject: string, body: string){
    try {
      // Email options
      const mailOptions = {
        from: process.env.AUTH_EMAIL,  
        to: email,                   
        subject: subject,             
        html: body,                   
      };

      // Send the email
      await this.transporter.sendMail(mailOptions);

      // Return success response
      return {
        status: 'Pending',
        message: 'Verification token sent',
      };
    } catch (error) {
      return {
        status: 'Failed',
        message: 'Something happened',
      };
    }
  }
}


// const mailService = new MailService();
// export { mailService }

export const mailService = new MailService();