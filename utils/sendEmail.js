import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const sendEmail = async (to, subject, text) => {
    try {

      console.log(process.env.EMAIL_USER);
      // Create transporter
      const transporter = nodemailer.createTransport({
        service: "gmail", // or use another SMTP service
        auth: { 
          user: process.env.EMAIL_USER, // Your email
          pass: process.env.EMAIL_PASS, // Your email password or App Password
        },
      });
  
      // Email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      };
  
      // Send email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };
  

export default sendEmail;
