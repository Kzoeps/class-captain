import { cn } from "@/lib/utils";
import type { MonitorStatus } from "@/lib/types";

const config: Record<MonitorStatus, { label: string; dot: string; text: string; bg: string }> = {
  ok:      { label: "ok",      dot: "bg-[var(--status-ok)]",      text: "text-[var(--status-ok)]",      bg: "bg-[var(--status-ok)]/10" },
  failing: { label: "failing", dot: "bg-[var(--status-failing)]", text: "text-[var(--status-failing)]", bg: "bg-[var(--status-failing)]/10" },
  error:   { label: "error",   dot: "bg-[var(--status-error)]",   text: "text-[var(--status-error)]",   bg: "bg-[var(--status-error)]/10" },
  skipped: { label: "skipped", dot: "bg-[var(--status-skipped)]", text: "text-[var(--status-skipped)]", bg: "bg-[var(--status-skipped)]/10" },
};

export function StatusBadge({
  status,
  large = false,
}: {
  status: MonitorStatus;
  large?: boolean;
}) {
  const { label, dot, text, bg } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded uppercase tracking-wider",
        large ? "px-3 py-1.5 text-xs" : "px-2 py-0.5 text-[10px]",
        text,
        bg
      )}
    >
      <span className={cn("rounded-full", large ? "w-2 h-2" : "w-1.5 h-1.5", dot)} />
      {label}
    </span>
  );
}
