"use client";

import MagicBento from '@/components/MagicBento';
import { motion } from "framer-motion";

const achievements = [
    {
        title: "UIU CSE Project Show | Fall '24",
        award: "1st Runner-Up – Software Engineering Lab",
        date: "27 January 2025",
        project: "MediTouch",
        team: "Team Bcrypt",
        image: ["/software-lab.jpg", "/software-lab-2.jpg"],
    },
    {
        title: "UIU CSE Project Show | Summer '24",
        award: "Champion – System Analysis and Design ",
        date: "8 September 2024",
        project: "MediTouch",
        team: "Team Bcrypt",
        image: ["/sad-lab.png", "/sad-lab-2.jpg"],
    },
    {
        title: "UIU CSE Project Show | Spring '24",
        award: "1st Runner-Up – Database Management System (DBMS)",
        date: "3 June 2024",
        project: "Pharmabrew",
        team: "Team Bcrypt",
        image: ["/dbms-lab.png", "/dbms-lab-2.png"],
    },
    {
        title: "UIU CSE Project Show | Spring '23",
        award: "2nd Runner-Up – Advanced Object-Oriented Programming (AOOP) ",
        date: "3 May 2023",
        project: "Wayout",
        team: "Team Tripod",
        image: ["/aoop-lab.jpg", "/aoop-lab-2.jpg"],
    },
];

export default function AchievementsPage() {
    const container = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" as const },
        },
    };

    const fadeUpShort = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" as const },
        },
    };

    return (
        <div className="min-h-screen w-full bg-white/8 backdrop-blur-sm text-white">
            <motion.div
                className="max-w-7xl mx-auto pt-24 pb-16 px-6"
                initial="hidden"
                animate="visible"
                variants={container}
            >
                <motion.h1
                    className="text-2xl md:text-4xl font-extrabold text-center mb-4 tracking-tight"
                    variants={fadeUp}
                >
                    Achievements & Awards
                </motion.h1>
                <motion.p
                    className="text-center text-white/70 mb-10 max-w-2xl mx-auto"
                    variants={fadeUpShort}
                >
                    Celebrating the moments when hard work and creativity turned into recognition across university project showcases.
                </motion.p>

                <motion.div className="w-full" variants={fadeUpShort}>
                    <MagicBento
                        achievements={achievements}
                        enableSpotlight={true}
                        enableBorderGlow={true}
                        enableStars={true}
                        spotlightRadius={320}
                        particleCount={12}
                        enableTilt={true}
                        clickEffect={true}
                        glowColor={'176, 208, 255'}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}
