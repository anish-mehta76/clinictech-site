import type { Metadata } from "next";
import { Check } from "lucide-react";
import { CtaBand, PageHeader, Section, SectionHeading } from "@/components/Section";
import { StoryTimeline } from "@/components/pages/interactive";

export const metadata: Metadata = { title: "About" };

const PRIVACY = [
  "Our request form never asks for patient information.",
  "Websites don't handle patient records.",
  "Any tool that touches patient conversations or data uses HIPAA-compliant vendors who will sign a Business Associate Agreement.",
  "AI translation supports qualified interpreters. It doesn't replace them.",
];

export default function About() {
  return (
    <>
      <PageHeader eyebrow="Student-founded" title="About us" />
      <Section>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Why we started</p>
        <div className="mt-6"><StoryTimeline /></div>
      </Section>
      <Section tone="alt">
        <SectionHeading title="How we handle privacy" />
        <ul className="mt-6 grid max-w-text gap-3">
          {PRIVACY.map((p) => (
            <li key={p} className="flex gap-3"><Check className="mt-1 size-5 shrink-0 text-accent" aria-hidden />{p}</li>
          ))}
        </ul>
      </Section>
      <CtaBand title="Let's talk about your clinic" body="Tell us what's not working today. We reply within two business days." />
    </>
  );
}
