// Construction Tracking & Field Operations Engine
// Tracks: Milestones, 5-stage inspection draws, 10% retainage holdbacks, RFIs, change orders, and pre-requisite inspections.
import { PROJECT_RECORD } from '../data/project-record.js';

export class USDAConstructionTrackingView {
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
    const build = this.record.constructionTracking;

    this.container.innerHTML = `
      <div class="construction-tracking-layout">
        <!-- Top Construction Header -->
        <div class="glass-panel-card">
          <div class="panel-header-flex">
            <div>
              <span class="status-badge-glass badge-green">● LIVE CONSTRUCTION RECORD</span>
              <h2 class="panel-title" style="margin-top: 0.35rem;">Construction Milestone Draws & Field Coordination</h2>
              <p class="panel-subtitle">General Contractor: <strong>${build.contractor}</strong> · Target Groundbreak: <strong>${build.scheduledGroundbreak}</strong> · Duration: <strong>${build.durationMonths} Months</strong></p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn-glass-secondary" id="btn-export-progress-report">Export Construction Report PDF</button>
            </div>
          </div>

          <!-- Total Escrow & Retainage Bar -->
          <div class="test-kpi-bar" style="margin-top: 1rem; padding-top: 0.85rem; border-top: 1px solid var(--glass-border);">
            <div class="t-kpi">
              <span class="t-lbl">Total Escrowed Funds:</span>
              <strong class="t-val font-blue">$${build.totalEscrow.toLocaleString()}</strong>
            </div>
            <div class="t-kpi">
              <span class="t-lbl">Retainage Rate:</span>
              <strong class="t-val font-amber">${build.retainageRatePct}% Holdback</strong>
            </div>
            <div class="t-kpi">
              <span class="t-lbl">Total Retainage Pool:</span>
              <strong class="t-val font-amber">$${Math.round(build.totalEscrow * (build.retainageRatePct / 100)).toLocaleString()}</strong>
            </div>
            <div class="t-kpi">
              <span class="t-lbl">Current Milestone:</span>
              <strong class="t-val font-emerald">${build.currentMilestone}</strong>
            </div>
          </div>
        </div>

        <!-- 5-Stage Construction Draw Schedule Table -->
        <div class="glass-panel-card" style="margin-top: 1.25rem;">
          <div class="panel-header-flex">
            <div>
              <h3 class="panel-title">5-Stage Escrow Disbursement & Inspection Schedule</h3>
              <p class="panel-subtitle">Funds released only upon verified county inspector and USDA appraiser signoff</p>
            </div>
            <span class="status-badge-glass badge-green">HB-1-3555 Appendix 8</span>
          </div>

          <table class="sheet-table" style="margin-top: 1rem; width: 100%;">
            <thead>
              <tr>
                <th>Milestone</th>
                <th>Construction Phase</th>
                <th>Allocation %</th>
                <th>Gross Escrow</th>
                <th>Retainage Holdback (10%)</th>
                <th>Net Disbursement to GC</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${build.stages.map(s => `
                <tr>
                  <td><strong>Stage #${s.stageNum}</strong></td>
                  <td>
                    <strong>${s.title}</strong>
                    <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 0.15rem;">
                      Inspections: ${s.prerequisiteInspections.join(' · ')}
                    </div>
                  </td>
                  <td>${s.percent}%</td>
                  <td>$${s.amount.toLocaleString()}</td>
                  <td class="font-amber">-$${s.retainageHoldback.toLocaleString()}</td>
                  <td><strong class="font-emerald">$${s.netDisbursement.toLocaleString()}</strong></td>
                  <td>
                    <span class="status-badge-glass" style="font-size: 0.68rem;">
                      ${s.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- 2-Column Split: Active RFIs & Change Orders -->
        <div class="home-bottom-grid" style="margin-top: 1.5rem;">
          <!-- Left: Requests for Information (RFIs) -->
          <div class="glass-panel-card">
            <div class="panel-header-flex">
              <div>
                <h3 class="panel-title">Requests for Information (RFIs)</h3>
                <p class="panel-subtitle">Field coordination queries between general contractor and engineering team</p>
              </div>
              <span class="status-badge-glass badge-blue">${build.rfis.length} Active</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 1rem;">
              ${build.rfis.map(rfi => `
                <div style="background: #ffffff; border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 0.85rem;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                      <span class="status-badge-glass badge-purple" style="font-size: 0.68rem;">${rfi.rfiNum}</span>
                      <h4 style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">${rfi.subject}</h4>
                    </div>
                    <span class="status-badge-glass ${rfi.status === 'RESOLVED' ? 'badge-green' : 'badge-amber'}" style="font-size: 0.68rem;">
                      ${rfi.status}
                    </span>
                  </div>
                  <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.35rem; line-height: 1.45;">
                    ${rfi.question}
                  </p>
                  ${rfi.resolution ? `
                    <div style="margin-top: 0.4rem; padding: 0.5rem; background: rgba(240, 253, 244, 0.6); border-radius: var(--radius-sm); font-size: 0.72rem; color: var(--emerald);">
                      <strong>Resolution:</strong> ${rfi.resolution}
                    </div>
                  ` : ''}
                  <div style="font-size: 0.7rem; color: var(--text-dim); margin-top: 0.35rem;">
                    Assigned: <strong>${rfi.assignedTo}</strong>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right: Change Orders Register -->
          <div class="glass-panel-card">
            <div class="panel-header-flex">
              <div>
                <h3 class="panel-title">Approved Change Orders</h3>
                <p class="panel-subtitle">Contract modifications with verified scope, cost, and schedule impacts</p>
              </div>
              <span class="status-badge-glass badge-green">1 Approved</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 1rem;">
              ${build.changeOrders.map(co => `
                <div style="background: #ffffff; border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 0.85rem;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                      <span class="status-badge-glass badge-blue" style="font-size: 0.68rem;">${co.coNum}</span>
                      <h4 style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">${co.title}</h4>
                    </div>
                    <span class="status-badge-glass badge-green" style="font-size: 0.68rem;">✓ ${co.status}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-top: 0.4rem; font-size: 0.75rem;">
                    <span>Cost Delta: <strong class="font-emerald">+$${co.costDelta.toLocaleString()}</strong></span>
                    <span>Schedule Delta: <strong>${co.scheduleDeltaDays} Days</strong></span>
                  </div>
                  <p style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem;">
                    Reason: ${co.reason} · Authorized by: <strong>${co.authorizedBy}</strong>
                  </p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    document.getElementById('btn-export-progress-report')?.addEventListener('click', () => {
      if (window.usdaApp && window.usdaApp.switchTab) {
        window.usdaApp.switchTab('documents');
      }
    });
  }
}
