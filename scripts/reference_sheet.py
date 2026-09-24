"""Put the credited original's frames above frames from your video, to check the signature items side by side.

    uv run --with pillow python reference_sheet.py <key> <video.mp4> <out.jpg>

<key> is the file name in docs/styles/ (handdrawn, motion, sand, lyric, beat).
"""
import pathlib
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw

TW, TH, N = 480, 270, 8


def frames(video, n):
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video]))
    out = []
    with tempfile.TemporaryDirectory() as d:
        for i in range(n):
            p = pathlib.Path(d) / f"{i}.png"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{dur * (i + .5) / n:.2f}", "-i", video,
                            "-frames:v", "1", "-vf", f"scale={TW}:{TH}:force_original_aspect_ratio=decrease,pad={TW}:{TH}:(ow-iw)/2:(oh-ih)/2", str(p)], check=True)
            out.append(Image.open(p).convert("RGB"))
    return out


def main(key, video, out):
    ref = pathlib.Path(__file__).resolve().parent.parent / "docs" / "styles" / f"{key}.jpg"
    if not ref.exists():
        raise SystemExit(f"no reference frames: {ref}")
    strip = Image.open(ref).convert("RGB")
    orig = [strip.crop((strip.width * i // 4, 0, strip.width * (i + 1) // 4, strip.height)).resize((TW, TH)) for i in range(4)]
    mine = frames(video, N)
    sheet = Image.new("RGB", (TW * 4, 40 + TH + 40 + TH * 2), "#111")
    d = ImageDraw.Draw(sheet)
    d.text((10, 12), f"original ({ref.name})", fill="#fff")
    for i, im in enumerate(orig):
        sheet.paste(im, (i * TW, 40))
    d.text((10, 40 + TH + 12), f"this video ({pathlib.Path(video).name}), {N} frames in order", fill="#fff")
    for i, im in enumerate(mine):
        sheet.paste(im, ((i % 4) * TW, 80 + TH + (i // 4) * TH))
    sheet.save(out, quality=88)
    print(out)


if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise SystemExit(__doc__)
    main(*sys.argv[1:])
