# HANDOFF — code-video

## Just done

- 화풍 가이드에서 에이전트 판단을 막던 금지·절차 규칙(로고·캐릭터 금지, 원작 장면 구조표, "이럴 때만" 조건, 금지 효과 목록)을 걷어내고, 구간 스틸(`node render.mjs stills a-b`)과 효과음 최고점 정렬을 더했다. [PR #7](https://github.com/Changroro/code-video/pull/7)로 올라가 있다.

## Next up

- PR #7을 머지하고 패치 릴리즈(버전 올림, 릴리즈, 마켓플레이스 설명 확인, dotfiles lock)를 낸다. 절차와 남기는 규칙의 기준은 `~/Pictures/promo-videos/docs/code-video-release.md`에 있다.
- 화풍 가이드 변경은 다시 렌더해 보지 않았다. 릴리즈 전에 `~/Pictures/promo-videos/examples/run.sh`로 몇 화풍을 돌려 확인 시트를 본다.
- 머지 뒤 워크트리 `~/Project/code-video-wt/review-tools`와 `feat/review-tools` 브랜치를 정리한다.
