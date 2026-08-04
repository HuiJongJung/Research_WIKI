---
type: "concept"
slug: "learned-confidence-photometric-geometric-balancing"
title: "Learned Confidence Balancing of Photometric and Geometric Loss"
status: "draft"
modified_at: "2026-07-14T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\CoMe - Confidence-Based Mesh Extraction from 3D Gaussians.pdf"
tags:
  - "confidence"
  - "self-supervised"
  - "photometric-loss"
  - "geometric-loss"
  - "uncertainty"
  - "gaussian-splatting"
---

# Learned Confidence Balancing of Photometric and Geometric Loss

## Definition
primitive마다 학습되는 스칼라 confidence를 두고, 이를 렌더(alpha-blending)해 얻은 픽셀별 confidence map `Ĉ`로 **photometric loss만** 재가중하는 self-supervised 기법. 손실은 `ℒ_conf = ℒ_rgb·Ĉ − β·logĈ` 형태로, `Ĉ<1`이면 photometric 잔차를 불확실성으로 교환하고 `−β·logĈ`가 confidence를 무작정 낮추지 못하게 막는다. geometric loss는 재가중 대상이 아니므로 `Ĉ`가 photometric↔geometric supervision의 **동적 균형자**가 된다.

## Why It Matters
3DGS 표면 추출의 핵심 난제는 view-dependent 외관이 강한 영역에서 photometric loss가 geometry를 왜곡한다는 점이다. 모든 픽셀을 동일 가중으로 photometric 감독하면, 어려운 영역이 optimization을 지배한다. 학습 confidence는 "어디서 photometric을 믿을지"를 데이터로부터 스스로 정해, multi-view constraint·monocular prior·mesh-in-the-loop 같은 무거운 장치 없이 ambiguity를 완화한다. aleatoric uncertainty(Kendall&Gal)·feed-forward confidence(DUSt3R) 계보를 3DGS mesh 추출로 옮긴 사례.

## Where It Appears
- **CoMe**(2603.24725): `ℒ_conf = ℒ_rgb·Ĉ − β·logĈ`(Eq.9), per-primitive γ̃_i=exp(γ_i)를 alpha-blending(Eq.11). β=0.075가 유일 핵심 하이퍼파라미터. → [[come-confidence-based-mesh-extraction]]
- 인접: UA-GS·VCR-GauS는 confidence로 "독립 예측 pseudonormal"의 영향을 균형(CoMe는 pretrained 없이 photometric↔geometric).
- 계보: aleatoric uncertainty weighting(Kendall&Gal NeurIPS'17), feed-forward confidence(DUSt3R).

## Mechanisms
- **양수화·초기화**: γ_i(init 0) → γ̃_i=exp(γ_i)(init 1)이라 시작 시 `ℒ_conf=ℒ_rgb`.
- **균형 최적점**: `∂ℒ_conf/∂Ĉ = ℒ_rgb − β/Ĉ = 0 → Ĉ*=β/ℒ_rgb`. 잔차 큰 곳에서 confidence가 낮아진다(잔차-구동).
- **선택적 재가중**: photometric 항만 곱하고 geometric 항은 불변 → 어려운 영역에서 photometric을 "양보"하되 geometric 제약은 유지.
- **안정화**: Ĉ를 [0.001, 5.0]로 clamp, blending 가중 w_i는 detach(confidence gradient가 opacity를 흔들지 않게).

## Failure Modes / Bias
- **잔차-구동의 사각지대(핵심)**: `Ĉ*=β/ℒ_rgb`이므로, **photometric 잔차가 실제로 발생하는 곳에서만** 저신뢰가 뜬다. 관측이 부족해도 색·opacity로 오차를 흡수해(photometric shortcut) 저잔차에 도달한 under-constrained 영역은 저신뢰로 잡히지 않는다 → 관측 부족(epistemic)에 원리적 blind spot. 이 confidence는 "a posteriori(학습된)" 신호이지 "a priori(관측 기하)" 신호가 아니다. → [[photometric-primary-geometry-underconstraint]]
- β 민감: β=0이면 Ĉ↑ 유인 없어 under-reconstruction, β 과대면 penalty가 과해 over-densification(CoMe Fig.7).
- confidence가 loss 크기를 바꿔 densification gradient 통계를 교란 → 별도 보정 필요. → [[confidence-steered-densification]]

## Open Questions
- 잔차-구동 confidence가 "관측 부족하지만 잔차 낮은" 영역을 얼마나 놓치는가? (관측 기하 기반 사전 신호와의 gating 비교로 실측 가능)
- photometric 항만이 아니라 geometric 항에도 확장한 confidence가 유효한가?
- 이 confidence를 densification·pruning의 유일 손잡이로 삼는 heuristic-free 3DGS가 일반적으로 성립하는가?
