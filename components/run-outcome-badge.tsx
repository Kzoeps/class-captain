import { cn } from "@/lib/utils";
import type { RunOutcome } from "@/lib/types";

const config: Record<RunOutcome, { label: string; text: string; bg: string }> = {
  passed:  { label: "passed",  text: "text-[var(--status-ok)]",      bg: "bg-[var(--status-ok)]/10" },
  failed:  { label: "failed",  text: "text-[var(--status-failing)]", bg: "bg-[var(--status-failing)]/10" },
  skipped: { label: "skipped", text: "text-[var(--status-skipped)]", bg: "bg-[var(--status-skipped)]/10" },
};

export function RunOutcomeBadge({ outcome }: { outcome: RunOutcome }) {
  const { label, text, bg } = config[outcome];
  return (
    <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider", text, bg)}>
      {label}
    </span>
  );
}
