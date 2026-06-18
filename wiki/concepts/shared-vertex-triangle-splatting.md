---
type: "concept"
slug: "shared-vertex-triangle-splatting"
title: "Shared-Vertex Triangle Splatting"
status: "draft"
modified_at: "2026-06-18T07:12:34.442352+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Triangle Splatting Plus.pdf"
tags:
  - "triangle-splatting"
  - "connectivity"
  - "mesh-representation"
  - "differentiable-rendering"
---

# Shared-Vertex Triangle Splatting

## Definition
Shared-vertex triangle splatting은 각 triangle이 독립적인 세 vertex 좌표를 갖는 triangle soup가 아니라, 하나의 공유 vertex set `V`와 triangle index triplet `T_m=(i,j,k)`로 장면을 표현하는 differentiable splatting 방식이다. Triangle Splatting+에서는 각 vertex가 position, color, opacity를 갖고, triangle color는 barycentric interpolation으로 계산되며, 여러 triangle의 gradient가 공유 vertex에 누적된다.

## Why It Matters
기존 triangle soup는 renderer-compatible primitive를 쓰더라도 topology가 끊겨 있어 mesh pipeline에서 기대하는 연결성, editing, collision, subdivision과 잘 맞지 않는다. Shared vertex 구조는 완전한 watertight mesh는 아니더라도 semi-connected mesh를 만들며, game engine import, object editing, physical interaction, walkable scene 같은 downstream usage를 더 직접적으로 가능하게 한다.

## Where It Appears
- Triangle Splatting+ Fig. 2: SfM points에서 Delaunay triangulation으로 초기 mesh를 만들고, shared vertex set과 triangle indices로 표현한다. (p.3)
- Triangle Splatting+ Sec. 3.1-3.2: vertex `v_i=(x_i,y_i,z_i,c_i,o_i)`와 triangle `T_m=(i,j,k)` 정의. (p.4)
- Triangle Splatting+ Sec. 4.3: pruning 때문에 full connectivity는 보장되지 않지만, 80% triangle이 적어도 하나의 다른 triangle과 연결된다고 보고한다. (p.8)

## Mechanisms
1. SfM sparse point cloud를 3D Delaunay triangulation해 초기 triangle set을 만든다.
2. Geometry/color/opacity를 triangle 단위가 아니라 vertex 단위로 둔다.
3. Triangle은 vertex index triplet으로 정의되어 인접 triangle이 vertex를 공유할 수 있다.
4. Backward pass에서 adjacent triangle들의 gradient가 공유 vertex에 합산된다.
5. Densification은 midpoint subdivision으로 수행되어 새 vertex와 triangle을 만들면서 연결 구조를 최대한 보존한다.

## Failure Modes / Bias
- Pruning 이후 triangle 연결성이 끊겨 full mesh connectivity가 유지되지 않을 수 있다.
- Delaunay initialization과 SfM point coverage가 부실하면 초기 topology가 빈약하고, sparse background에서 geometry가 누락될 수 있다.
- Shared vertex는 local smoothness와 structural consistency를 주지만, 잘못 연결된 triangle이 생기면 artifact가 연결 구조를 타고 퍼질 수 있다.

## Open Questions
- Pruning 이후에도 connectivity를 유지하려면 edge collapse, remeshing, topology regularization이 필요한가?
- Shared vertex gradient accumulation은 sharp discontinuity나 thin structure에서 over-smoothing bias를 만들 수 있는가?
- Hybrid splatting에서 Gaussian/triangle이 공존할 때 shared vertex connectivity는 triangle branch에만 둘 것인가, 다른 primitive와도 연결할 것인가?
