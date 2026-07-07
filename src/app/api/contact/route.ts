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
  <div style="background-color: #f6f9fc; padding: 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; margin: 0 auto;">
      <tr>
        <td style="padding: 40px; text-align: center; border-bottom: 1px solid #e2e8f0;">
          <h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Message Received</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 40px;">
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Hi <strong>\${name}</strong>,
          </p>
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Thank you for reaching out. I have received your message and will get back to you shortly. For your records, here is a copy of what you sent:
          </p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
            <p style="color: #475569; font-size: 15px; margin: 0; line-height: 1.6; white-space: pre-wrap; font-style: italic;">"\${message}"</p>
          </div>
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <a href="https://yashveersingh.xyz" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin-right: 10px;">
                  View Portfolio
                </a>
                <a href="https://www.linkedin.com/in/yashveer-singh-41bb36280" style="display: inline-block; background-color: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                  Connect on LinkedIn
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #64748b; font-size: 14px;">Best regards,</p>
          <p style="margin: 5px 0 0 0; color: #0f172a; font-size: 16px; font-weight: 600;">Yashveer Singh</p>
          <p style="margin: 20px 0 0 0; color: #94a3b8; font-size: 12px;">This is an automated email from <a href="https://yashveersingh.xyz" style="color: #3b82f6; text-decoration: none;">yashveersingh.xyz</a>.</p>
        </td>
      </tr>
    </table>
  </div>\`;
}

function ownerNotificationHtml(name: string, email: string, message: string) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return \`
  <div style="background-color: #f6f9fc; padding: 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; margin: 0 auto;">
      <tr>
        <td style="padding: 40px; text-align: center; border-bottom: 1px solid #e2e8f0; background-color: #f8fafc; border-radius: 8px 8px 0 0;">
          <h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">New Portfolio Inquiry</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 8px; margin-bottom: 0;">\${timestamp} IST</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 30px;">
            <tr>
              <td style="padding: 15px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; width: 120px;">Name</td>
              <td style="padding: 15px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 16px; font-weight: 500;">\${name}</td>
            </tr>
            <tr>
              <td style="padding: 15px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Email</td>
              <td style="padding: 15px 0; border-bottom: 1px solid #e2e8f0; color: #3b82f6; font-size: 16px; font-weight: 500;">
                <a href="mailto:\${email}" style="color: #3b82f6; text-decoration: none;">\${email}</a>
              </td>
            </tr>
          </table>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Message Content</p>
            <p style="color: #334155; font-size: 15px; margin: 0; line-height: 1.6; white-space: pre-wrap;">\${message}</p>
          </div>
          
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <a href="mailto:\${email}?subject=Re: Portfolio Inquiry&body=Hi \${encodeURIComponent(name)}," style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
                  Reply to \${name}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>\`;
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
