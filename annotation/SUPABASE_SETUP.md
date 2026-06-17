# Supabase Setup

Three one-time steps to connect the app to your Supabase project.

## 1. Environment variables

`.env.local` is already filled in with your project URL and anon key. If you
ever rotate keys, update it from **Dashboard → Project Settings → API**.

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon/publishable key>
```

## 2. Create the database tables

Open **Dashboard → SQL Editor → New query**, paste the entire contents of
[`supabase/schema.sql`](supabase/schema.sql), and click **Run**.

This creates `projects`, `tasks`, and `docs`, all with Row Level Security so
each signed-in user only sees their own rows.

> Run it once on a fresh project. The `create policy` statements are not
> idempotent — re-running the whole file will error with "policy already
> exists" (the tables themselves use `create table if not exists`, so those are
> safe). To re-run, drop the policies/tables first.

## 3. Enable Email/Password auth

**Dashboard → Authentication → Providers → Email** — make sure it's enabled
(it is by default).

- For the smoothest local testing, turn **Confirm email** OFF
  (**Authentication → Sign In / Providers → Email**). Then sign-up logs you
  straight in.
- If you keep email confirmation ON, sign-up sends a confirmation link. The
  link is handled by the `/auth/confirm` route in this app. Set the redirect
  URL under **Authentication → URL Configuration → Site URL** to
  `http://localhost:3000` for local dev.

## Run the app

```bash
npm run dev
```

Visit http://localhost:3000 → you'll be redirected to `/login`. Create an
account at `/signup`, and your projects/tasks/docs now persist in Supabase
instead of `localStorage`.
