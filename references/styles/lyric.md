# Style: lyric music video

An educational music video: an original song whose lyrics teach the topic, shown karaoke style over simple animated scenes. The engine makes the instrumental; the lyrics are on screen, not sung.

Credit: adapted from the educational music video idea shared by [@goodside](https://x.com/goodside/status/2102852546620744010). The original prompt is not included; this guide is our own write-up. [Preview frames from the original video](../../docs/styles/lyric.jpg).

## When to use
Explainers that should be memorable: what a company does, how a product works, a list of services. 60 to 150 s.

## Song
- Sections: intro, one verse per subject (who they are, what they do, how it works), a chorus built on the slogan or core value, and an outro that repeats the hook.
- Every line comes from the research. One line is one fact, and each fact gets a card on screen.
- Keep lines short: at most about 12 syllables, or 14 characters in Korean. Write the lyrics in the on-screen language.
- Fit the song to the chosen length before writing scenes. Bars times 4 times 60 / BPM is the song length.

## Timing
Put syllables on the beat grid in `main.js` and reuse the same numbers in `audio.json`:
```js
const BPM = 100, B = 60 / BPM, bar = k => k * 4 * B;
// line starting at bar 8, one syllable per eighth note
const L1 = ['Ev', 'ery ', 'line ', 'is ', 'a ', 'fact'].map((s, i) => [s, bar(8) + i * B / 2]);
karaoke(L1, W / 2, H - 140, T, { font: 'PRE', size: 64, on: '#2fa2dc' /* brand accent */ });
```
`karaoke` takes the same clock as its start times, so pass the video time `T` when the times are absolute.

## Look
- The brand palette drives cards, lyric highlight, and icons. Backgrounds may move through the day (sunrise, day, night, sunset) per section, tinted toward the brand colours.
- A lyric bar at the bottom, a fact card that pops in on the line's first beat (`kwords` for its title), icon tiles that reveal as the lyrics name them.

## Sound
`scripts/audio.py` with sections matching the song: verse energy about 0.5, chorus 0.9, outro 0.5. Cue `pop` on card reveals and `chime` on the logo.

## Pitfalls
- Do not claim the video has vocals.
- Plan the runtime; an unplanned song overruns the chosen length.
