// USDA Single-Close Construction-to-Permanent Loan Pro-Forma & Financial Engine
import { USDA_CONSTRUCTION_PARAMS } from '../data/georgia-counties.js';

export class USDAConstructionCalc {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = {
      landPrice: 42000,
      alreadyOwnLand: false,
      homeSqFt: 1650,
      buildRateSqFt: 185, // Mountain cabin / craftsman
      buildType: "craftsman-cabin",
      sitePrep: {
        septic: 8500,
        wellOrWater: 9000,
        gradingDriveway: 12500,
        powerUtility: 3500
      },
      softCosts: 7000, // plans, engineering, county building permits
      interestRate: 6.25, // 30-year fixed permanent rate
      constructionMonths: 9,
      contingencyPercent: 10,
      annualPropertyTaxRate: 1.0, // ~1.0% in North GA
      monthlyInsurance: 120
    };
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
  }

  calculate() {
    // 1. Direct Hard Costs
    const landCost = this.state.alreadyOwnLand ? 0 : Number(this.state.landPrice);
    const homeBuildCost = this.state.homeSqFt * this.state.buildRateSqFt;
    const totalSitePrep = Object.values(this.state.sitePrep).reduce((a, b) => a + Number(b), 0);
    const softCosts = Number(this.state.softCosts);

    const directConstructionCost = homeBuildCost + totalSitePrep + softCosts;
    const totalDirectCost = landCost + directConstructionCost;

    // 2. Reserves
    const contingencyReserve = (directConstructionCost * (this.state.contingencyPercent / 100));

    // Construction Interest Reserve:
    // Typically estimated based on 50% average balance drawn over the construction period
    const avgDrawBalance = (directConstructionCost + contingencyReserve) * 0.55;
    const monthlyRate = (this.state.interestRate / 100) / 12;
    const interestReserve = avgDrawBalance * monthlyRate * this.state.constructionMonths;

    // Base Loan Before Guarantee Fee
    const baseProjectCost = totalDirectCost + contingencyReserve + interestReserve;

    // 3. USDA Guarantee Fees
    // Upfront Guarantee Fee is 1.00% of the loan amount financed
    const upfrontGuaranteeFee = baseProjectCost * USDA_CONSTRUCTION_PARAMS.upfrontGuaranteeFeeRate;
    const totalFinancedLoan = baseProjectCost + upfrontGuaranteeFee;

    // 4. Monthly Amortization (30-year fixed)
    const n = 360;
    const r = monthlyRate;
    const monthlyPrincipalInterest = (totalFinancedLoan * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);

    // USDA Annual Guarantee Fee (0.35% divided by 12)
    const monthlyUSDAAnnualFee = (totalFinancedLoan * USDA_CONSTRUCTION_PARAMS.annualGuaranteeFeeRate) / 12;

    // Taxes & Insurance
    const monthlyTaxes = (totalFinancedLoan * (this.state.annualPropertyTaxRate / 100)) / 12;
    const monthlyInsurance = Number(this.state.monthlyInsurance);

    const totalMonthlyPITI = monthlyPrincipalInterest + monthlyUSDAAnnualFee + monthlyTaxes + monthlyInsurance;

    // 5. Conventional & FHA Comparison
    // Conventional requires 20% down on (Land + Construction)
    const convDownPayment = totalDirectCost * 0.20;
    const convLoanAmount = totalDirectCost * 0.80;
    const convPI = (convLoanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    const convPITI = convPI + monthlyTaxes + monthlyInsurance;

    // FHA requires 3.5% down + 1.75% upfront MIP + 0.55% annual MIP
    const fhaDownPayment = totalDirectCost * 0.035;
    const fhaBaseLoan = totalDirectCost * 0.965;
    const fhaUpfrontMIP = fhaBaseLoan * 0.0175;
    const fhaTotalLoan = fhaBaseLoan + fhaUpfrontMIP;
    const fhaPI = (fhaTotalLoan * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    const fhaMonthlyMIP = (fhaTotalLoan * 0.0055) / 12;
    const fhaPITI = fhaPI + fhaMonthlyMIP + monthlyTaxes + monthlyInsurance;

    return {
      landCost,
      homeBuildCost,
      totalSitePrep,
      softCosts,
      directConstructionCost,
      totalDirectCost,
      contingencyReserve,
      interestReserve,
      baseProjectCost,
      upfrontGuaranteeFee,
      totalFinancedLoan,
      monthlyPrincipalInterest,
      monthlyUSDAAnnualFee,
      monthlyTaxes,
      monthlyInsurance,
      totalMonthlyPITI,
      // Comparisons
      convDownPayment,
      convLoanAmount,
      convPITI,
      fhaDownPayment,
      fhaTotalLoan,
      fhaPITI
    };
  }

  render() {
    const r = this.calculate();

    this.container.innerHTML = `
      <div class="calc-layout-grid">
        <!-- Input Form -->
        <div class="calc-card-inputs">
          <div class="card-header-flex">
            <div>
              <h3 class="card-title">USDA Single-Close 0%-Down Construction Modeler</h3>
              <p class="card-subtitle">Finances Lot Purchase + Custom Cabin Build + Site Work in ONE Closing</p>
            </div>
            <span class="zero-down-pill">Zero Down Payment</span>
          </div>

          <!-- 1. Land & Lot -->
          <div class="form-section">
            <div class="section-heading-flex">
              <h4 class="section-heading">1. Land / Lot Acquisition</h4>
              <label class="custom-checkbox-label">
                <input type="checkbox" id="calc-own-land" ${this.state.alreadyOwnLand ? 'checked' : ''} />
                <span>I already own / inherited the lot ($0)</span>
              </label>
            </div>

            <div class="form-group" style="${this.state.alreadyOwnLand ? 'opacity: 0.5; pointer-events: none;' : ''}">
              <label for="calc-land-price">Target Lot Purchase Price ($)</label>
              <input type="number" id="calc-land-price" value="${this.state.landPrice}" step="1000" class="form-input" />
              <span class="field-calc-note">Typical 1-3 acre rural lot in Dawson / Lumpkin: $35,000 - $55,000</span>
            </div>
          </div>

          <!-- 2. Home Architecture & Build Quality -->
          <div class="form-section">
            <h4 class="section-heading">2. Home Specs & Turnkey Builder Rates</h4>
            <div class="preset-rates-flex">
              <button class="preset-rate-btn ${this.state.buildType === 'modular' ? 'active' : ''}" data-type="modular" data-rate="155">
                Modern Modular Prefab ($155/sqft)
              </button>
              <button class="preset-rate-btn ${this.state.buildType === 'craftsman-cabin' ? 'active' : ''}" data-type="craftsman-cabin" data-rate="185">
                Mountain Craftsman Cabin ($185/sqft)
              </button>
              <button class="preset-rate-btn ${this.state.buildType === 'timber-frame' ? 'active' : ''}" data-type="timber-frame" data-rate="225">
                Custom Timber / Log ($225/sqft)
              </button>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label for="calc-sqft">Heated Living Space (Sq Ft)</label>
                <input type="number" id="calc-sqft" value="${this.state.homeSqFt}" step="50" class="form-input" />
              </div>

              <div class="form-group">
                <label for="calc-rate-sqft">Turnkey Builder Rate ($/Sq Ft)</label>
                <input type="number" id="calc-rate-sqft" value="${this.state.buildRateSqFt}" step="5" class="form-input" />
              </div>
            </div>
          </div>

          <!-- 3. Rural Infrastructure & Site Work -->
          <div class="form-section">
            <div class="section-heading-flex">
              <h4 class="section-heading">3. Rural Site Preparation & Utilities</h4>
              <span class="subtotal-indicator">Site Total: $${r.totalSitePrep.toLocaleString()}</span>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label for="calc-site-septic">Septic Tank & Drainfield Perc</label>
                <input type="number" id="calc-site-septic" value="${this.state.sitePrep.septic}" step="500" class="form-input" />
              </div>

              <div class="form-group">
                <label for="calc-site-well">Drilled Deep Well / Water Meter</label>
                <input type="number" id="calc-site-well" value="${this.state.sitePrep.wellOrWater}" step="500" class="form-input" />
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label for="calc-site-grading">Lot Clearing, Grading & Gravel Drive</label>
                <input type="number" id="calc-site-grading" value="${this.state.sitePrep.gradingDriveway}" step="500" class="form-input" />
              </div>

              <div class="form-group">
                <label for="calc-site-power">Electric Service Line & Temp Pole</label>
                <input type="number" id="calc-site-power" value="${this.state.sitePrep.powerUtility}" step="250" class="form-input" />
              </div>
            </div>
          </div>

          <!-- 4. Soft Costs & Loan Settings -->
          <div class="form-section">
            <h4 class="section-heading">4. Architectural Soft Costs & Mortgage Terms</h4>
            <div class="form-row-3">
              <div class="form-group">
                <label for="calc-soft-costs">Architect / Permits ($)</label>
                <input type="number" id="calc-soft-costs" value="${this.state.softCosts}" step="500" class="form-input" />
              </div>

              <div class="form-group">
                <label for="calc-interest-rate">Interest Rate (%)</label>
                <input type="number" id="calc-interest-rate" value="${this.state.interestRate}" step="0.125" class="form-input" />
              </div>

              <div class="form-group">
                <label for="calc-build-months">Build Duration (Months)</label>
                <input type="number" id="calc-build-months" value="${this.state.constructionMonths}" min="4" max="12" class="form-input" />
              </div>
            </div>
          </div>
        </div>

        <!-- Output & Pro-Forma Summary Card -->
        <div class="calc-card-results" id="calc-results-panel">
          ${this.renderResultsPanel(r)}
        </div>
      </div>
    `;
  }

  renderResultsPanel(r) {
    return `
      <!-- Hero Stat Card -->
      <div class="hero-loan-banner">
        <div class="hero-loan-header">
          <span>Total USDA Single-Close Financed Loan</span>
          <span class="badge-zero-down">0% Down Payment</span>
        </div>
        <div class="hero-loan-amount">$${Math.round(r.totalFinancedLoan).toLocaleString()}</div>
        <div class="hero-cash-close">
          Cash Required at Closing Table: <strong class="text-emerald">$0.00</strong>
        </div>
      </div>

      <!-- Monthly Payment Breakdown -->
      <div class="monthly-piti-box">
        <div class="piti-header">
          <span>Estimated Monthly Housing (PITI)</span>
          <span class="piti-total">$${Math.round(r.totalMonthlyPITI).toLocaleString()} <small>/month</small></span>
        </div>
        <div class="piti-breakdown-list">
          <div class="piti-item">
            <span>Principal & Interest (30-Yr Fixed @ ${this.state.interestRate}%)</span>
            <strong>$${Math.round(r.monthlyPrincipalInterest).toLocaleString()}</strong>
          </div>
          <div class="piti-item">
            <span>USDA Annual Fee (0.35% Escrow)</span>
            <strong>$${Math.round(r.monthlyUSDAAnnualFee).toLocaleString()}</strong>
          </div>
          <div class="piti-item">
            <span>Real Estate Property Taxes</span>
            <strong>$${Math.round(r.monthlyTaxes).toLocaleString()}</strong>
          </div>
          <div class="piti-item">
            <span>Hazard / Homeowners Insurance</span>
            <strong>$${Math.round(r.monthlyInsurance).toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <!-- Construction Draw & Escrow Schedule -->
      <div class="proforma-table-card">
        <h4 class="proforma-title">Single-Close Escrow & Draw Architecture</h4>
        <div class="proforma-rows">
          <div class="proforma-row">
            <span>Land Acquisition</span>
            <span>$${r.landCost.toLocaleString()}</span>
          </div>
          <div class="proforma-row">
            <span>Turnkey Home Construction (${this.state.homeSqFt} sq.ft @ $${this.state.buildRateSqFt}/sq.ft)</span>
            <span>$${r.homeBuildCost.toLocaleString()}</span>
          </div>
          <div class="proforma-row">
            <span>Site Infrastructure & Utilities</span>
            <span>$${r.totalSitePrep.toLocaleString()}</span>
          </div>
          <div class="proforma-row">
            <span>Architectural, Engineering & Permit Fees</span>
            <span>$${r.softCosts.toLocaleString()}</span>
          </div>
          <div class="proforma-row highlight-row">
            <span>+ 10% Mandatory Construction Contingency Reserve</span>
            <span class="text-amber">+$${Math.round(r.contingencyReserve).toLocaleString()}</span>
          </div>
          <div class="proforma-row highlight-row">
            <span>+ Financed Construction Interest Reserve (${this.state.constructionMonths} Mos.)</span>
            <span class="text-blue">+$${Math.round(r.interestReserve).toLocaleString()}</span>
          </div>
          <div class="proforma-row highlight-row">
            <span>+ USDA Upfront Guarantee Fee (1.00% Financed)</span>
            <span class="text-purple">+$${Math.round(r.upfrontGuaranteeFee).toLocaleString()}</span>
          </div>
          <div class="proforma-row total-proforma-row">
            <span>Total Financed Note (100% LTV)</span>
            <span class="text-emerald">$${Math.round(r.totalFinancedLoan).toLocaleString()}</span>
          </div>
        </div>
        <div class="proforma-footnote">
          ℹ️ <strong>Why the Interest Reserve is Huge:</strong> During the ${this.state.constructionMonths}-month build, the bank draws payments from the reserve account. You make ZERO double mortgage payments while your home is being built!
        </div>
      </div>

      <!-- 3-Way Loan Comparison Matrix -->
      <div class="comparison-matrix-card">
        <h4 class="proforma-title">Financing Comparison: USDA vs Conventional vs FHA</h4>
        <table class="compare-table">
          <thead>
            <tr>
              <th>Loan Program</th>
              <th>Cash Down Payment</th>
              <th>Upfront Fees</th>
              <th>Est. Monthly PITI</th>
            </tr>
          </thead>
          <tbody>
            <tr class="highlight-table-row">
              <td><strong>USDA Single-Close</strong></td>
              <td class="text-emerald font-bold">$0.00 (0%)</td>
              <td>1.0% (Financed)</td>
              <td class="text-emerald font-bold">$${Math.round(r.totalMonthlyPITI).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Conventional Construction</td>
              <td class="text-rose font-bold">$${Math.round(r.convDownPayment).toLocaleString()} (20%)</td>
              <td>2 Closings Fees</td>
              <td>$${Math.round(r.convPITI).toLocaleString()}</td>
            </tr>
            <tr>
              <td>FHA 203(k) / One-Time</td>
              <td class="text-amber font-bold">$${Math.round(r.fhaDownPayment).toLocaleString()} (3.5%)</td>
              <td>1.75% Upfront</td>
              <td>$${Math.round(r.fhaPITI).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  attachEvents() {
    this.container.addEventListener('input', (e) => {
      const id = e.target.id;
      if (id === 'calc-land-price') this.state.landPrice = Number(e.target.value);
      else if (id === 'calc-sqft') this.state.homeSqFt = Number(e.target.value);
      else if (id === 'calc-rate-sqft') {
        this.state.buildRateSqFt = Number(e.target.value);
        this.state.buildType = 'custom';
      }
      else if (id === 'calc-site-septic') this.state.sitePrep.septic = Number(e.target.value);
      else if (id === 'calc-site-well') this.state.sitePrep.wellOrWater = Number(e.target.value);
      else if (id === 'calc-site-grading') this.state.sitePrep.gradingDriveway = Number(e.target.value);
      else if (id === 'calc-site-power') this.state.sitePrep.powerUtility = Number(e.target.value);
      else if (id === 'calc-soft-costs') this.state.softCosts = Number(e.target.value);
      else if (id === 'calc-interest-rate') this.state.interestRate = Number(e.target.value);
      else if (id === 'calc-build-months') this.state.constructionMonths = Number(e.target.value);

      this.calculateAndRefresh();
    });

    this.container.addEventListener('change', (e) => {
      if (e.target.id === 'calc-own-land') {
        this.state.alreadyOwnLand = e.target.checked;
        this.render();
        this.attachEvents();
      }
    });

    this.container.addEventListener('click', (e) => {
      const btn = e.target.closest('.preset-rate-btn');
      if (btn) {
        const rate = Number(btn.getAttribute('data-rate'));
        const type = btn.getAttribute('data-type');
        this.state.buildRateSqFt = rate;
        this.state.buildType = type;
        const rateInput = document.getElementById('calc-rate-sqft');
        if (rateInput) rateInput.value = rate;
        this.container.querySelectorAll('.preset-rate-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.calculateAndRefresh();
      }
    });
  }

  calculateAndRefresh() {
    const r = this.calculate();
    const panel = document.getElementById('calc-results-panel');
    if (panel) {
      panel.innerHTML = this.renderResultsPanel(r);
    }
    const siteInd = this.container.querySelector('.subtotal-indicator');
    if (siteInd) {
      siteInd.textContent = `Site Total: $${r.totalSitePrep.toLocaleString()}`;
    }
    // Dispatch event so deal packet generator stays up to date
    window.dispatchEvent(new CustomEvent('usda-calc-updated', { detail: { state: this.state, results: r } }));
  }
}
