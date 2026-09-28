# Style: sand art chronicle

Scenes poured in dark sand on a glowing light table, lit by sunbursts and night skies, that break into grains and blow away between eras. Music and sound effects. Suits stories told through time.

## Reference
Open `<skill>/docs/styles/sand.jpg` (four frames from the original) before planning, and compare your stills with it during QA. The original is a 2-minute story of 250 years of U.S. history: a ring of stars around "250", then one era per scene (1776 bell and declaration, 1787 "We the People", westward wagons at sunrise, 1863, the 1869 railroad, 1903 first flight, 1945, 1963, the 1969 moon landing at night), ending on fireworks over the Capitol.

## Signature
| # | Item |
|---|---|
| 1 | A parchment light table with visible grain everywhere, dark brown sand with grainy soft edges |
| 2 | Silhouettes, not outlines: buildings, vehicles, people, landscapes as solid shapes, often moving (a train crossing, a plane flying) |
| 3 | The year in an old-style serif in a top corner with a short italic caption under it; no heavy sans captions |
| 4 | Scene changes where the picture breaks into grains and blows away, or is swept off by hand, then the next is poured in |
| 5 | Lighting that changes with the story: a sunburst with rays, a glowing sun, a night sky with a moon and stars cut out of the sand, fireworks |
| 6 | Grain as material: smoke, crowds, water, and dust drawn as scattered specks, not flat fills |
| 7 | Title and ending built from a ring of stars or an emblem around one big serif number or name, with the dates in serif |

## Look
- **Palette**: table `SAND.lit` `#f3dcae` → `SAND.edge` `#9b7648`, sand `SAND.ink` `#2e2014`. Sand is one colour; the brand shows only in the final logo card and, at most, one accent.
- **Fonts**: `SERIF` Cormorant (medium) for years and titles, `SERIF_I` Cormorant Italic for captions. Korean: Nanum Myeongjo for both. Captions stay small (22–30 px) and elegant; the picture carries the scene.
- **Scene length**: 8–12 s per era in a 2-minute film, 5–6 s in a 45 s one. Pour in over .6–1 s, move something inside the scene, then scatter or sweep for .6–.9 s, overlapping the next pour.

## Sound
Music and effects from `scripts/audio.py`: a warm pluck or pad bed, energy rising through the middle eras and settling at the end. Cue `sand` on each pour and `whoosh` on each scatter, plus topic sounds where they fit (`wave`, `ping`, `chime` on the logo).

## Pitfalls
- Drawing sand grain per pixel is slow (tens of ms per 1080p frame). Keep `WORKERS` at 4.
- Keep captions and years on a clear patch of the table; grain behind text makes it hard to read.
