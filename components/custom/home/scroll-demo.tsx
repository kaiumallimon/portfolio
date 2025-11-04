"use client";

import { motion } from "framer-motion";
import { ScrollAnimation, ScrollStagger } from "@/lib/scroll-animations";
import { 
  fadeInUp, 
  fadeInLeft, 
  fadeInRight, 
  scaleIn, 
  ANIMATION_DELAY 
} from "@/lib/animations";

export default function ScrollDemo() {
  const features = [
    {
      title: "Smooth Animations",
      description: "Consistent and delightful animations throughout the application",
      icon: "🎨"
    },
    {
      title: "Scroll Triggered",
      description: "Elements animate beautifully as they enter the viewport",
      icon: "📜"
    },
    {
      title: "Performance Optimized",
      description: "Animations are optimized for smooth 60fps performance",
      icon: "⚡"
    },
    {
      title: "Framer Motion",
      description: "Built with the industry-leading animation library",
      icon: "🚀"
    }
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      {/* Section Title */}
      <ScrollAnimation direction="up" delay={0}>
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-6"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
          >
            Animation Features
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={ANIMATION_DELAY.short}
          >
            Experience smooth, delayed scroll animations with consistent timing
          </motion.p>
        </div>
      </ScrollAnimation>

      {/* Features Grid - Scroll Triggered with Stagger */}
      <ScrollStagger 
        direction="up" 
        staggerDelay={0.15}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </ScrollStagger>

      {/* Individual Scroll Animations Example */}
      <div className="mt-20 space-y-8">
        <ScrollAnimation direction="left" delay={0.2}>
          <div className="flex items-center justify-center p-12 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg">
            <h3 className="text-3xl font-bold text-center">
              This animates from the left with delay
            </h3>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="right" delay={0.1}>
          <div className="flex items-center justify-center p-12 bg-linear-to-r from-green-50 to-blue-50 rounded-lg">
            <h3 className="text-3xl font-bold text-center">
              This animates from the right with delay
            </h3>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.3}>
          <div className="flex items-center justify-center p-12 bg-linear-to-r from-yellow-50 to-red-50 rounded-lg">
            <h3 className="text-3xl font-bold text-center">
              This animates from bottom with longer delay
            </h3>
          </div>
        </ScrollAnimation>
      </div>

      {/* Performance Note */}
      <ScrollAnimation direction="up" delay={0.1}>
        <div className="mt-16 p-8 bg-gray-50 rounded-lg text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h4 className="text-xl font-semibold mb-2">Performance Focused</h4>
            <p className="text-gray-600">
              All animations respect <code>prefers-reduced-motion</code> and are GPU accelerated
            </p>
          </motion.div>
        </div>
      </ScrollAnimation>
    </section>
  );
}