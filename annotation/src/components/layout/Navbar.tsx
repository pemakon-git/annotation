'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/app/login/actions';

const NAV_LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/projects', label: 'Projects' },
  { href: '/calendar', label: 'Calendar' },
];

export default function Navbar({ email = '' }: { email?: string }) {
  const pathname = usePathname();
  const initials = email.slice(0, 2).toUpperCase() || 'PK';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 w-full h-[52px] z-50 flex justify-between items-center px-6 bg-background border-b border-[rgba(139,143,212,0.15)]">
      {/* Logo */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-[22px] leading-7 text-primary">
          <span className="material-symbols-outlined">terminal</span>
          Annotation.gg
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[12px] font-medium leading-4 transition-colors pb-0.5 ${
                isActive(link.href)
                  ? 'text-text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative text-text-secondary hover:text-text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </button>
        <div
          title={email}
          className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-[12px] font-semibold border border-[rgba(139,143,212,0.15)]"
        >
          {initials}
        </div>
        <form action={signOut}>
          <button
            type="submit"
            title="Sign out"
            className="flex items-center text-text-secondary hover:text-error transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </form>
      </div>
    </nav>
  );
}
