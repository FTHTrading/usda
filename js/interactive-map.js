// Interactive Leaflet GIS Radar & Satellite Map Engine
// Features: Real-time satellite imagery, USDA boundary polygons, Lake Lanier USACE buffer, secret hotspot pins, and click-to-inspect GPS radar.
import { SECRET_HOTSPOTS } from '../data/secret-locations.js';
import { addressGeocoder, ADDRESS_PRESETS } from './address-geocoder.js';
import { PROJECT_RECORD } from '../data/project-record.js';
import { getIcon } from './icons.js';

export class USDAInteractiveMap {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.map = null;
    this.layers = {};
    this.currentMarker = null;
    this.activeFilter = 'all';
    this.init();
  }

  init() {
    this.renderLayout();
    // Initialize Leaflet map after DOM is rendered
    setTimeout(() => {
      this.initLeaflet();
      this.attachEvents();
    }, 100);
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="interactive-map-system">
        <!-- Map Controls Bar -->
        <div class="map-toolbar">
          <div class="toolbar-left">
            <h3 class="toolbar-title">North Georgia GIS Boundary & Satellite Radar</h3>
            <span class="toolbar-tag">Real-Time Leaflet GIS Engine</span>
          </div>

          <div class="toolbar-quick-fly">
            <span class="fly-label">Quick Jump:</span>
            <button class="fly-btn" data-loc="dawson-lake">🌊 Lake Lanier Backdoor (Toto Creek)</button>
            <button class="fly-btn" data-loc="dawson-juno">⚡ Alpharetta Commute (Juno)</button>
            <button class="fly-btn" data-loc="dahlonega">🍇 Dahlonega Wine Country</button>
            <button class="fly-btn" data-loc="alpharetta">🚫 Alpharetta (Metro Red Zone)</button>
            <button class="fly-btn" data-loc="reset">🗺️ Reset View</button>
          </div>
        </div>

        <!-- Live Address Search & Rural Verification Engine Bar -->
        <div class="map-address-search-card glass-panel-card" style="margin-bottom: 1rem; padding: 1.15rem 1.35rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.65rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="status-badge-glass badge-green">● LIVE PARCEL & ADDRESS RADAR</span>
              <strong style="color: #0f172a; font-size: 0.95rem;">USDA Rural Eligibility & Elevation Geocoder</strong>
            </div>
            <span style="font-size: 0.72rem; color: var(--text-dim); font-family: var(--font-mono);">7 CFR § 3555 / USGS 3DEP Elevation Check</span>
          </div>

          <div style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
            <div class="global-search-wrapper" style="flex: 1; min-width: 280px; background: rgba(255,255,255,0.95); border: 1px solid var(--glass-border); border-radius: 8px; padding: 0.2rem 0.75rem; display: flex; align-items: center;">
              <span class="search-symbol" style="margin-right: 0.5rem; color: var(--text-dim);">${getIcon('radar', '', 16)}</span>
              <input type="text" id="inp-map-address-search" placeholder="Type any address, parcel, or city (e.g. 428 Chestatee Overlook Trail, Dawsonville, GA)..." style="width: 100%; border: none; background: transparent; font-size: 0.88rem; outline: none; padding: 0.5rem 0;" />
            </div>
            <button class="btn-primary" id="btn-run-address-lookup" style="background: #059669; color: #fff; padding: 0.6rem 1.4rem; font-weight: 700; border-radius: 8px; cursor: pointer;">
              Verify Address →
            </button>
          </div>

          <!-- Preset Quick Chips -->
          <div style="display: flex; align-items: center; gap: 0.4rem; margin-top: 0.75rem; flex-wrap: wrap;">
            <span style="font-size: 0.72rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase;">Presets:</span>
            <button class="filter-tab-pill" data-addr-preset="0">🌊 Dawsonville Lake</button>
            <button class="filter-tab-pill" data-addr-preset="1">🍇 Dahlonega Wine</button>
            <button class="filter-tab-pill" data-addr-preset="2">⛰️ Jasper Mountain</button>
            <button class="filter-tab-pill" data-addr-preset="3">🌲 Blue Ridge Overlook</button>
            <button class="filter-tab-pill" data-addr-preset="4">🏖️ Gainesville Shore</button>
            <button class="filter-tab-pill" data-addr-preset="5" style="border-color: rgba(239, 68, 68, 0.35); color: #dc2626;">🚫 Alpharetta (Metro)</button>
          </div>

          <!-- Live Lookup Result Banner -->
          <div id="address-lookup-results-box" style="margin-top: 0.85rem; display: none;"></div>
        </div>

        <div class="map-view-container">
          <!-- The Leaflet Map Canvas -->
          <div id="leaflet-gis-canvas" class="gis-canvas"></div>

          <!-- Live GPS Inspection Radar Card (Overlaid or beside) -->
          <div class="gis-radar-card" id="gis-radar-panel">
            <div class="radar-header">
              <span class="radar-live-dot"></span>
              <h4>Live Parcel Inspection Radar</h4>
            </div>
            <p class="radar-instructions">Click anywhere on the map to drop a pin and inspect live coordinates, USDA boundary status, and commute distances.</p>
            
            <div class="radar-data-grid" id="radar-data-display">
              <div class="r-data-box">
                <span class="r-k">GPS Coordinates:</span>
                <span class="r-v" id="radar-coords">34.3825° N, -84.0152° W</span>
              </div>
              <div class="r-data-box">
                <span class="r-k">Estimated Eligibility:</span>
                <span class="r-v text-emerald font-bold" id="radar-status">100% ELIGIBLE RURAL</span>
              </div>
              <div class="r-data-box">
                <span class="r-k">Drive to Alpharetta:</span>
                <span class="r-v" id="radar-alpharetta-dist">~28 mins (25.4 mi)</span>
              </div>
              <div class="r-data-box">
                <span class="r-k">Lake Lanier Proximity:</span>
                <span class="r-v text-blue" id="radar-lake-dist">~1.2 mi to Chestatee Arm</span>
              </div>
            </div>

            <div class="radar-verdict-box" id="radar-verdict">
              <strong>💡 Underwriter Analysis:</strong> Click any glowing diamond on the map to inspect secret high-equity pockets and regulatory loopholes.
            </div>
          </div>
        </div>

        <!-- Secret Hotspots Quick Cards -->
        <div class="hotspots-grid-scroll">
          <div class="section-heading-flex" style="margin-top: 1.5rem;">
            <h4 class="section-heading">Secret High-Equity Pockets & Arbitrage Zones (Click to Fly)</h4>
            <span class="pro-tip-tag">6 Curated Undervalued Opportunities</span>
          </div>

          <div class="secret-cards-container">
            ${SECRET_HOTSPOTS.map(h => `
              <div class="secret-mini-card" data-id="${h.id}" data-lat="${h.lat}" data-lng="${h.lng}">
                <div class="mini-card-header">
                  <span class="mini-tag tag-${h.badgeColor}">${h.tag}</span>
                  <span class="mini-rating">${'★'.repeat(h.rating)}</span>
                </div>
                <h5 class="mini-title">${h.title}</h5>
                <span class="mini-sub">${h.sub}</span>
                <div class="mini-stats">
                  <span>Land: <strong>${h.lotBasis.split(' ')[0]}</strong></span>
                  <span>Drive: <strong>${h.driveToAlpharetta.split(' ')[0]} min</strong></span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  initLeaflet() {
    if (typeof L === 'undefined') {
      console.warn("Leaflet library not yet loaded. Retrying...");
      setTimeout(() => this.initLeaflet(), 250);
      return;
    }

    const mapElement = document.getElementById('leaflet-gis-canvas');
    if (!mapElement) return;

    // 1. Create Leaflet map centered at Lake Lanier / North GA
    this.map = L.map('leaflet-gis-canvas', {
      center: [34.38, -84.06],
      zoom: 10,
      minZoom: 8,
      maxZoom: 18,
      zoomControl: true
    });

    // 2. Base Tile Layers (Dark Matter, Satellite, OpenStreetMap)
    const darkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB &copy; OpenStreetMap',
      subdomains: 'abcd',
      maxZoom: 19
    });

    const satelliteESRI = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{z}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS',
      maxZoom: 18
    });

    const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    });

    // Add Dark Matter default
    darkMatter.addTo(this.map);

    // 3. Layer Controls
    const baseLayers = {
      "🌙 Sleek Dark GIS": darkMatter,
      "🛰️ Satellite Imagery (ESRI)": satelliteESRI,
      "🗺️ Street & Road Map": openStreetMap
    };

    // 4. Boundary Polygons & Overlays
    const boundaryLayerGroup = L.layerGroup();
    const hotspotLayerGroup = L.layerGroup();
    const lakeLanierLayerGroup = L.layerGroup();

    this.addBoundariesToLayer(boundaryLayerGroup);
    this.addLakeLanierToLayer(lakeLanierLayerGroup);
    this.addHotspotsToLayer(hotspotLayerGroup);

    boundaryLayerGroup.addTo(this.map);
    lakeLanierLayerGroup.addTo(this.map);
    hotspotLayerGroup.addTo(this.map);

    const overlayLayers = {
      "🟩 USDA Rural Eligibility Zones": boundaryLayerGroup,
      "🌊 Lake Lanier & USACE 1,070-ft Buffer": lakeLanierLayerGroup,
      "💎 Secret High-Value Hotspot Pins": hotspotLayerGroup
    };

    L.control.layers(baseLayers, overlayLayers, { position: 'topright' }).addTo(this.map);

    // 5. Map Click Handler (Click-to-Inspect Radar)
    this.map.on('click', (e) => {
      this.handleMapClick(e.latlng.lat, e.latlng.lng);
    });

    // 6. Default Radar Pin
    this.handleMapClick(34.3825, -84.0152);
  }

  addBoundariesToLayer(group) {
    // Dawson County (Green 92% Eligible)
    const dawsonCoords = [
      [34.520, -84.250], [34.520, -84.020], [34.360, -83.990],
      [34.340, -84.070], [34.330, -84.220], [34.520, -84.250]
    ];
    L.polygon(dawsonCoords, {
      color: '#10b981',
      fillColor: '#059669',
      fillOpacity: 0.22,
      weight: 2
    }).bindTooltip("<strong>Dawson County</strong><br>92% USDA Eligible · $135.5k Atlanta MSA Cap", { sticky: true }).addTo(group);

    // Lumpkin County (Green 100% Eligible)
    const lumpkinCoords = [
      [34.680, -84.150], [34.690, -83.820], [34.520, -83.820],
      [34.520, -84.180], [34.680, -84.150]
    ];
    L.polygon(lumpkinCoords, {
      color: '#10b981',
      fillColor: '#059669',
      fillOpacity: 0.22,
      weight: 2
    }).bindTooltip("<strong>Lumpkin County (Dahlonega)</strong><br>100% USDA Eligible · Prime Cabin Country", { sticky: true }).addTo(group);

    // Pickens County (Green 95% Eligible)
    const pickensCoords = [
      [34.580, -84.580], [34.580, -84.250], [34.380, -84.250],
      [34.380, -84.580], [34.580, -84.580]
    ];
    L.polygon(pickensCoords, {
      color: '#10b981',
      fillColor: '#059669',
      fillOpacity: 0.20,
      weight: 2
    }).bindTooltip("<strong>Pickens County (Jasper)</strong><br>95% USDA Eligible · Atlanta MSA Cap", { sticky: true }).addTo(group);

    // North Hall County (Yellow 55% Eligible)
    const northHallCoords = [
      [34.500, -83.820], [34.500, -83.650], [34.380, -83.700],
      [34.380, -83.860], [34.500, -83.820]
    ];
    L.polygon(northHallCoords, {
      color: '#f59e0b',
      fillColor: '#d97706',
      fillOpacity: 0.25,
      weight: 2
    }).bindTooltip("<strong>Hall County North (Clermont/Murrayville)</strong><br>55% Eligible Pockets North of GA-52", { sticky: true }).addTo(group);

    // Red Zones (Disqualified Metro)
    // Alpharetta / North Fulton
    const fultonCoords = [
      [34.120, -84.380], [34.160, -84.220], [34.000, -84.220],
      [34.000, -84.380], [34.120, -84.380]
    ];
    L.polygon(fultonCoords, {
      color: '#ef4444',
      fillColor: '#b91c1c',
      fillOpacity: 0.35,
      weight: 2
    }).bindTooltip("<strong>Alpharetta / North Fulton</strong><br>100% DISQUALIFIED (Urban Metro)", { sticky: true }).addTo(group);

    // Forsyth County (Cumming / Lake Lanier Shore)
    const forsythCoords = [
      [34.330, -84.220], [34.340, -84.070], [34.160, -84.050],
      [34.120, -84.250], [34.330, -84.220]
    ];
    L.polygon(forsythCoords, {
      color: '#ef4444',
      fillColor: '#b91c1c',
      fillOpacity: 0.35,
      weight: 2
    }).bindTooltip("<strong>Forsyth County (Cumming / Lake Lanier)</strong><br>DISQUALIFIED · Shaded Metro & USACE Shoreline", { sticky: true }).addTo(group);

    // Gainesville / South Hall
    const southHallCoords = [
      [34.380, -83.860], [34.380, -83.700], [34.220, -83.750],
      [34.220, -83.920], [34.380, -83.860]
    ];
    L.polygon(southHallCoords, {
      color: '#ef4444',
      fillColor: '#b91c1c',
      fillOpacity: 0.35,
      weight: 2
    }).bindTooltip("<strong>Gainesville & South Hall</strong><br>DISQUALIFIED (Urban Cluster)", { sticky: true }).addTo(group);
  }

  addLakeLanierToLayer(group) {
    // Stylized Lake Sidney Lanier Water Body Polyline / Polygon
    const lakePoly = [
      [34.18, -84.08], [34.22, -84.03], [34.25, -84.01],
      [34.30, -83.97], [34.35, -83.94], [34.38, -83.98],
      [34.36, -84.02], [34.30, -84.03], [34.25, -84.07],
      [34.20, -84.10], [34.18, -84.08]
    ];

    L.polygon(lakePoly, {
      color: '#0284c7',
      fillColor: '#0369a1',
      fillOpacity: 0.45,
      weight: 2.5
    }).bindTooltip("<strong>LAKE SIDNEY LANIER</strong><br>USACE 1,070-ft Shoreline Contour Line Applies", { sticky: true }).addTo(group);
  }

  addHotspotsToLayer(group) {
    SECRET_HOTSPOTS.forEach(h => {
      // Create custom HTML pulse icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="pulse-marker-wrapper">
            <div class="pulse-ring ring-${h.badgeColor}"></div>
            <div class="pulse-core core-${h.badgeColor}">★</div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([h.lat, h.lng], { icon: customIcon }).addTo(group);

      const popupContent = `
        <div class="leaflet-popup-card">
          <div class="popup-badge tag-${h.badgeColor}">${h.tag} · ${'★'.repeat(h.rating)}</div>
          <h4 class="popup-title">${h.title}</h4>
          <span class="popup-sub">${h.sub}</span>
          
          <div class="popup-stats-grid">
            <div><small>Land Basis:</small> <strong>${h.lotBasis}</strong></div>
            <div><small>Drive to Alpharetta:</small> <strong>${h.driveToAlpharetta}</strong></div>
            <div><small>USDA Status:</small> <strong class="text-emerald">${h.eligibilityStatus}</strong></div>
            <div><small>Income Ceiling:</small> <strong>${h.incomeCap}</strong></div>
          </div>

          <p class="popup-summary">${h.secretSummary}</p>

          <div class="popup-tactics">
            <strong>Key Secret Tactics:</strong>
            <ul>
              ${h.secretTactics.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 360, className: 'custom-popup-frame' });
    });
  }

  handleMapClick(lat, lng) {
    const latFixed = lat.toFixed(4);
    const lngFixed = lng.toFixed(4);

    // Compute distance to Alpharetta (approx 34.0754, -84.2941)
    const distToAlpharettaMiles = this.computeDistanceMiles(lat, lng, 34.0754, -84.2941);
    const distToLakeMiles = this.computeDistanceMiles(lat, lng, 34.25, -84.05);

    // Evaluate eligibility based on boundaries
    let statusText = "100% ELIGIBLE RURAL";
    let statusColor = "text-emerald";
    let verdictText = "";

    if (lat < 34.18 && lng > -84.40) {
      statusText = "100% DISQUALIFIED (Metro Atlanta / Alpharetta)";
      statusColor = "text-rose";
      verdictText = "⚠️ This parcel is inside the shaded Atlanta urban boundary. Section 502 financing is NOT available here. Target Dawson or Pickens County.";
    } else if (lat < 34.34 && lng > -84.18 && lng < -84.00) {
      statusText = "DISQUALIFIED (Cumming / South Lake Lanier)";
      statusColor = "text-rose";
      verdictText = "⚠️ Forsyth County shoreline is shaded out. Cross north into Dawson County along Hwy 53 to gain 100% eligibility.";
    } else if (lat >= 34.34 && lat <= 34.52 && lng >= -84.25 && lng <= -83.99) {
      statusText = "100% ELIGIBLE (Dawsonville / Upper Lanier Golden Zone)";
      statusColor = "text-emerald";
      verdictText = "🌟 HIGH ARBITRAGE ZONE: 100% USDA Single-Close approved with high $135,500 Atlanta MSA income ceiling and low lot costs.";
    } else if (lat >= 34.52 && lng >= -84.18 && lng <= -83.82) {
      statusText = "100% ELIGIBLE (Lumpkin / Dahlonega Cabin Prime)";
      statusColor = "text-emerald";
      verdictText = "🪵 CABIN PARADISE: 100% USDA eligible. Lowest dirt basis ($18k/ac) and premier appraisal comps for timber craftsman cabins.";
    } else {
      statusText = "ELIGIBLE RURAL ZONE";
      statusColor = "text-emerald";
      verdictText = "✔️ Outside major metro boundaries. Conforms with standard USDA Section 502 population density guidelines.";
    }

    // Update Radar DOM display
    document.getElementById('radar-coords').textContent = `${latFixed}° N, ${lngFixed}° W`;
    
    const statusEl = document.getElementById('radar-status');
    statusEl.className = `r-v ${statusColor} font-bold`;
    statusEl.textContent = statusText;

    document.getElementById('radar-alpharetta-dist').textContent = `~${Math.round(distToAlpharettaMiles)} miles (${Math.round(distToAlpharettaMiles * 1.25)} mins)`;
    document.getElementById('radar-lake-dist').textContent = `~${distToLakeMiles.toFixed(1)} miles to Lake Lanier basin`;
    document.getElementById('radar-verdict').innerHTML = `<strong>💡 Underwriter Analysis:</strong> ${verdictText}`;

    // Place or move Leaflet Pin
    if (this.currentMarker) {
      this.currentMarker.setLatLng([lat, lng]);
    } else {
      const radarIcon = L.divIcon({
        className: 'radar-drop-pin',
        html: `<div class="radar-crosshair"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      this.currentMarker = L.marker([lat, lng], { icon: radarIcon }).addTo(this.map);
    }
  }

  computeDistanceMiles(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Earth radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  attachEvents() {
    // Quick fly buttons
    this.container.querySelectorAll('.fly-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const loc = e.currentTarget.getAttribute('data-loc');
        if (!this.map) return;

        if (loc === 'dawson-lake') {
          this.map.flyTo([34.3825, -84.0152], 13);
          this.handleMapClick(34.3825, -84.0152);
        } else if (loc === 'dawson-juno') {
          this.map.flyTo([34.4082, -84.1850], 13);
          this.handleMapClick(34.4082, -84.1850);
        } else if (loc === 'dahlonega') {
          this.map.flyTo([34.5695, -83.9265], 12);
          this.handleMapClick(34.5695, -83.9265);
        } else if (loc === 'alpharetta') {
          this.map.flyTo([34.0754, -84.2941], 12);
          this.handleMapClick(34.0754, -84.2941);
        } else if (loc === 'reset') {
          this.map.flyTo([34.38, -84.06], 10);
        }
      });
    });

    // Secret Mini Cards click to fly
    this.container.querySelectorAll('.secret-mini-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const lat = parseFloat(e.currentTarget.getAttribute('data-lat'));
        const lng = parseFloat(e.currentTarget.getAttribute('data-lng'));
        if (this.map) {
          this.map.flyTo([lat, lng], 13);
          this.handleMapClick(lat, lng);
        }
      });
    });

    // Address Lookup Handlers
    const searchInp = this.container.querySelector('#inp-map-address-search');
    const searchBtn = this.container.querySelector('#btn-run-address-lookup');

    const triggerLookup = () => {
      const q = searchInp?.value || '';
      if (q.trim()) this.handleAddressLookup(q.trim());
    };

    searchBtn?.addEventListener('click', triggerLookup);
    searchInp?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerLookup();
      }
    });

    // Preset buttons
    this.container.querySelectorAll('[data-addr-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-addr-preset'), 10);
        const preset = ADDRESS_PRESETS[idx];
        if (preset) {
          if (searchInp) searchInp.value = preset.address;
          this.handleAddressLookup(preset.address);
        }
      });
    });
  }

  async handleAddressLookup(query) {
    const resultsBox = this.container.querySelector('#address-lookup-results-box');
    if (!resultsBox) return;

    resultsBox.style.display = 'block';
    resultsBox.innerHTML = `
      <div style="padding: 1rem; background: #f8fafc; border: 1px solid var(--glass-border); border-radius: 8px; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-dim);">
        <span class="radar-live-dot"></span> Ingesting coordinates and querying USGS 3DEP elevation & USDA boundary...
      </div>
    `;

    try {
      const result = await addressGeocoder.lookup(query);
      const isEligible = result.eligibility.status === 'ELIGIBLE';
      const isDisqualified = result.eligibility.status === 'DISQUALIFIED';

      resultsBox.innerHTML = `
        <div style="padding: 1.15rem; background: #fff; border: 1px solid var(--glass-border); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <h4 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0;">${result.resolvedAddress}</h4>
                <span class="status-badge-glass ${isEligible ? 'badge-green' : isDisqualified ? 'badge-red' : 'badge-amber'}">
                  ${result.eligibility.label}
                </span>
              </div>
              <p style="font-size: 0.75rem; color: var(--text-dim); margin: 0.2rem 0 0;">
                GPS: <strong>${result.coordinates.lat}° N, ${result.coordinates.lng}° W</strong> · Jurisdiction: <strong>${result.county.name}</strong> (${result.county.metroStatus})
              </p>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn-primary" id="btn-apply-searched-address" style="background: #059669; color: #fff; padding: 0.45rem 0.95rem; font-size: 0.8rem; border-radius: 6px;">
                ✓ Set as Active Project Parcel
              </button>
              <button class="btn-secondary" id="btn-fly-searched-address" style="padding: 0.45rem 0.95rem; font-size: 0.8rem; border-radius: 6px;">
                ✈ Fly Map to Location
              </button>
            </div>
          </div>

          <!-- 4-Stat Strip -->
          <div class="radar-data-grid" style="margin-bottom: 0.75rem;">
            <div class="r-data-box">
              <span class="r-k">USGS 3DEP Elevation:</span>
              <span class="r-v ${result.elevation.cleared ? 'text-emerald font-bold' : 'text-amber'}">
                ${result.elevation.feetMSL} ft MSL (${result.elevation.cleared ? `+${result.elevation.cushionFeet} ft above Lake Lanier` : 'At or below 1,070 ft'})
              </span>
            </div>
            <div class="r-data-box">
              <span class="r-k">2026 Household Cap (1-4):</span>
              <span class="r-v font-bold">$${result.county.incomeCap1to4.toLocaleString()}</span>
            </div>
            <div class="r-data-box">
              <span class="r-k">Lake Lanier Proximity:</span>
              <span class="r-v text-blue">~${result.elevation.proximityMiles} miles</span>
            </div>
            <div class="r-data-box">
              <span class="r-k">Georgia CUVA Tax Squeeze:</span>
              <span class="r-v text-emerald font-bold">${result.county.cuvaSavingsRate} Reduction</span>
            </div>
          </div>

          <!-- Matching Programs Bar -->
          <div style="border-top: 1px solid var(--glass-border); padding-top: 0.65rem;">
            <span style="font-size: 0.72rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.35rem; display: block;">
              Matching USDA Programs:
            </span>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
              ${result.programs.filter(p => p.isEligible).map(p => `
                <span class="badge-nav-pill pill-emerald" title="${p.suitabilityNote}" style="font-size: 0.7rem; padding: 0.25rem 0.6rem;">
                  ✓ ${p.title}
                </span>
              `).join('')}
              ${result.programs.filter(p => !p.isEligible).map(p => `
                <span class="badge-nav-pill" style="opacity: 0.45; text-decoration: line-through; font-size: 0.7rem; padding: 0.25rem 0.6rem;">
                  ✕ ${p.title}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      // Wire action buttons
      resultsBox.querySelector('#btn-fly-searched-address')?.addEventListener('click', () => {
        if (this.map) {
          this.map.flyTo([result.coordinates.lat, result.coordinates.lng], 14);
          this.handleMapClick(result.coordinates.lat, result.coordinates.lng);
        }
      });

      resultsBox.querySelector('#btn-apply-searched-address')?.addEventListener('click', () => {
        PROJECT_RECORD.address = result.resolvedAddress;
        PROJECT_RECORD.jurisdiction.county = result.county.name;
        PROJECT_RECORD.coordinates = {
          lat: result.coordinates.lat,
          lng: result.coordinates.lng,
          elevationMSL: `${result.elevation.feetMSL} ft`
        };

        // Show toast
        this.showToast(`✓ Parcel Applied! Address set to ${result.resolvedAddress}`);

        // Dispatch update event
        window.dispatchEvent(new CustomEvent('usda-project-updated', { detail: PROJECT_RECORD }));

        // Center map
        if (this.map) {
          this.map.flyTo([result.coordinates.lat, result.coordinates.lng], 14);
          this.handleMapClick(result.coordinates.lat, result.coordinates.lng);
        }
      });

      // Fly map directly on search completion
      if (this.map) {
        this.map.flyTo([result.coordinates.lat, result.coordinates.lng], 13);
        this.handleMapClick(result.coordinates.lat, result.coordinates.lng);
      }
    } catch (e) {
      resultsBox.innerHTML = `
        <div style="padding: 1rem; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); border-radius: 8px; color: #dc2626; font-size: 0.85rem;">
          ✖ Address lookup failed: ${e.message}. Please try one of the presets or enter a standard City, County, or ZIP.
        </div>
      `;
    }
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
}
