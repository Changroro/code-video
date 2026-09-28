---
name: code-video
description: Research a topic (a company, service, website, or product) and render a short promo video as an MP4 drawn entirely in code, in one of the bundled styles or any style the user describes or shows. The story is written from the research. Use for requests such as "make a promo video", "make an intro/launch video", "explainer video", "make a video about this company", or a named visual style. Not for live-action editing, subtitling, or sung vocals.
---

# Code Video

Make a short video drawn entirely in code from three inputs: a **design** (the style), the **research** on the topic, and the **format**. The story, scenes, pacing, and extras are yours.

`<skill>` is the folder that contains this SKILL.md. The engine is in `<skill>/template/` (`kit.js`, one module per style, `minis-ai.js` with ready-made minis for AI topics, `render.mjs`, a `main.js` skeleton); its API is [references/kit-api.md](references/kit-api.md). Helpers are in `<skill>/scripts/`: `fetch_fonts.sh`, `clean_logo.py`, `audio.py` (music and effects from `audio.json`), `beats.py`, `contact_sheet.py`, `site_tokens.py`.

Required tools: `node`/`npm`, `ffmpeg` with libx264, Google Chrome, and `uv`. If one is missing, stop and say which.

## Inputs
1. **Design.** Read the style headers with `grep '^# Style' <skill>/references/styles/*.md` and open the guide for the style the user asked for. For a style not listed there, use `free.md`.
2. **Research.** About 10 facts with sources, and the brand's real colours, fonts, and logo.
3. **Format.** Length, frame, on-screen language, and characters. Ask once for what the user did not say; the defaults are 30 s, 16:9 1920×1080, 30 fps, and the conversation's language.

Show a short plan (the story in a few lines, the palette, the facts) and get approval before building.

## Rules
- Every number on screen has a source. No invented stats or UI readouts.
- Wait for your own work: run renders in the foreground with a long Bash timeout (up to 600000 ms). In a non-interactive run nothing wakes you up again.

## Build and render
```bash
cp -R <skill>/template <work-folder>/<name>-video && cd <work-folder>/<name>-video
chmod -R u+w . && npm i
bash <skill>/scripts/fetch_fonts.sh assets/fonts
```
Set size, fps, and length in `window.VIDEO` in `index.html`, declare the fonts (for Korean, pair each Latin face with a Hangul face through `unicode-range`), load the style's module, and write the scenes in `main.js`. For both languages, branch on one URL parameter and render each with `QUERY=lang=ko node render.mjs video …`. For sound, write `audio.json` and run `uv run --with numpy --with scipy python <skill>/scripts/audio.py audio.json audio.wav`; the render muxes it.

Look at a few stills (`node render.mjs stills <times>`, where a range such as `12-14` gives six frames across a moving shot, then `uv run --with pillow python <skill>/scripts/contact_sheet.py stills <dir>`), fix what looks wrong, and render with `CRF=25 node render.mjs video <Name>.mp4`. Keep it under about 10 MB per 30 s; if it is larger, render again with `CRF=27`.

## Deliver
Send the MP4 and list the facts used with their sources.
