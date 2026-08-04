---
type: "claim"
slug: "adaptive-rank-primitive-splatting"
title: "Adaptive Rank Primitive Splatting"
status: "draft"
modified_at: "2026-06-18T19:37:34+09:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "discussion:2026-06-10"
  - "https://arxiv.org/abs/2308.04079"
  - "https://arxiv.org/abs/2403.17888"
  - "https://arxiv.org/abs/2512.15711"
  - "https://arxiv.org/abs/2403.05087"
  - "https://arxiv.org/abs/2406.11672"
  - "https://arxiv.org/abs/2404.10772"
  - "https://arxiv.org/abs/2505.19175"
  - "https://arxiv.org/abs/2509.25122"
  - "discussion:2026-06-18-user-notes-2dgs-triangle-splatting"
  - "wiki/comparisons/geometry-prior-and-residual-layer-splatting.md"
  - "wiki/concepts/material-uncertainty-auxiliary-splat-layers.md"
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Triangle Splatting Plus.pdf"
  - "wiki/sources/triangle-splatting-plus.md"
  - "discussion:2026-06-18-triangle-splatting-plus-method-implications"
  - "discussion:2026-06-18-sparse-topology-reframing"
  - "discussion:2026-06-18-seminar-reframing-gs-triangle-usability"
  - "wiki/claims/residual-guided-mesh-refinement-splatting.md"
tags:
  - "claim"
  - "gaussian-splatting"
  - "scene-representation"
  - "adaptive-primitives"
  - "hybrid-representation"
  - "triangle-splatting-plus"
  - "opaque-triangles"
  - "connectivity"
  - "discussion-capture"
  - "topology-repair"
  - "uncertainty-aware-pruning"
  - "temporary-gaussian"
---

# Adaptive Rank Primitive Splatting

## 요약

3D scene representation에서 여러 primitive를 discrete하게 선택하거나 전환하는 대신, 하나의 연속적인 splat family 안에서 primitive의 effective intrinsic dimension을 학습하는 아이디어다. 예를 들어 anisotropic Gaussian의 covariance eigenvalue 비율을 조절하면 point-like, line-like, surface-like, volume-like splat을 하나의 연속 공간에서 표현할 수 있다.

## 핵심 가설

- 3DGS와 2DGS를 별도 primitive label로 hard switching하면 threshold, 타입 전환, renderer semantics가 이산적으로 변한다.
- 대신 각 splat의 scale/covariance rank가 연속적으로 변하도록 두면 3D Gaussian에서 2D surface-like splat으로 가는 변화가 soft degeneration으로 표현될 수 있다.
- 이때 primitive type은 `3D` 또는 `2D` 같은 label이 아니라 covariance spectrum에서 계산되는 effective dimension으로 해석한다.

## 연속 Primitive Family

Rank-adaptive splat 하나로 다음 상태를 연속적으로 포함하는 것을 목표로 한다.

- point-like splat: 모든 축 scale이 작음.
- line-like splat: 한 축만 길고 나머지 축은 작음.
- surface-like splat: 두 축이 크고 한 축은 작음.
- volume-like splat: 세 축 모두 의미 있는 부피를 가짐.

예시 해석:

```text
Sigma = R diag(s1^2, s2^2, s3^2) R^T

s1 ~= s2 ~= s3      -> volume-like 3D Gaussian
s1, s2 >> s3        -> surface-like / 2DGS-like splat
s1 >> s2, s3        -> line-like primitive
s1, s2, s3 all tiny -> point-like primitive
```

## 왜 중요한가

- 서로 다른 primitive 사이의 hard conversion을 줄일 수 있다.
- surface, fuzzy volume, thin structure를 하나의 optimizer 안에서 다룰 가능성이 있다.
- 3DGS의 photorealistic rendering과 2DGS의 surface consistency 사이를 연속적으로 탐색할 수 있다.
- adaptive blending의 핵심 문제를 "primitive selection"보다 "rank/effective dimension regularization"으로 단순화할 수 있다.

## 선행연구와의 관계

- 3D Gaussian Splatting은 anisotropic Gaussian으로 scene을 표현하지만 primitive의 intrinsic dimension을 명시적으로 연속 학습하는 문제를 중심에 두지는 않는다.
- 2D Gaussian Splatting은 surface-like disk primitive로 geometry consistency를 강화하지만 3DGS와의 연속적 type transition 자체가 주제는 아니다.
- GPiCA, SplattingAvatar, MeshGS 계열은 mesh/triangle과 Gaussian을 함께 쓰는 hybrid representation을 다루므로 강한 관련 선행연구다.
- 이 claim의 초점은 여러 discrete primitive를 섞기보다, 먼저 point-line-surface-volume을 포괄하는 continuous rank-adaptive splat family를 정의하는 데 있다.

## 열려 있는 질문

- 거의 singular한 covariance에서 opacity/mass/transmittance를 어떻게 안정적으로 정의할 것인가?
- 3D volume density에서 2D surface measure로 가는 limit을 renderer에서 어떻게 다룰 것인가?
- effective dimension regularizer가 surface-like 구조와 volumetric residual을 자연스럽게 분리할 수 있는가?
- triangle/mesh connectivity는 이 연속 family에 포함하기 어렵기 때문에 downstream extraction 또는 별도 optional primitive로 둘 것인가?

## 3DGS 기반 최소 Hybrid 후보

현재 아이디어는 너무 많은 primitive를 섞기보다 3DGS를 기본 표현으로 두고, 3DGS가 약한 실패 모드를 다른 primitive가 보완하는 작은 조합에서 출발한다.

### 후보 1: 3D Gaussian

- 역할: 기본 photorealistic appearance, fuzzy/volumetric residual, foliage, hair-like detail, semi-transparent structure.
- 강점: 빠른 학습과 렌더링, topology 불필요, 복잡한 외관과 불확실한 geometry를 부드럽게 흡수.
- 약점: 명확한 surface geometry, depth/normal consistency, collision/editing/mesh pipeline에는 약함.

### 후보 2: 2D Gaussian 또는 surface-like splat

- 역할: 3DGS가 잘 못하는 surface consistency 보완.
- 강점: 벽, 바닥, 물체 표면처럼 실제로 2D manifold에 가까운 영역을 안정적으로 표현.
- 약점: 명시적 topology, hard boundary, engine compatibility는 triangle/mesh보다 약함. non-surface detail에는 과도하게 납작한 prior가 될 수 있음.

### 후보 3: Triangle 또는 mesh patch

- 역할: 2D Gaussian이 못하는 explicit geometry, hard boundary, collision, physics, editing 담당.
- 강점: 표준 그래픽스 파이프라인과 호환되고, sharp surface와 connected geometry를 표현하기 좋음.
- 약점: fuzzy detail, hair/foliage, translucent structure, view-dependent residual을 단독으로 표현하기 어렵거나 비싸다.

### 보완 사슬

```text
3D Gaussian
-> surface consistency가 약함
-> 2D Gaussian / surface-like splat으로 보완

2D Gaussian
-> explicit topology, hard boundary, engine compatibility가 약함
-> Triangle / mesh patch로 보완

Triangle
-> fuzzy detail, non-surface residual, transparency가 약함
-> 다시 3D Gaussian residual로 보완
```

간소화된 연구 방향은 두 가지다.

- 1차 실험: `3D Gaussian + 2D Gaussian` 사이의 연속 rank-adaptive transition이 가능한지 확인한다.
- 확장 실험: `Rank-adaptive Gaussian + Triangle`으로 soft point/line/surface/volume residual과 hard explicit geometry를 분리한다.

## Primitive Blending의 목적 재정의

Primitive blending을 "3DGS, 2DGS, triangle의 장점을 모은다"로 설명하면 조합형 engineering claim에 머물 위험이 크다. 더 강한 문제정의는 하나의 scene 안에 서로 다른 geometry/appearance regime이 공존하며, 단일 primitive가 이들을 같은 방식으로 설명하려 하기 때문에 실패한다는 것이다.

핵심 목적 후보는 두 가지다.

1. **Surface + volumetric residual decomposition**

   - 벽, 바닥, 책상, 치아 표면처럼 2D manifold에 가까운 영역은 surface-like primitive가 담당한다.
   - 머리카락, 잔디, foliage, 반투명 물질, fuzzy residual, view-dependent appearance는 3D Gaussian residual이 담당한다.
   - 목표는 "볼륨과 표면을 모두 표현한다"가 아니라, surface geometry와 non-surface appearance residual을 분리해 각각에 맞는 prior와 regularization을 적용하는 것이다.

2. **Splatting + path-traceable primitive decomposition**

   - 기본 3DGS splatting은 빠르고 photorealistic하지만, 명확한 hit surface, material, shadow, reflection, indirect illumination을 정의하기 어렵다.
   - 2D Gaussian/surfel 또는 triangle은 ray intersection, normal, visibility, collision, physics, editing에 더 자연스럽다.
   - 목표는 fast splatting representation과 physically based rendering/path tracing이 가능한 explicit or surface-like component를 같은 scene representation 안에서 분리하거나 전환하는 것이다.

따라서 이 아이디어의 contribution은 "여러 primitive를 섞었다"가 아니라, **어떤 영역에서 어떤 intrinsic dimension/support/renderer behavior가 필요한지 자동으로 판별하고, 그 선택이 특정 실패 모드를 줄인다는 것을 보이는 것**이어야 한다.

## Effective Rank GS와의 경계

Effective Rank GS는 covariance spectrum에서 differentiable effective rank를 계산하고, needle-like Gaussian을 억제해 disk-like/surface-friendly Gaussian을 유도하는 regularizer다. 이 논문은 3DGS, SuGaR, 2DGS, GOF 등에 add-on으로 붙여 실험하지만, 3DGS와 2DGS를 하나의 hybrid primitive system으로 동시에 쓰는 방법은 아니다.

겹치는 지점:

- covariance eigenvalue/singular value spectrum을 본다.
- effective rank를 연속값으로 사용한다.
- Gaussian shape를 gradient 기반 regularization으로 제어한다.

차별화해야 할 지점:

- Effective Rank GS는 주로 `rank ~ 1` needle artifact를 줄이고 `rank ~ 2` disk-like surface coverage를 유도한다.
- Adaptive rank primitive 방향은 `rank ~ 1`, `rank ~ 2`, `rank ~ 3` 상태를 무조건 좋고 나쁨으로 나누지 않고, scene region의 역할에 따라 line-like, surface-like, volume-like, residual-like 상태를 다르게 허용해야 한다.
- 이 차별화가 성립하려면 surface reconstruction에서는 rank-2 prior가 좋지만, fuzzy/volumetric/detail residual에서는 과도한 disk prior가 오히려 표현을 망친다는 실패 사례를 보여줘야 한다.

## GS Path Tracing과의 연결

기본 3DGS renderer는 path tracing이 아니라 projected Gaussian splatting/rasterization과 depth-ordered alpha compositing이다. GS를 path tracing에 연결하려면 Gaussian을 ray와 상호작용하는 scene representation으로 재해석해야 한다.

가능한 접근은 두 가지다.

- **Volumetric density 방식**: 각 Gaussian이 공간 density를 만든다고 보고 ray를 따라 density/transmittance를 적분한다. 직접광, 산란, secondary ray까지 넣으면 volume path tracing에 가까워진다. 단, 3DGS의 빠른 splatting 장점을 잃기 쉽다.
- **Surface/ellipsoid primitive 방식**: Gaussian을 ellipsoid, iso-density surface, oriented disk/surfel로 보고 ray intersection과 normal/material을 정의한다. path tracing과 physics에는 유리하지만, Gaussian의 본래 fuzzy density 성질을 어디서 surface로 끊을지 정해야 한다.

이 관점에서 primitive blending의 목적은 더 명확해질 수 있다. **모든 영역을 path-traceable surface로 만들려는 것이 아니라, path tracing이 필요한 surface/material component와 splatting이 더 적합한 fuzzy residual component를 분해하는 것**이다. 이 방향은 "표현력 향상"보다 "fast radiance-field capture와 physically based rendering compatibility 사이의 간극을 줄인다"는 더 선명한 연구 질문을 만든다.

## 2026-06-18 메모 통합: Geometry Evidence 기반 Role Assignment

최근 메모의 핵심은 adaptive primitive를 단순히 `3D Gaussian + 2D Gaussian + Triangle`의 조합으로 보지 말고, **scene region마다 필요한 support와 renderer behavior를 evidence로 판별하는 문제**로 재정의하는 것이다.

### 관련 방법의 공통 한계

- 2DGS는 surface-like disk와 normal/depth regularization으로 geometry를 안정화하지만, opaque surface prior가 강해 transparent/fuzzy/detail residual에는 약할 수 있다.
- SuGaR는 3DGS를 surface에 정렬한 뒤 Poisson reconstruction으로 mesh를 뽑지만, 초기 3DGS와 reconstruction 품질에 의존한다.
- MeshGS는 base mesh와 tight/loose splat을 나누지만, base mesh가 틀리면 tight splat도 틀린 geometry에 묶이고 loose splat은 appearance 보완에 머물 수 있다.
- Effective Rank GS는 needle-like artifact를 줄이는 좋은 diagnostic/regularizer지만, 실제 scene의 thin structure나 fuzzy volume까지 모두 disk-like prior로 밀면 손상될 수 있다.
- Triangle Splatting은 stable opaque surface와 graphics pipeline compatibility에는 강하지만, triangle soup connectivity, semi-transparent training dependency, transparent/fuzzy/specular/sparse region 문제가 남는다.

### 차별화 방향

Adaptive primitive의 contribution은 primitive 종류를 많이 넣는 것이 아니라, 다음 질문에 답해야 한다.

> 어떤 region에서 어떤 intrinsic dimension, support, renderer behavior가 필요한가?

후보 role은 다음과 같다.

| Role | Evidence | Preferred support |
| --- | --- | --- |
| stable surface | high depth consistency, stable normal, enough visibility | 2D disk, triangle, surface-like rank-2 splat |
| thin structure | elongated covariance, edge-like residual, high-frequency geometry | line-like / elongated support, small triangle |
| fuzzy volume | high residual but unstable surface normal, semi-transparent density | 3D Gaussian / volumetric residual |
| transparent material | view-dependent distortion, alpha/refraction cue | transparent-aware Gaussian layer |
| specular appearance | stable geometry but view-dependent color residual | material/specular residual layer |
| uncertain geometry | low visibility, high depth variance, sparse SfM | temporary Gaussian, deferred densification |

### Differentiable gate 후보

Hard type을 직접 지정하지 않고 learnable weight를 두는 방식이다.

```text
primitive_i = w_1D * line-like
            + w_2D * disk-like
            + w_3D * volume-like
            + w_tri * triangle-like
```

필요한 regularization:

- entropy 또는 one-hot regularization: role collapse 방지.
- complexity penalty: 모든 영역이 high-capacity residual로 가는 것 방지.
- rank transition smoothness: 인접 primitive의 role이 불필요하게 튀는 것 방지.
- role-specific loss: surface role에는 depth/normal consistency, volume role에는 photometric/opacity objective 중심.

### Staged allocation 후보

Differentiable mixture가 너무 어렵다면 staged allocation이 더 안전한 시작점이다.

```text
1차: surface primitive로 주요 opaque geometry 학습
2차: residual과 uncertainty map으로 실패 영역 탐지
3차: failure mode별 primitive/layer 추가
   - depth residual -> geometry primitive refinement
   - color/view residual -> appearance or material Gaussian
   - thin/high-frequency residual -> line-like support or small triangle
   - fuzzy/transparent candidate -> volumetric/transparent auxiliary layer
```

이 접근은 "loose splat을 붙인다"보다 명확하다. 핵심은 어떤 failure mode에 어떤 primitive를 추가하는지 정의하고, 그 선택이 실제로 surface distortion이나 residual artifact를 줄이는지 검증하는 것이다.

### Auxiliary Layer와의 연결

Triangle Splatting 기반 확장에서는 triangle layer를 stable opaque surface 담당으로 두고, triangle이 구조적으로 약한 영역만 [Material and Uncertainty Auxiliary Splat Layers](../concepts/material-uncertainty-auxiliary-splat-layers.md)로 보완하는 방향이 자연스럽다.

중요한 제약:

- Gaussian이 전체 scene을 먹지 않도록 sparsity, mask, responsibility competition을 둔다.
- Auxiliary layer는 단순 photometric residual이 아니라 material 또는 uncertainty evidence로 활성화한다.
- Surface layer의 성공 여부는 PSNR뿐 아니라 depth/normal consistency, editability, mesh/engine compatibility로 평가한다.

## 연결 페이지

- [Geometry Prior and Residual Layer Splatting](../comparisons/geometry-prior-and-residual-layer-splatting.md): 2DGS, SuGaR, MeshGS, Effective Rank GS, Triangle Splatting 계열의 geometry prior와 residual 처리 비교.
- [Material and Uncertainty Auxiliary Splat Layers](../concepts/material-uncertainty-auxiliary-splat-layers.md): Triangle/surface layer가 못하는 transparent, fuzzy, specular, uncertain region을 제한적으로 보완하는 auxiliary layer 개념.

## 읽을 논문

- [3D Gaussian Splatting for Real-Time Radiance Field Rendering](https://arxiv.org/abs/2308.04079)
- [2D Gaussian Splatting for Geometrically Accurate Radiance Fields](https://arxiv.org/abs/2403.17888)
- [Effective Rank Analysis and Regularization for Enhanced 3D Gaussian Splatting](https://arxiv.org/abs/2406.11672)
- [Gaussian Opacity Fields](https://arxiv.org/abs/2404.10772)
- [Gaussian Pixel Codec Avatars](https://arxiv.org/abs/2512.15711)
- [SplattingAvatar](https://arxiv.org/abs/2403.05087)
- [MeshGS](https://arxiv.org/abs/2410.08941)
- [Triangle Splatting for Real-Time Radiance Field Rendering](https://arxiv.org/abs/2505.19175)
- [Triangle Splatting+: Differentiable Rendering with Opaque Triangles](https://arxiv.org/abs/2509.25122)

## Current Narrowing

초기 adaptive-rank primitive claim은 `3DGS + 2DGS + triangle`을 region별로 섞어 rendering과 geometry를 모두 개선하려는 넓은 아이디어였다. 최근 세미나용 정리에서는 이 방향이 더 구체적으로 좁혀졌다.

```text
초기 넓은 claim:
scene region마다 적절한 primitive를 고르자.

현재 좁힌 claim:
최종적으로 usable mesh/triangle representation을 목표로 하되,
triangle이 실패하는 sparse/uncertain 영역을 temporary Gaussian holder로 진단하고,
geometry evidence가 충분한 경우에만 topology repair / mesh refinement로 승격하자.
```

따라서 [[residual-guided-mesh-refinement-splatting]]은 이 adaptive primitive claim의 downstream-oriented specialization으로 볼 수 있다. primitive mixture 자체보다 중요한 것은 **rendering quality 향상이 아니라 mesh usability, topology repair, uncertainty-aware pruning, evidence-based promotion**이다.

## Discussion Captures

### 2026-06-18 08:55 UTC

## Triangle Splatting+에서 갱신된 아이디어 메모

- Triangle Splatting+는 `multi-view images + camera poses -> SfM sparse point cloud -> 3D Delaunay triangulation -> initial triangle structure` 흐름으로 시작한다.
- 처음 어떤 세 점이 triangle이 되는지는 학습이 아니라 Delaunay triangulation이 정한다. 이후 기존 triangle의 index triplet을 gradient descent로 직접 바꾸는 내용은 논문에 없다.
- 학습 중 continuous하게 바뀌는 것은 vertex position, color, opacity이며, topology 변화는 pruning으로 triangle을 제거하거나 midpoint subdivision으로 triangle을 추가하는 discrete update에서 생긴다.
- Delaunay는 connected-ish 초기 구조를 주지만, fully connected/watertight mesh를 보장하지 않는다. 입력 SfM point cloud가 cluster/outlier/sparse region을 가지면 초기 연결도 불완전할 수 있다.
- Densification은 선택된 triangle의 edge midpoint를 추가해 `1 triangle -> 4 smaller triangles`로 나누기 때문에, 생성 직후 새 triangle들은 parent triangle에서 나온 sibling triangle들과 최소한 연결되어 있다. 다만 parent가 고립되어 있으면 새 component도 전체 scene과는 고립될 수 있고, 이후 pruning으로 다시 끊길 수 있다.
- 논문이 최종 결과를 fully connected mesh가 아니라 semi-connected mesh라고 부르는 이유가 여기에 있다. 논문은 평균 vertex 연결 triangle 수 1.5, 전체 triangle의 80%가 최소 하나의 다른 triangle과 연결된다고 보고한다.
- Opaque constraint의 의미는 단순히 mesh renderer 호환성만이 아니라, 낮은 opacity로 숨어 있는 primitive를 허용하지 않고 visible surface responsibility를 강제하는 것이다. 이 때문에 5k hard pruning과 이후 blending-weight pruning이 핵심이 된다.
- Loss에서는 `L1`, `L_D-SSIM`, opacity loss `L_o`, normal loss `L_n`이 명시된다. 기존 Triangle Splatting식 distortion loss나 size regularization을 왜 제외했는지는 논문에서 명시적으로 설명하지 않는다.
- 추측: Delaunay 초기화와 midpoint subdivision이 triangle size/topology를 어느 정도 제한하고, opacity/pruning schedule과 normal loss가 기존 size/distortion regularizer 일부 역할을 대체했을 가능성이 있다. 다만 이는 논문 근거가 아니라 해석이다.
- Adaptive/hybrid primitive 관점에서 Triangle Splatting+는 strong opaque surface branch로 볼 수 있다. 하지만 topology를 자유롭게 재배선하는 방법은 아니므로, sparse background, transparent object, fuzzy/specular residual은 Gaussian/auxiliary layer가 담당하는 설계가 더 자연스럽다.
- 따라서 후속 아이디어는 triangle branch를 전체 장면의 단독 표현으로 쓰기보다, `triangle = stable opaque visible surface`, `Gaussian/auxiliary = uncertain, transparent, fuzzy, view-dependent residual`로 role assignment하는 방향이 더 명확하다.

- Capture rationale: Triangle Splatting+의 초기 topology, connectivity, opaque training, pruning/densification 논의가 사용자의 adaptive/hybrid primitive 아이디어에서 triangle branch의 역할과 한계를 구체화하기 때문이다.

### 2026-06-18 09:10 UTC

## Sparse/topology reframing 보완 메모

- Triangle Splatting+의 남은 한계는 단순히 opaque triangle의 visual quality drop이 아니라, topology가 `Delaunay initialization + pruning/subdivision lifecycle`에 묶여 fully connected/watertight하지 않다는 점이다.
- Sparse 영역 문제는 관측 부족 자체를 해결하는 문제가 아니라 `initial SfM undercoverage + pruning-induced disappearance`가 최종 triangle coverage 부족으로 이어지는 문제다.
- Sparse region에 Gaussian을 넣는다고 geometry/topology가 자동 해결되지는 않는다. Gaussian은 sparse 영역을 그럴듯하게 보일 수는 있지만, 관측이 부족하면 진짜 surface connectivity를 알 수 없다.
- 따라서 Gaussian의 역할은 final mesh를 대체하는 주 표현이 아니라 `temporary Gaussian holder`, 즉 uncertain region을 보류하고 evidence를 축적하는 probe로 제한하는 것이 더 맞다.
- 후속 방향은 `residual -> mesh refinement`가 아니라 `residual/uncertainty -> topology repair 대상인지, triangle로 확정하면 안 되는 material/appearance 영역인지, evidence가 부족해 보류할 영역인지 판별`하는 문제로 잡는 것이 좋다.
- 직접 target할 수 있는 메커니즘은 uncertainty-aware pruning, sparse/topology failure detection, evidence-based triangle refinement, local remeshing/edge reconnect, auxiliary uncertainty layer다.

- Capture rationale: Triangle Splatting+ 이후 adaptive primitive 아이디어의 핵심이 Gaussian residual 보완보다 topology 불완전성과 sparse/uncertain 영역의 확정 보류 문제로 이동했기 때문이다.
