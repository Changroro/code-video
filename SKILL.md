---
name: code-video
description: Research a topic (a company, service, website, or product) and render a short promo video as an MP4 drawn entirely in code. Two independent choices shape it - a look (hand-drawn with 8-bit minis, brand motion graphics, sand art, 16-bit arcade, CRT terminal, thermal receipt, transit map, blueprint, and more as they are added) and a story format (standard promo, versus, terminal session, receipt, route map, spec sheet, lyric music video, beat-synced footage). Asks for both first, then the video settings (length, aspect ratio, characters, on-screen language), gets a storyboard built from sourced facts and a research-based brand theme approved, then builds, checks against the credited original, and renders it with code-generated music. Use for requests such as "make a promo video", "make an intro/launch video", "explainer video", "make a video about this company", or a named look or format. Not for live-action editing, subtitling, or sung vocals.
---

# Code Video

`<skill>` is the folder that contains this SKILL.md. The engine lives in `<skill>/template/`:
- `kit.js`: hand-drawn lines, text and kinetic type, camera, transitions, pixel sprites, minis, image pixelation, video clips, phone and cursor props, motion blur, `useFonts`
- style modules for the credited looks and formats: `handdrawn.js`, `motion.js`, `sand.js`, `lyric.js`, `beat.js` (each draws that original's signature pieces)
- look modules `arcade.js`, `terminal.js`, `thermal.js`, `transit.js`, `blueprint.js`: one shared scene API plus each look's signature format scene ([references/looks.md](references/looks.md))
- `minis-ai.js`: ready-made minis for AI-related topics (Claude, Codex, Gemini, DeepSeek, Grok, Qwen)
- `render.mjs`: parallel render with headless Chrome; muxes `audio.wav` when present
- `main.js`: scene skeleton

`<skill>/scripts/audio.py` synthesizes music and sound effects, `<skill>/scripts/beats.py` finds a song's beat grid, and `<skill>/scripts/reference_sheet.py` puts a credited original's frames above yours.

Required tools: `node`/`npm`, `ffmpeg` built with libx264, Google Chrome, and `uv`. If any is missing, stop and say which one.

```bash
for c in node npm ffmpeg uv; do command -v $c >/dev/null || echo "missing: $c"; done; ffmpeg -hide_banner -encoders | grep -q libx264 || echo "missing: libx264"
```

## 0. Ask for the look and the format, then the settings
The look is only the drawing style; the format is the story's structure. Any look works with any format, except that the lyric and beat formats bring their own look unless the user asks for another. First ask for both in one short message with two numbered lists (more options than one question can hold). Skip what the user already named, and suggest a format from the topic (a comparison suggests versus, a lineup suggests route map, and so on).

Looks:

| Look | Feel | Default sound | Guide | Credit |
|---|---|---|---|---|
| 1. Hand-drawn + 8-bit minis (default) | playful, sketchbook | none | [styles/handdrawn.md](references/styles/handdrawn.md) | [@nahiddotai](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB) |
| 2. Brand motion graphics | clean, official | none | [styles/motion.md](references/styles/motion.md) | [@digitalstrategyai](https://www.threads.com/@digitalstrategyai/post/DdpAYbcgAj0) |
| 3. Sand art | warm, story-like | music and effects | [styles/sand.md](references/styles/sand.md) | [@Michaelzsguo](https://x.com/Michaelzsguo/status/2102592355165782312) |
| 4. 16-bit arcade | game, energetic | chiptune-style music and hits | [looks.md](references/looks.md) | original |
| 5. CRT terminal | developer, retro | key clicks, soft pad | [looks.md](references/looks.md) | original |
| 6. Thermal receipt | printed, tactile | printer ticks, stamp | [looks.md](references/looks.md) | original |
| 7. Transit map | diagram, orderly | chimes, trains | [looks.md](references/looks.md) | original |
| 8. Blueprint | technical, precise | drafting sounds | [looks.md](references/looks.md) | original |

Formats (details in [references/formats.md](references/formats.md)):

| Format | Structure | Credit |
|---|---|---|
| 1. Standard promo (default) | hook → title → steps → big number → ending | original |
| 2. Versus | rounds between two options, then a tally | original |
| 3. Session | commands and outputs that show how it is used | original |
| 4. Receipt | itemised list, total, stamp | original |
| 5. Route map | lines, stations, interchanges | original |
| 6. Spec sheet | parts, each with one spec | original |
| 7. Lyric music video (own look) | an original song, one fact and one diagram per line | [@goodside](https://x.com/goodside/status/2102852546620744010) |
| 8. Beat-synced footage (own look) | real clips cut on a song's beats: wall, carousel, phone | [@twoclipping](https://x.com/twoclipping/status/2102554209166000267) |

When you list looks and formats, name each credited one's original source with its link.

Then ask the settings in one AskUserQuestion call. Skip anything the user already said, and put the recommended option first.

- Length: 30 s / 15 s / 45 s / 60 s
- Frame: 16:9 1920×1080 / 9:16 1080×1920 / 1:1 1080×1080 / 16:9 2560×1440
- Characters: logo mascot + topic minis / user-specified minis / logo mascot only / none
- On-screen language: the language of this conversation / English / both

Characters take the look's form: 8-bit sprites, sand silhouettes, pixel heroes, or flat icons. Minis are a supporting cast that fits the topic. Use the user's cast if they name one. Otherwise pick a cast from the research and propose it in the plan (see "Minis" in [references/storyboard.md](references/storyboard.md)).

Use these defaults for anything you did not ask, and state them in the plan:
- 30 fps (60 fps with motion blur for the beat format), H.264 MP4, at most 10 MB per 30 s (a little more when there is sound)
- Sound as listed for the look; the lyric and beat formats always have music. There are no sung vocals.

## Rules for every look and format
- **Credited looks reproduce the original.** Before planning, open the guide and look at its reference frames `<skill>/docs/styles/<key>.jpg` with the Read tool. Every item in the guide's Signature table must appear on screen; the table is a requirement, not a menu. Extras come after the signature, never instead of it.
- **Language**: every piece of on-screen text follows the on-screen language setting, including labels, HUD, lyrics, receipts, terminal output, and the end card.
- **Theme from research**: the palette comes from the brand's real colours (CI page, site CSS, or logo pixels) and the fonts from the brand where possible. Show the palette as hex values with their source in the plan. Looks with a fixed material or field (sand, dark motion field, terminal green, thermal paper, blueprint blue) keep it and carry the brand in the logo, one accent, and the end card.
- **Numbers**: every number has a source. Compute ages and "N years" from the founding date instead of copying an old "N years" line from the site. Do not invent UI readouts or example stats; use real values or leave them out.
- **Credit**: credited looks and formats name the creator whose idea they adapt. Keep those credits when you change a guide.
- **Wait for your own work.** Run renders in the foreground with a long Bash timeout (up to 600000 ms). When you start agents or commands in the background, wait for their results before you end your turn: in a non-interactive run nothing wakes you up again.

## 1. Research
Follow [references/research.md](references/research.md).
- Keep it proportional: for a video under a minute, about 10 sourced facts and the brand assets are enough. Give a read-only agent one narrow brief (the questions, the sites, a cap of about 15 fetches) and run independent searches in parallel.
- Check the headline numbers against the original sentence yourself.
- If sources disagree on a number, ask the user which one to use.

## 2. Plan approval
Show the following and get approval before you create the work folder:
- research summary with source links
- look and format, and the scene timeline using the patterns and timing in their guides
- for a credited look or format: its signature table with the scene that shows each item
- palette (hex values and where each came from) and fonts
- sound plan when the look or format has sound: tempo, sections, and cues
- numbers used and numbers dropped, asset list (logo URL, fonts, characters, clips, song licence), work folder location

If the user changes scenes or emphasis, restate the revised flow once, then proceed.

## 3. Build
```bash
cp -R <skill>/template <work-folder>/<name>-video && cd <work-folder>/<name>-video
chmod -R u+w .   # the installed skill may be read-only, and cp keeps its modes
npm i
bash <skill>/scripts/fetch_fonts.sh assets/fonts
curl -fsSL -o assets/logo_src.png '<official logo URL>'
uv run --with pillow python <skill>/scripts/clean_logo.py assets/logo_src.png assets/logo.png
```
- `index.html`: set size, fps, and length in `window.VIDEO`; declare the fonts the guide names with `@font-face` (and only those); load the style module for a credited look or format (`handdrawn.js`, `motion.js`, `sand.js`, `lyric.js`, `beat.js`) or one look module for looks 4–8 (its fonts load through `useFonts(LOOK.fonts)`).
- With a look module, build scenes from the scene API and the format's signature scene ([references/looks.md](references/looks.md)); set brand colours on `LOOK.colors`.
- `main.js`: THEME, scene functions, and `boot()`. The API is in [references/kit-api.md](references/kit-api.md).
- Use the real logo and wordmark files.
- Draw the logo mascot as a `drawPixels` sprite (or as a silhouette in the sand look).
- Register minis in `MINIS` and draw them with `drawMini`. For AI-related topics, load `minis-ai.js` and draw only the missing characters.
- Show the user one still of the character lineup early and get it confirmed.
- Keep copy and numbers as constants at the top of `main.js`. For two versions (a pending number, two languages), branch on one URL parameter and render each with `QUERY=lang=ko node render.mjs video …`.
- Sound: write `audio.json` with the same scene times as `main.js`, then `uv run --with numpy --with scipy python <skill>/scripts/audio.py audio.json audio.wav`. For the beat format, run `beats.py` on the song first and cut on its grid.

## 4. QA
Follow [references/qa-checklist.md](references/qa-checklist.md).
1. Render stills with `node render.mjs stills <mid-scene times and times just before and after each transition>`.
2. Build review sheets with `uv run --with pillow python <skill>/scripts/contact_sheet.py stills <temp-folder>` and look at them.
3. Fix what you find.
4. Render the video once with `CRF=25 node render.mjs video <Name>.mp4`, extract the transition frames and one frame every 2 s, and check the file size. With sound, check the audio stream, loudness, and cue timing.
5. For a credited look or format, build `uv run --with pillow python <skill>/scripts/reference_sheet.py <key> <Name>.mp4 <temp-folder>/ref.jpg`, look at it, and tick every signature item. Fix any miss and render again.

## 5. Delivery
- The QA render is the delivery file. Render again only after a fix; if it exceeds the size target, raise CRF to 27 or lower `boot({ noise })`.
- Delete intermediate files such as `stills/` and logs.
- Send the MP4 with `SendUserFile` (display `render`) and report:
  - spec: look, format, length, resolution, fps, file size, sound
  - the original source of a credited look or format, with its link, and the signature checklist result
  - scene list
  - facts used, with source links
  - numbers dropped and why, and items that need confirmation
  - the re-render command, noting that it must run inside the work folder
