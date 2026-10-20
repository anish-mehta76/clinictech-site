import { forwardRef } from "react";
import { HOME, START, STAGES, type StageId } from "./content";
import { Seal } from "./ornaments";

const POINTS: [number, number][] = [START, ...STAGES.map((s) => s.at), HOME];

function segment([ax, ay]: [number, number], [bx, by]: [number, number]) {
  const mx = (ax + bx) / 2;
  return `M${ax} ${ay} C${mx} ${ay}, ${mx} ${by}, ${bx} ${by}`;
}

// Original single-weight line icons, drawn in a 64 × 64 box centered on 0,0.
const ICONS: Record<StageId | "home", React.ReactNode> = {
  find: (
    <>
      <rect x="-14" y="-24" width="28" height="46" rx="6" />
      <circle cx="1" cy="-3" r="7" />
      <path d="M6 2 L12 9" />
      <path d="M-4 16 H4" />
    </>
  ),
  book: (
    <>
      <rect x="-20" y="-16" width="40" height="36" rx="4" />
      <path d="M-20 -6 H20 M-10 -22 V-11 M10 -22 V-11" />
      <circle cx="-9" cy="5" r="2" /><circle cx="0" cy="5" r="2" /><circle cx="9" cy="5" r="2" /><circle cx="-9" cy="13" r="2" />
    </>
  ),
  checkin: (
    <>
      <rect x="-16" y="-20" width="32" height="42" rx="4" />
      <rect x="-7" y="-25" width="14" height="9" rx="3" />
      <path d="M-9 -5 H9 M-9 3 H9 M-9 11 H3" />
    </>
  ),
  visit: (
    <>
      <path d="M-22 -16 H6 V2 H-10 L-17 9 V2 H-22 Z" />
      <path d="M-2 6 V14 H12 L19 21 V14 H22 V-4 H10" />
    </>
  ),
  coverage: (
    <>
      <path d="M0 -24 L18 -16 V0 C18 12, 8 20, 0 24 C-8 20, -18 12, -18 0 V-16 Z" />
      <path d="M-8 0 L-2 6 L9 -6" />
    </>
  ),
  followup: (
    <>
      <rect x="-20" y="-14" width="40" height="28" rx="3" />
      <path d="M-20 -12 L0 4 L20 -12" />
    </>
  ),
  home: (
    <>
      <path d="M-20 -2 L0 -20 L20 -2" />
      <path d="M-14 -6 V20 H14 V-6" />
      <rect x="-5" y="6" width="10" height="14" />
    </>
  ),
};

type Props = { connected: boolean; sealed: boolean; active: string; transform: string; paused: boolean };

export const RoadmapMap = forwardRef<SVGGElement, Props>(function RoadmapMap({ connected, sealed, active, transform, paused }, camRef) {
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-labelledby="rm-map-title" data-paused={paused}>
      <title id="rm-map-title">
        {`Map of a patient's path through a small clinic: find, book, check in, visit, coverage, follow-up. ${connected ? "The path is connected with ClinicTech." : "The path has gaps."}`}
      </title>
      <g ref={camRef} transform={transform}>
        {/* Paper ground */}
        <rect x="-400" y="-300" width="2400" height="1600" fill="var(--background)" />
        <g fill="none" stroke="var(--foreground)" strokeOpacity="0.06" strokeWidth="1.5">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M-200 ${i * 130 - 40} C 200 ${i * 130 - 90}, 500 ${i * 130 + 20}, 900 ${i * 130 - 40} S 1500 ${i * 130 + 10}, 1900 ${i * 130 - 50}`} />
          ))}
        </g>

        {/* The path: broken stitches without us, a sewn line with us. */}
        {POINTS.slice(0, -1).map((p, i) => {
          const d = segment(p, POINTS[i + 1]);
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="var(--border)" strokeWidth="10" strokeLinecap="round" />
              <path
                d={d}
                fill="none"
                stroke={connected ? "var(--accent)" : "var(--muted)"}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={connected ? "12 6" : "4 22"}
                className={connected ? "rm-sew" : ""}
                style={{ transition: "stroke 400ms ease" }}
              />
            </g>
          );
        })}

        {/* Start pearl */}
        <circle cx={START[0]} cy={START[1]} r="9" fill="var(--surface-alt)" stroke="var(--foreground)" strokeWidth="2.5" />

        {/* Landmarks */}
        {STAGES.map((st, i) => {
          const [x, y] = st.at;
          const isActive = active === st.id;
          const above = y > 500;
          return (
            <g key={st.id} className="rm-landmark" tabIndex={0} aria-label={`${st.name}: ${st.note}`} role="img">
              {/* Stop pearl on the path */}
              <circle cx={x} cy={y} r="11" fill={connected ? "var(--accent)" : "var(--background)"} stroke="var(--foreground)" strokeWidth="2.5" className={isActive ? "rm-shimmer" : ""} style={{ transition: "fill 400ms ease" }} />
              {/* Card with flat offset shadow */}
              <g transform={`translate(${x} ${above ? y + 82 : y - 82})`}>
                <rect x="-40" y="-40" width="88" height="88" fill="var(--border)" />
                <rect className="rm-card" x="-44" y="-44" width="88" height="88" fill={isActive ? "var(--surface-alt)" : "var(--surface)"} stroke="var(--foreground)" strokeWidth="2" style={{ transition: "fill 300ms ease" }} />
                <g fill="none" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{ICONS[st.id]}</g>
                <text x="-36" y="-30" fontSize="11" fill="var(--muted)" style={{ fontFamily: "var(--font-plex-mono)" }}>{String(i + 1).padStart(2, "0")}</text>
                {/* Hover note: a small paper tag */}
                <g className="rm-note" transform={`translate(54 ${above ? 20 : -30})`}>
                  <path d="M0 0 H210 V34 H0 L-8 17 Z" fill="var(--surface)" stroke="var(--foreground)" strokeWidth="1.5" />
                  <circle cx="4" cy="17" r="2.5" fill="var(--foreground)" />
                  <text x="14" y="22" fontSize="13" fill="var(--foreground)" style={{ fontFamily: "var(--font-archivo)" }}>{st.note}</text>
                </g>
              </g>
              <text x={x} y={above ? y - 24 : y + 38} textAnchor="middle" fontSize="20" fontWeight="700" fill="var(--foreground)" style={{ fontFamily: "var(--font-archivo)", letterSpacing: "-0.02em" }}>
                {st.name}
              </text>
            </g>
          );
        })}

        {/* Home: the clinic, sealed at the end */}
        <g transform={`translate(${HOME[0]} ${HOME[1] - 82})`}>
          <rect x="-40" y="-40" width="88" height="88" fill="var(--border)" />
          <rect x="-44" y="-44" width="88" height="88" fill="var(--surface)" stroke="var(--foreground)" strokeWidth="2" />
          <g fill="none" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{ICONS.home}</g>
          {sealed && (
            <g transform="translate(22 22)">
              <svg x="-4" y="-4" width="52" height="52" viewBox="0 0 100 100" overflow="visible"><Seal /></svg>
            </g>
          )}
        </g>
        <circle cx={HOME[0]} cy={HOME[1]} r="11" fill={connected ? "var(--accent)" : "var(--background)"} stroke="var(--foreground)" strokeWidth="2.5" />
        <text x={HOME[0]} y={HOME[1] + 38} textAnchor="middle" fontSize="20" fontWeight="700" fill="var(--foreground)" style={{ fontFamily: "var(--font-archivo)" }}>Your clinic</text>
      </g>
    </svg>
  );
});
