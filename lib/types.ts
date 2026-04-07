export type MonitorStatus = "ok" | "failing" | "skipped" | "error";
export type RunOutcome = "passed" | "failed" | "skipped";

export interface Monitor {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface StatusLog {
  id: string;
  monitor_id: string;
  status: MonitorStatus;
  last_check: string;
  last_run: string | null;
  last_run_outcome: RunOutcome | null;
  last_commit_sha: string | null;
  last_commit_message: string | null;
  last_commit_repo: string | null;
  checks_total: number | null;
  checks_passed: number | null;
  checks_failed: number | null;
  linear_issues_filed: string[] | null;
  notes: string | null;
  created_at: string;
}

export interface MonitorWithStatus extends Monitor {
  latest: StatusLog | null;
}

export interface IntegrityCheckData {
  ns_latency_avg_ms?: {
    "org.hypercerts"?: number;
    "org.hyperboards"?: number;
    "app.certified"?: number;
    "app.gainforest"?: number;
  } | null;
}

export interface MiscData {
  create_lag_ms?: number | null;
  update_lag_ms?: number | null;
  delete_lag_ms?: number | null;
  integrity_check?: IntegrityCheckData | null;
}

export interface StatusLogWithMiscData extends StatusLog {
  misc_data: MiscData | null;
}
