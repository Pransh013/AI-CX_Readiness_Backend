import crypto from "crypto";
import nodemailer from "nodemailer";
import { EmailInvitationParams } from "../schema";

export const sendEmailInvitation = async ({
  email,
  temporaryPassword,
  resetPasswordUrl,
}: EmailInvitationParams) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Invitation to join the assessment and reset your password",
    html: `
      <p>Hello,</p>
      <p>You have been invited to participate in an assessment for your team. To get started, please follow the link below to reset your password and set up your account:</p>
      <p><a href="${resetPasswordUrl}">Reset your password</a></p>
      <p>Your temporary password is: <strong>${temporaryPassword}</strong></p>
      <p>Please log in and change your password immediately upon first login for security reasons.</p>
      <p>Once you reset your password, you will be able to access the assessment.</p>
      <p>Best regards,<br>The Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invitation sent to ${email}`);
  } catch (error) {
    console.error("Error sending email invitation:", error);
    throw new Error("Failed to send email invitation.");
  }
};

export const generateSecurePassword = () => {
  return crypto.randomBytes(4).toString("hex"); // Generates a random 16-character password
};

export const formatDate = (isoDate: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return new Date(isoDate).toLocaleString("en-US", options);
};
