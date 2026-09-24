# Storyboard and visual grammar

The Timing and Transitions sections apply to every look. The default hand-drawn look's signature (plain paper, ink horizon, serif title card, WORLD tags, hatched bars, HI-SCORE) is in [styles/handdrawn.md](styles/handdrawn.md); build that first. The Style and Scene patterns below are extras for that look, used after the signature is in place. The other looks are in `references/styles/` and [looks.md](looks.md), and story formats in [formats.md](formats.md).

## Style
- **Hand-drawn**: rough.js lines wobble 10 times per second (line boil). Alternate between plain paper (`hdPaper`) and dark cards (`hdDark`, `introCard`, `hiScore`) across scenes for contrast. Keep the paper plain: no `grid()` in this look.
- **Lead character**: an 8-bit pixel character. The contrast between the hand-drawn world and the pixel characters is the core of the style.
  - Logo-based: draw a sprite from the logo's silhouette and colors. Pixelating the real logo step by step with `pixelImage` and then swapping in the sprite reads as "the logo turns into the character".
  - If the logo is built on a geometric grid (triangles, hexagons, and so on), sample each shape's color from the original and rebuild it as vectors. Then pieces of the real logo can scatter and reassemble.
  - Draw a character the user specified from their description.
- **Minis**: a supporting cast that fills the topic's world. Use 3 to 6 per video, each with a name tag.
  - If the user named a cast, use it.
  - Otherwise derive it from the topic: the AIs an AI service covers, a company's products, business lines, or customer types, an app's user types or key features, an event's participants.
  - Reinterpret real brands and products as pixels using their shape and main color. For AI-related topics, reuse the `minis-ai.js` set.
  - Keep sprites 12 to 18 pixels wide. Mark eyes with `E` (blink) and blinking parts with `C`, and use `outline` when the contrast with the background is weak.
- **Color**: reduce the brand colors to four values (ink, paper, dark, light) plus one or two accents. Use the real logo and wordmark files.
- **Fonts**: prefer the brand fonts you confirmed. Otherwise pick fonts for headlines, handwritten notes, and pixel labels that cover the script of the on-screen text.
  - `scripts/fetch_fonts.sh` downloads a default set: Pretendard, Black Han Sans, Gaegu, Nanum Myeongjo (Hangul and Latin), Geist, Playfair Display (Latin), Press Start 2P (Latin-only pixel font).
  - For other scripts, get matching fonts from Google Fonts and add them with `@font-face`.

## Timing
Guidelines for the number and length of scenes. Every scene has beats every 0.5 to 0.7 s.

| Length | Structure |
|---|---|
| 15 s | hook 2 · logo/lead entrance 3 · two core scenes 6 · stats 2 · ending 2 |
| 30 s | hook 2.5–3.5 · entrance 3 · history/problem 3 · three or four core scenes 12 · stats 4 · ending 4.5 |
| 45–60 s | the 30 s structure with more core scenes and 0.5 s more breathing room per scene |

Hold the ending logo and URL still for at least 1.5 s. A key line needs at least 0.6 s on screen to be read.

## Scene patterns
- **Hook**: open the subject's world on a dark screen or in chaos. Start with one short line, crash zoom, reveal the answer line, then cut to paper. Or let related material (clippings, cards) pour down and pile up.
- **Logo → lead**: assemble the logo in sweep order → pixelate it → the character pops out and says hello → it jumps toward the camera as a zoom transition.
- **Year stamp**: draw the setting and a structure by hand, slam a year stamp with a screen shake, and add a highlighter label.
- **Map + counter**: dot a hand-drawn map, and the character hops from dot to dot lighting each one. A big number counts up beside it, slams to a stop, and gets a hand-drawn circle. To avoid claiming specific sites, do not label the dots.
- **Fast card cuts**: five business lines or features at 0.6 s each. Alternate light and dark backgrounds; each card has an icon, a small tag, a large title, and a handwritten subtitle.
- **Character shout cuts**: one character every 0.5 s with a ray background, a comic speech bubble, and a name tag, ending with everyone shouting at once.
- **Newspaper spin**: a front page spins in over several turns and stops, then the camera zooms into the logo on the masthead to move on.
- **Process or pipeline**: lay the world out wide and pan with `camKeys`. Input → processing → output, with one caption line at the top per stage.
- **Chaos → order**: cards scatter and then snap into list slots. The first card gets a highlighter and a stamp.
- **Data fusion**: packets flow from data source icons into the logo drawn as a network grid, and the logo fills in. Follow with a detection HUD (tracking brackets, alert box).
- **Stats board**: four taped cards. The camera slams into each card at 1.75×, then pulls back to show them all, and the cards fly off in all directions.
- **Ending**: the lead jumps up and rains back down as logo pieces that form the logo, or a group photo → flash → clipping. Then type the slogan and URL with a highlighter. End with a small gag such as a wink.

## Transitions
- white or colored flash for 2 to 4 frames
- zoom-through (`zoomLines`)
- whip pan (`speedLines` plus a camera x move)
- ink wipe (`inkBand`)
- zoom into an object (a screen, the logo)

Do not use the same transition twice in a row.
