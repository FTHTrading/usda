// Income & Household Qualification Engine (Official FY2026 USDA RD Section 502 Rules)
import { GEORGIA_REGIONS, USDA_DEDUCTION_RULES } from '../data/georgia-counties.js';

export class USDAIncomeEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = {
      countyId: "dawson",
      householdMembers: 4,
      grossAnnualIncome: 142000,
      dependentsCount: 2,
      annualChildcareCost: 12000,
      isElderlyOrDisabled: false,
      annualMedicalCost: 0,
      monthlyDebts: 650, // car, credit card min, student loan
      estimatedMonthlyHousing: 2350,
      creditScore: 710,
      loanType: "guaranteed" // 'guaranteed' (115% AMI) or 'direct' (Subsidized low income)
    };
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
    // Listen for county changes from other modules
    window.addEventListener('usda-county-changed', (e) => {
      this.state.countyId = e.detail.id;
      const sel = document.getElementById('inc-county-select');
      if (sel) sel.value = e.detail.id;
      this.calculateAndRefresh();
    });
  }

  get currentCounty() {
    return GEORGIA_REGIONS.find(r => r.id === this.state.countyId) || GEORGIA_REGIONS[0];
  }

  get incomeCeiling() {
    const isLargeHousehold = this.state.householdMembers >= 5;
    if (this.state.loanType === 'direct') {
      // Direct Loan Low-Income Cap
      return isLargeHousehold 
        ? Math.round(this.currentCounty.directIncomeLimit1to4 * 1.32)
        : this.currentCounty.directIncomeLimit1to4;
    } else {
      // Section 502 Guaranteed Moderate-Income (115% AMI)
      return isLargeHousehold 
        ? this.currentCounty.incomeCap5to8 
        : this.currentCounty.incomeCap1to4;
    }
  }

  calculate() {
    // 1. Deductions
    const dependentDeduction = this.state.dependentsCount * USDA_DEDUCTION_RULES.dependentChildDeduction;
    const childcareDeduction = Number(this.state.annualChildcareCost) || 0;
    const elderlyDeduction = this.state.isElderlyOrDisabled ? USDA_DEDUCTION_RULES.elderlyOrDisabledDeduction : 0;
    
    let medicalDeduction = 0;
    if (this.state.isElderlyOrDisabled && this.state.annualMedicalCost > 0) {
      const threshold = this.state.grossAnnualIncome * USDA_DEDUCTION_RULES.medicalExpenseThreshold;
      if (this.state.annualMedicalCost > threshold) {
        medicalDeduction = this.state.annualMedicalCost - threshold;
      }
    }

    const totalDeductions = dependentDeduction + childcareDeduction + elderlyDeduction + medicalDeduction;
    const adjustedIncome = Math.max(0, this.state.grossAnnualIncome - totalDeductions);
    const ceiling = this.incomeCeiling;
    const isIncomeEligible = adjustedIncome <= ceiling;
    const margin = ceiling - adjustedIncome;

    // 2. DTI Ratios
    const monthlyGross = this.state.grossAnnualIncome / 12;
    const frontEndDTI = (this.state.estimatedMonthlyHousing / monthlyGross) * 100;
    const backEndDTI = ((this.state.estimatedMonthlyHousing + this.state.monthlyDebts) / monthlyGross) * 100;

    // USDA standard benchmarks: 29% front / 41% back
    const passesDTI = frontEndDTI <= 29.5 && backEndDTI <= 41.5;
    const hasCompensatingFactors = this.state.creditScore >= 680;

    return {
      dependentDeduction,
      childcareDeduction,
      elderlyDeduction,
      medicalDeduction,
      totalDeductions,
      adjustedIncome,
      ceiling,
      isIncomeEligible,
      margin,
      monthlyGross,
      frontEndDTI,
      backEndDTI,
      passesDTI,
      hasCompensatingFactors
    };
  }

  render() {
    const results = this.calculate();
    const county = this.currentCounty;

    this.container.innerHTML = `
      <div class="income-engine-grid">
        <!-- Input Form Side -->
        <div class="income-card-form">
          <div class="card-header-flex">
            <div>
              <h3 class="card-title">USDA Household Income & Deduction Calculator</h3>
              <p class="card-subtitle">HB-1-3555 Qualifying Formula: Adjusted Income vs 115% AMI Cap</p>
            </div>
            <div class="loan-type-toggle">
              <button class="toggle-btn ${this.state.loanType === 'guaranteed' ? 'active' : ''}" data-type="guaranteed">502 Guaranteed (115% AMI)</button>
              <button class="toggle-btn ${this.state.loanType === 'direct' ? 'active' : ''}" data-type="direct">502 Direct (Subsidized)</button>
            </div>
          </div>

          <div class="form-section">
            <h4 class="section-heading">1. Location & Household Demographics</h4>
            <div class="form-row-2">
              <div class="form-group">
                <label for="inc-county-select">Target County</label>
                <select id="inc-county-select" class="form-select">
                  ${GEORGIA_REGIONS.map(r => `
                    <option value="${r.id}" ${r.id === this.state.countyId ? 'selected' : ''}>
                      ${r.name} (${r.status})
                    </option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group">
                <label for="inc-household-size">Total Household Members (All living in home)</label>
                <select id="inc-household-size" class="form-select">
                  ${[1, 2, 3, 4, 5, 6, 7, 8].map(n => `
                    <option value="${n}" ${n === this.state.householdMembers ? 'selected' : ''}>
                      ${n} ${n === 1 ? 'Person' : 'Persons'} ${n >= 5 ? '(Higher Income Cap Tier)' : '(1-4 Tier)'}
                    </option>
                  `).join('')}
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="inc-gross-income">
                Gross Annual Household Income (All Adult Earners combined):
                <span class="label-badge font-emerald">$${Number(this.state.grossAnnualIncome).toLocaleString()}</span>
              </label>
              <input type="range" id="inc-gross-slider" min="30000" max="230000" step="1000" value="${this.state.grossAnnualIncome}" class="slider-control" />
              <div class="input-helper-flex">
                <span>$30k</span>
                <input type="number" id="inc-gross-number" value="${this.state.grossAnnualIncome}" class="form-input-number" />
                <span>$230k</span>
              </div>
            </div>
          </div>

          <!-- Secret Deductions Section -->
          <div class="form-section highlight-section">
            <div class="section-heading-flex">
              <h4 class="section-heading">2. Official USDA Income Deductions (The "Hidden Qualifier")</h4>
              <span class="pro-tip-tag">Reduces Your Adjusted Income</span>
            </div>
            <p class="section-subtext">Under USDA regulations, these verified expenses are legally deducted from your income ceiling test:</p>

            <div class="form-row-2">
              <div class="form-group">
                <label for="inc-dependents">Minor Dependents / FT Students ($480 ea.)</label>
                <input type="number" id="inc-dependents" min="0" max="10" value="${this.state.dependentsCount}" class="form-input" />
                <span class="field-calc-note">Deduction: $${(this.state.dependentsCount * 480).toLocaleString()}</span>
              </div>

              <div class="form-group">
                <label for="inc-childcare">Annual Childcare Expenses ($)</label>
                <input type="number" id="inc-childcare" min="0" step="500" value="${this.state.annualChildcareCost}" class="form-input" />
                <span class="field-calc-note">100% verified work-related daycare</span>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group checkbox-group">
                <label class="custom-checkbox-label">
                  <input type="checkbox" id="inc-elderly-chk" ${this.state.isElderlyOrDisabled ? 'checked' : ''} />
                  <span>Head or Spouse is 62+ or Disabled ($400 deduction)</span>
                </label>
              </div>

              <div class="form-group" style="${this.state.isElderlyOrDisabled ? '' : 'opacity: 0.5; pointer-events: none;'}">
                <label for="inc-medical">Unreimbursed Medical Expenses (if 62+)</label>
                <input type="number" id="inc-medical" min="0" step="500" value="${this.state.annualMedicalCost}" class="form-input" />
                <span class="field-calc-note">Deductible amount exceeding 3% of income</span>
              </div>
            </div>
          </div>

          <!-- DTI & Debt Section -->
          <div class="form-section">
            <h4 class="section-heading">3. Monthly Debts & DTI Ratio Check</h4>
            <div class="form-row-3">
              <div class="form-group">
                <label for="inc-debts">Monthly Debts (Car, Cards, Loans)</label>
                <input type="number" id="inc-debts" min="0" step="50" value="${this.state.monthlyDebts}" class="form-input" />
              </div>

              <div class="form-group">
                <label for="inc-est-housing">Target Monthly Housing (PITI)</label>
                <input type="number" id="inc-est-housing" min="500" step="50" value="${this.state.estimatedMonthlyHousing}" class="form-input" />
              </div>

              <div class="form-group">
                <label for="inc-credit-score">Credit Score</label>
                <input type="number" id="inc-credit-score" min="580" max="850" value="${this.state.creditScore}" class="form-input" />
              </div>
            </div>
          </div>
        </div>

        <!-- Live Qualification Verdict Card -->
        <div class="income-card-results" id="income-results-card">
          ${this.renderResultsPanel(results, county)}
        </div>
      </div>
    `;
  }

  renderResultsPanel(r, county) {
    const isPassed = r.isIncomeEligible;
    const statusClass = isPassed ? 'status-box-pass' : 'status-box-fail';
    const statusIcon = isPassed ? '✅' : '❌';
    const statusTitle = isPassed ? 'INCOME QUALIFIED' : 'EXCEEDS USDA INCOME CEILING';

    return `
      <div class="result-box-top ${statusClass}">
        <div class="result-status-line">
          <span class="status-symbol">${statusIcon}</span>
          <div>
            <h2 class="status-headline">${statusTitle}</h2>
            <span class="status-subline">Program: USDA Section 502 ${this.state.loanType === 'guaranteed' ? 'Guaranteed (115% AMI)' : 'Direct Subsidized'}</span>
          </div>
        </div>

        <div class="comparison-bar-block">
          <div class="bar-labels">
            <span>Your Adjusted Income: <strong>$${Math.round(r.adjustedIncome).toLocaleString()}</strong></span>
            <span>Ceiling: <strong>$${r.ceiling.toLocaleString()}</strong></span>
          </div>
          <div class="bar-track">
            <div class="bar-fill ${isPassed ? 'fill-green' : 'fill-red'}" style="width: ${Math.min(100, (r.adjustedIncome / r.ceiling) * 100)}%;"></div>
          </div>
          <div class="bar-under-note">
            ${isPassed 
              ? `Safe margin: <strong class="font-emerald">$${Math.round(r.margin).toLocaleString()}</strong> below the maximum limit.`
              : `Over limit by: <strong class="font-rose">$${Math.round(Math.abs(r.margin)).toLocaleString()}</strong>. Check if additional deductions apply.`}
          </div>
        </div>
      </div>

      <!-- Deduction Impact Breakdown -->
      <div class="breakdown-card">
        <h4 class="breakdown-title">Deduction Mathematical Audit</h4>
        <div class="calc-table">
          <div class="calc-row">
            <span>Gross Household Income</span>
            <span>$${Number(this.state.grossAnnualIncome).toLocaleString()}</span>
          </div>
          <div class="calc-row text-emerald">
            <span>- Minor Dependents (${this.state.dependentsCount} × $480)</span>
            <span>-$${r.dependentDeduction.toLocaleString()}</span>
          </div>
          <div class="calc-row text-emerald">
            <span>- Childcare Deductions</span>
            <span>-$${r.childcareDeduction.toLocaleString()}</span>
          </div>
          ${r.elderlyDeduction > 0 ? `
            <div class="calc-row text-emerald">
              <span>- Elderly / Disabled Household Credit</span>
              <span>-$${r.elderlyDeduction.toLocaleString()}</span>
            </div>
          ` : ''}
          ${r.medicalDeduction > 0 ? `
            <div class="calc-row text-emerald">
              <span>- Allowable Medical Deduction</span>
              <span>-$${Math.round(r.medicalDeduction).toLocaleString()}</span>
            </div>
          ` : ''}
          <div class="calc-row total-row">
            <span>= USDA Adjusted Annual Income</span>
            <span class="total-val">$${Math.round(r.adjustedIncome).toLocaleString()}</span>
          </div>
        </div>

        ${r.totalDeductions > 0 ? `
          <div class="secret-deduction-badge">
            ⚡ <strong>The USDA Secret:</strong> Your deductions shaved <strong>$${r.totalDeductions.toLocaleString()}</strong> off your taxable gross, legally protecting your eligibility!
          </div>
        ` : ''}
      </div>

      <!-- DTI Ratio Evaluation -->
      <div class="dti-card">
        <h4 class="breakdown-title">Debt-To-Income (DTI) Underwriting Feasibility</h4>
        <div class="dti-gauge-grid">
          <div class="dti-gauge-box ${r.frontEndDTI <= 29 ? 'gauge-green' : (r.frontEndDTI <= 32 ? 'gauge-yellow' : 'gauge-red')}">
            <span class="gauge-label">Front-End (Housing PITI)</span>
            <span class="gauge-value">${r.frontEndDTI.toFixed(1)}%</span>
            <span class="gauge-benchmark">USDA Standard: 29%</span>
          </div>

          <div class="dti-gauge-box ${r.backEndDTI <= 41 ? 'gauge-green' : (r.backEndDTI <= 44 ? 'gauge-yellow' : 'gauge-red')}">
            <span class="gauge-label">Back-End (Total Debt)</span>
            <span class="gauge-value">${r.backEndDTI.toFixed(1)}%</span>
            <span class="gauge-benchmark">USDA Standard: 41%</span>
          </div>
        </div>

        <div class="compensating-factors">
          <span class="factor-title">Underwriting Compensating Factors:</span>
          <ul>
            <li class="${this.state.creditScore >= 680 ? 'factor-pass' : 'factor-warn'}">
              Credit Score (${this.state.creditScore}): ${this.state.creditScore >= 680 ? 'Qualifies for USDA Automated GUS Underwriting Waiver' : 'Requires Manual Underwrite (640-679)'}
            </li>
            <li class="factor-info">
              Higher DTI Ratios (up to 32/44%) are routinely approved by GUS automated underwriting when credit score is 680+ with 3+ months cash reserves.
            </li>
          </ul>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.container.addEventListener('input', (e) => {
      const id = e.target.id;
      if (id === 'inc-gross-slider') {
        this.state.grossAnnualIncome = Number(e.target.value);
        const numInput = document.getElementById('inc-gross-number');
        if (numInput) numInput.value = this.state.grossAnnualIncome;
        this.calculateAndRefresh();
      } else if (id === 'inc-gross-number') {
        this.state.grossAnnualIncome = Number(e.target.value);
        const slider = document.getElementById('inc-gross-slider');
        if (slider) slider.value = this.state.grossAnnualIncome;
        this.calculateAndRefresh();
      } else if (id === 'inc-dependents') {
        this.state.dependentsCount = Number(e.target.value);
        this.calculateAndRefresh();
      } else if (id === 'inc-childcare') {
        this.state.annualChildcareCost = Number(e.target.value);
        this.calculateAndRefresh();
      } else if (id === 'inc-debts') {
        this.state.monthlyDebts = Number(e.target.value);
        this.calculateAndRefresh();
      } else if (id === 'inc-est-housing') {
        this.state.estimatedMonthlyHousing = Number(e.target.value);
        this.calculateAndRefresh();
      } else if (id === 'inc-credit-score') {
        this.state.creditScore = Number(e.target.value);
        this.calculateAndRefresh();
      } else if (id === 'inc-medical') {
        this.state.annualMedicalCost = Number(e.target.value);
        this.calculateAndRefresh();
      }
    });

    this.container.addEventListener('change', (e) => {
      const id = e.target.id;
      if (id === 'inc-county-select') {
        this.state.countyId = e.target.value;
        this.calculateAndRefresh();
      } else if (id === 'inc-household-size') {
        this.state.householdMembers = Number(e.target.value);
        this.calculateAndRefresh();
      } else if (id === 'inc-elderly-chk') {
        this.state.isElderlyOrDisabled = e.target.checked;
        this.render(); // Re-render to enable/disable medical inputs
        this.attachEvents();
      }
    });

    this.container.addEventListener('click', (e) => {
      const toggle = e.target.closest('.toggle-btn');
      if (toggle) {
        this.state.loanType = toggle.getAttribute('data-type');
        this.container.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        toggle.classList.add('active');
        this.calculateAndRefresh();
      }
    });
  }

  calculateAndRefresh() {
    const results = this.calculate();
    const resultsPanel = document.getElementById('income-results-card');
    if (resultsPanel) {
      resultsPanel.innerHTML = this.renderResultsPanel(results, this.currentCounty);
    }
    // Update Gross Income badge
    const badge = this.container.querySelector('.label-badge');
    if (badge) badge.textContent = `$${Number(this.state.grossAnnualIncome).toLocaleString()}`;
  }
}
