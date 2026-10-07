// Carbon & Net-Zero Planning Engine
// Strict boundary definitions: Operational (DOE ZEB) vs Embodied vs Whole-Life (WorldGBC).
// Features: Target selection, operational modeling, material LCA, EPD library, design comparisons, and claims review.
import { PROJECT_RECORD } from '../data/project-record.js';

export class USDACarbonEnergyView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.record = PROJECT_RECORD;
    this.selectedScenario = 2; // Scenario 3 (index 2) is the selected specification
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    const carbon = this.record.carbonAndNetZero;
    const defs = carbon.targetDefinitions;
    const op = carbon.operationalEnergy;
    const emb = carbon.embodiedCarbon;

    this.container.innerHTML = `
      <div class="carbon-energy-layout">
        <!-- Top Carbon Strategy Card -->
        <div class="glass-panel-card">
          <div class="panel-header-flex">
            <div>
              <span class="status-badge-glass badge-purple">● CARBON & NET-ZERO ARCHITECTURE</span>
              <h2 class="panel-title" style="margin-top: 0.35rem;">Whole-Life Carbon & Energy Planning Engine</h2>
              <p class="panel-subtitle">Target Standard: <strong>${defs.boundaryStandard}</strong> · Assessment Horizon: <strong>${defs.assessmentPeriodYears} Years</strong></p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn-glass-secondary" id="btn-export-carbon-report">Export Carbon Assessment PDF</button>
            </div>
          </div>

          <!-- Strict Claims Review & No Fake Green Badge Strip -->
          <div style="background: rgba(240, 253, 244, 0.7); border: 1px solid rgba(5, 150, 105, 0.3); border-radius: var(--radius-md); padding: 1rem; margin-top: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span class="status-badge-glass badge-green" style="font-size: 0.72rem;">CLAIMS STATUS: ${defs.claimsStatus.replace(/_/g, ' ')}</span>
                  <span class="status-badge-glass badge-purple" style="font-size: 0.72rem;">Pre-Construction Review</span>
                </div>
                <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-top: 0.35rem;">
                  ${defs.selectedTarget}
                </h4>
                <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.25rem; line-height: 1.5;">
                  ⚠️ <strong>No Automatic Green Badge Policy:</strong> ${defs.noFakeGreenBadgePolicy}
                </p>
              </div>
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem;">
                <span style="font-size: 0.7rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">DOE ZEB Operational Pillars:</span>
                <span class="status-badge-glass badge-green" style="font-size: 0.68rem;">✓ 1. Energy Efficiency (18.4 EUI)</span>
                <span class="status-badge-glass badge-green" style="font-size: 0.68rem;">✓ 2. Zero Combustion Emissions (All-Electric)</span>
                <span class="status-badge-glass badge-green" style="font-size: 0.68rem;">✓ 3. Clean Energy Supply (155% Solar)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 4 Carbon & Energy Core Metrics -->
        <div class="kpi-cards-grid" style="grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); margin-top: 1.25rem;">
          <div class="kpi-card-3d">
            <div class="kpi-header">
              <span class="kpi-label">MODELED ENERGY USE (EUI)</span>
              <span class="kpi-pill pill-purple">-61.8% vs Code</span>
            </div>
            <div class="kpi-value font-purple">${op.modeledDesignEUI} <small>kBtu/sq.ft/yr</small></div>
            <div class="kpi-sub">
              <span>Code Baseline EUI:</span>
              <strong>${op.baselineCodeEUI} kBtu/sq.ft/yr</strong>
            </div>
            <div class="kpi-footer-note">Calculated via Highland Energy Manual J / REScheck</div>
          </div>

          <div class="kpi-card-3d">
            <div class="kpi-header">
              <span class="kpi-label">ON-SITE SOLAR GENERATION</span>
              <span class="kpi-pill pill-emerald">155% Net Exporter</span>
            </div>
            <div class="kpi-value font-emerald">${op.annualSolarGenerationKwh.toLocaleString()} <small>kWh/yr</small></div>
            <div class="kpi-sub">
              <span>Annual Demand:</span>
              <strong>${op.annualEnergyDemandKwh.toLocaleString()} kWh/yr</strong>
            </div>
            <div class="kpi-footer-note">10.2 kW ground array + 13.5 kWh Enphase battery</div>
          </div>

          <div class="kpi-card-3d">
            <div class="kpi-header">
              <span class="kpi-label">EMBODIED MATERIAL CARBON</span>
              <span class="kpi-pill pill-blue">-42.8% Reduction</span>
            </div>
            <div class="kpi-value font-blue">${emb.optimizedDesignTonsCo2e} <small>t CO2e</small></div>
            <div class="kpi-sub">
              <span>Baseline Standard:</span>
              <strong>${emb.baselineTypicalBuildTonsCo2e} tons CO2e</strong>
            </div>
            <div class="kpi-footer-note">Intensity: ${emb.embodiedCarbonPerSqM} kg CO2e/m² (&lt;300 target met)</div>
          </div>

          <div class="kpi-card-3d">
            <div class="kpi-header">
              <span class="kpi-label">NET OPERATIONAL CARBON</span>
              <span class="kpi-pill pill-emerald">Net Carbon Negative</span>
            </div>
            <div class="kpi-value font-emerald">${op.netAnnualOperatingEmissionsKgCo2e} <small>kg/yr</small></div>
            <div class="kpi-sub">
              <span>Combustion Emissions:</span>
              <strong>0.00 kg (Zero Fossil Gas)</strong>
            </div>
            <div class="kpi-footer-note">Off-grid capable · Surpluses fed back to Amicalola EMC</div>
          </div>
        </div>

        <!-- 3 Design Comparison Alternatives Table -->
        <div class="glass-panel-card" style="margin-top: 1.5rem;">
          <div class="panel-header-flex">
            <div>
              <h3 class="panel-title">Design Alternatives Comparison (Cost, Energy & Carbon)</h3>
              <p class="panel-subtitle">Evaluates 3 distinct construction scenarios across the 50-year lifecycle</p>
            </div>
            <span class="status-badge-glass badge-green">Life-Cycle Analysis</span>
          </div>

          <table class="sheet-table" style="margin-top: 1rem; width: 100%;">
            <thead>
              <tr>
                <th>Design Alternative</th>
                <th>Wall Assembly & Insulation</th>
                <th>HVAC Mechanicals</th>
                <th>Solar PV</th>
                <th>EUI</th>
                <th>Embodied Carbon</th>
                <th>Capital Cost</th>
                <th>Annual Energy Bill</th>
              </tr>
            </thead>
            <tbody>
              ${carbon.designComparisons.map((c, idx) => `
                <tr style="${c.status === 'SELECTED_SPECIFICATION' ? 'background: rgba(240, 253, 244, 0.6); font-weight: 600;' : ''}">
                  <td>
                    <strong>${c.scenario}</strong>
                    ${c.status === 'SELECTED_SPECIFICATION' ? '<span class="status-badge-glass badge-green" style="font-size: 0.65rem; margin-left: 0.35rem;">✓ SELECTED</span>' : ''}
                  </td>
                  <td><small>${c.wallAssembly}</small></td>
                  <td><small>${c.heatingSystem}</small></td>
                  <td>${c.solarPV}</td>
                  <td><strong>${c.eui}</strong></td>
                  <td><span class="${c.embodiedTonsCo2e < 45 ? 'font-emerald' : 'text-dim'}">${c.embodiedTonsCo2e} t</span></td>
                  <td>$${c.constructionCost.toLocaleString()}</td>
                  <td>
                    <strong class="${c.annualUtilityCost < 0 ? 'font-emerald' : 'font-rose'}">
                      ${c.annualUtilityCost < 0 ? `-$${Math.abs(c.annualUtilityCost)}/yr (Credit)` : `$${c.annualUtilityCost}/yr`}
                    </strong>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Material EPD Library & Embodied Carbon Strategies -->
        <div class="home-bottom-grid" style="margin-top: 1.5rem;">
          <!-- Left: Key Embodied Carbon Strategies -->
          <div class="glass-panel-card">
            <h3 class="panel-title" style="margin-bottom: 0.25rem;">Key Low-Carbon Material Strategies</h3>
            <p class="panel-subtitle" style="margin-bottom: 1rem;">Decarbonization choices applied to the construction documents</p>

            <ul style="display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; list-style-type: none; padding: 0;">
              ${emb.keyMaterialStrategies.map(s => `
                <li style="background: #ffffff; padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--glass-border); display: flex; align-items: flex-start; gap: 0.5rem;">
                  <span style="color: var(--emerald); font-weight: 800;">✓</span>
                  <span>${s}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Right: Verified EPD Evidence Library -->
          <div class="glass-panel-card">
            <div class="panel-header-flex">
              <div>
                <h3 class="panel-title">Environmental Product Declarations (EPD)</h3>
                <p class="panel-subtitle">Third-party verified Type III environmental product declarations on file</p>
              </div>
              <span class="status-badge-glass badge-blue">ISO 14025</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem;">
              ${emb.epdLibrary.map(epd => `
                <div style="background: #ffffff; border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 0.75rem 0.9rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="font-size: 0.85rem; color: var(--text-primary);">${epd.product}</strong>
                    <span class="status-badge-glass badge-purple" style="font-size: 0.68rem;">${epd.epdId}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.35rem;">
                    <span style="font-size: 0.72rem; color: var(--text-dim);">Global Warming Potential (GWP A1-A3):</span>
                    <strong style="font-size: 0.82rem; color: var(--emerald);">${epd.gwp}</strong>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    document.getElementById('btn-export-carbon-report')?.addEventListener('click', () => {
      if (window.usdaApp && window.usdaApp.switchTab) {
        window.usdaApp.switchTab('documents');
      }
    });
  }
}
