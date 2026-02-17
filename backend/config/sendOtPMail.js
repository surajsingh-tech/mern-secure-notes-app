import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (email, OTP) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailConfigurations = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password reset OTP",
      html: `<p>Your OTP for reset password is : <b>${OTP}</b>. It is valid for 10 minutes </p>`,
    };

    await transporter.sendMail(mailConfigurations);
  } catch (error) {
    console.error("Error while sending OTP mail:", error.message);
    throw new Error("Failed to send OTP mail");
  }
};
