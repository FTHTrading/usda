(function () {
'use strict';
var D = window.__DATA__, SRC = window.__SRC__, US = window.__US__, LAND = window.__LAND__;
var $ = function (s, r) { return (r || document).querySelector(s); };
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

var FIPS = { '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY','60':'AS','66':'GU','69':'MP','72':'PR','78':'VI' };

/* ---------- data ---------- */
function area(i) {
  var a = D.areas[i];
  return a ? { i: i, name: a[0], st: a[1], page: a[2], metro: !!a[3], vl: [a[4], a[5]], l: [a[6], a[7]], m: [a[8], a[9]] } : null;
}
function limitFor(pair, n) {
  n = Math.max(1, Math.round(n || 1));
  if (n <= 4) return pair[0];
  if (n <= 8) return pair[1];
  return Math.round((pair[1] + 0.08 * pair[0] * (n - 8)) / 50) * 50;
}
var statePages = {};
D.areas.forEach(function (a) { var s = statePages[a[1]] || (statePages[a[1]] = [a[2], a[2]]); s[0] = Math.min(s[0], a[2]); s[1] = Math.max(s[1], a[2]); });

var counties = topojson.feature(US, US.objects.counties).features;
var statesMesh = topojson.mesh(US, US.objects.states, function (a, b) { return a !== b; });
var nation = topojson.feature(US, US.objects.nation);
var land = topojson.feature(LAND, LAND.objects.land);
var byFips = {};
counties.forEach(function (f, i) {
  f.ix = i;
  f.st = FIPS[f.id.slice(0, 2)] || '';
  var info = D.counties[f.id] || [-1, 0];
  f.ai = info[0]; f.oz = info[1];
  f.c = d3.geoCentroid(f);
  f.b = d3.geoBounds(f);
  byFips[f.id] = f;
});
function cname(f) {
  var n = f.properties.name, code = +f.id.slice(2), st = f.st;
  if ((st === 'VA' || st === 'MD' || st === 'MO') && code >= 500) return n + ' city, ' + st;
  if (st === 'LA') return n + ' Parish, LA';
  if (st === 'AK' || st === 'PR' || st === 'VI' || /city|City/.test(n)) return n + ', ' + st;
  return n + ' County, ' + st;
}

var zips = [], zipBy = {}, cityRows = {};
D.zips.split(';').forEach(function (r) {
  var p = r.split(',');
  var z = { zip: p[0], city: D.cities[+p[1]], ci: +p[2], lat: +p[3], lon: +p[4], ov: p[5] === '' ? -1 : +p[5], rural: p[6] === '1' };
  zips.push(z); zipBy[z.zip] = z;
  var k = z.city.toLowerCase();
  (cityRows[k] || (cityRows[k] = [])).push(z);
});
var cityKeys = Object.keys(cityRows).sort();
var countyIdx = counties.map(function (f) { return { key: cname(f).toLowerCase(), f: f }; }).sort(function (a, b) { return a.key < b.key ? -1 : 1; });

function placeFromZip(z) {
  var f = counties[z.ci];
  return { kind: 'zip', label: z.city.split('|')[0] + ', ' + z.city.split('|')[1] + ' ' + z.zip, lat: z.lat, lon: z.lon, f: f, ai: z.ov >= 0 ? z.ov : f.ai, oz: f.oz, zipRural: z.rural };
}
function placeFromCity(key) {
  var rows = cityRows[key]; if (!rows) return null;
  var cnt = {}, lat = 0, lon = 0, best = rows[0], rural = 0;
  rows.forEach(function (z) { cnt[z.ci] = (cnt[z.ci] || 0) + 1; lat += z.lat; lon += z.lon; rural += z.rural ? 1 : 0; });
  var ci = +Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a]; })[0];
  rows.forEach(function (z) { if (z.ci === ci && z.ov >= 0) best = z; });
  var f = counties[ci], c = key.split('|');
  return { kind: 'city', label: titleCase(c[0]) + ', ' + c[1].toUpperCase(), lat: lat / rows.length, lon: lon / rows.length, f: f, ai: best.ov >= 0 ? best.ov : f.ai, oz: f.oz, zipRural: rural === rows.length };
}
function placeFromCounty(f) { return { kind: 'county', label: cname(f), lat: f.c[1], lon: f.c[0], f: f, ai: f.ai, oz: f.oz, zipRural: null }; }
function titleCase(s) { return s.replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); }); }

function suggest(q) {
  q = q.trim().toLowerCase(); var out = [];
  if (q.length < 2) return out;
  var zm = q.match(/\d{3,5}/);
  if (zm) {
    var pre = zm[0];
    for (var i = 0; i < zips.length && out.length < 8; i++) if (zips[i].zip.indexOf(pre) === 0) out.push({ label: zips[i].city.replace('|', ', ') + ' ' + zips[i].zip, sub: 'ZIP', go: placeFromZip.bind(null, zips[i]) });
    return out;
  }
  var m = q.match(/^(.+?)[,\s]+([a-z]{2})$/), city = m ? m[1].trim() : q, st = m ? m[2] : null;
  var lo = d3.bisectLeft(cityKeys, city);
  for (var j = lo; j < cityKeys.length && out.length < 7; j++) {
    var k = cityKeys[j]; if (k.indexOf(city) !== 0) break;
    var parts = k.split('|'); if (st && parts[1] !== st && k.indexOf(city + '|') === 0) continue;
    if (st && parts[1] !== st) continue;
    out.push({ label: titleCase(parts[0]) + ', ' + parts[1].toUpperCase(), sub: 'City', go: placeFromCity.bind(null, k) });
  }
  var ck = countyIdx.map(function (c) { return c.key; });
  var lo2 = d3.bisectLeft(ck, city);
  for (var n = lo2; n < countyIdx.length && out.length < 9; n++) {
    if (countyIdx[n].key.indexOf(city) !== 0) break;
    if (st && countyIdx[n].f.st.toLowerCase() !== st) continue;
    out.push({ label: cname(countyIdx[n].f), sub: 'County', go: placeFromCounty.bind(null, countyIdx[n].f) });
  }
  return out;
}
function resolve(q) {
  q = (q || '').trim(); if (!q) return null;
  var zm = q.match(/\b(\d{5})(?:-\d{4})?\b/);
  if (zm && zipBy[zm[1]]) return placeFromZip(zipBy[zm[1]]);
  var cleaned = q.replace(/\b(usa|united states)\b/ig, '').replace(/\s+/g, ' ').trim();
  var parts = cleaned.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  var tryKeys = [];
  if (parts.length >= 2) {
    var st = parts[parts.length - 1].slice(0, 2).toLowerCase();
    tryKeys.push(parts[parts.length - 2].toLowerCase() + '|' + st);
  }
  var mm = cleaned.match(/^(.+?)\s+([A-Za-z]{2})$/);
  if (mm) tryKeys.push(mm[1].toLowerCase().replace(/,$/, '') + '|' + mm[2].toLowerCase());
  for (var i = 0; i < tryKeys.length; i++) {
    var ck = tryKeys[i].replace(/\s+county\|/, '|');
    if (/county|parish/i.test(tryKeys[i])) {
      var cf = countyIdx.find(function (c) { return c.key.indexOf(tryKeys[i].split('|')[0]) === 0 && c.f.st.toLowerCase() === tryKeys[i].split('|')[1]; });
      if (cf) return placeFromCounty(cf.f);
    }
    if (cityRows[tryKeys[i]]) return placeFromCity(tryKeys[i]);
    if (cityRows[ck]) return placeFromCity(ck);
  }
  var s = suggest(cleaned);
  return s.length ? s[0].go() : null;
}

/* ---------- state ---------- */
var ROLES = [
  { id: 'family', label: 'Family or buyer', sub: 'Buy or build a home', cta: 'Start my file', icon: '<path d="M3 11 12 4l9 7v9h-6v-6H9v6H3z" fill="currentColor"/>' },
  { id: 'builder', label: 'Builder', sub: 'Build USDA homes', cta: 'Plan homes here', icon: '<path d="M4 20h16v-2H4zm2-4h4V8H6zm6 0h6V4h-6z" fill="currentColor"/>' },
  { id: 'lender', label: 'Lender', sub: 'Get ready files', cta: 'Get files from here', icon: '<path d="M12 3 2 8v2h20V8zM4 12h3v6H4zm6.5 0h3v6h-3zM17 12h3v6h-3zM2 20h20v2H2z" fill="currentColor"/>' },
  { id: 'realtor', label: 'Realtor', sub: 'Check listings fast', cta: 'Check a listing', icon: '<path d="M4 4h10l6 6v10H4zm9 1v6h6" fill="none" stroke="currentColor" stroke-width="2"/>' },
  { id: 'packager', label: 'Nonprofit', sub: 'Help many families', cta: 'Check many families', icon: '<path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-6 6-6s6 3 6 6zm12 0c0-2 0-3-1-4 3-1 9 0 9 4z" fill="currentColor"/>' },
  { id: 'agent', label: 'AI agent', sub: 'Check by API', cta: 'See the API call', icon: '<path d="M7 7h10v10H7zM9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3" fill="none" stroke="currentColor" stroke-width="2"/>' }
];
var S = {
  role: store('3fs.role') || 'family',
  size: 4, income: 68000, layer: 'limits',
  place: null, example: true, mode: 'all', docsHave: {}
};
if (!ROLES.some(function (r) { return r.id === S.role; })) S.role = 'family';

/* ---------- roles ---------- */
function renderRoles() {
  $('#roles').innerHTML = ROLES.map(function (r) {
    return '<button class="role" type="button" data-role="' + r.id + '" aria-pressed="' + (S.role === r.id) + '"><span class="ri"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">' + r.icon + '</svg></span><span><b>' + r.label + '</b><small>' + r.sub + '</small></span></button>';
  }).join('');
}
$('#roles').addEventListener('click', function (e) {
  var b = e.target.closest('.role'); if (!b) return;
  S.role = b.dataset.role; store('3fs.role', S.role);
  if (S.role === 'builder' && S.layer === 'limits') S.layer = 'oz';
  renderRoles(); renderLayers(); recolor(); renderAnswer(); renderNear(); renderFile();
});

/* ---------- globe ---------- */
var canvas = $('#globe'), ctx = canvas.getContext('2d');
var proj = d3.geoOrthographic().clipAngle(90).precision(0.4);
var path = d3.geoPath(proj, ctx);
var W = 0, H = 0, DPR = 1, BASE = 300, scale = 300, rot = [70, -22, 0];
var colors = new Array(counties.length);
var dirty = true, flying = null, spinning = true;
var LOWER48 = { type: 'MultiPoint', coordinates: [[-124.7, 48.4], [-67, 47], [-117, 32.5], [-80.5, 25.2], [-97, 49], [-97.4, 26], [-124.2, 41]] };

function resize() {
  var r = canvas.getBoundingClientRect();
  DPR = Math.min(2, window.devicePixelRatio || 1);
  if (!(r.width > 0 && r.height > 0)) return; // hidden or collapsed: keep the last good geometry
  W = r.width; H = r.height;
  canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
  var nb = Math.min(W, H) * 0.44;
  if (BASE > 0 && isFinite(scale)) scale = scale / BASE * nb; else scale = nb;
  BASE = nb;
  dirty = true;
}
function usView() {
  var r = [96.5, -38.5, 0];
  proj.rotate(r).translate([W / 2, H / 2 + 10]).scale(1);
  var b = d3.geoPath(proj).bounds(LOWER48);
  var s = Math.min((W - 60) / (b[1][0] - b[0][0]), (H - 150) / (b[1][1] - b[0][1]));
  return { rot: r, scale: s };
}
function fly(target, ms, done) {
  var r0 = rot.slice(), s0 = scale, r1 = target.rot.slice();
  var dl = r1[0] - r0[0]; while (dl > 180) dl -= 360; while (dl < -180) dl += 360; r1[0] = r0[0] + dl;
  spinning = false;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) ms = 1;
  var t0 = performance.now();
  flying = function (now) {
    var t = Math.min(1, (now - t0) / ms), e = d3.easeCubicInOut(t);
    rot = [r0[0] + (r1[0] - r0[0]) * e, r0[1] + (r1[1] - r0[1]) * e, 0];
    var hop = Math.sin(Math.PI * e) * 0.35;
    scale = Math.exp(Math.log(s0) + (Math.log(target.scale) - Math.log(s0)) * e) * (1 - hop * (target.scale > s0 * 3 ? 1 : 0));
    dirty = true;
    if (t >= 1) { flying = null; if (done) done(); }
  };
}
function flyToPlace(p) {
  var us = usView();
  fly({ rot: [-p.lon, -p.lat, 0], scale: Math.max(us.scale * 6.5, BASE * 12) }, 1500);
}

var COL = {
  limits: d3.scaleSequential(d3.interpolateRgb('#F5E6E8', '#6E0717')).domain([52000, 118000]).clamp(true),
  oz: d3.scaleSequential(d3.interpolateRgb('#fbe6ad', '#b8740a')).domain([1, 14]).clamp(true)
};
function qual(a) {
  if (!a || !S.income) return 0;
  if (S.income <= limitFor(a.l, S.size)) return 2;
  if (S.income <= limitFor(a.m, S.size)) return 1;
  return 0;
}
function recolor() {
  for (var i = 0; i < counties.length; i++) {
    var f = counties[i], a = f.ai >= 0 ? area(f.ai) : null, c;
    if (!a) c = '#e6eaf0';
    else if (S.layer === 'limits') c = COL.limits(a.l[0]);
    else if (S.layer === 'rural') c = a.metro ? '#D8DADF' : '#D06A73';
    else if (S.layer === 'oz') c = f.oz ? COL.oz(f.oz) : (a.metro ? '#e3e8ee' : '#edf1f5');
    else { var q = qual(a); c = q === 2 ? (a.metro ? '#E89AA3' : '#A30D22') : q === 1 ? (a.metro ? '#C9D0DE' : '#5B6B8C') : '#d5dbe3'; }
    colors[i] = c;
  }
  dirty = true; renderLegend();
}

function draw() {
  if (!W) return;
  proj.rotate(rot).scale(scale).translate([W / 2, H / 2 + 10]);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.clearRect(0, 0, W, H);
  var cx = W / 2, cy = H / 2 + 10, R = scale;
  // atmosphere glow
  ctx.save(); ctx.beginPath(); path({ type: 'Sphere' });
  ctx.shadowColor = 'rgba(179,18,31,.18)'; ctx.shadowBlur = 40;
  var g = ctx.createRadialGradient(cx - R * .35, cy - R * .4, R * .05, cx, cy, R);
  g.addColorStop(0, '#ffffff'); g.addColorStop(.6, '#eef0f3'); g.addColorStop(1, '#d6dae0');
  ctx.fillStyle = g; ctx.fill(); ctx.restore();
  // graticule
  ctx.beginPath(); path(d3.geoGraticule10()); ctx.strokeStyle = 'rgba(80,90,105,.10)'; ctx.lineWidth = 1; ctx.stroke();
  // land
  ctx.beginPath(); path(land); ctx.fillStyle = '#F7F7F4'; ctx.fill(); ctx.strokeStyle = 'rgba(90,100,115,.35)'; ctx.lineWidth = .7; ctx.stroke();
  // counties batched by color
  var center = [-rot[0], -rot[1]];
  var vis = Math.min(Math.PI / 2, Math.asin(Math.min(1, Math.hypot(W, H) / 2 / R)) + 0.08);
  var groups = {};
  for (var i = 0; i < counties.length; i++) {
    var f = counties[i];
    if (d3.geoDistance(f.c, center) > vis + 0.12) continue;
    (groups[colors[i]] || (groups[colors[i]] = [])).push(f);
  }
  var showLines = R > BASE * 2.2;
  Object.keys(groups).forEach(function (c) {
    ctx.beginPath(); groups[c].forEach(function (f) { path(f); });
    ctx.fillStyle = c; ctx.fill();
    if (showLines) { ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = R > BASE * 8 ? 1 : .5; ctx.stroke(); }
  });
  ctx.beginPath(); path(statesMesh); ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = R > BASE * 4 ? 2 : 1.1; ctx.stroke();
  ctx.beginPath(); path(nation); ctx.strokeStyle = 'rgba(40,60,90,.35)'; ctx.lineWidth = 1; ctx.stroke();
  // selected
  if (S.place) {
    var sf = S.place.f;
    if (sf) { ctx.beginPath(); path(sf); ctx.strokeStyle = '#111214'; ctx.lineWidth = 2.4; ctx.stroke(); }
    if (d3.geoDistance([S.place.lon, S.place.lat], center) < Math.PI / 2) {
      var pt = proj([S.place.lon, S.place.lat]);
      if (pt) {
        ctx.beginPath(); ctx.arc(pt[0], pt[1], 13, 0, 7); ctx.fillStyle = 'rgba(179,18,31,.18)'; ctx.fill();
        ctx.beginPath(); ctx.arc(pt[0], pt[1], 6.5, 0, 7); ctx.fillStyle = '#A30D22'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = '#fff'; ctx.stroke();
        if (R > BASE * 4) {
          var label = S.place.label; ctx.font = '600 13px "IBM Plex Sans", system-ui, sans-serif';
          var tw = ctx.measureText(label).width;
          var lx = Math.min(W - tw - 24, pt[0] + 14), ly = pt[1] - 14;
          ctx.fillStyle = 'rgba(255,255,255,.92)'; roundRect(lx - 8, ly - 15, tw + 16, 24, 8); ctx.fill();
          ctx.fillStyle = '#111214'; ctx.fillText(label, lx, ly + 2);
        }
      }
    }
  }
  // specular + rim for depth
  ctx.save(); ctx.beginPath(); path({ type: 'Sphere' }); ctx.clip();
  var s2 = ctx.createRadialGradient(cx - R * .45, cy - R * .5, 0, cx - R * .45, cy - R * .5, R * .9);
  s2.addColorStop(0, 'rgba(255,255,255,.38)'); s2.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = s2; ctx.fillRect(0, 0, W, H);
  var rim = ctx.createRadialGradient(cx, cy, R * .82, cx, cy, R);
  rim.addColorStop(0, 'rgba(40,40,50,0)'); rim.addColorStop(1, 'rgba(40,40,50,.14)');
  ctx.fillStyle = rim; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

function loop(now) {
  if (flying) flying(now);
  else if (spinning) { rot[0] += 0.22; dirty = true; }
  if (dirty && !document.hidden) { dirty = false; try { draw(); } catch (e) { if (!isFinite(scale) || scale <= 0) { BASE = 0; resize(); } } }
  requestAnimationFrame(loop);
}

function pick(x, y) {
  var ll = proj.invert([x, y]); if (!ll) return null;
  if (d3.geoDistance(ll, [-rot[0], -rot[1]]) > Math.PI / 2) return null;
  for (var i = 0; i < counties.length; i++) {
    var f = counties[i], b = f.b;
    if (b[0][0] <= b[1][0] && (ll[0] < b[0][0] || ll[0] > b[1][0] || ll[1] < b[0][1] || ll[1] > b[1][1])) continue;
    if (d3.geoContains(f, ll)) return { f: f, ll: ll };
  }
  return null;
}

// pointer: drag to rotate, pinch/wheel to zoom, tap to pick
var ptrs = new Map(), downAt = null, pinch0 = null;
canvas.addEventListener('pointerdown', function (e) {
  canvas.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.offsetX, e.offsetY]);
  spinning = false; flying = null;
  if (ptrs.size === 1) downAt = [e.offsetX, e.offsetY, 0];
  if (ptrs.size === 2) { var p = Array.from(ptrs.values()); pinch0 = [Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]), scale]; }
  canvas.classList.add('dragging');
});
canvas.addEventListener('pointermove', function (e) {
  if (!ptrs.has(e.pointerId)) return;
  var prev = ptrs.get(e.pointerId); ptrs.set(e.pointerId, [e.offsetX, e.offsetY]);
  if (ptrs.size === 2 && pinch0) {
    var p = Array.from(ptrs.values()); var d = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]);
    setScale(pinch0[1] * d / pinch0[0]); return;
  }
  var dx = e.offsetX - prev[0], dy = e.offsetY - prev[1];
  if (downAt) downAt[2] += Math.abs(dx) + Math.abs(dy);
  var k = 57.3 / scale;
  rot = [rot[0] + dx * k, Math.max(-85, Math.min(85, rot[1] - dy * k)), 0];
  dirty = true;
});
function up(e) {
  ptrs.delete(e.pointerId); canvas.classList.remove('dragging');
  if (ptrs.size < 2) pinch0 = null;
  if (downAt && downAt[2] < 6 && ptrs.size === 0) {
    var hit = pick(e.offsetX, e.offsetY);
    if (hit) { var p = placeFromCounty(hit.f); p.lat = hit.ll[1]; p.lon = hit.ll[0]; setPlace(p, { fly: scale < BASE * 4 }); }
  }
  if (ptrs.size === 0) downAt = null;
}
canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
canvas.addEventListener('wheel', function (e) { e.preventDefault(); spinning = false; flying = null; setScale(scale * Math.exp(-e.deltaY * 0.0016)); }, { passive: false });
function setScale(s) { scale = Math.max(BASE * 0.8, Math.min(BASE * 160, s)); dirty = true; }
$('#zin').onclick = function () { spinning = false; fly({ rot: rot.slice(), scale: Math.min(BASE * 160, scale * 2) }, 450); };
$('#zout').onclick = function () { spinning = false; fly({ rot: rot.slice(), scale: Math.max(BASE * .8, scale / 2) }, 450); };
$('#zus').onclick = function () { fly(usView(), 1100); };

/* ---------- layers + legend ---------- */
var LAYERS = [
  { id: 'limits', label: 'Income limits', sw: 'linear-gradient(90deg,#F5E6E8,#6E0717)' },
  { id: 'rural', label: 'Rural counties', sw: '#D06A73' },
  { id: 'oz', label: 'Opportunity Zones', sw: '#d99a1c' },
  { id: 'qualify', label: 'Where I qualify', sw: '#A30D22' }
];
function renderLayers() {
  $('#layers').innerHTML = LAYERS.map(function (l) {
    return '<button class="layer" type="button" data-layer="' + l.id + '" aria-pressed="' + (S.layer === l.id) + '"><i style="background:' + l.sw + '"></i>' + l.label + '</button>';
  }).join('');
}
$('#layers').addEventListener('click', function (e) {
  var b = e.target.closest('.layer'); if (!b) return;
  S.layer = b.dataset.layer;
  if (S.layer === 'qualify' && !S.income) { var inc = $('#inc'); if (inc) inc.focus(); }
  renderLayers(); recolor();
});
function renderLegend() {
  var el = $('#legend'), h = '';
  if (S.layer === 'limits') h = '<b>Direct loan limit</b><div class="small muted">4-person household, FY2026</div><div class="bar" style="background:linear-gradient(90deg,#F5E6E8,#6E0717)"></div><div class="ticks"><span>$52k</span><span>$85k</span><span>$118k+</span></div>';
  else if (S.layer === 'rural') h = '<b>County type</b><div class="keys"><span><i style="background:#D06A73"></i>Rural county: most of it qualifies</span><span><i style="background:#d3dce7"></i>Metro area: check the address</span></div>';
  else if (S.layer === 'oz') h = '<b>Opportunity Zone tracts</b><div class="small muted">2018 map, per county</div><div class="bar" style="background:linear-gradient(90deg,#fbe6ad,#b8740a)"></div><div class="ticks"><span>1</span><span>7</span><span>14+</span></div>';
  else h = '<b>Where you qualify</b><div class="small muted num">' + S.size + ' people · ' + (S.income ? money(S.income) : 'add your income') + '</div><div class="keys"><span><i style="background:#A30D22"></i>Direct and Guaranteed</span><span><i style="background:#5B6B8C"></i>Guaranteed only</span><span><i style="background:#d5dbe3"></i>Over the limit</span><span class="muted">Lighter shade = metro area</span></div>';
  el.innerHTML = h;
}

/* ---------- answer card ---------- */
function verdictFor(p) {
  var a = p && p.ai >= 0 ? area(p.ai) : null; if (!a) return null;
  var dl = limitFor(a.l, S.size), gl = limitFor(a.m, S.size), vl = limitFor(a.vl, S.size);
  return { a: a, direct: dl, guar: gl, vlow: vl, dOk: S.income ? S.income <= dl : null, gOk: S.income ? S.income <= gl : null };
}
function placeType(p, a) {
  if (p.zipRural) return { cls: 'yes', t: 'Outside any metro area', s: 'Very likely USDA-eligible. Confirm the exact address on USDA\'s map.' };
  if (!a.metro) return { cls: 'yes', t: 'Rural county', s: 'Most of this county qualifies. Larger towns may not.' };
  return { cls: 'maybe', t: 'Metro area', s: 'Outer parts often qualify. The guide checks the exact address.' };
}
function renderAnswer() {
  var el = $('#answer'), p = S.place;
  if (!p) { el.innerHTML = '<h2>Search a place to begin</h2>'; return; }
  var v = verdictFor(p), role = ROLES.find(function (r) { return r.id === S.role; });
  var head = '<div class="ans-head"><div><p class="eyebrow">' + (S.example ? 'Example' : 'Your answer') + '</p><h2>' + esc(p.label) + '</h2>' +
    (p.kind !== 'county' && p.f ? '<p class="small muted">' + esc(cname(p.f)) + '</p>' : '') + '</div>' + (S.example ? '<span class="tag ex">Example</span>' : '') + '</div>';
  var hh = '<div class="hh"><label class="fld"><span>People in home</span><span class="step"><button type="button" id="szDn" aria-label="Fewer people">−</button><output id="sz" class="num">' + S.size + '</output><button type="button" id="szUp" aria-label="More people">+</button></span></label>' +
    '<label class="fld"><span>Yearly household income</span><input id="inc" type="text" inputmode="numeric" value="' + (S.income ? money(S.income) : '') + '" placeholder="$0"></label></div>';
  if (!v) {
    var pg = statePages[p.f ? p.f.st : ''];
    el.innerHTML = head + hh + '<div class="vd"><span class="ico maybe">?</span><span><b>We could not match this county automatically</b><small>Its limits are in the USDA table' + (pg ? ' on pages ' + pg[0] + '–' + pg[1] : '') + '. The guide will look it up by hand.</small></span><span></span></div>';
    bindHH(); return;
  }
  var a = v.a, pt = placeType(p, a);
  function row(ok, title, sub, amt) {
    var cls = ok === null ? 'info' : ok ? 'yes' : 'no', ic = ok === null ? 'i' : ok ? '✓' : '–';
    return '<div class="vd"><span class="ico ' + cls + '">' + ic + '</span><span><b>' + title + '</b><small>' + sub + '</small></span><span class="amt num">' + amt + '<small>limit</small></span></div>';
  }
  var dSub = v.dOk === null ? 'USDA lends to you directly. For lower incomes.' : v.dOk ? 'You are under the limit. USDA lends to you directly.' : 'Over this limit. Guaranteed may still work.';
  var gSub = v.gOk === null ? 'A private lender lends, USDA backs the loan.' : v.gOk ? 'You are under the limit. A lender makes the loan, USDA backs it.' : 'Over this limit by ' + money(S.income - v.guar) + '. Deductions may close the gap.';
  var rows = row(v.dOk, 'Direct loan', dSub, money(v.direct)) + row(v.gOk, 'Guaranteed loan', gSub, money(v.guar)) +
    '<div class="vd"><span class="ico ' + pt.cls + '">' + (pt.cls === 'yes' ? '✓' : '!') + '</span><span><b>' + pt.t + '</b><small>' + pt.s + '</small></span><span></span></div>' +
    (p.oz ? '<div class="vd"><span class="ico info">★</span><span><b>' + p.oz + ' Opportunity Zone tract' + (p.oz > 1 ? 's' : '') + ' in this county</b><small>Tax benefits for people who invest and build here (2018 map).</small></span><span></span></div>' : '');
  var cta;
  if (S.role === 'agent') {
    cta = '<pre class="code">GET https://usda.3fs.app/api/check?zip=' + (p.kind === 'zip' ? p.label.slice(-5) : '30513') + '&people=' + S.size + '&income=' + (S.income || 0) + '\n→ 402 Payment Required (x402, $0.02 USDC)\n→ 200 { direct, guaranteed, area, pdf_page: ' + a.page + ' }</pre><div class="cta"><a class="btn dark" href="#pricing">' + role.cta + '</a></div>';
  } else {
    cta = '<div class="cta"><a class="btn primary" href="#file">' + role.cta + '</a><button class="btn" type="button" id="askHere">Ask the guide</button>' + (p.kind === 'zip' ? '<a class="btn" href="/api/sheet?zip=' + p.label.slice(-5) + '&people=' + S.size + '&income=' + (S.income || 0) + '" target="_blank" rel="noopener">Download answer sheet</a>' : '') + '</div>';
  }
  var src = '<p class="src">Source: FY2026 USDA income limits · ' + esc(a.name) + ' · <a href="#proof">PDF page ' + a.page + '</a></p>';
  el.innerHTML = head + hh + '<div class="verdicts">' + rows + '</div>' + cta + src;
  bindHH();
  var ah = $('#askHere'); if (ah) ah.onclick = function () { openAI('What should I do next for ' + p.label + '?'); };
}
function bindHH() {
  $('#szDn').onclick = function () { setHH(Math.max(1, S.size - 1), S.income); };
  $('#szUp').onclick = function () { setHH(Math.min(15, S.size + 1), S.income); };
  var inc = $('#inc');
  inc.addEventListener('change', function () { setHH(S.size, parseMoney(inc.value)); });
  inc.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); setHH(S.size, parseMoney(inc.value)); } });
}
function parseMoney(s) { s = String(s || '').toLowerCase().replace(/[$,\s]/g, ''); var k = /k$/.test(s); var n = parseFloat(s); if (isNaN(n)) return 0; return Math.round(k ? n * 1000 : n); }
function setHH(size, income) {
  S.size = size; S.income = income; S.example = false;
  recolor(); renderAnswer(); renderNear(); renderFile();
  var f = $('#inc'); if (f && document.activeElement !== f) { /* keep */ }
}
function setPlace(p, opt) {
  S.place = p; S.example = !!(opt && opt.example);
  if (!opt || opt.fly !== false) flyToPlace(p);
  dirty = true; renderAnswer(); renderNear(); renderFile();
}

/* ---------- nearby ---------- */
function nearby(p, miles, onlyQual, limit) {
  var out = [];
  for (var i = 0; i < counties.length; i++) {
    var f = counties[i]; if (f.ai < 0 || (p.f && f.id === p.f.id)) continue;
    var d = d3.geoDistance([p.lon, p.lat], f.c) * 3959;
    if (d > miles) continue;
    var a = area(f.ai), q = qual(a);
    if (onlyQual && q === 0) continue;
    out.push({ f: f, a: a, d: d, q: q });
  }
  out.sort(function (x, y) { return (onlyQual ? 0 : (x.a.metro - y.a.metro)) || x.d - y.d; });
  return out.slice(0, limit || 6);
}
function renderNear() {
  var el = $('#near'), p = S.place; if (!p) { el.hidden = true; return; }
  el.hidden = false;
  var list = nearby(p, 90, !!S.income, 6);
  var title = S.income ? 'Nearby places you qualify' : 'Nearby rural counties';
  el.innerHTML = '<h3>' + title + '<span class="small muted num">within 90 miles</span></h3>' + (list.length ? '<ul>' + list.map(function (n, k) {
    var c = n.q === 2 ? '#A30D22' : n.q === 1 ? '#5B6B8C' : n.a.metro ? '#d3dce7' : '#D06A73';
    return '<li><button type="button" data-k="' + n.f.id + '"><i style="background:' + c + '"></i><b style="font-weight:600">' + esc(cname(n.f)) + '</b><span>' + Math.round(n.d) + ' mi · ' + money(limitFor(n.q === 2 ? n.a.l : n.a.m, S.size)) + '</span></button></li>';
  }).join('') + '</ul>' : '<p class="small muted" style="margin-top:8px">None within 90 miles at this income. Try Guaranteed areas farther out, or ask the guide.</p>') +
    (S.income ? '<button class="btn small" type="button" id="showAll" style="margin-top:10px">Show everywhere I qualify</button>' : '');
  el.querySelectorAll('[data-k]').forEach(function (b) { b.onclick = function () { setPlace(placeFromCounty(byFips[b.dataset.k])); }; });
  var sa = $('#showAll'); if (sa) sa.onclick = function () { S.layer = 'qualify'; renderLayers(); recolor(); fly({ rot: [-p.lon, -p.lat, 0], scale: usView().scale * 2.6 }, 1200); };
}

/* ---------- search ---------- */
var sugg = [], sel = -1, qEl = $('#q'), sEl = $('#sugg');
qEl.addEventListener('input', function () {
  sugg = suggest(qEl.value); sel = -1;
  sEl.innerHTML = sugg.map(function (s, i) { return '<li role="option" id="sg' + i + '" data-i="' + i + '" aria-selected="false">' + esc(s.label) + '<span>' + s.sub + '</span></li>'; }).join('');
  sEl.hidden = !sugg.length; qEl.setAttribute('aria-expanded', String(!!sugg.length));
});
qEl.addEventListener('keydown', function (e) {
  if (sEl.hidden) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault(); sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + sugg.length) % sugg.length;
    sEl.querySelectorAll('li').forEach(function (li, i) { li.setAttribute('aria-selected', String(i === sel)); });
    qEl.setAttribute('aria-activedescendant', 'sg' + sel);
  } else if (e.key === 'Escape') { sEl.hidden = true; }
});
sEl.addEventListener('mousedown', function (e) { var li = e.target.closest('li'); if (!li) return; e.preventDefault(); choose(sugg[+li.dataset.i]); });
function choose(s) { if (!s) return; var p = s.go(); qEl.value = s.label; sEl.hidden = true; if (p) setPlace(p); }
$('#searchForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (!sEl.hidden && sel >= 0) return choose(sugg[sel]);
  var p = resolve(qEl.value); sEl.hidden = true;
  if (p) setPlace(p); else { qEl.setCustomValidity('No match. Try a ZIP code or "City, ST".'); qEl.reportValidity(); setTimeout(function () { qEl.setCustomValidity(''); }, 2500); }
});
document.addEventListener('click', function (e) { if (!e.target.closest('.searchwrap')) sEl.hidden = true; });

/* ---------- my file ---------- */
var FLOWS = {
  family: { lede: 'Upload once. The guide checks every page, builds your packet, and moves it to the people who decide.', steps: [['Qualify', 'ai'], ['Pick a place', 'you'], ['Documents', 'you'], ['Packet check', 'ai'], ['Loan review', 'gov'], ['Find or build', 'you'], ['Closing', 'gov'], ['Keys', 'you']],
    docs: [['Photo ID for each adult', 'Driver\'s license or passport', /id|license|passport/], ['Pay stubs, last 30 days', 'Every job in the household', /pay|stub/], ['W-2s, last 2 years', 'Or 1099s if self-employed', /w-?2|1099/], ['Tax returns, last 2 years', 'All pages, signed', /tax|1040|return/], ['Bank statements, last 2 months', 'All pages, every account', /bank|statement/], ['Other income', 'Benefits, child support, pensions', /benefit|support|ssi|pension|award/], ['Rent history', 'Lease or landlord contact', /lease|rent|landlord/], ['Credit check permission', 'The guide prepares this form for you to sign', /credit|auth/], ['Purchase contract', 'Once you pick a home', /contract|purchase/]] },
  builder: { lede: 'Plan homes where USDA buyers qualify. The guide checks sites, matches buyers, and tracks every construction draw.', steps: [['Site check', 'ai'], ['Buyer pool', 'ai'], ['Plans & codes', 'you'], ['Lender or USDA', 'gov'], ['Build & draws', 'you'], ['Inspections', 'gov'], ['Sale', 'you'], ['Handover', 'ai']],
    docs: [['Lot or site details', 'Address, parcel, survey', /lot|site|parcel|survey/], ['Plans and specs', 'Drawings and materials list', /plan|spec|drawing/], ['Cost breakdown', 'Line-item budget', /cost|budget|estimate/], ['License and insurance', 'Builder license, liability, builder\'s risk', /license|insur/], ['Construction contract', 'Signed with the buyer', /contract/], ['Draw schedule', 'When each payment is released', /draw|schedule/], ['Energy and code sheets', 'Meets the current energy code', /energy|code|hers/]] },
  lender: { lede: 'Get Guaranteed-loan files that arrive complete and checked against the source.', steps: [['Pre-check', 'ai'], ['Packet in', 'ai'], ['Verify docs', 'ai'], ['Underwrite', 'you'], ['USDA submission', 'gov'], ['Commitment', 'gov'], ['Closing', 'you'], ['Servicing', 'you']],
    docs: [['Borrower packet', 'Assembled by the guide', /packet|borrower/], ['Income calculation', 'With the source page', /income|calc/], ['Property eligibility', 'Address check result', /eligib|property/], ['Credit report', 'From your bureau', /credit/], ['Appraisal', 'Ordered by you', /apprais/]] },
  realtor: { lede: 'Check any listing in seconds and send buyers a file that is ready to go.', steps: [['Check listing', 'ai'], ['Match buyers', 'ai'], ['Buyer file', 'you'], ['Loan review', 'gov'], ['Offer', 'you'], ['Closing', 'gov']],
    docs: [['Listing address', 'Or MLS number', /listing|mls/], ['Buyer pre-check', 'From the guide', /buyer|pre/], ['Purchase contract', 'Signed', /contract/]] },
  packager: { lede: 'Help many families at once. The guide checks each one and keeps every file organized.', steps: [['Intake', 'ai'], ['Pre-check', 'ai'], ['Documents', 'you'], ['Packet check', 'ai'], ['Submit to USDA', 'gov'], ['Decision', 'gov'], ['Closing', 'you']],
    docs: [['Family list', 'Names and contact info', /list|roster|family/], ['Each family\'s documents', 'Same list as a family file', /doc/], ['Packager certification', 'Your USDA certification', /cert/]] },
  agent: { lede: 'Call the same checks over the API. Each call is paid over x402 and returns the source page.', steps: [['Request', 'you'], ['402 price', 'ai'], ['Pay', 'you'], ['Answer', 'ai'], ['Proof', 'ai']],
    docs: [['Agent wallet', 'Test USDC on a test network', /wallet/], ['Agent identity', 'ERC-8004 registration', /8004|identity|agent/]] }
};
function renderFile() {
  var fl = FLOWS[S.role], role = ROLES.find(function (r) { return r.id === S.role; });
  $('#fileEyebrow').textContent = 'My file · ' + role.label;
  $('#fileLede').textContent = fl.lede;
  var v = S.place ? verdictFor(S.place) : null;
  var have = fl.docs.filter(function (d) { return S.docsHave[d[0]]; }).length;
  var stage = 0;
  if (v && (v.gOk || v.dOk)) stage = 1;
  if (stage === 1 && S.place && !S.example) stage = 2;
  if (stage === 2 && have === fl.docs.length) stage = 3;
  var html = '';
  fl.steps.forEach(function (s, i) {
    var cls = i < stage ? 'done' : i === stage ? 'active' : '';
    if (i) html += '<li class="sm-wire ' + (i <= stage ? 'done' : '') + '" aria-hidden="true"></li>';
    var who = { ai: ['ai', 'AI'], you: ['you', 'You'], gov: ['gov', S.role === 'lender' || S.role === 'builder' ? 'USDA / lender' : 'USDA / lender'] }[s[1]];
    html += '<li class="sm-node ' + cls + '"><span class="sm-dot"></span><span class="sm-lbl">' + s[0] + '</span><span class="who ' + who[0] + '">' + who[1] + '</span></li>';
  });
  $('#track').innerHTML = html;
  $('#modeNote').textContent = S.mode === 'all'
    ? 'Hand it all to us: you upload once. The guide checks every page and sends a complete file to an approved lender (Guaranteed loans) or to a USDA-certified packager who submits Direct loan applications. You see every step here, and USDA or the lender makes the decision.'
    : 'Just my packet: the guide checks and assembles everything into one verified packet. You take it to any lender or USDA office you choose.';
  $('#docCount').textContent = have + ' of ' + fl.docs.length + ' ready';
  $('#docs').innerHTML = fl.docs.map(function (d) {
    var h = S.docsHave[d[0]];
    return '<li class="' + (h ? 'have' : '') + '"><span class="ck">' + (h ? '✓' : '') + '</span><span><b style="font-weight:600">' + d[0] + '</b><small>' + d[1] + '</small></span><span class="h">' + (h ? esc(h) : '') + '</span></li>';
  }).join('');
}
$('#modeAll').onclick = function () { S.mode = 'all'; this.setAttribute('aria-pressed', 'true'); $('#modePacket').setAttribute('aria-pressed', 'false'); renderFile(); };
$('#modePacket').onclick = function () { S.mode = 'packet'; this.setAttribute('aria-pressed', 'true'); $('#modeAll').setAttribute('aria-pressed', 'false'); renderFile(); };
function hex(buf) { return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join(''); }
var prints = [];
function takeFiles(files) {
  Array.from(files).forEach(function (file) {
    file.arrayBuffer().then(function (b) { return crypto.subtle.digest('SHA-256', b); }).then(function (h) {
      var hx = hex(h), fl = FLOWS[S.role], nm = file.name.toLowerCase();
      var match = fl.docs.find(function (d) { return d[2].test(nm) && !S.docsHave[d[0]]; });
      if (match) S.docsHave[match[0]] = hx.slice(0, 10) + '…';
      prints.unshift({ name: file.name, size: file.size, hx: hx, doc: match ? match[0] : 'The guide will sort this one' });
      $('#prints').innerHTML = prints.slice(0, 12).map(function (p) { return '<li class="have"><span class="ck">✓</span><span><b style="font-weight:600">' + esc(p.name) + '</b><small>' + esc(p.doc) + ' · ' + Math.round(p.size / 1024) + ' KB</small><span class="hash">' + p.hx + '</span></span><span></span></li>'; }).join('');
      renderFile();
    });
  });
}
function wireDrop(el, input, fn) {
  input.addEventListener('change', function () { fn(input.files); input.value = ''; });
  el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
  el.addEventListener('dragover', function (e) { e.preventDefault(); el.classList.add('over'); });
  el.addEventListener('dragleave', function () { el.classList.remove('over'); });
  el.addEventListener('drop', function (e) { e.preventDefault(); el.classList.remove('over'); fn(e.dataTransfer.files); });
}
wireDrop($('#drop'), $('#fileIn'), takeFiles);

/* ---------- network ---------- */
var NODES = [
  { id: 'guide', x: 450, y: 280, r: 50, c: '#A30D22', label: '3FS Guide', sub: 'you talk to this', st: 'live', d: 'The one you talk to. It works out what you need, sends each job to the agent built for it, checks every answer against the source, and explains the result in plain words.' },
  { id: 'place', x: 330, y: 190, r: 24, c: '#2B3A55', label: 'Place agent', st: 'live', d: 'Turns an address, ZIP, city or county into the right USDA income area.' },
  { id: 'limits', x: 570, y: 190, r: 24, c: '#2B3A55', label: 'Limits agent', st: 'live', d: 'Reads the FY2026 USDA income table for that area and household size, and returns the page it came from.' },
  { id: 'zones', x: 600, y: 330, r: 24, c: '#2B3A55', label: 'Zones agent', st: 'live', d: 'Finds rural counties and Opportunity Zone tracts nearby.' },
  { id: 'match', x: 300, y: 330, r: 24, c: '#2B3A55', label: 'Match agent', st: 'live', d: 'Finds every place near you where your household qualifies.' },
  { id: 'packet', x: 450, y: 440, r: 24, c: '#2B3A55', label: 'Packet agent', st: 'live', d: 'Builds your document packet, fingerprints each file, and tracks what is still missing.' },
  { id: 'families', x: 105, y: 110, r: 30, c: '#5c6b82', label: 'Families', sub: 'buy or build', st: 'live', d: 'The front door. Pick who you are, search a place, get a plain answer.' },
  { id: 'builders', x: 105, y: 280, r: 30, c: '#5c6b82', label: 'Builders', sub: 'plan USDA homes', st: 'live', d: 'See where USDA buyers qualify and where Opportunity Zones overlap, then plan homes there.' },
  { id: 'packagers', x: 105, y: 450, r: 30, c: '#5c6b82', label: 'Packagers', sub: 'USDA-certified', st: 'plan', d: 'USDA-certified groups that submit Direct loan applications for families. This is how "hand it all to us" works for Direct loans.' },
  { id: 'lenders', x: 795, y: 110, r: 30, c: '#5c6b82', label: 'Lenders', sub: 'approved by USDA', st: 'plan', d: 'Receive complete, checked Guaranteed-loan files.' },
  { id: 'usda', x: 795, y: 280, r: 30, c: '#5c6b82', label: 'USDA RD', sub: 'decides', st: 'plan', d: 'USDA Rural Development decides Direct loans and backs Guaranteed loans. 3FS hands files over and never makes the decision.' },
  { id: 'agents', x: 795, y: 450, r: 30, c: '#B8860B', label: 'AI agents', sub: 'pay per check · x402', st: 'test', d: 'Other AI systems ask the same questions and pay a small fee per check over x402. They get the same sourced answer a family gets.' },
  { id: 'rails', x: 330, y: 515, r: 26, c: '#111214', label: 'UnyKorn Rails', sub: 'proof + ERC-8004 ID', st: 'test', d: 'Keeps the evidence record: every check and file fingerprint, rolled into one root anyone can verify. The guide\'s identity is registered under ERC-8004.' },
  { id: 'hub', x: 570, y: 515, r: 26, c: '#111214', label: '3fs.app', sub: 'the 3FS network', st: 'live', d: 'The 3FS network this site belongs to. The same guide and rails power the other 3FS sites.' }
];
var EDGES = [['guide', 'place', 1], ['guide', 'limits', 1], ['guide', 'zones', 1], ['guide', 'match', 1], ['guide', 'packet', 1], ['families', 'guide', 1], ['builders', 'guide', 1], ['packagers', 'guide'], ['guide', 'lenders'], ['guide', 'usda'], ['agents', 'guide', 1], ['guide', 'rails', 1], ['guide', 'hub', 1]];
function renderNet(selId) {
  var by = {}; NODES.forEach(function (n) { by[n.id] = n; });
  var h = '<defs><linearGradient id="gEdge" x1="0" x2="1"><stop offset="0" stop-color="#A30D22"/><stop offset="1" stop-color="#2B3A55"/></linearGradient><radialGradient id="gShine" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';
  EDGES.forEach(function (e) { var a = by[e[0]], b = by[e[1]]; h += '<path class="edge' + (e[2] ? ' live' : '') + '" d="M' + a.x + ' ' + a.y + ' L' + b.x + ' ' + b.y + '"/>'; });
  NODES.forEach(function (n) {
    var below = n.r < 40;
    h += '<g class="node' + (n.id === selId ? ' sel' : '') + '" data-id="' + n.id + '" tabindex="0" role="button" aria-label="' + n.label + '"><circle cx="' + n.x + '" cy="' + n.y + '" r="' + n.r + '" fill="' + n.c + '"/><circle cx="' + n.x + '" cy="' + n.y + '" r="' + n.r + '" fill="url(#gShine)" stroke="none"/>' +
      (n.id === 'guide' ? '<text x="' + n.x + '" y="' + (n.y + 5) + '" text-anchor="middle" style="fill:#fff;font:800 15px Archivo,sans-serif">3FS</text>' : '') +
      '<text x="' + n.x + '" y="' + (n.y + n.r + 18) + '" text-anchor="middle">' + n.label + '</text>' + (n.sub ? '<text class="sub" x="' + n.x + '" y="' + (n.y + n.r + 32) + '" text-anchor="middle">' + n.sub + '</text>' : '') + '</g>';
  });
  $('#net').innerHTML = h;
  var n = by[selId || 'guide'];
  var stl = { live: ['live', 'Working in this prototype'], test: ['test', 'Test mode'], plan: ['plan', 'Next: partners to sign'] }[n.st];
  $('#netInfo').innerHTML = '<div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline;flex-wrap:wrap"><h2>' + n.label + '</h2><span class="status ' + stl[0] + '">' + stl[1] + '</span></div><p style="margin-top:8px;color:var(--ink2)">' + n.d + '</p>';
}
$('#net').addEventListener('click', function (e) { var g = e.target.closest('.node'); if (g) renderNet(g.dataset.id); });
$('#net').addEventListener('keydown', function (e) { var g = e.target.closest('.node'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); renderNet(g.dataset.id); } });

function apiCheck(zip, size, income) {
  var z = zipBy[zip]; if (!z) return { error: 'ZIP not found' };
  var p = placeFromZip(z), a = area(p.ai);
  if (!a) return { error: 'County not matched yet', county: cname(p.f) };
  var dl = limitFor(a.l, size), gl = limitFor(a.m, size);
  return { place: p.label, county: cname(p.f), income_area: a.name, people: size, income: income,
    direct: { limit: dl, qualifies: income <= dl }, guaranteed: { limit: gl, qualifies: income <= gl },
    county_type: a.metro ? 'metro: confirm address' : 'rural', opportunity_zone_tracts: p.oz,
    source: { doc: 'FY2026 HB-1-3550 Appendix 9, PN 657', pdf_page: a.page, sha256: SRC.sha } };
}
function runApi() {
  var zip = $('#apiZip').value.trim(), size = Math.max(1, +$('#apiSize').value || 1), inc = Math.max(0, +$('#apiInc').value || 0);
  var path = '/api/check?zip=' + encodeURIComponent(zip) + '&people=' + size + '&income=' + inc;
  var res = apiCheck(zip, size, inc);
  function show(live) {
    var steps = [
      ['1 · Ask', 'GET https://usda.3fs.app' + path],
      ['2 · Price (live answer from this server)', live],
      ['3 · Pay and ask again', 'X-PAYMENT: <signed USDC authorization>'],
      ['4 · Answer (200 OK)', JSON.stringify(res, null, 2)]
    ];
    $('#apiSteps').innerHTML = steps.map(function (s) { return '<li><b>' + s[0] + '</b><pre class="code">' + esc(s[1]) + '</pre></li>'; }).join('');
  }
  show('…');
  fetch(path).then(function (r) { return r.text().then(function (t) { show('HTTP ' + r.status + '\n' + t); }); }).catch(function () { show('Could not reach the server.'); });
}
$('#apiForm').addEventListener('submit', function (e) { e.preventDefault(); runApi(); });

/* ---------- proof ---------- */
function renderProof() {
  $('#srcKv').innerHTML = [
    ['Document', 'FY2026 Adjusted Income Limits, USDA Handbook HB-1-3550, Appendix 9'],
    ['Issued', '07/13/2026 · Procedure Notice 657'],
    ['Programs', 'Single Family Housing Direct (very low and low limits) and Guaranteed (moderate limit)'],
    ['Pages', SRC.pages + ' pages, every state and territory'],
    ['Income areas read', SRC.areas.toLocaleString('en-US')],
    ['Counties matched', SRC.mapped.toLocaleString('en-US') + ' of ' + SRC.total.toLocaleString('en-US')],
    ['SHA-256', '<span class="hash">' + SRC.sha + '</span>'],
    ['Program page', '<a href="https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-guaranteed-loan-program" target="_blank" rel="noopener">USDA Guaranteed Loan Program</a>']
  ].map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('');
  $('#otherKv').innerHTML = [
    ['Opportunity Zones', D.ozTotal.toLocaleString('en-US') + ' tracts, U.S. Treasury CDFI Fund designations (2018). A new round of zones starts in 2027.'],
    ['Map shapes', 'U.S. Census Bureau county and state boundaries'],
    ['ZIP codes', (zips.length).toLocaleString('en-US') + ' ZIPs matched to counties and metro areas from open crosswalk data'],
    ['Exact-address check', '<a href="https://eligibility.sc.egov.usda.gov/" target="_blank" rel="noopener">USDA property eligibility site</a>']
  ].map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('');
  $('#gaps').innerHTML = [
    'The exact-address rural check. This page shows the county type; the backend will pull USDA\'s eligibility boundaries so every address gets a yes or no.',
    'New England metro limits are set town by town. Here they are matched by county and by town name in ZIP searches.',
    SRC.manual.length + ' metro counties are not named in the table (' + SRC.manual.join(', ') + '). They were matched to their metro area by hand and should be confirmed.',
    'Sending files to a lender or packager. That needs signed consent and partner agreements.',
    'Pay-per-check for AI agents runs on the Base test network until the receiving wallet is switched on. Pro keys work now.'
  ].map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
}
wireDrop($('#pdfDrop'), $('#pdfIn'), function (files) {
  var f = files[0]; if (!f) return; $('#pdfRes').textContent = 'Fingerprinting…';
  f.arrayBuffer().then(function (b) { return crypto.subtle.digest('SHA-256', b); }).then(function (h) {
    var hx = hex(h), ok = hx === SRC.sha;
    $('#pdfRes').innerHTML = (ok ? '<span class="ok">Match.</span> This is the same file the limits were read from.' : '<span class="no">Different file.</span> USDA may have issued a newer version. The limits on this page come from the copy fingerprinted above.') + '<br>' + hx;
  });
});

/* ---------- AI guide ---------- */
var AGENTS = [['place', 'Place'], ['limits', 'Limits'], ['zones', 'Zones'], ['match', 'Match'], ['packet', 'Packet']];
function agentState(id, st) { var el = document.querySelector('.agent[data-a="' + id + '"]'); if (el) el.className = 'agent ' + (st || ''); }
function resetAgents() { $('#agents').innerHTML = AGENTS.map(function (a) { return '<span class="agent" data-a="' + a[0] + '"><i></i>' + a[1] + ' agent</span>'; }).join(''); }
var turns = [], busy = false, sampleFn = null, toolsOk = false, ctl = null;

var TOOLS = {
  find_place: { agent: 'place', description: 'Find a place the person mentions (address, ZIP, city, or county) and show it on the map. Returns the county, the USDA income area, the PDF page, the county type and the 4-person limits.',
    schema: { type: 'object', properties: { query: { type: 'string', description: 'Address, ZIP, "City, ST" or "County, ST"' } }, required: ['query'] },
    run: function (i) {
      var p = resolve(String(i.query || '')); if (!p) throw new Error('No match for "' + i.query + '". Ask for a ZIP or "City, ST".');
      setPlace(p); var a = p.ai >= 0 ? area(p.ai) : null;
      return { place: p.label, county: p.f ? cname(p.f) : null, income_area: a ? a.name : 'not matched', pdf_page: a ? a.page : null,
        county_type: a ? (p.zipRural ? 'outside any metro area: very likely eligible' : a.metro ? 'metro area: confirm exact address' : 'rural county: most of it qualifies') : null,
        limits_4_people: a ? { direct: a.l[0], guaranteed: a.m[0] } : null, opportunity_zone_tracts: p.oz };
    } },
  check_household: { agent: 'limits', description: 'Check a household against the FY2026 limits for the place on the map. Updates the answer card. Returns the Direct and Guaranteed limits for this household size and whether the income is under each.',
    schema: { type: 'object', properties: { people: { type: 'number' }, annual_income: { type: 'number', description: 'Yearly household income in dollars' } }, required: ['people', 'annual_income'] },
    run: function (i) {
      if (!S.place) throw new Error('No place yet. Call find_place first.');
      setHH(Math.max(1, Math.min(15, Math.round(+i.people || 1))), Math.max(0, Math.round(+i.annual_income || 0)));
      var v = verdictFor(S.place); if (!v) throw new Error('This county is not matched automatically yet.');
      return { place: S.place.label, people: S.size, income: S.income, direct: { limit: v.direct, qualifies: v.dOk }, guaranteed: { limit: v.guar, qualifies: v.gOk }, very_low_limit: v.vlow, source: 'FY2026 HB-1-3550 App. 9, ' + v.a.name + ', PDF page ' + v.a.page };
    } },
  where_qualify: { agent: 'match', description: 'List the nearest counties (up to the given miles) where this household qualifies, and color the map. Returns county, miles, which loans, and limit.',
    schema: { type: 'object', properties: { miles: { type: 'number' } } },
    run: function (i) {
      if (!S.place) throw new Error('No place yet.'); if (!S.income) throw new Error('No income yet. Call check_household first.');
      S.layer = 'qualify'; renderLayers(); recolor();
      return nearby(S.place, Math.min(250, +i.miles || 90), true, 8).map(function (n) { return { county: cname(n.f), miles: Math.round(n.d), loans: n.q === 2 ? 'Direct and Guaranteed' : 'Guaranteed', county_type: n.a.metro ? 'metro' : 'rural', pdf_page: n.a.page }; });
    } },
  opportunity_zones: { agent: 'zones', description: 'Opportunity Zone tract counts (2018 map) for counties near the place on the map. Switches the map to the Opportunity Zone layer.',
    schema: { type: 'object', properties: { miles: { type: 'number' } } },
    run: function (i) {
      if (!S.place) throw new Error('No place yet.');
      S.layer = 'oz'; renderLayers(); recolor();
      var m = Math.min(200, +i.miles || 60), out = [];
      counties.forEach(function (f) { if (!f.oz) return; var d = d3.geoDistance([S.place.lon, S.place.lat], f.c) * 3959; if (d <= m) out.push({ county: cname(f), tracts: f.oz, miles: Math.round(d) }); });
      return out.sort(function (a, b) { return a.miles - b.miles; }).slice(0, 10);
    } },
  start_file: { agent: 'packet', description: 'Open the person\'s file and return the document checklist and the steps for their role.',
    schema: { type: 'object', properties: {} },
    run: function () { location.hash = 'file'; var fl = FLOWS[S.role]; return { role: S.role, steps: fl.steps.map(function (s) { return s[0]; }), documents: fl.docs.map(function (d) { return d[0]; }) }; } }
};
var RULES = 'You are the guide inside 3FS Rural Home, a site that helps people use USDA Single Family Housing loans. Talk like a calm, experienced loan coordinator who has done this a thousand times: confident, warm, direct. Plain words, short sentences. No jargon, no hype, no slang, no filler, never talk down. If you use a term like "Direct loan", explain it in a few words.\n\n' +
  'Facts: use the tools for every number and never guess one. Limits are FY2026 USDA limits (HB-1-3550 Appendix 9, dated 07/13/2026); mention the PDF page the tool returns. A Direct loan means USDA lends to the household itself; it uses the low-income limit and the application goes to the local USDA Rural Development office, often through a certified packager. A Guaranteed loan means an approved private lender makes the loan and USDA backs it; it uses the moderate-income limit. Limits compare to adjusted yearly household income, and deductions (for example for children) can lower it, so someone slightly over may still qualify. The home must be in a USDA-eligible rural area: this site knows the county type, and the exact address gets confirmed on USDA\'s map. 3FS is a technology provider, not USDA and not a lender; USDA or the lender decides. Do not promise approval.\n\n' +
  'How to work: when the person names a place, call find_place. When they give household size and income, call check_household. If they ask where they can buy, call where_qualify. For investors or builders, opportunity_zones helps. When they are ready to start, call start_file. Then answer in 2 to 5 short sentences or a short list, and end with one clear next step. Reply in the person\'s language.';
function context() {
  return '\n\nRight now: role = ' + S.role + '; place on map = ' + (S.place ? S.place.label : 'none') + '; household on screen = ' + S.size + ' people, income ' + (S.income ? money(S.income) : 'not given') + '.';
}
function addMsg(cls, text) { var d = document.createElement('div'); d.className = 'msg ' + cls; d.textContent = text; $('#chat').appendChild(d); $('#chat').scrollTop = 1e6; return d; }
function openAI(prefill) {
  $('#ai').hidden = false;
  if (!$('#chat').children.length) {
    addMsg('bot', 'Hi. Tell me where you want to live, how many people are in your home, and about what you earn in a year. I\'ll check it against USDA\'s numbers and walk you through every step.');
    $('#starters').innerHTML = ['Family of 5, we make $72k, near Macon GA', 'Where can I build homes near Gainesville FL for USDA buyers?', 'We make $95k, 4 of us, Blue Ridge GA 30513', 'What documents do I need?'].map(function (s) { return '<button class="chip" type="button">' + s + '</button>'; }).join('');
  }
  if (prefill) { $('#askIn').value = prefill; }
  $('#askIn').focus();
}
$('#askOpen').onclick = function () { openAI(); };
$('#askClose').onclick = function () { $('#ai').hidden = true; if (ctl) ctl.abort(); };
$('#starters').addEventListener('click', function (e) { var c = e.target.closest('.chip'); if (c) { $('#askIn').value = c.textContent; $('#askForm').requestSubmit(); } });
$('#askForm').addEventListener('submit', function (e) {
  e.preventDefault(); var q = $('#askIn').value.trim(); if (!q || busy) return;
  $('#askIn').value = ''; $('#starters').innerHTML = ''; addMsg('me', q); ask(q);
});
function runTool(name, input) {
  var t = TOOLS[name]; agentState(t.agent, 'run');
  try { var r = t.run(input || {}); setTimeout(function () { agentState(t.agent, 'done'); }, 350); return r; }
  catch (err) { agentState(t.agent, ''); throw err; }
}
function callGuide(messages, withTools) {
  return fetch('/api/guide', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: messages, withTools: withTools, context: context().trim() }) })
    .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw j; return j; }); });
}
function localTools(q, done) {
  done = done || {};
  var t = q.replace(/\s+/g, ' '), out = [], m, size = null, income = null, placeQ = null;
  if ((m = t.match(/(?:family|household|home) of (\d{1,2})/i)) || (m = t.match(/(\d{1,2}) (?:of us|people|persons)/i))) size = +m[1];
  if ((m = t.match(/\$\s?(\d[\d,]*(?:\.\d+)?)\s?(k)?/i)) || (m = t.match(/(\d[\d,]*(?:\.\d+)?)\s?(k)\b/i))) income = Math.round(parseFloat(m[1].replace(/,/g, '')) * (m[2] ? 1000 : 1));
  if ((m = t.match(/\b(\d{5})\b/))) placeQ = m[1]; else if ((m = t.match(/(?:near|in|around|at)\s+([A-Za-z .'-]+?(?:,?\s+[A-Z]{2}))\b/))) placeQ = m[1];
  function run(n, i) { try { out.push({ tool: n, result: runTool(n, i) }); } catch (err) { out.push({ tool: n, error: err.message }); } }
  if (placeQ && !done.find_place) run('find_place', { query: placeQ });
  if (S.place && (size || income) && !done.check_household) { run('check_household', { people: size || S.size, annual_income: income || S.income }); if ((income || S.income) && !done.where_qualify) run('where_qualify', { miles: 90 }); }
  if (/opportunity|investor|build/i.test(t) && S.place && !done.opportunity_zones) run('opportunity_zones', { miles: 60 });
  if (/document|paper|need|start|apply/i.test(t) && !done.start_file) run('start_file', {});
  return out;
}
function ask(q) {
  busy = true; resetAgents(); $('#askSend').textContent = '…';
  var bubble = addMsg('bot think', 'Working on it…');
  var finish = function () { busy = false; $('#askSend').textContent = 'Send'; };
  turns.push({ role: 'user', content: q });
  var hist = turns.slice(-8);
  callGuide(hist, true).then(function (r1) {
    var results = [];
    (r1.tool_calls || []).forEach(function (c) {
      if (!TOOLS[c.name]) return;
      var args = c.arguments; if (typeof args === 'string') { try { args = JSON.parse(args); } catch (err) { args = {}; } }
      try { results.push({ tool: c.name, result: runTool(c.name, args || {}) }); } catch (err) { results.push({ tool: c.name, error: err.message }); }
    });
    var done = {}; results.forEach(function (r) { done[r.tool] = 1; });
    results = results.concat(localTools(q, done));
    if (!results.length) return r1.text;
    bubble.textContent = 'Checking the numbers…';
    return callGuide(hist.concat([{ role: 'user', content: 'Results from the 3FS agents. Use only these numbers:\n' + JSON.stringify(results).slice(0, 8000) + '\n\nNow answer my last message. Mention the PDF page for any limit you give.' }]), false).then(function (r2) { return r2.text; });
  }).then(function (text) {
    if (!text) throw new Error('empty');
    bubble.className = 'msg bot'; bubble.textContent = text; turns.push({ role: 'assistant', content: text }); $('#chat').scrollTop = 1e6; finish();
  }).catch(function (err) {
    turns.pop();
    if (err && err.error === 'rate_limited') { bubble.className = 'msg bot'; bubble.textContent = 'Give me a minute and ask again.'; finish(); return; }
    localGuide(q, bubble); finish();
  });
}


// Built-in guide when Claude isn't available in this view: same tools, fixed wording.
function localGuide(q, bubble) {
  var t = q.replace(/\s+/g, ' '), lines = [];
  var size = null, income = null, m;
  if ((m = t.match(/(?:family|household|home) of (\d{1,2})/i)) || (m = t.match(/(\d{1,2}) (?:of us|people|persons|in (?:the|our) (?:home|house))/i))) size = +m[1];
  if ((m = t.match(/\$\s?(\d[\d,]*(?:\.\d+)?)\s?(k)?/i)) || (m = t.match(/(\d[\d,]*(?:\.\d+)?)\s?(k)\b/i)) || (m = t.match(/(?:make|earn|income)\D{0,12}(\d{2,3},\d{3})/i))) income = Math.round(parseFloat(m[1].replace(/,/g, '')) * (m[2] ? 1000 : 1));
  var placeQ = null;
  if ((m = t.match(/\b(\d{5})\b/))) placeQ = m[1];
  else if ((m = t.match(/(?:near|in|around|at)\s+([A-Za-z .'-]+?(?:,?\s+[A-Z]{2}))\b/))) placeQ = m[1];
  try {
    if (placeQ) { var r = runTool('find_place', { query: placeQ }); lines.push(r.place + ' is in ' + r.county + '. ' + (r.county_type ? r.county_type.charAt(0).toUpperCase() + r.county_type.slice(1) + '.' : '')); }
  } catch (e) { lines.push('I couldn\'t find that place. Give me a ZIP code or "City, ST" and I\'ll take it from there.'); }
  if (S.place && (size || income)) {
    try {
      var h = runTool('check_household', { people: size || S.size, annual_income: income || S.income });
      lines.push('For ' + h.people + ' people the Direct loan limit is ' + money(h.direct.limit) + ' and the Guaranteed loan limit is ' + money(h.guaranteed.limit) + ' (' + h.source + ').');
      if (h.income) lines.push(h.direct.qualifies ? 'At ' + money(h.income) + ' you are under both. A Direct loan, where USDA lends to you itself, is worth a look.' : h.guaranteed.qualifies ? 'At ' + money(h.income) + ' you fit the Guaranteed loan: an approved lender makes the loan and USDA backs it.' : 'At ' + money(h.income) + ' you are over both limits here. Deductions, like the one for each child, can lower the income USDA counts, so it is worth checking.');
      if (h.income) { var w = runTool('where_qualify', { miles: 90 }); if (w.length) lines.push('Close by, you also qualify in ' + w.slice(0, 3).map(function (x) { return x.county + ' (' + x.miles + ' mi)'; }).join(', ') + '. They are lit up on the map.'); }
    } catch (e) { lines.push(e.message); }
  }
  if (/opportunity|investor|build/i.test(t) && S.place) { try { var z = runTool('opportunity_zones', { miles: 60 }); lines.push(z.length ? 'Opportunity Zones nearby: ' + z.slice(0, 3).map(function (x) { return x.county + ' (' + x.tracts + ' tracts)'; }).join(', ') + '.' : 'No Opportunity Zone tracts within 60 miles on the 2018 map.'); } catch (e) {} }
  if (/document|paper|need|start|apply/i.test(t)) { var f = runTool('start_file', {}); lines.push('Here\'s what I need from you: ' + f.documents.slice(0, 5).join('; ') + '. Your file is open, and you can drop them in there.'); }
  if (!lines.length) lines.push('Tell me a place (ZIP or "City, ST"), how many people live in your home, and your yearly income. I\'ll check it against USDA\'s numbers.');
  else lines.push('Next step: ' + (S.income ? 'open My file and add your documents. I\'ll check every page.' : 'tell me your household size and yearly income.'));
  lines.push('USDA or the lender makes the final decision. I make sure your file is right.');
  bubble.className = 'msg bot'; bubble.textContent = lines.join('\n\n');
}

/* ---------- routing ---------- */
function route() {
  var r = (location.hash || '#find').slice(1); if (r === 'pro') r = 'pricing'; if (!/^(find|file|network|proof|pricing)$/.test(r)) r = 'find';
  document.querySelectorAll('[data-page]').forEach(function (p) { p.hidden = p.dataset.page !== r; });
  document.querySelectorAll('.nav a').forEach(function (a) { a.classList.toggle('active', a.dataset.route === r); if (a.dataset.route === r) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  if (r === 'find') { requestAnimationFrame(function () { resize(); }); }
}
window.addEventListener('hashchange', route);

/* ---------- boot ---------- */
renderRoles(); renderLayers(); resetAgents(); renderNet(); runApi(); renderProof();
route(); resize();
new ResizeObserver(function () { resize(); }).observe(canvas);
var ex = placeFromZip(zipBy['30513']);
S.place = ex; S.example = true; recolor(); renderAnswer(); renderNear(); renderFile();
var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) { var u = usView(); rot = u.rot; scale = u.scale; spinning = false; }
else { scale = BASE * .95; setTimeout(function () { if (spinning) fly(usView(), 2200); }, 2400); }
requestAnimationFrame(loop);


/* ---------- Pro ---------- */
var PRO_LINK = 'https://buy.stripe.com/28E8wQbaf2iKg4V2em9AA0y';
S.proKey = store('3fs.prokey') || ''; S.pro = false;
function renderPro(msg, key) {
  var el = $('#proBox'), h;
  if (key) {
    h = '<h2>Your Pro key</h2><p class="small muted" style="margin-top:6px">Copy it now and keep it safe. It is shown only once, and it is saved in this browser.</p><div class="keybox" id="keyTxt">' + esc(key) + '</div><div class="cta"><button class="btn primary" type="button" id="copyKey">Copy key</button></div>';
  } else if (S.pro) {
    h = '<h2>Pro is active</h2><p style="margin-top:6px;color:var(--ink2)">Bulk check is unlocked. Use your key for unlimited API checks:</p><pre class="code">curl -H "Authorization: Bearer ' + esc(S.proKey.slice(0, 10)) + '…" \\\n  "https://usda.3fs.app/api/check?zip=30513&amp;people=4&amp;income=68000"</pre><div class="cta"><button class="btn small" type="button" id="forget">Sign out of Pro on this browser</button></div>';
  } else {
    h = '<h2>Have a Pro key?</h2><p class="small muted" style="margin-top:6px">' + esc(msg || 'Paste it here to unlock bulk checks on this browser.') + '</p><form id="keyForm" class="cta" style="margin-top:10px"><label class="sr-only" for="keyIn">Pro key</label><input id="keyIn" style="flex:2;min-width:180px;padding:10px 12px;border-radius:11px;border:1px solid rgba(13,21,32,.16);font:13px var(--mono)" placeholder="rh_…"><button class="btn dark" type="submit">Unlock</button></form><p class="small" style="margin-top:12px">No key yet? <a href="' + PRO_LINK + '" target="_blank" rel="noopener">Get Pro for $49 a month</a>.</p>';
  }
  el.innerHTML = h;
  var c = $('#copyKey'); if (c) c.onclick = function () { navigator.clipboard.writeText(key).then(function () { c.textContent = 'Copied'; }, function () { var r = document.createRange(); r.selectNodeContents($('#keyTxt')); getSelection().removeAllRanges(); getSelection().addRange(r); }); };
  var f = $('#forget'); if (f) f.onclick = function () { S.proKey = ''; S.pro = false; store('3fs.prokey', ''); renderPro(); renderBulkLock(); };
  var kf = $('#keyForm'); if (kf) kf.onsubmit = function (e) { e.preventDefault(); verifyKey($('#keyIn').value.trim()); };
}
function verifyKey(k) {
  if (!/^rh_[a-f0-9]{48}$/i.test(k)) { renderPro('That does not look like a Pro key. It starts with rh_.'); return; }
  fetch('/api/pro/me', { headers: { authorization: 'Bearer ' + k } }).then(function (r) { return r.json(); }).then(function (j) {
    if (j.active) { S.proKey = k; S.pro = true; store('3fs.prokey', k); renderPro(); } else { renderPro('That key is not active. If your plan was canceled, you can restart it below.'); }
    renderBulkLock();
  }).catch(function () { renderPro('Could not reach the server. Try again in a moment.'); });
}
function claim(sid, tries) {
  renderPro('Your payment went through. Setting up your Pro key…');
  fetch('/api/pro/claim?session_id=' + encodeURIComponent(sid)).then(function (r) { return r.json(); }).then(function (j) {
    if (j.status === 'ready') { S.proKey = j.key; S.pro = true; store('3fs.prokey', j.key); renderPro(null, j.key); renderBulkLock(); history.replaceState(null, '', '/#pricing'); }
    else if (j.status === 'pending' && tries < 12) setTimeout(function () { claim(sid, tries + 1); }, 3000);
    else renderPro(j.message || 'Your payment went through. We will email your Pro key shortly.');
  }).catch(function () { renderPro('Your payment went through. We will email your Pro key shortly.'); });
}
function renderBulkLock() { $('#bulkLock').textContent = S.pro ? 'Pro · unlocked' : 'Pro'; }
var bulkRows = [];
function runBulk() {
  if (!S.pro) { renderPro('Bulk check is part of Pro. Get Pro, or paste your key here.'); $('#proBox').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
  var lines = $('#bulkIn').value.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean).slice(0, 5000);
  bulkRows = lines.map(function (line) {
    var parts = line.split(',').map(function (s) { return s.trim(); });
    var nums = []; while (parts.length > 1 && /^\$?[\d,.]+k?$/i.test(parts[parts.length - 1])) nums.unshift(parts.pop());
    var people = nums.length >= 2 ? +nums[0] : 4, income = parseMoney(nums[nums.length - 1] || '0');
    var p = resolve(parts.join(', ')), a = p && p.ai >= 0 ? area(p.ai) : null;
    if (!a) return { input: line, place: p ? p.label : 'not found' };
    var dl = limitFor(a.l, people), gl = limitFor(a.m, people);
    return { input: line, place: p.label, county: cname(p.f), people: people, income: income, direct: dl, direct_ok: income ? (income <= dl ? 'yes' : 'no') : '', guaranteed: gl, guaranteed_ok: income ? (income <= gl ? 'yes' : 'no') : '', type: p.zipRural ? 'outside metro' : a.metro ? 'metro: check address' : 'rural county', oz_tracts: p.oz, pdf_page: a.page };
  });
  var cols = ['place', 'county', 'people', 'income', 'direct', 'direct_ok', 'guaranteed', 'guaranteed_ok', 'type', 'oz_tracts', 'pdf_page'];
  $('#bulkOut').innerHTML = '<thead><tr>' + cols.map(function (c) { return '<th>' + c.replace('_', ' ') + '</th>'; }).join('') + '</tr></thead><tbody>' + bulkRows.map(function (r) { return '<tr>' + cols.map(function (c) { var v = r[c]; if ((c === 'direct' || c === 'guaranteed' || c === 'income') && v) v = money(v); return '<td>' + esc(v === undefined ? '' : v) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody>';
  $('#bulkDl').disabled = !bulkRows.length;
}
$('#bulkRun').onclick = runBulk;
$('#bulkFile').addEventListener('change', function () { var f = this.files[0]; if (!f) return; f.text().then(function (t) { $('#bulkIn').value = t.replace(/^.*(zip|place).*\r?\n/i, ''); runBulk(); }); this.value = ''; });
$('#bulkDl').onclick = function () {
  var cols = ['input', 'place', 'county', 'people', 'income', 'direct', 'direct_ok', 'guaranteed', 'guaranteed_ok', 'type', 'oz_tracts', 'pdf_page'];
  var csv = cols.join(',') + '\n' + bulkRows.map(function (r) { return cols.map(function (c) { var v = r[c] === undefined ? '' : String(r[c]); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(','); }).join('\n');
  var url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), link = document.createElement('a');
  link.href = url; link.download = '3fs-usda-check.csv'; document.body.appendChild(link); link.click(); link.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
};
(function bootPro() {
  renderPro(); renderBulkLock();
  var sid = new URLSearchParams(location.search).get('session_id');
  if (sid) { location.hash = 'pricing'; claim(sid, 0); }
  else if (S.proKey) verifyKey(S.proKey);
})();
})();
