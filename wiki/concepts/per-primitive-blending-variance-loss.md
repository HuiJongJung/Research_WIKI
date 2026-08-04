---
type: "concept"
slug: "per-primitive-blending-variance-loss"
title: "Per-Primitive Blending Variance Loss"
status: "draft"
modified_at: "2026-07-20T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\CoMe - Confidence-Based Mesh Extraction from 3D Gaussians.pdf"
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Revisiting Photometric Ambiguity for Accurate Gaussian-Splatting.pdf"
tags:
  - "variance-loss"
  - "alpha-blending"
  - "view-dependent"
  - "normal-consistency"
  - "gaussian-splatting"
  - "surface-alignment"
---

# Per-Primitive Blending Variance Loss

## Definition
alpha-blending으로 합쳐진 최종 픽셀 값만이 아니라 **개별 primitive의 기여를 직접 제약**해, blending 되는 양(색·normal)의 분산을 줄이는 loss. CoMe는 (1) color variance loss `ℒ_color-var = Σ_i w_i·||sh(θ_i,d) − I||²` (GT 픽셀색 I에 개별 색을 정렬), (2) normal variance loss `ℒ_normal-var = Σ_i w_i·||n_i − N||²` (blended normal N에 개별 normal을 정렬)을 쓴다.

## Why It Matters
표준 3DGS loss는 blended 결과에만 걸리므로, 개별 primitive가 올바른 radiance/방향을 가질 유인이 없다. 이 자유도가 "반투명 표면 뒤에 놓인 매우 불투명한 Gaussian이 시점에 따라 다르게 가려지며 view-dependent 외관을 위조"하는 실패 모드를 허용한다. 개별 primitive를 실제 표면에 색·방향 모두 정렬시키면 이런 spurious geometry가 제거되어 표면 추출 품질이 오른다. NeRF의 per-sample loss(Radiance Surfaces) 아이디어를 3DGS로 옮기되, D-SSIM은 per-primitive로 못 걸리는 문제를 variance loss로 우회한 것.

## Where It Appears
- **CoMe**(2603.24725): Eq.13-14. λ_color-var=0.5, λ_normal-var=0.005. Table 3에서 color-var는 고주파 많은 T&T, normal-var는 평면 많은 ScanNet++에 특히 기여. Fig.4/Fig.13 first-hit/last-hit 시각화로 개별 Gaussian 정렬 효과 확인. → [[come-confidence-based-mesh-extraction]]
- **AmbiSuR**(2605.12494, 2026-05): "Ray-Color Consistency" `R(r) = Σ_i w_i‖c_i − C‖²₂`, µ₂=1e−5, CUDA backward에 구현, densification 종료(15k)까지만 적용(과정규화 회피). → [[ambisur-photometric-ambiguity]]
- 기반: per-sample photometric loss(Radiance Surfaces, Zhang et al. SIGGRAPH'25), depth-normal consistency(2DGS·GOF·SOF). depth distortion loss도 blended depth의 variance loss로 해석 가능.

### CoMe vs AmbiSuR — 같은 계열, 다른 중심

두 논문이 **독립적으로 같은 형태의 loss에 도달했다**(CoMe 2026-03, AmbiSuR 2026-05). 차이는 분산을 재는 **중심점**이다:

| | CoMe `ℒ_color-var` | AmbiSuR `R(r)` |
|---|---|---|
| 중심 | **GT 픽셀색 `I`** | **자기 렌더 평균 `C = E[c]`** |
| 성격 | 정렬(alignment) — 외부 앵커 있음 | 응집(cohesion) — 자기참조 |
| gradient | `sh`와 `α`(w_i 경유) 양쪽 | `c_i`만 (나머지 전부 detach) |
| 적용 구간 | 전 구간 | densification 종료(15k)까지 |
| 가중 | λ=0.5 | µ₂=1e−5 |
| ablation 기여 | T&T에서 뚜렷 | TnT F1 +0.008 (D−C) |

**중심점 차이의 함의(추론)**: CoMe는 GT를 앵커로 쓰므로 개별 primitive를 *정답 쪽으로* 끌지만, GT와 못 맞는 물리 현상(유리·실루엣)에서 잔차를 남긴다. AmbiSuR은 자기 렌더 평균 주위로만 모으므로 GT와의 충돌이 없는 대신, **틀린 색으로 다 함께 수렴해도 벌점이 0이다** — 즉 "일관되게 틀린" 해를 막지 못한다. AmbiSuR이 이 loss를 15k까지만 켜는 것, 가중치를 CoMe의 1/5만분의 1 수준으로 두는 것은 이 자기참조성의 약함과 정합적이다.

## Mechanisms
- **color variance = blended 색 분산 최소화**: I가 blended 색이라는 가정 하에 Σ w_i||sh_i − I||²는 ray를 따른 색 분산과 등가. gradient는 sh와 α(=w_i 경유) 모두로 흐르며, 후행 Gaussian(j>i)에 대한 (1−α_i) 효과까지 backward에서 on-the-fly 계산(SOF의 front-to-back backward 승계).
- **normal variance**: GT가 없으므로 blended normal N을 평균으로 사용. `||n_i−N||²`를 blended normal magnitude의 보수 `(1−T_N) − (1+T_N)||N||²`로 재작성해 forward에서 효율 계산.
- **효과**: first-hit로 렌더한 색·normal이 실제 표면에 정렬 → 표면 뒤 불투명 Gaussian 제거, 매끄러운 normal map(디테일 손실 없이).

## Failure Modes / Bias

**★ 가짜 층과 진짜 층을 구분하지 못한다 (논문 미기재 한계, 2026-07-14 발견)**
`ℒ_color-var`는 **"ray 위에서 색이 다른 primitive들"을 전부 의심**한다. 그런데 그중엔 물리적으로 옳은 것도 있다:
- **유리·투명체**: 유리 표면과 그 뒤 배경은 **색이 달라야 정상**인데, 통일하라고 요구한다 → 못 맞춤 → 잔차 잔존 → `ℒ_conf`가 Ĉ를 낮춰 그 픽셀을 포기 → 유리 자리에 불투명 면이 생김. **CoMe Fig.3 Meetingroom의 창문이 저신뢰(붉은색)로 뜨는 게 이 메커니즘의 지문** — "어려워서"가 아니라 *물리적으로 불가능한 걸 요구받아서* 저신뢰다.
- **실루엣 픽셀**: 물체(빨강) 50% + 배경(파랑) 50% = GT 보라. photometric은 "빨강+파랑"으로 만족하는데 variance는 "둘 다 보라"를 선호 → 경계가 뭉개지는 방향. wᵢ 가중 덕에 전이 픽셀 몇 개에 국한되나 압력 방향은 분명. `λ_color-var`가 normal-var보다 민감한(Table 5) 이유도 이것과 무관하지 않을 것 — 세게 걸면 경계가 무너지고 약하면 트릭을 못 잡아 창이 좁다.

**§5 limitations엔 없지만 §D.5에서 자백한다**: NVS 평가(Table 8) 세팅 설명에 *"we also **disable our variance losses, as they inherently constrain blending**"* → 저자가 blending 표현력 손실을 알고 있으며, **variance loss를 켠 NVS 수치는 논문에 존재하지 않는다**. 즉 "mesh를 위해 rendering을 희생하는 트레이드"인데 논문이 이를 트레이드로 서술하지 않고 "spurious geometry 제거"로만 쓴다. (mesh 목적에선 유리를 면으로 무너뜨리는 게 오히려 바람직할 수 있으나, 그건 의도된 설계가 아니라 부작용이며 논문이 논한 바 없다.)

- color variance는 진짜 view-dependent(거울·물)까지 억누를 수 있어 과도한 평활화 위험(λ 민감도가 normal-var보다 큼, CoMe Table 5).
- I를 "rendered 색"으로 간주하는 가정 — 실제 GT와의 괴리가 크면 신호가 부정확.
- blended normal N을 타깃으로 삼으므로, blended normal 자체가 틀리면(초기 orientation 오류) 잘못된 합의로 수렴 가능.

## Open Questions
- 진짜 view-dependent 영역과 위조 geometry를 variance loss가 구분할 수 있는가, 아니면 confidence로 게이팅해야 하는가?
- normal variance의 "blended normal 합의"가 under-constrained 주변부에서 오히려 틀린 평면으로 붕괴시키지 않는가?
- per-primitive 제약과 mesh-in-the-loop 양방향 일관성(MILo) 중 어느 쪽이 표면 정렬에 더 근본적인가? → [[mesh-in-the-loop-differentiable-extraction]]
