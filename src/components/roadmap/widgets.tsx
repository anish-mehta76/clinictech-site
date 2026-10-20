"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { CHECKLIST, FACTS, WORKFLOWS, type Stage } from "./content";
import { PIECE_PATH, PaperCard, Pearl, Seal } from "./ornaments";

const mono = "font-mono text-[11px] uppercase tracking-[0.12em]";

function useInView<T extends Element>(threshold = 0.5) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* 1. Stage card — flips to show pain points, our fix and timing. */
export function StageCard({ stage, index }: { stage: Stage; index: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="group [perspective:1200px]">
      <div className="rm-flip grid" data-flipped={flipped}>
        <PaperCard lift={false} className="rm-face [grid-area:1/1]">
          <div inert={flipped}>
            <p className={`${mono} text-muted`}>Stop {String(index + 1).padStart(2, "0")} · {stage.service}</p>
            <p className="mt-3 text-lg">{stage.line}</p>
            <button type="button" onClick={() => setFlipped(true)} className={`rm-press mt-6 inline-flex min-h-11 items-center border border-foreground bg-surface-alt px-4 text-sm font-semibold`}>
              Flip for details
            </button>
          </div>
        </PaperCard>
        <PaperCard lift={false} className="rm-face rm-face-back [grid-area:1/1]">
          <div inert={!flipped}>
            <p className={`${mono} text-muted`}>Where it hurts</p>
            <ul className="mt-3 space-y-2">
              {stage.pains.map((p) => (
                <li key={p} className="flex items-baseline gap-3"><Pearl filled={false} className="translate-y-[-1px]" />{p}</li>
              ))}
            </ul>
            <p className={`${mono} mt-5 text-muted`}>What we build</p>
            <p className="mt-1 font-semibold">{stage.fix}</p>
            <p className={`${mono} mt-4 text-muted`}>Timing: <span className="normal-case tracking-normal text-foreground">{stage.setup}</span></p>
            <button type="button" onClick={() => setFlipped(false)} className="mt-5 text-sm font-semibold underline underline-offset-4 hover:text-accent">
              Flip back
            </button>
          </div>
        </PaperCard>
      </div>
    </div>
  );
}

/* 2. "Where we fit" — drag our piece into the gap, or press the button. */
export function FitPuzzle({ placed, onPlace }: { placed: boolean; onPlace: () => void }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    if (placed) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y });
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag) return;
    setOffset({ x: drag.ox + e.clientX - drag.x, y: drag.oy + e.clientY - drag.y });
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!drag) return;
    setDrag(null);
    const slot = slotRef.current?.getBoundingClientRect();
    if (slot && e.clientX > slot.left - 30 && e.clientX < slot.right + 30 && e.clientY > slot.top - 30 && e.clientY < slot.bottom + 30) {
      onPlace();
    } else {
      setOffset({ x: 0, y: 0 });
    }
  }

  return (
    <PaperCard>
      <p className={`${mono} text-muted`}>{placed ? "Connected" : "Drag the piece into the gap"}</p>
      <div className="mt-5 flex items-center gap-3">
        <Pearl />
        <span className="h-px flex-1 border-t-2 border-dashed border-foreground" />
        <div ref={slotRef} className="relative h-[80px] w-[120px] shrink-0">
          <svg viewBox="-4 -10 128 90" className="absolute inset-0 h-full w-full" aria-hidden>
            <path d={PIECE_PATH} fill={placed ? "var(--accent)" : "none"} stroke="var(--foreground)" strokeWidth="2" strokeDasharray={placed ? "0" : "6 5"} style={{ transition: "fill 300ms ease" }} />
            {placed && <text x="60" y="46" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--background)" style={{ fontFamily: "var(--font-archivo)" }}>ClinicTech</text>}
          </svg>
          {placed && <div className="absolute -right-6 -top-8 size-14"><Seal /></div>}
        </div>
        <span className="h-px flex-1 border-t-2 border-dashed border-foreground" />
        <Pearl />
      </div>

      {!placed && (
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <button
            type="button"
            aria-label="Our piece. Drag it into the gap, or press Enter to place it."
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => { setDrag(null); setOffset({ x: 0, y: 0 }); }}
            onClick={(e) => e.detail === 0 && onPlace()}
            className={`relative h-[80px] w-[120px] touch-none select-none ${drag ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ transform: `translate(${offset.x}px, ${offset.y}px)`, transition: drag ? "none" : "transform 300ms ease", zIndex: 20 }}
          >
            <svg viewBox="-4 -10 128 90" className="h-full w-full" aria-hidden>
              <path d={PIECE_PATH} transform="translate(4 4)" fill="var(--border)" />
              <path d={PIECE_PATH} fill="var(--accent)" stroke="var(--foreground)" strokeWidth="2" />
              <text x="60" y="46" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff" style={{ fontFamily: "var(--font-archivo)" }}>ClinicTech</text>
            </svg>
          </button>
          <button type="button" onClick={onPlace} className="rm-press inline-flex min-h-11 items-center border border-foreground bg-surface-alt px-4 text-sm font-semibold">
            Place our piece
          </button>
        </div>
      )}
    </PaperCard>
  );
}

/* 3. With / without — a ribbon switch. */
export function RibbonToggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-4">
      <span className={`text-sm font-semibold ${on ? "text-muted" : ""}`}>Without us</span>
      <button type="button" role="switch" aria-checked={on} aria-label="Show the workflow with ClinicTech" onClick={() => onChange(!on)} className="relative h-11 w-24 shrink-0">
        <svg viewBox="0 0 96 44" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M0 10 H96 L88 22 L96 34 H0 L8 22 Z" fill={on ? "var(--accent)" : "var(--surface-alt)"} stroke="var(--foreground)" strokeWidth="2" style={{ transition: "fill 250ms ease" }} />
        </svg>
        <span
          aria-hidden
          className="absolute top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border-2 border-foreground bg-surface transition-[left] duration-300 ease-out"
          style={{ left: on ? "calc(100% - 2.6rem)" : "0.35rem" }}
        >
          <span className="size-3 rounded-full bg-foreground" />
        </span>
      </button>
      <span className={`text-sm font-semibold ${on ? "" : "text-muted"}`}>With us</span>
    </div>
  );
}

/* 4. Step-count shrink: beads drop away when we take over. */
export function BeadWorkflow({ withUs }: { withUs: boolean }) {
  const [i, setI] = useState(0);
  const wf = WORKFLOWS[i];
  return (
    <PaperCard>
      <div role="tablist" aria-label="Workflow" className="flex flex-wrap gap-2">
        {WORKFLOWS.map((w, idx) => (
          <button key={w.id} role="tab" aria-selected={idx === i} onClick={() => setI(idx)} className={`min-h-10 border px-3 text-sm ${idx === i ? "border-foreground bg-surface-alt font-semibold" : "border-border hover:border-foreground"}`}>
            {w.label}
          </button>
        ))}
      </div>
      <ol className="mt-6 grid gap-2" aria-live="polite">
        {wf.before.map((step, idx) => {
          const keep = idx < wf.after.length;
          const gone = withUs && !keep;
          return (
            <li key={`${wf.id}-${idx}`} className={`grid transition-[grid-template-rows,opacity,translate] duration-500 ease-out ${gone ? "grid-rows-[0fr] translate-y-2 opacity-0" : "grid-rows-[1fr]"}`} aria-hidden={gone}>
              <span className="flex min-h-0 items-center gap-3 overflow-hidden">
                <span className={`size-4 shrink-0 rounded-full border-2 border-foreground transition-colors duration-300 ${withUs && keep ? "bg-accent" : "bg-surface-alt"}`} />
                <span className={withUs && keep ? "font-semibold" : "text-muted"}>{withUs && keep ? wf.after[idx] : step}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <p className={`${mono} mt-5 text-muted`}>
        {withUs ? wf.after.length : wf.before.length} steps · Example steps, to be replaced with counts from our pilot
      </p>
    </PaperCard>
  );
}

/* 5. Before/after slider: tangled thread vs one stitched line. */
const TANGLE = "M20 120 C60 20, 110 220, 150 110 S 200 20, 230 120 C250 190, 180 200, 200 140 S 300 40, 330 130 C350 200, 280 210, 300 150 S 400 60, 420 120 C440 180, 380 190, 400 130 S 470 80, 500 120";
const TANGLE_STOPS = [[20, 120], [150, 110], [230, 120], [330, 130], [420, 120], [500, 120]];

export function BeforeAfter() {
  const [pct, setPct] = useState(50);
  return (
    <PaperCard className="px-0 py-0">
      <div className="relative aspect-[520/240] w-full select-none overflow-hidden">
        <svg viewBox="0 0 520 240" className="absolute inset-0 h-full w-full" aria-hidden>
          <rect width="520" height="240" fill="var(--surface)" />
          <path d={TANGLE} fill="none" stroke="var(--muted)" strokeWidth="3" strokeLinecap="round" strokeDasharray="7 5" />
          {TANGLE_STOPS.map(([x, y], k) => <circle key={k} cx={x} cy={y} r="8" fill="var(--surface-alt)" stroke="var(--foreground)" strokeWidth="2" />)}
          <text x="20" y="226" fontSize="13" fill="var(--muted)" style={{ fontFamily: "var(--font-plex-mono)" }}>BEFORE · 6 HAND-OFFS</text>
        </svg>
        <svg viewBox="0 0 520 240" className="absolute inset-0 h-full w-full" style={{ clipPath: `inset(0 0 0 ${pct}%)` }} aria-hidden>
          <rect width="520" height="240" fill="var(--surface-alt)" />
          <path d="M20 120 H500" fill="none" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="12 6" className="rm-sew" />
          <circle cx="20" cy="120" r="8" fill="var(--accent)" stroke="var(--foreground)" strokeWidth="2" />
          <circle cx="500" cy="120" r="8" fill="var(--accent)" stroke="var(--foreground)" strokeWidth="2" />
          <text x="500" y="226" textAnchor="end" fontSize="13" fill="var(--foreground)" style={{ fontFamily: "var(--font-plex-mono)" }}>AFTER · ONE HOP</text>
        </svg>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 bg-foreground" style={{ left: `${pct}%` }}>
          <span className="absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-foreground bg-surface font-mono text-xs">⇆</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
          aria-label="Compare before and after. Slide left to see more of the after."
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
    </PaperCard>
  );
}

/* 6. Time calculator — clearly an estimate. */
function Stepper({ label, value, min, max, onChange, unit }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; unit?: string }) {
  return (
    <div>
      <p className="text-sm font-semibold" id={`lbl-${label}`}>{label}</p>
      <div className="mt-2 inline-flex items-stretch border border-foreground" role="group" aria-labelledby={`lbl-${label}`}>
        <button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)} className="grid size-11 place-items-center hover:bg-surface-alt disabled:opacity-40"><Minus className="size-4" aria-hidden /></button>
        <output className="grid min-w-16 place-items-center border-x border-foreground px-2 font-mono text-sm" aria-live="polite">{value}{unit}</output>
        <button type="button" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)} className="grid size-11 place-items-center hover:bg-surface-alt disabled:opacity-40"><Plus className="size-4" aria-hidden /></button>
      </div>
    </div>
  );
}

const SHARE = 0.25;

export function TimeCalculator() {
  const [staff, setStaff] = useState(2);
  const [hours, setHours] = useState(10);
  const saved = Math.round(staff * hours * SHARE);
  const beads = Math.min(saved, 40);
  return (
    <PaperCard>
      <div className="flex flex-wrap gap-6">
        <Stepper label="Front desk staff" value={staff} min={1} max={8} onChange={setStaff} />
        <Stepper label="Hours each, per week, on calls, forms and coverage questions" value={hours} min={1} max={30} onChange={setHours} unit="h" />
      </div>
      <div className="mt-6 flex flex-wrap gap-1.5" aria-hidden>
        {Array.from({ length: 40 }, (_, k) => (
          <span key={k} className={`size-3.5 rounded-full border border-foreground transition-colors duration-300 ${k < beads ? "bg-accent" : "bg-transparent opacity-30"}`} style={{ transitionDelay: `${k * 12}ms` }} />
        ))}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-[-0.03em]" aria-live="polite">
        About {saved} hour{saved === 1 ? "" : "s"} a week back{saved > 40 ? " (40+ shown)" : ""}
      </p>
      <p className={`${mono} mt-2 text-muted`}>Estimate · assumes we can take about a quarter of that time off your plate · not a measured result</p>
    </PaperCard>
  );
}

/* 7. Checklist that ticks itself when scrolled into view. */
export function SelfChecklist() {
  const [ref, inView] = useInView<HTMLUListElement>(0.6);
  const [done, setDone] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setDone(CHECKLIST.length);
      return;
    }
    const t = setInterval(() => setDone((d) => (d >= CHECKLIST.length ? d : d + 1)), 450);
    return () => clearInterval(t);
  }, [inView]);
  return (
    <ul ref={ref} className="space-y-3">
      {CHECKLIST.map((item, k) => {
        const checked = k < done;
        return (
          <li key={item} className="flex items-start gap-3">
            <svg viewBox="0 0 24 24" className="mt-0.5 size-6 shrink-0" aria-hidden>
              <rect x="2" y="2" width="20" height="20" fill={checked ? "var(--accent)" : "var(--surface)"} stroke="var(--foreground)" strokeWidth="2" style={{ transition: "fill 250ms ease" }} />
              <path d="M6.5 12.5 L10.5 16 L17.5 8" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="20" strokeDashoffset={checked ? 0 : 20} style={{ transition: "stroke-dashoffset 300ms ease" }} />
            </svg>
            <span className={checked ? "" : "text-muted"}>
              {item}
              <span className="sr-only">{checked ? " (handled)" : ""}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/* Counters with hover/tap notes. Process facts only — no invented outcomes. */
function Counter({ value, suffix, label, note }: (typeof FACTS)[number]) {
  const [ref, inView] = useInView<HTMLDivElement>(0.6);
  const [n, setN] = useState(value);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!inView || prefersReducedMotion() || value === 0) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 700);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className="rm-lift block w-full border border-foreground bg-surface p-4 text-left">
        <span className="block text-4xl font-bold tracking-[-0.04em]">{n}{suffix}</span>
        <span className="mt-1 block text-sm text-muted">{label}</span>
      </button>
      <p className={`absolute left-2 right-2 top-full z-10 mt-2 border border-foreground bg-surface-alt px-3 py-2 text-sm transition-opacity duration-200 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} role="note">
        {note}
      </p>
    </div>
  );
}

export function Counters() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {FACTS.map((f) => <Counter key={f.label} {...f} />)}
    </div>
  );
}
