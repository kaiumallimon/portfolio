"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, Calendar, Clock, User, MapPin, BookOpen, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { MdWarning } from "react-icons/md";

interface Course {
  course_code: string;
  course_title: string;
  time: string;
}

interface Exam {
  course_code: string;
  section: string;
  exam_date: string;
  exam_time: string;
  teacher: string;
  room: string;
  room_detail: string;
  csv_course_code: string;
}

interface Profile {
  name: string;
  student_id: string;
  image_url: string;
  blood_group: string;
  dob: string;
}

interface ExamRoutineResponse {
  profile: Profile;
  routine: Record<string, Course[]>;
  exams: Exam[];
}

const SkeletonCard = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-pulse">
    <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-white/10 rounded w-full"></div>
      <div className="h-4 bg-white/10 rounded w-5/6"></div>
      <div className="h-4 bg-white/10 rounded w-4/6"></div>
    </div>
  </div>
);

export default function UIUExamRoutinePage() {
  const [routineResponse, setRoutineResponse] = useState<ExamRoutineResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentID, setStudentID] = useState("");
  const [password, setPassword] = useState("");
  const [imageError, setImageError] = useState(false);
  const [snapshotMode, setSnapshotMode] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!studentID.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tools/uiu-exam-routine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: studentID,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch exam routine. Please check your credentials.");
      }

      const data: ExamRoutineResponse = await response.json();

      setRoutineResponse(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleDownload = async () => {
    if (!statsRef.current) {
      console.error("Stats ref is not available");
      return;
    }

    setDownloading(true);
    try {
      console.log("Starting download process...");
      console.log("Stats ref element:", statsRef.current);

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Enable snapshot mode to replace images with initials
      setSnapshotMode(true);
      // Wait a tick for UI to update
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log("Converting to PNG...");
      const dataUrl = await toPng(statsRef.current, {
        cacheBust: true,
        backgroundColor: "#1a1a1a",
        pixelRatio: 2,
        quality: 1,
        filter: (node) => {
          return !node.classList?.contains('hidden');
        }
      });

      console.log("PNG generated, downloading...");
      const link = document.createElement("a");
      link.download = `uiu-exam-routine-${studentID}.png`;
      link.href = dataUrl;
      link.click();
      console.log("Download triggered");
    } catch (err) {
      console.error("Failed to download image:", err);
      console.error("Error type:", typeof err);
      console.error("Error message:", err instanceof Error ? err.message : "Unknown error");
      console.error("Error stack:", err instanceof Error ? err.stack : "No stack");
      setError("Failed to generate image. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      // Restore normal mode
      setSnapshotMode(false);
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white/8 backdrop-blur-sm text-white">
      <div className="max-w-5xl mx-auto pt-24 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Page Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
                UIU Exam Routine Finder
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-sm md:text-base mx-auto"
            >
              Find and download your exam routines quickly and easily as a United International University student. Just login with your UCAM student ID and password to access your personalized exam schedule.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-xs border flex flex-col gap-3 items-center justify-center max-w-sm mx-auto px-3 py-3 rounded-lg border-border text-primary/75"
            >
              <MdWarning className="w-5 h-5 text-yellow-400" />
              <p>Currently Only SOSE (BSCSE, BSDS, BSEEE and BSCE) is supported!</p>
            </motion.div>
          </div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-end gap-3 max-w-md mx-auto mb-16"
          >
            <div className="w-full">
              <label htmlFor="studentID" className="block text-white/70 text-sm mb-2">
                Student ID
              </label>
              <Input
                id="studentID"
                type="text"
                value={studentID}
                onChange={(e) => setStudentID(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Student ID"
                disabled={loading}
              />
            </div>
            <div className="w-full">
              <label htmlFor="password" className="block text-white/70 text-sm mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Password"
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={loading || !studentID.trim() || !password.trim()}
              className="px-6 whitespace-nowrap"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  <span className="inline ">Load</span>
                </>
              )}
            </Button>
          </motion.div>

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

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-white/10 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-white/10 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-1/4"></div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
            </div>
          )}

          {/* Results */}
          <AnimatePresence mode="wait">
            {routineResponse && (
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
                <div
                  ref={statsRef}
                  className={`space-y-6 bg-[#1a1a1a] p-3 md:p-6 rounded-2xl ${snapshotMode ? "min-w-5xl" : ""}`}
                >
                {/* Profile Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 md:p-6"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                    <div className="relative shrink-0">
                      {routineResponse.profile.image_url && !imageError && !snapshotMode ? (
                        <img
                          src={routineResponse.profile.image_url}
                          alt={routineResponse.profile.name}
                          width={64}
                          height={64}
                          className="rounded-full border-2 border-white/20 shadow-xl w-16 h-16 md:w-24 md:h-24 object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-white/20 shadow-xl bg-linear-to-br from-orange-500 to-purple-600 flex items-center justify-center text-white text-xl md:text-3xl font-bold">
                          {routineResponse.profile.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl md:text-3xl font-bold mb-1 truncate">
                        {routineResponse.profile.name}
                      </h2>
                      <p className="text-white/60 text-xs md:text-sm">ID: {routineResponse.profile.student_id}</p>
                      {routineResponse.profile.blood_group && (
                        <p className="text-white/60 text-xs md:text-sm">Blood Group: {routineResponse.profile.blood_group}</p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Exams Section */}
                {routineResponse.exams && routineResponse.exams.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
                  >
                    <div className="p-4 md:p-6 border-b border-white/10">
                      <h3 className="text-base md:text-lg font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                        Upcoming Exams
                      </h3>
                    </div>
                    <Table containerClassName={snapshotMode ? "overflow-visible" : undefined}>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableHead className="text-white/70 py-4 px-4">Course</TableHead>
                          <TableHead className="text-white/70 py-4 px-4">Section</TableHead>
                          <TableHead className="text-white/70 py-4 px-4">Date</TableHead>
                          <TableHead className="text-white/70 py-4 px-4">Time</TableHead>
                          <TableHead className="text-white/70 py-4 px-4">Teacher</TableHead>
                          <TableHead className="text-white/70 py-4 px-4">Room</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {routineResponse.exams.map((exam, index) => (
                          <TableRow key={index} className="border-white/10 hover:bg-white/5">
                            <TableCell className="font-semibold text-white py-4 px-4">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-orange-500" />
                                {exam.course_code}
                              </div>
                            </TableCell>
                            <TableCell className="text-white/80 py-4 px-4">
                              <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">
                                {exam.section}
                              </span>
                            </TableCell>
                            <TableCell className="text-white/80 py-4 px-4">{exam.exam_date}</TableCell>
                            <TableCell className="text-white/80 py-4 px-4">{exam.exam_time}</TableCell>
                            <TableCell className="text-white/80 py-4 px-4">{exam.teacher}</TableCell>
                            <TableCell className="text-white/80 text-xs py-4 px-4 whitespace-pre-wrap">
                              {exam.room_detail}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </motion.div>
                )}

                {/* Class Routine */}
                {routineResponse.routine && Object.keys(routineResponse.routine).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
                  >
                    <div className="p-4 md:p-6 border-b border-white/10">
                      <h3 className="text-base md:text-lg font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                        Class Routine
                      </h3>
                    </div>
                    <Table containerClassName={snapshotMode ? "overflow-visible" : undefined}>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableHead className="text-white/70">Day</TableHead>
                          <TableHead className="text-white/70">Course Code</TableHead>
                          <TableHead className="text-white/70">Course Title</TableHead>
                          <TableHead className="text-white/70">Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(routineResponse.routine).flatMap(([day, courses]) =>
                          courses.map((course, index) => (
                            <TableRow key={`${day}-${index}`} className="border-white/10 hover:bg-white/5">
                              {index === 0 && (
                                <TableCell
                                  rowSpan={courses.length}
                                  className="font-bold text-orange-400 align-top"
                                >
                                  {day}
                                </TableCell>
                              )}
                              <TableCell className="font-semibold text-white">{course.course_code}</TableCell>
                              <TableCell className="text-white/80">{course.course_title}</TableCell>
                              <TableCell className="text-orange-400 font-medium">{course.time}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </motion.div>
                )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
