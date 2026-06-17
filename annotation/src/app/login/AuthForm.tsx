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
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center gap-3 mb-8">
        <Image
          src="/icons/perikon-logo.jpg"
          alt="Annotation.gg logo"
          width={64}
          height={64}
          priority
          className="rounded-xl border border-[rgba(139,143,212,0.25)]"
        />
        <span className="font-bold text-[22px] text-primary">Annotation.gg</span>
      </div>

      <div className="bg-surface rounded-xl border border-[rgba(139,143,212,0.15)] p-6">
        <h1 className="text-[22px] font-semibold text-text-primary">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-[13px] text-text-secondary mt-1 mb-6">
          {isLogin ? 'Sign in to continue to your workspace.' : 'Start tracking your projects in seconds.'}
        </p>

        {notice && (
          <p className="mb-4 text-[13px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
            {notice}
          </p>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[11px] font-medium tracking-widest text-text-secondary uppercase mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full h-9 px-3 rounded-lg bg-background border border-[rgba(139,143,212,0.15)] text-[14px] text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[11px] font-medium tracking-widest text-text-secondary uppercase mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              placeholder="••••••••"
              className="w-full h-9 px-3 rounded-lg bg-background border border-[rgba(139,143,212,0.15)] text-[14px] text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {state?.error && (
            <p className="text-[13px] text-error bg-error/10 border border-error/20 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full h-9 rounded-lg bg-primary-container text-on-primary-container text-[14px] font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {pending ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="text-center text-[13px] text-text-secondary mt-4">
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
  );
}
