# Style: CRT terminal

A green phosphor terminal on an old CRT: commands type themselves out, logs scroll, progress bars fill, and big block-letter banners glow for the name and the numbers.

## Signature
| Item | On screen |
|---|---|
| Screen | Near-black green glass (`#031208`) with phosphor text `#46ff8a`, a soft glow, scanlines, and a slight curvature vignette |
| Type | Nanum Gothic Coding (regular and bold) for every line, prompt `user@studio:~$`; amber `#ffc24a` for highlights |
| Opening | A boot line, then the opening lines typed at the prompt with a blinking block cursor |
| Title | `./intro` runs and prints the name as a large block-letter banner |
| Steps | A `make` style log where each step ends in an `[ OK ]` tag, with a progress bar filling underneath |
| Numbers | A `stats` command prints the value as a block-letter banner with its label |
| Ending | The call to action typed as a command, the URL, and `exit` |
