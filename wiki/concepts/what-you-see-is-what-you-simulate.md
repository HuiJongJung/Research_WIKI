---
type: "concept"
slug: "what-you-see-is-what-you-simulate"
title: "What You See Is What You Simulate"
status: "draft"
modified_at: "2026-06-02T09:32:16.038657+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Physics-Integrated 3D Gaussians for Generative Dynamics.pdf"
tags:
  - "ws2"
  - "simulation-rendering-unification"
  - "explicit-representation"
  - "physics-based-animation"
---

# What You See Is What You Simulate

## Definition
“What You See Is What You Simulate (WS2)”는 렌더링에 쓰는 visual representation과 물리 시뮬레이션에 쓰는 simulation representation을 가능한 한 같은 discrete primitive로 통일하려는 설계 원리다. PhysGaussian에서는 3D Gaussian kernel이 동시에 렌더링 primitive이자 continuum mechanics/MPM의 material particle 역할을 한다.

## Why It Matters
기존 visual content pipeline은 geometry construction, simulation-ready meshing, physics simulation, rendering을 분리한다. 이 분리는 simulation mesh와 rendered geometry 사이의 resolution mismatch, embedding error, surface/volume inconsistency를 만들 수 있다. WS2는 보이는 primitive와 움직이는 primitive를 통일해 이 중간 변환을 줄이고, static captured scene에 곧바로 physics-based novel motion을 부여할 수 있게 한다.

## Where It Appears
- PhysGaussian Abstract와 Introduction: triangle/tetrahedron meshing, marching cubes, cage mesh, geometry embedding 없이 같은 3D Gaussian kernel을 simulation과 rendering에 사용한다고 주장한다. (p.1-2)
- Fig. 1: “What You Simulate”와 “What You See”가 같은 Gaussian-continuum pipeline 위에 있음을 보여준다. (p.1)
- Fig. 2: 3D Gaussian Splatting과 Physics Integration이 “Gaussian Ellipsoids as Continuum”을 통해 연결된다. (p.3)
- Sec. 3.4: deformed Gaussian을 original GS splatting procedure로 직접 렌더링한다고 설명한다. (p.4)

## Mechanisms
- Static scene을 3DGS로 재구성해 `{X_p, A_p, sigma_p, C_p}`를 얻는다.
- 각 Gaussian kernel을 continuum discretization particle로 본다.
- MPM이 particle position, velocity, deformation gradient, stress 등을 시간 갱신한다.
- 같은 Gaussian state를 다시 splatting renderer에 넣어 novel-view image를 만든다.
- 별도 mesh extraction이나 embedding 없이 simulation state와 rendering state가 같은 primitive identity를 공유한다.

## Failure Modes / Bias
- Visual Gaussian이 실제 mass distribution을 잘 나타낸다는 보장이 없다. 3DGS는 surface appearance에 치우치므로 내부가 비어 있을 수 있다.
- 실제 object volume, density, material boundary가 보이지 않는 영역에서는 WS2가 “보이는 것만 시뮬레이션”하는 한계를 가질 수 있다.
- Gaussian primitive가 sparse하거나 noisy하면 simulation particle로서 안정성이 떨어질 수 있다.
- Rendering fidelity와 physical correctness가 항상 같은 방향으로 최적화되지는 않는다.

## Open Questions
- 3DGS의 opacity, covariance, density-like quantity를 physical mass/volume으로 변환하는 표준 mapping은 가능한가?
- WS2 원리를 surfel, oriented point, neural particle, voxel Gaussian, signed-distance primitive에도 적용할 수 있는가?
- Differentiable simulation과 결합하면 video에서 material parameter와 hidden internal structure를 얼마나 식별할 수 있는가?
- 사용자 편집 도구에서는 WS2가 mesh/cage 기반 editing보다 어느 조건에서 더 예측 가능하고 제어 가능한가?
