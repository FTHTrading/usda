#!/usr/bin/env node
// USDA Rural OS & 3FS Platform — Whitelabel Rebranding & Multi-Tenant Engine
// Allows lenders, builders, architects, and broker-dealers to rebrand and deploy custom instances.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT_DIR, 'whitelabel.config.json');

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`❌ Whitelabel config missing at: ${CONFIG_PATH}`);
    process.exit(1);
  }
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`❌ Failed to parse whitelabel.config.json: ${err.message}`);
    process.exit(1);
  }
}

function validateConfig(cfg) {
  const errors = [];
  if (!cfg.tenant?.organizationName) errors.push('Missing tenant.organizationName');
  if (!cfg.tenant?.productionDomain) errors.push('Missing tenant.productionDomain');
  if (!cfg.branding?.primaryColor) errors.push('Missing branding.primaryColor');
  if (!cfg.branding?.accentColor) errors.push('Missing branding.accentColor');
  if (!cfg.jurisdiction?.defaultState) errors.push('Missing jurisdiction.defaultState');
  if (!cfg.financialDefaults?.contingencyReserveRate) errors.push('Missing financialDefaults.contingencyReserveRate');
  return errors;
}

function printSummary(cfg) {
  console.log(`\n======================================================`);
  console.log(`🌲 USDA RURAL OS — WHITELABEL TENANT SPECIFICATION`);
  console.log(`======================================================`);
  console.log(`🏢 Organization : ${cfg.tenant.organizationName}`);
  console.log(`🌐 Production   : ${cfg.tenant.productionDomain}`);
  console.log(`🏷️  Subsite Tag  : ${cfg.tenant.subdomainTag}`);
  console.log(`🎨 Primary Color: ${cfg.branding.primaryColor}`);
  console.log(`🔴 Accent Color : ${cfg.branding.accentColor}`);
  console.log(`📍 State / Co.  : ${cfg.jurisdiction.countyName}, ${cfg.jurisdiction.stateName}`);
  console.log(`💰 MSA Cap (1-4): $${cfg.jurisdiction.msaCap1to4.toLocaleString()}`);
  console.log(`🏦 Partner Bank : ${cfg.partners.lender.name} (${cfg.partners.lender.nmlsId})`);
  console.log(`🏗️  Contractor   : ${cfg.partners.contractor.name} (${cfg.partners.contractor.stateLicense})`);
  console.log(`📄 PDF Prefix   : ${cfg.pdfPublishing.customDocPrefix}`);
  console.log(`======================================================\n`);
}

function exportWhitelabelBundle(targetName) {
  const cfg = loadConfig();
  const errors = validateConfig(cfg);
  if (errors.length > 0) {
    console.error(`❌ Validation failed with ${errors.length} errors:`);
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }

  const exportDir = path.join(ROOT_DIR, 'dist', `tenant_${targetName || 'branded'}`);
  console.log(`📦 Generating turnkey whitelabel export at: ${exportDir}`);
  
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  // Write tenant manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    tenantName: targetName || cfg.tenant.organizationName,
    config: cfg,
    instructions: [
      "1. Point your domain DNS CNAME to your Cloudflare Pages or hosting endpoint.",
      "2. Replace assets in assets/brand with your organization's vector SVGs.",
      "3. Run: npm test to verify all mathematical loan formulas hold true.",
      "4. Run: npx wrangler pages deploy . --project-name <your-project-name>"
    ]
  };

  fs.writeFileSync(path.join(exportDir, 'tenant-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`✅ Tenant bundle compiled successfully!`);
}

// CLI Command Router
const args = process.argv.slice(2);
const cfg = loadConfig();

if (args.includes('--validate')) {
  const errors = validateConfig(cfg);
  if (errors.length === 0) {
    console.log(`✅ whitelabel.config.json is 100% valid and production-ready!`);
  } else {
    console.error(`❌ Validation failed:`, errors);
    process.exit(1);
  }
} else if (args.includes('--export')) {
  const targetIdx = args.indexOf('--export') + 1;
  const targetName = args[targetIdx] || 'custom_partner';
  exportWhitelabelBundle(targetName);
} else {
  printSummary(cfg);
  console.log(`Available commands:`);
  console.log(`  node scripts/apply-whitelabel.js --validate`);
  console.log(`  node scripts/apply-whitelabel.js --export <tenant-name>`);
  console.log(`  npm run whitelabel\n`);
}
