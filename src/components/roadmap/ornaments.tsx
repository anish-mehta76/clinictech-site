import { useId } from "react";

/** A row of half-circles along an edge, like pinked paper. Fill matches the card it sits on. */
export function Scallop({ side = "top", fill = "var(--surface)" }: { side?: "top" | "bottom"; fill?: string }) {
  const id = useId();
  return (
    <svg aria-hidden className={`pointer-events-none absolute left-0 h-[7px] w-full ${side === "top" ? "-top-[6px]" : "-bottom-[6px] rotate-180"}`}>
      <defs>
        <pattern id={id} width="14" height="7" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="6" fill={fill} />
        </pattern>
      </defs>
      <rect width="100%" height="7" fill={`url(#${id})`} />
    </svg>
  );
}

/** Scalloped paper card with a flat offset shadow. */
export function PaperCard({ children, className = "", lift = true }: { children: React.ReactNode; className?: string; lift?: boolean }) {
  // Flip-card faces pass lift={false}: a hover transform there would overwrite the rotateY and make the card tremble.
  return (
    <div className={`${lift ? "rm-lift" : "rm-shadow"} relative border-x border-border bg-surface px-6 py-7 ${className}`}>
      <Scallop side="top" />
      <Scallop side="bottom" />
      {children}
    </div>
  );
}

export function Pearl({ filled = true, className = "" }: { filled?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block size-2.5 shrink-0 rounded-full border border-foreground ${filled ? "bg-surface-alt" : "bg-transparent"} ${className}`}
    />
  );
}

/** Geometric bow: two loops and two tails. Loops sway; `untied` lets them fall away. */
export function Bow({ untied = false, className = "" }: { untied?: boolean; className?: string }) {
  const loop = "transition-all duration-500 ease-out";
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden>
      <g fill="var(--surface-alt)" stroke="var(--foreground)" strokeWidth="2.5" strokeLinejoin="round">
        <g className={`${loop} ${untied ? "-translate-x-6 translate-y-6 -rotate-45 opacity-0" : ""}`} style={{ transformBox: "fill-box", transformOrigin: "100% 50%" }}>
          <path className="rm-sway" d="M100 56 C70 20, 28 22, 30 50 C32 78, 72 78, 100 56 Z" />
        </g>
        <g className={`${loop} ${untied ? "translate-x-6 translate-y-6 rotate-45 opacity-0" : ""}`} style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}>
          <path className="rm-sway" style={{ animationDelay: "-2.2s" }} d="M100 56 C130 20, 172 22, 170 50 C168 78, 128 78, 100 56 Z" />
        </g>
        <g className={`${loop} ${untied ? "translate-y-10 opacity-0" : ""}`}>
          <path d="M96 60 L74 112 L86 104 L92 116 L100 62 Z" />
          <path d="M104 60 L126 112 L114 104 L108 116 L100 62 Z" />
        </g>
        <rect x="90" y="46" width="20" height="20" rx="5" fill="var(--accent)" className={`${loop} ${untied ? "scale-50 opacity-0" : ""}`} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      </g>
    </svg>
  );
}

function scallopCircle(cx: number, cy: number, r: number, bumps: number) {
  const pts: string[] = [];
  for (let i = 0; i <= bumps * 2; i++) {
    const a = (i / (bumps * 2)) * Math.PI * 2;
    const rr = i % 2 === 0 ? r : r * 0.9;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
}

const SEAL_EDGE = scallopCircle(50, 50, 46, 18);

/** Wax-seal stamp for milestone moments. Re-mount (via `key`) to replay the stamp. */
export function Seal({ className = "", label = "CT" }: { className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`rm-stamp ${className}`} aria-hidden>
      <path d={SEAL_EDGE} fill="var(--accent)" stroke="var(--foreground)" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="var(--background)" strokeWidth="2" strokeDasharray="3 4" />
      <text x="50" y="58" textAnchor="middle" fontSize="24" fontWeight="700" fill="var(--background)" style={{ fontFamily: "var(--font-archivo)", letterSpacing: "-0.04em" }}>
        {label}
      </text>
    </svg>
  );
}

/** One puzzle-piece outline, shared by the slot and the draggable piece. 120 × 80 box. */
export const PIECE_PATH =
  "M6 6 H48 C48 -6, 72 -6, 72 6 H114 V30 C126 30, 126 50, 114 50 V74 H72 C72 62, 48 62, 48 74 H6 V50 C18 50, 18 30, 6 30 Z";
