import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { RunOutcomeBadge } from "@/components/run-outcome-badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 30;

export default async function MonitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: monitor } = await supabase
    .from("monitors")
    .select("*")
    .eq("id", id)
    .single();

  if (!monitor) notFound();

  const { data: logs } = await supabase
    .from("status_logs")
    .select("*")
    .eq("monitor_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  const latest = logs?.[0] ?? null;
  const history = logs?.slice(1) ?? [];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{monitor.name}</h1>
            {monitor.description && (
              <p className="text-muted-foreground mt-1">{monitor.description}</p>
            )}
          </div>
          {latest && <StatusBadge status={latest.status} large />}
        </div>

        {latest ? (
          <div className="rounded-lg border bg-card p-6 mb-8 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Latest Status
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Last check</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(latest.last_check), { addSuffix: true })}
                </p>
              </div>
              {latest.last_run && (
                <div>
                  <p className="text-muted-foreground">Last run</p>
                  <p className="font-medium flex items-center gap-2">
                    {formatDistanceToNow(new Date(latest.last_run), { addSuffix: true })}
                    {latest.last_run_outcome && (
                      <RunOutcomeBadge outcome={latest.last_run_outcome} />
                    )}
                  </p>
                </div>
              )}
              {latest.last_commit_sha && (
                <div>
                  <p className="text-muted-foreground">Last commit</p>
                  <p className="font-mono text-xs font-medium">
                    {latest.last_commit_sha}
                    {latest.last_commit_repo && (
                      <span className="text-muted-foreground font-sans ml-2">
                        {latest.last_commit_repo}
                      </span>
                    )}
                  </p>
                  {latest.last_commit_message && (
                    <p className="text-muted-foreground truncate">{latest.last_commit_message}</p>
                  )}
                </div>
              )}
              {latest.checks_total != null && (
                <div>
                  <p className="text-muted-foreground">Checks</p>
                  <p className="font-medium">
                    <span className="text-green-600">{latest.checks_passed} passed</span>
                    {" · "}
                    <span className="text-red-500">{latest.checks_failed} failed</span>
                    {" · "}
                    {latest.checks_total} total
                  </p>
                </div>
              )}
            </div>
            {latest.notes && (
              <div className="pt-2 border-t text-sm text-muted-foreground">
                {latest.notes}
              </div>
            )}
            {latest.linear_issues_filed && latest.linear_issues_filed.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-1">Linear issues filed</p>
                <div className="flex flex-wrap gap-2">
                  {latest.linear_issues_filed.map((issue: string) => (
                    <a
                      key={issue}
                      href={`https://linear.app/issue/${issue}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono bg-muted px-2 py-1 rounded hover:bg-muted/70 transition-colors"
                    >
                      {issue}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border bg-muted/40 p-6 mb-8 text-center text-muted-foreground text-sm">
            No status logged yet.
          </div>
        )}

        {history.length > 0 && (
          <div>
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
              History ({history.length} entries)
            </h2>
            <div className="space-y-4">
              {history.map((log) => (
                <div
                  key={log.id}
                  className="rounded-lg border bg-card p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <StatusBadge status={log.status} />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(log.last_check), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {log.last_run && (
                      <div>
                        <p className="text-muted-foreground text-xs">Last run</p>
                        <p className="font-medium flex items-center gap-2">
                          {formatDistanceToNow(new Date(log.last_run), { addSuffix: true })}
                          {log.last_run_outcome && (
                            <RunOutcomeBadge outcome={log.last_run_outcome} />
                          )}
                        </p>
                      </div>
                    )}
                    {log.last_commit_sha && (
                      <div>
                        <p className="text-muted-foreground text-xs">Last commit</p>
                        <p className="font-mono text-xs font-medium">
                          {log.last_commit_sha}
                          {log.last_commit_repo && (
                            <span className="text-muted-foreground font-sans ml-2">
                              {log.last_commit_repo}
                            </span>
                          )}
                        </p>
                        {log.last_commit_message && (
                          <p className="text-muted-foreground text-xs truncate">{log.last_commit_message}</p>
                        )}
                      </div>
                    )}
                    {log.checks_total != null && (
                      <div>
                        <p className="text-muted-foreground text-xs">Checks</p>
                        <p className="font-medium text-xs">
                          <span className="text-green-600">{log.checks_passed} passed</span>
                          {" · "}
                          <span className="text-red-500">{log.checks_failed} failed</span>
                          {" · "}
                          {log.checks_total} total
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {log.notes && (
                    <div className="pt-2 border-t text-xs text-muted-foreground">
                      {log.notes}
                    </div>
                  )}
                  {log.linear_issues_filed && log.linear_issues_filed.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Issues filed</p>
                      <div className="flex flex-wrap gap-2">
                        {log.linear_issues_filed.map((issue: string) => (
                          <a
                            key={issue}
                            href={`https://linear.app/issue/${issue}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono bg-muted px-2 py-1 rounded hover:bg-muted/70 transition-colors"
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
