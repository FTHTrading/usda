// USDA Deal Packet Generator: Institutional Lender & Builder Submission Summary

export class USDADealPacket {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentData = {
      countyName: "Dawson County, GA",
      householdSize: 4,
      grossIncome: 142000,
      adjustedIncome: 129040,
      incomeCeiling: 135500,
      loanAmount: 382450,
      monthlyPITI: 2510,
      landCost: 42000,
      buildCost: 305250,
      siteCost: 33500,
      interestRate: 6.25,
      buildType: "Modern Mountain Craftsman Cabin",
      contingencyReserve: 34575,
      interestReserve: 13800
    };
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();

    window.addEventListener('usda-calc-updated', (e) => {
      const { state, results } = e.detail;
      this.currentData.loanAmount = Math.round(results.totalFinancedLoan);
      this.currentData.monthlyPITI = Math.round(results.totalMonthlyPITI);
      this.currentData.landCost = results.landCost;
      this.currentData.buildCost = results.homeBuildCost;
      this.currentData.siteCost = results.totalSitePrep;
      this.currentData.interestRate = state.interestRate;
      this.currentData.contingencyReserve = Math.round(results.contingencyReserve);
      this.currentData.interestReserve = Math.round(results.interestReserve);
      this.render();
    });

    window.addEventListener('usda-county-changed', (e) => {
      this.currentData.countyName = `${e.detail.name}, GA`;
      this.currentData.incomeCeiling = e.detail.incomeCap1to4;
      this.render();
    });
  }

  render() {
    const d = this.currentData;
    this.container.innerHTML = `
      <div class="deal-packet-wrapper">
        <div class="packet-toolbar no-print">
          <div>
            <h3>USDA Section 502 Single-Close Submission Dossier</h3>
            <p>Ready for presentation to USDA-approved lender underwriters and licensed general contractors.</p>
          </div>
          <button id="btn-print-packet" class="btn-print">🖨️ Print / Save as PDF Deal Packet</button>
        </div>

        <!-- The Printable Document Container -->
        <div class="printable-document">
          <div class="doc-header">
            <div class="doc-seal">🏛️ USDA RURAL HOUSING SERVICE</div>
            <div class="doc-meta">
              <span class="doc-id">FORM 3555-SC PRO-FORMA DOSSIER</span>
              <span class="doc-date">Generated: ${new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div class="doc-title-block">
            <h1>SECTION 502 GUARANTEED SINGLE-CLOSE CONSTRUCTION PACKET</h1>
            <p class="doc-subtitle">100% LTV Zero-Down Land Acquisition & Custom Single-Family Residential Build</p>
          </div>

          <!-- Section 1: Property & Borrower Location -->
          <div class="doc-section">
            <h3 class="doc-section-title">1. Geographic & Location Qualification</h3>
            <div class="doc-grid-2">
              <div class="doc-data-row">
                <span class="data-k">Target Jurisdiction:</span>
                <span class="data-v">${d.countyName}</span>
              </div>
              <div class="doc-data-row">
                <span class="data-k">USDA Eligibility Status:</span>
                <span class="data-v text-emerald font-bold">ELIGIBLE RURAL AREA</span>
              </div>
              <div class="doc-data-row">
                <span class="data-k">Intended Use:</span>
                <span class="data-v font-bold">Primary Residence (Owner-Occupied)</span>
              </div>
              <div class="doc-data-row">
                <span class="data-k">Waterway & Shoreline Check:</span>
                <span class="data-v">Conforms with USACE 1,070-ft buffer & setbacks</span>
              </div>
            </div>
          </div>

          <!-- Section 2: Income & Household Demographics -->
          <div class="doc-section">
            <h3 class="doc-section-title">2. Household Income & Statutory Deduction Audit</h3>
            <div class="doc-grid-2">
              <div class="doc-data-row">
                <span class="data-k">Household Size:</span>
                <span class="data-v">${d.householdSize} Persons</span>
              </div>
              <div class="doc-data-row">
                <span class="data-k">Gross Household Income:</span>
                <span class="data-v">$${d.grossIncome.toLocaleString()}</span>
              </div>
              <div class="doc-data-row">
                <span class="data-k">Adjusted USDA Income:</span>
                <span class="data-v font-bold text-emerald">$${d.adjustedIncome.toLocaleString()}</span>
              </div>
              <div class="doc-data-row">
                <span class="data-k">County Ceiling (115% AMI):</span>
                <span class="data-v font-bold">$${d.incomeCeiling.toLocaleString()}</span>
              </div>
            </div>
            <p class="doc-note">
              *Adjusted annual income meets USDA HB-1-3555 guidelines following allowable dependent and childcare statutory deductions.
            </p>
          </div>

          <!-- Section 3: Financial Pro-Forma & Single-Close Architecture -->
          <div class="doc-section">
            <h3 class="doc-section-title">3. Construction-to-Permanent Loan Pro-Forma</h3>
            <table class="doc-table">
              <thead>
                <tr>
                  <th>Budget Category</th>
                  <th>Amount</th>
                  <th>Financing Ratio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Land / Lot Acquisition</td>
                  <td>$${d.landCost.toLocaleString()}</td>
                  <td>100% Financed</td>
                </tr>
                <tr>
                  <td>Turnkey Home Construction (${d.buildType})</td>
                  <td>$${d.buildCost.toLocaleString()}</td>
                  <td>100% Financed</td>
                </tr>
                <tr>
                  <td>Rural Site Infrastructure (Septic, Well, Grading, Utilities)</td>
                  <td>$${d.siteCost.toLocaleString()}</td>
                  <td>100% Financed</td>
                </tr>
                <tr>
                  <td>Mandatory 10% Construction Contingency Escrow</td>
                  <td>$${d.contingencyReserve.toLocaleString()}</td>
                  <td>Escrowed / Financed</td>
                </tr>
                <tr>
                  <td>Financed Construction Interest Reserve</td>
                  <td>$${d.interestReserve.toLocaleString()}</td>
                  <td>No Payments During Build</td>
                </tr>
                <tr class="doc-table-total">
                  <td><strong>TOTAL 100% FINANCED NOTE (SINGLE-CLOSE)</strong></td>
                  <td><strong class="text-emerald">$${d.loanAmount.toLocaleString()}</strong></td>
                  <td><strong>100.0% LTV</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Section 4: Underwriting Terms & Borrower Benefit -->
          <div class="doc-section">
            <h3 class="doc-section-title">4. Mortgage Payment & Execution Terms</h3>
            <div class="doc-grid-3">
              <div class="doc-stat-card">
                <span class="stat-lbl">Down Payment Required</span>
                <span class="stat-num text-emerald">$0.00 (0%)</span>
              </div>
              <div class="doc-stat-card">
                <span class="stat-lbl">Permanent Interest Rate</span>
                <span class="stat-num">${d.interestRate}% 30-Yr Fixed</span>
              </div>
              <div class="doc-stat-card">
                <span class="stat-lbl">Estimated Monthly PITI</span>
                <span class="stat-num">$${d.monthlyPITI.toLocaleString()} / mo</span>
              </div>
            </div>
          </div>

          <!-- Section 5: Statutory Certifications & Signatures -->
          <div class="doc-section doc-certifications">
            <h3 class="doc-section-title">5. Applicant & General Contractor Certifications</h3>
            <div class="cert-block">
              <p><strong>Applicant Acknowledgment:</strong> I/We hereby certify that the dwelling described herein will be occupied as our primary residence within 60 days of Certificate of Occupancy issuance, and will not be operated as a short-term rental, timeshare, or recreational property.</p>
              <div class="sig-lines">
                <div class="sig-line">
                  <div class="sig-rule"></div>
                  <span>Applicant Signature & Date</span>
                </div>
                <div class="sig-line">
                  <div class="sig-rule"></div>
                  <span>Co-Applicant Signature & Date</span>
                </div>
              </div>
            </div>

            <div class="cert-block">
              <p><strong>Approved General Contractor:</strong> The general contractor certifies active licensure in the State of Georgia, $1,000,000+ general liability coverage, and provision of a 1-year builder warranty conforming with USDA HB-1-3555 Chapter 12 requirements.</p>
              <div class="sig-lines">
                <div class="sig-line">
                  <div class="sig-rule"></div>
                  <span>Licensed General Contractor Signature & GA License #</span>
                </div>
                <div class="sig-line">
                  <div class="sig-rule"></div>
                  <span>USDA Approved Lending Officer Signature & NMLS #</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.container.addEventListener('click', (e) => {
      if (e.target.id === 'btn-print-packet') {
        window.print();
      }
    });
  }
}
