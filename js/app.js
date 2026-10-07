// Master Application Controller: Connected Building-Project Operating Platform
import { USDAProjectOverviewView } from './project-overview-view.js';
import { USDADesignCoordinationView } from './design-coordination-view.js';
import { USDAComplianceMatrixView } from './compliance-matrix-view.js';
import { USDACarbonEnergyView } from './carbon-energy-view.js';
import { USDAApplicationsPermitsView } from './applications-permits-view.js';
import { USDAConstructionTrackingView } from './construction-tracking-view.js';
import { USDAHandoverOperationsView } from './handover-operations-view.js';
import { USDAHomeView } from './home-view.js';
import { USDAAIWorkspace } from './ai-workspace.js';
import { USDAInteractiveMap } from './interactive-map.js';
import { USDAConstructionCalc } from './construction-calc.js';
import { USDASecretTricks } from './secret-tricks.js';
import { USDAPDFEngine } from './pdf-engine.js';
import { USDAActivityView } from './activity-view.js';
import { USDASettingsView } from './settings-view.js';
import { USDACalculatorSuite } from './calculator-suite.js';
import { USDATestRunnerView } from './test-runner-view.js';
import { USDAScreener } from './screener.js';
import { USDAIncomeEngine } from './income-engine.js';
import { USDAFeasibilityMatrix } from './feasibility.js';
import { USDAHotspots } from './hotspots.js';

class USDAApp {
  constructor() {
    this.activeTab = 'overview';
    this.modules = {};
    this.init();
  }

  init() {
    // 1. Single Project Record & Connected Lifecycle Modules
    this.modules.overview = new USDAProjectOverviewView('project-overview-container');
    this.modules.home = new USDAHomeView('home-container');
    this.modules.design = new USDADesignCoordinationView('design-coordination-container');
    this.modules.compliance = new USDAComplianceMatrixView('compliance-matrix-container');
    this.modules.carbon = new USDACarbonEnergyView('carbon-energy-container');
    this.modules.applications = new USDAApplicationsPermitsView('applications-permits-container');
    this.modules.build = new USDAConstructionTrackingView('construction-tracking-container');
    this.modules.handover = new USDAHandoverOperationsView('handover-operations-container');

    // 2. Autonomous AI & Document Engine
    this.modules.aiWorkspace = new USDAAIWorkspace('ai-workspace-container');
    this.modules.pdfEngine = new USDAPDFEngine('documents-container');

    // 3. Technical Verification, Calculators & Spatial Engines
    this.modules.calcSuite = new USDACalculatorSuite('calculator-suite-container');
    this.modules.mapRadar = new USDAInteractiveMap('interactive-map-container');
    this.modules.calc = new USDAConstructionCalc('calc-container');
    this.modules.secrets = new USDASecretTricks('secrets-container');
    this.modules.testRunner = new USDATestRunnerView('test-runner-container');
    this.modules.activity = new USDAActivityView('activity-container');
    this.modules.settings = new USDASettingsView('settings-container');

    // 4. Supporting Legacy Matrix
    this.modules.screener = new USDAScreener('screener-container');
    this.modules.income = new USDAIncomeEngine('income-container');
    this.modules.feasibility = new USDAFeasibilityMatrix('feasibility-container');
    this.modules.hotspots = new USDAHotspots('hotspots-container');

    this.bindNavigation();
    this.bindGlobalSearch();
    console.log("USDA 3FS Building-Project Operating Platform initialized.");
  }

  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-sidebar-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });
  }

  bindGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        if (q.includes('design') || q.includes('drawing') || q.includes('rev') || q.includes('bim')) {
          this.switchTab('design');
        } else if (q.includes('code') || q.includes('compliance') || q.includes('irc') || q.includes('ibc') || q.includes('iecc')) {
          this.switchTab('compliance');
        } else if (q.includes('carbon') || q.includes('net zero') || q.includes('eui') || q.includes('solar') || q.includes('epd')) {
          this.switchTab('carbon');
        } else if (q.includes('permit') || q.includes('app') || q.includes('filing') || q.includes('septic') || q.includes('fee')) {
          this.switchTab('applications');
        } else if (q.includes('build') || q.includes('draw') || q.includes('retainage') || q.includes('rfi') || q.includes('milestone')) {
          this.switchTab('build');
        } else if (q.includes('handover') || q.includes('warranty') || q.includes('manual') || q.includes('meter')) {
          this.switchTab('handover');
        } else if (q.includes('map') || q.includes('satellite') || q.includes('lake') || q.includes('lanier')) {
          this.switchTab('map-radar');
        } else if (q.includes('ai') || q.includes('workflow') || q.includes('copilot') || q.includes('goal')) {
          this.switchTab('ai-workspace');
        } else if (q.includes('pdf') || q.includes('doc') || q.includes('download') || q.includes('dossier') || q.includes('brief')) {
          this.switchTab('documents');
        } else if (q.includes('test') || q.includes('suite') || q.includes('assert') || q.includes('audit')) {
          this.switchTab('test-runner');
        } else if (q.includes('calc') || q.includes('cuva') || q.includes('subsidy') || q.includes('dti') || q.includes('appraisal')) {
          this.switchTab('calc-suite');
        } else if (q.includes('secret') || q.includes('loophole') || q.includes('arbitrage')) {
          this.switchTab('secrets-vault');
        } else if (q.includes('overview') || q.includes('home') || q.includes('project') || q.includes('record')) {
          this.switchTab('overview');
        }
      });
    }

    // Keyboard shortcut Ctrl+K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search-input')?.focus();
      }
    });
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    
    // Update navigation sidebar active state
    document.querySelectorAll('.nav-sidebar-item').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });

    // Update main view panes
    document.querySelectorAll('.workspace-pane').forEach(p => {
      p.classList.toggle('active', p.id === `view-${tabId}`);
    });

    // If switching to map-radar, trigger Leaflet size invalidation
    if (tabId === 'map-radar' && this.modules.mapRadar && this.modules.mapRadar.map) {
      setTimeout(() => {
        this.modules.mapRadar.map.invalidateSize();
      }, 150);
    }

    // If switching to test-runner, trigger test run if never executed
    if (tabId === 'test-runner' && this.modules.testRunner && (!this.modules.testRunner.results || this.modules.testRunner.results.length === 0)) {
      setTimeout(() => {
        this.modules.testRunner.runBrowserTests();
      }, 100);
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Boot on DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  window.usdaApp = new USDAApp();
});
