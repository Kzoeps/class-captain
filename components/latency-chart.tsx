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

export function LatencyChart({ logs }: LatencyChartProps) {
  const data = logs
    .slice()
    .reverse()
    .map((log) => ({
      time: format(new Date(log.last_check), "HH:mm"),
      fullTime: new Date(log.last_check).toISOString(),
      create: log.misc_data?.create_lag_ms ?? null,
      update: log.misc_data?.update_lag_ms ?? null,
      delete: log.misc_data?.delete_lag_ms ?? null,
    }));

  if (data.length === 0) {
    return (
      <div className="rounded-lg bg-card border border-border p-6 mb-6 text-center">
        <p className="text-sm text-muted-foreground">No latency data available yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-card border border-border p-5 mb-6">
      <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-mono mb-4">
        Write Latency
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
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}s`}
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
            <Line
              type="monotone"
              dataKey="create"
              name="Create"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="update"
              name="Update"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="delete"
              name="Delete"
              stroke="#f472b6"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-0.5 bg-[#22c55e] rounded" />
          <span className="text-xs text-muted-foreground">Create</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-0.5 bg-[#22d3ee] rounded" />
          <span className="text-xs text-muted-foreground">Update</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-0.5 bg-[#f472b6] rounded" />
          <span className="text-xs text-muted-foreground">Delete</span>
        </div>
      </div>
    </div>
  );
}
