// Master Project Overview View: Single Project Record Dashboard
// Displays: Current stage, next action, party-and-authority record, budget/timeline, permit status, carbon status, and blockers.
import { PROJECT_RECORD } from '../data/project-record.js';

export class USDAProjectOverviewView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.record = PROJECT_RECORD;
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    const isNew = this.record.projectType === 'NEW_CONSTRUCTION';

    this.container.innerHTML = `
      <div class="project-overview-layout">
        <!-- Top Project Context Bar with Scope Toggle -->
        <div class="glass-hero-card">
          <div class="hero-status-top">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="status-badge-glass badge-green">● SINGLE PROJECT RECORD ACTIVE</span>
              <span class="project-tag-glass">${this.record.id}</span>
            </div>
            <!-- Project Type Scope Toggle -->
            <div class="project-scope-toggle-group">
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-right: 0.4rem;">Scope:</span>
              <button class="scope-toggle-btn ${isNew ? 'active' : ''}" id="btn-toggle-new-build">
                🌲 New Construction
              </button>
              <button class="scope-toggle-btn ${!isNew ? 'active' : ''}" id="btn-toggle-renovation">
                🔨 Major Renovation / Retrofit
              </button>
            </div>
          </div>

          <div class="hero-body-flex" style="margin-top: 1rem;">
            <div style="display: flex; align-items: flex-start; gap: 1rem;">
              <div class="hero-brand-crest" style="display: flex; gap: 0.5rem; flex-shrink: 0;">
                <img src="assets/brand/3fs-logo.svg" alt="3FS Logo" style="width: 52px; height: 52px; border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.06); background: #f7f7f4;" />
                <img src="assets/brand/usda-rd-seal.svg" alt="USDA RD Seal" style="width: 52px; height: 52px; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />
              </div>
              <div>
                <h1 class="hero-title-glass" style="font-size: 1.65rem;">${this.record.name}</h1>
                <p class="hero-subtext-glass" style="margin-top: 0.25rem;">
                  📍 ${this.record.address} · Parcel ${this.record.parcelId} (${this.record.lotAcreage} Acres) · ${this.record.buildingUse}
                </p>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.4rem; font-size: 0.72rem; color: var(--text-dim); flex-wrap: wrap;">
                  <span style="font-weight: 700; color: #a30d22; font-family: var(--font-mono);">3FS OPERATING ENGINE</span>
                  <span>·</span>
                  <span>USDA Section 502 Single-Close</span>
                  <span>·</span>
                  <span style="display: inline-flex; align-items: center; gap: 0.3rem;">
                    <img src="assets/brand/gate-mark-flat.svg" alt="Gate" style="width: 14px; height: 14px;" />
                    <span>UnyKorn RWA Rails</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="hero-actions-flex">
              <button class="btn-glass-primary" id="btn-overview-ai-copilot">
                <span>🤖</span> AI Project Workflow
              </button>
              <button class="btn-glass-secondary" id="btn-overview-download-brief">
                <span>📄</span> Export Project Brief PDF
              </button>
            </div>
          </div>

          <!-- Consequential Next Useful Action Banner -->
          <div class="next-action-strip" style="margin-top: 1.25rem;">
            <div class="next-action-icon">⚡</div>
            <div class="next-action-text">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="next-action-label">CURRENT STAGE: ${this.record.currentStage}</span>
                <span class="status-badge-glass badge-amber" style="font-size: 0.68rem;">Urgency: ${this.record.nextAction.urgency}</span>
              </div>
              <span class="next-action-desc" style="margin-top: 0.2rem; font-weight: 600;">
                MUST HAPPEN NEXT: ${this.record.nextAction.title}
              </span>
              <small style="color: var(--text-dim); display: block; margin-top: 0.15rem;">
                Owner: <strong>${this.record.nextAction.owner}</strong> · Target: <strong>${this.record.nextAction.deadline}</strong> · Blockers: <strong>${this.record.nextAction.blockersCount} awaiting resolution</strong>
              </small>
            </div>
            <button class="btn-action-jump" id="btn-overview-take-action">Resolve Action →</button>
          </div>
        </div>

        <!-- 6 Core Dimension KPI Cards -->
        <div class="kpi-cards-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
          <!-- 1. Party & Ownership -->
          <div class="kpi-card-3d">
            <div class="kpi-header">
              <span class="kpi-label">APPLICANT & OWNER RECORD</span>
              <span class="kpi-pill pill-emerald">Verified Deed</span>
            </div>
            <div class="kpi-value" style="font-size: 1.2rem; color: var(--text-primary);">${this.record.parties.owner.name}</div>
            <div class="kpi-sub">
              <span>Entity:</span>
              <strong>${this.record.parties.owner.entity}</strong>
            </div>
            <div class="kpi-sub" style="margin-top: 0.2rem;">
              <span>Authorized Agent:</span>
              <strong>${this.record.parties.authorizedAgent.name}</strong>
            </div>
            <div class="kpi-footer-note">Full Principal Authority · No unauthorized spending allowed</div>
          </div>

          <!-- 2. Budget & 0% Down Funding -->
          <div class="kpi-card-3d">
            <div class="kpi-header">
              <span class="kpi-label">TOTAL FINANCED NOTE</span>
              <span class="kpi-pill pill-emerald">100% LTV Note</span>
            </div>
            <div class="kpi-value font-emerald">$${Math.round(this.record.costsAndFunding.totalFinancedNote).toLocaleString()}</div>
            <div class="kpi-sub">
              <span>Borrower Cash at Close:</span>
              <strong class="font-emerald">$0.00 (Zero Down)</strong>
            </div>
            <div class="kpi-sub" style="margin-top: 0.2rem;">
              <span>Monthly Housing PITI:</span>
              <strong>$${this.record.costsAndFunding.monthlyPITI} / mo</strong>
            </div>
            <div class="kpi-footer-note">USDA Sec 502 · Equity cushion absorbs closing fees</div>
          </div>

          <!-- 3. Building Codes Matrix -->
          <div class="kpi-card-3d">
            <div class="kpi-header">
              <span class="kpi-label">BUILDING CODES STATUS</span>
              <span class="kpi-pill pill-blue">GA Minimum Std</span>
            </div>
            <div class="kpi-value font-blue">6 of 7 Compliant</div>
            <div class="kpi-sub">
              <span>Jurisdiction:</span>
              <strong>${this.record.buildingCodesMatrix.jurisdictionName}</strong>
            </div>
            <div class="kpi-sub" style="margin-top: 0.2rem;">
              <span>Missing Evidence:</span>
              <strong class="font-amber">1 Item (Footing Letter)</strong>
            </div>
            <div class="kpi-footer-note">2018 IRC/IBC + GA Energy Code · PE stamp required</div>
          </div>

          <!-- 4. Carbon & Net-Zero Target -->
          <div class="kpi-card-3d">
            <div class="kpi-header">
              <span class="kpi-label">CARBON & NET-ZERO TARGET</span>
              <span class="kpi-pill pill-purple">Modeled Target</span>
            </div>
            <div class="kpi-value font-purple">18.4 EUI <small>(61.8% Cut)</small></div>
            <div class="kpi-sub">
              <span>Standard:</span>
              <strong>DOE Zero Emissions / ZEB</strong>
            </div>
            <div class="kpi-sub" style="margin-top: 0.2rem;">
              <span>Solar Offset:</span>
              <strong class="font-emerald">155% Annual Net Exporter</strong>
            </div>
            <div class="kpi-footer-note">Strict claim: Modeled to target · No fake green badge</div>
          </div>
        </div>

        <!-- 2-Column Split: Party & Authority Record + Critical Blockers & Approvals -->
        <div class="home-bottom-grid" style="margin-top: 1.5rem;">
          <!-- Left: Party & Authority Record Table -->
          <div class="glass-panel-card">
            <div class="panel-header-flex">
              <div>
                <h3 class="panel-title">Party & Authority Record: Who is Applying</h3>
                <p class="panel-subtitle">Dedicated register of legal roles, authority limits, and credentials</p>
              </div>
              <span class="status-badge-glass badge-green">Legally Verified</span>
            </div>

            <div class="party-record-list" style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 1rem;">
              <div class="party-item-card" style="background: #ffffff; border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 0.85rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <span style="font-size: 0.7rem; font-weight: 800; color: var(--emerald); text-transform: uppercase;">PROPERTY OWNER</span>
                    <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-top: 0.15rem;">${this.record.parties.owner.name} (${this.record.parties.owner.entity})</h4>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${this.record.parties.owner.ownershipEvidence}</p>
                  </div>
                  <span class="status-badge-glass badge-green" style="font-size: 0.68rem;">Verified Owner</span>
                </div>
              </div>

              <div class="party-item-card" style="background: #ffffff; border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 0.85rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <span style="font-size: 0.7rem; font-weight: 800; color: var(--blue); text-transform: uppercase;">AUTHORIZED AGENT (PERMITTING)</span>
                    <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-top: 0.15rem;">${this.record.parties.authorizedAgent.name}</h4>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${this.record.parties.authorizedAgent.firm} · ${this.record.parties.authorizedAgent.license}</p>
                    <small style="font-size: 0.7rem; color: var(--text-dim); display: block; margin-top: 0.2rem;">${this.record.parties.authorizedAgent.authorityLimits}</small>
                  </div>
                  <span class="status-badge-glass badge-blue" style="font-size: 0.68rem;">Limited POA</span>
                </div>
              </div>

              <div class="party-item-card" style="background: #ffffff; border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 0.85rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <span style="font-size: 0.7rem; font-weight: 800; color: var(--purple); text-transform: uppercase;">GENERAL CONTRACTOR</span>
                    <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-top: 0.15rem;">${this.record.parties.contractor.company}</h4>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">Principal: ${this.record.parties.contractor.qualifyingAgent} · Lic: ${this.record.parties.contractor.licenseNumber}</p>
                    <small style="font-size: 0.7rem; color: var(--text-dim); display: block; margin-top: 0.2rem;">Insurance: ${this.record.parties.contractor.insurance.generalLiability}</small>
                  </div>
                  <span class="status-badge-glass badge-green" style="font-size: 0.68rem;">Active Verified</span>
                </div>
              </div>

              <div class="party-item-card" style="background: #ffffff; border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 0.85rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <span style="font-size: 0.7rem; font-weight: 800; color: var(--amber); text-transform: uppercase;">PLANNING & BUILDING AHJ</span>
                    <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-top: 0.15rem;">${this.record.parties.authorities[0].name}</h4>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">Application Ref: ${this.record.parties.authorities[0].permitNumber} · Plan Reviewer: ${this.record.parties.authorities[0].contactOfficer}</p>
                  </div>
                  <span class="status-badge-glass badge-amber" style="font-size: 0.68rem;">In Plan Review</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Outstanding Evidence, Blockers & Decisions Awaiting Approval -->
          <div class="glass-panel-card">
            <div class="panel-header-flex">
              <div>
                <h3 class="panel-title">Blockers & Decisions Awaiting Approval</h3>
                <p class="panel-subtitle">Items that halt progression until human authority or evidence is provided</p>
              </div>
              <span class="status-badge-glass badge-rose">2 Action Items</span>
            </div>

            <div class="blockers-list" style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 1rem;">
              <div class="blocker-item" style="background: rgba(254, 242, 242, 0.6); border: 1px solid rgba(225, 29, 72, 0.3); border-radius: var(--radius-md); padding: 0.85rem; border-left: 4px solid var(--rose);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <span class="status-badge-glass badge-rose" style="font-size: 0.68rem;">Missing Technical Evidence</span>
                    <h4 style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary); margin-top: 0.35rem;">
                      Geotechnical Soil Bearing Verification Letter (IRC R403.1)
                    </h4>
                    <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
                      Dawson County plan examiner T. Ray flagged rock outcropping on gridline D-3. Marcus Vance, PE must conduct test probe and stamp footing letter before permit release.
                    </p>
                  </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; border-top: 1px solid rgba(225, 29, 72, 0.15); padding-top: 0.5rem;">
                  <span style="font-size: 0.72rem; color: var(--text-dim);">Assigned: Marcus Vance, PE</span>
                  <button class="btn-blocker-action" id="btn-request-seor-letter" style="background: var(--rose); color: white; border: none; border-radius: var(--radius-sm); padding: 0.35rem 0.75rem; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
                    Request Engineer Letter
                  </button>
                </div>
              </div>

              <div class="blocker-item" style="background: rgba(254, 243, 199, 0.6); border: 1px solid rgba(217, 119, 6, 0.3); border-radius: var(--radius-md); padding: 0.85rem; border-left: 4px solid var(--amber);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <span class="status-badge-glass badge-amber" style="font-size: 0.68rem;">Consequential Authorization Gate</span>
                    <h4 style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary); margin-top: 0.35rem;">
                      Authorize Georgia EPD Land Disturbance Fee ($160)
                    </h4>
                    <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
                      NPDES Stormwater application is prepared and ready for submission. AI cannot submit external government filings or disburse capital without explicit Owner approval.
                    </p>
                  </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; border-top: 1px solid rgba(217, 119, 6, 0.15); padding-top: 0.5rem;">
                  <span style="font-size: 0.72rem; color: var(--text-dim);">Requires: Owner Signature</span>
                  <button class="btn-blocker-action" id="btn-authorize-epd-fee" style="background: var(--amber); color: white; border: none; border-radius: var(--radius-sm); padding: 0.35rem 0.75rem; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
                    Authorize & Sign ($160)
                  </button>
                </div>
              </div>

              <div class="blocker-item" style="background: #ffffff; border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 0.85rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">USACE Lake Lanier Shoreline Clearance</h4>
                    <p style="font-size: 0.72rem; color: var(--text-muted);">Site sits at 1,114 ft MSL (+44 ft above 1,070-ft buffer line). Zero restrictions.</p>
                  </div>
                  <span class="status-badge-glass badge-green" style="font-size: 0.68rem;">✓ CLEARED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Module Navigation Hub -->
        <div class="glass-panel-card" style="margin-top: 1.5rem;">
          <h3 class="panel-title" style="margin-bottom: 0.25rem;">Connected Platform Workspaces</h3>
          <p class="panel-subtitle" style="margin-bottom: 1rem;">Seamlessly navigate across all 8 project lifecycle modules</p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.85rem;">
            <div class="quick-tool-card" id="card-nav-feasibility">
              <div class="tool-icon">🛰️</div>
              <div class="tool-meta">
                <h4>Site & Feasibility</h4>
                <p>Zoning, GIS radar, USACE buffer, utilities, and soil investigations.</p>
              </div>
            </div>
            <div class="quick-tool-card" id="card-nav-design">
              <div class="tool-icon">📐</div>
              <div class="tool-meta">
                <h4>Design Coordination</h4>
                <p>Versioned packages (v2.4), drawings, specs, and change propagation.</p>
              </div>
            </div>
            <div class="quick-tool-card" id="card-nav-compliance">
              <div class="tool-icon">⚖️</div>
              <div class="tool-meta">
                <h4>Building Codes</h4>
                <p>GA Minimum Standards, 2018 IRC/IBC, traceable compliance matrix.</p>
              </div>
            </div>
            <div class="quick-tool-card" id="card-nav-carbon">
              <div class="tool-icon">🌱</div>
              <div class="tool-meta">
                <h4>Carbon & Net Zero</h4>
                <p>Operational EUI (18.4), embodied LCA, EPD library, design comparisons.</p>
              </div>
            </div>
            <div class="quick-tool-card" id="card-nav-applications">
              <div class="tool-icon">📋</div>
              <div class="tool-meta">
                <h4>Permits & USDA</h4>
                <p>Dawson County building permit, septic, Land Disturbance, and Form 3555-SC.</p>
              </div>
            </div>
            <div class="quick-tool-card" id="card-nav-build">
              <div class="tool-icon">🏗️</div>
              <div class="tool-meta">
                <h4>Construction & Draws</h4>
                <p>5-stage escrow draws, 10% retainage, RFIs, field inspection checkpoints.</p>
              </div>
            </div>
            <div class="quick-tool-card" id="card-nav-handover">
              <div class="tool-icon">🔑</div>
              <div class="tool-meta">
                <h4>Handover & Ops</h4>
                <p>As-builts, 5 warranty trackers, O&M manuals, and smart meter monitoring.</p>
              </div>
            </div>
            <div class="quick-tool-card" id="card-nav-docs">
              <div class="tool-icon">📄</div>
              <div class="tool-meta">
                <h4>Real PDF Generator</h4>
                <p>Export all 7 official vector documents directly from client-side jsPDF.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const jump = (tab) => {
      if (window.usdaApp && window.usdaApp.switchTab) {
        window.usdaApp.switchTab(tab);
      }
    };

    // Scope Toggle
    document.getElementById('btn-toggle-new-build')?.addEventListener('click', () => {
      this.record.projectType = 'NEW_CONSTRUCTION';
      this.record.buildingUse = 'Single-Family Residential (R-3) Craftsman Cabin';
      this.render();
      this.attachEvents();
    });

    document.getElementById('btn-toggle-renovation')?.addEventListener('click', () => {
      this.record.projectType = 'MAJOR_RENOVATION';
      this.record.buildingUse = 'Deep Energy Retrofit & Timber Addition (Existing Homestead)';
      this.render();
      this.attachEvents();
    });

    document.getElementById('btn-overview-ai-copilot')?.addEventListener('click', () => jump('ai-workspace'));
    document.getElementById('btn-overview-take-action')?.addEventListener('click', () => jump('compliance'));
    document.getElementById('btn-overview-download-brief')?.addEventListener('click', () => jump('documents'));

    // Module Card Jumps
    document.getElementById('card-nav-feasibility')?.addEventListener('click', () => jump('map-radar'));
    document.getElementById('card-nav-design')?.addEventListener('click', () => jump('design'));
    document.getElementById('card-nav-compliance')?.addEventListener('click', () => jump('compliance'));
    document.getElementById('card-nav-carbon')?.addEventListener('click', () => jump('carbon'));
    document.getElementById('card-nav-applications')?.addEventListener('click', () => jump('applications'));
    document.getElementById('card-nav-build')?.addEventListener('click', () => jump('build'));
    document.getElementById('card-nav-handover')?.addEventListener('click', () => jump('handover'));
    document.getElementById('card-nav-docs')?.addEventListener('click', () => jump('documents'));

    // Blocker Action Buttons
    document.getElementById('btn-request-seor-letter')?.addEventListener('click', (e) => {
      e.target.textContent = '✓ Letter Requested';
      e.target.style.background = '#059669';
      alert('Formal request dispatched to Marcus Vance, PE for footing probe confirmation letter.');
    });

    document.getElementById('btn-authorize-epd-fee')?.addEventListener('click', (e) => {
      e.target.textContent = '✓ Authorized & Paid ($160)';
      e.target.style.background = '#059669';
      this.record.applicationsAndPermits[2].feePaid = true;
      this.record.applicationsAndPermits[2].status = 'SUBMITTED_UNDER_REVIEW';
      alert('Authorized: $160 Georgia EPD Land Disturbance Fee debited from project escrow. Application submitted.');
    });
  }
}
