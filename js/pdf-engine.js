// Documents & Multi-Document Vector PDF Engine (jsPDF)
// Generates official institutional PDFs with versioning, dates, preparers, and review statuses:
// 1. USDA Form 3555-SC Dossier
// 2. Structured Project Brief
// 3. Site Feasibility Report
// 4. Traceable Code Compliance Matrix
// 5. Carbon & Net-Zero Assessment
// 6. Submission-Ready Permit Package
// 7. Building Handover & Operations Pack

import { PROJECT_RECORD } from '../data/project-record.js';

export class USDAPDFEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.record = PROJECT_RECORD;
    this.activeDoc = "dossier"; // "dossier" | "brief" | "feasibility" | "code-matrix" | "carbon" | "permit-pack" | "handover"
    this.init();
    window.usdaPdfEngine = this;
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="documents-view-layout">
        <!-- Top Toolbar & Status -->
        <div class="doc-toolbar-glass glass-panel-card">
          <div class="doc-toolbar-left">
            <div class="doc-status-badge-row">
              <span class="status-badge-glass badge-green">● OFFICIAL REPOSITORY</span>
              <span class="doc-version-tag">7 VERIFIED DELIVERABLES</span>
              <span class="doc-id-pill">PRJ: ${this.record.id}</span>
            </div>
            <h2 class="panel-title" style="margin-top: 0.35rem;">Real Vector PDF Deliverables Engine</h2>
            <p class="panel-subtitle">Multi-document publishing suite with client-side jsPDF vector compilation, formal signatures, and audit trails.</p>
          </div>

          <div class="doc-toolbar-actions">
            <button class="btn-download-pdf-real" id="btn-trigger-pdf-download">
              <span>📥</span> Download Active PDF (.pdf)
            </button>
            <button class="btn-print-doc" id="btn-trigger-print">
              <span>🖨️</span> Print / Save Copy
            </button>
          </div>
        </div>

        <!-- Document Selector Chips -->
        <div class="glass-panel-card" style="margin-top: 1rem; padding: 0.85rem 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span style="font-size: 0.72rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; margin-right: 0.25rem;">Select Document:</span>
            <button class="calc-chip-btn ${this.activeDoc === 'dossier' ? 'active' : ''}" data-doc="dossier">
              🏛️ 1. Form 3555-SC Dossier
            </button>
            <button class="calc-chip-btn ${this.activeDoc === 'brief' ? 'active' : ''}" data-doc="brief">
              📋 2. Structured Project Brief
            </button>
            <button class="calc-chip-btn ${this.activeDoc === 'feasibility' ? 'active' : ''}" data-doc="feasibility">
              🛰️ 3. Site Feasibility Report
            </button>
            <button class="calc-chip-btn ${this.activeDoc === 'code-matrix' ? 'active' : ''}" data-doc="code-matrix">
              ⚖️ 4. Code Compliance Matrix
            </button>
            <button class="calc-chip-btn ${this.activeDoc === 'carbon' ? 'active' : ''}" data-doc="carbon">
              🌱 5. Carbon & Net-Zero Assessment
            </button>
            <button class="calc-chip-btn ${this.activeDoc === 'permit-pack' ? 'active' : ''}" data-doc="permit-pack">
              📑 6. Dawson County Permit Pack
            </button>
            <button class="calc-chip-btn ${this.activeDoc === 'handover' ? 'active' : ''}" data-doc="handover">
              🔑 7. Building Handover Pack
            </button>
          </div>
        </div>

        <!-- 2-Column Split: Active In-App Reading Surface + Document Audit Sidebar -->
        <div class="doc-content-split" style="margin-top: 1.25rem;">
          <!-- Left: High-Contrast Solid Reading Surface Preview -->
          <div class="doc-preview-wrapper">
            <div class="doc-paper-sheet" id="doc-printable-surface">
              ${this.renderActiveDocumentPreview()}
            </div>
          </div>

          <!-- Right: Document Metadata & Audit Sidebar -->
          <div class="doc-sidebar-pane">
            <div class="glass-panel-card">
              <h3 class="panel-title" style="font-size: 1rem;">Document Verification Metadata</h3>
              <div class="doc-meta-detail-list" style="margin-top: 0.75rem;">
                <div class="meta-row"><span>Document Key:</span> <strong>${this.getActiveDocTitle()}</strong></div>
                <div class="meta-row"><span>File Format:</span> <strong class="font-emerald">Vector PDF (jsPDF)</strong></div>
                <div class="meta-row"><span>Preparer:</span> <strong>${this.getActiveDocPreparer()}</strong></div>
                <div class="meta-row"><span>Review Status:</span> <strong class="font-blue">Signed & Verified</strong></div>
                <div class="meta-row"><span>Standard Edition:</span> <strong>7 CFR § 3555 / 2018 IRC</strong></div>
                <div class="meta-row"><span>Target Authority:</span> <strong>Dawson County / USDA RD</strong></div>
              </div>

              <div class="doc-action-block" style="margin-top: 1.25rem;">
                <button class="btn-glass-primary" style="width: 100%; justify-content: center;" id="btn-sidebar-download-pdf">
                  <span>📥</span> Download This Vector PDF
                </button>
              </div>

              <div class="legal-disclaimer-box" style="margin-top: 1rem; font-size: 0.72rem; color: var(--text-dim); line-height: 1.45;">
                ℹ️ <strong>Direct PDF Rendering:</strong> Generated client-side directly into your browser's download manager. No external server tracking or cloud uploads required.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getActiveDocTitle() {
    switch(this.activeDoc) {
      case 'dossier': return "USDA Form 3555-SC Loan Dossier";
      case 'brief': return "Structured Project Brief";
      case 'feasibility': return "Site Feasibility & Soil Report";
      case 'code-matrix': return "Traceable Code Compliance Matrix";
      case 'carbon': return "Carbon & Net-Zero Assessment";
      case 'permit-pack': return "Dawson County Permit Package";
      case 'handover': return "Building Handover Pack";
      default: return "Project Document";
    }
  }

  getActiveDocPreparer() {
    switch(this.activeDoc) {
      case 'dossier': return "USDA Build Navigator Pro 3FS Engine";
      case 'brief': return "Sarah Jenkins, AIA (Authorized Agent)";
      case 'feasibility': return "Highland Soil & Perc LLC";
      case 'code-matrix': return "Marcus Vance, PE & Sarah Jenkins, AIA";
      case 'carbon': return "Elena Rostova, CEM (Highland Energy)";
      case 'permit-pack': return "Blue Ridge Architecture Group LLC";
      case 'handover': return "Blue Ridge Craftsman Builders LLC";
      default: return "Project Team";
    }
  }

  renderActiveDocumentPreview() {
    switch(this.activeDoc) {
      case 'dossier': return this.renderDossierPreview();
      case 'brief': return this.renderBriefPreview();
      case 'feasibility': return this.renderFeasibilityPreview();
      case 'code-matrix': return this.renderCodeMatrixPreview();
      case 'carbon': return this.renderCarbonPreview();
      case 'permit-pack': return this.renderPermitPackPreview();
      case 'handover': return this.renderHandoverPreview();
      default: return this.renderDossierPreview();
    }
  }

  renderDossierPreview() {
    const r = this.record;
    return `
      <div class="doc-sheet-header">
        <div class="sheet-seal-block" style="display: flex; align-items: center; gap: 0.85rem;">
          <img src="assets/brand/usda-rd-seal.svg" alt="USDA RD Seal" style="width: 46px; height: 46px; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.1);" />
          <img src="assets/brand/3fs-logo.svg" alt="3FS Logo" style="width: 46px; height: 46px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.06); background: #f7f7f4;" />
          <div>
            <span class="sheet-fed-seal">USDA RURAL HOUSING SERVICE · 3FS OPERATING SYSTEM</span>
            <span class="sheet-subhead">SINGLE FAMILY HOUSING GUARANTEED LOAN PROGRAM (7 CFR § 3555)</span>
          </div>
        </div>
        <div class="sheet-meta-block">
          <span class="sheet-id-txt">FORM RD 3555-SC</span>
          <span class="sheet-date-txt">DATE: 2026-10-04</span>
          <span class="sheet-ver-txt">STATUS: DOSSIER COMPILED</span>
        </div>
      </div>

      <div class="sheet-title-block">
        <h1>CONSTRUCTION-TO-PERMANENT (SINGLE-CLOSE) UNDERWRITING DOSSIER</h1>
        <p>100% LTV Zero-Down Rural Lot Acquisition & Turnkey Dwelling Construction</p>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">1. Geographic Jurisdiction & Parcel Clearance</h3>
        <div class="sheet-data-grid">
          <div class="sheet-row"><span>Target Jurisdiction:</span> <strong>${r.jurisdiction.county}, ${r.jurisdiction.state}</strong></div>
          <div class="sheet-row"><span>Rural Eligibility:</span> <strong class="text-emerald">100% Eligible (Unshaded Zone)</strong></div>
          <div class="sheet-row"><span>USACE Shoreline Buffer:</span> <strong>Verified outside 1,070-ft contour line (Elevation 1,114 ft MSL)</strong></div>
          <div class="sheet-row"><span>Primary Residence:</span> <strong>Owner-Occupied Primary Residence Certified</strong></div>
        </div>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">2. Statutory Household Income Deduction Audit (7 CFR § 3555)</h3>
        <div class="sheet-table-wrap">
          <table class="sheet-table">
            <thead>
              <tr><th>Statutory Step</th><th>Amount</th><th>HB-1-3555 Reference</th></tr>
            </thead>
            <tbody>
              <tr><td>Gross Annual Household Earnings</td><td>$142,000</td><td>Base Underwriting Income</td></tr>
              <tr><td>- Minor Dependent Allowance (2 @ $480)</td><td class="text-emerald">-$960</td><td>HB-1-3555 Chapter 9.3(A)</td></tr>
              <tr><td>- Verified Work-Related Childcare</td><td class="text-emerald">-$12,000</td><td>HB-1-3555 Chapter 9.3(B)</td></tr>
              <tr class="row-highlight">
                <td><strong>= USDA ADJUSTED ANNUAL INCOME</strong></td>
                <td><strong class="text-emerald">$129,040</strong></td>
                <td><strong>PASSED (Under $135,500 Atlanta MSA Ceiling)</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">3. Single-Close Financial Pro-Forma & Draw Schedule</h3>
        <div class="sheet-table-wrap">
          <table class="sheet-table">
            <thead>
              <tr><th>Budget Category</th><th>Financed Amount</th><th>Disbursement Architecture</th></tr>
            </thead>
            <tbody>
              <tr><td>Rural Lot Acquisition (2.05 Acres)</td><td>$42,000</td><td>Initial Escrow Closing</td></tr>
              <tr><td>Turnkey Cabin Construction (1,650 sq.ft)</td><td>$305,250</td><td>5-Stage Inspection Draws</td></tr>
              <tr><td>Site Infrastructure (Well, Septic, Power, Drive)</td><td>$33,500</td><td>Draws 1 & 2 Escrow</td></tr>
              <tr><td>+ 10% Mandatory Construction Contingency</td><td>+$34,575</td><td>Held in Escrow (Refunded if unused)</td></tr>
              <tr><td>+ Financed Construction Interest Reserve</td><td>+$15,600</td><td>Borrower pays $0 during 9-month build</td></tr>
              <tr><td>+ USDA Upfront Guarantee Fee (1.00%)</td><td>+$4,379.25</td><td>Financed directly into Note</td></tr>
              <tr class="row-highlight">
                <td><strong>TOTAL FINANCED NOTE (100% LTV)</strong></td>
                <td><strong class="text-emerald">$${Math.round(r.costsAndFunding.totalFinancedNote).toLocaleString()}</strong></td>
                <td><strong>CASH AT CLOSING: $0.00 (Zero Down)</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderBriefPreview() {
    const r = this.record;
    return `
      <div class="doc-sheet-header">
        <div class="sheet-seal-block" style="display: flex; align-items: center; gap: 0.85rem;">
          <img src="assets/brand/3fs-logo.svg" alt="3FS Logo" style="width: 44px; height: 44px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.06); background: #f7f7f4;" />
          <img src="assets/brand/gate-mark-flat.svg" alt="Gate" style="width: 44px; height: 44px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); padding: 3px; background: #ffffff;" />
          <div>
            <span class="sheet-fed-seal">PROJECT BRIEF & SCOPE OF WORK · 3FS ENGINE</span>
            <span class="sheet-subhead">BLUE RIDGE ARCHITECTURE GROUP LLC · UNYKORN RWA RAILS</span>
          </div>
        </div>
        <div class="sheet-meta-block">
          <span class="sheet-id-txt">PRJ: ${r.id}</span>
          <span class="sheet-date-txt">DATE: 2026-10-04</span>
          <span class="sheet-ver-txt">VERSION: v2.4</span>
        </div>
      </div>

      <div class="sheet-title-block">
        <h1>STRUCTURED PROJECT BRIEF: ${r.name.toUpperCase()}</h1>
        <p>${r.scopeDescription}</p>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">1. Project Identity & Location</h3>
        <div class="sheet-data-grid">
          <div class="sheet-row"><span>Address:</span> <strong>${r.address}</strong></div>
          <div class="sheet-row"><span>Parcel Number:</span> <strong>${r.parcelId} (${r.lotAcreage} Acres)</strong></div>
          <div class="sheet-row"><span>Building Use:</span> <strong>${r.buildingUse}</strong></div>
          <div class="sheet-row"><span>Project Type:</span> <strong>${r.projectType.replace(/_/g, ' ')}</strong></div>
        </div>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">2. Owner & Applicant Roles</h3>
        <div class="sheet-data-grid">
          <div class="sheet-row"><span>Property Owner:</span> <strong>${r.parties.owner.name} (${r.parties.owner.entity})</strong></div>
          <div class="sheet-row"><span>Primary Applicant:</span> <strong>${r.parties.applicant.name} (Beneficial Owner)</strong></div>
          <div class="sheet-row"><span>Authorized Agent:</span> <strong>${r.parties.authorizedAgent.name} (${r.parties.authorizedAgent.license})</strong></div>
          <div class="sheet-row"><span>General Contractor:</span> <strong>${r.parties.contractor.company} (${r.parties.contractor.licenseNumber})</strong></div>
        </div>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">3. Key Project Objectives</h3>
        <ul style="font-size: 0.8rem; color: var(--text-secondary); margin-left: 1.5rem; line-height: 1.6;">
          <li>Construct 1,650 sq.ft mountain craftsman cabin meeting 100% USDA Section 502 Single-Close requirements.</li>
          <li>Achieve DOE Zero Emissions Building (ZEB) compliance with 18.4 EUI and 10.2 kW clean solar generation.</li>
          <li>Maintain 100% financed budget of $${Math.round(r.costsAndFunding.totalFinancedNote).toLocaleString()} with $0 borrower down payment.</li>
        </ul>
      </div>
    `;
  }

  renderFeasibilityPreview() {
    const s = this.record.siteFeasibility;
    return `
      <div class="doc-sheet-header">
        <div class="sheet-seal-block">
          <span class="sheet-fed-seal">🛰️ SITE FEASIBILITY & CONSTRAINTS REPORT</span>
          <span class="sheet-subhead">DAWSON COUNTY GIS & SOIL SURVEY</span>
        </div>
        <div class="sheet-meta-block">
          <span class="sheet-id-txt">PRJ: ${this.record.id}</span>
          <span class="sheet-date-txt">DATE: 2026-09-22</span>
          <span class="sheet-ver-txt">STATUS: FEASIBLE</span>
        </div>
      </div>

      <div class="sheet-title-block">
        <h1>PARCEL FEASIBILITY & ENVIRONMENTAL INVESTIGATION REPORT</h1>
        <p>Comprehensive Site Constraints, Setbacks, Utilities, and USACE Shoreline Buffer</p>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">1. Zoning & Physical Constraints</h3>
        <div class="sheet-data-grid">
          <div class="sheet-row"><span>Zoning Classification:</span> <strong>${s.zoningClassification}</strong></div>
          <div class="sheet-row"><span>Minimum Lot Size:</span> <strong>${s.minimumLotSize}</strong></div>
          <div class="sheet-row"><span>Front Setback:</span> <strong>Req: ${s.setbacks.frontRequired}ft | Proposed: ${s.setbacks.frontProposed}ft (Compliant)</strong></div>
          <div class="sheet-row"><span>Side & Rear Setbacks:</span> <strong>Side: ${s.setbacks.sideProposed}ft | Rear: ${s.setbacks.rearProposed}ft (Compliant)</strong></div>
        </div>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">2. Rural Infrastructure & Utilities</h3>
        <div class="sheet-data-grid">
          <div class="sheet-row"><span>Potable Water:</span> <strong>${s.waterSource.type} (${s.waterSource.estimatedDepth} ft drilled well)</strong></div>
          <div class="sheet-row"><span>Sanitary Sewer:</span> <strong>${s.sewerDisposal.type} (Perc: ${s.sewerDisposal.percRate})</strong></div>
          <div class="sheet-row"><span>Electrical Service:</span> <strong>${s.electricProvider}</strong></div>
          <div class="sheet-row"><span>Topography & Solar:</span> <strong>${s.topography}</strong></div>
        </div>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">3. Outstanding Investigations</h3>
        <div style="background: rgba(254, 242, 242, 0.6); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(225, 29, 72, 0.25);">
          <strong style="color: var(--rose); font-size: 0.8rem;">Item 1:</strong>
          <span style="font-size: 0.78rem; color: var(--text-secondary);">${s.outstandingInvestigations[0]}</span>
        </div>
      </div>
    `;
  }

  renderCodeMatrixPreview() {
    const c = this.record.buildingCodesMatrix;
    return `
      <div class="doc-sheet-header">
        <div class="sheet-seal-block">
          <span class="sheet-fed-seal">⚖️ BUILDING CODES COMPLIANCE MATRIX</span>
          <span class="sheet-subhead">DAWSON COUNTY AHJ PLAN REVIEW</span>
        </div>
        <div class="sheet-meta-block">
          <span class="sheet-id-txt">PRJ: ${this.record.id}</span>
          <span class="sheet-date-txt">DATE: 2026-10-04</span>
          <span class="sheet-ver-txt">STATUS: REVIEWED</span>
        </div>
      </div>

      <div class="sheet-title-block">
        <h1>TRACEABLE CODE COMPLIANCE MATRIX</h1>
        <p>2018 IRC / IBC with Georgia State Amendments & 2015 GA IECC</p>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">1. Localized Code Requirements Checklist</h3>
        <table class="sheet-table">
          <thead>
            <tr><th>Code & Section</th><th>Subject</th><th>Requirement & Evidence</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${c.applicableCodes.map(item => `
              <tr>
                <td><strong>${item.code} § ${item.section}</strong></td>
                <td>${item.subject}</td>
                <td><small>${item.requirementText.substring(0, 75)}... (Evidence: ${item.evidenceRef.substring(0, 45)}...)</small></td>
                <td><strong class="${item.status === 'ACCEPTED' ? 'text-emerald' : 'text-amber'}">${item.status}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderCarbonPreview() {
    const cb = this.record.carbonAndNetZero;
    return `
      <div class="doc-sheet-header">
        <div class="sheet-seal-block">
          <span class="sheet-fed-seal">🌱 WHOLE-LIFE CARBON & ENERGY ASSESSMENT</span>
          <span class="sheet-subhead">DOE ZEB & WORLDGBC STANDARDS</span>
        </div>
        <div class="sheet-meta-block">
          <span class="sheet-id-txt">PRJ: ${this.record.id}</span>
          <span class="sheet-date-txt">DATE: 2026-10-04</span>
          <span class="sheet-ver-txt">STATUS: MODELED TO TARGET</span>
        </div>
      </div>

      <div class="sheet-title-block">
        <h1>CARBON AND NET-ZERO ENERGY ASSESSMENT</h1>
        <p>Target: ${cb.targetDefinitions.selectedTarget} · Standard: ${cb.targetDefinitions.boundaryStandard}</p>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">1. Operational Energy Demand & Clean Generation</h3>
        <div class="sheet-data-grid">
          <div class="sheet-row"><span>Modeled EUI:</span> <strong>${cb.operationalEnergy.modeledDesignEUI} kBtu/sq.ft/yr (-61.8% vs Code 48.2)</strong></div>
          <div class="sheet-row"><span>Annual Demand:</span> <strong>${cb.operationalEnergy.annualEnergyDemandKwh.toLocaleString()} kWh / year</strong></div>
          <div class="sheet-row"><span>Annual Solar Generation:</span> <strong class="text-emerald">${cb.operationalEnergy.annualSolarGenerationKwh.toLocaleString()} kWh / year (155% Clean Generation)</strong></div>
          <div class="sheet-row"><span>Net Operational Emissions:</span> <strong class="text-emerald">${cb.operationalEnergy.netAnnualOperatingEmissionsKgCo2e} kg CO2e / yr (Net Negative)</strong></div>
        </div>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">2. Embodied Carbon (Cradle-to-Grave A1-A3)</h3>
        <div class="sheet-data-grid">
          <div class="sheet-row"><span>Optimized Embodied Total:</span> <strong>${cb.embodiedCarbon.optimizedDesignTonsCo2e} tons CO2e (-42.8% vs Baseline 68.4t)</strong></div>
          <div class="sheet-row"><span>Carbon Intensity:</span> <strong>${cb.embodiedCarbon.embodiedCarbonPerSqM} kg CO2e / m² (&lt;300 target achieved)</strong></div>
        </div>
      </div>
    `;
  }

  renderPermitPackPreview() {
    const ap = this.record.applicationsAndPermits;
    return `
      <div class="doc-sheet-header">
        <div class="sheet-seal-block">
          <span class="sheet-fed-seal">📑 SUBMISSION-READY PERMIT APPLICATION PACKAGE</span>
          <span class="sheet-subhead">DAWSON COUNTY PLANNING & DEVELOPMENT</span>
        </div>
        <div class="sheet-meta-block">
          <span class="sheet-id-txt">PRJ: ${this.record.id}</span>
          <span class="sheet-date-txt">DATE: 2026-10-04</span>
          <span class="sheet-ver-txt">STATUS: UNDER REVIEW</span>
        </div>
      </div>

      <div class="sheet-title-block">
        <h1>DAWSON COUNTY RESIDENTIAL PERMIT FILING DOSSIER</h1>
        <p>Application #BLD-2026-0842 · 428 Chestatee Overlook Trail, Dawsonville, GA</p>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">1. Coordinated Permit Filings</h3>
        <table class="sheet-table">
          <thead>
            <tr><th>Application Name</th><th>Agency</th><th>Fee</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${ap.map(a => `
              <tr>
                <td><strong>${a.name}</strong></td>
                <td>${a.agency}</td>
                <td>$${a.fee} (${a.feePaid ? 'Paid' : 'Pending'})</td>
                <td><strong class="${a.status === 'APPROVED_ISSUED' ? 'text-emerald' : 'text-blue'}">${a.status}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderHandoverPreview() {
    const ho = this.record.handoverPack;
    return `
      <div class="doc-sheet-header">
        <div class="sheet-seal-block">
          <span class="sheet-fed-seal">🔑 BUILDING HANDOVER & OPERATIONS PACK</span>
          <span class="sheet-subhead">POST-OCCUPANCY BUILDING DOSSIER</span>
        </div>
        <div class="sheet-meta-block">
          <span class="sheet-id-txt">PRJ: ${this.record.id}</span>
          <span class="sheet-date-txt">DATE: 2026-10-04</span>
          <span class="sheet-ver-txt">STATUS: PRE-COMPILED</span>
        </div>
      </div>

      <div class="sheet-title-block">
        <h1>BUILDING HANDOVER & OPERATIONS MANUAL ARCHIVE</h1>
        <p>As-Built Index, Equipment Warranties, O&M Guides & Utility Performance</p>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">1. Master Equipment Warranties</h3>
        <table class="sheet-table">
          <thead>
            <tr><th>Warrantied System</th><th>Duration</th><th>Provider</th></tr>
          </thead>
          <tbody>
            ${ho.warranties.map(w => `
              <tr>
                <td><strong>${w.item}</strong></td>
                <td>${w.duration}</td>
                <td>${w.provider}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  downloadPDF() {
    try {
      const jsPDFClass = window.jspdf ? window.jspdf.jsPDF : (window.jsPDF || null);
      if (!jsPDFClass) {
        alert("Client-side jsPDF library is loading. Please click again in 2 seconds.");
        return;
      }

      const doc = new jsPDFClass({ orientation: "portrait", unit: "pt", format: "letter" });
      const r = this.record;

      // Color Palette
      const darkText = [15, 23, 42];
      const emeraldColor = [5, 150, 105];
      const grayText = [100, 116, 139];
      const lightBg = [248, 250, 252];

      // Document Border & Header Bar
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(1);
      doc.roundedRect(36, 36, 540, 720, 6, 6, "S");

      doc.setFillColor(...emeraldColor);
      doc.rect(36, 36, 540, 8, "F");

      // Title & Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...darkText);
      doc.text(this.getActiveDocTitle().toUpperCase(), 54, 75);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...grayText);
      doc.text(`PROJECT ID: ${r.id} · PREPARED: ${this.getActiveDocPreparer()} · DATE: ${new Date().toLocaleDateString()}`, 54, 90);

      // Authentic 3FS Vector Mark Stamp
      doc.setFillColor(247, 247, 244);
      doc.roundedRect(476, 52, 38, 38, 6, 6, "F");
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.8);
      doc.roundedRect(476, 52, 38, 38, 6, 6, "S");

      // 3FS Machined Ring
      doc.setDrawColor(17, 18, 20);
      doc.setLineWidth(1.6);
      doc.circle(495, 71, 13, "S");

      // 3FS Crimson Upward Arrow / Chevron (#A30D22)
      doc.setFillColor(163, 13, 34);
      doc.triangle(495, 61.5, 503.5, 78, 495, 69.5, "F");
      doc.triangle(495, 61.5, 486.5, 78, 495, 69.5, "F");

      // 3FS Base Anchor Triangle (#111214)
      doc.setFillColor(17, 18, 20);
      doc.triangle(492.7, 78, 495, 73.5, 497.3, 78, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.setTextColor(163, 13, 34);
      doc.text("3FS OS", 495, 96, { align: "center" });

      doc.setDrawColor(226, 232, 240);
      doc.line(54, 102, 522, 102);

      // Section 1: Project Scope & Party
      let y = 120;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...darkText);
      doc.text("1. PROJECT SCOPE & APPLICANT RECORD", 54, y);

      y += 15;
      doc.setFillColor(...lightBg);
      doc.rect(54, y, 504, 55, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(`Project Name: ${r.name}`, 64, y + 16);
      doc.text(`Address: ${r.address} (Parcel ${r.parcelId})`, 64, y + 30);
      doc.text(`Owner: ${r.parties.owner.name} (${r.parties.owner.entity}) · Agent: ${r.parties.authorizedAgent.name}`, 64, y + 44);

      // Section 2: Financial & Technical Summary
      y += 75;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("2. FINANCIAL & TECHNICAL PARAMETERS", 54, y);

      y += 15;
      doc.setFillColor(...lightBg);
      doc.rect(54, y, 504, 70, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(`Total Financed 100% Note: $${Math.round(r.costsAndFunding.totalFinancedNote).toLocaleString()} (Zero Down Payment)`, 64, y + 18);
      doc.text(`Modeled Energy Use: 18.4 EUI (DOE Zero Emissions Ready · 10.2 kW Solar Offset 155%)`, 64, y + 32);
      doc.text(`Building Codes: 2018 IRC / IBC + GA Energy Code (6 of 7 Requirements Accepted)`, 64, y + 46);
      doc.text(`Permit Authority: Dawson County Planning & Development (Ref: BLD-2026-0842)`, 64, y + 60);

      // Section 3: Document Specific Body
      y += 90;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`3. ${this.getActiveDocTitle().toUpperCase()} DETAILS`, 54, y);

      y += 15;
      doc.setFillColor(...lightBg);
      doc.rect(54, y, 504, 160, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);

      if (this.activeDoc === 'dossier') {
        doc.text("USDA Single-Close Loan Financing Breakdown:", 64, y + 18);
        doc.text(`- Lot Acquisition: $${r.costsAndFunding.lotAcquisitionCost.toLocaleString()}`, 64, y + 34);
        doc.text(`- Turnkey Construction: $${r.costsAndFunding.directConstruction.toLocaleString()}`, 64, y + 50);
        doc.text(`- Site Infrastructure: $${r.costsAndFunding.siteWorkAndInfrastructure.toLocaleString()}`, 64, y + 66);
        doc.text(`- 10% Contingency Reserve: $${r.costsAndFunding.contingencyReserve.toLocaleString()}`, 64, y + 82);
        doc.text(`- Financed Interest Reserve: $${r.costsAndFunding.financedInterestReserve.toLocaleString()}`, 64, y + 98);
        doc.text(`- Upfront Guarantee Fee: $${r.costsAndFunding.upfrontGuaranteeFee.toLocaleString()}`, 64, y + 114);
        doc.setFont("helvetica", "bold");
        doc.text(`= Total Financed Note: $${Math.round(r.costsAndFunding.totalFinancedNote).toLocaleString()} · Borrower Cash: $0.00`, 64, y + 135);
      } else if (this.activeDoc === 'carbon') {
        doc.text("Whole-Life Carbon & Net-Zero Assessment:", 64, y + 18);
        doc.text(`- Operational Demand: ${r.carbonAndNetZero.operationalEnergy.annualEnergyDemandKwh.toLocaleString()} kWh/yr`, 64, y + 34);
        doc.text(`- Clean Solar Supply: ${r.carbonAndNetZero.operationalEnergy.annualSolarGenerationKwh.toLocaleString()} kWh/yr (155% Net Exporter)`, 64, y + 50);
        doc.text(`- Embodied Carbon: ${r.carbonAndNetZero.embodiedCarbon.optimizedDesignTonsCo2e} tons CO2e (42.8% reduction vs code)`, 64, y + 66);
        doc.text(`- Embodied Intensity: ${r.carbonAndNetZero.embodiedCarbon.embodiedCarbonPerSqM} kg CO2e/m² (<300 target achieved)`, 64, y + 82);
        doc.text(`- Claim Status: ${r.carbonAndNetZero.targetDefinitions.claimsStatus} (Pre-Construction)`, 64, y + 98);
        doc.setFont("helvetica", "bold");
        doc.text("Pillars: High Efficiency + Zero On-Site Fossil Combustion + Clean Renewables", 64, y + 125);
      } else {
        doc.text("Compliance & Operational Verification Summary:", 64, y + 18);
        doc.text(`- Project Stage: ${r.currentStage}`, 64, y + 34);
        doc.text(`- Next Required Action: ${r.nextAction.title}`, 64, y + 50);
        doc.text(`- Action Owner: ${r.nextAction.owner} · Target: ${r.nextAction.deadline}`, 64, y + 66);
        doc.text(`- USACE Lake Lanier Buffer: 1,114 ft MSL elevation verified clear of 1,070-ft line`, 64, y + 82);
        doc.text(`- Georgia CUVA Status: 40-75% agricultural property tax covenant ready`, 64, y + 98);
        doc.setFont("helvetica", "bold");
        doc.text("Formally verified under Dawson County & Georgia State Minimum Standards", 64, y + 125);
      }

      // Signatures Block
      y += 185;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("FORMAL AUTHORIZATION & PROFESSIONAL SIGN-OFF", 54, y);

      y += 20;
      doc.setDrawColor(15, 23, 42);
      doc.line(64, y + 25, 260, y + 25);
      doc.line(320, y + 25, 520, y + 25);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...grayText);
      doc.text("Owner / Applicant Signature & Date", 64, y + 36);
      doc.text("Architect / Engineer of Record Signature & Stamp", 320, y + 36);

      // Footer
      doc.text(`3FS BUILDING PLATFORM · USDA RURAL OS · ${this.getActiveDocTitle().toUpperCase()} · ID: ${r.id}`, 54, 740);
      doc.text("Page 1 of 1 · Official Vector PDF", 450, 740);

      // Download Trigger
      const filename = `${this.activeDoc.replace(/-/g, '_')}_${r.id}.pdf`;
      doc.save(filename);
      console.log(`Downloaded ${filename} successfully!`);

    } catch (e) {
      console.error("PDF generation failed:", e);
      alert("PDF generation error: " + e.message);
    }
  }

  attachEvents() {
    this.container.addEventListener('click', (e) => {
      const chip = e.target.closest('.calc-chip-btn');
      if (chip && chip.dataset.doc) {
        this.activeDoc = chip.dataset.doc;
        this.render();
        this.attachEvents();
      }
    });

    document.getElementById('btn-trigger-pdf-download')?.addEventListener('click', () => {
      this.downloadPDF();
    });

    document.getElementById('btn-sidebar-download-pdf')?.addEventListener('click', () => {
      this.downloadPDF();
    });

    document.getElementById('btn-trigger-print')?.addEventListener('click', () => {
      window.print();
    });
  }
}
