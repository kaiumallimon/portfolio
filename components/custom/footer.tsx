"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const socialLinks = [
    { name: "Facebook", href: "https://facebook.com/kaiumallimon", icon: <FaFacebook /> },
    { name: "LinkedIn", href: "https://linkedin.com/in/kaiumallimon", icon: <FaLinkedin /> },
    { name: "Instagram", href: "https://instagram.com/kaiumallimon", icon: <FaInstagram /> },
    { name: "GitHub", href: "https://github.com/kaiumallimon", icon: <FaGithub /> },
  ];

  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Time: HH:MM:SS AM/PM
      const time = now.toLocaleTimeString("en-US", { hour12: true });

      // Date: Month Day, Year
      const date = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

      setCurrentTime(`${time} · ${date}`);
    };

    updateTime(); // initial call
    const interval = setInterval(updateTime, 1000); // every second

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="hidden md:flex w-full border-t backdrop-blur-sm bg-white/8 z-20 px-6 py-2 justify-between items-center">

      {/* Social links */}
      <div className="flex flex-row items-center gap-6">
        {socialLinks.map((nav) => (
          <Link
            key={nav.name}
            href={nav.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors duration-300"
          >
            {nav.icon}
            <span>{nav.name}</span>
          </Link>
        ))}
      </div>

      {/* Real-time date & time */}
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground">{currentTime}</p>
      </div>

    </footer>
  );
}
