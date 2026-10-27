import type { MetadataRoute } from 'next';

import { CASES } from '@/lib/cases';

const base = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3400');

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: base, priority: 1 }, ...CASES.map((c) => ({ url: `${base}/case/${c.id}`, priority: 0.8 }))];
}
