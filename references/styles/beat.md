# Style: beat-synced footage promo

A punchy, minimal promo cut to a song: real footage, masked type, and UI moments, with every cut on a beat.

Credit: adapted from the beat-synced promo template shared by [@twoclipping](https://x.com/twoclipping/status/2102554209166000267). The original prompt is not included; this guide is our own write-up. [Preview frames from the original video](../../docs/styles/beat.jpg).

## When to use
Only when the user has real footage: their own clips, product screen recordings, or event video. Without it, suggest another style. Stock footage makes the result generic and says nothing true about the subject.

## Inputs to ask for
- 6 to 20 clips the user owns, plus 3 to 5 product or UI moments to show
- a song the user may use commercially (their own, or a library track whose licence allows it; check the licence page)
- the one-line promise, taken from the research or the user

## Prep
```bash
# each clip becomes a JPEG sequence; register it as clips: { id: { n: <frame count> } } in boot()
ffmpeg -i clip1.mp4 -vf "fps=30,scale=-2:720" -q:v 3 assets/clips/c1/%04d.jpg
uv run --with librosa python <skill>/scripts/beats.py assets/song.mp3 <offset> > beats.json
```
Check the beat grid against the actual kicks. The tempo estimate can be a few percent off; adjust the offset or BPM until downbeats line up.

## Look
- One accent colour from the brand, one clean sans with tight tracking, lots of empty space, one camera language.
- Masked type reveals (`text` with `reveal`, `kwords`), match cuts, clips cover-fit into boxes and phone frames (`clip`).
- Avoid effects that cheapen the look: shockwave rings, particle bursts, RGB split, lens flares, neon glows, bouncy easing, flashing backgrounds.

## Structure (bars at the song's tempo; 10 bars at 120 BPM is 20 s)
Bar 1: the hook lands word by word on the beats. Bar 2: a product UI moment (a cursor types and clicks). The drop: the hero reveal. Then one move per bar: a wall of clips with a few highlighted, the key result as big type, a carousel of clips, stats on push cuts, a short ticker, the logo, and a fade.

## Sound
`audio.json` with `"song": {"path": "assets/song.mp3", "offset": <s>}` plus cues (`click`, `type`, `whoosh`, `pop`) placed on the events. Keep effects quiet under the music; `render.mjs` normalises loudness.

## Rules
- Every cut on a downbeat, every UI hit on a beat.
- UI readouts show real values from the research, or are clearly marked as examples. Do not invent them.
- 60 fps is optional (`window.VIDEO.fps = 60`); clips stay at 30 fps and simply repeat frames.
