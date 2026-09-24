# Format: beat-synced footage promo

A high-end, minimal promo cut to a song: a hook that lands word by word on a light stage, the product UI, then real clips on a dark stage as a scanned wall, a 3D carousel, and a phone next to a campaign panel, with stats on push cuts and every cut on a beat.

Credit: adapted from the beat-synced promo template shared by [@twoclipping](https://x.com/twoclipping/status/2102554209166000267). The original prompt is not included; this guide is our own write-up.

## Reference
Open `<skill>/docs/styles/beat.jpg` (four frames from the original) before planning, and compare your stills with it during QA. The original is a 20 s promo for hooklab, an ad tool ("ads that make themselves"), at 60 fps with motion blur: "your next ad is one ■ away" → drop a product link → a wall of UGC clips being analysed → ranked hooks → a carousel of generated ads → a phone and a "launch campaign" panel → 3.5x / 4.2x / 24 → "hooks, ads, launched" → logo.

This format has its own look (below). Use another look only when the user asks for one.

## When to use
Only when the user has real footage: their own clips, product screen recordings, or event video. Without it, suggest another format. Stock footage makes the result generic and says nothing true about the subject.

## Inputs to ask for
- 8 to 20 clips the user owns (vertical works best), plus 3 to 5 product or UI moments to show
- a song the user may use commercially (their own, or a library track whose licence allows it); if there is none, synthesize one with `audio.py`
- the product name, the one-line promise, one accent colour, and the numbers to show (from the research or the user, never invented)

## Signature (every item must be on screen)
| # | Item | How (`beat.js`) |
|---|---|---|
| 1 | The hook lands word by word on the beats on a warm light stage, with one word hidden as an accent block | `stageLight(t)`, `beatWords([[w, time], …, ['■', time]], …)` |
| 2 | The product UI: the masked block grows into a clean window where a cursor types an input and clicks the button | `beatWords` returns the block's box; `appWindow`, `field`, `pillButton`, `cursor` |
| 3 | The drop into a near-black stage with a warm floor glow | `stageDark()`, `circleWipe` from the button |
| 4 | A wall of real vertical clips scanned by a light bar, all but three winners dimmed, winners framed with a score tag | `clipWall(ids, t, { scan, winners, tags, caption })` |
| 5 | The key output as big type or ranked rows with scores | `scoreRows`, `text` |
| 6 | A 3D carousel of clips with floor reflections that whips onto one hero clip | `carousel(ids, t, spin)` with a fast spin at the end |
| 7 | The hero clip in a phone next to a settings panel: toggles switch on, the button turns green, the panel flips into results | `phoneClip`, `campaignPanel` |
| 8 | Big stats on push cuts with motion blur, a three-word ticker with the last word in the accent, then the logo | `pushStat`, `ticker`, `window.VIDEO = { fps: 60, blur: 3 }` |

## Look
- **Palette**: light stage `#f7f3ef` with peach glows `#ffd9c4`, dark stage `#0b0b0c` with an orange floor glow, ink `#151515` / `#f4f4f4`, one accent (the brand's; the original used orange `#ff5a1f`), success green `#22c55e` for the button only.
- **Type**: one clean sans with tight tracking (`BSANS` Geist or Inter), a mono for tiny labels. Korean: Pretendard. No full stops in on-screen text.
- **Motion**: one smooth camera language, masked reveals, match cuts (the button becomes the circle wipe, the hero card becomes the phone). 60 fps with `blur: 3` for real motion blur on the whip and push cuts.
- **Banned**: shockwave rings, particle bursts, RGB split, camera shake, lens flares, neon glows, grid floors, flashing backgrounds, bouncy easing.

## Structure (10 bars at 120 BPM, 2 s each)
| Bar | Beat |
|---|---|
| 1 | Hook words on the beats, the masked block |
| 2 | The block becomes the product UI; the cursor types and clicks |
| 3 (the drop) | A circle opens from the button into the dark stage: the clip wall with the scan and three winners |
| 4 | The key output as ranked rows or big type |
| 5 | The carousel, then the motion-blurred whip onto the hero clip |
| 6 | The hero in a phone beside the panel; the panel flips into results |
| 7 | Big stats on push cuts |
| 8 | The three-word ticker |
| 9 | The logo reveal with the promise |
| 10 | Fade to black |

## Prep
```bash
# each clip becomes a JPEG sequence; register it as clips: { id: { n: <frame count> } } in boot()
ffmpeg -i clip1.mp4 -vf "fps=30,scale=-2:720" -q:v 3 assets/clips/c1/%04d.jpg
uv run --with librosa python <skill>/scripts/beats.py assets/song.mp3 <offset> > beats.json
```
Check the beat grid against the actual kicks. The tempo estimate can be a few percent off; adjust the offset or BPM until downbeats line up. With a synthesized song the grid is exact: cut on `bar * 2` s at 120 BPM.

## Sound
`audio.json` with `"song": {"path": "assets/song.mp3", "offset": <s>}`, or synthesized music with a drop at bar 3 (energy .5 → 1.0). Place `click`, `type`, `whoosh`, `pop` cues so their peak lands on the event. Keep effects quiet under the music; `render.mjs` normalises loudness.

## Rules
- Every cut on a downbeat, every UI hit on a beat.
- UI readouts show real values from the research or the user, or are clearly marked as examples. Do not invent them.
- Clips stay at 30 fps and repeat frames at 60 fps.
