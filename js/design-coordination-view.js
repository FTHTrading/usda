// Design Coordination & Versioning Engine
// Tracks: Drawings, specifications, consultant assignments, active revisions, and automatic change propagation.
import { PROJECT_RECORD } from '../data/project-record.js';

export class USDADesignCoordinationView {
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
    const pkg = this.record.designPackage;
    const pros = this.record.parties.professionals;

    this.container.innerHTML = `
      <div class="design-coord-layout">
        <!-- Top Design Header -->
        <div class="glass-panel-card">
          <div class="panel-header-flex">
            <div>
              <span class="status-badge-glass badge-blue">● BIM LOD 350 COORDINATION</span>
              <h2 class="panel-title" style="margin-top: 0.35rem;">Design Coordination & Versioned Packages</h2>
              <p class="panel-subtitle">Current Package: <strong>${pkg.currentVersion}</strong> · Issued: <strong>${pkg.issuedDate}</strong> · Architect: <strong>${pkg.architectOfRecord}</strong></p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn-glass-secondary" id="btn-export-drawing-index">Export Drawing Index</button>
              <button class="btn-glass-primary" id="btn-create-design-rev">+ Create Revision</button>
            </div>
          </div>

          <!-- Revision Change Propagation Banner -->
          <div class="change-propagation-banner" style="background: rgba(238, 242, 255, 0.7); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: var(--radius-md); padding: 1rem; margin-top: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                <span style="font-size: 1.4rem;">🔄</span>
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="status-badge-glass badge-purple" style="font-size: 0.7rem;">AUTOMATIC CHANGE PROPAGATION</span>
                    <strong style="font-size: 0.88rem; color: var(--text-primary);">${pkg.activeRevisions[0].id}: ${pkg.activeRevisions[0].description}</strong>
                  </div>
                  <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.25rem;">
                    Reason: ${pkg.activeRevisions[0].reason}
                  </p>
                </div>
              </div>
              <span class="status-badge-glass badge-green" style="font-size: 0.7rem;">Status: Accepted</span>
            </div>

            <!-- Cascade Impact Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px solid rgba(99, 102, 241, 0.2);">
              <div style="background: #ffffff; padding: 0.6rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(226, 232, 240, 0.8);">
                <span style="font-size: 0.68rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">💰 Cost Impact:</span>
                <strong style="display: block; font-size: 0.82rem; color: var(--emerald);">${pkg.activeRevisions[0].impacts.costEstimate}</strong>
              </div>
              <div style="background: #ffffff; padding: 0.6rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(226, 232, 240, 0.8);">
                <span style="font-size: 0.68rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">🌱 Carbon Delta:</span>
                <strong style="display: block; font-size: 0.82rem; color: var(--purple);">${pkg.activeRevisions[0].impacts.carbonEmbodied}</strong>
              </div>
              <div style="background: #ffffff; padding: 0.6rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(226, 232, 240, 0.8);">
                <span style="font-size: 0.68rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">⚡ Energy Performance:</span>
                <strong style="display: block; font-size: 0.82rem; color: var(--blue);">${pkg.activeRevisions[0].impacts.energyThermal}</strong>
              </div>
              <div style="background: #ffffff; padding: 0.6rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(226, 232, 240, 0.8);">
                <span style="font-size: 0.68rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">⚖️ Code Verification:</span>
                <strong style="display: block; font-size: 0.82rem; color: var(--text-primary);">${pkg.activeRevisions[0].impacts.buildingCodes}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- 2-Column Split: Master Drawings Register + Consultant Responsibilities -->
        <div class="home-bottom-grid" style="margin-top: 1.5rem;">
          <!-- Left: Master Drawings Set (10 Sheets) -->
          <div class="glass-panel-card">
            <div class="panel-header-flex">
              <div>
                <h3 class="panel-title">Master Drawing Sheets (${pkg.drawingsList.length} Sheets)</h3>
                <p class="panel-subtitle">Version-controlled plan sheets with discipline sign-offs</p>
              </div>
              <span class="status-badge-glass badge-green">Package v2.4</span>
            </div>

            <table class="sheet-table" style="margin-top: 1rem; width: 100%;">
              <thead>
                <tr>
                  <th>Sheet</th>
                  <th>Title & Description</th>
                  <th>Revision</th>
                  <th>Discipline Status</th>
                </tr>
              </thead>
              <tbody>
                ${pkg.drawingsList.map(d => `
                  <tr>
                    <td><strong>${d.sheet}</strong></td>
                    <td>${d.title}</td>
                    <td><span class="status-badge-glass" style="font-size: 0.68rem;">${d.rev}</span></td>
                    <td>
                      <span class="status-badge-glass ${d.status === 'READY' ? 'badge-green' : 'badge-amber'}" style="font-size: 0.68rem;">
                        ${d.status === 'READY' ? '✓ Ready for Submittal' : '⚠️ Seal Required'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Right: Consultant Assignments & Credentials -->
          <div class="glass-panel-card">
            <div class="panel-header-flex">
              <div>
                <h3 class="panel-title">Design Consultant Assignments</h3>
                <p class="panel-subtitle">Assigned licensed professionals and review responsibilities</p>
              </div>
              <span class="status-badge-glass badge-blue">Professional Team</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 1rem;">
              ${pros.map(p => `
                <div style="background: #ffffff; border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 0.85rem;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                      <span style="font-size: 0.7rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase;">${p.discipline}</span>
                      <h4 style="font-size: 0.92rem; font-weight: 800; color: var(--text-primary); margin-top: 0.15rem;">${p.name}</h4>
                      <p style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.15rem;">${p.firm} · ${p.license}</p>
                      <small style="font-size: 0.7rem; color: var(--text-secondary); display: block; margin-top: 0.25rem;">
                        Scope: <strong>${p.reviewAssigned}</strong>
                      </small>
                    </div>
                    <span class="status-badge-glass ${p.status === 'APPROVED' ? 'badge-green' : 'badge-amber'}" style="font-size: 0.68rem;">
                      ${p.status === 'APPROVED' ? '✓ Signed Off' : '⚠️ Pending Sign'}
                    </span>
                  </div>
                </div>
              `).join('')}

              <!-- PE/RA Impersonation Safeguard Notice -->
              <div style="background: #f8fafc; border-radius: var(--radius-md); padding: 0.85rem; border-left: 3px solid var(--blue); font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5; margin-top: 0.5rem;">
                🛡️ <strong>Professional Practice Safeguard:</strong> Antigravity AI coordinates evidence and tracks missing items, but strictly enforces that physical digital seals, calculations, and architectural endorsements must be furnished by the verified licensed Georgia professionals above.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    document.getElementById('btn-export-drawing-index')?.addEventListener('click', () => {
      alert('Drawing Index v2.4 exported with 10 coordinated sheets and revision log.');
    });

    document.getElementById('btn-create-design-rev')?.addEventListener('click', () => {
      alert('Create Revision dialog: Enter change description, affected specifications, and trigger automatic re-calculation of budget, carbon, and code checks.');
    });
  }
}
