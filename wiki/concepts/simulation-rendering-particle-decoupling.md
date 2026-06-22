---
type: "concept"
slug: "simulation-rendering-particle-decoupling"
title: "Simulation-Rendering Particle Decoupling"
status: "draft"
modified_at: "2026-06-22T18:21:38.645806+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\1_Gaussian Splashing; Unified Particles for Versatile Motion Synthesis and Rendering.pdf"
tags:
  - "3d-gaussian-splatting"
  - "particle-simulation"
  - "decoupled-representation"
  - "gmls"
  - "neus"
  - "sampling"
---

# Simulation-Rendering Particle Decoupling

## Definition
Simulation-rendering particle decoupling은 시각적으로 좋은 primitive 분포와 물리 시뮬레이션에 좋은 discretization이 다를 때, 렌더링용 primitive와 시뮬레이션용 입자를 분리하고 deformation/displacement를 보간해 연결하는 설계다. Gaussian Splashing에서는 고체 object에 대해 3DGS Gaussian은 렌더링용으로 유지하고, NeuS surface mesh 내부에 Poisson disk sampling한 별도 particles를 PBD simulation에 사용한 뒤, GMLS로 simulation deformation을 Gaussian에 전달한다.

## Why It Matters
3DGS Gaussian은 이미지 재구성에 최적화되므로 표면/edge/texture가 복잡한 곳에 불균일하고 anisotropic하게 분포한다. 이런 분포는 렌더링에는 좋지만, 충돌, 내부 부피, 얇은 구조, boundary coverage가 중요한 시뮬레이션에는 나쁠 수 있다. 반대로 uniform simulation particle은 렌더링 detail과 adaptive texture 표현을 해칠 수 있다. 따라서 완전한 unified primitive를 강제하기보다, task별로 좋은 sampling을 유지하고 둘 사이를 안정적으로 연결하는 것이 더 나은 선택일 수 있다.

## Where It Appears
- Sec. 4.2: 고체에서 3DGS kernel을 simulation과 rendering에 같이 쓰면 surface-biased distribution, 내부 particle 부족, uneven sampling 문제가 생긴다고 설명한다. (p.5)
- Sec. 4.2: foreground object를 NeuS로 surface reconstruction하고, Poisson disk sampling으로 simulation particles를 내부에 배치한다. (p.5)
- Sec. 4.2 / Supplement Sec. 8: 각 frame마다 simulation particles의 displacement/deformation gradient를 GMLS로 trained Gaussian kernels에 보간한다. (p.5, p.14)
- Fig. 11: Gaussian density grid 기반 sampling은 chair leg/seat를 거의 sampling하지 못하지만, NeuS reconstruction 내부 sampling은 더 균일한 coverage를 제공한다. (p.13)

## Mechanisms
- 렌더링 set `S_r`: trained 3DGS Gaussian kernels. Adaptive density, anisotropic covariance, material parameter를 유지한다.
- 시뮬레이션 set `S_s`: NeuS mesh 내부에서 Poisson disk sampling된 particles. Boundary/interior coverage와 collision robustness를 목표로 한다.
- 초기화 시 각 렌더링 Gaussian `p_{r,i}`에 대해 가까운 simulation particles `p_{s,j}`의 neighbor set `N(i)`를 찾는다.
- simulation time step `n`에서 `p_{s,j}^n`가 움직이면, pre-built GMLS kernel로 `p_{r,i}`의 position과 deformation gradient를 보간한다.
- 렌더링 Gaussian은 보간된 deformation gradient로 covariance/normal을 갱신하고, 기존 3DGS/PBR pipeline으로 splat된다.

## Failure Modes / Bias
- NeuS surface reconstruction이 틀리면 simulation particles의 boundary/interior도 틀린다.
- GMLS 보간은 smooth deformation에는 좋지만 fracture, contact discontinuity, topology change에서는 motion을 과도하게 매끈하게 만들 수 있다.
- 렌더링 Gaussian과 simulation particle의 support가 크게 다르면 thin structure나 high-frequency deformation이 제대로 전달되지 않을 수 있다.
- Decoupling은 완전한 WS2 원칙을 약화한다. 실제로 보이는 Gaussian과 실제로 simulate되는 particle이 다르기 때문에 해석 가능성이 떨어질 수 있다.

## Open Questions
- 3DGS residual, opacity uncertainty, covariance anisotropy를 이용해 NeuS 없이 simulation-ready particles를 만들 수 있는가?
- GMLS 대신 contact-aware 또는 discontinuity-aware interpolation을 쓰면 fracture/impact 장면에서 artifact를 줄일 수 있는가?
- 렌더링 분포와 시뮬레이션 분포를 동시에 최적화하는 co-design loss를 만들 수 있는가?
- Decoupled representation에서 mass/density/material parameter를 어떤 primitive에 귀속해야 하는가?
