# Style: brand motion graphics

A clean explainer that looks like an official brand asset: kinetic type, diagrams and UI that build on screen, and a persuasion arc from problem to call to action. Silent.

Credit: adapted from the website-to-explainer approach shared by [@digitalstrategyai](https://www.threads.com/@digitalstrategyai/post/DdpAYbcgAj0), which builds on [@nahiddotai](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB)'s launch video. The original prompt is not included; this guide is our own write-up. [Preview frames from the original video](../../docs/styles/motion.jpg).

## When to use
Company, product, or service explainers where the viewer should recognise the brand at once. Works at 15 to 45 s.

## Look
- **Palette**: the brand's exact colours. Read the hex values from the CI page or the site CSS, and confirm them by sampling logo pixels. Use one accent for the single thing that matters in each shot.
- **Type**: the brand fonts when you can get them as files, otherwise the closest free match that covers the on-screen script. Embed every font with `@font-face`; do not rely on system fonts.
- **Lines**: thin, mostly clean hand-drawn strokes (`ro` with `roughness` 0.4 to 0.8). Flat fills, plenty of whitespace, one idea per cut.
- **Motion**: words pop in one by one (`kwords`), typed lines with a cursor (`typeOn`), diagrams that draw themselves (`sketch`, `arrow`), camera drift and push-ins (`cam`), a short shake only on a danger beat.
- **Transitions**: `circleWipe` from the object that leads into the next scene, `wipe`, zoom into a screen, hard cuts. Do not repeat one twice in a row.

## Structure (30 s; scale the lengths for other durations)
| Time | Beat | Notes |
|---|---|---|
| 0–2.5 | Hook | Open on the viewer's problem or a question, not on the product. |
| 2.5–6 | Problem | Show the friction or risk the product removes. |
| 6–10 | Reveal | "Introducing …": the real logo draws on, plus the one-line positioning. |
| 10–15 | Core message | One value proposition, shown as a diagram or UI that builds itself. |
| 15–20 | The stat | The single most important number, isolated, large, and held for at least 1.5 s. |
| 20–25 | Proof | Real clients, sites, certifications, or ratings from the research (`pin` for places). |
| 25–27 | Peak | The slogan or the emotional line. |
| 27–30 | Call to action | The site's real CTA, URL, or contact, held still. |

## Rules
- Persuasion framing (hook questions, loss framing) is copy, not a statistic. Never invent urgency, scarcity, user counts, or ratings.
- In the plan, note which beat each principle serves so the user can judge the arc.
