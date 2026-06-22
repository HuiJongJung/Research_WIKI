---
type: "concept"
slug: "thickness-based-specular-fluid-splatting"
title: "Thickness-Based Specular Fluid Splatting"
status: "draft"
modified_at: "2026-06-22T18:22:21.010694+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\1_Gaussian Splashing; Unified Particles for Versatile Motion Synthesis and Rendering.pdf"
tags:
  - "fluid-rendering"
  - "pbr"
  - "gaussian-splatting"
  - "specular"
  - "refraction"
  - "beer-law"
  - "thickness"
---

# Thickness-Based Specular Fluid Splatting

## Definition
Thickness-based specular fluid splatting은 유체 입자를 Gaussian/ellipsoid로 splat하면서, additive splatting으로 얻은 fluid thickness와 PBR material parameter를 이용해 투명성, 흡수, 반사 highlight를 근사하는 렌더링 방식이다. Gaussian Splashing에서는 specular term은 GaussianShader식 `d + s ⊙ L_s`로, 굴절/흡수는 Beer’s law 형태의 thickness-dependent diffuse color로 처리한다.

## Why It Matters
물은 diffuse color만으로 렌더링하면 연기나 반투명 blob처럼 보이기 쉽다. 움직이는 유체의 설득력은 표면 normal, specular highlight, thickness에 따른 배경 감쇠, foam/spray/bubble cue에 크게 의존한다. 3DGS는 빠른 splatting에는 강하지만, vanilla color/SH representation은 유체의 동적 반사와 굴절을 잘 설명하지 못한다. GSP의 방식은 물리적으로 완전한 광선 추적은 아니지만, 3DGS pipeline 안에서 유체성을 살리는 실용적 approximation이다.

## Where It Appears
- Sec. 3.2: GaussianShader의 material decomposition을 소개한다. (p.3-4)
- Sec. 4.4: 유체 Gaussian에 specular material `s_p = 1`, roughness `rho_p = 0.05`를 주고, thickness-dependent diffuse color를 사용한다. (p.6)
- Fig. 3: fluid thickness, normal, foam intensity가 final fluid render의 별도 component로 나타난다. (p.6)
- Fig. 5: specular highlight가 없는 fluid는 smoke-like하게 보이며, specular term이 realistic dynamic fluid appearance에 중요함을 보여준다. (p.7)
- Conclusion: 논문은 현재 fluid rendering이 refraction 같은 real-world light transport를 물리적으로 처리하지 못한다고 한계로 밝힌다. (p.8)

## Mechanisms
- GaussianShader식 color:

```text
c_p(r_i) = d_p + s_p ⊙ L_s(r_i, n_p, rho_p)
```

- Fluid specular material: 모든 fluid Gaussian에 높은 specular와 낮은 roughness를 준다.

```text
s_p = 1, rho_p = 0.05
```

- Thickness 계산: alpha blending 대신 additive splatting을 사용해 view-dependent fluid thickness `tau`를 얻는다.
- Beer’s law 기반 diffuse/refraction approximation:

```text
d_p = exp(-k tau_p) c_p^bg
```

- Background back-projection: refraction처럼 보이도록 background lookup에 `beta n_p` 방향 왜곡을 추가한다.
- Opacity: transmission/refraction 효과를 diffuse color에 넣었기 때문에 `sigma_p = 1`로 둔다.
- Foam/spray/bubble: 별도 particles와 additive splatting kernel로 foam intensity image를 만들고 final composition에 더한다.

## Failure Modes / Bias
- 실제 refraction, caustics, multiple scattering, internal reflection을 풀지 않는다.
- Thickness와 background back-projection은 camera/view dependent approximation이라 multi-view physical consistency가 제한될 수 있다.
- Normal quality가 나쁘면 specular highlight가 불안정하거나 flicker가 생길 수 있다.
- `k`, `beta`, roughness 같은 parameter 선택이 장면별 외관에 큰 영향을 줄 수 있다.
- Opacity를 1로 두고 diffuse color로 transmission을 흉내내는 방식은 복잡한 layered transparent scene에서 한계가 있다.

## Open Questions
- Thickness-based approximation을 differentiable multi-view supervision으로 보정해 view consistency를 높일 수 있는가?
- PBF surface normal 대신 rendered normal/learned normal field를 쓰면 specular flicker를 줄일 수 있는가?
- Gaussian splatting 안에서 더 물리적인 refraction ordering이나 multi-layer transparency를 처리할 수 있는가?
- Foam/spray/bubble을 별도 heuristic particle이 아니라 simulation/rendering loss와 함께 최적화할 수 있는가?
