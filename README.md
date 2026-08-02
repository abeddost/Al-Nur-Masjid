# An-Nur Moschee — Website

Multilingual (DE/EN/Persian/Pashto) website for An-Nur Moschee — Afghanisch Islamischer
Kulturverein Wiesbaden und Umgebung e.V. Next.js (App Router) + Payload CMS, co-located in one app.

This is **Phase 1** of a multi-phase build (see the approved plan). It covers: project
scaffold, Payload CMS with core content types, German/English/Persian/Pashto routing with
RTL support, the sticky header/footer, and a fully composed homepage with live Mawaqit
prayer times. Later phases add the remaining content pages, forms, SEO/a11y/perf hardening,
and legal-page review.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 (or the next free port — check the terminal output).

First run: visit `/admin` and follow **Create your first user**, or run the seed script
below with `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` set to create one non-interactively.

## Seeding real content

```bash
SEED_ADMIN_EMAIL=admin@example.org SEED_ADMIN_PASSWORD='choose-a-strong-password' npm run seed
```

Idempotent — safe to re-run. Loads only content verified from the current afgkv.de site
(see the plan for the full list of what's real vs. what's still flagged `[VERIFY]`).

## Environment variables (`.env.local`)

- `PAYLOAD_SECRET` — random secret used to sign sessions. Already generated locally; **rotate
  this before any production deploy**.
- `DATABASE_URI` — `file:./an-nur.db` for local SQLite dev. Production should switch to
  Postgres (e.g. Neon via the Vercel Marketplace) — change the adapter in `src/payload.config.ts`
  from `sqliteAdapter` to `postgresAdapter` and point `DATABASE_URI` at the Postgres connection
  string.

## What's real vs. placeholder right now

- **Real, verified**: legal name/address/VR number, both known phone numbers (flagged,
  unresolved — see Site Settings in the admin), Koranschule schedule, the 5 advice/services,
  the donation campaign name — and prayer times, Jumu'ah time, women's-prayer/wudu/parking/
  accessibility facts, and mosque exterior/interior photos, all pulled live from the mosque's
  own Mawaqit profile.
- **Explicit placeholders**: the logo and any photo not sourced from Mawaqit render as a
  labeled empty box (see `PlaceholderImage`) until real files are uploaded via `/admin` → Media.
- **Pending, not invented**: donation goal/raised amounts are left blank on purpose — the UI
  shows a "pending confirmation" state rather than a number.
- **Flagged for admin review**: see `SiteSettings.legalNameDiscrepancyNote` and
  `phoneNumbersVerified`/`rolesVerified` in `/admin` → Site Settings, and the console note
  from `npm run seed` about a Tafsir-schedule conflict between afgkv.de and the mosque's live
  Mawaqit announcement.
- **Persian/Pashto UI strings** (`src/messages/fa.json`, `ps.json`) are machine-assisted
  drafts flagged with `_reviewNote` — get a native-speaker review before treating them as final.

## Deploying

Not yet deployed. To ship a Vercel preview:

```bash
npm i -g vercel   # if not already installed
vercel link
vercel env add PAYLOAD_SECRET
vercel env add DATABASE_URI   # a Postgres connection string, not the local SQLite file
vercel deploy
```
