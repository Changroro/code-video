---
name: handdrawn-promo-video
description: Research a topic (a company, service, website, or product) and render a short promo video as an MP4 in a hand-drawn canvas animation style with 8-bit mini characters picked for the topic. Asks for the video settings (length, aspect ratio, characters) first, gets a storyboard built from sourced facts approved, then builds, checks, and renders it. Use for requests such as "make a promo video", "make an intro/launch video", "hand-drawn animation video", or "make a video about this company". Not for live-action editing, subtitling, or music videos.
---

# Hand-drawn Promo Video

`<skill>` is the folder that contains this SKILL.md. The engine lives in `<skill>/template/`:
- `kit.js`: hand-drawn lines, text, camera, transitions, pixel sprites, minis, image pixelation
- `minis-ai.js`: ready-made minis for AI-related topics (Claude, Codex, Gemini, DeepSeek, Grok, Qwen)
- `render.mjs`: parallel render with headless Chrome
- `main.js`: scene skeleton

Required tools: `node`/`npm`, `ffmpeg` built with libx264, Google Chrome, and `uv`. If any is missing, stop and say which one.

```bash
for c in node npm ffmpeg uv; do command -v $c >/dev/null || echo "missing: $c"; done; ffmpeg -hide_banner -encoders | grep -q libx264 || echo "missing: libx264"
```

## 0. Ask for the settings
Ask in one AskUserQuestion call. Skip anything the user already said, and put the recommended option first.

- Length: 30 s / 15 s / 45 s / 60 s
- Frame: 16:9 1920×1080 / 9:16 1080×1920 / 1:1 1080×1080 / 16:9 2560×1440
- Characters: logo mascot + topic minis / user-specified minis / logo mascot only / none

Minis are an 8-bit supporting cast that fits the topic. Use the user's cast if they name one. Otherwise pick a cast from the research and propose it in the plan (see "Minis" in [references/storyboard.md](references/storyboard.md)).

Use these defaults for anything you did not ask, and state them in the plan:
- 30 fps, H.264 MP4, at most 10 MB per 30 s
- No audio. The engine renders silent video.

## 1. Research
Follow [references/research.md](references/research.md).
- Delegate facts, numbers, verbatim copy, and brand assets to read-only agents, and run independent searches in parallel.
- Check the headline numbers against the original sentence yourself.
- If sources disagree on a number, ask the user which one to use.

## 2. Plan approval
Show the following and get approval before you create the work folder:
- research summary with source links
- scene timeline, using the patterns and timing in [references/storyboard.md](references/storyboard.md)
- numbers used and numbers dropped, asset list (logo URL, fonts, characters), work folder location

If the user changes scenes or emphasis, restate the revised flow once, then proceed.

## 3. Build
```bash
cp -R <skill>/template <work-folder>/<name>-video && cd <work-folder>/<name>-video
npm i
bash <skill>/scripts/fetch_fonts.sh assets/fonts
curl -fsSL -o assets/logo_src.png '<official logo URL>'
uv run --with pillow python <skill>/scripts/clean_logo.py assets/logo_src.png assets/logo.png
```
- `index.html`: set size, fps, and length in `window.VIDEO`, and declare only the fonts you use with `@font-face`.
- `main.js`: THEME, scene functions, and `boot()`. The API is in [references/kit-api.md](references/kit-api.md).
- Use the real logo and wordmark files.
- Draw the logo mascot as a `drawPixels` sprite.
- Register minis in `MINIS` and draw them with `drawMini`. For AI-related topics, load `minis-ai.js` and draw only the missing characters.
- Show the user one still of the character lineup early and get it confirmed.
- Keep copy and numbers as constants at the top of `main.js`. If a number still waits on the user's decision, branch on one URL parameter so both versions can be rendered.

## 4. QA
Follow [references/qa-checklist.md](references/qa-checklist.md).
1. Render stills with `node render.mjs stills <mid-scene times and times just before and after each transition>`.
2. Build review sheets with `uv run --with pillow python <skill>/scripts/contact_sheet.py stills <temp-folder>` and look at them.
3. Fix what you find.
4. Render a draft with `CRF=25 node render.mjs video draft.mp4`, extract the transition frames, and check the file size.

## 5. Final render and delivery
- Render the final file with `CRF=25 node render.mjs video <Name>_intro.mp4`. If it exceeds the size target, raise CRF to 27 or lower `boot({ noise })`.
- Delete intermediate files such as `stills/`, the draft, and logs.
- Send the MP4 with `SendUserFile` (display `render`) and report:
  - spec: length, resolution, fps, file size
  - scene list
  - facts used, with source links
  - numbers dropped and why, and items that need confirmation
  - the re-render command, noting that it must run inside the work folder
