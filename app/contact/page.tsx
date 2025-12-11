"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MdEmail, MdOutlineEmail, MdWhatsapp } from "react-icons/md";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setStatus(null);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, subject, message }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Failed to send");
            setStatus("Email sent successfully.");
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
        } catch (e: any) {
            setStatus(e.message || "Failed to send email");
        } finally {
            setSending(false);
        }
    };

    const handleSendWhatsApp = () => {
        const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
        const text = encodeURIComponent(
            [
                subject && `Subject: ${subject}`,
                name && `Name: ${name}`,
                email && `Email: ${email}`,
                message && `Message: ${message}`,
            ]
                .filter(Boolean)
                .join("\n")
        );
        const url = `https://wa.me/${phone}?text=${text}`;
        window.open(url, "_blank");
    };

    return (
        <div className="min-h-screen w-full bg-white/8 backdrop-blur-sm text-white">
            <div className="max-w-3xl mx-auto pt-24 pb-16 px-6">
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-4 text-center">Contact</h1>
                <p className="text-center text-white/70 mb-10">
                    Send an email directly or reach me via WhatsApp.
                </p>

                <form onSubmit={handleSubmit} className="rounded-2xl border border-white/12 bg-black/10 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm text-white/70 mb-2" htmlFor="name">Name</label>
                            <input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border border-white/12 bg-black/20 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                                placeholder="Your name"
                                type="text"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-white/70 mb-2" htmlFor="email">Email</label>
                            <input
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-white/12 bg-black/20 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                                placeholder="you@example.com"
                                type="email"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-sm text-white/70 mb-2 block" htmlFor="subject">Subject</label>
                        <input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full rounded-lg border border-white/12 bg-black/20 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                            placeholder="Subject"
                            type="text"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="text-sm text-white/70 mb-2 block" htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={6}
                            className="w-full rounded-lg border border-white/12 bg-black/20 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                            placeholder="Write your message..."
                        />
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                        <Button
                            type="submit"
                            disabled={sending}
                            variant="default"
                            className="flex-1 rounded-lg border border-white/12  px-4 py-3 hover:scale-[1.01] transition-transform"
                        >
                            <MdOutlineEmail className="w-7 h-7 mr-2" />
                            {sending ? "Sending..." : "Send Email"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleSendWhatsApp}
                            className="flex-1 rounded-lg border border-white/12 px-4 py-3 text-white hover:scale-[1.01] transition-transform"
                        >
                            <MdWhatsapp className="w-7 h-7 mr-2" />
                            Send WhatsApp Message
                        </Button>
                    </div>

                    {status && (
                        <div className="mt-4  p-3 text-center text-white/80">
                            {status}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}