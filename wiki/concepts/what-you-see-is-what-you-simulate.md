---
type: "concept"
slug: "what-you-see-is-what-you-simulate"
title: "What You See Is What You Simulate"
status: "draft"
modified_at: "2026-06-02T07:41:08.688888+00:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Physics-Integrated 3D Gaussians for Generative Dynamics.pdf"
tags:
  - "simulation-rendering"
  - "representation-unification"
  - "ws2"
  - "3d-gaussian-splatting"
---

# What You See Is What You Simulate

## Definition
“What you see is what you simulate (WS2)”는 렌더링에 쓰는 visual representation과 물리 시뮬레이션에 쓰는 simulation representation을 같은 discrete primitive로 통일하는 설계 원리다. PhysGaussian에서는 3D Gaussian kernel이 동시에 렌더링 primitive이자 MPM particle/continuum discretization 역할을 한다.

## Why It Matters
- mesh extraction, tetrahedralization, cage mesh, proxy geometry embedding 같은 중간 단계를 줄인다.
- 시뮬레이션 결과와 렌더링 결과 사이의 resolution mismatch 또는 geometry mismatch를 줄일 수 있다.
- 정적 3D reconstruction 결과를 바로 physics-based generative dynamics로 연결하는 경로를 만든다.

## Where It Appears
- PhysGaussian Fig. 1의 “What You Simulate / What You See” 대비와 Fig. 2 pipeline 전체에서 나타난다.
- 본문 Sec. 1과 Sec. 3.4에서 Gaussian을 continuum discretization으로 직접 보고, 변형된 Gaussian을 splatting으로 직접 렌더링한다고 설명한다.

## Mechanisms
- 정적 scene을 3DGS로 재구성한다.
- Gaussian center/covariance를 continuum deformation map과 deformation gradient로 시간 진화시킨다.
- 같은 Gaussian state를 MPM update와 rendering에 공유한다.
- internal filling은 표면 중심 3DGS를 volumetric physical body에 가깝게 보강하는 optional bridge다.

## Failure Modes / Bias
- 보이는 opacity 분포가 실제 질량/밀도 분포를 대표하지 않을 수 있다.
- hollow surface reconstruction은 volumetric material simulation에 부적합할 수 있어 filling heuristic에 의존한다.
- material parameter가 수동이면 visual plausibility는 높아도 physical identification은 약할 수 있다.
- lighting, shadow, topology-dependent appearance는 같은 primitive 공유만으로 해결되지 않는다.

## Open Questions
- WS2 representation이 differentiable material parameter estimation과 결합될 때 어느 정도 자동화될 수 있는가?
- Gaussian primitive 외에 surfel, voxel, mesh-free point representation에서도 같은 원리가 얼마나 잘 작동하는가?
- physically faithful mass distribution과 visually faithful radiance distribution 사이의 충돌은 어떻게 조정해야 하는가?
