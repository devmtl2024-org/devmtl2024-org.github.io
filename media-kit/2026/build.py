#!/usr/bin/env python3
"""Generate /dev/mtl 2026 media-partner cards (social + calendar, FR + EN).

Composes each card as an SVG (event photo + navy brand overlay + hexagon mark
+ wordmark + date/venue + tagline) and renders it to PNG with rsvg-convert.
Re-run after tweaking COPY or LAYOUT below.
"""
import subprocess
from pathlib import Path

HERE = Path(__file__).parent

PRIMARY = "#01055E"     # navy
SECONDARY = "#ff9b62"   # orange
OVERLAY_OPACITY = 0.72

# Hexagon mark from src/assets/logo.svg (nominal box ~253 x 235)
MARK_INNER = "M124.55,75.55c1.55-.9,3.47-.9,5.02,0l28.58,16.5c1.55.9,2.51,2.55,2.51,4.35v33c0,1.79-.96,3.45-2.51,4.35l-28.58,16.5c-1.55.9-3.47.9-5.02,0l-28.58-16.5c-1.55-.9-2.51-2.55-2.51-4.35v-33c0-1.79.96-3.45,2.51-4.35l28.58-16.5Z"
MARK_RING = "M75.45,0c-8.45-.03-16.27,4.45-20.52,11.75l-21.77,37.41c8.39,4.88,19.14,2.04,24.03-6.35l12.93-22.22c1.09-1.88,3.1-3.03,5.27-3.02l25.71.09c9.71.03,17.6-7.81,17.63-17.51L75.45,0ZM135,.2c-.03,9.7,7.81,17.6,17.51,17.63l25.71.09c2.17,0,4.17,1.17,5.25,3.06l12.78,22.31c4.82,8.42,15.56,11.34,23.98,6.51l-21.51-37.55c-4.2-7.33-11.99-11.87-20.44-11.89l-43.28-.15ZM228.32,63.92c-8.42,4.82-11.34,15.56-6.51,23.98l12.78,22.31c1.08,1.88,1.07,4.2-.02,6.08l-12.93,22.22c-4.88,8.39-2.04,19.14,6.35,24.03l21.77-37.41c4.25-7.3,4.28-16.32.08-23.65l-21.51-37.55ZM219.79,176.59c-8.39-4.88-19.14-2.04-24.02,6.35l-12.93,22.22c-1.09,1.88-3.1,3.03-5.27,3.02l-25.71-.09c-9.7-.03-17.6,7.81-17.63,17.51l43.28.15c8.45.03,16.27-4.45,20.52-11.75l21.77-37.41ZM117.95,225.55c.03-9.7-7.81-17.6-17.51-17.63l-25.71-.09c-2.17,0-4.17-1.17-5.25-3.06l-12.78-22.31c-4.82-8.42-15.56-11.34-23.98-6.51l21.51,37.55c4.2,7.33,11.99,11.86,20.44,11.89l43.28.15ZM24.64,161.83c8.42-4.82,11.34-15.56,6.51-23.98l-12.78-22.31c-1.08-1.88-1.07-4.2.02-6.08l12.93-22.22c4.88-8.39,2.04-19.14-6.35-24.03L3.21,100.63c-4.25,7.3-4.28,16.32-.08,23.65l21.51,37.56Z"
MARK_BOX = 253.0  # nominal width == height used for centering

SANS = "Helvetica Neue"
MONO = "Menlo"

COPY = {
    "fr": {
        "social_date": "27 NOVEMBRE 2026 · UNIVERSITÉ CONCORDIA · MONTRÉAL",
        "cal_date": "27 NOV 2026 · UNIVERSITÉ CONCORDIA",
        "tagline": "Partagez la passion. Découvrez l'innovation.",
    },
    "en": {
        "social_date": "NOVEMBER 27, 2026 · CONCORDIA UNIVERSITY · MONTREAL",
        "cal_date": "NOV 27, 2026 · CONCORDIA UNIVERSITY",
        "tagline": "Share the passion. Discover the innovation.",
    },
}


def mark_group(cx, top, height):
    s = height / 234.81
    tx = cx - (MARK_BOX * s) / 2
    return (
        f'<g transform="translate({tx:.2f},{top:.2f}) scale({s:.4f})" fill="#ffffff">'
        f'<path d="{MARK_INNER}"/><path d="{MARK_RING}"/></g>'
    )


def card(width, height, layout, date_text, tagline):
    cx = width / 2
    return f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <image xlink:href="base.jpg" x="0" y="0" width="{width}" height="{height}" preserveAspectRatio="xMidYMid slice"/>
  <rect x="0" y="0" width="{width}" height="{height}" fill="{PRIMARY}" opacity="{OVERLAY_OPACITY}"/>
  {mark_group(cx, layout["mark_top"], layout["mark_h"])}
  <text x="{cx}" y="{layout["title_y"]}" text-anchor="middle" font-family="{MONO}" font-weight="700" font-size="{layout["title_size"]}" fill="#ffffff">/dev/mtl<tspan dx="{layout["title_size"]*0.55:.0f}" fill="{SECONDARY}">2026</tspan></text>
  <rect x="{cx - layout["rule_w"]/2:.1f}" y="{layout["rule_y"]}" width="{layout["rule_w"]}" height="4" fill="{SECONDARY}"/>
  <text x="{cx}" y="{layout["date_y"]}" text-anchor="middle" font-family="{SANS}" font-weight="600" font-size="{layout["date_size"]}" letter-spacing="{layout["date_spacing"]}" fill="#ffffff">{date_text}</text>
  <text x="{cx}" y="{layout["tag_y"]}" text-anchor="middle" font-family="{SANS}" font-style="italic" font-size="{layout["tag_size"]}" fill="#ffffff" opacity="0.95">{tagline}</text>
</svg>'''


SOCIAL = dict(mark_top=110, mark_h=104, title_y=322, title_size=82,
              rule_y=352, rule_w=80, date_y=406, date_size=25, date_spacing=3,
              tag_y=452, tag_size=24)
CALENDAR = dict(mark_top=104, mark_h=74, title_y=258, title_size=50,
                rule_y=286, rule_w=64, date_y=324, date_size=18, date_spacing=2,
                tag_y=360, tag_size=18)

JOBS = [
    ("social", 1200, 600, SOCIAL, "social_date"),
    ("calendar", 700, 500, CALENDAR, "cal_date"),
]

for kind, w, h, layout, date_key in JOBS:
    for lang in ("fr", "en"):
        svg = card(w, h, layout, COPY[lang][date_key], COPY[lang]["tagline"])
        base = f"{kind}-{lang}-{w}x{h}"
        svg_path = HERE / f"{base}.svg"
        png_path = HERE / f"{base}.png"
        svg_path.write_text(svg, encoding="utf-8")
        subprocess.run(
            ["rsvg-convert", "-w", str(w), "-h", str(h),
             "-o", str(png_path), str(svg_path)],
            cwd=HERE, check=True,
        )
        print(f"wrote {png_path.name}")
