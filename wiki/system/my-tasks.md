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

## 2. 읽기 (08-19 재편 — 새 무대 계보 중심)

**1군 (이번 주, 한 묶음): 새 무대의 뼈대. M1 문장은 이 셋 읽으며 같이 여물인다**

- [ ] **2DGS** (SIGGRAPH 2024) — 단일 물체 GS recon의 기초. 평면 primitive 논쟁(SatSplat 비판)의 당사자, 우리 인용 2개(unconstrained·densification 질감 편향)의 원전. 목표: 방법 전체 + §7 자인의 맥락
- [ ] **PGSR** — ★가장 중요. occlusion 추정 하나로 F1 절반(0.52↔0.28)을 얻음 = **우리 가시성 채널의 "학습 중" 대응물.** 걔들 방식을 모르면 "우리는 학습 전에 한다"는 차별화를 말할 수 없다. AmbiSuR의 기반. 목표: occlusion 추정 기전 정확히
- [ ] **Gaussian Sculpting** (arXiv 2608.10602) — 최근접 경쟁, "뭐가 다르냐" 질문 필수 대비. mesh 품질 지표(내각·sliver)의 계산 방식도 우리 채택 선례. 목표: 방법 + 지표 정의 + 무엇을 못 하는지

**2군 (다음): 인접 선행 방어**

- [ ] **CDGS** — 가장 가까운 인접 선행(학습 전 confidence로 깊이 감독 가중). 차별화 문장을 본인 입으로
- [ ] **VAD-GS** — track 가시성 + densification 조향, 우리 가시성 채널·clone 억제 둘 다에 인접

**3군 (M4 착수 시): 설계 입력**

- [ ] Smith 외 2018 — 가시성·거리·각도 결합식의 원전 (설계 참고로 승격)
- [ ] Desiatov & Sattler — 기하≠시각의 실측 선례
- RaDe-GS 훑기만 (MILo 래스터라이저 — 구조만), Rumpler 목표 한정

**읽지 않는다**: hole 전용 논문(존재하지 않음 — Q-24 확인), GOF·GeoSVR·GVGS 정독(자인·수치는 위키에), AREA3D·InstantSplat(위협 분류 종결). Expo-GS는 선택 유지

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
