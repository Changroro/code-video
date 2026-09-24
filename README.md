# handdrawn-promo-video

[![Intro video made with this skill](docs/intro-preview.gif)](https://github.com/Changroro/handdrawn-promo-video/releases/download/v1.0.0/SkillIntro.mp4)

*This skill's 45-second intro, made with this skill. Click for the full MP4 (no sound).*

An agent skill that turns a topic (a company, a product, a website) into a short promo video, drawn entirely in code and rendered to MP4.

- Asks for the style first, then length, aspect ratio, characters, and on-screen language.
- Researches the topic with sources, re-checks the headline numbers against the original text, and takes the palette and fonts from the brand.
- Gets the storyboard approved, then builds the scenes with a small canvas kit: rough.js line boil, kinetic type, camera moves, transitions, pixel sprites, sand, video clips.
- Makes music and sound effects in code where the style calls for it.
- Checks stills, transitions, and the whole timeline, then renders with parallel headless Chrome into H.264.

## Styles

| Style | Best for | Sound | Credit |
|---|---|---|---|
| Hand-drawn + 8-bit minis (default) | launches, services, anything playful | none | [@nahiddotai](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB) |
| Brand motion graphics | company or product explainers that should look official | none | [@digitalstrategyai](https://www.threads.com/@digitalstrategyai/post/DdpAYbcgAj0) |
| Sand art chronicle | history, founding stories, timelines | music and effects | [@Michaelzsguo](https://x.com/Michaelzsguo/status/2102592355165782312) |
| Lyric music video | memorable educational explainers | instrumental, lyrics on screen | [@goodside](https://x.com/goodside/status/2102852546620744010) |
| Beat-synced footage promo | when you have your own clips and a licensed song | the song and effects | [@twoclipping](https://x.com/twoclipping/status/2102554209166000267) |

### Style previews

Four highlight frames from each creator's original video.

**Hand-drawn + 8-bit minis**, from [@nahiddotai](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB)
![Hand-drawn + 8-bit minis: frames from @nahiddotai's original video](docs/styles/handdrawn.jpg)

**Brand motion graphics**, from [@digitalstrategyai](https://www.threads.com/@digitalstrategyai/post/DdpAYbcgAj0)
![Brand motion graphics: frames from @digitalstrategyai's original video](docs/styles/motion.jpg)

**Sand art chronicle**, from [@Michaelzsguo](https://x.com/Michaelzsguo/status/2102592355165782312)
![Sand art chronicle: frames from @Michaelzsguo's original video](docs/styles/sand.jpg)

**Lyric music video**, from [@goodside](https://x.com/goodside/status/2102852546620744010)
![Lyric music video: frames from @goodside's original video](docs/styles/lyric.jpg)

**Beat-synced footage promo**, from [@twoclipping](https://x.com/twoclipping/status/2102554209166000267)
![Beat-synced footage promo: frames from @twoclipping's original video](docs/styles/beat.jpg)

## Credit

Each style adapts an idea that its creator shared publicly after the Claude Opus 5.5 release; the links are in the table above. This repository does not contain their prompts. The style guides in `references/styles/` are our own write-ups, and the skill wraps every style in the same research, approval, and QA steps. The default style comes from [@nahiddotai](https://www.threads.com/@nahiddotai)'s ["Introducing Opus 5.5" launch video](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB) and [the prompt they shared](https://www.threads.com/@nahiddotai/post/Ddm0OgZkuQx). The intro video shows a few frames of that launch video, with credit.

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
- "우리 회사 소개 영상 만들어줘"

## Contents

| Path | Purpose |
|---|---|
| `SKILL.md` | Workflow: style and settings → research → plan approval → build → QA → render |
| `.claude-plugin/plugin.json` | Claude Code plugin manifest (the skill stays at the repo root) |
| `template/kit.js` | Canvas kit: hand-drawn primitives, text and kinetic type, camera, transitions, sprites, minis, video clips |
| `template/sand.js` | Sand on a backlit light table, for the sand style |
| `template/render.mjs` | Deterministic frame capture with parallel pages, piped to ffmpeg, with the audio track muxed in |
| `template/minis-ai.js` | Ready-made mini characters for AI-related topics |
| `references/` | Research protocol, storyboard patterns, kit API, QA checklist |
| `references/styles/` | One guide per added style, with its credit |
| `scripts/` | Font download, logo background cleanup, contact sheets, music and sound synthesis, beat detection |

Fonts are downloaded at build time from Google Fonts and jsDelivr (SIL Open Font License) and are not bundled.

The characters in `template/minis-ai.js` are unofficial fan art. Product names and trademarks belong to their owners.

## License

[MIT](LICENSE)

---

## 한국어 요약

주제(회사, 제품, 사이트)를 조사해 짧은 홍보 영상을 코드로 그려 MP4로 만드는 에이전트 스킬입니다. 스타일은 다섯 가지입니다.

- 손그림과 8비트 미니미(기본)
- 브랜드 모션그래픽
- 모래 그림 연대기
- 가사형 뮤직비디오
- 비트 싱크 실사 홍보

먼저 스타일을 묻고, 이어서 길이, 비율, 캐릭터, 화면 언어를 묻습니다. 색과 폰트는 브랜드 리서치에서 정합니다. 출처가 있는 사실로 스토리보드를 승인받은 뒤 제작, 검수, 렌더까지 진행하며, 스타일에 따라 음악과 효과음도 코드로 만듭니다.

각 스타일은 Claude Opus 5.5 공개 뒤 공개적으로 공유된 작업에서 착안했습니다. 크레딧은 위 표에 있습니다. 원작자들의 프롬프트 원문은 포함하지 않았고, 스타일 가이드는 직접 새로 썼습니다.
