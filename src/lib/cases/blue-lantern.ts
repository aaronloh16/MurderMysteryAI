import type { Case } from './types';

/**
 * THE LAST SET AT THE BLUE LANTERN
 *
 * Hidden truth: Frank Doyle, the manager, had been skimming the till for a
 * year. Leo found the hole in the books and told Frank he would call the
 * police on Monday. At 12:35 AM, while Vivian sang, Frank carried Leo's
 * usual nightcap upstairs, laced with strychnine rat poison from the cellar
 * that only he and Leo could unlock. He then claimed Leo poured his own
 * drink from the office decanter, which was never touched.
 */
export const blueLantern: Case = {
  id: 'blue-lantern',
  title: 'The Last Set at the Blue Lantern',
  subtitle: 'A nightclub owner dies during the final song of the night.',
  era: 'Harbor City, November 1948',
  location: 'The Blue Lantern, a jazz club on Pier Street',
  minutes: 10,
  difficulty: 'Short',
  accent: '#3b6ea8',
  victim: {
    name: 'Leo Marchetti',
    description: 'Owner of the Blue Lantern. Fifty-two. Generous with drinks, stingy with contracts.',
  },
  briefing: [
    'At 1:10 AM the bartender found Leo Marchetti dead at his desk in the upstairs office of the Blue Lantern. The band was still packing up.',
    'The coroner says poison, swallowed with rye whiskey sometime between 12:30 and 12:45, while the last set was playing. Three people had reason to climb those stairs tonight.',
    'Talk to them. Lay the evidence on the table when a story does not fit. When you know who did it, why, and what proves it, make your accusation. You only get one.',
  ],
  motives: [
    { id: 'jealousy', label: 'Jealousy: Leo stood between them and someone they loved' },
    { id: 'debt', label: 'Debt: Leo was about to call in money they could not pay' },
    { id: 'exposure', label: 'Exposure: Leo had found money missing and meant to go to the police' },
    { id: 'contract', label: 'Freedom: Leo refused to release them from a contract' },
  ],
  clues: [
    {
      id: 'coroner',
      title: "Coroner's preliminary",
      kind: 'report',
      summary: 'Strychnine in rye. Swallowed between 12:30 and 12:45 AM.',
      detail:
        'Cause of death: strychnine poisoning. Stomach contents: rye whiskey, roughly two ounces. Given the onset of symptoms, the dose was swallowed between 12:30 and 12:45 AM. Death followed at about 12:55.',
      source: 'scene',
    },
    {
      id: 'glasses',
      title: 'Two glasses on the desk',
      kind: 'object',
      summary: 'One with red lipstick, dry and clean. One with poisoned rye.',
      detail:
        'A short tumbler with traces of rye and strychnine, and a second glass rimmed with red lipstick in a shade called Scarlet Night. The lipstick glass had dried and tested clean. Whoever drank from it did so well before Leo did.',
      source: 'scene',
    },
    {
      id: 'decanter',
      title: 'The office decanter',
      kind: 'object',
      summary: 'Leo’s private rye decanter. No poison. Dust ring untouched.',
      detail:
        'The crystal decanter on Leo’s sideboard holds clean rye. The level matches the pencil mark Leo kept on the label, and the dust ring under the stopper has not been disturbed tonight. Nobody poured from it after the stopper last settled.',
      source: 'scene',
    },
    {
      id: 'cellar',
      title: 'Rat poison in the cellar',
      kind: 'record',
      summary: 'Strychnine tin with a freshly pried lid. Two keys to the cellar.',
      detail:
        'A tin of strychnine rat poison sits on the cellar shelf, its lid scraped open recently. The cellar is kept locked. There are two keys: one on Leo’s own ring, found in his pocket, and one carried by the club manager.',
      source: 'scene',
    },
    {
      id: 'vivian-visit',
      title: 'Vivian’s 12:15 visit',
      kind: 'testimony',
      summary: 'Vivian drank with Leo at 12:15 from the decanter. He was fine.',
      detail:
        'Vivian admits she went up at 12:15, before the last set, to beg Leo to release her from her contract so she could take a job in New York. He poured her a glass from the decanter, laughed at her, and said no. When she left he was perfectly well.',
      source: { suspectId: 'vivian' },
    },
    {
      id: 'vivian-stairs',
      title: 'Seen on the stairs at 12:35',
      kind: 'testimony',
      summary: 'From the stage, Vivian saw Frank carry a glass upstairs.',
      detail:
        'The stage lights face the staircase. During "Moonlight in Vermont", about 12:35, Vivian saw Frank Doyle climb the stairs to the office with a single glass on a silver tray. "Leo’s nightcap. Frank brings it up every night at the half hour."',
      source: { suspectId: 'vivian' },
    },
    {
      id: 'eddie-alibi',
      title: 'An IOU in the alley',
      kind: 'document',
      summary: 'Eddie was with loan shark Sal Brandt from 12:25 to 12:50.',
      detail:
        'Eddie produces a crumpled IOU for $2,000, made out to Sal Brandt and dated tonight, 12:40 AM, signed in the alley behind the club. Sal’s driver can put Eddie there from 12:25 until nearly 12:50.',
      source: { suspectId: 'eddie' },
    },
    {
      id: 'eddie-skim',
      title: 'Somebody close',
      kind: 'testimony',
      summary: 'Leo told Eddie someone close was skimming the till.',
      detail:
        'At about nine, Leo told Eddie he had found a year’s worth of money missing from the till. "Somebody close to me, Eddie. Somebody with keys. Monday I call it in to the precinct."',
      source: { suspectId: 'eddie' },
    },
    {
      id: 'frank-nightcap',
      title: 'Frank carried the nightcap',
      kind: 'testimony',
      summary: 'Frank admits he took Leo’s drink up at 12:35.',
      detail:
        'Confronted, Frank admits he poured Leo’s nightcap at the bar and carried it upstairs at about 12:35, as he does every night. He insists he only set it down and left.',
      source: { suspectId: 'frank' },
    },
  ],
  suspects: [
    {
      id: 'vivian',
      name: 'Vivian Cross',
      role: 'Headline singer',
      age: 31,
      tagline: 'The voice on the Blue Lantern marquee. Under contract to Leo for three more years.',
      statement: 'I was on stage from 12:30 until one. A hundred people watched me sing.',
      voice: 'shimmer',
      culprit: false,
      portrait: {
        skin: 'fair',
        hair: 'waves',
        hairColor: '#c9a46a',
        outfit: 'gown',
        outfitColor: '#5a1a22',
        accent: '#b3263a',
        earrings: true,
        lipstick: '#b3263a',
      },
      persona:
        'Smoky, theatrical, quick with a wounded line. Proud, a little tired. Speaks in short, musical sentences and calls the detective "darling" when she wants to deflect.',
      knows: [
        'You sang the last set from 12:30 to 1:00 AM without a break.',
        'At 12:15 you went up to Leo’s office to beg for release from your contract so you could take a New York job. He poured you rye from his decanter, you drank, he refused. He was alive and well when you left at about 12:25. The lipstick glass is yours.',
        'The stage lights face the staircase. At about 12:35, during "Moonlight in Vermont", you saw Frank Doyle carry a single glass upstairs on a silver tray. That is Leo’s nightcap; Frank brings it every night.',
        'Leo had benched Eddie Malone tonight and hired a house pianist instead.',
      ],
      hiding: [
        'You hide the 12:15 visit because it gives you a motive and your lipstick is on the glass.',
        'You do not volunteer what you saw on the stairs because Frank has always been kind to you, and you do not think it means anything until pushed.',
      ],
      coverStory: 'I was on stage. I hardly saw Leo all night.',
      greeting:
        'Detective. If you’re here for an autograph, your timing is terrible. If you’re here about Leo, it’s worse.',
      topics: [
        {
          id: 'alibi',
          prompt: 'Where were you between 12:30 and 12:45?',
          keywords: ['where', 'alibi', '12:30', '12:45', 'stage', 'sing', 'set', 'during'],
          reply:
            'Under a white spotlight, darling, singing four songs to a room full of sailors and bankers. From half past twelve until one. You couldn’t have a better alibi if you paid for it.',
        },
        {
          id: 'leo',
          prompt: 'What was your relationship with Leo?',
          keywords: ['leo', 'relationship', 'boss', 'feel', 'love', 'affair', 'like him'],
          reply:
            'Leo owned the club, the marquee and, on paper, me. Three more years on a contract I signed when I was hungry. I didn’t love him. I didn’t have to.',
        },
        {
          id: 'office',
          prompt: 'Did you go up to his office tonight?',
          keywords: ['office', 'upstairs', 'visit', 'went up', 'see him', 'before', 'glass', 'lipstick', 'contract', 'new york'],
          reply:
            'All right. Yes. At a quarter past twelve, before the set. I have an offer in New York and Leo holds my contract. I asked him to let me go. He poured me a rye from that crystal decanter of his, laughed, and said no. He was fine when I left. Annoyingly fine.',
          reveals: 'vivian-visit',
        },
        {
          id: 'stairs',
          prompt: 'From the stage, did you see anyone go upstairs?',
          keywords: ['stairs', 'staircase', 'saw', 'see anyone', 'notice', 'upstairs', 'who went', 'from the stage'],
          requires: ['vivian-visit'],
          reply:
            'The lights face the staircase, so I see everything and nobody sees me looking. During "Moonlight in Vermont", about twenty-five to one, Frank went up with a glass on that silver tray. Leo’s nightcap. He takes it up every night at the half hour. I didn’t think anything of it until now.',
          reveals: 'vivian-stairs',
        },
        {
          id: 'eddie',
          prompt: 'What about Eddie, the piano player?',
          keywords: ['eddie', 'piano', 'keys', 'malone'],
          reply:
            'Poor Eddie. Leo benched him tonight and brought in some kid from the union hall. Eddie owes money to half the waterfront. He spent the set sulking in the alley, I’d bet.',
        },
        {
          id: 'frank',
          prompt: 'Tell me about Frank Doyle.',
          keywords: ['frank', 'doyle', 'bartender', 'manager'],
          reply:
            'Frank runs the floor and the books, or he did when Leo let him. He’s been here longer than the paint. Always a kind word for me. I can’t picture him hurting a fly.',
        },
      ],
      reactions: [
        {
          clueId: 'glasses',
          reply:
            'Scarlet Night. Yes, that’s mine. Don’t look at me like that. I went up at a quarter past twelve, before the set, to beg him to let me out of my contract. He poured me a rye from the decanter. He was alive when I left.',
          reveals: 'vivian-visit',
        },
        {
          clueId: 'decanter',
          reply:
            'That decanter is what he poured mine from at quarter past. If it’s clean, then whatever killed him didn’t come out of it. Which means somebody brought it to him.',
        },
        {
          clueId: 'frank-nightcap',
          reply: 'So he admits it. I told you what I saw. I just didn’t want it to mean anything.',
        },
      ],
      deflections: [
        'You’re asking the singer, darling. Ask me about the music, or about who was where.',
        'I sing, I smile, I go home. Try another question.',
        'That’s a long way around the block, detective. What do you really want to know?',
      ],
      shrug: 'I don’t know what you want me to see in that. I was busy being looked at all night.',
    },
    {
      id: 'eddie',
      name: 'Eddie “Keys” Malone',
      role: 'Piano player',
      age: 38,
      tagline: 'Fast hands, slow luck. Benched by Leo on the night Leo died.',
      statement: 'I was out back having a smoke. Alone. The whole set.',
      voice: 'ballad',
      culprit: false,
      portrait: {
        skin: 'tan',
        hair: 'slick',
        hairColor: '#1d1a17',
        outfit: 'vest',
        outfitColor: '#2a2f3a',
        accent: '#c9a45c',
        mustache: true,
      },
      persona:
        'Jittery, funny, talks too fast. Uses music slang ("cats", "gig", "the changes"). Gets defensive about money and then overshares.',
      knows: [
        'Leo benched you tonight and hired a house pianist. You were furious.',
        'You owe Leo $2,000 from cards, and he told you to pay by Friday.',
        'From 12:25 to about 12:50 you were in the alley with loan shark Sal Brandt, signing an IOU for $2,000 to pay Leo off. You have the IOU in your pocket, dated 12:40.',
        'At about nine tonight Leo told you he had found a year of money missing from the till: "Somebody close to me, somebody with keys. Monday I call it in."',
        'You never went upstairs tonight.',
      ],
      hiding: [
        'You lie about being alone in the alley because borrowing from Sal Brandt is humiliating and dangerous.',
        'You will share what Leo said about the till if asked about Leo’s money, enemies, or business, because you want the heat off you.',
      ],
      coverStory: 'I was alone in the alley having a smoke the whole set.',
      greeting:
        'Hey, hey. Detective. Look, before you ask, I didn’t like the guy, but I didn’t do the guy. Different song entirely.',
      topics: [
        {
          id: 'alibi',
          prompt: 'Where were you during the last set?',
          keywords: ['where', 'alibi', 'set', 'during', '12:30', '12:45', 'smoke'],
          reply:
            'Out back. Alley. Having a smoke. A long smoke. Leo benched me, so what was I gonna do, sit at the bar and watch some kid butcher my changes?',
        },
        {
          id: 'alone',
          prompt: 'Can anyone confirm you were in the alley?',
          keywords: ['alone', 'confirm', 'anyone', 'witness', 'with you', 'who else', 'prove', 'lying', 'truth', 'alley'],
          reply:
            'Okay. Okay. I wasn’t alone. Sal Brandt was out there with his driver. I borrowed two grand to pay Leo what I owed him. Here, I signed this at twenty to one. Sal’s guy can tell you I didn’t leave that alley until near ten to.',
          reveals: 'eddie-alibi',
        },
        {
          id: 'debt',
          prompt: 'Did you owe Leo money?',
          keywords: ['owe', 'debt', 'money', 'cards', 'gambl', 'pay'],
          reply:
            'Two grand. Cards. Leo said Friday or I’d never play Pier Street again. Which, sure, looks bad. But a dead man can’t forgive a debt, and the estate sure won’t.',
        },
        {
          id: 'skim',
          prompt: 'Did Leo have any trouble with the business?',
          keywords: ['business', 'till', 'books', 'enemies', 'trouble', 'worried', 'stealing', 'skim', 'missing', 'who would'],
          reply:
            'Funny you ask. Around nine Leo pulls me aside, real quiet, not like him. Says a year of money’s gone from the till. "Somebody close to me, Eddie. Somebody with keys. Monday I call it in." I figured he was telling me so I’d know he wasn’t talking about me.',
          reveals: 'eddie-skim',
        },
        {
          id: 'benched',
          prompt: 'Why did Leo bench you tonight?',
          keywords: ['bench', 'replace', 'fired', 'why', 'kid', 'pianist'],
          reply:
            'Because I owed him, and Leo liked to remind you. Hired a union kid for the night. Embarrassing. But I don’t kill people over a gig.',
        },
        {
          id: 'frank',
          prompt: 'What do you make of Frank?',
          keywords: ['frank', 'doyle', 'bartender', 'manager'],
          reply:
            'Frank’s the guy who knows where everything is. Keys to the cellar, keys to the till, keys to the back door. Twenty years with Leo. Bought a new Buick in the spring, which, on a bartender’s pay, I always wondered.',
        },
      ],
      reactions: [
        {
          clueId: 'coroner',
          reply:
            'Twelve-thirty to twelve forty-five? Then I’m clear. I was out back with Sal Brandt. Here, I signed this IOU at twenty to one. Look at the date. Look at the time.',
          reveals: 'eddie-alibi',
        },
        {
          clueId: 'cellar',
          reply:
            'Cellar’s locked, always. Leo had a key and Frank had a key. I’ve never been down there in my life. I’m a piano player, not a rat catcher.',
        },
        {
          clueId: 'frank-nightcap',
          reply:
            'Frank took the drink up? Then Leo was talking about Frank. Somebody close, somebody with keys. Brother.',
        },
      ],
      deflections: [
        'I don’t know nothing about that, detective. Ask me about tonight.',
        'Man, you’re playing in a key I don’t know. Try me on something else.',
        'Look, I just play piano. Mostly. When I’m allowed.',
      ],
      shrug: 'Means nothing to me. Swear on my left hand.',
    },
    {
      id: 'frank',
      name: 'Frank Doyle',
      role: 'Club manager and bartender',
      age: 55,
      tagline: 'Twenty years behind Leo’s bar. Found the body.',
      statement: 'I never left the bar. Leo poured his own nightcap upstairs, like always. I went up at ten past one and found him.',
      voice: 'ash',
      culprit: true,
      portrait: {
        skin: 'porcelain',
        hair: 'short',
        hairColor: '#8a8580',
        outfit: 'vest',
        outfitColor: '#1f1f22',
        accent: '#d8d2c4',
        glasses: true,
      },
      persona:
        'Calm, fatherly, measured. Wipes the bar while he talks. Calls the detective "friend". Grief is performed a touch too smoothly. Under pressure he gets clipped and precise, never loud.',
      knows: [
        'You are the killer. You have skimmed about $18,000 from the till over a year. Leo found out and told you on Thursday he would go to the police on Monday.',
        'Tonight you took strychnine rat poison from the locked cellar (only you and Leo have keys), poured Leo’s usual nightcap of rye at the bar, laced it, and carried it upstairs on a silver tray at about 12:35, during Vivian’s set.',
        'You came back down within two minutes and stayed behind the bar. At 1:10 you went up and "found" him.',
        'Vivian was in Leo’s office at 12:15 and drank from the decanter. Eddie was out back in the alley. You saw Sal Brandt’s car outside.',
      ],
      hiding: [
        'Never confess to the murder or the skimming, even under pressure. Deny, minimise, redirect.',
        'Your cover story is that Leo poured his own nightcap from the office decanter and you never left the bar. Hold to it until the detective presents evidence that the decanter was untouched or that you were seen on the stairs. Then admit only that you carried the glass up, as you do every night, and insist you put it down and left.',
        'Gently steer suspicion toward Vivian (lipstick glass, contract) and Eddie (debt).',
      ],
      coverStory: 'I never left the bar. Leo poured his own nightcap from the decanter in his office.',
      greeting:
        'Detective. Pull up a stool. I’ve poured for Leo Marchetti every night for twenty years, friend. Ask me whatever you need.',
      topics: [
        {
          id: 'alibi',
          prompt: 'Where were you between 12:30 and 12:45?',
          keywords: ['where', 'alibi', '12:30', '12:45', 'during', 'set'],
          reply:
            'Right here, friend. Behind this bar. Saturday night, last set, I had a line three deep. Ask anybody who got a drink.',
        },
        {
          id: 'nightcap',
          prompt: 'Who poured Leo’s last drink?',
          keywords: ['drink', 'nightcap', 'pour', 'rye', 'whiskey', 'glass', 'tray'],
          reply:
            'Leo poured his own up there. Kept a crystal decanter of the good rye on his sideboard. Wouldn’t drink the bar stuff, said it was for customers.',
        },
        {
          id: 'body',
          prompt: 'Walk me through finding the body.',
          keywords: ['found', 'body', 'find', '1:10', 'discover', 'dead'],
          reply:
            'Ten past one I went up to settle the night’s take with him. Door was open. He was slumped over the desk. I knew before I touched him. Twenty years, detective.',
        },
        {
          id: 'cellar',
          prompt: 'Who has keys to the cellar?',
          keywords: ['cellar', 'key', 'basement', 'poison', 'rat'],
          reply:
            'Leo and me. We keep the stock down there. And yes, there’s rat poison, it’s a waterfront club, friend. Anybody could have got hold of strychnine in this town.',
        },
        {
          id: 'money',
          prompt: 'How were the club’s finances?',
          keywords: ['money', 'books', 'till', 'finance', 'skim', 'steal', 'missing', 'ledger', 'buick', 'car'],
          reply:
            'Leo kept the books himself, and badly. If there’s money missing, I’d look at a man who owes two thousand dollars to the wrong people. I’m not naming names.',
        },
        {
          id: 'others',
          prompt: 'Who do you think did it?',
          keywords: ['who', 'think', 'suspect', 'did it', 'kill', 'vivian', 'eddie'],
          reply:
            'I don’t like saying it. Vivian went up to see him before her set, and she wanted out of that contract more than she wanted air. And Eddie owed him money he didn’t have.',
        },
      ],
      reactions: [
        {
          clueId: 'decanter',
          reply:
            '...The decanter. All right. I may have misspoke. I poured his nightcap at the bar and took it up, about twenty-five to one. Same as every night. I set it down and I came right back down. That doesn’t make me anything but a bartender.',
          reveals: 'frank-nightcap',
        },
        {
          clueId: 'vivian-stairs',
          reply:
            'Vivian saw that, did she. Fine. I carried his nightcap up at twenty-five to one, like every night for twenty years. I put it on his desk and came back down. That’s all.',
          reveals: 'frank-nightcap',
        },
        {
          clueId: 'eddie-skim',
          reply:
            'Leo said a lot of things after nine o’clock. Somebody close? Eddie is close to anyone who’ll lend him a dollar.',
        },
        {
          clueId: 'cellar',
          reply: 'I told you. Leo and I have keys. Doesn’t mean I went down there tonight.',
        },
        {
          clueId: 'glasses',
          reply: 'Lipstick. That’s Vivian’s color. I’m only saying what’s in front of you, friend.',
        },
      ],
      deflections: [
        'I pour drinks, friend. I don’t follow you.',
        'Ask me something I can answer, detective. I want this solved as much as you do.',
        'That’s not something I’d know about.',
      ],
      shrug: 'Can’t say that means much to me, friend.',
    },
  ],
  solution: {
    culprit: 'frank',
    motive: 'exposure',
    keyEvidence: ['decanter', 'vivian-stairs', 'frank-nightcap', 'cellar', 'eddie-skim'],
    truth: [
      'Frank Doyle had been skimming the Blue Lantern’s till for a year, about eighteen thousand dollars, enough for a new Buick and a lot of quiet. On Thursday Leo found the hole in the books and told Frank he would take it to the precinct on Monday.',
      'Tonight Frank unlocked the cellar with one of only two keys, scraped a dose from the rat-poison tin, and poured Leo’s usual nightcap at the bar. At 12:35, while every eye in the room was on Vivian, he carried it upstairs on a silver tray.',
      'His one mistake was the story he told afterwards. Leo never poured from the decanter, because Frank had already brought him a drink. Vivian, under the lights that face the stairs, watched him do it.',
    ],
    headline: {
      paper: 'The Harbor City Herald',
      correct: 'LANTERN BARMAN HELD IN OWNER’S POISONING',
      wrong: 'WRONG MAN JAILED AS LANTERN KILLER WALKS',
    },
  },
};
