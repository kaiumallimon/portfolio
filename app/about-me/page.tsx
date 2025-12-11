"use client";

import Image from "next/image";
import { MdOutlineEmail } from "react-icons/md";
import ToolsetGrid from "@/components/custom/dev-toolset";
import { GitHubCalendar } from "react-github-calendar";
import { Card, CardContent } from "@/components/ui/card";
import EducationSection from "@/components/custom/education-section";
import HobbiesSection from "@/components/custom/hobbies";
import { motion } from "framer-motion";

export default function AboutMePage() {
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
    <div className="w-full bg-white/8 backdrop-blur-sm">
      {/* Two-column layout */}
      <motion.div
        className="flex flex-col-reverse md:flex-row max-w-7xl mx-auto pt-10 md:pt-20 pb-10"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        {/* Left sided content */}
        <motion.div className="md:flex-1 px-4" variants={fadeUp}>
          <p className="text-lg md:text-2xl font-bold">Hello there!</p>
          <p className="text-sm md:text-base text-muted-foreground mt-4 ">
            I'm Kaium Al Limon, a Computer Science & Engineering student at United International University (UIU) and a Full-Stack Cross-Platform Mobile & Web Developer. I mainly use Flutter & Next.js to build innovative, high-quality mobile and web applications. I specialize in creating seamless user experiences backed by scalable, efficient architectures. I'm passionate about technology and continuously learning to improve my skills to craft future ready solutions.
          </p>
          <p className="text-sm md:text-base text-muted-foreground mt-4 ">
            My interest in technology started when I was a kid, and it had guided me towards a career in software development. I love the challenge of solving complex problems and the satisfaction of creating innovative solutions that make a difference in people's lives. I'm improving my skills continuously to stay at the forefront of the industry and deliver cutting-edge solutions.
          </p>
          <p className="text-sm md:text-base text-muted-foreground mt-4 ">
            I'm always looking for opportunities to grow, whether it's through projects or working with others who share my passion for technology. I believe in teamwork, problem-solving and creating apps that make life easier.
          </p>

          <div className="mt-8">
            <p className="text-lg md:text-2xl font-bold">Soft Skills</p>
            <p className="text-sm md:text-base text-muted-foreground mt-2 ">Certain skills I've picked along the way that deserve mentioning:</p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground text-sm md:text-base">
              <li className="">Strong problem-solving abilities, able to analyze complex issues and develop effective solutions.</li>
              <li className="">Excellent communication skills, both written and verbal, enabling effective collaboration with team members and stakeholders.</li>
              <li className="">Adaptability and flexibility, able to thrive in dynamic environments and quickly learn new technologies and methodologies.</li>
              <li className="">Time management and organizational skills, able to prioritize tasks and meet deadlines efficiently.</li>
              <li className="">Team player mentality, fostering a collaborative work environment and contributing positively to team dynamics.</li>
            </ul>
          </div>
        </motion.div>

        {/* Right sided content */}
        <motion.div className="md:flex-1 mx-auto mb-8 flex flex-col space-y-4 justify-start items-center" variants={fadeUpShort}>
          <Image
            src="/IMG_7311~2.png"
            alt="Profile Picture"
            width={300}
            height={300}
            style={{ objectFit: "cover" }}
            className="border-2 border-muted-foreground hover:border-white rounded-xl transition-all duration-300"
          />

          <div className="flex flex-row w-[300px] items-center space-x-3 border-2 px-5 py-2 rounded-md hover:bg-white transition-all duration-300 cursor-pointer text-muted-foreground hover:text-black">
            <MdOutlineEmail className="w-6 h-6" />
            <span className="ml-2 text-sm">kalimon291@gmail.com</span>
          </div>
        </motion.div>
      </motion.div>



      <motion.div
        className="items-center justify-center max-w-7xl py-10 mx-auto"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <motion.h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-white" variants={fadeUp}>
          My Github Contributions
        </motion.h2>

        <motion.div className="flex flex-row items-center justify-center" variants={fadeUpShort}>
          <Card className="bg-transparent mt-5 text-white px-5 overflow-x-auto mx-4">
            <CardContent className="">
              <div className="w-full min-w-[300px]">
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="w-full min-w-[300px]">
                    <GitHubCalendar
                      username="kaiumallimon"
                      showColorLegend
                      showMonthLabels
                      showTotalCount
                      showWeekdayLabels
                      colorScheme="light"
                      weekStart={6}
                      tooltips={{
                        activity: {
                          text: (activity) => {
                            const count = activity?.count ?? 0;
                            const date = activity?.date ?? "unknown date";
                            return count === 0
                              ? `No contributions on ${date}`
                              : `${count} contribution${count > 1 ? "s" : ""} on ${date}`;
                          },
                        },
                        colorLegend: {
                          text: (level) => `Contribution level: ${level}`,
                        },
                      }}
                    />
                  </div>

                  <style jsx global>{`
    .react-calendar-activity-tooltip {
      background-color: rgba(0, 0, 0, 0.85) !important;
      color: #fff !important;
      padding: 0.3rem 0.6rem !important;
      border-radius: 0.4rem !important;
      font-size: 0.75rem !important;
      pointer-events: none;
    }
  `}</style>
                </CardContent>

              </div>
            </CardContent>

          </Card>
        </motion.div>
      </motion.div>

      {/* Full-width ToolsetGrid */}
      <motion.div
        className="w-full py-7"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
      >
        <motion.div className="max-w-7xl mx-auto px-4" variants={fadeUp}>
          <ToolsetGrid />
        </motion.div>
      </motion.div>

      <motion.div
        className="w-full py-7"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
      >
        <motion.div className="max-w-7xl mx-auto px-4" variants={fadeUp}>
          <EducationSection />
        </motion.div>
      </motion.div>

      <motion.div
        className="w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
      >
        <motion.div className="max-w-7xl mx-auto px-4" variants={fadeUp}>
          <HobbiesSection />
        </motion.div>
      </motion.div>

    </div>
  );
}
