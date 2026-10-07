async function testFull() {
  const edgeHtml = await (await fetch('https://usda.3fs.app')).text();
  console.log('--- Edge Verification: https://usda.3fs.app ---');
  console.log('Has btn-open-ai-guide:', edgeHtml.includes('btn-open-ai-guide'));
  console.log('Has SVG stroke in nav:', edgeHtml.includes('stroke="currentColor"'));
  console.log('No house emoji in nav:', !edgeHtml.includes('>🏠<'));
  console.log('No tree emoji in nav:', !edgeHtml.includes('>🌲<'));

  const endpoints = [
    '/api/v1/health',
    '/api/v1/regions',
    '/api/v1/project',
    '/api/v1/whitelabel',
    '/api/v1/secrets',
    '/api/v1/ai/guidance?q=How+much+can+I+borrow'
  ];

  for (const ep of endpoints) {
    const r = await fetch('https://usda.3fs.app' + ep);
    const data = await r.json();
    console.log(`Cloudflare Edge ${ep} -> Status: ${r.status}`);
  }
}

testFull().catch(console.error);
