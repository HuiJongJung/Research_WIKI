---
type: "concept"
slug: "mesh-compatible-radiance-field"
title: "Mesh-Compatible Radiance Field"
status: "draft"
modified_at: "2026-06-17T07:08:45.139720+00:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Triangle Splatting.pdf"
tags:
  - "radiance-fields"
  - "mesh-rendering"
  - "game-engine"
  - "graphics-pipeline"
  - "triangle-splatting"
---

# Mesh-Compatible Radiance Field

## Definition
Mesh-compatible radiance field는 multi-view image에서 최적화되는 radiance-field-like representation이면서, 결과 primitive가 표준 mesh renderer나 game engine에서 직접 렌더링 가능한 형태를 가지는 표현이다. Triangle Splatting에서는 최종 representation이 triangle soup이므로 standard mesh renderer format으로 변환할 수 있다.

## Why It Matters
NeRF/3DGS 계열은 high-quality novel-view synthesis에는 강하지만, game engine, AR/VR, simulation, editing, path tracing pipeline과의 접점이 약할 수 있다. Mesh-compatible representation은 differentiable reconstruction과 기존 graphics infrastructure 사이의 간극을 줄인다.

## Where It Appears
- Triangle Splatting Fig. 2: optimized triangle soup를 game engine에서 1280x720, RTX4090 기준 2400+ FPS로 렌더링. (p.2)
- Table 4: Garden scene 약 2M triangles에서 MacBook M4 HD 500 FPS, RTX4090 HD 2400 FPS, 4K 1050 FPS. (p.8-9)
- Supplementary A.5: final 5000 iteration에서 low opacity triangle을 prune하고 high opacity/low sigma를 유도해 solid opaque triangles로 만든 뒤 mesh renderer format으로 변환. (p.18)

## Mechanisms
1. Training 중에는 differentiable splatting renderer를 사용해 triangle parameters를 최적화한다.
2. 마지막 단계에서 opacity와 `sigma`를 anneal/regularize하여 mostly solid opaque triangle으로 만든다.
3. Low-opacity triangle을 제거한다.
4. Triangle vertex/color data를 standard mesh renderer가 읽는 format으로 변환한다.
5. Game engine에서는 shader 없이도 real-time rendering 예시를 보여준다.

## Failure Modes / Bias
- Mesh-compatible과 connected mesh는 다르다. Triangle soup는 표준 renderer로 그릴 수 있지만 topology, watertightness, manifoldness는 보장하지 않는다.
- 논문이 보여준 game-engine visuals는 shader 없이 렌더링되었고, game-engine visual fidelity에 맞춘 training은 future work다.
- Solid/opaque triangle으로 수렴시키는 과정은 semi-transparent/fuzzy radiance effect 표현을 줄일 수 있다.
- DTU Chamfer는 2DGS/BBSplat보다 나빠서 geometry extraction quality 자체는 아직 약점이다.

## Open Questions
- Mesh-compatible radiance field를 connected/editable mesh로 바꾸는 가장 직접적인 training objective는 무엇인가?
- 표준 renderer의 material, lighting, shadow, reflection과 radiance-field color/SH를 어떻게 맞출 수 있는가?
- Hybrid representation에서 triangle component만 mesh renderer로 넘기고 Gaussian residual은 별도 splat renderer로 유지하는 mixed pipeline이 가능한가?
