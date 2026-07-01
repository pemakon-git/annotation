'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useActionState } from 'react';
import { login, signup, type AuthState } from './actions';

type Mode = 'login' | 'signup';

export default function AuthForm({ mode, notice }: { mode: Mode; notice?: string }) {
  const action = mode === 'login' ? login : signup;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, undefined);

  const isLogin = mode === 'login';

  return (
    <div className="flex min-h-screen">
      {/* ── Left: wallpaper + centered brand (hidden on mobile) ───────────── */}
      <div className="relative hidden md:flex md:w-1/2 items-center justify-center overflow-hidden">
        {/* Wallpaper. To use a real image instead of this gradient, drop a file
            in /public (e.g. login-bg.jpg) and replace this <div> with:
            <Image src="/login-bg.jpg" alt="" fill priority className="object-cover" /> */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 25% 15%, rgba(107,127,255,0.35), transparent 55%),' +
              'radial-gradient(circle at 80% 90%, rgba(240,168,48,0.20), transparent 50%),' +
              'linear-gradient(135deg, #150b10 0%, #2E1F28 45%, #3c4080 120%)',
          }}
        />
        <div className="absolute inset-0 bg-black/20" />

        {/* Centered brand over the wallpaper */}
        <div className="relative z-10 flex flex-col items-center gap-5 px-10 text-center">
          <Image
            src="/icons/perikon-logo.jpg"
            alt="Annotation.gg logo"
            width={96}
            height={96}
            priority
            className="rounded-2xl border border-white/15 shadow-2xl"
          />
          <h1 className="text-[40px] font-bold leading-tight tracking-tight text-white">
            Annotation.gg
          </h1>
          <p className="max-w-xs text-[15px] leading-relaxed text-white/70">
            Developer team project tracking &amp; Kanban board.
          </p>
        </div>
      </div>

      {/* ── Right: form ───────────────────────────────────────────────────── */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6 bg-background">
        <div className="w-full max-w-sm fade-in-left">
          {/* Brand shown only on mobile, where the left panel is hidden */}
          <div className="mb-8 flex flex-col items-center gap-3 md:hidden">
            <Image
              src="/icons/perikon-logo.jpg"
              alt="Annotation.gg logo"
              width={64}
              height={64}
              priority
              className="rounded-xl border border-[rgba(139,143,212,0.25)]"
            />
            <span className="text-[22px] font-bold text-primary">Annotation.gg</span>
          </div>

          <h1 className="text-[26px] font-semibold text-text-primary">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mb-6 mt-1 text-[13px] text-text-secondary">
            {isLogin ? 'Sign in to continue to your workspace.' : 'Start tracking your projects in seconds.'}
          </p>

          {notice && (
            <p className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[13px] text-emerald-400">
              {notice}
            </p>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-text-secondary">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="h-10 w-full rounded-lg border border-[rgba(139,143,212,0.15)] bg-surface px-3 text-[14px] text-text-primary placeholder:text-text-tertiary transition-colors focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-text-secondary">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                placeholder="••••••••"
                className="h-10 w-full rounded-lg border border-[rgba(139,143,212,0.15)] bg-surface px-3 text-[14px] text-text-primary placeholder:text-text-tertiary transition-colors focus:border-primary focus:outline-none"
              />
            </div>

            {state?.error && (
              <p className="rounded-lg border border-error/20 bg-error/10 px-3 py-2 text-[13px] text-error">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="h-10 w-full rounded-lg bg-primary-container text-[14px] font-medium text-on-primary-container transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {pending ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-text-secondary">
            {isLogin ? (
              <>
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">Sign in</Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
