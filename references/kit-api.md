# kit.js API

전역 스크립트다. `index.html`에서 rough.js → kit.js → (미니미 세트) → main.js 순서로 불러온다. `window.VIDEO = { w, h, fps, dur }`가 캔버스 크기와 길이를 정한다.

## 전역
- `W, H, FPS, DUR`, `ctx`(2D 컨텍스트), `rc`(rough 캔버스), `T`(현재 초), `IMG`(boot의 images), `BG`.
- `THEME = { ink, paper, dark, light, grid, gridDark }`: main.js에서 `Object.assign(THEME, {...})`로 바꾼다.

## 시간·수학
- `prog(t, a, b)`: 구간 진행도 0..1. `E.out / E.in / E.inOut / E.back`: 이징.
- `lerp`, `clamp`, `mixHex(a, b, t)`(색 보간), `hash(a, b)`, `rnd(seed)`(결정적 난수), `typed(s, p)`(타자 효과용 부분 문자열).
- `bez(a, c, b, n)` / `bezAt(a, c, b, t)`: 2차 베지어.
- `camKeys(t, [[time, cx, cy, z], ...])`: 키프레임 카메라.

## 손그림
- `ro(id, opts, rate = 10)`: rough 옵션. id마다 모양이 다르고, `rate`만큼 초당 흔들림이 바뀐다. 배경 격자는 rate 4~5.
- `rc.line / rectangle / circle(지름) / ellipse / polygon / linearPath / curve / arc`: rough.js 원본.
- `sketch(pts, p, id, opts)`: 선을 p만큼 그린다(그려지는 애니메이션). `arrow(pts, p, id, opts)`.
- `circlePts(cx, cy, rx, ry)`: 손그림 원을 그릴 점 목록.
- `highlight(x, y, w, h, p, id, color)`: 형광펜. 인쇄된 글자 위에 칠할 때는 `ctx.globalCompositeOperation = 'multiply'`.
- `wave`, `radioWaves`, `shadow(x, y, w, dark)`.

## 글자
- `text(s, x, y, { font, weight, size, color, align, base, rot, alpha, reveal, outline, ow, jit, maxW })`.
  - `reveal`: 왼쪽부터 드러나기(0..1).
  - `outline`: 배경색 테두리로 복잡한 배경 위 가독성 확보.
  - `maxW`: 넘치면 축소.
  - `jit`: 손그림 흔들림(숫자/HUD는 false).
- `measure(s, font, size, weight)`.

## 카메라·전환
- `cam(z, cx, cy, rot, sx, sy)`: `ctx.save()` 뒤에 호출하고 `ctx.restore()`로 닫는다. 월드 좌표 (cx, cy)가 화면 중앙에 오고 z배 확대된다. 보이는 범위는 cx ± W/2/z.
- `shake(amp, id)` → [sx, sy]. `flash(a, color)`, `speedLines(amt, color)`, `zoomLines(amt, color, cx, cy)`, `inkBand(x0, x1, color)`.

## 배경
- `paperBG()`, `darkBG()`: boot에서 THEME로 만든 질감 배경(화면 고정이라 압축에 유리).
- `grid(dark, step)`: 해도나 모눈 느낌의 손그림 격자(월드 좌표, 카메라 안에서 호출).

## 스프라이트
- `drawPixels(rows, pal, x, y, s, { flip, sx, sy, rot, outline, alpha, swap })`: 아래쪽 가운데가 기준점이다. rows는 문자열 배열이고 '.'은 빈칸, pal은 문자 → 색 또는 (x, y) => 색이다.
- `MINIS`, `drawMini(key, x, y, s, { blink, outline, flip, sx, sy, rot, alpha })`: 미니미 캐스트. `Object.assign(MINIS, { key: { name, color, body, pal, rows } })`로 등록한다. `E` 픽셀은 blink일 때 `body` 색으로, `C` 픽셀은 스스로 깜빡인다. `minis-ai.js`는 준비된 AI 세트다.
- `pixelImage(img, cx, cy, w, h, px)`: 이미지(로고 등)를 px 크기 블록으로 픽셀화해 그린다. px를 1에서 키우면 로고가 점점 8비트로 바뀐다.

## 부트
```js
boot({
  scenes: [[start, end, fn], ...],        // fn(t) - t는 장면 시작부터의 초
  images: { logo: 'assets/logo.png' },    // → IMG.logo
  fonts: [['PRE', '가A'], ['PIX', 'A']],  // @font-face 이름, 샘플 글자
  noise: 6,                               // 배경 노이즈(클수록 용량 증가)
  setup: () => { /* 폰트 로드 후 오프스크린 캔버스 사전 렌더 */ },
});
```
`?t=12.3`는 한 프레임 미리보기, `?play`는 실시간 재생이다.

## 렌더
- `node render.mjs stills 1.2 3.4 ...` → `stills/t<초>.png`
- `CRF=25 WORKERS=4 node render.mjs video out.mp4` → H.264 yuv420p faststart. 1080p 30초 기준 약 2~3분, 약 8MB.
