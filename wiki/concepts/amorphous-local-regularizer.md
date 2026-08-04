---
type: "concept"
slug: "amorphous-local-regularizer"
title: "Amorphous Local Regularizer (Primitive-Selective Prior Injection)"
status: "draft"
modified_at: "2026-07-20T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Revisiting Photometric Ambiguity for Accurate Gaussian-Splatting.pdf"
tags:
  - "selective-regularization"
  - "geometry-prior"
  - "normal-loss"
  - "gaussian-splatting"
  - "parameter-freezing"
  - "under-constrained"
  - "ambisur"
---

# Amorphous Local Regularizer (Primitive-Selective Prior Injection)

## Definition
geometry prior(여기서는 depth-derived normal)를 **모든 픽셀에 균일하게 걸지 않고, 지목된 소수 primitive에만 거는** 정규화 설계. AmbiSuR의 구현은 세 겹이다:

```
M = Σ_i 𝟙(i ∈ S) · α̃_i ∏_{j<i}(1 − α̃_j)      # 선택된 primitive를 α-blending 그대로 화면에 투영 → soft mask
N = Mean( M · (1 − N_D · N_P) )                # 렌더 depth normal N_D vs prior normal N_P, mask 가중
```
1. **대상 선택**: `S = S_U ∪ S_L` (SH 지표 양단) → [[sh-norm-ambiguity-indicator]]
2. **Parameter Separation**: `S`에 없는 primitive는 **freeze**(gradient 차단). `S` 안에서도 **opacity α와 scaling s는 제외** — 위치·회전 등 표면 관련 속성만 조정.
3. **Amorphous Mask**: 선택 대상이 화면상 연속 영역이 아니라 파편적·이산적으로 흩어져 있으므로(amorphous), 사각 패치 마스크가 아니라 blending 투영으로 부드러운 마스크를 만든다.

## Why It Matters
**균일한 prior 정규화는 이미 정확한 재구성을 훼손한다** — 이것이 이 개념의 존재 이유이며, AmbiSuR Table 4가 정면으로 재는 것이다.

| Item | 구성 | TnT F1 |
|---|---|---|
| D | Trunc + RayColor + Mono prior | 0.566 |
| **F** | D + **Naive**(균일 depth-normal loss) | **0.557** ← 악화 |
| **G** | D + **SHAmbi**(선택적, 같은 loss) | **0.576** ← 개선 |

같은 loss를 어디에 거느냐만으로 **0.557 vs 0.576**. 논문 전체의 주장이 이 한 쌍에 실려 있다. 저자 표현으로 Naive 방식은
> `could even harm the already accurate reconstructions, leading to significant performance drop`

즉 "prior가 강하면 좋다"가 아니라 **"prior는 배분 문제다"**로 프레임을 옮긴다.

부가 효과: prior 품질이 나빠도 손상이 전역으로 번지지 않는다. VGGT(dense depth 품질이 나쁜 범용 모델)를 prior로 써도 DTU Chamfer 0.468로 이전 SOTA를 넘는데, 저자는 이를 **국소성 덕**이라고 설명한다 — (1) metric 정보 의존 제거, (2) 모호 primitive의 파라미터 단위 격리.

## Where It Appears
- **AmbiSuR**(2605.12494): Eq.13–14, §3.3. µ₁=0.1, 7k iteration 이후 적용. DTU ablation(Table 5): Amorphous Mask 제거 시 0.461→0.472, Param Sep 제거 시 0.461→0.470 — **두 장치 각각이 필요**. depth prior 견고성(Table 7): DepthPro 0.459 / DAV2 0.461 / DA3 0.461 / MVSAnywhere 0.463 / VGGT 0.468. → [[ambisur-photometric-ambiguity]]
- 대비군 — 같은 "차등 감독" 축의 다른 설계:
  - **CoMe**: learned confidence `Ĉ`로 photometric/geometric 균형을 **연속 가중**하고 densification 임계값을 조향 → [[learned-confidence-photometric-geometric-balancing]], [[confidence-steered-densification]]
  - **GeoSVR**: Voxel-Uncertainty Depth Constraint. AmbiSuR §F가 "가장 가까운 기법"으로 지목하되, 구조화된 sparse voxel을 전제한다는 점을 차이로 든다.
- prior 자체(depth→normal 변환)는 2DGS 계열의 표준 → [[rendered-depth-normal-supervision]]

## Mechanisms
- **on/off 배분 vs 연속 가중**: 대부분의 선행 연구는 confidence를 곱하는 연속 가중을 쓴다. AmbiSuR은 **이진 선택 + 나머지 freeze**로 간다. 소수(5%)만 건드리므로 계산이 싸고, 잘 된 영역이 원리적으로 오염되지 않는다.
- **파라미터 축 선택**: α와 s를 제외한 것이 디테일 보존의 핵심. normal prior가 opacity/scale까지 밀면 표면이 뭉개진다는 판단.
- **화면 마스크를 blending으로 만드는 이유**: 대상이 3D에서 흩어져 있어 2D bounding box나 semantic segment로는 잡히지 않는다. α-blending 투영은 가림 관계를 자동으로 반영한다.
- **적용 시점(7k)**: 지표가 의미를 가지려면 `moderate reconstruction`이 먼저 형성되어야 한다.

## Failure Modes / Bias
- **선택이 percentile 고정 비율에 묶여 있다**: 모호 영역이 5%보다 넓은 씬에서는 구조적으로 부족하다. 정규화의 상한이 지표가 아니라 상수에 의해 결정된다.
- **freeze의 대가**: `S` 밖 primitive의 gradient를 끊으므로, 그 순간 잘못 굳어 있던 primitive는 `I_SH`가 양단으로 이동하지 않는 한 영영 교정되지 않는다. 지표의 false negative가 곧 **회복 불가 영역**이 된다.
- **prior 자체가 틀린 곳에서의 거동 미검증**: 국소성이 "나쁜 prior의 확산"은 막지만, **지목된 primitive 위치에서 prior가 틀렸을 때** 그것을 정확히 그 자리에 각인시키는 것은 오히려 강화된다. Table 7의 VGGT 결과는 평균 성능일 뿐, 최악 영역의 거동을 말해주지 않는다.
- **normal prior에 한정된 검증**: 저자는 "다양한 prior와 호환"이라 주장하지만(mono/multi-view depth, stereo matching, normal estimation), 실험은 전부 depth→normal 경로다. ordinal depth나 semantic prior에서의 거동은 미검증.
- **`ℒ_geo`와 이중으로 걸린다**: 전역 `ℒ_geo`(τ=0.1)가 이미 모든 곳에 depth prior를 걸고 있고, 그 위에 선택적 `N`(µ₁=0.1)이 얹힌다. 따라서 "선택적 vs 균일"의 대비는 **완전한 대비가 아니라 추가분의 대비**다. Table 4의 F/G 해석 시 이 점을 감안해야 한다.

## Open Questions
1. `S`의 크기를 percentile이 아니라 **물리적 기준**(관측 기하)으로 정하면 성능이 오르는가, 아니면 percentile의 적응성이 본질인가?
2. freeze 대신 낮은 학습률로 완화하면(soft freeze) false negative의 비용이 줄어드는가?
3. α·s 제외가 항상 옳은가 — under-constrained 구역에서는 **오히려 scale을 제약해야** 과팽창이 막힐 수 있다. → [[gaussian-primitive-truncation]]
4. 선택적 배분을 loss가 아니라 **densification 절차**에 적용하면(어디에 primitive를 늘릴지) 같은 이득이 나오는가? AmbiSuR은 densification에 손대지 않는다.
5. Upper와 Lower에 **다른 prior/다른 강도**를 주면 개선되는가? 현재는 합집합에 같은 처방이다.
