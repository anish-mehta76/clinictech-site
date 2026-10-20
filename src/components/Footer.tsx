import Link from "next/link";
import { CONTACT_EMAIL, NAV, SITE_NAME } from "@/lib/site";
import { container } from "./Section";

export function Footer() {
  return (
    <footer className="border-t border-rule bg-background text-sm text-muted">
      <div className={`${container} grid gap-8 py-12 sm:grid-cols-3`}>
        <div>
          <p className="text-lg font-bold tracking-[-0.03em] text-foreground">{SITE_NAME}</p>
          <p className="mt-2">Student-founded. Websites, language access and insurance help for small clinics.</p>
        </div>
        <nav aria-label="Footer">
          <p className="font-semibold text-foreground">Pages</p>
          <ul className="mt-2 space-y-1">
            {NAV.map((item) => (
              <li key={item.href}><Link href={item.href} className="inline-flex min-h-8 items-center hover:text-foreground">{item.label}</Link></li>
            ))}
            <li><Link href="/request" className="inline-flex min-h-8 items-center hover:text-foreground">Request a project</Link></li>
          </ul>
        </nav>
        <div>
          <p className="font-semibold text-foreground">Contact</p>
          <a className="mt-2 inline-block break-all hover:text-foreground" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <p className="mt-3">Please don&apos;t send patient information by email or through our forms.</p>
        </div>
      </div>
      <div className="border-t border-rule">
        <p className={`${container} py-4`}>© {new Date().getFullYear()} {SITE_NAME}</p>
      </div>
    </footer>
  );
}
