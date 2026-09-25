# Style: torn-paper collage

Pictures built from torn scraps of watercolour-tinted paper, laid one by one on a sheet of cold-press paper: skies and seas in long strips, rocks and crowds in small shards, a sun as a torn disc. Calm, handmade, and warm. Original to this skill, after the traditional torn-paper technique.

## Signature (every item must be on screen)
| # | Item | How (`collage.js`) |
|---|---|---|
| 1 | A cold-press paper sheet as the ground, never a flat fill | `clSheet()` |
| 2 | Every shape is torn paper: a jagged edge with a white fibre rim and a soft shadow; no clean vector shapes | `scrap`, `scrapRect`, `scrapCircle` |
| 3 | Colour as washed, muted tints with visible blotches, like watercolour on paper | the tint you pass; `CL` holds a muted palette |
| 4 | Pictures assemble scrap by scrap, back to front: strips for sky, water, and fields; shards for textured masses | `clStrips`, `clMosaic` |
| 5 | The subject's logo or product rebuilt from torn scraps | `clImage(key, img, x, y, w, h, t, at, { cols })` |
| 6 | Words set in serif ink, each on its own torn strip, landing one after another | `clWords` |
| 7 | Scene changes as a fresh sheet with a torn edge sliding over, or scraps peeling off | `clPeel(p, drawNext)`, the `out` option |

## Look
- **Palette**: paper `#f1ece1`, ink `#3a3833`, and muted tints (sky `#b8c9da`, sea `#6f8dab`, sand `#e2cfa8`, sun `#efc25c`, stone `#8e8b85`, slate `#5f6570`, moss `#8b8d5c`, rust `#c7684e`). Bring the brand in as one or two washed tints and the rebuilt logo; keep everything a little desaturated.
- **Fonts**: `SERIF` Source Serif 4 / Nanum Myeongjo for words on strips, `SCRIPT` Caveat / Gaegu for a pencil note.
- **Composition**: one picture per scene, filling about two-thirds of the frame with a margin of bare paper around it. Pictures are simple and flat, like a children's book, with pieces that overlap and overshoot their outlines a little. Use scraps a hand could tear: strips 40–90 px tall, shards 60–140 px.
- **Pacing**: unhurried; each scrap lands with a short slide and settles. Keep a beat of stillness after a picture completes.

## Story shapes that fit
A place or a journey, a story of how something was made, a before-and-after, a quiet brand film.

## Sound
`audio.py` with a soft bed (energy .3–.5); `paper` under landing scraps (a few, not every one), `tear` for a new sheet or a peel, `chime` when a picture completes.
