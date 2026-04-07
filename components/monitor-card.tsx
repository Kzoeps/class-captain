import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { StatusBadge } from "@/components/status-badge";
import { RunOutcomeBadge } from "@/components/run-outcome-badge";
import type { MonitorWithStatus } from "@/lib/types";

export function MonitorCard({ monitor }: { monitor: MonitorWithStatus }) {
  const { latest } = monitor;

  const statusGlow =
    latest?.status === "ok"
      ? "status-glow-ok"
      : latest?.status === "failing"
      ? "status-glow-failing"
      : latest?.status === "error"
      ? "status-glow-error"
      : "status-glow-skipped";

  return (
    <Link
      href={`/monitor/${monitor.id}`}
      className="group block rounded-lg bg-card border border-border p-4 card-hover"
    >
      <div className="flex items-start gap-4">
        <div className={`shrink-0 w-3 h-3 rounded-full mt-1.5 ${statusGlow}`}
          style={{
            backgroundColor: latest?.status === "ok"
              ? "var(--status-ok)"
              : latest?.status === "failing"
              ? "var(--status-failing)"
              : latest?.status === "error"
              ? "var(--status-error)"
              : "var(--status-skipped)"
          }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h2 className="font-semibold font-heading text-base truncate group-hover:text-[var(--accent-cyan)] transition-colors">
              {monitor.name}
            </h2>
            {latest ? (
              <StatusBadge status={latest.status} />
            ) : (
              <span className="text-xs text-muted-foreground shrink-0">no data</span>
            )}
          </div>

          {latest ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">
                  {formatDistanceToNow(new Date(latest.last_check), { addSuffix: true })}
                </span>
                {latest.last_run && (
                  <>
                    <span>·</span>
                    <span className="font-mono">
                      run {formatDistanceToNow(new Date(latest.last_run), { addSuffix: true })}
                    </span>
                  </>
                )}
              </div>

              {latest.last_run_outcome && (
                <div className="flex items-center gap-2">
                  <RunOutcomeBadge outcome={latest.last_run_outcome} />
                </div>
              )}

              {latest.checks_total != null && (
                <div className="text-xs">
                  <span className="text-[var(--status-ok)]">{latest.checks_passed}✓</span>
                  <span className="text-muted-foreground mx-1">/</span>
                  <span className="text-[var(--status-failing)]">{latest.checks_failed}✗</span>
                  <span className="text-muted-foreground ml-1">({latest.checks_total} total)</span>
                </div>
              )}

              {latest.notes && (
                <p className="text-xs text-muted-foreground truncate mt-1 pt-1 border-t border-border">
                  {latest.notes}
                </p>
              )}

              {latest.linear_issues_filed && latest.linear_issues_filed.length > 0 && (
                <p className="text-xs text-[var(--status-error)]">
                  {latest.linear_issues_filed.length} issue{latest.linear_issues_filed.length > 1 ? "s" : ""} filed
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Awaiting first check</p>
          )}
        </div>

        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
