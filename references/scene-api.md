# Scene-API styles

Five styles ship as ready-made scene sets that share one scene API, so the same script renders in any of them by swapping one `<script>` tag. The story still comes from the research: pick the scenes and their copy to fit it.

| Module | Style |
|---|---|
| `arcade.js` | 16-bit arcade: pixel sprites, CRT scanlines, game UI |
| `terminal.js` | green phosphor terminal: typed commands, block-letter banners |
| `thermal.js` | thermal receipt printer: slips print, get stamped, are torn off |
| `transit.js` | transit map and station signage: lines, stations, trains |
| `blueprint.js` | cyanotype blueprint: dimension lines, balloons, title block |

All five are original to this skill. The other styles have helper modules and a guide each in [styles/](styles/).

## Using a module
```html
<script src="kit.js"></script>
<script src="arcade.js"></script>   <!-- one scene-API module; it defines LOOK -->
<script src="main.js"></script>
```
```js
Object.assign(LOOK.colors, { accent: '#0f223f' });        // brand colours from the research
const TL = [['hook', 0, 3.6], ['title', 3.6, 7.8], ['steps', 7.8, 14.6], ['stat', 14.6, 18.6], ['ending', 18.6, 23]];
const ARGS = { hook: [['First line', 'Second line']], title: ['Name', 'Tagline'], steps: [['One', 'Two', 'Three', 'Four']],
  stat: ['42', 'Label', 'Source note'], ending: [{ cmd: 'Call to action', url: 'example.com', note: 'Small print' }] };
boot({ scenes: TL.map(([k, a, b]) => [a, b, t => LOOK[k](t, b - a, ...ARGS[k])]), setup: () => useFonts(LOOK.fonts) });
```
Fixed words the styles print (the receipt's thank-you line, the terminus sign) live in `LOOK.labels`; set them in the on-screen language, e.g. `Object.assign(LOOK.labels, { thanks: '감사합니다' })`.

`useFonts` loads `LOOK.fonts` from `assets/fonts` (see `scripts/fetch_fonts.sh`), so `index.html` needs no `@font-face` for these modules.

## Scene API
Every function draws a whole frame. `t` is seconds since the scene started and `d` is the scene length, which the style uses to time its exit. Repeat or reorder scenes to fit the story (two `steps` scenes for a before/after, several `stat` scenes for a comparison).

| Call | Use for | Typical length |
|---|---|---|
| `hook(t, d, lines)` | the opening question or claim, 1 to 3 short lines | 3–4 s |
| `title(t, d, name, tagline)` | the subject's name and one-line positioning | 4 s |
| `steps(t, d, items)` | 3 to 5 steps, features, or pillars | 6–7 s |
| `stat(t, d, value, label, note)` | one big number with its label and source note | 4 s |
| `ending(t, d, { cmd, url, note })` | call to action, address, small print | 4–5 s |

How each style draws them:

| Scene | arcade | terminal | thermal | transit | blueprint |
|---|---|---|---|---|---|
| hook | INSERT COIN, lines drop in with a shake | boot line, lines typed | NOTICE slip | station sign board | NOTE lines with dashed underlines |
| title | game title, hero sprite, PRESS START | `./intro` and a block-letter banner | slip with the name printed large | logo, name, a line drawn across | name with a dimension line carrying the tagline |
| steps | STAGE SELECT map, hero hops node to node | `make` log with OK tags and a progress bar | ORDER slip with checkboxes | a line with numbered stations and a train | process boxes with numbered balloons |
| stat | HIGH SCORE, the value counts up under its label | `stats` and a block-letter value | TOTAL slip | value in a line-colour badge | huge value dimensioned by its label |
| ending | GAME CLEAR, dialog box with the command | typed command, URL, `exit` | thank-you slip with a stamp | terminus sign and a ticket | release sheet with a stamp |

## Pitfalls
- Arcade, terminal, transit, and blueprint are laid out for 16:9. Thermal works in 16:9 and 9:16. For other frames, check stills early and adjust positions.
- Arcade text is crisp only at multiples of 8 px (Press Start 2P) and 11 px (Galmuri11). Korean falls back to Galmuri automatically.
- The terminal banner font covers Latin letters, digits, and `- . , / × + % $`. Other scripts fall back to large glowing text.
- The thermal slip grows up from the printer, so long receipts run off the top. In 9:16, keep a receipt under about 18 lines.
- Labels over busy backgrounds need a plate behind them (the arcade look already draws one for stage labels).
- Do not declare globals named like the kit's (`BG`, `IMG`, `LOOK`, `T`) in `main.js`; the page stops with a redeclaration error.
