'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

/**
 * Loads the user's data from Supabase into the Zustand store once, on mount.
 * Renders a lightweight loading state until the first fetch resolves so pages
 * never flash empty data.
 */
export default function StoreHydrator({ children }: { children: React.ReactNode }) {
  const loaded = useStore((s) => s.loaded);
  const hydrate = useStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-text-secondary text-[14px]">
        <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
        Loading your workspace…
      </div>
    );
  }

  return <>{children}</>;
}