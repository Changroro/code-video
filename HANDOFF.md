# HANDOFF — code-video

## Just done

- SKILL.md가 화풍을 나열하지 않고 `grep '^# Style' <skill>/references/styles/*.md`로 가이드 헤더를 읽어 고르게 했다. 목록에 없는 화풍은 `free.md`로 간다. 새 화풍은 `references/styles/`에 `# Style: <이름>` 헤더로 시작하는 가이드만 넣으면 된다.
- scene-API 5종 가이드를 `references/scene-api.md`에서 `references/styles/scene.md`로 옮겼다.
- 원작자 크레딧(SKILL.md 목록, 크레딧 규칙, 가이드의 `Credit:` 줄, 템플릿 주석의 `@ID`)을 모두 뺐다. README 크레딧 섹션만 남는다.
- v1.3.2 릴리즈: 구간 스틸, 효과음 최고점 정렬, 화풍 가이드의 금지·절차 규칙 제거.

## Next up

- 이번 변경은 버전을 올리지 않았다. 릴리즈할 때 `plugin.json` 버전을 올린다.
- 화풍 가이드 변경은 다시 렌더하지 않았다. 다음에 화풍 예제를 돌릴 때(`~/Pictures/promo-videos/examples/run.sh`가 있는 PC) `free`, `beat`, `brand`, `motion`, `sand`, `scene` 결과를 먼저 본다.
- 그 PC의 워크트리 `~/Project/code-video-wt/review-tools`는 아직 남아 있으니 지운다.
