# handdrawn-promo-video

English | [한국어](README.ko.md)

[![Intro video made with this skill](docs/intro-preview.gif)](https://github.com/Changroro/handdrawn-promo-video/releases/download/v1.0.0/SkillIntro.mp4)

*This skill's 45-second intro, made with this skill. Click for the full MP4 (no sound).*

An agent skill that turns a topic (a company, a product, a website) into a short promo video, drawn entirely in code and rendered to MP4.

- Asks for a look and a story format first, then length, aspect ratio, characters, and on-screen language.
- Researches the topic with sources, re-checks the headline numbers against the original text, and takes the palette and fonts from the brand.
- Gets the storyboard approved, then builds the scenes with a small canvas kit: rough.js line boil, kinetic type, camera moves, transitions, pixel sprites, sand, video clips.
- Makes music and sound effects in code where the look or format calls for it.
- Checks stills, transitions, and the whole timeline, then renders with parallel headless Chrome into H.264.

## Looks and story formats

Two independent choices shape every video: the **look** (how it is drawn) and the **story format** (how it is told). Any look works with any format.

| Look | Feel | Credit |
|---|---|---|
| Hand-drawn + 8-bit minis (default) | playful, sketchbook | [@nahiddotai](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB) |
| Brand motion graphics | clean, official | [@digitalstrategyai](https://www.threads.com/@digitalstrategyai/post/DdpAYbcgAj0) |
| Sand art | warm, story-like | [@Michaelzsguo](https://x.com/Michaelzsguo/status/2102592355165782312) |
| 16-bit arcade | game, energetic | original |
| CRT terminal | developer, retro | original |
| Thermal receipt | printed, tactile | original |
| Transit map | diagram, orderly | original |
| Blueprint | technical, precise | original |

| Story format | Structure | Credit |
|---|---|---|
| Standard promo (default) | hook → title → steps → big number → ending | original |
| Versus | rounds between two options, then a tally | original |
| Session | commands and outputs that show how it is used | original |
| Receipt | itemised list, total, stamp | original |
| Route map | lines, stations, interchanges | original |
| Spec sheet | parts, each with one spec | original |
| Lyric music video | an original song, one fact per line | [@goodside](https://x.com/goodside/status/2102852546620744010) |
| Beat-synced footage | cuts on a song's beats over real clips | [@twoclipping](https://x.com/twoclipping/status/2102554209166000267) |

### Previews

**Same script, five looks**: arcade, terminal, thermal receipt, transit map, blueprint (the "steps" scene of one shared script, made with this skill)
![The same scene in five looks](docs/looks.jpg)

**Five story formats**: versus, session, receipt (9:16), route map, spec sheet (made with this skill, about this skill)
![Five story formats](docs/formats.jpg)

Four highlight frames from each credited creator's original video:

**Hand-drawn + 8-bit minis**, from [@nahiddotai](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB)
![Hand-drawn + 8-bit minis: frames from @nahiddotai's original video](docs/styles/handdrawn.jpg)

**Brand motion graphics**, from [@digitalstrategyai](https://www.threads.com/@digitalstrategyai/post/DdpAYbcgAj0)
![Brand motion graphics: frames from @digitalstrategyai's original video](docs/styles/motion.jpg)

**Sand art**, from [@Michaelzsguo](https://x.com/Michaelzsguo/status/2102592355165782312)
![Sand art: frames from @Michaelzsguo's original video](docs/styles/sand.jpg)

**Lyric music video**, from [@goodside](https://x.com/goodside/status/2102852546620744010)
![Lyric music video: frames from @goodside's original video](docs/styles/lyric.jpg)

**Beat-synced footage**, from [@twoclipping](https://x.com/twoclipping/status/2102554209166000267)
![Beat-synced footage: frames from @twoclipping's original video](docs/styles/beat.jpg)

## Credit

Credited looks and formats adapt ideas their creators shared publicly after the Claude Opus 5.5 release; the links are in the tables above. This repository does not contain their prompts. The guides in `references/` are our own write-ups, and the skill wraps every look and format in the same research, approval, and QA steps. The looks and formats marked original were designed for this skill. The default look comes from [@nahiddotai](https://www.threads.com/@nahiddotai)'s ["Introducing Opus 5.5" launch video](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB) and [the prompt they shared](https://www.threads.com/@nahiddotai/post/Ddm0OgZkuQx). The intro video shows a few frames of that launch video, with credit.

## Install

Pick one.

**skills CLI** (Claude Code, Codex and other agents):

```bash
npx skills add Changroro/handdrawn-promo-video -g
```

**Claude Code plugin** from the [changroro marketplace](https://github.com/Changroro/plugins):

```
/plugin marketplace add Changroro/plugins
/plugin install handdrawn-promo-video@changroro
```

**Manual**: clone into your agent's skills directory.

```bash
git clone https://github.com/Changroro/handdrawn-promo-video ~/.claude/skills/handdrawn-promo-video   # Claude Code
git clone https://github.com/Changroro/handdrawn-promo-video ~/.codex/skills/handdrawn-promo-video    # Codex
```

Requirements: Node.js 18+ with npm, ffmpeg built with libx264, Google Chrome, and [uv](https://docs.astral.sh/uv/) for the helper scripts (numpy and scipy for sound, librosa for beat detection, installed on the fly).

## Use

Ask your agent for a video, for example:

- "Make a 30-second promo video for https://example.com"
- "Make a sand-art video of our company's history"
- "Compare our two plans as an arcade versus video"

## Contents

| Path | Purpose |
|---|---|
| `SKILL.md` | Workflow: look, format, and settings → research → plan approval → build → QA → render |
| `.claude-plugin/plugin.json` | Claude Code plugin manifest (the skill stays at the repo root) |
| `template/kit.js` | Canvas kit: hand-drawn primitives, text and kinetic type, camera, transitions, sprites, minis, video clips |
| `template/sand.js` | Sand on a backlit light table, for the sand look |
| `template/{arcade,terminal,thermal,transit,blueprint}.js` | Look modules with one shared scene API and a signature format scene each |
| `template/render.mjs` | Deterministic frame capture with parallel pages, piped to ffmpeg, with the audio track muxed in |
| `template/minis-ai.js` | Ready-made mini characters for AI-related topics |
| `references/` | Research protocol, storyboard patterns, kit API, QA checklist |
| `references/looks.md`, `references/formats.md` | Look modules and story formats |
| `references/styles/` | Guides for the credited looks and formats |
| `scripts/` | Font download, logo background cleanup, contact sheets, music and sound synthesis, beat detection |

Fonts are downloaded at build time from Google Fonts and jsDelivr (SIL Open Font License) and are not bundled.

The characters in `template/minis-ai.js` are unofficial fan art. Product names and trademarks belong to their owners.

## License

[MIT](LICENSE)
