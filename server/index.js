require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Schema for Contact Messages
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Configure Nodemailer Transporter
// NOTE: Google requires an "App Password" to send emails securely without OAuth2.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'singhyash9631@gmail.com',
    pass: process.env.EMAIL_PASS || 'YOUR_APP_PASSWORD_HERE' 
  }
});

// Endpoint to handle form submissions
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // 1. Save directly to MongoDB Atlas
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    console.log(`✅ [Contact] New message from ${name} saved to MongoDB!`);
    
    // 2. Automated Email Reply
    const mailOptions = {
      from: `"Yashveer Singh" <${process.env.EMAIL_USER || 'singhyash9631@gmail.com'}>`, // Sender address
      to: email, // Send to the person who filled out the form
      subject: "Thanks for reaching out! - Yashveer Singh",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">Message Received! 🚀</h1>
          </div>

          <!-- Body -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 22px;">Hi ${name},</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Thanks for dropping by my portfolio and reaching out! This is an automated confirmation to let you know that your message has securely landed in my database. I'll be reviewing it and getting back to you as soon as possible.
            </p>

            <!-- Quoted Message -->
            <div style="background-color: #f1f5f9; border-left: 4px solid #8b5cf6; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
              <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Your Message:</p>
              <p style="color: #334155; font-size: 15px; margin-top: 8px; margin-bottom: 0; font-style: italic;">"${message}"</p>
            </div>

            <!-- Actions / Links -->
            <div style="text-align: center; margin-top: 40px;">
              <a href="https://github.com/Yashveersir" style="display: inline-block; background-color: #1e293b; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 5px;">View GitHub</a>
              <a href="https://www.linkedin.com/in/yashveer-singh-41bb36280" style="display: inline-block; background-color: #0b66c2; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 5px;">Connect on LinkedIn</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 500;">Best Regards,</p>
            <p style="margin: 4px 0 0 0; color: #0f172a; font-size: 18px; font-weight: bold;">Yashveer Singh</p>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Full-Stack Developer & Gen AI Enthusiast</p>
          </div>
        </div>
      `
    };

    // Prevent crashing if the App Password isn't configured yet
    try {
      if(process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        console.log(`✉️ [Email] Auto-reply sent successfully to ${email}`);
      } else {
         console.log(`⚠️ [Email] Auto-reply skipped. Please configure EMAIL_PASS in a .env file!`);
      }
    } catch (emailError) {
      console.log(`⚠️ [Email Error]`, emailError.message);
    }
    
    return res.status(201).json({ success: true, message: 'Message recorded successfully!' });
  } catch (error) {
    console.error('❌ [Contact API Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Start the server FIRST so Render doesn't time out waiting for MongoDB to connect
app.listen(PORT, () => {
  console.log(`🚀 Contact backend running on port ${PORT}`);
  
  if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
      .then(() => console.log('✅ Connected successfully to MongoDB Atlas (cluster0)'))
      .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));
  } else {
    console.log('⚠️ MONGO_URI environment variable is missing! Database will not connect.');
  }
});
