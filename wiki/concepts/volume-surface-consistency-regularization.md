---
type: "concept"
slug: "volume-surface-consistency-regularization"
title: "Volume-Surface Consistency Regularization"
status: "draft"
modified_at: "2026-07-01T11:20:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\MILo.pdf"
tags:
  - "regularization"
  - "surface-reconstruction"
  - "depth-normal-consistency"
  - "gaussian-splatting"
---

# Volume-Surface Consistency Regularization

## Definition
volumetric representation(Gaussian)과 거기서 추출한 surface mesh가 **같은 geometry를 갖도록** 서로의 rendering을 비교해 정규화하는 loss 묶음. 대표적으로 (1) 두 representation의 depth/normal을 일치시키는 consistency loss, (2) surface가 침식되지 않게 하는 anti-erosion, (3) occluded 내부를 비우는 interior regularization으로 구성된다.

## Why It Matters
- **cheating 억제:** GS/NeRF는 opacity·색으로 image만 맞추며 floater·cavity를 만든다. mesh를 기준으로 volumetric을 되끌면 이런 hallucination이 줄어든다.
- **thin structure 보존:** naive isosurfacing은 얇은 구조를 침식·소실시킨다. erosion을 penalize하면 fence·spoke·vegetation이 살아남는다.
- **downstream 조건 encode:** watertight·empty interior 같은 실사용 요건(물리 시뮬·애니메이션)을 loss로 직접 요구한다.

## Where It Appears
- [[milo]] (MILo):
  - `L_MD = Σ log(1+|D − D_M|)` (Gaussian depth vs mesh depth), `L_MN = Σ(1 − Ñ·N_M)` (depth-normal vs mesh face normal).
  - `L_erosion = Σ max(0, f_{μ_g})`: 샘플된 Gaussian center의 SDF를 음수(내부)로 밀어 tetrahedron 전체가 양수가 되는 소실을 방지. center에만 적용해 collapse 회피.
  - `L_interior = Σ H(σ(−f_p), o_p)·o_p`: mesh depth로 만든 occupancy label로 내부 정점 SDF를 음수 강제 → 속 빈 watertight mesh.
- 관련: 2DGS/RaDe-GS의 depth-normal consistency, SuGaR의 surface-align regularization(단 volumetric↔mesh 양방향은 아님).

## Mechanisms
1. **양방향 rendering 비교:** Gaussian rendering의 depth/normal ↔ mesh rasterization의 depth/normal을 pixel 단위로 매칭.
2. **robust depth term:** `log(1+|·|)`로 큰 오차의 영향을 완화.
3. **부호 기반 anti-erosion:** 특정 정점(Gaussian center)의 SDF 부호를 강제해 surface가 존재해야 할 곳을 유지.
4. **occlusion-aware occupancy:** 모든 view의 mesh depth 뒤에 있으면 inside로 라벨 → cross-entropy로 내부를 음수 SDF로. label은 수 초에 갱신(200 iter마다).

## Failure Modes / Bias
- **over-smoothing:** normal consistency를 강하게 주면 mesh가 매끈해지며 F1 등 수치가 오히려 내려갈 수 있다(정성-정량 괴리).
- **occlusion label 오류:** depth map noise나 sparse view에서 occupancy 판정이 틀리면 잘못된 내부/외부 강제.
- **center-only erosion의 한계:** center 이외 정점의 침식은 직접 막지 못함 — 여전히 얇은 부분이 사라질 여지.
- **하이퍼파라미터 민감:** λ_MD/λ_MN/λ_erosion/λ_interior 균형이 scene마다 다를 수 있다.

## Open Questions
- depth·normal 외에 어떤 surface 신호(curvature, silhouette)를 consistency에 넣으면 이득인가?
- erosion을 center-only 대신 전 정점에 안전하게 확장하는 방법은?
- occupancy label을 sparse-view에서도 신뢰할 수 있게 만드는 방법은?
