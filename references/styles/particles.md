# Style: particles

Thousands of glowing particles drift on a flow field, gather into words, logos, and numbers, then scatter and re-form. The purest "drawn in code" look.

## Signature
| # | Item |
|---|---|
| 1 | A near-black field with thousands of short glowing streaks drifting on a smooth flow |
| 2 | Words and numbers that form out of the drift and hold with a gentle shimmer |
| 3 | The logo or a symbol formed from particles (sampled from the logo image or a path) |
| 4 | Morphs from one shape straight into the next |
| 5 | A burst that scatters everything before the next idea |
| 6 | Bloom on everything |
| 7 | A crisp caption under each formed shape |

## Look
- **Palette**: background `#05060b`; particle colours in `PT.colors` (cyan, violet, white, pink by default). Put the brand colours there.
- **Fonts**: Geist (heavy weights sample best) for particle text; Pretendard Black for Hangul.
- **Density**: `PT.n` 6000 at 1080p; keep a shape's text at 150–260 px so the particles read as letters.
- **Pacing**: drift 0.5–1 s → form 1–1.5 s → hold with caption 1.5 s → morph or burst.

## Story shapes that fit
A teaser or reveal (name, promise, one number, URL), a manifesto of short lines, a title sequence.

## Sound
`audio.py` with a pad-heavy bed that swells as shapes form (energy .35 → .8); `chime` when a shape locks in, `whoosh` on bursts.
