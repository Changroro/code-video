# QA checklist

## Still review (before rendering)
Take stills at the middle of each scene and just before and after each transition, and review them six at a time with `scripts/contact_sheet.py`.

- [ ] Text does not run into boxes or photo frames (use `maxW` or a smaller font).
- [ ] Labels and alert boxes are not cut off while the camera is zoomed. The visible x range is cx ± W/2/z.
- [ ] Labels do not overlap each other or the characters.
- [ ] Characters stand out from the background (use `outline` for a dark character on a dark background).
- [ ] Text is readable over busy backgrounds (`outline: THEME.paper`, heavy weights).
- [ ] Every glyph renders in the intended font. The pixel font (Latin-only) is not used for other scripts.
- [ ] Copy and numbers match the approved plan and their sources.
- [ ] Colours and fonts match the palette and fonts approved in the plan.
- [ ] On-screen text is in the chosen language, including labels, HUD, and the end card.

## Common bugs
- `flash(1 - prog(t, a, b))` covers the whole screen while t < a. Wrap it in `if (t > a)`.
- Empty frames after one element leaves and before the next arrives. Overlap entrances by 0.1 to 0.2 s.
- The third argument of `rc.circle` is the diameter, not the radius.
- Sprite size is s × the row and column counts. Too large and it collides with bubbles or titles.
- For looping flows (`(t * v + j * gap) % len`), fade alpha or scale near the ends of the range so the seam does not jump.

## Video review (after rendering)
- Check length, resolution, fps, and file size with `ffprobe`. The default target is at most 10 MB per 30 s (CRF 25). If it is larger, lower `noise` and raise CRF.
- Extract frames at the transition times with `ffmpeg -ss <t> -i out.mp4 -frames:v 1` and review them as a tile. This ffmpeg may lack the drawtext filter, so add labels with Pillow.
- Crop text areas at full resolution and check for compression artifacts.
- Sweep the whole video, not only the transitions: one frame every 2 s on a contact sheet. Look for long empty stretches and scenes that hold too long.
- With sound: `ffprobe` shows one AAC stream as long as the video, and `ffmpeg -i out.mp4 -af ebur128 -f null -` reports about -14 LUFS integrated. Check that each cue in `audio.json` sits on its event by comparing cue times with the scene timeline.
