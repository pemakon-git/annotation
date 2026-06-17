'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import StoreHydrator from '../StoreHydrator';
import { createClient } from '@/lib/supabase/client';

// Routes that render without the app shell (no Navbar/Sidebar).
const BARE_ROUTES = ['/login', '/signup'];

/**
 * Client-side chrome. Keeping this out of the (async) root layout lets every
 * page stay statically prerenderable, so client navigation is instant and
 * prefetchable — auth is still enforced server-side by proxy.ts.
 */
export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (bare) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ''));
  }, [bare]);

  if (bare) return <>{children}</>;

  return (
    <>
      <Navbar email={email} />
      <Sidebar />
      <main className="md:ml-[200px] pt-[52px] min-h-screen">
        <StoreHydrator>{children}</StoreHydrator>
      </main>
    </>
  );
}
