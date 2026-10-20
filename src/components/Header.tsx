import Link from "next/link";
import { NAV, SITE_NAME } from "@/lib/site";
import { Button } from "./Button";
import { MobileNav } from "./MobileNav";
import { container } from "./Section";
import { ScrollProgress } from "./ScrollProgress";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-background">
      <ScrollProgress />
      <div className={`${container} flex h-16 items-center justify-between gap-4`}>
        <Link href="/" className="text-xl font-bold tracking-[-0.04em]">
          {SITE_NAME}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="px-3 py-2 text-[15px] font-medium hover:text-accent">
              {item.label}
            </Link>
          ))}
          <Button href="/request" className="ml-3">Request a project</Button>
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}
