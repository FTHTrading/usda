// GET /api/pro/me  (Authorization: Bearer rh_...) -> is this Pro key active?
import { json, preflight, proFromAuth } from '../../_lib.js';

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') return preflight();
  const pro = await proFromAuth(request, env);
  if (!pro) return json({ active: false }, 401);
  const e = pro.email || '';
  return json({ active: true, email: e ? e.replace(/^(.).*(@.*)$/, '$1…$2') : null });
}
