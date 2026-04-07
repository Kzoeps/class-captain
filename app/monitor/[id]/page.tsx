import { createClient } from "@/lib/supabase/server";
import architecture from "@/data/architecture.json";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { RunOutcomeBadge } from "@/components/run-outcome-badge";
import { LatencyChart } from "@/components/latency-chart";
import { NsLatencyChart } from "@/components/ns-latency-chart";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import type { StatusLogWithMiscData } from "@/lib/types";

export const revalidate = 30;

export default async function MonitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const arch = architecture.monitors.find((m) => m.id === id) ?? null;

  const { data: monitor } = await supabase
    .from("monitors")
    .select("*")
    .eq("id", id)
    .single();

  if (!monitor) notFound();

  const isHyperindex = id === "hyperindex";
  const logLimit = isHyperindex ? 96 : 50;

  const { data: logs } = await supabase
    .from("status_logs")
    .select("*")
    .eq("monitor_id", id)
    .order("created_at", { ascending: false })
    .limit(logLimit);

  const latest = logs?.[0] ?? null;
  const history = logs?.slice(1) ?? [];
  const latencyLogs = logs as StatusLogWithMiscData[] | null;
  const nsLatencyLogs = latencyLogs?.filter(
    (log) => log.misc_data?.integrity_check?.ns_latency_avg_ms != null
  ) ?? null;

  return (
    <main className="min-h-screen grid-bg">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--accent-cyan)] mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Dashboard
        </Link>

        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-heading" style={{ letterSpacing: "-0.02em" }}>
              {monitor.name}
            </h1>
            {monitor.description && (
              <p className="text-muted-foreground text-sm mt-1 font-mono">{monitor.description}</p>
            )}
          </div>
          {latest && <StatusBadge status={latest.status} large />}
        </div>

        {latest ? (
          <div className="rounded-lg bg-card border border-border p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono">Latest</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(latest.last_check), { addSuffix: true })}
              </span>
            </div>

            <div className="space-y-4">
              {latest.last_run && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last run</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">
                      {formatDistanceToNow(new Date(latest.last_run), { addSuffix: true })}
                    </span>
                    {latest.last_run_outcome && (
                      <RunOutcomeBadge outcome={latest.last_run_outcome} />
                    )}
                  </div>
                </div>
              )}

              {latest.last_commit_sha && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Commit</span>
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {latest.last_commit_sha}
                    </code>
                  </div>
                  {latest.last_commit_repo && (
                    <div className="text-xs text-muted-foreground text-right">
                      {latest.last_commit_repo}
                    </div>
                  )}
                  {latest.last_commit_message && (
                    <p className="text-xs text-muted-foreground truncate">{latest.last_commit_message}</p>
                  )}
                </div>
              )}

              {latest.checks_total != null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Checks</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[var(--status-ok)]">{latest.checks_passed} passed</span>
                    <span className="text-[var(--status-failing)]">{latest.checks_failed} failed</span>
                    <span className="text-muted-foreground">({latest.checks_total})</span>
                  </div>
                </div>
              )}
            </div>

            {latest.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground font-mono">{latest.notes}</p>
              </div>
            )}

            {latest.linear_issues_filed && latest.linear_issues_filed.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-mono">Issues</p>
                <div className="flex flex-wrap gap-2">
                  {latest.linear_issues_filed.map((issue: string) => (
                    <a
                      key={issue}
                      href={`https://linear.app/issue/${issue}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono bg-muted px-2 py-1 rounded hover:bg-muted/70 transition-colors text-[var(--accent-cyan)]"
                    >
                      {issue}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-card border border-border p-6 mb-6 text-center">
            <p className="text-sm text-muted-foreground">No status logged yet.</p>
          </div>
        )}

        {isHyperindex && latencyLogs && latencyLogs.length > 0 && (
          <LatencyChart logs={latencyLogs} />
        )}

        {isHyperindex && nsLatencyLogs && nsLatencyLogs.length > 0 && (
          <NsLatencyChart logs={nsLatencyLogs} />
        )}

        {arch && (
          <div className="rounded-lg bg-card border border-border p-5 mb-6">
            <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-mono mb-3">About</h2>
            <p className="text-sm text-muted-foreground mb-4 font-mono">{arch.purpose}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Interval</p>
                <p className="font-mono text-sm">{arch.interval}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Session</p>
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{arch.session}</code>
              </div>
            </div>

            {arch.repos.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">Repos watched</p>
                <div className="flex flex-wrap gap-2">
                  {arch.repos.map((repo) => (
                    <a key={repo} href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs bg-muted px-2 py-0.5 rounded hover:bg-muted/70 transition-colors font-mono text-[var(--accent-cyan)]">
                      {repo}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">What it tests</p>
              <ul className="space-y-1">
                {arch.test_types.map((t, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-[var(--accent-cyan)]">→</span> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {arch.stack.map((s, i) => (
                  <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{s}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div>
            <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-mono mb-4">
              History ({history.length})
            </h2>
            <div className="space-y-3">
              {history.map((log) => (
                <div
                  key={log.id}
                  className="rounded-lg bg-card border border-border p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge status={log.status} />
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatDistanceToNow(new Date(log.last_check), { addSuffix: true })}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    {log.last_run && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Run</span>
                        <span className="font-mono text-xs">
                          {formatDistanceToNow(new Date(log.last_run), { addSuffix: true })}
                        </span>
                        {log.last_run_outcome && (
                          <RunOutcomeBadge outcome={log.last_run_outcome} />
                        )}
                      </div>
                    )}
                    {log.last_commit_sha && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Commit</span>
                        <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                          {log.last_commit_sha}
                        </code>
                      </div>
                    )}
                    {log.checks_total != null && (
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-[var(--status-ok)]">{log.checks_passed}✓</span>
                        <span className="text-[var(--status-failing)]">{log.checks_failed}✗</span>
                        <span className="text-muted-foreground">({log.checks_total})</span>
                      </div>
                    )}
                    {log.notes && (
                      <p className="text-xs text-muted-foreground font-mono">{log.notes}</p>
                    )}
                    {!log.last_run && !log.last_commit_sha && log.checks_total == null && !log.notes && (
                      <p className="text-xs text-muted-foreground italic">Health check</p>
                    )}
                  </div>

                  {log.linear_issues_filed && log.linear_issues_filed.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex flex-wrap gap-2">
                        {log.linear_issues_filed.map((issue: string) => (
                          <a
                            key={issue}
                            href={`https://linear.app/issue/${issue}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono bg-muted px-2 py-0.5 rounded hover:bg-muted/70 transition-colors text-[var(--accent-cyan)]"
                          >
                            {issue}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
