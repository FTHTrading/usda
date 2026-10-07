// GET /api/check?zip=30513&people=4&income=68000
// Free with a Pro key (Authorization: Bearer rh_...). Otherwise paid per call over x402 (USDC).
import { json, preflight, check, proFromAuth, logCall } from '../_lib.js';
import { CDP_BASE, cdpJwt, correlation, keyKind, creds } from '../_cdp.js';

const NETWORKS = {
  'base-sepolia': { asset: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', extra: { name: 'USDC', version: '2' } },
  'base': { asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', extra: { name: 'USD Coin', version: '2' } }
};

function requirements(env, url) {
  const net = NETWORKS[env.X402_NETWORK || 'base-sepolia'];
  const payTo = (env.X402_PAY_TO || '').trim();
  if (!net || !/^0x[0-9a-fA-F]{40}$/.test(payTo)) return null;
  if ((env.X402_NETWORK || '') === 'base' && !useCdp(env)) return null; // mainnet needs working Coinbase keys
  const price = Number(env.X402_PRICE_USDC || '0.02');
  return {
    scheme: 'exact',
    network: env.X402_NETWORK || 'base-sepolia',
    maxAmountRequired: String(Math.round(price * 1e6)),
    resource: url.origin + url.pathname,
    description: 'USDA rural home loan check: FY2026 Direct and Guaranteed income limits for a ZIP and household, with the source page.',
    mimeType: 'application/json',
    payTo,
    maxTimeoutSeconds: 60,
    asset: net.asset,
    extra: net.extra
  };
}

function useCdp(env) {
  const c = creds(env), kind = keyKind(c.secret);
  return c.id.length > 0 && (kind === 'ed25519' || kind === 'ec') && env.X402_NETWORK === 'base';
}

async function facilitator(env, path, body) {
  const headers = { 'content-type': 'application/json' };
  let base;
  if (useCdp(env)) {
    base = CDP_BASE;
    headers.authorization = 'Bearer ' + await cdpJwt(env, 'POST', '/platform/v2/x402' + path);
    headers['correlation-context'] = correlation();
  } else {
    base = (env.X402_FACILITATOR_URL || 'https://x402.org/facilitator').replace(/\/$/, '');
    if (env.X402_FACILITATOR_BEARER) headers.authorization = 'Bearer ' + env.X402_FACILITATOR_BEARER;
  }
  const r = await fetch(base + path, { method: 'POST', headers, body: JSON.stringify(body) });
  const t = await r.text();
  try { return JSON.parse(t); } catch { return { error: 'bad_facilitator_response', status: r.status }; }
}

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') return preflight();
  const url = new URL(request.url);
  const zip = url.searchParams.get('zip');
  const people = url.searchParams.get('people') || '4';
  const income = url.searchParams.get('income') || '0';
  if (!/^\d{5}$/.test(zip || '')) return json({ error: 'zip_required', example: '/api/check?zip=30513&people=4&income=68000' }, 400);

  const pro = await proFromAuth(request, env);
  if (pro) {
    const r = check({ zip, people, income });
    await logCall(env, 'pro', zip, !!r);
    return r ? json({ ...r, paid_by: 'pro_key' }) : json({ error: 'zip_not_found' }, 404);
  }

  const reqs = requirements(env, url);
  const pay = request.headers.get('x-payment');
  if (!reqs) {
    return json({ error: 'payment_required', message: 'Use a 3FS Rural Home Pro key (Authorization: Bearer rh_...). Pay-per-check for AI agents over x402 opens shortly.', pro: env.PRO_LINK }, 402);
  }
  if (!pay) {
    return json({ x402Version: 1, error: 'X-PAYMENT header is required', accepts: [reqs], pro_alternative: env.PRO_LINK }, 402);
  }

  let payload;
  try { payload = JSON.parse(atob(pay)); } catch { return json({ x402Version: 1, error: 'invalid X-PAYMENT header', accepts: [reqs] }, 402); }

  const v = await facilitator(env, '/verify', { x402Version: payload.x402Version || 1, paymentPayload: payload, paymentRequirements: reqs });
  if (!v || v.isValid !== true) {
    await logCall(env, 'x402', zip, false);
    return json({ x402Version: 1, error: v && (v.invalidReason || v.error) || 'payment_not_valid', accepts: [reqs] }, 402);
  }
  const result = check({ zip, people, income });
  if (!result) return json({ error: 'zip_not_found' }, 404);
  const s = await facilitator(env, '/settle', { x402Version: payload.x402Version || 1, paymentPayload: payload, paymentRequirements: reqs });
  if (!s || s.success !== true) {
    await logCall(env, 'x402', zip, false);
    return json({ x402Version: 1, error: s && (s.errorReason || s.error) || 'settlement_failed', accepts: [reqs] }, 402);
  }
  await logCall(env, 'x402', zip, true, s.transaction);
  const receipt = btoa(JSON.stringify({ success: true, transaction: s.transaction, network: s.network || reqs.network, payer: s.payer || v.payer }));
  return json({ ...result, paid_by: 'x402', transaction: s.transaction }, 200, { 'x-payment-response': receipt });
}
