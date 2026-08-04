---
type: "concept"
slug: "confidence-steered-densification"
title: "Confidence-Steered Densification"
status: "draft"
modified_at: "2026-07-14T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\CoMe - Confidence-Based Mesh Extraction from 3D Gaussians.pdf"
tags:
  - "densification"
  - "confidence"
  - "over-densification"
  - "gaussian-splatting"
  - "optimization-control"
---

# Confidence-Steered Densification

## Definition
per-primitive confidence를 densification 임계값에 직접 결합해, **저신뢰(어려운) 영역의 Gaussian 분열을 억제**하는 densification 제어 기법. CoMe는 positional gradient 임계값을 confidence로 나눈다: `τ̄_grad = τ_grad / min(γ̃_i, 1)`. 저신뢰(γ̃_i<1)면 임계값이 상승해 분열이 어려워지고, 고신뢰는 min으로 1에서 clamp돼 과분열되지 않는다.

## Why It Matters
gradient 크기 기반 densification(clone/split)은 view-dependent 외관이 강한 어려운 영역에서 큰 gradient를 유발해 **over-densification**(작은 Gaussian이 반복 복제)을 일으킨다. 이 과밀 영역이 바로 3DGS가 "geometry로 view-dependent 외관을 위조"하기 쉬운 곳이다. densification을 loss가 아니라 **최적화 절차 수준에서** 제어하면, 잘못된 해가 표현되는 것을 loss 싸움 이전에 차단할 수 있다(prevention > correction). confidence 재가중이 loss 크기 자체를 바꾸므로, densification 보정은 confidence 프레임워크의 필수 짝이기도 하다.

## Where It Appears
- **CoMe**(2603.24725): `τ̄_grad = τ_grad / min(γ̃_i, 1)`(Eq.12). 끄면 primitive 20%↑, F1 소폭 하락(Table 5). ℒ_conf를 iter 500(densification 시작)부터 활성화. → [[come-confidence-based-mesh-extraction]]
- 기반: gradient-누적 densification(3DGS, AbsGS, GOF). → [[accumulated-perpixel-gradient-densification]]
- 대비: Expo-GS는 노출 메타데이터 confidence로 densification gate(신호 출처가 다름).

## Mechanisms

**발동 조건 (기반 3DGS densification)**: Gaussian마다 **화면공간(2D) 위치 gradient의 norm**을 누적하고 **관측된 횟수로 나눈 평균**이 τ_grad를 넘으면 발동. 동작만 크기로 갈린다 — **작으면 clone, 크면 split**. (주의: 표준 3DGS는 gradient를 *벡터합*한 뒤 norm을 취하므로 반대 방향 gradient가 **상쇄**된다. AbsGS[68]가 절댓값 누적으로 이를 교정했고, CoMe는 [68,72] 계열 위에 있다. → [[accumulated-perpixel-gradient-densification]])

**핵심은 오진(misdiagnosis)**: 규칙의 설계 의도는 "gradient가 크다 = 여러 view가 서로 다른 방향으로 당긴다 = **해상도가 부족하다**"였다. 그러나 SH 표현 한계 영역에서 gradient가 큰 이유는 **"만족 불가능"**이지 해상도 부족이 아니다. 규칙은 둘을 구분하지 못하고 용량을 계속 붓는다 — 원인(SH 저주파 한계)이 안 없어지니 끝나지 않는다. **재료가 유입되는 것이 아니라, 오진의 산물이 곧 위조 재료**다. → [[geometry-faked-view-dependent-appearance]]

**발동 구역 (씬 타입 의존)**: 트리거는 재질이 아니라 **"잔차/gradient가 안 죽는 곳"**이다.
| 구역 | gradient | over-densification |
| --- | --- | --- |
| 고주파 view-dependent (specular·반사) | 영원히 큼 (SH로 표현 불가) | **발동** ← 논문 §3.3의 직접 서술 |
| foliage·복잡 배경 | 안 죽음 (view마다 다르게 보임) | **발동** (Fig.12: 실외 4.38M→2.58M) |
| textureless | **작음** (어떤 깊이든 잔차 ≈ 0) | **발동 안 함** — 다른 병(ambiguity from lack of texture) |
※ intro는 "difficult-to-reconstruct regions"로 더 넓게 쓰지만, §3.3의 명시적 귀속은 고주파 view-dependent다.

- **임계값 스케일링**: 신뢰도가 낮을수록 분열에 필요한 gradient 문턱이 높아진다(억제). 고신뢰는 baseline τ_grad 유지.
- **clamp의 역할**: min(γ̃_i, 1)로 고신뢰(γ̃_i>1)가 임계값을 낮춰 과분열하는 것을 막음 — "잘 된 곳"을 더 densify하지 않음.
- **타이밍**: densification 구간 초입에 confidence 학습을 함께 켜야 primitive count가 baseline 수준으로 수렴(늦게 켜면 이미 과밀).
- **효과 — 품질 장치가 아니라 크기 장치(주의)**: Table 5에서 조향을 끄면 F1 0.521→**0.516**(+0.005는 노이즈 수준), primitive 1.27M→**1.53M(+20%)**. 논문도 *"slightly lower F1-score with a 20% increase in primitive count"*라고 씀. 즉 이 조각의 실측 효과는 **모델 크기 절감**이며 F1 기여는 미미하다 — "densification 조향으로 성능이 올랐다"는 서술은 과장이다. baseline SOF 대비로는 primitive ~6% 적게 쓰면서 F1 상회.

## Failure Modes / Bias
- confidence가 잔차-구동이라, "관측 부족하지만 잔차 낮은" 영역은 저신뢰로 안 잡혀 densification 억제 대상에서 누락될 수 있다(신호 자체의 blind spot을 그대로 승계). → [[learned-confidence-photometric-geometric-balancing]]
- 억제만 있고 "필요한 곳에 더 densify"하는 능동 배분은 없음 — distant background의 insufficient densification은 이 방식으로 해결되지 않는다(CoMe §5 자인).
- ℒ_conf가 음수/큰 값이 되면 gradient 통계가 요동 → clamp·detach 등 수치 안정 장치에 의존.

## Open Questions
- densification "억제"를 넘어 관측 기하 기반으로 "어디를 더 densify할지"를 사전에 배분하는 gating은 가능한가?
- 이진(억제/허용)이 아니라 연속 등급 densification 예산 배분이 severe under-constrained에서 이득이 있는가?
- confidence penalty β를 mesh 품질↔primitive 수의 유일 손잡이로 쓰는 heuristic-free densification의 일반화 범위는?
