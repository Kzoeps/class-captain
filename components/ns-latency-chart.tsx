"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";
import type { StatusLogWithMiscData } from "@/lib/types";

interface NsLatencyChartProps {
  logs: StatusLogWithMiscData[];
}

interface NsLatencyData {
  [key: string]: string | number | null;
}

const NAMESPACES = [
  { key: "org.hypercerts", color: "#22c55e" },
  { key: "org.hyperboards", color: "#22d3ee" },
  { key: "app.certified", color: "#f472b6" },
  { key: "app.gainforest", color: "#facc15" },
];

export function NsLatencyChart({ logs }: NsLatencyChartProps) {
  const data = logs
    .slice()
    .reverse()
    .map((log) => {
      const nsLatency = log.misc_data?.integrity_check?.ns_latency_avg_ms as NsLatencyData | null;
      const point: NsLatencyData = {
        time: format(new Date(log.last_check), "HH:mm"),
        fullTime: new Date(log.last_check).toISOString(),
      };
      
      for (const ns of NAMESPACES) {
        point[ns.key] = nsLatency?.[ns.key] ?? null;
      }
      
      return point;
    });

  const hasData = data.some((d) =>
    NAMESPACES.some((ns) => d[ns.key] != null)
  );

  if (!hasData) {
    return (
      <div className="rounded-lg bg-card border border-border p-6 mb-6 text-center">
        <p className="text-sm text-muted-foreground">No namespace latency data available yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-card border border-border p-5 mb-6">
      <h2 className="text-sm text-muted-foreground uppercase tracking-wider font-heading mb-4">
        Namespace Query Latency
      </h2>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#71717a", fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={{ stroke: "#27272a" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#71717a", fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={{ stroke: "#27272a" }}
              tickFormatter={(v) => `${v}ms`}
            />
            <Tooltip
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullTime ?? ""}
              formatter={(value) => [
                value != null ? `${Number(value).toLocaleString()}ms` : "N/A",
              ]}
              contentStyle={{
                backgroundColor: "#111116",
                border: "1px solid #27272a",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono)",
              }}
              labelStyle={{ color: "#e4e4e7" }}
            />
            {NAMESPACES.map((ns) => (
              <Line
                key={ns.key}
                type="monotone"
                dataKey={ns.key}
                name={ns.key}
                stroke={ns.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
        {NAMESPACES.map((ns) => (
          <div key={ns.key} className="flex items-center gap-2">
            <span className="w-2 h-0.5 bg-[#27272a] rounded" style={{ backgroundColor: ns.color }} />
            <span className="text-xs text-muted-foreground">{ns.key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
