// Shared helpers for usda.3fs.app Pages Functions.
import DATA from './_data.js';

export const SOURCE = {
  doc: 'FY2026 Adjusted Income Limits, USDA HB-1-3550 Appendix 9, PN 657 (07/13/2026)',
  sha256: '79dcb1f7ee43b76902cc4594055f704864b670aa72b50fbac2fa6886c2bc933c'
};

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type, authorization, x-payment',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-expose-headers': 'x-payment-response'
};

export function json(obj, status = 200, extra = {}) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...CORS, ...extra }
  });
}
export function preflight() { return new Response(null, { status: 204, headers: CORS }); }

export async function sha256hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', typeof s === 'string' ? new TextEncoder().encode(s) : s);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

let ZIP = null;
function zipIndex() {
  if (ZIP) return ZIP;
  ZIP = new Map();
  for (const r of DATA.zips.split(';')) {
    const [zip, fips, ov, rural] = r.split(',');
    ZIP.set(zip, { fips, ov: ov === '' ? -1 : +ov, rural: rural === '1' });
  }
  return ZIP;
}
function area(i) {
  const a = DATA.areas[i];
  return a ? { name: a[0], st: a[1], page: a[2], metro: !!a[3], vl: [a[4], a[5]], l: [a[6], a[7]], m: [a[8], a[9]] } : null;
}
export function limitFor(pair, n) {
  n = Math.max(1, Math.round(n || 1));
  if (n <= 4) return pair[0];
  if (n <= 8) return pair[1];
  return Math.round((pair[1] + 0.08 * pair[0] * (n - 8)) / 50) * 50;
}

// Check one household against the FY2026 limits. Returns null if the ZIP is unknown.
export function check({ zip, people, income }) {
  const z = zipIndex().get(String(zip || '').slice(0, 5));
  if (!z) return null;
  const c = DATA.counties[z.fips] || [-1, 0];
  const ai = z.ov >= 0 ? z.ov : c[0];
  const a = area(ai);
  const county = DATA.names[z.fips] || z.fips;
  if (!a) return { zip, county, error: 'county_not_matched' };
  const n = Math.max(1, Math.min(15, Math.round(+people || 4)));
  const inc = Math.max(0, Math.round(+income || 0));
  const dl = limitFor(a.l, n), gl = limitFor(a.m, n);
  return {
    zip: String(zip).slice(0, 5), county, income_area: a.name, people: n, income: inc || null,
    direct: { limit: dl, qualifies: inc ? inc <= dl : null, note: 'USDA lends directly; low-income limit' },
    guaranteed: { limit: gl, qualifies: inc ? inc <= gl : null, note: 'Approved lender lends, USDA backs it; moderate-income limit' },
    very_low_limit: limitFor(a.vl, n),
    county_type: z.rural ? 'outside any metro area: very likely eligible' : a.metro ? 'metro area: confirm the exact address' : 'rural county: most of it qualifies',
    opportunity_zone_tracts: c[1],
    source: { ...SOURCE, pdf_page: a.page },
    disclaimer: '3FS is a technology provider, not USDA or a lender. USDA or an approved lender makes every loan decision. Property eligibility is confirmed by exact address.'
  };
}

function miles(a, b) {
  const R = 3959, r = Math.PI / 180;
  const dLat = (b[1] - a[1]) * r, dLon = (b[0] - a[0]) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * r) * Math.cos(b[1] * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
// Counties near a ZIP where the household qualifies (Direct and/or Guaranteed).
export function whereQualify({ zip, people, income, miles: max }) {
  const z = zipIndex().get(String(zip || '').slice(0, 5));
  if (!z) return null;
  const home = DATA.cent[z.fips]; if (!home) return null;
  const n = Math.max(1, Math.min(15, Math.round(+people || 4))), inc = Math.max(0, Math.round(+income || 0));
  const lim = Math.min(250, Math.max(10, +max || 90)), out = [];
  for (const [fips, c] of Object.entries(DATA.cent)) {
    if (fips === z.fips) continue;
    const info = DATA.counties[fips]; if (!info || info[0] < 0) continue;
    const d = miles(home, c); if (d > lim) continue;
    const a = area(info[0]), dl = limitFor(a.l, n), gl = limitFor(a.m, n);
    if (inc > gl) continue;
    out.push({ county: DATA.names[fips], miles: Math.round(d), loans: inc <= dl ? 'Direct and Guaranteed' : 'Guaranteed', direct_limit: dl, guaranteed_limit: gl, county_type: a.metro ? 'metro' : 'rural', opportunity_zone_tracts: info[1], pdf_page: a.page });
  }
  return out.sort((x, y) => x.miles - y.miles).slice(0, 15);
}
// Counties with Opportunity Zone tracts (2018 map) near a ZIP.
export function zonesNear({ zip, miles: max }) {
  const z = zipIndex().get(String(zip || '').slice(0, 5));
  if (!z) return null;
  const home = DATA.cent[z.fips], lim = Math.min(250, Math.max(10, +max || 60)), out = [];
  for (const [fips, c] of Object.entries(DATA.cent)) {
    const info = DATA.counties[fips]; if (!info || !info[1]) continue;
    const d = miles(home, c); if (d <= lim) out.push({ county: DATA.names[fips], tracts: info[1], miles: Math.round(d) });
  }
  return out.sort((x, y) => x.miles - y.miles).slice(0, 15);
}

export async function proFromAuth(request, env) {
  const h = request.headers.get('authorization') || '';
  const m = h.match(/^Bearer\s+(rh_[a-f0-9]{48})$/i);
  if (!m || !env.DB) return null;
  const hash = await sha256hex(m[1]);
  const row = await env.DB.prepare('SELECT session_id, email, status FROM pro_accounts WHERE key_hash = ?').bind(hash).first();
  return row && row.status === 'active' ? row : null;
}

export async function logCall(env, kind, zip, ok, tx) {
  try { await env.DB.prepare('INSERT INTO api_calls (ts, kind, zip, ok, tx) VALUES (?, ?, ?, ?, ?)').bind(Date.now(), kind, String(zip || ''), ok ? 1 : 0, tx || null).run(); } catch (e) { /* logging never blocks */ }
}

// Simple per-IP limiter backed by D1: max `perMin` per minute and `perDay` per day.
export async function limited(env, request, bucket, perMin, perDay) {
  if (!env.DB) return false;
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const h = (await sha256hex(ip + '|' + bucket)).slice(0, 20);
  const now = Date.now(), minute = Math.floor(now / 60000), day = Math.floor(now / 86400000);
  const kM = h + ':m:' + minute, kD = h + ':d:' + day;
  await env.DB.batch([
    env.DB.prepare('INSERT INTO hits (k, n, exp) VALUES (?, 1, ?) ON CONFLICT(k) DO UPDATE SET n = n + 1').bind(kM, now + 120000),
    env.DB.prepare('INSERT INTO hits (k, n, exp) VALUES (?, 1, ?) ON CONFLICT(k) DO UPDATE SET n = n + 1').bind(kD, now + 172800000)
  ]);
  const r = await env.DB.prepare('SELECT k, n FROM hits WHERE k IN (?, ?)').bind(kM, kD).all();
  const map = Object.fromEntries((r.results || []).map(x => [x.k, x.n]));
  if (Math.random() < 0.02) await env.DB.prepare('DELETE FROM hits WHERE exp < ?').bind(now).run();
  return (map[kM] || 0) > perMin || (map[kD] || 0) > perDay;
}
