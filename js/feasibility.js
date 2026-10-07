// Cabin & Construction Feasibility Engine
// USDA HB-1-3555 Chapter 12 & Technical Property Standards

export class USDAFeasibilityMatrix {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.selectedStructure = "modular";
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="feasibility-layout">
        <!-- Top Structure Selector -->
        <div class="feasibility-selector-card">
          <div class="card-header-flex">
            <div>
              <h3 class="card-title">Cabin & Architecture Feasibility Matrix</h3>
              <p class="card-subtitle">Evaluate your build concept against strict USDA Underwriting Standards</p>
            </div>
          </div>

          <div class="structure-cards-grid">
            <div class="structure-card ${this.selectedStructure === 'modular' ? 'active' : ''}" data-type="modular">
              <div class="struct-badge badge-grade-a">Grade A · Ideal</div>
              <div class="struct-icon">🏡</div>
              <h4 class="struct-title">Modern Modular Cabin</h4>
              <p class="struct-desc">Offsite precision built, installed on permanent crawlspace/basement foundation.</p>
              <span class="struct-stat">Approval Speed: 2-3 weeks</span>
            </div>

            <div class="structure-card ${this.selectedStructure === 'stick' ? 'active' : ''}" data-type="stick">
              <div class="struct-badge badge-grade-a">Grade A · Ideal</div>
              <div class="struct-icon">🪵</div>
              <h4 class="struct-title">Stick-Built Craftsman</h4>
              <p class="struct-desc">Traditional site-framed construction with timber/rustic accents.</p>
              <span class="struct-stat">Comps: Readily Available</span>
            </div>

            <div class="structure-card ${this.selectedStructure === 'log' ? 'active' : ''}" data-type="log">
              <div class="struct-badge badge-grade-b">Grade B · High Risk</div>
              <div class="struct-icon">🌲</div>
              <h4 class="struct-title">Traditional Log Kit</h4>
              <p class="struct-desc">Solid timber log home assembled on site from manufacturer kit.</p>
              <span class="struct-stat">Trap: Appraisal Comps</span>
            </div>

            <div class="structure-card ${this.selectedStructure === 'barndo' ? 'active' : ''}" data-type="barndo">
              <div class="struct-badge badge-grade-b">Grade B · Conditional</div>
              <div class="struct-icon">🚜</div>
              <h4 class="struct-title">Barndominium / Steel</h4>
              <p class="struct-desc">Post-frame or engineered steel residence with living quarters.</p>
              <span class="struct-stat">Must be 100% Residential</span>
            </div>

            <div class="structure-card ${this.selectedStructure === 'tiny' ? 'active' : ''}" data-type="tiny">
              <div class="struct-badge badge-grade-f">Grade F · Disqualified</div>
              <div class="struct-icon">🚫</div>
              <h4 class="struct-title">Tiny Home / Off-Grid</h4>
              <p class="struct-desc">Structures <400 sq.ft, container homes, or off-grid solar/rainwater.</p>
              <span class="struct-stat">100% Disqualified</span>
            </div>
          </div>
        </div>

        <!-- Dynamic Structure Audit Breakdown -->
        <div class="audit-details-card" id="structure-audit-panel">
          ${this.renderStructureAudit(this.selectedStructure)}
        </div>

        <!-- The 4 Non-Negotiable USDA Gates -->
        <div class="gates-container">
          <h3 class="gates-header">The 4 Non-Negotiable USDA Construction Gates</h3>

          <div class="gates-grid">
            <!-- Gate 1: Primary Residence -->
            <div class="gate-card">
              <div class="gate-num">01</div>
              <h4 class="gate-title">Primary Residence Mandate</h4>
              <p class="gate-desc">
                <strong>No Airbnb / No Weekender.</strong> You must sign an Affidavit of Intent certifying this will be your principal residence within 60 days of Certificate of Occupancy.
              </p>
              <div class="gate-tip">
                💡 <em>Strategy:</em> You can live in it for 12+ months as your primary home; if career/life changes later require moving, you can legally refinance or lease it out.
              </div>
            </div>

            <!-- Gate 2: Modest Dwelling Rule -->
            <div class="gate-card">
              <div class="gate-num">02</div>
              <h4 class="gate-title">Modest Dwelling Standards</h4>
              <p class="gate-desc">
                USDA rules (HB-1-3555 Ch. 12) mandate that the home must be modest in design, cost, and size relative to the local market.
              </p>
              <ul class="gate-list">
                <li>❌ Prohibits in-ground swimming pools built with loan funds</li>
                <li>❌ Prohibits outbuildings used for commercial/farming ventures</li>
                <li>✔️ Typically 1,200 – 2,200 sq.ft for standard modest builds</li>
              </ul>
            </div>

            <!-- Gate 3: Builder Vetting -->
            <div class="gate-card">
              <div class="gate-num">03</div>
              <h4 class="gate-title">Approved Builder Qualification</h4>
              <p class="gate-desc">
                You cannot act as your own builder ("owner-builder" is prohibited). You must use an approved general contractor meeting:
              </p>
              <ul class="gate-list">
                <li>✔️ Active Georgia GC License (Basic or Light Commercial)</li>
                <li>✔️ Min. 2 years verified custom home track record</li>
                <li>✔️ $1,000,000+ General Liability Insurance + Workers Comp</li>
                <li>✔️ 1-Year Builder Warranty or 10-Year Insured Warranty</li>
              </ul>
            </div>

            <!-- Gate 4: USACE Shoreline & Perc -->
            <div class="gate-card">
              <div class="gate-num">04</div>
              <h4 class="gate-title">USACE & Waterway Protocol</h4>
              <p class="gate-desc">
                For lots near Lake Lanier or rivers, private ownership terminates at the federal boundary (1,070-ft elevation mark):
              </p>
              <ul class="gate-list">
                <li>⚠️ USACE owns shoreline: dock permits are revocable permits</li>
                <li>⚠️ Septic drain fields cannot cross into flowage easements</li>
                <li>✔️ Minimum 100-ft distance between private well and septic tank</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderStructureAudit(type) {
    if (type === 'modular') {
      return `
        <div class="audit-card grade-a-card">
          <div class="audit-header">
            <div>
              <span class="badge-grade-a">USDA RATING: GRADE A (OPTIMAL)</span>
              <h3 class="audit-title">Modern Modular Cabin / Offsite Construction</h3>
            </div>
            <div class="audit-badge-speed">Easiest USDA Underwriting Path</div>
          </div>
          <div class="audit-body">
            <p><strong>Why It Wins:</strong> Offsite modular homes are constructed in climate-controlled factories under Georgia State PBCC / IRC building codes and shipped to the site in modules. When placed on a permanent crawlspace or conditioned basement, USDA underwriters treat them identically to stick-built homes.</p>
            <div class="audit-specs-grid">
              <div class="spec-box">
                <span class="spec-label">Foundation Rule</span>
                <span class="spec-val">Permanent continuous concrete footer / block</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Appraisal Comps</span>
                <span class="spec-val">Uses standard single-family comps (very easy)</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Typical Build Time</span>
                <span class="spec-val">4 - 6 months total (fastest to completion)</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Average Cost</span>
                <span class="spec-val">$145 - $165 / sq.ft turnkey</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'stick') {
      return `
        <div class="audit-card grade-a-card">
          <div class="audit-header">
            <div>
              <span class="badge-grade-a">USDA RATING: GRADE A (OPTIMAL)</span>
              <h3 class="audit-title">Site-Built Craftsman / Timber-Accent Home</h3>
            </div>
            <div class="audit-badge-speed">Universal Lender Acceptance</div>
          </div>
          <div class="audit-body">
            <p><strong>Why It Wins:</strong> Stick-built homes with craftsman styling, timber gables, cedar shingle siding, and stone accents give the aesthetic of an authentic mountain cabin without any of the appraisal or insulation traps of traditional solid log kits.</p>
            <div class="audit-specs-grid">
              <div class="spec-box">
                <span class="spec-label">Foundation Rule</span>
                <span class="spec-val">Permanent crawlspace, slab, or basement</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Appraisal Comps</span>
                <span class="spec-val">Highest comp availability across North GA</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Typical Build Time</span>
                <span class="spec-val">7 - 10 months turnkey</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Average Cost</span>
                <span class="spec-val">$175 - $200 / sq.ft turnkey</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'log') {
      return `
        <div class="audit-card grade-b-card">
          <div class="audit-header">
            <div>
              <span class="badge-grade-b">USDA RATING: GRADE B (HIGH UNDERWRITING RISK)</span>
              <h3 class="audit-title">Traditional Solid Log Cabin Kit</h3>
            </div>
            <div class="audit-badge-speed">Significant Appraisal Risk</div>
          </div>
          <div class="audit-body">
            <p><strong>The Trap You Must Avoid:</strong> Solid log homes frequently stall or die in USDA underwriting for two specific reasons:
            <br>1. <strong>Appraisal Comps:</strong> Fannie Mae and USDA appraisers require at least 2 to 3 closed comparable sales of <em>other log homes</em> within a 5-mile radius within the last 6 months. In places like Dawson or Hall, this is often impossible.
            <br>2. <strong>Energy Code Compliance:</strong> Solid wood logs have low steady-state R-values. They must pass rigorous REScheck / Georgia Energy Code trade-off calculations to be certified as energy efficient.</p>
            <div class="audit-specs-grid">
              <div class="spec-box">
                <span class="spec-label">Recommended Pivot</span>
                <span class="spec-val">Stick-frame with authentic log-profile siding</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Appraisal Comps</span>
                <span class="spec-val">Very difficult in non-resort mountain zones</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Thermal Compliance</span>
                <span class="spec-val">Requires REScheck software certification</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Average Cost</span>
                <span class="spec-val">$210 - $250 / sq.ft turnkey</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'barndo') {
      return `
        <div class="audit-card grade-b-card">
          <div class="audit-header">
            <div>
              <span class="badge-grade-b">USDA RATING: GRADE B (STRICT CONDITIONS)</span>
              <h3 class="audit-title">Barndominium / Steel Residential Frame</h3>
            </div>
            <div class="audit-badge-speed">Requires Engineered Specs</div>
          </div>
          <div class="audit-body">
            <p><strong>The Rules:</strong> Barndominiums are allowed under USDA Single-Close ONLY if:
            <br>1. The structure is 100% residential living quarters (no mixed-use automotive repair shops, commercial barns, or oversized shop wings).
            <br>2. Poured continuous foundation with certified structural engineering drawings.
            <br>3. Interior finishes match standard residential modest housing.</p>
            <div class="audit-specs-grid">
              <div class="spec-box">
                <span class="spec-label">Foundation Rule</span>
                <span class="spec-val">Engineered concrete monolithic slab / footers</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Commercial Restriction</span>
                <span class="spec-val">Zero commercial operations permitted</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Typical Build Time</span>
                <span class="spec-val">6 - 8 months</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Average Cost</span>
                <span class="spec-val">$150 - $180 / sq.ft turnkey</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'tiny') {
      return `
        <div class="audit-card grade-f-card">
          <div class="audit-header">
            <div>
              <span class="badge-grade-f">USDA RATING: GRADE F (DISQUALIFIED)</span>
              <h3 class="audit-title">Tiny Home, Container Home, or Off-Grid Shack</h3>
            </div>
            <div class="audit-badge-speed">Not Eligible for Section 502</div>
          </div>
          <div class="audit-body">
            <p><strong>Why It Fails:</strong> USDA Section 502 exists to provide "decent, safe, and sanitary" long-term modest single-family dwellings that retain market equity.
            <br>• Structures on wheels or temporary skids are 100% prohibited.
            <br>• Off-grid setups (solar-only with no utility hookup, rainwater-only catchments) fail USDA sanitary guidelines.
            <br>• Homes under 400 - 600 sq.ft generally lack conforming appraisal comps in Georgia county tax digests.</p>
            <div class="audit-specs-grid">
              <div class="spec-box">
                <span class="spec-label">Utility Mandate</span>
                <span class="spec-val">Permanent electric + approved septic + well/water</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Permanent Anchor</span>
                <span class="spec-val">Must be permanently affixed real property</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Alternative Loan</span>
                <span class="spec-val">Personal loan or cash financing only</span>
              </div>
              <div class="spec-box">
                <span class="spec-label">Verdict</span>
                <span class="spec-val">Upgrade to 1,000+ sq.ft Modular Cabin</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  attachEvents() {
    this.container.addEventListener('click', (e) => {
      const card = e.target.closest('.structure-card');
      if (card) {
        const type = card.getAttribute('data-type');
        this.selectedStructure = type;
        this.container.querySelectorAll('.structure-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const auditPanel = document.getElementById('structure-audit-panel');
        if (auditPanel) {
          auditPanel.innerHTML = this.renderStructureAudit(type);
        }
      }
    });
  }
}
