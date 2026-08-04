# Research_WIKI — 에이전트 운영 규칙

**규칙 본문은 `CLAUDE.md`에 있다. 이 파일은 Codex용 포인터다. 먼저 `CLAUDE.md`를 읽는다.**

요지만 옮기면 다음과 같다.

- 세션 시작 시 **`wiki/system/research-status.md`**(연구 공용 최신본)를 읽는다. 실험 수치가 필요하면 `C:/Users/jinsw712/Desktop/Files/UnderConstrained-GS-Recon/EXPERIMENT.md`를 본다.
- `journal.md`, `harness/`, `specs/`, `PRD.md`, `TASK.md`, `docs/`는 2026년 6월에 종료된 위키 MCP 도구 개발 프로젝트의 유물이다. **읽지 않는다.**
- 위키 페이지는 `wiki/system/page-schema.md`의 frontmatter 규칙을 반드시 지킨다. 형식이 어긋난 파일 하나가 전체 인덱스 재구성을 중단시킨다.
- 방향이나 판정이 바뀌면 `wiki/system/progress-<날짜>.md`에 이력을 남기고 `research-status.md`를 덮어쓴다.
- 어느 세션도 연구 방향을 독자적으로 바꾸지 않는다.

## 보고서 작성 규칙

사용자에게 보이는 보고서나 표를 만들 때, 내부 작성 규칙이나 단서, "확인된 경우에만 채울 것" 같은 출처 정책 문구를 본문에 넣지 않는다. 그런 규칙은 드러내지 말고 적용만 한다.

## 종료된 도구 개발 규칙

이 파일에 있던 계획 게이트, 한 번에 한 작업 구현 루프, journal 추가 형식, 검증 커맨드는 위키 MCP 도구를 만들던 시기의 규칙이었다. 2026-08-04에 폐기했다. 원본은 git 이력과 `harness/`에 남아 있다.
