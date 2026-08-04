---
type: "concept"
slug: "sh-norm-ambiguity-indicator"
title: "SH Norm Ambiguity Indicator (Dual-End I_SH)"
status: "draft"
modified_at: "2026-07-20T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Revisiting Photometric Ambiguity for Accurate Gaussian-Splatting.pdf"
tags:
  - "spherical-harmonics"
  - "photometric-ambiguity"
  - "uncertainty-indicator"
  - "gaussian-splatting"
  - "under-constrained"
  - "selective-regularization"
  - "ambisur"
---

# SH Norm Ambiguity Indicator (Dual-End I_SH)

## Definition
3DGS가 이미 학습하고 있는 **고차 spherical harmonics 계수의 제곱 L2 norm**을, 해당 primitive가 겪는 photometric 모호성의 지표로 사용하는 것:

```
C(d) = C̄ + Σ_i β_i Y_i(d)          # C̄ = l=0, view-independent 평균색
I_SH = Σ_i β_i² = ‖f_rest‖²₂
```

구면 위 직교성(또는 Parseval 정리)에 의해 `∫_{S²}|C(d) − C̄|² dω ∝ I_SH`이므로, 이 값은 **view-dependent 색 변화의 총에너지**와 같다. 추가 파라미터·추가 연산이 없어 AmbiSuR은 `free-lunch indicator`라 부른다.

**Dual-End Indication** — 위험은 양쪽 끝에 있다:

| 끝 | 선택 | 논문의 해석 |
|---|---|---|
| Upper (상위 η_U ≈ 5%) | `I_SH > P(1−η_U)` | 모순된 supervision을 받는 중이거나, 부정확한 재구성이 색으로 흡수되는 중 |
| Lower (하위 η_L ≈ 5–10%) | `I_SH < P(η_L)` | **photometric supervision이 애초에 부족했거나 외관이 잘못 구워진 곳** |

## Why It Matters
"`‖f_rest‖`이 view-dependency의 크기"라는 것 자체는 SH 직교성에서 거의 자명하다. 이 개념이 의미를 갖는 지점은 **Lower Indicator의 반직관성**이다.

AmbiSuR 부록 C의 논증: densification이 진행 중인 대부분의 구간에서 primitive 수 `N_t ≪ N*`(충실한 재구성에 필요한 수)이므로, view-independent 파라미터만으로는 지울 수 없는 **구조적 잔차 `E_struct`가 반드시 남는다**.

```
E_struct = P_gt − φ(0; Θ_base) − E_v.d ,   ‖E_struct‖ > 0
min_{Θ_rest} ‖E_struct + E_v.d − Δ_rest(d; Θ)‖
```

optimizer는 이 잔차를 **view-dependent SH에 오버핏시켜 굽는다**. 결과적으로:
- 잘 제약된 Lambertian 표면조차 `I_SH`가 0으로 수렴하지 **않는다**(타협 상태).
- 따라서 `I_SH`가 **비정상적으로 낮다는 것**은 "정말 깨끗한 표면"이 아니라 **"SH를 밀어 올릴 만큼의 photometric 감독조차 못 받았다"**는 신호가 된다.

즉 이 지표는 "기하가 못 푼 오차가 색으로 흡수된다"는 photometric shortcut 서사를 **3DGS 파라미터 공간에서 직접 관측 가능한 양으로 만든 것**이다. → [[geometry-faked-view-dependent-appearance]]

## Where It Appears
- **AmbiSuR**(2605.12494): Eq.8–12, 부록 B(유도)·C(하위 지표 근거). η_U=5%, η_L=10%(DTU, 어두운 조명) / 5%(그 외). 7k iteration 이후부터 사용(그 전에는 재구성이 형성되지 않아 지표가 무의미). Fig.3에서 Upper/Lower 맵이 실제 오차 영역과 겹침을 정성적으로 제시. DTU ablation(Table 5): Naive 0.477 → Dual-End 없음 0.473 → **Lower 단독 0.464 > Upper 단독 0.469** → Full 0.461. 반직관적인 하위 쪽이 더 크게 기여한다. → [[ambisur-photometric-ambiguity]]
- **선택 임계값이 percentile**인 이유: `I_SH` 분포가 iteration마다 빠르게 변해 절대 임계값이 유지되지 않는다(논문 명시).
- 관련 계보: GeoSVR의 Voxel-Uncertainty Depth Constraint(AmbiSuR §F에서 "가장 가까운 기법"으로 직접 비교 — 구조화된 voxel 필요 vs 비구조 3DGS에서 작동), CoMe의 learned confidence `Ĉ`(잔차 기반) → [[learned-confidence-photometric-geometric-balancing]]
- 압축 계열의 adaptive SH degree(메모리 목적으로 "어느 Gaussian이 view-dependency가 필요 없나"를 판정)와는 **목적이 다르다** — 그쪽은 자르기 위해 재고, 여기서는 감독하기 위해 잰다.

## Mechanisms
- **비용 0**: 이미 존재하는 텐서의 norm. forward 추가 없음.
- **primitive 단위 granularity**: 픽셀·뷰 단위가 아니라 Gaussian 단위로 나오므로, 화면상 파편적으로 흩어진 대상을 그대로 겨냥할 수 있다. → [[amorphous-local-regularizer]]
- **동적 재선택**: 매 iteration percentile을 다시 계산. 지표가 흔들려도 소수(5%)만 뽑으므로 전체 품질이 견고하다는 것이 저자 논리.
- **견고성 실측**: η_U 90/95/98% × η_L 5/10/15% 어떤 조합이든 DTU Chamfer 0.461~0.463(Table 9). 2%만 뽑아도 작동.

## Failure Modes / Bias
- **완전한 a posteriori 신호**: 학습된 파라미터이므로 (1) 학습 전에는 존재하지 않고 (2) 7k 이전에는 쓸 수 없으며 (3) optimizer 상태에 따라 변한다. "입력 데이터가 이 지점을 결정하기에 충분했는가"라는 질문에는 원리적으로 답하지 않는다 — 답하는 것은 "현재 최적화 상태가 무엇을 색에 남겼는가"다.
- **global percentile은 물리량이 아니다**: 씬·iteration마다 같은 5%가 다른 것을 가리킨다. 씬 간 비교 불가, 절대 컬러바 공유 불가. 저자도 `statistically indicate`라는 조심스러운 표현을 쓴다.
- **비율이 고정**: 실제 모호 영역이 5%보다 훨씬 넓은 씬(대형 실외·저관측)에서는 구조적으로 부족하고, 아주 깨끗한 씬에서는 멀쩡한 primitive를 억지로 5% 뽑는다. Table 9의 "견고함"은 뒤집으면 **지표의 정밀도가 성능을 크게 좌우하지 않는다**는 뜻이기도 하다.
- **GT 검증이 사후·부분적이다**: Table 11(부록 J)이 mask 안/밖 GT depth error를 재긴 한다(+14~96% vs −0~7%). 그러나 저자 자인대로 **정규화를 끈 30k 최종 시점에서만 측정 가능** — 지표가 실제 쓰이는 중간 시점(7k~)의 유효성은 원리적으로 검증 불가. depth error(2D)지 3D mesh 오차가 아니고, 이진 in/out 비교지 층화가 아니다.
- **관측 결핍 조건에서 Lower는 미검증**: 부록 L의 sparse-view(9뷰) 테스트는 **Upper만** 다룬다. "photometric 감독 부족"을 겨냥한다는 Lower Indicator가 정작 감독이 부족한 세팅에서 검증된 적이 없다. 같은 부록에서 저자는 photometric 제약이 희박하면 자기 기법의 중요도가 `downgrade`된다고 자인.
- **부록 C의 가정 유효 범위**: `N_t ≪ N*`은 최적화 **중간** 상태의 서술이다. 30k 수렴 후에도 하위 지표의 해석이 성립하는지는 논증되지 않았다.

## Open Questions
1. `I_SH` 하위 percentile은 **관측 기하가 퇴화한 영역**(삼각측량각 붕괴 등)과 실제로 얼마나 겹치는가? SfM 통계와의 상관을 재면 두 신호가 같은 것을 보는지 즉시 판정된다.
2. 하위 지표는 "감독 부족"과 "잘못 구워진 외관"을 구분하지 못한다(논문이 둘을 or로 묶는다). 분리 가능한가?
3. Upper와 Lower가 **다른 처방**을 필요로 하는가? AmbiSuR은 둘을 합집합으로 묶어 같은 normal prior를 건다.
4. SH 차수를 **낮추는** 개입(자유도를 빼앗아 잔차를 되살리는 방향)과 SH를 **읽는** 개입(본 지표)은 같은 관찰에서 나온 상반된 처방이다. 어느 쪽이 under-constrained 구역에서 유효한가?
5. `I_SH`가 유효해지는 시점(7k)이 왜 그 값인가 — 더 이르면 왜 실패하는가? 이것이 사후 신호의 구조적 비용을 정량화한다.
