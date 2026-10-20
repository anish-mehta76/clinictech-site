import type { Metadata } from "next";
import { CtaBand, PageHeader, Section } from "@/components/Section";
import { WorkGrid } from "@/components/pages/interactive";
import { WORK } from "@/lib/site";

export const metadata: Metadata = { title: "Our Work" };

export default function Work() {
  return (
    <>
      <PageHeader eyebrow="Concepts and pilots" title="Our Work" intro="We're new, so we're upfront about it. Concept sites are made-up clinics we built to show our design work; pilots are real projects in progress." />
      <Section>
        <WorkGrid items={WORK} />
      </Section>
      <CtaBand title="Want to be a founding clinic?" body="Our work is free. We'd love to feature yours here once it's live." />
    </>
  );
}
