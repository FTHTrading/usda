// Master Single Project Record Architecture
// Canonical Source of Truth for Project Scope, Party & Authority, Codes, Carbon, Permits, and Build Tracking.

export const PROJECT_RECORD = {
  id: "PRJ-2026-GA-0428",
  name: "Chestatee River Craftsman Cabin & Net-Zero Homestead",
  projectType: "NEW_CONSTRUCTION", // Toggleable: "NEW_CONSTRUCTION" | "MAJOR_RENOVATION"
  buildingUse: "Single-Family Residential (R-3) Craftsman Cabin",
  scopeDescription: "New construction of high-efficiency 1,650 sq.ft 3-bed / 2-bath rural craftsman residence on 2.05-acre wooded parcel, with detached equipment shed, 10.2 kW solar array, drilled well, and engineered septic system.",
  address: "428 Chestatee Overlook Trail, Dawsonville, GA 30534",
  parcelId: "DAW-074-019-B",
  lotAcreage: 2.05,
  jurisdiction: {
    city: "Dawsonville",
    county: "Dawson County",
    state: "Georgia",
    zip: "30534",
    fipsCode: "13085",
    msa: "Atlanta-Sandy Springs-Alpharetta MSA",
    adoptedBuildingCodes: [
      "2018 International Residential Code (IRC) with Georgia State Amendments",
      "2018 International Building Code (IBC) with Georgia State Amendments",
      "2015 International Energy Conservation Code (IECC) with Georgia State Amendments",
      "2020 National Electrical Code (NEC / NFPA 70)",
      "2018 International Plumbing Code (IPC) with Georgia State Amendments",
      "2018 International Mechanical Code (IMC) with Georgia State Amendments"
    ]
  },
  
  // Current Operational Progress
  currentStage: "Stage 3: Building Permitting & Carbon Review",
  stageNumber: 3,
  totalStages: 6,
  nextAction: {
    title: "Submit Land Disturbance Permit & Finalize IECC R402 Envelope Verification",
    owner: "Sarah Jenkins, AIA (Agent) & Marcus Vance, PE",
    deadline: "2026-10-14",
    urgency: "HIGH",
    blockersCount: 2
  },

  // Party & Authority Record ("Who is applying & Who owns each task")
  parties: {
    owner: {
      role: "Property Owner",
      name: "Kevan",
      entity: "UnyKorn Mountain Trust LLC",
      contact: "kevanbtc@gmail.com",
      phone: "(404) 555-0192",
      ownershipEvidence: "Warranty Deed recorded Dawson County Superior Court, Deed Bk 1482, Pg 310",
      authorityStatus: "VERIFIED_OWNER",
      authorizationSigned: true,
      authDate: "2026-09-12"
    },
    applicant: {
      role: "Primary Applicant",
      name: "Kevan",
      relationship: "Managing Trustee / Beneficial Owner",
      isOwner: true,
      organization: "UnyKorn Mountain Trust LLC",
      authorityScope: "Full Principal Authority to execute contracts, submit permit filings, and encumber title",
      credentialsDoc: "Operating Agreement & Certificate of Incumbency on file"
    },
    authorizedAgent: {
      role: "Authorized Agent for Permitting",
      name: "Sarah Jenkins, AIA",
      firm: "Blue Ridge Architecture Group LLC",
      contact: "sjenkins@blueridgearch.com",
      license: "GA Registered Architect #RA-019482",
      authorityLimits: "Limited Power of Attorney for zoning hearings, building code reviews, and permit filings. No authority for financial commitments over $5,000 without Owner consent.",
      authorizationForm: "Dawson County Agent Authorization Form signed 2026-09-18"
    },
    professionals: [
      {
        discipline: "Architectural Design",
        role: "Architect of Record",
        name: "Sarah Jenkins, AIA",
        firm: "Blue Ridge Architecture Group LLC",
        license: "GA RA-019482",
        sealRequired: true,
        sealStatus: "READY_FOR_STAMP",
        reviewAssigned: "Architectural Drawings A-101 to A-402",
        status: "APPROVED"
      },
      {
        discipline: "Structural Engineering",
        role: "Structural Engineer of Record (SEOR)",
        name: "Marcus Vance, PE",
        firm: "Vance Structural Consultants PC",
        license: "GA PE-034819",
        sealRequired: true,
        sealStatus: "PENDING_GEOTECH_LETTER",
        reviewAssigned: "Foundation Footers, Shear Walls & Timber Trusses S-101 to S-301",
        status: "MISSING_EVIDENCE"
      },
      {
        discipline: "Energy & Mechanical Engineering",
        role: "Certified Energy Rater (HERS / BPI)",
        name: "Elena Rostova, CEM",
        firm: "Highland Energy Modeling LLC",
        license: "RESNET HERS Rater #8849201",
        sealRequired: false,
        sealStatus: "CERTIFIED",
        reviewAssigned: "ACCA Manual J, S, D & Whole-Building Energy Simulation",
        status: "APPROVED"
      }
    ],
    contractor: {
      role: "General Contractor (Turnkey Builder)",
      company: "Blue Ridge Craftsman Builders LLC",
      qualifyingAgent: "David Miller, CGC",
      licenseNumber: "GA-GC-QA004921 (Valid through 2028)",
      insurance: {
        generalLiability: "Acuity Insurance Policy #GL-884192 ($2,000,000 aggregate)",
        workersComp: "Travelers Policy #WC-491028 ($1,000,000)",
        status: "ACTIVE_VERIFIED"
      },
      scope: "Turnkey Site Development, Utilities Hookups, Foundation, Framing, Finishes, and Certificate of Occupancy",
      contractAmount: 345750,
      contractType: "AIA A101-2017 Fixed-Price Lump Sum"
    },
    authorities: [
      {
        name: "Dawson County Planning & Development",
        role: "Permitting Authority (AHJ)",
        contactOfficer: "Chief Building Official Thomas Ray",
        email: "buildinginspections@dawsoncountyga.gov",
        permitNumber: "BLD-2026-0842",
        status: "IN_PLAN_REVIEW",
        planReviewDaysLeft: 6,
        officialCommentsCount: 2
      },
      {
        name: "USDA Rural Development - Georgia Office",
        role: "Guaranteed Lender / Direct Agency",
        contactOfficer: "Senior Loan Specialist Angela Brooks",
        applicationNumber: "USDA-502-GA-0428-A1",
        status: "CONDITIONAL_COMMITMENT_IN_REVIEW",
        notes: "Approved adjusted household income ($129,040). 100% LTV financed note ($440,486) undergoing final review."
      },
      {
        name: "U.S. Army Corps of Engineers (USACE)",
        role: "Federal Waterway Buffer Authority",
        boundary: "Lake Sidney Lanier 1,070-ft Flowage Easement Line",
        status: "FULLY_CLEAR",
        clearanceNotes: "Parcel building envelope sits at 1,114 ft elevation MSL (44 ft vertical clearance above USACE line, 820 yards horizontal distance to shoreline). No USACE flowage license needed."
      }
    ]
  },

  // Site Feasibility & Property Constraints
  siteFeasibility: {
    zoningClassification: "R-SR (Residential Sub-Rural)",
    minimumLotSize: "1.50 Acres (Subject parcel: 2.05 Acres — Compliant)",
    setbacks: {
      frontRequired: 50,
      frontProposed: 75,
      sideRequired: 25,
      sideProposed: 40,
      rearRequired: 35,
      rearProposed: 60,
      status: "COMPLIANT"
    },
    waterSource: {
      type: "Private Drilled Well",
      estimatedDepth: 200,
      ratePerFt: 45,
      casingRequired: "6-inch steel casing to bedrock",
      permitStatus: "County Environmental Health Well Permit Approved"
    },
    sewerDisposal: {
      type: "On-Site Sewage Management System (Septic)",
      drainFieldDesign: "4-Bedroom Conventional Gravel-less Channelling (450 linear ft)",
      percRate: "18 minutes per inch (Suitable for standard absorption)",
      healthDeptPermit: "SEP-2026-0194 (Issued 2026-09-22)"
    },
    electricProvider: "Amicalola EMC (Underground 200A service line proposed, 320 ft run)",
    siteAccess: "Paved County Road with dedicated 20-ft gravel driveway encroachment",
    topography: "Gentle 6% slope toward south-southeast, optimal solar gain orientation",
    surveysOnFile: [
      { name: "Boundary & Topographic Survey (Stampled RLS)", date: "2026-08-14", status: "VERIFIED" },
      { name: "Level III Soil Morphology & Perc Report", date: "2026-09-05", status: "VERIFIED" },
      { name: "Geotechnical Rock Ledge Test Pit Letter", date: "Pending", status: "MISSING_EVIDENCE" }
    ],
    outstandingInvestigations: [
      "Obtain signed Geotechnical footing probe letter confirming soil bearing capacity ≥ 2,500 psf at northeast footing"
    ]
  },

  // Versioned Design Package & Revision Tracking
  designPackage: {
    currentVersion: "v2.4 (Construction Documents)",
    issuedDate: "2026-10-02",
    architectOfRecord: "Sarah Jenkins, AIA",
    modelBIMLevel: "LOD 350",
    drawingsList: [
      { sheet: "C-101", title: "Site Plan, Grading & Erosion Control (Silt Fence)", rev: "v2.3", status: "READY" },
      { sheet: "A-101", title: "Foundation Plan & Pier Details", rev: "v2.4", status: "READY" },
      { sheet: "A-102", title: "Main Level Architectural Floor Plan (1,650 Sq.Ft)", rev: "v2.4", status: "READY" },
      { sheet: "A-201", title: "Exterior Elevations & Material Callouts", rev: "v2.4", status: "READY" },
      { sheet: "A-301", title: "Building Cross-Sections & Continuous Thermal Barrier", rev: "v2.4", status: "READY" },
      { sheet: "S-101", title: "Foundation Reinforcement & Anchor Bolt Schedules", rev: "v2.2", status: "NEEDS_SEAL" },
      { sheet: "S-201", title: "Roof Framing, Rafter Ties & Timber Ridge Beam", rev: "v2.2", status: "NEEDS_SEAL" },
      { sheet: "M-101", title: "Mechanical HVAC Duct Layout & ERV Ventilation", rev: "v2.4", status: "READY" },
      { sheet: "E-101", title: "Electrical Power, Lighting & 10.2kW Solar Interconnection", rev: "v2.4", status: "READY" },
      { sheet: "P-101", title: "Plumbing Riser & Low-Flow Fixtures Schedule", rev: "v2.3", status: "READY" }
    ],
    activeRevisions: [
      {
        id: "REV-03",
        date: "2026-10-02",
        description: "Upgraded exterior continuous insulation from 2\" polyiso to continuous wood-fiberboard (Gutex Multitherm).",
        reason: "Embodied Carbon Reduction & Vapor Permeability optimization.",
        impacts: {
          costEstimate: "+$1,450 net material adjustment",
          carbonEmbodied: "-3,820 kg CO2e reduction",
          energyThermal: "Maintains Wall Assembly U-0.024 (R-20+5 equivalent)",
          buildingCodes: "Complies with GA IECC R402.1 & ASTM E84 flame spread",
          drawingsAffected: ["A-301", "A-201"]
        },
        status: "ACCEPTED_BY_TEAM"
      }
    ]
  },

  // Traceable Building Codes Compliance Matrix
  buildingCodesMatrix: {
    jurisdictionName: "Dawson County, GA",
    applicableCodes: [
      {
        code: "2018 IRC",
        amendment: "GA State Amendments Chapter 8-2-20",
        section: "R301.2",
        subject: "Climatic & Geographic Design Criteria",
        requirementText: "Ground Snow Load: 10 psf; Basic Wind Speed: 115 mph 3-sec gust; Seismic Category: B; Frost Line Depth: 12 inches.",
        evidenceRef: "Structural General Notes Sheet S-001 & Dawson County Code Sec 103",
        status: "ACCEPTED",
        assignedPro: "Marcus Vance, PE",
        reviewDate: "2026-09-24"
      },
      {
        code: "2018 IRC",
        amendment: "GA State Amendments",
        section: "R302.1",
        subject: "Exterior Wall Fire Separation Distance",
        requirementText: "Exterior walls with fire separation distance < 5 ft require 1-hr fire-resistance rating. Projections < 2 ft prohibited.",
        evidenceRef: "Site Plan C-101 shows closest property setback is 40.0 ft. Exceeds requirement by 35 ft.",
        status: "ACCEPTED",
        assignedPro: "Sarah Jenkins, AIA",
        reviewDate: "2026-09-25"
      },
      {
        code: "2018 IRC",
        amendment: "GA State Amendments",
        section: "R403.1",
        subject: "Minimum Foundation Footing Width & Depth",
        requirementText: "Continuous footings minimum 12 inches below undisturbed ground surface. Minimum soil bearing capacity 2,000 psf assumed unless site soil letter submitted.",
        evidenceRef: "Sheet S-101 detail 3. Geotechnical test pit verification required due to rock outcropping in area.",
        status: "MISSING_EVIDENCE",
        assignedPro: "Marcus Vance, PE",
        reviewDate: "2026-10-01",
        actionItem: "Marcus Vance to provide signed footing inspection letter prior to foundation pour."
      },
      {
        code: "2015 GA IECC",
        amendment: "Georgia State Energy Supplement (Table R402.1.2)",
        section: "R402.1",
        subject: "Building Thermal Envelope Insulation Minimums (Climate Zone 3A)",
        requirementText: "Ceiling R-38 (proposed R-49); Wood Frame Wall R-20 or R-13+5 ci (proposed R-20+5 wood fiber); Fenestration U-factor ≤ 0.35, SHGC ≤ 0.25 (proposed U-0.28, SHGC 0.22).",
        evidenceRef: "Specification 07210 and Highland Energy Manual J/REScheck certificate #GA-88410.",
        status: "ACCEPTED",
        assignedPro: "Elena Rostova, CEM",
        reviewDate: "2026-10-03"
      },
      {
        code: "2015 GA IECC",
        amendment: "Georgia State Energy Supplement",
        section: "R402.4",
        subject: "Air Leakage Testing & Whole-House Mechanical Ventilation",
        requirementText: "Building envelope tested with blower door to not exceed 3.0 ACH50. Whole-house mechanical ventilation required per IRC M1507.",
        evidenceRef: "Sheet M-101 calls for continuous Panasonic WhisperComfort ERV balanced balanced ventilation (60 CFM). Target envelope 1.2 ACH50.",
        status: "ACCEPTED",
        assignedPro: "Elena Rostova, CEM",
        reviewDate: "2026-10-03"
      },
      {
        code: "2020 NEC",
        amendment: "NFPA 70",
        section: "Article 690 / 705",
        subject: "Solar Photovoltaic Systems & Grid Interconnection",
        requirementText: "Rapid shutdown system complying with 690.12. Point of connection complying with 705.12 with dedicated 200A solar-ready panel and dual disconnect switches.",
        evidenceRef: "Sheet E-101 detail 4 shows Enphase IQ8 rapid-shutdown microinverters and exterior utility disconnect.",
        status: "ACCEPTED",
        assignedPro: "David Miller, GC / Blue Ridge Electric",
        reviewDate: "2026-10-04"
      },
      {
        code: "2018 IMC / IRC",
        amendment: "GA State Amendments",
        section: "M1401.3",
        subject: "HVAC Sizing Calculations (ACCA Manual J, S, D)",
        requirementText: "Heating and cooling equipment sized in accordance with ACCA Manual S based on building loads calculated in accordance with ACCA Manual J.",
        evidenceRef: "Highland Energy Manual J load calculation: Total Heat Loss 24,100 Btu/hr; Total Heat Gain 18,200 Btu/hr. Mitsubishi 2.5-Ton Hyper Heat selected.",
        status: "REVIEWED",
        assignedPro: "Elena Rostova, CEM",
        reviewDate: "2026-10-05"
      }
    ]
  },

  // Carbon & Net-Zero Assessment (Strict Boundary Definitions)
  carbonAndNetZero: {
    targetFramework: "WHOLE_LIFE_CARBON_NET_ZERO_OPERATIONAL", 
    // Targets must distinguish:
    // 1. "NET_ZERO_ENERGY_READY" (DOE ZERH: Efficiency + solar ready)
    // 2. "ZERO_OPERATIONAL_EMISSIONS" (ZEB: All-electric + on-site clean power offset)
    // 3. "WHOLE_LIFE_NET_ZERO_CARBON" (WorldGBC: Embodied A1-C4 + Operational)
    targetDefinitions: {
      selectedTarget: "Zero Operational Emissions + 40% Embodied Carbon Reduction",
      boundaryStandard: "WorldGBC & DOE National Definition for Zero Emissions Buildings (ZEB v1)",
      assessmentPeriodYears: 50,
      claimsStatus: "MODELED_TO_MEET_TARGET", // Strict: "TARGETING" | "MODELED_TO_MEET_TARGET" | "INDEPENDENTLY_VERIFIED"
      noFakeGreenBadgePolicy: "Solar panels alone DO NOT grant a net zero rating. Meets 3 core DOE pillars: (1) high energy efficiency, (2) zero on-site combustion emissions, and (3) clean generation ≥ 100% annual load."
    },
    operationalEnergy: {
      baselineCodeEUI: 48.2, // kBtu / sq.ft / year
      modeledDesignEUI: 18.4, // kBtu / sq.ft / year (61.8% reduction)
      annualEnergyDemandKwh: 8920,
      annualSolarGenerationKwh: 13850,
      cleanGenerationRatioPct: 155.3, // Produces 155% of annual power
      netAnnualOperatingEmissionsKgCo2e: -2120, // Net carbon negative operational
      allElectricHome: true,
      onSiteCombustion: false // Zero gas, zero propane, zero wood combustion as primary heat
    },
    embodiedCarbon: {
      baselineTypicalBuildTonsCo2e: 68.4,
      optimizedDesignTonsCo2e: 39.1,
      embodiedReductionPct: 42.8,
      embodiedCarbonPerSqM: 255.4, // kg CO2e / m2 (Target <300 achieved)
      keyMaterialStrategies: [
        "Low-Carbon Concrete: 30% slag cement replacement in footings/foundation (-5.2 tons CO2e)",
        "Certified Regional Sawn Timber (Southern Yellow Pine) for framing and trusses",
        "Cellulose and Gutex continuous wood-fiberboard thermal insulation instead of XPS/spray foam (-4.6 tons CO2e)",
        "Standing seam metal roof with 65% recycled steel content (50+ year life cycle)"
      ],
      epdLibrary: [
        { product: "Thomas Concrete Low-Carbon Mix (Mix #C-3000-SL)", epdId: "EPD-TC-2025-410", gwp: "215 kg CO2e / m3" },
        { product: "Gutex Multitherm Wood-Fiber Insulation", epdId: "EPD-GUT-2024-819", gwp: "-18 kg CO2e / m3 (biogenic storage)" },
        { product: "Applegate Bora-Spray Cellulose Insulation", epdId: "EPD-APP-2023-102", gwp: "12 kg CO2e / m3" }
      ]
    },
    designComparisons: [
      {
        scenario: "Option 1: Code Minimum Baseline",
        wallAssembly: "2x4 Wall, R-13 fiberglass, vinyl siding",
        heatingSystem: "Standard 14 SEER Heat Pump + Electric Strip",
        solarPV: "None (Grid standard)",
        eui: 48.2,
        operationalKgCo2eYr: 4200,
        embodiedTonsCo2e: 68.4,
        constructionCost: 345000,
        annualUtilityCost: 1680
      },
      {
        scenario: "Option 2: High Efficiency Heat Pump + Solar",
        wallAssembly: "2x6 Wall, R-20 cavity, 1\" XPS exterior",
        heatingSystem: "18 SEER Heat Pump",
        solarPV: "8 kW Array",
        eui: 24.5,
        operationalKgCo2eYr: 280,
        embodiedTonsCo2e: 54.2,
        constructionCost: 382000,
        annualUtilityCost: 190
      },
      {
        scenario: "Option 3: Selected - Deep Craftsman Net-Zero Ready",
        wallAssembly: "2x6 Advanced Framing, R-20 dense cellulose + continuous wood fiber",
        heatingSystem: "21 SEER2 Mitsubishi Multi-Zone Hyper-Heat + ERV",
        solarPV: "10.2 kW Ground Mount Array + 13.5kWh Storage",
        eui: 18.4,
        operationalKgCo2eYr: -2120,
        embodiedTonsCo2e: 39.1,
        constructionCost: 412500,
        annualUtilityCost: -340, // Net generator credit
        status: "SELECTED_SPECIFICATION"
      }
    ]
  },

  // Costs, Funding & Procurement
  costsAndFunding: {
    directConstruction: 305250,
    siteWorkAndInfrastructure: 33500,
    softCostsAndEngineering: 7000,
    contingencyReserve: 34575, // Mandatory 10%
    financedInterestReserve: 15600, // 9-month draw reserve
    lotAcquisitionCost: 42000,
    totalBaseCost: 437925,
    upfrontGuaranteeFee: 4379.25, // 1.00% USDA fee
    totalFinancedNote: 442304.25,
    borrowerCashRequired: 0, // True 0% down
    asCompletedAppraisal: 450000, // Equity cushion absorbs closing
    equityBuffer: 7695.75,
    fundingProgram: "USDA Section 502 Single-Close Construction Loan",
    lender: "Atlantic Bay Mortgage Group (USDA Approved Correspondent)",
    noteRate: 6.25,
    termYears: 30,
    monthlyPITI: 2898,
    incentivesResearched: [
      { name: "Federal Solar ITC (Section 25D)", value: "$9,180 (30% tax credit on $30,600 solar/battery system)" },
      { name: "Inflation Reduction Act 25C Energy Efficient Home Credit", value: "$2,000 for Heat Pump + $1,200 for Envelope" },
      { name: "Georgia CUVA Agricultural Property Tax Reduction", value: "Saves $1,950/year in property tax escrows" }
    ]
  },

  // Applications & Permits Tracking
  applicationsAndPermits: [
    {
      id: "APP-01",
      name: "Dawson County Residential Building Permit",
      agency: "Dawson County Department of Planning & Development",
      referenceNo: "BLD-2026-0842",
      fee: 1240,
      feePaid: true,
      submissionDate: "2026-09-28",
      status: "UNDER_REVIEW",
      preparer: "Sarah Jenkins, AIA",
      signer: "Kevan (Owner) & David Miller (GC)",
      requiredAttachments: [
        { name: "Complete Architectural & Structural Plan Set (Sheets C-101 to E-101)", status: "ATTACHED" },
        { name: "Dawson County Energy Compliance Certificate", status: "ATTACHED" },
        { name: "General Contractor Qualifying License & Insurance Accord Form", status: "ATTACHED" },
        { name: "Geotechnical Soil Bearing Verification Letter", status: "PENDING_SEOR_SIGN" }
      ],
      reviewerComments: [
        { date: "2026-10-01", reviewer: "Plan Examiner T. Ray", text: "Please clarify footing depth on gridline D-3 near rock outcropping before permit issuance." }
      ]
    },
    {
      id: "APP-02",
      name: "Dawson County Septic Construction Permit",
      agency: "Dawson County Environmental Health",
      referenceNo: "SEP-2026-0194",
      fee: 350,
      feePaid: true,
      submissionDate: "2026-09-10",
      status: "APPROVED_ISSUED",
      preparer: "Highland Soil & Perc LLC",
      signer: "Kevan (Owner)",
      requiredAttachments: [
        { name: "Level III Soil Morphology & Soil Classification Map", status: "APPROVED" },
        { name: "Site Plan showing 100-ft well separation and 50-ft property line clearance", status: "APPROVED" }
      ]
    },
    {
      id: "APP-03",
      name: "Georgia EPD Notice of Intent (NPDES Stormwater / Silt Fence)",
      agency: "Georgia Environmental Protection Division / Dawson County",
      referenceNo: "GAR-100001-DAW-0428",
      fee: 160,
      feePaid: false,
      submissionDate: "Pending Authorization",
      status: "READY_FOR_AUTHORIZATION",
      preparer: "Sarah Jenkins, AIA",
      signer: "Kevan (Owner)",
      requiredAttachments: [
        { name: "Erosion, Sedimentation & Pollution Control Plan (ESPC Sheet C-101)", status: "ATTACHED" }
      ]
    },
    {
      id: "APP-04",
      name: "USDA Form 3555-SC Single-Close Construction Loan Application Dossier",
      agency: "USDA Rural Housing Service / Approved Single-Close Lender Desk",
      referenceNo: "SC-2026-GA-0428-A1",
      fee: 0,
      feePaid: true,
      submissionDate: "2026-10-04",
      status: "DOSSIER_COMPILED",
      preparer: "USDA Build Navigator Pro 3FS Engine",
      signer: "Kevan (Borrower) & David Miller (Builder)",
      requiredAttachments: [
        { name: "Form 3555-SC Application Summary (Vector PDF)", status: "GENERATED" },
        { name: "General Contractor Qualification & Insurance Packet", status: "ATTACHED" },
        { name: "Itemized Cost Breakdown & 5-Stage Escrow Draw Schedule", status: "ATTACHED" },
        { name: "Statutory Household Income Deduction Worksheet ($129k Adjusted)", status: "ATTACHED" }
      ]
    }
  ],

  // Live Construction Tracking & Milestone Escrow Draws
  constructionTracking: {
    contractor: "Blue Ridge Craftsman Builders LLC",
    scheduledGroundbreak: "2026-11-01",
    estimatedCompletion: "2027-07-31",
    durationMonths: 9,
    currentMilestone: "Milestone 0: Pre-Construction Permitting & Site Clearing",
    retainageRatePct: 10,
    totalEscrow: 305250,
    stages: [
      {
        stageNum: 1,
        title: "Excavation, Footings & Poured Concrete Foundation",
        percent: 20,
        amount: 61050,
        retainageHoldback: 6105,
        netDisbursement: 54945,
        status: "NOT_STARTED",
        prerequisiteInspections: ["County Open Trench Footing Inspection", "Plumbing Ground Rough-in"]
      },
      {
        stageNum: 2,
        title: "Wall Framing, Roof Trusses & Weatherproof Sheathing (Dry-in)",
        percent: 25,
        amount: 76312.50,
        retainageHoldback: 7631.25,
        netDisbursement: 68681.25,
        status: "NOT_STARTED",
        prerequisiteInspections: ["County Framing & Sheathing Inspection", "Window Flashing Audit"]
      },
      {
        stageNum: 3,
        title: "Mechanical, Electrical, Plumbing Rough-ins & Insulation",
        percent: 20,
        amount: 61050,
        retainageHoldback: 6105,
        netDisbursement: 54945,
        status: "NOT_STARTED",
        prerequisiteInspections: ["County 4-Way MEP Rough Inspection", "GA Energy Code Insulation Inspection"]
      },
      {
        stageNum: 4,
        title: "Drywall, Interior Finishes, Kitchen Cabinets & Siding",
        percent: 20,
        amount: 61050,
        retainageHoldback: 6105,
        netDisbursement: 54945,
        status: "NOT_STARTED",
        prerequisiteInspections: ["Drywall Screw Inspection", "Septic Final Connection Signoff"]
      },
      {
        stageNum: 5,
        title: "Final Trim, Fixtures, Blower Door Test & Certificate of Occupancy",
        percent: 15,
        amount: 45787.50,
        retainageHoldback: 4578.75,
        netDisbursement: 41208.75,
        status: "NOT_STARTED",
        prerequisiteInspections: ["County Final Building Inspection (CO)", "USDA Final Construction Inspection"]
      }
    ],
    rfis: [
      {
        rfiNum: "RFI-001",
        subject: "Rock outcropping footing depth on north elevation",
        question: "Excavator struck granite shelf at 18 inches below grade. Requesting SEOR authorization for rock anchor dowels into bedrock vs hydraulic hammering.",
        status: "OPEN",
        assignedTo: "Marcus Vance, PE",
        urgency: "HIGH"
      },
      {
        rfiNum: "RFI-002",
        subject: "Solar conduit penetrations through continuous wood fiberboard",
        question: "Confirm airtight taping specification for 2-inch PVC solar PV conduits passing through exterior wall envelope.",
        status: "RESOLVED",
        assignedTo: "Sarah Jenkins, AIA",
        resolution: "Use ProClima Tescon Vana airtight grommet collars and Contega seal paste per detail A-504."
      }
    ],
    changeOrders: [
      {
        coNum: "CO-001",
        title: "Continuous Wood Fiberboard Thermal Upgrade",
        costDelta: 1450,
        scheduleDeltaDays: 0,
        reason: "Embodied Carbon & Vapor Permeability optimization",
        authorizedBy: "Kevan (Owner)",
        status: "APPROVED"
      }
    ]
  },

  // Handover & Operations Building Pack
  handoverPack: {
    status: "PRE_CONSTRUCTION_FRAMEWORK_COMPILED",
    asBuiltDrawingsRequired: 10,
    asBuiltDrawingsReceived: 0,
    warranties: [
      { item: "Structural Foundation & Framing Warranty", duration: "10 Years", provider: "Blue Ridge Craftsman Builders" },
      { item: "Standing Seam Metal Roof Material Warranty", duration: "50 Years", provider: "Fabral Metal Wall and Roof Systems" },
      { item: "Mitsubishi Hyper-Heat Compressor Warranty", duration: "12 Years", provider: "Mitsubishi Electric US" },
      { item: "Solar PV Panels & Inverter Performance Guarantee", duration: "25 Years (85% yield)", provider: "Enphase / REC Solar" },
      { item: "Builder Workmanship One-Year Warranty", duration: "1 Year", provider: "Blue Ridge Craftsman Builders" }
    ],
    operatingManuals: [
      "Mitsubishi Hyper-Heat Multi-Zone Heat Pump Owner Manual & Filter Maintenance",
      "Panasonic WhisperComfort ERV Core Cleaning & Seasonal Balancing Guide",
      "Enphase Enlighten Solar App & Battery Backup Configuration Manual",
      "Private Well Submersible Pump & Pressure Tank Care Instructions",
      "Conventional Septic System Care & Effluent Filter Cleaning Schedule"
    ],
    postOccupancyMonitoring: {
      utilityProvider: "Amicalola EMC (AMI Smart Meter)",
      projectedNetMonthlyBill: "-$28.33 / month (Net Exporter)",
      annualProjectedConsumptionKwh: 8920,
      annualProjectedSolarKwh: 13850,
      actualMeasurementIntegration: "Enphase API / Green Button Utility Connect Ready"
    }
  }
};
