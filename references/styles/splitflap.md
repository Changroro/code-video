# Style: split-flap board

A railway departures board: tiles clatter through the alphabet onto each message, amber lamps blink, and a station clock ticks. Original to this skill.

## Signature (every item must be on screen)
| # | Item | How (`splitflap.js`) |
|---|---|---|
| 1 | A dark board of individual flap tiles with a hinge line and a split between halves | `sfBoard()`, `sfTile` |
| 2 | Messages land by flipping through characters, column after column | `sfRow(s, x, y, t, t0, { cols, w, h })` |
| 3 | A departures table: time, destination, gate or code, status | `sfDepartures(t, rows, { title, start, rowGap })` |
| 4 | Status lamps in amber, green, red; one blinks (BOARDING, NEW, NOW) | row `status`, `statusColor`, `blink` |
| 5 | A header with the board title and a clock | built into `sfDepartures` |
| 6 | The clatter: flap clicks placed on the flips | `sfCues(t0, s)` → cues for `audio.json` |

## Look
- **Palette**: board `#0f0f10`, tiles `#232326`, characters `#f1ede2`, amber `#ffb000`, green `#39d353`, red `#ff5a4f`. The brand shows in one status colour and the final message.
- **Fonts**: `FLAP` Roboto Mono (bold) for Latin; Pretendard Bold for Hangul (Hangul tiles flip through a few letters, then land).
- **Messages**: uppercase, short (tiles are wide); one idea per board change.

## Story shapes that fit
Departures or arrivals as a list (features, steps, releases, cities), a countdown, a "now boarding" launch announcement.

## Sound
Flap clicks from `sfCues` over a quiet bed (energy .3–.5); a soft `chime` when a board settles.
