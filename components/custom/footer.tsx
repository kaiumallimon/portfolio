import { icons } from "lucide-react";
import Link from "next/link";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
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
        }
    ];

    const githubLink = {
        name: "GitHub",
        href: "https://github.com/kaiumallimon",
        icon: <FaGithub className="inline-block mr-2" />
    };


    return (
        <footer className="flex-none w-full border-t z-20 flex border-b justify-between md:justify-start backdrop-blur-lg bg-white/8 ">

            <div className="hidden md:flex flex-row">
                {socialLinks.map((nav) => (
                    <Link
                        key={nav.name}
                        href={nav.href}
                        className={`text-muted-foreground border-r px-6 py-3 hover:bg-white/15 transition-colors duration-300`}
                    >
                        {nav.icon}
                        {nav.name}
                    </Link>
                ))}
            </div>
            <div className="hidden md:flex flex-row ml-auto">
                <Link
                    key={githubLink.name}
                    href={githubLink.href}
                    className={`text-muted-foreground border-r px-6 py-3 hover:bg-white/15 border-l transition-colors duration-300`}
                >
                    {githubLink.icon}
                    {githubLink.name}
                </Link>
            </div>
        </footer>
    );
}