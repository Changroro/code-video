# Style: toon

A bright modern cartoon: flat saturated colour with one cel-shade tone, thick even ink outlines, squash-and-stretch bounces, letters that pop, sparkles, and iris transitions. Original to this skill.

## Signature (every item must be on screen)
| # | Item | How (`toon.js`) |
|---|---|---|
| 1 | Flat colour fields: a sky with rolling hills, radiating stripes, or polka dots | `toonBG('sky' | 'burst' | 'dots', t, { a, b })` |
| 2 | Every shape filled flat, shaded with one crescent tone, and outlined in thick even ink | `toonShape(path, fill, { shade, off })` |
| 3 | Characters that bounce with squash and stretch and react with big eyes | `bounce(t, t0)` → `[sx, sy, dy]`, `buddy(x, y, s, t, { sq, mood, look })` |
| 4 | Chunky titles whose letters pop in one by one and wave | `toonText(s, x, y, t, { a })`, `pop(t, a)` |
| 5 | Signs and props the characters hold up | `toonSign(s, x, y, t, a)` |
| 6 | Sparkles on good news, smear lines on fast moves | `sparkles(x, y, r, t)`, `smear(x0, x1, y, h, p)` |
| 7 | Iris transitions between scenes | `iris(p, cx, cy)` closing on the subject, `iris(1 - p)` opening |

## Look
- **Palette**: ink `#1b1b1f`, sky `#7fd0ff`, grass `#79d65a`, sun `#ffd43b`, pink `#ff6fb1`, orange `#ff8a3d`, purple `#8b6cff`. Use the brand colour for the main character or the title fill.
- **Fonts**: `TOON` Fredoka (bold) for Latin, Jua for Hangul through `unicode-range`.
- **Lines**: one outline width (`TN.line`, 9 px at 1080p) everywhere; no sketchy wobble.
- **Motion**: every entrance overshoots (`pop`), every landing squashes (`bounce`), nothing moves linearly.

## Story shapes that fit
A how-it-works explainer with a character who tries it, a before/after gag, a list of features as quick sketches.

## Sound
`audio.py` with a bouncy major bed (energy .6–.9); `pop` on each letter group, `ping` on sparkles, `whoosh` on the iris.
