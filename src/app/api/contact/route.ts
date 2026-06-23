import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

/* ── MongoDB Connection (singleton) ── */
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('⚠️ MONGO_URI not set — skipping database.');
    return;
  }
  try {
    await mongoose.connect(uri);
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
  if (process.env.BREVO_SMTP_KEY) {
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env.BREVO_SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });
  }
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
  <div style="background-color: #0b0f19; padding: 40px 10px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #151c2c; border-radius: 16px; overflow: hidden; border: 1px solid #223049; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3), 0 10px 10px -5px rgba(0,0,0,0.3);">
      <!-- Glowing Top Accent -->
      <tr>
        <td height="6" style="background: linear-gradient(90deg, #06b6d4 0%, #6366f1 50%, #8b5cf6 100%);"></td>
      </tr>
      <!-- Header/Logo area -->
      <tr>
        <td style="padding: 40px 40px 20px 40px; text-align: center;">
          <div style="display: inline-block; padding: 12px; background-color: rgba(6, 182, 212, 0.1); border-radius: 50%; margin-bottom: 20px; border: 1px solid rgba(6, 182, 212, 0.2);">
            <span style="font-size: 32px;">✉️</span>
          </div>
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Message Secured!</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 8px; margin-bottom: 0;">We've received your submission.</p>
        </td>
      </tr>
      <!-- Body Content -->
      <tr>
        <td style="padding: 20px 40px 30px 40px;">
          <p style="color: #cbd5e1; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
            Hi <strong>${name}</strong>,
          </p>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
            Thanks for reaching out! Your message has safely landed. I will review the details and get back to you as soon as possible. Here is a copy of what you sent:
          </p>
          <!-- Message box -->
          <div style="background-color: #0b0f19; border-left: 4px solid #06b6d4; padding: 20px; border-radius: 8px; margin-bottom: 32px; border: 1px solid #1e293b; border-left-width: 4px;">
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #06b6d4; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Your Message</p>
            <p style="color: #f1f5f9; font-size: 15px; margin: 0; line-height: 1.6; font-style: italic;">"${message}"</p>
          </div>
          <!-- Buttons/Links -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <a href="https://github.com/Yashveersir" style="display: inline-block; background-color: #1e293b; border: 1px solid #334155; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px; margin: 5px; transition: all 0.3s;">
                  🐙 GitHub Profile
                </a>
                <a href="https://www.linkedin.com/in/yashveer-singh-41bb36280" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%); color: #ffffff; padding: 13px 25px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; margin: 5px; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.2); transition: all 0.3s;">
                  💼 Connect on LinkedIn
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background-color: #0e1320; padding: 30px 40px; text-align: center; border-top: 1px solid #1e293b;">
          <p style="margin: 0; color: #94a3b8; font-size: 14px;">Best Regards,</p>
          <p style="margin: 4px 0 2px 0; color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: -0.3px;">Yashveer Singh</p>
          <p style="margin: 0; color: #06b6d4; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Full-Stack Developer</p>
          <p style="margin: 16px 0 0 0; color: #475569; font-size: 11px;">You are receiving this automated email because you submitted a contact request on <a href="https://yashveersingh.xyz" style="color: #6366f1; text-decoration: none;">yashveersingh.xyz</a>.</p>
        </td>
      </tr>
    </table>
  </div>`;
}

function ownerNotificationHtml(name: string, email: string, message: string) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return `
  <div style="background-color: #0b0f19; padding: 40px 10px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #151c2c; border-radius: 16px; overflow: hidden; border: 1px solid #223049; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3), 0 10px 10px -5px rgba(0,0,0,0.3);">
      <!-- Glowing Top Accent (Warm Amber/Red Alert) -->
      <tr>
        <td height="6" style="background: linear-gradient(90deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%);"></td>
      </tr>
      <!-- Header/Logo area -->
      <tr>
        <td style="padding: 40px 40px 20px 40px; text-align: center;">
          <div style="display: inline-block; padding: 12px; background-color: rgba(245, 158, 11, 0.1); border-radius: 50%; margin-bottom: 20px; border: 1px solid rgba(245, 158, 11, 0.2);">
            <span style="font-size: 32px;">🔔</span>
          </div>
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">New Portfolio Inquiry</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 8px; margin-bottom: 0;">${timestamp} IST</p>
        </td>
      </tr>
      <!-- Body Content -->
      <tr>
        <td style="padding: 20px 40px 30px 40px;">
          <!-- Sender Meta Table -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 12px; font-weight: bold; text-transform: uppercase; width: 100px;">From Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #1e293b; color: #ffffff; font-size: 15px; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 12px; font-weight: bold; text-transform: uppercase;">Email Address</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #1e293b; color: #06b6d4; font-size: 15px; font-weight: 600;">
                <a href="mailto:${email}" style="color: #06b6d4; text-decoration: none;">${email}</a>
              </td>
            </tr>
          </table>
          
          <!-- Message box -->
          <div style="background-color: #0b0f19; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 32px; border: 1px solid #1e293b; border-left-width: 4px;">
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #f59e0b; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Message</p>
            <p style="color: #f1f5f9; font-size: 15px; margin: 0; line-height: 1.6;">${message}</p>
          </div>
          
          <!-- Reply CTA Button -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <a href="mailto:${email}?subject=Re: Portfolio Inquiry&body=Hi ${encodeURIComponent(name)}," style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: #ffffff; padding: 13px 30px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);">
                  ⚡ Quick Reply to ${name}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background-color: #0e1320; padding: 20px 40px; text-align: center; border-top: 1px solid #1e293b;">
          <p style="margin: 0; color: #475569; font-size: 11px;">Sent automatically from the contact system at <a href="https://yashveersingh.xyz" style="color: #6366f1; text-decoration: none;">yashveersingh.xyz</a>.</p>
        </td>
      </tr>
    </table>
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
    const senderEmail = process.env.BREVO_SMTP_USER || process.env.EMAIL_USER;
    const recipientEmail = process.env.EMAIL_USER || process.env.BREVO_SMTP_USER;
    const hasBrevoApi = !!process.env.BREVO_API_KEY;
    const hasEmailConfig = hasBrevoApi ||
                           (process.env.BREVO_SMTP_KEY && senderEmail) ||
                           (process.env.EMAIL_USER && process.env.EMAIL_PASS);

    if (hasEmailConfig) {
      try {
        if (!senderEmail || !recipientEmail) {
          throw new Error('Missing sender or recipient email address configuration.');
        }

        if (hasBrevoApi) {
          const url = 'https://api.brevo.com/v3/smtp/email';
          const apiKey = process.env.BREVO_API_KEY!;
          
          await Promise.all([
            // Confirmation to sender
            fetch(url, {
              method: 'POST',
              headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                sender: { name: 'Yashveer Singh', email: senderEmail },
                to: [{ email: safeEmail, name: safeName }],
                subject: '✅ Message Received — Yashveer Singh',
                htmlContent: senderConfirmationHtml(safeName, safeMessage),
              }),
            }).then(async (res) => {
              if (!res.ok) {
                const err = await res.text();
                throw new Error(`Brevo API Sender Confirmation Error: ${err}`);
              }
            }),
            // Notification to owner
            fetch(url, {
              method: 'POST',
              headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                sender: { name: 'Portfolio Alert', email: senderEmail },
                to: [{ email: recipientEmail, name: 'Yashveer Singh' }],
                subject: `🔔 New Contact: ${safeName}`,
                htmlContent: ownerNotificationHtml(safeName, safeEmail, safeMessage),
              }),
            }).then(async (res) => {
              if (!res.ok) {
                const err = await res.text();
                throw new Error(`Brevo API Owner Notification Error: ${err}`);
              }
            }),
          ]);
          console.log(`✉️ Emails sent via Brevo API to ${safeEmail} and owner`);
        } else {
          // SMTP Fallback
          const transporter = getTransporter();
          await Promise.all([
            // Confirmation to sender
            transporter.sendMail({
              from: `"Yashveer Singh" <${senderEmail}>`,
              to: safeEmail,
              subject: '✅ Message Received — Yashveer Singh',
              html: senderConfirmationHtml(safeName, safeMessage),
            }),
            // Notification to owner
            transporter.sendMail({
              from: `"Portfolio Alert" <${senderEmail}>`,
              to: recipientEmail,
              subject: `🔔 New Contact: ${safeName}`,
              html: ownerNotificationHtml(safeName, safeEmail, safeMessage),
            }),
          ]);
          console.log(`✉️ Emails sent via SMTP to ${safeEmail} and owner`);
        }
      } catch (emailErr) {
        console.error('⚠️ Email send failed:', emailErr);
      }
    } else {
      console.warn('⚠️ Email credentials not configured — emails skipped');
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
