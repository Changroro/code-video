# code-video

[English](README.md) | 한국어

![대본 하나, 화풍 다섯 가지: 아케이드, 터미널, 감열지, 노선도, 청사진](docs/hero.gif)

*대본 하나, 화풍 다섯 가지. 위의 모든 프레임은 코드로 그렸습니다.* 이 스킬로 만든 [45초 소개 영상 보기](https://github.com/Changroro/code-video/releases/download/v1.2.0/CodeVideo_intro_ko.mp4).

주제를 조사해 짧은 영상을 전부 코드로 그려 주는 에이전트 스킬입니다. 주제와 화풍(아래 프리셋, 아무 사이트의 DESIGN.md, 또는 말로 설명한 어떤 느낌이든)을 주면 MP4가 나옵니다. 영상 생성 모델도, 스톡 영상도 쓰지 않습니다. 에이전트가 장면을 코드로 짜고, 한 프레임씩 렌더해서 MP4로 건네줍니다.

## 동작 원리

1. **전부 코드입니다.** 매 프레임을 "시간 t일 때의 그림"으로 HTML 캔버스에 그리고, headless Chrome으로 찍어 ffmpeg로 인코딩합니다. 음악과 효과음도 코드로 합성하기 때문에 같은 입력이면 늘 같은 영상이 나옵니다.
2. **조사가 먼저입니다.** 출처가 있는 사실을 10개 안팎 모으고, 색과 폰트는 브랜드에서 가져옵니다. 화면의 모든 숫자에 출처가 있습니다.
3. **디자인, 조사, 형식만 주면 됩니다.** 어떻게 보일지(화풍, 브랜드 프리셋, 아무 사이트의 DESIGN.md, 또는 말로 설명한 어떤 느낌이든), 주제, 길이·비율·언어를 주면 이야기는 에이전트가 짜고, 만들기 전에 짧은 계획을 보여줍니다.
4. **규칙은 일부러 적게 뒀습니다.** 스킬은 화풍과 꼭 필요한 규칙 몇 개(숫자 출처, 브랜드 로고 금지, 원작자 크레딧)만 주고 이야기는 에이전트에게 맡깁니다. A/B 테스트에서 과정 규칙을 덜어내자 품질 차이 없이 영상 한 편 비용이 23–51% 줄었습니다.
5. **빠르게 다시 만들 수 있습니다.** 여러 headless Chrome 페이지에서 병렬로 렌더하고 JPEG로 캡처해, 10코어 노트북에서 45초 1080p 영상을 약 1분 만에 렌더합니다. 테스트에서는 리서치부터 MP4까지 한 번에 4–13분이 걸렸습니다.

## 화풍

| 화풍 | 느낌 | 원작자 |
|---|---|---|
| 손그림과 8비트 미니미(기본) | 발랄한 스케치북 | [@nahiddotai](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB) |
| 브랜드 모션그래픽 | 깔끔한 공식 자료 | [@digitalstrategyai](https://www.threads.com/@digitalstrategyai/post/DdpAYbcgAj0) |
| 모래 그림 | 따뜻한 이야기 | [@Michaelzsguo](https://x.com/Michaelzsguo/status/2102592355165782312) |
| 가사형 뮤직비디오 | 창작곡, 가사 한 줄에 도표 하나 | [@goodside](https://x.com/goodside/status/2102852546620744010) |
| 비트 싱크 실사 | 직접 찍은 영상을 박자에 맞춰 편집 | [@twoclipping](https://x.com/twoclipping/status/2102554209166000267) |
| UI 모프 | 도형 하나가 제품 UI로 계속 변신 | [@twoclipping](https://x.com/twoclipping/status/2103273003555402193) |
| 히어로 코믹스 | 굵고 극적인 | 자체 제작 |
| 툰 | 밝고 통통 튀는 | 자체 제작 |
| 스크랩북 | 손으로 만든, 개인적인 | 자체 제작 |
| 찢은 종이 콜라주 | 차분한, 손으로 만든 | 자체 제작 |
| 파티클 | 추상적, 기술적 | 자체 제작 |
| 스플릿플랩 전광판 | 안내, 목록 | 자체 제작 |
| 네온사인 | 밤거리, 강렬한 | 자체 제작 |
| 16비트 아케이드 | 게임, 활기찬 | 자체 제작 |
| CRT 터미널 | 개발자, 레트로 | 자체 제작 |
| 감열지 영수증 | 인쇄물, 손에 잡히는 | 자체 제작 |
| 노선도 | 도식, 정돈된 | 자체 제작 |
| 청사진 | 기술 도면, 정밀한 | 자체 제작 |
| 애플풍 쇼룸 | 갤러리 같은 흰 여백, 제품 중심 | apple.com 디자인 언어 |
| 삼성풍 테크 런칭 | 검은 무대, 공개 연출 | samsung.com 디자인 언어 |
| 페라리풍 레이싱 럭셔리 | 에디토리얼, 넓은 대문자 | ferrari.com 디자인 언어 |
| 나이키풍 애슬레틱 | 빠르고 쾅 박히는 글자 | nike.com 디자인 언어 |
| 스포티파이풍 다크 미디어 | 어두운 바탕, 앨범 아트 색 | spotify.com 디자인 언어 |
| 아무 사이트나 DESIGN.md | 지정한 레퍼런스 그대로 | 레퍼런스 소유자 |
| 자유 화풍 | 말로 설명하거나 보여 준 어떤 느낌이든, 또는 에이전트가 새로 만든 화풍 | 사용자 또는 그 화풍의 원작자 |

화풍은 계속 추가되며, 새 화풍 PR도 환영합니다([기여하기](#기여하기) 참고).

## 갤러리

화풍마다 예시 영상에서 몇 초씩 잘랐습니다. 모든 예시는 이 스킬만 가진 새 에이전트가 이 스킬을 주제로 만든 영상이며, 전체 MP4는 [최신 릴리즈](https://github.com/Changroro/code-video/releases/latest)에 있습니다. 예시 영상의 화면 언어는 영어입니다.

| **손그림** | **브랜드 모션그래픽** | **모래 그림** |
|---|---|---|
| ![손그림](docs/gallery/handdrawn.gif) | ![브랜드 모션그래픽](docs/gallery/motion.gif) | ![모래 그림](docs/gallery/sand.gif) |
| **가사형 뮤직비디오** | **비트 싱크 실사** | **UI 모프** |
| ![가사형 뮤직비디오](docs/gallery/lyric.gif) | ![비트 싱크 실사](docs/gallery/beat.gif) | ![UI 모프](docs/gallery/uimorph.gif) |
| **히어로 코믹스** | **툰** | **스크랩북** |
| ![히어로 코믹스](docs/gallery/comic.gif) | ![툰](docs/gallery/toon.gif) | ![스크랩북](docs/gallery/scrapbook.gif) |
| **찢은 종이 콜라주** | **파티클** | **스플릿플랩 전광판** |
| ![찢은 종이 콜라주](docs/gallery/collage.gif) | ![파티클](docs/gallery/particles.gif) | ![스플릿플랩 전광판](docs/gallery/splitflap.gif) |
| **네온사인** | **16비트 아케이드** | **CRT 터미널** |
| ![네온사인](docs/gallery/neon.gif) | ![16비트 아케이드](docs/gallery/arcade.gif) | ![CRT 터미널](docs/gallery/terminal.gif) |
| **감열지 영수증** | **노선도** | **청사진** |
| ![감열지 영수증](docs/gallery/thermal.gif) | ![노선도](docs/gallery/transit.gif) | ![청사진](docs/gallery/blueprint.gif) |
| **애플풍 쇼룸** | **삼성풍 테크 런칭** | **페라리풍 레이싱 럭셔리** |
| ![애플풍 쇼룸](docs/gallery/brand-apple.gif) | ![삼성풍 테크 런칭](docs/gallery/brand-samsung.gif) | ![페라리풍 레이싱 럭셔리](docs/gallery/brand-ferrari.gif) |
| **나이키풍 애슬레틱** | **스포티파이풍 다크 미디어** | **DESIGN.md로 만든 예(Stripe)** |
| ![나이키풍 애슬레틱](docs/gallery/brand-nike.gif) | ![스포티파이풍 다크 미디어](docs/gallery/brand-spotify.gif) | ![DESIGN.md로 만든 예(Stripe)](docs/gallery/designmd-stripe.gif) |
| **자유 화풍(에이전트에게 맡김)** |   |   |
| ![자유 화풍(에이전트에게 맡김)](docs/gallery/free.gif) |   |   |

## 크레딧

원작자 표시가 있는 화풍은 원작자가 Claude Opus 5.5 공개 뒤 공개적으로 공유한 작업에서 착안했습니다. 링크는 위 표에 있습니다. 이 저장소에는 원작자들의 프롬프트 원문이 들어 있지 않습니다. `references/`의 가이드는 직접 새로 썼고, 모든 화풍에 같은 리서치와 승인 단계를 적용합니다. 자체 제작 표시가 있는 화풍은 이 스킬을 위해 새로 만들었습니다. 브랜드풍 프리셋은 apple.com, samsung.com, ferrari.com, nike.com, spotify.com의 공개된 디자인 언어를 [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)의 DESIGN.md, [Refero](https://refero.design), 각 사이트의 CSS에서 가져왔습니다. 이 프로젝트는 해당 회사들과 관계가 없으며 로고, 슬로건, 전용 글꼴을 쓰지 않습니다. 기본 화풍은 [@nahiddotai](https://www.threads.com/@nahiddotai)의 ["Introducing Opus 5.5" 런치 영상](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB)과 [공유된 프롬프트](https://www.threads.com/@nahiddotai/post/Ddm0OgZkuQx)에서 착안했습니다.

원작자들의 원본 영상에서 뽑은 하이라이트 4컷입니다.

**손그림과 8비트 미니미**, [@nahiddotai](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB) 원본
![손그림과 8비트 미니미: @nahiddotai 원본 영상 장면](docs/styles/handdrawn.jpg)

**브랜드 모션그래픽**, [@digitalstrategyai](https://www.threads.com/@digitalstrategyai/post/DdpAYbcgAj0) 원본
![브랜드 모션그래픽: @digitalstrategyai 원본 영상 장면](docs/styles/motion.jpg)

**모래 그림**, [@Michaelzsguo](https://x.com/Michaelzsguo/status/2102592355165782312) 원본
![모래 그림: @Michaelzsguo 원본 영상 장면](docs/styles/sand.jpg)

**가사형 뮤직비디오**, [@goodside](https://x.com/goodside/status/2102852546620744010) 원본
![가사형 뮤직비디오: @goodside 원본 영상 장면](docs/styles/lyric.jpg)

**비트 싱크 실사**, [@twoclipping](https://x.com/twoclipping/status/2102554209166000267) 원본
![비트 싱크 실사: @twoclipping 원본 영상 장면](docs/styles/beat.jpg)

**UI 모프**, [@twoclipping](https://x.com/twoclipping/status/2103273003555402193) 원본
![UI 모프: @twoclipping 원본 영상 장면](docs/styles/uimorph.jpg)

## 설치

하나를 고르세요.

**skills CLI** (Claude Code, Codex 등 여러 에이전트):

```bash
npx skills add Changroro/code-video -g
```

**Claude Code 플러그인** ([changroro 마켓플레이스](https://github.com/Changroro/plugins)):

```
/plugin marketplace add Changroro/plugins
/plugin install code-video@changroro
```

**직접 설치**: 에이전트의 스킬 폴더에 clone합니다.

```bash
git clone https://github.com/Changroro/code-video ~/.claude/skills/code-video   # Claude Code
git clone https://github.com/Changroro/code-video ~/.codex/skills/code-video    # Codex
```

필요한 것: npm이 포함된 Node.js 18 이상, libx264가 포함된 ffmpeg, Google Chrome, 보조 스크립트용 [uv](https://docs.astral.sh/uv/). 소리용 numpy와 scipy, 박자 분석용 librosa는 실행할 때 자동으로 설치됩니다.

## 사용법

에이전트에게 영상을 요청하면 됩니다. 원하는 화풍이 있으면 함께 말하고, 없으면 주제에 맞춰 추천받으면 됩니다.

- "https://example.com 30초 홍보 영상 만들어줘"
- "우리 회사 연혁을 모래 그림 영상으로 만들어줘"
- "요금제 두 개를 아케이드 화풍으로 비교해줘"
- "우리 앱 출시 영상을 코믹스 화풍으로 만들어줘"

## 구성

| 경로 | 역할 |
|---|---|
| `SKILL.md` | 작업 흐름: 디자인·조사·형식 → 짧은 계획 → 제작 → 렌더 |
| `.claude-plugin/plugin.json` | Claude Code 플러그인 매니페스트(스킬은 저장소 최상위에 있음) |
| `template/kit.js` | 캔버스 키트: 손그림 도형, 텍스트와 키네틱 타이포, 카메라, 전환, 스프라이트, 미니미, 영상 클립, 모션 블러 |
| `template/<화풍>.js` | 화풍마다 시그니처를 그리는 헬퍼 모듈 |
| `template/render.mjs` | 병렬 페이지로 프레임을 결정적으로 캡처해 ffmpeg로 인코딩하고 오디오 트랙을 합침 |
| `template/minis-ai.js` | AI 관련 주제용 미니미 캐릭터 세트 |
| `references/` | 키트 API와 장면 API 화풍 |
| `references/styles/` | 화풍별 가이드(시그니처 표 포함) |
| `scripts/` | 폰트 다운로드, 로고 배경 정리, 검수용 시트, 원작 비교 시트, 음악·효과음 합성, 박자 분석 |

폰트는 제작할 때 Google Fonts와 jsDelivr에서 내려받으며(SIL Open Font License, Apache 2.0), 저장소에 포함하지 않았습니다.

`template/minis-ai.js`의 캐릭터는 비공식 팬아트입니다. 제품명과 상표는 각 소유자에게 있습니다.

## 기여하기

PR을 환영합니다. 새 화풍이면 더 좋습니다.

- **새 화풍**: `template/`에 모듈(시간만으로 그리는 순수 함수, 프레임 사이 상태 없음)을, `references/styles/`에 특징마다 헬퍼를 연결한 시그니처 표가 있는 가이드를 넣고, `SKILL.md`의 화풍 목록과 README 두 곳의 표에 한 줄씩 추가해 주세요.
- **다른 사람의 공개 작업을 참고할 때**: 원작자를 링크와 함께 표기하고, 가이드는 직접 쓴 문장으로 작성하며(프롬프트 원문은 넣지 않음), 원본 영상 4컷을 `docs/styles/`에 넣어 누구나 비교할 수 있게 해 주세요.
- **확인 방법**: `node render.mjs stills ...`로 스틸을 뽑고, 원작자가 있는 화풍이면 `scripts/reference_sheet.py <key> <영상> <out.jpg>`로 원본 아래에 결과 프레임을 붙여 비교해 주세요.
- 엔진, 폰트, 가이드의 버그 제보와 수정도 똑같이 환영합니다. 큰 변경은 이슈를 먼저 열어 주세요.

## 라이선스

[MIT](LICENSE)
