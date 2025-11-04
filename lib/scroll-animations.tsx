import { useInView } from "framer-motion";
import { useRef } from "react";
import { motion, Variants } from "framer-motion";
import { createScrollAnimation } from "./animations";

// Hook for scroll-triggered animations
export const useScrollAnimationWithInView = (
  direction: "up" | "down" | "left" | "right" = "up",
  delay = 0,
  threshold = 0.1,
  triggerOnce = true
) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: triggerOnce,
    margin: "0px 0px -100px 0px",
    amount: threshold
  });
  
  const animation = createScrollAnimation(direction, delay);

  return {
    ref,
    animate: isInView ? "visible" : "hidden",
    variants: animation,
  };
};

// Component wrapper for scroll animations
interface ScrollAnimationProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  direction = "up",
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  className = "",
}) => {
  const { ref, animate, variants } = useScrollAnimationWithInView(
    direction,
    delay,
    threshold,
    triggerOnce
  );

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={animate}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger scroll animations for multiple items
interface ScrollStaggerProps {
  children: React.ReactNode[];
  direction?: "up" | "down" | "left" | "right";
  staggerDelay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
}

export const ScrollStagger: React.FC<ScrollStaggerProps> = ({
  children,
  direction = "up",
  staggerDelay = 0.1,
  threshold = 0.1,
  triggerOnce = true,
  className = "",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: triggerOnce,
    margin: "0px 0px -100px 0px",
    amount: threshold
  });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = createScrollAnimation(direction, 0);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};