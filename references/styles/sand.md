# Look: sand art chronicle

Scenes poured in dark sand on a glowing light table, lit by sunbursts and night skies, that break into grains and blow away between eras. Music and sound effects. Suits stories told through time.

Credit: adapted from the sand animation shared by [@Michaelzsguo](https://x.com/Michaelzsguo/status/2102592355165782312). The original prompt is not included; this guide is our own write-up.

## Reference
Open `<skill>/docs/styles/sand.jpg` (four frames from the original) before planning, and compare your stills with it during QA. The original is a 2-minute story of 250 years of U.S. history: a ring of stars around "250", then one era per scene (1776 bell and declaration, 1787 "We the People", westward wagons at sunrise, 1863, the 1869 railroad, 1903 first flight, 1945, 1963, the 1969 moon landing at night), ending on fireworks over the Capitol.

## Signature (every item must be on screen)
| # | Item | How (`sand.js`) |
|---|---|---|
| 1 | A parchment light table with visible grain everywhere, dark brown sand with grainy soft edges | `sandSetup()`; keep `SAND.grainSize` 2 and `edgeGrain` ≥ .5 |
| 2 | Silhouettes, not outlines: buildings, vehicles, people, landscapes as solid shapes, often moving (a train crossing, a plane flying) | draw solid paths into the layer every frame |
| 3 | The year in an old-style serif in a top corner with a short italic caption under it; no heavy sans captions | `sandYear(g, '1869', 'Coast to Coast')` |
| 4 | Scene changes where the picture breaks into grains and blows away, or is swept off by hand, then the next is poured in | `sandFrame(1, 0, dir, { scatter })`, `sandFrame(1, sweep, dir)`, `sandFrame(reveal)` |
| 5 | Lighting that changes with the story: a sunburst with rays, a glowing sun, a night sky with a moon and stars cut out of the sand, fireworks | `sandRays`, `sandCut`, `o.light` |
| 6 | Grain as material: smoke, crowds, water, and dust drawn as scattered specks, not flat fills | small dots or noisy alpha in the layer |
| 7 | Title and ending built from a ring of stars or an emblem around one big serif number or name, with the dates in serif | serif `text` into the layer |

## Look
- **Palette**: table `SAND.lit` `#f3dcae` → `SAND.edge` `#9b7648`, sand `SAND.ink` `#2e2014`. Sand is one colour; the brand shows only in the final logo card and, at most, one accent.
- **Fonts**: `SERIF` Cormorant (medium) for years and titles, `SERIF_I` Cormorant Italic for captions. Korean: Nanum Myeongjo for both. Captions stay small (22–30 px) and elegant; the picture carries the scene.
- **Scene length**: 8–12 s per era in a 2-minute film, 5–6 s in a 45 s one. Pour in over .6–1 s, move something inside the scene, then scatter or sweep for .6–.9 s, overlapping the next pour.

## Structure
- Title: the emblem (a ring of stars, the logo's silhouette) around one number or the name, with the dates.
- One scene per era in order: year and caption in the corner, one visual metaphor as silhouettes, one moving element, a lighting choice that differs from the previous scene.
- Ending: the emblem again, then the name and URL on a clean card with the real logo.

## Sound
Music and effects from `scripts/audio.py`: a warm pluck or pad bed, energy rising through the middle eras and settling at the end. Cue `sand` on each pour and `whoosh` on each scatter, plus topic sounds where they fit (`wave`, `ping`, `chime` on the logo).

## Code
```js
boot({ scenes, setup: sandSetup });           // index.html loads sand.js after kit.js
function sEra(t) {
  const g = sandClear();
  sandRays(g, W * .6, H * .62, prog(t, 0, .8));                     // optional light
  withCtx(g, () => { /* solid silhouettes, in black; alpha = sand density */ });
  sandYear(g, '1869', 'Coast to Coast');
  sandFrame(prog(t, 0, .8), 0, [1, 0], { scatter: prog(t, 9.2, 10) });
}
```

## Pitfalls
- `sandFrame` works per pixel, about 20–40 ms per 1080p frame. Keep `WORKERS` at 4.
- Company sites sometimes credit work done before the founding date. Ask the user how to present it.
