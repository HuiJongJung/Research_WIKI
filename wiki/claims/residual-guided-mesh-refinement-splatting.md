---
type: "claim"
slug: "residual-guided-mesh-refinement-splatting"
title: "Residual-Guided Mesh Refinement Splatting"
status: "draft"
modified_at: "2026-07-01T19:40:00+09:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "discussion:2026-06-18-residual-guided-mesh-refinement-idea"
  - "discussion:2026-06-18-sparse-topology-reframing"
  - "discussion:2026-06-18-seminar-reframing-gs-triangle-usability"
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

## Seminar Motivation: From Rendering Quality to Usable Geometry

이 아이디어의 출발점은 단순한 `GS + triangle primitive` hybrid였다.

```text
초기 목표:
Triangle + GS를 섞어서 scene rendering quality를 높이자.
```

하지만 Triangle Splatting, Triangle Splatting+, MILo, SurfaceSplat, MGSR 같은 흐름을 읽으면서 문제의 중심이 바뀌었다. 최근 splatting / NeRF / GS 계열에서 중요한 질문은 더 이상 "얼마나 보기 좋은가"만이 아니라, **그 결과물을 downstream에서 실제로 쓸 수 있는가**다.

3DGS는 photorealistic rendering에는 강하지만 surface, normal, topology, collision, editability가 불명확하다. 반대로 triangle primitive는 normal과 surface가 명확하고 기존 graphics pipeline과 잘 맞지만, pure triangle optimization만으로 fuzzy/specular/transparent/thin/uncertain region까지 모두 설명하려 하면 quality와 topology가 흔들릴 수 있다.

따라서 현재 방향은 다음처럼 정리된다.

```text
Not: GS + Triangle로 rendering quality만 높이자.
But: 최종 representation은 downstream을 위해 mesh/triangle 기반으로 만들고,
     optimization 과정에서는 GS를 residual probe로 사용해
     triangle mesh의 실패 지점을 찾고 고치자.
```

## Link to Existing Claims

이 claim은 기존 WIKI claim들과 다음 관계를 가진다.

- [[adaptive-rank-primitive-splatting]]은 point/line/surface/volume-like primitive를 region별로 적응적으로 쓰자는 더 넓은 representation claim이다.
- [[geometry-prior-and-residual-layer-splatting]]은 2DGS, SuGaR, MeshGS, Effective Rank GS, Triangle Splatting 계열의 geometry prior와 residual 처리 방식을 비교한다.
- [[splatting-trends-2025h2-2026h1]]은 최근 분야 흐름이 rendering quality 중심에서 mesh/material/physics-compatible representation 중심으로 이동하고 있음을 정리한다.
- 이 페이지는 그 흐름을 좁혀서, **Triangle Splatting+의 topology/initialization/pruning 한계를 GS residual과 uncertainty-aware mesh refinement로 다루는 구체적 연구 claim**으로 만든다.

즉 전체 흐름은 다음과 같다.

```text
GS + Triangle로 더 잘 렌더링하고 싶음
-> 최신 흐름을 보니 usable geometry가 더 중요함
-> Triangle Splatting은 mesh-compatible해서 유망함
-> 하지만 connectivity, SfM initialization, pruning, pure triangle optimization 한계가 남음
-> GS를 final visual fudge가 아니라 residual/uncertainty probe로 사용
-> geometry evidence가 충분한 residual만 triangle topology repair/refinement로 승격
-> 최종적으로 mesh-based usable representation 지향
```

## Research Directions Around This Claim

### A. Initialization Improvement

Triangle Splatting 계열이 SfM point cloud와 Delaunay initialization에 민감하다면, 초기 triangle을 더 믿을 만하게 만드는 것 자체가 연구 방향이 된다.

- SfM point confidence filtering
- 2DGS/3DGS를 이용한 surface evidence pre-estimation
- monocular depth/normal prior를 이용한 sparse region 보강
- visibility consistency가 높은 영역부터 triangle 생성
- uncertain region은 triangle 생성을 미루고 temporary Gaussian holder로 보류

핵심 질문:

```text
어떤 point/region이 triangle initialization에 충분히 믿을 만한가?
```

### B. Mesh Connectivity and Topology Repair

Triangle primitive가 잘 렌더링되어도 connected/watertight/editable mesh가 되지는 않는다. 따라서 triangle soup 또는 semi-connected mesh를 더 usable한 mesh로 유도하는 방향이 필요하다.

- shared vertex consistency
- local stitching
- edge flip / reconnect
- local remeshing
- hole filling
- isolated component pruning or repair
- triangle density control

핵심 질문:

```text
렌더링이 잘 되는 triangle set을 어떻게 downstream에서 쓸 수 있는 mesh로 만들 것인가?
```

### C. GS as Residual Probe During Optimization

최종 결과가 mesh/triangle 기반이면, 학습 과정에서 GS를 쓰는 것은 금지할 필요가 없다. 오히려 GS는 triangle이 설명하지 못하는 residual을 부드럽게 흡수하고, 실패 위치를 알려주는 probe가 될 수 있다.

```text
1. Triangle으로 기본 surface 최적화
2. Triangle이 못 설명하는 영역에 GS residual 투입
3. residual을 geometry / material / uncertainty로 분류
4. geometry residual만 mesh refinement로 승격
5. material/transparent/fuzzy residual은 auxiliary layer로 남기거나 mesh conversion에서 제외
```

핵심 질문:

```text
이 residual Gaussian은 진짜 geometry인가,
아니면 appearance/material/uncertainty인가?
```

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

## 방향 재검토 (2026-07-01)

Triangle Splatting+ 결과 mesh를 직접 Blender에서 열어 확인하고, 논문의 connectivity 서술을 다시 읽은 뒤 방향을 재점검했다.

### 경험적 확인 — triangle soup

- Blender(Solid shading)로 열어본 결과, 전경 오브젝트는 알아볼 수 있으나 바닥/배경은 **떨어진 삼각형 파편의 밭**이었다. "semi-connected"라 부르기도 후한 수준.
- 논문 본문 수치가 이를 뒷받침한다(저자 인용):
  > "the optimization process does not strictly enforce full connectivity. Mainly because of pruning, connectivity is only partially preserved. On average, each vertex is connected to 1.5 triangles. Overall, 80% of the triangles are connected to at least one other triangle, with some triangles connected to as many as six."
- 해석: vertex당 평균 **1.5 triangle**(정상 fan은 ~6), **20%는 완전 고립**, 나머지도 대부분 2~3개짜리 fragment. 즉 실질은 triangle soup이며, 원인은 **pruning**이라고 저자가 직접 명시. 이는 이 claim이 지목한 `pruning-induced disappearance / topology 손실`과 정확히 같은 지점이다.

### downstream 자랑의 실체

Triangle Splatting+가 내세우는 physics simulation / interactive walkthrough / path tracing / scene editing은 대부분 **connectivity·watertight를 요구하지 않는 작업**이라 soup여도 성립한다.

- path tracing / walkthrough / editing → connectivity 자체가 불필요(광선-삼각형 개별 교차, rasterize, 그룹 지정).
- physics → Unity mesh collider로 씌우면 되지만, non-convex는 **static(고정)만** 가능하고 convex는 **볼록 근사(프록시)**다. 즉 "표면 충돌" 수준이지 **부피/soft-body/fluid 같은 watertight 요구 물리는 아님**.
- 결론: "usable"의 실제 범위는 **렌더·엔진 호환**까지지, **변형 가능·근사 불가한 geometry로서의 usable**까지가 아니다. 이것이 "usable ≠ accurate"의 실증.

### 방향의 정당성 조건 (who cares 방어선)

soup 문제가 의미를 가지려면 타깃 downstream이 다음 둘을 만족해야 한다.

1. **deformation이 포함된 simulation** (강체 이동/선택만이면 connectivity 무의미).
2. **"근사"가 허용되지 않는 기준** (게임처럼 plausible이면 프록시로 충분 → 개선 실익 없음).

따라서 타깃은 게임 인터랙션이 아니라 **deformable physics / robotics / engineering simulation** 처럼 근사가 허용되지 않는 영역이어야 한다.

### 남은 핵심 딜레마 (아직 답 없음)

- **Q1. 왜 triangle에서 출발하나?** "deformable용 connected mesh를 만든다"만으로는 `GOF/GGGS로 뽑으면 그만 아닌가`에 무너진다. reconstruction 대비 triangle-first의 우위를 아직 증명 못 함.
- **Q2. connected mesh가 목표면 triangle의 렌더 장점을 왜 끌고 오나?** 잠정 답: reconstruction은 렌더 품질을 희생하고 geometry를 얻고, splatting은 반대다. 그 **둘을 동시에**(고품질 렌더 + 그에 맞는 mesh 생성) 얻는 자리가 빈자리일 수 있다.
- **Q3.** 결국 **connectivity ↔ rendering quality trade-off**를 맞추는 문제로 수렴하는가?
- **Q4.** residual GS가 이걸 해결해줄 거라는 확신은 아직 없다. 그래서 7편을 더 읽고, 읽다 보면 **baseline을 triangle이 아닌 다른 것**으로 잡을 여지도 열어둔다.

### 좁힌 잠정 프레이밍

> "deformable simulation용 connected mesh를 만든다"(약함, GOF에 흡수됨)
> → "**렌더 품질(photometric)을 유지하면서 deformable-ready한 connected/watertight geometry를 동시에 확보한다**"(reconstruction=geo만, triangle splatting=photo만 사이의 빈자리)

## Novelty Review (2026-07-01) — 3-agent 흡수위험 검증 결과

프레이밍 *"고품질 photometric 렌더 유지 + deformable-ready scene-level watertight geometry를 하나의 optimization에서 동시 확보"*를 related-work scout / field-context mapper / skeptical reviewer 3인 병렬 웹조사로 검증.

### Verdict: 지금 프레이밍 그대로면 novelty risk **High**. 좁히면 Medium-Low.

세 기둥 중 셋이 이미 점유됨:

| 주장하려던 것 | 선점 논문 | 무엇을 했나 | 남긴 틈 |
| --- | --- | --- | --- |
| joint single-opt: 렌더 + watertight scene mesh | **MILo** (SIGA 2025, 2506.24096) | 매 iteration mesh 미분추출, mesh→GS gradient, "watertight empty-interior" 단면 제시, **physics sim을 동기로 명시**, 배경 포함 | deformable sim **실험 없음**(Blender 애니메이션만), scene-level Chamfer 미보고 |
| joint이 decoupled를 이긴다 | **OMeGa** (WACV 2026, 2509.24308) | mesh+2DGS 처음부터 joint, **Chamfer −47%·F +79.6% vs 후처리** 측정 완료 | watertight 주장 없음, physics 없음, 실내 한정 |
| photometric optimum ≠ geometric optimum | **Geometry Gaussians** (2606.05124) | 그 insight를 **명시+수치화**(Chamfer 1.665 vs 2.508). 해법이 오히려 *decoupling* → "joint여야만 한다"의 반증 | — |

→ "joint로 렌더+watertight mesh 한 번에"는 MILo가 이미 썼고, 동기(mismatch)는 남이 이미 측정. 이대로 내면 *"MILo + 남이 붙일 downstream"*으로 reject.

### 유일하게 비어 있는 틈 (세 리뷰어 공통 지목)

> **GS에서 뽑은 watertight connected mesh를 실제 deformable/FEM/contact sim에 넣고 ground-truth 물리오차로 검증한 사람이 없다.** MILo·OMeGa·GOF는 Chamfer/렌더에서 멈춤, PhysGaussian 계열은 sim은 하되 geometry를 건너뜀(mesh-free).

→ contribution 성격 전환: **"아이디어"(점유) → "physics-error 검증 + 벤치마크"(공백)**. MILo/OMeGa는 *Chamfer가 아니라 sim-error로 이기는* baseline이 되고, Triangle Splatting은 경쟁자→"gap의 증거"로 강등(2D Triangle Splatting 저자 자백 *"not watertight, limiting simulation"* 2506.18575 인용).

### ⚠️ 전체를 무너뜨릴 단일 리스크 (make-or-break)

"watertight mesh가 deformable sim 필수"는 **있는 그대로면 거짓**. PhysGaussian(WS², *"meshing 필요를 부정"*), GaussianSplashing, 최신 Scene-Level Heterogeneous Physics(2606.21753)까지 전부 **meshless particle** — 분야 최전선이 입자로 흐름.

**그래서 결정적 질문은 baseline이 아니라 이것:**

> **meshless MPM(PhysGaussian)이 admissible하지 못한, ground-truth 있는 deformable task를 하나 이름 댈 수 있는가?**
> (constitutive-model FEM 소변형 정밀, verifiable contact/collision manifold, CAD-coupled 공차, 엔지니어링 error bound)

- yes → 방어 가능. 네 "근사 불가/robotics·engineering/게임 제외" 프레이밍이 정확히 이 corridor(FEM 정밀·collision·엔진 interop)에 앉음. 근거: GS-Verse, VR-GS mesh-FEM 캠프.
- no → 정직하게 접고 meshless 입자-sim geometry 개선으로 피벗. 이걸 빨리 아는 게 이득.

### Scope 수정

"scene-level watertight"는 unbounded 실외(Mip-NeRF360)에서 **ill-posed** → **bounded/foreground-support로 한정**. FEM/collision이 실제 필요로 하는 regime와 일치하므로 손해 아님.

### 차별화 실험 (아이디어→논문 전환용)

1. **joint > decoupled를 sim-error로**: 동일 vertex budget, (A) MILo/OMeGa joint vs (B) GOF/2DGS 후처리 → Chamfer 말고 deflection error·contact-force·penetration/leak·divergence 보고.
2. **watertight term ablation**: 닫힌 부피 필요 solver(FEM/tet)에서 watertight+empty-interior on/off → solver 실패·누수율 정량화.
3. **vs meshless 정면대결**: 같은 근사불가 task에서 PhysGaussian이 tolerance 못 넘고 mesh 경로는 넘는 regime 제시.

### 읽기 우선순위 (새 위협 위주 재편)

1. **MILo** (2506.24096) — 최대 위협, "무엇을 *안* 했나" 표로 정독.
2. **OMeGa** (2509.24308) — joint>decoupled 이미 측정.
3. **Geometry Gaussians** (2606.05124) — mismatch 동기 선점·수치화, 반드시 인용+차별화.
4. **PhysGaussian** (2311.12198) + **Scene-Level Heterogeneous Physics** (2606.21753) — meshless 위협 본체.
5. **GS-Verse / VR-GS** — mesh-FEM 캠프, "왜 mesh인가" 근거.

### 남은 판단 (웹조사로 안 풀림 = 연구자 몫)

- [ ] meshless가 admissible 못한 구체 deformable task를 댈 수 있는가? ← 방향 전체가 여기 걸림.

## Related WIKI Pages

- [[splatting-trends-2025h2-2026h1]]
- [[geometry-prior-and-residual-layer-splatting]]
- [[adaptive-rank-primitive-splatting]]
- [[material-uncertainty-auxiliary-splat-layers]]
- [[shared-vertex-triangle-splatting]]
- [[mesh-compatible-radiance-field]]
- [[triangle-splatting-plus]]
- [[milo]]
