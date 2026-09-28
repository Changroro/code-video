# kit.js

Global scripts. `index.html` loads kit.js → main.js in that order. `window.VIDEO = { w, h, fps, dur, blur, shutter }` sets the canvas size, length, and optional motion blur.

## Globals
`W`, `H`, `FPS`, `DUR` from `window.VIDEO`, `ctx` (the 2D context of the `#c` canvas), `T` (video time in seconds), `IMG` (loaded images). `render.mjs` calls `renderFrame(f)` and captures the `#c` canvas, so frame `f` must look the same however many times it is drawn.

## Boot
```js
boot({
  scenes: [[start, end, fn], ...],        // fn(t) - t is seconds since the scene started
  images: { logo: 'assets/logo.png' },    // → IMG.logo
  fonts: [['PRE', 'Aa'], ['PIX', 'A']],   // @font-face name and sample characters
  setup: () => { /* pre-render offscreen canvases after fonts load */ },
});
```
`?t=12.3` previews one frame, and `?play` plays in real time.

## Render
- `node render.mjs stills 1.2 3.4 30-31.5 ...` → `stills/t<seconds>.png`; a range gives six evenly spaced frames across it, which shows motion a single still misses (something leaving the frame, a card that never appears).
- `CRF=25 WORKERS=4 node render.mjs video out.mp4` → H.264, yuv420p, faststart, at the size and fps in `window.VIDEO`. Frames are captured as JPEG (2–3× faster than PNG, visually identical after H.264); `CAPTURE=png` forces lossless capture. About 1–2 minutes for 30 s at 1080p; more workers than 4 usually slows Chrome down.
- `QUERY=lang=ko node render.mjs …` appends `?lang=ko` to the page URL, for rendering two versions from one `main.js`.
- If `audio.wav` exists in the work folder, the video gets an AAC track normalised to -14 LUFS.

## Sound
- `uv run --with numpy --with scipy python <skill>/scripts/audio.py audio.json audio.wav`: synthesized music (pad, bass, arpeggio, drums by section energy) and effects (`whoosh`, `pop`, `click`, `chime`, `ping`, `thud`, `sand`, `wave`, `type`, `tear`, `paper`), each peaking at its cue time. The schema is in the script's docstring. With `"song"` set, a licensed track replaces the synthesized music.
- `uv run --with librosa python <skill>/scripts/beats.py song.mp3 [offset] > beats.json`: BPM, beats, downbeats, and the drop, for cutting on the beat.
