import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getServerSupabase } from "@/lib/supabase/server";
import { findUserByEmail } from "@/lib/auth/admin-user";
import {
  generateResetToken,
  hashResetToken,
  resetTokenExpiry,
} from "@/lib/auth/reset-tokens";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email))) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const normalized = String(email).trim().toLowerCase();
    const supabase = getServerSupabase();

    // Resolve the user id without leaking existence.
    let userId: string | null = null;
    try {
      const found = await findUserByEmail(normalized);
      userId = found?.id ?? null;
    } catch {
      userId = null;
    }

    if (userId) {
      const token = generateResetToken();
      const tokenHash = hashResetToken(token);

      await supabase.from("password_resets").insert({
        email: normalized,
        token_hash: tokenHash,
        expires_at: resetTokenExpiry().toISOString(),
      });

      await sendResetEmail(normalized, token, req);
    }

    // Always succeed to avoid email enumeration.
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to request password reset" },
      { status: 500 },
    );
  }
}

async function sendResetEmail(email: string, token: string, req: Request) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn("[forgot-password] SMTP not configured — token generated but email not sent.");
    return;
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const link = `${base}/admin/login/reset?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; background:#0a0a0a; padding:32px;">
      <div style="max-width:520px; margin:auto; background:#0f172a; border:1px solid rgba(255,255,255,0.08); border-radius:16px; overflow:hidden;">
        <div style="padding:28px 28px 8px;">
          <h2 style="margin:0; font-size:22px; color:#fff;">Reset your password</h2>
          <p style="margin:8px 0 0; font-size:14px; color:#94a3b8;">We received a request to reset the password for your account.</p>
        </div>
        <div style="padding:16px 28px 28px;">
          <a href="${link}" style="display:inline-block; background:#6366f1; color:#fff; text-decoration:none; font-weight:600; font-size:15px; padding:12px 24px; border-radius:12px;">Set a new password</a>
          <p style="margin:20px 0 0; font-size:13px; color:#64748b; line-height:1.6;">
            This link expires in 1 hour and can only be used once. If you didn't request this, you can safely ignore this email.
          </p>
          <p style="margin:14px 0 0; font-size:12px; color:#475569; word-break:break-all;">Or paste this link: ${link}</p>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: SMTP_FROM || `"Portfolio" <${SMTP_USER}>`,
      to: email,
      subject: "Reset your password",
      text: `Reset your password by visiting: ${link}`,
      html,
    });
  } catch (mailErr) {
    console.error("[forgot-password] Email send failed:", mailErr);
  }
}
