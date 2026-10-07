# 3FS Rural Home — launch checklist (Oct 7, 2026)

## Verified live (all passed)
- Home, Pricing, My file, How it works, Proof: 200, structured data (Organization, WebApplication, FAQ), canonical, H1
- /about, /terms, /privacy: 200
- /blog/ + 6 articles + feed.xml: 200, Article/FAQ/Breadcrumb structured data on each
- /sitemap.xml, /robots.txt (with Sitemap line), /llms.txt: 200
- /og.png, /icon-512.png: 200 (social share card)
- Unknown URL -> real 404 page
- data.js served Brotli-compressed
- AI guide: answering; MCP: 4 tools; Pro key check: 401 for bad key
- Stripe: Pro checkout 200; webhook secret set (pro_billing: true)
- x402: Base mainnet, pay-to 0xFCc1…3cb3, Coinbase CDP sign-in 200

## You do (10 minutes)
1. Google Search Console: https://search.google.com/search-console → Add property → URL prefix → https://usda.3fs.app/
   → verify with "HTML tag" (send me the tag and I'll add it) or DNS TXT on 3fs.app in Cloudflare
   → Sitemaps → submit https://usda.3fs.app/sitemap.xml
   → URL inspection → request indexing for / and /blog/
2. Bing Webmaster Tools: https://www.bing.com/webmasters → Import from Google Search Console (one click after step 1)
3. Google Business Profile (optional, helps local trust): UnyKorn LLC, 5655 Peachtree Pkwy NW, Norcross GA 30099
4. Lawyer: one-time read of /terms (mortgage-licensing + fair housing wording)
5. Send the real 3FS logo file to replace the placeholder badge

## Publishing new blog posts
- Add a markdown file to tools/posts/ (copy the front matter from an existing one)
- Run: python tools/build-blog.py public   (rebuilds blog, feed, sitemap, llms.txt)
- Deploy: npx wrangler pages deploy --project-name usda-3fs --branch main
