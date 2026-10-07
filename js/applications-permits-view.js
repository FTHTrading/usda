// Applications & Permits Management Engine
// Tracks: Required forms, applicant authorizations, fee ledgers, submission tracking, reviewer comments, and authorization gates.
import { PROJECT_RECORD } from '../data/project-record.js';

export class USDAApplicationsPermitsView {
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
    const apps = this.record.applicationsAndPermits;

    this.container.innerHTML = `
      <div class="apps-permits-layout">
        <!-- Top Applications Header -->
        <div class="glass-panel-card">
          <div class="panel-header-flex">
            <div>
              <span class="status-badge-glass badge-green">● STATUTORY PERMIT & LOAN DOSSIERS</span>
              <h2 class="panel-title" style="margin-top: 0.35rem;">Applications, Permits & Regulatory Submissions</h2>
              <p class="panel-subtitle">Tracks Dawson County Building Permits, Environmental Health Septic, EPD Land Disturbance, and USDA Form 3555-SC.</p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn-glass-secondary" id="btn-export-permit-package">Export Permit Package PDF</button>
            </div>
          </div>

          <!-- Total Fees & Review Status Summary Bar -->
          <div class="test-kpi-bar" style="margin-top: 1rem; padding-top: 0.85rem; border-top: 1px solid var(--glass-border);">
            <div class="t-kpi">
              <span class="t-lbl">Total Application Filings:</span>
              <strong class="t-val">${apps.length} Filings</strong>
            </div>
            <div class="t-kpi">
              <span class="t-lbl">Total Statutory Fees:</span>
              <strong class="t-val font-blue">$1,750.00</strong>
            </div>
            <div class="t-kpi">
              <span class="t-lbl">Fees Paid:</span>
              <strong class="t-val font-emerald">$1,590.00 (90.8%)</strong>
            </div>
            <div class="t-kpi">
              <span class="t-lbl">Pending Authorization:</span>
              <strong class="t-val font-amber">$160.00 (EPD)</strong>
            </div>
          </div>
        </div>

        <!-- 4 Application Package Cards -->
        <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1.25rem;">
          ${apps.map(app => {
            const isApproved = app.status === 'APPROVED_ISSUED';
            const isReview = app.status === 'UNDER_REVIEW';
            const isDossier = app.status === 'DOSSIER_COMPILED';
            const badgeClass = isApproved ? 'badge-green' : isReview ? 'badge-amber' : isDossier ? 'badge-purple' : 'badge-rose';

            return `
              <div class="glass-panel-card" style="padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span class="status-badge-glass badge-blue" style="font-size: 0.72rem;">${app.id}</span>
                      <strong style="font-size: 1.05rem; color: var(--text-primary);">${app.name}</strong>
                    </div>
                    <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.25rem;">
                      Authority: <strong>${app.agency}</strong> · Reference: <strong>${app.referenceNo}</strong>
                    </p>
                    <div style="display: flex; gap: 1rem; font-size: 0.74rem; color: var(--text-secondary); margin-top: 0.35rem;">
                      <span>Preparer: <strong>${app.preparer}</strong></span>
                      <span>Signer: <strong>${app.signer}</strong></span>
                      <span>Fee: <strong>$${app.fee}</strong> (${app.feePaid ? '<span class="font-emerald">Paid</span>' : '<span class="font-amber">Pending Payment</span>'})</span>
                    </div>
                  </div>

                  <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem;">
                    <span class="status-badge-glass ${badgeClass}" style="font-size: 0.75rem;">
                      ${app.status.replace(/_/g, ' ')}
                    </span>
                    <span style="font-size: 0.7rem; color: var(--text-dim);">Submitted: ${app.submissionDate}</span>
                  </div>
                </div>

                <!-- Required Attachments & Checklists -->
                <div style="margin-top: 1rem; background: #f8fafc; border-radius: var(--radius-md); padding: 0.85rem; border: 1px solid var(--glass-border);">
                  <strong style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Required Application Evidence & Plan Attachments:</strong>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.5rem; margin-top: 0.5rem;">
                    ${app.requiredAttachments.map(att => `
                      <div style="background: #ffffff; padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(226, 232, 240, 0.7); display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.76rem; color: var(--text-primary);">${att.name}</span>
                        <span class="status-badge-glass ${att.status === 'ATTACHED' || att.status === 'APPROVED' || att.status === 'GENERATED' ? 'badge-green' : 'badge-amber'}" style="font-size: 0.65rem;">
                          ${att.status}
                        </span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Reviewer Comments if Any -->
                ${app.reviewerComments && app.reviewerComments.length > 0 ? `
                  <div style="margin-top: 0.85rem; background: rgba(254, 243, 199, 0.5); border-radius: var(--radius-md); padding: 0.75rem 0.9rem; border: 1px solid rgba(217, 119, 6, 0.25);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="font-size: 0.72rem; font-weight: 800; color: var(--amber); text-transform: uppercase;">Official Reviewer Comment:</span>
                      <span style="font-size: 0.68rem; color: var(--text-dim);">${app.reviewerComments[0].date}</span>
                    </div>
                    <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.25rem;">
                      "${app.reviewerComments[0].text}" — <strong>${app.reviewerComments[0].reviewer}</strong>
                    </p>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  attachEvents() {
    document.getElementById('btn-export-permit-package')?.addEventListener('click', () => {
      if (window.usdaApp && window.usdaApp.switchTab) {
        window.usdaApp.switchTab('documents');
      }
    });
  }
}
