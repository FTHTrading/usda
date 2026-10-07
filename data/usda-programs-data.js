// USDA Rural Development Programs Catalog & Regulatory Specifications
// Comprehensive underwriting parameters for Single-Close, Refinance, Multifamily, and Commercial Grant programs.

export const USDA_PROGRAMS = [
  {
    id: "sec-502-build",
    code: "SECTION 502 SC",
    title: "Section 502 Single-Close Construction",
    category: "residential-build",
    tag: "100% LTV Zero-Down",
    badgeColor: "emerald",
    statute: "7 CFR Part 3555 Subpart C",
    handbook: "HB-1-3555 Chapter 12",
    summary: "Combines raw rural lot acquisition, site preparation (well/septic), and custom residential construction into a single permanent loan with $0 borrower down payment.",
    maxLtv: "100.0% of As-Completed Appraised Value",
    downPayment: "$0.00 (Zero Down)",
    amortizationYears: 30,
    rateType: "Fixed Rate",
    appraisalRequired: true,
    incomeCeiling: "115% Area Median Income (AMI)",
    features: [
      "No payments due from borrower during construction (interest reserve financed)",
      "Mandatory 10% construction contingency escrow financed into permanent note",
      "One closing prior to construction start; automatically converts to permanent loan upon CO",
      "Closing costs can be financed up to appraised value equity cushion"
    ],
    targetUse: "Owner-occupied primary single-family residence in eligible rural areas"
  },
  {
    id: "sec-502-refinance",
    code: "SECTION 502 STREAMLINE",
    title: "Section 502 Streamlined-Assist Refinance",
    category: "refinance",
    tag: "No Appraisal · $50/mo Rule",
    badgeColor: "blue",
    statute: "7 CFR § 3555.251(c)",
    handbook: "HB-1-3555 Chapter 6",
    summary: "Refinances an existing USDA Section 502 guaranteed or direct loan to lower the interest rate and monthly payment with zero out-of-pocket costs and no property appraisal.",
    maxLtv: "100.0%+ (Principal Balance + Upfront Guarantee Fee + Closing Costs)",
    downPayment: "$0.00",
    amortizationYears: 30,
    rateType: "Fixed Rate",
    appraisalRequired: false,
    incomeCeiling: "No income re-qualification if borrower has 12-month on-time payment history",
    features: [
      "No property inspection or new appraisal required under 7 CFR § 3555.251(c)",
      "No credit score minimum re-verification required",
      "No debt-to-income (DTI) ratio recalculation",
      "Statutory Tangible Net Benefit Rule: Must reduce principal & interest payment by at least $50.00 per month",
      "All closing costs, prepaids, and escrow funding can be 100% rolled into the new loan note"
    ],
    targetUse: "Homeowners with an existing USDA loan seeking immediate monthly payment reduction"
  },
  {
    id: "sec-504-repair",
    code: "SECTION 504 REPAIR",
    title: "Section 504 Rural Home Repair Loans & Grants",
    category: "home-repair",
    tag: "1.00% Fixed Rate · $10k Grants",
    badgeColor: "amber",
    statute: "7 CFR Part 3550 Subpart C",
    handbook: "HB-1-3550 Chapter 12",
    summary: "Provides ultra-low 1.00% fixed-interest loans up to $40,000 and grants up to $10,000 to very-low-income rural homeowners to modernize, repair, or eliminate health and safety hazards.",
    maxLtv: "Based on need (Up to $40,000 loan + $10,000 grant)",
    downPayment: "$0.00",
    amortizationYears: 20,
    rateType: "1.00% Fixed Interest Rate",
    appraisalRequired: false,
    incomeCeiling: "Very Low Income (≤ 50% Area Median Income)",
    features: [
      "Ultra-low 1.00% interest rate fixed for 20 years ($40,000 loan costs only ~$184.28/month)",
      "Grants up to $10,000 for elderly homeowners (age 62+) that do not need to be repaid if home is occupied for 3 years",
      "Loans and grants can be combined for up to $50,000 in total repair capital",
      "Eligible repairs: roof replacement, structural foundation, well and septic upgrades, heat pumps, ADA accessibility"
    ],
    targetUse: "Rural homeowners needing immediate structural repair, roof replacement, or weatherization"
  },
  {
    id: "sec-538-multifamily",
    code: "SECTION 538 MFH",
    title: "Section 538 Multi-Family Housing Guaranteed Loan",
    category: "multifamily",
    tag: "40-Year Amortization · 90% LTV",
    badgeColor: "purple",
    statute: "7 CFR Part 3565",
    handbook: "HB-1-3565",
    summary: "Guarantees construction and permanent loans for affordable rural multi-family rental housing, duplex clusters, garden apartments, and senior living facilities.",
    maxLtv: "90% LTV for For-Profit Developers (97% LTV for Non-Profit Entities)",
    downPayment: "10% Equity (3% for Non-Profits)",
    amortizationYears: 40,
    rateType: "Fixed or Variable with Cap",
    appraisalRequired: true,
    incomeCeiling: "Tenant households up to 115% Area Median Income (AMI)",
    features: [
      "40-year fixed amortization period dramatically reduces annual debt service burdens",
      "Loan guarantees up to 90% of total development and construction costs",
      "Mandatory Debt Service Coverage Ratio (DSCR) minimum of 1.15x",
      "Eligible properties: Multi-unit apartment buildings, duplex/fourplex clusters, cottage courts, assisted senior living",
      "Rent restrictions: Average rents cannot exceed 30% of 115% AMI for the rural jurisdiction"
    ],
    targetUse: "Developers and community trusts building rural multi-family rental apartments and cottage clusters"
  },
  {
    id: "sec-515-direct-mfh",
    code: "SECTION 515 DIRECT",
    title: "Section 515 Direct Multi-Family Rental Housing",
    category: "multifamily",
    tag: "Direct Federal · 1.0% Rate Subsidy",
    badgeColor: "emerald",
    statute: "7 CFR Part 3560",
    handbook: "HB-1-3560",
    summary: "Direct federal loans made by USDA to non-profits and limited-profit entities to construct and preserve affordable multi-family rental housing for very-low and low-income rural households.",
    maxLtv: "Up to 102% of development cost",
    downPayment: "0% - 3%",
    amortizationYears: 30,
    rateType: "Effective 1.00% fixed with Interest Credit Subsidy",
    appraisalRequired: true,
    incomeCeiling: "Tenants must be very-low or low-income (≤ 80% AMI)",
    features: [
      "Direct government financing with effective 1% interest rate through federal interest credits",
      "Coupled with Section 521 Rental Assistance so tenants pay no more than 30% of income for rent",
      "Preservation and revitalization loans available for existing rural multi-family portfolios"
    ],
    targetUse: "Non-profit community trusts and rural authorities providing deeply subsidized rental housing"
  },
  {
    id: "reap-energy",
    code: "USDA REAP",
    title: "Rural Energy for America Program (REAP)",
    category: "clean-energy",
    tag: "50% Cash Grants + Guaranteed Loans",
    badgeColor: "emerald",
    statute: "7 CFR Part 4280 Subpart B",
    handbook: "HB-1-4280",
    summary: "Provides guaranteed loan financing and grant funding up to 50% to agricultural producers and rural small businesses for renewable energy systems and energy efficiency retrofits.",
    maxLtv: "Combined grant + guaranteed loan up to 75% of total project cost",
    downPayment: "25% Sponsor Equity",
    amortizationYears: 20,
    rateType: "Commercial Guaranteed Rate",
    appraisalRequired: false,
    incomeCeiling: "Agricultural producers (50%+ gross income from ag) or Rural Small Businesses",
    features: [
      "Grants cover up to 50% of total project cost (maximum grant of $1,000,000 for renewable energy systems)",
      "Loan guarantees cover up to 75% of project cost (up to $25,000,000 loan guarantee)",
      "Eligible systems: Solar PV arrays, geothermal, biomass, wind, micro-hydro, and cold-climate heat pump retrofits",
      "Can stack with 30% Federal ITC Investment Tax Credit, achieving 80%+ total capital subsidy"
    ],
    targetUse: "Rural small businesses, farmsteads, and eco-cabin developments adding commercial solar & heat pumps"
  }
];
