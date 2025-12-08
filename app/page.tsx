"use client";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

export default function Home() {
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" } });

    // Avatar fade/slide in
    if (avatarRef.current) {
      tl.from(avatarRef.current, { y: 30, opacity: 0 });
    }

    // Name & subtitle
    if (nameRef.current) {
      tl.from(nameRef.current, { y: 20, opacity: 0 }, "-=0.4");
    }

    // Headline + paragraph + buttons (all together)
    if (headlineRef.current) {
      tl.from(headlineRef.current.children, { y: 30, opacity: 0, stagger: 0.15 }, "-=0.4");
    }

    // Buttons (synchronized with paragraph timing)
    if (buttonsRef.current) {
      tl.from(
        buttonsRef.current.children,
        {
          y: 20,
          opacity: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: "power2.out",
          clearProps: "all"
        },
        "-=0.6"
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="relative w-full flex min-h-full items-center">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">

        {/* Avatar + Name */}
        <div ref={avatarRef} className="flex flex-col items-center">
          <div className="relative group">
            <Image
              src="/bordered.png"
              alt="Kaium Al Limon"
              width={110}
              height={110}
              className="rounded-full border-2 border-white/25 shadow-lg transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </div>

          <div ref={nameRef}>
            <h1 className="text-center mt-4 text-lg md:text-xl font-medium tracking-tight text-white">
              Kaium Al Limon
            </h1>
            <p className="text-center mt-1 text-sm md:text-base text-muted-foreground">
              Full‑stack, cross‑platform developer
            </p>
          </div>
        </div>

        {/* Headline */}
        <div ref={headlineRef} className="mt-8 md:mt-10">
          <h2 className="mx-auto max-w-4xl text-center text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-white">
            Crafting seamless, user‑focused experiences across mobile and web
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm md:text-base text-muted-foreground">
            I specialize in Flutter for fast, polished mobile experiences, and complement with Next.js on the web — performant, accessible, and delightful.
          </p>
        </div>

        {/* CTA buttons */}
        <div ref={buttonsRef} className="relative z-10 mt-8 flex space-x-4 items-center justify-center">
          <Button onClick={() => router.push("/contact")}>
            Get in touch
          </Button>
          <Button variant="outline" onClick={() => router.push("/projects")}>
            View Projects
          </Button>
        </div>
      </div>
    </section>
  );
}
