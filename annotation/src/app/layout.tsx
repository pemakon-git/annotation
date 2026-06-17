import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppChrome from '@/components/layout/AppChrome';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'annotation.gg',
  description: 'Developer team project tracking and Kanban board',
  icons: {
    icon: '/icons/perikon-logo.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark h-full ${inter.variable}`}>
      <head>
        {/* Warm up the connection so the icon font arrives faster on first load */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* display=block hides icons until the font loads instead of flashing
            the raw ligature text ("folder_open", "add", …). */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-[#1a1015] text-[#f1dde5]">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
