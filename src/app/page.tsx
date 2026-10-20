import Link from "next/link";
import { Arrow, Button } from "@/components/Button";
import { Badge, Eyebrow, container } from "@/components/Section";
import { PITCH, SERVICES, TRUST, WORK } from "@/lib/site";
import { DaySimulator, FormTranslator, GreetingCycler, LanguageMarquee, RingingPhone } from "@/components/home/interactive";
import { FrictionFixer, MagneticCta, MethodSteps, WorkIndex } from "@/components/home/sections";

const METHOD = [
  { title: "We come to you", body: "We reach out, visit, and sit with your front desk for a day. No forms to fill before we've listened." },
  { title: "We map the workflow", body: "Calls, check-in, forms, languages, insurance questions — we write down where the time actually goes." },
  { title: "We build a tailored program", body: "A plan sized to your clinic: a new site, translated materials, coverage guides, or all three. Scope and timeline up front." },
  { title: "We stay on", body: "We adjust after launch, train your staff, and keep the tools current as the clinic changes." },
];

const FRICTION = [
  { pain: "Phones ringing for hours and directions", fix: "A site that answers first" },
  { pain: "Booking by phone only", fix: "Online appointment requests" },
  { pain: "Intake forms in one language", fix: "Translated forms and texts" },
  { pain: "Waiting on an interpreter at check\u2011in", fix: "AI support for interpreters" },
  { pain: "“Do you take my insurance?”", fix: "Plain-language coverage pages" },
  { pain: "Eligibility look-ups by hand", fix: "A simple benefits checker for staff" },
];

// Left edge of the 80rem container, so the hero text lines up with the rest of the page while the red panel bleeds right.
const heroInset = "pl-4 pr-4 sm:pl-6 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:pr-12";

export default function Home() {
  const [web, ...rest] = SERVICES;

  return (
    <>
      {/* Hero: offset left, red index panel bleeding to the right edge. */}
      <section className="grid border-b border-rule lg:grid-cols-[minmax(0,1fr)_minmax(0,34%)]">
        <div className={`${heroInset} flex flex-col justify-between gap-12 py-14 lg:min-h-[78vh] lg:py-20`}>
          <Eyebrow>{"ClinicTech — Workflow programs for small clinics"}</Eyebrow>
          <div>
            <h1 className="max-w-[12ch] text-[clamp(3rem,8.5vw,8rem)] leading-[0.92] tracking-[-0.045em]">
              We fix how your clinic <span className="text-accent">runs.</span>
            </h1>
            <div className="mt-10 grid gap-8 md:grid-cols-12">
              <p className="text-lg text-muted md:col-span-7">{PITCH}</p>
              <div className="flex flex-col gap-3 md:col-span-5 md:items-start">
                <Button href="/request" className="w-full sm:w-auto">Request a project</Button>
                <Button href="/roadmap" variant="text">Follow a patient&apos;s path</Button>
              </div>
            </div>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-4 font-mono text-xs uppercase tracking-[0.1em] text-muted">
            {TRUST.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>

        <aside aria-label="What we build" className="flex flex-col justify-between bg-accent px-4 py-10 text-white sm:px-6 lg:px-10 lg:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-white">Index</p>
          <ol className="mt-10 divide-y divide-white/60 border-y border-white/60">
            {SERVICES.map((s, i) => (
              <li key={s.id}>
                <Link href={`/services#${s.id}`} className="group flex items-baseline gap-5 py-5 hover:bg-white/10 focus-visible:outline-white">
                  <span className="font-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-2xl font-bold tracking-[-0.03em] lg:text-[1.75rem]">{s.title}</span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="mt-10"><GreetingCycler /></div>
          <p className="mt-6 max-w-[28ch] text-sm text-white">
            Every program is put together for one clinic. We start with whichever piece hurts most.
          </p>
        </aside>
      </section>

      {/* Method: editorial numbered list. */}
      <section id="method" className="scroll-mt-16 border-b border-rule">
        <div className={`${container} grid gap-10 py-16 md:grid-cols-12 md:py-24`}>
          <MethodSteps steps={METHOD} />
        </div>
      </section>

      {/* Services: bento grid drawn with 1px rules (gap-px over the ink background). */}
      <section className="border-b border-rule">
        <div className={`${container} py-16 md:py-24`}>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Eyebrow>02 / Programs</Eyebrow>
              <h2 className="mt-3 text-h2">Three building blocks.</h2>
            </div>
            <Button href="/services" variant="text">All services</Button>
          </div>

          <div className="mt-10 grid gap-px border border-rule bg-rule md:grid-cols-6">
            <Link href={`/services#${web.id}`} className="group flex flex-col justify-between gap-16 bg-background p-6 hover:bg-surface md:col-span-4 md:row-span-2 md:p-10">
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-sm">01</span>
                <Badge>Where most clinics start</Badge>
              </div>
              <div>
                <h3 className="text-[clamp(2rem,4.5vw,3.75rem)] leading-[0.95] tracking-[-0.04em]">{web.title}</h3>
                <p className="mt-5 max-w-text text-muted">{web.problem}</p>
                <ul className="mt-6 grid gap-px border border-rule bg-rule sm:grid-cols-3">
                  {web.build.map((b, k) => (
                    <li key={b} className="bg-background px-3 py-3 text-sm transition-colors duration-500 group-hover:bg-foreground group-hover:text-background group-hover:[transition-delay:var(--d)] group-focus-visible:bg-foreground group-focus-visible:text-background group-focus-visible:[transition-delay:var(--d)]" style={{ "--d": `${k * 700}ms` } as React.CSSProperties}>
                      <span className="block font-mono text-[11px] opacity-60">{String(k + 1).padStart(2, "0")}</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold group-hover:text-accent">{web.short} <Arrow /></span>
              </div>
            </Link>
            {rest.map((s, i) => (
              <Link key={s.id} href={`/services#${s.id}`} className="group relative flex min-h-[17rem] flex-col justify-between gap-10 overflow-hidden bg-background p-6 hover:bg-surface md:col-span-2">
                <span className="font-mono text-sm">{String(i + 2).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-2xl">{s.title}</h3>
                  <p className="mt-3 text-[15px] text-muted">{s.short}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold group-hover:text-accent">Details <Arrow /></span>
                </div>
                <div aria-hidden className="absolute inset-0 flex translate-y-full flex-col overflow-y-auto bg-accent p-5 text-white transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em]">What we build</p>
                  <ul className="mt-3 space-y-2 text-sm leading-snug">
                    {s.build.map((b) => <li key={b} className="border-t border-white/40 pt-2">{b}</li>)}
                  </ul>
                </div>
              </Link>
            ))}
            <p className="bg-foreground p-6 text-background md:col-span-6 md:px-10">
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-background/70">Note — </span>
              AI translation supports qualified interpreters; it doesn&apos;t replace them. Anything that touches patient data runs on HIPAA-compliant vendors who sign a BAA.
            </p>
          </div>
        </div>
      </section>

      {/* Friction → fix: dense list against a single large statement (zig-zag density). */}
      <section className="border-b border-rule bg-surface-alt">
        <div className={`${container} grid gap-10 py-16 md:grid-cols-12 md:py-24`}>
          <div className="md:col-span-5">
            <Eyebrow>03 / What we look for</Eyebrow>
            <p className="mt-3 text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.03em]">
              The small, repeated tasks that quietly eat a clinic&apos;s day.
            </p>
          </div>
          <FrictionFixer items={FRICTION} />
        </div>
      </section>

      {/* Language: live form translator, then the language band. */}
      <section className="border-b border-rule">
        <div className={`${container} grid gap-10 py-16 md:grid-cols-12 md:py-24`}>
          <div className="md:col-span-4">
            <Eyebrow>04 / Language</Eyebrow>
            <h2 className="mt-3 text-h2">One form, every language your patients speak.</h2>
            <p className="mt-4 text-muted">Pick a language. The same intake form, ready before the patient reaches the desk.</p>
          </div>
          <div className="md:col-span-8"><FormTranslator /></div>
        </div>
      </section>
      <LanguageMarquee />

      {/* The front desk: day simulator next to the phone that stops ringing. */}
      <section className="border-b border-rule">
        <div className={`${container} py-16 md:py-24`}>
          <div className="max-w-text">
            <Eyebrow>05 / The front desk</Eyebrow>
            <h2 className="mt-3 text-h2">Fewer calls you didn&apos;t need to take.</h2>
          </div>
          <div className="mt-10 grid gap-px border border-rule bg-rule lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <DaySimulator />
            <RingingPhone />
          </div>
        </div>
      </section>

      {/* Work: honest index, labels first. */}
      <section className="border-b border-rule">
        <div className={`${container} grid gap-10 py-16 md:grid-cols-12 md:py-24`}>
          <div className="md:col-span-4">
            <Eyebrow>06 / Work</Eyebrow>
            <h2 className="mt-3 text-h2">New, and labeled honestly.</h2>
            <p className="mt-4 text-muted">Concepts are made-up clinics that show our design work. Pilots are real projects in progress.</p>
            <Button href="/work" variant="text" className="mt-6">See our work</Button>
          </div>
          <WorkIndex items={WORK} />
        </div>
      </section>

      {/* Closing band. */}
      <section className="bg-foreground text-background">
        <div className={`${container} grid gap-10 py-16 md:grid-cols-12 md:items-end md:py-28`}>
          <div className="md:col-span-8">
            <Eyebrow className="text-background/60">07 / Start</Eyebrow>
            <h2 className="mt-4 text-[clamp(2.5rem,6.5vw,6rem)] leading-[0.95] tracking-[-0.045em]">
              Tell us how your clinic runs.
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-background/75">
              Our work is free for clinics. We reply within two business days.
            </p>
            <div className="mt-6"><MagneticCta>Request a project</MagneticCta></div>
          </div>
        </div>
      </section>
    </>
  );
}
