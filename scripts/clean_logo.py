# Make a logo's light background (white page, CI-sheet grid) transparent, crop to content,
# and optionally re-ink every remaining pixel in one colour.
# uv run --with pillow python clean_logo.py in.png out.png [--ink '#0F223F'] [--threshold 200]
import argparse
from PIL import Image

p = argparse.ArgumentParser()
p.add_argument('src'); p.add_argument('dst')
p.add_argument('--ink'); p.add_argument('--threshold', type=int, default=200)
a = p.parse_args()
im = Image.open(a.src).convert('RGBA')
px = im.load()
ink = tuple(int(a.ink[i:i + 2], 16) for i in (1, 3, 5)) if a.ink else None
for y in range(im.height):
    for x in range(im.width):
        r, g, b, al = px[x, y]
        lo = min(r, g, b)
        if al < 10 or (lo > a.threshold and max(r, g, b) - lo < 25):
            px[x, y] = (0, 0, 0, 0)
        elif ink:
            px[x, y] = (*ink, al)
bbox = im.getbbox()
if not bbox:
    raise SystemExit('nothing left after removing the background; lower --threshold')
im.crop(bbox).save(a.dst)
print(a.dst, im.crop(bbox).size)
