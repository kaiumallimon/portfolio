'use client';

import { motion } from 'framer-motion';
import { SCROLL_VIEWPORT, scrollTransition } from '@/components/shared/scroll-reveal';

export default function SectionSeparator() {
  return (
    <div className="py-12 px-6">
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={SCROLL_VIEWPORT}
          transition={scrollTransition()}
          style={{ originX: 0.5 }}
          className="h-px w-full bg-linear-to-r from-transparent via-indigo-500/30 to-transparent"
        />
      </div>
    </div>
  );
}
