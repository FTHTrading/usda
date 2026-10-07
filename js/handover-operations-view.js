// Handover & Building Operations Engine
// Tracks: As-built drawings, warranties, O&M manuals, measured vs modeled utility performance, and final punchout.
import { PROJECT_RECORD } from '../data/project-record.js';

export class USDAHandoverOperationsView {
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
    const ho = this.record.handoverPack;

    this.container.innerHTML = `
      <div class="handover-ops-layout">
        <!-- Top Handover Header -->
        <div class="glass-panel-card">
          <div class="panel-header-flex">
            <div>
              <span class="status-badge-glass badge-green">● BUILDING HANDOVER & OPERATIONS</span>
              <h2 class="panel-title" style="margin-top: 0.35rem;">Building Handover Pack & Post-Occupancy Performance</h2>
              <p class="panel-subtitle">Coordinates as-built plan archives, 5 major equipment warranties, owner O&M manuals, and smart meter monitoring.</p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn-glass-secondary" id="btn-export-handover-pack">Export Handover Pack PDF</button>
            </div>
          </div>

          <!-- As-Built & Warranty Status Strip -->
          <div class="test-kpi-bar" style="margin-top: 1rem; padding-top: 0.85rem; border-top: 1px solid var(--glass-border);">
            <div class="t-kpi">
              <span class="t-lbl">Handover Framework:</span>
              <strong class="t-val font-emerald">Pre-Compiled</strong>
            </div>
            <div class="t-kpi">
              <span class="t-lbl">As-Built Plans Required:</span>
              <strong class="t-val">${ho.asBuiltDrawingsRequired} Disciplines</strong>
            </div>
            <div class="t-kpi">
              <span class="t-lbl">Active Warranties:</span>
              <strong class="t-val font-blue">${ho.warranties.length} Policies Tracked</strong>
            </div>
            <div class="t-kpi">
              <span class="t-lbl">Projected Net Monthly Bill:</span>
              <strong class="t-val font-emerald">${ho.postOccupancyMonitoring.projectedNetMonthlyBill}</strong>
            </div>
          </div>
        </div>

        <!-- 2-Column Split: Warranties & Operating Manuals -->
        <div class="home-bottom-grid" style="margin-top: 1.25rem;">
          <!-- Left: Equipment & Structural Warranties -->
          <div class="glass-panel-card">
            <div class="panel-header-flex">
              <div>
                <h3 class="panel-title">Master Warranty Register</h3>
                <p class="panel-subtitle">Manufacturer and builder performance guarantees</p>
              </div>
              <span class="status-badge-glass badge-green">5 Warranties</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem;">
              ${ho.warranties.map(w => `
                <div style="background: #ffffff; border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 0.85rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="font-size: 0.85rem; color: var(--text-primary);">${w.item}</strong>
                    <span class="status-badge-glass badge-purple" style="font-size: 0.68rem;">${w.duration}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-dim); margin-top: 0.35rem;">
                    <span>Provider: <strong>${w.provider}</strong></span>
                    <span class="font-emerald">Active on CO</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right: Owner Operating Manuals (O&M) -->
          <div class="glass-panel-card">
            <div class="panel-header-flex">
              <div>
                <h3 class="panel-title">Operations & Maintenance Manuals</h3>
                <p class="panel-subtitle">Digital operating guides and seasonal maintenance protocols</p>
              </div>
              <span class="status-badge-glass badge-blue">O&M Library</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem;">
              ${ho.operatingManuals.map(m => `
                <div style="background: #ffffff; border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 0.85rem; display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>📖</span>
                    <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-primary);">${m}</span>
                  </div>
                  <span class="status-badge-glass badge-green" style="font-size: 0.65rem;">PDF Ready</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Post-Occupancy Measured vs Projected Performance Card -->
        <div class="glass-panel-card" style="margin-top: 1.5rem;">
          <div class="panel-header-flex">
            <div>
              <h3 class="panel-title">Post-Occupancy Performance Tracking (Modeled vs Measured)</h3>
              <p class="panel-subtitle">Separates design simulations from actual operating grid utility measurements</p>
            </div>
            <span class="status-badge-glass badge-purple">Green Button API Ready</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div style="background: #f8fafc; padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--glass-border);">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Utility Grid Provider:</span>
              <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">Amicalola EMC</h4>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">AMI Bi-Directional Net Metering</p>
            </div>

            <div style="background: #f8fafc; padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--glass-border);">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Modeled Annual Consumption:</span>
              <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--blue); margin-top: 0.25rem;">8,920 kWh / year</h4>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Design Baseline Simulation</p>
            </div>

            <div style="background: #f8fafc; padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--glass-border);">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Modeled Solar Generation:</span>
              <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--emerald); margin-top: 0.25rem;">13,850 kWh / year</h4>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">10.2 kW Ground-Mount Array</p>
            </div>

            <div style="background: #f8fafc; padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--glass-border);">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Net Operating Cashflow:</span>
              <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--emerald); margin-top: 0.25rem;">+$340 / year Credit</h4>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Annual Amicalola EMC Net Yield</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    document.getElementById('btn-export-handover-pack')?.addEventListener('click', () => {
      if (window.usdaApp && window.usdaApp.switchTab) {
        window.usdaApp.switchTab('documents');
      }
    });
  }
}
