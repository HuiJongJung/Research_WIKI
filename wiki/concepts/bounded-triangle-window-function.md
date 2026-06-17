---
type: "concept"
slug: "bounded-triangle-window-function"
title: "Bounded Triangle Window Function"
status: "draft"
modified_at: "2026-06-17T07:08:31.638206+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Triangle Splatting.pdf"
tags:
  - "window-function"
  - "triangle-splatting"
  - "bounded-support"
  - "differentiable-rasterization"
---

# Bounded Triangle Window Function

## Definition
Bounded triangle window function은 projected triangle 내부에서만 nonzero contribution을 만들고, triangle boundary와 외부에서는 정확히 0이 되도록 설계한 differentiable-ish opacity window다. Triangle Splatting에서는 2D triangle SDF `phi(p)`를 incenter value `phi(s)`로 정규화해 `I(p)=ReLU(phi(p)/phi(s))^sigma`로 정의한다.

## Why It Matters
Splatting primitive를 최적화하려면 gradient가 필요하지만, support가 geometry 밖으로 퍼지면 triangle의 표준 rasterization 의미가 깨지고 불필요한 tile/pixel computation이 증가한다. 이 window는 내부 smoothness와 외부 bounded support를 동시에 제공해, differentiable optimization과 mesh/rasterizer compatibility를 연결한다.

## Where It Appears
- Triangle Splatting Eq. 1: normalized SDF ratio 기반 window definition. (p.4)
- Fig. 3: 제안 window와 sigmoid window의 support 차이. (p.4)
- Fig. 7: sigmoid window가 sparse background를 복원하지 못하고, bounded window가 더 안정적인 coverage를 만든다는 ablation. (p.9)
- Supplementary Eq. 4: depth scale 변화에 ratio가 invariant함을 설명한다. (p.15)

## Mechanisms
```text
phi(p) = max_i L_i(p)
L_i(p) = n_i · p + d_i
I(p) = ReLU(phi(p) / phi(s))^sigma
```
- `phi(p)`는 triangle 밖에서 positive, 내부에서 negative, boundary에서 0이다.
- `s`는 triangle incenter이며 `phi(s)`는 내부 최솟값이다.
- 내부에서는 ratio가 0에서 1 사이가 되고, 외부에서는 ReLU 이후 0이 된다.
- `sigma`가 작아지면 더 solid한 triangle에 가까워지고, 커지면 incenter 중심의 부드러운 contribution이 된다.

## Failure Modes / Bias
- `max` SDF는 모든 곳에서 smooth하지 않다. 논문은 LogSumExp approximation보다 정확한 geometry를 택한 셈이다.
- Incenter 중심 window는 triangle 내부 contribution을 특정 모양으로 bias한다.
- Boundary에서 0이므로 opaque hard triangle으로 바로 쓰기 위해서는 opacity/sigma annealing 같은 추가 schedule이 필요하다.
- Depth sorting이 center 기준이면 window가 좋아도 visibility artifact가 남을 수 있다.

## Open Questions
- Bounded support를 유지하면서 edge gradient를 더 안정적으로 만드는 alternative window가 가능한가?
- Per-pixel sorting이나 exact raster visibility와 결합하면 popping artifact를 줄일 수 있는가?
- 같은 아이디어를 quad, disk, polygon, spline patch 같은 다른 primitive에 일반화할 수 있는가?
