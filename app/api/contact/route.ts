import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getServerSupabase } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    // Persist the message (best-effort; never block the email send).
    try {
      const supabase = getServerSupabase();
      await supabase.from('contact_messages').insert({ name, email, message });
    } catch (dbErr) {
      console.error('Failed to store contact message:', dbErr);
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_TO } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      return NextResponse.json({ error: 'SMTP configuration missing' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const safe = (v?: string) => (v ?? '').trim();
    const timestamp = new Date().toLocaleString();

    const html = `
      <div style="font-family: Arial, sans-serif; background:#f9f9f9; padding:24px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <div style="padding:20px; border-bottom:1px solid #eee;">
            <h2 style="margin:0; font-size:20px; color:#333;">New Contact Message</h2>
            <p style="margin:4px 0 0; font-size:12px; color:#888;">${timestamp}</p>
          </div>
          <div style="padding:20px; color:#333; font-size:14px; line-height:1.5;">
            <p><strong>From:</strong> ${safe(name) || '-'}</p>
            <p><strong>Email:</strong> <a href="mailto:${safe(email)}" style="color:#1a73e8; text-decoration:none;">${safe(email)}</a></p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background:#f5f5f5; padding:12px; border-radius:4px;">${safe(message)}</p>
          </div>
          <div style="padding:12px 20px; font-size:12px; color:#aaa; border-top:1px solid #eee; text-align:center;">
            Sent from portfolio contact page
          </div>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Contact form submission" <${SMTP_USER}>`,
      to: SMTP_TO || SMTP_USER,
      replyTo: email,
      subject: `New message from ${safe(name) || 'Unknown'} via portfolio contact form`,
      text: `${safe(name)} <${safe(email)}> says:\n\n${safe(message)}`,
      html,
    });

    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
