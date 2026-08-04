---
type: "concept"
slug: "rendered-depth-normal-supervision"
title: "Rendered Depth/Normal Map Supervision"
status: "draft"
modified_at: "2026-07-13T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\GOF_Gaussian Opacity Fields - Efficient Adaptive Surface Reconstruction in Unbounded Scenes.pdf"
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\MILo.pdf"
tags:
  - "rendered-depth-map"
  - "rendered-normal-map"
  - "self-supervision"
  - "normal-consistency"
  - "surface-regularization"
  - "3d-gaussian-splatting"
---

# Rendered Depth/Normal Map Supervision

## Definition
학습된 3D Gaussian(또는 유사 primitive)을 특정 view로 렌더할 때, 색(RGB)뿐 아니라 **깊이(depth)** 도 alpha blending으로 뽑아 pixel별 depth map을 만들고, 그 depth map의 공간적 기울기(gradient)로 **normal map** 을 유도하는 방식. 2DGS·GOF·MILo 등 GS 기반 surface reconstruction에서 geometry regularization(특히 depth-normal consistency)의 supervision 신호로 표준적으로 쓰인다. GT depth/normal이 아니라 **모델 자신의 렌더 결과**라는 점이 핵심 성격이다.

## Why It Matters
GS는 photometric loss만으로는 표면이 underconstrained라 noisy하다. 여기에 "표면 방향이 일관되어야 한다"는 normal consistency 같은 규제를 걸려면 **기준이 되는 표면 방향(normal)** 이 필요한데, GT가 없으니 렌더 결과에서 self-supervised로 만들어낸다. rendered depth/normal은 별도 센서·GT 없이 multi-view 이미지만으로 geometry를 정리할 수 있게 해주는 저비용 도구라, GS surface 계열 대부분이 의존한다. 동시에 이 신호의 신뢰도가 **관측량·표면 종류에 좌우**되기 때문에, 그 한계를 아는 것이 저관측/반투명 영역 품질 문제의 출발점이 된다. [[photometric-primary-geometry-underconstraint]]와 직접 연결된다.

## Where It Appears
- **GOF** (§3.3, Eq. 12): GS normal(ray-Gaussian intersection 접평면)을 depth map gradient normal `N`과 맞추는 `L_n = Σ ω_i (1 − n_iᵀN)`. depth distortion과 함께 2DGS에서 확장. (p.4-5)
- **2DGS** (Huang et al. 2024): rendered depth의 gradient로 normal을 만들어 2D Gaussian normal과 맞추는 원조 depth-normal consistency. GOF·MILo가 계승.
- **MILo**: Gaussian rendering의 depth/normal과 mesh rasterization의 depth/normal을 서로·GT와 비교하는 consistency loss에 사용. ([[mesh-in-the-loop-differentiable-extraction]])
- 일반적으로 GS surface 논문에서 "rendered depth/normal", "expected/median depth", "depth-normal consistency" 표현으로 등장.

## Mechanisms
- **Depth map**: 한 pixel에 걸친 GS들의 깊이 `t_k`를 blending weight `ω_k = α_k · Π_{j<k}(1−α_j)` 로 가중평균 → `depth(pixel) = Σ_k ω_k t_k`. RGB 렌더(`Σ ω_k c_k`)와 같은 alpha compositing, 재료만 색→깊이. 모든 pixel에 대해 계산하면 그 view의 depth map.
  - weight 구조상 앞이 불투명하면 뒤 GS가 죽어, 불투명 표면에서는 가중평균이 "거의 앞면 깊이"로 수렴.
  - 변형: expected depth(mean) 대신 median depth(누적 weight가 0.5를 넘는 첫 GS)를 쓰기도 함.
- **Normal map**: depth map을 x·y로 미분해 깊이 기울기를 구하고, 이웃 pixel의 복원 3D 점들이 이루는 국소 평면의 수직 방향을 normal로 사용. "주변과의 depth 차이 = 표면이 기운 정도".
- **사용**: 이 normal map `N`을 primitive 자신의 normal `n`과 정렬(consistency loss)해, 개별 primitive가 이웃과 이루는 실제 표면 방향에 맞춰지도록 유도.
- **view 의존**: depth/normal map은 (primitive, view) 쌍의 함수라 view마다 새로 렌더. 저장된 고정 이미지가 아님.

## Failure Modes / Bias
- **순환 논리(self-supervision)**: 기준 normal이 GT가 아니라 모델 자신의 렌더 결과. 이미 틀린 표면을 만들면 틀린 normal에 서로 수렴할 수 있어, photometric loss가 GT 앵커로 함께 필요.
- **미분 증폭**: normal = depth의 gradient라 depth의 noise·불연속을 증폭. 물체 경계(depth 급변)에서 기울기가 폭발해 가짜 normal, 얇은 구조·텍스처 경계에서 지저분.
- **반투명/경계 애매**: depth가 가중평균이라 앞·뒤 표면 weight가 섞이면 "어느 표면도 아닌 허공"을 가리킴. 유리·나뭇잎 경계·머리카락에서 depth·normal 붕괴.
- **view-dependent 불일치**: view마다 값이 달라 multi-view inconsistency 시 표면 불안정.
- **저관측에서 신뢰 불가**: 관측 view가 적은 영역은 depth부터 noisy → normal도 noisy → regularization이 오히려 잘못된 방향으로 유도. 배경/희소 관측 영역 품질 저하의 근원.

## Open Questions
- rendered depth/normal 신호의 신뢰도를 관측량·multi-view 일치도로 정량화해, 저관측 영역에서 규제를 끄거나 약화할 수 있는가? (confidence-guided supervision, 배경 mesh 붕괴 문제와 접점)
- self-supervised depth/normal 대신(또는 함께) monocular normal prior 등 외부 신호를 언제 섞는 게 유리한가?
- median vs mean depth, depth-gradient normal vs primitive normal 직접 blending 중 어떤 조합이 경계·반투명에서 덜 망가지는가?
- rendered depth/normal의 view-inconsistency를 explicit하게 penalize하면 표면 안정성이 개선되는가?
