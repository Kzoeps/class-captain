import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { StatusBadge } from "@/components/status-badge";
import { RunOutcomeBadge } from "@/components/run-outcome-badge";
import type { MonitorWithStatus } from "@/lib/types";

export function MonitorCard({ monitor }: { monitor: MonitorWithStatus }) {
  const { latest } = monitor;

  return (
    <Link
      href={`/monitor/${monitor.id}`}
      className="group block rounded-xl border bg-card p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="font-semibold group-hover:underline underline-offset-2">
            {monitor.name}
          </h2>
          {monitor.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {monitor.description}
            </p>
          )}
        </div>
        {latest ? (
          <StatusBadge status={latest.status} />
        ) : (
          <span className="text-xs text-muted-foreground">no data</span>
        )}
      </div>

      {latest ? (
        <div className="space-y-1.5 text-sm">
          <p className="text-muted-foreground text-xs">
            Last check{" "}
            <span className="text-foreground font-medium">
              {formatDistanceToNow(new Date(latest.last_check), { addSuffix: true })}
            </span>
          </p>

          {latest.last_run && (
            <p className="text-muted-foreground text-xs flex items-center gap-1.5">
              Last run{" "}
              <span className="text-foreground font-medium">
                {formatDistanceToNow(new Date(latest.last_run), { addSuffix: true })}
              </span>
              {latest.last_run_outcome && (
                <RunOutcomeBadge outcome={latest.last_run_outcome} />
              )}
            </p>
          )}

          {latest.notes && (
            <p className="text-xs text-muted-foreground line-clamp-2 pt-1 border-t mt-2">
              {latest.notes}
            </p>
          )}

          {latest.linear_issues_filed && latest.linear_issues_filed.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {latest.linear_issues_filed.length} issue
              {latest.linear_issues_filed.length > 1 ? "s" : ""} filed
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No status logged yet.</p>
      )}
    </Link>
  );
}
