# Style: UI morph

One interface element that never cuts: a button becomes a loader, a player, a slider, tabs, a chart, a command palette, a toast, and finally the button again, so the video loops. A cursor clicks and drags to cause every change, on the beat. Reference frames are in `docs/styles/uimorph.jpg`.

## Signature
| # | Item |
|---|---|
| 1 | A single shape, never cut: every state is the same element changing size, corner radius, and fill |
| 2 | Content swaps inside it with a short blur, entering and leaving on its own timing |
| 3 | A cursor causes every change with real clicks and drags; dragged values follow it and spring back on release |
| 4 | Spring motion with at most a tiny overshoot; tab indicators and knobs stretch because their edges ride different springs |
| 5 | Real UI states the subject would have (its buttons, player, sliders, tabs, chart, command palette, toast), in black and white on a light warm grey, one clean UI font |
| 6 | Something happens on every beat; the camera zooms so each state fills the frame |
| 7 | The last frame is the first frame, cursor included, so it loops |

## Look
- **Palette**: canvas `#ecebe7`, ink `#0b0b0b`, cards `#ffffff`, secondary text `#8d8c88`. Colour appears only in content such as album art or the subject's own accent; no gradients or glows on the UI itself.
- **Fonts**: Geist (Pretendard for Hangul), Geist Mono for times and shortcuts.
- **Motion**: springs everywhere; no bouncy easing, particles, or dead time.
