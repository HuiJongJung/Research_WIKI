---
type: "concept"
slug: "gaussian-pivots-learnable-sdf"
title: "Gaussian Pivots and Learnable SDF"
status: "draft"
modified_at: "2026-07-01T11:20:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\MILo.pdf"
tags:
  - "delaunay-triangulation"
  - "marching-tetrahedra"
  - "signed-distance-field"
  - "gaussian-splatting"
  - "mesh-extraction"
---

# Gaussian Pivots and Learnable SDF

## Definition
3D Gaussian을 **Delaunay 정점의 미분가능한 pivot**으로 삼아 tetrahedral grid를 만들고, 각 정점에 **Gaussian 파라미터와 분리된 학습가능 SDF 값**을 붙여 Marching Tetrahedra로 mesh를 뽑는 파라미터화. Gaussian 하나가 (a) 여러 개의 anisotropic 정점 위치와 (b) 그 정점들의 scalar 값을 동시에 생성한다.

## Why It Matters
- **straddling 정점 확보:** Gaussian center만 쓰면 surface에 몰려 Marching Tetrahedra가 요구하는 "surface를 사이에 두고 부호가 갈리는" 정점을 못 만든다. center + bounding-box corner를 뽑으면 surface를 걸치는 정점이 생긴다.
- **surface 자유도 분리(decoupling):** SDF 값을 opacity·scale·rotation과 독립적으로 두면, image를 맞추기 위한 Gaussian 형태 변화와 surface level 결정이 분리된다 → cheating이 곧바로 잘못된 surface로 번지지 않고 fine detail·consistency에 유리.
- **적응적 해상도:** Delaunay는 점 밀도에 맞춰 dense 영역엔 작은 tetrahedron, sparse 영역엔 큰 것을 만들어 uniform grid보다 효율적.

## Where It Appears
- [[milo]] (MILo): Gaussian당 9점(center+8 corner) `p_{k,i}=μ+R(s⊙b_i)`, Gaussian당 9개 learnable SDF `f_k∈R⁹`. importance-weighted sampling(Mini-Splatting2)으로 surface 근처 Gaussian만 pivot으로 선택.
- 뿌리: GOF의 per-Gaussian 9점 sampling(단 GOF는 post-hoc), Marching Tetrahedra(Doi & Koide 1991), CGAL Delaunay.
- 관련: VoroMesh/PoNQ 등 Voronoi-Delaunay 기반 learnable mesh, Radiant Foam(Delaunay in-the-loop, view synthesis).

## Mechanisms
1. **정점 생성:** 각 Gaussian에서 principal axis로 회전·스케일된 bounding box의 center+corner를 정점으로.
2. **subset 선택:** rendering 기여도(blending 계수 크기)로 importance score를 매겨 surface 근처 Gaussian만 pivot으로 → 확장성.
3. **learnable SDF:** 정점마다 최적화되는 scalar. 참 SDF가 아니라 isosurface level을 국소 제어하는 자유 파라미터. tanh로 [-1,1] truncate, depth-fusion으로 초기화.
4. **위상:** 선택된 정점들의 Delaunay triangulation(비미분, 드물게 갱신)이 tetrahedral grid 제공.
5. **gradient 통로:** Marching Tetrahedra 정점 위치가 SDF와 정점좌표(=Gaussian mean/cov) 둘 다에 미분가능.

## Failure Modes / Bias
- **비-진짜-SDF:** 학습된 값이 진짜 거리장이 아니므로 tetrahedron 내부 전체가 같은 부호가 되면 geometry가 침식·소실(→ anti-erosion reg 필요).
- **sampling 편향:** importance score가 낮게 잡힌 thin/저조도 구조는 pivot에서 빠져 mesh에서 누락될 수 있다.
- **corner scale 민감도:** bounding box corner 배치가 Gaussian scale에 의존 → 지나치게 크거나 작은 Gaussian이 grid를 왜곡.
- **위상 갱신 지연:** 드문 Delaunay 갱신 동안 정점이 크게 움직이면 순간적으로 부정확한 tetrahedralization.

## Open Questions
- Gaussian당 9점 이외의 sampling(방향·개수 적응)이 정확도/비용을 개선하나?
- learnable SDF에 약한 eikonal/거리장 prior를 주면 erosion 없이 더 매끈한 surface가 되나?
- importance sampling의 누락 편향을 보완할 uncertainty-aware pivot 선택은?
