---
type: "concept"
slug: "accumulated-perpixel-gradient-densification"
title: "Accumulated Per-Pixel Gradient Densification"
status: "draft"
modified_at: "2026-07-10T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\GOF_Gaussian Opacity Fields - Efficient Adaptive Surface Reconstruction in Unbounded Scenes.pdf"
tags:
  - "densification"
  - "3d-gaussian-splatting"
  - "gradient-metric"
  - "under-reconstruction"
---

# Accumulated Per-Pixel Gradient Densification

## Definition
3DGS densification에서 clone/split 대상을 고를 때, 기존처럼 pixel gradient를 먼저 합산한 뒤 norm을 취하는(`‖Σ_p ∂L/∂x‖`) 대신, **각 pixel gradient의 norm을 먼저 취해 누적**하는(`Σ_p ‖∂L/∂x‖_p`) metric. 서로 다른 pixel의 gradient가 상쇄되어 densify가 안 되는 under-reconstruction 영역을 훨씬 잘 식별한다.

## Why It Matters
표준 3DGS의 view-space position gradient norm은 한 Gaussian이 덮는 pixel들의 gradient가 방향이 엇갈려 상쇄되면 크기가 작아진다 — blurry glass·복잡한 outdoor처럼 실제로는 더 쪼개야 하는 영역이 오히려 densification에서 누락된다. per-pixel norm을 먼저 취하면 부호 상쇄가 사라져, 재구성 오차가 큰 영역이 그대로 큰 metric으로 드러난다. GOF에서 NVS(특히 outdoor LPIPS)와 geometry F1을 함께 끌어올리는 저비용 개선.

## Where It Appears
- Sec. 3.3, Eq. 14-15: 기존 metric `‖Σ_p ∂L/∂x‖`의 상쇄 문제 지적 후 `Σ_p ‖∂L/∂x‖_p`로 수정. threshold τ_x 초과 시 densify. (p.5)
- Fig. 4: 3DGS/Mip-Splatting에 이 densification을 붙이면 유리 영역까지 faithful하게 렌더. (p.5)
- Table 5: 3DGS/Mip-Splatting에 적용 시 Mip-NeRF360 NVS(특히 LPIPS) 대폭 개선. (p.9)
- Table 4 (G vs H): 이 densification 제거 시 TnT F1 0.46→0.44 — geometry에도 기여. (p.8)
- 부록 A: clone된 Gaussian이 뭉치는 문제를 sampling 기반 clone으로 완화(Fig. 11). (p.12)

## Mechanisms
- Gaussian이 기여한 각 pixel `p`에서 view-space position gradient `∂L/∂x`의 **norm**을 계산.
- 이 per-pixel norm을 Gaussian별로 누적 → densification metric.
- metric이 threshold를 넘으면 clone(작은 Gaussian) 또는 split(큰 Gaussian).
- (보조) clone 시 같은 위치 대신 Gaussian 분포에서 sampling해 클러스터링 방지.

## Failure Modes / Bias
- norm-먼저 방식은 항상 ≥ 합산-후-norm이라, over-densification으로 primitive 수가 늘 수 있음(논문은 opacity threshold를 0.005→0.05로 높여 개수 보정).
- 여전히 gradient magnitude 기반 heuristic → 진짜 필요 영역과 단순 고빈도 texture를 구분하지 못할 수 있음.
- 저관측 영역은 애초에 gradient 신호 자체가 약해, 이 metric으로도 densify가 안 될 수 있음(관측 부족 문제는 별개).

## Open Questions
- gradient magnitude가 아니라 관측 수·uncertainty를 결합한 densification이 저관측 배경에 더 유효한가?
- per-pixel norm 누적을 anisotropy·rank 신호와 결합하면([[rank-aware-gaussian-densification]]) primitive 수와 품질 trade-off가 개선되는가?
- over-densification을 opacity threshold 조정이 아니라 metric 자체에서 억제할 수 있는가?
