# Style: hero comic

A superhero comic book come to life: newsprint pages, thick ink panels, Ben-Day halftone, yellow narration boxes, speech balloons, burst lettering, and a red title slab over flipping pages. Original to this skill. It evokes the genre; never use a real publisher's or studio's name, logo, or characters.

## Signature (every item must be on screen)
| # | Item | How (`comic.js`) |
|---|---|---|
| 1 | Pages of panels with thick ink borders and white gutters on newsprint; slanted panels for action beats | `comicPaper()`, `pageGrid(rows)`, `panel(rect or quad, draw, { p })` |
| 2 | Ben-Day halftone for shading, skies, and backgrounds | `halftone(x, y, w, h, color, { dot, gap, fade, dir })`, `inked(path, fill)` |
| 3 | Yellow narration boxes in uppercase comic lettering | `caption(s, x, y, { p })` |
| 4 | Speech or thought balloons with tails | `balloon(s, x, y, tailX, tailY, p, { thought })` |
| 5 | Sound effects in burst shapes (POW!, ZAP!, BOOM!) on impact beats | `sfx(word, x, y, p)`, `burstShape`, `comicText` |
| 6 | Focus lines behind the hero moment | `actionLines(cx, cy, p)` inside a panel |
| 7 | Opening: pages flip past under a red title slab; scene changes turn the page | `titleSlab(title, t, pages)`, `pageTurn(p, drawNext)` |

## Look
- **Palette**: newsprint `#f4ecd6`, ink `#141414`, comic red `#e23b2e`, yellow `#ffd43b`, blue `#2a6fdb`, cyan `#59c3e8`; put the brand colour on the hero's costume or the title slab.
- **Fonts**: `COMIC` Bangers for Latin; pair it with Do Hyeon (or Black Han Sans) for Hangul through `unicode-range`.
- **Characters**: flat bold shapes with 7–9 px ink outlines and halftone shading (`inked`). A logo mascot can be the hero; a pixel mini drawn large with an ink outline also works.
- **Pacing**: a page holds 2–4 s while panels pop in one by one; hits land on a `sfx`.

## Story shapes that fit
An origin story (the problem, the power, the first win), a team-up (features as heroes), a villain (the pain) defeated by the product.

## Sound
`audio.py` with an energetic bed; `thud` or `whoosh` under each `sfx`, `pop` as panels appear, a page-flip `whoosh` on `pageTurn`.
