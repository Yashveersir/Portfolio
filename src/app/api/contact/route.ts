import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

/* ── MongoDB Connection (singleton) ── */
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('⚠️ MONGO_URI not set — skipping database.');
    return;
  }
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB error:', err);
  }
}

/* ── Message Schema ── */
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message =
  mongoose.models.Message || mongoose.model('Message', messageSchema);

/* ── Nodemailer Transporter ── */
function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/* ── Professional Email Templates ── */
function senderConfirmationHtml(name: string, message: string) {
  return `
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
  </div>`;
}

function ownerNotificationHtml(name: string, email: string, message: string) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🔔 New Portfolio Message</h1>
      <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 13px;">${timestamp} IST</p>
    </div>
    <div style="padding: 30px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; font-weight: bold; text-transform: uppercase; width: 80px;">Name</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 16px;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; font-weight: bold; text-transform: uppercase;">Email</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 16px;"><a href="mailto:${email}" style="color: #06b6d4; text-decoration: none;">${email}</a></td>
        </tr>
      </table>
      <div style="background-color: #f8fafc; border-left: 4px solid #06b6d4; padding: 20px; border-radius: 0 8px 8px 0; margin-top: 20px;">
        <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
        <p style="color: #334155; font-size: 16px; margin-top: 8px; margin-bottom: 0; line-height: 1.6;">${message}</p>
      </div>
      <div style="text-align: center; margin-top: 30px;">
        <a href="mailto:${email}?subject=Re: Portfolio Inquiry&body=Hi ${encodeURIComponent(name)}," style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reply to ${name}</a>
      </div>
    </div>
    <div style="background-color: #f1f5f9; padding: 16px; text-align: center;">
      <p style="margin: 0; color: #94a3b8; font-size: 12px;">Sent from yashveersingh.xyz contact form</p>
    </div>
  </div>`;
}

/* ── POST /api/contact ── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Server-side validation
    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim();
    const trimmedMessage = String(message).trim();

    if (trimmedName.length > 100) {
      return NextResponse.json({ error: 'Name is too long (max 100 chars).' }, { status: 400 });
    }
    if (trimmedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    if (trimmedMessage.length < 10) {
      return NextResponse.json({ error: 'Message too short (min 10 chars).' }, { status: 400 });
    }
    if (trimmedMessage.length > 2000) {
      return NextResponse.json({ error: 'Message too long (max 2000 chars).' }, { status: 400 });
    }

    // Basic sanitization — strip HTML tags to prevent XSS in email templates
    const sanitize = (s: string) => s.replace(/<[^>]*>/g, '');
    const safeName = sanitize(trimmedName);
    const safeEmail = trimmedEmail; // Already validated format
    const safeMessage = sanitize(trimmedMessage);

    // 1. Save to MongoDB
    try {
      await connectDB();
      await Message.create({ name: safeName, email: safeEmail, message: safeMessage });
      console.log(`✅ Message from ${safeName} saved to MongoDB`);
    } catch (dbErr) {
      console.error('⚠️ DB save failed (continuing):', dbErr);
    }

    // 2. Send emails
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = getTransporter();
      try {
        await Promise.all([
          // Confirmation to sender
          transporter.sendMail({
            from: `"Yashveer Singh" <${process.env.EMAIL_USER}>`,
            to: safeEmail,
            subject: '✅ Message Received — Yashveer Singh',
            html: senderConfirmationHtml(safeName, safeMessage),
          }),
          // Notification to owner
          transporter.sendMail({
            from: `"Portfolio Alert" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `🔔 New Contact: ${safeName}`,
            html: ownerNotificationHtml(safeName, safeEmail, safeMessage),
          }),
        ]);
        console.log(`✉️ Emails sent to ${safeEmail} and owner`);
      } catch (emailErr) {
        console.error('⚠️ Email send failed:', emailErr);
      }
    } else {
      console.warn('⚠️ EMAIL_USER/EMAIL_PASS not set — emails skipped');
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
