import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import AdminFontSyncer from "@/components/admin/font-syncer";

export const metadata: Metadata = {
  title: "Admin Dashboard | Kaium Al Limon",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
    },
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-admin-inter",
  display: "swap",
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.variable} ${inter.className}`}>
      <AdminFontSyncer fontFamily={inter.style.fontFamily} />
      {children}
    </div>
  );
}