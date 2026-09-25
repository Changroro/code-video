# Style: UI morph

One interface element that never cuts: a button becomes a loader, a player, a slider, tabs, a chart, a command palette, a toast, and finally the button again, so the video loops. A cursor clicks and drags to cause every change, on the beat. After [@twoclipping](https://x.com/twoclipping/status/2103273003555402193)'s UI motion study; reference frames in `docs/styles/uimorph.jpg`.

## Signature (every item must be on screen)
| # | Item | How (`uimorph.js`) |
|---|---|---|
| 1 | A single shape, never cut: every state is the same element changing size, corner radius, and fill | `umShape(t, SHAPE)` with one key per state |
| 2 | Content swaps inside it with a short blur, entering and leaving on its own timing | `umSwap(t, t0, t1, draw)` inside `umClip` |
| 3 | A cursor causes every change with real clicks and drags; dragged values follow it and spring back on release | `umCursor`, `umDrag` |
| 4 | Spring motion with at most a tiny overshoot; tab indicators and knobs stretch because their edges ride different springs | `spring`, `stretch` |
| 5 | Real UI states the subject would have (its buttons, player, sliders, tabs, chart, command palette, toast), in black and white on a light warm grey, one clean UI font | `UM` tokens, `umPlayPause`, `umCheck`, `umSpinner`, `umIcon`, `umChart`, `umBG` |
| 6 | Something happens on every beat; the camera zooms so each state fills the frame | `beat(n)`, `spring(t, CAM)` with `umFit` |
| 7 | The last frame is the first frame, cursor included, so it loops | the first and last keys of every track match |

## Look
- **Palette**: canvas `#ecebe7`, ink `#0b0b0b`, cards `#ffffff`, secondary text `#8d8c88`. Colour appears only in content such as album art or the subject's own accent; no gradients or glows on the UI itself.
- **Fonts**: `UI` Geist (Pretendard for Hangul), `UIMONO` Geist Mono for times and shortcuts.
- **Frame**: square 1440×1440 suits it; other frames work with the same camera.
- **Motion**: springs everywhere (`UM.k`, `UM.c`); no bouncy easing, particles, or dead time. Render with `VIDEO = { fps: 60, blur: 4 }` for motion blur.

## Building it
- Write each track as keys on the beat grid: `SHAPE` for the container, `CAM` for the zoom, `PATH`, `clicks`, and `holds` for the cursor. A value that changes several times is one `spring` over all its keys, so it stays a pure function of time.
- Plan the state list on the beat grid first and show it in the plan.
- Draw the cursor inside the camera with `s: 1.2 / zoom` so it keeps its size.

## Story shapes that fit
A product's UI tour, a feature list where each feature is a state, a before-and-after of a workflow.

## Sound
A 120 BPM track (`audio.py` at energy .6–.8, or a licensed song with `beats.py`); `click` on every click, `type` under typing, `pop` for toggles, placed on the measured beat.
