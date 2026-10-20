import { Button } from "./Button";

export const container = "mx-auto w-full max-w-page px-4 sm:px-6 lg:px-10";

export function Section({ children, className = "", id, tone }: { children: React.ReactNode; className?: string; id?: string; tone?: "alt" }) {
  return (
    <section id={id} className={`${tone === "alt" ? "bg-surface-alt" : ""} scroll-mt-20 border-b border-rule`}>
      <div className={`${container} py-12 md:py-20 ${className}`}>{children}</div>
    </section>
  );
}

/** Small mono label, e.g. "02 / Services". */
export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-mono text-xs uppercase tracking-[0.12em] text-muted ${className}`}>{children}</p>;
}

export function SectionHeading({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="max-w-text">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 text-h2">{title}</h2>
      {intro && <p className="mt-4 text-muted">{intro}</p>}
    </div>
  );
}

export function PageHeader({ title, intro, eyebrow }: { title: string; intro?: string; eyebrow?: string }) {
  return (
    <div className="border-b border-rule">
      <div className={`${container} grid gap-6 py-12 md:grid-cols-12 md:py-20`}>
        <div className="md:col-span-3">{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}</div>
        <div className="md:col-span-9">
          <h1 className="text-h1">{title}</h1>
          {intro && <p className="mt-6 max-w-text text-lg text-muted">{intro}</p>}
        </div>
      </div>
    </div>
  );
}

export function Card({ children, className = "", as: Tag = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "article" }) {
  return <Tag className={`border border-rule bg-surface p-6 ${className}`}>{children}</Tag>;
}

export function Badge({ children, tone = "accent" }: { children: React.ReactNode; tone?: "accent" | "neutral" }) {
  const styles = tone === "accent" ? "border-accent text-accent" : "border-rule text-foreground";
  return <span className={`inline-flex items-center border px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] ${styles}`}>{children}</span>;
}

export function CtaBand({ title, body }: { title: string; body: string }) {
  return (
    <section className="bg-foreground text-background">
      <div className={`${container} grid gap-8 py-14 md:grid-cols-12 md:items-end md:py-20`}>
        <h2 className="text-h2 md:col-span-7">{title}</h2>
        <div className="md:col-span-5">
          <p className="text-background/75">{body}</p>
          <Button href="/request" variant="inverse" className="mt-6 w-full sm:w-auto">Request a project</Button>
        </div>
      </div>
    </section>
  );
}
