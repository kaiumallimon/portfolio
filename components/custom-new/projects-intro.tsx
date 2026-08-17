"use client";

import { motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { springs } from "@/lib/motion";

export default function ProjectsIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
      className="text-center max-w-3xl mx-auto"
    >
      <div className="flex justify-center mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-slate-400 hover:text-white transition-colors">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white font-medium">Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">
        Portfolio & Architecture
      </span>
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
        All Works & Systems
      </h1>
      <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-10">
        A comprehensive collection of my software engineering work, spanning high-performance mobile apps, web systems, and open-source tools.
      </p>
    </motion.div>
  );
}
