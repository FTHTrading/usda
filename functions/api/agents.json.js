// GET /api/agents.json -> the x402 endpoints this door offers, read by the 3fs.app hub index.
import { json } from '../_lib.js';
export async function onRequest({ env }) {
  return json([{ endpoint: 'https://usda.3fs.app/api/check', method: 'GET', params: 'zip, people, income', price_usdc: env.X402_PRICE_USDC || '0.02', network: env.X402_NETWORK || 'base', mcp: 'https://usda.3fs.app/mcp', description: 'FY2026 USDA Direct and Guaranteed income limits for a ZIP and household, with the source page.' }], 200, { 'cache-control': 'public, max-age=300' });
}
