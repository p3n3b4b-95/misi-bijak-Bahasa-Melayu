#!/usr/bin/env python3
"""Generates the logo wordmarks and the three glossy menu icons as SVG.

Original artwork for Misi Bijak. The wordmark uses the bundled Nunito Black font (SIL OFL 1.1).
Run from the repository root:  python3 android/art/gen/ui_art.py
"""
import math
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "svg"
FONT = "../../app/src/main/res/font/nunito_black.ttf"   # relative to android/art/svg

def logo(name, line1_stops):
    W, H = 1600, 480
    g1 = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in line1_stops)
    defs = f"""
    <style>@font-face {{ font-family: 'NunitoBlack'; src: url('{FONT}'); font-weight: 900; }}
      text {{ font-family: 'NunitoBlack'; font-weight: 900; text-anchor: middle; stroke-linejoin: round; }}</style>
    <linearGradient id="f1" x1="0" y1="0" x2="0" y2="1">{g1}</linearGradient>
    <linearGradient id="f2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E3F0FF"/></linearGradient>
    <clipPath id="c1"><rect x="0" y="0" width="{W}" height="128"/></clipPath>
    <clipPath id="c2"><rect x="0" y="0" width="{W}" height="348"/></clipPath>"""
    def line(text, y, size, fill, clip):
        base = f'x="{W / 2}" y="{y}" font-size="{size}"'
        return (f'<text {base} fill="#fff" stroke="#fff" stroke-width="64" opacity="0.95">{text}</text>'
                f'<text {base} fill="#0E1A33" stroke="#0E1A33" stroke-width="50" transform="translate(0,10)" opacity="0.35">{text}</text>'
                f'<text {base} fill="#0E1A33" stroke="#0E1A33" stroke-width="46">{text}</text>'
                f'<text {base} fill="url(#{fill})">{text}</text>'
                f'<g clip-path="url(#{clip})"><text {base} fill="#fff" opacity="0.28">{text}</text></g>')
    body = line("Misi Bijak", 176, 176, "f1", "c1") + line("Bahasa Melayu", 402, 190, "f2", "c2")
    (OUT / f"{name}.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs>{defs}</defs>{body}</svg>\n')

def gear(cx, cy, r_out, r_in, teeth=8):
    pts = []
    for i in range(teeth * 4):
        ang = i * 2 * math.pi / (teeth * 4) - math.pi / 2
        r = r_out if i % 4 in (1, 2) else r_in
        pts.append((cx + math.cos(ang) * r, cy + math.sin(ang) * r))
    return "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + " Z"

def icon(name, base_top, base_bottom, glyph):
    S = 256
    defs = (f'<radialGradient id="b" cx="0.35" cy="0.25" r="0.9"><stop offset="0" stop-color="{base_top}"/><stop offset="1" stop-color="{base_bottom}"/></radialGradient>'
            '<linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>')
    body = ('<ellipse cx="128" cy="236" rx="86" ry="12" fill="#0E1A33" opacity="0.25"/>'
            '<circle cx="128" cy="124" r="112" fill="#fff"/>'
            '<circle cx="128" cy="124" r="100" fill="url(#b)"/>'
            '<ellipse cx="116" cy="70" rx="68" ry="38" fill="url(#gl)"/>'
            + glyph)
    (OUT / f"{name}.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}" viewBox="0 0 {S} {S}"><defs>{defs}</defs>{body}</svg>\n')

def glyph_wrap(inner):
    return f'<g transform="translate(0,6)"><g fill="#0E1A33" opacity="0.30" transform="translate(0,6)">{inner}</g><g fill="#fff">{inner}</g></g>'

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    logo("logo_splash", [(0, "#FFF65A"), (1, "#FFD000")])
    logo("logo_menu", [(0, "#FFB52E"), (1, "#FF7A00")])
    gear_inner = (f'<path d="{gear(128, 120, 58, 46)}"/>'
                  '<circle cx="128" cy="120" r="22" fill="#1F6FE0"/>')
    # the hub is cut out by painting it in the base colour in the white layer only
    gear_glyph = (f'<g transform="translate(0,6)"><path d="{gear(128, 120, 58, 46)}" fill="#0E1A33" opacity="0.30" transform="translate(0,6)"/>'
                  f'<path d="{gear(128, 120, 58, 46)}" fill="#fff"/><circle cx="128" cy="120" r="22" fill="#1F6FE0"/></g>')
    icon("icon_settings", "#5AA2FF", "#1952C4", gear_glyph)
    person_inner = '<circle cx="128" cy="92" r="30"/><path d="M70,186 C70,142 100,128 128,128 C156,128 186,142 186,186 Z"/>'
    icon("icon_profile", "#38B44F", "#0F6B2A", glyph_wrap(person_inner))
    exit_inner = ('<path d="M84,70 L150,70 L150,92 L106,92 L106,156 L150,156 L150,178 L84,178 Z"/>'
                  '<path d="M138,108 L174,108 L174,90 L206,124 L174,158 L174,140 L138,140 Z"/>')
    icon("icon_exit", "#7F8EFA", "#3A4BC0", glyph_wrap(exit_inner))
    print("logo and icon SVGs written to", OUT)
