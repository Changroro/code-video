---
name: handdrawn-promo-video
description: 주제(회사, 서비스, 사이트, 제품)를 조사해 손그림 캔버스 애니메이션과 주제에 맞춘 8비트 미니미 캐릭터 스타일의 짧은 홍보 영상을 MP4로 만든다. 영상 길이, 화면 비율, 언어, 주인공 같은 세부 설정을 먼저 묻고, 조사한 사실과 출처로 스토리보드를 승인받은 뒤 제작, 검수, 렌더까지 한다. "소개 영상 만들어줘", "홍보 영상", "런치 영상", "인트로 영상", "손그림 애니메이션 영상", "이 회사로 영상 만들어줘", "launch video", "promo video" 같은 요청에 사용한다. 실사 편집, 자막 입히기, 음악 영상은 대상이 아니다.
---

# Hand-drawn Promo Video

`<skill>`은 이 SKILL.md가 있는 폴더다. 엔진은 `<skill>/template/`에 있다.
- `kit.js`: 손그림 선, 글자, 카메라, 전환, 픽셀 스프라이트, 미니미, 이미지 픽셀화 헬퍼
- `minis-ai.js`: AI 관련 주제용 미니미 세트(Claude, Codex, Gemini, DeepSeek, Grok, Qwen)
- `render.mjs`: Chrome 헤드리스로 병렬 렌더
- `main.js`: 장면 골격

필요한 도구는 `node`/`npm`, `ffmpeg`(libx264), Google Chrome, `uv`다. 하나라도 없으면 멈추고 무엇이 없는지 알린다.

```bash
for c in node npm ffmpeg uv; do command -v $c >/dev/null || echo "missing: $c"; done; ffmpeg -hide_banner -encoders | grep -q libx264 || echo "missing: libx264"
```

## 0. 세부 설정 묻기
AskUserQuestion 한 번으로 묻는다. 사용자가 이미 말한 항목은 빼고, 권장 옵션을 첫 번째에 둔다.

- 길이: 30초 / 15초 / 45초 / 60초
- 화면: 16:9 1920×1080 / 9:16 1080×1920 / 1:1 1080×1080 / 16:9 2560×1440
- 언어: 한국어 중심 + 영문 포인트 / 영어 / 한·영 병기
- 캐릭터: 로고 마스코트 + 주제에 맞춘 미니미 / 미니미 직접 지정 / 로고 마스코트만 / 캐릭터 없음

미니미는 주제에 맞춘 8비트 조연 캐스트다. 사용자가 지정하면 그대로 따르고, 지정하지 않으면 조사 결과로 캐스트를 정해 계획에서 제안한다(기준: [references/storyboard.md](references/storyboard.md)의 미니미 캐스팅).

묻지 않은 항목은 다음 기본값을 쓰고 계획에 적는다.
- 30fps, H.264 MP4, 30초당 10MB 이하
- 오디오 없음. 이 엔진은 무음 영상만 만든다.

## 1. 조사
[references/research.md](references/research.md)를 따른다.
- 사실, 수치, 카피 원문, 브랜드 자산 조사는 읽기 전용 에이전트(`model: sonnet`)에 맡기고, 독립된 조사는 병렬로 돌린다.
- 영상에 크게 들어갈 수치는 원문 문장을 직접 확인한다.
- 자료끼리 수치가 충돌하면 사용자에게 묻는다.

## 2. 계획 승인
다음 내용을 보여주고 승인받기 전에는 작업 폴더를 만들지 않는다.
- 조사 요약(출처 링크)
- 장면별 시간표: [references/storyboard.md](references/storyboard.md)의 패턴과 시간 배분을 쓴다.
- 쓸 수치와 뺀 수치, 자산 목록(로고 URL, 폰트, 캐릭터), 작업 폴더 위치

사용자가 장면이나 강조점을 바꾸면 반영한 흐름을 한 번 더 요약하고 진행한다.

## 3. 제작
```bash
cp -R <skill>/template <작업폴더>/<name>-video && cd <작업폴더>/<name>-video
npm i
bash <skill>/scripts/fetch_fonts.sh assets/fonts
curl -fsSL -o assets/logo_src.png '<공식 로고 URL>'
uv run --with pillow python <skill>/scripts/clean_logo.py assets/logo_src.png assets/logo.png
```
- `index.html`: `window.VIDEO`에 크기, fps, 길이를 넣고, 쓰는 폰트만 `@font-face`로 선언한다.
- `main.js`: THEME, 장면 함수, `boot()`를 둔다. API는 [references/kit-api.md](references/kit-api.md)에 있다.
- 로고와 워드마크는 실제 파일을 쓴다.
- 로고 마스코트는 `drawPixels`용 스프라이트로 그린다.
- 미니미는 `MINIS`에 등록하고 `drawMini`로 그린다. AI 관련 주제면 준비된 세트 `minis-ai.js`를 불러와 쓰고, 빠진 캐릭터만 새로 그린다.
- 캐릭터 라인업 스틸 1장을 제작 초반에 사용자에게 보여주고 확인받는다.
- 문구와 수치는 `main.js` 위쪽 상수에 모은다. 사용자 결정이 남은 수치는 URL 파라미터 하나로 분기해 두 버전을 렌더할 수 있게 한다.

## 4. 검수
[references/qa-checklist.md](references/qa-checklist.md)를 따른다.
1. `node render.mjs stills <장면 중간과 전환 직전·직후 시각들>`로 스틸을 뽑는다.
2. `uv run --with pillow python <skill>/scripts/contact_sheet.py stills <임시폴더>`로 시트를 만들어 본다.
3. 문제를 고친다.
4. `CRF=25 node render.mjs video draft.mp4`로 초안을 렌더하고, 전환 프레임을 추출하고, 용량을 확인한다.

## 5. 최종 렌더와 전달
- `CRF=25 node render.mjs video <Name>_intro.mp4`로 최종본을 만든다. 용량 목표를 넘으면 CRF 27로 올리거나 `boot({ noise })`를 낮춘다.
- `stills/`, 초안, 로그 같은 중간 파일을 지운다.
- `SendUserFile`(display `render`)로 MP4를 보내고 다음을 보고한다.
  - 스펙: 길이, 해상도, fps, 용량
  - 장면 구성
  - 사용한 사실과 출처 링크
  - 뺀 수치와 이유, 확인이 필요한 항목
  - 재렌더 명령: 작업 폴더 안에서 실행해야 한다고 명시한다.
