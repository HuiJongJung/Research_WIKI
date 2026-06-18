---
type: "concept"
slug: "mesh-based-novel-view-synthesis"
title: "Mesh-Based Novel View Synthesis"
status: "draft"
modified_at: "2026-06-18T07:13:12.160803+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Triangle Splatting Plus.pdf"
tags:
  - "novel-view-synthesis"
  - "mesh-rendering"
  - "evaluation"
  - "radiance-fields"
---

# Mesh-Based Novel View Synthesis

## Definition
Mesh-based novel view synthesis는 optimized radiance-field renderer가 만든 image quality가 아니라, 최종적으로 얻은 mesh-like representation을 standard mesh renderer에서 렌더링했을 때 novel view가 얼마나 잘 재현되는지를 평가하는 문제 설정이다. Triangle Splatting+에서는 opaque, colored triangle output이 post-processing 없이 mesh renderer에 들어가는지를 주요 기준으로 삼는다.

## Why It Matters
3DGS류 representation은 image rendering metric에서는 강하지만, game engine, VR/AR, collision, editing, simulation에 바로 들어가기 어렵다. Mesh extraction과 texturing post-processing이 들어가면 pipeline complexity와 품질 손실이 생긴다. 따라서 mesh-based NVS는 “보기 좋은 radiance field”가 아니라 “실제 그래픽스 파이프라인에서 쓸 수 있는 3D asset”을 평가하는 축이다.

## Where It Appears
- Triangle Splatting+ Sec. 4: MiLo 프로토콜을 따라 mesh-based novel view synthesis를 task로 채택한다. (p.6)
- Triangle Splatting+ Table 1: E2E mesh, E2E colored, mesh connectivity, PSNR/LPIPS/SSIM/#Verts를 함께 비교한다. (p.6)
- Triangle Splatting+ Fig. 1, Sec. 4.2: game engine rendering, object removal/extraction, physics simulation, walkable environments로 downstream use를 보여준다. (p.1, p.7-8)

## Mechanisms
1. Final representation이 mesh renderer에서 directly renderable한지 확인한다.
2. Mesh extraction, coloring, texturing 같은 post-processing이 필요한지 구분한다.
3. Visual metrics는 PSNR, LPIPS, SSIM을 쓰되, vertex count와 connectivity도 함께 본다.
4. Downstream usability는 object editing, collision, simulation, walkable scene처럼 rendering 밖의 기능으로 확인한다.

## Failure Modes / Bias
- PSNR/LPIPS/SSIM이 collision quality, watertightness, physics stability, editability를 충분히 설명하지 못할 수 있다.
- Semi-connected mesh가 visual NVS에서는 충분해도, simulation이나 manufacturing처럼 topology가 중요한 task에서는 부족할 수 있다.
- Mesh-based evaluation은 transparent/fuzzy radiance effect를 의도적으로 불리하게 만들 수 있다.

## Open Questions
- Mesh-based NVS benchmark에는 visual metric 외에 collision correctness, topology consistency, edit operation stability를 넣어야 하는가?
- Semi-connected mesh와 watertight mesh 사이의 practical usability 차이를 어떻게 정량화할 수 있는가?
- Hybrid primitive output은 mesh-based NVS에서 triangle branch만 평가할 것인가, residual splat branch까지 함께 평가할 것인가?
