import Link from "next/link";
import architecture from "@/data/architecture.json";

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen grid-bg">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--accent-cyan)] mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Dashboard
        </Link>

        <h1 className="text-2xl font-bold tracking-tight font-heading mb-2" style={{ letterSpacing: "-0.02em" }}>
          Architecture
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Hypersphere monitoring stack
        </p>

        <div className="rounded-lg bg-card border border-border p-5 mb-8">
          <h2 className="text-sm text-muted-foreground uppercase tracking-wider font-heading mb-3">Pipeline</h2>
          <p className="text-sm text-muted-foreground mb-5">{architecture.pipeline.description}</p>
          <div className="flex flex-wrap items-center gap-2">
            {architecture.pipeline.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="rounded bg-muted px-3 py-2">
                  <p className="text-sm">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.detail}</p>
                </div>
                {i < architecture.pipeline.steps.length - 1 && (
                  <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {architecture.monitors.map((monitor) => (
            <div key={monitor.id} className="rounded-lg bg-card border border-border p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold font-heading text-lg">{monitor.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{monitor.purpose}</p>
                </div>
                <Link
                  href={`/monitor/${monitor.id}`}
                  className="text-xs text-muted-foreground hover:text-[var(--accent-cyan)] transition-colors shrink-0 ml-4"
                >
                  Status →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                {monitor.app_url && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">App</p>
                    <a href={monitor.app_url} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-[var(--accent-cyan)] hover:underline break-all">
                      {monitor.app_url}
                    </a>
                  </div>
                )}
                {"api_url" in monitor && monitor.api_url && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">API</p>
                    <a href={monitor.api_url as string} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-[var(--accent-cyan)] hover:underline break-all">
                      {monitor.api_url as string}
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Session</p>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{monitor.session}</code>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Interval</p>
                  <p className="text-sm">{monitor.interval}</p>
                </div>
              </div>

              {monitor.repos.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Repos watched</p>
                  <div className="flex flex-wrap gap-2">
                    {monitor.repos.map((repo) => (
                      <a key={repo} href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer"
                        className="text-xs bg-muted px-2 py-0.5 rounded hover:bg-muted/70 transition-colors text-[var(--accent-cyan)]">
                        {repo}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Tests</p>
                    <ul className="space-y-1">
                      {monitor.test_types.map((t, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex gap-2">
                          <span className="text-[var(--accent-cyan)]">→</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Stack</p>
                    <div className="flex flex-wrap gap-1.5">
                      {monitor.stack.map((s, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                    {monitor.log && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">Log</p>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{monitor.log}</code>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
