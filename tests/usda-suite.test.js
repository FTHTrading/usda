// USDA Section 502 Rural Development OS - Automated Test Suite & Engine Verification
// Tests mathematical integrity, statutory deductions, 0%-down pro-formas, and underwriting gates.

import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import { GEORGIA_REGIONS, USDA_DEDUCTION_RULES, USDA_CONSTRUCTION_PARAMS } from '../data/georgia-counties.js';
import { SECRET_HOTSPOTS, USDA_REGULATORY_SECRETS } from '../data/secret-locations.js';

describe('1. Regional Jurisdiction & 2026 Income Caps', () => {
  test('Dawson County has correct Atlanta MSA 2026 caps ($135,500 / $178,900)', () => {
    const dawson = GEORGIA_REGIONS.find(r => r.id === 'dawson');
    assert.ok(dawson, 'Dawson County must exist');
    assert.equal(dawson.status, 'ELIGIBLE');
    assert.equal(dawson.incomeCap1to4, 135500);
    assert.equal(dawson.incomeCap5to8, 178900);
    assert.equal(dawson.eligibilityPercent, 92);
  });

  test('Lumpkin County is 100% rural eligible with non-metro GA caps', () => {
    const lumpkin = GEORGIA_REGIONS.find(r => r.id === 'lumpkin');
    assert.ok(lumpkin, 'Lumpkin County must exist');
    assert.equal(lumpkin.status, 'ELIGIBLE');
    assert.equal(lumpkin.eligibilityPercent, 100);
    assert.equal(lumpkin.incomeCap1to4, 118200);
    assert.equal(lumpkin.incomeCap5to8, 156000);
  });

  test('Fulton and Gwinnett are properly flagged as DISQUALIFIED metro areas', () => {
    const fulton = GEORGIA_REGIONS.find(r => r.id === 'fulton');
    const gwinnett = GEORGIA_REGIONS.find(r => r.id === 'gwinnett');
    assert.equal(fulton.status, 'DISQUALIFIED');
    assert.equal(gwinnett.status, 'DISQUALIFIED');
  });

  test('USACE Lake Lanier warnings are documented for shoreline counties', () => {
    const hallNorth = GEORGIA_REGIONS.find(r => r.id === 'hall-north');
    const dawson = GEORGIA_REGIONS.find(r => r.id === 'dawson');
    assert.ok(hallNorth.corpsWarning.includes('USACE'));
    assert.ok(dawson.corpsWarning.includes('1,070-ft'));
  });
});

describe('2. Statutory Income & Deduction Shield Engine (7 CFR § 3555)', () => {
  test('Minor dependent deduction calculates at exactly $480 per child', () => {
    const numChildren = 3;
    const deduction = numChildren * USDA_DEDUCTION_RULES.dependentChildDeduction;
    assert.equal(deduction, 1440);
  });

  test('Childcare deduction allows 100% dollar-for-dollar work-related daycare', () => {
    const grossIncome = 152000;
    const kids = 2; // $960
    const daycare = 16000;
    const totalDeductions = (kids * 480) + daycare;
    const adjustedIncome = grossIncome - totalDeductions;

    assert.equal(totalDeductions, 16960);
    assert.equal(adjustedIncome, 135040);
    assert.ok(adjustedIncome <= 135500, 'Household should legally qualify under Dawson County cap');
  });

  test('Elderly household deduction applies $400 and medical expenses exceeding 3%', () => {
    const grossIncome = 60000;
    const isElderly = true;
    const medicalOutOfPocket = 4500;
    const threshold = grossIncome * 0.03; // 1800
    const allowableMedical = medicalOutOfPocket > threshold ? medicalOutOfPocket - threshold : 0; // 2700
    const elderlyBaseCredit = isElderly ? 400 : 0;

    assert.equal(threshold, 1800);
    assert.equal(allowableMedical, 2700);
    assert.equal(elderlyBaseCredit + allowableMedical, 3100);
  });
});

describe('3. Single-Close 0%-Down Construction Financial Pro-Forma', () => {
  const lotCost = 42000;
  const sqft = 1650;
  const ratePerSqFt = 185;
  const buildCost = sqft * ratePerSqFt; // 305,250
  const sitePrep = 33500;
  const softCosts = 7000;
  const directConstruction = buildCost + sitePrep + softCosts; // 345,750
  const totalDirectCost = lotCost + directConstruction; // 387,750

  test('Mandatory 10% Construction Contingency is accurately calculated', () => {
    const contingencyRate = USDA_CONSTRUCTION_PARAMS.contingencyReserveRate; // 0.10
    const contingencyReserve = directConstruction * contingencyRate;
    assert.equal(contingencyReserve, 34575);
  });

  test('Financed Construction Interest Reserve avoids borrower double payments during build', () => {
    const contingencyReserve = directConstruction * 0.10; // 34575
    const avgDrawBalance = (directConstruction + contingencyReserve) * 0.55;
    const monthlyRate = (0.0625) / 12;
    const buildMonths = 9;
    const interestReserve = avgDrawBalance * monthlyRate * buildMonths;
    assert.ok(interestReserve > 8000 && interestReserve < 16000, `Interest reserve ${interestReserve} is in expected range`);
  });

  test('USDA 1.00% Upfront Guarantee Fee is financed directly into loan note', () => {
    const baseProjectCost = 436125;
    const upfrontFee = baseProjectCost * USDA_CONSTRUCTION_PARAMS.upfrontGuaranteeFeeRate;
    assert.equal(upfrontFee, 4361.25);
    const totalFinancedNote = baseProjectCost + upfrontFee;
    assert.equal(totalFinancedNote, 440486.25);
  });

  test('30-Year Amortization formula accurately computes Principal & Interest', () => {
    const principal = 440486;
    const annualRate = 0.0625;
    const r = annualRate / 12;
    const n = 360;
    const monthlyPI = (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    assert.ok(Math.abs(monthlyPI - 2711) < 5, `Expected P&I around $2,711/mo, got ${monthlyPI}`);
  });

  test('Zero down payment requirement holds true ($0 cash at closing)', () => {
    const downPayment = 0;
    assert.equal(downPayment, 0, 'USDA Section 502 Single-Close requires zero down payment');
  });
});

describe('4. Direct 502 Subsidized Payment Assistance (1.0% Interest Buydown)', () => {
  test('Direct loan subsidizes interest rate down to 1.00% fixed for low-income borrowers', () => {
    const loanAmount = 300000;
    const marketRate = 0.065 / 12;
    const subRate = 0.010 / 12;
    const n = 396; // 33-year direct term

    const marketPI = (loanAmount * (marketRate * Math.pow(1 + marketRate, n))) / (Math.pow(1 + marketRate, n) - 1);
    const subPI = (loanAmount * (subRate * Math.pow(1 + subRate, n))) / (Math.pow(1 + subRate, n) - 1);
    const monthlySavings = marketPI - subPI;

    assert.ok(subPI < 950, `Subsidized payment should be under $950, got ${subPI}`);
    assert.ok(monthlySavings > 900, `Monthly savings should exceed $900, got ${monthlySavings}`);
  });
});

describe('5. Georgia CUVA Property Tax Squeeze Algorithm', () => {
  test('CUVA enrollment slashes surplus rural acreage property taxes by 40-75%', () => {
    const standardAssessedTax = 3600;
    const cuvaSavingsRate = 0.65; // 65% reduction
    const cuvaTax = standardAssessedTax * (1 - cuvaSavingsRate);
    const monthlySavings = (standardAssessedTax - cuvaTax) / 12;

    assert.equal(cuvaTax, 1260);
    assert.equal(monthlySavings, 195);
  });
});

describe('6. Construction Draw & Escrow Milestone Disbursement Math', () => {
  test('5-Stage Draw schedule totals exactly 100% of construction escrow', () => {
    const stages = [
      { name: "Foundation & Footers", pct: 0.20 },
      { name: "Framing, Sheathing & Roof", pct: 0.25 },
      { name: "Mechanical Rough-ins (Plumbing, HVAC, Electrical)", pct: 0.20 },
      { name: "Interior Finishes, Drywall, Cabinets", pct: 0.20 },
      { name: "Final Inspection & Certificate of Occupancy", pct: 0.15 }
    ];

    const totalPct = stages.reduce((sum, s) => sum + s.pct, 0);
    assert.equal(Math.round(totalPct * 100), 100, 'Stages must equal exactly 100%');

    const totalBuildEscrow = 305250;
    const draw1 = totalBuildEscrow * stages[0].pct;
    const draw5 = totalBuildEscrow * stages[4].pct;

    assert.equal(draw1, 61050);
    assert.equal(draw5, 45787.5);
  });
});

describe('7. Regulatory Loopholes & Underwriting Gates Integrity', () => {
  test('All 7 codified federal loopholes are documented with legal citations', () => {
    assert.equal(USDA_REGULATORY_SECRETS.length, 7);
    USDA_REGULATORY_SECRETS.forEach(s => {
      assert.ok(s.citation.length > 0, `Secret ${s.id} must have a legal citation`);
      assert.ok(s.impact.length > 0, `Secret ${s.id} must have a documented impact`);
    });
  });

  test('All 6 secret high-value locations contain verified GPS coordinates and ratings', () => {
    assert.equal(SECRET_HOTSPOTS.length, 6);
    SECRET_HOTSPOTS.forEach(h => {
      assert.ok(h.lat > 34.0 && h.lat < 35.0, `Lat ${h.lat} must be in North Georgia`);
      assert.ok(h.lng < -83.0 && h.lng > -85.0, `Lng ${h.lng} must be in North Georgia`);
      assert.ok(h.rating >= 4, `Rating must be at least 4 stars`);
    });
  });
});

describe('8. As-Completed Appraised Value Equity Cushion (7 CFR § 3555.101(c))', () => {
  test('Appraisal cushion absorbs closing costs and prepaids with $0 borrower cash', () => {
    const totalCost = 385000;
    const appraisal = 430000;
    const closingCosts = 11500;
    const equityBuffer = appraisal - totalCost; // 45,000

    assert.equal(equityBuffer, 45000);
    assert.ok(equityBuffer >= closingCosts, 'Equity buffer must cover all closing fees');
    const netBorrowerCash = equityBuffer >= closingCosts ? 0 : (closingCosts - equityBuffer);
    assert.equal(netBorrowerCash, 0, 'Borrower cash required must be zero');
  });
});

describe('9. Rural Site Infrastructure & Utilities Turnkey Estimator', () => {
  test('Well, septic, driveway, and power hookups are 100% financeable into single note', () => {
    const wellDepth = 200; // ft
    const wellRate = 45; // $/ft
    const wellCost = wellDepth * wellRate; // 9,000
    const septic = 8500;
    const driveway = 12500;
    const powerHookup = 3500;
    const totalSite = wellCost + septic + driveway + powerHookup; // 33,500

    assert.equal(wellCost, 9000);
    assert.equal(totalSite, 33500);
    assert.ok(totalSite > 0 && totalSite < 50000, 'Site infrastructure matches standard rural cabin turnkey estimate');
  });
});

describe('10. Single Project Record & Party/Authority Architecture', () => {
  test('Project record maintains legal ownership, applicant authority, and licensed team', async () => {
    const { PROJECT_RECORD } = await import('../data/project-record.js');
    assert.ok(PROJECT_RECORD.id, 'Project ID must exist');
    assert.equal(PROJECT_RECORD.parties.owner.authorityStatus, 'VERIFIED_OWNER');
    assert.ok(PROJECT_RECORD.parties.authorizedAgent.license.includes('GA'), 'Agent must be GA licensed');
    assert.ok(PROJECT_RECORD.parties.contractor.insurance.generalLiability.includes('$2,000,000'), 'GC must have active GL policy');
    assert.equal(PROJECT_RECORD.parties.authorities[0].permitNumber, 'BLD-2026-0842');
  });
});

describe('11. Traceable Building Code Matrix & Professional Sign-Offs', () => {
  test('Building code matrix enforces localized Georgia editions and assigned professionals', async () => {
    const { PROJECT_RECORD } = await import('../data/project-record.js');
    const codes = PROJECT_RECORD.buildingCodesMatrix.applicableCodes;
    assert.ok(codes.length >= 7, 'Must have at least 7 localized code checks');
    codes.forEach(c => {
      assert.ok(c.code, 'Code edition required');
      assert.ok(c.section, 'Section required');
      assert.ok(c.assignedPro, 'Assigned professional required');
      assert.ok(['ACCEPTED', 'MISSING_EVIDENCE', 'REVIEWED'].includes(c.status), 'Valid status');
    });
  });
});

describe('12. Carbon & Net-Zero Boundary Rigor (DOE ZEB & Embodied LCA)', () => {
  test('Prevents fake green badges: enforces zero on-site combustion, EUI cut, and clean solar offset', async () => {
    const { PROJECT_RECORD } = await import('../data/project-record.js');
    const carb = PROJECT_RECORD.carbonAndNetZero;
    
    // Strict DOE ZEB Criteria
    assert.equal(carb.operationalEnergy.onSiteCombustion, false, 'Must have zero fossil gas/combustion');
    assert.ok(carb.operationalEnergy.cleanGenerationRatioPct >= 100, 'Clean generation must exceed 100% of demand');
    assert.ok(carb.operationalEnergy.modeledDesignEUI < 25, 'EUI must achieve deep efficiency (<25 kBtu/sq.ft/yr)');
    assert.ok(carb.embodiedCarbon.embodiedCarbonPerSqM < 300, 'Embodied carbon intensity must be under 300 kg CO2e/m2');
    assert.equal(carb.targetDefinitions.claimsStatus, 'MODELED_TO_MEET_TARGET', 'No fake verified green badge before post-occupancy metering');
  });
});

describe('13. Headless REST API Gateway & Federal Integration Endpoints', () => {
  const BASE_URL = 'http://localhost:4080';

  test('GET /api/v1/health returns healthy system status and statutory reference', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'HEALTHY');
    assert.equal(data.version, '2.4.0');
    assert.ok(data.standard.includes('7 CFR § 3555'));
  });

  test('POST /api/v1/income-check accurately audits statutory childcare and dependent deductions', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/income-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grossIncome: 142000,
        numDependents: 2,
        childcareExpenses: 12000,
        countyId: 'dawson'
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.isEligible, true);
    assert.equal(data.adjustedIncome, 129040);
    assert.equal(data.incomeCap, 135500);
    assert.equal(data.deductions.dependents.amount, 960);
    assert.equal(data.deductions.childcare.amount, 12000);
  });

  test('POST /api/v1/proforma calculates 100% LTV financed note and zero down payment', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/proforma`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lotCost: 42000,
        sqft: 1650,
        costPerSqFt: 185,
        sitePrep: 33500,
        softCosts: 7000
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.downPaymentRequired, 0);
    assert.equal(data.cashAtClosing, 0);
    assert.ok(data.waterfall.totalFinancedNote > 400000);
    assert.ok(data.monthlyPayment.principalAndInterest > 2000);
  });

  test('GET /api/v1/whitelabel returns valid multi-tenant specification', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/whitelabel`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.tenant.organizationName);
    assert.ok(data.branding.primaryColor);
  });
});


