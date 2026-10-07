// North Georgia Target Deal Finder & Sourcing Hotspots
export class USDAHotspots {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="hotspots-layout">
        <div class="hotspots-header">
          <div>
            <h3 class="card-title">North Georgia USDA Deal Sourcing Zones</h3>
            <p class="card-subtitle">Highest-potential land pockets balancing Lake Lanier / Atlanta access with 100% USDA 502 Single-Close financing</p>
          </div>
          <span class="hotspot-badge-top">Updated for FY2026 Caps</span>
        </div>

        <div class="zones-grid">
          <!-- Zone 1: Dawsonville -->
          <div class="zone-card featured-zone">
            <div class="zone-rank">TOP PICK #1</div>
            <div class="zone-title-bar">
              <h4>Dawson County (Dawsonville / Chestatee Basin)</h4>
              <span class="status-badge badge-success">92% USDA Eligible</span>
            </div>
            <p class="zone-tagline">The sweet spot: Atlanta MSA income cap ($135.5k - $178.9k) + Upper Lake Lanier proximity.</p>
            
            <div class="zone-metrics-grid">
              <div class="z-metric">
                <span class="z-lbl">Average Lot Cost</span>
                <span class="z-val font-amber">$35k – $55k (1-2 ac)</span>
              </div>
              <div class="z-metric">
                <span class="z-lbl">Drive to Alpharetta</span>
                <span class="z-val font-blue">28 - 35 minutes</span>
              </div>
              <div class="z-metric">
                <span class="z-lbl">Lake Proximity</span>
                <span class="z-val font-emerald">5 - 10 mins (North Finger)</span>
              </div>
              <div class="z-metric">
                <span class="z-lbl">Typical Pro-Forma</span>
                <span class="z-val font-emerald">$375,000 Turnkey</span>
              </div>
            </div>

            <div class="zone-tactics">
              <strong>Acquisition Strategy:</strong> Look along Highway 53 West, Juno Road, and Kelly Bridge area. Avoid the commercial cluster around GA-400/North Georgia Premium Outlets. Test soil perc before signing contract.
            </div>
          </div>

          <!-- Zone 2: Lumpkin / Dahlonega -->
          <div class="zone-card">
            <div class="zone-rank">TOP PICK #2</div>
            <div class="zone-title-bar">
              <h4>Lumpkin County (Dahlonega / Auraria)</h4>
              <span class="status-badge badge-success">100% USDA Eligible</span>
            </div>
            <p class="zone-tagline">Authentic mountain foothills, gold rush history, river trout streams, zero suburban creep.</p>
            
            <div class="zone-metrics-grid">
              <div class="z-metric">
                <span class="z-lbl">Average Lot Cost</span>
                <span class="z-val font-amber">$25k – $45k (1.5-3 ac)</span>
              </div>
              <div class="z-metric">
                <span class="z-lbl">Drive to Alpharetta</span>
                <span class="z-val font-blue">45 - 55 minutes</span>
              </div>
              <div class="z-metric">
                <span class="z-lbl">Income Cap (1-4)</span>
                <span class="z-val font-purple">$118,200</span>
              </div>
              <div class="z-metric">
                <span class="z-lbl">Typical Pro-Forma</span>
                <span class="z-val font-emerald">$335,000 Turnkey</span>
              </div>
            </div>

            <div class="zone-tactics">
              <strong>Acquisition Strategy:</strong> Auraria and Cavender areas offer flat-to-rolling build sites with mountain views. Lower land basis allows you to allocate more budget toward high-end timber finishes.
            </div>
          </div>

          <!-- Zone 3: North Hall County -->
          <div class="zone-card">
            <div class="zone-rank">TOP PICK #3</div>
            <div class="zone-title-bar">
              <h4>Hall County North (Murrayville / Clermont)</h4>
              <span class="status-badge badge-warning">55% USDA Eligible</span>
            </div>
            <p class="zone-tagline">Direct Lake Lanier water access options outside the Gainesville urban boundary.</p>
            
            <div class="zone-metrics-grid">
              <div class="z-metric">
                <span class="z-lbl">Average Lot Cost</span>
                <span class="z-val font-amber">$45k – $75k (1-2 ac)</span>
              </div>
              <div class="z-metric">
                <span class="z-lbl">Drive to Alpharetta</span>
                <span class="z-val font-blue">40 - 50 minutes</span>
              </div>
              <div class="z-metric">
                <span class="z-lbl">Income Cap (1-4)</span>
                <span class="z-val font-purple">$135,500</span>
              </div>
              <div class="z-metric">
                <span class="z-lbl">Typical Pro-Forma</span>
                <span class="z-val font-emerald">$395,000 Turnkey</span>
              </div>
            </div>

            <div class="zone-tactics">
              <strong>Acquisition Strategy:</strong> Stay strictly north of GA-52/Hwy 115. Check tax parcel ID against the USDA mapping system to guarantee the parcel is in the unshaded zone.
            </div>
          </div>

          <!-- Zone 4: Pickens County -->
          <div class="zone-card">
            <div class="zone-rank">TOP PICK #4</div>
            <div class="zone-title-bar">
              <h4>Pickens County (Jasper / Talking Rock)</h4>
              <span class="status-badge badge-success">95% USDA Eligible</span>
            </div>
            <p class="zone-tagline">Rolling Appalachian slopes, 515 corridor, high builder competition keeping costs down.</p>
            
            <div class="zone-metrics-grid">
              <div class="z-metric">
                <span class="z-lbl">Average Lot Cost</span>
                <span class="z-val font-amber">$25k – $40k (1-2 ac)</span>
              </div>
              <div class="z-metric">
                <span class="z-lbl">Drive to Alpharetta</span>
                <span class="z-val font-blue">45 - 50 minutes</span>
              </div>
              <div class="z-metric">
                <span class="z-lbl">Income Cap (1-4)</span>
                <span class="z-val font-purple">$135,500</span>
              </div>
              <div class="z-metric">
                <span class="z-lbl">Typical Pro-Forma</span>
                <span class="z-val font-emerald">$340,000 Turnkey</span>
              </div>
            </div>

            <div class="zone-tactics">
              <strong>Acquisition Strategy:</strong> Talking Rock Highway and Grandview area. Check driveway slope—steep mountain driveways can cost an extra $5k - $10k in gravel and culverts.
            </div>
          </div>
        </div>

        <!-- Practical 5-Step Execution Playbook -->
        <div class="playbook-box">
          <h3 class="playbook-title">The 5-Step USDA Single-Close Execution Blueprint</h3>
          <div class="steps-flow">
            <div class="step-item">
              <div class="step-badge">Step 1</div>
              <h5>Get Pre-Approved with a USDA Single-Close Lender</h5>
              <p>Not all lenders do Single-Close. Speak with USDA specialists (e.g. Movement Mortgage, Guild Mortgage, Fairway, PrimeLending) who have a dedicated Single-Close construction desk.</p>
            </div>

            <div class="step-item">
              <div class="step-badge">Step 2</div>
              <h5>Lock Land Contract with USDA Contingencies</h5>
              <p>Put an eligible lot under contract with a 21-day due diligence period for soil perc test, well feasibility, and USDA parcel eligibility confirmation.</p>
            </div>

            <div class="step-item">
              <div class="step-badge">Step 3</div>
              <h5>Select Approved General Contractor & Certified Plans</h5>
              <p>Contractor submits license, $1M GL insurance, and detailed itemized construction budget (takeoff) and architectural blueprints to lender's construction department.</p>
            </div>

            <div class="step-item">
              <div class="step-badge">Step 4</div>
              <h5>Single-Closing & 100% Escrow Draw Account</h5>
              <p>Loan closes once prior to ground breaking. Note covers land purchase + construction budget + contingency + interest reserve. $0 down at closing table.</p>
            </div>

            <div class="step-item">
              <div class="step-badge">Step 5</div>
              <h5>Inspection Draws & Certificate of Occupancy</h5>
              <p>Builder receives draws based on third-party inspection milestones. Once final Certificate of Occupancy is issued, move in as your primary residence!</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
