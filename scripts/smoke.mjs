#!/usr/bin/env node
/**
 * Smoke test against a running server: pages render, the scripted engine
 * answers and reveals clues, the Blue Lantern case can be solved end to end,
 * and nothing secret leaks into the page HTML.
 *
 *   pnpm build && pnpm start   # in one terminal
 *   pnpm smoke                 # in another (BASE_URL defaults to :3400)
 */
const BASE = process.env.BASE_URL ?? 'http://localhost:3400';
let failed = 0;
const check = (name, ok, extra = '') => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${extra ? `  (${extra})` : ''}`);
  if (!ok) failed++;
};

async function ask(body) {
  const res = await fetch(`${BASE}/api/interrogate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) return { status: res.status, text: '', clues: [] };
  const lines = (await res.text()).trim().split('\n').map((l) => JSON.parse(l));
  return {
    status: res.status,
    text: lines.filter((e) => e.type === 'text').map((e) => e.delta).join(''),
    clues: lines.filter((e) => e.type === 'clue').map((e) => e.clue.id),
  };
}

for (const path of ['/', '/case/blue-lantern', '/case/banhammer', '/opengraph-image', '/robots.txt', '/sitemap.xml']) {
  const res = await fetch(BASE + path);
  check(`GET ${path}`, res.status === 200, String(res.status));
}
check('unknown case is 404', (await fetch(`${BASE}/case/nope`)).status === 404);

const html = await (await fetch(`${BASE}/case/blue-lantern`)).text();
check('no spoilers in page HTML', !/You are the killer|culprit|coverStory|keyEvidence/.test(html));

const status = await (await fetch(`${BASE}/api/status`)).json();
check('status endpoint', status.ok === true, `mode=${status.mode} voice=${status.voice}`);

if (status.mode === 'demo') {
  const discovered = [];
  const r1 = await ask({ caseId: 'blue-lantern', suspectId: 'vivian', message: 'Did you go up to his office tonight?' });
  check('Vivian admits her visit', r1.clues.includes('vivian-visit'));
  discovered.push(...r1.clues);
  const r2 = await ask({ caseId: 'blue-lantern', suspectId: 'vivian', message: 'Did you see anyone on the stairs?', discovered });
  check('Vivian saw the stairs', r2.clues.includes('vivian-stairs'));
  discovered.push(...r2.clues);
  const r3 = await ask({ caseId: 'blue-lantern', suspectId: 'frank', message: '', presentedClueId: 'decanter', discovered });
  check('Decanter breaks Frank', r3.clues.includes('frank-nightcap'));
  discovered.push(...r3.clues);
  const bad = await ask({ caseId: 'blue-lantern', suspectId: 'frank', message: '', presentedClueId: 'eddie-skim' });
  check('cannot present unearned evidence', bad.status === 400);

  const verdict = await (
    await fetch(`${BASE}/api/accuse`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        caseId: 'blue-lantern',
        suspectId: 'frank',
        motiveId: 'exposure',
        evidenceIds: ['decanter', 'vivian-stairs', 'frank-nightcap'],
        discovered,
      }),
    })
  ).json();
  check('Blue Lantern solvable with 3 stars', verdict.stars === 3, verdict.rank);
}

const cross = await fetch(`${BASE}/api/accuse`, { method: 'POST', headers: { origin: 'https://evil.example' }, body: '{}' });
check('cross-origin POST rejected', cross.status === 403);

console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed');
process.exit(failed ? 1 : 0);
