// Aligns usda.3fs.app to the parent 3fs.app brand tokens: crimson #A30D22, ink #111214, field #F7F7F4, steel #D8DADF, Inter + IBM Plex Mono.
import fs from 'fs';
const PUB = process.argv[2];
const rd = f => fs.readFileSync(PUB + '/' + f, 'utf8'), wr = (f, s) => fs.writeFileSync(PUB + '/' + f, s);
const sw = (s, pairs) => { for (const [a, b] of pairs) s = s.split(a).join(b); return s; };
const PAL = [['#B3121F', '#A30D22'], ['#8E0E18', '#6E0717'], ['#C9202D', '#B01C31'], ['#E0343F', '#E0334A'], ['#F08A8F', '#E89AA3'], ['#D9737A', '#D06A73'], ['#0d1520', '#111214'], ['#24324a', '#30343A'], ['#4f5d74', '#5F646C'],
  ['#F6F7F9', '#F7F7F4'], ['#f4f5f7', '#F7F7F4'], ['#15181C', '#16181B'], ['#2B2F34', '#30343A'], ['#DADEE4', '#D8DADF'], ['#FDECEE', '#F8E7E9'], ['#FDF3F4', '#FAF0F1'], ['#F4C7CB', '#EBC3C8'], ['#F6E9EA', '#F5E6E8'], ['#F4E6E7', '#F5E6E8']];
let h = rd('index.html');
h = sw(h, PAL);
h = h.replace(/--display: "Archivo", "Arial Narrow", system-ui, sans-serif;/, '--display: "Inter", Helvetica, Arial, sans-serif;').replace(/--sans: "IBM Plex Sans", system-ui, -apple-system, "Segoe UI", sans-serif;/, '--sans: "Inter", Helvetica, Arial, sans-serif;');
h = h.replace(/font-stretch: 8\d%;/g, 'font-stretch: 100%;').replace(/letter-spacing: -\.01em; margin: 0; color: var\(--ink\); text-wrap: balance; \}/, 'letter-spacing: -.02em; margin: 0; color: var(--ink); text-wrap: balance; }');
h = h.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Archivo[^"]+" rel="stylesheet">/, '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">');
h = h.replace(/<link rel="icon" href="\/favicon\.ico" sizes="any">\n<link rel="icon" type="image\/svg\+xml" href="\/brand\/3fs-mark\.svg">/, '<link rel="icon" href="/favicon.ico" sizes="any">\n<link rel="icon" type="image/svg+xml" href="/favicon.svg">');
h = h.replace(/<meta name="theme-color" content="#B3121F">/, '<meta name="theme-color" content="#A30D22">');
// brand: "3FS" wordmark like the parent + link back
h = h.replace(/<span><b>Rural Home<\/b><span class="bsub">USDA home loans, made simple<\/span><\/span>/, '<span><b>3FS <span style="color:var(--field)">Rural Home</span></b><span class="bsub">USDA home loans, made simple · <a href="https://3fs.app/" style="color:inherit">3fs.app</a></span></span>');
h = h.replace(/\.brand b \{ font: 800 17px\/1 var\(--display\); font-stretch: 88%; letter-spacing: \.04em; \}/, '.brand b { font: 700 17px/1 var(--display); letter-spacing: .02em; }');
h = h.replace(/\.nav a \{ text-decoration: none; color: var\(--ink2\); font-weight: 600; font-size: 14px;/, '.nav a { text-decoration: none; color: var(--ink2); font: 500 .7rem/1 var(--mono); letter-spacing: .14em; text-transform: uppercase;');
h = h.replace(/\.band \{ background: #A30D22; color: #fff; \}/, '.band { background: #111214; color: #F2F2EF; }').replace(/\.band i \{[^}]*\}/, '.band i { width: 7px; height: 7px; border-radius: 50%; background: #E0334A; box-shadow: 0 0 10px #E0334A; }');
h = h.replace(/\.glass \{ background: var\(--glass\);/, '.glass { background: #FFFFFF;').replace(/--glass: rgba\(255, 255, 255, \.62\);/, '--glass: #FFFFFF;').replace(/--edge: rgba\(255, 255, 255, \.95\);/, '--edge: #D8DADF;').replace(/--r: 18px;/, '--r: 10px;');
h = h.replace(/\.blob \{ position: absolute;/, '.blob { display: none; position: absolute;');
h = h.replace(/border-radius: 1[1-6]px/g, 'border-radius: 6px').replace(/border-radius: 999px/g, 'border-radius: 4px');
h = h.replace('<span style="display:inline-flex;align-items:center;gap:8px"><img src="/brand/3fs-mark.svg" alt="" width="22" height="22"><b>3fs</b> · technology provider · a UnyKorn system</span>', '<span style="display:inline-flex;align-items:center;gap:8px"><img src="/brand/3fs-mark.svg" alt="" width="22" height="22"><b>3FS</b> · <a href="https://3fs.app/">3fs.app</a> · a UnyKorn LLC system</span>');
wr('index.html', h);
let a = sw(rd('app.js'), PAL); wr('app.js', a);
let c = sw(rd('legal.css'), PAL);
c = c.replace(/font: 16px\/1\.65 "IBM Plex Sans", system-ui, -apple-system, "Segoe UI", sans-serif;/, 'font: 16px/1.65 Inter, Helvetica, Arial, sans-serif;').replace(/"Archivo", "Arial Narrow", sans-serif/g, 'Inter, Helvetica, Arial, sans-serif').replace(/font-stretch: 8\d%;/g, '').replace(/border-radius: 18px/g, 'border-radius: 10px').replace(/background: linear-gradient\(180deg, #ffffff, #f4f5f7\) fixed;/, 'background: #F7F7F4;');
wr('legal.css', c);
for (const f of ['terms.html', 'privacy.html', 'about.html', '404.html']) {
  let s = sw(rd(f), PAL).replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Archivo[^"]+" rel="stylesheet">/, '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">');
  s = s.replace(/<a class="brand" href="\/"><img class="mark" src="\/brand\/3fs-mark\.svg" alt="" width="34" height="34">Rural Home<\/a>/, '<a class="brand" href="/"><img class="mark" src="/brand/3fs-mark.svg" alt="" width="34" height="34">3FS Rural Home</a>');
  wr(f, s);
}
console.log('aligned');
