import { AwardIcon, Book, GraduationCap, Award } from "lucide-react";
import { FaCertificate, FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { SiEducative } from "react-icons/si";

const education = [
  {
    degree: "B.Sc. in Computer Science & Engineering",
    institution: "United International University",
    period: "2022 — Present",
    description: "Specializing in full-stack development, system design, and cloud technologies.",
    icon: GraduationCap,
    status: "current"
  },
  {
    degree: "Higher Secondary Certificate (HSC)",
    institution: "Safiuddin Sarkar Academy & College",
    period: "2018 — 2020",
    description: "GPA: 5.00 — (Science Group)",
    icon: Award,
    status: "completed"
  },
  {
    degree: "Secondary School Certificate (SSC)",
    institution: "Daudpur Putina High School",
    period: "2013 — 2018",
    description: "GPA: 5.00 — (Science Group)",
    icon: Book,
    status: "completed"
  },
];

export default function HomeAboutSection() {
  return (<div>
    {/* <!-- About & Education Section --> */}
    <section id="about" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Engineering beyond the framework.</h2>
          <div className="text-sm md:text-base space-y-4 text-slate-400 leading-relaxed">
            <p>
              I am currently a B.Sc. Computer Science & Engineering student at <strong className="text-slate-200 font-medium">United International University</strong> (2022–Present). While my academic journey provides the theoretical foundation, my real education happens in the IDE.
            </p>
            <p>
              Over the past 3 years, I’ve grown into a capable <strong className="text-slate-200 font-medium">Software Engineer</strong> with a deep focus on Flutter. From building scalable backends with <strong className="text-slate-200 font-medium">FastAPI</strong> and <strong className="text-slate-200 font-medium">Node.js + Express</strong> to creating interactive web experiences with <strong className="text-slate-200 font-medium">Next.js</strong> and optimizing mobile UIs, I am passionate about quality and seamless user experiences. I value writing clean, understandable code and learning from real-world constraints through projects. Each build helps me better understand trade-offs, performance considerations, and how small decisions affect the overall system.

            </p>
            <p>
             My goal is to continue building robust and scalable software by learning from real projects, improving with each iteration, and solving practical problems across mobile and web.
            </p>
          </div>


          <div className="flex gap-4 pt-4">
            <a href="https://github.com/kaiumallimon" target="_blank" className="cursor-target p-3 border rounded-full hover:bg-white/10 hover:scale-110 transition-all">
              <FaGithub size={20} className="text-slate-300" />
            </a>
            <a href="https://linkedin.com/in/kaiumallimon" target="_blank" className="cursor-target p-3 border rounded-full hover:bg-white/10 hover:scale-110 transition-all">
              <FaLinkedin size={20} className="text-slate-300" />
            </a>
            <a href="mailto:kalimon291@gmail.com" className="cursor-target p-3 border rounded-full hover:bg-white/10 hover:scale-110 transition-all">
              <MdEmail size={20} className="text-slate-300" />
            </a>
          </div>
        </div>

        {/* <!-- Education Card --> */}
        <div className="border border-muted/75 p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl  transition-all"></div>

          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className="text-xl font-semibold text-white">Education</h3>
              <p className="text-sm text-slate-500 mt-1">Academic Foundation</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <Book size={16} className="text-indigo-400" />
            </div>
          </div>

          <div className="space-y-0 relative">
            {/* Timeline line */}
            <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-linear-to-b from-indigo-500 via-indigo-500/50 to-slate-500/50"></div>

            {education.map((edu, index) => {
              const IconComponent = edu.icon;
              const isCurrent = edu.status === "current";

              return (
                <div key={index} className="relative pl-16 py-6">
                  {/* Timeline dot */}
                  <div className={`absolute left-0 top-7 w-7 h-7 rounded-full ring-4 ring-slate-900/90 flex items-center justify-center transition-all ${isCurrent
                    ? 'bg-indigo-500'
                    : 'bg-slate-500'
                    }`}>
                    <IconComponent size={14} className="text-white" />
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-white font-semibold text-sm">{edu.degree}</h4>
                      {isCurrent && <span className="text-xs px-2 py-0.5 bg-indigo-500/30 text-indigo-300 rounded-full">Current</span>}
                    </div>
                    <p className={`text-xs font-medium ${isCurrent ? 'text-indigo-300' : 'text-slate-400'}`}>{edu.institution}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{edu.period}</p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{edu.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  </div>);
}