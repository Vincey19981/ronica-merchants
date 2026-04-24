import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}

export const StatCard = ({ label, value, hint, icon: Icon }: Props) => (
  <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
    <div className="absolute left-0 top-0 h-full w-1 bg-accent" />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-2 text-3xl font-bold text-primary">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
        <Icon className="h-5 w-5" />
      </span>
    </div>
  </div>
);