import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Murder Mystery AI',
    short_name: 'Mystery AI',
    description: 'Interrogate AI suspects by voice or text and solve the case.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0b0a',
    theme_color: '#0c0b0a',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
