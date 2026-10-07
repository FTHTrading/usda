// GET /api/sheet?zip=30513&people=4&income=68000  -> one-page PDF answer sheet with the 3FS mark.
// Free, rate-limited. Numbers come from the same check() the site uses.
import { check, limited, json } from '../_lib.js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const CRIMSON = rgb(0.639, 0.051, 0.133), INK = rgb(0.067, 0.071, 0.078), MUTED = rgb(0.373, 0.392, 0.424), LINE = rgb(0.847, 0.855, 0.875), PALE = rgb(0.98, 0.94, 0.945);
const money = n => '$' + Math.round(n).toLocaleString('en-US');

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const zip = url.searchParams.get('zip') || '', people = url.searchParams.get('people') || '4', income = url.searchParams.get('income') || '0';
  if (!/^\d{5}$/.test(zip)) return json({ error: 'zip_required' }, 400);
  if (await limited(env, request, 'sheet', 10, 60)) return json({ error: 'rate_limited' }, 429);
  const r = check({ zip, people, income });
  if (!r || r.error) return json({ error: 'zip_not_found' }, 404);

  const markRes = await env.ASSETS.fetch(new URL('/brand/3fs-mark-512.png', url.origin));
  const markBytes = markRes.ok ? new Uint8Array(await markRes.arrayBuffer()) : null;

  const pdf = await PDFDocument.create();
  pdf.setTitle(`USDA loan check · ${r.county} · 3FS Rural Home`); pdf.setAuthor('3FS Rural Home (UnyKorn LLC)'); pdf.setCreator('usda.3fs.app');
  const page = pdf.addPage([612, 792]); const { width: W, height: H } = page.getSize();
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold), reg = await pdf.embedFont(StandardFonts.Helvetica);
  const T = (t, x, y, s, f = reg, c = INK) => page.drawText(t, { x, y, size: s, font: f, color: c });
  const wrap = (t, s, f, maxW) => { const words = t.split(' '), lines = []; let cur = ''; for (const w of words) { const n = cur ? cur + ' ' + w : w; if (f.widthOfTextAtSize(n, s) > maxW && cur) { lines.push(cur); cur = w; } else cur = n; } if (cur) lines.push(cur); return lines; };

  page.drawRectangle({ x: 0, y: H - 6, width: W, height: 6, color: CRIMSON });
  if (markBytes) { const img = await pdf.embedPng(markBytes); page.drawImage(img, { x: 43, y: H - 76, width: 34, height: 34 }); }
  T('3fs', 84, H - 66, 14, bold); T('RURAL HOME', 110, H - 66, 8.5, bold, CRIMSON);
  T('USDA loan check  ·  usda.3fs.app', W - 43 - reg.widthOfTextAtSize('USDA loan check  ·  usda.3fs.app', 8.5), H - 66, 8.5, reg, MUTED);
  page.drawLine({ start: { x: 43, y: H - 84 }, end: { x: W - 43, y: H - 84 }, thickness: .6, color: LINE });

  T('Your USDA home loan check', 43, H - 128, 24, bold);
  T(`${r.county}  ·  ZIP ${r.zip}  ·  ${r.people} people  ·  ${r.income ? 'income ' + money(r.income) : 'income not given'}`, 43, H - 150, 11, reg, MUTED);

  // verdict rows
  const rows = [
    ['Direct loan', money(r.direct.limit), r.direct.qualifies === null ? 'Enter income to compare' : r.direct.qualifies ? 'You are under the limit. USDA lends to you directly.' : 'Over this limit. Guaranteed may still work.', r.direct.qualifies],
    ['Guaranteed loan', money(r.guaranteed.limit), r.guaranteed.qualifies === null ? 'Enter income to compare' : r.guaranteed.qualifies ? 'You are under the limit. A lender makes the loan, USDA backs it.' : 'Over this limit. Deductions may close the gap.', r.guaranteed.qualifies],
    ['Area type', '', r.county_type.charAt(0).toUpperCase() + r.county_type.slice(1) + '. Confirm the exact address on USDA\'s map.', r.county_type.startsWith('rural') || r.county_type.startsWith('outside') ? true : null]
  ];
  let y = H - 190;
  for (const [title, amt, sub, ok] of rows) {
    page.drawRectangle({ x: 43, y: y - 46, width: W - 86, height: 58, color: rgb(0.98, 0.98, 0.985), borderColor: LINE, borderWidth: .6 });
    const dot = ok === true ? CRIMSON : ok === false ? rgb(0.72, 0.76, 0.81) : rgb(0.72, 0.53, 0.04);
    page.drawCircle({ x: 68, y: y - 17, size: 11, color: dot }); T(ok === true ? 'Y' : ok === false ? '-' : '!', ok === true ? 64 : 65, y - 21, 11, bold, rgb(1, 1, 1));
    T(title, 92, y - 10, 12, bold);
    wrap(sub, 9.5, reg, W - 86 - 92 - 110).forEach((l, i) => T(l, 92, y - 26 - i * 12, 9.5, reg, MUTED));
    if (amt) { T(amt, W - 43 - 12 - bold.widthOfTextAtSize(amt, 13), y - 14, 13, bold); T('limit', W - 43 - 12 - reg.widthOfTextAtSize('limit', 8), y - 27, 8, reg, MUTED); }
    y -= 72;
  }
  if (r.opportunity_zone_tracts) { T(`${r.opportunity_zone_tracts} Opportunity Zone tract${r.opportunity_zone_tracts > 1 ? 's' : ''} in this county (2018 map).`, 43, y - 4, 10, reg, MUTED); y -= 22; }

  // next steps
  y -= 14; T('What to do next', 43, y, 14, bold); y -= 22;
  const steps = r.direct.qualifies ? ['Look at a Direct loan first: USDA lends to you with payment assistance. Contact your state USDA Rural Development office or a certified packager.', 'Or go to any USDA-approved lender for a Guaranteed loan to move faster.', 'Gather the documents on the 3FS checklist (usda.3fs.app/docs/3fs-document-checklist.pdf).', 'Have the lender or office confirm the exact address on USDA\'s eligibility map before you make an offer.']
    : r.guaranteed.qualifies ? ['Call a USDA-approved lender and ask for a Guaranteed loan pre-approval. No down payment is required.', 'Gather the documents on the 3FS checklist (usda.3fs.app/docs/3fs-document-checklist.pdf).', 'Have the lender confirm the exact address on USDA\'s eligibility map before you make an offer.', 'Ask about seller-paid closing costs (up to 6%).']
    : ['Your income is over both limits here as entered. USDA counts adjusted income, so ask a lender about deductions (for example $480 per child).', 'Check nearby counties on usda.3fs.app: limits change county to county.', 'If you are still over, a conventional or FHA loan may fit; a lender can compare.'];
  steps.forEach((s, i) => { const lines = wrap(`${i + 1}.  ${s}`, 10.5, reg, W - 86); lines.forEach((l, j) => { T(l, 43, y, 10.5); y -= 14; }); y -= 4; });

  // source + disclaimer
  y -= 10; page.drawRectangle({ x: 43, y: y - 46, width: W - 86, height: 56, color: PALE }); page.drawRectangle({ x: 43, y: y - 46, width: 3, height: 56, color: CRIMSON });
  T('Source', 56, y - 6, 9, bold, CRIMSON);
  wrap(`${r.source.doc}, page ${r.source.pdf_page}. Income area: ${r.income_area}. File fingerprint (SHA-256): ${r.source.sha256}`, 8.5, reg, W - 86 - 26).forEach((l, i) => T(l, 56, y - 19 - i * 11, 8.5, reg, INK));
  const disc = '3FS Rural Home is a technology service by UnyKorn LLC, 5655 Peachtree Pkwy NW, Norcross, GA 30099. Not affiliated with USDA; not a lender or broker. USDA Rural Development or an approved lender makes every loan decision. Limits compare to adjusted household income and can change. General information, not financial or legal advice.';
  wrap(disc, 7.5, reg, W - 86).forEach((l, i) => T(l, 43, 70 - i * 9.5, 7.5, reg, MUTED));
  T(`Generated ${new Date().toISOString().slice(0, 10)}  ·  usda.3fs.app`, 43, 36, 7.5, reg, MUTED);

  const bytes = await pdf.save();
  return new Response(bytes, { status: 200, headers: { 'content-type': 'application/pdf', 'content-disposition': `inline; filename="3fs-usda-check-${r.zip}.pdf"`, 'cache-control': 'no-store', 'access-control-allow-origin': '*' } });
}
