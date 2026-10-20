"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Set NEXT_PUBLIC_FORMSPREE_ID in .env.local (from formspree.io) so submissions go straight to email.
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

const CLINIC_TYPES = ["Primary care", "Pediatrics", "Dental", "Urgent care", "Specialty", "Community health center", "Other"];
const SERVICES = ["Website", "AI translation / language access", "Insurance & benefits help", "Not sure yet"];
const TIMELINES = ["As soon as possible", "Within 1–3 months", "3–6 months", "Just exploring"];

const input = "mt-2 block min-h-12 w-full rounded-sm border border-rule bg-surface px-3 py-2.5 text-base text-foreground placeholder:text-muted/80 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";
const label = "block text-base font-medium";

// Fields the progress meter counts as "answered".
const TRACKED: { name: string; label: string }[] = [
  { name: "clinic_name", label: "Clinic" },
  { name: "contact_name", label: "Name" },
  { name: "email", label: "Email" },
  { name: "clinic_type", label: "Type" },
  { name: "services", label: "Services" },
  { name: "languages", label: "Languages" },
  { name: "timeline", label: "Timeline" },
];

export function IntakeForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const [answered, setAnswered] = useState<string[]>([]);

  const recount = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    setAnswered(TRACKED.filter((t) => data.getAll(t.name).some((v) => String(v).trim() !== "")).map((t) => t.name));
  }, []);

  // Prefill from the Services page program builder (?services=A|B&languages=...).
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const q = new URLSearchParams(window.location.search);
    const services = q.get("services")?.split("|") ?? [];
    form.querySelectorAll<HTMLInputElement>('input[name="services"]').forEach((cb) => {
      if (services.includes(cb.value)) cb.checked = true;
    });
    const langs = q.get("languages");
    const langInput = form.querySelector<HTMLInputElement>('input[name="languages"]');
    if (langs && langInput && !langInput.value) langInput.value = langs;
    recount();
  }, [recount]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!FORMSPREE_ID) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      body: new FormData(e.currentTarget),
      headers: { Accept: "application/json" },
    }).catch(() => null);
    setStatus(res?.ok ? "sent" : "error");
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-success/30 bg-success/10 p-8" role="status">
        <h2 className="text-2xl text-success">Thanks — we got your request.</h2>
        <p className="mt-2 text-muted">We&apos;ll reach out within two business days.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} onInput={recount} onChange={recount} className="space-y-6 rounded-lg border border-rule bg-surface p-5 sm:p-8">
      <div className="sticky top-16 z-10 -mx-5 -mt-5 border-b border-rule bg-surface px-5 py-3 sm:-mx-8 sm:-mt-8 sm:px-8" aria-live="polite">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em]">
          <span className="text-muted">{answered.length} of {TRACKED.length} answered</span>
          <span className={answered.length === TRACKED.length ? "text-accent" : "text-muted"}>{answered.length === TRACKED.length ? "Ready to send" : `${Math.round((answered.length / TRACKED.length) * 100)}%`}</span>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1" aria-hidden>
          {TRACKED.map((t) => (
            <span key={t.name} className="block">
              <span className={`block h-1.5 transition-colors duration-300 ${answered.includes(t.name) ? "bg-accent" : "bg-surface-alt"}`} />
              <span className={`mt-1 hidden truncate font-mono text-[10px] sm:block ${answered.includes(t.name) ? "text-foreground" : "text-muted"}`}>{t.label}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="clinic_name" className={label}>Clinic name</label>
          <input id="clinic_name" name="clinic_name" required className={input} />
        </div>
        <div>
          <label htmlFor="contact_name" className={label}>Your name</label>
          <input id="contact_name" name="contact_name" required className={input} />
        </div>
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" name="email" type="email" required className={input} />
        </div>
        <div>
          <label htmlFor="phone" className={label}>Phone <span className="font-normal text-muted">(optional)</span></label>
          <input id="phone" name="phone" type="tel" className={input} />
        </div>
      </div>

      <div>
        <label htmlFor="clinic_type" className={label}>Clinic type</label>
        <select id="clinic_type" name="clinic_type" required defaultValue="" className={input}>
          <option value="" disabled>Choose one</option>
          {CLINIC_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <fieldset>
        <legend className={label}>Services you&apos;re interested in</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <label key={s} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border border-rule px-3 text-base hover:border-accent/50 has-[:checked]:border-accent has-[:checked]:bg-accent-soft">
              <input type="checkbox" name="services" value={s} className="size-5 accent-[var(--accent)]" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="has_website" className={label}>Do you have a website now?</label>
          <select id="has_website" name="has_website" defaultValue="" className={input}>
            <option value="" disabled>Choose one</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div>
          <label htmlFor="website_url" className={label}>Current website link <span className="font-normal text-muted">(if any)</span></label>
          <input id="website_url" name="website_url" type="url" placeholder="https://" className={input} />
        </div>
      </div>

      <div>
        <label htmlFor="languages" className={label}>Languages your patients speak</label>
        <input id="languages" name="languages" placeholder="e.g. English, Spanish, Vietnamese" className={input} />
      </div>

      <div className="sm:max-w-[calc(50%-0.75rem)]">
        <label htmlFor="timeline" className={label}>Timeline</label>
        <select id="timeline" name="timeline" defaultValue="" className={input}>
          <option value="" disabled>Choose one</option>
          {TIMELINES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className={label}>Anything else?</label>
        <textarea id="notes" name="notes" rows={4} aria-describedby="notes-help" className={input} placeholder="Goals, questions, what's not working today. Please no patient information." />
        <p id="notes-help" className="mt-2 text-sm text-muted">Do not include patient names, records or other patient information.</p>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700" role="alert">
          {FORMSPREE_ID ? "Something went wrong sending your request. Please try again or email us." : "The form isn't connected yet (missing NEXT_PUBLIC_FORMSPREE_ID)."}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-accent px-6 font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60 sm:w-auto">
        {status === "sending" ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
