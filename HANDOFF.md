# HANDOFF — code-video

## Just done

- v1.3.2: 화풍 가이드에서 에이전트 판단을 막던 금지·절차 규칙(로고·캐릭터 금지, 원작 장면 구조표, "이럴 때만" 조건, 금지 효과 목록)을 걷어내고, 구간 스틸(`node render.mjs stills a-b`)과 효과음 최고점 정렬을 더했다. [PR #7](https://github.com/Changroro/code-video/pull/7)로 머지하고 릴리즈했다.

## Next up

- 화풍 가이드 변경은 다시 렌더하지 않고 릴리즈했다. 다음에 화풍 예제를 돌릴 때(`~/Pictures/promo-videos/examples/run.sh`가 있는 PC) `free`, `beat`, `brand`, `motion`, `sand` 결과를 먼저 본다.
- 그 PC의 워크트리 `~/Project/code-video-wt/review-tools`는 아직 남아 있으니 지운다.
