import { cn } from "@/lib/utils";
import type { RunOutcome } from "@/lib/types";

const config: Record<RunOutcome, { label: string; classes: string }> = {
  passed:  { label: "passed",  classes: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  failed:  { label: "failed",  classes: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  skipped: { label: "skipped", classes: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
};

export function RunOutcomeBadge({ outcome }: { outcome: RunOutcome }) {
  const { label, classes } = config[outcome];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", classes)}>
      {label}
    </span>
  );
}
