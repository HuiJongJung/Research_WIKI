---
type: "concept"
slug: "gaussian-density-pseudo-sdf"
title: "Gaussian Density Pseudo-SDF (−2 log ḋ 거리화)"
status: "draft"
modified_at: "2026-07-28T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Expo-GS.pdf"
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Expo-GS.pdf"
tags:
  - "pseudo-sdf"
  - "gaussian-density"
  - "implicit-surface"
  - "log-density"
  - "mahalanobis"
  - "gaussian-splatting"
---

# Gaussian Density Pseudo-SDF (−2 log ḋ 거리화)

## Definition
Gaussian mixture density ḋ(p)의 음의 로그를 취해 거리형 스칼라장으로 읽는 표면 surrogate: `f(p) = ±s_g*·sqrt(−2 log ḋ(p))` (Expo-GS Eq.9). 국소 지배 Gaussian g* 가정 하에 −2 log ḋ가 Mahalanobis 이차형식이 되므로, 그 제곱근에 지배 Gaussian의 최소축 scale s_g*를 곱하면 유클리드 거리 근사가 된다. 부호는 지배 normal과의 내적으로 결정.

## Why It Matters
Gaussian 집합에서 별도 네트워크 없이 **미분가능한 SDF-like 장을 공짜로** 얻는다 — GSDF처럼 SDF 네트워크를 병렬로 두는 설계 대비 파라미터/학습 비용이 없고, splatting 표현과 항상 정합된다. 신뢰도 가중(분모의 E)을 density 정의에 끼워넣으면 SDF 자체가 신뢰도를 상속하는 것도 이 구성의 부수 이점.

## Where It Appears
- Expo-GS (ICML 2026): 노출 정규화 density → pseudo-SDF → supervision + density control. Appendix B에 성질 증명(양수·C∞·유계·단조).
- PulledGS (Zhang et al., NeurIPS 2024): zero-level set으로 Gaussian을 당기는 SDF 추론 — 인접 계열.
- [[gaussian-pivots-learnable-sdf]] (MILo): Gaussian pivot에 학습형 SDF 값을 부여하는 명시적 설계와 대비 — MILo는 SDF를 "배우고", 이 개념은 density에서 "읽는다".
- [[min-view-opacity-field-levelset]] (GOF): opacity field의 level-set 추출 — log 변환 없이 opacity를 직접 쓰는 이웃 개념.
- [[ray-gaussian-intersection-opacity]]: density/opacity 장 구성의 기반.

## Mechanisms
1. **지배 Gaussian 국소화**: 한 Gaussian이 지배하는 영역에서 −2 log ḋ ≈ (p−µ)ᵀΣ⁻¹(p−µ) + C. 상수 C(= −2 log α + 2 log(E+ε))는 gradient에 안 남는다.
2. **scale/normal은 해석 장치**: s_g*와 n_g*는 potential을 거리로 읽기 위한 국소 척도일 뿐, 구현은 ḋ에서 직접 미분 — hard argmax 선택을 통과하는 gradient가 없어 학습이 안정 (Expo-GS p.14 명시).
3. gradient 정렬: ∇ḋ ∝ Σ⁻¹(µ−p)로 지배 Gaussian의 normal과 정렬 → normal supervision(Eq.11)이 자연스럽게 걸린다.
4. 거리 하한: 대각 Σ에서 −2 log ḋ ≥ ‖p−µ‖²/s_min² — 최소축 기준의 보수적 거리.

## Failure Modes / Bias
- **지배 가정 붕괴**: 여러 Gaussian이 비슷한 기여를 하는 영역(교차부, 얇은 이중벽, 반투명)에서는 mixture의 log가 이차형식이 아니게 되어 거리 해석이 깨진다.
- true SDF가 아니다: eikonal 조건(‖∇f‖=1)이 성립하지 않으며, 표면에서 먼 곳의 값은 거리와 무관한 potential — zero-level 근방에서만 신뢰 가능.
- density 스케일 의존: opacity 정규화나 노출 분모가 바뀌면 zero-level 위치가 이동 — 상수 C가 level-set 위치를 흔든다(supervision으로 보정 필요).
- 밀도 희소 영역(under-densified 배경)에서는 ḋ→0으로 f가 폭주 — log의 수치 하한 처리 필요.

## Open Questions
- mixture 영역에서 soft 지배(가중 평균 Σ)로 확장하면 거리 해석이 얼마나 회복되는가?
- eikonal 정규화를 추가로 걸면 pseudo-SDF가 true SDF에 수렴하는가, 아니면 splatting 품질과 충돌하는가?
- MILo식 학습형 SDF와 이 읽기형 pseudo-SDF의 mesh 품질 정면 비교 — 어느 쪽이 under-constrained 영역에서 덜 무너지는가?
