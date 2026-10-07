// Re-themes index.html + legal.css + blog pages to white/crimson and swaps the placeholder badge for the real 3FS mark.
import fs from 'fs';
const PUB = process.argv[2];
const rd = f => fs.readFileSync(PUB + '/' + f, 'utf8'), wr = (f, s) => fs.writeFileSync(PUB + '/' + f, s);
const MARK = '<img class="mark" src="/brand/3fs-mark.svg" alt="" width="36" height="36">';
const MARK_SM = '<img class="mark" src="/brand/3fs-mark.svg" alt="" width="32" height="32">';

// ---- index.html
let h = rd('index.html');
h = h.replace(/--field: #1f8a55;/, '--field: #B3121F;').replace(/--field2: #8fd9a8;/, '--field2: #F08A8F;').replace(/--volt: #2369e8;/, '--volt: #2B3A55;').replace(/--volt2: #7cc8ff;/, '--volt2: #B9C2D6;')
 .replace(/--gold: #c98a12;/, '--gold: #B8860B;').replace(/--bg: #edf2f7;/, '--bg: #F6F7F9;');
h = h.replace(/\.field-bg \{ position: fixed; inset: 0; z-index: -1; overflow: hidden; background: linear-gradient\(180deg, #e6eef7, #f6f8fb\); \}/, '.field-bg { position: fixed; inset: 0; z-index: -1; overflow: hidden; background: linear-gradient(180deg, #ffffff, #f4f5f7); }');
h = h.replace(/\.b1 \{[^}]*\}/, '.b1 { width: 620px; height: 620px; left: -160px; top: -160px; background: #f3d6d9; }')
     .replace(/\.b2 \{[^}]*\}/, '.b2 { width: 540px; height: 540px; right: -160px; top: 25%; background: #e3e6ea; animation-delay: -9s; }')
     .replace(/\.b3 \{[^}]*\}/, '.b3 { width: 460px; height: 460px; left: 35%; bottom: -240px; background: #f6e2e4; opacity: .6; animation-delay: -15s; }');
h = h.replace(/\.mark \{[^}]*\}/, '.mark { width: 36px; height: 36px; display: block; filter: drop-shadow(0 6px 10px rgba(179,18,31,.25)); }');
h = h.replace(/\.btn\.primary \{[^}]*\}/, '.btn.primary { background: linear-gradient(180deg, #C9202D, #B3121F); color: #fff; border-color: #8E0E18; box-shadow: 0 10px 20px -10px rgba(179,18,31,.7); }');
h = h.replace(/\.band \{([^}]*)\}/, '.band {$1}\n.band { background: #B3121F; color: #fff; }');
h = h.replace(/\.band i \{[^}]*\}/, '.band i { width: 7px; height: 7px; border-radius: 50%; background: #fff; box-shadow: 0 0 10px #fff; }');
h = h.replace(/\.askbtn \{([^}]*)background: linear-gradient\(180deg, #213149, #0d1520\);([^}]*)\}/, '.askbtn {$1background: linear-gradient(180deg, #2B2F34, #15181C);$2}');
h = h.replace(/\.askbtn \.spark \{[^}]*\}/, '.askbtn .spark { width: 8px; height: 8px; border-radius: 50%; background: #F08A8F; box-shadow: 0 0 10px #F08A8F; }');
h = h.replace(/\.nav a\.active::after \{([^}]*)background: linear-gradient\(90deg, var\(--field\), var\(--volt2\)\);/, '.nav a.active::after {$1background: linear-gradient(90deg, #B3121F, #F08A8F);');
h = h.replace(/\.role\[aria-pressed="true"\] \.ri \{[^}]*\}/, '.role[aria-pressed="true"] .ri { background: linear-gradient(135deg, #B3121F, #E0343F); color: #fff; border-color: transparent; }');
h = h.replace(/\.vd \.ico\.yes \{[^}]*\}/, '.vd .ico.yes { background: radial-gradient(circle at 35% 30%, #F08A8F, #B3121F); box-shadow: 0 0 12px rgba(179,18,31,.4); }');
h = h.replace(/\.sm-node\.done \.sm-dot \{[^}]*\}/, '.sm-node.done .sm-dot { background: radial-gradient(circle at 35% 30%, #fff, #F08A8F 45%, #B3121F); box-shadow: 0 0 14px rgba(179,18,31,.45); }');
h = h.replace(/\.sm-wire\.done \{[^}]*\}/, '.sm-wire.done { background: linear-gradient(90deg, #B3121F, #F08A8F); }');
h = h.replace(/\.plan\.hot \{[^}]*\}/, '.plan.hot { box-shadow: 0 0 0 2px #B3121F, var(--shadow-lg); }');
h = h.replace(/\.drop \{([^}]*)border: 1\.5px dashed rgba\(31,138,85,\.5\);/, '.drop {$1border: 1.5px dashed rgba(179,18,31,.45);');
h = h.replace(/\.mode-note \{([^}]*)border-left: 4px solid var\(--field\);/, '.mode-note {$1border-left: 4px solid #B3121F;');
h = h.replace(/\.keybox \{([^}]*)background: #0f1a29; color: #d7f5e4;/, '.keybox {$1background: #15181C; color: #FFE3E5;');
h = h.replace(/pre\.code \{([^}]*)background: #0f1a29;/, 'pre.code {$1background: #15181C;');
h = h.replace(/\.agent\.done \{[^}]*\}/, '.agent.done { color: #8E0E18; background: #FDECEE; border-color: #F4C7CB; }').replace(/\.agent\.done i \{[^}]*\}/, '.agent.done i { background: #B3121F; }');
h = h.replace(/\.who\.ai \{[^}]*\}/, '.who.ai { background: #FDECEE; color: #8E0E18; }');
h = h.replace(/\.status\.live \{[^}]*\}/, '.status.live { background: #FDECEE; color: #8E0E18; }');
h = h.replace(/\.hs li\.done::before \{[^}]*\}/, '.hs li.done::before { content: "✓"; color: #fff; background: linear-gradient(135deg, #B3121F, #E0343F); border-color: transparent; box-shadow: 0 0 12px rgba(179,18,31,.5); }');
h = h.replace(/\.hs li\.done::after \{[^}]*\}/, '.hs li.done::after { background: linear-gradient(180deg, #B3121F, #F08A8F); }');
// where-qualify map colors are set in app.js; header mark + guide mark
h = h.replace('<span class="mark" aria-hidden="true">3FS</span>\n    <span><b>Rural Home</b>', MARK + '\n    <span><b>Rural Home</b>');
h = h.replace(/<span class="mark" aria-hidden="true">3FS<\/span>/g, MARK_SM);
h = h.replace(/<meta name="theme-color" content="#1f8a55">/, '<meta name="theme-color" content="#B3121F">\n<link rel="manifest" href="/manifest.webmanifest">\n<link rel="icon" type="image/svg+xml" href="/brand/3fs-mark.svg">');
h = h.replace(/<link rel="icon" href="data:image\/svg\+xml[^>]*>\n?/, '<link rel="icon" href="/favicon.ico" sizes="any">\n');
h = h.replace('<link rel="apple-touch-icon" href="/icon-512.png">', '<link rel="apple-touch-icon" href="/apple-touch-icon.png">');
h = h.replace(/"logo": ?"https:\/\/usda\.3fs\.app\/icon-512\.png"/g, '"logo":"https://usda.3fs.app/brand/3fs-mark-512.png"');
// hero: animated render in the How-it-works header + brand strip at footer
h = h.replace('<h1 id="h-net">One guide, many agents, one record.</h1>', '<h1 id="h-net">One guide, many agents, one record.</h1>');
h = h.replace(/<footer class="foot">\n  <span><b>3FS<\/b> · technology provider · a UnyKorn system<\/span>/, '<footer class="foot">\n  <span style="display:inline-flex;align-items:center;gap:8px"><img src="/brand/3fs-mark.svg" alt="" width="22" height="22"><b>3fs</b> · technology provider · a UnyKorn system</span>');
// hero video card on the Find page under the roles? keep Find clean; put the render on How it works info card top
h = h.replace('<article class="glass card" id="netInfo"></article>', '<article class="glass card" style="padding:0;overflow:hidden;margin-bottom:14px;background:#fff"><video src="/brand/3fs-hero.mp4" poster="/brand/3fs-hero-poster.jpg" autoplay muted loop playsinline style="display:block;width:100%;height:auto" aria-label="The 3FS mark assembling"></video></article>\n        <article class="glass card" id="netInfo"></article>');
wr('index.html', h);

// ---- app.js: map colors (green -> crimson family)
let a = rd('app.js');
a = a.replace(/'#1f8a55'/g, "'#B3121F'").replace(/'#8fd3aa'/g, "'#F08A8F'").replace(/'#58b97f'/g, "'#D9737A'").replace(/'#4d9df2'/g, "'#5B6B8C'").replace(/'#bfe0ff'/g, "'#C9D0DE'").replace(/COL\.limits = d3\.scaleSequential\(d3\.interpolateRgb\('#e2edf9', '#1a4aa8'\)\)/, "COL.limits = d3.scaleSequential(d3.interpolateRgb('#F4E6E7', '#8E0E18'))");
a = a.replace(/sw: 'linear-gradient\(90deg,#e2edf9,#1a4aa8\)'/, "sw: 'linear-gradient(90deg,#F4E6E7,#8E0E18)'").replace(/sw: '#58b97f'/, "sw: '#D9737A'").replace(/sw: '#1f8a55'/, "sw: '#B3121F'");
a = a.replace(/background:linear-gradient\(90deg,#e2edf9,#1a4aa8\)/g, 'background:linear-gradient(90deg,#F4E6E7,#8E0E18)').replace(/<i style="background:#58b97f"><\/i>/g, '<i style="background:#D9737A"></i>').replace(/<i style="background:#1f8a55"><\/i>/g, '<i style="background:#B3121F"></i>').replace(/<i style="background:#4d9df2"><\/i>/g, '<i style="background:#5B6B8C"></i>');
a = a.replace(/c: '#1f8a55', label: '3FS Guide'/, "c: '#B3121F', label: '3FS Guide'").replace(/c: '#2369e8', label:/g, "c: '#2B3A55', label:").replace(/c: '#c98a12', label: 'AI agents'/, "c: '#B8860B', label: 'AI agents'");
a = a.replace(/stop-color="#1f8a55"/g, 'stop-color="#B3121F"').replace(/stop-color="#2369e8"/g, 'stop-color="#2B3A55"');
wr('app.js', a);

// ---- legal.css + legal/blog pages
let c = rd('legal.css');
c = c.replace('--field:#1f8a55; --volt:#2369e8; --bg:#edf2f7;', '--field:#B3121F; --volt:#8E0E18; --bg:#F6F7F9;').replace(/background: linear-gradient\(180deg, #e6eef7, #f6f8fb\) fixed;/, 'background: linear-gradient(180deg, #ffffff, #f4f5f7) fixed;')
 .replace(/\.mark \{[^}]*\}/, '.mark { width: 34px; height: 34px; display: block; }').replace(/\.box \{([^}]*)background: #f3faf6;/, '.box {$1background: #FDF3F4;');
wr('legal.css', c);
for (const f of ['terms.html', 'privacy.html', 'about.html', '404.html']) {
  let s = rd(f).replace(/<span class="mark">3FS<\/span>/g, '<img class="mark" src="/brand/3fs-mark.svg" alt="" width="34" height="34">').replace(/<link rel="icon" href="\/icon-512\.png">/, '<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/svg+xml" href="/brand/3fs-mark.svg">');
  wr(f, s);
}
console.log('rebranded');
