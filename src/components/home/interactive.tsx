"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, PhoneOff } from "lucide-react";

const mono = "font-mono text-[11px] uppercase tracking-[0.12em]";

function reduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const GREETINGS = [
  { lang: "English", text: "Welcome" },
  { lang: "Spanish", text: "Bienvenido" },
  { lang: "Vietnamese", text: "Chào mừng" },
  { lang: "Chinese", text: "欢迎" },
  { lang: "Tagalog", text: "Maligayang pagdating" },
  { lang: "Arabic", text: "أهلاً وسهلاً", rtl: true },
  { lang: "Korean", text: "환영합니다" },
  { lang: "Haitian Creole", text: "Byenveni" },
  { lang: "Russian", text: "Добро пожаловать" },
  { lang: "Hindi", text: "स्वागत है" },
  { lang: "Portuguese", text: "Bem-vindo" },
  { lang: "French", text: "Bienvenue" },
];

/* Cycling welcome in many languages. Click to advance; hover pauses. */
export function GreetingCycler() {
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (hover || reduced()) return;
    const t = setInterval(() => setI((n) => (n + 1) % GREETINGS.length), 2200);
    return () => clearInterval(t);
  }, [hover]);
  const g = GREETINGS[i];
  return (
    <button
      type="button"
      onClick={() => setI((n) => (n + 1) % GREETINGS.length)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group block w-full border border-white/60 p-4 text-left hover:bg-white/10 focus-visible:outline-white"
      aria-label={`${g.text}, “welcome” in ${g.lang}. Press for the next language.`}
    >
      <span className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em]">
        <span>{g.lang}</span>
        <span>{String(i + 1).padStart(2, "0")} / {GREETINGS.length}</span>
      </span>
      <span className="mt-3 block h-[1.2em] overflow-hidden text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.2] tracking-[-0.02em]">
        <span key={i} dir={g.rtl ? "rtl" : "ltr"} className="block animate-[ct-rise_450ms_cubic-bezier(0.2,0.7,0.2,1)_both]">{g.text}</span>
      </span>
      <span className="mt-2 block h-0.5 bg-white/30">
        <span key={`bar-${i}-${hover}`} className={`block h-full origin-left bg-white ${hover ? "scale-x-0" : "animate-[ct-fill_2200ms_linear_both]"}`} />
      </span>
    </button>
  );
}

/* Endless language band. Pauses on hover; click a language to read the greeting. */
export function LanguageMarquee() {
  const [picked, setPicked] = useState<number | null>(null);
  const items = [...GREETINGS, ...GREETINGS];
  return (
    <div className="border-y border-rule bg-foreground text-background">
      <div className="group relative overflow-hidden py-4">
        <ul className="flex w-max animate-[ct-marquee_40s_linear_infinite] gap-0 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
          {items.map((g, k) => (
            <li key={k} aria-hidden={k >= GREETINGS.length}>
              <button
                type="button"
                tabIndex={k >= GREETINGS.length ? -1 : 0}
                onClick={() => setPicked(k % GREETINGS.length)}
                className={`flex items-baseline gap-3 border-r border-background/30 px-6 text-2xl font-bold tracking-[-0.03em] transition-colors hover:text-sky ${picked === k % GREETINGS.length ? "text-sky" : ""}`}
              >
                <span dir={g.rtl ? "rtl" : "ltr"}>{g.text}</span>
                <span className="font-mono text-[11px] font-normal uppercase tracking-[0.12em] text-background/60">{g.lang}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p aria-live="polite" className="border-t border-background/30 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-background/70 sm:px-6 lg:px-10">
        {picked === null ? "Hover to pause · click a language" : `“Welcome” in ${GREETINGS[picked].lang}: ${GREETINGS[picked].text}`}
      </p>
    </div>
  );
}

/* One intake form, translated live. Labels flip out and back in, staggered. */
const FORM_LANGS = [
  { code: "en", name: "English", labels: ["Full name", "Date of birth", "Reason for visit", "Allergies"], submit: "Check in" },
  { code: "es", name: "Español", labels: ["Nombre completo", "Fecha de nacimiento", "Motivo de la visita", "Alergias"], submit: "Registrarse" },
  { code: "vi", name: "Tiếng Việt", labels: ["Họ và tên", "Ngày sinh", "Lý do khám", "Dị ứng"], submit: "Đăng ký" },
  { code: "zh", name: "中文", labels: ["姓名", "出生日期", "就诊原因", "过敏史"], submit: "登记" },
  { code: "tl", name: "Tagalog", labels: ["Buong pangalan", "Petsa ng kapanganakan", "Dahilan ng pagbisita", "Mga allergy"], submit: "Mag-check in" },
  { code: "ar", name: "العربية", labels: ["الاسم الكامل", "تاريخ الميلاد", "سبب الزيارة", "الحساسية"], submit: "تسجيل الوصول", rtl: true },
];

export function FormTranslator() {
  const [i, setI] = useState(0);
  const L = FORM_LANGS[i];
  return (
    <div className="grid gap-px border border-rule bg-rule md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="flex flex-col justify-between gap-8 bg-background p-6 md:p-8">
        <div role="radiogroup" aria-label="Form language" className="grid grid-cols-2 gap-2">
          {FORM_LANGS.map((l, k) => (
            <button
              key={l.code}
              type="button"
              role="radio"
              aria-checked={k === i}
              onClick={() => setI(k)}
              className={`min-h-11 border px-3 text-left text-[15px] font-semibold transition-colors ${k === i ? "border-rule bg-foreground text-background" : "border-rule hover:bg-surface-alt"}`}
            >
              {l.name}
            </button>
          ))}
        </div>
        <p className={`${mono} text-muted`}>Demo labels · real patient materials are reviewed by qualified translators</p>
      </div>

      <div className="bg-surface p-6 md:p-10" lang={L.code} dir={L.rtl ? "rtl" : "ltr"}>
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <span className={`${mono} text-muted`}>Intake form · {L.name}</span>
          <span className="size-2.5 animate-pulse bg-accent" aria-hidden />
        </div>
        <div className="mt-6 grid gap-5">
          {L.labels.map((label, k) => (
            <div key={k}>
              <span className="block h-[1.4em] overflow-hidden text-sm font-semibold">
                <span key={`${L.code}-${k}`} className="block animate-[ct-rise_400ms_cubic-bezier(0.2,0.7,0.2,1)_both]" style={{ animationDelay: `${k * 70}ms` }}>
                  {label}
                </span>
              </span>
              <span className="mt-1.5 block h-11 border border-rule bg-background" aria-hidden />
            </div>
          ))}
        </div>
        <span className="mt-6 inline-flex min-h-11 items-center bg-accent px-5 font-semibold text-white" aria-hidden>
          <span key={L.code} className="animate-[ct-rise_400ms_cubic-bezier(0.2,0.7,0.2,1)_both]" style={{ animationDelay: "280ms" }}>{L.submit}</span>
        </span>
      </div>
    </div>
  );
}

/* A day at the front desk: scrub through the hours, toggle ClinicTech on. Illustrative numbers. */
const HOURS = ["8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];
const CALL_TYPES = [
  { key: "hours", label: "Hours & directions", movable: true },
  { key: "booking", label: "Booking", movable: true },
  { key: "coverage", label: "Coverage questions", movable: true },
  { key: "clinical", label: "Clinical & everything else", movable: false },
] as const;
// Calls per hour by type (illustrative only).
const DAY: number[][] = [
  [3, 4, 1, 2], [4, 6, 2, 3], [3, 5, 3, 3], [2, 3, 2, 3], [3, 3, 2, 2],
  [2, 2, 2, 2], [2, 3, 3, 3], [3, 4, 3, 3], [2, 3, 2, 2], [2, 2, 1, 1],
];
const SHIFT = 0.6; // share of movable calls a site and coverage pages could answer (illustrative)

export function DaySimulator() {
  const [hour, setHour] = useState(1);
  const [withUs, setWithUs] = useState(false);
  const calls = (h: number) => DAY[h].map((n, k) => (withUs && CALL_TYPES[k].movable ? Math.round(n * (1 - SHIFT)) : n));
  const total = (h: number) => calls(h).reduce((a, b) => a + b, 0);
  const dayTotal = HOURS.reduce((a, _, h) => a + total(h), 0);
  const max = 15;
  const now = calls(hour);

  return (
    <div className="flex h-full flex-col bg-background p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className={`${mono} text-muted`}>Phone calls per hour</p>
        <button type="button" role="switch" aria-checked={withUs} onClick={() => setWithUs((v) => !v)} className="inline-flex min-h-11 items-center gap-3 border border-rule px-3 text-sm font-semibold hover:bg-surface-alt">
          <span className={`relative h-5 w-9 border border-rule transition-colors ${withUs ? "bg-accent" : "bg-surface"}`}>
            <span className={`absolute top-0.5 size-3.5 bg-foreground transition-transform duration-300 ${withUs ? "translate-x-[18px]" : "translate-x-0.5"}`} />
          </span>
          With ClinicTech
        </button>
      </div>

      <div className="mt-8 flex h-44 items-end gap-1.5" aria-hidden>
        {HOURS.map((h, k) => (
          <button key={h} type="button" tabIndex={-1} onClick={() => setHour(k)} className="group flex h-full flex-1 flex-col justify-end">
            <span
              className={`block w-full origin-bottom transition-[transform,background-color] duration-500 ease-out ${k === hour ? "bg-accent" : "bg-sky group-hover:bg-muted"}`}
              style={{ height: "100%", transform: `scaleY(${total(k) / max})` }}
            />
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5 font-mono text-[10px] text-muted" aria-hidden>
        {HOURS.map((h, k) => <span key={h} className={`flex-1 text-center ${k === hour ? "text-foreground" : ""}`}>{h}</span>)}
      </div>

      <label className="mt-4 block">
        <span className="sr-only">Hour of the day</span>
        <input type="range" min={0} max={HOURS.length - 1} value={hour} onChange={(e) => setHour(Number(e.target.value))} className="w-full accent-[var(--accent)]" aria-valuetext={`${HOURS[hour]}: ${total(hour)} calls`} />
      </label>

      <dl className="mt-6 grid gap-2 border-t border-rule pt-4" aria-live="polite">
        {CALL_TYPES.map((t, k) => (
          <div key={t.key} className="grid grid-cols-[minmax(0,1fr)_6rem_2rem] items-center gap-3 text-sm">
            <dt className={t.movable && withUs ? "text-muted line-through decoration-1" : ""}>{t.label}</dt>
            <dd className="h-2 bg-surface-alt" aria-hidden>
              <span className="block h-full origin-left bg-foreground transition-transform duration-500" style={{ transform: `scaleX(${now[k] / 6})` }} />
            </dd>
            <dd className="text-right font-mono">{now[k]}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-2xl font-bold tracking-[-0.03em]">
        {HOURS[hour]}: {total(hour)} calls · {dayTotal} today
      </p>
      <p className={`${mono} mt-2 text-muted`}>Illustrative · not measured at a real clinic</p>
    </div>
  );
}

/* The phone that stops ringing: answer a call and see which page would have answered it. */
const CALLS = [
  { q: "What time do you close today?", a: "Hours on your site, right at the top" },
  { q: "Can I book for next Tuesday?", a: "Online appointment request" },
  { q: "¿Tienen a alguien que hable español?", a: "Spanish pages and translated forms" },
  { q: "Do you take my insurance?", a: "Plain-language coverage page" },
  { q: "Where do I park?", a: "Directions page with a map" },
];

export function RingingPhone() {
  const [k, setK] = useState(0);
  const [state, setState] = useState<"ringing" | "answered">("ringing");
  const [typed, setTyped] = useState("");
  const [count, setCount] = useState(0);
  const call = CALLS[k];

  useEffect(() => {
    if (state !== "answered") return;
    if (reduced()) {
      setTyped(call.q);
      return;
    }
    setTyped("");
    let n = 0;
    const t = setInterval(() => {
      n++;
      setTyped(call.q.slice(0, n));
      if (n >= call.q.length) clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, [state, call.q]);

  function answer() {
    setState("answered");
    setCount((c) => c + 1);
  }
  function next() {
    setK((n) => (n + 1) % CALLS.length);
    setState("ringing");
  }

  const done = typed === call.q;
  return (
    <div className="flex h-full flex-col bg-surface p-6 md:p-8">
      <p className={`${mono} text-muted`}>Calls answered before they ring · {count}</p>
      <div className="mt-6 flex flex-1 flex-col items-start gap-6">
        {state === "ringing" ? (
          <button type="button" onClick={answer} className="group flex items-center gap-4 text-left" aria-label="Incoming call. Answer it.">
            <span className="relative grid size-16 place-items-center bg-accent text-white">
              <span className="absolute inset-0 animate-ping bg-accent/40" aria-hidden />
              <Phone className="relative size-7 animate-[ct-ring_1.2s_ease-in-out_infinite]" aria-hidden />
            </span>
            <span>
              <span className="block text-xl font-bold tracking-[-0.02em]">Incoming call</span>
              <span className="block text-sm text-muted group-hover:text-accent">Tap to answer</span>
            </span>
          </button>
        ) : (
          <>
            <div className="w-full border border-rule bg-background p-4">
              <p className={`${mono} text-muted`}>Caller</p>
              <p className="mt-2 min-h-[3em] text-xl font-bold tracking-[-0.02em]">
                {typed}
                {!done && <span className="ml-0.5 inline-block h-5 w-0.5 translate-y-0.5 animate-pulse bg-foreground" aria-hidden />}
              </p>
            </div>
            <div className={`w-full border border-accent bg-surface-alt p-4 transition-all duration-500 ${done ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`} aria-live="polite">
              <p className={`${mono} text-accent`}>Answered online by</p>
              <p className="mt-2 font-semibold">{done ? call.a : ""}</p>
            </div>
            <button type="button" onClick={next} className="inline-flex min-h-11 items-center gap-2 border border-rule px-4 text-sm font-semibold hover:bg-foreground hover:text-background">
              <PhoneOff className="size-4" aria-hidden /> Next call
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* Accent rule that draws down a list as you scroll through it. */
export function ScrollRule() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    let raf = 0;
    const update = () => {
      const r = host.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
      el.style.transform = `scaleY(${p})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return <span ref={ref} aria-hidden className="absolute -left-px top-0 h-full w-0.5 origin-top bg-accent" style={{ transform: "scaleY(0)" }} />;
}
