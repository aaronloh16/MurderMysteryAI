import 'server-only';

import type { Suspect, Topic } from '@/lib/cases/types';

/**
 * The scripted interrogation engine powers demo mode: no keys, no network,
 * no cost. It scores the detective's question against each topic's keyword
 * stems and answers with the authored line. Evidence presentation is exact.
 *
 * It is deliberately simple and deterministic, so every visitor can finish
 * a case, and the same rules gate clue reveals in live AI mode.
 */

export interface ScriptedInput {
  suspect: Suspect;
  message: string;
  presentedClueId?: string;
  discovered: ReadonlySet<string>;
  /** Topic ids already covered with this suspect. */
  asked: readonly string[];
  turn: number;
}

export interface ScriptedResult {
  reply: string;
  reveals?: string;
  topicId?: string;
}

function normalise(text: string): string {
  return ` ${text.toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9:' ]+/g, ' ').replace(/\s+/g, ' ')} `;
}

function score(topic: Topic, text: string): number {
  let s = 0;
  for (const kw of topic.keywords) {
    // Keywords are stems: match at a word start ("gambl" matches "gambling").
    if (text.includes(` ${kw}`)) s += kw.includes(' ') ? 2 : 1;
  }
  return s;
}

export function isAvailable(topic: Topic, discovered: ReadonlySet<string>): boolean {
  return (topic.requires ?? []).every((id) => discovered.has(id));
}

export function matchTopic(suspect: Suspect, message: string, discovered: ReadonlySet<string>, asked: readonly string[]) {
  const text = normalise(message);
  let best: { topic: Topic; score: number } | undefined;
  for (const topic of suspect.topics) {
    const s = score(topic, text);
    if (s === 0) continue;
    // Prefer fresh topics on ties, so repeating a vague question moves the story along.
    const adjusted = s + (asked.includes(topic.id) ? 0 : 0.5);
    if (!best || adjusted > best.score) best = { topic, score: adjusted };
  }
  if (!best) return undefined;
  return { topic: best.topic, available: isAvailable(best.topic, discovered) };
}

export function scriptedReply(input: ScriptedInput): ScriptedResult {
  const { suspect, message, presentedClueId, discovered, asked, turn } = input;

  if (presentedClueId) {
    const reaction = suspect.reactions.find((r) => r.clueId === presentedClueId);
    if (reaction) {
      return {
        reply: reaction.reply,
        ...(reaction.reveals && !discovered.has(reaction.reveals) ? { reveals: reaction.reveals } : {}),
      };
    }
    return { reply: suspect.shrug };
  }

  const match = matchTopic(suspect, message, discovered, asked);
  if (match?.available) {
    const { topic } = match;
    return {
      reply: topic.reply,
      topicId: topic.id,
      ...(topic.reveals && !discovered.has(topic.reveals) ? { reveals: topic.reveals } : {}),
    };
  }
  const pool = suspect.deflections;
  return { reply: pool[turn % pool.length] ?? suspect.shrug };
}
