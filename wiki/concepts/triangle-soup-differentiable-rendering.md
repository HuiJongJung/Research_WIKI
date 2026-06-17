---
type: "concept"
slug: "triangle-soup-differentiable-rendering"
title: "Triangle Soup Differentiable Rendering"
status: "draft"
modified_at: "2026-06-17T07:08:20.906691+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Triangle Splatting.pdf"
tags:
  - "triangle-soup"
  - "differentiable-rendering"
  - "radiance-fields"
  - "explicit-primitives"
---

# Triangle Soup Differentiable Rendering

## Definition
Triangle soup differentiable rendering은 connected mesh topology 없이 독립적인 triangle primitive 집합을 두고, 각 triangle의 vertex, opacity, smoothness, color를 image reconstruction loss로 직접 최적화하는 방식이다. Triangle Splatting에서는 SfM sparse point마다 triangle을 초기화하고, projected triangle을 bounded differentiable splat으로 렌더링한다.

## Why It Matters
기존 differentiable mesh renderer는 template mesh나 known topology에 기대기 쉽고, 3DGS는 topology-free optimization은 잘하지만 결과가 Gaussian cloud라 표준 mesh pipeline과 멀다. Triangle soup는 topology-free 시작점과 triangle renderer compatibility 사이의 중간 지대를 만든다. 즉, 처음부터 clean mesh는 아니지만 결과 primitive가 triangle이라 game engine, rasterizer, mesh renderer로 바로 넘어갈 가능성이 열린다.

## Where It Appears
- Triangle Splatting Fig. 1: optimized triangle soup의 rendered output, soft blending, random subset triangle 구조. (p.1)
- Introduction: topology unknown scene에서 triangle soup를 gradient-based로 최적화하는 것이 template-free mesh optimization으로 가는 step이라고 설명한다. (p.2)
- Method Sec. 3: 각 primitive를 3D triangle `T_3D`로 두고 projected `T_2D`에 window function을 적용한다. (p.3)

## Mechanisms
1. SfM sparse point cloud에서 point 하나당 triangle 하나를 만든다.
2. 각 triangle은 세 3D vertex, opacity `o`, sharpness/smoothness `sigma`, SH color coefficient `c`를 가진다.
3. Camera projection으로 2D triangle을 만들고, triangle 내부 bounded window `I(p)`로 pixel contribution을 계산한다.
4. Depth order alpha compositing으로 rendering한다.
5. Photometric and geometry-aware losses로 vertex와 appearance parameter를 갱신한다.
6. Pruning/splitting으로 triangle density를 scene coverage에 맞게 조절한다.

## Failure Modes / Bias
- Triangle soup는 connected mesh가 아니므로 watertight topology, manifoldness, editing-friendly mesh structure를 보장하지 않는다.
- Non-volumetric primitive는 view supervision이 적은 outdoor/sparse region에서 single-view overfit floaters가 생길 수 있다.
- Center-depth sorting은 popping/blending artifact를 만들 수 있다.
- Sharp triangle surface는 PSNR 같은 pixel-wise metric에서 smooth Gaussian보다 불리하게 보일 수 있다.

## Open Questions
- Triangle soup에서 connectivity를 직접 학습하거나 후처리 없이 얻을 수 있는가?
- Gaussian residual과 triangle soup를 결합하면 hard surface와 fuzzy appearance를 더 잘 분리할 수 있는가?
- Triangle soup가 physical collision/editing/path tracing에 충분하려면 어떤 regularization이 필요한가?
