# Research_WIKI

3D Gaussian Splatting 기반 표면 재구성 연구의 **지식 위키**. 논문 정리, 개념 페이지, 연구 상태 기록을 담는다.

## 반드시 먼저 읽을 것

**`wiki/system/research-status.md`** — 연구 방향, 가설과 판정, 용어 규칙, 경쟁 기법 차이, 현재 진행이 모두 여기 있다. 이 저장소의 모든 세션과 `UnderConstrained-GS-Recon` 실험 세션이 공유하는 단일 최신본이다.

실험 수치와 실행 상태가 필요하면 **`C:/Users/jinsw712/Desktop/Files/UnderConstrained-GS-Recon/EXPERIMENT.md`**(실험의 진실 원천)를 본다. 두 문서의 숫자가 어긋나면 EXPERIMENT.md가 옳다.

## 읽지 말 것

`journal.md`, `harness/`, `specs/`, `PRD.md`, `TASK.md`, `README.md`, `docs/`, `AGENTS.md`는 2026년 6월에 끝난 **위키 MCP 도구 개발 프로젝트의 유물**이다. 연구와 무관하며 토큰만 소모한다. 이력이 필요할 때만 지정해서 연다.

## 저장소 구조

| 경로 | 내용 |
| --- | --- |
| `wiki/system/research-status.md` | 연구 현재 상태 (공용 최신본, 항상 덮어씀) |
| `wiki/system/open-items.md` | 열린 항목 등록부 (상태·담당 표기, 갱신) |
| `wiki/system/my-tasks.md` | 사용자 직접 작업 목록 (현재분만, 덮어씀) |
| `wiki/system/progress-YYYY-MM-DD.md` | 진행 이력 (날짜별로 쌓기만 함, 평소엔 안 읽음) |
| `wiki/system/feedback-YYYY-MM-DD-*.md` | 세미나 피드백 기록 (동결, 갱신하지 않음) |
| `raw/feedback/` | 피드백 원본 파일 (인덱스 대상 아님) |
| `wiki/sources/` | 논문별 정리 페이지 |
| `wiki/concepts/` | 재사용 가능한 개념 |
| `wiki/comparisons/`, `wiki/claims/`, `wiki/questions/` | 비교표, 주장, 열린 질문 |
| `wiki/assets/` | 논문 그림 crop |
| `SURVEY_BRIEF.md` | 문헌 조사 세션 전용 임무 문서와 큐 |
| `src/`, `tests/`, `tools/` | 위키 MCP 서버 구현 (연구 작업과 무관) |

## 세션 역할

| 세션 | 담당 |
| --- | --- |
| 방향 논의 (이 저장소) | 방향, 판정, novelty, 설계. **research-status.md 갱신 책임** |
| 조사·문헌 (이 저장소) | 문헌 조사, 사실 확인, 위키 페이지 작성. `SURVEY_BRIEF.md`를 따른다 |
| 실험 (`UnderConstrained-GS-Recon`) | 코드, 학습, 측정. `EXPERIMENT.md` 갱신 책임 |

**어느 세션도 연구 방향을 독자적으로 바꾸지 않는다.** 방향 의문은 `EXPERIMENT.md`의 "열린 질문" 또는 `SURVEY_BRIEF.md` 큐에 "판단 필요"로 남기고, 판정은 방향 논의 세션이 한다.

## 위키 페이지 작성 규칙

- 페이지 종류는 코드에 고정되어 있다: source, concept, comparison, claim, question, system, skill. **새 폴더를 만들면 인덱스와 검색에 잡히지 않는다.**
- 형식이 어긋난 파일 하나가 **전체 인덱스 재구성을 중단시킨다.** frontmatter 10개 항목을 반드시 갖춘다. 형식은 `wiki/system/page-schema.md`.
- 슬러그는 소문자와 하이픈만. 하위 폴더 불가.
- 용어와 문체 규칙은 `research-status.md` 8절을 따른다.

## 진행 기록 갱신 규칙

방향이나 판정이 바뀌면 두 가지를 함께 한다.

1. `wiki/system/progress-<오늘 날짜>.md`에 무엇이 왜 바뀌었는지 적는다 (파일이 없으면 만든다).
2. `wiki/system/research-status.md`의 해당 절을 덮어쓰고 상단 갱신일을 고친다.

이력은 왜 그렇게 되었는지를, 최신본은 지금 어떤지를 담당한다.

## 알아둘 상태

- MCP 서버(`research-wiki`)는 현재 실행되지 않는다. 명령이 PATH에 없어 최근 페이지들은 손으로 작성되었다. 손으로 쓸 때도 frontmatter 규칙은 동일하게 지킨다.
- git 이력이 2026-06-23 이후 멈춰 있고 위키 markdown 다수가 추적되지 않은 상태다. 파일 삭제나 이동 전에 사용자에게 확인한다.
