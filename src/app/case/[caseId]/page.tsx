import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Game } from '@/components/game/Game';
import { getCase, toPublicCase } from '@/lib/cases';
import { capabilities } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps<'/case/[caseId]'>): Promise<Metadata> {
  const { caseId } = await params;
  const c = getCase(caseId);
  if (!c) return { title: 'Case not found' };
  return {
    title: c.title,
    description: `${c.subtitle} ${c.era}. Interrogate the suspects and name the killer.`,
    openGraph: { title: c.title, description: c.subtitle },
  };
}

export default async function CasePage({ params }: PageProps<'/case/[caseId]'>) {
  const { caseId } = await params;
  const c = getCase(caseId);
  if (!c) notFound();
  return <Game c={toPublicCase(c)} caps={capabilities()} />;
}
