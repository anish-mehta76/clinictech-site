import { Globe, Languages, FileText } from "lucide-react";

const ICONS = { websites: Globe, translation: Languages, insurance: FileText } as const;

export function ServiceIcon({ id }: { id: string }) {
  const Icon = ICONS[id as keyof typeof ICONS] ?? Globe;
  return (
    <span className="inline-flex size-11 items-center justify-center border border-rule">
      <Icon className="size-5" aria-hidden strokeWidth={1.5} />
    </span>
  );
}
