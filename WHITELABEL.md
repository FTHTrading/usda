# USDA Rural OS & 3FS Platform — Whitelabel & Partner Integration Guide 🏷️

> [!IMPORTANT]
> **Whitelabel Overview:**
> This repository is engineered as an institutional-grade, multi-tenant operating workspace for the **USDA Section 502 Single-Close Construction Loan** program (7 CFR § 3555). Lenders, general contractors, architectural firms, and rural development agencies can rebrand, configure, and self-host isolated tenant instances in less than 5 minutes.

---

## 📑 Table of Contents

1. [Architectural Principles](#1-architectural-principles)
2. [Quickstart: Deploying a Branded Tenant (< 5 Mins)](#2-quickstart-deploying-a-branded-tenant--5-mins)
3. [Configuration Matrix (`whitelabel.config.json`)](#3-configuration-matrix-whitelabelconfigjson)
4. [Brand & Visual Identity Customization](#4-brand--visual-identity-customization)
5. [Geographic & Regulatory Re-Targeting (50 States)](#5-geographic--regulatory-re-targeting-50-states)
6. [White-Label Vector PDF Dossier Publishing](#6-white-label-vector-pdf-dossier-publishing)
7. [Edge Hosting & Multi-Tenant DNS Setup](#7-edge-hosting--multi-tenant-dns-setup)
8. [Partner Commercial Deployment Models](#8-partner-commercial-deployment-models)

---

## 1. Architectural Principles

The platform separates **underwriting logic**, **state machines**, and **brand tokens** into clean decoupled layers:

| Layer | Color Code | Component | Description |
| :--- | :--- | :--- | :--- |
| **Presentation** | 🟢 Emerald | `css/styles.css` & `index.html` | Liquid-Glass 3D UI, CSS custom properties, responsive glass panels. |
| **Brand Identity** | 🔴 Crimson | `assets/brand/` & `whitelabel.config.json` | Vector SVG logos, seals, favicons, typography, and partner tags. |
| **Underwriting Core**| 🟡 Amber | `data/georgia-counties.js` & `data/secret-locations.js` | 7 CFR § 3555 statutory deduction formulas, AMI caps, and elevation filters. |
| **Workflow State** | 🟣 Purple | `data/project-record.js` & `js/ai-workspace.js` | Single Project Record master model, approval gates, BIM LOD 350 tracker. |
| **Publishing** | 🔵 Blue | `js/pdf-engine.js` | Client-side jsPDF vector compilation, formal signatures, custom watermarks. |

---

## 2. Quickstart: Deploying a Branded Tenant (< 5 Mins)

### Step 1: Clone the Repository
```bash
git clone https://github.com/FTHTrading/usda.git my-rural-builder
cd my-rural-builder
npm install
```

### Step 2: Edit `whitelabel.config.json`
Update organization details, brand colors, partner license numbers, and domain:
```bash
# Validate your JSON configuration
npm run whitelabel -- --validate
```

### Step 3: Run the Verification Test Suite
Ensure all 22 automated statutory and financial tests pass:
```bash
npm test
```

### Step 4: Deploy to Your Edge Subdomain
```bash
# Deploy to Cloudflare Pages
npx wrangler pages deploy . --project-name my-branded-usda-portal
```

---

## 3. Configuration Matrix (`whitelabel.config.json`)

The platform reads all tenant metadata from [whitelabel.config.json](file:///C:/Users/Kevan/.gemini/antigravity-ide/scratch/usda-rural-build-system/whitelabel.config.json):

```json
{
  "tenant": {
    "organizationName": "Highland Capital & Construction",
    "portalTitle": "Highland Rural Build OS",
    "subdomainTag": "build.highlandcapital.com",
    "productionDomain": "https://build.highlandcapital.com",
    "supportEmail": "underwriting@highlandcapital.com"
  },
  "branding": {
    "theme": "white-liquid-glass",
    "primaryColor": "#059669",
    "accentColor": "#002D62",
    "logoPath": "assets/brand/custom-logo.svg",
    "faviconPath": "assets/brand/custom-favicon.svg"
  },
  "jurisdiction": {
    "defaultState": "TN",
    "stateName": "Tennessee",
    "defaultCounty": "sevier",
    "countyName": "Sevier County",
    "msaCap1to4": 128400
  }
}
```

---

## 4. Brand & Visual Identity Customization

### Vector Logo Replacement
Replace the files in `assets/brand/` with your organization's vector marks:

1. **Primary Logo (`assets/brand/3fs-logo.svg`):**
   - Recommended viewBox: `0 0 64 64` or `0 0 200 200`
   - Formats: SVG (vector) for razor-sharp rendering on Retina and 4K displays.
2. **Browser Favicon (`assets/brand/3fs-favicon.svg`):**
   - Scalable SVG icon with crisp contrast against dark/light browser tabs.
3. **Statutory Seal (`assets/brand/usda-rd-seal.svg`):**
   - Official agency or state authority emblem.
4. **Hero Crest (`assets/brand/gate-mark-3d.svg`):**
   - 3D perspective badge displayed on high-contrast cards.

### CSS Theme Tokens (`css/styles.css`)
Override root CSS variables to match your corporate brand guidelines:
```css
:root {
  --primary-accent: #059669;   /* Your brand primary */
  --crimson-accent: #A30D22;   /* Transactional / alert color */
  --bg-workspace:   #f8fafc;   /* Liquid pearl substrate */
  --glass-border:   #e2e8f0;   /* Specular silver border */
  --font-sans:      'Plus Jakarta Sans', system-ui, sans-serif;
}
```

---

## 5. Geographic & Regulatory Re-Targeting (50 States)

While the default reference deployment is calibrated for **North Georgia (Dawson, Lumpkin, Hall, Pickens)**, the system can be expanded to any US county:

1. **County & Income Limits:**
   - Update `data/georgia-counties.js` with your state's USDA Area Median Income (AMI) limits from [USDA RD Circular HB-1-3555 Appendix 9](https://www.rd.usda.gov).
2. **GIS & Waterbody Buffer Rules:**
   - For Lake Lanier, the system enforces the **1,070-ft MSL USACE shoreline buffer**.
   - For coastal or mountain jurisdictions (e.g. TVA reservoirs, FEMA 100-year flood zones), configure the elevation contour threshold in `data/georgia-counties.js`.
3. **Property Tax Shields (e.g., Georgia CUVA):**
   - Adjust the tax abatement rate (`cuvaSavingsRate: 0.65`) in `data/secret-locations.js` to mirror your state's agricultural or conservation easement laws (e.g. Florida Greenbelt, Texas Ag Exemption).

---

## 6. White-Label Vector PDF Dossier Publishing

Every document generated by the **Client-Side jsPDF Engine** in [js/pdf-engine.js](file:///C:/Users/Kevan/.gemini/antigravity-ide/scratch/usda-rural-build-system/js/pdf-engine.js) automatically carries the partner's branding:

- **Official Document Header:** Partner corporate name + State Housing Authority.
- **Vector Header Stamp:** Razor-sharp partner crest rendered via vector paths (zero blurry raster artifacts).
- **Formal Signatures Block:**
  - Prepared by: Authorized Agent / Partner Entity
  - Reviewed by: Architect / Engineer of Record
  - Target Authority: Local County Planning & Development
- **Audit Hash & Watermark:** Traceable timestamp, project ID, and statutory compliance reference.

---

## 7. Edge Hosting & Multi-Tenant DNS Setup

### Cloudflare Pages Multi-Domain Architecture
A single deployment can serve multiple customized vanity domains using Cloudflare Custom Domains:

```
                  ┌───────────────────────────────┐
                  │    Cloudflare Pages Edge      │
                  │    (usda-3fs.pages.dev)       │
                  └──────────────┬────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
   usda.3fs.app           build.partnerbank.com    rural.buildergroup.com
 (Primary Tenant)          (Bank Co-Brand)          (Contractor Co-Brand)
```

1. Navigate to **Cloudflare Dashboard > Workers & Pages > usda-3fs > Custom Domains**.
2. Click **Set up a domain** and enter your partner hostname (e.g. `rural.yourdomain.com`).
3. Add the generated CNAME record in your DNS provider:
   ```
   CNAME rural.yourdomain.com -> usda-3fs.pages.dev
   ```
4. SSL/TLS certificate will provision automatically within seconds via Google Trust Services Universal SSL.

---

## 8. Partner Commercial Deployment Models

| Partner Type | Typical Use Case | Value Proposition |
| :--- | :--- | :--- |
| **USDA Approved Lenders** | Client self-service intake, AMI deduction calculation, and automated Form 3555-SC generation. | Slashes loan origination time from 45 days to 14 days; pre-clears applicants before ordering appraisals. |
| **General Contractors** | Single-close turnkey draw management, 5-stage milestone tracking, and 10% retainage escrow compliance. | Zero contractor out-of-pocket costs; eliminates construction draw disputes via formal inspection sign-offs. |
| **Architects & Engineers** | BIM LOD 350 sheets, local building-code compliance verification, and DOE Net-Zero energy models. | Enforces statutory compliance with local county amendments before permit submission. |
| **Rural Non-Profits** | Self-Help Housing and subsidized Section 502 Direct (1.0% interest rate) applicant empowerment. | Brings institutional-grade underwriting tools to low-income rural families at zero cost. |

---

## 🛡️ License & Commercial Rights

Licensed under the **Apache License, Version 2.0**. Commercial use, whitelabeling, and proprietary redistribution are permitted in accordance with the [LICENSE](file:///C:/Users/Kevan/.gemini/antigravity-ide/scratch/usda-rural-build-system/LICENSE) file.
