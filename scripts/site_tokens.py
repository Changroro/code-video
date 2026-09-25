"""Pull design tokens from a live site when no DESIGN.md or Refero style is available.

    uv run python site_tokens.py https://example.com > tokens.json

Reads the page and its stylesheets and reports the most used colours, font families, corner radii,
colours on button-like selectors, and CSS custom properties. It is evidence for choosing brand.js tokens,
not the tokens themselves: confirm the choices against a screenshot of the site.
"""
import collections
import json
import re
import sys
import urllib.parse
import urllib.request

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
COLOR = re.compile(r"#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b|rgba?\([^)]*\)")


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode(r.headers.get_content_charset() or "utf-8", "replace")


def norm(c):
    c = c.lower().replace(" ", "")
    if re.fullmatch(r"#[0-9a-f]{3}", c):
        c = "#" + "".join(ch * 2 for ch in c[1:])
    return c


def main(url):
    html = get(url)
    css = [m for m in re.findall(r"<style[^>]*>(.*?)</style>", html, re.S)]
    for href in re.findall(r'<link[^>]+rel=["\']?stylesheet["\']?[^>]*href=["\']([^"\']+)', html) + re.findall(r'<link[^>]+href=["\']([^"\']+\.css[^"\']*)', html):
        try:
            css.append(get(urllib.parse.urljoin(url, href)))
        except Exception as e:  # report and continue: one missing sheet should not hide the rest
            print(f"stylesheet failed: {href}: {e}", file=sys.stderr)
    text = "\n".join(css)
    if not text:
        raise SystemExit("no CSS found (the site may render styles with JavaScript); use a DESIGN.md or a Refero style instead")
    colors = collections.Counter(norm(c) for c in COLOR.findall(text))
    fonts = collections.Counter(f.strip().strip("'\"") for decl in re.findall(r"font-family\s*:\s*([^;}]+)", text) for f in decl.split(",")[:1])
    radii = collections.Counter(r.strip() for r in re.findall(r"border-radius\s*:\s*([^;}]+)", text))
    buttons = collections.Counter(norm(c) for sel, body in re.findall(r"([^{}]*(?:btn|button|cta)[^{}]*)\{([^}]*)\}", text, re.I)
                                  for c in COLOR.findall(" ".join(re.findall(r"background(?:-color)?\s*:\s*([^;]+)", body))))
    variables = dict(re.findall(r"(--[\w-]*(?:color|colour|bg|background|text|accent|brand|primary)[\w-]*)\s*:\s*([^;}]+)", text, re.I)[:60])
    title = re.search(r"<title>(.*?)</title>", html, re.S)
    print(json.dumps({
        "url": url,
        "title": title.group(1).strip() if title else None,
        "colors": colors.most_common(16),
        "button_backgrounds": buttons.most_common(6),
        "fonts": fonts.most_common(8),
        "radii": radii.most_common(8),
        "variables": variables,
    }, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    main(sys.argv[1])
