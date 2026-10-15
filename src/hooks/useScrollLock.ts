"use client";

import { useEffect } from "react";

export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    root.dataset.scrollLock = "true";
    return () => {
      delete root.dataset.scrollLock;
    };
  }, [active]);
}
