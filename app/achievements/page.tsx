const achievements = [
    {
        title: "UIU CSE Project Show | Fall '24",
        award: "🥈 1st Runner-Up – Software Engineering Lab",
        date: "27th January 2025",
        project: "MediTouch",
        team: "Team Bcrypt",
        image: "/achievements/fall24.jpg", // placeholder
    },
    {
        title: "UIU CSE Project Show | Summer '24",
        award: "🏆 Champion – System Analysis and Design Lab Course Project",
        date: "8th September 2024",
        project: "MediTouch",
        team: "Team Bcrypt",
        image: "/achievements/summer24.jpg", // placeholder
    },
    {
        title: "UIU CSE Project Show | Spring '24",
        award: [
            "🥈 1st Runner-Up – Database Management System (DBMS) Lab Course Project",
            "🥈 1st Runner-Up – DBMS Poster Presentation",
        ],
        date: "3rd June 2024",
        project: "Pharmabrew",
        team: "Team Bcrypt",
        image: "/achievements/spring24.jpg", // placeholder
    },
    {
        title: "UIU CSE Project Show | Spring '23",
        award: "🥉 2nd Runner-Up – Advanced Object-Oriented Programming (AOOP) Lab Course Project",
        date: "3rd May 2023",
        project: "Wayout",
        team: "Team Tripod",
        image: "/achievements/spring23.jpg", // placeholder
    },
];

export default function AchievementsPage() {
    return (
        <div className="min-h-screen w-full bg-white/8 backdrop-blur-sm overflow-x-hidden">
            <div className="flex flex-col max-w-7xl mx-auto pt-20 pb-10 px-4">
                <h1 className="text-4xl font-bold mb-10 text-white text-center">Achievements</h1>
                <div className="flex flex-col gap-10">
                    {achievements.map((ach, idx) => (
                        <div
                            key={ach.title + ach.date}
                            className={`flex flex-col md:flex-row items-center md:items-stretch bg-white/10 rounded-xl shadow-lg overflow-hidden border border-white/20 backdrop-blur-md transition hover:scale-[1.02] ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                        >
                            {/* Image placeholder */}
                              <div className="md:w-1/2 w-full h-72 md:h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-purple-500/30">
                                <img
                                    src={ach.image}
                                    alt={ach.title}
                                    className="object-cover w-full h-full max-h-80 opacity-60"
                                    style={{ filter: 'blur(2px)' }}
                                />
                                <span className="absolute text-white text-lg font-semibold opacity-80">Image coming soon</span>
                            </div>
                            {/* Text content */}
                            <div className="md:w-1/2 w-full p-6 flex flex-col justify-center">
                                <h2 className="text-2xl font-bold text-white mb-2">{ach.title}</h2>
                                {Array.isArray(ach.award) ? (
                                    <ul className="mb-2 list-disc list-inside text-white/90">
                                        {ach.award.map((a, i) => (
                                            <li key={i}>{a}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mb-2 text-white/90">{ach.award}</p>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                                    <span className="bg-white/20 px-3 py-1 rounded-full">{ach.date}</span>
                                    <span className="bg-white/20 px-3 py-1 rounded-full">{ach.project}</span>
                                    <span className="bg-white/20 px-3 py-1 rounded-full">{ach.team}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}