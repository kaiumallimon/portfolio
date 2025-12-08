"use client";
import React, { useEffect, useRef } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";

type AnimatedButtonProps = React.ComponentProps<typeof Button> & {
  entranceDelay?: number;
};

export default function AnimatedButton({
  className,
  entranceDelay = 0,
  children,
  ...props
}: AnimatedButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: entranceDelay }
    );

    const el = ref.current;
    const enter = () => {
      gsap.to(el, { scale: 1.03, y: -2, duration: 0.2, ease: "power2.out" });
    };
    const leave = () => {
      gsap.to(el, { scale: 1.0, y: 0, duration: 0.2, ease: "power2.out" });
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [entranceDelay]);

  return (
    <Button ref={ref as any} className={cn(className)} {...props}>
      {children}
    </Button>
  );
}
