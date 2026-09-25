# Style: neon sign

Glass tubes on a dark brick wall that buzz and flicker on, glow onto the wall, and reflect on a wet floor. Original to this skill.

## Signature (every item must be on screen)
| # | Item | How (`neon.js`) |
|---|---|---|
| 1 | A dark brick wall with a wet floor | `neWall(t, { floor })` |
| 2 | Words as neon tubes: coloured halo, glow, white-hot core | `neText(s, x, y, size, color, on)` |
| 3 | Tubes flicker and buzz on before they hold steady; unlit tubes show as dark glass | `neOn(t, t0, seed)` |
| 4 | Icons, arrows, and frames bent from tube | `neTube(pts, color, on)`, `neFrame(x, y, w, h, color, on)` |
| 5 | Light spilling onto the wall and a reflection in the floor | built into `neText`; `neReflect(floor)` after drawing |
| 6 | The buzz: a click on each flicker | `neCues(t0, seed)` → cues for `audio.json` |

## Look
- **Palette**: wall `#1b1417`; tubes pink `#ff4fa3`, cyan `#3ff0ff`, yellow `#ffe45c`, green `#6bff8a`, orange `#ff8a3d`, violet `#b56bff`. Make the brand colour the main tube.
- **Fonts**: `NEON` Tilt Neon for Latin; Pretendard (light weights) for Hangul, drawn as strokes.
- **Composition**: one sign per scene, centred or offset like a shop sign; at most three tube colours at once.

## Story shapes that fit
A night-open shop sign (name, hours → what it does), a menu board of features, a slogan that lights word by word.

## Sound
A low hum bed (energy .3–.5) with `click` buzz cues from `neCues`; `ping` when a sign locks on.
