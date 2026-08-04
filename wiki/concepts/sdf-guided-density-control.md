---
type: "concept"
slug: "sdf-guided-density-control"
title: "SDF-Guided Density Control (표면 조향 densify/prune)"
status: "draft"
modified_at: "2026-07-28T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Expo-GS.pdf"
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Expo-GS.pdf"
tags:
  - "densification"
  - "pruning"
  - "sdf"
  - "density-control"
  - "floater-suppression"
  - "gaussian-splatting"
---

# SDF-Guided Density Control (표면 조향 densify/prune)

## Definition
Gaussian densification/pruning 판정에 photometric gradient뿐 아니라 **SDF(또는 표면장)의 zero-level 근접도**를 넣는 설계. Expo-GS의 구체형: 성장 score `ε_g = ∇_g + ω_s·exp(−f²/2σ²) + ω_n·(1−‖∇f‖)` (표면 근처·안정 gradient 영역에 보너스), 제거 score `ε_p = σ_a − ω_p·(1−exp(−f²/2σ²))` (표면 이탈 페널티) (Eq.13-14).

## Why It Matters
3DGS 기본 densification은 photometric gradient 단독 기준이라, gradient가 죽는 영역(포화/저노출/저텍스처)에서는 성장하지 않고 gradient가 노이즈인 영역에서는 floater를 낳는다. 표면장을 조향 신호로 추가하면 **"어디에 primitive가 있어야 하는가"를 appearance와 독립적으로** 말할 수 있어, 노출 경계의 hallucinated 구조가 생성 단계에서 억제된다 (Expo-GS p.5).

## Where It Appears
- Expo-GS (ICML 2026): pseudo-Expo-SDF 조향 growth/pruning. 이 페이지의 출전.
- GSDF (Yu et al., NeurIPS 2024): SDF branch가 densification을 가이드하는 dual-branch 설계 — 직계 선행.
- [[confidence-steered-densification]] (CoMe): confidence 신호로 densify를 조향 — 신호가 SDF가 아니라 학습 confidence인 자매 개념.
- [[accumulated-perpixel-gradient-densification]]: 이 개념이 대체/보강하는 3DGS 기본 메커니즘.
- [[mesh-in-the-loop-differentiable-extraction]] (MILo): mesh를 학습 루프에 넣는 더 강한 형태의 기하 개입.

## Mechanisms
1. **성장의 이중 게이트**: 누적 gradient(신호가 있는 곳) ∧ zero-level 근접(표면인 곳)의 합산 — 표면 근처의 약한 gradient 영역도 성장 가능, 표면에서 먼 강한 gradient(=노이즈 의심)는 상대적으로 억제.
2. **‖∇f‖ 안정성 항**: gradient norm이 1에서 벗어난 영역(SDF가 불안정한 곳)의 성장을 눌러 uncertain 영역 update 억제.
3. **제거는 opacity−표면이탈의 차**: 누적 opacity가 높아도 표면에서 멀면 제거 대상 — "잘 보이는 floater"를 잡는 핵심.
4. 효과의 간접 증거: stage 3 진입 후 첫 1k iter만에 +4.5dB (Expo-GS Table 4) — SDF가 서 있으면 density 재배치가 즉효.

## Failure Modes / Bias
- SDF 품질에 종속: pseudo-SDF가 틀린 영역(얇은 구조, mixture 지배)에서는 옳은 Gaussian을 깎고 틀린 곳을 키우는 역효과 가능.
- 임계값 τ_g/τ_p·가중 ω들의 튜닝 민감도가 보고되지 않음 — 장면 유형이 바뀔 때의 강건성 미지.
- 표면 중심 편향: 의도적으로 volumetric 요소(안개, 반투명)를 표면으로 붕괴시키는 압력 — surface-first 설계의 공통 비용.
- zero-level 근접 보너스는 **이미 표면이 맞게 잡힌 곳을 강화**하는 방향 — 초기 표면이 틀린 under-constrained 영역에서는 오답을 굳힐 수 있음(자기강화).

## Open Questions
- SDF 조향과 confidence 조향([[confidence-steered-densification]])을 동시에 쓰면 상보적인가 중복인가?
- 관측 커버리지 기반 신뢰도장을 성장 score에 추가하면 배경 under-densification(CoMe 한계)을 직접 공격할 수 있는가?
- τ_g/τ_p를 장면 통계에서 자동 설정하는 원리적 방법은?
