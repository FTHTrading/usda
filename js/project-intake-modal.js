// USDA Rural OS & 3FS Platform — Interactive Project Intake & Live Info Editor
// Allows users to enter/edit borrower, parcel, construction costs, and loan terms,
// updating the single project record across all views and PDFs in real time.

import { PROJECT_RECORD } from '../data/project-record.js';
import { ICONS, getIcon } from './icons.js';
import { GEORGIA_REGIONS } from '../data/georgia-counties.js';

export class USDAProjectIntakeModal {
  constructor() {
    this.record = PROJECT_RECORD;
    this.isOpen = false;
    this.activeTab = 'applicant';
    this.init();
  }

  init() {
    this.createDom();
    this.attachEvents();
  }

  createDom() {
    const existing = document.getElementById('project-intake-modal-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'project-intake-modal-root';
    root.innerHTML = `
      <div class="intake-modal-backdrop" id="intake-backdrop"></div>
      <div class="intake-modal-window" id="intake-window" role="dialog" aria-modal="true" aria-label="Edit Project Information">
        <!-- Modal Header -->
        <div class="intake-modal-header">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div class="intake-icon-crest">
              <img src="assets/brand/3fs-logo.svg" alt="3FS" style="width: 24px; height: 24px; border-radius: 6px;" />
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0;">Edit Project & Applicant Parameters</h3>
                <span class="status-badge-glass badge-green">LIVE INTAKE</span>
              </div>
              <p style="font-size: 0.75rem; color: var(--text-dim); margin: 0.15rem 0 0;">Update details below to customize pro-formas, calculations, and all official downloadable PDFs.</p>
            </div>
          </div>
          <button class="ai-btn-close" id="btn-close-intake-modal" aria-label="Close Intake Window">✕</button>
        </div>

        <!-- Intake Tabs Bar -->
        <div class="intake-tabs-bar">
          <button class="intake-tab-btn active" data-intake-tab="applicant">
            ${getIcon('overview', '', 14)} 1. Applicant & Household
          </button>
          <button class="intake-tab-btn" data-intake-tab="property">
            ${getIcon('radar', '', 14)} 2. Parcel & Location
          </button>
          <button class="intake-tab-btn" data-intake-tab="construction">
            ${getIcon('construction', '', 14)} 3. Construction & Scope
          </button>
          <button class="intake-tab-btn" data-intake-tab="financing">
            ${getIcon('calculator', '', 14)} 4. Financing & Terms
          </button>
        </div>

        <!-- Form Body -->
        <form class="intake-modal-body" id="project-intake-form">
          <!-- Tab 1: Applicant & Household -->
          <div class="intake-pane active" id="pane-applicant">
            <div class="intake-grid-2">
              <div class="form-group">
                <label>Primary Applicant Name</label>
                <input type="text" id="inp-applicant-name" value="${this.record.parties.owner.name}" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Borrower Entity / Trust Name</label>
                <input type="text" id="inp-entity-name" value="${this.record.parties.owner.entity}" class="form-input" />
              </div>
              <div class="form-group">
                <label>Contact Email</label>
                <input type="email" id="inp-contact-email" value="${this.record.parties.owner.contact}" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Contact Phone</label>
                <input type="text" id="inp-contact-phone" value="${this.record.parties.owner.phone}" class="form-input" />
              </div>
            </div>

            <div class="intake-divider">7 CFR § 3555 Statutory Income Deductions</div>

            <div class="intake-grid-3">
              <div class="form-group">
                <label>Gross Household Annual Income ($)</label>
                <input type="number" id="inp-gross-income" value="142000" step="1000" class="form-input" required />
                <small style="color: var(--text-dim); font-size: 0.7rem;">W-2 / 1099 annual earnings</small>
              </div>
              <div class="form-group">
                <label>Minor Dependents (Kids under 18)</label>
                <input type="number" id="inp-dependents" value="2" min="0" max="8" class="form-input" />
                <small style="color: var(--emerald); font-size: 0.7rem;">$480 statutory deduction each</small>
              </div>
              <div class="form-group">
                <label>Verifiable Annual Childcare ($)</label>
                <input type="number" id="inp-childcare" value="12000" step="500" class="form-input" />
                <small style="color: var(--emerald); font-size: 0.7rem;">100% dollar-for-dollar write-off</small>
              </div>
            </div>
          </div>

          <!-- Tab 2: Parcel & Location -->
          <div class="intake-pane" id="pane-property">
            <div class="intake-grid-2">
              <div class="form-group" style="grid-column: span 2;">
                <label>Project Name / Heading</label>
                <input type="text" id="inp-project-name" value="${this.record.name}" class="form-input" required />
              </div>
              <div class="form-group" style="grid-column: span 2;">
                <label>Property Address / Location</label>
                <input type="text" id="inp-address" value="${this.record.address}" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Georgia County Jurisdiction</label>
                <select id="inp-county" class="form-select">
                  ${GEORGIA_REGIONS.map(g => `<option value="${g.id}" ${g.id === 'dawson' ? 'selected' : ''}>${g.name} (${g.status} · Cap: $${g.incomeCap1to4.toLocaleString()})</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Assessor Parcel ID (Tax ID)</label>
                <input type="text" id="inp-parcel-id" value="${this.record.parcelId}" class="form-input" />
              </div>
              <div class="form-group">
                <label>Raw Parcel Purchase Price ($)</label>
                <input type="number" id="inp-lot-cost" value="${this.record.costsAndFunding.lotAcquisitionCost}" step="1000" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Parcel Size (Acres)</label>
                <input type="number" id="inp-lot-acreage" value="${this.record.lotAcreage}" step="0.1" class="form-input" />
              </div>
            </div>
          </div>

          <!-- Tab 3: Construction & Scope -->
          <div class="intake-pane" id="pane-construction">
            <div class="intake-grid-3">
              <div class="form-group">
                <label>Heated Living Space (Sq.Ft)</label>
                <input type="number" id="inp-sqft" value="1650" step="50" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Builder Turnkey Cost ($/Sq.Ft)</label>
                <input type="number" id="inp-rate-sqft" value="185" step="5" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Site Prep, Well & Septic ($)</label>
                <input type="number" id="inp-site-prep" value="${this.record.costsAndFunding.siteWorkAndInfrastructure}" step="1000" class="form-input" required />
              </div>
            </div>

            <div class="intake-divider">Licensed Professional Team</div>

            <div class="intake-grid-2">
              <div class="form-group">
                <label>Architect / Designer of Record</label>
                <input type="text" id="inp-architect-name" value="${this.record.parties.authorizedAgent.name}" class="form-input" />
              </div>
              <div class="form-group">
                <label>Architect License / Firm</label>
                <input type="text" id="inp-architect-license" value="${this.record.parties.authorizedAgent.license}" class="form-input" />
              </div>
              <div class="form-group">
                <label>General Contractor (Builder)</label>
                <input type="text" id="inp-builder-name" value="${this.record.parties.contractor.company}" class="form-input" />
              </div>
              <div class="form-group">
                <label>Builder State License Number</label>
                <input type="text" id="inp-builder-license" value="${this.record.parties.contractor.licenseNumber}" class="form-input" />
              </div>
            </div>
          </div>

          <!-- Tab 4: Financing & Terms -->
          <div class="intake-pane" id="pane-financing">
            <div class="intake-grid-3">
              <div class="form-group">
                <label>Perm Loan Interest Rate (%)</label>
                <input type="number" id="inp-interest-rate" value="6.25" step="0.125" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Construction Phase Duration (Months)</label>
                <input type="number" id="inp-build-months" value="9" min="3" max="18" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Soft Costs & Permitting Fees ($)</label>
                <input type="number" id="inp-soft-costs" value="${this.record.costsAndFunding.softCostsAndPermits}" step="500" class="form-input" />
              </div>
            </div>

            <div class="intake-summary-box" style="margin-top: 1rem; padding: 1rem; background: #f8fafc; border: 1px solid var(--glass-border); border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <strong style="color: #0f172a; font-size: 0.88rem;">100% LTV Single-Close Underwriting Guarantee:</strong>
                <span class="status-badge-glass badge-green">$0 Cash Down Payment</span>
              </div>
              <p style="font-size: 0.75rem; color: var(--text-dim); margin: 0; line-height: 1.45;">
                Mandatory 10% contingency reserve and 9 months of interim construction interest are automatically financed into the permanent note, avoiding out-of-pocket borrower payments during framing and drywall.
              </p>
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="intake-modal-footer">
            <button type="button" class="btn-secondary" id="btn-cancel-intake">Cancel</button>
            <button type="submit" class="btn-primary" id="btn-save-intake" style="background: var(--emerald); color: #fff; padding: 0.6rem 1.4rem;">
              ✓ Save & Recalculate Everything
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(root);
  }

  attachEvents() {
    const backdrop = document.getElementById('intake-backdrop');
    const closeBtn = document.getElementById('btn-close-intake-modal');
    const cancelBtn = document.getElementById('btn-cancel-intake');

    const closeHandler = () => this.toggle(false);
    backdrop?.addEventListener('click', closeHandler);
    closeBtn?.addEventListener('click', closeHandler);
    cancelBtn?.addEventListener('click', closeHandler);

    // Tab buttons
    document.querySelectorAll('.intake-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-intake-tab');
        this.switchTab(tab);
      });
    });

    // Form submit
    const form = document.getElementById('project-intake-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveChanges();
    });
  }

  toggle(open = null) {
    this.isOpen = open !== null ? open : !this.isOpen;
    const windowEl = document.getElementById('intake-window');
    const backdrop = document.getElementById('intake-backdrop');
    if (windowEl && backdrop) {
      windowEl.classList.toggle('open', this.isOpen);
      backdrop.classList.toggle('open', this.isOpen);
    }
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll('.intake-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-intake-tab') === tabId);
    });
    document.querySelectorAll('.intake-pane').forEach(p => {
      p.classList.toggle('active', p.id === `pane-${tabId}`);
    });
  }

  saveChanges() {
    // Read values
    const applicantName = document.getElementById('inp-applicant-name')?.value || 'Kevan';
    const entityName = document.getElementById('inp-entity-name')?.value || 'UnyKorn Mountain Trust LLC';
    const contactEmail = document.getElementById('inp-contact-email')?.value || 'kevanbtc@gmail.com';
    const contactPhone = document.getElementById('inp-contact-phone')?.value || '(404) 555-0192';

    const grossIncome = Number(document.getElementById('inp-gross-income')?.value) || 142000;
    const dependents = Number(document.getElementById('inp-dependents')?.value) || 2;
    const childcare = Number(document.getElementById('inp-childcare')?.value) || 12000;

    const projectName = document.getElementById('inp-project-name')?.value || 'Chestatee River Craftsman Cabin';
    const address = document.getElementById('inp-address')?.value || '428 Chestatee Overlook Trail, Dawsonville, GA 30534';
    const countyId = document.getElementById('inp-county')?.value || 'dawson';
    const parcelId = document.getElementById('inp-parcel-id')?.value || 'DAW-074-019-B';
    const lotCost = Number(document.getElementById('inp-lot-cost')?.value) || 42000;
    const lotAcreage = Number(document.getElementById('inp-lot-acreage')?.value) || 2.05;

    const sqft = Number(document.getElementById('inp-sqft')?.value) || 1650;
    const rateSqFt = Number(document.getElementById('inp-rate-sqft')?.value) || 185;
    const sitePrep = Number(document.getElementById('inp-site-prep')?.value) || 33500;
    const softCosts = Number(document.getElementById('inp-soft-costs')?.value) || 7000;

    const interestRate = (Number(document.getElementById('inp-interest-rate')?.value) || 6.25) / 100;
    const buildMonths = Number(document.getElementById('inp-build-months')?.value) || 9;

    const archName = document.getElementById('inp-architect-name')?.value || 'Sarah Jenkins, AIA';
    const archLicense = document.getElementById('inp-architect-license')?.value || 'GA RA-019482';
    const builderName = document.getElementById('inp-builder-name')?.value || 'Blue Ridge Craftsman Builders LLC';
    const builderLicense = document.getElementById('inp-builder-license')?.value || 'GA-GC-QA004921';

    // Financial calculations
    const directConstruction = sqft * rateSqFt;
    const directTotal = directConstruction + sitePrep + softCosts;
    const contingencyReserve = directTotal * 0.10;
    const avgDrawBalance = (directTotal + contingencyReserve) * 0.55;
    const monthlyRate = interestRate / 12;
    const financedInterestReserve = avgDrawBalance * monthlyRate * buildMonths;

    const baseNote = lotCost + directTotal + contingencyReserve + financedInterestReserve;
    const upfrontGuaranteeFee = baseNote * 0.01;
    const totalFinancedNote = baseNote + upfrontGuaranteeFee;

    // Mutate PROJECT_RECORD
    this.record.name = projectName;
    this.record.address = address;
    this.record.parcelId = parcelId;
    this.record.lotAcreage = lotAcreage;

    const countyObj = GEORGIA_REGIONS.find(g => g.id === countyId) || GEORGIA_REGIONS[0];
    this.record.jurisdiction.county = countyObj.name;
    this.record.jurisdiction.city = countyObj.seats;

    this.record.parties.owner.name = applicantName;
    this.record.parties.owner.entity = entityName;
    this.record.parties.owner.contact = contactEmail;
    this.record.parties.owner.phone = contactPhone;
    this.record.parties.applicant.name = applicantName;
    this.record.parties.applicant.organization = entityName;

    this.record.parties.authorizedAgent.name = archName;
    this.record.parties.authorizedAgent.license = archLicense;
    this.record.parties.contractor.company = builderName;
    this.record.parties.contractor.licenseNumber = builderLicense;

    this.record.costsAndFunding.lotAcquisitionCost = lotCost;
    this.record.costsAndFunding.directConstruction = directConstruction;
    this.record.costsAndFunding.siteWorkAndInfrastructure = sitePrep;
    this.record.costsAndFunding.softCostsAndPermits = softCosts;
    this.record.costsAndFunding.contingencyReserve = contingencyReserve;
    this.record.costsAndFunding.financedInterestReserve = Math.round(financedInterestReserve);
    this.record.costsAndFunding.upfrontGuaranteeFee = Math.round(upfrontGuaranteeFee);
    this.record.costsAndFunding.totalFinancedNote = Math.round(totalFinancedNote);

    // Close modal
    this.toggle(false);

    // Show toast
    this.showToast(`✓ Project Record & Underwriting Note ($${Math.round(totalFinancedNote).toLocaleString()}) Updated!`);

    // Dispatch global event so all views re-render
    window.dispatchEvent(new CustomEvent('usda-project-updated', { detail: this.record }));

    // Re-render overview if active
    if (window.usdaApp && window.usdaApp.modules) {
      if (window.usdaApp.modules.overview?.render) window.usdaApp.modules.overview.render();
      if (window.usdaApp.modules.pdfEngine?.render) window.usdaApp.modules.pdfEngine.render();
      if (window.usdaApp.modules.calcSuite?.render) window.usdaApp.modules.calcSuite.render();
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
    }, 3500);
  }
}
