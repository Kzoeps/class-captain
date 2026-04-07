"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
      <div className="rounded-lg border bg-card p-6 mb-8 text-center text-muted-foreground text-sm">
        No latency data available yet.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6 mb-8">
      <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
        Write Latency (ms)
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}s`}
            />
            <Tooltip
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullTime ?? ""}
              formatter={(value) => [
                value != null ? `${Number(value).toLocaleString()}ms` : "N/A",
              ]}
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
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
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="delete"
              name="Delete"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
