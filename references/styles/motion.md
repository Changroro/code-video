# Look: brand motion graphics

A clean explainer that looks like an official brand asset: one dark field, thin white hand-drawn line art, bold type with a single accent, scribbled emphasis, and a persuasion arc from pain to call to action. Silent.

Credit: adapted from the website-to-explainer approach shared by [@digitalstrategyai](https://www.threads.com/@digitalstrategyai/post/DdpAYbcgAj0), which builds on [@nahiddotai](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB)'s launch video. The original prompt is not included; this guide is our own write-up.

## Reference
Open `<skill>/docs/styles/motion.jpg` (four frames from the original) before planning, and compare your stills with it during QA. The original is a 30 s "Introducing aifixly" explainer made from the aifixly.com website: pain (searching, manuals, waiting) → the product (a phone that sees what you see) → proof (answers in seconds, 14 experts) → price pain → CTA.

## Signature (every item must be on screen)
| # | Item | How (`motion.js`) |
|---|---|---|
| 1 | One dark field for the whole video (no light scenes), one accent colour, pain words in red | `moBG()`, `MO.accent` = the brand colour, `MO.pain` |
| 2 | Thin white hand-drawn line illustrations of everyday objects that draw themselves on (faucet, manual, clock, eye, wallet, camera, mic) | `icon(name, x, y, s, p, id)`; add objects the topic needs to `MO_ICONS` as polylines |
| 3 | Bold geometric sans headlines that pop in word by word, the key word in the accent | `kwords(s, x, y, p, { font: MO.font, weight: 700, colors: { i: MO.accent } })` |
| 4 | Hand-drawn emphasis on type: a scribbled oval around a key word, a swoosh under a phrase | `scribble`, `swoosh` |
| 5 | A thin "frustration" gauge that climbs across the pain beats | `meter(label, v)` |
| 6 | Proof drawn as line art: a bar chart with hatched pain bars and one tiny accent bar; a big accent number; a cloud of outline pill tags with one filled | `lineBars`, `pills`, `text` at 150–180 px |
| 7 | The product shown working: a line-art phone with camera corners, the question in an outline bubble with a mic and a live waveform, the answer in a filled accent bubble | `linePhone`, `askBubble`, `replyBubble` |
| 8 | Ending: the wordmark with an accent full stop and swoosh, a glowing pill CTA that the cursor clicks, the free-to-try line and URL | `wordmark`, `ctaButton` |

## Look
- **Palette**: background `#0c0b1d`, ink `#f2f1f7`, dim `#8f8da8`, pain `#ff5d5d`, camera cyan `#38d6e6`, and the brand's accent (read it from the site CSS or logo pixels; the original used its purple `#7c5cff`). If the brand is light-themed, still keep the dark field and carry the brand in the accent and logo.
- **Fonts**: `MSANS` Poppins SemiBold/Bold (or the brand's geometric sans), `MMONO` IBM Plex Mono for tiny labels. Korean: Pretendard in the same roles.
- **Lines**: white, 2.5–3 px, `roughness` .6–.8: a steady hand, not a sketch.
- **Motion**: every element draws or pops on; hold each finished frame at least .6 s. Beats are 1–2.5 s. Transitions are hard cuts or one element turning into the next (the phone becomes the chart, a word becomes the logo). No flashes, no shake.

## Structure (30 s; scale for other lengths)
| Time | Beat | Principle |
|---|---|---|
| 0–3 | Hook: an everyday object + "How do you … this?" | curiosity gap |
| 3–8 | Pain: search bar, manual, clock; the gauge climbs; red words | agitation |
| 8–10 | "What if …?" (an eye icon) → the wordmark types in with the one-line promise | reveal |
| 10–15 | The product working: phone + question + answer + three feature pills | one core message |
| 15–19 | The stat: line bar chart, then one huge accent number with a scribbled oval | Von Restorff |
| 19–23 | Proof: the count with the tag cloud (real categories, clients, or ratings only) | social proof |
| 23–26 | Loss: "Still paying for …?" with wallet and cash icons, then the saving | loss aversion (only if the site says it) |
| 26–30 | Three icons + three words ("Point. Ask. Get answers."), then wordmark and CTA | peak–end, single CTA |

## Rules
- Persuasion framing (questions, loss framing) is copy, not a statistic. Never invent urgency, scarcity, user counts, times, or ratings; every number comes from the site or a source. A bar chart without sourced values shows no numbers, only relative bars labelled as an illustration.
- In the plan, name the principle each beat serves.
