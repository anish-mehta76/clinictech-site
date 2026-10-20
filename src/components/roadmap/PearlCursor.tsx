"use client";

import { useEffect, useRef } from "react";

/** Small pearl that trails the pointer. Desktop (fine pointer) only; off for reduced motion. */
export function PearlCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ok = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
    const el = ref.current;
    if (!ok || !el) return;
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0;
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; el.style.opacity = "1"; };
    const leave = () => { el.style.opacity = "0"; };
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate(${x - 6}px, ${y - 6}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);
  return <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-50 size-3 rounded-full border border-foreground bg-surface-alt opacity-0 transition-opacity duration-200" />;
}
