// USDA Rural OS & 3FS Platform — Programs, Refinance, Multi-Family & REAP Hub
// Comprehensive underwriting suites for:
// 1. Section 502 Streamlined-Assist Refinance ($50/mo Rule, No Appraisal)
// 2. Section 504 Rural Home Repair (1.00% Fixed Rate Loans & $10k Grants)
// 3. Section 538 / 515 Multi-Family Housing (40-Year Amortization, 90% LTV, Duplex Clusters)
// 4. USDA REAP Clean Energy & Commercial Solar (50% Grants + Guaranteed Loans)

import { USDA_PROGRAMS } from '../data/usda-programs-data.js';
import { PROJECT_RECORD } from '../data/project-record.js';
import { ICONS, getIcon } from './icons.js';

export class USDAProgramsSuiteView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.record = PROJECT_RECORD;
    this.activeTab = 'refinance'; // 'refinance' | 'home-repair' | 'multifamily' | 'reap'
    this.state = {
      // Refinance parameters
      refiCurrentBalance: 360000,
      refiCurrentRate: 7.25,
      refiNewRate: 5.75,
      refiClosingCosts: 8500,

      // Section 504 Repair parameters
      repairLoanAmount: 35000,
      repairGrantAmount: 10000,
      repairScope: "ROOF_HVAC_SEPTIC",

      // Section 538 Multi-Family parameters
      mfUnits: 12,
      mfRentPerUnit: 1250,
      mfCostPerUnit: 145000,
      mfOpexRatio: 0.35,
      mfInterestRate: 6.50,

      // REAP Clean Energy parameters
      reapSystemCost: 85000,
      reapAnnualEnergySavings: 11200
    };

    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="programs-suite-layout">
        <!-- Top Hero Header -->
        <div class="glass-panel-card hero-glass-panel">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                <span class="status-badge-glass badge-green">● EXPANDED USDA FINANCING SUITE</span>
                <span class="doc-version-tag">7 CFR § 3555 · § 3550 · § 3565 · § 4280</span>
              </div>
              <h1 class="panel-title" style="font-size: 1.55rem; color: #0f172a;">Refinance, Multi-Family Housing & REAP Energy Suite</h1>
              <p class="panel-subtitle" style="max-width: 820px; line-height: 1.5;">
                Tap beyond single-family new construction: Streamlined-Assist Refinance (0 appraisal, 100% financed costs), Section 504 1.00% repair loans, Section 538 40-year multi-family cluster notes, and USDA REAP 50% solar grants.
              </p>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn-secondary" id="btn-prog-jump-map">
                ${getIcon('radar', '', 14)} Inspect Parcel on GIS
              </button>
              <button class="btn-primary" id="btn-prog-open-docs" style="background: #0f172a; color: #fff; padding: 0.5rem 1rem;">
                ${getIcon('download', '', 14)} Download Official Program Packs
              </button>
            </div>
          </div>

          <!-- Programs Sub-Navigation Tabs -->
          <div class="programs-tabs-bar" style="margin-top: 1.25rem; display: flex; gap: 0.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.5rem; flex-wrap: wrap;">
            <button class="filter-tab-pill ${this.activeTab === 'refinance' ? 'active' : ''}" data-prog-tab="refinance">
              ${getIcon('refresh', '', 14)} 1. Streamlined Refinance ($50/mo Rule)
            </button>
            <button class="filter-tab-pill ${this.activeTab === 'home-repair' ? 'active' : ''}" data-prog-tab="home-repair">
              ${getIcon('layers', '', 14)} 2. Section 504 1% Repair & Grants
            </button>
            <button class="filter-tab-pill ${this.activeTab === 'multifamily' ? 'active' : ''}" data-prog-tab="multifamily">
              ${getIcon('construction', '', 14)} 3. Section 538 Multi-Family (40-Yr Note)
            </button>
            <button class="filter-tab-pill ${this.activeTab === 'reap' ? 'active' : ''}" data-prog-tab="reap">
              ${getIcon('carbon', '', 14)} 4. USDA REAP 50% Solar & Clean Energy
            </button>
          </div>
        </div>

        <!-- Tab Body Content -->
        <div style="margin-top: 1.25rem;">
          ${this.renderActiveTabContent()}
        </div>
      </div>
    `;
  }

  renderActiveTabContent() {
    switch (this.activeTab) {
      case 'refinance': return this.renderRefinancePane();
      case 'home-repair': return this.renderHomeRepairPane();
      case 'multifamily': return this.renderMultifamilyPane();
      case 'reap': return this.renderReapPane();
      default: return this.renderRefinancePane();
    }
  }

  /* -------------------------------------------------------------
   * 1. Section 502 Streamlined-Assist Refinance Pane
   * ------------------------------------------------------------- */
  renderRefinancePane() {
    const s = this.state;
    // Current payment: 30-year amortization
    const currentPI = this.calcPI(s.refiCurrentBalance, s.refiCurrentRate, 30);
    // New financed note: Balance + Upfront 1% Guarantee Fee + Closing Costs
    const newUpfrontFee = s.refiCurrentBalance * 0.01;
    const newTotalNote = s.refiCurrentBalance + newUpfrontFee + s.refiClosingCosts;
    const newPI = this.calcPI(newTotalNote, s.refiNewRate, 30);
    const monthlySavings = currentPI - newPI;
    const annualSavings = monthlySavings * 12;
    const meetsRule = monthlySavings >= 50.0;

    return `
      <div class="glass-panel-card">
        <div class="panel-header-flex">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <h2 class="panel-title" style="font-size: 1.2rem;">USDA Streamlined-Assist Refinance Engine</h2>
              <span class="status-badge-glass badge-blue">7 CFR § 3555.251(c)</span>
            </div>
            <p class="panel-subtitle">Zero out-of-pocket costs, no new property appraisal, and no credit score re-verification. Re-finance your existing USDA note immediately if your monthly P&I drops by ≥ $50.00.</p>
          </div>
          <button class="btn-download-pdf-real" id="btn-dl-refi-doc" style="padding: 0.45rem 0.95rem; font-size: 0.8rem;">
            ${getIcon('download', '', 14)} Download Refinance Dossier Form RD 3555-11
          </button>
        </div>

        <div class="calc-split-grid" style="margin-top: 1.25rem;">
          <!-- Left: Inputs -->
          <div class="calc-input-column">
            <h3 class="calc-col-title">Existing Loan & Refinance Terms</h3>

            <div class="calc-field-group">
              <label class="calc-field-label">Current Unpaid Principal Balance ($)</label>
              <input type="number" id="inp-refi-balance" value="${s.refiCurrentBalance}" step="1000" class="form-input" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Current Note Interest Rate (%)</label>
              <input type="number" id="inp-refi-cur-rate" value="${s.refiCurrentRate}" step="0.125" class="form-input" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">New USDA 30-Year Fixed Rate (%)</label>
              <input type="number" id="inp-refi-new-rate" value="${s.refiNewRate}" step="0.125" class="form-input" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Estimated Closing Costs & Escrow Rolled In ($)</label>
              <input type="number" id="inp-refi-costs" value="${s.refiClosingCosts}" step="500" class="form-input" />
              <small style="color: var(--emerald); font-size: 0.72rem;">100% financed into new note · $0 cash required from borrower</small>
            </div>
          </div>

          <!-- Right: Underwriting Proof & Savings Result -->
          <div class="calc-results-column">
            <h3 class="calc-col-title">Statutory Tangible Net Benefit Audit</h3>

            <div class="calc-kpi-banner ${meetsRule ? 'banner-emerald' : 'banner-red'}" style="padding: 1rem; border-radius: 8px; margin-bottom: 1rem; background: ${meetsRule ? 'rgba(5, 150, 105, 0.08)' : 'rgba(239, 68, 68, 0.08)'}; border: 1px solid ${meetsRule ? 'rgba(5, 150, 105, 0.25)' : 'rgba(239, 68, 68, 0.25)'};">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 700; color: #0f172a;">Statutory $50/Month Savings Test:</span>
                <span class="status-badge-glass ${meetsRule ? 'badge-green' : 'badge-red'}">
                  ${meetsRule ? '✓ PASSED QUALIFICATION' : '✖ DOES NOT MEET $50 RULE'}
                </span>
              </div>
              <div style="font-size: 1.85rem; font-weight: 900; color: ${meetsRule ? '#059669' : '#dc2626'}; margin: 0.4rem 0;">
                +$${Math.round(monthlySavings).toLocaleString()} / month
              </div>
              <p style="font-size: 0.78rem; color: var(--text-dim); margin: 0;">
                ${meetsRule 
                  ? `Reduces borrower monthly debt by $${Math.round(annualSavings).toLocaleString()} / year! Complies with 7 CFR § 3555.251(c) tangible net benefit mandate.` 
                  : `Monthly reduction must be at least $50.00. Reduce interest rate or financed closing costs to qualify.`}
              </p>
            </div>

            <div class="proforma-table-wrap">
              <table class="doc-table">
                <thead>
                  <tr><th>Metric</th><th>Existing Note</th><th>Streamlined Refinance</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Principal Loan Balance</td>
                    <td>$${s.refiCurrentBalance.toLocaleString()}</td>
                    <td><strong>$${Math.round(newTotalNote).toLocaleString()}</strong> (Costs rolled in)</td>
                  </tr>
                  <tr>
                    <td>Interest Rate</td>
                    <td>${s.refiCurrentRate}% Fixed</td>
                    <td class="font-emerald"><strong>${s.refiNewRate}% Fixed</strong></td>
                  </tr>
                  <tr>
                    <td>Monthly Principal & Interest</td>
                    <td>$${Math.round(currentPI).toLocaleString()} / mo</td>
                    <td class="font-emerald"><strong>$${Math.round(newPI).toLocaleString()} / mo</strong></td>
                  </tr>
                  <tr>
                    <td>Property Appraisal Required</td>
                    <td>Standard</td>
                    <td class="font-emerald"><strong>$0 (NO APPRAISAL REQUIRED)</strong></td>
                  </tr>
                  <tr>
                    <td>Out-of-Pocket Cash at Closing</td>
                    <td>N/A</td>
                    <td class="font-emerald"><strong>$0.00 (Zero Down)</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* -------------------------------------------------------------
   * 2. Section 504 Rural Home Repair Loans & Grants Pane
   * ------------------------------------------------------------- */
  renderHomeRepairPane() {
    const s = this.state;
    // Section 504 1.00% fixed interest rate for 20 years (240 months)
    const monthlyRepairPI = this.calcPI(s.repairLoanAmount, 1.00, 20);

    return `
      <div class="glass-panel-card">
        <div class="panel-header-flex">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <h2 class="panel-title" style="font-size: 1.2rem;">Section 504 Rural Home Repair Loans & Grants</h2>
              <span class="status-badge-glass badge-green">7 CFR PART 3550 SUBPART C</span>
            </div>
            <p class="panel-subtitle">1.00% fixed-interest loans up to $40,000 and grants up to $10,000 for low-income homeowners to repair roofs, foundations, HVAC heat pumps, and well/septic systems.</p>
          </div>
          <button class="btn-download-pdf-real" id="btn-dl-repair-doc" style="padding: 0.45rem 0.95rem; font-size: 0.8rem;">
            ${getIcon('download', '', 14)} Download Form RD 504-1 Repair Voucher
          </button>
        </div>

        <div class="calc-split-grid" style="margin-top: 1.25rem;">
          <div class="calc-input-column">
            <h3 class="calc-col-title">Section 504 Repair Capital Structure</h3>

            <div class="calc-field-group">
              <label class="calc-field-label">1.00% Fixed Loan Amount ($ max $40,000)</label>
              <input type="number" id="inp-repair-loan" value="${s.repairLoanAmount}" max="40000" step="1000" class="form-input" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Elderly (Age 62+) Hazard Grant ($ max $10,000)</label>
              <input type="number" id="inp-repair-grant" value="${s.repairGrantAmount}" max="10000" step="500" class="form-input" />
              <small style="color: var(--emerald); font-size: 0.72rem;">100% forgivable after 3 years of owner-occupancy</small>
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Primary Repair Scope Category</label>
              <select id="inp-repair-scope" class="form-select">
                <option value="ROOF_HVAC_SEPTIC">Roof Replacement, Cold-Climate Heat Pump & Septic Upgrade</option>
                <option value="STRUCTURAL">Structural Foundation & Crawlspace Moisture Remediation</option>
                <option value="ADA_ACCESSIBILITY">Senior Aging-in-Place & ADA Ramp Modernization</option>
                <option value="ELECTRICAL_PLUMBING">Whole-Home Electrical Rewire & Drilled Well Pump</option>
              </select>
            </div>
          </div>

          <div class="calc-results-column">
            <h3 class="calc-col-title">Affordable Financing Breakdown</h3>

            <div class="kpi-cards-grid" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 1rem;">
              <div class="kpi-card-3d">
                <span class="kpi-label">TOTAL CAPITAL PROVIDED</span>
                <div class="kpi-value font-emerald">$${(s.repairLoanAmount + s.repairGrantAmount).toLocaleString()}</div>
                <div class="kpi-sub">Loan: $${s.repairLoanAmount.toLocaleString()} · Grant: $${s.repairGrantAmount.toLocaleString()}</div>
              </div>
              <div class="kpi-card-3d">
                <span class="kpi-label">MONTHLY NOTE PAYMENT</span>
                <div class="kpi-value font-blue">$${Math.round(monthlyRepairPI).toLocaleString()} / mo</div>
                <div class="kpi-sub">1.00% Fixed · 20-Year Term</div>
              </div>
            </div>

            <div class="intake-summary-box" style="padding: 1rem; background: #f8fafc; border: 1px solid var(--glass-border); border-radius: 8px;">
              <strong style="color: #0f172a; font-size: 0.88rem;">Why Section 504 is an Unmatched Program:</strong>
              <p style="font-size: 0.75rem; color: var(--text-dim); margin: 0.35rem 0 0; line-height: 1.5;">
                A standard bank home improvement loan at 9.5% for $35,000 costs <strong>$326/month</strong>. Under USDA Section 504 at 1.00% fixed, the borrower pays only <strong>$${Math.round(monthlyRepairPI)}/month</strong>, protecting cash flow while upgrading critical health, energy, and structural building assemblies.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* -------------------------------------------------------------
   * 3. Section 538 / 515 Multi-Family Housing Pane
   * ------------------------------------------------------------- */
  renderMultifamilyPane() {
    const s = this.state;
    const totalDevCost = s.mfUnits * s.mfCostPerUnit;
    const maxLoanAmount = totalDevCost * 0.90; // 90% LTV for-profit
    const requiredEquity = totalDevCost * 0.10; // 10% sponsor equity

    // Annual Gross Potential Income
    const grossPotentialIncome = s.mfUnits * s.mfRentPerUnit * 12;
    const effectiveGrossIncome = grossPotentialIncome * 0.95; // 5% vacancy
    const operatingExpenses = effectiveGrossIncome * s.mfOpexRatio;
    const netOperatingIncome = effectiveGrossIncome - operatingExpenses;

    // 40-Year Amortization Annual Debt Service
    const monthlyPI = this.calcPI(maxLoanAmount, s.mfInterestRate, 40);
    const annualDebtService = monthlyPI * 12;

    // Debt Service Coverage Ratio (DSCR)
    const dscr = annualDebtService > 0 ? (netOperatingIncome / annualDebtService) : 0;
    const dscrPassed = dscr >= 1.15;

    return `
      <div class="glass-panel-card">
        <div class="panel-header-flex">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <h2 class="panel-title" style="font-size: 1.2rem;">Section 538 Multi-Family Housing Guaranteed Loans</h2>
              <span class="status-badge-glass badge-purple">7 CFR PART 3565 · 40-YEAR NOTE</span>
            </div>
            <p class="panel-subtitle">Finance rural duplex clusters, 4-plexes, cottage courts, and multi-unit rental complexes up to 90% LTV with an unprecedented 40-year amortization schedule.</p>
          </div>
          <button class="btn-download-pdf-real" id="btn-dl-mf-doc" style="padding: 0.45rem 0.95rem; font-size: 0.8rem;">
            ${getIcon('download', '', 14)} Download Form RD 3560-1 Multi-Family Pro-Forma
          </button>
        </div>

        <div class="calc-split-grid" style="margin-top: 1.25rem;">
          <div class="calc-input-column">
            <h3 class="calc-col-title">Development & Rental Parameters</h3>

            <div class="calc-field-group">
              <label class="calc-field-label">Number of Rental Units (e.g. 12 units)</label>
              <input type="number" id="inp-mf-units" value="${s.mfUnits}" step="2" class="form-input" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Turnkey Development Cost / Unit ($)</label>
              <input type="number" id="inp-mf-cost-unit" value="${s.mfCostPerUnit}" step="5000" class="form-input" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Average Monthly Rent / Unit ($)</label>
              <input type="number" id="inp-mf-rent" value="${s.mfRentPerUnit}" step="50" class="form-input" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">40-Year Permanent Guaranteed Rate (%)</label>
              <input type="number" id="inp-mf-rate" value="${s.mfInterestRate}" step="0.25" class="form-input" />
            </div>
          </div>

          <div class="calc-results-column">
            <h3 class="calc-col-title">Section 538 Underwriting Waterfall</h3>

            <div class="kpi-cards-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 1rem;">
              <div class="kpi-card-3d">
                <span class="kpi-label">TOTAL DEVELOPMENT</span>
                <div class="kpi-value font-emerald">$${totalDevCost.toLocaleString()}</div>
                <div class="kpi-sub">${s.mfUnits} Units @ $${s.mfCostPerUnit.toLocaleString()}</div>
              </div>
              <div class="kpi-card-3d">
                <span class="kpi-label">90% LTV 40-YR LOAN</span>
                <div class="kpi-value font-blue">$${Math.round(maxLoanAmount).toLocaleString()}</div>
                <div class="kpi-sub">Equity: $${Math.round(requiredEquity).toLocaleString()} (10%)</div>
              </div>
              <div class="kpi-card-3d">
                <span class="kpi-label">DSCR RATIO</span>
                <div class="kpi-value ${dscrPassed ? 'font-emerald' : 'text-amber'}">${dscr.toFixed(2)}x</div>
                <div class="kpi-sub">${dscrPassed ? '≥ 1.15x Required Pass' : 'Under 1.15x'}</div>
              </div>
            </div>

            <div class="proforma-table-wrap">
              <table class="doc-table">
                <tbody>
                  <tr><td>Gross Potential Annual Rent</td><td><strong>$${grossPotentialIncome.toLocaleString()}</strong></td></tr>
                  <tr><td>Effective Gross Income (5% Vacancy)</td><td>$${Math.round(effectiveGrossIncome).toLocaleString()}</td></tr>
                  <tr><td>Operating Expenses (35% OpEx)</td><td>-$${Math.round(operatingExpenses).toLocaleString()}</td></tr>
                  <tr class="font-bold"><td>Net Operating Income (NOI)</td><td class="font-emerald">$${Math.round(netOperatingIncome).toLocaleString()}</td></tr>
                  <tr><td>Annual 40-Yr Debt Service</td><td>-$${Math.round(annualDebtService).toLocaleString()} ($${Math.round(monthlyPI).toLocaleString()} / mo)</td></tr>
                  <tr class="font-bold"><td>Net Annual Cash Flow (After Debt)</td><td class="font-emerald">+$${Math.round(netOperatingIncome - annualDebtService).toLocaleString()} / yr</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* -------------------------------------------------------------
   * 4. USDA REAP 50% Solar & Clean Energy Pane
   * ------------------------------------------------------------- */
  renderReapPane() {
    const s = this.state;
    const reapGrant50 = s.reapSystemCost * 0.50; // 50% USDA Grant
    const federalItc30 = s.reapSystemCost * 0.30; // 30% Federal Investment Tax Credit
    const netOwnerCost = s.reapSystemCost - reapGrant50 - federalItc30; // 20% Net
    const paybackYears = s.reapAnnualEnergySavings > 0 ? (netOwnerCost / s.reapAnnualEnergySavings).toFixed(1) : 0;

    return `
      <div class="glass-panel-card">
        <div class="panel-header-flex">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <h2 class="panel-title" style="font-size: 1.2rem;">USDA REAP Clean Energy & Commercial Solar Engine</h2>
              <span class="status-badge-glass badge-green">7 CFR PART 4280 SUBPART B · 50% GRANTS</span>
            </div>
            <p class="panel-subtitle">Rural small businesses and agricultural operators qualify for cash grants up to 50% for commercial rooftop solar PV arrays, geothermal, and heat pump retrofits.</p>
          </div>
          <button class="btn-download-pdf-real" id="btn-dl-reap-doc" style="padding: 0.45rem 0.95rem; font-size: 0.8rem;">
            ${getIcon('download', '', 14)} Download Form RD 4280-1 REAP Grant Pack
          </button>
        </div>

        <div class="calc-split-grid" style="margin-top: 1.25rem;">
          <div class="calc-input-column">
            <h3 class="calc-col-title">System Cost & Energy Production</h3>

            <div class="calc-field-group">
              <label class="calc-field-label">Turnkey Solar / Clean Energy Cost ($)</label>
              <input type="number" id="inp-reap-cost" value="${s.reapSystemCost}" step="5000" class="form-input" />
              <small style="color: var(--text-dim); font-size: 0.72rem;">e.g., 35 kW Commercial Grid-Tied Solar PV Array</small>
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Annual Utility Electric Bill Savings ($)</label>
              <input type="number" id="inp-reap-savings" value="${s.reapAnnualEnergySavings}" step="500" class="form-input" />
            </div>
          </div>

          <div class="calc-results-column">
            <h3 class="calc-col-title">Capital Stacking: 80% Total Government Subsidy</h3>

            <div class="kpi-cards-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 1rem;">
              <div class="kpi-card-3d">
                <span class="kpi-label">50% USDA REAP GRANT</span>
                <div class="kpi-value font-emerald">+$${Math.round(reapGrant50).toLocaleString()}</div>
                <div class="kpi-sub">Direct Federal Cash Grant</div>
              </div>
              <div class="kpi-card-3d">
                <span class="kpi-label">30% FEDERAL ITC TAX CREDIT</span>
                <div class="kpi-value font-blue">+$${Math.round(federalItc30).toLocaleString()}</div>
                <div class="kpi-sub">IRS Direct Pay / Credit</div>
              </div>
              <div class="kpi-card-3d">
                <span class="kpi-label">NET BORROWER CAPITAL</span>
                <div class="kpi-value font-emerald">$${Math.round(netOwnerCost).toLocaleString()}</div>
                <div class="kpi-sub">Only 20% Net Out-of-Pocket</div>
              </div>
            </div>

            <div class="intake-summary-box" style="padding: 1rem; background: #f8fafc; border: 1px solid var(--glass-border); border-radius: 8px;">
              <strong style="color: #0f172a; font-size: 0.88rem;">Capital Payback Velocity:</strong>
              <div style="font-size: 1.45rem; font-weight: 800; color: #059669; margin: 0.35rem 0;">
                ${paybackYears} Years Full Payback
              </div>
              <p style="font-size: 0.75rem; color: var(--text-dim); margin: 0; line-height: 1.45;">
                After year ${paybackYears}, the system yields 100% free clean electricity, generating over <strong>$${Math.round(s.reapAnnualEnergySavings * 20).toLocaleString()}</strong> in net cumulative cash flow over its 25-year design lifespan.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* -------------------------------------------------------------
   * Event Handlers & Calculation Helpers
   * ------------------------------------------------------------- */
  attachEvents() {
    // Tab switching
    this.container.querySelectorAll('[data-prog-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.getAttribute('data-prog-tab');
        this.render();
        this.attachEvents();
      });
    });

    // Jump to map
    this.container.querySelector('#btn-prog-jump-map')?.addEventListener('click', () => {
      if (window.usdaApp) window.usdaApp.switchTab('map-radar');
    });

    // Jump to docs
    this.container.querySelector('#btn-prog-open-docs')?.addEventListener('click', () => {
      if (window.usdaApp) window.usdaApp.switchTab('documents');
    });

    // Refinance inputs
    const bInp = this.container.querySelector('#inp-refi-balance');
    const cRateInp = this.container.querySelector('#inp-refi-cur-rate');
    const nRateInp = this.container.querySelector('#inp-refi-new-rate');
    const costsInp = this.container.querySelector('#inp-refi-costs');

    const updateRefi = () => {
      if (bInp) this.state.refiCurrentBalance = Number(bInp.value) || 360000;
      if (cRateInp) this.state.refiCurrentRate = Number(cRateInp.value) || 7.25;
      if (nRateInp) this.state.refiNewRate = Number(nRateInp.value) || 5.75;
      if (costsInp) this.state.refiClosingCosts = Number(costsInp.value) || 8500;
      this.render();
      this.attachEvents();
    };

    bInp?.addEventListener('input', updateRefi);
    cRateInp?.addEventListener('input', updateRefi);
    nRateInp?.addEventListener('input', updateRefi);
    costsInp?.addEventListener('input', updateRefi);

    // Section 504 inputs
    const rLoanInp = this.container.querySelector('#inp-repair-loan');
    const rGrantInp = this.container.querySelector('#inp-repair-grant');
    const updateRepair = () => {
      if (rLoanInp) this.state.repairLoanAmount = Number(rLoanInp.value) || 35000;
      if (rGrantInp) this.state.repairGrantAmount = Number(rGrantInp.value) || 10000;
      this.render();
      this.attachEvents();
    };
    rLoanInp?.addEventListener('input', updateRepair);
    rGrantInp?.addEventListener('input', updateRepair);

    // Section 538 inputs
    const mfUnitsInp = this.container.querySelector('#inp-mf-units');
    const mfCostInp = this.container.querySelector('#inp-mf-cost-unit');
    const mfRentInp = this.container.querySelector('#inp-mf-rent');
    const mfRateInp = this.container.querySelector('#inp-mf-rate');
    const updateMf = () => {
      if (mfUnitsInp) this.state.mfUnits = Number(mfUnitsInp.value) || 12;
      if (mfCostInp) this.state.mfCostPerUnit = Number(mfCostInp.value) || 145000;
      if (mfRentInp) this.state.mfRentPerUnit = Number(mfRentInp.value) || 1250;
      if (mfRateInp) this.state.mfInterestRate = Number(mfRateInp.value) || 6.50;
      this.render();
      this.attachEvents();
    };
    mfUnitsInp?.addEventListener('input', updateMf);
    mfCostInp?.addEventListener('input', updateMf);
    mfRentInp?.addEventListener('input', updateMf);
    mfRateInp?.addEventListener('input', updateMf);

    // REAP inputs
    const reapCostInp = this.container.querySelector('#inp-reap-cost');
    const reapSavingsInp = this.container.querySelector('#inp-reap-savings');
    const updateReap = () => {
      if (reapCostInp) this.state.reapSystemCost = Number(reapCostInp.value) || 85000;
      if (reapSavingsInp) this.state.reapAnnualEnergySavings = Number(reapSavingsInp.value) || 11200;
      this.render();
      this.attachEvents();
    };
    reapCostInp?.addEventListener('input', updateReap);
    reapSavingsInp?.addEventListener('input', updateReap);

    // Document download buttons
    this.container.querySelector('#btn-dl-refi-doc')?.addEventListener('click', () => {
      if (window.usdaPdfEngine) window.usdaPdfEngine.downloadPDF('rd-3555-11');
    });

    this.container.querySelector('#btn-dl-repair-doc')?.addEventListener('click', () => {
      if (window.usdaPdfEngine) window.usdaPdfEngine.downloadPDF('rd-504-1');
    });

    this.container.querySelector('#btn-dl-mf-doc')?.addEventListener('click', () => {
      if (window.usdaPdfEngine) window.usdaPdfEngine.downloadPDF('rd-3560-1');
    });

    this.container.querySelector('#btn-dl-reap-doc')?.addEventListener('click', () => {
      if (window.usdaPdfEngine) window.usdaPdfEngine.downloadPDF('rd-4280-1');
    });
  }

  calcPI(principal, annualRatePct, years) {
    if (principal <= 0) return 0;
    const r = (annualRatePct / 100) / 12;
    const n = years * 12;
    if (r === 0) return principal / n;
    return (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  }
}
