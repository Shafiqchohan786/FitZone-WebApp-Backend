import { sendEmail } from "../utills/sendEmail.js";

export const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields: name, email, message.",
    });
  }

  try {
    // Admin ko email
    await sendEmail({
      to: process.env.ADMIN_EMAIL,  // admin email aapke .env se
      subject: `New Contact Message from ${name}`,
      text: `You have received a new message from your website contact form.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    });

    console.log(`Admin email sent to ${process.env.ADMIN_EMAIL}`);

    // User ko thank you email
    await sendEmail({
      to: email,
      subject: "Thank you for contacting FitZone",
      text: `Hello ${name},\n\nThank you for reaching out to FitZone. We have received your message and will get back to you shortly.\n\nBest regards,\nFitZone Team\n[Muhammad Shafiq,Muhammad Usman]`,
    });

    console.log(`Thank you email sent to user: ${email}`);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent. Thank you for contacting us!",
    });
  } catch (error) {
    console.error("Error sending emails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Could not send emails.",
    });
  }
};
