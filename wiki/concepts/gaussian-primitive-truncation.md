---
type: "concept"
slug: "gaussian-primitive-truncation"
title: "Gaussian Primitive Truncation (γσ Core/Edge Split)"
status: "draft"
modified_at: "2026-07-20T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Revisiting Photometric Ambiguity for Accurate Gaussian-Splatting.pdf"
tags:
  - "gaussian-splatting"
  - "primitive-truncation"
  - "gradient-analysis"
  - "surface-reconstruction"
  - "overblown-gaussian"
  - "ambisur"
---

# Gaussian Primitive Truncation (γσ Core/Edge Split)

## Definition
렌더링 opacity를 계산할 때 Gaussian의 **저opacity 꼬리를 Mahalanobis 거리 `γσ`에서 잘라 버리는** 기법. AmbiSuR의 정의:

```
α̃_T(x) = α · G_core(x) · 𝟙_core ,   𝟙_core = 𝟙(‖x − µ_i‖ ≤ γσ_i),   γ = 2
```

단순한 컷오프처럼 보이지만, 핵심은 **γ를 임의로 고르지 않고 gradient 균형에서 유도한다**는 점이다.

## Why It Matters
꼬리를 자르는 것 자체는 3DGS 가속·압축 구현에서 흔한 관행이다(성능 목적). AmbiSuR이 새로 세우는 주장은 **꼬리가 정확도 문제이며, 그 문제가 되돌릴 수 없는 최적화 편향**이라는 것이다.

핵심 유도(AmbiSuR 부록 A). Mahalanobis 거리 `r`에 대해 covariance gradient 크기와 면적 성장을 곱한 누적 커널:

```
J(r) = r³ · e^(−r²/2)
S_core(r_b) = ∫₀^{r_b} J dr = 2 − e^(−r_b²/2)(r_b² + 2)
S_edge(r_b) = ∫_{r_b}^∞ J dr =     e^(−r_b²/2)(r_b² + 2)      ← 적분 구간이 무한대인데도 유한
η(r_b) = S_core / S_edge = 2e^(r_b²/2)/(r_b²+2) − 1
η(r_crit) = 1  ⇒  r_crit ≈ 1.83
```

**읽는 법**: edge 영역은 화면에서 넓은 면적을 덮지만(면적은 `r`에 비례해 커짐), gradient가 `e^(−r²/2)`로 죽는 속도가 그 성장을 압도한다. 그래서 **edge가 아무리 많은 픽셀을 틀리게 덮어도 그것을 되돌릴 총 gradient는 상한이 있다.** 반면 core는 photometric을 맞추려 계속 팽창 압력을 받는다.

⇒ `r_b > 1.83`에서 **팽창 구동력 > 교정 능력**이 구조적으로 성립한다. 꼬리 과팽창(overblown)은 하이퍼파라미터 실패가 아니라 gradient 기하학의 귀결이며, **약하게 제약된(under-constrained) 영역에 꼬리가 걸치면 더 악화된다**는 것이 AmbiSuR의 논지다.

## Where It Appears
- **AmbiSuR**(2605.12494, **ICML 2026**): Eq.3–5, 부록 A. γ=2 채택(2 > 1.83). PGSR 위에서 TnT F1 0.576(무절단) → 0.589(γ=2). γ=1.5(임계 미만)에서는 core가 gradient를 충분히 못 받아 0.574로 **하락** — 이론과 실측이 부호까지 일치. Table 8에서 γ=2.0~2.5 구간은 경계에서의 Gaussian 값 `G`가 0.04↔0.14로 3.5배 변해도 F1이 안정. Fig.7은 **재학습 없이 절단만 해도** 표면이 개선되는 것을 보인다. → [[ambisur-photometric-ambiguity]]
- 계보(추론): 3DGS 구현들의 3σ 컷오프, opacity 임계 컬링, tile 기반 rasterizer의 bounding 관행. 이들은 전부 **속도** 목적이며 정확도 근거를 제시하지 않는다.

## Mechanisms
- **아키텍처 무관**: 렌더 opacity 계산 한 줄만 바꾼다. 파라미터화·densification·loss 구조를 건드리지 않아 2DGS/GOF/PGSR/MILo 계열 어디에든 얹을 수 있다는 것이 저자 주장(`architecture-agnostic`, 미검증 이식).
- **비용 0**: 추가 파라미터·추가 forward 없음. 오히려 blending에 참여하는 primitive 수가 줄어 약간 빨라질 여지.
- **γ의 두 방향 실패**: 너무 작으면(<1.83) core의 표현력을 깎아 성능이 떨어지고, 너무 크면(→∞) 무절단으로 회귀. 유효 구간이 이론적으로 열려 있다.

## Failure Modes / Bias
- **이론적 무게 대비 실효 이득이 작다**: TnT F1 +0.013(0.576→0.589). 부록 A는 두 페이지 유도를 담지만 ablation 상 기여는 Ray-Color(+0.008)나 SH 지표(+0.010)와 같은 자릿수다.
- **유도가 2D 등방 가정에 기댄다**: `J(r) = r·g(r)`의 면적 인자는 2D 원형 적분이다. 논문도 anisotropic covariance에서는 "방향에 의존하는 상수배까지만" 성립한다고 인정한다. 극단적으로 길쭉한 needle-like Gaussian에서 같은 임계값이 유효한지는 미검증. → [[needle-like-gaussian-artifacts]]
- **NVS 품질과의 상충 가능성**: 꼬리는 부드러운 blending에 기여한다. AmbiSuR의 Mip-NeRF 360 PSNR이 SOTA가 아닌 것에 이 절단이 얼마나 기여했는지는 분리되어 있지 않다.
- **densification과의 상호작용 미분석**: opacity 경로가 바뀌면 gradient 기반 densify 판정도 바뀌지만 논문은 이를 다루지 않는다.

## Open Questions
1. MILo처럼 **매 iteration mesh를 추출**하는 파이프라인에 얹으면 pivot/tetrahedra 추출이 어떻게 반응하는가? 꼬리 제거가 opacity field의 level set을 이동시킬 것이다.
2. anisotropy가 큰 primitive에 대해 `r_crit`을 방향별로 다시 유도하면 γ가 달라지는가?
3. 절단을 **공간적으로 차등화**(잘 제약된 곳은 유지, under-constrained 구역만 강하게 절단)하면 이득이 커지는가? AmbiSuR은 전역 균일 γ를 쓴다.
4. 이 편향 분석은 3DGS 일반에 적용되므로, "꼬리 과팽창"과 floater 생성의 관계를 정량화할 수 있는가?
