---
type: "concept"
slug: "position-based-fluid-gaussian-rendering"
title: "Position-Based Fluid Gaussian Rendering"
status: "draft"
modified_at: "2026-06-22T18:21:59.378155+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\1_Gaussian Splashing; Unified Particles for Versatile Motion Synthesis and Rendering.pdf"
tags:
  - "position-based-fluids"
  - "3d-gaussian-splatting"
  - "fluid-simulation"
  - "surface-tension"
  - "surface-normal"
  - "pbd"
---

# Position-Based Fluid Gaussian Rendering

## Definition
Position-based fluid Gaussian rendering은 PBF(Position-Based Fluids) 입자를 유체 simulation particle이자 splatting/rendering Gaussian으로 사용하는 방식이다. Gaussian Splashing에서는 각 fluid particle에 spherical Gaussian kernel을 두고, PBF의 density constraint와 surface tension으로 motion/surface normal을 계산한 뒤, 이를 3DGS/PBR 렌더링에 넘긴다.

## Why It Matters
유체는 고체보다 rendering primitive와 simulation particle의 통합이 자연스럽다. 유체 입자 자체가 시간에 따라 이동하는 volume/surface sample이고, PBF는 particle 기반으로 incompressibility와 surface tension을 다룬다. 따라서 fluid particle을 Gaussian으로 splat하면 3DGS의 point/ellipsoid rendering과 PBF의 Lagrangian simulation이 비교적 잘 맞물린다. 다만 유체는 반사, 굴절, foam, spray, bubble, surface normal이 중요하므로 vanilla 3DGS alpha compositing만으로는 충분하지 않다.

## Where It Appears
- Sec. 4.3: GSP는 PBF를 Lagrangian fluid synthesizer로 사용하고 density constraint로 incompressibility를 유지한다. (p.5)
- Sec. 4.3 / Supplement Sec. 7.2: surface particle을 neighbor occlusion으로 찾고, density gradient에서 surface normal을 계산한다. (p.5, p.12-13)
- Sec. 4.4: 각 fluid particle에 spherical Gaussian kernel을 만들고, nearest surface particle의 normal을 rendering normal로 사용한다. (p.6)
- Fig. 3: final fluid rendering이 fluid image, thickness, normal, foam intensity로 분해됨을 보여준다. (p.6)
- Fig. 9, Fig. 17-19: droplets, overflow, zero-gravity water sphere처럼 surface tension이 중요한 예시를 보여준다. (p.8, p.16)

## Mechanisms
- PBF density constraint:

```text
C_i^rho = rho_i / rho_0 - 1
        = sum_j (m_j / rho_0) W(p_i - p_j, r) - 1
```

- Surface normal:

```text
n_i = normalize(-∇_{p_i} C_i^rho)
```

- Surface detection: 각 particle을 spherical screen으로 감싸고 neighbor projection의 mask ratio가 낮으면 boundary/surface particle로 판정한다.
- Surface tension: surface neighbor를 normal plane에 투영하고 Delaunay triangulation으로 local area constraint를 만들어 표면 면적을 줄이는 방향으로 projection한다.
- Distance constraint: 너무 가까운 particle을 밀어내 uniform distribution을 유지한다.
- Rendering: particle radius 기반 spherical Gaussian covariance, PBF surface normal, specular material, thickness-based diffuse/refraction approximation을 결합한다.

## Failure Modes / Bias
- PBF는 constraint projection 기반이라 robust하지만 물리 정확도는 제한적이다.
- Surface detection은 neighbor distribution, particle radius, screen discretization threshold에 민감할 수 있다.
- Surface normal이 PBF density gradient에 의존하므로 sparse/violent splash에서 불안정할 수 있다.
- 유체를 spherical Gaussian으로 두는 것은 simulation에는 편하지만 thin sheet, complex caustics, multi-layer refraction을 정확히 표현하지 못한다.
- Surface tension triangulation은 local surface가 잘 정의된다는 가정에 의존한다.

## Open Questions
- Fluid Gaussian의 covariance를 spherical로 고정하지 않고 flow/surface curvature에 따라 adaptive하게 바꾸면 렌더링이 좋아지는가?
- PBF surface normal을 multi-view rendering loss로 보정할 수 있는가?
- SPH/FLIP/MPM 기반 유체에서도 Gaussian rendering primitive와 같은 수준으로 자연스럽게 결합할 수 있는가?
- Foam/spray/bubble particle의 generation을 learned model이나 differentiable rendering feedback으로 조정할 수 있는가?
