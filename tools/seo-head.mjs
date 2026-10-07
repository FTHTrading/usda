// Rewrites the <head> of public/index.html with full SEO / GEO tags and structured data.
import fs from 'fs';
const p = (process.argv[2] || 'C:/Users/Kevan/workers/usda-3fs/public') + '/index.html';
let h = fs.readFileSync(p, 'utf8');
const i = h.indexOf('<head>'), j = h.indexOf('<style>');
if (i < 0 || j < 0) { console.log('anchors missing'); process.exit(1); }

const ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%231f8a55'/%3E%3Ctext x='32' y='41' font-family='Arial' font-weight='800' font-size='22' fill='white' text-anchor='middle'%3E3FS%3C/text%3E%3C/svg%3E";
const title = 'USDA Rural Home Loan Eligibility Check: Income Limits by ZIP (FY2026) | 3FS Rural Home';
const desc = 'Free USDA home loan check. Enter a ZIP or city and household size to see FY2026 USDA Direct and Guaranteed income limits, rural eligibility and nearby places you qualify. Not USDA; USDA or an approved lender decides.';

const org = { '@context': 'https://schema.org', '@type': 'Organization', '@id': 'https://usda.3fs.app/#org', name: '3FS Rural Home', legalName: 'UnyKorn LLC', url: 'https://usda.3fs.app/', logo: 'https://usda.3fs.app/icon-512.png', email: 'kevan@unykorn.org', address: { '@type': 'PostalAddress', streetAddress: '5655 Peachtree Pkwy NW', addressLocality: 'Norcross', addressRegion: 'GA', postalCode: '30099', addressCountry: 'US' }, areaServed: 'US', sameAs: ['https://3fs.app/', 'https://unykorn.ai/'] };
const app = { '@context': 'https://schema.org', '@type': 'WebApplication', '@id': 'https://usda.3fs.app/#app', name: '3FS Rural Home', url: 'https://usda.3fs.app/', applicationCategory: 'FinanceApplication', operatingSystem: 'Web', description: desc, publisher: { '@id': 'https://usda.3fs.app/#org' }, offers: [{ '@type': 'Offer', name: 'Families', price: '0', priceCurrency: 'USD' }, { '@type': 'Offer', name: 'Pro for builders, realtors, lenders and nonprofits', price: '49', priceCurrency: 'USD', billingIncrement: 'P1M' }], featureList: ['FY2026 USDA income limits for every US county', 'Direct and Guaranteed loan check by ZIP, city or county', 'Map of places where a household qualifies', 'Opportunity Zone counts', 'AI guide that cites the source page', 'MCP connection for Claude Code and AI agents'], isAccessibleForFree: true };
const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: 'What is a USDA rural home loan?', acceptedAnswer: { '@type': 'Answer', text: 'A USDA Single Family Housing loan helps people buy, build or repair a home in an eligible rural area, often with no down payment. There are two main kinds: a Direct loan, where USDA lends to the household itself, and a Guaranteed loan, where an approved private lender makes the loan and USDA backs it.' } },
  { '@type': 'Question', name: 'What is the USDA income limit for my county?', acceptedAnswer: { '@type': 'Answer', text: 'Limits are set by USDA for each county or metro area and household size, and updated every year. 3FS Rural Home shows the FY2026 Direct (low-income) and Guaranteed (moderate-income) limits for any ZIP, city or county, with the page of the USDA table each number comes from.' } },
  { '@type': 'Question', name: 'Do I qualify for a USDA loan?', acceptedAnswer: { '@type': 'Answer', text: 'You generally need adjusted household income under the limit for your area, a home in a USDA-eligible rural area, and acceptable credit. 3FS checks the income limit and area type in seconds. USDA or an approved lender makes the final decision.' } },
  { '@type': 'Question', name: 'Is 3FS Rural Home part of USDA?', acceptedAnswer: { '@type': 'Answer', text: 'No. 3FS Rural Home is a free technology service run by UnyKorn LLC. It is not affiliated with USDA and is not a lender or broker. It uses USDA\'s published tables and shows the source for every number.' } },
  { '@type': 'Question', name: 'How much does 3FS Rural Home cost?', acceptedAnswer: { '@type': 'Answer', text: 'It is free for families and homebuyers. Builders, realtors, lenders and nonprofits can get Pro for $49 a month with bulk checks and an API key. AI agents pay $0.02 per check.' } }
] };

const head = `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="https://usda.3fs.app/">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="keywords" content="USDA home loan, USDA loan eligibility, USDA income limits 2026, rural development loan, USDA guaranteed loan, USDA direct loan, zero down home loan, rural home loan map, first time home buyer rural">
<link rel="icon" href="${ICON}">
<link rel="apple-touch-icon" href="/icon-512.png">
<meta name="theme-color" content="#1f8a55">
<meta property="og:type" content="website">
<meta property="og:site_name" content="3FS Rural Home">
<meta property="og:title" content="USDA Rural Home Loan Check: Income Limits by ZIP (FY2026)">
<meta property="og:description" content="Free. Enter a ZIP and household size to see where you qualify for a USDA home loan, with the source page for every number.">
<meta property="og:url" content="https://usda.3fs.app/">
<meta property="og:image" content="https://usda.3fs.app/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="USDA Rural Home Loan Check: Income Limits by ZIP (FY2026)">
<meta name="twitter:description" content="Free. See where you qualify for a USDA home loan, with the source for every number.">
<meta name="twitter:image" content="https://usda.3fs.app/og.png">
<link rel="alternate" type="application/rss+xml" title="3FS Rural Home blog" href="/blog/feed.xml">
<script type="application/ld+json">${JSON.stringify(org)}</script>
<script type="application/ld+json">${JSON.stringify(app)}</script>
<script type="application/ld+json">${JSON.stringify(faq)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
`;
h = h.slice(0, i) + head + h.slice(j);
// visible H1 for search engines (the find page has no h1 yet)
h = h.replace('<p class="eyebrow">Start here · who are you?</p>', '<h1 class="sr-only">USDA rural home loan eligibility check: FY2026 income limits by ZIP, city or county</h1>\n      <p class="eyebrow">Start here · who are you?</p>');
// blog link in nav + footer
if (!h.includes('href="/blog/"')) {
  h = h.replace('<a href="#pricing" data-route="pricing">Pricing</a>', '<a href="#pricing" data-route="pricing">Pricing</a>\n    <a href="/blog/">Blog</a>');
  h = h.replace('<span><a href="/about">About</a> · <a href="/terms">Terms</a>', '<span><a href="/blog/">Blog</a> · <a href="/about">About</a> · <a href="/terms">Terms</a>');
}
fs.writeFileSync(p, h);
console.log('head rewritten', h.includes('application/ld+json'), h.includes('/blog/'));
