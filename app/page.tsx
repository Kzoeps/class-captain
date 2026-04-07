import { createClient } from "@/lib/supabase/server";
import { MonitorCard } from "@/components/monitor-card";
import type { MonitorWithStatus, StatusLog } from "@/lib/types";

export const revalidate = 30;

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: monitors } = await supabase
    .from("monitors")
    .select("*")
    .order("created_at");

  const { data: latestLogs } = await supabase
    .from("status_logs")
    .select("*")
    .order("created_at", { ascending: false });

  const latestByMonitor = (latestLogs ?? []).reduce<Record<string, StatusLog>>(
    (acc, log) => {
      if (!acc[log.monitor_id]) acc[log.monitor_id] = log;
      return acc;
    },
    {}
  );

  const monitorsWithStatus: MonitorWithStatus[] = (monitors ?? []).map((m) => ({
    ...m,
    latest: latestByMonitor[m.id] ?? null,
  }));

  const okCount = monitorsWithStatus.filter((m) => m.latest?.status === "ok").length;
  const failingCount = monitorsWithStatus.filter((m) => m.latest?.status === "failing").length;
  const errorCount = monitorsWithStatus.filter((m) => m.latest?.status === "error").length;

  return (
    <main className="min-h-screen grid-bg">
      <div className="max-w-3xl mx-auto px-4 py-6 pb-20">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">⚓</span>
            <h1 className="text-2xl font-bold tracking-tight font-heading" style={{ letterSpacing: "-0.02em" }}>
              Class Captain
            </h1>
          </div>
          <p className="text-muted-foreground text-sm font-mono">
            Hypersphere · ATProto ecosystem monitor
          </p>
        </header>

        <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--status-ok)] status-glow-ok pulse-dot" />
            <span className="text-2xl font-bold font-heading">{okCount}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">ok</span>
          </div>
          {failingCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--status-failing)] status-glow-failing" />
              <span className="text-2xl font-bold font-heading text-[var(--status-failing)]">{failingCount}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">failing</span>
            </div>
          )}
          {errorCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--status-error)] status-glow-error" />
              <span className="text-2xl font-bold font-heading text-[var(--status-error)]">{errorCount}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">error</span>
            </div>
          )}
          <div className="ml-auto">
            <span className="text-[10px] text-muted-foreground font-mono">
              refreshes 30s
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {monitorsWithStatus.map((monitor) => (
            <MonitorCard key={monitor.id} monitor={monitor} />
          ))}
        </div>

        <footer className="mt-12 pt-6 border-t border-border">
          <a
            href="/architecture"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--accent-cyan)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Architecture
          </a>
        </footer>
      </div>
    </main>
  );
}
