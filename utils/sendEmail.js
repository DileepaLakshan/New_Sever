import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const sendEmail = async (to, subject, text) => {
    try {

      console.log("test30");
      // Create transporter
      const transporter = nodemailer.createTransport({
        service: "gmail", // or use another SMTP service
        auth: { 
          user: process.env.EMAIL_USER, // Your email
          pass: process.env.EMAIL_PASS, // Your email password or App Password
        },
      });
      console.log("test31");
      // Email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to:to,
        subject: subject,
        text: text,
      };
      console.log("test32");
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
