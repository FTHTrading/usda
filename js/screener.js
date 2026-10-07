// Screener Module: Interactive County, City & USDA GIS Boundary Evaluator
import { GEORGIA_REGIONS } from '../data/georgia-counties.js';
import { ICONS, getIcon } from './icons.js';

export class USDAScreener {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.selectedCounty = GEORGIA_REGIONS[0]; // Dawson default
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="screener-layout">
        <!-- Left: Search & Region List -->
        <div class="screener-sidebar">
          <div class="search-box">
            <span class="search-icon">${getIcon('search', '', 14)}</span>
            <input type="text" id="geo-search-input" placeholder="Search address, county, or city (e.g. Dawsonville, Alpharetta, Gainesville)..." />
          </div>

          <div class="quick-chips">
            <span class="chip-label">Quick Checks:</span>
            <button class="chip-btn" data-target="dawson">Dawsonville (Upper Lanier)</button>
            <button class="chip-btn" data-target="lumpkin">Dahlonega (Foothills)</button>
            <button class="chip-btn" data-target="hall-north">North Hall (Rural)</button>
            <button class="chip-btn" data-target="fulton">Alpharetta (Metro)</button>
            <button class="chip-btn" data-target="forsyth">Cumming (Lanier Shore)</button>
          </div>

          <div class="county-list" id="county-list-container">
            ${this.renderCountyList(GEORGIA_REGIONS)}
          </div>
        </div>

        <!-- Right: Interactive Visual GIS Map & Detailed Intelligence Card -->
        <div class="screener-main">
          <!-- Visual SVG Interactive Map -->
          <div class="map-card">
            <div class="card-header-flex">
              <div>
                <h3 class="card-title">North Georgia & Lake Lanier Eligibility Map</h3>
                <p class="card-subtitle">Click any region to inspect USDA boundary rules & USACE shoreline constraints</p>
              </div>
              <div class="map-legend">
                <span class="legend-item"><span class="legend-dot dot-green"></span> 100% Eligible</span>
                <span class="legend-item"><span class="legend-dot dot-yellow"></span> Conditional / Outer Pockets</span>
                <span class="legend-item"><span class="legend-dot dot-red"></span> Disqualified</span>
              </div>
            </div>

            <div class="svg-map-wrapper">
              ${this.renderInteractiveSVGMap()}
            </div>
          </div>

          <!-- Region Intelligence Panel -->
          <div class="intelligence-card" id="region-intelligence-panel">
            ${this.renderIntelligenceCard(this.selectedCounty)}
          </div>

          <!-- Address Verifier & USDA Gateway -->
          <div class="usda-portal-bridge">
            <div class="bridge-icon">${getIcon('compliance', '', 24)}</div>
            <div class="bridge-content">
              <h4>Official USDA RD Parcel Map Verification</h4>
              <p>While regional screening classifies county zones, USDA Section 502 requires exact parcel verification down to the GPS pin before contract execution.</p>
              <div class="bridge-actions">
                <a href="https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do?pageAction=sfp" target="_blank" rel="noopener noreferrer" class="btn-primary">
                  Open Official USDA Eligibility GIS Map ↗
                </a>
                <button id="btn-copy-checklist" class="btn-secondary">${getIcon('documents', '', 14)} Copy Parcel Due-Diligence Checklist</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderCountyList(regions) {
    return regions.map(reg => {
      const isSelected = reg.id === this.selectedCounty.id ? 'active' : '';
      const badgeClass = reg.status === 'ELIGIBLE' ? 'badge-success' : (reg.status === 'CONDITIONAL' ? 'badge-warning' : 'badge-danger');
      return `
        <div class="county-item ${isSelected}" data-id="${reg.id}">
          <div class="county-item-header">
            <span class="county-name">${reg.name}</span>
            <span class="status-badge ${badgeClass}">${reg.status}</span>
          </div>
          <div class="county-item-sub">
            <span>Seat: ${reg.seats}</span>
            <span>Eligible Land: ${reg.eligibilityPercent}%</span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderInteractiveSVGMap() {
    // Stylized interactive SVG diagram mapping the Lake Lanier & North Georgia counties
    return `
      <svg viewBox="0 0 760 380" class="georgia-svg-map">
        <defs>
          <linearGradient id="lakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0.9"/>
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.3"/>
          </filter>
        </defs>

        <!-- Background grid styling -->
        <rect width="100%" height="100%" fill="rgba(15, 23, 42, 0.6)" rx="12"/>

        <!-- Region Polygons / Shapes -->
        <!-- Lumpkin County (North, Dahlonega) - Green -->
        <g class="map-node ${this.selectedCounty.id === 'lumpkin' ? 'svg-selected' : ''}" data-id="lumpkin">
          <polygon points="340,30 490,25 480,115 330,110" fill="#065f46" stroke="#10b981" stroke-width="2"/>
          <text x="410" y="65" text-anchor="middle" fill="#ecfdf5" font-weight="bold" font-size="13">LUMPKIN CO.</text>
          <text x="410" y="85" text-anchor="middle" fill="#6ee7b7" font-size="11">Dahlonega (100% Eligible)</text>
        </g>

        <!-- White County (Northeast, Cleveland) - Green -->
        <g class="map-node ${this.selectedCounty.id === 'white' ? 'svg-selected' : ''}" data-id="white">
          <polygon points="495,25 630,20 620,120 485,115" fill="#065f46" stroke="#10b981" stroke-width="2"/>
          <text x="560" y="65" text-anchor="middle" fill="#ecfdf5" font-weight="bold" font-size="13">WHITE CO.</text>
          <text x="560" y="85" text-anchor="middle" fill="#6ee7b7" font-size="11">Cleveland (100% Eligible)</text>
        </g>

        <!-- Pickens County (Northwest, Jasper) - Green -->
        <g class="map-node ${this.selectedCounty.id === 'pickens' ? 'svg-selected' : ''}" data-id="pickens">
          <polygon points="70,70 200,65 190,165 60,160" fill="#065f46" stroke="#10b981" stroke-width="2"/>
          <text x="130" y="110" text-anchor="middle" fill="#ecfdf5" font-weight="bold" font-size="13">PICKENS CO.</text>
          <text x="130" y="130" text-anchor="middle" fill="#6ee7b7" font-size="11">Jasper (95% Eligible)</text>
        </g>

        <!-- Dawson County (Center North, Dawsonville) - Green -->
        <g class="map-node ${this.selectedCounty.id === 'dawson' ? 'svg-selected' : ''}" data-id="dawson">
          <polygon points="205,80 335,80 325,185 195,180" fill="#047857" stroke="#34d399" stroke-width="2.5"/>
          <text x="265" y="125" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="14">DAWSON CO. ★</text>
          <text x="265" y="145" text-anchor="middle" fill="#a7f3d0" font-size="11">Dawsonville (92% Eligible)</text>
          <text x="265" y="162" text-anchor="middle" fill="#fef08a" font-size="10">Upper Lanier Proximity</text>
        </g>

        <!-- Hall County North (Clermont/Murrayville) - Yellow -->
        <g class="map-node ${this.selectedCounty.id === 'hall-north' ? 'svg-selected' : ''}" data-id="hall-north">
          <polygon points="340,120 480,120 470,195 335,190" fill="#78350f" stroke="#f59e0b" stroke-width="2"/>
          <text x="405" y="150" text-anchor="middle" fill="#fef3c7" font-weight="bold" font-size="12">HALL CO. (NORTH)</text>
          <text x="405" y="170" text-anchor="middle" fill="#fde68a" font-size="10">Murrayville / Clermont (Rural)</text>
        </g>

        <!-- Hall County South & Gainesville - Red -->
        <g class="map-node ${this.selectedCounty.id === 'hall-south' ? 'svg-selected' : ''}" data-id="hall-south">
          <polygon points="340,200 480,200 460,280 330,270" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.5"/>
          <text x="400" y="235" text-anchor="middle" fill="#fee2e2" font-weight="bold" font-size="11">GAINESVILLE / SOUTH HALL</text>
          <text x="400" y="255" text-anchor="middle" fill="#fca5a5" font-size="10">Disqualified Metro</text>
        </g>

        <!-- Cherokee County North - Yellow -->
        <g class="map-node ${this.selectedCounty.id === 'cherokee' ? 'svg-selected' : ''}" data-id="cherokee">
          <polygon points="65,170 190,170 175,270 55,255" fill="#78350f" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="120" y="215" text-anchor="middle" fill="#fef3c7" font-weight="bold" font-size="12">CHEROKEE CO.</text>
          <text x="120" y="235" text-anchor="middle" fill="#fde68a" font-size="10">Waleska / North Fringe</text>
        </g>

        <!-- Forsyth County (Cumming & Lake Lanier Shore) - Red -->
        <g class="map-node ${this.selectedCounty.id === 'forsyth' ? 'svg-selected' : ''}" data-id="forsyth">
          <polygon points="195,190 325,190 310,285 180,280" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.5"/>
          <text x="250" y="230" text-anchor="middle" fill="#fee2e2" font-weight="bold" font-size="12">FORSYTH CO.</text>
          <text x="250" y="248" text-anchor="middle" fill="#fca5a5" font-size="10">Cumming / Lake Lanier Shore</text>
          <text x="250" y="265" text-anchor="middle" fill="#f87171" font-size="9">DISQUALIFIED (Urban Metro)</text>
        </g>

        <!-- Fulton County (Alpharetta / Milton) - Red -->
        <g class="map-node ${this.selectedCounty.id === 'fulton' ? 'svg-selected' : ''}" data-id="fulton">
          <polygon points="100,285 240,285 220,365 80,360" fill="#450a0a" stroke="#b91c1c" stroke-width="2"/>
          <text x="160" y="320" text-anchor="middle" fill="#fee2e2" font-weight="bold" font-size="13">ALPHARETTA / FULTON</text>
          <text x="160" y="340" text-anchor="middle" fill="#f87171" font-size="10">100% DISQUALIFIED (Metro)</text>
        </g>

        <!-- Gwinnett County (Buford) - Red -->
        <g class="map-node ${this.selectedCounty.id === 'gwinnett' ? 'svg-selected' : ''}" data-id="gwinnett">
          <polygon points="250,290 380,285 360,365 235,365" fill="#450a0a" stroke="#b91c1c" stroke-width="2"/>
          <text x="310" y="325" text-anchor="middle" fill="#fee2e2" font-weight="bold" font-size="12">GWINNETT CO.</text>
          <text x="310" y="345" text-anchor="middle" fill="#f87171" font-size="10">Buford / Disqualified</text>
        </g>

        <!-- Lake Sidney Lanier Water Representation Overlay -->
        <path d="M 320,175 Q 315,210 300,240 Q 285,270 330,275 Q 355,250 340,215 Q 350,185 320,175 Z" 
              fill="url(#lakeGrad)" stroke="#38bdf8" stroke-width="2" opacity="0.9" filter="url(#glow)"/>
        <text x="325" y="235" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="bold">LAKE LANIER</text>
        <text x="325" y="248" text-anchor="middle" fill="#bae6fd" font-size="8">USACE Line: 1,070-ft</text>
      </svg>
    `;
  }

  renderIntelligenceCard(county) {
    const badgeClass = county.status === 'ELIGIBLE' ? 'badge-success' : (county.status === 'CONDITIONAL' ? 'badge-warning' : 'badge-danger');
    return `
      <div class="intel-header">
        <div>
          <span class="status-badge ${badgeClass}">${county.status}</span>
          <h2 class="intel-title">${county.name} (${county.seats})</h2>
          <span class="intel-msa">Economic Area: ${county.msa}</span>
        </div>
        <div class="intel-stat-block">
          <span class="stat-big">${county.eligibilityPercent}%</span>
          <span class="stat-desc">Eligible Land Area</span>
        </div>
      </div>

      <div class="intel-grid">
        <div class="intel-metric">
          <span class="metric-label">USDA 1-4 Person Income Cap</span>
          <span class="metric-value font-emerald">$${county.incomeCap1to4.toLocaleString()}</span>
          <span class="metric-sub">115% Area Median Income</span>
        </div>

        <div class="intel-metric">
          <span class="metric-label">USDA 5-8 Person Income Cap</span>
          <span class="metric-value font-emerald">$${county.incomeCap5to8.toLocaleString()}</span>
          <span class="metric-sub">Large Household Ceiling</span>
        </div>

        <div class="intel-metric">
          <span class="metric-label">Avg. Rural Land Price</span>
          <span class="metric-value font-amber">${county.avgAcrePrice}</span>
          <span class="metric-sub">Buildable Residential Parcels</span>
        </div>

        <div class="intel-metric">
          <span class="metric-label">Typical Cabin Build Rate</span>
          <span class="metric-value font-blue">$${county.typicalCabinCostSqFt}/sq.ft</span>
          <span class="metric-sub">Turnkey Contractor Cost</span>
        </div>
      </div>

      <div class="intel-warnings">
        <div class="alert-box alert-usace">
          <div class="alert-title">Lake Lanier & U.S. Army Corps of Engineers (USACE) Protocol</div>
          <p>${county.corpsWarning}</p>
          <div class="usace-rule-tag">Key Rule: Private dock rights are revocable licenses, not deeded land. USDA loans will not finance unpermitted USACE shoreline alterations.</div>
        </div>

        <div class="alert-box alert-zoning">
          <div class="alert-title">Zoning & Building Feasibility</div>
          <p><strong>Zoning:</strong> ${county.zoningNotes}</p>
          <p><strong>Hotspot Towns:</strong> ${county.keyTowns.join(", ")}</p>
        </div>

        <div class="alert-box alert-recommendation">
          <div class="alert-title">Underwriter Verdict & Strategy</div>
          <p>${county.recommendation}</p>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Search input
    const searchInput = document.getElementById('geo-search-input');
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        document.getElementById('county-list-container').innerHTML = this.renderCountyList(GEORGIA_REGIONS);
        return;
      }
      const filtered = GEORGIA_REGIONS.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.seats.toLowerCase().includes(q) ||
        r.keyTowns.some(t => t.toLowerCase().includes(q))
      );
      document.getElementById('county-list-container').innerHTML = this.renderCountyList(filtered);
      if (filtered.length > 0) {
        this.selectCounty(filtered[0].id);
      }
    });

    // Chip buttons
    this.container.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = e.currentTarget.getAttribute('data-target');
        this.selectCounty(targetId);
      });
    });

    // County items
    this.container.addEventListener('click', (e) => {
      const item = e.target.closest('.county-item');
      if (item) {
        const id = item.getAttribute('data-id');
        this.selectCounty(id);
      }
      
      const svgNode = e.target.closest('.map-node');
      if (svgNode) {
        const id = svgNode.getAttribute('data-id');
        this.selectCounty(id);
      }

      if (e.target.id === 'btn-copy-checklist') {
        this.copyChecklist();
      }
    });
  }

  selectCounty(id) {
    const found = GEORGIA_REGIONS.find(r => r.id === id);
    if (found) {
      this.selectedCounty = found;
      // Re-render intelligence panel
      const intelPanel = document.getElementById('region-intelligence-panel');
      if (intelPanel) {
        intelPanel.innerHTML = this.renderIntelligenceCard(found);
      }
      // Highlight list item
      this.container.querySelectorAll('.county-item').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-id') === id);
      });
      // Highlight SVG node
      this.container.querySelectorAll('.map-node').forEach(el => {
        el.classList.toggle('svg-selected', el.getAttribute('data-id') === id);
      });

      // Dispatch custom event to notify other modules of county change
      window.dispatchEvent(new CustomEvent('usda-county-changed', { detail: found }));
    }
  }

  copyChecklist() {
    const checklist = `
=====================================================
USDA SECTION 502 SINGLE-CLOSE PARCEL CHECKLIST
Target Region: ${this.selectedCounty.name} (${this.selectedCounty.status})
=====================================================
1. PARCEL ELIGIBILITY:
   [ ] Address/Tax ID pinned on official eligibility.sc.egov.usda.gov map.
   [ ] Outside shaded metropolitan boundaries.

2. SHORELINE & WATERWAY EASEMENTS:
   [ ] Boundary verification: Does property touch Lake Lanier or USACE property line?
   [ ] Confirm lot does not rely on USACE flowage easement for septic drain field.
   [ ] Verify dock license status with Lake Lanier Project Management Office (if applicable).

3. UTILITIES & HEALTH DEPARTMENT:
   [ ] Soil perc test completed and approved by County Environmental Health Dept.
   [ ] Septic tank permit issued or preliminary approval letter on file.
   [ ] Potable water source: County water meter tap paid OR certified private well location (min. 100ft from septic).
   [ ] Electric service line extension quote verified with local power EMC (Jackson EMC, Sawnee EMC, Amicalola EMC).

4. ACCESS & ROADWAY:
   [ ] Deeded direct access to publicly maintained paved or all-weather road.
   [ ] If on private road, formal recorded Permanent Road Maintenance Agreement signed by all lot owners.

5. RESTRICTIONS & TITLE:
   [ ] No HOA restrictions prohibiting modular or single-family construction.
   [ ] Clear fee simple title without mineral/timber rights severed.
=====================================================
    `.trim();

    navigator.clipboard.writeText(checklist).then(() => {
      alert("✅ USDA Parcel Due-Diligence Checklist copied to clipboard!");
    }).catch(() => {
      prompt("Copy checklist below:", checklist);
    });
  }
}
