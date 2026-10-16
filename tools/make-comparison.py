#!/usr/bin/env python3
"""Side-by-side comparison image: design-board crop (left) vs real Android screenshot (right).

Usage: tools/make-comparison.py <board-crop.png> <screenshot.png> <out.png> "<left label>" "<right label>"
Both images are scaled to the same height; nothing is edited or retouched.
"""
import sys
from PIL import Image, ImageDraw, ImageFont

def main(board, shot, out, left, right):
    a = Image.open(board).convert("RGB")
    b = Image.open(shot).convert("RGB")
    h = 900
    a = a.resize((round(a.width * h / a.height), h), Image.LANCZOS)
    b = b.resize((round(b.width * h / b.height), h), Image.LANCZOS)
    pad, bar = 24, 48
    w = a.width + b.width + pad * 3
    sheet = Image.new("RGB", (w, h + bar + pad), (245, 245, 245))
    d = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.load_default(size=22)
    except TypeError:
        font = ImageFont.load_default()
    d.text((pad, 12), left, fill=(20, 33, 61), font=font)
    d.text((pad * 2 + a.width, 12), right, fill=(20, 33, 61), font=font)
    sheet.paste(a, (pad, bar))
    sheet.paste(b, (pad * 2 + a.width, bar))
    sheet.save(out)
    print(out, sheet.size)

if __name__ == "__main__":
    if len(sys.argv) != 6:
        sys.exit(__doc__)
    main(*sys.argv[1:])
