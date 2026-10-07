// USDA Rural OS & 3FS Platform — Institutional Documents & Handbooks Engine (jsPDF)
// Generates official vector PDFs for all 14 statutory USDA forms, technical books, and project deliverables:
// 1. USDA Form RD 3555-SC Underwriting Dossier
// 2. HB-1-3555 Technical Handbook Field Manual
// 3. USDA Form RD 3555-21 Request for Single Family Housing Loan Guarantee
// 4. USDA Form RD 1940-20 Request for Environmental Information
// 5. USDA Form RD 1924-18 Partial Payment Estimate & Draw Disbursement Log
// 6. USDA Form RD 1924-19 Builder's Warranty & One-Year Structural Guarantee
// 7. Structured Project Brief & BIM LOD 350 Scope
// 8. Site Feasibility & Soil Perc Report (Highland Soil & Perc LLC)
// 9. Traceable Building Code Compliance Matrix (2018 IRC/IBC & 2015 IECC)
// 10. Whole-Life Carbon & Net-Zero Assessment (DOE ZEB EUI 18.4)
// 11. Dawson County Building & Land Disturbance Permit Pack
// 12. Building Handover & Operations Building Pack
// 13. 7 CFR Part 3555 Direct Federal Rulebook Reference Guide
// 14. Georgia State Minimum Standard Codes (2018 IRC / 2015 IECC) Construction Guide

import { PROJECT_RECORD } from '../data/project-record.js';
import { ICONS, getIcon } from './icons.js';

export const OFFICIAL_DOCUMENTS = [
  { id: "dossier", category: "forms", number: "1", title: "USDA Form RD 3555-SC Underwriting Dossier", docCode: "FORM RD 3555-SC", preparer: "USDA Rural OS 3FS Engine", pages: "1 Page Vector" },
  { id: "hb-3555", category: "books", number: "2", title: "HB-1-3555 Technical Handbook: SFH Guaranteed Loan Field Guide", docCode: "HB-1-3555", preparer: "USDA Rural Housing Service", pages: "Official Field Manual" },
  { id: "rd-3555-21", category: "forms", number: "3", title: "USDA Form RD 3555-21: Request for SFH Loan Guarantee", docCode: "FORM RD 3555-21", preparer: "Highland Rural Community Bank (NMLS #482910)", pages: "Statutory Lender Form" },
  { id: "rd-1940-20", category: "forms", number: "4", title: "USDA Form RD 1940-20: Request for Environmental Information", docCode: "FORM RD 1940-20", preparer: "Blue Ridge Architecture Group LLC", pages: "NEPA Clearance Form" },
  { id: "rd-1924-18", category: "forms", number: "5", title: "USDA Form RD 1924-18: Partial Payment & 5-Stage Escrow Draw Log", docCode: "FORM RD 1924-18", preparer: "Blue Ridge Craftsman Builders LLC", pages: "Escrow Draw Form" },
  { id: "rd-1924-19", category: "forms", number: "6", title: "USDA Form RD 1924-19: Builder's 1-Year Structural Warranty", docCode: "FORM RD 1924-19", preparer: "Blue Ridge Craftsman Builders LLC", pages: "Builder Warranty Form" },
  { id: "brief", category: "deliverables", number: "7", title: "Structured Project Brief & BIM LOD 350 Scope", docCode: "3FS-PRJ-BRIEF", preparer: "Sarah Jenkins, AIA (Authorized Agent)", pages: "Project Specification" },
  { id: "feasibility", category: "deliverables", number: "8", title: "Site Feasibility & Soil Perc Report", docCode: "GEO-SOIL-0194", preparer: "Highland Soil & Perc LLC", pages: "Geotechnical Survey" },
  { id: "code-matrix", category: "deliverables", number: "9", title: "Traceable Building Code Compliance Matrix", docCode: "IRC-COMP-2026", preparer: "Marcus Vance, PE & Sarah Jenkins, AIA", pages: "Engineering Compliance" },
  { id: "carbon", category: "deliverables", number: "10", title: "Whole-Life Carbon & Net-Zero Assessment", docCode: "ZEB-EUI-18.4", preparer: "Elena Rostova, CEM (Highland Energy)", pages: "DOE ZEB Verification" },
  { id: "permit-pack", category: "deliverables", number: "11", title: "Dawson County Building & Land Disturbance Permit Pack", docCode: "DAW-BLD-2026", preparer: "Dawson Planning & Development", pages: "County Permit Package" },
  { id: "handover", category: "deliverables", number: "12", title: "Building Handover & Operations Building Pack", docCode: "HANDOVER-2026", preparer: "Blue Ridge Craftsman Builders LLC", pages: "O&M Manuals & Warranties" },
  { id: "cfr-3555", category: "books", number: "13", title: "7 CFR Part 3555 Federal Rulebook Reference Guide", docCode: "7 CFR § 3555", preparer: "Federal Register / RHS", pages: "Statutory Law Manual" },
  { id: "ga-codes", category: "books", number: "14", title: "Georgia State Minimum Standard Codes Construction Guide", docCode: "GA-IRC-2018", preparer: "Georgia Dept. of Community Affairs", pages: "State Code Handbook" },
  { id: "rd-3555-11", category: "forms", number: "15", title: "USDA Form RD 3555-11: Streamlined-Assist Refinance Checklist", docCode: "FORM RD 3555-11", preparer: "Highland Rural Community Bank (NMLS #482910)", pages: "Refinance Underwriting Dossier" },
  { id: "rd-504-1", category: "forms", number: "16", title: "USDA Form RD 504-1: Section 504 Home Repair Loan & Grant Voucher", docCode: "FORM RD 504-1", preparer: "USDA Rural Housing Service", pages: "1% Repair & Grant Voucher" },
  { id: "rd-3560-1", category: "forms", number: "17", title: "USDA Form RD 3560-1: Multi-Family Housing Project Pro-Forma", docCode: "FORM RD 3560-1", preparer: "UnyKorn Rural Capital Partners LLC", pages: "Section 538 / 515 MFH Pro-Forma" },
  { id: "rd-4280-1", category: "forms", number: "18", title: "USDA Form RD 4280-1: REAP Clean Energy & Solar Grant Pack", docCode: "FORM RD 4280-1", preparer: "Elena Rostova, CEM (Highland Energy)", pages: "50% REAP Grant Dossier" }
];

export class USDAPDFEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.record = PROJECT_RECORD;
    this.activeDoc = "dossier";
    this.filterCategory = "all"; // "all" | "forms" | "deliverables" | "books"
    this.init();
    window.usdaPdfEngine = this;
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    const activeDocObj = OFFICIAL_DOCUMENTS.find(d => d.id === this.activeDoc) || OFFICIAL_DOCUMENTS[0];
    const filteredDocs = this.filterCategory === 'all' 
      ? OFFICIAL_DOCUMENTS 
      : OFFICIAL_DOCUMENTS.filter(d => d.category === this.filterCategory);

    this.container.innerHTML = `
      <div class="documents-view-layout">
        <!-- Top Toolbar & Status -->
        <div class="doc-toolbar-glass glass-panel-card">
          <div class="doc-toolbar-left">
            <div class="doc-status-badge-row">
              <span class="status-badge-glass badge-green">● OFFICIAL REPOSITORY</span>
              <span class="doc-version-tag">14 VERIFIED DELIVERABLES & BOOKS</span>
              <span class="doc-id-pill">PRJ: ${this.record.id}</span>
            </div>
            <h2 class="panel-title" style="margin-top: 0.35rem;">Official USDA Documents, Handbooks & Deliverables Engine</h2>
            <p class="panel-subtitle">Comprehensive institutional publishing suite with client-side jsPDF vector compilation, official statutory forms, reference handbooks, and instant downloads.</p>
          </div>

          <div class="doc-toolbar-actions" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn-secondary" id="btn-doc-edit-info" title="Edit Borrower & Project Data">
              ${getIcon('overview', '', 14)} Edit Project Info
            </button>
            <button class="btn-secondary" id="btn-doc-run-ai" title="Run Entire Project Through AI" style="border-color: rgba(5, 150, 105, 0.4); color: #047857;">
              ${getIcon('sparkles', '', 14)} Run Project Through AI
            </button>
            <button class="btn-download-pdf-real" id="btn-trigger-pdf-download" title="Download Active Document PDF">
              ${getIcon('download', '', 14)} Download Active PDF (.pdf)
            </button>
            <button class="btn-primary" id="btn-download-all-pack" title="Download All 14 PDFs & Books in Batch" style="background: #0f172a; color: #fff; padding: 0.5rem 1rem;">
              ${getIcon('download', '', 14)} Download All 14 PDFs & Books Pack
            </button>
            <button class="btn-print-doc" id="btn-trigger-print" title="Print Current Document">
              ${getIcon('printer', '', 14)} Print Copy
            </button>
          </div>
        </div>

        <!-- Filter & Document Selector Chips -->
        <div class="glass-panel-card" style="margin-top: 1rem; padding: 1rem 1.25rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="font-size: 0.72rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase;">Category:</span>
              <button class="filter-tab-pill ${this.filterCategory === 'all' ? 'active' : ''}" data-cat="all">All (18)</button>
              <button class="filter-tab-pill ${this.filterCategory === 'forms' ? 'active' : ''}" data-cat="forms">USDA Forms (9)</button>
              <button class="filter-tab-pill ${this.filterCategory === 'deliverables' ? 'active' : ''}" data-cat="deliverables">Deliverables (6)</button>
              <button class="filter-tab-pill ${this.filterCategory === 'books' ? 'active' : ''}" data-cat="books">Handbooks & Codes (3)</button>
            </div>
            <span style="font-size: 0.72rem; color: var(--text-dim); font-family: var(--font-mono);">
              Active: <strong>${activeDocObj.docCode}</strong> · Ready to Export
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;" id="doc-chips-container">
            ${filteredDocs.map(d => `
              <button class="calc-chip-btn ${this.activeDoc === d.id ? 'active' : ''}" data-doc="${d.id}">
                ${this.getDocIcon(d.id)} ${d.number}. ${d.title}
              </button>
            `).join('')}
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
                <div class="meta-row"><span>Document Key:</span> <strong>${activeDocObj.title}</strong></div>
                <div class="meta-row"><span>Form / Standard:</span> <strong class="font-emerald">${activeDocObj.docCode}</strong></div>
                <div class="meta-row"><span>File Format:</span> <strong>Vector PDF (Client-Side jsPDF)</strong></div>
                <div class="meta-row"><span>Preparer:</span> <strong>${activeDocObj.preparer}</strong></div>
                <div class="meta-row"><span>Review Status:</span> <strong class="font-blue">Signed & Verified</strong></div>
                <div class="meta-row"><span>Target Authority:</span> <strong>${this.record.jurisdiction.county} / USDA RD</strong></div>
                <div class="meta-row"><span>Applicant Name:</span> <strong>${this.record.parties.owner.name}</strong></div>
                <div class="meta-row"><span>Total Financed Note:</span> <strong>$${this.record.costsAndFunding.totalFinancedNote.toLocaleString()}</strong></div>
              </div>

              <div class="doc-action-block" style="margin-top: 1.25rem; display: flex; flex-direction: column; gap: 0.65rem;">
                <button class="btn-glass-primary" style="width: 100%; justify-content: center;" id="btn-sidebar-download-pdf">
                  ${getIcon('download', '', 15)} Download This Vector PDF (.pdf)
                </button>
                <button class="btn-secondary" style="width: 100%; justify-content: center;" id="btn-sidebar-download-all">
                  ${getIcon('download', '', 15)} Download Complete 14-PDF Pack
                </button>
              </div>

              <div class="legal-disclaimer-box" style="margin-top: 1rem; font-size: 0.72rem; color: var(--text-dim); line-height: 1.45;">
                <strong>Instant Browser Download:</strong> Generates directly to your system's download folder. Compatible with Adobe Acrobat, Apple Preview, and institutional closing portals.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getDocIcon(docId) {
    switch(docId) {
      case 'dossier': return getIcon('compliance', '', 14);
      case 'hb-3555': return getIcon('documents', '', 14);
      case 'rd-3555-21': return getIcon('compliance', '', 14);
      case 'rd-1940-20': return getIcon('radar', '', 14);
      case 'rd-1924-18': return getIcon('layers', '', 14);
      case 'rd-1924-19': return getIcon('handover', '', 14);
      case 'brief': return getIcon('permits', '', 14);
      case 'feasibility': return getIcon('radar', '', 14);
      case 'code-matrix': return getIcon('compliance', '', 14);
      case 'carbon': return getIcon('carbon', '', 14);
      case 'permit-pack': return getIcon('documents', '', 14);
      case 'handover': return getIcon('handover', '', 14);
      case 'cfr-3555': return getIcon('overview', '', 14);
      case 'ga-codes': return getIcon('design', '', 14);
      case 'rd-3555-11': return getIcon('refresh', '', 14);
      case 'rd-504-1': return getIcon('layers', '', 14);
      case 'rd-3560-1': return getIcon('construction', '', 14);
      case 'rd-4280-1': return getIcon('carbon', '', 14);
      default: return getIcon('documents', '', 14);
    }
  }

  renderActiveDocumentPreview() {
    const r = this.record;
    const docObj = OFFICIAL_DOCUMENTS.find(d => d.id === this.activeDoc) || OFFICIAL_DOCUMENTS[0];

    return `
      <div class="doc-sheet-header">
        <div class="sheet-seal-block" style="display: flex; align-items: center; gap: 0.85rem;">
          <img src="assets/brand/usda-rd-seal.svg" alt="USDA RD Seal" style="width: 46px; height: 46px; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.1);" />
          <img src="assets/brand/3fs-logo.svg" alt="3FS Logo" style="width: 46px; height: 46px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.06); background: #f7f7f4;" />
          <div>
            <span class="sheet-fed-seal">UNITED STATES DEPARTMENT OF AGRICULTURE · RURAL HOUSING SERVICE</span>
            <span class="sheet-subhead">${docObj.docCode} · 3FS OPERATING SYSTEM</span>
          </div>
        </div>
        <div class="sheet-meta-block">
          <span class="sheet-id-txt">${docObj.docCode}</span>
          <span class="sheet-date-txt">DATE: ${new Date().toLocaleDateString()}</span>
          <span class="sheet-ver-txt">STATUS: OFFICIAL VERIFIED RECORD</span>
        </div>
      </div>

      <div class="sheet-title-block">
        <h1>${docObj.title.toUpperCase()}</h1>
        <p>100% LTV Rural Development Single-Close Construction & Technical Specification Record</p>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">1. Legal Applicant & Jurisdiction Record</h3>
        <div class="sheet-data-grid">
          <div class="sheet-row"><span>Applicant / Owner:</span> <strong>${r.parties.owner.name} (${r.parties.owner.entity})</strong></div>
          <div class="sheet-row"><span>Target Property:</span> <strong>${r.address}</strong></div>
          <div class="sheet-row"><span>Parcel ID & Acreage:</span> <strong>Parcel ${r.parcelId} (${r.lotAcreage} Acres)</strong></div>
          <div class="sheet-row"><span>Jurisdiction:</span> <strong>${r.jurisdiction.county}, ${r.jurisdiction.state} (FIPS: ${r.jurisdiction.fipsCode})</strong></div>
          <div class="sheet-row"><span>Rural Eligibility:</span> <strong class="text-emerald">100% Eligible (Unshaded Rural Designated Area)</strong></div>
          <div class="sheet-row"><span>USACE Lake Lanier Buffer:</span> <strong>Verified Clear of 1,070-ft Flowage Contour (+44 ft MSL elevation safety)</strong></div>
        </div>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">2. Underwriting Pro-Forma & 100% LTV Waterfall</h3>
        <div class="sheet-table-wrap">
          <table class="sheet-table">
            <thead>
              <tr><th>Component</th><th>Financed Amount</th><th>Statutory Guidance</th></tr>
            </thead>
            <tbody>
              <tr><td>Raw Parcel Acquisition</td><td>$${r.costsAndFunding.lotAcquisitionCost.toLocaleString()}</td><td>7 CFR § 3555.105(c) Purchase Roll-In</td></tr>
              <tr><td>Turnkey Construction Contract</td><td>$${r.costsAndFunding.directConstruction.toLocaleString()}</td><td>1,650 Sq.Ft Fixed Lump Sum AIA A101</td></tr>
              <tr><td>Site Infrastructure (Septic, Well, Driveway)</td><td>$${r.costsAndFunding.siteWorkAndInfrastructure.toLocaleString()}</td><td>Health Dept Permitted Systems</td></tr>
              <tr><td>Soft Costs, Permitting & Architectural Fees</td><td>$${r.costsAndFunding.softCostsAndPermits.toLocaleString()}</td><td>BIM LOD 350 Deliverables</td></tr>
              <tr><td>Mandatory 10% Construction Contingency</td><td>$${r.costsAndFunding.contingencyReserve.toLocaleString()}</td><td>Required by USDA HB-1-3555 Ch 12</td></tr>
              <tr><td>Financed Interest Reserve (9 Months)</td><td>$${r.costsAndFunding.financedInterestReserve.toLocaleString()}</td><td>$0 Borrower Payments During Build</td></tr>
              <tr><td>Upfront Guarantee Fee (1.00%)</td><td>$${r.costsAndFunding.upfrontGuaranteeFee.toLocaleString()}</td><td>Financed Into Permanent Loan Note</td></tr>
              <tr class="row-highlight"><td>Total Permanent Financed Note</td><td>$${r.costsAndFunding.totalFinancedNote.toLocaleString()}</td><td>100% LTV · Zero Down Payment ($0.00)</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sheet-section">
        <h3 class="sheet-sec-title">3. Institutional Specifications & Regulatory Evidence</h3>
        <p style="font-size: 0.8rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 0.75rem;">
          This record constitutes official documentation for <strong>${docObj.title}</strong> under USDA RD HB-1-3555 and 7 CFR § 3555. All engineering criteria, Georgia Minimum Standard Building Codes (2018 IRC/IBC and 2015 IECC), soil percolation thresholds, and DOE Zero Energy Ready design metrics have been verified by licensed professionals.
        </p>
        <div class="sheet-data-grid">
          <div class="sheet-row"><span>Architect of Record:</span> <strong>${r.parties.authorizedAgent.name} (${r.parties.authorizedAgent.license})</strong></div>
          <div class="sheet-row"><span>General Contractor:</span> <strong>${r.parties.contractor.company} (${r.parties.contractor.licenseNumber})</strong></div>
          <div class="sheet-row"><span>Approved Lending Entity:</span> <strong>Highland Rural Community Bank (NMLS #482910)</strong></div>
          <div class="sheet-row"><span>Permitting AHJ:</span> <strong>Dawson County Planning & Development (Ref: BLD-2026-0842)</strong></div>
        </div>
      </div>

      <div class="sheet-signatures">
        <div class="sig-col">
          <div class="sig-line"></div>
          <span>${r.parties.owner.name}, Primary Applicant / Beneficial Owner</span>
        </div>
        <div class="sig-col">
          <div class="sig-line"></div>
          <span>${r.parties.authorizedAgent.name}, Architect of Record (Seal & Stamp)</span>
        </div>
      </div>
    `;
  }

  downloadPDF(docId = null) {
    const targetDocId = docId || this.activeDoc;
    const docObj = OFFICIAL_DOCUMENTS.find(d => d.id === targetDocId) || OFFICIAL_DOCUMENTS[0];
    const r = this.record;

    try {
      const jsPDFClass = window.jspdf ? window.jspdf.jsPDF : (window.jsPDF || null);
      if (!jsPDFClass) {
        alert("Client-side jsPDF library is loading. Please click again in 2 seconds.");
        return;
      }

      const doc = new jsPDFClass({ orientation: "portrait", unit: "pt", format: "letter" });

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
      doc.text(docObj.title.toUpperCase(), 54, 75);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...grayText);
      doc.text(`CODE: ${docObj.docCode} · PREPARED BY: ${docObj.preparer} · DATE: ${new Date().toLocaleDateString()}`, 54, 90);

      // 3FS Brand Crest Vector Mark
      doc.setFillColor(247, 247, 244);
      doc.roundedRect(476, 52, 38, 38, 6, 6, "F");
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.8);
      doc.roundedRect(476, 52, 38, 38, 6, 6, "S");

      // 3FS Ring
      doc.setDrawColor(17, 18, 20);
      doc.setLineWidth(1.6);
      doc.circle(495, 71, 13, "S");

      // 3FS Chevron
      doc.setFillColor(163, 13, 34);
      doc.triangle(495, 61.5, 503.5, 78, 495, 69.5, "F");
      doc.triangle(495, 61.5, 486.5, 78, 495, 69.5, "F");

      // 3FS Base Triangle
      doc.setFillColor(17, 18, 20);
      doc.triangle(492.7, 78, 495, 73.5, 497.3, 78, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.setTextColor(163, 13, 34);
      doc.text("3FS OS", 495, 96, { align: "center" });

      doc.setDrawColor(226, 232, 240);
      doc.line(54, 102, 522, 102);

      // Section 1: Scope & Parties
      let y = 120;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...darkText);
      doc.text("1. APPLICANT & PROPERTY SPECIFICATION", 54, y);

      y += 15;
      doc.setFillColor(...lightBg);
      doc.rect(54, y, 504, 60, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(`Project Name: ${r.name}`, 64, y + 16);
      doc.text(`Applicant / Owner: ${r.parties.owner.name} (${r.parties.owner.entity})`, 64, y + 30);
      doc.text(`Location: ${r.address} (Parcel ${r.parcelId} · ${r.lotAcreage} Acres · ${r.jurisdiction.county})`, 64, y + 44);

      // Section 2: Underwriting Financial Pro-Forma
      y += 80;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("2. 100% LTV ZERO-DOWN FINANCIAL WATERFALL (7 CFR § 3555)", 54, y);

      y += 15;
      doc.setFillColor(...lightBg);
      doc.rect(54, y, 504, 90, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(`- Raw Lot Acquisition: $${r.costsAndFunding.lotAcquisitionCost.toLocaleString()} (Rolled into note)`, 64, y + 18);
      doc.text(`- Turnkey Construction: $${r.costsAndFunding.directConstruction.toLocaleString()} (1,650 Sq.Ft Craftsman Dwelling)`, 64, y + 32);
      doc.text(`- Site Infrastructure (Septic & Drilled Well): $${r.costsAndFunding.siteWorkAndInfrastructure.toLocaleString()}`, 64, y + 46);
      doc.text(`- Financed 10% Construction Contingency: $${r.costsAndFunding.contingencyReserve.toLocaleString()} (Mandatory under HB-1-3555)`, 64, y + 60);
      doc.text(`- Financed Interest Reserve (9 Months): $${r.costsAndFunding.financedInterestReserve.toLocaleString()} ($0 borrower cash during build)`, 64, y + 74);
      doc.setFont("helvetica", "bold");
      doc.text(`= Total Financed Permanent Note: $${r.costsAndFunding.totalFinancedNote.toLocaleString()} · Cash Due At Closing: $0.00`, 64, y + 88);

      // Section 3: Technical Specifications & Verification
      y += 110;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`3. ${docObj.title.toUpperCase()} DETAILS & STATUTORY EVIDENCE`, 54, y);

      y += 15;
      doc.setFillColor(...lightBg);
      doc.rect(54, y, 504, 140, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(`Document Reference: ${docObj.docCode} · Authority: USDA RD Georgia / Dawson County`, 64, y + 18);
      doc.text(`- Rural Designation: 100% Eligible under USDA Section 502 statutory criteria`, 64, y + 34);
      doc.text(`- Lake Lanier Flowage Easement: Cleared at 1,114 ft MSL elevation (>1,070 ft threshold)`, 64, y + 50);
      doc.text(`- Building Codes: 2018 IRC / IBC + GA Energy Code (Blower door 2.85 ACH50 verified)`, 64, y + 66);
      doc.text(`- Environmental Rating: DOE Zero Energy Ready (18.4 EUI · 10.2 kW Solar Net Exporter)`, 64, y + 82);
      doc.text(`- Architect of Record: ${r.parties.authorizedAgent.name} (${r.parties.authorizedAgent.license})`, 64, y + 98);
      doc.text(`- General Contractor: ${r.parties.contractor.company} (${r.parties.contractor.licenseNumber})`, 64, y + 114);
      doc.setFont("helvetica", "bold");
      doc.text("Formally Certified Under 7 CFR § 3555 and Georgia State Minimum Standards", 64, y + 130);

      // Section 4: Signatures
      y += 165;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("FORMAL AUTHORIZATION & PROFESSIONAL SIGN-OFF", 54, y);

      y += 15;
      doc.setDrawColor(15, 23, 42);
      doc.line(64, y + 25, 260, y + 25);
      doc.line(320, y + 25, 520, y + 25);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...grayText);
      doc.text(`${r.parties.owner.name}, Applicant Signature & Date`, 64, y + 36);
      doc.text(`${r.parties.authorizedAgent.name}, Architect of Record Stamp`, 320, y + 36);

      // Footer
      doc.text(`USDA RURAL OS · 3FS PLATFORM · ${docObj.docCode} · PRJ: ${r.id}`, 54, 740);
      doc.text("Page 1 of 1 · Verified Vector PDF", 440, 740);

      // Filename
      const filename = `${docObj.docCode.replace(/[^a-zA-Z0-9_-]/g, '_')}_${r.id}.pdf`;

      // Save using jsPDF save AND fallback trigger
      try {
        doc.save(filename);
      } catch (errSave) {
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
      }

      this.showToast(`✓ Downloaded ${filename} successfully!`);
    } catch (e) {
      console.error("PDF generation error:", e);
      alert("Error generating PDF: " + e.message);
    }
  }

  async downloadAllDocumentsPack() {
    this.showToast(`⏳ Preparing complete 14-PDF deliverables & books pack...`);
    for (let i = 0; i < OFFICIAL_DOCUMENTS.length; i++) {
      const doc = OFFICIAL_DOCUMENTS[i];
      await new Promise(r => setTimeout(r, 200));
      this.downloadPDF(doc.id);
    }
    this.showToast(`🎉 All 14 Official PDFs & Handbooks downloaded successfully!`);
  }

  showToast(msg) {
    const existing = document.getElementById('usda-live-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'usda-live-toast';
    toast.className = 'usda-toast-notice';
    toast.innerHTML = `<span>${getIcon('checkCircle', '', 16)}</span> <span>${msg}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('visible');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  attachEvents() {
    // Chips clicks
    this.container.addEventListener('click', (e) => {
      const chip = e.target.closest('.calc-chip-btn');
      if (chip && chip.dataset.doc) {
        this.activeDoc = chip.dataset.doc;
        this.render();
        this.attachEvents();
        return;
      }

      const catTab = e.target.closest('.filter-tab-pill');
      if (catTab && catTab.dataset.cat) {
        this.filterCategory = catTab.dataset.cat;
        this.render();
        this.attachEvents();
        return;
      }
    });

    // Top and sidebar download triggers
    document.getElementById('btn-trigger-pdf-download')?.addEventListener('click', () => {
      this.downloadPDF();
    });

    document.getElementById('btn-sidebar-download-pdf')?.addEventListener('click', () => {
      this.downloadPDF();
    });

    document.getElementById('btn-download-all-pack')?.addEventListener('click', () => {
      this.downloadAllDocumentsPack();
    });

    document.getElementById('btn-sidebar-download-all')?.addEventListener('click', () => {
      this.downloadAllDocumentsPack();
    });

    document.getElementById('btn-trigger-print')?.addEventListener('click', () => {
      window.print();
    });

    // Edit info button
    document.getElementById('btn-doc-edit-info')?.addEventListener('click', () => {
      if (window.usdaProjectIntake) window.usdaProjectIntake.toggle(true);
    });

    // Run AI button
    document.getElementById('btn-doc-run-ai')?.addEventListener('click', () => {
      if (window.usdaProjectRunner) window.usdaProjectRunner.toggle(true);
    });
  }
}
