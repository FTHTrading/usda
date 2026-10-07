#!/usr/bin/env python3
"""Builds the 3FS Rural Home PDF set with the real 3FS mark on every page.
  public/docs/3fs-usda-program-guide.pdf       Direct vs Guaranteed, limits, how to apply (for families)
  public/docs/3fs-document-checklist.pdf       what to gather, with checkboxes
  public/docs/3fs-income-limits-2026-georgia.pdf   a state table example (every county, both limits, page refs)
  public/docs/3fs-rural-home-overview.pdf      the one-page framework poster, in the house style
Also exposes make_answer_sheet(data) used by /api/sheet for a per-ZIP answer sheet.
"""
import sys, os, json, datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image as RLImage, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF

PUB = sys.argv[1] if len(sys.argv) > 1 else 'public'
OUT = os.path.join(PUB, 'docs'); os.makedirs(OUT, exist_ok=True)
MARK = svg2rlg(os.path.join(PUB, 'brand', '3fs-mark.svg'))
HERO = os.path.join(PUB, 'brand', '3fs-hero.png')

CRIMSON = colors.HexColor('#A30D22'); CRIMSON_DK = colors.HexColor('#6E0717'); INK = colors.HexColor('#111214'); INK2 = colors.HexColor('#30343A')
MUTED = colors.HexColor('#5F646C'); LINE = colors.HexColor('#D8DADF'); STEEL = colors.HexColor('#9BA0A8'); PALE = colors.HexColor('#FAF0F1'); PALE2 = colors.HexColor('#F7F7F4')
TODAY = datetime.date.today().strftime('%B %d, %Y').replace(' 0', ' ')
SOURCE = 'Source: USDA FY2026 Adjusted Income Limits, HB-1-3550 Appendix 9, PN 657 (07/13/2026)'
DISCLAIMER = ('3FS Rural Home is a technology service by UnyKorn LLC, 5655 Peachtree Pkwy NW, Norcross, GA 30099. It is not affiliated with USDA and is not a lender or broker. '
              'USDA Rural Development or an approved lender makes every loan decision. Limits compare to adjusted household income and can change. General information, not financial or legal advice.')

ss = getSampleStyleSheet()
H1 = ParagraphStyle('h1', parent=ss['Title'], fontName='Helvetica-Bold', fontSize=24, leading=28, textColor=INK, alignment=TA_LEFT, spaceAfter=4)
H2 = ParagraphStyle('h2', parent=ss['Heading2'], fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=INK, spaceBefore=14, spaceAfter=4)
H3 = ParagraphStyle('h3', parent=ss['Heading3'], fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=CRIMSON_DK, spaceBefore=8, spaceAfter=2)
BODY = ParagraphStyle('body', parent=ss['Normal'], fontName='Helvetica', fontSize=10.5, leading=15, textColor=INK2)
SMALL = ParagraphStyle('small', parent=BODY, fontSize=8.5, leading=11.5, textColor=MUTED)
LEDE = ParagraphStyle('lede', parent=BODY, fontSize=12, leading=17, textColor=MUTED)
CELL = ParagraphStyle('cell', parent=BODY, fontSize=9.5, leading=12.5)
CELLB = ParagraphStyle('cellb', parent=CELL, fontName='Helvetica-Bold', textColor=INK)

def draw_mark(c, x, y, size):
    d = MARK; s = size / d.width
    c.saveState(); c.translate(x, y); c.scale(s, s); renderPDF.draw(d, c, 0, 0); c.restoreState()

def chrome(title_short):
    def _draw(c, doc):
        W, H = letter
        c.setFillColor(CRIMSON); c.rect(0, H - 6, W, 6, fill=1, stroke=0)
        draw_mark(c, 0.6 * inch, H - 0.95 * inch, 0.42 * inch)
        c.setFillColor(INK); c.setFont('Helvetica-Bold', 13); c.drawString(1.12 * inch, H - 0.72 * inch, '3fs')
        c.setFillColor(CRIMSON); c.setFont('Helvetica-Bold', 8.5); c.drawString(1.45 * inch, H - 0.72 * inch, 'RURAL HOME')
        c.setFillColor(MUTED); c.setFont('Helvetica', 8.5); c.drawRightString(W - 0.6 * inch, H - 0.72 * inch, title_short + '  ·  usda.3fs.app')
        c.setStrokeColor(LINE); c.setLineWidth(.6); c.line(0.6 * inch, H - 1.02 * inch, W - 0.6 * inch, H - 1.02 * inch)
        c.setFillColor(MUTED); c.setFont('Helvetica', 7.5)
        c.drawString(0.6 * inch, 0.5 * inch, 'UnyKorn LLC · 5655 Peachtree Pkwy NW, Norcross, GA 30099 · kevan@unykorn.org · Not affiliated with USDA')
        c.drawRightString(W - 0.6 * inch, 0.5 * inch, f'Page {doc.page}  ·  {TODAY}')
    return _draw

def doc_for(path, short):
    return SimpleDocTemplate(path, pagesize=letter, leftMargin=0.6 * inch, rightMargin=0.6 * inch, topMargin=1.2 * inch, bottomMargin=0.8 * inch,
                             title=short + ' · 3FS Rural Home', author='3FS Rural Home (UnyKorn LLC)', subject='USDA Single Family Housing loans', creator='usda.3fs.app')

def tbl(rows, widths, header=True, zebra=True):
    data = [[Paragraph(str(c), CELLB if (header and i == 0) else CELL) for c in r] for i, r in enumerate(rows)]
    t = Table(data, colWidths=widths, repeatRows=1 if header else 0)
    st = [('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LINEBELOW', (0, 0), (-1, -1), .4, LINE), ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5), ('LEFTPADDING', (0, 0), (-1, -1), 6), ('RIGHTPADDING', (0, 0), (-1, -1), 6)]
    if header: st += [('BACKGROUND', (0, 0), (-1, 0), PALE2), ('LINEBELOW', (0, 0), (-1, 0), 1, CRIMSON)]
    if zebra:
        for i in range(1 if header else 0, len(rows)):
            if i % 2 == 0: st.append(('BACKGROUND', (0, i), (-1, i), colors.HexColor('#FAFBFC')))
    t.setStyle(TableStyle(st)); return t

def callout(text):
    t = Table([[Paragraph(text, BODY)]], colWidths=[7.3 * inch])
    t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), PALE), ('LINEBEFORE', (0, 0), (0, -1), 3, CRIMSON), ('LEFTPADDING', (0, 0), (-1, -1), 12), ('TOPPADDING', (0, 0), (-1, -1), 8), ('BOTTOMPADDING', (0, 0), (-1, -1), 8)]))
    return t

def money(n): return '$' + f'{int(n):,}'

# ---------------- 1. Program guide
def program_guide():
    path = os.path.join(OUT, '3fs-usda-program-guide.pdf'); d = doc_for(path, 'USDA loan guide'); s = []
    s += [Paragraph('USDA rural home loans, explained in one sitting', H1), Paragraph('Who they are for, the two kinds, the income limits, and how to apply. Free for families at usda.3fs.app.', LEDE), Spacer(1, 10)]
    s.append(callout('<b>The short version.</b> USDA Single Family Housing loans help people with modest incomes buy or build a home in an eligible rural area, often with <b>no down payment</b>. '
                     'There are two kinds: a <b>Direct</b> loan (USDA lends to you) and a <b>Guaranteed</b> loan (an approved lender lends, USDA backs it). You need income under the limit for your area, a home in an eligible area, and reasonable credit.'))
    s += [Paragraph('The two kinds, side by side', H2)]
    s.append(tbl([['', 'Direct loan (Section 502 Direct)', 'Guaranteed loan (Section 502 Guaranteed)'],
                  ['Who lends', 'USDA Rural Development itself', 'A bank, credit union or lender approved by USDA'],
                  ['Who it is for', 'Low and very-low income households', 'Low to moderate income households'],
                  ['Income limit used', 'The low-income limit for your area (about 80% of area median)', 'The moderate-income limit (115% of area median, with a national floor)'],
                  ['Down payment', 'Usually none', 'Usually none'],
                  ['Rate help', 'Payment assistance can lower the effective rate, in some cases to 1%', 'Market rate; upfront 1% guarantee fee and 0.35% annual fee, usually rolled in'],
                  ['Term', '33 years, or 38 for very-low income', '30 years'],
                  ['Where to apply', 'Local USDA Rural Development office, often through a certified loan packager', 'Any USDA-approved lender'],
                  ['Speed', 'Slower; depends on office staffing and funding', 'Like a normal mortgage']], [1.3 * inch, 3 * inch, 3 * inch]))
    s += [Paragraph('The income limits for FY2026', H2),
          Paragraph('USDA publishes a limit for every county and metro area, for households of 1 to 4 and 5 to 8 people. For 9 or more, add 8% of the 4-person limit per extra person. '
                    'The Guaranteed limit has a national floor: <b>$122,800</b> for 1 to 4 people and <b>$162,100</b> for 5 to 8. About three quarters of the country\'s income areas (2,065 of 2,724) use exactly that floor. Higher-cost metros go up from there.', BODY)]
    s.append(tbl([['Area (FY2026)', 'Guaranteed 1–4', 'Guaranteed 5–8', 'Direct 1–4', 'Direct 5–8', 'USDA table page'],
                  ['Most rural counties (floor)', '$122,800', '$162,100', 'varies by county', 'varies', '—'],
                  ['Fannin County, GA', '$122,800', '$162,100', '$61,600', '$81,350', '71'],
                  ['Macon-Bibb metro, GA', '$122,800', '$162,100', '$61,750', '$81,550', '66'],
                  ['Atlanta metro, GA', '$135,500', '$178,900', '$94,250', '$124,450', '64'],
                  ['Nashville metro, TN', '$133,550', '$176,300', '$92,900', '$122,650', '303'],
                  ['Phoenix metro, AZ', '$129,250', '$170,650', '$89,900', '$118,700', '20'],
                  ['Raleigh, NC', '$152,600', '$201,450', '$106,150', '$140,150', '241'],
                  ['Denver metro, CO', '$153,550', '$202,700', '$106,800', '$141,000', '38']], [2 * inch, 1.05 * inch, 1.05 * inch, 1.05 * inch, 1.05 * inch, 1.1 * inch]))
    s.append(Paragraph(SOURCE, SMALL))
    s += [Paragraph('It is adjusted income', H3), Paragraph('USDA compares the limit to adjusted annual income: the household\'s gross income minus deductions, such as $480 for each child under 18 or full-time student, $400 for an elderly or disabled member, and certain child-care and medical costs. A family slightly over the limit may still qualify.', BODY)]
    s += [Paragraph('What counts as a rural area', H2), Paragraph('Open country and towns of up to about 20,000 people outside a metropolitan area qualify, and some towns up to 35,000 are grandfathered. Large parts of every state qualify, including the outer rings of most metros. The exact address is confirmed on USDA\'s property eligibility site: eligibility.sc.egov.usda.gov.', BODY)]
    s += [Paragraph('How to apply, in order', H2)]
    for i, t in enumerate(['Check your place at usda.3fs.app: both limits, the area type, and nearby places where you qualify.', 'Pick the loan type: under the low-income limit, look at Direct first; between low and moderate, Guaranteed.',
                           'Gather your documents (see the 3FS document checklist).', 'Guaranteed: call a USDA-approved lender and get pre-approved. Direct: contact your state USDA Rural Development office or a certified packager.',
                           'Shop for a modest home in an eligible area; have the lender confirm the address before you offer.', 'Closing costs run 2% to 5%; the seller may pay up to 6% toward them, and Guaranteed loans can finance them when the appraisal allows.'], 1):
        s.append(Paragraph(f'<b>{i}.</b> {t}', BODY))
    s += [Spacer(1, 12), Paragraph(DISCLAIMER, SMALL)]
    d.build(s, onFirstPage=chrome('USDA loan guide'), onLaterPages=chrome('USDA loan guide'))

# ---------------- 2. Document checklist
def checklist():
    path = os.path.join(OUT, '3fs-document-checklist.pdf'); d = doc_for(path, 'Document checklist'); s = []
    s += [Paragraph('Your USDA loan document checklist', H1), Paragraph('Gather these once and both loan types are covered. Tick each box as you add it to your file at usda.3fs.app.', LEDE), Spacer(1, 8)]
    items = [('Photo ID for each adult', 'Driver\'s license or passport'), ('Pay stubs, last 30 days', 'Every job in the household'), ('W-2s, last 2 years', 'Or 1099s if self-employed'), ('Tax returns, last 2 years', 'All pages, signed'),
             ('Bank statements, last 2 months', 'All pages, every account'), ('Other income', 'Child support, benefits, pensions, Social Security award letters'), ('Rent history', 'Lease or landlord contact; 12 months on time helps'),
             ('Credit check permission', 'The lender or USDA office provides the form'), ('Purchase contract', 'Once you pick a home'), ('Gift letter', 'Only if someone is helping with closing costs')]
    rows = [['', 'Document', 'Notes']] + [['☐', a, b] for a, b in items]
    s.append(tbl(rows, [0.4 * inch, 2.6 * inch, 4.3 * inch]))
    s += [Paragraph('Tips from people who have done this', H2)]
    for t in ['Scan or photograph every page, including blank ones that say "this page intentionally left blank." Lenders ask for them.', 'Do not open new credit or move large sums between accounts while your file is open; it triggers questions.',
              'If you are self-employed, expect to add a year-to-date profit and loss statement.', 'Keep your own copy of everything. On 3FS, "My file" fingerprints each document on your device and tracks what is still missing.']:
        s.append(Paragraph('• ' + t, BODY))
    s += [Spacer(1, 12), Paragraph(DISCLAIMER, SMALL)]
    d.build(s, onFirstPage=chrome('Document checklist'), onLaterPages=chrome('Document checklist'))

# ---------------- 3. State table (Georgia)
def state_table(state_ab='GA', state_name='Georgia'):
    data = json.load(open(os.path.join(os.path.dirname(__file__), '..', 'build-data', 'data.json'))) if os.path.exists(os.path.join(os.path.dirname(__file__), '..', 'build-data', 'data.json')) else None
    if data is None:
        js = open(os.path.join(PUB, 'data.js')).read(); start = js.index('window.__DATA__=') + len('window.__DATA__='); end = js.index(';\nwindow.__US__=')
        data = json.loads(js[start:end])
    areas = [a for a in data['areas'] if a[1] == state_ab]
    areas.sort(key=lambda a: (a[3], a[0]))
    path = os.path.join(OUT, f'3fs-income-limits-2026-{state_name.lower()}.pdf'); d = doc_for(path, f'{state_name} income limits'); s = []
    s += [Paragraph(f'{state_name}: USDA income limits for FY2026', H1), Paragraph(f'Every income area in {state_name}, with the Direct (low-income) and Guaranteed (moderate-income) limits and the page of the USDA table each row comes from.', LEDE), Spacer(1, 8)]
    s.append(callout('Read it like this: find your county or metro area, then the column for your household size. Under the <b>Direct</b> limit means you can look at both loans; under <b>Guaranteed</b> only means the lender route. Metro rows apply to the counties in that metro; the exact address is confirmed on USDA\'s map.'))
    rows = [['Income area', 'Type', 'Direct 1–4', 'Direct 5–8', 'Guaranteed 1–4', 'Guaranteed 5–8', 'Page']]
    for a in areas:
        rows.append([a[0].replace(' HUD Metro FMR Area', ' (HUD metro)'), 'Metro' if a[3] else 'Rural', money(a[6]), money(a[7]), money(a[8]), money(a[9]), str(a[2])])
    s.append(tbl(rows, [2.7 * inch, 0.6 * inch, 0.85 * inch, 0.85 * inch, 0.95 * inch, 0.95 * inch, 0.45 * inch]))
    s += [Spacer(1, 6), Paragraph(SOURCE + f'. {len(areas)} income areas. Very-low-income limits and 38-year term limits are in the source table.', SMALL), Spacer(1, 8), Paragraph(DISCLAIMER, SMALL)]
    d.build(s, onFirstPage=chrome(f'{state_name} income limits'), onLaterPages=chrome(f'{state_name} income limits'))

# ---------------- 4. One-page framework poster (house style)
def poster():
    path = os.path.join(OUT, '3fs-rural-home-overview.pdf'); W, H = letter; c = canvas.Canvas(path, pagesize=letter)
    c.setTitle('3FS Rural Home overview'); c.setAuthor('3FS Rural Home (UnyKorn LLC)')
    c.setFillColor(CRIMSON); c.rect(0, H - 6, W, 6, fill=1, stroke=0)
    draw_mark(c, 0.55 * inch, H - 1.02 * inch, 0.58 * inch)
    c.setFillColor(INK); c.setFont('Helvetica-Bold', 22); c.drawString(1.25 * inch, H - 0.78 * inch, '3fs')
    c.setFillColor(INK); c.setFont('Helvetica-Bold', 16); c.drawString(1.9 * inch, H - 0.74 * inch, 'RURAL HOME: USDA LOAN FRAMEWORK')
    c.setFillColor(MUTED); c.setFont('Helvetica', 9.5); c.drawString(1.9 * inch, H - 0.94 * inch, 'One front door for USDA Single Family Housing loans: find, qualify, file, decide. Free for families.')
    # two band strips
    def band(x, y, w, label, text):
        c.setFillColor(PALE2); c.roundRect(x, y, w, 0.42 * inch, 5, fill=1, stroke=0); c.setFillColor(CRIMSON); c.rect(x, y, 4, 0.42 * inch, fill=1, stroke=0)
        c.setFillColor(INK); c.setFont('Helvetica-Bold', 9.5); c.drawString(x + 12, y + 0.24 * inch, label); c.setFillColor(MUTED); c.setFont('Helvetica', 8.5); c.drawString(x + 12, y + 0.1 * inch, text)
    band(0.55 * inch, H - 1.6 * inch, 3.6 * inch, 'THE SOURCE', 'FY2026 USDA table, fingerprinted; every number cites its page')
    band(4.35 * inch, H - 1.6 * inch, 3.6 * inch, 'THE DECISION', 'USDA Rural Development or an approved lender, never 3FS')
    # layout: left column 2.3in, center render 3.5in, right steps 2.1in
    LX = 0.55 * inch; CX = 2.9 * inch; RX = W - 2.55 * inch
    img_w = 2.9 * inch; img_h = 2.9 * inch; iy = H - 2.0 * inch - img_h
    c.drawImage(HERO, CX, iy, img_w, img_h, preserveAspectRatio=True, mask='auto')
    c.setFillColor(MUTED); c.setFont('Helvetica-Oblique', 8); c.drawCentredString(CX + img_w / 2, iy - 0.05 * inch, 'The 3FS mark: steel ring, crimson chevron, one record.')
    # left callouts
    c.setFillColor(INK); c.setFont('Helvetica-Bold', 9); c.drawString(LX, H - 1.95 * inch, 'THE CORE: WHO YOU ARE')
    for i, t in enumerate(['Family or buyer', 'Builder', 'Lender', 'Realtor', 'Nonprofit / packager', 'AI agent (x402)']):
        c.setFillColor(INK2); c.setFont('Helvetica', 8.5); c.drawString(LX + 4, H - 2.2 * inch - i * 0.2 * inch, '• ' + t)
    c.setFillColor(INK); c.setFont('Helvetica-Bold', 9); c.drawString(LX, H - 3.65 * inch, 'THE LAYERS')
    from reportlab.lib.utils import simpleSplit as _ss
    yy = H - 3.9 * inch
    for t in ['Place agent: ZIP to county to income area', 'Limits agent: Direct and Guaranteed by household size', 'Zones agent: rural type and Opportunity Zones', 'Match agent: everywhere nearby you qualify', 'Packet agent: documents, fingerprinted on your device']:
        for j, line in enumerate(_ss(('• ' if True else '') + t, 'Helvetica', 8.5, 2.25 * inch)):
            c.setFillColor(INK2); c.setFont('Helvetica', 8.5); c.drawString(LX + 4 + (10 if j else 0), yy, line); yy -= 0.17 * inch
        yy -= 0.05 * inch
    c.setFillColor(INK); c.setFont('Helvetica-Bold', 9); c.drawString(LX, yy - 0.12 * inch, 'THE PROMISE')
    for j, line in enumerate(_ss('Plain words. No number without its source page. Your documents never leave your device until you say so.', 'Helvetica', 8.5, 2.25 * inch)):
        c.setFillColor(INK2); c.setFont('Helvetica', 8.5); c.drawString(LX + 4, yy - 0.34 * inch - j * 0.17 * inch, line)
    # right: steps
    c.setFillColor(INK); c.setFont('Helvetica-Bold', 9); c.drawString(RX, H - 1.95 * inch, 'THE PATH')
    steps = [('STEP 1 · Qualify', 'ZIP + people + income: both limits'), ('STEP 2 · Pick a place', 'Rural type; nearby matches'), ('STEP 3 · Documents', 'Checklist, fingerprints'), ('STEP 4 · Packet check', 'Guide verifies every page'), ('STEP 5 · Loan review', 'USDA office or approved lender'), ('STEP 6 · Find or build', 'Eligible address confirmed'), ('STEP 7 · Closing, keys', 'Decision recorded')]
    for i, (a, b) in enumerate(steps):
        y = H - 2.3 * inch - i * 0.9 * inch
        c.setFillColor(colors.white); c.setStrokeColor(LINE); c.roundRect(RX, y - 0.1 * inch, 2.0 * inch, 0.5 * inch, 5, fill=1, stroke=1)
        c.setFillColor(CRIMSON); c.rect(RX, y - 0.1 * inch, 3, 0.5 * inch, fill=1, stroke=0)
        c.setFillColor(CRIMSON_DK); c.setFont('Helvetica-Bold', 8.5); c.drawString(RX + 10, y + 0.2 * inch, a); c.setFillColor(MUTED); c.setFont('Helvetica', 7.8); c.drawString(RX + 10, y + 0.04 * inch, b)
        if i < len(steps) - 1: c.setFillColor(STEEL); c.setFont('Helvetica', 8); c.drawCentredString(RX + 1.0 * inch, y - 0.33 * inch, '▼')
    # center-bottom: the three verdict chips
    cy = iy - 0.55 * inch
    for k, (t, col) in enumerate([('Direct loan', CRIMSON), ('Guaranteed loan', CRIMSON), ('Rural area', colors.HexColor('#B8860B'))]):
        cw = 0.9 * inch; cx0 = CX + k * (cw + 0.1 * inch)
        c.setFillColor(col); c.roundRect(cx0, cy, cw, 0.3 * inch, 8, fill=1, stroke=0); c.setFillColor(colors.white); c.setFont('Helvetica-Bold', 7.2); c.drawCentredString(cx0 + cw / 2, cy + 0.1 * inch, '✓ ' + t)
    for j, line in enumerate(_ss('The answer card: two limits, the area type, the source page. Then one button: Start my file.', 'Helvetica', 8.5, img_w)):
        c.setFillColor(INK2); c.setFont('Helvetica', 8.5); c.drawCentredString(CX + img_w / 2, cy - 0.25 * inch - j * 0.16 * inch, line)
    # center lower: how the money works
    by = cy - 0.95 * inch
    c.setFillColor(INK); c.setFont('Helvetica-Bold', 9); c.drawCentredString(CX + img_w / 2, by, 'WHO PAYS')
    for j, line in enumerate(['Families: free, always.', 'Pro (builders, realtors, lenders, nonprofits): $49 a month.', 'AI agents: $0.02 per check in USDC over x402.']):
        c.setFillColor(INK2); c.setFont('Helvetica', 8.5); c.drawCentredString(CX + img_w / 2, by - 0.2 * inch - j * 0.17 * inch, line)
    # bottom bands
    band(0.55 * inch, 1.75 * inch, 3.6 * inch, 'THE RAIL', 'Pro $49/mo for pros; agents pay $0.02 per check in USDC (x402)')
    band(4.35 * inch, 1.75 * inch, 3.6 * inch, 'THE PROOF', 'SHA-256 of the source table published; verify in your browser')
    # limits strip
    c.setFillColor(INK); c.setFont('Helvetica-Bold', 9); c.drawString(0.55 * inch, 1.48 * inch, 'FY2026 GUARANTEED FLOOR: $122,800 (1–4 people) · $162,100 (5–8). Used by 2,065 of 2,724 income areas.')
    c.setFillColor(MUTED); c.setFont('Helvetica', 7.5); c.drawString(0.55 * inch, 1.3 * inch, SOURCE)
    c.setFont('Helvetica', 7);
    from reportlab.lib.utils import simpleSplit
    for i, line in enumerate(simpleSplit(DISCLAIMER, 'Helvetica', 7, W - 1.1 * inch)): c.drawString(0.55 * inch, 1.05 * inch - i * 9, line)
    c.setFillColor(CRIMSON); c.setFont('Helvetica-Bold', 9); c.drawCentredString(W / 2, 0.5 * inch, '3fs validates the file. USDA or the lender decides. usda.3fs.app')
    c.save()

if __name__ == '__main__':
    program_guide(); checklist(); state_table('GA', 'Georgia'); poster()
    print('pdfs built:', sorted(os.listdir(OUT)))
