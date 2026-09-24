# Look: hand-drawn + 8-bit minis (default)

Warm empty paper, a thin ink horizon, and an 8-bit mascot that acts out the story, cut against dark title cards and arcade screens.

Credit: adapted from [@nahiddotai](https://www.threads.com/@nahiddotai)'s ["Introducing Opus 5.5" launch video](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB) and [the prompt they shared](https://www.threads.com/@nahiddotai/post/Ddm0OgZkuQx). The original prompt is not included; this guide is our own write-up.

## Reference
Open `<skill>/docs/styles/handdrawn.jpg` (four frames from the original) before planning, and compare your stills with it during QA. The original is a 30 s model launch: the mascot wakes up, powers up, and walks through "worlds" of benchmark results.

## Signature (every item must be on screen)
| # | Item | How |
|---|---|---|
| 1 | Plain warm off-white paper with no grid; one thin ink horizon with grass tufts; outline clouds | `hdPaper()`, `horizon(y)`, `cloud(x, y, s, id)`. Never `grid()` in this look |
| 2 | The logo mascot as an 8-bit sprite that acts: sleeps (`zzz`), powers up (`burst`), pushes, smashes, stands on top of the winning bar | `drawMini` / `drawPixels` on the horizon |
| 3 | A dark title card: small serif "Introducing", the name typing in a large serif, the accent part (version, product word) in the brand colour with a hand underline, a script subline | `introCard(t, { name, accent, sub })` |
| 4 | Level structure: a small mono `WORLD 1-1` tag in the top-left of each beat and one pixel-font "WORLD 2" interstitial card | `worldTag('WORLD 1-2')`, `worldCard('WORLD 2', 'TITLE', p)` |
| 5 | Numbers as serif count-ups with a bold label and a script note; hatched-vs-solid bars; a pixel HI-SCORE board on a dark screen; a price tag struck through | `serifStat`, `countUp`, `hatchBars`, `hiScore`, `priceTag`, `docGrid`, `strikeList` |
| 6 | One full-bleed brand-colour scene entered with a torn-paper transition | `paperTear(p, HD.accent)` |
| 7 | Ending: the logo mark and the serif name with its underline, a short "available now" line, a spaced list of where to get it, the mascot on the horizon | `introCard` pieces on `hdPaper` |

## Look
- **Palette**: paper `#f4f2ee`, ink `#2b2a28`, dark `#1c1b1a`, plus the brand accent on `HD.accent` (Claude orange `#D97757` in the original). Nothing else is coloured.
- **Fonts**: `SERIF` Source Serif 4 (titles, numbers), `SCRIPT` Caveat (notes, sublines), `PIX` Press Start 2P (HI-SCORE, WORLD cards), `MONO` IBM Plex Mono (tags, small values), `SANS` Geist (bold labels). For Korean use Nanum Myeongjo, Gaegu, Galmuri11, NanumGothicCoding, and Pretendard in the same roles (unicode-range pairs, see kit-api.md).
- **Lines**: thin (2–2.5 px) and calm (`roughness` ≈ .8). The wobble is gentle; this is pen on paper, not a marker.
- **Density**: one idea per beat, lots of empty paper. A beat is 2–3 s.

## Structure (30 s)
| Time | Beat |
|---|---|
| 0–4 | The mascot asleep on the horizon (date in script top-left) → something arrives → power-up burst |
| 4–7 | Dark `introCard` |
| 7–20 | WORLD 1: three or four sourced numbers, each its own beat (count-up, hatched vs solid bars, doc grid) |
| 20–22 | `worldCard('WORLD 2', …)` |
| 22–27 | WORLD 2: HI-SCORE board, the brand-colour tear scene, price tag |
| 27–30 | Ending card, mascot on the horizon |

## Extras (optional, not from the original)
Topic minis with name tags, map + counter, fast card cuts, and the other patterns in [storyboard.md](../storyboard.md) fit this look, but only after every signature item is in. Keep paper plain (no grid) even then.

## Sound
None by default, like the original. If the user wants sound, a quiet `audio.py` bed at energy .3–.5 with `pop` on count-ups and `thud` on the HI-SCORE.
