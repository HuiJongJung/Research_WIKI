---
type: "concept"
slug: "material-uncertainty-auxiliary-splat-layers"
title: "Material and Uncertainty Auxiliary Splat Layers"
status: "draft"
modified_at: "2026-06-18T09:10:47.640411+00:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "discussion:2026-06-18-user-notes-2dgs-triangle-splatting"
  - "discussion:2026-06-18-sparse-topology-reframing"
  - "wiki/comparisons/geometry-prior-and-residual-layer-splatting.md"
  - "wiki/claims/adaptive-rank-primitive-splatting.md"
  - "wiki/claims/residual-guided-mesh-refinement-splatting.md"
  - "wiki/concepts/opaque-triangle-training-schedule.md"
  - "wiki/concepts/triangle-soup-differentiable-rendering.md"
tags:
  - "concept"
  - "hybrid-representation"
  - "auxiliary-layer"
  - "triangle-splatting"
  - "gaussian-splatting"
  - "uncertainty"
---

# Material and Uncertainty Auxiliary Splat Layers

## Definition

Material and uncertainty auxiliary splat layers는 main surface primitive가 잘 설명하는 stable opaque geometry와, 그렇지 않은 non-surface appearance 또는 geometry uncertainty를 분리하기 위한 보조 representation이다. 예를 들어 Triangle Splatting 계열에서는 triangle layer가 주요 opaque surface를 담당하고, transparent / fuzzy / specular / sparse-uncertain region만 Gaussian 또는 material-specific residual layer가 담당한다.

핵심은 Gaussian을 단순 photometric residual로 무제한 붙이는 것이 아니라, material evidence 또는 geometry uncertainty에 의해 제한된 보조 layer로 쓰는 것이다. 특히 sparse/background uncertainty layer는 missing geometry를 확정적으로 채우는 layer가 아니라, **triangle으로 확정하기 위험한 영역을 보류하고 evidence를 축적하는 temporary holder**로 보는 것이 더 정확하다.

## Why It Matters

Triangle, 2D Gaussian, mesh patch 같은 surface-friendly primitive는 plane, boundary, object surface에는 강하지만 다음 영역에는 약하다.

- transparent / refractive object
- foliage, hair, grass, smoke 같은 fuzzy 또는 volumetric structure
- specular highlight, reflection, view-dependent appearance
- sparse view, poor SfM, textureless background 같은 uncertain geometry

반대로 3D Gaussian은 이런 appearance residual을 잘 흡수하지만, 전체 scene을 다 먹으면 main surface primitive의 의미가 사라진다. Auxiliary layer 개념은 이 둘의 역할을 분리하기 위한 설계 언어다.

Sparse 영역에서는 이 구분이 특히 중요하다. Gaussian을 넣는다고 실제 surface topology가 자동으로 생기지는 않는다. 관측과 SfM evidence가 부족한 영역에서는 Gaussian을 `해결책`이 아니라 `보류 상태`로 두고, 충분한 view/depth/normal evidence가 모일 때만 triangle refinement나 topology repair로 승격해야 한다.

## Where It Appears

- Triangle Splatting 계열: triangle은 explicit surface primitive지만 triangle soup, semi-transparent training, non-opaque material 표현 문제가 남는다.
- Triangle Splatting+: opaque triangle output을 강화하지만 semi-connected topology, sparse background, transparent/specular/fuzzy residual은 별도 처리 질문으로 남는다.
- MeshGS 계열: tight splat과 loose splat을 나누지만, loose splat의 role이 material/failure-mode별로 충분히 명시되지 않을 수 있다.
- Adaptive Rank Primitive Splatting claim: surface-like, line-like, volume-like role을 region별 evidence에 따라 다르게 허용하려는 방향과 연결된다.
- Residual-Guided Mesh Refinement Splatting claim: uncertain region을 temporary Gaussian holder로 두고, 충분한 evidence가 있을 때만 topology repair로 승격하는 방향과 연결된다.

## Mechanisms

### Layer 구성

| Layer | 담당 영역 | 목적 |
| --- | --- | --- |
| Triangle or surface layer | stable opaque surface | surface fidelity, mesh/engine compatibility |
| Transparent Gaussian layer | glass, water, transparent plastic | transparency, refraction, reflection, alpha blending |
| Fuzzy Gaussian layer | foliage, hair, grass, smoke | density-like appearance, high-frequency fuzzy detail |
| Specular residual layer | metal, glossy highlight, view-dependent reflection | material appearance와 geometry 분리 |
| Background / uncertainty layer | sparse far-field, poor initialization region | triangle 확정 보류, uncertainty 표현, evidence accumulation |

### Rendering pass

```text
1. Opaque surface pass
   - triangle / 2D surface primitive
   - depth, normal, diffuse color

2. Transparent / fuzzy pass
   - non-opaque region만 Gaussian 또는 volumetric layer로 렌더링

3. Specular / residual pass
   - view-dependent highlight와 reflection 보완

4. Uncertainty pass
   - sparse / poor-SfM / low-view region을 temporary holder로 표현
   - 충분한 evidence가 생기기 전까지 opaque surface로 확정하지 않음

5. Composition
   - surface base image와 auxiliary pass를 합성
```

### Activation signal

Auxiliary layer는 다음 signal이 있을 때만 켜는 것이 좋다.

- high photometric residual with stable depth: appearance residual
- high depth/normal variance: geometry uncertainty
- high view-dependent residual: specular or transparent candidate
- segmentation/material cue: transparent or fuzzy material
- low visibility count: uncertain background or temporary Gaussian
- low contribution but low view coverage: pruning 보류 후보
- repeated residual with stable geometry evidence: topology repair 승격 후보

### Sparse uncertainty handling

Sparse region은 다음처럼 다룬다.

```text
sparse / uncertain region
-> surface evidence가 충분한가?
   -> yes: triangle refinement / topology repair candidate
   -> no: temporary Gaussian or auxiliary uncertainty layer
```

중요한 점은 high residual이 곧 mesh refinement target이라는 뜻이 아니라는 것이다. Residual이 material/view-dependent/fuzzy 원인일 수 있고, view coverage가 부족한 경우에는 triangle로 확정하면 잘못된 topology가 생길 수 있다.

## Failure Modes / Bias

- Auxiliary Gaussian이 너무 강하면 main surface layer가 학습되지 않는다.
- 단순 residual layer로 두면 "붙여서 때우는" engineering처럼 보일 수 있다.
- Material cue가 없으면 transparent, fuzzy, specular residual이 모두 한 layer에 섞여 해석 가능성이 떨어진다.
- Hard mask가 틀리면 필요한 residual을 막거나, 불필요한 Gaussian을 허용할 수 있다.
- PSNR만 최적화하면 surface fidelity와 editability가 희생될 수 있다.
- Sparse region을 Gaussian으로 덮기만 하면 topology repair 문제가 해결된 것처럼 착각할 수 있다.
- Evidence가 부족한 영역을 triangle로 빨리 승격하면 hallucinated surface나 bad connectivity가 생길 수 있다.

## Design Constraints

- Gaussian sparsity loss 또는 opacity regularization으로 residual capacity를 제한한다.
- Triangle-first 또는 surface-first rendering objective를 둔다.
- Surface layer에는 depth/normal consistency를 강하게 적용한다.
- Auxiliary layer에는 material-specific 또는 uncertainty-specific objective를 둔다.
- Responsibility competition으로 surface와 auxiliary layer가 같은 signal을 중복 설명하지 않게 한다.
- Uncertainty layer는 missing geometry를 확정적으로 채우지 않고, view coverage/depth variance/normal stability 같은 evidence를 기록한다.
- Triangle refinement로 승격하려면 stable geometry evidence가 필요하다.

## Open Questions

- Transparent, fuzzy, specular, uncertainty layer를 분리해야 하는가, 아니면 하나의 typed auxiliary layer로 충분한가?
- Residual activation을 hand-designed rule로 둘 것인가, differentiable gate로 학습할 것인가?
- Auxiliary layer가 final engine-ready representation에 남아도 되는가, 아니면 surface로 distill해야 하는가?
- Surface metric과 material-specific rendering metric을 어떻게 함께 평가할 것인가?
- Sparse uncertainty holder가 topology repair로 승격되는 기준은 무엇이어야 하는가?
- Uncertainty-aware pruning에서 view coverage threshold와 geometry confidence threshold는 어떻게 정할 것인가?
