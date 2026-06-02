---
type: "concept"
slug: "opacity-field-internal-filling"
title: "Opacity-Field Internal Filling"
status: "draft"
modified_at: "2026-06-02T09:33:25.979968+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Physics-Integrated 3D Gaussians for Generative Dynamics.pdf"
tags:
  - "internal-filling"
  - "opacity-field"
  - "3d-gaussian-splatting"
  - "volumetric-simulation"
  - "material-point-method"
---

# Opacity-Field Internal Filling

## Definition
Opacity-field internal filling은 3D Gaussian의 opacity와 covariance로 continuous 3D opacity field를 구성한 뒤, threshold crossing과 ray intersection test로 object 내부 grid를 찾아 additional simulation particles를 채우는 방법이다. PhysGaussian에서는 surface-biased 3DGS를 volumetric MPM simulation에 더 적합하게 만들기 위한 optional step으로 쓰인다.

## Why It Matters
3DGS reconstruction은 보이는 surface appearance를 잘 맞추지만 object 내부 구조는 관측되지 않기 때문에 hollow shell처럼 남을 수 있다. Volumetric object를 hollow particles만으로 시뮬레이션하면 gravity나 deformation에서 비현실적으로 collapse할 수 있다. Internal filling은 visual Gaussian 분포로부터 내부 candidate를 추정해, MPM에서 volume preservation과 material-parameter control이 작동할 수 있는 particle support를 만든다.

## Where It Appears
- Sec. 3.7 Eq. 11: Gaussian opacity field `d(x)`를 정의한다. (p.5)
- Fig. 2: “3D Gaussian Kernel Filling”이 optional step으로 pipeline에 포함된다. (p.3)
- Fig. 6: internal filling이 없는 object는 gravity 아래 collapse하고, filling이 있는 경우 Young's modulus와 Poisson ratio 변화에 따른 material behavior control이 가능함을 보인다. (p.8)
- Limitation/Future work: internal filling을 generative model로 대체하면 더 realistic한 내부 표현이 가능할 수 있다고 언급한다. (p.5)

## Mechanisms
- 각 Gaussian의 opacity `sigma_p`와 covariance `A_p`를 이용해 `d(x)=sum_p sigma_p exp(-1/2 (x-x_p)^T A_p^{-1}(x-x_p))`를 만든다.
- Continuous field를 3D grid에 discretize한다.
- User-defined threshold `sigma_th`를 기준으로 low-opacity cell에서 high-opacity cell로 넘어가는 ray crossing을 surface intersection으로 본다.
- 6축 ray casting으로 candidate internal grid를 찾고, 추가 ray의 intersection number로 selection을 refine한다.
- 채워진 particle은 가까운 Gaussian에서 opacity와 SH coefficient를 상속한다.
- Covariance는 particle volume에서 계산한 isotropic radius로 초기화한다.

## Failure Modes / Bias
- Threshold `sigma_th` 선택에 민감할 수 있다.
- Thin structure, open surface, incomplete reconstruction, noisy Gaussian distribution에서는 내부/외부 판별이 불안정할 수 있다.
- 가까운 surface Gaussian에서 appearance를 상속하기 때문에, 큰 deformation 후 내부가 노출될 때 실제 내부 texture를 보장하지 않는다.
- 내부 density와 material parameter가 실제 object의 heterogeneous structure를 반영한다는 보장이 없다.

## Open Questions
- Opacity field보다 occupancy/density network 또는 diffusion/generative prior로 내부를 채우면 더 안정적인가?
- 내부 particle의 mass, covariance, SH coefficient를 nearest surface Gaussian 상속이 아니라 learned physical prior로 정할 수 있는가?
- Video supervision이나 differentiable simulation을 사용하면 hidden internal structure를 역추정할 수 있는가?
- Internal filling quality를 rendering metric이 아니라 physical plausibility metric으로 평가하려면 어떤 benchmark가 필요한가?
