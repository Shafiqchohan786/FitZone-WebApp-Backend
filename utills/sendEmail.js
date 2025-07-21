import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to,
      subject,
      text,
    });

    console.log(`Email sent to ${to}: MessageId: ${info.messageId}`);
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};
