import type { Case } from './types';

/**
 * THE BANHAMMER AFFAIR
 *
 * Hidden truth: Alexandra Morgan learned that Thomas was forcing through a
 * merger with OmniCorp at Friday's board meeting. Her 40% stake would fall
 * to 4%. At 1:09 PM she dropped out of an audio-only investor call she had
 * joined from her phone, walked to Thomas's office in her grey blazer, and
 * struck him with the novelty keyboard trophy. She rejoined the call at
 * 1:17 and posted in Slack at 1:21 as if nothing had happened.
 */
export const banhammer: Case = {
  id: 'banhammer',
  title: 'The Banhammer Affair',
  subtitle: 'A tech CEO, a novelty keyboard, and a Slack channel on fire.',
  era: 'San Francisco, present day',
  location: 'TechVision HQ, 14th floor, open-plan office',
  minutes: 15,
  difficulty: 'Standard',
  accent: '#8b1e1e',
  victim: {
    name: 'Thomas Richardson',
    description: 'Founder and CEO of TechVision. Forty-six. Brilliant, charming, and in the habit of making enemies on purpose.',
  },
  briefing: [
    'At 1:34 PM an intern found Thomas Richardson dead in his glass-walled office, struck down with the Banhammer, a giant novelty keyboard he handed out as an award at the holiday party.',
    'The medical examiner puts the time of death between 1:00 and 1:30 PM. The whole company was arguing in #app-fire about a broken release. Four people close to Thomas had a reason to want him gone.',
    'Interrogate them. Present evidence to break a story. Then name the killer, the motive, and the proof.',
  ],
  motives: [
    { id: 'inheritance', label: 'Money: they stood to inherit his fortune' },
    { id: 'merger', label: 'Control: a secret merger would wipe out their stake in the company' },
    { id: 'fraud', label: 'Fear: he was forcing them to commit fraud' },
    { id: 'treason', label: 'Duty: he was selling company secrets abroad' },
  ],
  clues: [
    {
      id: 'me-report',
      title: 'Medical examiner',
      kind: 'report',
      summary: 'Blunt force, one blow. Time of death 1:00 to 1:30 PM.',
      detail:
        'A single blow to the left temple from a heavy, angular object consistent with the Banhammer. The attacker was right-handed and stood facing the victim, likely someone he let walk right up to his desk. Death between 1:00 and 1:30 PM.',
      source: 'scene',
    },
    {
      id: 'banhammer',
      title: 'The Banhammer',
      kind: 'object',
      summary: 'Novelty keyboard trophy. Wiped clean. ESC key missing.',
      detail:
        'A three-foot acrylic keyboard on a steel stand, engraved BANHAMMER: FOR SHIPPING IT ANYWAY. Wiped clean of prints. The ESC keycap was knocked loose and has not been found.',
      source: 'scene',
    },
    {
      id: 'slack',
      title: '#app-fire export',
      kind: 'record',
      summary: 'Everyone posted through the window, except for one gap.',
      detail:
        'Messages 1:00 to 1:30 PM. Victoria Chen posts at 1:04, 1:10, 1:14 and 1:22 (spreadsheets, all from her desktop). James Wilson posts at 1:15: "east wing cam 4 down again". Alexandra Morgan posts at 1:07, then nothing until 1:21: "sorry, was on with investors, catching up". Sarah Richardson is not a member of the workspace.',
      source: 'scene',
    },
    {
      id: 'call-log',
      title: 'Investor call log',
      kind: 'record',
      summary: 'Alexandra joined audio-only from her phone. Dropped 1:09 to 1:17.',
      detail:
        'Pulled from the video platform: Alexandra Morgan joined the Singapore investor call at 12:45 PM from a mobile device, camera off. Her line disconnected at 1:09 PM and reconnected at 1:17 PM. Participants recall she said "sorry, terrible wifi".',
      source: 'scene',
    },
    {
      id: 'james-footage',
      title: 'Private hallway camera',
      kind: 'testimony',
      summary: 'At 1:11 PM, someone in a grey blazer walks toward the CEO office.',
      detail:
        'James admits he installed an unauthorized camera covering the executive hallway. At 1:11 PM it shows a figure in a grey blazer walking quickly toward Thomas’s office, face turned away. At 1:15 the same figure walks back the other way.',
      source: { suspectId: 'james' },
    },
    {
      id: 'james-secrets',
      title: 'Thomas sold secrets',
      kind: 'testimony',
      summary: 'James found Thomas leaking source code to a foreign buyer.',
      detail:
        'Through his own surveillance, James discovered Thomas had been selling TechVision source code to a foreign investor. He was building a file to take to the board. Thomas was worth more to James alive and exposed than dead.',
      source: { suspectId: 'james' },
    },
    {
      id: 'sarah-call',
      title: 'A call from the roof garden',
      kind: 'testimony',
      summary: 'Sarah was on a 40-minute call with her divorce lawyer from 12:50.',
      detail:
        'Sarah admits she was in the rooftop garden on a call with her divorce attorney from 12:50 to 1:31 PM. Her phone log and the attorney’s billing records confirm it.',
      source: { suspectId: 'sarah' },
    },
    {
      id: 'sarah-friday',
      title: '"Alex is going to hate me"',
      kind: 'testimony',
      summary: 'Thomas told Sarah that Alexandra would hate him after Friday.',
      detail:
        'On Monday night Thomas told Sarah, laughing: "Alex is going to hate me after Friday. She just doesn’t know it yet." Friday is the board meeting.',
      source: { suspectId: 'sarah' },
    },
    {
      id: 'victoria-merger',
      title: 'The OmniCorp term sheet',
      kind: 'document',
      summary: 'Friday’s merger would cut Alexandra’s stake from 40% to 4%.',
      detail:
        'Victoria produces a confidential term sheet: TechVision to merge into OmniCorp, voted Friday. Thomas keeps a board seat. Alexandra Morgan’s 40% founder stake is diluted to roughly 4% with no seat. Victoria says Alexandra found out on Tuesday.',
      source: { suspectId: 'victoria' },
    },
    {
      id: 'victoria-argument',
      title: 'The last argument',
      kind: 'testimony',
      summary: 'At 12:58 Thomas was on the phone: "You’ll sign, Alex, or you’re gone."',
      detail:
        'Victoria left Thomas’s office at 12:58 PM after he refused to discuss the books. As she left he took a call and she heard him say: "You’ll sign, Alex, or you’re gone. Friday."',
      source: { suspectId: 'victoria' },
    },
  ],
  suspects: [
    {
      id: 'alexandra',
      name: 'Alexandra Morgan',
      role: 'Co-founder and business partner',
      age: 44,
      tagline: 'Built TechVision with Thomas from a garage. Owns 40% of it, for now.',
      statement: 'I was on a call with our Singapore investors from 12:45 until half past one. Conference room B.',
      voice: 'sage',
      culprit: true,
      portrait: {
        skin: 'olive',
        hair: 'bob',
        hairColor: '#2b211c',
        outfit: 'blazer',
        outfitColor: '#6d6e72',
        accent: '#c9c9cc',
        earrings: true,
      },
      persona:
        'Composed, clipped, analytical. Ex-Wall Street. Answers questions with questions. Uses business jargon as armour ("let’s level-set"). When cornered, goes very still and very polite.',
      knows: [
        'You are the killer. On Tuesday you discovered Thomas planned to merge TechVision into OmniCorp on Friday, diluting your 40% stake to about 4% and removing you from the board.',
        'At 12:45 you joined the Singapore investor call from your phone, audio only, in conference room B. At 1:09 you deliberately dropped off, walked to Thomas’s office in your grey blazer, argued, and struck him with the Banhammer. You wiped it. You were back on the call at 1:17 and posted in Slack at 1:21.',
        'You pocketed the loose ESC keycap without thinking and later dropped it in a planter by the elevators.',
        'Thomas phoned you at 12:58 and said "You’ll sign, Alex, or you’re gone."',
      ],
      hiding: [
        'Never confess. Your cover story is that you were on the investor call in conference room B from 12:45 to 1:30 without interruption.',
        'Deny knowing about the merger until presented with the term sheet or Thomas’s "hate me after Friday" remark; then admit you knew but insist you were negotiating, not desperate.',
        'If presented with the call log, blame bad wifi. If presented with the hallway footage, say lots of people own grey blazers, while visibly wearing one.',
        'Point suspicion at Sarah (inheritance) and James (surveillance).',
      ],
      coverStory: 'I was on the investor call in conference room B from 12:45 to 1:30.',
      greeting:
        'Detective. Let’s be efficient. I have a company to keep alive this afternoon. What do you need?',
      topics: [
        {
          id: 'alibi',
          prompt: 'Where were you between 1:00 and 1:30?',
          keywords: ['where', 'alibi', '1:00', '1:30', 'during', 'between'],
          reply:
            'Conference room B, on with our Singapore investors from a quarter to one until half past. Fourteen people heard my voice. That’s about as airtight as it gets.',
        },
        {
          id: 'call',
          prompt: 'Did you stay on that call the whole time?',
          keywords: ['whole time', 'entire', 'leave', 'left', 'drop', 'disconnect', 'phone', 'camera', 'video'],
          reply:
            'The wifi in this building is a crime of its own. I may have dropped once or twice. I didn’t leave the room, if that’s what you’re implying.',
        },
        {
          id: 'thomas',
          prompt: 'How were things between you and Thomas?',
          keywords: ['thomas', 'relationship', 'partner', 'get along', 'feel', 'friend'],
          reply:
            'Fourteen years of partnership. We disagreed constantly; that’s how good companies get built. I respected him. I didn’t always like him. Write both down.',
        },
        {
          id: 'merger',
          prompt: 'Was Thomas planning any deals?',
          keywords: ['merger', 'deal', 'omnicorp', 'acquisition', 'board', 'friday', 'shares', 'stake', 'dilut'],
          reply:
            'There are always rumours. I don’t comment on hypothetical transactions, detective, even to the police.',
        },
        {
          id: 'others',
          prompt: 'Who would want Thomas dead?',
          keywords: ['who', 'want', 'kill', 'enemies', 'suspect', 'think'],
          reply:
            'Ask who benefits. His wife inherits everything and was meeting a divorce lawyer, I’m told. And our head of security watches all of us a little too closely. I’d start there.',
        },
        {
          id: 'blazer',
          prompt: 'What were you wearing today?',
          keywords: ['wear', 'blazer', 'jacket', 'grey', 'gray', 'clothes'],
          requires: ['james-footage'],
          reply:
            'This. Grey blazer. Along with half the women in tech and every venture capitalist on Sand Hill Road. Is that your evidence?',
        },
      ],
      reactions: [
        {
          clueId: 'call-log',
          reply:
            'So I dropped for a few minutes. The wifi in this building is notorious; ask anyone. I was in conference room B, reconnecting.',
        },
        {
          clueId: 'james-footage',
          reply:
            '...Grey blazer. Do you know how many grey blazers walk this floor every day? I didn’t think so.',
        },
        {
          clueId: 'victoria-merger',
          reply:
            'Fine. Yes, I knew about OmniCorp. I found out Tuesday. I was negotiating. People negotiate, detective. They don’t bludgeon each other with office furniture.',
        },
        {
          clueId: 'sarah-friday',
          reply:
            'Thomas liked a dramatic line. He thought Friday would hurt me. He underestimated how good my lawyers are.',
        },
        {
          clueId: 'victoria-argument',
          reply:
            'He said things like that to everyone. It was his management style. I hung up on him and went back to my investors.',
        },
        {
          clueId: 'slack',
          reply: 'I was talking to investors. I don’t post in Slack while I’m talking to investors. That’s called focus.',
        },
      ],
      deflections: [
        'Let’s level-set. Ask me something relevant to Thomas’s death.',
        'I don’t see how that’s material.',
        'Next question.',
      ],
      shrug: 'And you’re showing me this because?',
    },
    {
      id: 'sarah',
      name: 'Sarah Richardson',
      role: 'Victim’s wife',
      age: 39,
      tagline: 'Married to Thomas for eight years. Inherits nearly everything.',
      statement: 'I came to bring Thomas lunch. I was up in the roof garden. I never saw him.',
      voice: 'coral',
      culprit: false,
      portrait: {
        skin: 'brown',
        hair: 'bun',
        hairColor: '#1a1210',
        outfit: 'cardigan',
        outfitColor: '#c7b49a',
        accent: '#e8dcc4',
        earrings: true,
        lipstick: '#8a3b3b',
      },
      persona:
        'Elegant, controlled, grief held behind good manners. Speaks softly and precisely. Bristles at the word "inheritance". Becomes candid once she decides the detective is fair.',
      knows: [
        'You were planning to divorce Thomas. From 12:50 to 1:31 PM you were in the rooftop garden on a call with your divorce attorney; your phone log and the lawyer’s billing confirm it.',
        'You recently increased Thomas’s life insurance, at his own insurer’s suggestion, which looks terrible.',
        'On Monday night Thomas laughed and told you, "Alex is going to hate me after Friday. She just doesn’t know it yet." Friday is the board meeting.',
        'You signed in at the front desk at 12:40 with a lunch bag and never went near the 14th floor offices.',
      ],
      hiding: [
        'You hide the lawyer call because the divorce looks like motive, until the detective presses on your alibi or the garden.',
        'You will share Thomas’s remark about Alex if asked about Thomas’s state of mind, his week, or Alexandra.',
      ],
      coverStory: 'I was in the roof garden, alone, waiting for Thomas to come up for lunch.',
      greeting: 'Detective. I’ll help however I can. Please, just be honest with me about what happened to him.',
      topics: [
        {
          id: 'alibi',
          prompt: 'Where were you between 1:00 and 1:30?',
          keywords: ['where', 'alibi', '1:00', '1:30', 'during', 'between'],
          reply: 'In the roof garden. I brought lunch. Thomas said he’d come up at one. He never did.',
        },
        {
          id: 'garden',
          prompt: 'Was anyone with you in the garden?',
          keywords: ['anyone', 'alone', 'with you', 'confirm', 'garden', 'roof', 'phone', 'call', 'prove', 'lawyer', 'divorce'],
          reply:
            'No one was with me. I was on the phone. With my divorce attorney, if you must know, from ten to one until after half past. You can check my phone. You can check her bill; she charges by the minute.',
          reveals: 'sarah-call',
        },
        {
          id: 'marriage',
          prompt: 'How was your marriage?',
          keywords: ['marriage', 'married', 'husband', 'relationship', 'love', 'happy'],
          reply: 'Eight years. The first four were wonderful. Thomas collected people, detective. Eventually he stopped collecting me.',
        },
        {
          id: 'insurance',
          prompt: 'Tell me about the life insurance.',
          keywords: ['insurance', 'policy', 'inherit', 'money', 'will', 'fortune', 'estate'],
          reply:
            'His insurer suggested raising the policy after the last funding round. Thomas signed it himself. I know how it looks. I don’t need his money; I need to be free of his name.',
        },
        {
          id: 'week',
          prompt: 'Was Thomas worried about anything this week?',
          keywords: ['worried', 'week', 'mood', 'say', 'mention', 'friday', 'alex', 'alexandra', 'board', 'work'],
          reply:
            'Worried? Thomas was gleeful. Monday night he poured himself a whiskey and said, "Alex is going to hate me after Friday. She just doesn’t know it yet." Friday is the board meeting. I didn’t ask. I’d stopped asking.',
          reveals: 'sarah-friday',
        },
      ],
      reactions: [
        {
          clueId: 'me-report',
          reply:
            'Between one and half past? Then I was on the phone with my divorce lawyer the entire time, from ten to one. Check my call log. There. Now you know my secret too.',
          reveals: 'sarah-call',
        },
        {
          clueId: 'victoria-merger',
          reply: 'Four percent. So that’s what he meant about Alex and Friday. He was going to take her company away from her.',
        },
      ],
      deflections: [
        'I’m sorry. I don’t know anything about that.',
        'Thomas didn’t talk to me about the company much anymore.',
        'Could you ask me that another way?',
      ],
      shrug: 'I’m sorry. That doesn’t mean anything to me.',
    },
    {
      id: 'victoria',
      name: 'Victoria Chen',
      role: 'Chief Financial Officer',
      age: 41,
      tagline: 'Seven years keeping TechVision’s numbers adding up. Some of them, anyway.',
      statement: 'I was at my desk the entire time, working on the quarterly model. Door locked.',
      voice: 'marin',
      culprit: false,
      portrait: {
        skin: 'fair',
        hair: 'long',
        hairColor: '#120f0e',
        outfit: 'turtleneck',
        outfitColor: '#26262b',
        accent: '#9aa3ad',
        glasses: true,
      },
      persona:
        'Precise, guarded, exhausted. Speaks in numbers and timestamps. Hates ambiguity. Lets slip more than she means when she gets indignant about how Thomas ran things.',
      knows: [
        'At 12:52 you went into Thomas’s office to push back on his request to "smooth" the revenue numbers for investors. He refused to discuss it. You left at 12:58.',
        'As you left at 12:58, Thomas took a phone call and you heard: "You’ll sign, Alex, or you’re gone. Friday."',
        'You prepared the confidential OmniCorp term sheet. Friday’s merger would dilute Alexandra’s 40% stake to about 4% and remove her board seat. Alexandra found out on Tuesday; she came to your office white with anger.',
        'From 1:00 to 1:30 you were at your desk posting spreadsheets in #app-fire.',
        'You have been covering up financial irregularities at Thomas’s insistence.',
      ],
      hiding: [
        'You do not volunteer your 12:52 visit or the cooked numbers until asked when you last saw Thomas or about the books.',
        'You will reveal the term sheet if asked about deals, the board, Friday, or Alexandra’s position, because you are tired of protecting Thomas.',
      ],
      coverStory: 'I was at my desk all afternoon.',
      greeting: 'I have about nine minutes before the auditors call. Let’s use them well.',
      topics: [
        {
          id: 'alibi',
          prompt: 'Where were you between 1:00 and 1:30?',
          keywords: ['where', 'alibi', '1:00', '1:30', 'during', 'between'],
          reply: 'At my desk. Posting cohort tables into #app-fire at 1:04, 1:10, 1:14 and 1:22. Check the timestamps; I always do.',
        },
        {
          id: 'saw-thomas',
          prompt: 'When did you last see Thomas?',
          keywords: ['last', 'saw', 'see him', 'office', 'visit', 'went in', '12:5', 'argument', 'phone'],
          reply:
            'Twelve fifty-two to twelve fifty-eight, in his office. He wanted a number changed and I said no. As I left he picked up a call. I heard him say, "You’ll sign, Alex, or you’re gone. Friday." Then I closed the door.',
          reveals: 'victoria-argument',
        },
        {
          id: 'merger',
          prompt: 'What is happening at the board meeting on Friday?',
          keywords: ['friday', 'board', 'merger', 'deal', 'omnicorp', 'acquisition', 'stake', 'shares', 'alexandra', 'alex'],
          reply:
            'I suppose it doesn’t matter now. Thomas was merging us into OmniCorp. Vote on Friday. He kept a seat. Alexandra’s forty percent became about four, and no seat. She found out Tuesday. She came into my office white as paper. Here, it’s the term sheet.',
          reveals: 'victoria-merger',
        },
        {
          id: 'books',
          prompt: 'Is there anything wrong with the company’s books?',
          keywords: ['books', 'fraud', 'numbers', 'financ', 'irregular', 'cook', 'falsif', 'audit'],
          reply:
            'There are... adjustments I would not have made on my own. Thomas could be very persuasive. That gives me a reason to be relieved, detective, not a reason to kill him. And I was at my desk.',
        },
        {
          id: 'others',
          prompt: 'Who do you think did this?',
          keywords: ['who', 'think', 'kill', 'suspect', 'did it'],
          reply: 'I don’t speculate. I reconcile. Find out who wasn’t where they said they were between one and half past.',
        },
      ],
      reactions: [
        {
          clueId: 'slack',
          reply: 'You see? Four posts across the window. And notice whose messages stop at 1:07 and start again at 1:21.',
        },
        {
          clueId: 'call-log',
          reply: 'Eight minutes off the call. Conference room B to Thomas’s office is ninety seconds at a walk. I timed it once, for a fire drill.',
        },
        {
          clueId: 'sarah-friday',
          reply:
            'He said that? Then you should see this. The OmniCorp term sheet. Friday’s vote cuts Alexandra from forty percent to four. She found out on Tuesday.',
          reveals: 'victoria-merger',
        },
      ],
      deflections: [
        'That’s not a question I can answer with any precision.',
        'I don’t have data on that.',
        'Ask me about the timeline. I’m good with timelines.',
      ],
      shrug: 'I don’t see how that changes the numbers.',
    },
    {
      id: 'james',
      name: 'James Wilson',
      role: 'Head of Security',
      age: 50,
      tagline: 'Former military intelligence. Hired to lock the building down; watches everyone in it.',
      statement: 'Patrolling the east wing. Camera four was down again. I was there until the alarm.',
      voice: 'echo',
      culprit: false,
      portrait: {
        skin: 'deep',
        hair: 'bald',
        hairColor: '#111',
        outfit: 'uniform',
        outfitColor: '#20262e',
        accent: '#c9a45c',
      },
      persona:
        'Clipped, formal, military cadence. Calls the detective "detective" every time. Values protocol; admits rule-breaking only when it serves the investigation.',
      knows: [
        'From 1:05 to 1:30 you were in the east wing fixing camera four, and posted about it in Slack at 1:15. The east wing badge reader logged you at 1:05 and 1:20.',
        'You installed an unauthorized camera covering the executive hallway. At 1:11 PM it shows a figure in a grey blazer walking fast toward Thomas’s office, face turned away; at 1:15 the figure walks back. You only reviewed it after the body was found.',
        'Through your surveillance you discovered Thomas was selling TechVision source code to a foreign investor. You were building a file for the board.',
      ],
      hiding: [
        'You hide the private camera because it is illegal and would cost you your job, until the detective asks about cameras, footage, surveillance, or what you saw in the hallway.',
        'You hide what you know about Thomas selling secrets until asked about Thomas, what he was hiding, or your own motive.',
      ],
      coverStory: 'I was in the east wing. The cameras on the executive floor saw nothing.',
      greeting: 'Detective. James Wilson, head of security. I’ll give you what I can within protocol.',
      topics: [
        {
          id: 'alibi',
          prompt: 'Where were you between 1:00 and 1:30?',
          keywords: ['where', 'alibi', '1:00', '1:30', 'during', 'between', 'patrol'],
          reply:
            'East wing, detective. Camera four was down for the third time this week. Badge reader logged me in at 1:05 and out at 1:20. I posted in Slack at 1:15.',
        },
        {
          id: 'cameras',
          prompt: 'What did the cameras catch near Thomas’s office?',
          keywords: ['camera', 'footage', 'video', 'record', 'surveil', 'cctv', 'hallway', 'saw', 'see'],
          reply:
            'Officially, nothing; the executive floor has no cameras. Unofficially... I installed one in the hallway. Against policy. At 1:11 it shows someone in a grey blazer walking fast toward Thomas’s office, face turned away. Back the other way at 1:15. I’ll lose my job for telling you.',
          reveals: 'james-footage',
        },
        {
          id: 'thomas',
          prompt: 'What did you think of Thomas?',
          keywords: ['thomas', 'think of', 'opinion', 'motive', 'hiding', 'secret', 'trust'],
          reply:
            'Thomas was selling our source code to a foreign buyer, detective. I found it watching his network traffic. I was building a file for the board. He was worth more to me alive and exposed than dead.',
          reveals: 'james-secrets',
        },
        {
          id: 'access',
          prompt: 'Who could get to his office unseen?',
          keywords: ['access', 'badge', 'door', 'unseen', 'get in', 'enter', 'conference'],
          reply:
            'Anyone already on fourteen. Internal doors don’t log. Conference room B is a ninety-second walk from his office. The badge log only tells you who came up, not where they went.',
        },
      ],
      reactions: [
        {
          clueId: 'slack',
          reply: 'That’s my 1:15 post about camera four. East wing. As stated.',
        },
        {
          clueId: 'banhammer',
          reply:
            'ESC key is missing. If I were you, I’d have the planters by the elevator searched. People panic and drop things on the way out.',
        },
        {
          clueId: 'call-log',
          reply:
            'Off the call at 1:09, back at 1:17. My hallway camera has a figure going toward his office at 1:11 and back at 1:15. Fine. I’ll tell you about the camera.',
          reveals: 'james-footage',
        },
      ],
      deflections: [
        'Negative, detective. Nothing on that.',
        'Outside my lane. Ask me about access, timing or the building.',
        'I’d need more specifics, detective.',
      ],
      shrug: 'No operational significance that I can see, detective.',
    },
  ],
  solution: {
    culprit: 'alexandra',
    motive: 'merger',
    keyEvidence: ['call-log', 'james-footage', 'victoria-merger', 'victoria-argument', 'sarah-friday', 'slack'],
    truth: [
      'On Tuesday, Alexandra Morgan learned that Thomas would force TechVision into OmniCorp at Friday’s board meeting. Her forty percent of the company she co-founded would become four. At 12:58 he phoned her: sign, or be gone.',
      'She had joined the Singapore investor call from her phone, audio only. At 1:09 she let the line drop, walked ninety seconds to Thomas’s office in her grey blazer, and picked up the Banhammer. He let her walk right up to his desk.',
      'She wiped the keyboard, rejoined the call at 1:17 blaming the wifi, and posted in #app-fire at 1:21 as if she had never left. The ESC key she pocketed turned up in a planter by the elevators.',
    ],
    headline: {
      paper: 'The Bay Ledger',
      correct: 'TECHVISION CO-FOUNDER CHARGED IN ‘BANHAMMER’ KILLING',
      wrong: 'BANHAMMER KILLER STILL FREE AFTER BOTCHED ARREST',
    },
  },
};
