'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';

const MAIN_LINKS = [
  { href: '/', icon: 'dashboard', label: 'Overview' },
  { href: '/projects', icon: 'folder_open', label: 'Projects' },
  { href: '/calendar', icon: 'calendar_month', label: 'Calendar' },
];

const BOTTOM_LINKS = [
  { href: '/docs', icon: 'description', label: 'Documentation' },
  { href: '#', icon: 'help', label: 'Support' },
  { href: '#', icon: 'settings', label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { projects, projectOrder } = useStore();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-[52px] w-[200px] h-[calc(100vh-52px)] flex flex-col bg-surface border-r border-[rgba(139,143,212,0.15)] hidden md:flex">
      {/* Main nav section */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-[11px] font-medium tracking-widest text-text-tertiary uppercase mb-2 px-3">Main</p>
        <nav className="space-y-0.5">
          {MAIN_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all ${
                isActive(link.href)
                  ? 'text-text-primary border-l-2 border-primary bg-elevated'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Recent Projects */}
      {projectOrder.length > 0 && (
        <div className="px-4 py-2">
          <p className="text-[11px] font-medium tracking-widest text-text-tertiary uppercase mb-2 px-3">Projects</p>
          <nav className="space-y-0.5">
            {projectOrder.slice(0, 5).map(pid => {
              const project = projects[pid];
              if (!project) return null;
              const href = `/projects/${pid}`;
              return (
                <Link
                  key={pid}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all ${
                    pathname === href
                      ? 'text-text-primary bg-elevated border-l-2 border-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]" style={{ color: project.color }}>
                    {project.icon}
                  </span>
                  <span className="truncate">{project.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section */}
      <div className="px-4 pb-4 border-t border-[rgba(139,143,212,0.15)] pt-4 space-y-0.5">
        {BOTTOM_LINKS.map(link => {
          const cls = `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all ${
            isActive(link.href) && link.href !== '#'
              ? 'text-text-primary bg-elevated border-l-2 border-primary'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-container-low'
          }`;
          return link.href === '#' ? (
            <a key={link.label} href="#" className={cls}>
              <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
              {link.label}
            </a>
          ) : (
            <Link key={link.label} href={link.href} className={cls}>
              <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
