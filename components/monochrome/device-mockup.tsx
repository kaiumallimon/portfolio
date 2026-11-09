"use client";

import React from "react";

interface DeviceMockupProps {
  type: "mobile" | "web";
  title?: string;
}

export function DeviceMockup({ type, title }: DeviceMockupProps) {
  if (type === "mobile") {
    return (
      <div
        className="w-full h-full flex items-center justify-center p-2 relative overflow-hidden select-none"
        title={title ? `${title} — Mobile App Preview` : "Mobile Application"}
      >
        {/* Faint blueprint background grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />

        {/* iPhone Vector Mockup */}
        <svg
          viewBox="0 0 140 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-32 sm:h-36 w-auto max-w-full drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
        >
          {/* Chassis Shadow & Outer Edge */}
          <rect
            x="30"
            y="7"
            width="80"
            height="146"
            rx="18"
            className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700"
            strokeWidth="1.5"
          />

          {/* Volume buttons & Power key */}
          <rect
            x="28"
            y="35"
            width="2"
            height="12"
            rx="1"
            className="fill-zinc-400 dark:fill-zinc-600"
          />
          <rect
            x="28"
            y="52"
            width="2"
            height="12"
            rx="1"
            className="fill-zinc-400 dark:fill-zinc-600"
          />
          <rect
            x="110"
            y="42"
            width="2"
            height="18"
            rx="1"
            className="fill-zinc-400 dark:fill-zinc-600"
          />

          {/* Inner Display Screen */}
          <rect
            x="34"
            y="11"
            width="72"
            height="138"
            rx="14"
            className="fill-white dark:fill-zinc-950 stroke-zinc-200 dark:stroke-zinc-800"
            strokeWidth="1"
          />

          {/* Dynamic Island */}
          <rect
            x="58"
            y="15"
            width="24"
            height="5.5"
            rx="2.75"
            className="fill-zinc-900 dark:fill-zinc-800"
          />
          <circle cx="75" cy="17.75" r="1.25" className="fill-zinc-700 dark:fill-zinc-950" />

          {/* Mobile Wireframe Content */}
          {/* Status Bar */}
          <rect x="40" y="16" width="10" height="2.5" rx="1" className="fill-zinc-300 dark:fill-zinc-700" />
          <rect x="90" y="16" width="10" height="2.5" rx="1" className="fill-zinc-300 dark:fill-zinc-700" />

          {/* Header Bar */}
          <circle cx="43" cy="29" r="4" className="fill-emerald-500/20 stroke-emerald-500" strokeWidth="0.75" />
          <rect x="51" y="27" width="28" height="4" rx="1" className="fill-zinc-300 dark:fill-zinc-700" />

          {/* Hero Banner Card */}
          <rect
            x="38"
            y="38"
            width="64"
            height="26"
            rx="4"
            className="fill-zinc-50 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800"
            strokeWidth="0.75"
          />
          <rect x="43" y="44" width="30" height="3" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />
          <rect x="43" y="50" width="46" height="2" rx="0.5" className="fill-zinc-300 dark:fill-zinc-700" />
          <rect x="43" y="54" width="20" height="5" rx="1.5" className="fill-zinc-900 dark:fill-zinc-100" />

          {/* 2 Action Cards Grid */}
          <rect
            x="38"
            y="68"
            width="30"
            height="22"
            rx="3"
            className="fill-zinc-50 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800"
            strokeWidth="0.75"
          />
          <circle cx="46" cy="76" r="3" className="fill-zinc-300 dark:fill-zinc-700" />
          <rect x="43" y="82" width="20" height="2" rx="0.5" className="fill-zinc-300 dark:fill-zinc-700" />

          <rect
            x="72"
            y="68"
            width="30"
            height="22"
            rx="3"
            className="fill-zinc-50 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800"
            strokeWidth="0.75"
          />
          <circle cx="80" cy="76" r="3" className="fill-zinc-300 dark:fill-zinc-700" />
          <rect x="77" y="82" width="20" height="2" rx="0.5" className="fill-zinc-300 dark:fill-zinc-700" />

          {/* List Items */}
          <rect x="38" y="95" width="64" height="12" rx="2" className="fill-zinc-50 dark:fill-zinc-900/60" />
          <circle cx="44" cy="101" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />
          <rect x="50" y="100" width="32" height="2" rx="0.5" className="fill-zinc-300 dark:fill-zinc-700" />

          <rect x="38" y="110" width="64" height="12" rx="2" className="fill-zinc-50 dark:fill-zinc-900/60" />
          <circle cx="44" cy="116" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />
          <rect x="50" y="115" width="26" height="2" rx="0.5" className="fill-zinc-300 dark:fill-zinc-700" />

          {/* Bottom Navigation Bar */}
          <line x1="34" y1="128" x2="106" y2="128" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.5" />
          <circle cx="46" cy="134" r="2" className="fill-emerald-500" />
          <circle cx="60" cy="134" r="2" className="fill-zinc-300 dark:fill-zinc-700" />
          <circle cx="74" cy="134" r="2" className="fill-zinc-300 dark:fill-zinc-700" />
          <circle cx="88" cy="134" r="2" className="fill-zinc-300 dark:fill-zinc-700" />

          {/* Home Bar Indicator */}
          <rect
            x="56"
            y="143"
            width="28"
            height="2"
            rx="1"
            className="fill-zinc-400 dark:fill-zinc-600"
          />
        </svg>
      </div>
    );
  }

  // Web / Desktop (MacBook Frame)
  return (
    <div
      className="w-full h-full flex items-center justify-center p-2 relative overflow-hidden select-none"
      title={title ? `${title} — Web App Preview` : "Web Application"}
    >
      {/* Faint blueprint background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />

      {/* MacBook Vector Mockup */}
      <svg
        viewBox="0 0 240 155"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-32 sm:h-36 w-auto max-w-full drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
      >
        {/* Screen Bezel */}
        <rect
          x="26"
          y="10"
          width="188"
          height="120"
          rx="7"
          className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700"
          strokeWidth="1.5"
        />

        {/* Camera Dot */}
        <circle cx="120" cy="15" r="1.5" className="fill-zinc-400 dark:fill-zinc-600" />

        {/* Display Screen */}
        <rect
          x="32"
          y="20"
          width="176"
          height="104"
          rx="3"
          className="fill-white dark:fill-zinc-950 stroke-zinc-200 dark:stroke-zinc-800"
          strokeWidth="1"
        />

        {/* Browser Top Window Bar */}
        <rect
          x="32"
          y="20"
          width="176"
          height="13"
          rx="3"
          className="fill-zinc-50 dark:fill-zinc-900 border-b border-zinc-200 dark:border-zinc-800"
        />
        <line x1="32" y1="33" x2="208" y2="33" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.75" />

        {/* Window Control Dots */}
        <circle cx="40" cy="26.5" r="2" className="fill-red-400/80" />
        <circle cx="46" cy="26.5" r="2" className="fill-amber-400/80" />
        <circle cx="52" cy="26.5" r="2" className="fill-emerald-400/80" />

        {/* Browser URL Search Pill */}
        <rect
          x="66"
          y="23"
          width="82"
          height="7"
          rx="2"
          className="fill-white dark:fill-zinc-950 stroke-zinc-200 dark:stroke-zinc-800"
          strokeWidth="0.5"
        />
        <line x1="72" y1="26.5" x2="108" y2="26.5" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1" strokeLinecap="round" />

        {/* Web Page Wireframe Content */}
        {/* Navigation Bar inside site */}
        <line x1="32" y1="44" x2="208" y2="44" className="stroke-zinc-100 dark:stroke-zinc-900" strokeWidth="0.75" />
        <rect x="38" y="37" width="16" height="4" rx="1" className="fill-zinc-900 dark:fill-zinc-100" />
        <rect x="146" y="38" width="14" height="2" rx="0.5" className="fill-zinc-300 dark:fill-zinc-700" />
        <rect x="166" y="38" width="14" height="2" rx="0.5" className="fill-zinc-300 dark:fill-zinc-700" />
        <rect x="186" y="36.5" width="16" height="5" rx="1" className="fill-emerald-500" />

        {/* Hero Area */}
        <rect x="42" y="52" width="56" height="5" rx="1" className="fill-zinc-900 dark:fill-zinc-100" />
        <rect x="42" y="60" width="70" height="2.5" rx="0.5" className="fill-zinc-300 dark:fill-zinc-700" />
        <rect x="42" y="65" width="52" height="2.5" rx="0.5" className="fill-zinc-300 dark:fill-zinc-700" />
        <rect x="42" y="72" width="22" height="6" rx="1.5" className="fill-zinc-900 dark:fill-zinc-100" />

        {/* Hero Graphic / Chart on Right */}
        <rect
          x="124"
          y="50"
          width="76"
          height="32"
          rx="3"
          className="fill-zinc-50 dark:fill-zinc-900/80 stroke-zinc-200 dark:stroke-zinc-800"
          strokeWidth="0.75"
        />
        <path
          d="M130 74 L144 64 L158 68 L174 58 L192 62"
          className="stroke-emerald-500"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="174" cy="58" r="2" className="fill-emerald-500" />

        {/* 3 Feature Cards */}
        <rect
          x="38"
          y="88"
          width="48"
          height="28"
          rx="2.5"
          className="fill-zinc-50 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800"
          strokeWidth="0.75"
        />
        <rect x="43" y="93" width="20" height="3" rx="0.5" className="fill-zinc-400 dark:fill-zinc-600" />
        <rect x="43" y="99" width="38" height="2" rx="0.5" className="fill-zinc-300 dark:fill-zinc-700" />

        <rect
          x="94"
          y="88"
          width="50"
          height="28"
          rx="2.5"
          className="fill-zinc-50 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800"
          strokeWidth="0.75"
        />
        <rect x="99" y="93" width="20" height="3" rx="0.5" className="fill-zinc-400 dark:fill-zinc-600" />
        <rect x="99" y="99" width="40" height="2" rx="0.5" className="fill-zinc-300 dark:fill-zinc-700" />

        <rect
          x="152"
          y="88"
          width="50"
          height="28"
          rx="2.5"
          className="fill-zinc-50 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800"
          strokeWidth="0.75"
        />
        <rect x="157" y="93" width="20" height="3" rx="0.5" className="fill-zinc-400 dark:fill-zinc-600" />
        <rect x="157" y="99" width="40" height="2" rx="0.5" className="fill-zinc-300 dark:fill-zinc-700" />

        {/* Laptop Base Deck */}
        <path
          d="M12 130 L228 130 L220 137 L20 137 Z"
          className="fill-zinc-200 dark:fill-zinc-800 stroke-zinc-300 dark:stroke-zinc-700"
          strokeWidth="1"
        />

        {/* Center Opening Notch */}
        <rect
          x="108"
          y="130"
          width="24"
          height="2.5"
          rx="1"
          className="fill-zinc-400 dark:fill-zinc-600"
        />
      </svg>
    </div>
  );
}
