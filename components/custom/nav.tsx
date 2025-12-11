"use client";

import { MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaFacebook, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const navs = [
        { name: "#about_me", href: "/about-me" },
        { name: "#projects", href: "/projects" },
        { name: "#achievements", href: "/achievements" },
        // { name: "#articles", href: "/articles" },
        { name: "#contact", href: "/contact" },
        
    ];

    const socialLinks = [
        {
            name: "Facebook",
            href: "https://facebook.com/kaiumallimon",
            icon: <FaFacebook className="inline-block mr-2" />
        },
        {
            name: "LinkedIn",
            href: "https://linkedin.com/in/kaiumallimon",
            icon: <FaLinkedin className="inline-block mr-2" />
        },
        {
            name: "Instagram",
            href: "https://instagram.com/kaiumallimon",
            icon: <FaInstagram className="inline-block mr-2" />
        },
        {
            name: "GitHub",
            href: "https://github.com/kaiumallimon",
            icon: <FaGithub className="inline-block mr-2" />
        }
    ];


    const mobileNavs = [
        { name: "#home", href: "/" },
        ...navs,
    ];

    function isActive(path: string) {
        return pathname === path;
    }

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);

    return (
        <>
            {/* Top Navbar */}
            <nav className="z-20 flex border-b justify-between lg:justify-start backdrop-blur-sm bg-white/8">
                <Link
                    href="/"
                    className="font-bold items-center text-accent-foreground lg:border-r px-4 lg:px-17 py-3 hover:bg-white hover:text-black transition-colors duration-300 "
                >
                    Kaium Al Limon
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex flex-row">
                    {navs.map((nav) => (
                        <Link
                            key={nav.name}
                            href={nav.href}
                            className={`text-muted-foreground border-r px-6 py-3 hover:bg-white hover:text-black transition-colors duration-300 ${isActive(nav.href) ? "border-b-2 border-b-white bg-white/10" : ""
                                }`}
                        >
                            {nav.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setOpen(true)}
                    className="flex border-l lg:hidden items-center hover:bg-white/15"
                >
                    <MenuIcon className="w-6 h-6 m-3 text-muted-foreground" />
                </button>
            </nav>

            {/* Mobile Drawer Backdrop */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-80 lg:hidden"
                />
            )}

            {/* Mobile Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white/10 backdrop-blur-sm border-r z-90 transform lg:hidden transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-4 border-b">
                    <span className="text-lg font-semibold">Menu</span>
                    <button onClick={() => setOpen(false)}>
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Nav Items */}
                <div className="flex flex-col justify-between h-full">
                    {/* Navigation items */}
                    <div className="flex flex-col">
                        {mobileNavs.map((nav) => (
                            <Link
                                key={nav.name}
                                href={nav.href}
                                onClick={() => setOpen(false)}
                                className={`px-6 py-4 border-b text-muted-foreground hover:bg-white/15 ${isActive(nav.href) ? "border-b-2 border-b-white bg-white/15" : ""
                                    }`}
                            >
                                {nav.name}
                            </Link>
                        ))}
                    </div>

                    {/* Social icons at bottom */}
                    <div className="flex justify-center gap-4 px-6 py-4 border-t">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-white"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
}
