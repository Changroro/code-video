# Style: free

Any look at all: one the user describes in words ("risograph zine", "80s airline safety card", "Bauhaus poster"), one taken from a reference image or video they share, or, when they leave it open, one you invent for the topic.

## Design it before you build it
1. **Find the look.**
   - A description: name the look and its real-world medium (print, paint, film, UI, material).
   - A reference image or video: open it with the Read tool (for a video, extract a few frames with ffmpeg first) and describe what you see.
   - Nothing given: propose two or three looks that suit the topic in one line each and pick the strongest.
   If the look is close to an existing style, use that style's guide instead.
2. **Write a Signature table** of five to seven items, each something visible on screen:
   - the ground or material (paper, screen, fabric, glass)
   - the shape language (how edges, lines, and forms are drawn)
   - the palette as hex values (with where each comes from)
   - the type (the closest free Google Font; pair Hangul through `unicode-range`)
   - the motion and pacing
   - the scene change
   - one signature move that makes it unmistakable
3. **Show the table and one still** in the plan, and get approval before building the rest.

## Build
- Draw with `kit.js` primitives (text, paths, `rr`, camera, transitions, `makeBG` for textures, `withCtx` for offscreen layers). Borrow a helper from one style module if it fits; load only one module to avoid name clashes.
- Keep every frame a pure function of time.
- Check the stills against your own Signature table the way the built-in styles are checked.

## Rules
- A look taken from someone's work is credited to them in the delivery, with a link. Borrow the look, not their characters, logos, or text.
- Numbers still need sources.
