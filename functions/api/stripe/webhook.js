// POST /api/stripe/webhook  (Stripe -> usda.3fs.app)
// Records Pro subscriptions. Needs the STRIPE_WEBHOOK_SECRET secret.
import { json } from '../../_lib.js';

async function hmacHex(secret, msg) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function safeEq(a, b) {
  if (a.length !== b.length) return false;
  let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function onRequestPost({ request, env }) {
  if (!env.STRIPE_WEBHOOK_SECRET) return json({ error: 'webhook_not_configured' }, 503);
  const raw = await request.text();
  const header = request.headers.get('stripe-signature') || '';
  const parts = Object.fromEntries(header.split(',').map(p => p.split('=')).filter(p => p.length === 2).map(([k, v]) => [k, v]));
  const sigs = header.split(',').filter(p => p.startsWith('v1=')).map(p => p.slice(3));
  const t = parts.t;
  if (!t || !sigs.length) return json({ error: 'bad_signature' }, 400);
  if (Math.abs(Date.now() / 1000 - Number(t)) > 600) return json({ error: 'stale' }, 400);
  const expected = await hmacHex(env.STRIPE_WEBHOOK_SECRET, t + '.' + raw);
  if (!sigs.some(s => safeEq(s, expected))) return json({ error: 'bad_signature' }, 400);

  const ev = JSON.parse(raw);
  const o = ev.data && ev.data.object || {};
  if (ev.type === 'checkout.session.completed' && (o.metadata || {}).plan === 'pro' && (o.payment_status === 'paid' || o.payment_status === 'no_payment_required')) {
    await env.DB.prepare('INSERT OR IGNORE INTO pro_accounts (session_id, customer, subscription, email, status, created) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(o.id, o.customer || null, o.subscription || null, (o.customer_details && o.customer_details.email) || null, 'active', Date.now()).run();
  } else if (ev.type === 'customer.subscription.updated' || ev.type === 'customer.subscription.deleted') {
    const active = ev.type === 'customer.subscription.updated' && (o.status === 'active' || o.status === 'trialing' || o.status === 'past_due');
    await env.DB.prepare('UPDATE pro_accounts SET status = ? WHERE subscription = ?').bind(active ? 'active' : 'inactive', o.id).run();
  }
  return json({ received: true });
}
