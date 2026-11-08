import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Message } from "@/lib/models";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Save to MongoDB if connected
    try {
      await connectToDatabase();
      await Message.create({
        name,
        email,
        subject: subject || "Portfolio Contact",
        message,
        read: false,
      });
    } catch (dbErr) {
      console.warn("[Contact API] MongoDB save error (continuing with email):", dbErr);
    }

    // Send email via Nodemailer if configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 465,
          secure: Number(process.env.SMTP_PORT || 465) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"${name}" <${process.env.SMTP_USER}>`,
          replyTo: email,
          to: process.env.CONTACT_NOTIFICATION_EMAIL || process.env.SMTP_USER,
          subject: `[Portfolio Contact] ${subject || "New Message from " + name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });
      } catch (mailErr) {
        console.warn("[Contact API] SMTP send error:", mailErr);
      }
    }

    return NextResponse.json({ success: true, message: "Message received successfully." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error submitting contact form";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
