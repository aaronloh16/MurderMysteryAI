/**
 * Case schema.
 *
 * A case is authored once and holds a single hidden truth. Everything a
 * suspect may say, scripted or generated, is derived from this file, which
 * keeps every suspect consistent with the same solution across demo, text
 * and voice modes.
 *
 * Only `toPublicCase()` output ever reaches the browser. The truth, the
 * culprit flag, scripted replies and clue contents stay on the server until
 * the player earns them.
 */

export type ClueKind = 'report' | 'object' | 'document' | 'testimony' | 'record';

export interface Clue {
  id: string;
  title: string;
  kind: ClueKind;
  /** One line, shown on the evidence board card. */
  summary: string;
  /** Full text, shown when the card is opened. */
  detail: string;
  /** Scene clues are in the file from the start; testimony is earned. */
  source: 'scene' | { suspectId: string };
}

export interface Topic {
  id: string;
  /** Suggested question shown as a chip. Phrased as the detective. */
  prompt: string;
  /** Lower-case keyword stems used by the scripted engine. */
  keywords: string[];
  /** Scripted answer (demo mode) and the canonical gist for the LLM. */
  reply: string;
  /** Clue unlocked when this topic is covered. */
  reveals?: string;
  /** Topic is only available once these clues are on the board. */
  requires?: string[];
}

export interface Reaction {
  /** Evidence the detective lays on the table. */
  clueId: string;
  reply: string;
  reveals?: string;
}

export type SkinTone = 'porcelain' | 'fair' | 'olive' | 'tan' | 'brown' | 'deep';
export type HairStyle = 'bob' | 'waves' | 'slick' | 'short' | 'bun' | 'bald' | 'long';
export type Outfit = 'suit' | 'gown' | 'vest' | 'blazer' | 'turtleneck' | 'uniform' | 'cardigan';

export interface PortraitSpec {
  skin: SkinTone;
  hair: HairStyle;
  hairColor: string;
  outfit: Outfit;
  outfitColor: string;
  accent: string;
  hat?: 'fedora' | 'cloche';
  glasses?: boolean;
  mustache?: boolean;
  earrings?: boolean;
  lipstick?: string;
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  age: number;
  /** One-line public description for the dossier. */
  tagline: string;
  /** What they told the first officer on the scene. Public. */
  statement: string;
  portrait: PortraitSpec;
  /** Realtime voice id (OpenAI voices via AI Gateway). */
  voice: string;
  // ---- hidden from the client ----
  culprit: boolean;
  /** How they talk. Used verbatim in the LLM prompt. */
  persona: string;
  /** True facts this character knows (knowledge boundary). */
  knows: string[];
  /** What they are hiding and why. */
  hiding: string[];
  /** Lines they will hold to until confronted. */
  coverStory: string;
  greeting: string;
  topics: Topic[];
  reactions: Reaction[];
  /** Scripted fallbacks when nothing matches. */
  deflections: string[];
  /** Reply when presented evidence they have no particular reaction to. */
  shrug: string;
}

export interface MotiveOption {
  id: string;
  label: string;
}

export interface Case {
  id: string;
  title: string;
  subtitle: string;
  era: string;
  location: string;
  /** Estimated play time in minutes. */
  minutes: number;
  difficulty: 'Short' | 'Standard';
  victim: { name: string; description: string };
  /** Typed briefing paragraphs on the case file. */
  briefing: string[];
  /** Palette accent for the case card. */
  accent: string;
  suspects: Suspect[];
  clues: Clue[];
  motives: MotiveOption[];
  solution: {
    culprit: string;
    motive: string;
    /** Evidence that actually proves the case. Player must pick from these. */
    keyEvidence: string[];
    /** The reveal, told after the accusation. */
    truth: string[];
    headline: { correct: string; wrong: string; paper: string };
  };
}

// ---- Public projections ----

export interface PublicSuspect {
  id: string;
  name: string;
  role: string;
  age: number;
  tagline: string;
  statement: string;
  portrait: PortraitSpec;
  suggestions: { id: string; prompt: string; requires?: string[] }[];
  /** Number of clues this suspect can give up; drives the composure meter. */
  secrets: number;
}

export interface PublicClue {
  id: string;
  title: string;
  kind: ClueKind;
  summary: string;
  detail: string;
  sourceSuspectId: string | null;
}

export interface PublicCase {
  id: string;
  title: string;
  subtitle: string;
  era: string;
  location: string;
  minutes: number;
  difficulty: Case['difficulty'];
  victim: Case['victim'];
  briefing: string[];
  accent: string;
  suspects: PublicSuspect[];
  /** Only scene evidence. Testimony arrives as it is earned. */
  sceneClues: PublicClue[];
  totalClues: number;
  motives: MotiveOption[];
}
