import type { Metadata } from "next";
import { CtaBand, PageHeader, Section } from "@/components/Section";
import { FaqSearch } from "@/components/pages/interactive";
import { FAQ_GROUPS } from "@/lib/site";

export const metadata: Metadata = { title: "FAQ" };

export default function Faq() {
  return (
    <>
      <PageHeader title="Frequently asked questions" />
      <Section>
        <FaqSearch groups={FAQ_GROUPS} />
      </Section>
      <CtaBand title="Still have questions?" body="Send us a request and we'll answer them directly." />
    </>
  );
}
