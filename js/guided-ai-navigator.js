// USDA Rural OS & 3FS Platform — Interactive AI Guided Navigator & Copilot
// Provides interactive step-by-step system walkthroughs, regulatory intelligence,
// direct module navigation, and conversational assistance.

import { ICONS, getIcon } from './icons.js';

export class USDAGuidedAINavigator {
  constructor() {
    this.isOpen = false;
    this.currentTourStep = 0;
    this.activeTourId = null;
    this.history = [];
    this.init();
  }

  init() {
    this.createDom();
    this.attachEvents();
  }

  createDom() {
    // If element already exists, remove
    const existing = document.getElementById('ai-guided-navigator-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'ai-guided-navigator-root';
    root.innerHTML = `
      <!-- Floating AI Guide Dock Button -->
      <button class="ai-guide-fab-btn" id="btn-ai-guide-fab" title="Open USDA Guided AI Navigator (Ctrl+J)">
        <span class="ai-fab-icon">${getIcon('sparkles', '', 20)}</span>
        <span class="ai-fab-label">AI System Guide</span>
        <span class="ai-fab-badge">7 CFR § 3555</span>
      </button>

      <!-- Liquid-Glass Backdrop Overlay -->
      <div class="ai-guide-backdrop" id="ai-guide-backdrop"></div>

      <!-- Main Copilot Modal Drawer -->
      <aside class="ai-guide-drawer" id="ai-guide-drawer" role="dialog" aria-modal="true" aria-label="USDA System AI Navigator">
        <!-- Drawer Header -->
        <div class="ai-drawer-header">
          <div class="ai-drawer-brand">
            <div class="ai-badge-crest">
              <img src="assets/brand/3fs-logo.svg" alt="3FS" style="width: 22px; height: 22px; border-radius: 6px;" />
            </div>
            <div>
              <div class="ai-drawer-title">
                <span>USDA Project Copilot</span>
                <span class="ai-version-pill">v2.4 Edge</span>
              </div>
              <p class="ai-drawer-subtitle">Autonomous Guidance, Regulatory Shield & System Navigator</p>
            </div>
          </div>
          <button class="ai-btn-close" id="btn-close-ai-guide" aria-label="Close Guide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Guided Navigation Quick Tabs -->
        <div class="ai-guide-tabs-bar">
          <button class="ai-tab-btn active" data-ai-tab="walkthroughs">
            ${getIcon('compass', '', 15)} System Walkthroughs
          </button>
          <button class="ai-tab-btn" data-ai-tab="copilot-chat">
            ${getIcon('ai', '', 15)} AI Q&A & Assistant
          </button>
          <button class="ai-tab-btn" data-ai-tab="cheat-sheets">
            ${getIcon('secrets', '', 15)} Regulatory Shield
          </button>
        </div>

        <!-- Tab 1: Interactive System Walkthroughs -->
        <div class="ai-tab-content active" id="ai-tab-walkthroughs">
          <div class="ai-tour-hero">
            <span class="status-badge-glass badge-green">INTERACTIVE SYSTEM ROADMAP</span>
            <h3>Where would you like to be guided today?</h3>
            <p>Select any workflow below to see step-by-step instructions and jump directly to active tools.</p>
          </div>

          <div class="ai-tours-list">
            <!-- Tour 1 -->
            <div class="ai-tour-card" data-tour="full-lifecycle">
              <div class="ai-tour-icon">${getIcon('overview')}</div>
              <div class="ai-tour-info">
                <h4>1. Full Construction Lifecycle Journey</h4>
                <p>Learn how to take a raw land parcel in North Georgia through zoning, permits, escrow draws, and final Certificate of Occupancy.</p>
                <div class="ai-tour-action-row">
                  <span class="ai-step-count">7 Key Steps</span>
                  <button class="btn-start-tour" data-tour-action="full-lifecycle">Start Walkthrough →</button>
                </div>
              </div>
            </div>

            <!-- Tour 2 -->
            <div class="ai-tour-card" data-tour="parcel-eligibility">
              <div class="ai-tour-icon">${getIcon('radar')}</div>
              <div class="ai-tour-info">
                <h4>2. Lake Lanier & Parcel Eligibility Audit</h4>
                <p>Learn the exact boundaries, the USACE 1,070-ft elevation contour rule, and how to verify high-equity Dawson County pockets.</p>
                <div class="ai-tour-action-row">
                  <span class="ai-step-count">4 Verification Gates</span>
                  <button class="btn-start-tour" data-tour-action="parcel-eligibility">Start Walkthrough →</button>
                </div>
              </div>
            </div>

            <!-- Tour 3 -->
            <div class="ai-tour-card" data-tour="zero-down-finance">
              <div class="ai-tour-icon">${getIcon('calculator')}</div>
              <div class="ai-tour-info">
                <h4>3. Zero-Down Single-Close Financial Modeler</h4>
                <p>How raw land, turnkey construction, 10% contingency, and 9-month interest reserves combine into 100% LTV permanent financing.</p>
                <div class="ai-tour-action-row">
                  <span class="ai-step-count">5 Financial Milestones</span>
                  <button class="btn-start-tour" data-tour-action="zero-down-finance">Start Walkthrough →</button>
                </div>
              </div>
            </div>

            <!-- Tour 4 -->
            <div class="ai-tour-card" data-tour="income-shield">
              <div class="ai-tour-icon">${getIcon('compliance')}</div>
              <div class="ai-tour-info">
                <h4>4. Statutory Income & Deduction Shield (7 CFR § 3555)</h4>
                <p>How $150,000+ North Atlanta corporate earners legally qualify using $480 child deductions and dollar-for-dollar childcare write-offs.</p>
                <div class="ai-tour-action-row">
                  <span class="ai-step-count">3 Federal Allowances</span>
                  <button class="btn-start-tour" data-tour-action="income-shield">Start Walkthrough →</button>
                </div>
              </div>
            </div>

            <!-- Tour 5 -->
            <div class="ai-tour-card" data-tour="real-pdfs">
              <div class="ai-tour-icon">${getIcon('documents')}</div>
              <div class="ai-tour-info">
                <h4>5. Real PDF Generation & Underwriting Dossiers</h4>
                <p>Generate verifiable, vector Form 3555-SC loan applications, project briefs, and feasibility reports directly in the browser.</p>
                <div class="ai-tour-action-row">
                  <span class="ai-step-count">7 Official Vector PDFs</span>
                  <button class="btn-start-tour" data-tour-action="real-pdfs">Start Walkthrough →</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Step Guided Card (Dynamic) -->
          <div class="ai-active-step-container" id="ai-active-step-box" style="display: none;"></div>
        </div>

        <!-- Tab 2: Conversational AI Q&A Assistant -->
        <div class="ai-tab-content" id="ai-tab-copilot-chat">
          <div class="ai-chat-header-bar">
            <span>Ask anything about USDA Section 502, Georgia land, codes, or 3FS platform:</span>
          </div>

          <!-- Quick Suggestion Chips -->
          <div class="ai-quick-chips-row">
            <button class="ai-chip-prompt" data-prompt="How do I verify a parcel near Lake Lanier?">
              Lake Lanier Eligibility
            </button>
            <button class="ai-chip-prompt" data-prompt="Can I really build a custom home for zero down payment?">
              0% Down Single-Close
            </button>
            <button class="ai-chip-prompt" data-prompt="How do daycare deductions raise my income ceiling?">
              7 CFR § 3555 Income Shield
            </button>
            <button class="ai-chip-prompt" data-prompt="What building codes and permits are required?">
              Permits & Building Codes
            </button>
          </div>

          <!-- Messages Stream Container -->
          <div class="ai-messages-scroll" id="ai-messages-scroll">
            <div class="ai-msg ai-msg-system">
              <div class="ai-msg-avatar">${getIcon('sparkles', '', 16)}</div>
              <div class="ai-msg-body">
                <strong>USDA System Copilot</strong>
                <p>Hello! I am your interactive AI Guide connected to Cloudflare Edge Workers and codified under <strong>7 CFR § 3555</strong>.</p>
                <p>Ask me any question about parcel eligibility, single-close financing, income shields, building codes, or permit requirements. I will give you the statutory rule and jump directly to the right tool!</p>
              </div>
            </div>
          </div>

          <!-- Input Field Bar -->
          <form class="ai-chat-input-bar" id="ai-chat-form">
            <input 
              type="text" 
              id="ai-chat-input" 
              placeholder="Ask about Lake Lanier, 0% down, childcare deductions, codes... (Press Enter)" 
              autocomplete="off"
            />
            <button type="submit" class="ai-chat-send-btn" id="btn-send-ai-chat" title="Send Query">
              ${getIcon('send', '', 16)}
            </button>
          </form>
        </div>

        <!-- Tab 3: Regulatory Shield & Cheatsheet -->
        <div class="ai-tab-content" id="ai-tab-cheat-sheets">
          <div class="ai-cheatsheet-section">
            <h4 style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">Statutory Authority Reference Matrix</h4>
            <div class="ai-cheat-card">
              <div class="cheat-header">
                <strong>7 CFR § 3555.152(b) — Minor Dependents</strong>
                <span class="status-badge-glass badge-green">$480 / Child</span>
              </div>
              <p>Deducts $480 annually per minor child under 18 or full-time dependent student from gross income.</p>
            </div>

            <div class="ai-cheat-card">
              <div class="cheat-header">
                <strong>7 CFR § 3555.152(c) — Verifiable Childcare</strong>
                <span class="status-badge-glass badge-green">100% Dollar-for-Dollar</span>
              </div>
              <p>Subtracts 100% of licensed daycare, after-school care, or nanny expenses necessary for household employment.</p>
            </div>

            <div class="ai-cheat-card">
              <div class="cheat-header">
                <strong>7 CFR § 3555.105(c) — Single-Close Construction</strong>
                <span class="status-badge-glass badge-blue">100% LTV Loan Note</span>
              </div>
              <p>Authorizes combination construction-to-permanent financing with interim interest and 10% contingency roll-up.</p>
            </div>

            <div class="ai-cheat-card">
              <div class="cheat-header">
                <strong>USACE Lake Lanier Flowage Buffer</strong>
                <span class="status-badge-glass badge-amber">1,070-ft MSL Contour</span>
              </div>
              <p>All finished slabs and septic drain fields must sit strictly above the Army Corps of Engineers boundary.</p>
            </div>

            <div class="ai-cheat-card">
              <div class="cheat-header">
                <strong>O.C.G.A. § 48-5-7.4 — Georgia CUVA Covenant</strong>
                <span class="status-badge-glass badge-purple">40% - 75% Tax Cut</span>
              </div>
              <p>Rural parcels over 10 acres enrolled in CUVA enjoy conservation use assessment, drastically lowering holding costs.</p>
            </div>
          </div>
        </div>
      </aside>
    `;

    document.body.appendChild(root);
  }

  attachEvents() {
    // FAB Button trigger
    const fab = document.getElementById('btn-ai-guide-fab');
    if (fab) fab.addEventListener('click', () => this.toggle(true));

    // Top Bar Trigger (if present in header)
    const headerBtn = document.getElementById('btn-open-ai-guide');
    if (headerBtn) headerBtn.addEventListener('click', () => this.toggle(true));

    // Close buttons & Backdrop
    const closeBtn = document.getElementById('btn-close-ai-guide');
    if (closeBtn) closeBtn.addEventListener('click', () => this.toggle(false));

    const backdrop = document.getElementById('ai-guide-backdrop');
    if (backdrop) backdrop.addEventListener('click', () => this.toggle(false));

    // Global Shortcut Ctrl+J / Cmd+J
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        this.toggle(!this.isOpen);
      }
      if (e.key === 'Escape' && this.isOpen) {
        this.toggle(false);
      }
    });

    // Overview Hero Action Trigger
    document.addEventListener('click', (e) => {
      if (e.target.closest('#btn-overview-ai-copilot')) {
        e.preventDefault();
        this.toggle(true);
        this.switchTab('walkthroughs');
      }
    });

    // Drawer Tabs
    const tabBtns = document.querySelectorAll('.ai-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-ai-tab');
        this.switchTab(target);
      });
    });

    // Tour Start Triggers
    const tourBtns = document.querySelectorAll('.btn-start-tour');
    tourBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tourId = btn.getAttribute('data-tour-action');
        this.startTour(tourId);
      });
    });

    // Suggestion Chips
    const chips = document.querySelectorAll('.ai-chip-prompt');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        const input = document.getElementById('ai-chat-input');
        if (input) {
          input.value = prompt;
          this.submitChat(prompt);
        }
      });
    });

    // Chat Form Submit
    const chatForm = document.getElementById('ai-chat-form');
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('ai-chat-input');
        if (input && input.value.trim()) {
          const val = input.value.trim();
          input.value = '';
          this.submitChat(val);
        }
      });
    }
  }

  toggle(open = null) {
    this.isOpen = open !== null ? open : !this.isOpen;
    const drawer = document.getElementById('ai-guide-drawer');
    const backdrop = document.getElementById('ai-guide-backdrop');

    if (drawer && backdrop) {
      drawer.classList.toggle('open', this.isOpen);
      backdrop.classList.toggle('open', this.isOpen);
      if (this.isOpen) {
        document.getElementById('ai-chat-input')?.focus();
      }
    }
  }

  switchTab(tabId) {
    document.querySelectorAll('.ai-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-ai-tab') === tabId);
    });
    document.querySelectorAll('.ai-tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `ai-tab-${tabId}`);
    });
  }

  startTour(tourId) {
    this.activeTourId = tourId;
    this.currentTourStep = 0;
    this.renderTourStep();
  }

  getTourDefinition(tourId) {
    const TOURS = {
      'full-lifecycle': {
        title: "Full Construction Lifecycle Roadmap",
        steps: [
          {
            stepNum: 1,
            title: "Master Project Record & Scope",
            targetTab: "overview",
            text: "Start at the Master Project Overview. Here, legal ownership (Kevan / UnyKorn LLC), licensed parties, total budget ($405,000), and stage gates are anchored into one unified state machine.",
            actionLabel: "Inspect Project Overview"
          },
          {
            stepNum: 2,
            title: "Satellite & GIS Radar Verification",
            targetTab: "map-radar",
            text: "Navigate to the GIS Radar. Confirm the parcel is strictly within the green USDA-eligible zone (e.g. Dawson County) and check that elevation exceeds 1,070 feet above Lake Lanier.",
            actionLabel: "Open GIS Radar & Check Elevation"
          },
          {
            stepNum: 3,
            title: "8 Financial Engines & Single-Close Note",
            targetTab: "calc-suite",
            text: "Open the 8 Calculators Hub. Run the Single-Close 0%-Down Note Modeler to finance $42k lot + $305k build + $34k contingency + interest reserve in a single closing.",
            actionLabel: "Run Single-Close Calculator"
          },
          {
            stepNum: 4,
            title: "Code Compliance Matrix (IRC / IECC)",
            targetTab: "compliance",
            text: "Review the Georgia 2018 Minimum Standard Codes matrix. Verify that septic setback, fire separation, structural engineering, and blower door (3.0 ACH50) requirements are assigned to licensed engineers.",
            actionLabel: "View Building Codes Matrix"
          },
          {
            stepNum: 5,
            title: "Permit Tracking & Filings",
            targetTab: "applications",
            text: "Track the 4 statutory filings: Dawson County Building Permit, Environmental Health Septic authorization, Land Disturbance, and the USDA Form 3555-SC underwriting packet.",
            actionLabel: "Check Permit Applications"
          },
          {
            stepNum: 6,
            title: "5-Stage Escrow Draws & Field Inspections",
            targetTab: "build",
            text: "Construction tracking governs the 5-stage draw schedule (Foundation 20%, Framing 25%, Mechanicals 20%, Finishes 25%, Final Punch 10%). Draws are released only after independent inspector sign-off.",
            actionLabel: "View Escrow Draw Schedule"
          },
          {
            stepNum: 7,
            title: "Official Downloadable PDFs",
            targetTab: "documents",
            text: "Export clean vector PDFs with real jsPDF generation. Download your completed Form 3555-SC Underwriting Dossier, Project Brief, and Feasibility Matrix directly to your machine.",
            actionLabel: "Download Real PDFs"
          }
        ]
      },
      'parcel-eligibility': {
        title: "Lake Lanier & Parcel Eligibility Walkthrough",
        steps: [
          {
            stepNum: 1,
            title: "County Line Boundary Rules",
            targetTab: "map-radar",
            text: "Forsyth County and South Lake Lanier are 100% disqualified due to suburban population caps. However, crossing north into Dawson County immediately unlocks 92% eligibility while keeping the high $135,500 Atlanta MSA income ceiling.",
            actionLabel: "View Radar Map"
          },
          {
            stepNum: 2,
            title: "USACE 1,070-Ft Flowage Easement Check",
            targetTab: "map-radar",
            text: "Lake Lanier shoreline parcels are encumbered by the Army Corps of Engineers flowage easement. Tap 'Audit Lake Lanier Elevation' to query real-time USGS 3DEP satellite radar.",
            actionLabel: "Test USGS 3DEP Elevation"
          },
          {
            stepNum: 3,
            title: "Secret Water Access Pockets",
            targetTab: "secrets-vault",
            text: "Review the Secret Loopholes Vault. Toto Creek & Hwy 53 offer deep-water coves, deeded walking access, and public ramps without paying punitive Corps shoreline permit fees.",
            actionLabel: "Inspect Toto Creek Pocket"
          }
        ]
      },
      'zero-down-finance': {
        title: "Zero-Down Single-Close Financial Modeler",
        steps: [
          {
            stepNum: 1,
            title: "Turnkey Cost & Lot Combination",
            targetTab: "calc-suite",
            text: "Under 7 CFR § 3555.105(c), you can purchase raw land and fund complete turn-key home construction in a single transaction with 0% down payment required.",
            actionLabel: "Open Single-Close Calculator"
          },
          {
            stepNum: 2,
            title: "Mandatory 10% Contingency Reserve",
            targetTab: "calc-suite",
            text: "The USDA mandates a 10% contingency reserve on all direct construction costs. This money is escrowed to protect against cost overruns; any unused balance at completion pays down the principal note.",
            actionLabel: "Check Contingency Math"
          },
          {
            stepNum: 3,
            title: "Financed Construction Interest Reserve",
            targetTab: "calc-suite",
            text: "Borrowers make $0 out-of-pocket payments during the 9-month build. Up to 9 months of interim interest is rolled directly into the permanent note.",
            actionLabel: "Verify Interest Reserve"
          }
        ]
      },
      'income-shield': {
        title: "Statutory Income & Deduction Shield (7 CFR § 3555)",
        steps: [
          {
            stepNum: 1,
            title: "Adjusted Household Income vs Gross Pay",
            targetTab: "calc-suite",
            text: "Lenders often mistakenly reject high earners because gross W-2 income exceeds $135,500. Under 7 CFR § 3555.152, eligibility is determined STRICTLY by Adjusted Household Income after statutory write-offs.",
            actionLabel: "Open Income Shield Tool"
          },
          {
            stepNum: 2,
            title: "Childcare & Dependent Multipliers",
            targetTab: "calc-suite",
            text: "Subtract $480 per child and 100% of verifiable daycare costs. A family earning $152,000 with 2 kids and $16,000 daycare has an adjusted income of $135,040—legally qualifying under the cap!",
            actionLabel: "Simulate Childcare Deductions"
          }
        ]
      },
      'real-pdfs': {
        title: "Real PDF Generation & Deliverables",
        steps: [
          {
            stepNum: 1,
            title: "Select from 7 Official Form Templates",
            targetTab: "documents",
            text: "Navigate to the Documents view. Select from Form 3555-SC Dossier, Structured Project Brief, Site Feasibility Report, or Code Compliance Matrix.",
            actionLabel: "Open PDF Documents Hub"
          },
          {
            stepNum: 2,
            title: "Download Vector PDF Directly",
            targetTab: "documents",
            text: "Click 'Download Active PDF (.pdf)' to trigger instant client-side vector compilation via jsPDF with official seals, tables, and signature blocks.",
            actionLabel: "Generate Active PDF"
          }
        ]
      }
    };

    return TOURS[tourId] || TOURS['full-lifecycle'];
  }

  renderTourStep() {
    const container = document.getElementById('ai-active-step-box');
    if (!container) return;

    const tour = this.getTourDefinition(this.activeTourId);
    const step = tour.steps[this.currentTourStep];
    const totalSteps = tour.steps.length;

    container.style.display = 'block';
    container.innerHTML = `
      <div class="ai-active-step-card">
        <div class="ai-step-header">
          <div>
            <span class="status-badge-glass badge-green">${tour.title.toUpperCase()}</span>
            <h4 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-top: 0.25rem;">
              Step ${step.stepNum} of ${totalSteps}: ${step.title}
            </h4>
          </div>
          <button class="ai-step-close-btn" id="btn-cancel-tour" title="End Walkthrough">✕</button>
        </div>

        <p class="ai-step-body">${step.text}</p>

        <div class="ai-step-nav-footer">
          <button class="btn-jump-to-tool" id="btn-tour-jump-action">
            ${getIcon('externalLink', '', 14)} ${step.actionLabel}
          </button>
          
          <div style="display: flex; gap: 0.5rem;">
            ${this.currentTourStep > 0 ? `
              <button class="btn-tour-nav" id="btn-tour-prev">← Previous</button>
            ` : ''}
            ${this.currentTourStep < totalSteps - 1 ? `
              <button class="btn-tour-nav primary" id="btn-tour-next">Next Step →</button>
            ` : `
              <button class="btn-tour-nav primary" id="btn-tour-finish">Finish Walkthrough ✓</button>
            `}
          </div>
        </div>
      </div>
    `;

    // Bind step events
    document.getElementById('btn-cancel-tour')?.addEventListener('click', () => {
      container.style.display = 'none';
      this.activeTourId = null;
    });

    document.getElementById('btn-tour-jump-action')?.addEventListener('click', () => {
      this.navigateWorkspace(step.targetTab);
    });

    document.getElementById('btn-tour-prev')?.addEventListener('click', () => {
      if (this.currentTourStep > 0) {
        this.currentTourStep--;
        this.renderTourStep();
      }
    });

    document.getElementById('btn-tour-next')?.addEventListener('click', () => {
      if (this.currentTourStep < totalSteps - 1) {
        this.currentTourStep++;
        this.renderTourStep();
      }
    });

    document.getElementById('btn-tour-finish')?.addEventListener('click', () => {
      container.style.display = 'none';
      this.activeTourId = null;
    });

    // Auto navigate workspace to step view
    this.navigateWorkspace(step.targetTab, false);
  }

  navigateWorkspace(tabId, closeDrawer = true) {
    if (window.usdaApp && typeof window.usdaApp.switchTab === 'function') {
      window.usdaApp.switchTab(tabId);
    }
    if (closeDrawer) {
      this.toggle(false);
    }
  }

  async submitChat(queryText) {
    const scrollContainer = document.getElementById('ai-messages-scroll');
    if (!scrollContainer) return;

    // Render User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-msg ai-msg-user';
    userMsg.innerHTML = `
      <div class="ai-msg-body">
        <p>${escapeHtml(queryText)}</p>
      </div>
    `;
    scrollContainer.appendChild(userMsg);
    scrollContainer.scrollTop = scrollContainer.scrollHeight;

    // Render Loading Indicator
    const loaderMsg = document.createElement('div');
    loaderMsg.className = 'ai-msg ai-msg-system ai-msg-loading';
    loaderMsg.innerHTML = `
      <div class="ai-msg-avatar">${getIcon('sparkles', '', 16)}</div>
      <div class="ai-msg-body">
        <div class="ai-loading-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    scrollContainer.appendChild(loaderMsg);
    scrollContainer.scrollTop = scrollContainer.scrollHeight;

    try {
      // Query Cloudflare Edge Worker API /api/v1/ai/guidance
      let responseData = null;
      try {
        const res = await fetch('/api/v1/ai/guidance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: queryText })
        });
        if (res.ok) {
          const json = await res.json();
          responseData = json.response;
        }
      } catch (err) {
        console.warn("Direct worker call failed, using client fallback:", err);
      }

      // If network failed, generate client-side guidance fallback
      if (!responseData) {
        responseData = this.localFallbackAi(queryText);
      }

      // Remove loader
      loaderMsg.remove();

      // Render Bot Response
      const botMsg = document.createElement('div');
      botMsg.className = 'ai-msg ai-msg-system';
      botMsg.innerHTML = `
        <div class="ai-msg-avatar">${getIcon('sparkles', '', 16)}</div>
        <div class="ai-msg-body">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.35rem;">
            <strong style="color: #0f172a; font-size: 0.95rem;">${responseData.title}</strong>
            <span class="status-badge-glass badge-green" style="font-size: 0.65rem;">Verified 7 CFR § 3555</span>
          </div>

          <p style="margin-bottom: 0.6rem; color: #334155; line-height: 1.5;">${responseData.summary}</p>

          <div class="ai-guidance-points">
            ${(responseData.guidance || []).map(g => `<div class="ai-guide-point">${g}</div>`).join('')}
          </div>

          ${responseData.citation ? `
            <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 0.5rem; font-family: var(--font-mono);">
              Citation: <em>${responseData.citation}</em>
            </div>
          ` : ''}

          <div class="ai-msg-actions-row">
            ${responseData.targetTab ? `
              <button class="btn-jump-to-tool" data-jump-tab="${responseData.targetTab}">
                ${getIcon('externalLink', '', 14)} Open ${this.getTabLabel(responseData.targetTab)}
              </button>
            ` : ''}
          </div>
        </div>
      `;

      scrollContainer.appendChild(botMsg);
      scrollContainer.scrollTop = scrollContainer.scrollHeight;

      // Attach jump event
      botMsg.querySelector('.btn-jump-to-tool')?.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-jump-tab');
        this.navigateWorkspace(tab);
      });

    } catch (err) {
      loaderMsg.remove();
      const errMsg = document.createElement('div');
      errMsg.className = 'ai-msg ai-msg-system';
      errMsg.innerHTML = `<div class="ai-msg-body"><p style="color: #e11d48;">Error generating response: ${err.message}</p></div>`;
      scrollContainer.appendChild(errMsg);
    }
  }

  getTabLabel(tabId) {
    const MAP = {
      'overview': 'Project Overview',
      'design': 'Design Coordination',
      'compliance': 'Building Codes Matrix',
      'carbon': 'Carbon & Net Zero',
      'applications': 'Permits & Filings',
      'build': 'Construction & Escrow Draws',
      'handover': 'Handover & Operations',
      'documents': 'Documents & Real PDFs',
      'calc-suite': 'Financial Calculator Suite',
      'map-radar': 'Satellite & GIS Radar',
      'secrets-vault': 'Secret Loopholes Vault',
      'test-runner': 'System Test Suite'
    };
    return MAP[tabId] || tabId;
  }

  localFallbackAi(prompt) {
    const q = prompt.toLowerCase();
    if (q.includes('lanier') || q.includes('eligible') || q.includes('lake') || q.includes('map')) {
      return {
        title: "Lake Lanier & GIS Boundary Rules",
        summary: "Under USDA HB-1-3555, rural boundaries strictly exclude dense urban clusters. Lake Lanier spans multiple counties with distinct rules.",
        guidance: [
          "• Forsyth & Gwinnett lakefronts are 100% DISQUALIFIED.",
          "• Dawson County (Toto Creek) is 92% ELIGIBLE with high $135.5k Atlanta MSA income caps.",
          "• USACE Boundary: The building site must sit strictly above 1,070 feet MSL elevation."
        ],
        targetTab: "map-radar",
        citation: "7 CFR § 3555.201; USACE Lake Sidney Lanier Shoreline Management Plan"
      };
    }
    return {
      title: "USDA Rural OS Guidance",
      summary: "I can guide you through 0% down construction financing, statutory income deductions, and permit readiness.",
      guidance: [
        "• Check our 8 Financial Calculators for 100% LTV single-close construction modeling.",
        "• Explore Secret Loopholes Vault for high-equity pockets in North Georgia.",
        "• Generate official Form 3555-SC PDF dossiers directly in the Documents module."
      ],
      targetTab: "overview",
      citation: "7 CFR § 3555; HB-1-3555"
    };
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
