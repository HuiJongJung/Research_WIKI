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
| `wiki/system/rules-research.md` | 규율 — 연구 방법 (쌓기) |
| `wiki/system/rules-deck.md` | 규율 — 발표 자료 구성 (쌓기, 스킬과 동기화) |
| `wiki/system/rules-talk.md` | 규율 — 발표 방법 (쌓기, 사용자 열람용) |
| `wiki/system/open-items.md` | 열린 항목 등록부 (상태·담당 표기, 갱신) |
| `direction/할일.md` | 사용자 to-do 리스트 (현재분만, 덮어씀, 위키 인덱스 비대상) |
| `direction/26년M월N주차.md` | **주간 방향 일지** (위키 인덱스 비대상, 큰 전환 시 새 파일) |
| `wiki/system/progress-YYYY-MM-DD.md` | 이전 형식 진행 이력 (08-21에 종료, 더 만들지 않음) |
| `wiki/system/feedback-YYYY-MM-DD-*.md` | 세미나 피드백 기록 (동결, 갱신하지 않음) |
| `raw/feedback/` | 피드백 원본 파일 (인덱스 대상 아님) |
| `raw/status-archive/` | research-status 이전 버전 보관 (덮어쓰기 전 스냅샷) |
| `wiki/sources/` | 논문별 정리 페이지 |
| `wiki/concepts/` | 재사용 가능한 개념 |
| `wiki/comparisons/`, `wiki/claims/`, `wiki/questions/` | 비교표, 주장, 열린 질문 |
| `wiki/assets/` | 논문 그림 crop |
| `SURVEY_BRIEF.md` | 문헌 조사 세션 전용 임무 문서와 큐 |
| `src/`, `tests/`, `tools/` | 위키 MCP 서버 구현 (연구 작업과 무관) |

## 3축 규율 문서 (항상 참조 + 항상 갱신)

세 파일은 **덮어쓰는 최신본이 아니라 쌓는 문서**다. 한 번 배운 규칙이 계속 적용된다. `wiki/system/`에 나란히 있다.

| 파일 | 담는 것 | 언제 읽나 | 언제 쓰나 |
| --- | --- | --- | --- |
| `wiki/system/rules-research.md` | **원론적 연구 방법만.** 표적이 바뀌어도 살아남는 것 | **연구 방향·가설·기여·novelty·설계를 논의할 때마다 먼저 읽는다** | 연구 방법에 관한 지적·조언을 들었을 때 |
| `wiki/system/rules-deck.md` | 발표 자료 형식·구조·그림·문체·지표 제시 | 발표자료를 만들거나 검토할 때 (`seminar-deck-draft` 스킬이 이 내용을 정본으로 실행) | 자료 형식에 관한 피드백을 들었을 때 |
| `wiki/system/rules-talk.md` | 발표 자리에서의 행동 팁 | **세션은 읽지 않는다.** 사용자가 발표 전에 직접 읽는 용도 | 발표 태도·응답에 관한 조언을 들었을 때 (쌓아만 둔다) |

**새 조언이 들어오면 ① 어느 파일인지 ② 기존 항과 겹치는지를 먼저 가른다.** 같은 말이면 올리지 않고, **기존 내용을 포함하면서 더 나아간 것이면 기존 항을 교체한다.** 충돌하면 병기하지 말고 사용자에게 어느 쪽이 최신 판단인지 확인한다 (`rules-research.md` §0).

축을 가르는 기준은 연구를 어떻게 할 것인가 → research, 자료를 어떻게 만들 것인가 → deck, 자리에서 어떻게 말할 것인가 → talk. 셋에 걸치는 지적은 축별로 쪼개서 각각 넣는다.

**`rules-deck.md` 동기화 의무.** 이 파일을 고치면 스킬 사본도 함께 고친다. 한쪽만 고치면 다음 덱 작성이 구판으로 돌아간다.

```
powershell -ExecutionPolicy Bypass -File tools\sync-rules.ps1
```

`tools/sync-rules.ps1`이 frontmatter를 떼고 `~/.claude/skills/seminar-deck-draft/references/rules.md`로 덮어쓴다. 결과 확인은 아래가 아무것도 출력하지 않으면 일치.

```
diff <(awk 'NR==1 && /^---$/{f=1;next} f && /^---$/{f=0;next} !f' wiki/system/rules-deck.md) ~/.claude/skills/seminar-deck-draft/references/rules.md
```

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

1. **주간 방향 일지** `direction/26년M월N주차.md`에 무엇이 왜 바뀌었는지 적는다. 파일이 없으면 만든다.
   - **주 규칙 (08-31 개정)**: 주는 월요일 시작, **일요일 끝**. 달과 주차를 **그 주 일요일**이 정한다.
     - 달 = 그 주 **일요일이 속한 달**
     - 주차 = 그 일요일이 그 달의 **몇 번째 일요일**인가
     - 예: 2026-09-02 수요일 → 그 주는 08-31 월 ~ 09-06 일 → 일요일이 9월 첫 일요일 → `26년9월1주차.md`
     - 월요일 기준이던 구규칙으로 만들어진 `26년8월3주차`·`26년8월4주차`는 **소급 개명하지 않는다**
   - **큰 방향 전환이 주 중간에 나면 `26년M월N주차-전환MMDD.md`로 새 파일을 연다**
   - 위키 폴더 밖(`direction/`)에 두는 이유: 한글 파일명이 위키 슬러그 규칙에 걸리므로 인덱스 비대상으로 분리
2. `wiki/system/research-status.md`의 해당 절을 덮어쓰고 상단 갱신일을 고친다. **덮어쓰기 전, 그날 첫 수정이면 이전 버전을 `raw/status-archive/research-status-<날짜>.md`로 복사해 보관한다.**

일지는 **내 연구가 어디로 가고 있는지 돌아보기 위한 것**이고, 최신본은 **지금 어떤지**를 담당한다.

방향 일지에는 연구 특정 결정(표적, 설계 선택, 무대 규약)을 적는다. **원론적 연구 방법은 적지 않는다** — 그건 `rules-research.md`다. 판단이 서지 않으면 이렇게 가른다: **표적이 바뀌어도 살아남으면 rules, 함께 바뀌면 direction.**

> `progress-YYYY-MM-DD.md`는 2026-08-21까지 쓰던 이전 형식이다. **더 만들지 않는다.** 그 이전 이력은 그 파일들에 남아 있다.

## 알아둘 상태

- MCP 서버(`research-wiki`)는 현재 실행되지 않는다. 명령이 PATH에 없어 최근 페이지들은 손으로 작성되었다. 손으로 쓸 때도 frontmatter 규칙은 동일하게 지킨다.
- git 이력이 2026-06-23 이후 멈춰 있고 위키 markdown 다수가 추적되지 않은 상태다. 파일 삭제나 이동 전에 사용자에게 확인한다.
