import Link from "next/link";
import { ArrowRight } from "lucide-react";
import architecture from "@/data/architecture.json";

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <div className="mb-10">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mt-4">Architecture</h1>
          <p className="text-muted-foreground mt-1">
            How the Hypersphere monitoring stack works
          </p>
        </div>

        {/* Pipeline */}
        <section className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">Pipeline</h2>
          <p className="text-sm text-muted-foreground mb-6">{architecture.pipeline.description}</p>
          <div className="flex flex-wrap items-center gap-2">
            {architecture.pipeline.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="rounded-lg border bg-card px-4 py-2 text-sm">
                  <p className="font-medium">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.detail}</p>
                </div>
                {i < architecture.pipeline.steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Monitors */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">Monitors</h2>
          <div className="space-y-6">
            {architecture.monitors.map((monitor) => (
              <div key={monitor.id} className="rounded-xl border bg-card p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{monitor.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{monitor.purpose}</p>
                  </div>
                  <Link
                    href={`/monitor/${monitor.id}`}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-4"
                  >
                    View status →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {monitor.app_url && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">App</p>
                      <a href={monitor.app_url} target="_blank" rel="noopener noreferrer"
                        className="text-blue-500 hover:underline break-all">
                        {monitor.app_url}
                      </a>
                    </div>
                  )}
                  {"api_url" in monitor && monitor.api_url && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">API</p>
                      <a href={monitor.api_url as string} target="_blank" rel="noopener noreferrer"
                        className="text-blue-500 hover:underline break-all">
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
                    <p>{monitor.interval}</p>
                  </div>
                  {monitor.repos.length > 0 && (
                    <div className="sm:col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">Repos watched</p>
                      <div className="flex flex-wrap gap-2">
                        {monitor.repos.map((repo) => (
                          <a key={repo} href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer"
                            className="text-xs bg-muted px-2 py-0.5 rounded hover:bg-muted/70 transition-colors font-mono">
                            {repo}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Trigger</p>
                    <p className="text-sm">{monitor.trigger}</p>
                  </div>
                </div>

                <div className="pt-2 border-t grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">What it tests</p>
                    <ul className="space-y-1">
                      {monitor.test_types.map((t, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                          <span className="text-foreground mt-0.5">·</span> {t}
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
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
