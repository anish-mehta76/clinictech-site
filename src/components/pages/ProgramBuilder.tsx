"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Arrow } from "@/components/Button";

const mono = "font-mono text-[11px] uppercase tracking-[0.12em]";

// `form` values match the intake form's service checkboxes.
const PIECES = [
  { id: "websites", form: "Website", title: "Clinic website", steps: ["Visit and map how your front desk works", "Design and build a mobile-first site", "Launch with online booking requests"] },
  { id: "translation", form: "AI translation / language access", title: "Language access", steps: ["Pick the languages and materials that matter most", "Translate forms, discharge sheets and texts", "Set up interpreter support at the front desk"] },
  { id: "insurance", form: "Insurance & benefits help", title: "Insurance help", steps: ["List the plans you accept", "Write plain-language coverage pages", "Add a simple benefits checker for staff"] },
];

const LANGS = ["Spanish", "Vietnamese", "Chinese", "Tagalog", "Arabic", "Korean", "Haitian Creole", "Russian"];

export function ProgramBuilder() {
  const [picked, setPicked] = useState<string[]>(["websites"]);
  const [langs, setLangs] = useState<string[]>(["Spanish"]);
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const chosen = PIECES.filter((p) => picked.includes(p.id));
  const steps = chosen.flatMap((p) => p.steps.map((s) => ({ piece: p.title, s })));
  const params = new URLSearchParams();
  if (chosen.length) params.set("services", chosen.map((p) => p.form).join("|"));
  if (langs.length) params.set("languages", ["English", ...langs].join(", "));

  return (
    <div className="grid gap-px border border-rule bg-rule lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="space-y-8 bg-background p-6 md:p-8">
        <fieldset>
          <legend className={`${mono} text-muted`}>1 · Pick what you need</legend>
          <div className="mt-3 grid gap-2">
            {PIECES.map((p) => {
              const on = picked.includes(p.id);
              return (
                <button key={p.id} type="button" aria-pressed={on} onClick={() => setPicked((l) => toggle(l, p.id))} className={`flex min-h-12 items-center justify-between gap-4 border border-rule px-4 text-left font-semibold transition-colors ${on ? "bg-foreground text-background" : "hover:bg-surface-alt"}`}>
                  {p.title}
                  <span className={`grid size-6 place-items-center border transition-colors ${on ? "border-background bg-accent" : "border-rule"}`} aria-hidden>
                    <Check className={`size-4 text-white transition-transform duration-200 ${on ? "scale-100" : "scale-0"}`} />
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
        <fieldset>
          <legend className={`${mono} text-muted`}>2 · Languages your patients speak, besides English</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {LANGS.map((l) => {
              const on = langs.includes(l);
              return (
                <button key={l} type="button" aria-pressed={on} onClick={() => setLangs((x) => toggle(x, l))} className={`min-h-10 border px-3 text-sm transition-colors ${on ? "border-accent bg-accent text-white" : "border-rule hover:bg-surface-alt"}`}>
                  {l}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col bg-surface p-6 md:p-8">
        <p className={`${mono} text-muted`}>Your program · {steps.length} steps · {langs.length + 1} language{langs.length ? "s" : ""}</p>
        {steps.length === 0 ? (
          <p className="mt-6 flex-1 text-muted">Pick at least one piece to see a program.</p>
        ) : (
          <ol className="relative mt-6 flex-1 space-y-4 border-l border-rule pl-6" aria-live="polite">
            {steps.map((st, k) => (
              <li key={`${picked.join()}-${k}`} className="relative animate-[ct-rise_400ms_cubic-bezier(0.2,0.7,0.2,1)_both]" style={{ animationDelay: `${k * 60}ms` }}>
                <span className="absolute -left-[29px] top-1.5 size-2.5 border border-rule bg-accent" aria-hidden />
                <span className={`${mono} text-accent`}>{st.piece}</span>
                <span className="block">{st.s}</span>
              </li>
            ))}
          </ol>
        )}
        <Link
          href={`/request${params.toString() ? `?${params}` : ""}`}
          aria-disabled={steps.length === 0}
          className={`group mt-8 inline-flex min-h-12 items-center justify-between gap-6 bg-accent px-5 font-semibold text-white hover:bg-accent-hover ${steps.length === 0 ? "pointer-events-none opacity-50" : ""}`}
        >
          Request this program <Arrow />
        </Link>
        <p className={`${mono} mt-3 text-muted`}>Free for clinics · we fill your choices into the request form</p>
      </div>
    </div>
  );
}
