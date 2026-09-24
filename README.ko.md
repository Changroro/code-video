# handdrawn-promo-video

[English](README.md) | 한국어

[![이 스킬로 만든 소개 영상](docs/intro-preview.gif)](https://github.com/Changroro/handdrawn-promo-video/releases/download/v1.0.0/SkillIntro.mp4)

*이 스킬로 만든 45초 소개 영상입니다. 누르면 전체 MP4를 볼 수 있습니다(소리 없음).*

주제(회사, 제품, 웹사이트)를 조사해 짧은 홍보 영상을 코드로 그려 MP4로 만드는 에이전트 스킬입니다.

- 먼저 스타일을 묻고, 이어서 길이, 비율, 캐릭터, 화면 언어를 묻습니다.
- 출처를 붙여 주제를 조사하고, 크게 보여줄 숫자는 원문 문장과 다시 대조합니다. 색과 폰트는 브랜드에서 가져옵니다.
- 스토리보드를 승인받은 뒤 작은 캔버스 키트로 장면을 만듭니다. rough.js 선 떨림, 키네틱 타이포, 카메라 이동, 전환, 픽셀 스프라이트, 모래, 영상 클립을 지원합니다.
- 스타일에 따라 음악과 효과음도 코드로 만듭니다.
- 스틸, 전환 구간, 전체 타임라인을 검수한 뒤 headless Chrome 병렬 렌더로 H.264 영상을 만듭니다.

## 스타일

| 스타일 | 어울리는 주제 | 소리 | 원작자 |
|---|---|---|---|
| 손그림과 8비트 미니미(기본) | 출시, 서비스 소개, 가볍고 재미있는 영상 | 없음 | [@nahiddotai](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB) |
| 브랜드 모션그래픽 | 공식 자료처럼 보여야 하는 회사·제품 설명 영상 | 없음 | [@digitalstrategyai](https://www.threads.com/@digitalstrategyai/post/DdpAYbcgAj0) |
| 모래 그림 연대기 | 역사, 창업 이야기, 연혁 | 음악과 효과음 | [@Michaelzsguo](https://x.com/Michaelzsguo/status/2102592355165782312) |
| 가사형 뮤직비디오 | 기억에 남는 교육용 설명 영상 | 반주, 화면 가사 | [@goodside](https://x.com/goodside/status/2102852546620744010) |
| 비트 싱크 실사 홍보 | 직접 찍은 영상과 사용 허가된 음원이 있을 때 | 음원과 효과음 | [@twoclipping](https://x.com/twoclipping/status/2102554209166000267) |

### 스타일 미리보기

원작자들의 원본 영상에서 뽑은 하이라이트 4컷입니다.

**손그림과 8비트 미니미**, [@nahiddotai](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB) 원본
![손그림과 8비트 미니미: @nahiddotai 원본 영상 장면](docs/styles/handdrawn.jpg)

**브랜드 모션그래픽**, [@digitalstrategyai](https://www.threads.com/@digitalstrategyai/post/DdpAYbcgAj0) 원본
![브랜드 모션그래픽: @digitalstrategyai 원본 영상 장면](docs/styles/motion.jpg)

**모래 그림 연대기**, [@Michaelzsguo](https://x.com/Michaelzsguo/status/2102592355165782312) 원본
![모래 그림 연대기: @Michaelzsguo 원본 영상 장면](docs/styles/sand.jpg)

**가사형 뮤직비디오**, [@goodside](https://x.com/goodside/status/2102852546620744010) 원본
![가사형 뮤직비디오: @goodside 원본 영상 장면](docs/styles/lyric.jpg)

**비트 싱크 실사 홍보**, [@twoclipping](https://x.com/twoclipping/status/2102554209166000267) 원본
![비트 싱크 실사 홍보: @twoclipping 원본 영상 장면](docs/styles/beat.jpg)

## 크레딧

각 스타일은 원작자가 Claude Opus 5.5 공개 뒤 공개적으로 공유한 작업에서 착안했습니다. 링크는 위 표에 있습니다. 이 저장소에는 원작자들의 프롬프트 원문이 들어 있지 않습니다. `references/styles/`의 스타일 가이드는 직접 새로 썼고, 모든 스타일에 같은 리서치, 승인, 검수 단계를 적용합니다. 기본 스타일은 [@nahiddotai](https://www.threads.com/@nahiddotai)의 ["Introducing Opus 5.5" 런치 영상](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB)과 [공유된 프롬프트](https://www.threads.com/@nahiddotai/post/Ddm0OgZkuQx)에서 착안했습니다. 소개 영상에는 그 런치 영상의 장면이 출처와 함께 잠깐 나옵니다.

## 설치

하나를 고르세요.

**skills CLI** (Claude Code, Codex 등 여러 에이전트):

```bash
npx skills add Changroro/handdrawn-promo-video -g
```

**Claude Code 플러그인** ([changroro 마켓플레이스](https://github.com/Changroro/plugins)):

```
/plugin marketplace add Changroro/plugins
/plugin install handdrawn-promo-video@changroro
```

**직접 설치**: 에이전트의 스킬 폴더에 clone합니다.

```bash
git clone https://github.com/Changroro/handdrawn-promo-video ~/.claude/skills/handdrawn-promo-video   # Claude Code
git clone https://github.com/Changroro/handdrawn-promo-video ~/.codex/skills/handdrawn-promo-video    # Codex
```

필요한 것: npm이 포함된 Node.js 18 이상, libx264가 포함된 ffmpeg, Google Chrome, 보조 스크립트용 [uv](https://docs.astral.sh/uv/). 소리용 numpy와 scipy, 박자 분석용 librosa는 실행할 때 자동으로 설치됩니다.

## 사용법

에이전트에게 영상을 요청하면 됩니다. 예를 들면:

- "https://example.com 30초 홍보 영상 만들어줘"
- "우리 회사 소개 영상 만들어줘"
- "우리 회사 연혁을 모래 그림 영상으로 만들어줘"

## 구성

| 경로 | 역할 |
|---|---|
| `SKILL.md` | 작업 흐름: 스타일과 설정 → 리서치 → 계획 승인 → 제작 → 검수 → 렌더 |
| `.claude-plugin/plugin.json` | Claude Code 플러그인 매니페스트(스킬은 저장소 최상위에 있음) |
| `template/kit.js` | 캔버스 키트: 손그림 도형, 텍스트와 키네틱 타이포, 카메라, 전환, 스프라이트, 미니미, 영상 클립 |
| `template/sand.js` | 빛 테이블 위 모래 그림(모래 그림 스타일용) |
| `template/render.mjs` | 병렬 페이지로 프레임을 결정적으로 캡처해 ffmpeg로 인코딩하고 오디오 트랙을 합침 |
| `template/minis-ai.js` | AI 관련 주제용 미니미 캐릭터 세트 |
| `references/` | 리서치 절차, 스토리보드 패턴, 키트 API, 검수 체크리스트 |
| `references/styles/` | 추가 스타일별 가이드와 크레딧 |
| `scripts/` | 폰트 다운로드, 로고 배경 정리, 검수용 시트, 음악·효과음 합성, 박자 분석 |

폰트는 제작할 때 Google Fonts와 jsDelivr에서 내려받으며(SIL Open Font License), 저장소에 포함하지 않았습니다.

`template/minis-ai.js`의 캐릭터는 비공식 팬아트입니다. 제품명과 상표는 각 소유자에게 있습니다.

## 라이선스

[MIT](LICENSE)
