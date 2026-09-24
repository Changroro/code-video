# Look modules

A look is the drawing style only. The story comes from the research and the chosen format; the look decides how each scene is drawn. Five looks ship as modules in `template/` and share one scene API, so the same script renders in any of them by swapping one `<script>` tag.

| Module | Look | Signature format scene |
|---|---|---|
| `arcade.js` | 16-bit arcade: pixel sprites, CRT scanlines, game UI | `versus` |
| `terminal.js` | green phosphor terminal: typed commands, block-letter banners | `session` |
| `thermal.js` | thermal receipt printer: slips print, get stamped, are torn off | `receipt` |
| `transit.js` | transit map and station signage: lines, stations, trains | `route` |
| `blueprint.js` | cyanotype blueprint: dimension lines, balloons, title block | `spec` |

All five are original to this skill. The credited looks are not built on this scene API; they have their own style modules and guides: hand-drawn (`handdrawn.js`, [styles/handdrawn.md](styles/handdrawn.md)), motion graphics (`motion.js`, [styles/motion.md](styles/motion.md)), and sand (`sand.js`, [styles/sand.md](styles/sand.md)).

## Using a module
```html
<script src="kit.js"></script>
<script src="arcade.js"></script>   <!-- one look module; it defines LOOK -->
<script src="main.js"></script>
```
```js
Object.assign(LOOK.colors, { accent: '#0f223f' });        // brand colours from the research
const TL = [['hook', 0, 3.6], ['title', 3.6, 7.8], ['steps', 7.8, 14.6], ['stat', 14.6, 18.6], ['ending', 18.6, 23]];
const ARGS = { hook: [['First line', 'Second line']], title: ['Name', 'Tagline'], steps: [['One', 'Two', 'Three', 'Four']],
  stat: ['8 × 8', 'Label', 'Note'], ending: [{ cmd: 'Call to action', url: 'example.com', note: 'Small print' }] };
boot({ scenes: TL.map(([k, a, b]) => [a, b, t => LOOK[k](t, b - a, ...ARGS[k])]), setup: () => useFonts(LOOK.fonts) });
```
`useFonts` loads `LOOK.fonts` from `assets/fonts` (see `scripts/fetch_fonts.sh`), so `index.html` needs no `@font-face` for a look module.

## Scene API
Every function draws a whole frame. `t` is seconds since the scene started and `d` is the scene length, which the look uses to time its exit.

| Call | Use for | Typical length |
|---|---|---|
| `hook(t, d, lines)` | the opening question or claim, 1 to 3 short lines | 3–4 s |
| `title(t, d, name, tagline)` | the subject's name and one-line positioning | 4 s |
| `steps(t, d, items)` | 3 to 5 steps, features, or pillars | 6–7 s |
| `stat(t, d, value, label, note)` | one big number with its label and source note | 4 s |
| `ending(t, d, { cmd, url, note })` | call to action, address, small print | 4–5 s |

How each look draws them:

| Scene | arcade | terminal | thermal | transit | blueprint |
|---|---|---|---|---|---|
| hook | INSERT COIN, lines drop in with a shake | boot line, lines typed | NOTICE slip | station sign board | NOTE lines with dashed underlines |
| title | game title, hero sprite, PRESS START | `./intro` and a block-letter banner | slip with the name printed large | logo, name, a line drawn across | name with a dimension line carrying the tagline |
| steps | STAGE SELECT map, hero hops node to node | `make` log with OK tags and a progress bar | ORDER slip with checkboxes | a line with numbered stations and a train | process boxes with numbered balloons |
| stat | HIGH SCORE, digits roll then settle | `stats` and a block-letter value | TOTAL slip | value in a line-colour badge | huge value dimensioned by its label |
| ending | GAME CLEAR, dialog box with the command | typed command, URL, `exit` | thank-you slip with a stamp | terminus sign and a ticket | release sheet with a stamp |

## Signature format scenes
- `LOOK.versus(t, d, sides, round, n)` (arcade): `sides = [{ name, color }, { name, color }]`, `round = { title, sub, a, b, win: 0 | 1 | 'draw' }`. Numbers fill the bars in proportion; words fill them completely. About 3.3 s per round.
- `LOOK.session(t, d, entries)` (terminal): `entries = [[kind, text], ...]` with kinds `cmd`, `out`, `ok`, `wait`, `note`, `blank`. Commands type at 26 characters per second; the screen scrolls when it fills.
- `LOOK.receipt(t, d, lines, stamp, keep)` (thermal): line kinds `head`, `big`, `center`, `small`, `row` (left and right text), `item` (checkbox), `sep`, `dsep`, `barcode`, `blank`. End with a few `blank` lines in portrait so the stamp has room.
- `LOOK.route(t, d, lines, hubs, title)` (transit): `lines = [{ name, color, pts, stations: [[x, y, label, side, sub]], at: [start, end] }]`, `hubs = [[x, y, label, sub, side, at]]`.
- `LOOK.spec(t, d, parts, title, heading)` (blueprint): `parts = [{ name, spec, w }]`, drawn left to right with balloons and dimension lines.

## Pitfalls
- Arcade, terminal, transit, and blueprint are laid out for 16:9. Thermal works in 16:9 and 9:16. For other frames, check stills early and adjust positions.
- Arcade text is crisp only at multiples of 8 px (Press Start 2P) and 11 px (Galmuri11). Korean falls back to Galmuri automatically.
- The terminal banner font covers Latin letters, digits, and `- . / × +`. Other scripts fall back to large glowing text.
- The thermal slip grows up from the printer, so long receipts run off the top. In 9:16, keep a receipt under about 18 lines.
- Labels over busy backgrounds need a plate behind them (the arcade look already draws one for stage labels).
- Do not declare globals named like the kit's (`BG`, `IMG`, `LOOK`, `T`) in `main.js`; the page stops with a redeclaration error.
