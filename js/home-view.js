// Home Overview View: Live Project KPI Cards, Next Useful Action & Status
export class USDAHomeView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="home-view-layout">
        <!-- Top Project Status Banner -->
        <div class="glass-hero-card">
          <div class="hero-status-top">
            <span class="status-badge-glass badge-green">● PROJECT ACTIVE · UNDERWRITING DRAFT</span>
            <span class="project-tag-glass">Target: Dawson County, GA · Upper Lake Lanier Basin</span>
          </div>

          <div class="hero-body-flex">
            <div>
              <h1 class="hero-title-glass">North Georgia Rural Cabin Single-Close Workspace</h1>
              <p class="hero-subtext-glass">
                Active Section 502 Guaranteed 100% financing pipeline. Zero down payment on 2.0-acre rural lot acquisition and custom craftsman build.
              </p>
            </div>
            <div class="hero-actions-flex">
              <button class="btn-glass-primary" id="btn-home-launch-ai">
                <span>🤖</span> Launch AI Workflow
              </button>
              <button class="btn-glass-secondary" id="btn-home-download-pdf">
                <span>📄</span> Download Dossier PDF
              </button>
            </div>
          </div>

          <!-- Obvious Next Useful Action Banner -->
          <div class="next-action-strip">
            <div class="next-action-icon">⚡</div>
            <div class="next-action-text">
              <span class="next-action-label">RECOMMENDED NEXT ACTION:</span>
              <span class="next-action-desc">Verify general contractor license credentials and authorize Section 502 submission packet compilation in the AI Workspace.</span>
            </div>
            <button class="btn-action-jump" id="btn-home-go-action">Take Action →</button>
          </div>
        </div>

        <!-- 4 Layered 3D Liquid-Glass KPI Cards -->
        <div class="kpi-cards-grid">
          <div class="kpi-card-3d">
            <div class="kpi-header">
              <span class="kpi-label">TOTAL FINANCED NOTE</span>
              <span class="kpi-pill pill-emerald">100% LTV</span>
            </div>
            <div class="kpi-value font-emerald">$440,486</div>
            <div class="kpi-sub">
              <span>Down Payment Required:</span>
              <strong class="font-emerald">$0.00 (Zero Down)</strong>
            </div>
            <div class="kpi-footer-note">Includes lot + build + 10% contingency + interest reserve</div>
          </div>

          <div class="kpi-card-3d">
            <div class="kpi-header">
              <span class="kpi-label">MONTHLY HOUSING (PITI)</span>
              <span class="kpi-pill pill-blue">30-Yr Fixed</span>
            </div>
            <div class="kpi-value font-blue">$2,890 <small>/mo</small></div>
            <div class="kpi-sub">
              <span>Principal & Interest:</span>
              <strong>$2,284 / mo</strong>
            </div>
            <div class="kpi-footer-note">Includes 0.35% annual fee escrow, taxes & insurance</div>
          </div>

          <div class="kpi-card-3d">
            <div class="kpi-header">
              <span class="kpi-label">USDA ADJUSTED INCOME</span>
              <span class="kpi-pill pill-purple">HB-1-3555</span>
            </div>
            <div class="kpi-value font-purple">$129,040</div>
            <div class="kpi-sub">
              <span>County 1-4 Cap:</span>
              <strong class="font-emerald">$135,500 (Passed)</strong>
            </div>
            <div class="kpi-footer-note">-$12,960 sheltered legally via minor & daycare deductions</div>
          </div>

          <div class="kpi-card-3d">
            <div class="kpi-header">
              <span class="kpi-label">UNDERWRITING GATES</span>
              <span class="kpi-pill pill-emerald">4 of 4 Ready</span>
            </div>
            <div class="kpi-value font-emerald">100% Passed</div>
            <div class="kpi-sub">
              <span>USACE Shoreline:</span>
              <strong>Outside 1,070-ft buffer</strong>
            </div>
            <div class="kpi-footer-note">Primary residence certified · Modest dwelling compliant</div>
          </div>
        </div>

        <!-- 2-Column Split: Active Milestone Roadmap & Recent Document Vault -->
        <div class="home-bottom-grid">
          <!-- Execution Pipeline Progress -->
          <div class="glass-panel-card">
            <div class="panel-header-flex">
              <div>
                <h3 class="panel-title">End-to-End Single-Close Roadmap</h3>
                <p class="panel-subtitle">Current progression through the 5 USDA construction phases</p>
              </div>
              <span class="panel-badge-step">Phase 3 of 5</span>
            </div>

            <div class="pipeline-steps-list">
              <div class="pipeline-step-item step-completed">
                <div class="step-icon-check">✓</div>
                <div class="step-content">
                  <h5>Step 1: Parcel Sourcing & USDA GIS Clearance</h5>
                  <p>Dawsonville / Chestatee River unshaded lot selected (100% eligible, outside USACE flowage line).</p>
                </div>
                <span class="step-date">Completed</span>
              </div>

              <div class="pipeline-step-item step-completed">
                <div class="step-icon-check">✓</div>
                <div class="step-content">
                  <h5>Step 2: Household Income Deduction Audit</h5>
                  <p>Applied $480/child and verified daycare shelter to achieve $129k adjusted income.</p>
                </div>
                <span class="step-date">Completed</span>
              </div>

              <div class="pipeline-step-item step-active">
                <div class="step-icon-active">3</div>
                <div class="step-content">
                  <h5>Step 3: Builder Vetting & Form 3555-SC Dossier</h5>
                  <p>In Review: Builder license, insurance certificate, and itemized takeoff contract.</p>
                </div>
                <span class="step-date text-blue font-bold">In Progress</span>
              </div>

              <div class="pipeline-step-item step-pending">
                <div class="step-icon-pending">4</div>
                <div class="step-content">
                  <h5>Step 4: USDA Single-Close Lender Execution</h5>
                  <p>Submit complete deal packet to USDA-approved lender desk for one-time closing.</p>
                </div>
                <span class="step-date text-dim">Pending</span>
              </div>

              <div class="pipeline-step-item step-pending">
                <div class="step-icon-pending">5</div>
                <div class="step-content">
                  <h5>Step 5: Inspection Draws & Final Move-In</h5>
                  <p>9-month build phase funded via interest reserve. Move in as primary residence.</p>
                </div>
                <span class="step-date text-dim">Pending</span>
              </div>
            </div>
          </div>

          <!-- Quick Access Cards: Secret Hotspots & Documents -->
          <div class="glass-panel-card">
            <div class="panel-header-flex">
              <div>
                <h3 class="panel-title">Quick Operations & Live Documents</h3>
                <p class="panel-subtitle">Access your verified dossier, maps, and regulatory tools</p>
              </div>
            </div>

            <div class="quick-tools-grid">
              <div class="quick-tool-card" id="card-jump-map">
                <div class="tool-icon">🛰️</div>
                <div class="tool-meta">
                  <h4>Satellite & GIS Radar</h4>
                  <p>Inspect North GA parcels, drop GPS pins, and check distance to Lake Lanier & Alpharetta.</p>
                </div>
              </div>

              <div class="quick-tool-card" id="card-jump-calc">
                <div class="tool-icon">🏗️</div>
                <div class="tool-meta">
                  <h4>Single-Close Modeler</h4>
                  <p>Customize build square footage, builder rate per sq.ft, and rural site utilities.</p>
                </div>
              </div>

              <div class="quick-tool-card" id="card-jump-calc-suite">
                <div class="tool-icon">🧮</div>
                <div class="tool-meta">
                  <h4>All 8 Calculators Hub</h4>
                  <p>Direct 1.0% buydowns, CUVA tax squeeze, DTI ratios, milestone draws, and equity cushions.</p>
                </div>
              </div>

              <div class="quick-tool-card" id="card-jump-secrets">
                <div class="tool-icon">💎</div>
                <div class="tool-meta">
                  <h4>Secret Arbitrage Vault</h4>
                  <p>Inspect the 7 codified federal loopholes and top 6 undervalued rural land pockets.</p>
                </div>
              </div>

              <div class="quick-tool-card" id="card-jump-docs">
                <div class="tool-icon">📄</div>
                <div class="tool-meta">
                  <h4>Download Form 3555-SC Dossier</h4>
                  <p>Official 2-page PDF formatted for USDA underwriters and licensed general contractors.</p>
                </div>
              </div>

              <div class="quick-tool-card" id="card-jump-tests">
                <div class="tool-icon">🧪</div>
                <div class="tool-meta">
                  <h4>System Test Runner</h4>
                  <p>17 automated mathematical proofs and live browser assertion audit console.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const jump = (tab) => {
      if (window.usdaApp && window.usdaApp.switchTab) {
        window.usdaApp.switchTab(tab);
      }
    };

    document.getElementById('btn-home-launch-ai')?.addEventListener('click', () => jump('ai-workspace'));
    document.getElementById('btn-home-go-action')?.addEventListener('click', () => jump('ai-workspace'));
    document.getElementById('btn-home-download-pdf')?.addEventListener('click', () => jump('documents'));
    document.getElementById('card-jump-map')?.addEventListener('click', () => jump('map-radar'));
    document.getElementById('card-jump-calc')?.addEventListener('click', () => jump('calc'));
    document.getElementById('card-jump-calc-suite')?.addEventListener('click', () => jump('calc-suite'));
    document.getElementById('card-jump-secrets')?.addEventListener('click', () => jump('secrets-vault'));
    document.getElementById('card-jump-docs')?.addEventListener('click', () => jump('documents'));
    document.getElementById('card-jump-tests')?.addEventListener('click', () => jump('test-runner'));
  }
}
