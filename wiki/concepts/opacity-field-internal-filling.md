---
type: "concept"
slug: "opacity-field-internal-filling"
title: "Opacity-Field Internal Filling"
status: "draft"
modified_at: "2026-06-02T07:46:01.404764+00:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Physics-Integrated 3D Gaussians for Generative Dynamics.pdf"
tags:
  - "internal-filling"
  - "opacity-field"
  - "volumetric-simulation"
  - "3d-gaussian-splatting"
---

# Opacity-Field Internal Filling

## Definition
Opacity-field internal filling은 3D Gaussian의 opacity를 연속 3D field로 합성한 뒤, threshold crossing과 ray intersection test로 내부 cell을 찾아 volumetric particles를 추가하는 방법이다. 표면 근처에만 분포하는 3DGS를 물리 시뮬레이션에 더 적합한 volume-like representation으로 보강한다.

## Why It Matters
- 3DGS reconstruction은 주로 보이는 표면 appearance를 잘 표현하므로 내부가 비어 있는 shell이 되기 쉽다.
- volumetric object를 hollow shell로 시뮬레이션하면 중력이나 큰 변형에서 collapse 같은 비현실적 결과가 나온다.
- internal filling은 material parameter 변화가 stiffness와 volume preservation으로 드러나게 해준다.

## Where It Appears
- Sec. 3.7 Eq. (11): Gaussian opacity field `d(x)` 정의.
- Fig. 6: internal filling 유무에 따른 dynamics 차이와 Young's modulus `E`, Poisson ratio `nu` 변화의 효과.
- Sec. 4.3: filling이 없으면 물체가 hollow shell처럼 동작하고, filling이 있으면 더 현실적인 material control이 가능하다고 설명한다.

## Mechanisms
- 각 Gaussian의 opacity와 covariance를 이용해 continuous opacity field를 만든다.
- field를 3D grid에 discretize한다.
- 6축 ray casting으로 낮은 opacity에서 높은 opacity로 넘어가는 intersection을 찾는다.
- 추가 ray의 intersection number 조건으로 internal candidate를 refine한다.
- 채워진 particle은 가까운 Gaussian으로부터 opacity와 SH coefficient를 상속하고, covariance는 particle volume에서 계산한 isotropic radius로 초기화한다.

## Failure Modes / Bias
- threshold `sigma_th`와 grid resolution에 민감하다.
- thin structure, open surface, noisy Gaussian, 투명/반사 물체에서 내부/외부 판별이 불안정할 수 있다.
- 가까운 Gaussian에서 appearance를 상속하는 방식은 내부가 노출될 때 실제 내부 texture를 보장하지 않는다.
- filling은 물리적 density inference라기보다 rendering-derived heuristic에 가깝다.

## Open Questions
- internal filling을 learned generative prior나 geometry-aware 3DGS와 결합하면 내부 appearance와 mass distribution을 더 잘 추정할 수 있는가?
- filling particle의 material parameter와 density를 자동 추정하려면 어떤 관측 또는 loss가 필요한가?
- open-world captured scenes에서 foreground segmentation 없이 filling을 안정화할 수 있는가?
