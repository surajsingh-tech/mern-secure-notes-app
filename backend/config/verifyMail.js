import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

// Get current file path and folder path in ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendVerificationEmail  = async (token, email) => {
  try {
    const emailTemplateSourse = fs.readFileSync(
      path.join(__dirname, "../utils/mailTemplate/email.hbs"),
      "utf-8",
    );
    // Turn template string into a function, then replace {{link}} with real value
    const template = handlebars.compile(emailTemplateSourse);
    
    // Encode the token so it travels safely in URLs 
    const htmlToSend = template({ token : encodeURIComponent(token) });

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
      subject: "Email verification",
      html: htmlToSend,
    };

    const info = await transporter.sendMail(mailConfigurations);

    console.log(` Email sent to ${email}`);
    console.log(info.messageId);
  } catch (error) {
    console.error(" Mail error:", error.message);
  }
};



