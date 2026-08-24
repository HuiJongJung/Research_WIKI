---
type: "system"
slug: "research-status"
title: "연구 현재 상태 (공용 최신본)"
status: "reviewed"
modified_at: "2026-08-21T12:00:00.000000+00:00"
author: "정휘종"
language: "ko"
confidence: "high"
sources:
  - "C:/Users/jinsw712/Desktop/Files/UnderConstrained-GS-Recon/EXPERIMENT.md"
tags:
  - "status"
  - "system"
  - "shared-context"
---

# 연구 현재 상태 (공용 최신본)

> **이 문서는 세 갈래 세션이 공유하는 단일 최신본이다.** 방향 논의 세션, 조사·문헌 세션, 실험 세션(`UnderConstrained-GS-Recon`)이 작업 시작 시 읽는다.
>
> 갱신일 **2026-08-21 — 전면 재작성.** 배경 재구성 시대의 가설·판별값·실측을 정리하고 hole 오브젝트 무대 기준으로 다시 세웠다. **"현재 연구 상황"은 이 문서, "이전 연구 상황"은 `raw/status-archive/`의 날짜별 스냅샷이다.** 배경 시대의 상세(가설 H1~H3, 판별값 설계, 실측, 판정 이력)는 `raw/status-archive/research-status-2026-08-21.md`에 통째로 보존되어 있다.

## 0. 참조 규칙

| 알고 싶은 것 | 볼 곳 |
| --- | --- |
| 연구 방법 원론 (논의 전 필독) | `wiki/system/rules-research.md` |
| 내 연구가 어디로 가고 있는지 (주간 일지) | `direction/26년M월N주차.md` (주 = 월~일, 주차 = 그 주 월요일 기준) |
| **이전 연구 상황** | **`raw/status-archive/`** (버전 스냅샷) · `progress-*.md` (08-21 종료된 이전 형식) |
| 발표 자료·발표 방법 규율 | `wiki/system/rules-deck.md` · `rules-talk.md` |
| 실험 상태, 수치, 실행 기록 | `C:/Users/jinsw712/Desktop/Files/UnderConstrained-GS-Recon/EXPERIMENT.md` (실험의 진실 원천) |
| 문헌 조사 임무와 큐 | 이 저장소 `SURVEY_BRIEF.md` |
| 논문 정리, 개념 페이지 | 이 저장소 `wiki/sources/`, `wiki/concepts/` |

**어느 세션도 방향을 독자적으로 바꾸지 않는다.** 방향 의문은 `EXPERIMENT.md`의 "열린 질문" 또는 `SURVEY_BRIEF.md` 큐에 "판단 필요"로 남긴다. 판정은 방향 논의 세션이 한다.

## 1. 연구 한 줄 (잠정)

**hole(깊은 공동·파이프 내부 등 깊이가 있는 내부)이 있는 단일 오브젝트에서, GS 기반 mesh 재구성의 품질을 개선한다.**

- **잠정인 이유**: 문제 제기는 계보를 소화한 뒤에 한다 (`rules-research.md` 1-1). 지금 이 문장은 표적 선언이지 motivation이 아니다.
- 관통 구멍(가위 손잡이 등)이 아니라 **깊이가 있는 내부**가 표적이다. 양쪽에서 보이는 구멍은 실패하지 않는다.

## 2. 지금 할 일 (병렬 두 줄기)

**실험 줄기 — 현 SOTA가 어디까지 되는지 실측**

1. hole 있는 오브젝트를 찾아 선정한다
2. MILo · AmbiSuR로 재구성한다
3. PGSR을 세팅해서 같은 씬을 돌린다
4. 목적: SOTA의 실패 지점을 본인 눈으로 확인. motivation 그림의 원판

**공부 줄기 — 계보와 의도**

1. 같은 계보의 논문과 survey를 읽으며 **이 큰 틀의 문제와, 여러 방법이 해결하려 한 공통 목표·의도**를 머리에 넣는다
2. 각 논문에서 정리할 것: **꼬집는 문제 상황 / 동기 / 어떤 의도로 어떤 시도를 했는가 / 결과 지표 / 남는 한계** (`rules-research.md` 1-5 — 의도를 축으로 잇는다)
3. 그 위에서 내 문제 제기와 해결 방법을 찾는다

## 3. 남기는 아이디어 (배경 시대에서 살아남은 것)

1. **Observation confidence map** — 학습 전에 만드는 신뢰도 지도라는 아이디어 자체.
   - 설계 데이터는 백지에서 재검토한다. **SfM 부산물을 쓸 수도 있다** 정도만 유지 (확정 아님)
2. **confidence에 따른 차등 supervision**
   - threshold를 임의로 정하려면 근거가 있어야 하고, 아니면 **learnable**이 가능한지 검토한다 (`rules-research.md` 4-1)
   - 차등의 기여 지점 후보: regularization 가중 / densification 제어 / prior 배분 — 전부 재검토 대상
3. **어떤 기법에든 붙는 독립 모듈** — 특정 baseline(MILo) 비고집 (방향 일지 §3, 원칙 8)

## 4. 열린 질문

| # | 질문 | 상태 |
| --- | --- | --- |
| Q-A | **"photometric을 개선하면 mesh도 개선되는 것이 정상"이라는 통념이 맞는가.** 체감상 photometric을 올리며 geometry를 희생하는 케이스가 많다 (정확히는 NVS에서 그렇다는 생각). | 검토 대기. 반대 방향 단서 확보됨: CoMe Table 5, Desiatov & Sattler (기하≠시각) — 현 방향 기준으로 원문 재확인 필요 |
| Q-B | 차등 threshold를 **learnable**로 만들 수 있는가. 선례는 무엇인가 | 조사 대상 |
| Q-C | GS를 개선했을 때 mesh에 **어떤 경로로** 영향이 가는가 | 검토 대기. 전제가 아니라 증명 대상 (`rules-research.md` 2-2) |

## 5. related work (현 방향 기준 임시 정리)

> 각 항목의 "참고할 것"은 임시 메모다. 정독하면 `wiki/sources/`로 옮기고 이 표를 갱신한다.

| 논문 | 계보 위치 | 참고할 것 (임시) |
| --- | --- | --- |
| 2DGS | 무대 계보 (GS→mesh) | mesh 추출 절차(렌더 깊이→TSDF), 정규화 두 항의 실제 식 |
| PGSR | 무대 계보 — **실질 1순위** | occlusion 추정 기전 (ablation F1 0.52↔0.28), 렌더 깊이→TSDF 경로 구조 |
| MILo | 현재 실험 baseline | in-loop mesh 구조, prior 주입 경로 |
| AmbiSuR | 현 SOTA 참조선 | photometric ambiguity 처리 방식, hole에서의 한계 |
| Gaussian Sculpting | 최근접 경쟁 | 방법 차이, mesh 품질 지표(내각·sliver) 정의 |
| CDGS | 인접 선행 — 학습 전 confidence로 깊이 감독 가중 | 차별화 축 |
| VAD-GS | 인접 선행 — 가시성 + densification 조향 | 가시성 채널 설계 |
| Desiatov & Sattler | Q-A 단서 | 기하≠시각 실측 |
| Smith 외 2018 | 문제 계보 (uncertainty-aware) | 가시성·거리·각도 결합식의 원전 |
| (survey 미확보) | — | GS mesh recon survey 존재 여부부터 조사 (조사 큐) |

**문제의 계보 (Q-28b, 소화 중)**: space carving / photo hull → MVS visibility → uncertainty-aware recon → NBV·reconstructability → shape completion. **"다시 찍을 수 없고, 생성으로 채우고 싶지도 않다"의 빈칸이 우리 자리 후보** — 계보 소화 후 확정한다.

참고: hole만 전담한 논문은 존재하지 않음이 확인되었다 (Q-24). 부재 자체가 자리일 수도, "필요 없었던 것"일 수도 있다 (`rules-research.md` 1-3의 반론을 먼저 받을 것).

## 6. 가설 (재수립 중)

**현재 확정된 가설은 없다.** 배경 시대 가설(H1·H2·H3)은 §7과 함께 폐기했다.

가설은 §2의 두 줄기(SOTA 실측 + 계보 소화)가 만나는 지점에서 다시 세운다. 세울 때 `rules-research.md` §2를 따른다 — **가설의 전제 자체를 증명 대상으로 명시한다.**

## 7. 폐기 목록 (2026-08-21 확정, 이유와 함께)

| 폐기 | 이유 |
| --- | --- |
| 배경(원거리 외벽) 재구성 표적 전체 | GS용 데이터(중앙 물체 360도)로 배경을 만드는 것 자체가 과도하게 specific한 task (08-19 판정) |
| 삼각측량각 · 최대 쌍각 · pot_angle · robust spread 판별값 설계 전체 | 배경 무대 위의 설계. 설계 데이터는 백지에서 재검토하며 "SfM 부산물을 쓸 수도 있다"만 남긴다 |
| H1·H2 등 기존 실측 전체 | 배경 무대의 결과인 데다, 자동 산출된 수치를 본인이 해석하지 못한 상태라 근거로 쓰지 않는다 |
| 4상태(WELL/DEGEN/UNSUPPORTED/…) 정의, voxel 수축격자, Spires 무대 | 판별값 폐기와 같은 계열 |
| 건전성 비대칭 서술, 관측 원뿔 2·atan(r/d) 이론 훅 | 판별값 폐기와 함께 **보류**. 재설계에서 다시 유효해지면 그때 스냅샷에서 되살린다 |

상세와 당시 근거는 전부 `raw/status-archive/research-status-2026-08-21.md`에 있다.

## 8. 용어 규칙

산출물(발표, 보고, 논문, 위키, 코드 주석, 그림 라벨)에 모두 적용한다. 배경 시대 전용 항목(외벽/파사드 등)은 표에서 제외했다.

| 쓸 것 | 쓰지 말 것 |
| --- | --- |
| under-constrained | 저관측 |
| artifacts, floaters, holes | 붕괴 |
| photometric ambiguity | cheating (인용 시 따옴표로만) |
| 판별값, 지표, confidence | 신호 |
| 동일 기준 비교, 정량 대조 | 채점 |
| prior | (표준 용어이므로 유지) |

### 8-1. 서술 규칙 (발표·논문 공통)

- **방법을 특정 baseline에 국한된 것으로 서술하지 않는다.** 방침 자체가 독립 모듈이다 (§3-3). 문제는 GS 기반 표면 재구성 전반의 공통 문제로 서술하고, 실험이 특정 baseline 위에서 이루어졌음을 밝힌다.
- **"학습 전"을 "학습 없이"로 번역하지 않는다.** confidence map 접근은 baseline을 그대로 전부 학습시키고 감독의 배분만 바꾼다.

## 9. 갱신 규칙

- 방향이나 판정이 바뀌면 **주간 방향 일지(`direction/26년M월N주차.md`)에 무엇이 왜 바뀌었는지 적고, 이 문서의 해당 절을 덮어쓴다.**
- **덮어쓰기 전에 이전 버전을 보관한다.** 그날 첫 수정이면 `raw/status-archive/research-status-<날짜>.md`로 통째 복사한다 (하루 한 번이면 충분, 같은 날 나머지 변경은 git이 잡는다). 예전에 냈던 의견과 판단이 나중에 다시 쓸모 있을 수 있기 때문이다.
- 실험 수치는 이 문서에 요약만 두고 상세는 `EXPERIMENT.md`에 남긴다. 두 곳의 숫자가 어긋나면 `EXPERIMENT.md`가 옳다.
- 갱신 책임은 방향 논의 세션에 있다. 다른 세션은 이 문서를 읽기만 한다.
