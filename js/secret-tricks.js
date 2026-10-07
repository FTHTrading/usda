// Secret Tricks, Regulatory Loopholes & Arbitrage Vault Module
import { USDA_REGULATORY_SECRETS, SECRET_HOTSPOTS } from '../data/secret-locations.js';

export class USDASecretTricks {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeSecret = USDA_REGULATORY_SECRETS[0];
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="secrets-vault-layout">
        <!-- Hero Header -->
        <div class="secrets-hero-banner">
          <div class="hero-left">
            <span class="hero-badge">RESTRICTED UNDERWRITING PLAYBOOK</span>
            <h2 class="hero-title">The USDA Rural Arbitrage & Regulatory Secrets Vault</h2>
            <p class="hero-desc">The insider federal regulations (7 CFR § 3555 & HB-1-3555) that allow high-earners, investors, and rural builders to legally bypass restrictions, maximize equity, and build for $0 out of pocket.</p>
          </div>
          <div class="hero-stats-badge">
            <span class="h-stat-num">7</span>
            <span class="h-stat-lbl">Codified Federal Loopholes</span>
          </div>
        </div>

        <div class="secrets-grid-main">
          <!-- Left: Loophole Catalog List -->
          <div class="secrets-list-column">
            <div class="secrets-list-header">
              <h4>Regulatory Loopholes & Hidden Rules</h4>
              <span class="sub-counter">Click to Inspect Strategy</span>
            </div>
            
            <div class="secrets-accordion">
              ${USDA_REGULATORY_SECRETS.map(s => `
                <div class="secret-rule-card ${s.id === this.activeSecret.id ? 'active' : ''}" data-id="${s.id}">
                  <div class="rule-top-flex">
                    <span class="rule-cat-pill">${s.category}</span>
                    <span class="rule-impact font-emerald">${s.impact}</span>
                  </div>
                  <h4 class="rule-title">${s.title}</h4>
                  <span class="rule-cite">Citation: ${s.citation}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right: Deep Dive Inspection Panel & Arbitrage Simulator -->
          <div class="secrets-detail-column" id="secret-detail-panel">
            ${this.renderDetailPanel(this.activeSecret)}
          </div>
        </div>

        <!-- Live Secret Arbitrage Simulator -->
        <div class="arbitrage-simulator-box">
          <div class="sim-header">
            <div>
              <h3 class="card-title">⚡ Live Arbitrage Simulator: The 'Atlanta MSA + Childcare' Double Loophole</h3>
              <p class="card-subtitle">See how combining Loophole #1 (MSA Arbitrage) and Loophole #2 (Childcare Shield) flips an over-income family into an approved zero-down deal.</p>
            </div>
          </div>

          <div class="sim-grid-inputs">
            <div class="sim-field">
              <label>Your Household Gross Income ($)</label>
              <input type="number" id="sim-gross" value="152000" step="1000" class="form-input" />
              <small class="text-dim">Standard rural cap is $118,200</small>
            </div>

            <div class="sim-field">
              <label>Target Location Strategy</label>
              <select id="sim-location" class="form-select">
                <option value="metro-arbitrage" selected>Dawson County (Atlanta MSA Cap: $135,500)</option>
                <option value="rural-standard">Standard Rural County (Cap: $118,200)</option>
              </select>
            </div>

            <div class="sim-field">
              <label>Minor Dependents (Kids under 18)</label>
              <input type="number" id="sim-kids" value="2" min="0" max="6" class="form-input" />
              <small class="text-dim">$480 deduction each</small>
            </div>

            <div class="sim-field">
              <label>Annual Work Childcare / Daycare ($)</label>
              <input type="number" id="sim-daycare" value="16000" step="500" class="form-input" />
              <small class="text-dim">100% verified deduction</small>
            </div>
          </div>

          <div class="sim-results-strip" id="sim-results-output">
            ${this.calculateSimulation(152000, 'metro-arbitrage', 2, 16000)}
          </div>
        </div>
      </div>
    `;
  }

  renderDetailPanel(secret) {
    return `
      <div class="secret-inspect-card">
        <div class="inspect-top-bar">
          <div>
            <span class="rule-cat-pill">${secret.category}</span>
            <h2 class="inspect-title">${secret.title}</h2>
            <span class="inspect-cite">Federal Code: <strong>${secret.citation}</strong></span>
          </div>
          <div class="inspect-impact-badge">
            <span class="impact-val">${secret.impact}</span>
            <span class="impact-lbl">Borrower Arbitrage</span>
          </div>
        </div>

        <div class="inspect-content-block">
          <h4 class="block-title">The Hidden Regulatory Mechanism:</h4>
          <p class="block-text">${secret.summary}</p>
        </div>

        <div class="inspect-content-block highlight-tactics-box">
          <h4 class="block-title font-emerald">🎯 How to Execute This in Practice:</h4>
          <p class="block-text">${secret.howToUse}</p>
        </div>

        <div class="inspect-checklist-box">
          <h4 class="block-title">Underwriter Document Requirements:</h4>
          <ul class="inspect-doc-list">
            <li>✔️ Formal Loan Application (Form RD 3555-21)</li>
            <li>✔️ Verified documentation (W-2s, tax returns, licensed daycare provider invoices)</li>
            <li>✔️ Certified engineer plot plan or architectural appraisal confirming compliance</li>
          </ul>
        </div>
      </div>
    `;
  }

  calculateSimulation(gross, locType, kids, daycare) {
    const cap = locType === 'metro-arbitrage' ? 135500 : 118200;
    const deductions = (kids * 480) + daycare;
    const adjusted = Math.max(0, gross - deductions);
    const passes = adjusted <= cap;
    const margin = cap - adjusted;

    return `
      <div class="sim-pill-group">
        <div class="sim-res-box">
          <span class="s-k">Gross Starting Income:</span>
          <span class="s-v">$${gross.toLocaleString()}</span>
        </div>
        <div class="sim-res-box">
          <span class="s-k">Total Statutory Deductions:</span>
          <span class="s-v text-emerald">-$${deductions.toLocaleString()}</span>
        </div>
        <div class="sim-res-box">
          <span class="s-k">Adjusted USDA Income:</span>
          <span class="s-v font-bold">$${adjusted.toLocaleString()}</span>
        </div>
        <div class="sim-res-box">
          <span class="s-k">Jurisdiction Ceiling:</span>
          <span class="s-v font-bold">$${cap.toLocaleString()}</span>
        </div>
        <div class="sim-res-box ${passes ? 'sim-pass' : 'sim-fail'}">
          <span class="s-k">Verdict:</span>
          <span class="s-v font-bold">${passes ? '✅ 100% QUALIFIED' : '❌ EXCEEDS CAP'}</span>
        </div>
      </div>
      <div class="sim-takeaway-note">
        ${passes 
          ? `🔥 <strong>The Arbitrage Result:</strong> While this household appeared to be $${(gross - cap).toLocaleString()} over the limit, applying the MSA ceiling + childcare shelter brought them <strong>$${Math.round(margin).toLocaleString()} under the ceiling</strong>! They qualify for $0 down with zero issue.`
          : `⚠️ Still exceeds the ceiling by $${Math.abs(Math.round(margin)).toLocaleString()}. Switch to Dawson County for the higher $135.5k cap or check for elderly/medical deductions.`}
      </div>
    `;
  }

  attachEvents() {
    this.container.addEventListener('click', (e) => {
      const card = e.target.closest('.secret-rule-card');
      if (card) {
        const id = card.getAttribute('data-id');
        const found = USDA_REGULATORY_SECRETS.find(s => s.id === id);
        if (found) {
          this.activeSecret = found;
          this.container.querySelectorAll('.secret-rule-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          document.getElementById('secret-detail-panel').innerHTML = this.renderDetailPanel(found);
        }
      }
    });

    // Simulator input change
    const updateSim = () => {
      const gross = Number(document.getElementById('sim-gross').value) || 0;
      const loc = document.getElementById('sim-location').value;
      const kids = Number(document.getElementById('sim-kids').value) || 0;
      const daycare = Number(document.getElementById('sim-daycare').value) || 0;

      const output = document.getElementById('sim-results-output');
      if (output) {
        output.innerHTML = this.calculateSimulation(gross, loc, kids, daycare);
      }
    };

    ['sim-gross', 'sim-location', 'sim-kids', 'sim-daycare'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', updateSim);
        el.addEventListener('change', updateSim);
      }
    });
  }
}
