"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

interface VCardProps {
  name?: string;
  email?: string;
  title?: string;
  url?: string;
  location?: string;
}

export function VCardDownload({
  name = "Kaium Al Limon",
  email = "kaiumallimon@gmail.com",
  title = "Full-Stack & Design Engineer",
  url = "https://kaiumallimon.tech",
  location = "Dhaka, Bangladesh",
}: VCardProps) {
  const downloadVCard = () => {
    const vCardContent = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${name}`,
      `TITLE:${title}`,
      `EMAIL;TYPE=INTERNET,PREF:${email}`,
      `URL:${url}`,
      `ADR;TYPE=HOME:;;;${location};;;`,
      "NOTE:Full-Stack Cross-Platform Mobile & Web Developer",
      "END:VCARD",
    ].join("\r\n");

    const blob = new Blob([vCardContent], { type: "text/vcard;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", `${name.toLowerCase().replace(/\s+/g, "_")}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    toast.success("Contact card (.vcf) downloaded");
  };

  return (
    <button
      onClick={downloadVCard}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
      title="Download vCard contact"
    >
      <Download className="w-3.5 h-3.5" />
      <span>vCard</span>
    </button>
  );
}
