// /mcp  - Model Context Protocol server (stateless, Streamable HTTP, JSON responses).
// Add it to Claude Code:  claude mcp add --transport http usda-3fs https://usda.3fs.app/mcp
// Free: 25 checks a day per connection. Pro key (Authorization: Bearer rh_...): unlimited.
import { json, check, whereQualify, zonesNear, proFromAuth, limited, logCall, SOURCE } from './_lib.js';

const INFO = `3FS Rural Home checks USDA Single Family Housing loan limits (FY2026, HB-1-3550 Appendix 9).
Direct loan: USDA lends to the household; uses the low-income limit; apply through the local USDA Rural Development office or a certified packager.
Guaranteed loan: an approved lender lends and USDA backs it; uses the moderate-income limit.
Limits compare to adjusted yearly household income; deductions (for example per child) can lower it.
The property must be in a USDA-eligible rural area; confirm the exact address at https://eligibility.sc.egov.usda.gov/.
3FS is a technology provider, not USDA or a lender. USDA or an approved lender makes every decision.
Families use https://usda.3fs.app free. Pro ($49/month) gives an unlimited key: https://usda.3fs.app/#pricing`;

const TOOLS = [
  { name: 'check_zip', description: 'Check a household against FY2026 USDA Direct and Guaranteed loan income limits for a ZIP code. Returns both limits, whether the income qualifies, county type, Opportunity Zone tracts and the source PDF page.',
    inputSchema: { type: 'object', properties: { zip: { type: 'string', description: '5-digit ZIP code' }, people: { type: 'number', description: 'People in the household (default 4)' }, income: { type: 'number', description: 'Yearly household income in dollars' } }, required: ['zip'] } },
  { name: 'where_qualify', description: 'List the nearest counties (within the given miles of a ZIP) where a household qualifies for a USDA Direct or Guaranteed loan, with limits and source pages.',
    inputSchema: { type: 'object', properties: { zip: { type: 'string' }, people: { type: 'number' }, income: { type: 'number' }, miles: { type: 'number', description: 'Search radius, default 90, max 250' } }, required: ['zip', 'income'] } },
  { name: 'opportunity_zones', description: 'Counties with Opportunity Zone tracts (2018 CDFI Fund map) near a ZIP. Useful for builders and investors.',
    inputSchema: { type: 'object', properties: { zip: { type: 'string' }, miles: { type: 'number', description: 'Default 60, max 250' } }, required: ['zip'] } },
  { name: 'program_info', description: 'Plain explanation of USDA Direct vs Guaranteed home loans, who decides, and how 3FS Rural Home works.',
    inputSchema: { type: 'object', properties: {} } }
];

function rpcResult(id, result) { return { jsonrpc: '2.0', id, result }; }
function rpcError(id, code, message) { return { jsonrpc: '2.0', id, error: { code, message } }; }
function toolText(obj, isError) { return { content: [{ type: 'text', text: typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2) }], ...(typeof obj === 'object' && !isError ? { structuredContent: Array.isArray(obj) ? { results: obj } : obj } : {}), isError: !!isError }; }

async function handle(msg, ctx) {
  const { id, method, params } = msg || {};
  if (!method) return rpcError(id ?? null, -32600, 'Invalid request');
  if (method.startsWith('notifications/')) return null;
  if (method === 'initialize') {
    return rpcResult(id, { protocolVersion: (params && params.protocolVersion) || '2025-06-18', capabilities: { tools: { listChanged: false } }, serverInfo: { name: 'usda-3fs', title: '3FS Rural Home', version: '1.0.0' }, instructions: INFO });
  }
  if (method === 'ping') return rpcResult(id, {});
  if (method === 'tools/list') return rpcResult(id, { tools: TOOLS });
  if (method === 'tools/call') {
    const name = params && params.name, a = (params && params.arguments) || {};
    if (name === 'program_info') return rpcResult(id, toolText(INFO));
    if (!TOOLS.some(t => t.name === name)) return rpcError(id, -32602, 'Unknown tool: ' + name);
    if (!ctx.pro && await limited(ctx.env, ctx.request, 'mcp', 30, 25)) {
      return rpcResult(id, toolText('Free limit reached (25 checks a day). Get an unlimited Pro key at https://usda.3fs.app/#pricing and add it as a Bearer token.', true));
    }
    let out;
    if (name === 'check_zip') out = check({ zip: a.zip, people: a.people, income: a.income });
    else if (name === 'where_qualify') out = whereQualify({ zip: a.zip, people: a.people, income: a.income, miles: a.miles });
    else out = zonesNear({ zip: a.zip, miles: a.miles });
    await logCall(ctx.env, ctx.pro ? 'mcp-pro' : 'mcp', a.zip, !!out);
    if (!out) return rpcResult(id, toolText('ZIP not found. Use a 5-digit US ZIP code.', true));
    return rpcResult(id, toolText(name === 'check_zip' ? out : { zip: a.zip, results: out, source: SOURCE }));
  }
  return rpcError(id, -32601, 'Method not found: ' + method);
}

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type, authorization, mcp-protocol-version, mcp-session-id', 'access-control-allow-methods': 'POST, GET, OPTIONS' } });
  if (request.method === 'GET') return json({ name: '3FS Rural Home MCP', transport: 'streamable-http', add: 'claude mcp add --transport http usda-3fs https://usda.3fs.app/mcp', tools: TOOLS.map(t => t.name) }, 200);
  if (request.method !== 'POST') return json({ error: 'POST only' }, 405);
  let body;
  try { body = await request.json(); } catch { return json(rpcError(null, -32700, 'Parse error'), 400); }
  const ctx = { env, request, pro: await proFromAuth(request, env) };
  if (Array.isArray(body)) {
    const res = (await Promise.all(body.map(m => handle(m, ctx)))).filter(Boolean);
    return res.length ? json(res) : new Response(null, { status: 202 });
  }
  const r = await handle(body, ctx);
  return r ? json(r) : new Response(null, { status: 202 });
}
