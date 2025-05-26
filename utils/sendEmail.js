import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
   }
})

export const sendEmail = async (to, subject, text) => {
   try {
      const mailOptions = {
         from: `"Your app name" <${process.env.EMAIL_USER}>`,
         to,
         subject,
         html
      };

      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
   } catch (error) {
      console.error("❌ Failed to send email:", err);
      throw new Error("Failed to send email");
   }
}