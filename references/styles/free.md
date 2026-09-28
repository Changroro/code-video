# Style: free

Any look at all: one the user describes in words ("risograph zine", "80s airline safety card", "Bauhaus poster"), one taken from a reference image or video they share, or, when they leave it open, one you invent for the topic. Work out what the look is however you see fit, then write down its Signature, the few things on screen that make it that look, and check your stills against it.

Draw with `kit.js` primitives (text, paths, `rr`, camera, transitions, `makeBG` for textures, `withCtx` for offscreen layers). Borrow a helper from one style module if it fits; load only one module to avoid name clashes. Keep every frame a pure function of time.
