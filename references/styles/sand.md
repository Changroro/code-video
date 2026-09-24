# Style: sand art chronicle

Scenes poured in sand on a backlit light table and swept away by hand, with music and sound effects. Suits stories told through time.

Credit: adapted from the sand animation shared by [@Michaelzsguo](https://x.com/Michaelzsguo/status/2102592355165782312). The original prompt is not included; this guide is our own write-up. [Preview frames from the original video](../../docs/styles/sand.jpg).

## When to use
History, founding stories, "N years of …" chronicles, milestones. 60 to 120 s gives each era room; at 30 s use four or five eras.

## Look
- **Table and sand**: set `SAND.lit` and `SAND.edge` (the glowing table) and `SAND.ink` (the sand). Sand is one colour by nature, so the brand shows in the table's hue, the logo on the end card, and at most one accent.
- **Drawing**: silhouettes, not outlines. Build scenes from solid shapes (paths, `drawPixels` characters as silhouettes, heavy text). The alpha you draw is the sand density, so soft edges read as thin sand.
- **Motion inside a scene**: redraw moving parts into the layer every frame (waves, a radar sweep, a ship crossing). Keep it slow; the pour and the sweep are the big moves.
- **Captions**: one year stamp and one short line per scene, at least 40 px in a heavy weight.

## Structure
- Title: the company name poured in with one emblem (a lighthouse, a product silhouette).
- One scene per era: year stamp, one visual metaphor, one caption, in chronological order.
- Ending: the slogan, then the name and URL on a clean card with the real logo.
- Per scene: pour in over 0.6 to 1 s (`sandFrame(reveal)`), hold, then sweep for 0.4 to 0.6 s (`sandFrame(1, sweep, dir)`). Start the next pour before the sweep ends so the table is never empty for long.

## Sound
Music and effects from `scripts/audio.py`: a calm pluck or pad bed, energy rising in the middle eras and settling at the end. Cue `sand` on each pour and `whoosh` on each sweep, plus topic sounds where they fit (`wave`, `ping`, `chime` on the logo).

## Code
```js
boot({ scenes, setup: sandSetup });           // index.html also loads sand.js after kit.js
function sEra(t) {
  const g = sandClear();
  withCtx(g, () => { /* draw silhouettes and text() into the layer */ });
  sandFrame(prog(t, 0, .8), prog(t, 9.4, 10), [1, .2]);
}
```

## Pitfalls
- `sandFrame` works per pixel, about 20 to 40 ms per 1080p frame. Keep `WORKERS` at 4.
- Company sites sometimes credit work done before the founding date. Ask the user how to present it.
