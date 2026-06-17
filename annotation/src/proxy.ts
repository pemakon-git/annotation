import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/signup', '/auth'];

/**
 * Optimistic auth gate. We only check for the *presence* of a Supabase auth
 * cookie here — no network call — so navigation stays fast even on a slow link
 * to the Supabase region.
 *
 * This is safe because the real security boundary is Row Level Security on
 * Supabase, which validates the JWT signature on every query. A forged cookie
 * gets past this redirect but still can't read or write any data. The browser
 * Supabase client auto-refreshes the session, keeping the cookie fresh.
 */
// The Supabase auth cookie is named `sb-<project-ref>-auth-token`. Scoping the
// check to the *current* project's ref means a leftover cookie from a different
// project (e.g. after switching regions) is not mistaken for a valid session.
const PROJECT_REF = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split('.')[0];
const AUTH_COOKIE_PREFIX = `sb-${PROJECT_REF}-auth-token`;

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(`${p}/`));

  const hasSession = request.cookies
    .getAll()
    .some((c) => c.name.startsWith(AUTH_COOKIE_PREFIX));

  // Not signed in and visiting a protected route → send to /login
  if (!hasSession && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Already signed in but on an auth page → send to the dashboard
  if (hasSession && (path === '/login' || path === '/signup')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
