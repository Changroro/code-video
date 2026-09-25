# Style: scrapbook

A making-of journal on a kraft desk: lined notebook pages, polaroids held by washi tape, torn paper labels, die-cut stickers, rubber stamps, and marker doodles. Original to this skill.

## Signature (every item must be on screen)
| # | Item | How (`scrapbook.js`) |
|---|---|---|
| 1 | A kraft paper desk and lined notebook pages at slight angles | `sbDesk()`, `notePage(x, y, w, h, rot)` |
| 2 | Polaroids of real images (screenshots, logos, product shots) held by washi tape, with handwritten captions | `polaroid(img or painter, x, y, w, rot, p, caption)`, `tape(...)` |
| 3 | Handwritten notes and dates in marker or pen | `text` with `SB.hand`; `SB.marker` for headings |
| 4 | Torn paper labels for key words | `tornLabel(s, x, y, rot, { p })` |
| 5 | Die-cut stickers and a rubber stamp for milestones | `sticker`, `stickerText('NEW!', ...)`, `rubberStamp('SHIPPED', ...)` |
| 6 | Marker doodles that point and circle: arrows, stars, underlines | `doodleArrow`, `doodleStar`, `doodleCircle`, `doodleUnderline` |
| 7 | Scene changes as a new page sliding over the desk | `paperSlide(p, drawNext)` |

## Look
- **Palette**: kraft `#cdb38d`, notebook `#fbf8f0`, ink `#2b2622`, red pen `#d94f3d`, blue pen `#3b6fb6`, tape beige and mint. The brand appears in the photos, stickers, and one accent.
- **Fonts**: `SCRIPT` Caveat / Gaegu for notes, `MARKER` Permanent Marker / Black Han Sans for headings and stamps, `TYPE` IBM Plex Mono for typed labels.
- **Layout**: things overlap and tilt (±2–8°), never on a grid; leave some desk showing.

## Story shapes that fit
A timeline or diary (dates as headings), a making-of, a travel-log of milestones, a team or customer album.

## Sound
`audio.py` with a light acoustic bed (energy .4–.6); `pop` for stickers, `thud` for the stamp, `whoosh` for page slides, `type` under handwriting.
