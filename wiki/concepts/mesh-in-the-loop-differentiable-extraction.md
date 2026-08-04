---
type: "concept"
slug: "mesh-in-the-loop-differentiable-extraction"
title: "Mesh-in-the-Loop Differentiable Extraction"
status: "draft"
modified_at: "2026-07-01T11:20:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\MILo.pdf"
tags:
  - "mesh-extraction"
  - "differentiable-rendering"
  - "surface-reconstruction"
  - "gaussian-splatting"
---

# Mesh-in-the-Loop Differentiable Extraction

## Definition
mesh 추출을 학습이 끝난 뒤의 post-processing이 아니라 **최적화 loop의 매 iteration에 통합**하는 설계. volumetric representation(예: 3D Gaussian)에서 매 step마다 mesh(정점 위치 + 연결성)를 미분가능하게 뽑고, mesh 쪽에서 계산한 loss의 gradient를 다시 volumetric 파라미터로 흘려보낸다. 그 결과 volumetric field가 "좋은 mesh가 나오는" 방향으로 학습된다.

## Why It Matters
- **불일치 제거:** 기존 two-stage(`최적화 → 동결 → isosurface`)는 최종 mesh가 volumetric과 일치한다는 보장이 없어 fine/thin detail이 추출 단계에서 사라진다. loop 내부화는 mesh 품질을 학습 신호로 만든다.
- **정규화 방향의 역전:** mesh가 volumetric을 정규화(cheating·floater 억제)하고 volumetric이 mesh를 파라미터화하는 **양방향 결합**이 가능해진다.
- **downstream 실용성:** 추출을 학습 목표로 삼으면 vertex 수·watertightness·empty interior 같은 실사용 조건을 loss로 직접 요구할 수 있다.

## Where It Appears
- [[milo]] (MILo): 3D Gaussian → Gaussian Pivots + learnable SDF → differentiable Marching Tetrahedra로 매 iteration mesh 추출, mesh→Gaussian gradient. "mesh 추출이 최적화의 일부인 최초의 radiance field pipeline"이라 주장.
- 대비: GOF·SuGaR·2DGS·RaDe-GS는 mesh를 post-hoc으로 추출(일부는 fixed-topology refinement까지). Radiant Foam은 Delaunay를 loop에 쓰지만 surface reconstruction이 아닌 view synthesis 목적.
- 관련 방향: DMTet/FlexiCubes 같은 differentiable isosurface 추출을 학습에 쓰는 계보(단 이들은 grid 기반, MILo는 Gaussian pivot 기반).

## Mechanisms
1. volumetric 파라미터에서 mesh 정점 후보(및 scalar field)를 미분가능하게 유도.
2. 미분가능 isosurface 추출(Marching Tetrahedra/Cubes 등)로 삼각형 mesh 생성 — 부호 교차 edge의 선형보간이 gradient 통로.
3. mesh를 rasterize(nvdiffrast 등)해 depth/normal을 렌더, volumetric rendering의 depth/normal과 비교하는 consistency loss.
4. gradient를 (a) scalar(SDF) 값과 (b) 정점 좌표를 통해 volumetric 파라미터로 backprop.
5. 안정성 위해 위상(triangulation)은 드물게(예: 500 iter) 갱신, scalar/좌표는 매 iter 학습.

## Failure Modes / Bias
- **계산비용:** 매 iteration 추출·rasterization으로 학습 시간 증가.
- **초기 분포 의존:** volumetric 초기화가 나쁘면 loop가 개선하기 어려운 영역이 남는다.
- **위상 갱신 빈도 trade-off:** 너무 자주 갱신하면 불안정, 너무 드물면 topology가 geometry 변화에 못 따라간다.
- **metric-정성 괴리:** consistency loss가 수치 metric(F1 등)을 항상 올리진 않음 — 정성 품질과 metric이 어긋날 수 있다.

## Open Questions
- 어떤 미분가능 추출기(MT vs FlexiCubes vs Voronoi 기반)가 loop-내부화에 가장 안정적·저비용인가?
- 학습 중 삽입 가능한 surface 처리(remeshing, curvature reg)를 늘리면 어디까지 이득인가?
- 초기 분포 의존성을 줄이는 adaptive site sampling·초기화는?
