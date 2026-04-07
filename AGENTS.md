<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack (all major-version bumps — treat as unfamiliar)

- **Next.js 16.2.1** + **React 19.2.4** — app router, Server Components by default
- **Tailwind v4** — configured via `@import "tailwindcss"` in `app/globals.css`, no `tailwind.config.*` file
- **shadcn** style `base-nova` — add components with `npx shadcn add <component>`; Supabase UI registry available at `https://supabase.com/ui/r/{name}.json`
- **`@supabase/ssr`** for auth and data — not the legacy `@supabase/auth-helpers-nextjs`

## Dev commands

```bash
npm run dev        # start dev server
npm run build      # production build
npm run lint       # eslint (next core-web-vitals + typescript rules)
npx tsc --noEmit   # typecheck — no separate script exists
```

No test runner. No CI config.

## Environment variables

Three required vars (managed via `dotenvx` — `.env` is encrypted, `.env.x` is the project config committed to git):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY          # service role key; used for writes server-side
```

Never write plaintext secrets to `.env` — it uses dotenvx encryption. Run `dotenvx set KEY value` to add/update vars.

## Supabase client pattern

- **Server Components / Route Handlers:** `import { createClient } from "@/lib/supabase/server"` — async, reads cookies, uses `SUPABASE_SECRET_KEY` for writes (falls back to publishable key)
- **Client Components:** `import { createClient } from "@/lib/supabase/client"` — browser client, publishable key only
- Never create a Supabase client inline. Always use these factory functions.

## Middleware

`lib/supabase/middleware.ts` uses `supabase.auth.getClaims()` (not `getUser()`). This is the Fluid compute pattern — never cache the Supabase client in a module-level variable; always create a new one per request. Removing `getClaims()` will cause random session logouts.

Unauthenticated requests (except `/login` and `/auth`) are redirected to `/auth/login`.

## App structure

Read-only monitoring dashboard — this app only reads from Supabase. The actual monitors run externally (tmux sessions on a Mac mini in Bhutan).

```
app/
  page.tsx              # / — monitor list dashboard, revalidate=30
  monitor/[id]/page.tsx # /monitor/:id — detail + history, revalidate=30
  architecture/page.tsx # /architecture — static, reads data/architecture.json
lib/
  types.ts              # all DB/domain types — MonitorWithStatus, StatusLog, etc.
  supabase/             # client.ts, server.ts, middleware.ts
data/
  architecture.json     # static monitor metadata (purpose, repos, stack, intervals)
supabase/
  schema.sql            # DB schema + seed monitors
components/
  monitor-card.tsx      # dashboard card
  latency-chart.tsx     # recharts chart, hyperindex only
  ns-latency-chart.tsx  # recharts chart, hyperindex only
  ui/                   # shadcn components
```

## Data model

All types are in `lib/types.ts`. Key notes:

- `status_logs.misc_data` is a JSONB blob (`MiscData` type) — only the `hyperindex` monitor populates it with latency data
- `status_logs.linear_issues_filed` is a `text[]` of Linear issue IDs
- The `hyperindex` monitor detail page fetches 96 logs (vs 50 for others) to populate charts
- DB schema: `monitors` (registry) + `status_logs` (one row per check-in). RLS: public read, service role writes.

## Styling conventions

- **Always dark mode** — `<html>` has hardcoded `className="dark"`, no theme toggle
- **Status colors** are custom CSS vars — use `var(--status-ok)`, `var(--status-failing)`, `var(--status-error)`, `var(--status-skipped)`, `var(--accent-cyan)` directly in `style={}` or `bg-[var(--status-ok)]` Tailwind syntax. Do not use Tailwind's built-in color names for these.
- **Font vars**: `--font-sans` (Geist), `--font-heading` (Space Grotesk), `--font-mono` (JetBrains Mono). Use `font-heading` and `font-mono` Tailwind classes.
- Tailwind v4: no `theme.extend` — CSS vars are declared in `globals.css` under `@theme inline {}`.

## Adding a new monitor

1. Add a row to `monitors` table (or update `supabase/schema.sql` seed)
2. Add an entry to `data/architecture.json` under `monitors[]`
3. Monitor detail page (`app/monitor/[id]/page.tsx`) is generic — no code changes needed for a basic monitor
