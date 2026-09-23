# handdrawn-promo-video

An agent skill that turns a topic (a company, a product, a website) into a short promo video in a hand-drawn canvas animation style with 8-bit mini characters, rendered to MP4.

- Asks for the settings first: length, aspect ratio, characters, on-screen language.
- Researches the topic with sources and re-checks the headline numbers against the original text.
- Gets the storyboard approved, then builds the scenes with a small canvas kit: rough.js line boil, camera moves, transitions, pixel sprites, logo pixelation.
- Checks stills and transition frames, then renders with parallel headless Chrome into H.264 (about 8 MB per 30 s at 1080p).

## Credit

Inspired by [@nahiddotai](https://www.threads.com/@nahiddotai)'s ["Introducing Opus 5.5" launch video](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB) and [the prompt they shared](https://www.threads.com/@nahiddotai/post/Ddm0OgZkuQx). This repository does not contain that prompt. It turns the idea into a repeatable workflow with research, approval, and QA steps.

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

Requirements: Node.js 18+ with npm, ffmpeg built with libx264, Google Chrome, and [uv](https://docs.astral.sh/uv/) for the helper scripts.

## Use

Ask your agent for a video, for example:

- "Make a 30-second promo video for https://example.com"
- "우리 회사 소개 영상 만들어줘"

## Contents

| Path | Purpose |
|---|---|
| `SKILL.md` | Workflow: settings → research → plan approval → build → QA → render |
| `.claude-plugin/plugin.json` | Claude Code plugin manifest (the skill stays at the repo root) |
| `template/kit.js` | Canvas kit: hand-drawn primitives, text, camera, transitions, sprites, minis |
| `template/render.mjs` | Deterministic frame capture with parallel pages, piped to ffmpeg |
| `template/minis-ai.js` | Ready-made mini characters for AI-related topics |
| `references/` | Research protocol, storyboard patterns, kit API, QA checklist |
| `scripts/` | Font download, logo background cleanup, contact sheets for review |

Fonts are downloaded at build time from Google Fonts and jsDelivr (SIL Open Font License) and are not bundled.

The characters in `template/minis-ai.js` are unofficial fan art. Product names and trademarks belong to their owners.

## License

[MIT](LICENSE)

---

## 한국어 요약

주제(회사, 제품, 사이트)를 조사해 손그림 캔버스 애니메이션과 8비트 미니미 캐릭터 스타일의 짧은 홍보 영상을 MP4로 만드는 에이전트 스킬입니다. 영상 길이, 비율, 캐릭터, 화면 언어를 먼저 묻고, 출처가 있는 사실로 스토리보드를 승인받은 뒤 제작, 검수, 렌더까지 진행합니다.

@nahiddotai가 Threads에 공유한 Opus 5.5 런치 영상과 프롬프트에서 착안했습니다. 프롬프트 원문은 포함하지 않았습니다.
