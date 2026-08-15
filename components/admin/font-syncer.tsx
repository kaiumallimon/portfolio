"use client";

import { useEffect } from "react";

export default function AdminFontSyncer({ fontFamily }: { fontFamily: string }) {
  useEffect(() => {
    const previous = document.body.style.fontFamily;
    document.body.style.fontFamily = fontFamily;
    return () => {
      document.body.style.fontFamily = previous;
    };
  }, [fontFamily]);
  return null;
}