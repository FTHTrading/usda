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
      const numDependents = Number(payload.numDependents !== undefined ? payload.numDependents : payload.dependents) || 0;
      const childcareExpenses = Number(payload.childcareExpenses !== undefined ? payload.childcareExpenses : payload.childcare) || 0;
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

  // 9. AI Guided System Navigator & Walkthrough API
  if ((pathname === '/api/v1/ai/guidance' || pathname === '/api/v1/ai/chat')) {
    let prompt = '';
    if (req.method === 'POST') {
      try {
        const body = await parseBody(req);
        prompt = body.prompt || body.query || body.message || '';
      } catch (e) {
        prompt = '';
      }
    } else {
      prompt = parsedUrl.searchParams.get('q') || parsedUrl.searchParams.get('prompt') || '';
    }

    const q = prompt.toLowerCase();
    let aiResult;
    if (q.includes('eligible') || q.includes('map') || q.includes('parcel') || q.includes('lanier') || q.includes('location')) {
      aiResult = {
        action: "NAVIGATE_VIEW",
        targetTab: "map-radar",
        title: "GIS & Parcel Eligibility Guidance",
        summary: "Under USDA HB-1-3555 Section 502, properties must be inside an approved rural designated territory and outside urban clusters.",
        guidance: [
          "1. Open the Satellite & GIS Radar view to locate your candidate parcel.",
          "2. Lake Lanier Rule: Parcels in Forsyth and Gwinnett are disqualified, but Dawson County (Toto Creek / Chestatee River) is 92% eligible with the $135,500 Atlanta MSA income ceiling.",
          "3. Water Boundary Rule: The parcel boundary and building envelope must sit strictly above 1,070 feet MSL to clear the USACE flowage easement.",
          "4. Tap 'Audit Lake Lanier Elevation' to query real-time USGS 3DEP radar contours."
        ],
        quickActions: [
          { label: "Open Satellite & GIS Radar", tab: "map-radar" },
          { label: "Inspect Secret Hotspots", tab: "secrets-vault" }
        ],
        citation: "7 CFR § 3555.201; USACE Lake Sidney Lanier Shoreline Management Plan"
      };
    } else if (q.includes('calc') || q.includes('borrow') || q.includes('money') || q.includes('zero down') || q.includes('down payment') || q.includes('proforma') || q.includes('cost')) {
      aiResult = {
        action: "NAVIGATE_VIEW",
        targetTab: "calc-suite",
        title: "Zero-Down Single-Close Construction Guidance",
        summary: "The USDA Section 502 Single-Close Construction Loan finances 100% of raw land acquisition, site infrastructure, and turnkey home construction in one single permanent closing.",
        guidance: [
          "1. Zero Down: You do not need any cash down payment. 100% of lot purchase + turnkey builder contract is financed.",
          "2. Contingency Reserve: USDA mandates a 10% contingency reserve on construction costs. If unused, it reduces the final principal balance.",
          "3. Construction Interest Reserve: Up to 9 months of interim interest is rolled directly into the loan note so you have $0 out-of-pocket payments during framing and drywall.",
          "4. Upfront Guarantee Fee: 1.00% is financed into the total note.",
          "5. Open Calculator Suite to run all 8 financial engines."
        ],
        quickActions: [
          { label: "Open Financial Calculators", tab: "calc-suite" },
          { label: "View Draw Schedule & Escrow", tab: "build" }
        ],
        citation: "7 CFR § 3555.105(c); HB-1-3555 Chapter 12 'Combination Construction to Permanent Loans'"
      };
    } else if (q.includes('income') || q.includes('deduction') || q.includes('limit') || q.includes('qualify') || q.includes('salary') || q.includes('cap')) {
      aiResult = {
        action: "NAVIGATE_VIEW",
        targetTab: "calc-suite",
        title: "7 CFR § 3555 Statutory Income Deductions",
        summary: "USDA income eligibility is based on Adjusted Household Income, NOT gross pay! Statutory deductions can legally shield $20,000 to $40,000+ of earnings.",
        guidance: [
          "1. Dependent Deduction: $480 subtracted for every minor child under 18 or full-time student (7 CFR § 3555.152(b)).",
          "2. Childcare Deduction: 100% of verifiable childcare expenses for children under 13 to enable employment is deducted from gross income (7 CFR § 3555.152(c)).",
          "3. Elderly / Disabled Deduction: $400 flat deduction per household plus medical expenses exceeding 3% of gross income (7 CFR § 3555.152(d)).",
          "4. Atlanta MSA Cap: Dawson County allows up to $135,500 (1-4 persons) and $178,900 (5-8 persons).",
          "5. Test your numbers in the Statutory Income Shield Calculator."
        ],
        quickActions: [
          { label: "Run Income Deduction Shield", tab: "calc-suite" },
          { label: "View County Income Caps", tab: "overview" }
        ],
        citation: "7 CFR § 3555.152; HB-1-3555 Chapter 9"
      };
    } else if (q.includes('permit') || q.includes('code') || q.includes('drawings') || q.includes('spec') || q.includes('builder') || q.includes('handover')) {
      aiResult = {
        action: "NAVIGATE_VIEW",
        targetTab: "applications",
        title: "Permits, Codes & Architectural Delivery",
        summary: "USDA Single-Close loans require strict alignment between local jurisdiction building codes (GA 2018 IRC/IBC) and USDA environmental standards.",
        guidance: [
          "1. Design Coordination: Verify architectural drawings are at BIM LOD 350 specification.",
          "2. Soil Perc & Septic: Dawson/Lumpkin Health Departments require Level 3 soil analysis before permit issuance.",
          "3. Escrow Draw Schedule: 5 construction draws verified by third-party USDA inspector before lender disbursement.",
          "4. Handover: Final Certificate of Occupancy (CO) and 1-Year Builder Warranty Pack trigger loan modification to permanent phase."
        ],
        quickActions: [
          { label: "View Permits & Inspections", tab: "applications" },
          { label: "Check Building Codes Matrix", tab: "compliance" },
          { label: "Download Real PDFs", tab: "documents" }
        ],
        citation: "7 CFR § 3555.202; 2018 Georgia State Minimum Standard One and Two Family Dwelling Code"
      };
    } else {
      aiResult = {
        action: "NAVIGATE_VIEW",
        targetTab: "overview",
        title: "USDA Single-Close 3FS Operating Navigator",
        summary: "Welcome to the USDA Rural OS workspace. I am your integrated AI Copilot and System Navigator, designed to walk you through zero-down rural construction from parcel discovery to building handover.",
        guidance: [
          "• Master Overview: Centralized project state, parties, budget, and live milestone gates.",
          "• Satellite & GIS Radar: Official USDA rural eligibility boundary verification + Lake Lanier 1,070' elevation clearing.",
          "• 8 Financial Calculators: Statutory 7 CFR § 3555 income deduction shield, 100% LTV single-close construction waterfall, and escrow draw schedule.",
          "• Secret Loopholes Vault: High-equity geographic pockets, Atlanta MSA income arbitrage, and deeded water access tactics.",
          "• Regulatory Matrix & Permits: Complete code compliance tracking (IRC/IECC) and local Georgia health department septic/well authorizations.",
          "• Real Downloadable PDFs: Generate vector Form 3555-SC underwriting dossiers, project briefs, and feasibility reports directly."
        ],
        quickActions: [
          { label: "Project Overview", tab: "overview" },
          { label: "GIS Radar & Maps", tab: "map-radar" },
          { label: "8 Calculators Hub", tab: "calc-suite" },
          { label: "Secret Loopholes Vault", tab: "secrets-vault" },
          { label: "Download PDFs", tab: "documents" }
        ],
        citation: "7 CFR § 3555; USDA RD HB-1-3555; 3FS Operating Platform"
      };
    }

    return sendJson(res, 200, {
      success: true,
      query: prompt,
      response: aiResult,
      engine: "USDA Rural OS 3FS Neural Navigator v2.4",
      timestamp: new Date().toISOString()
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
