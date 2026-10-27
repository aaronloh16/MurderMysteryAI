import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, Playfair_Display, Special_Elite } from 'next/font/google';

import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap', style: ['normal', 'italic'] });
const specialElite = Special_Elite({ subsets: ['latin'], weight: '400', variable: '--font-special-elite', display: 'swap' });
const plex = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex', display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3400');

const description =
  'A noir murder mystery where you interrogate AI suspects by voice or text. Every suspect is played from the same hidden truth, so lies hold up until your evidence breaks them.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Murder Mystery AI', template: '%s | Murder Mystery AI' },
  description,
  applicationName: 'Murder Mystery AI',
  authors: [{ name: 'Aaron Loh', url: 'https://github.com/aaronloh16' }],
  keywords: ['murder mystery', 'AI game', 'voice AI', 'detective game', 'interrogation', 'noir'],
  openGraph: {
    type: 'website',
    title: 'Murder Mystery AI',
    description,
    siteName: 'Murder Mystery AI',
  },
  twitter: { card: 'summary_large_image', title: 'Murder Mystery AI', description },
};

export const viewport: Viewport = {
  themeColor: '#0c0b0a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${specialElite.variable} ${plex.variable}`}>
      <body className="grain min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-paper focus:px-4 focus:py-2 focus:text-paper-ink"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
