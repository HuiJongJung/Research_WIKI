---
type: "system"
slug: "my-tasks"
title: "본인 작업 목록"
status: "reviewed"
modified_at: "2026-08-09T12:00:00.000000+00:00"
author: "정휘종"
language: "ko"
confidence: "high"
sources:
  - "wiki/system/open-items.md"
tags:
  - "tasks"
  - "system"
---

# 본인 작업 목록

> 사용자가 직접 수행하는 작업만 담는다. 전체 열린 항목은 `open-items.md`, 현재 상태는 `research-status.md`.
> **현재분만 유지하며 덮어쓴다.** 이력은 `progress-YYYY-MM-DD.md`.

기준일 2026-08-09 (판정 14건 반영판)

---

## 완료된 것 (이번 주)

- ~~COLMAP 원전~~ 정독 완료 + 코드 확인 완료. 채널 출처 명세는 research-status 4절
- ~~confidence 수식 재설계~~ 종결. κ 유도·구현·검증 후 실측에서 기각, pot_angle 유지. 패배는 ambiguity-limited의 증거로 전환
- ~~활용처 설계~~ 확정. lever⑤(정규화 차등) 주력 + ④′(clone만 억제). 사양서 §6

## 1. 구조도 2장 [최우선 — novelty의 본체]

재료는 전부 확정됨. 사양서(`design_log/2026-08-09_kappa-field-spec.md`) §6이 설계도다.

- [ ] **overview**: MILo 파이프라인 회색 네모 + 본 연구 추가분 파란 네모. 입력 → 파이프라인 개요 → 출력. MILo에 없는 요소 덧붙이지 않기
- [ ] **디테일**: SfM 산출물(포즈·점)에서 어떤 값을 뽑아 field가 되고, 각 값이 어디로 흘러가는지 화살표 끝까지 — pot_angle 기반 conf → ⓐ mesh/normal 정규화 가중(lever⑤) ⓑ clone 게이트·depth_reinit 필터(lever④′). 전달 방식 구분: 픽셀 단위 = conf 렌더 맵, 프리미티브 단위 = field 직접 조회

주의: "field를 만들었다"는 기여가 아니다(AREA3D 선점). **이 그림이 보여주는 "어디에 어떻게 넣는가"가 기여다.** 발표 그림(피드백 B6)과 논문 Fig 겸용. 빨강 금지, 파랑 강조.

## 2. Expo-GS 훑기 (30분)

- [ ] ablation 표 수집 (균일 제약 유해: 41.38에서 36.59)

E4-reg의 "균일 제약 유해" 독립 선례로 직행.

## 3. 박사분께 용어 확인

- [ ] mesh 분야에서 regularization, densification 대신 쓰는 용어

## 4. 설명 파일 통독 (10분)

- [ ] `연구방향 발표\confidence_설계_설명_260809.md` 최종판. 특히 5절의 교수 질문 답 두 개를 본인 입으로 말할 수 있는지 확인

## 선택 (마감 없음)

- Blender 본판 씬 제작 병행 (hole·파이프·원거리+넓은 호. 예비판이 DTU로 바뀌어 급하지 않음)
- 주간 보고 정리 (필요 시 위키 세션에 브리프 요청)

---

## 위임 현황 (본인 작업 아님)

### 실험 세션 (지시 완료, 회신 대기)

1. lever⑤·④′ 구현 → E4-reg 예비 (GPU 1순위)
2. C7 예비판: DTU 부분호, 씬 기준 3개로 2씬 선택, MILo+2DGS+AmbiSuR, 초기화 통일 (GPU 2순위 병렬)
3. CPU 병행: C6 판별값 비교표(8행), D1 개입 경로 판정(리마인드)
4. E2-local: 승인됨, 실행은 1·2 뒤

### 조사 세션

- Q-11 (track 길이·재투영 오차 감독 가중 선례) 대기
- Q-09 잔여 자투리 3건 (PipeForge3D, Thingi10K 라이선스, GW 평가 스크립트) — 본판 시점

### 위키 세션

- 실험 회신 판정 대기. 다음 큰 판정 = E4-reg 결과(판독 규칙 사전 등록됨), C7 예비판 결과(AmbiSuR 거동)

## 유보 목록과 해제 조건

| 항목 | 해제 조건 |
| --- | --- |
| G4Splat, Two-Stage, StreetSurf, Free360 | related work 집필 착수 시 |
| GaussianObject | 표적을 물체로 전환 확정 시 |
| FSGS, DNGaussian | sparse-view 구별 문단 집필 시 |
| reconstructability 2편, Mostegel, defocus | intro·계보 문단 집필 시 |
| TurboGS, LeGS, GSFixer, Motive, LASER, **NBV view-sampling** | 개입 재설계 착수 시 (E4-reg 판정 후) |
