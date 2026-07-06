# Kalpataru Constructions — Admin Panel (Frontend Only)

This is the **frontend-only** admin panel for the Kalpataru Constructions website.
There is no real backend yet — all data is mocked and lives in the browser
(React state, persisted to `localStorage` so your edits survive a refresh).
Wire it up to a real API when the backend is ready; see **"Connecting a real backend"** below.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`,
which then redirects you to `/login` since you're not "signed in" yet.

### Demo login

```
Email:    admin@kalpataru.co.in
Password: buildwhatlasts
```

(Shown on the login screen too.)

## What's included

- **Login** (`/login`) — mock auth gate, session remembered via `localStorage`.
- **Dashboard** (`/dashboard`) — key stats, recent inquiries, latest applicants.
- **Projects** (`/projects`) — list with search + city/status filters, full create/edit
  form (materials, gallery, construction timeline), delete with confirmation.
- **Cities** (`/cities`) — the markets shown on the public projects page.
- **Services** (`/services`) — service lines with capability lists.
- **Journal** (`/blogs`) — blog posts, paragraph-based body editor.
- **Careers** (`/careers`) — open roles + an **Applicants** tab to review and update
  applicant status (New → Shortlisted → Hired/Rejected).
- **Testimonials** (`/testimonials`) — client quotes with a star rating.
- **Awards** (`/awards`) — awards & recognition list.
- **Inquiries** (`/inquiries`) — quote/contact form submissions, with a detail drawer
  and status workflow (New → In progress → Closed).
- **Settings** (`/settings`) — company info, contact details, social links,
  maintenance-mode toggle, and a read-only admin users list.

Every list/detail screen matches the concrete/blueprint/safety-orange design system
and typefaces (Archivo Expanded, IBM Plex Sans/Mono) used on the public site, with a
dark blueprint-navy sidebar for the admin shell.

## Where the mock data lives

- `src/lib/site-data.ts` — the same content model as the public site
  (`cities`, `projects`, `services`, `blogs`, `careers`, `testimonials`, `awards`),
  copied in as seed data.
- `src/lib/store.tsx` — a `AdminDataProvider` React context that seeds from
  `site-data.ts`, adds admin-only collections (inquiries, job applications, users,
  site settings), and exposes create/update/delete functions for every resource.
  This is the file to replace with real API calls.
- `src/lib/auth.tsx` — mock session/login logic to replace with real auth.

There's a **"Reset demo data"** button in the top bar if you want to wipe local
edits and go back to the seeded content.

## Connecting a real backend

Everything is written so the swap is mechanical:

1. Replace the functions in `src/lib/store.tsx` (`upsertProject`, `removeCity`, etc.)
   with calls to your API (e.g. `fetch("/api/projects", { method: "POST", ... })`),
   and load initial data with `useEffect` + your `GET` endpoints instead of
   `localStorage`.
2. Replace `src/lib/auth.tsx`'s `login()`/session check with your real auth
   (cookies/JWT), and drop the demo-credential constants.
3. Everything else — pages, forms, routing — stays the same, since they only ever
   talk to `useAdminData()` / `useAuth()`, never to `localStorage` directly.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · lucide-react · TypeScript
