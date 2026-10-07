// USDA Rural OS & 3FS Platform — Headless REST API Gateway & Static Server
// Provides REST APIs for:
// - Property & GIS Eligibility (Census + USGS Elevation proxy)
// - 7 CFR § 3555 Statutory Income Deductions & MSA Caps
// - Turnkey 0%-Down Single-Close Construction Pro-Formas
// - Single Project Record State Machine
// - Multi-Tenant Whitelabel Specifications

import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GEORGIA_REGIONS, USDA_DEDUCTION_RULES, USDA_CONSTRUCTION_PARAMS } from './data/georgia-counties.js';
import { PROJECT_RECORD } from './data/project-record.js';
import { SECRET_HOTSPOTS, USDA_REGULATORY_SECRETS } from './data/secret-locations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 4080;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon'
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data, null, 2));
}

// USGS 3DEP Elevation Query Proxy
function fetchUSGSElevation(lat, lon) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'epqs.nationalmap.gov',
      path: `/v1/json?x=${lon}&y=${lat}&units=Feet`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) USDA-Rural-OS/2.4.0 (support@3fs.app)'
      }
    };
    https.get(options, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // Handle CORS pre-flight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:' + PORT}`);
  const pathname = parsedUrl.pathname;

  // ========================================================
  // HEADLESS REST API GATEWAY (v1)
  // ========================================================

  // 1. System Health & Version
  if (pathname === '/api/v1/health' && req.method === 'GET') {
    return sendJson(res, 200, {
      status: "HEALTHY",
      service: "USDA Rural OS & 3FS Headless API Gateway",
      version: "2.4.0",
      standard: "7 CFR § 3555 / HB-1-3555",
      edgeDomain: "https://usda.3fs.app",
      testsVerified: 22,
      timestamp: new Date().toISOString()
    });
  }

  // 2. Geographic Regions & 2026 AMI Caps
  if (pathname === '/api/v1/regions' && req.method === 'GET') {
    return sendJson(res, 200, {
      regions: GEORGIA_REGIONS,
      deductionRules: USDA_DEDUCTION_RULES,
      constructionParams: USDA_CONSTRUCTION_PARAMS
    });
  }

  // 3. Statutory Income & Deduction Shield Audit (7 CFR § 3555)
  if (pathname === '/api/v1/income-check' && req.method === 'POST') {
    try {
      const payload = await parseBody(req);
      const grossIncome = Number(payload.grossIncome) || 0;
      const numDependents = Number(payload.numDependents) || 0;
      const childcareExpenses = Number(payload.childcareExpenses) || 0;
      const isElderly = Boolean(payload.isElderly);
      const medicalExpenses = Number(payload.medicalExpenses) || 0;
      const countyId = payload.countyId || 'dawson';

      const county = GEORGIA_REGIONS.find(r => r.id === countyId) || GEORGIA_REGIONS[0];
      const dependentDeduction = numDependents * USDA_DEDUCTION_RULES.dependentChildDeduction;
      const childcareDeduction = childcareExpenses;
      
      const medicalThreshold = grossIncome * 0.03;
      const medicalDeduction = isElderly && medicalExpenses > medicalThreshold ? medicalExpenses - medicalThreshold : 0;
      const elderlyCredit = isElderly ? USDA_DEDUCTION_RULES.elderlyDisabledDeduction : 0;

      const totalDeductions = dependentDeduction + childcareDeduction + medicalDeduction + elderlyCredit;
      const adjustedIncome = Math.max(0, grossIncome - totalDeductions);
      const incomeCap = numDependents <= 3 ? county.incomeCap1to4 : county.incomeCap5to8;
      const isEligible = adjustedIncome <= incomeCap;

      return sendJson(res, 200, {
        jurisdiction: county.name,
        grossIncome,
        deductions: {
          dependents: { count: numDependents, amount: dependentDeduction, citation: "7 CFR § 3555.152(b)" },
          childcare: { amount: childcareDeduction, citation: "7 CFR § 3555.152(c)" },
          elderlyMedical: { amount: medicalDeduction + elderlyCredit, citation: "7 CFR § 3555.152(d)" },
          totalDeductions
        },
        adjustedIncome,
        incomeCap,
        isEligible,
        headroom: incomeCap - adjustedIncome,
        ruling: isEligible 
          ? `PASSED: Adjusted household income of $${adjustedIncome.toLocaleString()} is under the $${incomeCap.toLocaleString()} ${county.name} cap.`
          : `DISQUALIFIED: Adjusted household income of $${adjustedIncome.toLocaleString()} exceeds the $${incomeCap.toLocaleString()} cap.`
      });
    } catch (err) {
      return sendJson(res, 400, { error: "Invalid JSON payload: " + err.message });
    }
  }

  // 4. Single-Close 0%-Down Construction Financial Pro-Forma
  if (pathname === '/api/v1/proforma' && req.method === 'POST') {
    try {
      const payload = await parseBody(req);
      const lotCost = Number(payload.lotCost) || 42000;
      const sqft = Number(payload.sqft) || 1650;
      const costPerSqFt = Number(payload.costPerSqFt) || 185;
      const sitePrep = Number(payload.sitePrep) || 33500;
      const softCosts = Number(payload.softCosts) || 7000;
      const interestRate = Number(payload.interestRate) || 0.0625;
      const buildMonths = Number(payload.buildMonths) || 9;

      const turnkeyConstruction = sqft * costPerSqFt;
      const directConstruction = turnkeyConstruction + sitePrep + softCosts;
      const contingencyReserve = directConstruction * USDA_CONSTRUCTION_PARAMS.contingencyReserveRate;
      
      const avgDrawBalance = (directConstruction + contingencyReserve) * 0.55;
      const monthlyRate = interestRate / 12;
      const interestReserve = avgDrawBalance * monthlyRate * buildMonths;

      const baseTotalCost = lotCost + directConstruction + contingencyReserve + interestReserve;
      const upfrontGuaranteeFee = baseTotalCost * USDA_CONSTRUCTION_PARAMS.upfrontGuaranteeFeeRate;
      const totalFinancedNote = baseTotalCost + upfrontGuaranteeFee;

      // 30-Year Amortization
      const n = 360;
      const monthlyPI = (totalFinancedNote * (monthlyRate * Math.pow(1 + monthlyRate, n))) / (Math.pow(1 + monthlyRate, n) - 1);

      return sendJson(res, 200, {
        program: "USDA Section 502 Single-Close Guaranteed Loan",
        downPaymentRequired: 0.00,
        cashAtClosing: 0.00,
        waterfall: {
          lotAcquisition: lotCost,
          turnkeyConstruction,
          siteInfrastructure: sitePrep,
          softCostsAndPermits: softCosts,
          contingencyReserve10Pct: Math.round(contingencyReserve * 100) / 100,
          financedInterestReserve: Math.round(interestReserve * 100) / 100,
          upfrontGuaranteeFee1Pct: Math.round(upfrontGuaranteeFee * 100) / 100,
          totalFinancedNote: Math.round(totalFinancedNote * 100) / 100
        },
        monthlyPayment: {
          principalAndInterest: Math.round(monthlyPI * 100) / 100,
          annualRate: interestRate,
          termYears: 30
        },
        guaranteeNote: "100% LTV financed note combines raw parcel purchase and turnkey construction into a single permanent loan closing."
      });
    } catch (err) {
      return sendJson(res, 400, { error: "Invalid JSON payload: " + err.message });
    }
  }

  // 5. USGS 3DEP Real-Time Elevation & Lake Lanier Buffer Clearance
  if (pathname === '/api/v1/elevation' && req.method === 'GET') {
    const lat = parsedUrl.searchParams.get('lat') || '34.4215';
    const lon = parsedUrl.searchParams.get('lon') || '-84.1197';
    try {
      const elevData = await fetchUSGSElevation(lat, lon);
      const elevationFeet = elevData?.value || 0;
      const lakeLanierThreshold = 1070.0;
      const cleared = elevationFeet > lakeLanierThreshold;
      const bufferClearanceFeet = Math.round((elevationFeet - lakeLanierThreshold) * 10) / 10;

      return sendJson(res, 200, {
        coordinates: { latitude: Number(lat), longitude: Number(lon) },
        elevationFeet: Math.round(elevationFeet * 100) / 100,
        lakeLanierElevationThreshold: lakeLanierThreshold,
        flowageEasementCleared: cleared,
        clearanceAboveThresholdFeet: bufferClearanceFeet,
        usaceStatus: cleared ? "VERIFIED_ABOVE_USACE_EASEMENT" : "WARNING_BELOW_OR_WITHIN_EASEMENT",
        source: "USGS National Map 3DEP Elevation Point Query Service"
      });
    } catch (err) {
      return sendJson(res, 502, { error: "USGS 3DEP Query failed: " + err.message });
    }
  }

  // 6. Master Single Project Record State Machine
  if (pathname === '/api/v1/project' && req.method === 'GET') {
    return sendJson(res, 200, PROJECT_RECORD);
  }

  // 7. Whitelabel Tenant Configuration
  if (pathname === '/api/v1/whitelabel' && req.method === 'GET') {
    try {
      const raw = fs.readFileSync(path.join(ROOT, 'whitelabel.config.json'), 'utf-8');
      return sendJson(res, 200, JSON.parse(raw));
    } catch (err) {
      return sendJson(res, 500, { error: "Failed to read whitelabel config: " + err.message });
    }
  }

  // 8. Regulatory Loopholes & Secret Hotspots
  if (pathname === '/api/v1/secrets' && req.method === 'GET') {
    return sendJson(res, 200, {
      loopholes: USDA_REGULATORY_SECRETS,
      hotspots: SECRET_HOTSPOTS
    });
  }

  // ========================================================
  // STATIC ASSET SERVING
  // ========================================================
  let staticPath = pathname === '/' ? '/index.html' : pathname;
  let filePath = path.join(ROOT, staticPath);

  // Security check: ensure path is within ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🌲 USDA Rural OS & 3FS Headless API Gateway running at http://localhost:${PORT}`);
  console.log(`📡 REST API Endpoints active at /api/v1/health, /api/v1/regions, /api/v1/income-check, /api/v1/proforma, /api/v1/elevation`);
});

export default server;
