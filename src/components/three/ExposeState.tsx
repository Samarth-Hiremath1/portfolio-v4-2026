"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { RootState } from "@react-three/fiber";

/**
 * Dev tooling: registers each R3F canvas state on window so headless
 * previews (no rAF) can advance frames manually. No-op in production.
 */
export default function ExposeState() {
  const state = useThree();
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const w = window as unknown as {
      __r3f?: RootState;
      __r3fAll?: RootState[];
    };
    w.__r3fAll = w.__r3fAll ?? [];
    w.__r3fAll.push(state);
    if (!w.__r3f) w.__r3f = state;
    return () => {
      w.__r3fAll = (w.__r3fAll ?? []).filter((s) => s !== state);
      if (w.__r3f === state) w.__r3f = w.__r3fAll[0];
    };
  }, [state]);
  return null;
}
