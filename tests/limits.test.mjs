import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check, limitFor, whereQualify, zonesNear, SOURCE } from '../functions/_lib.js';

test('source fingerprint is pinned to the FY2026 PDF', () => {
  assert.equal(SOURCE.sha256, '79dcb1f7ee43b76902cc4594055f704864b670aa72b50fbac2fa6886c2bc933c');
  assert.match(SOURCE.doc, /FY2026/);
});

test('limitFor: 1-4 uses first column, 5-8 second, 9+ adds 8% of the 4-person figure per person', () => {
  assert.equal(limitFor([100000, 132000], 1), 100000);
  assert.equal(limitFor([100000, 132000], 4), 100000);
  assert.equal(limitFor([100000, 132000], 5), 132000);
  assert.equal(limitFor([100000, 132000], 8), 132000);
  assert.equal(limitFor([100000, 132000], 9), 140000);
});

test('Fannin County GA (30513): Direct $61,600 / Guaranteed $122,800, page 71', () => {
  const r = check({ zip: '30513', people: 4, income: 68000 });
  assert.equal(r.county, 'Fannin County, GA');
  assert.equal(r.direct.limit, 61600);
  assert.equal(r.guaranteed.limit, 122800);
  assert.equal(r.direct.qualifies, false);
  assert.equal(r.guaranteed.qualifies, true);
  assert.equal(r.source.pdf_page, 71);
});

test('inputs are clamped: people 1-15, income >= 0, unknown ZIP is null', () => {
  const r = check({ zip: '30513', people: 99, income: -5 });
  assert.equal(r.people, 15);
  assert.equal(r.income, null);
  assert.equal(r.direct.qualifies, null);
  assert.equal(check({ zip: '00000' }), null);
  assert.equal(check({ zip: 'abc' }), null);
});

test('2026 Guaranteed floor applies to most areas', () => {
  const r = check({ zip: '30513', people: 4 });
  assert.equal(r.guaranteed.limit, 122800);
  assert.equal(check({ zip: '30513', people: 6 }).guaranteed.limit, 162100);
});

test('whereQualify and zonesNear return sorted, bounded lists', () => {
  const w = whereQualify({ zip: '30513', people: 4, income: 100000, miles: 90 });
  assert.ok(Array.isArray(w) && w.length > 0 && w.length <= 15);
  for (let i = 1; i < w.length; i++) assert.ok(w[i].miles >= w[i - 1].miles);
  const z = zonesNear({ zip: '30513', miles: 60 });
  assert.ok(Array.isArray(z) && z.length <= 15);
});
