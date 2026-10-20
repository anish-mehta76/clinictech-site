"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, RotateCcw } from "lucide-react";
import { Arrow } from "@/components/Button";
import { Badge, Eyebrow } from "@/components/Section";
import { ScrollRule } from "./interactive";

const mono = "font-mono text-[11px] uppercase tracking-[0.12em]";

/* Method: a giant step numeral that follows whichever row you hover, focus or scroll to. */
export function MethodSteps({ steps }: { steps: { title: string; body: string }[] }) {
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  // Active row = the last one whose top has passed 60% of the viewport (robust to jump-scrolling).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const line = window.innerHeight * 0.6;
      let a = 0;
      rows.current.forEach((r, i) => { if (r && r.getBoundingClientRect().top < line) a = i; });
      setActive(a);
    };
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", on); };
  }, []);

  return (
    <>
      <div className="md:col-span-4">
        <div className="md:sticky md:top-28">
          <Eyebrow>01 / Method</Eyebrow>
          <h2 className="mt-3 text-h2">We start at your front desk, not with a template.</h2>
          <div className="mt-8 hidden h-[9rem] overflow-hidden md:block" aria-hidden>
            <span key={active} className="block animate-[ct-rise_450ms_cubic-bezier(0.2,0.7,0.2,1)_both] text-[9rem] font-bold leading-none tracking-[-0.06em] text-accent">
              {String(active + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-4 hidden h-1 bg-surface-alt md:block" aria-hidden>
            <span className="block h-full origin-left bg-foreground transition-transform duration-500" style={{ transform: `scaleX(${(active + 1) / steps.length})` }} />
          </div>
        </div>
      </div>
      <ol className="relative border-t border-rule md:col-span-8">
        <ScrollRule />
        {steps.map((m, i) => (
          <li
            key={m.title}
            ref={(el) => { rows.current[i] = el; }}
            data-i={i}
            tabIndex={0}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={`grid cursor-default gap-2 border-b border-rule py-7 transition-colors duration-300 focus-visible:outline-offset-[-2px] sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-6 lg:grid-cols-[4rem_minmax(0,14rem)_minmax(0,1fr)] ${active === i ? "bg-surface" : ""}`}
          >
            <span className={`pl-4 font-mono text-sm transition-colors ${active === i ? "text-accent" : "text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={`text-xl transition-transform duration-300 ${active === i ? "translate-x-1" : ""}`}>{m.title}</h3>
            <p className="text-muted sm:col-start-2 lg:col-start-auto">{m.body}</p>
          </li>
        ))}
      </ol>
    </>
  );
}

/* Friction → fix: click a row to fix it. */
export function FrictionFixer({ items }: { items: { pain: string; fix: string }[] }) {
  const [fixed, setFixed] = useState<boolean[]>(() => items.map(() => false));
  const count = fixed.filter(Boolean).length;
  const all = count === items.length;
  const toggle = (i: number) => setFixed((f) => f.map((v, k) => (k === i ? !v : v)));

  return (
    <div className="md:col-span-7">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
        <span className={`${mono} text-muted`} aria-live="polite">{count} of {items.length} fixed · click a row</span>
        <button type="button" onClick={() => setFixed(items.map(() => !all))} className="inline-flex min-h-10 items-center gap-2 border border-rule px-3 text-sm font-semibold hover:bg-foreground hover:text-background">
          {all ? <><RotateCcw className="size-4" aria-hidden /> Reset</> : <>Fix all</>}
        </button>
      </div>
      <div className="h-0.5" aria-hidden>
        <span className="block h-full origin-left bg-accent transition-transform duration-500" style={{ transform: `scaleX(${count / items.length})` }} />
      </div>
      <ul>
        {items.map((f, i) => (
          <li key={f.pain}>
            <button
              type="button"
              aria-pressed={fixed[i]}
              onClick={() => toggle(i)}
              className="grid w-full grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-3 border-b border-rule py-4 text-left transition-colors hover:bg-background sm:grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-6"
            >
              <span className={`mt-0.5 grid size-6 place-items-center border border-rule transition-colors duration-300 ${fixed[i] ? "bg-accent text-white" : "bg-surface"}`} aria-hidden>
                <Check className={`size-4 transition-transform duration-300 ${fixed[i] ? "scale-100" : "scale-0"}`} />
              </span>
              <span className={`text-muted transition-all duration-300 [text-wrap:pretty] ${fixed[i] ? "line-through decoration-1 opacity-60" : ""}`}>{f.pain}</span>
              <span className={`col-start-2 font-semibold transition-all duration-300 sm:col-start-auto ${fixed[i] ? "text-accent" : ""}`}>
                {fixed[i] && <span className="sr-only">Fixed: </span>}{f.fix}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Work list with a preview card that trails the cursor (fine pointers). */
export function WorkIndex({ items }: { items: { label: string; title: string; body: string; status: string }[] }) {
  const host = useRef<HTMLUListElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [fine, setFine] = useState(false);
  useEffect(() => setFine(window.matchMedia("(pointer: fine)").matches), []);

  return (
    <ul
      ref={host}
      className="relative border-t border-rule md:col-span-8"
      onPointerMove={(e) => {
        const r = host.current?.getBoundingClientRect();
        if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onPointerLeave={() => setHover(null)}
    >
      {items.map((w, i) => (
        <li key={w.title} onPointerEnter={() => setHover(i)}>
          <Link href="/work" className="group grid gap-2 border-b border-rule py-5 hover:bg-surface sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6">
            <span><Badge tone={w.label === "Concept" ? "neutral" : "accent"}>{w.label}</Badge></span>
            <span className="text-xl font-bold tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-2 group-hover:text-accent">{w.title}</span>
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{w.status}</span>
          </Link>
        </li>
      ))}
      {fine && (
        <div
          aria-hidden
          className={`pointer-events-none absolute left-0 top-0 z-10 w-72 border border-rule bg-surface p-4 shadow-[4px_4px_0_0_var(--color-rule)] transition-opacity duration-200 ${hover === null ? "opacity-0" : "opacity-100"}`}
          style={{ transform: `translate(${Math.min(pos.x + 24, (host.current?.clientWidth ?? 600) - 300)}px, ${pos.y + 18}px)` }}
        >
          {hover !== null && (
            <>
              <p className={`${mono} text-accent`}>{items[hover].label}</p>
              <p className="mt-2 text-sm">{items[hover].body}</p>
            </>
          )}
        </div>
      )}
    </ul>
  );
}

/* A CTA button that leans toward the cursor while it's in the band. */
export function MagneticCta({ children }: { children: React.ReactNode }) {
  const zone = useRef<HTMLDivElement>(null);
  const [d, setD] = useState({ x: 0, y: 0 });
  return (
    <div
      ref={zone}
      className="p-4 -m-4"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const r = zone.current!.getBoundingClientRect();
        setD({ x: ((e.clientX - r.left) / r.width - 0.5) * 16, y: ((e.clientY - r.top) / r.height - 0.5) * 10 });
      }}
      onPointerLeave={() => setD({ x: 0, y: 0 })}
    >
      <Link
        href="/request"
        className="group flex min-h-14 w-full items-center justify-between gap-6 bg-accent px-6 text-lg font-semibold text-white transition-[transform,background-color] duration-200 ease-out hover:bg-accent-hover focus-visible:outline-white"
        style={{ transform: `translate(${d.x}px, ${d.y}px)` }}
      >
        {children}
        <Arrow />
      </Link>
    </div>
  );
}
