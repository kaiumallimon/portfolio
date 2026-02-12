"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search, Loader2, Github, Trophy, Zap, Crown, Calendar, BarChart3, Star, Rocket, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import HomeBackground from "@/components/shared/home-color-bend";
import FloatingHeader from "@/components/shared/header";
import TargetCursor from "@/components/TargetCursor";
import Footer from "@/components/custom-new/footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface GitHubStats {
  user: {
    login: string;
    name: string;
    avatar_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
  };
  stats: {
    totalContributions: number;
    totalStars: number;
    totalRepos: number;
    topLanguage: string;
    longestStreak: number;
    mostActiveDay: string;
    mostActiveMonth: string;
    universalRank: string;
    powerLevel: string;
  };
  contributionDays: Array<{
    date: string;
    count: number;
    level: number;
  }>;
  languageDistribution: Record<string, number>;
}

export default function GithubUnwrappedPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GitHubStats | null>(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch(`/api/github/${username.trim()}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError("Failed to fetch GitHub data. Please check the username and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!statsRef.current) return;

    setDownloading(true);
    try {
      // Wait for images to load before capturing
      await new Promise(resolve => setTimeout(resolve, 500));

      const dataUrl = await toPng(statsRef.current, {
        cacheBust: true,
        backgroundColor: "#1a1a1a",
        pixelRatio: 2,
        skipFonts: true,
      });

      const link = document.createElement("a");
      link.download = `github-unwrapped-${username}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download image:", err);
    } finally {
      setDownloading(false);
    }
  };

  const statCards = data
    ? [
        {
          icon: Crown,
          label: "Universal Rank",
          value: data.stats.universalRank,
          valueColor: "text-yellow-400",
          iconColor: "text-yellow-500",
        },
        {
          icon: Zap,
          label: "Longest Streak",
          value: `${data.stats.longestStreak} days`,
          valueColor: "text-purple-400",
          iconColor: "text-purple-500",
        },
        {
          icon: Trophy,
          label: "Total Commits",
          value: data.stats.totalContributions.toLocaleString(),
          valueColor: "text-cyan-400",
          iconColor: "text-cyan-500",
        },
        {
          icon: Calendar,
          label: "Most Active Month",
          value: data.stats.mostActiveMonth,
          valueColor: "text-orange-400",
          iconColor: "text-orange-500",
        },
        {
          icon: BarChart3,
          label: "Most Active Day",
          value: data.stats.mostActiveDay,
          valueColor: "text-blue-400",
          iconColor: "text-blue-500",
        },
        {
          icon: Star,
          label: "Stars Earned",
          value: data.stats.totalStars.toLocaleString(),
          valueColor: "text-yellow-300",
          iconColor: "text-yellow-400",
        },
        {
          icon: Rocket,
          label: "Top Language",
          value: data.stats.topLanguage,
          valueColor: "text-pink-400",
          iconColor: "text-pink-500",
        },
        {
          icon: Zap,
          label: "Power Level",
          value: data.stats.powerLevel,
          valueColor: "text-cyan-300",
          iconColor: "text-cyan-400",
        },
      ]
    : [];

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-300">
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      />
      <HomeBackground />
      <FloatingHeader />
      <div className="max-w-5xl mx-auto py-38 px-6 relative">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-slate-400 hover:text-white">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/tools" className="text-slate-400 hover:text-white">Tools</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">GitHub Unwrapped</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
                GitHub Unwrapped
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-sm md:text-base mx-auto"
            >
              Visualize your coding journey with beautiful insights, contribution patterns, and achievements
            </motion.p>
          </div>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="flex items-center gap-3 max-w-md mx-auto mb-16"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username"
                className="w-full h-10 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-white placeholder:text-white/40"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !username.trim()}
              className="h-10 px-6 rounded-lg"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Search</span>
                </>
              )}
            </Button>
          </motion.form>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence mode="wait">
            {data && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Download Button */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="flex justify-end"
                >
                  <Button
                    onClick={handleDownload}
                    disabled={downloading}
                    variant="outline"
                    className="gap-2 text-xs md:text-sm"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                        <span className="hidden sm:inline">Generating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Download as Image</span>
                        <span className="sm:hidden">Download</span>
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Stats Container */}
                <div ref={statsRef} className="space-y-4 md:space-y-6 bg-[#1a1a1a] p-3 md:p-6 rounded-2xl">
                  {/* Profile Header Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 md:p-6"
                  >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                    <div className="relative shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={data.user.avatar_url}
                        alt={data.user.name || data.user.login}
                        width={64}
                        height={64}
                        className="rounded-full border-2 border-white/20 shadow-xl md:w-24 md:h-24"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl md:text-3xl font-bold mb-1 truncate">
                        @{data.user.login}
                      </h2>
                      <p className="text-purple-400 text-xs md:text-base font-medium mb-2">
                        Past Year in Code (Public Data Only)
                      </p>
                      {data.user.bio && (
                        <p className="text-white/60 text-xs md:text-sm max-w-xl line-clamp-2">
                          {data.user.bio}
                        </p>
                      )}
                      <div className="flex md:hidden gap-6 mt-3 text-sm">
                        <div>
                          <div className="text-lg font-bold text-white">
                            {data.user.public_repos}
                          </div>
                          <div className="text-white/50 text-xs">Repos</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">
                            {data.user.followers}
                          </div>
                          <div className="text-white/50 text-xs">Followers</div>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:flex flex-col gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {data.user.public_repos}
                        </div>
                        <div className="text-white/50">Repos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {data.user.followers}
                        </div>
                        <div className="text-white/50">Followers</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Contribution Graph */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <div className="p-4 md:p-8 pb-3 md:pb-4">
                    <h3 className="text-base md:text-lg font-semibold mb-1">
                      Contribution Activity
                    </h3>
                    <p className="text-white/60 text-xs md:text-sm">
                      {data.stats.totalContributions.toLocaleString()} contributions in the last year
                    </p>
                  </div>

                  <div className="overflow-x-auto px-4 md:px-8">
                    <div className="inline-flex gap-0.5 md:gap-0.5 min-w-[600px] md:min-w-0 md:w-full">
                      {Array.from({ length: 53 }).map((_, weekIdx) => (
                        <div key={weekIdx} className="flex flex-col gap-0.5 flex-1">
                          {Array.from({ length: 7 }).map((_, dayIdx) => {
                            const dayData =
                              data.contributionDays[weekIdx * 7 + dayIdx];
                            if (!dayData) return null;

                            return (
                              <motion.div
                                key={dayIdx}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                  delay: 0.3 + (weekIdx * 7 + dayIdx) * 0.001,
                                  duration: 0.2,
                                }}
                                className={`w-full aspect-square rounded-sm transition-all hover:scale-125 hover:ring-2 hover:ring-white/30 ${
                                  dayData.level === 0
                                    ? "bg-white/10"
                                    : dayData.level === 1
                                    ? "bg-green-900/60"
                                    : dayData.level === 2
                                    ? "bg-green-600/70"
                                    : dayData.level === 3
                                    ? "bg-green-500/85"
                                    : "bg-green-400"
                                }`}
                                title={`${dayData.date}: ${dayData.count} contributions`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-4 md:px-8 py-3 md:py-4 text-[10px] md:text-xs text-white/50">
                    <span>Less</span>
                    <div className="flex gap-0.5 md:gap-1">
                      {[0, 1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`w-3 h-3 rounded-sm ${
                            level === 0
                              ? "bg-white/10"
                              : level === 1
                              ? "bg-green-900/60"
                              : level === 2
                              ? "bg-green-600/70"
                              : level === 3
                              ? "bg-green-500/85"
                              : "bg-green-400"
                          }`}
                        />
                      ))}
                    </div>
                    <span>More</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative overflow-hidden px-1"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-base md:text-lg font-semibold">Statistics Overview <span className="text-muted-foreground text-xs md:text-base">(Approximate)</span></h3>
                  </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                  {statCards.map((card, idx) => {
                    const IconComponent = card.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="relative overflow-hidden rounded-xl md:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-3 md:p-5 group hover:scale-[1.02] transition-transform duration-200"
                      >
                        <div className="relative z-10">
                          <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                            <IconComponent className={`w-3 h-3 md:w-4 md:h-4 items-center ${card.iconColor}`} />
                            <span className="text-white/70 text-[9px] md:text-xs items-center uppercase tracking-wide leading-tight">
                              {card.label}
                            </span>
                          </div>
                          <div
                            className={`text-base md:text-2xl font-bold ${card.valueColor} leading-tight`}
                          >
                            {card.value}
                          </div>
                        </div>

                        {/* Subtle animated background */}
                        <div className="absolute inset-0 bg-white/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
