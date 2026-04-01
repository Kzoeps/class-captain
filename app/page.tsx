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

  // Fetch latest status log per monitor
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

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Class Captain</h1>
          <p className="text-muted-foreground mt-1">
            Agent monitoring dashboard · auto-refreshes every 30s
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {monitorsWithStatus.map((monitor) => (
            <MonitorCard key={monitor.id} monitor={monitor} />
          ))}
        </div>
      </div>
    </main>
  );
}
