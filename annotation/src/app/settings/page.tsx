'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Status = { type: 'idle' | 'ok' | 'error'; message?: string };

export default function SettingsPage() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profileStatus, setProfileStatus] = useState<Status>({ type: 'idle' });
  const [profileSaving, setProfileSaving] = useState(false);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<Status>({ type: 'idle' });
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? '');
      setDisplayName((data.user?.user_metadata?.display_name as string) ?? '');
    });
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileStatus({ type: 'idle' });
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { display_name: displayName.trim() } });
    setProfileSaving(false);
    setProfileStatus(error ? { type: 'error', message: error.message } : { type: 'ok', message: 'Profile updated.' });
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    if (password !== confirm) {
      setPasswordStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    setPasswordSaving(true);
    setPasswordStatus({ type: 'idle' });
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPasswordSaving(false);
    if (error) {
      setPasswordStatus({ type: 'error', message: error.message });
    } else {
      setPassword('');
      setConfirm('');
      setPasswordStatus({ type: 'ok', message: 'Password changed.' });
    }
  }

  const initials = (displayName || email).slice(0, 2).toUpperCase() || 'PK';

  return (
    <div className="max-w-[720px] mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-[32px] font-bold leading-10 tracking-tight text-text-primary">Settings</h1>
        <p className="text-[14px] text-text-secondary mt-1">Manage your profile and account.</p>
      </header>

      {/* Profile */}
      <section className="bg-surface rounded-xl border border-[rgba(139,143,212,0.15)] p-6">
        <h2 className="text-[18px] font-semibold text-text-primary mb-1">Profile</h2>
        <p className="text-[13px] text-text-secondary mb-5">This name shows up across your workspace.</p>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-[18px] font-semibold border border-[rgba(139,143,212,0.15)]">
            {initials}
          </div>
          <div className="text-[13px] text-text-secondary">
            Signed in as<br />
            <span className="text-text-primary">{email || '…'}</span>
          </div>
        </div>

        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-[11px] font-medium tracking-widest text-text-secondary uppercase mb-1.5">
              Display name
            </label>
            <input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Pemakon K."
              className="w-full h-10 px-3 rounded-lg bg-background border border-[rgba(139,143,212,0.15)] text-[14px] text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {profileStatus.type !== 'idle' && (
            <p className={`text-[13px] rounded-lg px-3 py-2 ${profileStatus.type === 'ok' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-error bg-error/10 border border-error/20'}`}>
              {profileStatus.message}
            </p>
          )}

          <button
            type="submit"
            disabled={profileSaving}
            className="h-9 px-4 rounded-lg bg-primary-container text-on-primary-container text-[14px] font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {profileSaving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </section>

      {/* Password */}
      <section className="bg-surface rounded-xl border border-[rgba(139,143,212,0.15)] p-6">
        <h2 className="text-[18px] font-semibold text-text-primary mb-1">Change password</h2>
        <p className="text-[13px] text-text-secondary mb-5">Use at least 6 characters.</p>

        <form onSubmit={savePassword} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-[11px] font-medium tracking-widest text-text-secondary uppercase mb-1.5">
              New password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-lg bg-background border border-[rgba(139,143,212,0.15)] text-[14px] text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block text-[11px] font-medium tracking-widest text-text-secondary uppercase mb-1.5">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-lg bg-background border border-[rgba(139,143,212,0.15)] text-[14px] text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {passwordStatus.type !== 'idle' && (
            <p className={`text-[13px] rounded-lg px-3 py-2 ${passwordStatus.type === 'ok' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-error bg-error/10 border border-error/20'}`}>
              {passwordStatus.message}
            </p>
          )}

          <button
            type="submit"
            disabled={passwordSaving}
            className="h-9 px-4 rounded-lg bg-primary-container text-on-primary-container text-[14px] font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {passwordSaving ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </section>
    </div>
  );
}
