# Style: brand design language (Apple, Samsung, Ferrari, Nike, Spotify presets, or any site's DESIGN.md)

A launch film that feels like a famous brand's site and keynotes, applied to the user's own topic: the brand's palette, type, spacing, buttons, and staging, drawn from design tokens. Five presets ship ready; any other site works through its DESIGN.md.

Tokens come from public design references: the brands' DESIGN.md files in [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT), [Refero](https://refero.design) styles, and each site's live CSS. This skill is not affiliated with these companies; the presets use free font substitutes.

## Pick the source of the tokens
1. **A preset**: apple, samsung, ferrari, nike, spotify. See the tables below.
2. **A DESIGN.md** the user gives (a file or a URL), or a brand's file from awesome-design-md: `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/<brand>/DESIGN.md`. The format follows [google-labs-code/design.md](https://github.com/google-labs-code/design.md): YAML front matter (`colors`, `typography`, `rounded`, `spacing`, `components`) and sections (Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts).
3. **A Refero style**, when the Refero MCP tools are available: `refero_search_styles` with the site name, then `refero_get_style`.
4. **The live site**: `uv run python <skill>/scripts/site_tokens.py <url>` reports the most used colours, button colours, fonts, radii, and CSS variables. Confirm the picks against a screenshot of the site.

If none of these works (no file, no MCP, the site's CSS is rendered by JavaScript), say so and ask the user for a DESIGN.md or another site; do not guess a brand's look.

## Map a DESIGN.md to tokens
| DESIGN.md | Token |
|---|---|
| canvas / background colours | `bg`, `bgAlt` (the alternate band), `dark` (the black or deepest stage) |
| text / ink, secondary text | `ink`, `inkDark`, `muted`, `mutedDark` |
| primary / CTA colour and its label | `accent`, `accentInk`; `ctaLight` / `ctaDark` when buttons change with the stage |
| card / surface, divider | `surface`, `divider` |
| display and body fonts | the closest free Google Font for each (with Pretendard for Hangul through `unicode-range`) |
| letter spacing, case, heading weight | `tracking` (em), `upper`, `weight` |
| rounded / shapes | `radius`; buttons `cta: 'pill' | 'rect' | 'ghost'` |
| a signature line or indicator colour | `line` |
| Do's and Don'ts, imagery, motion prose | the plan's signature table and pacing |

## Presets
| Preset | Stages | Type | Signature moves | Pacing |
|---|---|---|---|---|
| `apple` | gallery white `#f5f5f7` / white bands, black hero voids | Inter, bold, tight tracking, centred | the product isolated on the stage with a soft floor shadow; a gradient product name; spec numbers; rounded bento tiles; one blue pill CTA `#0071e3` per scene | calm: fade-ups, slow push-ins, crossfades |
| `samsung` | black stage for reveals, white and `#f7f7f7` bands | Manrope ExtraBold headlines, Inter body | the product revealed on black with a reflective floor and a light sweep; big spec numbers; electric-blue `#2189ff` highlights; black or white pill buttons | cinematic: reveal, sweep, push-in on the name |
| `ferrari` | `#181818` black and white editorial bands | Archivo, uppercase, wide tracking | red `#da291c` only as a thin rule or indicator; square corners everywhere; ghost buttons with an arrow; light streaks | slow, contemplative pans and holds |
| `nike` | white, `#111111` black | Anton for slammed uppercase headlines, Inter body | type that slams in; motion blur; speed streaks; black or white pill buttons; dense grids | fast: hard cuts on the beat, slam-ins with motion blur |
| `spotify` | black `#000` / `#121212` everywhere | DM Sans bold, tight | colour enters only through artwork in snapping carousels; a green `#1ed760` pill; purple-to-blue promo gradient | rhythmic: carousels snap on the beat, colour pulses |

## Preset tokens
| Token | apple | samsung | ferrari | nike | spotify |
|---|---|---|---|---|---|
| bg | #f5f5f7 | #ffffff | #ffffff | #ffffff | #121212 |
| bgAlt | #ffffff | #f7f7f7 | #f2f2f2 | #f5f5f5 | #1f1f1f |
| dark | #000000 | #000000 | #181818 | #111111 | #000000 |
| ink | #1d1d1f | #000000 | #181818 | #111111 | #ffffff |
| muted | #86868b | #555555 | #8f8f8f | #707072 | #b3b3b3 |
| accent | #0071e3 | #2189ff | #da291c | #ee0005 | #1ed760 |
| accentInk | #ffffff | #ffffff | #ffffff | #ffffff | #000000 |
| surface | #ffffff | #f7f7f7 | #ffffff | #f5f5f5 | #1f1f1f |
| line | | | #da291c | | |
| weight | 700 | 800 | 600 | 400 | 700 |
| tracking (em) | -0.035 | -0.01 | 0.09 | 0 | -0.02 |
| uppercase | no | no | yes | yes | no |
| radius (px) | 28 | 20 | 0 | 0 | 8 |
| buttons | pill | pill | ghost | pill | pill |
| display font | Inter | Manrope | Archivo | Anton | DM Sans |
| body font | Inter | Inter | Archivo | Inter | DM Sans |

## Signature
| # | Item |
|---|---|
| 1 | The brand's stages and their alternation (light bands, dark voids, or all dark) |
| 2 | Headlines in the brand's type: weight, tracking, case; fade-up or slam-in per the pacing |
| 3 | The subject shown the way the brand stages products (isolated with a shadow, on black with a reflection and a sweep, in a device) |
| 4 | Numbers as the brand shows specs |
| 5 | The brand's component shapes: tiles, rules, buttons |
| 6 | The brand's accent rationed the way its DESIGN.md says (one CTA colour, a thin red rule, green only for the action) |
| 7 | The brand's pacing |

## Rules
- Numbers still need sources. A spec board with invented numbers is worse than none.
- Pair Pretendard with every preset for Korean text.
