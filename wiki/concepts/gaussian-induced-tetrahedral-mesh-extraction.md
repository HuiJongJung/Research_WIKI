---
type: "concept"
slug: "gaussian-induced-tetrahedral-mesh-extraction"
title: "Gaussian-Induced Tetrahedral Mesh Extraction"
status: "draft"
modified_at: "2026-07-10T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\GOF_Gaussian Opacity Fields - Efficient Adaptive Surface Reconstruction in Unbounded Scenes.pdf"
tags:
  - "marching-tetrahedra"
  - "adaptive-mesh"
  - "delaunay"
  - "binary-search-levelset"
  - "unbounded-scenes"
---

# Gaussian-Induced Tetrahedral Mesh Extraction

## Definition
3D Gaussian primitive의 위치·scale이 surface 위치의 indicator라는 전제 아래, 각 Gaussian 주변 3σ bounding box의 center·corner를 vertex로 삼아 Delaunay triangulation으로 tetrahedral grid를 만들고, Marching Tetrahedra + (non-linear field용) binary search로 level-set mesh를 추출하는 scene-adaptive 방법. dense voxel grid의 resolution³ 폭발 없이 unbounded 배경까지 compact mesh를 얻는다.

## Why It Matters
Dense grid(Marching Cubes) 방식은 해상도³로 비용이 폭증하고, 고해상도로 detail을 잡으면 수억 point·수십억 face의 거대 mesh가 나와 느린 simplification이 필요하다(BOG는 ~4h). Gaussian-유도 grid는 scene 복잡도(Gaussian 밀도)에 맞춰 vertex를 배치하므로, 복잡한 곳은 촘촘히·단순한 곳은 성기게 — 별도 simplification 없이 adaptive·compact mesh를 얻는다. unbounded 배경 mesh 복원의 핵심 도구.

## Where It Appears
- Sec. 3.4: tetrahedral grid 생성(3σ box center·corner를 vertex), CGAL Delaunay(Tetra-NeRF 영감), non-overlapping Gaussian 잇는 cell filtering. (p.5-6)
- Efficient Opacity Evaluation: tile-based로 vertex opacity를 view별 평가 후 min. (p.6)
- Binary Search of Level Set: linear 가정을 monotone 가정으로 완화, edge 위 binary search(8-iter≈256 dense eval). (p.6, Fig. 5)
- Fig. 9: binary search step 0→7의 급격한 품질 향상. (p.9)
- Algorithm 1-3(부록): tile-based opacity evaluation과 MT+binary search pseudo-code. (p.12)
- 한계: CGAL Delaunay O(n log n) 병목(bicycle ~8분). (p.10)

## Mechanisms
- 각 Gaussian에 3σ(scale×3) bounding box → center(최고 opacity)·corner(최저 opacity)를 vertex 집합으로.
- CGAL Delaunay triangulation으로 tetrahedral cell 구성.
- edge 길이가 두 Gaussian의 max scale 합을 넘으면(non-overlapping) 그 cell 제거.
- tile-based로 vertex를 image에 project → tile별 기여 Gaussian 필터링 → opacity 평가, 모든 view의 min.
- Marching Tetrahedra로 level-set triangle 추출; field가 non-linear라 linear interp 대신 edge에서 binary search로 정확한 crossing.

## Failure Modes / Bias
- Delaunay triangulation이 point 수 증가 시 병목(GPU 병렬화 안 됨).
- vertex가 Gaussian에서만 유도됨 → Gaussian이 희소한 저관측 배경에서는 grid가 성겨 mesh가 부실. (사용자 배경-붕괴 문제와 접점)
- 3σ box·non-overlapping filtering threshold가 heuristic → thin/얇은 구조에서 cell 연결이 불안정할 수 있음.
- binary search는 monotone 가정에 의존 → field가 국소적으로 비단조면 부정확(GOF opacity는 단조라 성립).

## Open Questions
- Delaunay 대신 Gaussian-native·GPU 병렬 tetrahedralization으로 병목을 없앨 수 있는가?
- vertex 유도를 Gaussian뿐 아니라 관측 밀도/uncertainty로 보강하면 저관측 배경 mesh가 개선되는가?
- 이 grid를 학습 루프 안(differentiable, [[mesh-in-the-loop-differentiable-extraction]])으로 넣으면 post-hoc 대비 이득이 있는가?
- binary search(monotone level-set)를 SDF·density 등 다른 non-linear field 추출에 이식하면?
