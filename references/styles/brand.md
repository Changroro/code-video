# Style: brand design language (presets and any DESIGN.md)

A launch film that feels like a famous brand's site and keynotes, applied to the user's own topic: the brand's palette, type, spacing, buttons, and staging, drawn from design tokens. Five presets ship ready; any other site works through its DESIGN.md.

Tokens come from public design references: the brands' DESIGN.md files in [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT), [Refero](https://refero.design) styles, and each site's live CSS. This skill is not affiliated with these companies. Never use their logos, product names, slogans, or proprietary fonts; the presets use free substitutes. The brand name only says whose design language the video borrows.

## Pick the source of the tokens
1. **A preset** (`brandUse('apple')` and `useFonts(brandFonts('apple'))`): apple, samsung, ferrari, nike, spotify. See the table below.
2. **A DESIGN.md** the user gives (a file or a URL), or a brand's file from awesome-design-md: `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/<brand>/DESIGN.md`. The format follows [google-labs-code/design.md](https://github.com/google-labs-code/design.md): YAML front matter (`colors`, `typography`, `rounded`, `spacing`, `components`) and sections (Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts).
3. **A Refero style**, when the Refero MCP tools are available: `refero_search_styles` with the site name, then `refero_get_style`.
4. **The live site**: `uv run python <skill>/scripts/site_tokens.py <url>` reports the most used colours, button colours, fonts, radii, and CSS variables. Confirm the picks against a screenshot of the site.

If none of these works (no file, no MCP, the site's CSS is rendered by JavaScript), say so and ask the user for a DESIGN.md or another site; do not guess a brand's look.

## Map a DESIGN.md to tokens
| DESIGN.md | brand.js token |
|---|---|
| canvas / background colours | `bg`, `bgAlt` (the alternate band), `dark` (the black or deepest stage) |
| text / ink, secondary text | `ink`, `inkDark`, `muted`, `mutedDark` |
| primary / CTA colour and its label | `accent`, `accentInk`; `ctaLight` / `ctaDark` when buttons change with the stage |
| card / surface, divider | `surface`, `divider` |
| display and body fonts | the closest free Google Font for each, declared as `BRANDD` and `BRAND` (with Pretendard for Hangul through `unicode-range`) |
| letter spacing, case, heading weight | `tracking` (em), `upper`, `weight` |
| rounded / shapes | `radius`; buttons `cta: 'pill' | 'rect' | 'ghost'` |
| a signature line or indicator colour | `line` |
| Do's and Don'ts, imagery, motion prose | the plan's signature table and pacing |

Show the tokens you chose, with the DESIGN.md lines they came from, in the plan.

## Presets
| Preset | Stages | Type | Signature moves | Pacing |
|---|---|---|---|---|
| `apple` | gallery white `#f5f5f7` / white bands, black hero voids | Inter, bold, tight tracking, centred | the product isolated on the stage with a soft floor shadow; a gradient product name; spec numbers; rounded bento tiles; one blue pill CTA `#0071e3` per scene | calm: fade-ups, slow push-ins, crossfades |
| `samsung` | black stage for reveals, white and `#f7f7f7` bands | Manrope ExtraBold headlines, Inter body | the product revealed on black with a reflective floor and a light sweep; big spec numbers; electric-blue `#2189ff` highlights; black or white pill buttons | cinematic: reveal, sweep, push-in on the name |
| `ferrari` | `#181818` black and white editorial bands | Archivo, uppercase, wide tracking | red `#da291c` only as a thin rule or indicator; square corners everywhere; ghost buttons with an arrow; light streaks | slow, contemplative pans and holds |
| `nike` | white, `#111111` black | Anton for slammed uppercase headlines, Inter body | type that slams in; motion blur; speed streaks; black or white pill buttons; dense grids | fast: hard cuts on the beat, slam-ins (use `VIDEO.blur`) |
| `spotify` | black `#000` / `#121212` everywhere | DM Sans bold, tight | colour enters only through artwork (`brArt`) in snapping carousels; a green `#1ed760` pill; purple-to-blue promo gradient | rhythmic: carousels snap on the beat, colour pulses |

## Signature (every item must be on screen)
| # | Item | How (`brand.js`) |
|---|---|---|
| 1 | The brand's stages and their alternation (light bands, dark voids, or all dark) | `brStage('light' | 'alt' | 'dark' | 'accent')` |
| 2 | Headlines in the brand's type: weight, tracking, case; fade-up or slam-in per the pacing | `brHeadline`, `brSlam`, `brText`, `brEyebrow` |
| 3 | The subject shown the way the brand stages products (isolated with a shadow, on black with a reflection and a sweep, in a device) | `brProduct`, `brLaptop`, kit `phone` |
| 4 | Numbers as the brand shows specs | `brSpecs` |
| 5 | The brand's component shapes: tiles, rules, buttons | `brBento`, `brRule`, `brCTA` |
| 6 | The brand's accent rationed the way its DESIGN.md says (one CTA colour, a thin red rule, green only for the action) | tokens |
| 7 | The brand's pacing | the table above |

## Rules
- The user's content, logo, and product stay theirs; only the design language is borrowed.
- Numbers still need sources. A spec board with invented numbers is worse than none.
- Korean text uses Pretendard through `brandFonts`, which pairs it with every preset.
