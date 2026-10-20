import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Button } from "@/components/Button";
import { CtaBand, PageHeader, Section } from "@/components/Section";
import { ServiceIcon } from "@/components/ServiceIcon";
import { ProgramBuilder } from "@/components/pages/ProgramBuilder";
import { SERVICES } from "@/lib/site";

export const metadata: Metadata = { title: "Services" };

export default function Services() {
  return (
    <>
      <PageHeader eyebrow="What we do" title="Services" intro="Most clinics start with a website. Once we know your clinic, we can help with language access and insurance questions too." />
      {SERVICES.map((s, i) => (
        <Section key={s.id} id={s.id} tone={i % 2 === 1 ? "alt" : undefined}>
          <div className="flex items-center gap-4">
            <ServiceIcon id={s.id} />
            <h2 className="text-[1.75rem] leading-tight md:text-h2">{s.title}</h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-rule bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted font-sans">The problem</h3>
              <p className="mt-3">{s.problem}</p>
            </div>
            <div className="rounded-lg border border-rule bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted font-sans">What we build</h3>
              <ul className="mt-3 space-y-2">
                {s.build.map((b) => (
                  <li key={b} className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden />{b}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-rule bg-surface-alt p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-accent font-sans">What you get</h3>
              <p className="mt-3">{s.gets}</p>
            </div>
          </div>
          <div className="mt-8"><Button href="/request">Request a project</Button></div>
        </Section>
      ))}
      <Section className="pt-0 md:pt-0">
        <p className="max-w-text border-l-2 border-accent pl-4 text-sm text-muted">
          AI translation is offered as support for qualified interpreters, not a replacement. Tools that touch patient
          conversations or data use HIPAA-compliant vendors who sign a Business Associate Agreement.
        </p>
      </Section>
      <Section id="builder" tone="alt">
        <div className="max-w-text">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Build your program</p>
          <h2 className="mt-3 text-h2">Put the pieces together.</h2>
          <p className="mt-4 text-muted">Choose what your clinic needs and the languages your patients speak. We&apos;ll sketch the program and carry it into your request.</p>
        </div>
        <div className="mt-10"><ProgramBuilder /></div>
      </Section>
      <CtaBand title="Not sure where to start?" body="Tell us about your clinic and we'll suggest the simplest first step." />
    </>
  );
}
