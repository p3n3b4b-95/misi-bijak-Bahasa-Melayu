#!/usr/bin/env python3
"""Side-by-side comparison image: design-board crop vs real Android screenshots.

Usage: tools/make-comparison.py <out.png> "<label 1>" <image 1> ["<label 2>" <image 2> ...]
All images are scaled to the same height; nothing is edited or retouched.
"""
import sys
from PIL import Image, ImageDraw, ImageFont

def main(out, pairs, h=1000):
    items = [(label, Image.open(path).convert("RGB")) for label, path in pairs]
    items = [(l, i.resize((round(i.width * h / i.height), h), Image.LANCZOS)) for l, i in items]
    pad, bar = 24, 56
    w = sum(i.width for _, i in items) + pad * (len(items) + 1)
    sheet = Image.new("RGB", (w, h + bar + pad), (245, 245, 245))
    d = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.load_default(size=24)
    except TypeError:
        font = ImageFont.load_default()
    x = pad
    for label, im in items:
        d.text((x, 14), label, fill=(20, 33, 61), font=font)
        sheet.paste(im, (x, bar))
        x += im.width + pad
    sheet.save(out)
    print(out, sheet.size)

if __name__ == "__main__":
    args = sys.argv[1:]
    if len(args) < 3 or len(args) % 2 == 0:
        sys.exit(__doc__)
    out, rest = args[0], args[1:]
    main(out, list(zip(rest[0::2], rest[1::2])))
