"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown, Search, X } from "lucide-react";
import { Badge } from "@/components/Section";

const mono = "font-mono text-[11px] uppercase tracking-[0.12em]";
const chip = (on: boolean) => `min-h-10 border px-3 text-sm font-semibold transition-colors ${on ? "border-rule bg-foreground text-background" : "border-rule hover:bg-surface-alt"}`;

/* FAQ: live search with highlighted matches and topic chips. */
type FaqGroup = { group: string; items: { q: string; a: string }[] };

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return <>{parts.map((p, i) => (p.toLowerCase() === q.toLowerCase() ? <mark key={i} className="bg-sky px-0.5 text-foreground">{p}</mark> : p))}</>;
}

export function FaqSearch({ groups }: { groups: FaqGroup[] }) {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const term = q.trim();
  const shown = groups
    .filter((g) => !topic || g.group === topic)
    .map((g) => ({ ...g, items: g.items.filter((it) => !term || `${it.q} ${it.a}`.toLowerCase().includes(term.toLowerCase())) }))
    .filter((g) => g.items.length);
  const count = shown.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="max-w-text">
      <label className="relative block">
        <span className="sr-only">Search questions</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: HIPAA, cost, languages…" className="block min-h-12 w-full border border-rule bg-surface pl-11 pr-11 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" />
        {q && (
          <button type="button" onClick={() => setQ("")} className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center hover:text-accent" aria-label="Clear search">
            <X className="size-4" aria-hidden />
          </button>
        )}
      </label>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Topics">
        <button type="button" aria-pressed={!topic} onClick={() => setTopic(null)} className={chip(!topic)}>All</button>
        {groups.map((g) => (
          <button key={g.group} type="button" aria-pressed={topic === g.group} onClick={() => setTopic(topic === g.group ? null : g.group)} className={chip(topic === g.group)}>{g.group}</button>
        ))}
      </div>
      <p className={`${mono} mt-6 text-muted`} aria-live="polite">{count} question{count === 1 ? "" : "s"}</p>

      <div className="mt-4 space-y-10">
        {shown.map((g) => (
          <div key={g.group}>
            <h2 className="mb-3 text-2xl">{g.group}</h2>
            <div className="divide-y divide-rule border-y border-rule">
              {g.items.map((f) => (
                <details key={f.q} className="group animate-[ct-rise_350ms_cubic-bezier(0.2,0.7,0.2,1)_both]" open={!!term}>
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                    <span><Highlight text={f.q} q={term} /></span>
                    <ChevronDown className="size-5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-180" aria-hidden />
                  </summary>
                  <p className="pb-5 text-muted"><Highlight text={f.a} q={term} /></p>
                </details>
              ))}
            </div>
          </div>
        ))}
        {count === 0 && (
          <div className="border border-rule bg-surface p-6">
            <p className="font-semibold">No questions match “{term}”.</p>
            <p className="mt-1 text-muted">Ask us directly. We reply within two business days.</p>
            <Link href="/request" className="mt-4 inline-block font-semibold underline underline-offset-4 hover:text-accent">Send a request</Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* Work: filter by label; cards re-enter when the filter changes. */
type WorkItem = { label: string; title: string; body: string; status: string };

export function WorkGrid({ items }: { items: WorkItem[] }) {
  const labels = Array.from(new Set(items.map((i) => i.label)));
  const [f, setF] = useState<string | null>(null);
  const shown = items.filter((i) => !f || i.label === f);
  return (
    <>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter work">
        <button type="button" aria-pressed={!f} onClick={() => setF(null)} className={chip(!f)}>All · {items.length}</button>
        {labels.map((l) => (
          <button key={l} type="button" aria-pressed={f === l} onClick={() => setF(f === l ? null : l)} className={chip(f === l)}>
            {l} · {items.filter((i) => i.label === l).length}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-px border border-rule bg-rule md:grid-cols-2" aria-live="polite">
        {shown.map((item, k) => (
          <article key={`${f}-${item.title}`} className="group relative flex animate-[ct-rise_400ms_cubic-bezier(0.2,0.7,0.2,1)_both] flex-col overflow-hidden bg-background p-6 transition-colors hover:bg-surface md:p-8" style={{ animationDelay: `${k * 60}ms` }}>
            <div className="flex items-start justify-between gap-4">
              <Badge tone={item.label === "Concept" ? "neutral" : "accent"}>{item.label}</Badge>
              <span className="font-mono text-sm text-muted">{String(items.indexOf(item) + 1).padStart(2, "0")}</span>
            </div>
            <h2 className="mt-6 text-2xl transition-transform duration-300 group-hover:translate-x-1">{item.title}</h2>
            <p className="mt-2 flex-1 text-muted">{item.body}</p>
            <p className="mt-6 border-t border-rule pt-4 text-sm"><span className="font-semibold">Status:</span> <span className="text-muted">{item.status}</span></p>
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
          </article>
        ))}
      </div>
    </>
  );
}

/* About: our story as chapters you can click or arrow through. */
const CHAPTERS = [
  { title: "The translator club", body: "We started out volunteering as medical translators. We saw how much a language barrier can get in the way of care." },
  { title: "Inside a clinic", body: "We also work inside a clinic, so we know the front desk: phones that don't stop, coverage questions, paperwork in one language." },
  { title: "Seeing the gaps", body: "Small clinics do a lot with very little technology support. The same few problems came up again and again." },
  { title: "ClinicTech", body: "So we started building the tools we wished those clinics had: a website that works on a phone, language access and plain-language insurance guides." },
];

export function StoryTimeline() {
  const [i, setI] = useState(0);
  const step = (d: number) => setI((n) => (n + d + CHAPTERS.length) % CHAPTERS.length);
  const c = CHAPTERS[i];
  return (
    <div
      className="border border-rule"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
    >
      <div role="tablist" aria-label="Our story" className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-4">
        {CHAPTERS.map((ch, k) => (
          <button key={ch.title} role="tab" aria-selected={k === i} aria-controls="story-panel" tabIndex={k === i ? 0 : -1} onClick={() => setI(k)} className={`relative min-h-16 px-4 py-3 text-left transition-colors ${k === i ? "bg-foreground text-background" : "bg-background hover:bg-surface-alt"}`}>
            <span className="block font-mono text-[11px] opacity-70">{String(k + 1).padStart(2, "0")}</span>
            <span className="block text-sm font-semibold">{ch.title}</span>
            {k < i && <span aria-hidden className="absolute right-3 top-3 size-2 bg-accent" />}
          </button>
        ))}
      </div>
      <div id="story-panel" role="tabpanel" className="grid gap-6 border-t border-rule bg-surface p-6 md:grid-cols-[10rem_minmax(0,1fr)] md:p-10">
        <div className="h-[6.5rem] overflow-hidden" aria-hidden>
          <span key={i} className="block animate-[ct-rise_450ms_cubic-bezier(0.2,0.7,0.2,1)_both] text-[6.5rem] font-bold leading-none tracking-[-0.06em] text-accent">{String(i + 1).padStart(2, "0")}</span>
        </div>
        <div>
          <h2 key={`t${i}`} className="animate-[ct-rise_400ms_cubic-bezier(0.2,0.7,0.2,1)_both] text-h2">{c.title}</h2>
          <p key={`b${i}`} className="mt-4 max-w-text animate-[ct-rise_400ms_cubic-bezier(0.2,0.7,0.2,1)_both] text-lg [animation-delay:80ms]">{c.body}</p>
          <div className="mt-8 flex items-center gap-2">
            <button type="button" onClick={() => step(-1)} className="grid size-11 place-items-center border border-rule hover:bg-foreground hover:text-background" aria-label="Previous chapter"><ArrowLeft className="size-4" aria-hidden /></button>
            <button type="button" onClick={() => step(1)} className="grid size-11 place-items-center border border-rule hover:bg-foreground hover:text-background" aria-label="Next chapter"><ArrowRight className="size-4" aria-hidden /></button>
            <span className={`${mono} ml-3 text-muted`}>Chapter {i + 1} of {CHAPTERS.length} · arrow keys work too</span>
          </div>
          <div className="mt-4 h-1 bg-surface-alt" aria-hidden>
            <span className="block h-full origin-left bg-accent transition-transform duration-500" style={{ transform: `scaleX(${(i + 1) / CHAPTERS.length})` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
