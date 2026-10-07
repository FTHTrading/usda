// Script to configure Cloudflare CNAME DNS record for custom domain
const zoneId = process.env.CLOUDFLARE_ZONE_ID || '5ccda72733f867c8474434e921fc096e';
const token = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN;

async function fixDns() {
  if (!token) {
    console.log('Skipping DNS fix: CLOUDFLARE_API_TOKEN environment variable not set.');
    return;
  }

  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'CNAME',
      name: 'usda.3fs.app',
      content: 'usda-3fs.pages.dev',
      ttl: 1,
      proxied: true,
      comment: 'Managed by 3FS Automation for USDA Rural OS Pages project'
    })
  });

  const data = await res.json();
  console.log('DNS Record result:', JSON.stringify(data, null, 2));
}

fixDns().catch(console.error);
