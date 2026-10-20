import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary" | "text" | "inverse";
type Props = { href: string; children: React.ReactNode; variant?: Variant; className?: string };

export const buttonBase =
  "group inline-flex min-h-12 items-center justify-between gap-6 text-[15px] font-semibold transition-colors";

export const buttonStyles: Record<Variant, string> = {
  primary: "px-5 bg-accent text-white hover:bg-accent-hover",
  secondary: "px-5 border border-rule text-foreground hover:bg-foreground hover:text-background",
  text: "px-0 text-foreground underline decoration-1 underline-offset-[6px] hover:text-accent",
  inverse: "px-5 bg-accent text-white hover:bg-accent-hover focus-visible:outline-white",
};

// The arrow nudge on hover is the site's one recurring motion.
export function Arrow() {
  return <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden strokeWidth={2} />;
}

export function Button({ href, children, variant = "primary", className = "" }: Props) {
  return (
    <Link href={href} className={`${buttonBase} ${buttonStyles[variant]} ${className}`}>
      {children}
      {variant !== "text" && <Arrow />}
    </Link>
  );
}
