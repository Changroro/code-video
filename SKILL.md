---
name: handdrawn-promo-video
description: Research a topic (a company, service, website, or product) and render a short promo video as an MP4 in one of five code-drawn styles - hand-drawn canvas with 8-bit mini characters, brand motion graphics, sand art chronicle, lyric music video, or beat-synced footage promo. Asks for the style first, then the video settings (length, aspect ratio, characters, on-screen language), gets a storyboard built from sourced facts and a research-based brand theme approved, then builds, checks, and renders it with code-generated music where the style calls for it. Use for requests such as "make a promo video", "make an intro/launch video", "hand-drawn animation video", "explainer video", or "make a video about this company". Not for live-action editing, subtitling, or sung vocals.
---

# Promo Video

`<skill>` is the folder that contains this SKILL.md. The engine lives in `<skill>/template/`:
- `kit.js`: hand-drawn lines, text and kinetic type, camera, transitions, pixel sprites, minis, image pixelation, video clips
- `sand.js`: the sand-on-a-light-table renderer for the sand style
- `minis-ai.js`: ready-made minis for AI-related topics (Claude, Codex, Gemini, DeepSeek, Grok, Qwen)
- `render.mjs`: parallel render with headless Chrome; muxes `audio.wav` when present
- `main.js`: scene skeleton

`<skill>/scripts/audio.py` synthesizes music and sound effects, and `<skill>/scripts/beats.py` finds a song's beat grid.

Required tools: `node`/`npm`, `ffmpeg` built with libx264, Google Chrome, and `uv`. If any is missing, stop and say which one.

```bash
for c in node npm ffmpeg uv; do command -v $c >/dev/null || echo "missing: $c"; done; ffmpeg -hide_banner -encoders | grep -q libx264 || echo "missing: libx264"
```

## 0. Ask for the style, then the settings
First ask for the style on its own, as a short numbered message (there are more styles than one question can offer as options). Skip it if the user already named one. Open the style's guide before planning.

| Style | Best for | Sound | Guide | Original source |
|---|---|---|---|---|
| 1. Hand-drawn + 8-bit minis (default) | launches, services, anything playful | none | [references/storyboard.md](references/storyboard.md) | [@nahiddotai](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB) |
| 2. Brand motion graphics | company or product explainers that should look official | none | [references/styles/motion.md](references/styles/motion.md) | [@digitalstrategyai](https://www.threads.com/@digitalstrategyai/post/DdpAYbcgAj0) |
| 3. Sand art chronicle | history, founding stories, timelines | music and effects | [references/styles/sand.md](references/styles/sand.md) | [@Michaelzsguo](https://x.com/Michaelzsguo/status/2102592355165782312) |
| 4. Lyric music video | memorable educational explainers | instrumental, lyrics on screen | [references/styles/lyric.md](references/styles/lyric.md) | [@goodside](https://x.com/goodside/status/2102852546620744010) |
| 5. Beat-synced footage promo | when the user has their own clips and a licensed song | the song and effects | [references/styles/beat.md](references/styles/beat.md) | [@twoclipping](https://x.com/twoclipping/status/2102554209166000267) |

When you list the styles for the user, name each one's original source with its link.

Then ask the settings in one AskUserQuestion call. Skip anything the user already said, and put the recommended option first (the style guide says which lengths suit it).

- Length: 30 s / 15 s / 45 s / 60 s
- Frame: 16:9 1920×1080 / 9:16 1080×1920 / 1:1 1080×1080 / 16:9 2560×1440
- Characters: logo mascot + topic minis / user-specified minis / logo mascot only / none
- On-screen language: the language of this conversation / English / both

Characters take the style's form: 8-bit sprites, sand silhouettes, or flat icons. Minis are a supporting cast that fits the topic. Use the user's cast if they name one. Otherwise pick a cast from the research and propose it in the plan (see "Minis" in [references/storyboard.md](references/storyboard.md)).

Use these defaults for anything you did not ask, and state them in the plan:
- 30 fps, H.264 MP4, at most 10 MB per 30 s (a little more when there is sound)
- Sound as listed for the style. There are no sung vocals.

## Rules for every style
- **Language**: every piece of on-screen text follows the on-screen language setting, including labels, HUD, lyrics, and the end card.
- **Theme from research**: the palette comes from the brand's real colours (CI page, site CSS, or logo pixels) and the fonts from the brand where possible. Show the palette as hex values with their source in the plan. Styles with a fixed material, such as sand, use the brand for the logo, end card, and one accent.
- **Numbers**: every number has a source. Compute ages and "N years" from the founding date instead of copying an old "N years" line from the site. Do not invent UI readouts or example stats; use real values or leave them out.
- **Credit**: each style guide names the creator whose idea it adapts. Keep those credits when you change a guide.

## 1. Research
Follow [references/research.md](references/research.md).
- Delegate facts, numbers, verbatim copy, and brand assets to read-only agents, and run independent searches in parallel.
- Check the headline numbers against the original sentence yourself.
- If sources disagree on a number, ask the user which one to use.

## 2. Plan approval
Show the following and get approval before you create the work folder:
- research summary with source links
- style, and the scene timeline using the patterns and timing in the style guide
- palette (hex values and where each came from) and fonts
- sound plan when the style has sound: tempo, sections, and cues
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
- `index.html`: set size, fps, and length in `window.VIDEO`, declare only the fonts you use with `@font-face`, and load `sand.js` for the sand style.
- `main.js`: THEME, scene functions, and `boot()`. The API is in [references/kit-api.md](references/kit-api.md).
- Use the real logo and wordmark files.
- Draw the logo mascot as a `drawPixels` sprite (or as a silhouette in the sand style).
- Register minis in `MINIS` and draw them with `drawMini`. For AI-related topics, load `minis-ai.js` and draw only the missing characters.
- Show the user one still of the character lineup early and get it confirmed.
- Keep copy and numbers as constants at the top of `main.js`. If a number still waits on the user's decision, branch on one URL parameter so both versions can be rendered.
- Sound: write `audio.json` with the same scene times as `main.js`, then `uv run --with numpy --with scipy python <skill>/scripts/audio.py audio.json audio.wav`. For the beat style, run `beats.py` on the song first and cut on its grid.

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
  - spec: style, length, resolution, fps, file size, sound
  - the style's original source, with its link
  - scene list
  - facts used, with source links
  - numbers dropped and why, and items that need confirmation
  - the re-render command, noting that it must run inside the work folder
