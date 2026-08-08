---
type: "system"
slug: "my-tasks"
title: "본인 작업 목록"
status: "reviewed"
modified_at: "2026-08-09T03:30:00.000000+00:00"
author: "정휘종"
language: "ko"
confidence: "high"
sources:
  - "wiki/system/open-items.md"
tags:
  - "tasks"
  - "system"
---

# 본인 작업 목록 (이번 주)

> 사용자가 직접 수행하는 작업만 담는다. 전체 열린 항목은 `open-items.md`, 현재 연구 상태는 `research-status.md`에 있다.
>
> **이 문서는 현재분만 유지하며 덮어쓴다.** 변경 이력은 `progress-YYYY-MM-DD.md`가 담당한다.

기준일 2026-08-09. 의존 관계: 1 → 2 → 3 → 4 → 5 직렬, 6은 Q-09 도착 후 독립 병렬, 7은 상시.

---

## 1. SfM 마무리 (거의 완료)

- [ ] COLMAP 필터 최종 한 줄: min tri-angle이 **쌍 중 하나라도** 2도 통과인지 **모든 쌍**인지 (§4.4, p.6)
- [x] SfM이 실제로 쓰고 버리는 정보 파악 (포즈·점·색 사용 / 각도·track 폐기)
- [x] 쌍각 정의(Eq. 3)·임계 2도(실험적 선택)·track 정제(recursive RANSAC) 확인

## 2. Confidence 수식 재설계 (설계 문서 먼저)

- [ ] 세 가지 양의 분리 정의: **각 범위(pot_angle) / 각 분포(disp — 계산되나 분류 미사용) / 관측 중복도(n_views)**
- [ ] 관측 횟수 × 관측별 각도의 가중 결합 수식 확정 ("10도×15회 vs 150도×2회" 문제의 답)
- [ ] 임계값 근거 명시 (COLMAP 2도와 같은 관행 + 순위 주장이므로 절대값 아님)
- [ ] 사양서 1장으로 고정 → 구현은 실험 세션 (field_v0 → v1)

## 3. 활용처 설계 + 전체 구조도 [신규]

- [ ] **활용처 naive 설계 먼저**: 각 판별값이 파이프라인 어디로 흘러 무엇을 바꾸는지 표로 고정 — photometric 가중 / prior 주입(lever③) / densification 게이트·depth_reinit 필터(lever④) 중 어느 입구인지, 판별값별로
- [ ] **overview 구조도 1장**: MILo 기본 파이프라인 = 회색 네모, 본 연구 추가 = **파란 네모** 강조. 입력 → 파이프라인 개요 → 출력 흐름. MILo 원논문 파이프라인 그림 참고 (MILo에 없는 요소 덧붙이지 않기)
- [ ] **디테일 그림 1장**: SfM 산출물(포즈·점·track)에서 어떤 값을 뽑아 어떻게 3D 격자 confidence map이 되는지, 그리고 각 값이 어느 입구로 흘러가는지 화살표 끝까지
- [ ] 순서 규율: naive 설계 확정 → 그림. 그림이 안 그려지면 설계가 덜 확정된 것

색 규칙: 빨강 금지, 파랑 허용. 이 산출물은 발표 그림(피드백 B6)과 논문 Fig, 설계 문서를 겸한다.

## 4. 검증 게이트 2개 (GPU 전, 전부 CPU)

- [ ] **게이트 A**: 새 수식으로 H1/H2 판별력 재확인 — 기존 Spires CSV에 적용, within-band 비율 유지 여부
- [ ] **게이트 B**: 개입 경로 판정(D1) — A2 데이터에서 comp 변화량 vs 각도 연속 확인. 저각 구간 이득 없으면 lever③ 중단, 다른 개입 수단 검토

## 5. MILo 개입 런 (게이트 통과 시에만)

- [ ] 기존 씬(spires_cc)에서 새 field 차등 감독 런 → 밴드별 DEGEN 변화 확인
- [ ] 단서 규율: 단일 런·통계 전·균일 대조 전 명시. "개선" 단정은 A1>A0 그리고 A1>A2 충족 후에만

## 6. 통제 씬 예비판 (Q-09 결과 도착 후)

- [ ] Blender 씬 1개: 복잡 물체(hole 포함), 관측 호 폭 2조건(360도 vs 90도), GT mesh 확보
- [ ] MILo + SOTA 1개(2DGS 유력) 동일 씬 실행 → 호 폭별·물체별 비교
- [ ] "원거리 + 넓은 호" 대조 조건은 본판으로 이월

## 7. 지표 정리

- [ ] 관례 지표부터: Chamfer distance·F1 정의(τ 임계 포함) 정확히 적고 산출 스크립트 확정
- [ ] 자체 지표(밴드별 completeness)는 관례 지표 다음 순서
- [ ] 표기 규칙: 측정한 것과 표현 일치("mesh 결손" 금지), 절대값 타 논문 비교 금지
- [ ] Q-06(빈 영역 처리)·Q-08(mesh 자체 품질 지표) 결과 반영

## 병행 소품 (자투리)

- [ ] Expo-GS 훑기 30분 (균일 제약 유해 ablation 표 1개)
- [ ] 박사분께 용어 질문 (mesh 분야의 regularization/densification 대응어)

## 위임 중 (내 손 아님)

- 조사: Q-09 (SOTA 코드·데이터셋 표) → 6번의 입력
- 위키: Q-02/Q-04/Q-06 판정, 수식 사양서 초안(2번의 입력), 활용처 설계 초안(3번의 입력)
- 실험: 게이트 A·B 계산, field v1 구현, 관례 지표 스크립트

## 유보 목록과 해제 조건

| 항목 | 해제 조건 |
| --- | --- |
| G4Splat, Two-Stage, StreetSurf, Free360 | related work 집필 착수 시 |
| GaussianObject | 표적을 물체로 전환 확정 시 |
| FSGS, DNGaussian | sparse-view 구별 문단 집필 시 |
| reconstructability 2편, Mostegel, defocus | intro·계보 문단 집필 시 |
| TurboGS, LeGS, GSFixer, Motive, LASER | 개입 재설계 착수 시 |
