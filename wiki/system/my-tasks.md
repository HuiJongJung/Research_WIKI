---
type: "system"
slug: "my-tasks"
title: "본인 작업 목록"
status: "reviewed"
modified_at: "2026-08-19T12:00:00.000000+00:00"
author: "정휘종"
language: "ko"
confidence: "high"
sources:
  - "wiki/system/progress-2026-08-19.md"
tags:
  - "tasks"
  - "system"
---

# 본인 작업 목록

> 사용자가 직접 수행하는 작업만 담는다. 전체 열린 항목은 `open-items.md`, 현재 상태는 `research-status.md`.
> **현재분만 유지하며 덮어쓴다.** 이력은 `progress-YYYY-MM-DD.md`.

기준일 2026-08-19 (방향 전환 + Q-14~Q-24 회수 반영)

---

## 1. M1 — motivation 문장 확정 [최우선, 지금 가능]

research-status 1절의 잠정판을 본인 문장으로 다듬어 확정한다. 재료는 전부 확보됨 — SOTA 자인 인용(PGSR §VI, 가림 ablation 0.52→0.28), ObsMask 관행("자인의 부재 = 측정의 부재"), 이론 고리(관 내부 관측 원뿔 ≤ 2·atan(r/d)). 실측 그림은 실험에서 붙는다.

- [ ] 잠정판 읽고 수정·확정
- [ ] 본인 입으로 1분 설명 가능한지 확인

## 2. 읽기 (우선순위 08-19 개정)

- [ ] **Smith 외 2018** (reconstructability, SIGGRAPH Asia) — **승격**: 가시성·거리·각도를 한 식에 가진 원전. 가시성 채널을 실제로 다루게 되어 방어용에서 **설계 참고**로 지위 변경. 목표: 세 인자의 정확한 형태와 결합 방식
- [ ] **Desiatov & Sattler** (arXiv 2603.20714) — "시각 개선 없이 기하 개선"의 실측 선례. 목표: ① geometric consistency의 지표 ② 실험 설계 ③ 왜 기하에는 남는다고 해석했나
- [ ] Rumpler 외 2011 — 각↔불확실도 원전, 목표 한정
- 선택: Expo-GS 훑기 (**강등** — 균일 제약 유해는 배경 무대 서사, densification 선행은 Q-17이 문헌으로 채움)

## 3. 박사분께 용어 확인

- [ ] mesh 분야에서 regularization, densification 대신 쓰는 용어

## 4. 결과 도착 시

- [ ] **씬 고르기** — 시트 3장(DTU 콘택트 시트 / Thingi10K AO 상위 30 / OmniObject3D 깊은 내부 카테고리) 도착 시. 자동 기준(AO)이 후보를 만들고 최종 선택은 본인 — 체리피킹 방어 구조
- [ ] **scan65 안와·비강 렌더 육안 확인** — SOTA 실패가 실제로 보이는지. motivation 그림의 원판
- [ ] **M4 판정 참여** — 보어 블록 conf 곡선(2·atan(r/d) 추종 여부) 도착 시 field 재설계 확정

## 보류 (하지 말 것)

- **구조도 2장** — conf 정의(강건 폭)·개입 구성이 M4 실측에서 바뀔 수 있음. **M4 종결 후 착수** (지금 그리면 다시 그린다)
- 학교 직접 촬영 (선택, 마감 없음)

---

## 위임 현황 (본인 작업 아님)

### 실험 세션 (지시 발행됨)
scan65 안와·비강 렌더 + GT hole 커버리지 / scan37 중단 / 보어 블록 제작(d/r 5단 스윕) + 사전 등록 예측 / AO 도구 / OpenXLab 등록 / 미리보기 시트 3종

### 조사 세션
Q-23 잔여 추적(Gaussian Sculpting 판본), VolFill 원문 확인, "fuse together in Scan37" 원문 확인(위상 실패 기록용)

### 위키 세션
실험·조사 회수 판정 / M4 판정 준비 / research-status 유지

## 읽지 않아도 되는 것 (확보 완료)

CoMapGS·CoMe·AmbiSuR·3DGS 초기화 ablation·DA V2/V3·PGSR 자인·2DGS 자인·SatSplat §4.5·NPP 결손 규칙 — 전부 위키에 수치·인용문 있음.
