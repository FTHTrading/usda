#!/usr/bin/env python3
"""Builds /blog/ pages, feed.xml, sitemap.xml and llms.txt into the public folder.
Usage: python3 build-blog.py <public_dir>
Articles live in posts/*.md (front matter: title, slug, date, description, keywords, question)."""
import sys, os, re, json, html, datetime, glob

PUB = sys.argv[1] if len(sys.argv) > 1 else 'public'
SITE = 'https://usda.3fs.app'
HERE = os.path.dirname(os.path.abspath(__file__))
POSTS = os.path.join(HERE, 'posts')

CSS = '/legal.css'
HEAD = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-image-preview:large">
{keywords}
<meta property="og:type" content="{ogtype}">
<meta property="og:site_name" content="3FS Rural Home">
<meta property="og:title" content="{ogtitle}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{site}/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="alternate" type="application/rss+xml" title="3FS Rural Home blog" href="/blog/feed.xml">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{css}">
<style>
.posts {{ list-style: none; padding: 0; margin: 20px 0 0; display: grid; gap: 14px; }}
.posts li {{ padding: 16px 18px; border-radius: 14px; background: rgba(255,255,255,.7); border: 1px solid #fff; }}
.posts a {{ font: 800 20px/1.25 Inter, Helvetica, Arial, sans-serif;  text-decoration: none; color: var(--ink); }}
.posts p {{ margin: 6px 0 0; font-size: 15px; }}
.posts time {{ font-size: 13px; color: var(--muted); }}
.cta {{ display: inline-block; margin-top: 8px; padding: 10px 16px; border-radius: 11px; background: var(--field); color: #fff; font-weight: 700; text-decoration: none; }}
.note {{ font-size: 14px; color: var(--muted); border-top: 1px solid var(--line); padding-top: 14px; margin-top: 28px; }}
table {{ border-collapse: collapse; width: 100%; font-size: 15px; margin: 10px 0 18px; }}
th, td {{ text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--line); font-variant-numeric: tabular-nums; }}
th {{ font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }}
.tbl {{ overflow-x: auto; }}
article h2 {{ margin-top: 30px; }}
article p, article li {{ font-size: 16.5px; }}
blockquote {{ margin: 16px 0; padding: 12px 16px; border-left: 4px solid var(--field); background: #FAF0F1; border-radius: 10px; color: var(--ink2); }}
</style>
{ld}
</head>
<body>
<header>
  <a class="brand" href="/"><img class="mark" src="/brand/3fs-mark.svg" alt="" width="34" height="34">3FS Rural Home</a>
  <nav><a href="/">Check a place</a><a href="/blog/">Blog</a><a href="/about">About</a></nav>
</header>
<main>
'''
FOOT = '''
</main>
<footer>3FS Rural Home · a UnyKorn LLC technology service · Not affiliated with USDA · USDA or an approved lender makes every loan decision · <a href="/about">About</a> · <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a></footer>
</body>
</html>
'''

def md(text):
    """Small markdown: headings, paragraphs, lists, bold, links, tables, blockquotes."""
    out, lines = [], text.strip().split('\n')
    i = 0
    def inline(s):
        s = html.escape(s, quote=False)
        s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
        s = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', s)
        return s
    while i < len(lines):
        l = lines[i]
        if not l.strip(): i += 1; continue
        if l.startswith('## '): out.append('<h2>' + inline(l[3:]) + '</h2>'); i += 1; continue
        if l.startswith('> '): out.append('<blockquote>' + inline(l[2:]) + '</blockquote>'); i += 1; continue
        if l.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                rows.append([c.strip() for c in lines[i].strip('|').split('|')]); i += 1
            rows = [r for r in rows if not all(re.fullmatch(r'-+', c) for c in r)]
            t = '<div class="tbl"><table><thead><tr>' + ''.join('<th>' + inline(c) + '</th>' for c in rows[0]) + '</tr></thead><tbody>'
            t += ''.join('<tr>' + ''.join('<td>' + inline(c) + '</td>' for c in r) + '</tr>' for r in rows[1:]) + '</tbody></table></div>'
            out.append(t); continue
        if l.startswith('- '):
            items = []
            while i < len(lines) and lines[i].startswith('- '): items.append('<li>' + inline(lines[i][2:]) + '</li>'); i += 1
            out.append('<ul>' + ''.join(items) + '</ul>'); continue
        if re.match(r'^\d+\. ', l):
            items = []
            while i < len(lines) and re.match(r'^\d+\. ', lines[i]): items.append('<li>' + inline(re.sub(r'^\d+\. ', '', lines[i])) + '</li>'); i += 1
            out.append('<ol>' + ''.join(items) + '</ol>'); continue
        para = []
        while i < len(lines) and lines[i].strip() and not re.match(r'^(## |> |\||- |\d+\. )', lines[i]): para.append(lines[i]); i += 1
        out.append('<p>' + inline(' '.join(para)) + '</p>')
    return '\n'.join(out)

def parse(path):
    raw = open(path, encoding='utf-8').read()
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', raw, re.S)
    meta = dict(re.findall(r'^(\w+):\s*(.*)$', m.group(1), re.M))
    return meta, m.group(2)

posts = []
for f in sorted(glob.glob(os.path.join(POSTS, '*.md'))):
    meta, body = parse(f); meta['body'] = body; posts.append(meta)
posts.sort(key=lambda p: p['date'], reverse=True)

os.makedirs(os.path.join(PUB, 'blog'), exist_ok=True)
for p in posts:
    url = f"{SITE}/blog/{p['slug']}/"
    os.makedirs(os.path.join(PUB, 'blog', p['slug']), exist_ok=True)
    ld = {'@context': 'https://schema.org', '@type': 'Article', 'headline': p['title'], 'description': p['description'], 'datePublished': p['date'], 'dateModified': p['date'], 'mainEntityOfPage': url, 'image': f'{SITE}/og.png',
          'author': {'@type': 'Organization', 'name': '3FS Rural Home', 'url': SITE + '/about'}, 'publisher': {'@type': 'Organization', 'name': 'UnyKorn LLC', 'logo': {'@type': 'ImageObject', 'url': f'{SITE}/brand/3fs-mark-512.png'}},
          'isBasedOn': 'https://www.rd.usda.gov/programs-services/single-family-housing-programs', 'keywords': p.get('keywords', '')}
    lds = '<script type="application/ld+json">' + json.dumps(ld) + '</script>'
    if p.get('question'):
        faq = {'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': p['question'], 'acceptedAnswer': {'@type': 'Answer', 'text': p['description']}}]}
        lds += '<script type="application/ld+json">' + json.dumps(faq) + '</script>'
    crumbs = {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE + '/'}, {'@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': SITE + '/blog/'}, {'@type': 'ListItem', 'position': 3, 'name': p['title'], 'item': url}]}
    lds += '<script type="application/ld+json">' + json.dumps(crumbs) + '</script>'
    date_h = datetime.date.fromisoformat(p['date']).strftime('%B %d, %Y').replace(' 0', ' ')
    body = f'<article><p class="meta"><a href="/blog/">Blog</a> · <time datetime="{p["date"]}">{date_h}</time></p>\n<h1>{html.escape(p["title"])}</h1>\n<p class="meta">{html.escape(p["description"])}</p>\n' + md(p['body']) + \
        f'\n<p><a class="cta" href="/">Check your place free</a></p>\n<p class="note">3FS Rural Home is a technology service by UnyKorn LLC. It is not USDA, not a lender and not a broker. Income limits come from USDA\'s FY2026 table (HB-1-3550 Appendix 9, PN 657, 07/13/2026) and can change. USDA or an approved lender makes every loan decision. This is general information, not financial or legal advice.</p></article>'
    page = HEAD.format(title=html.escape(p['title']) + ' | 3FS Rural Home', desc=html.escape(p['description'], quote=True), url=url, ogtype='article', ogtitle=html.escape(p['title'], quote=True), site=SITE, css=CSS, ld=lds,
                       keywords=f'<meta name="keywords" content="{html.escape(p.get("keywords", ""), quote=True)}">') + body + FOOT
    open(os.path.join(PUB, 'blog', p['slug'], 'index.html'), 'w', encoding='utf-8').write(page)

# index
items = ''.join(f'<li><a href="/blog/{p["slug"]}/">{html.escape(p["title"])}</a><p>{html.escape(p["description"])}</p><time datetime="{p["date"]}">{datetime.date.fromisoformat(p["date"]).strftime("%B %d, %Y").replace(" 0", " ")}</time></li>' for p in posts)
blog_ld = {'@context': 'https://schema.org', '@type': 'Blog', 'name': '3FS Rural Home blog', 'url': SITE + '/blog/', 'description': 'Plain-English guides to USDA rural home loans: who qualifies, income limits, how to apply, and how to build in rural areas.', 'publisher': {'@type': 'Organization', 'name': 'UnyKorn LLC'}}
idx = HEAD.format(title='USDA Rural Home Loan Guides | 3FS Rural Home Blog', desc='Plain-English guides to USDA rural home loans: who qualifies, the FY2026 income limits, Direct vs Guaranteed, how to apply with no down payment, and how builders use USDA areas.', url=SITE + '/blog/', ogtype='website', ogtitle='USDA Rural Home Loan Guides', site=SITE, css=CSS,
                  ld='<script type="application/ld+json">' + json.dumps(blog_ld) + '</script>', keywords='<meta name="keywords" content="USDA loan guide, USDA income limits 2026, USDA direct vs guaranteed, zero down payment home loan, rural home buying">') + \
    '<h1>USDA rural home loans, explained</h1><p class="meta">Short guides with real numbers from USDA\'s own tables. Free to read, free to use.</p><ul class="posts">' + items + '</ul>' + FOOT
open(os.path.join(PUB, 'blog', 'index.html'), 'w', encoding='utf-8').write(idx)

# feed
def rfc(d): return datetime.datetime.fromisoformat(d).strftime('%a, %d %b %Y 09:00:00 GMT')
feed = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>3FS Rural Home blog</title><link>' + SITE + '/blog/</link><description>Plain-English guides to USDA rural home loans.</description>' + \
    ''.join(f'<item><title>{html.escape(p["title"])}</title><link>{SITE}/blog/{p["slug"]}/</link><guid>{SITE}/blog/{p["slug"]}/</guid><pubDate>{rfc(p["date"])}</pubDate><description>{html.escape(p["description"])}</description></item>' for p in posts) + '</channel></rss>'
open(os.path.join(PUB, 'blog', 'feed.xml'), 'w', encoding='utf-8').write(feed)

# sitemap
today = datetime.date.today().isoformat()
urls = [(SITE + '/', '1.0', today), (SITE + '/blog/', '0.8', today), (SITE + '/about', '0.6', today), (SITE + '/terms', '0.3', today), (SITE + '/privacy', '0.3', today)] + [(f'{SITE}/blog/{p["slug"]}/', '0.7', p['date']) for p in posts]
sm = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join(f'<url><loc>{u}</loc><lastmod>{d}</lastmod><priority>{pr}</priority></url>' for u, pr, d in urls) + '</urlset>'
open(os.path.join(PUB, 'sitemap.xml'), 'w').write(sm)
open(os.path.join(PUB, 'robots.txt'), 'w').write('User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ' + SITE + '/sitemap.xml\n')

# llms.txt (for AI crawlers / answer engines)
llms = f'''# 3FS Rural Home

> Free USDA rural home loan check at {SITE}. Enter a ZIP, city or county and household size to see the FY2026 USDA Direct (low-income) and Guaranteed (moderate-income) limits, whether the area is rural, Opportunity Zone counts, and nearby places where the household qualifies. Every number cites its page in USDA Handbook HB-1-3550 Appendix 9 (PN 657, 07/13/2026).

Operated by UnyKorn LLC (Norcross, Georgia). Not affiliated with USDA. Not a lender or broker. USDA Rural Development or an approved lender makes every loan decision.

## Key facts
- Direct loan: USDA lends to the household; uses the low-income limit; apply through the local USDA Rural Development office, often via a certified packager.
- Guaranteed loan: an approved lender lends and USDA backs it; uses the moderate-income limit; no down payment required.
- 2,065 of 2,724 USDA income areas use the same FY2026 4-person Guaranteed limit of $122,800 (the national floor); limits rise for 5-8 people and in higher-cost metros.
- Families use the site free. Pro for professionals is $49/month. AI agents pay $0.02 per check over x402 (USDC on Base).

## For AI agents
- MCP server (Streamable HTTP): {SITE}/mcp  (tools: check_zip, where_qualify, opportunity_zones, program_info)
- Paid API: GET {SITE}/api/check?zip=30513&people=4&income=68000  (x402, $0.02 USDC)
- Health: {SITE}/api/health

## Pages
- [Check a place]({SITE}/)
- [About and disclosures]({SITE}/about)
- [Blog]({SITE}/blog/)
''' + ''.join(f'- [{p["title"]}]({SITE}/blog/{p["slug"]}/): {p["description"]}\n' for p in posts)
open(os.path.join(PUB, 'llms.txt'), 'w', encoding='utf-8').write(llms)
print('built', len(posts), 'posts')
