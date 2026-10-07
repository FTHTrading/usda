# USDA Rural OS & 3FS Platform — Headless REST API Specification 📡

> [!IMPORTANT]
> **API Gateway Version:** `v1` (`2.4.0`)
> **Base URL (Local):** `http://localhost:4080/api/v1`
> **Base URL (Edge):** `https://usda.3fs.app/api/v1`
> **Standard:** USDA 7 CFR § 3555 / HB-1-3555 / 2018 IRC / DOE ZEB

---

## 📑 Table of Contents

1. [Architectural Overview: Federal vs. 3FS API Gateway](#1-architectural-overview-federal-vs-3fs-api-gateway)
2. [Federal Data Sources & Direct Integration Endpoints](#2-federal-data-sources--direct-integration-endpoints)
3. [REST API Endpoints Reference](#3-rest-api-endpoints-reference)
   - [GET /api/v1/health](#get-apiv1health)
   - [GET /api/v1/regions](#get-apiv1regions)
   - [POST /api/v1/income-check](#post-apiv1income-check)
   - [POST /api/v1/proforma](#post-apiv1proforma)
   - [GET /api/v1/elevation](#get-apiv1elevation)
   - [GET /api/v1/project](#get-apiv1project)
   - [GET /api/v1/whitelabel](#get-apiv1whitelabel)
   - [GET /api/v1/secrets](#get-apiv1secrets)
4. [Integration Code Examples (cURL, JavaScript, Python)](#4-integration-code-examples)
5. [Loan Origination System (LOS) & Zapier Webhook Guide](#5-loan-origination-system-los--zapier-webhook-guide)

---

## 1. Architectural Overview: Federal vs. 3FS API Gateway

The official USDA / Federal technology stack is historically fragmented, slow, and lacks developer-friendly REST endpoints. The 3FS API Gateway unifies federal GIS data, statutory deduction logic, and construction financial waterfalls into one clean JSON interface:

| Dimension | Legacy Federal Government System | 3FS Headless REST API Gateway |
| :--- | :--- | :--- |
| **Protocol** | Ancient ASP.NET forms & legacy SOAP/XML services. | Clean RESTful JSON over HTTPS with CORS enabled. |
| **Income Deductions** | Only checks gross income; ignores $480 minor allowances and childcare. | **Full 7 CFR § 3555 engine:** Audits work childcare, medical exemptions, and dependent shields. |
| **Construction Math** | Zero construction loan support (only models existing home purchases). | **Complete 0%-down waterfall:** Turnkey build, well/septic, 10% contingency escrow, 9-mo interest reserve. |
| **Elevation & Flooding** | Requires manual search on county tax maps or FEMA FIRMette PDFs. | **Live USGS 3DEP proxy:** Checks exact Mean Sea Level (MSL) elevation against USACE Lake Lanier 1,070-ft buffer. |
| **Whitelabeling** | Monolithic government portals with zero partner integration. | Decoupled multi-tenant specification (`/api/v1/whitelabel`) for instant co-branding. |

---

## 2. Federal Data Sources & Direct Integration Endpoints

Our engine connects to and integrates the following official government services:

| Federal Service | Endpoint / Service URL | Protocol | Usage in System |
| :--- | :--- | :--- | :--- |
| **USDA RHS Property Eligibility** | `https://eligibility.sc.egov.usda.gov/arcgis/rest/services/Eligible_Property/MapServer` | Esri ArcGIS REST | Verifies unshaded rural boundary polygons. |
| **USGS 3DEP Elevation Service** | `https://epqs.nationalmap.gov/v1/json` | REST / JSON | Retrieves real-time parcel Mean Sea Level (MSL) elevation in feet. |
| **U.S. Census Bureau Geocoder** | `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress` | REST / JSON | Resolves raw street addresses to Census tract, FIPS, and GPS coordinates. |
| **USDA NRCS Soil Data Access** | `https://sdmdataaccess.nrcs.usda.gov/Tabular/post.rest` | POST / REST | Soil perc capacity, water table depth, septic absorption suitability. |
| **HUD Fair Market Rents (FMR)** | `https://www.huduser.gov/hudapi/public/fmr/data/` | REST / Bearer | Annual county-by-county Area Median Income (AMI) limits. |

---

## 3. REST API Endpoints Reference

### `GET /api/v1/health`
Returns system operational health, statutory editions, and test pass counts.

**Response (200 OK):**
```json
{
  "status": "HEALTHY",
  "service": "USDA Rural OS & 3FS Headless API Gateway",
  "version": "2.4.0",
  "standard": "7 CFR § 3555 / HB-1-3555",
  "edgeDomain": "https://usda.3fs.app",
  "testsVerified": 26,
  "timestamp": "2026-10-07T06:31:08.274Z"
}
```

---

### `POST /api/v1/income-check`
Runs the statutory 7 CFR § 3555 income deduction and Area Median Income (AMI) cap audit.

**Request Payload:**
```json
{
  "grossIncome": 142000,
  "numDependents": 2,
  "childcareExpenses": 12000,
  "isElderly": false,
  "medicalExpenses": 0,
  "countyId": "dawson"
}
```

**Response (200 OK):**
```json
{
  "jurisdiction": "Dawson County",
  "grossIncome": 142000,
  "deductions": {
    "dependents": { "count": 2, "amount": 960, "citation": "7 CFR § 3555.152(b)" },
    "childcare": { "amount": 12000, "citation": "7 CFR § 3555.152(c)" },
    "elderlyMedical": { "amount": 0, "citation": "7 CFR § 3555.152(d)" },
    "totalDeductions": 12960
  },
  "adjustedIncome": 129040,
  "incomeCap": 135500,
  "isEligible": true,
  "headroom": 6460,
  "ruling": "PASSED: Adjusted household income of $129,040 is under the $135,500 Dawson County cap."
}
```

---

### `POST /api/v1/proforma`
Calculates a turnkey 0%-down construction financial waterfall, escrows, and 30-year amortization.

**Request Payload:**
```json
{
  "lotCost": 42000,
  "sqft": 1650,
  "costPerSqFt": 185,
  "sitePrep": 33500,
  "softCosts": 7000,
  "interestRate": 0.0625,
  "buildMonths": 9
}
```

**Response (200 OK):**
```json
{
  "program": "USDA Section 502 Single-Close Guaranteed Loan",
  "downPaymentRequired": 0,
  "cashAtClosing": 0,
  "waterfall": {
    "lotAcquisition": 42000,
    "turnkeyConstruction": 305250,
    "siteInfrastructure": 33500,
    "softCostsAndPermits": 7000,
    "contingencyReserve10Pct": 34575,
    "financedInterestReserve": 9805.25,
    "upfrontGuaranteeFee1Pct": 4321.3,
    "totalFinancedNote": 436451.56
  },
  "monthlyPayment": {
    "principalAndInterest": 2687.31,
    "annualRate": 0.0625,
    "termYears": 30
  },
  "guaranteeNote": "100% LTV financed note combines raw parcel purchase and turnkey construction into a single permanent loan closing."
}
```

---

### `GET /api/v1/elevation`
Proxies the USGS National Map 3DEP service to verify parcel elevation and check the USACE 1,070-ft buffer.

**Query Parameters:**
* `lat`: Latitude (e.g. `34.4215`)
* `lon`: Longitude (e.g. `-84.1197`)

**Response (200 OK):**
```json
{
  "coordinates": { "latitude": 34.4215, "longitude": -84.1197 },
  "elevationFeet": 1371.3,
  "lakeLanierElevationThreshold": 1070,
  "flowageEasementCleared": true,
  "clearanceAboveThresholdFeet": 301.3,
  "usaceStatus": "VERIFIED_ABOVE_USACE_EASEMENT",
  "source": "USGS National Map 3DEP Elevation Point Query Service"
}
```

---

## 4. Integration Code Examples

### cURL
```bash
# Statutory Income Deduction Check
curl -X POST https://usda.3fs.app/api/v1/income-check \
  -H "Content-Type: application/json" \
  -d '{"grossIncome":142000,"numDependents":2,"childcareExpenses":12000,"countyId":"dawson"}'
```

### JavaScript / Node.js
```javascript
const response = await fetch('https://usda.3fs.app/api/v1/proforma', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lotCost: 42000,
    sqft: 1650,
    costPerSqFt: 185,
    sitePrep: 33500,
    softCosts: 7000
  })
});
const proforma = await response.json();
console.log(`Total Financed Note: $${proforma.waterfall.totalFinancedNote}`);
console.log(`Cash Required at Closing: $${proforma.cashAtClosing}`);
```

### Python
```python
import requests

url = "https://usda.3fs.app/api/v1/income-check"
payload = {
    "grossIncome": 142000,
    "numDependents": 2,
    "childcareExpenses": 12000,
    "countyId": "dawson"
}
res = requests.post(url, json=payload).json()
print("Eligible:", res["isEligible"])
print("Adjusted Income:", res["adjustedIncome"])
print("Statutory Ruling:", res["ruling"])
```

---

## 5. Loan Origination System (LOS) & Zapier Webhook Guide

Loan officers and mortgage brokers can connect our API Gateway directly into their CRM (Encompass, BytePro, Salesforce, or HubSpot):

1. **Pre-Screen Webhook:** When a new lead inputs household income, ping `/api/v1/income-check`.
2. **Instant Pre-Approval Dossier:** If eligible, ping `/api/v1/proforma` to generate the borrower's loan estimates.
3. **Automated GIS Radar Check:** Send parcel GPS coordinates to `/api/v1/elevation` to pre-clear USACE flowage easements before paying for an appraisal.
