# code-video

[English](README.md) | 한국어

![대본 하나, 화풍 다섯 가지: 아케이드, 터미널, 감열지, 노선도, 청사진](docs/hero.gif)

*대본 하나, 화풍 다섯 가지. 위의 모든 프레임은 코드로 그렸습니다.* 이 스킬로 만든 [45초 소개 영상 보기](https://github.com/Changroro/code-video/releases/download/v1.2.0/CodeVideo_intro_ko.mp4).

주제를 조사해 짧은 영상을 전부 코드로 그려 주는 에이전트 스킬입니다. 영상 생성 모델도, 스톡 영상도 쓰지 않습니다. 에이전트가 장면을 코드로 짜고, 한 프레임씩 렌더해서 MP4로 건네줍니다.

## 동작 원리

1. **전부 코드입니다.** 매 프레임을 "시간 t일 때의 그림"으로 HTML 캔버스에 그리고, headless Chrome으로 찍어 ffmpeg로 인코딩합니다. 음악과 효과음도 코드로 합성하기 때문에 같은 입력이면 늘 같은 영상이 나옵니다.
2. **조사가 먼저입니다.** 출처가 있는 사실만 모으고, 크게 보여줄 숫자는 원문 문장과 다시 대조합니다. 색과 폰트는 브랜드에서 가져옵니다. 화면의 모든 숫자에 출처가 있습니다.
3. **계획은 사용자가 승인합니다.** 화풍, 이야기 형식, 설정(길이, 비율, 캐릭터, 화면 언어)을 먼저 묻고, 만들기 전에 스토리보드, 팔레트, 소리 계획을 보여줍니다.
4. **화풍 × 이야기 형식.** 화풍은 어떻게 그리는지, 이야기 형식은 어떻게 풀어가는지입니다. 어떤 화풍이든 어떤 형식과도 조합할 수 있습니다.
5. **넘기기 전에 검수합니다.** 스틸, 전환 구간, 전체 타임라인, 음량(-14 LUFS)을 확인하고, 원작자가 있는 화풍은 원본 프레임과 나란히 놓고 시그니처가 모두 보일 때까지 고칩니다.

## 화풍

| 화풍 | 느낌 | 원작자 |
|---|---|---|
| 손그림과 8비트 미니미(기본) | 발랄한 스케치북 | [@nahiddotai](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB) |
| 브랜드 모션그래픽 | 깔끔한 공식 자료 | [@digitalstrategyai](https://www.threads.com/@digitalstrategyai/post/DdpAYbcgAj0) |
| 모래 그림 | 따뜻한 이야기 | [@Michaelzsguo](https://x.com/Michaelzsguo/status/2102592355165782312) |
| 16비트 아케이드 | 게임, 활기찬 | 자체 제작 |
| CRT 터미널 | 개발자, 레트로 | 자체 제작 |
| 감열지 영수증 | 인쇄물, 손에 잡히는 | 자체 제작 |
| 노선도 | 도식, 정돈된 | 자체 제작 |
| 청사진 | 기술 도면, 정밀한 | 자체 제작 |

화풍은 계속 추가되며, 새 화풍 PR도 환영합니다([기여하기](#기여하기) 참고). 자체 제작 화풍은 같은 장면 API를 써서, 대본 하나를 어느 화풍으로든 렌더할 수 있습니다. 아래는 같은 "단계" 장면을 여러 화풍으로 그린 모습입니다.

![다섯 화풍의 같은 장면](docs/looks.jpg)

## 이야기 형식

| 형식 | 구성 | 어울리는 주제 | 원작자 |
|---|---|---|---|
| 기본 홍보(기본) | 훅 → 제목 → 단계 → 큰 숫자 → 엔딩 | 모든 회사, 제품, 서비스 | 자체 제작 |
| 대전 | 두 선택지의 라운드별 대결과 합계 | A 대 B, 이전 대 새 버전, 전후 비교 | 자체 제작 |
| 세션 | 명령과 출력으로 사용법을 보여줌 | 도구, API, 작업 흐름 | 자체 제작 |
| 영수증 | 항목, 합계, 도장 | 가격, 요금제 구성, 연말 결산 | 자체 제작 |
| 노선도 | 노선, 역, 환승역 | 사업 분야, 제품 라인업, 연혁 | 자체 제작 |
| 설계도 | 부품과 부품별 사양 | 구성 요소, 아키텍처, 해부도 | 자체 제작 |
| 가사형 뮤직비디오 | 창작곡, 한 줄에 사실 하나 | 기억에 남는 설명 영상 | [@goodside](https://x.com/goodside/status/2102852546620744010) |
| 비트 싱크 실사 | 실제 영상을 음원 박자에 맞춰 편집 | 직접 찍은 영상과 사용 허가된 음원 | [@twoclipping](https://x.com/twoclipping/status/2102554209166000267) |

대전, 세션, 영수증(9:16), 노선도, 설계도 형식으로, 이 스킬로 이 스킬을 소개한 장면입니다.

![이야기 형식 다섯 가지](docs/formats.jpg)

## 크레딧

원작자 표시가 있는 화풍과 형식은 원작자가 Claude Opus 5.5 공개 뒤 공개적으로 공유한 작업에서 착안했습니다. 링크는 위 표에 있습니다. 이 저장소에는 원작자들의 프롬프트 원문이 들어 있지 않습니다. `references/`의 가이드는 직접 새로 썼고, 모든 화풍과 형식에 같은 리서치, 승인, 검수 단계를 적용합니다. 자체 제작 표시가 있는 화풍과 형식은 이 스킬을 위해 새로 만들었습니다. 기본 화풍은 [@nahiddotai](https://www.threads.com/@nahiddotai)의 ["Introducing Opus 5.5" 런치 영상](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB)과 [공유된 프롬프트](https://www.threads.com/@nahiddotai/post/Ddm0OgZkuQx)에서 착안했습니다.

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

에이전트에게 영상을 요청하면 됩니다. 원하는 화풍이나 형식이 있으면 함께 말하고, 없으면 주제에 맞춰 추천받으면 됩니다.

- "https://example.com 30초 홍보 영상 만들어줘"
- "우리 회사 연혁을 모래 그림 영상으로 만들어줘"
- "요금제 두 개를 아케이드 대전 영상으로 비교해줘"
- "우리 CLI 사용법을 터미널 세션 영상으로 보여줘"

## 구성

| 경로 | 역할 |
|---|---|
| `SKILL.md` | 작업 흐름: 화풍·형식·설정 → 리서치 → 계획 승인 → 제작 → 검수 → 렌더 |
| `.claude-plugin/plugin.json` | Claude Code 플러그인 매니페스트(스킬은 저장소 최상위에 있음) |
| `template/kit.js` | 캔버스 키트: 손그림 도형, 텍스트와 키네틱 타이포, 카메라, 전환, 스프라이트, 미니미, 영상 클립 |
| `template/{handdrawn,motion,sand,lyric,beat}.js` | 원작자가 있는 화풍·형식의 시그니처 요소를 그리는 스타일 모듈 |
| `template/{arcade,terminal,thermal,transit,blueprint}.js` | 공통 장면 API와 대표 형식 장면을 가진 화풍 모듈 |
| `template/render.mjs` | 병렬 페이지로 프레임을 결정적으로 캡처해 ffmpeg로 인코딩하고 오디오 트랙을 합침 |
| `template/minis-ai.js` | AI 관련 주제용 미니미 캐릭터 세트 |
| `references/` | 리서치 절차, 스토리보드 패턴, 화풍, 이야기 형식, 키트 API, 검수 체크리스트 |
| `references/styles/` | 원작자가 있는 화풍과 형식의 가이드(원작 시그니처 체크리스트 포함) |
| `scripts/` | 폰트 다운로드, 로고 배경 정리, 검수용 시트, 원작 비교 시트, 음악·효과음 합성, 박자 분석 |

폰트는 제작할 때 Google Fonts와 jsDelivr에서 내려받으며(SIL Open Font License), 저장소에 포함하지 않았습니다.

`template/minis-ai.js`의 캐릭터는 비공식 팬아트입니다. 제품명과 상표는 각 소유자에게 있습니다.

## 기여하기

PR을 환영합니다. 새 화풍과 새 이야기 형식이면 더 좋습니다.

- **새 화풍이나 형식**: `template/`에 스타일 모듈(시간만으로 그리는 순수 함수, 프레임 사이 상태 없음)을, `references/styles/`에 특징마다 헬퍼를 연결한 시그니처 표가 있는 가이드를 넣고, `SKILL.md`와 README 두 곳의 표에 한 줄씩 추가해 주세요.
- **다른 사람의 공개 작업을 참고할 때**: 원작자를 링크와 함께 표기하고, 가이드는 직접 쓴 문장으로 작성하며(프롬프트 원문은 넣지 않음), 원본 영상 4컷을 `docs/styles/`에 넣어 누구나 비교할 수 있게 해 주세요.
- **확인 방법**: `node render.mjs stills ...`로 스틸을 뽑고, 원작자가 있는 스타일이면 `scripts/reference_sheet.py <key> <영상> <out.jpg>`로 원본 아래에 결과 프레임을 붙여 비교해 주세요.
- 엔진, 폰트, 가이드의 버그 제보와 수정도 똑같이 환영합니다. 큰 변경은 이슈를 먼저 열어 주세요.

## 라이선스

[MIT](LICENSE)
