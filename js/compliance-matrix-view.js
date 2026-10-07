// Building Codes & Traceable Compliance Matrix Engine
// Tracks: Applicable jurisdiction, adopted editions, amendments, requirements, evidence, assigned pros, and review status.
import { PROJECT_RECORD } from '../data/project-record.js';

export class USDAComplianceMatrixView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.record = PROJECT_RECORD;
    this.filterStatus = 'ALL';
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    const matrix = this.record.buildingCodesMatrix;
    const jur = this.record.jurisdiction;
    const items = matrix.applicableCodes.filter(c => this.filterStatus === 'ALL' || c.status === this.filterStatus);

    this.container.innerHTML = `
      <div class="compliance-matrix-layout">
        <!-- Top Compliance Header -->
        <div class="glass-panel-card">
          <div class="panel-header-flex">
            <div>
              <span class="status-badge-glass badge-green">● LOCALIZED JURISDICTION MATRIX</span>
              <h2 class="panel-title" style="margin-top: 0.35rem;">Building Codes & Traceable Compliance Engine</h2>
              <p class="panel-subtitle">Jurisdiction: <strong>${jur.county}, ${jur.state}</strong> (${jur.city}) · AHJ: <strong>${this.record.parties.authorities[0].name}</strong></p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn-glass-secondary" id="btn-export-code-matrix">Export Matrix PDF</button>
            </div>
          </div>

          <!-- Adopted Local Codes Strip -->
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; padding-top: 0.85rem; border-top: 1px solid var(--glass-border);">
            <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; align-self: center; margin-right: 0.25rem;">Adopted Editions:</span>
            ${jur.adoptedBuildingCodes.map(code => `
              <span class="status-badge-glass badge-blue" style="font-size: 0.7rem;">${code}</span>
            `).join('')}
          </div>

          <!-- Status Filter Tabs -->
          <div style="display: flex; gap: 0.5rem; margin-top: 1rem; align-items: center;">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">Filter by Status:</span>
            <button class="calc-chip-btn ${this.filterStatus === 'ALL' ? 'active' : ''}" data-filter="ALL">All Requirements (7)</button>
            <button class="calc-chip-btn ${this.filterStatus === 'ACCEPTED' ? 'active' : ''}" data-filter="ACCEPTED">Accepted (5)</button>
            <button class="calc-chip-btn ${this.filterStatus === 'MISSING_EVIDENCE' ? 'active' : ''}" data-filter="MISSING_EVIDENCE">Missing Evidence (1)</button>
            <button class="calc-chip-btn ${this.filterStatus === 'REVIEWED' ? 'active' : ''}" data-filter="REVIEWED">Reviewed (1)</button>
          </div>
        </div>

        <!-- Requirements Checklist Cards -->
        <div class="compliance-items-grid" style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.25rem;">
          ${items.map(item => {
            const isAccepted = item.status === 'ACCEPTED';
            const isMissing = item.status === 'MISSING_EVIDENCE';
            const badgeClass = isAccepted ? 'badge-green' : isMissing ? 'badge-rose' : 'badge-amber';
            const borderAccent = isAccepted ? 'var(--emerald)' : isMissing ? 'var(--rose)' : 'var(--amber)';

            return `
              <div class="glass-panel-card" style="border-left: 4px solid ${borderAccent}; padding: 1.1rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                      <span class="status-badge-glass badge-purple" style="font-size: 0.72rem; font-weight: 700;">${item.code} § ${item.section}</span>
                      <span class="status-badge-glass badge-blue" style="font-size: 0.72rem;">${item.amendment}</span>
                      <strong style="font-size: 0.95rem; color: var(--text-primary);">${item.subject}</strong>
                    </div>

                    <div style="margin-top: 0.6rem; background: #f8fafc; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
                      <span style="font-size: 0.68rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Statutory Requirement:</span>
                      <p style="font-size: 0.8rem; color: var(--text-primary); margin-top: 0.15rem; line-height: 1.45;">
                        ${item.requirementText}
                      </p>
                    </div>

                    <div style="margin-top: 0.6rem; background: rgba(240, 253, 244, 0.4); padding: 0.65rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(5, 150, 105, 0.2);">
                      <span style="font-size: 0.68rem; font-weight: 800; color: var(--emerald); text-transform: uppercase;">Supporting Evidence & Plan Sheet:</span>
                      <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.15rem;">
                        ${item.evidenceRef}
                      </p>
                    </div>

                    ${item.actionItem ? `
                      <div style="margin-top: 0.6rem; background: rgba(254, 242, 242, 0.6); padding: 0.65rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(225, 29, 72, 0.25);">
                        <span style="font-size: 0.68rem; font-weight: 800; color: var(--rose); text-transform: uppercase;">⚠️ Required Action to Resolve:</span>
                        <p style="font-size: 0.78rem; color: var(--rose); font-weight: 600; margin-top: 0.15rem;">
                          ${item.actionItem}
                        </p>
                      </div>
                    ` : ''}
                  </div>

                  <!-- Right Meta Box -->
                  <div style="margin-left: 1.5rem; display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem; min-width: 170px;">
                    <span class="status-badge-glass ${badgeClass}" style="font-size: 0.75rem;">
                      ${isAccepted ? '✓ ACCEPTED' : isMissing ? '⚠️ MISSING EVIDENCE' : '⏳ REVIEWED'}
                    </span>
                    <span style="font-size: 0.72rem; color: var(--text-dim); margin-top: 0.35rem;">Assigned Pro:</span>
                    <strong style="font-size: 0.78rem; color: var(--text-primary); text-align: right;">${item.assignedPro}</strong>
                    <span style="font-size: 0.68rem; color: var(--text-dim);">Reviewed: ${item.reviewDate}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Professional Authority Boundary Card -->
        <div class="glass-panel-card" style="margin-top: 1.5rem; background: #ffffff;">
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <span style="font-size: 1.5rem;">⚖️</span>
            <div>
              <h4 style="font-size: 0.92rem; font-weight: 800; color: var(--text-primary);">Independent Engineering & Architecture Gate</h4>
              <p style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5; margin-top: 0.2rem;">
                State law (O.C.G.A. Title 43, Chapters 4 & 15) requires official plans submitted to Dawson County to bear the seal and wet or verified digital signature of a Georgia registered architect or professional engineer. AI facilitates audits, compliance tracking, and automated deficiency alerts, but does not stamp or issue official approvals.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.container.querySelectorAll('.calc-chip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterStatus = e.currentTarget.getAttribute('data-filter');
        this.render();
        this.attachEvents();
      });
    });

    document.getElementById('btn-export-code-matrix')?.addEventListener('click', () => {
      if (window.usdaApp && window.usdaApp.switchTab) {
        window.usdaApp.switchTab('documents');
      }
    });
  }
}
