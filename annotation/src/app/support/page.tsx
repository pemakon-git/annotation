'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Status = { type: 'idle' | 'ok' | 'error'; message?: string };

export default function SupportPage() {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>({ type: 'idle' });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      setStatus({ type: 'error', message: 'Please write a message first.' });
      return;
    }
    setSending(true);
    setStatus({ type: 'idle' });
    const supabase = createClient();
    // user_id defaults to auth.uid() in the DB, so we only send the message.
    const { error } = await supabase.from('feedback').insert({ message: trimmed });
    setSending(false);
    if (error) {
      setStatus({ type: 'error', message: error.message });
    } else {
      setMessage('');
      setStatus({ type: 'ok', message: 'Thanks! Your feedback has been sent.' });
    }
  }

  return (
    <div className="max-w-[720px] mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-[32px] font-bold leading-10 tracking-tight text-text-primary">Support</h1>
        <p className="text-[14px] text-text-secondary mt-1">Need help or have an idea? We&apos;d love to hear it.</p>
      </header>

      {/* Quick links */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/docs"
          className="bg-surface rounded-xl border border-[rgba(139,143,212,0.15)] p-4 hover:bg-elevated hover:border-[rgba(139,143,212,0.35)] transition-all flex items-center gap-3"
        >
          <span className="material-symbols-outlined text-primary">description</span>
          <div>
            <p className="text-[14px] font-medium text-text-primary">Documentation</p>
            <p className="text-[12px] text-text-secondary">Browse guides &amp; how-tos</p>
          </div>
        </Link>
        <a
          href="mailto:pemakon.solution@gmail.com"
          className="bg-surface rounded-xl border border-[rgba(139,143,212,0.15)] p-4 hover:bg-elevated hover:border-[rgba(139,143,212,0.35)] transition-all flex items-center gap-3"
        >
          <span className="material-symbols-outlined text-primary">mail</span>
          <div>
            <p className="text-[14px] font-medium text-text-primary">Email us</p>
            <p className="text-[12px] text-text-secondary">pemakon.solution@gmail.com</p>
          </div>
        </a>
      </section>

      {/* Feedback form */}
      <section className="bg-surface rounded-xl border border-[rgba(139,143,212,0.15)] p-6">
        <h2 className="text-[18px] font-semibold text-text-primary mb-1">Send feedback</h2>
        <p className="text-[13px] text-text-secondary mb-5">Report a bug or suggest a feature.</p>

        <form onSubmit={submit} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Tell us what's on your mind…"
            className="w-full px-3 py-2.5 rounded-lg bg-background border border-[rgba(139,143,212,0.15)] text-[14px] text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors resize-y"
          />

          {status.type !== 'idle' && (
            <p className={`text-[13px] rounded-lg px-3 py-2 ${status.type === 'ok' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-error bg-error/10 border border-error/20'}`}>
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="h-9 px-4 rounded-lg bg-primary-container text-on-primary-container text-[14px] font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {sending ? 'Sending…' : 'Send feedback'}
          </button>
        </form>
      </section>
    </div>
  );
}
