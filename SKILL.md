---
name: handdrawn-promo-video
description: Research a topic (a company, service, website, or product) and render a short promo video as an MP4 drawn entirely in code. Two independent choices shape it - a look (hand-drawn with 8-bit minis, brand motion graphics, sand art, 16-bit arcade, CRT terminal, thermal receipt, transit map, or blueprint) and a story format (standard promo, versus, terminal session, receipt, route map, spec sheet, lyric music video, or beat-synced footage). Asks for both first, then the video settings (length, aspect ratio, characters, on-screen language), gets a storyboard built from sourced facts and a research-based brand theme approved, then builds, checks, and renders it with code-generated music. Use for requests such as "make a promo video", "make an intro/launch video", "explainer video", "make a video about this company", or a named look or format. Not for live-action editing, subtitling, or sung vocals.
---

# Promo Video

`<skill>` is the folder that contains this SKILL.md. The engine lives in `<skill>/template/`:
- `kit.js`: hand-drawn lines, text and kinetic type, camera, transitions, pixel sprites, minis, image pixelation, video clips, `useFonts`
- look modules `arcade.js`, `terminal.js`, `thermal.js`, `transit.js`, `blueprint.js`: one shared scene API plus each look's signature format scene ([references/looks.md](references/looks.md))
- `sand.js`: the sand-on-a-light-table renderer for the sand look
- `minis-ai.js`: ready-made minis for AI-related topics (Claude, Codex, Gemini, DeepSeek, Grok, Qwen)
- `render.mjs`: parallel render with headless Chrome; muxes `audio.wav` when present
- `main.js`: scene skeleton

`<skill>/scripts/audio.py` synthesizes music and sound effects, and `<skill>/scripts/beats.py` finds a song's beat grid.

Required tools: `node`/`npm`, `ffmpeg` built with libx264, Google Chrome, and `uv`. If any is missing, stop and say which one.

```bash
for c in node npm ffmpeg uv; do command -v $c >/dev/null || echo "missing: $c"; done; ffmpeg -hide_banner -encoders | grep -q libx264 || echo "missing: libx264"
```

## 0. Ask for the look and the format, then the settings
The look is only the drawing style; the format is the story's structure. Any look works with any format. First ask for both in one short message with two numbered lists (more options than one question can hold). Skip what the user already named, and suggest a format from the topic (a comparison suggests versus, a lineup suggests route map, and so on). Open the chosen guides before planning.

Looks:

| Look | Feel | Default sound | Guide | Credit |
|---|---|---|---|---|
| 1. Hand-drawn + 8-bit minis (default) | playful, sketchbook | none | [references/storyboard.md](references/storyboard.md) | [@nahiddotai](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB) |
| 2. Brand motion graphics | clean, official | none | [references/styles/motion.md](references/styles/motion.md) | [@digitalstrategyai](https://www.threads.com/@digitalstrategyai/post/DdpAYbcgAj0) |
| 3. Sand art | warm, story-like | music and effects | [references/styles/sand.md](references/styles/sand.md) | [@Michaelzsguo](https://x.com/Michaelzsguo/status/2102592355165782312) |
| 4. 16-bit arcade | game, energetic | chiptune-style music and hits | [references/looks.md](references/looks.md) | original |
| 5. CRT terminal | developer, retro | key clicks, soft pad | [references/looks.md](references/looks.md) | original |
| 6. Thermal receipt | printed, tactile | printer ticks, stamp | [references/looks.md](references/looks.md) | original |
| 7. Transit map | diagram, orderly | chimes, trains | [references/looks.md](references/looks.md) | original |
| 8. Blueprint | technical, precise | drafting sounds | [references/looks.md](references/looks.md) | original |

Formats (details in [references/formats.md](references/formats.md)):

| Format | Structure | Credit |
|---|---|---|
| 1. Standard promo (default) | hook → title → steps → big number → ending | original |
| 2. Versus | rounds between two options, then a tally | original |
| 3. Session | commands and outputs that show how it is used | original |
| 4. Receipt | itemised list, total, stamp | original |
| 5. Route map | lines, stations, interchanges | original |
| 6. Spec sheet | parts, each with one spec | original |
| 7. Lyric music video | an original song, one fact per line | [@goodside](https://x.com/goodside/status/2102852546620744010) |
| 8. Beat-synced footage | cuts on a song's beats over real clips | [@twoclipping](https://x.com/twoclipping/status/2102554209166000267) |

When you list looks and formats, name each credited one's original source with its link.

Then ask the settings in one AskUserQuestion call. Skip anything the user already said, and put the recommended option first.

- Length: 30 s / 15 s / 45 s / 60 s
- Frame: 16:9 1920×1080 / 9:16 1080×1920 / 1:1 1080×1080 / 16:9 2560×1440
- Characters: logo mascot + topic minis / user-specified minis / logo mascot only / none
- On-screen language: the language of this conversation / English / both

Characters take the look's form: 8-bit sprites, sand silhouettes, pixel heroes, or flat icons. Minis are a supporting cast that fits the topic. Use the user's cast if they name one. Otherwise pick a cast from the research and propose it in the plan (see "Minis" in [references/storyboard.md](references/storyboard.md)).

Use these defaults for anything you did not ask, and state them in the plan:
- 30 fps, H.264 MP4, at most 10 MB per 30 s (a little more when there is sound)
- Sound as listed for the look; the lyric and beat formats always have music. There are no sung vocals.

## Rules for every look and format
- **Language**: every piece of on-screen text follows the on-screen language setting, including labels, HUD, lyrics, receipts, terminal output, and the end card.
- **Theme from research**: the palette comes from the brand's real colours (CI page, site CSS, or logo pixels) and the fonts from the brand where possible. Show the palette as hex values with their source in the plan. Looks with a fixed material (sand, terminal green, thermal paper, blueprint blue) keep it and carry the brand in the logo, one accent (`LOOK.colors`), and the end card.
- **Numbers**: every number has a source. Compute ages and "N years" from the founding date instead of copying an old "N years" line from the site. Do not invent UI readouts or example stats; use real values or leave them out.
- **Credit**: credited looks and formats name the creator whose idea they adapt. Keep those credits when you change a guide.

## 1. Research
Follow [references/research.md](references/research.md).
- Delegate facts, numbers, verbatim copy, and brand assets to read-only agents, and run independent searches in parallel.
- Check the headline numbers against the original sentence yourself.
- If sources disagree on a number, ask the user which one to use.

## 2. Plan approval
Show the following and get approval before you create the work folder:
- research summary with source links
- look and format, and the scene timeline using the patterns and timing in their guides
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
- `index.html`: set size, fps, and length in `window.VIDEO`, declare only the fonts you use with `@font-face`, and load `sand.js` for the sand look or one look module for looks 4–8 (its fonts load through `useFonts(LOOK.fonts)`).
- With a look module, build scenes from the scene API and the format's signature scene ([references/looks.md](references/looks.md)); set brand colours on `LOOK.colors`.
- `main.js`: THEME, scene functions, and `boot()`. The API is in [references/kit-api.md](references/kit-api.md).
- Use the real logo and wordmark files.
- Draw the logo mascot as a `drawPixels` sprite (or as a silhouette in the sand look).
- Register minis in `MINIS` and draw them with `drawMini`. For AI-related topics, load `minis-ai.js` and draw only the missing characters.
- Show the user one still of the character lineup early and get it confirmed.
- Keep copy and numbers as constants at the top of `main.js`. If a number still waits on the user's decision, branch on one URL parameter so both versions can be rendered.
- Sound: write `audio.json` with the same scene times as `main.js`, then `uv run --with numpy --with scipy python <skill>/scripts/audio.py audio.json audio.wav`. For the beat format, run `beats.py` on the song first and cut on its grid.

## 4. QA
Follow [references/qa-checklist.md](references/qa-checklist.md).
1. Render stills with `node render.mjs stills <mid-scene times and times just before and after each transition>`.
2. Build review sheets with `uv run --with pillow python <skill>/scripts/contact_sheet.py stills <temp-folder>` and look at them.
3. Fix what you find.
4. Render a draft with `CRF=25 node render.mjs video draft.mp4`, extract the transition frames and one frame every 2 s, and check the file size. With sound, check the audio stream, loudness, and cue timing.

## 5. Final render and delivery
- Render the final file with `CRF=25 node render.mjs video <Name>_intro.mp4`. If it exceeds the size target, raise CRF to 27 or lower `boot({ noise })`.
- Delete intermediate files such as `stills/`, the draft, and logs.
- Send the MP4 with `SendUserFile` (display `render`) and report:
  - spec: look, format, length, resolution, fps, file size, sound
  - the original source of a credited look or format, with its link
  - scene list
  - facts used, with source links
  - numbers dropped and why, and items that need confirmation
  - the re-render command, noting that it must run inside the work folder
