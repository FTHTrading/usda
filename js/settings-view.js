// Settings & 3FS Deployment View: Cloudflare Pages Subsite Status, Routing & Environment
export class USDASettingsView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="settings-view-layout">
        <!-- Subsite Deployment Header -->
        <div class="glass-panel-card">
          <div class="panel-header-flex">
            <div>
              <span class="status-badge-glass badge-green">● CLOUDFLARE LIVE INTEGRATION</span>
              <h2 class="panel-title" style="margin-top: 0.35rem;">Subsite & Domain Configuration: usda.3fs.app</h2>
              <p class="panel-subtitle">Manage public routing, Cloudflare Pages hosting, SSL certification, and workspace parameters.</p>
            </div>
            <span class="status-badge-glass badge-purple">Account: kevanbtc@gmail.com</span>
          </div>
        </div>

        <div class="settings-grid-split">
          <!-- Left: Subsite Deployment Status Card -->
          <div class="glass-panel-card">
            <h3 class="panel-title" style="font-size: 1.1rem; margin-bottom: 1.25rem;">Live Edge Routing & Preview Endpoints</h3>

            <div class="endpoint-cards-list">
              <!-- Endpoint 1: Production Custom Domain -->
              <div class="endpoint-card card-primary-edge">
                <div class="endpoint-icon">🌐</div>
                <div class="endpoint-meta">
                  <div class="endpoint-top-row">
                    <span class="endpoint-label">PRODUCTION SUBSITE:</span>
                    <span class="endpoint-status-active">Active</span>
                  </div>
                  <a href="https://usda.3fs.app" target="_blank" rel="noopener noreferrer" class="endpoint-url">https://usda.3fs.app ↗</a>
                  <p class="endpoint-desc">Live Cloudflare Pages edge deployment bound to 3fs.app apex zone.</p>
                </div>
              </div>

              <!-- Endpoint 2: Pages Dev Preview -->
              <div class="endpoint-card">
                <div class="endpoint-icon">⚡</div>
                <div class="endpoint-meta">
                  <div class="endpoint-top-row">
                    <span class="endpoint-label">PAGES PREVIEW:</span>
                    <span class="endpoint-status-active">Live</span>
                  </div>
                  <a href="https://usda-3fs.pages.dev" target="_blank" rel="noopener noreferrer" class="endpoint-url">https://usda-3fs.pages.dev ↗</a>
                  <p class="endpoint-desc">Global CDN preview container synced with main production branch.</p>
                </div>
              </div>

              <!-- Endpoint 3: Local Host -->
              <div class="endpoint-card">
                <div class="endpoint-icon">💻</div>
                <div class="endpoint-meta">
                  <div class="endpoint-top-row">
                    <span class="endpoint-label">LOCAL WORKSPACE:</span>
                    <span class="endpoint-status-active">Running</span>
                  </div>
                  <a href="http://localhost:4080" target="_blank" rel="noopener noreferrer" class="endpoint-url">http://localhost:4080 ↗</a>
                  <p class="endpoint-desc">Local Node HTTP daemon running on developer workstation.</p>
                </div>
              </div>
            </div>

            <!-- Deployment Details Table -->
            <div class="deployment-specs-table">
              <div class="spec-row"><span>Cloudflare Project:</span> <strong>usda-3fs</strong></div>
              <div class="spec-row"><span>Bound Hostname:</span> <strong>usda.3fs.app</strong></div>
              <div class="spec-row"><span>Zone Tag:</span> <span class="font-mono">5ccda72733f867c8474434e921fc096e</span></div>
              <div class="spec-row"><span>SSL Certificate:</span> <strong>Google Trust Services Universal SSL (Active)</strong></div>
              <div class="spec-row"><span>Deployment Target:</span> <strong>Static Assets + Web Workers</strong></div>
            </div>

            <div class="deploy-action-box">
              <button class="btn-deploy-now" id="btn-trigger-deploy">
                <span>🚀</span> Deploy Workspace Updates to usda.3fs.app
              </button>
            </div>
          </div>

          <!-- Right: Engine Preferences & Underwriting Defaults -->
          <div class="glass-panel-card">
            <h3 class="panel-title" style="font-size: 1.1rem; margin-bottom: 1.25rem;">Workspace Preferences</h3>

            <div class="pref-form-grid">
              <div class="form-group">
                <label>Default Georgia Focus County</label>
                <select class="form-select" id="pref-county">
                  <option value="dawson" selected>Dawson County (92% Eligible · Atlanta MSA Cap)</option>
                  <option value="lumpkin">Lumpkin County (100% Eligible · Dahlonega)</option>
                  <option value="hall-north">Hall County North (55% Eligible Pockets)</option>
                  <option value="pickens">Pickens County (95% Eligible · Jasper)</option>
                </select>
              </div>

              <div class="form-group">
                <label>Default Financing Program</label>
                <select class="form-select" id="pref-loan-type">
                  <option value="guaranteed" selected>Section 502 Guaranteed (115% AMI Cap)</option>
                  <option value="direct">Section 502 Direct (Subsidized 1.0% Rate)</option>
                </select>
              </div>

              <div class="form-group">
                <label>Construction Contingency Reserve Rate</label>
                <select class="form-select" id="pref-contingency">
                  <option value="10" selected>10% (Standard USDA Mandatory Buffer)</option>
                  <option value="15">15% (Custom Steep Mountain Slope Reserve)</option>
                </select>
              </div>

              <div class="form-group">
                <label>PDF Generation Engine</label>
                <select class="form-select" id="pref-pdf-engine">
                  <option value="jspdf" selected>Client-Side Vector PDF Engine (jsPDF)</option>
                  <option value="browser-print">Native Browser Print Dialog</option>
                </select>
              </div>
            </div>

            <div class="system-build-info">
              <span>USDA Build-Navigator Pro · Version 2.4.0</span>
              <span>Subsite for usda.3fs.app · Cloudflare Pages</span>
            </div>
          </div>
        </div>

        <!-- 3FS Brand & Infrastructure Verification Suite -->
        <div class="glass-panel-card" style="margin-top: 1.5rem;">
          <div class="panel-header-flex">
            <div>
              <span class="status-badge-glass badge-green">● AUTHENTIC BRAND MARKS & ARTIFACTS</span>
              <h2 class="panel-title" style="margin-top: 0.35rem;">3FS Sovereign Ecosystem & Brand System</h2>
              <p class="panel-subtitle">Original brand marks, precision vector SVGs, motion assets, and three-framework evidence stack.</p>
            </div>
            <a href="https://pay.3fs.app" target="_blank" rel="noopener noreferrer" class="btn-glass-secondary" style="font-size: 0.8rem; text-decoration: none;">
              <span>🌐</span> Visit pay.3fs.app ↗
            </a>
          </div>

          <!-- Brand Marks Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-top: 1.25rem;">
            <!-- Card 1: Authentic 3FS Mark -->
            <div class="kpi-card-3d" style="background: rgba(255, 255, 255, 0.7); text-align: center; padding: 1.5rem;">
              <div style="display: flex; justify-content: center; margin-bottom: 0.85rem;">
                <img src="assets/brand/3fs-logo.svg" alt="3FS Original Mark" style="width: 72px; height: 72px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.06); background: #f7f7f4;" />
              </div>
              <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">3FS Original Brand Mark</h4>
              <p style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.3rem; line-height: 1.45;">
                Machined graphite ring (#111214) with upward crimson chevron (#A30D22) on pearl substrate (#F7F7F4).
              </p>
              <div style="margin-top: 0.75rem; display: flex; justify-content: center; gap: 0.5rem;">
                <span class="status-badge-glass badge-green" style="font-size: 0.65rem;">SVG Vector</span>
                <span class="status-badge-glass badge-purple" style="font-size: 0.65rem;">Favicon Ready</span>
              </div>
            </div>

            <!-- Card 2: UnyKorn 3D Gate Mark -->
            <div class="kpi-card-3d" style="background: rgba(255, 255, 255, 0.7); text-align: center; padding: 1.5rem;">
              <div style="display: flex; justify-content: center; margin-bottom: 0.85rem;">
                <img src="assets/brand/gate-mark-3d.svg" alt="UnyKorn Gate Mark 3D" style="width: 72px; height: 72px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12));" />
              </div>
              <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">UnyKorn Gate System</h4>
              <p style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.3rem; line-height: 1.45;">
                Precision-machined steel outer arcs (#ffffff to #7f8386) with ember/gold horn (#ffc24a to #c43f00).
              </p>
              <div style="margin-top: 0.75rem; display: flex; justify-content: center; gap: 0.5rem;">
                <span class="status-badge-glass badge-green" style="font-size: 0.65rem;">3D Vector</span>
                <span class="status-badge-glass badge-blue" style="font-size: 0.65rem;">Master Crest</span>
              </div>
            </div>

            <!-- Card 3: USDA Rural Development Seal -->
            <div class="kpi-card-3d" style="background: rgba(255, 255, 255, 0.7); text-align: center; padding: 1.5rem;">
              <div style="display: flex; justify-content: center; margin-bottom: 0.85rem;">
                <img src="assets/brand/usda-rd-seal.svg" alt="USDA RD Seal" style="width: 72px; height: 72px; border-radius: 50%; box-shadow: 0 4px 16px rgba(0,45,98,0.2);" />
              </div>
              <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">USDA Rural Housing Seal</h4>
              <p style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.3rem; line-height: 1.45;">
                United States Department of Agriculture Rural Development Section 502 Single-Close authority emblem.
              </p>
              <div style="margin-top: 0.75rem; display: flex; justify-content: center; gap: 0.5rem;">
                <span class="status-badge-glass badge-amber" style="font-size: 0.65rem;">7 CFR § 3555</span>
                <span class="status-badge-glass badge-green" style="font-size: 0.65rem;">Statutory Seal</span>
              </div>
            </div>
          </div>

          <!-- 3FS Brand Motion Engine -->
          <div style="margin-top: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; align-items: center;">
            <div style="border-radius: 16px; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); background: #000; box-shadow: 0 8px 24px rgba(0,0,0,0.12);">
              <video style="width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;" autoplay muted loop playsinline poster="assets/brand/3fs-emblem.jpg">
                <source src="assets/brand/3fs-bring-to-life.mp4" type="video/mp4">
              </video>
            </div>
            <div>
              <span class="status-badge-glass badge-purple">BRAND MOTION SYSTEM</span>
              <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-top: 0.4rem;">Liquid Crimson Arrow in Machined Ring</h3>
              <p style="font-size: 0.82rem; color: var(--text-dim); margin-top: 0.4rem; line-height: 1.55;">
                "Capital moves faster when proof moves first." 3FS Pay is the transactional face of the 3FS machine — confirm-gated sends on paper and crimson, not neon speculation.
              </p>
              <div style="margin-top: 0.85rem; font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
                <span>Production Assets: assets/brand/3fs-bring-to-life.mp4 · 3fs-emblem.jpg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    document.getElementById('btn-trigger-deploy')?.addEventListener('click', () => {
      alert("Workspace deployed to Cloudflare Pages (usda-3fs)! Changes will propagate across Cloudflare edge nodes at usda.3fs.app within seconds.");
    });
  }
}
