// Script to check Cloudflare Pages custom domains status
const token = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '07bcc4a189ef176261b818409c95891f';

async function main() {
  if (!token) {
    console.log('Skipping API check: CLOUDFLARE_API_TOKEN environment variable not set.');
    return;
  }

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/usda-3fs/domains`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  console.log('Pages custom domains status:', JSON.stringify(data.result, null, 2));

  // Check https response
  try {
    const f1 = await fetch('https://usda-3fs.pages.dev');
    console.log('usda-3fs.pages.dev status:', f1.status);
  } catch (e) {
    console.log('usda-3fs.pages.dev fetch error:', e.message);
  }

  try {
    const f2 = await fetch('https://usda.3fs.app');
    console.log('usda.3fs.app status:', f2.status);
  } catch (e) {
    console.log('usda.3fs.app fetch error:', e.message);
  }
}

main().catch(console.error);
