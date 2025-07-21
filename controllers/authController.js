import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendEmail } from "../utills/sendEmail.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Send welcome email to user
    await sendEmail({
      to: email,
      subject: "Welcome to FitZone!",
      text: `Hello ${name},\n\nThank you for  signing up at FitZone!\n\nWe’re excited to have you with us. Your account is now active and ready to use.\n\nLet us know if you ever need help.\nFitZone Team\n[Muhammad Shafiq,Muhammad Usman]`,
    });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Send login notification email to user
    await sendEmail({
      to: email,
      subject: "Login Alert - FitZone",
      text: `Hello ${user.name},\n\nThis is to confirm that you’ve just logged in to your FitZone account.\nFitZone Team,\n[Muhammad Shafiq,Muhammad Usman]`,
    });

    // Optional: You can send back a token here if needed
    res.json({
      message: "Login successful.",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};
