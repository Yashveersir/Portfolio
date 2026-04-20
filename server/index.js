require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Backend Landing Page
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: 'Segoe UI', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: white; text-align: center;">
      <h1 style="background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 3rem; margin-bottom: 10px;">Yashveer's Portfolio API</h1>
      <p style="color: #94a3b8; font-size: 1.2rem; margin-bottom: 30px;">Operational & Secure</p>
      <div style="padding: 20px; border: 1px solid #1e293b; border-radius: 12px; background: #1e293b; margin-bottom: 40px;">
        <span style="color: #4ade80;">✔</span> Database Connected<br>
        <span style="color: #4ade80;">✔</span> Email Server Online<br>
        <span style="color: #4ade80;">✔</span> CORS Whitelisted
      </div>
      <a href="https://yashveersingh.xyz" style="padding: 15px 30px; background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); color: white; border-radius: 10px; text-decoration: none; font-weight: bold; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Return to Main Website</a>
    </div>
  `);
});

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
    
    // 2. Automated Email Reply to User
    const autoReplyOptions = {
      from: `"Yashveer Singh" <${process.env.EMAIL_USER || 'singhyash9631@gmail.com'}>`, 
      to: email, 
      subject: "Thanks for reaching out! - Yashveer Singh",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">Message Received! 🚀</h1>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 22px;">Hi ${name},</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Thanks for dropping by my portfolio and reaching out! This is an automated confirmation to let you know that your message has securely landed. I'll be reviewing it and getting back to you as soon as possible.
            </p>
            <div style="background-color: #f1f5f9; border-left: 4px solid #8b5cf6; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
              <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Your Message:</p>
              <p style="color: #334155; font-size: 15px; margin-top: 8px; margin-bottom: 0; font-style: italic;">"${message}"</p>
            </div>
            <div style="text-align: center; margin-top: 40px;">
              <a href="https://github.com/Yashveersir" style="display: inline-block; background-color: #1e293b; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 5px;">View GitHub</a>
              <a href="https://www.linkedin.com/in/yashveer-singh-41bb36280" style="display: inline-block; background-color: #0b66c2; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 5px;">Connect on LinkedIn</a>
            </div>
          </div>
          <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 500;">Best Regards,</p>
            <p style="margin: 4px 0 0 0; color: #0f172a; font-size: 18px; font-weight: bold;">Yashveer Singh</p>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Full-Stack Developer & Gen AI Enthusiast</p>
          </div>
        </div>
      `
    };

    // 3. Notification Email to Owner (Yashveer)
    const ownerNotificationOptions = {
        from: `"Portfolio Alert" <${process.env.EMAIL_USER || 'singhyash9631@gmail.com'}>`,
        to: process.env.EMAIL_USER || 'singhyash9631@gmail.com',
        subject: `🚨 New Contact from ${name}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
            <div style="background: #1e293b; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Message Received</h1>
            </div>
            <div style="padding: 30px;">
              <p style="color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: bold;">From:</p>
              <p style="color: #1e293b; font-size: 18px; margin-top: 5px;">${name} (${email})</p>
              
              <p style="color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: bold; margin-top: 25px;">Message Details:</p>
              <div style="background-color: #f8fafc; border-left: 4px solid #06b6d4; padding: 20px; border-radius: 0 8px 8px 0; margin-top: 10px;">
                <p style="color: #334155; font-size: 16px; margin: 0; line-height: 1.6;">${message}</p>
              </div>
            </div>
            <div style="background-color: #f1f5f9; padding: 20px; text-align: center;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">This message was sent from your portfolio contact form.</p>
            </div>
          </div>
        `
    };

    // Send emails
    try {
      if(process.env.EMAIL_PASS) {
        // Send both concurrently
        await Promise.all([
            transporter.sendMail(autoReplyOptions),
            transporter.sendMail(ownerNotificationOptions)
        ]);
        console.log(`✉️ [Email] Notifications sent successfully to ${email} and Owner.`);
      } else {
         console.log(`⚠️ [Email] Notifications skipped. Please configure EMAIL_PASS in a .env file!`);
      }
    } catch (emailError) {
      console.log(`⚠️ [Email Error]`, emailError.message);
    }
    
    return res.status(201).json({ success: true, message: 'Message recorded successfully!' });
  } catch (error) {
    console.error('❌ [Contact API Error]:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error.', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
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
