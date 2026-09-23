# Tile stills/t<sec>.png into review sheets of 6 (2x3), labelled with their time.
# uv run --with pillow python contact_sheet.py <stills_dir> <out_dir>
import glob, os, sys
from PIL import Image, ImageDraw

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
files = sorted(glob.glob(os.path.join(src, 't*.png')), key=lambda f: float(os.path.basename(f)[1:-4]))
if not files:
    sys.exit(f'no stills in {src}')
for n in range(0, len(files), 6):
    first = Image.open(files[n])
    tw, th = 800, round(800 * first.height / first.width)
    sheet = Image.new('RGB', (tw * 2, th * 3), 'black')
    for i, f in enumerate(files[n:n + 6]):
        im = Image.open(f).convert('RGB').resize((tw, th))
        ImageDraw.Draw(im).text((8, 8), os.path.basename(f)[1:-4] + 's', fill='red')
        sheet.paste(im, ((i % 2) * tw, (i // 2) * th))
    path = os.path.join(out, f'sheet{n // 6}.png')
    sheet.save(path)
    print(path)
