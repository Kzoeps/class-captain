"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import type { StatusLogWithMiscData } from "@/lib/types";

interface LatencyChartProps {
  logs: StatusLogWithMiscData[];
}

const LINES = [
  { key: "create", label: "Create", color: "#22c55e" },
  { key: "update", label: "Update", color: "#22d3ee" },
  { key: "delete", label: "Delete", color: "#f472b6" },
];

export function LatencyChart({ logs }: LatencyChartProps) {
  const data = logs
    .slice()
    .reverse()
    .filter((log) =>
      log.misc_data?.create_lag_ms != null ||
      log.misc_data?.update_lag_ms != null ||
      log.misc_data?.delete_lag_ms != null
    )
    .map((log) => ({
      timestamp: new Date(log.last_check).getTime(),
      fullTime: new Date(log.last_check).toISOString(),
      create: log.misc_data?.create_lag_ms ?? null,
      update: log.misc_data?.update_lag_ms ?? null,
      delete: log.misc_data?.delete_lag_ms ?? null,
    }));

  const hasData = data.some((d) =>
    d.create != null || d.update != null || d.delete != null
  );

  if (!hasData) {
    return (
      <div className="rounded-lg bg-card border border-border p-6 mb-6 text-center">
        <p className="text-sm text-muted-foreground">No latency data available yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-card border border-border p-5 mb-6">
      <h2 className="text-sm text-muted-foreground uppercase tracking-wider font-heading mb-4">
        Write Latency
      </h2>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tickCount={8}
              tickFormatter={(v) => format(new Date(v), "MMM d, HH:mm")}
              tick={{ fontSize: 10, fill: "#71717a", fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={{ stroke: "#27272a" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#71717a", fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={{ stroke: "#27272a" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}s`}
            />
            <Tooltip
              labelFormatter={(_, payload) => {
                const iso = payload?.[0]?.payload?.fullTime;
                return iso ? format(new Date(iso), "MMM d, HH:mm") : "";
              }}
              formatter={(value, name) => {
                if (value == null) return null;
                return [`${Number(value).toLocaleString()}ms`, name];
              }}
              contentStyle={{
                backgroundColor: "#111116",
                border: "1px solid #27272a",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono)",
              }}
              labelStyle={{ color: "#e4e4e7" }}
            />
            {LINES.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.label}
                stroke={line.color}
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
        {LINES.map((line) => (
          <div key={line.key} className="flex items-center gap-2">
            <span className="w-2 h-0.5 bg-[#27272a] rounded" style={{ backgroundColor: line.color }} />
            <span className="text-xs text-muted-foreground">{line.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
