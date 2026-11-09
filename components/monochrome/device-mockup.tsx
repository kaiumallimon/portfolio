"use client";

import React from "react";

interface DeviceMockupProps {
  type?: "mobile" | "web";
  category?: string;
  title?: string;
  slug?: string;
}

function getMockupVariant(
  category?: string,
  type?: "mobile" | "web"
): "mobile" | "ecommerce" | "landing" | "tool" | "flutter_web" | "web_dashboard" {
  const cat = (category || "").toLowerCase();
  if (type === "mobile" || cat.includes("mobile")) return "mobile";
  if (cat.includes("ecommerce") || cat.includes("e-commerce")) return "ecommerce";
  if (cat.includes("landing")) return "landing";
  if (cat.includes("tool") || cat.includes("calculator")) return "tool";
  if (cat.includes("flutter")) return "flutter_web";
  return "web_dashboard";
}

export function DeviceMockup({ type, category, title, slug }: DeviceMockupProps) {
  const variant = getMockupVariant(category, type);

  // Common background grid wrapper
  const wrap = (children: React.ReactNode, accessibilityLabel: string) => (
    <div
      className="w-full h-full flex items-center justify-center p-2 relative overflow-hidden select-none"
      title={title ? `${title} — ${accessibilityLabel}` : accessibilityLabel}
    >
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
      {children}
    </div>
  );

  /* ---------------- 1. MOBILE APP (iPhone Mockup) ---------------- */
  if (variant === "mobile") {
    return wrap(
      <svg
        viewBox="0 0 140 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-32 sm:h-36 w-auto max-w-full drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
      >
        {/* Outer Chassis */}
        <rect
          x="30"
          y="7"
          width="80"
          height="146"
          rx="18"
          className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700"
          strokeWidth="1.5"
        />

        {/* Buttons */}
        <rect x="28" y="35" width="2" height="12" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />
        <rect x="28" y="52" width="2" height="12" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />
        <rect x="110" y="42" width="2" height="18" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />

        {/* Screen */}
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
        <rect x="58" y="15" width="24" height="5.5" rx="2.75" className="fill-zinc-900 dark:fill-zinc-800" />
        <circle cx="75" cy="17.75" r="1.25" className="fill-zinc-700 dark:fill-zinc-950" />

        {/* Status bar */}
        <rect x="40" y="16" width="10" height="2.5" rx="1" className="fill-zinc-300 dark:fill-zinc-700" />
        <rect x="90" y="16" width="10" height="2.5" rx="1" className="fill-zinc-300 dark:fill-zinc-700" />

        {/* App Header */}
        <circle cx="43" cy="29" r="4" className="fill-emerald-500/20 stroke-emerald-500" strokeWidth="0.75" />
        <rect x="51" y="27" width="28" height="4" rx="1" className="fill-zinc-300 dark:fill-zinc-700" />
        <rect x="90" y="27" width="12" height="4" rx="2" className="fill-zinc-200 dark:fill-zinc-800" />

        {/* Search Input Pill */}
        <rect x="40" y="37" width="60" height="8" rx="4" className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.5" />
        <circle cx="46" cy="41" r="2" className="fill-zinc-400 dark:fill-zinc-600" />
        <rect x="51" y="40" width="30" height="2" rx="1" className="fill-zinc-300 dark:fill-zinc-700" />

        {/* Hero Card Banner */}
        <rect x="40" y="49" width="60" height="26" rx="4" className="fill-zinc-900 dark:fill-zinc-800" />
        <rect x="44" y="54" width="32" height="3" rx="1" className="fill-white/80" />
        <rect x="44" y="60" width="20" height="2" rx="0.5" className="fill-white/40" />
        <rect x="44" y="66" width="16" height="4" rx="2" className="fill-emerald-500" />

        {/* List Section 1 */}
        <rect x="40" y="80" width="60" height="13" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        <rect x="44" y="83" width="7" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800" />
        <rect x="54" y="84" width="26" height="2.5" rx="0.75" className="fill-zinc-700 dark:fill-zinc-300" />
        <rect x="54" y="88.5" width="18" height="1.5" rx="0.5" className="fill-zinc-400 dark:fill-zinc-600" />
        <circle cx="94" cy="86.5" r="2" className="fill-zinc-300 dark:fill-zinc-700" />

        {/* List Section 2 */}
        <rect x="40" y="96" width="60" height="13" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        <rect x="44" y="99" width="7" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800" />
        <rect x="54" y="100" width="22" height="2.5" rx="0.75" className="fill-zinc-700 dark:fill-zinc-300" />
        <rect x="54" y="104.5" width="15" height="1.5" rx="0.5" className="fill-zinc-400 dark:fill-zinc-600" />
        <circle cx="94" cy="102.5" r="2" className="fill-zinc-300 dark:fill-zinc-700" />

        {/* List Section 3 */}
        <rect x="40" y="112" width="60" height="13" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        <rect x="44" y="115" width="7" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800" />
        <rect x="54" y="116" width="28" height="2.5" rx="0.75" className="fill-zinc-700 dark:fill-zinc-300" />
        <rect x="54" y="120.5" width="19" height="1.5" rx="0.5" className="fill-zinc-400 dark:fill-zinc-600" />

        {/* Bottom Tab Bar */}
        <line x1="34" y1="128" x2="106" y2="128" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.5" />
        <circle cx="46" cy="134" r="2" className="fill-emerald-500" />
        <circle cx="60" cy="134" r="2" className="fill-zinc-300 dark:fill-zinc-700" />
        <circle cx="74" cy="134" r="2" className="fill-zinc-300 dark:fill-zinc-700" />
        <circle cx="88" cy="134" r="2" className="fill-zinc-300 dark:fill-zinc-700" />

        {/* Home Indicator */}
        <rect x="56" y="143" width="28" height="2" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />
      </svg>,
      "Mobile Application"
    );
  }

  /* ---------------- 2. FULL-STACK E-COMMERCE (Store Catalog Wireframe) ---------------- */
  if (variant === "ecommerce") {
    return wrap(
      <svg
        viewBox="0 0 240 155"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-32 sm:h-36 w-auto max-w-full drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
      >
        {/* Browser Window Chrome */}
        <rect x="15" y="8" width="210" height="138" rx="8" className="fill-white dark:fill-zinc-950 stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1" />
        <rect x="15" y="8" width="210" height="20" rx="8" className="fill-zinc-100 dark:fill-zinc-900" />
        <rect x="15" y="24" width="210" height="4" className="fill-zinc-100 dark:fill-zinc-900" />

        {/* Traffic Lights */}
        <circle cx="27" cy="18" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />
        <circle cx="35" cy="18" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />
        <circle cx="43" cy="18" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />

        {/* Address Bar */}
        <rect x="55" y="13" width="130" height="10" rx="3" className="fill-white dark:fill-zinc-950 stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.5" />
        <rect x="62" y="17" width="55" height="2.5" rx="1" className="fill-zinc-400 dark:fill-zinc-500" />

        {/* Store Header Bar */}
        <rect x="25" y="34" width="28" height="6" rx="1.5" className="fill-zinc-900 dark:fill-zinc-100" />
        <rect x="60" y="36" width="18" height="3" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />
        <rect x="82" y="36" width="18" height="3" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />
        <rect x="104" y="36" width="18" height="3" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />

        {/* Cart Icon & Checkout Pill */}
        <rect x="180" y="33" width="34" height="8" rx="2" className="fill-zinc-900 dark:fill-zinc-100" />
        <circle cx="187" cy="37" r="1.75" className="fill-white dark:fill-zinc-950" />
        <rect x="192" y="36" width="16" height="2" rx="0.5" className="fill-white dark:fill-zinc-950" />

        {/* Promo Hero Banner */}
        <rect x="25" y="46" width="190" height="28" rx="4" className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        <rect x="33" y="52" width="55" height="5" rx="1" className="fill-zinc-900 dark:fill-zinc-100" />
        <rect x="33" y="60" width="35" height="3" rx="0.75" className="fill-zinc-500 dark:fill-zinc-400" />
        <rect x="33" y="65" width="24" height="5" rx="1.5" className="fill-emerald-600 dark:fill-emerald-500" />
        {/* Device showcase graphic on banner */}
        <rect x="160" y="50" width="42" height="20" rx="3" className="fill-zinc-200 dark:fill-zinc-800 stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="0.5" />

        {/* 3 Product Cards Grid */}
        {/* Product 1 */}
        <rect x="25" y="80" width="58" height="58" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        <rect x="29" y="84" width="50" height="28" rx="2" className="fill-zinc-200 dark:fill-zinc-800" />
        <rect x="29" y="116" width="34" height="3" rx="0.75" className="fill-zinc-800 dark:fill-zinc-200" />
        <rect x="29" y="121" width="18" height="2.5" rx="0.5" className="fill-zinc-500 dark:fill-zinc-400" />
        <rect x="29" y="127" width="16" height="6" rx="1.5" className="fill-zinc-900 dark:fill-zinc-100" />

        {/* Product 2 */}
        <rect x="91" y="80" width="58" height="58" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        <rect x="95" y="84" width="50" height="28" rx="2" className="fill-zinc-200 dark:fill-zinc-800" />
        <rect x="95" y="116" width="38" height="3" rx="0.75" className="fill-zinc-800 dark:fill-zinc-200" />
        <rect x="95" y="121" width="22" height="2.5" rx="0.5" className="fill-zinc-500 dark:fill-zinc-400" />
        <rect x="95" y="127" width="16" height="6" rx="1.5" className="fill-zinc-900 dark:fill-zinc-100" />

        {/* Product 3 */}
        <rect x="157" y="80" width="58" height="58" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        <rect x="161" y="84" width="50" height="28" rx="2" className="fill-zinc-200 dark:fill-zinc-800" />
        <rect x="161" y="116" width="30" height="3" rx="0.75" className="fill-zinc-800 dark:fill-zinc-200" />
        <rect x="161" y="121" width="19" height="2.5" rx="0.5" className="fill-zinc-500 dark:fill-zinc-400" />
        <rect x="161" y="127" width="16" height="6" rx="1.5" className="fill-zinc-900 dark:fill-zinc-100" />
      </svg>,
      "E-Commerce Platform"
    );
  }

  /* ---------------- 3. LANDING PAGE (Marketing & Agency Wireframe) ---------------- */
  if (variant === "landing") {
    return wrap(
      <svg
        viewBox="0 0 240 155"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-32 sm:h-36 w-auto max-w-full drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
      >
        {/* Browser Chrome */}
        <rect x="15" y="8" width="210" height="138" rx="8" className="fill-white dark:fill-zinc-950 stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1" />
        <rect x="15" y="8" width="210" height="20" rx="8" className="fill-zinc-100 dark:fill-zinc-900" />
        <rect x="15" y="24" width="210" height="4" className="fill-zinc-100 dark:fill-zinc-900" />

        {/* Traffic Lights */}
        <circle cx="27" cy="18" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />
        <circle cx="35" cy="18" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />
        <circle cx="43" cy="18" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />

        {/* Address Bar */}
        <rect x="55" y="13" width="130" height="10" rx="3" className="fill-white dark:fill-zinc-950 stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.5" />
        <rect x="62" y="17" width="48" height="2.5" rx="1" className="fill-zinc-400 dark:fill-zinc-500" />

        {/* Navbar */}
        <rect x="25" y="34" width="26" height="6" rx="1.5" className="fill-zinc-900 dark:fill-zinc-100" />
        <rect x="85" y="36" width="16" height="2.5" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />
        <rect x="106" y="36" width="16" height="2.5" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />
        <rect x="127" y="36" width="16" height="2.5" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />
        <rect x="180" y="33" width="35" height="8" rx="2" className="fill-zinc-900 dark:fill-zinc-100" />

        {/* Pill Badge */}
        <rect x="92" y="49" width="56" height="6" rx="3" className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.5" />
        <rect x="98" y="51" width="44" height="2" rx="0.5" className="fill-zinc-500 dark:fill-zinc-400" />

        {/* Hero Impact Headlines */}
        <rect x="50" y="59" width="140" height="7" rx="1.5" className="fill-zinc-950 dark:fill-zinc-50" />
        <rect x="68" y="69" width="104" height="6" rx="1.5" className="fill-zinc-800 dark:fill-zinc-200" />
        <rect x="80" y="78" width="80" height="3" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />

        {/* Dual Call-to-Action Buttons */}
        <rect x="84" y="85" width="32" height="9" rx="2" className="fill-zinc-900 dark:fill-zinc-100" />
        <rect x="124" y="85" width="32" height="9" rx="2" className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="0.5" />

        {/* 3 Feature Value Columns */}
        <rect x="25" y="101" width="58" height="36" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        <circle cx="34" cy="110" r="3" className="fill-zinc-400 dark:fill-zinc-600" />
        <rect x="42" y="108.5" width="34" height="3" rx="0.75" className="fill-zinc-800 dark:fill-zinc-200" />
        <rect x="31" y="118" width="46" height="2" rx="0.5" className="fill-zinc-400 dark:fill-zinc-500" />
        <rect x="31" y="123" width="36" height="2" rx="0.5" className="fill-zinc-400 dark:fill-zinc-500" />

        <rect x="91" y="101" width="58" height="36" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        <circle cx="100" cy="110" r="3" className="fill-zinc-400 dark:fill-zinc-600" />
        <rect x="108" y="108.5" width="34" height="3" rx="0.75" className="fill-zinc-800 dark:fill-zinc-200" />
        <rect x="97" y="118" width="46" height="2" rx="0.5" className="fill-zinc-400 dark:fill-zinc-500" />
        <rect x="97" y="123" width="36" height="2" rx="0.5" className="fill-zinc-400 dark:fill-zinc-500" />

        <rect x="157" y="101" width="58" height="36" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        <circle cx="166" cy="110" r="3" className="fill-zinc-400 dark:fill-zinc-600" />
        <rect x="174" y="108.5" width="34" height="3" rx="0.75" className="fill-zinc-800 dark:fill-zinc-200" />
        <rect x="163" y="118" width="46" height="2" rx="0.5" className="fill-zinc-400 dark:fill-zinc-500" />
        <rect x="163" y="123" width="36" height="2" rx="0.5" className="fill-zinc-400 dark:fill-zinc-500" />
      </svg>,
      "Landing Page"
    );
  }

  /* ---------------- 4. WEB TOOL / CALCULATOR ---------------- */
  if (variant === "tool") {
    return wrap(
      <svg
        viewBox="0 0 240 155"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-32 sm:h-36 w-auto max-w-full drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
      >
        {/* Browser Chrome */}
        <rect x="15" y="8" width="210" height="138" rx="8" className="fill-white dark:fill-zinc-950 stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1" />
        <rect x="15" y="8" width="210" height="20" rx="8" className="fill-zinc-100 dark:fill-zinc-900" />
        <rect x="15" y="24" width="210" height="4" className="fill-zinc-100 dark:fill-zinc-900" />

        {/* Traffic Lights */}
        <circle cx="27" cy="18" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />
        <circle cx="35" cy="18" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />
        <circle cx="43" cy="18" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />

        {/* Address Bar */}
        <rect x="55" y="13" width="130" height="10" rx="3" className="fill-white dark:fill-zinc-950 stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.5" />
        <rect x="62" y="17" width="56" height="2.5" rx="1" className="fill-zinc-400 dark:fill-zinc-500" />

        {/* Tool Header */}
        <rect x="25" y="34" width="35" height="5" rx="1" className="fill-zinc-900 dark:fill-zinc-100" />
        <rect x="180" y="32" width="35" height="9" rx="2" className="fill-zinc-900 dark:fill-zinc-100" />

        {/* Two-Column Utility Layout */}
        {/* Left Column: Form & Course Entry Grid */}
        <rect x="25" y="45" width="120" height="92" rx="4" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        <rect x="33" y="52" width="40" height="4" rx="1" className="fill-zinc-700 dark:fill-zinc-300" />

        {/* Row 1 */}
        <rect x="33" y="60" width="48" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800" />
        <rect x="85" y="60" width="24" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800" />
        <rect x="113" y="60" width="24" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800" />

        {/* Row 2 */}
        <rect x="33" y="70" width="48" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800" />
        <rect x="85" y="70" width="24" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800" />
        <rect x="113" y="70" width="24" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800" />

        {/* Row 3 */}
        <rect x="33" y="80" width="48" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800" />
        <rect x="85" y="80" width="24" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800" />
        <rect x="113" y="80" width="24" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800" />

        {/* Row 4 */}
        <rect x="33" y="90" width="48" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800" />
        <rect x="85" y="90" width="24" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800" />
        <rect x="113" y="90" width="24" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800" />

        {/* Add Row Button */}
        <rect x="33" y="103" width="36" height="7" rx="1.5" className="fill-zinc-200 dark:fill-zinc-800 stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="0.5" />
        <line x1="39" y1="106.5" x2="43" y2="106.5" className="stroke-zinc-600 dark:stroke-zinc-400" strokeWidth="1" />
        <line x1="41" y1="104.5" x2="41" y2="108.5" className="stroke-zinc-600 dark:stroke-zinc-400" strokeWidth="1" />
        <rect x="47" y="105.5" width="18" height="2" rx="0.5" className="fill-zinc-600 dark:fill-zinc-400" />

        {/* Right Column: Dynamic CGPA Result Display Card */}
        <rect x="151" y="45" width="64" height="52" rx="4" className="fill-zinc-900 dark:fill-zinc-900 stroke-zinc-800 dark:stroke-zinc-800" strokeWidth="0.5" />
        <rect x="159" y="52" width="24" height="3" rx="0.75" className="fill-zinc-400" />
        {/* Big Score Typography: 3.92 */}
        <text x="183" y="74" textAnchor="middle" className="fill-white font-mono font-bold text-[18px]">
          3.92
        </text>
        <rect x="159" y="82" width="48" height="6" rx="2" className="fill-emerald-500/20 stroke-emerald-500" strokeWidth="0.5" />
        <rect x="165" y="84" width="36" height="2" rx="0.5" className="fill-emerald-400" />

        {/* Mini Meter Chart */}
        <rect x="151" y="103" width="64" height="34" rx="4" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        <rect x="159" y="108" width="26" height="2.5" rx="0.5" className="fill-zinc-500 dark:fill-zinc-400" />
        {/* Bars */}
        <rect x="161" y="123" width="7" height="9" rx="1" className="fill-zinc-300 dark:fill-zinc-700" />
        <rect x="172" y="117" width="7" height="15" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />
        <rect x="183" y="114" width="7" height="18" rx="1" className="fill-zinc-700 dark:fill-zinc-300" />
        <rect x="194" y="112" width="7" height="20" rx="1" className="fill-emerald-500" />
      </svg>,
      "Web Utility Tool"
    );
  }

  /* ---------------- 5. FLUTTER WEB APP (Cross-Platform ERP Wireframe) ---------------- */
  if (variant === "flutter_web") {
    return wrap(
      <svg
        viewBox="0 0 240 155"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-32 sm:h-36 w-auto max-w-full drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
      >
        {/* Browser Chrome */}
        <rect x="15" y="8" width="210" height="138" rx="8" className="fill-white dark:fill-zinc-950 stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1" />
        <rect x="15" y="8" width="210" height="20" rx="8" className="fill-zinc-100 dark:fill-zinc-900" />
        <rect x="15" y="24" width="210" height="4" className="fill-zinc-100 dark:fill-zinc-900" />

        {/* Traffic Lights */}
        <circle cx="27" cy="18" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />
        <circle cx="35" cy="18" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />
        <circle cx="43" cy="18" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />

        {/* Address Bar */}
        <rect x="55" y="13" width="130" height="10" rx="3" className="fill-white dark:fill-zinc-950 stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.5" />
        <rect x="62" y="17" width="50" height="2.5" rx="1" className="fill-zinc-400 dark:fill-zinc-500" />

        {/* Left ERP Sidebar */}
        <rect x="16" y="28" width="46" height="117" className="fill-zinc-100/70 dark:fill-zinc-900/70 border-r border-zinc-200 dark:border-zinc-800" />
        <line x1="62" y1="28" x2="62" y2="145" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.5" />

        {/* Flutter Motif Logo */}
        <polygon points="26,38 33,45 30,48 23,41" className="fill-sky-500" />
        <polygon points="30,48 35,53 32,56 27,51" className="fill-sky-400" />
        <rect x="38" y="44" width="18" height="4" rx="1" className="fill-zinc-900 dark:fill-zinc-100" />

        {/* Sidebar Nav Items */}
        <rect x="22" y="58" width="34" height="6" rx="2" className="fill-zinc-900 dark:fill-zinc-100" />
        <rect x="22" y="68" width="34" height="6" rx="2" className="fill-zinc-200/80 dark:fill-zinc-800/80" />
        <rect x="22" y="78" width="34" height="6" rx="2" className="fill-zinc-200/80 dark:fill-zinc-800/80" />
        <rect x="22" y="88" width="34" height="6" rx="2" className="fill-zinc-200/80 dark:fill-zinc-800/80" />
        <rect x="22" y="98" width="34" height="6" rx="2" className="fill-zinc-200/80 dark:fill-zinc-800/80" />

        {/* Main Work Area */}
        {/* Top Action Bar */}
        <rect x="70" y="34" width="45" height="5" rx="1" className="fill-zinc-800 dark:fill-zinc-200" />
        <rect x="180" y="32" width="35" height="8" rx="2" className="fill-emerald-600 dark:fill-emerald-500" />

        {/* 3 Metric Cards */}
        <rect x="70" y="45" width="46" height="22" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        <rect x="75" y="49" width="22" height="2" rx="0.5" className="fill-zinc-400" />
        <rect x="75" y="55" width="28" height="6" rx="1" className="fill-zinc-900 dark:fill-zinc-100" />

        <rect x="120" y="45" width="46" height="22" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        <rect x="125" y="49" width="22" height="2" rx="0.5" className="fill-zinc-400" />
        <rect x="125" y="55" width="28" height="6" rx="1" className="fill-zinc-900 dark:fill-zinc-100" />

        <rect x="170" y="45" width="46" height="22" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        <rect x="175" y="49" width="22" height="2" rx="0.5" className="fill-zinc-400" />
        <rect x="175" y="55" width="28" height="6" rx="1" className="fill-zinc-900 dark:fill-zinc-100" />

        {/* Industrial ERP Data Table */}
        <rect x="70" y="73" width="146" height="64" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
        {/* Table Header */}
        <rect x="70" y="73" width="146" height="12" rx="2" className="fill-zinc-100 dark:fill-zinc-900" />
        <rect x="76" y="78" width="18" height="2.5" rx="0.5" className="fill-zinc-600 dark:fill-zinc-400" />
        <rect x="108" y="78" width="24" height="2.5" rx="0.5" className="fill-zinc-600 dark:fill-zinc-400" />
        <rect x="148" y="78" width="20" height="2.5" rx="0.5" className="fill-zinc-600 dark:fill-zinc-400" />
        <rect x="186" y="78" width="22" height="2.5" rx="0.5" className="fill-zinc-600 dark:fill-zinc-400" />

        {/* Table Rows */}
        <rect x="76" y="90" width="20" height="2.5" rx="0.5" className="fill-zinc-800 dark:fill-zinc-200" />
        <rect x="108" y="90" width="30" height="2.5" rx="0.5" className="fill-zinc-500" />
        <rect x="148" y="89" width="18" height="5" rx="1.5" className="fill-emerald-500/20 stroke-emerald-500" strokeWidth="0.5" />
        <rect x="186" y="90" width="22" height="3" rx="1" className="fill-zinc-300 dark:fill-zinc-700" />

        <rect x="76" y="102" width="20" height="2.5" rx="0.5" className="fill-zinc-800 dark:fill-zinc-200" />
        <rect x="108" y="102" width="30" height="2.5" rx="0.5" className="fill-zinc-500" />
        <rect x="148" y="101" width="18" height="5" rx="1.5" className="fill-emerald-500/20 stroke-emerald-500" strokeWidth="0.5" />
        <rect x="186" y="102" width="18" height="3" rx="1" className="fill-zinc-300 dark:fill-zinc-700" />

        <rect x="76" y="114" width="20" height="2.5" rx="0.5" className="fill-zinc-800 dark:fill-zinc-200" />
        <rect x="108" y="114" width="30" height="2.5" rx="0.5" className="fill-zinc-500" />
        <rect x="148" y="113" width="18" height="5" rx="1.5" className="fill-amber-500/20 stroke-amber-500" strokeWidth="0.5" />
        <rect x="186" y="114" width="24" height="3" rx="1" className="fill-zinc-300 dark:fill-zinc-700" />

        <rect x="76" y="126" width="20" height="2.5" rx="0.5" className="fill-zinc-800 dark:fill-zinc-200" />
        <rect x="108" y="126" width="30" height="2.5" rx="0.5" className="fill-zinc-500" />
        <rect x="148" y="125" width="18" height="5" rx="1.5" className="fill-emerald-500/20 stroke-emerald-500" strokeWidth="0.5" />
        <rect x="186" y="126" width="20" height="3" rx="1" className="fill-zinc-300 dark:fill-zinc-700" />
      </svg>,
      "Flutter Web Enterprise System"
    );
  }

  /* ---------------- 6. FULL-STACK WEB APP (Dashboard Wireframe) ---------------- */
  return wrap(
    <svg
      viewBox="0 0 240 155"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-32 sm:h-36 w-auto max-w-full drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
    >
      {/* Browser Chrome */}
      <rect x="15" y="8" width="210" height="138" rx="8" className="fill-white dark:fill-zinc-950 stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1" />
      <rect x="15" y="8" width="210" height="20" rx="8" className="fill-zinc-100 dark:fill-zinc-900" />
      <rect x="15" y="24" width="210" height="4" className="fill-zinc-100 dark:fill-zinc-900" />

      {/* Traffic Lights */}
      <circle cx="27" cy="18" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />
      <circle cx="35" cy="18" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />
      <circle cx="43" cy="18" r="2.5" className="fill-zinc-300 dark:fill-zinc-700" />

      {/* Address Bar */}
      <rect x="55" y="13" width="130" height="10" rx="3" className="fill-white dark:fill-zinc-950 stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.5" />
      <rect x="62" y="17" width="46" height="2.5" rx="1" className="fill-zinc-400 dark:fill-zinc-500" />

      {/* Left Dashboard Sidebar */}
      <rect x="16" y="28" width="42" height="117" className="fill-zinc-50 dark:fill-zinc-900/40" />
      <line x1="58" y1="28" x2="58" y2="145" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.5" />

      {/* Sidebar Items */}
      <circle cx="28" cy="40" r="3" className="fill-zinc-900 dark:fill-zinc-100" />
      <rect x="36" y="38.5" width="16" height="3" rx="1" className="fill-zinc-900 dark:fill-zinc-100" />

      <circle cx="28" cy="52" r="2.5" className="fill-zinc-400 dark:fill-zinc-600" />
      <rect x="36" y="50.5" width="16" height="2.5" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />

      <circle cx="28" cy="64" r="2.5" className="fill-zinc-400 dark:fill-zinc-600" />
      <rect x="36" y="62.5" width="16" height="2.5" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />

      <circle cx="28" cy="76" r="2.5" className="fill-zinc-400 dark:fill-zinc-600" />
      <rect x="36" y="74.5" width="16" height="2.5" rx="1" className="fill-zinc-400 dark:fill-zinc-600" />

      {/* Main Workspace Header */}
      <rect x="68" y="35" width="48" height="5" rx="1" className="fill-zinc-900 dark:fill-zinc-100" />
      <rect x="180" y="33" width="35" height="8" rx="2" className="fill-zinc-900 dark:fill-zinc-100" />

      {/* 3 Metric Cards */}
      <rect x="68" y="46" width="46" height="22" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
      <rect x="73" y="50" width="20" height="2" rx="0.5" className="fill-zinc-400" />
      <rect x="73" y="56" width="24" height="6" rx="1" className="fill-zinc-900 dark:fill-zinc-100" />

      <rect x="118" y="46" width="46" height="22" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
      <rect x="123" y="50" width="20" height="2" rx="0.5" className="fill-zinc-400" />
      <rect x="123" y="56" width="24" height="6" rx="1" className="fill-zinc-900 dark:fill-zinc-100" />

      <rect x="168" y="46" width="46" height="22" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
      <rect x="173" y="50" width="20" height="2" rx="0.5" className="fill-zinc-400" />
      <rect x="173" y="56" width="24" height="6" rx="1" className="fill-zinc-900 dark:fill-zinc-100" />

      {/* Main Chart Card with Curved Graph */}
      <rect x="68" y="74" width="146" height="63" rx="3" className="fill-zinc-50 dark:fill-zinc-900/60 stroke-zinc-200/80 dark:stroke-zinc-800/80" strokeWidth="0.5" />
      <rect x="74" y="79" width="36" height="3" rx="0.75" className="fill-zinc-700 dark:fill-zinc-300" />

      {/* Grid Lines */}
      <line x1="74" y1="95" x2="206" y2="95" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="74" y1="110" x2="206" y2="110" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="74" y1="125" x2="206" y2="125" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="0.5" strokeDasharray="2 2" />

      {/* Vector Line Graph */}
      <path
        d="M76 122 Q100 115 120 102 T160 98 T185 88 T204 84"
        fill="none"
        className="stroke-zinc-900 dark:stroke-zinc-100"
        strokeWidth="1.5"
      />
      {/* Area fill under curve */}
      <path
        d="M76 122 Q100 115 120 102 T160 98 T185 88 T204 84 L204 128 L76 128 Z"
        className="fill-zinc-200/50 dark:fill-zinc-800/40"
      />
      {/* Point markers */}
      <circle cx="120" cy="102" r="2" className="fill-zinc-900 dark:fill-zinc-100" />
      <circle cx="160" cy="98" r="2" className="fill-zinc-900 dark:fill-zinc-100" />
      <circle cx="204" cy="84" r="2" className="fill-zinc-900 dark:fill-zinc-100" />
    </svg>,
    "Web Application"
  );
}
