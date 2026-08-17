"use client";

import { IconTrash } from "@tabler/icons-react";
import FloatingHeader from "@/components/shared/header";
import HomeBackground from "@/components/shared/home-color-bend";
import TargetCursor from "@/components/TargetCursor";
import Footer from "@/components/custom-new/footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import { Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function UIUCGPACalculatorView() {
    const [downloading, setDownloading] = useState(false);
    const resultsRef = useRef<HTMLDivElement>(null);
    const [previousCGPA, setPreviousCGPA] = useState<number>(0.0);
    const [creditsCompleted, setCreditsCompleted] = useState<number>(0);

    const [courses, setCourses] = useState<
        Array<{ courseName: string; creditHours: number; gradePoint: number }>
    >([{ courseName: "", creditHours: 3, gradePoint: 0.0 }]);

    const grades = [
        { value: 4.0, label: "A" },
        { value: 3.67, label: "A-" },
        { value: 3.33, label: "B+" },
        { value: 3.0, label: "B" },
        { value: 2.67, label: "B-" },
        { value: 2.33, label: "C+" },
        { value: 2.0, label: "C" },
        { value: 1.67, label: "C-" },
        { value: 1.33, label: "D+" },
        { value: 1.0, label: "D" },
        { value: 0.0, label: "F" },
    ];

    const calculateCGPA = () => {
        let totalQualityPoints = previousCGPA * creditsCompleted;
        let totalCredits = creditsCompleted;

        courses.forEach((course) => {
            totalQualityPoints += course.gradePoint * course.creditHours;
            totalCredits += course.creditHours;
        });

        return totalCredits === 0 ? "0.00" : (totalQualityPoints / totalCredits).toFixed(2);
    };

    const calculateGPA = () => {
        let totalQualityPoints = 0;
        let totalCredits = 0;

        courses.forEach((course) => {
            totalQualityPoints += course.gradePoint * course.creditHours;
            totalCredits += course.creditHours;
        });

        return totalCredits === 0 ? "0.00" : (totalQualityPoints / totalCredits).toFixed(2);
    };

    const calculateCreditsCompleted = () => {
        let totalCredits = courses.reduce((sum, course) => sum + course.creditHours, 0);
        return totalCredits + creditsCompleted;
    };

    const handleAddCourse = () => {
        setCourses([...courses, { courseName: "", creditHours: 3, gradePoint: 0.0 }]);
    };

    const handleCourseChange = (
        index: number,
        field: keyof (typeof courses)[0],
        value: string | number
    ) => {
        const updatedCourses = [...courses];
        updatedCourses[index] = { ...updatedCourses[index], [field]: value };
        setCourses(updatedCourses);
    };

    const removeCourse = (index: number) => {
        if (courses.length > 1) {
            setCourses(courses.filter((_, i) => i !== index));
        }
    };

    const hasValidCourses = () => {
        return courses.some(course => course.courseName.trim() !== "" || course.gradePoint > 0);
    };

    const hasPreviousData = () => {
        return previousCGPA > 0 || creditsCompleted > 0;
    };

    const canDownload = () => {
        return hasValidCourses() || hasPreviousData();
    };

    const handleDownload = async () => {
        if (!resultsRef.current || !canDownload()) return;

        setDownloading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const dataUrl = await toPng(resultsRef.current, {
                cacheBust: true,
                backgroundColor: "#1e1b4b",
                pixelRatio: 2,
                skipFonts: true,
            });

            const link = document.createElement("a");
            link.download = `uiu-cgpa-results.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Failed to download image:", err);
        } finally {
            setDownloading(false);
        }
    };

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
                            <BreadcrumbLink href="/" className="text-slate-400 hover:text-white cursor-target">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/tools" className="text-slate-400 hover:text-white cursor-target">Tools</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-white">UIU CGPA Calculator</BreadcrumbPage>
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
                            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                                UIU CGPA Calculator
                            </h1>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/70 text-sm md:text-base mx-auto max-w-2xl"
                        >
                            Calculate your semester GPA and cumulative CGPA for United International University
                        </motion.p>
                    </div>

                    {/* Previous CGPA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                            <h3 className="text-lg font-semibold mb-4 text-white">Previous Academic Record</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-white/80">Previous CGPA</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="4"
                                        value={previousCGPA || ""}
                                        onWheel={(e) => e.currentTarget.blur()}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-indigo-500 focus:ring-indigo-500/20"
                                        placeholder="e.g. 3.75"
                                        onChange={(e) => setPreviousCGPA(parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white/80">Credits Completed</Label>
                                    <Input
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={creditsCompleted || ""}
                                        onWheel={(e) => e.currentTarget.blur()}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-indigo-500 focus:ring-indigo-500/20"
                                        placeholder="e.g. 90"
                                        onChange={(e) => setCreditsCompleted(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Current Semester Courses */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-8"
                    >
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                            <h3 className="text-lg font-semibold mb-4 text-white">Current Semester Courses</h3>

                            <div className="space-y-4">
                                {courses.map((course, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-4 rounded-xl bg-white/5 border border-white/10"
                                    >
                                        {/* Course Name */}
                                        <div className="sm:col-span-5 space-y-2">
                                            <Label className="text-white/80 text-sm">Course Name</Label>
                                            <Input
                                                type="text"
                                                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-indigo-500 focus:ring-indigo-500/20"
                                                placeholder="e.g. CSE 1111"
                                                value={course.courseName}
                                                onChange={(e) =>
                                                    handleCourseChange(index, "courseName", e.target.value)
                                                }
                                            />
                                        </div>

                                        {/* Credit Hours */}
                                        <div className="sm:col-span-2 space-y-2">
                                            <Label className="text-white/80 text-sm">Credits</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="6"
                                                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-indigo-500 focus:ring-indigo-500/20"
                                                placeholder="3"
                                                onWheel={(e) => e.currentTarget.blur()}
                                                value={course.creditHours || ""}
                                                onChange={(e) =>
                                                    handleCourseChange(
                                                        index,
                                                        "creditHours",
                                                        parseInt(e.target.value) || 0
                                                    )
                                                }
                                            />
                                        </div>

                                        {/* Grade Select */}
                                        <div className="sm:col-span-3 space-y-2">
                                            <Label className="text-white/80 text-sm">Grade</Label>
                                            <Select
                                                value={course.gradePoint.toFixed(2)}
                                                onValueChange={(value) =>
                                                    handleCourseChange(index, "gradePoint", parseFloat(value))
                                                }
                                            >
                                                <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-indigo-500 focus:ring-indigo-500/20">
                                                    <SelectValue placeholder="Select grade" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-white/20">
                                                    {grades.map((grade) => (
                                                        <SelectItem
                                                            key={grade.value}
                                                            value={grade.value.toFixed(2)}
                                                            className="text-white hover:bg-white/10 focus:bg-white/10"
                                                        >
                                                            {grade.label} ({grade.value.toFixed(2)})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Remove Button */}
                                        <div className="sm:col-span-2">
                                            <Button
                                                variant="destructive"
                                                onClick={() => removeCourse(index)}
                                                disabled={courses.length === 1}
                                                className="w-full flex justify-center items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/30 cursor-target"
                                            >
                                                <IconTrash className="h-4 w-4" />
                                                <span className="hidden sm:inline">Remove</span>
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Add Course Button */}
                                <Button
                                    onClick={handleAddCourse}
                                    className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white cursor-target"
                                >
                                    + Add Course
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Download Button */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="flex justify-end"
                    >
                        <Button
                            onClick={handleDownload}
                            disabled={downloading || !canDownload()}
                            variant="outline"
                            className="gap-2 text-xs md:text-sm mb-5 cursor-target"
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

                    {/* Results Section */}
                    <motion.div
                        ref={resultsRef}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-6 bg-[#1e1b4b] p-6 rounded-2xl"
                    >
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                            <h3 className="text-lg font-semibold mb-4 text-white">Results</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                    <p className="text-white/60 text-sm mb-2">Total Credits</p>
                                    <p className="text-3xl font-bold text-cyan-400">
                                        {calculateCreditsCompleted()}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                    <p className="text-white/60 text-sm mb-2">Semester GPA</p>
                                    <p className="text-3xl font-bold text-purple-400">
                                        {isNaN(Number(calculateGPA())) ? "N/A" : calculateGPA()}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                    <p className="text-white/60 text-sm mb-2">Cumulative CGPA</p>
                                    <p className="text-3xl font-bold text-indigo-400">
                                        {isNaN(Number(calculateCGPA())) ? "N/A" : calculateCGPA()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Previous Trimester Data */}
                        {hasPreviousData() && (
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                                <h3 className="text-lg font-semibold mb-4 text-white">Previous Academic Record</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-white/60 text-sm mb-2">Previous CGPA</p>
                                        <p className="text-2xl font-bold text-white">
                                            {previousCGPA.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-white/60 text-sm mb-2">Credits Completed</p>
                                        <p className="text-2xl font-bold text-white">
                                            {creditsCompleted}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Current Semester Courses */}
                        {hasValidCourses() && (
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                                <div className="p-4 md:p-6 border-b border-white/10">
                                    <h3 className="text-base md:text-lg font-semibold flex items-center gap-2 text-white">
                                        Current Semester Courses
                                    </h3>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/10 hover:bg-transparent">
                                            <TableHead className="text-white/70 py-4 px-4">Course Name</TableHead>
                                            <TableHead className="text-white/70 py-4 px-4 text-center">Credit Hours</TableHead>
                                            <TableHead className="text-white/70 py-4 px-4 text-center">Grade Point</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {courses.filter(course => course.courseName.trim() !== "" || course.gradePoint > 0).map((course, index) => (
                                            <TableRow key={index} className="border-white/10 hover:bg-white/5">
                                                <TableCell className="font-semibold text-white py-4 px-4">
                                                    {course.courseName || "Unnamed Course"}
                                                </TableCell>
                                                <TableCell className="text-white/80 py-4 px-4 text-center">
                                                    {course.creditHours}
                                                </TableCell>
                                                <TableCell className="text-white/80 py-4 px-4 text-center">
                                                    <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-sm">
                                                        {course.gradePoint.toFixed(2)} ({grades.find(g => g.value === course.gradePoint)?.label || "N/A"})
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
}
