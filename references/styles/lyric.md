# Style: lyric music video

An educational music video that reads like a technical explainer set to a song: a dark grid, a section label in the corner, one diagram per lyric line, and the sung line at the bottom. The engine makes the instrumental; the lyrics are on screen, not sung.

## Reference
Open `<skill>/docs/styles/lyric.jpg` (four frames from the original) before planning, and compare your stills with it during QA. The original is a 2 min 20 s song about Jev, TypeSafe AI's "System One" decision model: an intro title in a glowing ring, verses that explain how Jev differs from a chat model with node diagrams and JSON, a chorus built on "Jev, Jev, System One" that returns in a new colour each time, a pricing pre-chorus, a bridge on calibration, and an outro.

## Signature
| # | Item |
|---|---|
| 1 | A dark navy field with a faint grid and vignette in every scene |
| 2 | The song section in a small mono label top-left (`VERSE 1 · how Jev differs from a chat model`), the title top-right, a thin progress line along the top |
| 3 | The sung line at the bottom under a hairline: sung words bright, the rest dim |
| 4 | One diagram per line, centred: node boxes joined by connectors with a travelling pulse, JSON/code cards, probability bars, a stopwatch or a big glowing value, a crossing-curves chart |
| 5 | The chorus repeats the same diagram with a new accent each time it returns (cyan, pink, yellow, green) |
| 6 | Intro and outro: the name in a glowing ring, the subtitle in the accent, "an educational music video", the about line, the song title between ♪ marks |

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
Put every syllable on the beat grid (one bar = 4 × 60 / BPM s) and reuse the same times in `audio.json`, so the words land on the music.

## Sound
`scripts/audio.py` with sections matching the song: verse energy about .5, chorus .9, bridge .35, outro .5. Cue `pop` when a diagram lands and `chime` on the title.

## Pitfalls
- Do not claim the video has vocals.
- Plan the runtime; an unplanned song overruns the chosen length.
