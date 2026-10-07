import { json, SOURCE } from '../_lib.js';
import { CDP_BASE, cdpJwt, correlation, keyKind, creds } from '../_cdp.js';

// GET /api/health          -> status (never shows secret values)
// GET /api/health?deep=1   -> also signs in to Coinbase CDP and reports the HTTP status only
export async function onRequest({ request, env }) {
  const c = creds(env);
  const cdp = { key_id_set: c.id.length > 0, key_format: keyKind(c.secret) };
  if (new URL(request.url).searchParams.get('deep') === '1' && cdp.key_id_set && (cdp.key_format === 'ed25519' || cdp.key_format === 'ec')) {
    try {
      const r = await fetch(CDP_BASE + '/supported', { headers: { authorization: 'Bearer ' + await cdpJwt(env, 'GET', '/platform/v2/x402/supported'), 'correlation-context': correlation() } });
      cdp.sign_in = r.status;
      if (r.ok) { const j = await r.json(); cdp.networks = [...new Set((j.kinds || []).map(k => k.network))].slice(0, 12); }
    } catch (e) { cdp.sign_in = 'error: ' + String(e.message || e).slice(0, 120); }
  }
  return json({
    service: 'usda.3fs.app',
    ok: true,
    guide: !!env.AI,
    database: !!env.DB,
    pro_billing: !!env.STRIPE_WEBHOOK_SECRET,
    x402: { network: env.X402_NETWORK || 'base-sepolia', price_usdc: env.X402_PRICE_USDC || '0.02', pay_to_set: /^0x[0-9a-fA-F]{40}$/.test(env.X402_PAY_TO || ''), cdp },
    source: SOURCE
  });
}
