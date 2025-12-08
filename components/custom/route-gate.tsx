"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type RouteGateProps = {
  children: ReactNode;
  durationMs?: number; // should match RouteSplash duration
};

export default function RouteGate({ children, durationMs = 700 }: RouteGateProps) {
  const pathname = usePathname();
  const [ready, setReady] = useState(true);
  const lastPathRef = useRef<string>(pathname);

  useEffect(() => {
    if (lastPathRef.current !== pathname) {
      lastPathRef.current = pathname;
      setReady(false);
      const t = setTimeout(() => setReady(true), durationMs);
      return () => clearTimeout(t);
    }
  }, [pathname, durationMs]);

  // Optionally fade in when ready
  return (
    <div className={ready ? "opacity-100 transition-opacity duration-200" : "opacity-0 pointer-events-none"}>
      {children}
    </div>
  );
}
