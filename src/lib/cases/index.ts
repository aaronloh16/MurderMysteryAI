import 'server-only';

import { banhammer } from './banhammer';
import { blueLantern } from './blue-lantern';
import type { Case, Clue, PublicCase, PublicClue, Suspect } from './types';

/**
 * Consistency checks for authored cases. These run when the module is first
 * imported, which includes `next build`, so a broken case (a clue nobody can
 * reveal, a solution pointing at a missing suspect) fails the build instead
 * of shipping an unsolvable mystery.
 */
function validateCase(c: Case): void {
  const fail = (msg: string) => {
    throw new Error(`[case:${c.id}] ${msg}`);
  };
  const clueIds = new Set(c.clues.map((cl) => cl.id));
  const suspectIds = new Set(c.suspects.map((s) => s.id));
  if (clueIds.size !== c.clues.length) fail('duplicate clue ids');
  if (suspectIds.size !== c.suspects.length) fail('duplicate suspect ids');

  const culprits = c.suspects.filter((s) => s.culprit);
  if (culprits.length !== 1) fail(`expected exactly one culprit, found ${culprits.length}`);
  if (culprits[0]?.id !== c.solution.culprit) fail('solution.culprit does not match the culprit flag');
  if (!c.motives.some((m) => m.id === c.solution.motive)) fail('solution.motive is not a listed motive');
  if (c.solution.keyEvidence.length < 3) fail('need at least three pieces of key evidence');

  const revealable = new Map<string, Set<string>>();
  for (const s of c.suspects) {
    const set = new Set<string>();
    for (const t of s.topics) {
      if (t.reveals) set.add(t.reveals);
      for (const r of t.requires ?? []) if (!clueIds.has(r)) fail(`${s.id}/${t.id} requires unknown clue ${r}`);
    }
    for (const r of s.reactions) {
      if (!clueIds.has(r.clueId)) fail(`${s.id} reacts to unknown clue ${r.clueId}`);
      if (r.reveals) set.add(r.reveals);
    }
    for (const id of set) {
      const clue = c.clues.find((cl) => cl.id === id);
      if (!clue) fail(`${s.id} reveals unknown clue ${id}`);
      if (clue && (clue.source === 'scene' || clue.source.suspectId !== s.id)) {
        fail(`${s.id} reveals ${id}, which belongs to another source`);
      }
    }
    revealable.set(s.id, set);
  }

  for (const cl of c.clues) {
    if (cl.source !== 'scene') {
      if (!suspectIds.has(cl.source.suspectId)) fail(`clue ${cl.id} has unknown source`);
      if (!revealable.get(cl.source.suspectId)?.has(cl.id)) fail(`clue ${cl.id} can never be revealed`);
    }
  }
  for (const id of c.solution.keyEvidence) if (!clueIds.has(id)) fail(`key evidence ${id} missing`);
}

export const CASES: readonly Case[] = [blueLantern, banhammer];
for (const c of CASES) validateCase(c);

export function getCase(id: string): Case | undefined {
  return CASES.find((c) => c.id === id);
}

export function getSuspect(c: Case, suspectId: string): Suspect | undefined {
  return c.suspects.find((s) => s.id === suspectId);
}

export function getClue(c: Case, clueId: string): Clue | undefined {
  return c.clues.find((cl) => cl.id === clueId);
}

/** Clues a suspect is allowed to hand over, by any route. */
export function revealableBy(s: Suspect): Set<string> {
  const ids = new Set<string>();
  for (const t of s.topics) if (t.reveals) ids.add(t.reveals);
  for (const r of s.reactions) if (r.reveals) ids.add(r.reveals);
  return ids;
}

export function toPublicClue(cl: Clue): PublicClue {
  return {
    id: cl.id,
    title: cl.title,
    kind: cl.kind,
    summary: cl.summary,
    detail: cl.detail,
    sourceSuspectId: cl.source === 'scene' ? null : cl.source.suspectId,
  };
}

export function toPublicCase(c: Case): PublicCase {
  return {
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    era: c.era,
    location: c.location,
    minutes: c.minutes,
    difficulty: c.difficulty,
    victim: c.victim,
    briefing: c.briefing,
    accent: c.accent,
    motives: c.motives,
    totalClues: c.clues.length,
    sceneClues: c.clues.filter((cl) => cl.source === 'scene').map(toPublicClue),
    suspects: c.suspects.map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      age: s.age,
      tagline: s.tagline,
      statement: s.statement,
      portrait: s.portrait,
      secrets: revealableBy(s).size,
      suggestions: s.topics.map((t) => ({
        id: t.id,
        prompt: t.prompt,
        ...(t.requires ? { requires: t.requires } : {}),
      })),
    })),
  };
}
