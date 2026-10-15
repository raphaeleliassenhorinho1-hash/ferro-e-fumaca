"use client";

import { useSyncExternalStore } from "react";

const MINUTE = 60_000;

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, MINUTE);
  return () => clearInterval(id);
}

const getMinute = () => Math.floor(Date.now() / MINUTE);
const getServerMinute = () => null;

/** Current time rounded to the minute, or null during SSR/hydration (avoids mismatches). */
export function useNow(): Date | null {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  return minute === null ? null : new Date(minute * MINUTE);
}
