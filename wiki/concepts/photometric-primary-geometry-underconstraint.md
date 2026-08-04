---
type: "concept"
slug: "photometric-primary-geometry-underconstraint"
title: "Photometric-Primary Geometry Underconstraint"
status: "draft"
modified_at: "2026-07-01T21:30:00+09:00"
author: "Claude"
language: "ko"
confidence: "medium"
sources:
  - "discussion:2026-07-01-photometric-primary-limit"
  - "discussion:2026-07-01-triangle-splatting-not-a-mesh"
  - "wiki/comparisons/splatting-trends-2025h2-2026h1.md"
  - "wiki/concepts/mesh-in-the-loop-differentiable-extraction.md"
  - "wiki/claims/residual-guided-mesh-refinement-splatting.md"
tags:
  - "concept"
  - "gaussian-splatting"
  - "surface-reconstruction"
  - "geometry-prior"
  - "photometric-loss"
  - "shape-radiance-ambiguity"
  - "thesis-motivation"
---

# Photometric-Primary Geometry Underconstraint

## Definition

Splatting/NeRF 계열이 **2D 이미지에 대한 photometric loss를 주 목표**로 최적화하면, geometry는 목표가 아니라 **부산물**이 된다. 그 결과 표현은 "이 뷰들에서 어떻게 보이는가"에만 집중하고 실제 surface/mesh에는 무관심해진다. 이 개념은 그 한계를 정확히 규정하고, 탈출구가 **primacy(주종관계)의 역전** — 즉 geometry를 주 최적화 대상으로 두고 photometric을 여러 consistency 신호 중 하나로 강등하는 것 — 임을 정리한다.

```text
Photometric-primary (pure GS):  appearance가 주인, geometry는 부산물  -> mesh 엉망
Geometry-primary   (SDF/mesh-in-the-loop):  coherent field/mesh가 주인,
                                            photometric은 consistency 신호 하나  -> geometry 제약
```

## Why It Matters

**★ 파라미터 예산이 이 편향을 수치로 증명한다 (2026-07-14 추가).** 3DGS Gaussian 하나의 파라미터 59개를 쪼개면:

```text
위치 μ  3 + 회전 R 4 + 스케일 S 3 + opacity o 1  =  기하   11개 (19%)
SH θ (degree 3 → 16 basis × RGB)               =  외관   48개 (81%)
                                                  ────────────────
                                                          59개
```

**표현 자체가 외관에 4배 넘는 자유도를 배정한다.** 그런데도 SH는 저차 다항식(x,y,z의 3차식, 각 대역폭 ~60°)이라 고주파 view-dependent를 못 그리고, 그러면 optimizer는 **남은 19%(기하)까지 외관 맞추는 데 동원한다** — 깊이 방향 배치로 가림을 만들어 SH가 못 만드는 각 주파수를 합성하는 것. 즉 "photometric이 geometry를 밀어낸다"는 것은 loss만의 문제가 아니라 **파라미터화 단계에서 이미 결정된 편향**이다. → [[geometry-faked-view-dependent-appearance]]

Photometric loss 하나로는 geometry가 pin되지 않는 이유는 세 겹이다.

1. **Shape-radiance ambiguity.** 학습 뷰들을 동일하게 재현하는 3D 구성은 무수히 많다. photometric loss는 그중 아무거나 고를 뿐, geometric으로 옳은 것을 고를 이유가 없다.
2. **3D 감독의 부재.** 순수 GS는 mesh도 depth GT도 보지 않는다. 뷰 사이(in-between)에서 틀린 geometry는 penalize되지 않는다.
3. **View-dependent 흡수.** floater, 반투명 fudge, view-dependent color가 geometry 오차를 흡수해도 이미지만 맞으면 loss가 벌하지 않는다.

이것이 splatting 분야 전체가 geometry prior를 덧붙여 온 이유다 (2DGS의 disk-flatten + depth/normal reg, SuGaR의 surface 정렬, monocular depth/normal prior, SDF hybrid 등). 즉 진짜 연구 질문은 **"photometric 렌더링 목표에 geometry를 pin하려면 최소 어떤 감독을 더 넣어야 하고, 현재 방법들은 어디서 여전히 appearance에 휘둘리는가"** 이다. [[splatting-trends-2025h2-2026h1]]

## Where It Appears

- **순수 3DGS:** geometry가 부산물. floater/needle/반투명 fudge로 이미지를 맞추고 surface는 흔들린다.
- **Geometry-prior bolt-on (2DGS, SuGaR, depth/normal prior):** photometric-primary는 유지하되 외부 제약을 주입해 완화. prior의 강도만큼만 pin된다.
- **Primacy-flip (SDF-hybrid, mesh-in-the-loop):** geometry(field/mesh)가 주 최적화 대상. coherent field는 floater를 자유롭게 못 놓아 geometry가 구조적으로 제약된다. [[mesh-in-the-loop-differentiable-extraction]], [[milo]], [[gaussian-pivots-learnable-sdf]]
- **경험적 확인 (GSAssistedTriangle):** decoupled 학습에서 삼각형이 이미 잘 복원된 씬의 residual GS는 geometry 구멍이 아니라 **appearance**를 잡았고, 그것을 opaque 삼각형으로 변환하니 baseline이 파괴됐다. photometric-primary residual은 mesh 재료가 아니라는 직접 증거. [[residual-guided-mesh-refinement-splatting]]

## Mechanisms

완화(mitigation)는 세 축이다 — 어느 하나도 photometric loss 자체에서 나오지 않는다.

1. **표현의 구조적 bias:** SDF/occupancy field의 level set은 하나의 coherent surface를 강제한다. Gaussian ellipsoid는 그런 강제가 없다.
2. **Geometric regularizer:** depth/normal consistency, Eikonal(SDF), multi-view consistency, curvature/smoothness.
3. **외부 3D 지식 수입:** monocular depth/normal network(3D로 학습된 prior), depth 센서, template.

Primacy-flip은 (1)을 극대화한다: geometry를 파라미터화의 중심에 두고 photometric을 그 위의 consistency로 쓴다. mesh-in-the-loop은 여기에 (2)를 매 iteration 결합한다.

## Failure Modes / Bias

- **완전한 탈출은 불가능.** RGB 다중뷰만 있으면 shape-radiance ambiguity는 *완화*될 뿐 사라지지 않는다. 유일 geometry를 원하면 바깥 신호(센서/강한 prior)가 필요하다 — 이 "바닥"이 곧 연구 공간이다.
- **Prior 의존.** monocular depth/normal prior가 틀린 영역(반사/투명/textureless)에선 주입한 geometry도 틀린다.
- **비용/안정성.** geometry-primary(특히 mesh-in-the-loop)는 매 iter 추출·rasterize로 무겁고, 초기화·위상 갱신 빈도에 민감하다. [[mesh-in-the-loop-differentiable-extraction]]
- **역할 혼동.** GS를 버릴 필요는 없다 — geometry는 field/mesh가, appearance(view-dependent/fuzzy)는 GS layer가 맡는 **역할 분리**가 건설적 결론이다. [[material-uncertainty-auxiliary-splat-layers]]

## Open Questions (thesis motivation)

- Photometric objective에 geometry를 pin하는 **최소·최적 감독**은 무엇인가? (어떤 regularizer/prior 조합이 가장 적은 비용으로 ambiguity를 줄이나)
- 현재 mesh-in-the-loop들은 정확히 어디서 여전히 appearance에 휘둘리나? (thin structure, 반사/투명, dynamic, textureless)
- geometry-primary core + GS appearance layer의 **dual representation**에서 두 표현의 consistency를 어떻게 강제하나?
- RGB-only의 바닥을 넘으려면 어떤 외부 신호가 실용적으로 최소 비용인가? (learned prior vs 센서 vs template)

## Related WIKI Pages

- [[mesh-in-the-loop-differentiable-extraction]]
- [[gaussian-pivots-learnable-sdf]]
- [[mesh-compatible-radiance-field]]
- [[material-uncertainty-auxiliary-splat-layers]]
- [[splatting-trends-2025h2-2026h1]]
- [[residual-guided-mesh-refinement-splatting]]
