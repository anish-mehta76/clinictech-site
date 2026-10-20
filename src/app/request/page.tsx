import type { Metadata } from "next";
import { Clock, ListChecks, ShieldAlert } from "lucide-react";
import { PageHeader, Section } from "@/components/Section";
import { IntakeForm } from "@/components/IntakeForm";
import { STEPS } from "@/lib/site";

export const metadata: Metadata = { title: "Request a Project" };

export default function Request() {
  return (
    <>
      <PageHeader title="Request a project" intro="Tell us about your clinic and we'll get back to you within two business days. Please don't include any patient information." />
      <Section className="grid items-start gap-10 lg:grid-cols-[1fr_320px]">
        <IntakeForm />
        <aside className="space-y-6 rounded-lg border border-rule bg-surface-alt p-6 lg:sticky lg:top-24" aria-label="What to expect">
          <div className="flex gap-3">
            <Clock className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
            <div>
              <h2 className="text-lg">Response time</h2>
              <p className="mt-1 text-[15px] text-muted">We reply within two business days.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <ListChecks className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
            <div>
              <h2 className="text-lg">What happens next</h2>
              <ol className="mt-1 list-decimal space-y-1 pl-5 text-[15px] text-muted">
                {STEPS.map((s) => <li key={s.title}>{s.title}</li>)}
              </ol>
            </div>
          </div>
          <div className="flex gap-3">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
            <div>
              <h2 className="text-lg">No patient information</h2>
              <p className="mt-1 text-[15px] text-muted">This form is about your clinic only. Please don&apos;t include anything about patients.</p>
            </div>
          </div>
        </aside>
      </Section>
    </>
  );
}
