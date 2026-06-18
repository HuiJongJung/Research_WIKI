---
type: "claim"
slug: "residual-guided-mesh-refinement-splatting"
title: "Residual-Guided Mesh Refinement Splatting"
status: "draft"
modified_at: "2026-06-18T09:09:48.602788+00:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "discussion:2026-06-18-residual-guided-mesh-refinement-idea"
  - "discussion:2026-06-18-sparse-topology-reframing"
  - "wiki/comparisons/splatting-trends-2025h2-2026h1.md"
  - "wiki/comparisons/geometry-prior-and-residual-layer-splatting.md"
  - "wiki/claims/adaptive-rank-primitive-splatting.md"
  - "wiki/concepts/material-uncertainty-auxiliary-splat-layers.md"
  - "wiki/sources/triangle-splatting.md"
  - "wiki/sources/triangle-splatting-plus.md"
  - "https://arxiv.org/abs/2505.19175"
  - "https://arxiv.org/abs/2509.25122"
  - "https://arxiv.org/abs/2506.24096"
  - "https://openaccess.thecvf.com/content/ICCV2025/html/Gao_SurfaceSplat_Connecting_Surface_Reconstruction_and_Gaussian_Splatting_ICCV_2025_paper.html"
  - "https://openaccess.thecvf.com/content/ICCV2025/html/Zhou_MGSR_2D3D_Mutual-boosted_Gaussian_Splatting_for_High-fidelity_Surface_Reconstruction_under_ICCV_2025_paper.html"
tags:
  - "claim"
  - "gaussian-splatting"
  - "triangle-splatting"
  - "mesh-refinement"
  - "topology-repair"
  - "uncertainty-aware-pruning"
  - "hybrid-representation"
  - "simulation-ready"
---

# Residual-Guided Mesh Refinement Splatting

## Core Claim

단순한 `Triangle + Gaussian` hybrid로 rendering quality를 높이자는 claim은 약하다. 더 강한 claim은 **Triangle Splatting+가 목표로 하는 실사용 가능한 opaque triangle representation에서, 남는 실패 모드를 sparse/topology uncertainty로 진단하고, triangle로 확정해도 되는 영역과 확정하면 안 되는 영역을 구분하는 것**이다.

이 claim에서 Gaussian은 sparse 영역의 직접 해결책이 아니다. Gaussian은 **uncertain region을 임시로 보류하고 진단하는 holder/probe**다. 충분한 surface evidence가 쌓인 경우에만 triangle topology repair나 mesh refinement로 승격하고, 그렇지 않으면 auxiliary uncertainty/material layer로 남긴다.

```text
Not: Gaussian residual을 mesh refinement로 바로 승격한다.
But: sparse/uncertain residual을 분석해
     topology repair 대상,
     triangle로 확정하면 안 되는 영역,
     auxiliary로 남길 영역을 구분한다.
```

## Original Direction and Correction

초기 방향은 다음처럼 정리되어 있었다.

```text
Triangle-first로 학습하고,
Gaussian residual을 분석해,
geometry residual만 mesh refinement로 바꾼다.
```

이 방향에는 맞는 부분이 있지만, `Gaussian residual -> mesh refinement`가 너무 앞에 오면 Triangle Splatting+의 실제 남은 한계를 흐릴 수 있다. Triangle Splatting / Triangle Splatting+가 하고 싶은 것은 단순 photorealistic rendering이 아니라 **실제로 graphics pipeline에서 쓸 수 있는 representation**이다. 그런데 이를 말하기에는 두 한계가 남는다.

- topology가 아직 완전하지 않다.
- sparse / fuzzy / transparent / specular / uncertain 영역을 opaque triangle만으로 확정하기 어렵다.

따라서 이 claim의 중심은 residual conversion이 아니라 **확정 보류와 승격 판단**이어야 한다.

## Triangle Splatting+에서 남는 핵심 한계

### 1. Topology가 완전하지 않음

Triangle Splatting+는 shared vertex 기반 semi-connected triangle structure를 만든다. 하지만 최종 결과는 fully connected 또는 watertight mesh가 아니다.

- 초기 triangle 구조는 `SfM sparse point cloud -> 3D Delaunay triangulation`으로 만들어진다.
- 처음 어떤 세 점이 triangle이 될지는 Delaunay 결과가 정한다.
- 이후 학습 중 기존 triangle의 index triplet을 gradient descent로 직접 바꾸는 내용은 없다.
- 학습으로 continuous하게 바뀌는 것은 vertex position, color, opacity다.
- topology 변화는 pruning으로 triangle을 제거하거나 midpoint subdivision으로 triangle을 추가하는 discrete update에서 생긴다.
- densification 직후 새 triangle들은 parent triangle에서 나온 sibling triangle들과 연결되지만, parent가 고립되어 있으면 새 component도 전체 scene과 고립될 수 있다.
- pruning 이후에는 연결성이 다시 끊길 수 있다.

따라서 Triangle Splatting+의 topology는 `Delaunay initialization + pruning/subdivision lifecycle`에 크게 의존한다. 이 지점이 후속 연구의 직접 target이 될 수 있다.

### 2. Sparse 영역은 초기화와 pruning에서 증폭될 수 있음

Sparse 영역은 단순히 관측 부족 그 자체가 아니라, 관측 부족이 representation pipeline 안에서 증폭된 결과로 볼 수 있다.

```text
관측 부족 / parallax 부족 / feature 부족
-> SfM point cloud가 sparse해짐
-> Delaunay 초기 triangle coverage가 부족해짐
-> 해당 영역의 triangle이 적거나 부정확하게 시작함
-> pruning 과정에서 더 제거될 수 있음
-> 최종 opaque triangle 결과에서 geometry/fidelity가 낮아짐
```

즉 문제는 `initial SfM undercoverage + pruning-induced disappearance`다. Triangle Splatting+는 opaque output을 목표로 하므로 낮은 opacity나 낮은 contribution triangle을 오래 남기기 어렵다. sparse/uncertain region의 triangle은 충분한 evidence를 얻기 전에 제거될 수 있고, 반대로 억지로 남기면 artifact가 될 수 있다.

### 3. Gaussian은 sparse의 직접 해결책이 아님

Sparse region에 Gaussian을 넣는다고 geometry/topology가 자동으로 해결되지는 않는다.

- 관측 자체가 부족하면 Gaussian도 진짜 geometry를 알 수 없다.
- Gaussian은 appearance를 그럴듯하게 보완할 수 있지만, connected topology를 보장하지 않는다.
- fuzzy/specular/transparent residual은 triangle topology repair 대상이 아닐 수 있다.
- sparse region에서 필요한 것은 `채우기`보다 `확정 보류와 evidence accumulation`이다.

따라서 Gaussian은 final mesh를 대체하는 주 표현이 아니라 uncertainty/evidence accumulator로 제한하는 것이 더 설득력 있다.

## Proposed Pipeline

### Stage 1. Triangle-first optimization

먼저 triangle layer로 stable opaque surface를 학습한다.

- SfM + Delaunay 초기 구조에서 시작한다.
- triangle layer는 stable surface, hard boundary, collision/editing 가능한 geometry를 담당한다.
- Gaussian이 전체 scene을 먼저 먹지 않도록 초기에는 auxiliary capacity를 제한한다.
- surface layer의 성공 여부는 PSNR만이 아니라 depth/normal consistency, connectivity, editability, engine compatibility로 평가한다.

### Stage 2. Sparse/topology failure detection

학습 중 triangle layer가 취약한 영역을 찾는다.

감지 신호 후보:

- low view coverage
- high depth variance
- unstable normal
- long/skinny triangle
- isolated component
- repeated high residual near triangle boundary
- low blending weight but insufficient observation
- pruning candidate located in sparse SfM region

핵심은 high photometric residual 하나만으로 geometry failure라고 판단하지 않는 것이다.

### Stage 3. Uncertainty-aware pruning

Triangle Splatting+의 pruning을 그대로 적용하면 sparse region의 triangle이 너무 일찍 사라질 수 있다. 따라서 pruning 조건에 uncertainty를 넣는다.

```text
prune if:
  low contribution
  AND enough view coverage
  AND low geometry uncertainty
```

반대로 다음 경우에는 제거를 보류한다.

```text
defer pruning if:
  low contribution
  BUT low view coverage or high uncertainty
```

이 단계의 목적은 모든 triangle을 살리는 것이 아니라, **판단할 evidence가 부족한 triangle을 premature pruning하지 않는 것**이다.

### Stage 4. Temporary Gaussian holder

sparse/uncertain region에는 바로 opaque triangle을 추가하지 않고 temporary Gaussian 또는 auxiliary splat을 둔다.

- Gaussian은 최종 표현의 주인공이 아니라 uncertainty holder다.
- 관측 부족 영역을 그럴듯하게 덮는 것보다, 해당 영역이 왜 triangle로 확정되지 못하는지 기록한다.
- Gaussian에는 view coverage, depth/normal variance, covariance shape, view-dependence, residual stability를 같이 저장한다.
- 충분한 evidence가 생기면 triangle refinement 후보가 되고, 끝까지 부족하면 auxiliary uncertainty layer로 남긴다.

### Stage 5. Evidence-based triangle refinement or defer

sparse/uncertain residual을 모두 mesh로 바꾸지 않는다.

```text
sparse / uncertain region
-> surface evidence가 충분한가?
   -> yes: triangle refinement / topology repair
   -> no: temporary Gaussian or auxiliary uncertainty layer
```

가능한 action:

| residual type | evidence | action |
| --- | --- | --- |
| topology hole | stable depth/normal, enough view coverage, repeated boundary residual | new triangle patch or local remeshing |
| over-pruned sparse surface | low remaining coverage, consistent depth prior, nearby stable surface | restore/propose triangle, delayed pruning |
| bad connection | long skinny triangle, normal discontinuity, high boundary residual | edge flip/reconnect/remesh candidate |
| thin geometry | silhouette-consistent residual, elongated support | small triangle strip or line-like support |
| fuzzy/transparent/specular | unstable normal, view-dependent residual, alpha-like accumulation | auxiliary Gaussian/material layer, do not force mesh |
| insufficient evidence | low visibility, high depth variance | keep as uncertainty, defer conversion |

## Possible Objective

대략 다음 구조를 생각할 수 있다.

```text
L = L_render(T, G_tmp)
  + lambda_geo * L_geometry(T)
  + lambda_topo * L_topology_health(T)
  + lambda_unc * L_uncertainty_calibration(G_tmp)
  + lambda_resp * L_responsibility(T, G_tmp)
  + lambda_promote * L_evidence_based_promotion(G_tmp -> T)
  + lambda_sparse * |G_tmp|
```

중요한 제약:

- Gaussian temporary holder가 전체 scene을 먹지 못하게 sparsity/complexity penalty를 둔다.
- high residual만으로 triangle refinement를 수행하지 않는다.
- view-dependent/material residual은 promotion target에서 제외한다.
- view coverage가 부족한 영역은 pruning과 promotion을 모두 보류할 수 있어야 한다.
- topology repair는 geometry evidence가 충분한 경우에만 허용한다.

## Evaluation Ideas

Rendering score만으로는 부족하다.

- PSNR/SSIM/LPIPS: visual quality.
- mesh Chamfer/normal consistency: geometry quality.
- connected component count, isolated triangle ratio: topology health.
- sparse-region coverage before/after pruning: pruning-induced disappearance 확인.
- uncertainty calibration: 보류된 영역이 실제 low-view/high-variance region인지 확인.
- promotion precision: triangle로 승격한 residual이 실제 geometry improvement를 만들었는지.
- non-geometric residual preservation: specular/transparent/fuzzy 영역을 mesh로 오염시키지 않았는지.
- engine/simulation readiness: collision mesh 가능성, export 가능성, renderer FPS.

## Novelty Positioning

```text
Not: Triangle + Gaussian hybrid improves rendering quality.
Not: Gaussian residual을 mesh refinement로 바로 바꾼다.
But: sparse/topology uncertainty를 진단하고,
     충분한 evidence가 있는 경우에만 topology repair로 승격한다.
```

차별화 포인트:

- Triangle Splatting+의 semi-connected topology 한계를 직접 target한다.
- Sparse 영역을 GS로 덮는 것이 아니라, 확정 보류와 evidence accumulation 문제로 다룬다.
- Gaussian은 final fudge layer가 아니라 temporary holder/probe다.
- 모든 residual을 mesh로 바꾸지 않고 topology/material/uncertainty를 분리한다.
- 최종 goal은 visual quality만이 아니라 mesh-based usability다.

## Immediate Research Questions

- Sparse 영역에서 triangle이 부족한 원인이 initial SfM undercoverage인지 pruning-induced disappearance인지 어떻게 구분할 것인가?
- Uncertainty-aware pruning의 view coverage threshold는 어떻게 정할 것인가?
- Temporary Gaussian holder가 전체 scene을 먹지 않도록 어떤 responsibility competition을 둘 것인가?
- 어떤 evidence가 충분할 때 topology repair로 승격할 것인가?
- Local remeshing, edge flip, triangle restoration, midpoint subdivision 중 어떤 action을 언제 선택할 것인가?
- Sparse far-field처럼 evidence가 끝까지 부족한 영역은 final representation에서 어떻게 남길 것인가?

## Related WIKI Pages

- [[splatting-trends-2025h2-2026h1]]
- [[geometry-prior-and-residual-layer-splatting]]
- [[adaptive-rank-primitive-splatting]]
- [[material-uncertainty-auxiliary-splat-layers]]
- [[shared-vertex-triangle-splatting]]
- [[mesh-compatible-radiance-field]]
- [[triangle-splatting-plus]]
