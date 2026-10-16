#!/usr/bin/env python3
"""Generates the logo wordmarks and the three glossy menu icons as SVG.

Original artwork for Misi Bijak. The wordmark uses the bundled Nunito Black font (SIL OFL 1.1).
Run from the repository root:  python3 android/art/gen/ui_art.py
"""
import math
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "svg"
FONT = "../../app/src/main/res/font/nunito_black.ttf"   # relative to android/art/svg

def logo(name, line1_stops, depth1):
    W, H = 1600, 480
    g1 = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in line1_stops)
    defs = f"""
    <style>@font-face {{ font-family: 'NunitoBlack'; src: url('{FONT}'); font-weight: 900; }}
      text {{ font-family: 'NunitoBlack'; font-weight: 900; text-anchor: middle; stroke-linejoin: round; }}</style>
    <linearGradient id="f1" x1="0" y1="0" x2="0" y2="1">{g1}</linearGradient>
    <linearGradient id="f2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E3F0FF"/></linearGradient>
    <clipPath id="c1"><rect x="0" y="0" width="{W}" height="112"/></clipPath>
    <clipPath id="c2"><rect x="0" y="240" width="{W}" height="94"/></clipPath>"""
    defs += ('<linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.75"/>'
             '<stop offset="1" stop-color="#fff" stop-opacity="0.05"/></linearGradient>'
             '<filter id="drop" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>'
             '<filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5"/></filter>')

    def line(text, y, size, fill, clip, depth):
        base = f'x="{W / 2}" y="{y}" font-size="{size}"'
        return (f'<text {base} fill="#0E1A33" stroke="#0E1A33" stroke-width="66" transform="translate(0,18)" opacity="0.35" filter="url(#drop)">{text}</text>'
                f'<text {base} fill="#fff" stroke="#fff" stroke-width="64" opacity="0.97">{text}</text>'
                f'<text {base} fill="{depth}" stroke="{depth}" stroke-width="46" transform="translate(0,14)">{text}</text>'
                f'<text {base} fill="#0E1A33" stroke="#0E1A33" stroke-width="46">{text}</text>'
                f'<text {base} fill="{depth}" transform="translate(0,7)">{text}</text>'
                f'<text {base} fill="url(#{fill})">{text}</text>'
                f'<g clip-path="url(#{clip})"><text {base} fill="url(#gloss)" opacity="0.6">{text}</text></g>')

    def sparkle(x, y, r):
        d = f"M{x},{y - r} Q{x + r * 0.18},{y - r * 0.18} {x + r},{y} Q{x + r * 0.18},{y + r * 0.18} {x},{y + r} Q{x - r * 0.18},{y + r * 0.18} {x - r},{y} Q{x - r * 0.18},{y - r * 0.18} {x},{y - r} Z"
        return f'<path d="{d}" fill="#FFE97A" filter="url(#glow)" opacity="0.9"/><path d="{d}" fill="#FFFFFF"/>'

    body = (line("Misi Bijak", 176, 176, "f1", "c1", depth1)
            + line("Bahasa Melayu", 402, 190, "f2", "c2", "#9FB6D8")
            + sparkle(1262, 58, 30) + sparkle(1310, 112, 16) + sparkle(338, 70, 22) + sparkle(1540, 244, 20))
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
    defs = (f'<radialGradient id="b" cx="0.38" cy="0.28" r="0.85"><stop offset="0" stop-color="{base_top}"/><stop offset="1" stop-color="{base_bottom}"/></radialGradient>'
            '<linearGradient id="ring" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.6" stop-color="#EEF3FA"/><stop offset="1" stop-color="#B9C6DA"/></linearGradient>'
            '<linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
            '<filter id="sb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>'
            '<filter id="gs" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>'
            '<clipPath id="disc"><circle cx="128" cy="124" r="100"/></clipPath>')
    body = ('<ellipse cx="128" cy="238" rx="88" ry="12" fill="#0E1A33" opacity="0.28" filter="url(#gs)"/>'
            '<circle cx="128" cy="126" r="113" fill="#0E1A33" opacity="0.25"/>'
            '<circle cx="128" cy="124" r="112" fill="url(#ring)"/>'
            '<circle cx="128" cy="124" r="100" fill="url(#b)"/>'
            '<g clip-path="url(#disc)"><circle cx="128" cy="124" r="100" fill="none" stroke="#000" stroke-width="18" opacity="0.28" filter="url(#sb)" transform="translate(0,8)"/>'
            '<ellipse cx="150" cy="210" rx="90" ry="40" fill="#000" opacity="0.18" filter="url(#sb)"/></g>'
            '<path d="M44,112 C50,62 88,34 128,34 C168,34 206,62 212,112 C180,90 76,90 44,112 Z" fill="url(#gl)"/>'
            '<g filter="url(#gs)" opacity="0.45" transform="translate(0,8)">' + glyph.replace('fill="#fff"', 'fill="#0E1A33"') + '</g>'
            + glyph)
    (OUT / f"{name}.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}" viewBox="0 0 {S} {S}"><defs>{defs}</defs>{body}</svg>\n')

def glyph_wrap(inner):
    return f'<g transform="translate(0,6)"><g fill="#fff">{inner}</g></g>'

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    logo("logo_splash", [(0, "#FFF65A"), (1, "#FFD000")], "#A86A00")
    logo("logo_menu", [(0, "#FFB52E"), (1, "#FF7A00")], "#8A3D00")
    gear_inner = (f'<path d="{gear(128, 120, 58, 46)}"/>'
                  '<circle cx="128" cy="120" r="22" fill="#1F6FE0"/>')
    # the hub is cut out by painting it in the base colour in the white layer only
    gear_glyph = (f'<g transform="translate(0,6)"><path d="{gear(128, 120, 58, 46)}" fill="#fff"/><circle cx="128" cy="120" r="22" fill="#1F6FE0"/></g>')
    icon("icon_settings", "#5AA2FF", "#1952C4", gear_glyph)
    person_inner = '<circle cx="128" cy="92" r="30"/><path d="M70,186 C70,142 100,128 128,128 C156,128 186,142 186,186 Z"/>'
    icon("icon_profile", "#38B44F", "#0F6B2A", glyph_wrap(person_inner))
    exit_inner = ('<path d="M84,70 L150,70 L150,92 L106,92 L106,156 L150,156 L150,178 L84,178 Z"/>'
                  '<path d="M138,108 L174,108 L174,90 L206,124 L174,158 L174,140 L138,140 Z"/>')
    icon("icon_exit", "#7F8EFA", "#3A4BC0", glyph_wrap(exit_inner))
    print("logo and icon SVGs written to", OUT)
