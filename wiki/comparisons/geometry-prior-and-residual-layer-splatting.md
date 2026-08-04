---
type: "comparison"
slug: "geometry-prior-and-residual-layer-splatting"
title: "Geometry Prior and Residual Layer Splatting"
status: "draft"
modified_at: "2026-06-18T16:13:35+09:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "discussion:2026-06-18-user-notes-2dgs-triangle-splatting"
  - "wiki/claims/adaptive-rank-primitive-splatting.md"
  - "wiki/sources/effective-rank-gs.md"
  - "wiki/sources/triangle-splatting.md"
  - "wiki/sources/triangle-splatting-plus.md"
tags:
  - "comparison"
  - "gaussian-splatting"
  - "triangle-splatting"
  - "geometry-prior"
  - "hybrid-representation"
---

# Geometry Prior and Residual Layer Splatting

## 비교 질문

3DGS 계열의 핵심 선택지는 "scene을 어떤 primitive prior로 설명할 것인가"다. 2DGS, SuGaR, MeshGS, Effective Rank GS, Triangle Splatting은 모두 3DGS의 fuzzy Gaussian cloud가 주는 surface ambiguity를 줄이려 하지만, 각 방법이 의존하는 geometry prior와 실패 모드는 다르다.

이 비교 페이지의 목적은 단순한 장단점 목록이 아니라, future idea에서 어떤 차별점을 세울 수 있는지 정리하는 것이다.

## 방법별 역할

| 방법 | 기본 prior | geometry 확보 방식 | 강점 | 남는 취약점 |
| --- | --- | --- | --- | --- |
| 2DGS | surface-like 2D Gaussian disk | primitive 자체를 disk로 두고 depth distortion / normal consistency로 표면 일관성 강화 | mesh 없이 surface prior를 직접 넣을 수 있음 | opaque surface 가정, transparency/fuzzy region/detail 보존에 약함 |
| SuGaR | 3DGS-to-surface alignment + mesh extraction | 3DGS를 먼저 학습한 뒤 Gaussian에서 point/normal을 뽑아 Poisson reconstruction | editable mesh와 bound Gaussian refinement 연결 | 초기 3DGS와 Poisson reconstruction 품질에 의존 |
| MeshGS | base mesh + tight/loose Gaussian | BakedSDF 등으로 mesh를 먼저 얻고, triangle 중심에 Gaussian을 배치 | mesh surface와 appearance splat을 분리 | base mesh가 틀리면 tight splat도 틀리고, loose splat은 근본 geometry correction이 아님 |
| Effective Rank GS | covariance spectrum regularization | effective rank로 needle-like Gaussian을 억제하고 disk-like shape를 유도 | Gaussian shape collapse를 continuous diagnostic으로 볼 수 있음 | 모든 영역을 2D-ish prior로 밀면 thin/fuzzy/volumetric region이 손상될 수 있음 |
| Triangle Splatting | explicit triangle primitive | SfM point에서 triangle soup를 만들고 differentiable splatting으로 최적화 | sharp surface, boundary, graphics pipeline compatibility | connected mesh 보장 없음, transparency/fuzzy/specular/sparse region에 약함 |
| Triangle Splatting+ | opaque/semi-connected triangle target | shared vertices, opacity/smoothness annealing, pruning으로 opaque triangle output 유도 | engine-friendly opaque triangle에 가까워짐 | non-opaque material과 photometric residual은 별도 처리 필요 |

## 공통 관찰

- 핵심은 초기 또는 기반 geometry를 어떻게 잡는가다.
- 2DGS는 primitive 자체에 surface prior를 넣는다.
- SuGaR는 3DGS를 surface에 정렬한 뒤 mesh를 추출한다.
- MeshGS는 base mesh를 먼저 만들고 Gaussian을 붙인다.
- Effective Rank GS는 Gaussian shape가 needle-like로 무너지는 것을 막는다.
- Triangle Splatting은 explicit triangle을 직접 최적화해 surface primitive로 간다.
- 하지만 모두 특정 geometry prior에 의존하며, scene 안의 surface / thin / fuzzy / transparent / specular / uncertain regime을 같은 방식으로 설명하기 어렵다.

## 차별화될 수 있는 연구 포인트

### 1. Region-specific primitive role

Scene 전체를 하나의 primitive prior로 설명하는 대신, region별로 필요한 support를 다르게 둔다.

- 넓고 안정적인 opaque surface: 2D Gaussian, triangle, surface-like splat.
- thin structure: line-like 또는 elongated primitive. 단순히 needle artifact로 벌주면 안 될 수 있다.
- fuzzy / volumetric / uncertain residual: 3D Gaussian 또는 volumetric residual.
- transparent / refractive material: transparent-aware Gaussian 또는 별도 material layer.
- specular / view-dependent appearance: surface geometry와 분리된 residual/material layer.

### 2. Geometry evidence 기반 분류

Primitive type을 semantic label로 고정하기보다 학습 중 얻는 signal로 role을 업데이트할 수 있다.

후보 signal:

- multi-view depth variance
- normal consistency
- photometric residual
- local curvature
- covariance/effective rank
- view coverage / visibility count
- material/view-dependence residual

예시 해석:

```text
depth consistency 높고 normal 안정적 -> surface / triangle / 2D primitive
view마다 depth 또는 normal이 흔들림 -> uncertain / 3D residual
한 방향으로 길고 얇음 -> line-like support 허용
color residual만 크고 depth는 안정적 -> appearance/material residual
```

### 3. Residual-based primitive allocation

처음부터 모든 primitive를 adaptive하게 섞기보다, 단계적 allocation으로 설계를 단순화할 수 있다.

```text
1차: surface primitive로 주요 geometry 학습
2차: residual이 큰 영역 탐지
3차: residual 유형에 따라 primitive 추가
   - depth residual 큼 -> geometry primitive 추가 또는 refinement
   - color/view residual 큼 -> appearance Gaussian / material layer
   - thin/high-frequency residual -> line-like 또는 작은 triangle 추가
   - fuzzy/transparent candidate -> volumetric/transparent auxiliary layer
```

이 방향은 MeshGS의 loose splat보다 연구 질문이 선명하다. "mesh가 틀린 곳에 loose Gaussian을 붙인다"가 아니라, **어떤 failure mode에 어떤 primitive 또는 layer를 할당하는지**를 명시한다.

## Novelty Risk

- Connectivity 개선만을 목표로 하면 Triangle Splatting+나 MeshSplatting 계열과 겹칠 위험이 크다.
- Effective rank만 사용해 disk-like Gaussian을 유도하면 Effective Rank GS와 겹친다.
- Triangle + Gaussian을 단순히 같이 쓰면 hybrid engineering으로 보일 위험이 있다.
- 차별화는 primitive mixture 자체보다, **role assignment rule**, **failure-mode-specific allocation**, **surface vs residual objective separation**, **region-specific rank prior**에서 나와야 한다.

## Working Claim

강한 연구 claim은 다음처럼 잡는 것이 좋다.

> 단일 geometry prior는 scene 안의 opaque surface, thin structure, fuzzy volume, transparent material, view-dependent residual을 같은 방식으로 설명하려 하므로 실패한다. 따라서 학습 중 geometry/material/uncertainty evidence를 이용해 primitive의 intrinsic dimension 또는 auxiliary layer role을 region별로 다르게 할당해야 한다.

## Open Questions

- Role assignment를 differentiable gate로 둘 것인가, staged allocation으로 둘 것인가?
- Gaussian residual이 triangle/surface layer를 "다 먹는" collapse를 어떻게 막을 것인가?
- Effective rank는 selector로 충분한가, 아니면 diagnostic/regularization signal로만 쓰는 편이 안전한가?
- Transparent/specular/fuzzy residual을 하나의 auxiliary layer로 묶을 것인가, material별로 분리할 것인가?
- 평가 실험은 PSNR 중심이 아니라 surface accuracy, editability, engine compatibility, material-specific failure reduction을 함께 봐야 하는가?
