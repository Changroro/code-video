# Format: lyric music video

An educational music video that reads like a technical explainer set to a song: a dark grid, a section label in the corner, one diagram per lyric line, and the sung line at the bottom. The engine makes the instrumental; the lyrics are on screen, not sung.

Credit: adapted from the educational music video shared by [@goodside](https://x.com/goodside/status/2102852546620744010). The original prompt is not included; this guide is our own write-up.

## Reference
Open `<skill>/docs/styles/lyric.jpg` (four frames from the original) before planning, and compare your stills with it during QA. The original is a 2 min 20 s song about Jev, TypeSafe AI's "System One" decision model: an intro title in a glowing ring, verses that explain how Jev differs from a chat model with node diagrams and JSON, a chorus built on "Jev, Jev, System One" that returns in a new colour each time, a pricing pre-chorus, a bridge on calibration, and an outro.

This format has its own look (below). Use another look only when the user asks for one.

## Signature (every item must be on screen)
| # | Item | How (`lyric.js`) |
|---|---|---|
| 1 | A dark navy field with a faint grid and vignette in every scene | `lyFrame({...})` |
| 2 | The song section in a small mono label top-left (`VERSE 1 · how Jev differs from a chat model`), the title top-right, a thin progress line along the top | `lyFrame({ section, detail, title, progress })` |
| 3 | The sung line at the bottom under a hairline: sung words bright, the rest dim | `lyLine(lyWords(line, start, step), t)` |
| 4 | One diagram per line, centred: node boxes joined by connectors with a travelling pulse, JSON/code cards, probability bars, a stopwatch or a big glowing value, a crossing-curves chart | `lyNode`, `lyLink`, `codeBox`, `probBars`, `bigValue` |
| 5 | The chorus repeats the same diagram with a new accent each time it returns (cyan, pink, yellow, green) | `chorusColor(n)` |
| 6 | Intro and outro: the name in a glowing ring, the subtitle in the accent, "an educational music video", the about line, the song title between ♪ marks | `lyTitle(...)` |

## Look
- **Palette**: bg `#0b0f1e`, ink `#e9edf6`, dim `#5e6886`, cards `#121832`, accents cyan `#35d0e6`, pink `#ff5cc8`, yellow `#ffc53a`, green `#4ade80`. If the brand has a strong colour, make it the first accent.
- **Fonts**: `LSANS` IBM Plex Sans (semibold/bold) and `LMONO` IBM Plex Mono. Korean: Pretendard and NanumGothicCoding.
- **Diagrams**: flat, precise, thin 2 px borders, 10 px radius; no hand-drawn wobble, no illustrations of scenery. Each diagram builds on the line's first beat and holds while the line is sung.

## Song
- Sections: intro, verses (one subject each), a chorus on the product's name or promise, a pre-chorus for a number (price, speed), a bridge for a limitation or nuance, an outro that repeats the hook. Put the section name and a short detail in the label.
- Every line comes from the research. One line is one fact, and each line gets its own diagram.
- Keep lines short: at most about 12 syllables, or 14 characters in Korean. Write the lyrics in the on-screen language.
- Fit the song to the chosen length before writing scenes: bars × 4 × 60 / BPM is the song length. 60–150 s.

## Timing
Put syllables on the beat grid in `main.js` and reuse the same numbers in `audio.json`:
```js
const BPM = 100, B = 60 / BPM, bar = k => k * 4 * B;
lyLine(lyWords('Give it a state, get decisions back', bar(8), B / 2), T);
```
`lyLine` and `karaoke` take the same clock as their start times, so pass the video time `T` when the times are absolute.

## Sound
`scripts/audio.py` with sections matching the song: verse energy about .5, chorus .9, bridge .35, outro .5. Cue `pop` when a diagram lands and `chime` on the title.

## Pitfalls
- Do not claim the video has vocals.
- Plan the runtime; an unplanned song overruns the chosen length.
