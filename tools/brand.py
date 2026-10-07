#!/usr/bin/env python3
"""Builds the 3FS brand set from the hero render:
  public/brand/3fs-mark.svg          vector mark (steel ring + crimson chevron), crisp at any size
  public/brand/3fs-mark-white.svg    for dark bands
  public/brand/3fs-hero.png / .webp  the real render, background cleaned to pure white, 1024px
  public/brand/3fs-hero.mp4          the animation, trimmed and muted, for the hero
  public/icon-512.png, icon-192.png, apple-touch-icon.png, favicon.ico
  public/og.png                      share card using the real render
  public/manifest.webmanifest
"""
import sys, os, subprocess, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter

PUB = sys.argv[1]
SRC = sys.argv[2]   # hero jpg
VID = sys.argv[3] if len(sys.argv) > 3 else None
os.makedirs(os.path.join(PUB, 'brand'), exist_ok=True)

CRIMSON = '#B3121F'; CRIMSON_DK = '#7A0B14'; CRIMSON_LT = '#E0343F'
STEEL = '#8D939B'; STEEL_DK = '#4F555D'; STEEL_LT = '#D6DADF'

def mark_svg(on_dark=False):
    ring_dark = '#C7CBD1' if on_dark else '#3F444B'
    ring_mid = '#ECEEF0' if on_dark else '#8A9099'
    ring_lt = '#FFFFFF' if on_dark else '#E3E6EA'
    seam = '#9AA0A7' if on_dark else '#2B2F34'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="3FS">
<defs>
  <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{ring_lt}"/><stop offset=".5" stop-color="{ring_mid}"/><stop offset="1" stop-color="{ring_dark}"/></linearGradient>
  <linearGradient id="steel2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{ring_lt}"/><stop offset=".5" stop-color="{ring_mid}"/><stop offset="1" stop-color="{ring_dark}"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{CRIMSON_LT}"/><stop offset=".5" stop-color="{CRIMSON}"/><stop offset="1" stop-color="{CRIMSON_DK}"/></linearGradient>
  <linearGradient id="glassL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{CRIMSON_DK}"/><stop offset="1" stop-color="{CRIMSON}"/></linearGradient>
  <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FF7A6B" stop-opacity=".9"/><stop offset="1" stop-color="#FF7A6B" stop-opacity="0"/></radialGradient>
</defs>
<!-- segmented steel ring: three heavy plates with seams, like the render -->
<g stroke-linecap="butt" fill="none">
  <path d="M 262 38 A 218 218 0 0 1 470 212" stroke="url(#steel)" stroke-width="62"/>
  <path d="M 474 296 A 218 218 0 0 1 318 466" stroke="url(#steel2)" stroke-width="62"/>
  <path d="M 214 470 A 218 218 0 0 1 36 234" stroke="url(#steel)" stroke-width="62"/>
  <!-- plate seams -->
  <path d="M 262 38 A 218 218 0 0 1 470 212 M 474 296 A 218 218 0 0 1 318 466 M 214 470 A 218 218 0 0 1 36 234" stroke="{seam}" stroke-width="2" stroke-opacity=".55"/>
  <path d="M 262 60 A 196 196 0 0 1 450 216 M 452 294 A 196 196 0 0 1 316 446 M 214 448 A 196 196 0 0 1 58 236" stroke="#fff" stroke-opacity=".55" stroke-width="3"/>
  <!-- rivets -->
  <g fill="{seam}" fill-opacity=".6" stroke="none"><circle cx="330" cy="54" r="4"/><circle cx="430" cy="130" r="4"/><circle cx="452" cy="396" r="4"/><circle cx="380" cy="456" r="4"/><circle cx="120" cy="430" r="4"/><circle cx="52" cy="320" r="4"/></g>
</g>
<!-- glow behind the chip -->
<circle cx="256" cy="300" r="70" fill="url(#glow)"/>
<!-- crimson chevron "A" with inner cut, lit from the left -->
<path d="M 256 104 L 404 404 L 338 404 L 256 236 L 174 404 L 108 404 Z" fill="url(#glass)"/>
<path d="M 256 104 L 174 404 L 108 404 Z" fill="url(#glassL)" fill-opacity=".55"/>
<path d="M 256 104 L 308 210 L 256 236 L 204 210 Z" fill="url(#shine)"/>
<!-- detached shard, top right, bold -->
<path d="M 332 72 L 418 118 L 362 190 L 338 142 Z" fill="url(#glass)"/>
<path d="M 332 72 L 418 118 L 372 128 Z" fill="url(#shine)"/>
<!-- the $ chip -->
<rect x="232" y="276" width="48" height="48" rx="9" fill="#FFF4F3"/>
<rect x="232" y="276" width="48" height="48" rx="9" fill="none" stroke="{CRIMSON}" stroke-width="3"/>
<text x="256" y="311" text-anchor="middle" font-family="Archivo, Arial, sans-serif" font-weight="800" font-size="30" fill="{CRIMSON}">$</text>
</svg>'''

open(os.path.join(PUB, 'brand', '3fs-mark.svg'), 'w').write(mark_svg())
open(os.path.join(PUB, 'brand', '3fs-mark-white.svg'), 'w').write(mark_svg(on_dark=True))

# ---- clean the hero render to pure white background
im = Image.open(SRC).convert('RGB')
W, H = im.size
# crop the "site is white and crimson" note and red wall: keep the object, replace near-white/near-red backgrounds
px = im.load()
def is_bg(r, g, b):
    if r > 228 and g > 228 and b > 228: return True            # white wall / floor
    return False
# flood-fill from corners for white regions only; red wall gets covered by a crop
mask = Image.new('L', (W, H), 0)
from collections import deque
seen = bytearray(W * H)
q = deque([(0, 0), (W - 1, 0), (0, H - 1), (W - 1, H - 1), (W // 2, 0), (W - 1, H // 2)])
while q:
    x, y = q.popleft()
    if x < 0 or y < 0 or x >= W or y >= H or seen[y * W + x]: continue
    seen[y * W + x] = 1
    r, g, b = px[x, y]
    if not is_bg(r, g, b): continue
    mask.putpixel((x, y), 255)
    q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
white = Image.new('RGB', (W, H), (255, 255, 255))
hero = Image.composite(white, im, mask)
# crop: drop the top-right note and left red wall by framing the object
hero = hero.crop((118, 96, 936, 1000))
d0 = ImageDraw.Draw(hero)
# left red wall remnant and floor edge: fill anything strongly red near the left edge, above the base
hp = hero.load()
for y in range(0, 560):
    for x in range(0, 70):
        r,g,b = hp[x,y]
        if r > 120 and g < 80 and b < 90: hp[x,y] = (255,255,255)
hero = hero.resize((1024, int(1024*hero.height/hero.width)), Image.LANCZOS)
# paint the left red wall band white (it sits in the leftmost ~120px of the crop)
d = ImageDraw.Draw(hero)
hero.save(os.path.join(PUB, 'brand', '3fs-hero.png'), optimize=True)
hero.save(os.path.join(PUB, 'brand', '3fs-hero.webp'), quality=84)

# ---- icons from the vector mark (rasterize via cairosvg if present, else PIL approximation)
def raster(svg_path, size):
    try:
        import cairosvg
        png = cairosvg.svg2png(url=svg_path, output_width=size, output_height=size)
        import io; return Image.open(io.BytesIO(png)).convert('RGBA')
    except Exception:
        out = subprocess.run(['rsvg-convert', '-w', str(size), '-h', str(size), svg_path], capture_output=True)
        import io; return Image.open(io.BytesIO(out.stdout)).convert('RGBA')
mark = raster(os.path.join(PUB, 'brand', '3fs-mark.svg'), 1024)
def tile(size, pad_ratio=0.12, bg=(255, 255, 255)):
    t = Image.new('RGBA', (size, size), bg + (255,))
    m = mark.resize((int(size * (1 - 2 * pad_ratio)),) * 2, Image.LANCZOS)
    t.alpha_composite(m, (int(size * pad_ratio), int(size * pad_ratio)))
    return t
tile(512).save(os.path.join(PUB, 'icon-512.png'))
tile(192).save(os.path.join(PUB, 'icon-192.png'))
tile(180, 0.14).convert('RGB').save(os.path.join(PUB, 'apple-touch-icon.png'))
ico = tile(64, 0.06); ico.save(os.path.join(PUB, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
tile(512, 0.1).save(os.path.join(PUB, 'brand', '3fs-mark-512.png'))

# ---- OG share card with the real render
def font(sz, bold=True):
    return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', sz)
og = Image.new('RGB', (1200, 630), (255, 255, 255)); d = ImageDraw.Draw(og)
d.rectangle((0, 0, 1200, 10), fill=(179, 18, 31))
h = hero.copy(); h.thumbnail((520, 520)); og.paste(h, (660, 70))
d.text((70, 90), '3fs', font=font(44), fill=(31, 35, 40)); d.text((150, 102), 'RURAL HOME', font=font(22), fill=(179, 18, 31))
d.text((70, 190), 'Can I get a USDA', font=font(60), fill=(31, 35, 40)); d.text((70, 262), 'home loan here?', font=font(60), fill=(31, 35, 40))
d.text((70, 360), 'Free check. FY2026 income limits for every ZIP,', font=font(26, False), fill=(79, 85, 93))
d.text((70, 398), 'with the source page for every number.', font=font(26, False), fill=(79, 85, 93))
x = 70
for t in ['Direct loan', 'Guaranteed loan', 'Rural area']:
    w = d.textlength(t, font=font(24)) + 64
    d.rounded_rectangle((x, 470, x + w, 526), radius=28, fill=(179, 18, 31)); d.text((x + 30, 498), '✓ ' + t, font=font(24), fill='white', anchor='lm'); x += w + 14
d.text((70, 580), 'usda.3fs.app  ·  not USDA  ·  free for families', font=font(20, False), fill=(79, 85, 93))
og.save(os.path.join(PUB, 'og.png'), optimize=True)

# ---- manifest
json.dump({'name': '3FS Rural Home', 'short_name': '3FS Rural', 'start_url': '/', 'display': 'standalone', 'background_color': '#ffffff', 'theme_color': '#B3121F',
           'icons': [{'src': '/icon-192.png', 'sizes': '192x192', 'type': 'image/png'}, {'src': '/icon-512.png', 'sizes': '512x512', 'type': 'image/png'}]},
          open(os.path.join(PUB, 'manifest.webmanifest'), 'w'))

# ---- hero video: trim to 8s, mute, 720p, small
if VID and os.path.exists(VID):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', VID, '-t', '8', '-an', '-vf', 'scale=960:-2', '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-movflags', '+faststart', '-pix_fmt', 'yuv420p', os.path.join(PUB, 'brand', '3fs-hero.mp4')])
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '7.5', '-i', VID, '-frames:v', '1', '-vf', 'scale=960:-2', os.path.join(PUB, 'brand', '3fs-hero-poster.jpg')])
print('brand built')
