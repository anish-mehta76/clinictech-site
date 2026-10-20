import { ChevronDown } from "lucide-react";

export function FaqList({ items, firstOpen = false }: { items: { q: string; a: string }[]; firstOpen?: boolean }) {
  return (
    <div className="divide-y divide-rule border-y border-rule">
      {items.map((f, i) => (
        <details key={f.q} className="group" open={firstOpen && i === 0}>
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <p className="pb-5 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
