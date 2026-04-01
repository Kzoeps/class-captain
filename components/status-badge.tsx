import { cn } from "@/lib/utils";
import type { MonitorStatus } from "@/lib/types";

const config: Record<MonitorStatus, { label: string; classes: string; dot: string }> = {
  ok:      { label: "ok",      classes: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",  dot: "bg-green-500" },
  failing: { label: "failing", classes: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",         dot: "bg-red-500" },
  error:   { label: "error",   classes: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", dot: "bg-yellow-500" },
  skipped: { label: "skipped", classes: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",        dot: "bg-zinc-400" },
};

export function StatusBadge({
  status,
  large = false,
}: {
  status: MonitorStatus;
  large?: boolean;
}) {
  const { label, classes, dot } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        large ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs",
        classes
      )}
    >
      <span className={cn("rounded-full", large ? "w-2 h-2" : "w-1.5 h-1.5", dot)} />
      {label}
    </span>
  );
}
