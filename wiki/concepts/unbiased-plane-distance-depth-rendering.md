---
type: "concept"
slug: "unbiased-plane-distance-depth-rendering"
title: "거리·법선 분할에 의한 무편향 깊이 렌더링 (Unbiased Plane-Distance Depth Rendering)"
status: "draft"
modified_at: "2026-08-19T18:36:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\PGSR_Planar-based Gaussian Splatting for Efficient.pdf"
tags:
  - "depth-rendering"
  - "gaussian-splatting"
  - "surface-reconstruction"
  - "alpha-blending-bias"
  - "planar-primitive"
---

# 거리·법선 분할에 의한 무편향 깊이 렌더링

## Definition

깊이를 직접 α-blend하지 않고, **평면까지의 거리 맵**과 **법선 맵**을 각각 α-blend한 뒤 나누어 깊이를 얻는 렌더 방식. 두 맵에 공통으로 곱해진 누적 가중치가 나눗셈에서 상쇄되어, 결과 깊이가 광선–평면 교점에 정확히 놓인다 (PGSR Eq. 2·3·4, p.5~6).

```
N = Σ Rcᵀ n_i α_i Π(1−α_j)          법선 맵      (Eq. 2)
D = Σ d_i α_i Π(1−α_j)              거리 맵      (Eq. 3)
D(p) = D / (N(p) K⁻¹ p̃)             깊이         (Eq. 4)
```

여기서 `d_i = (Rcᵀ(μ_i − Tc))ᵀ (Rcᵀ n_i)` 는 카메라 중심에서 i번째 Gaussian 평면까지의 거리.

## Why It Matters

기존 `D = Σ T_i α_i z_i` 방식에는 두 가지 편향이 있다.

1. **형상 불일치**: z를 blend하면 결과 깊이 곡면이 굽어, 평평한 Gaussian 모양과 충돌한다 (Fig. 2a).
2. **크기 편향**: 광선의 누적 가중치 합이 1보다 작으면 깊이가 **과소평가**된다 — 표면이 카메라 쪽으로 당겨진다.

이 편향은 깊이를 기반으로 하는 모든 하류 감독(법선 일관성, 다중 뷰 homography, TSDF 융합)을 오염시킨다. 나눗셈 한 번으로 제거되므로 비용 대비 효과가 크다: PGSR ablation에서 이 렌더를 종전 방식으로 되돌리면 TnT F1 0.52 → 0.38.

## Where It Appears

- **PGSR** (TVCG 2024): 원 제안. Fig. 2(b)에 참 깊이 감독 통제 실험 — 같은 감독을 받아도 PGSR 쪽 Gaussian만 표면에 붙는다
- **AmbiSuR** (ICML 2026): PGSR 기반이므로 이 렌더를 계승
- 대비 계열: 2DGS의 median/expected 깊이 선택(수동, disk-aliasing), GOF의 level set 추출 — [[min-view-opacity-field-levelset]], [[ray-gaussian-intersection-opacity]]
- 하류 활용: [[rendered-depth-normal-supervision]], [[homography-patch-ncc-multiview-consistency]]

## Mechanisms

1. **평면화가 선행 조건**이다. 각 Gaussian이 최소 축으로 눌려 있어야(`L_s`, λ1=100) `n_i`와 `d_i`가 의미를 갖는다. 렌더 방식만 떼어 옮길 수 없다.
2. **법선 부호 결정**: 최소 축은 방향이 둘이라 모호하다. 시선 방향과의 각이 90도를 넘도록 잡아 해소한다.
3. **상쇄의 정확한 위치**: `D`와 `N`이 동일한 `α_i Π(1−α_j)` 계열로 가중되므로, 비율에서 가중치 정규화 인자가 소거된다. 완전한 상쇄는 광선을 따라 평면 파라미터가 일정할 때 성립하며, 서로 다른 평면이 섞이는 화소에서는 근사다.
4. **깊이가 항상 평면 위에 놓인다** — 그래서 렌더 깊이로 세운 homography가 자기일관적이 되고, 가림 게이트([[reprojection-error-gated-occlusion-weighting]])의 φ가 의미를 갖는다.

## Failure Modes / Bias

- **강한 평면화를 전제**하므로 곡률이 큰 표면·얇은 구조에서 근사 오차가 커진다. 프리미티브 유형 축(3D 대 평면)의 대가다
- 서로 다른 깊이의 평면이 겹치는 화소(에지, 반투명)에서는 blend된 `N`이 어느 평면도 대표하지 않아 나눗셈이 무의미한 값을 낸다. PGSR이 별도 깊이 필터(θ>80도)를 두는 이유
- `N(p)·K⁻¹p̃`가 0에 가까워지는 **스치는 시선(grazing view)** 에서 수치적으로 불안정하다 — 오목 내부·깊은 hole의 벽면이 정확히 이 조건에 해당
- 깊이 자체가 무편향이어도 **평면이 틀린 곳에 있으면** 정확히 틀린 곳의 깊이를 낸다. 무편향은 관측 부족을 해결하지 않는다

## Open Questions

1. 광선을 따라 다중 평면이 섞이는 화소의 비율은 씬마다 얼마인가? 그 화소가 오목·경계에 몰려 있는가
2. grazing view 불안정성이 깊이 필터(θ>80도)로 잘려나가는 양은 얼마이며, 그 손실이 오목 부위 재구성 실패의 몇 할을 설명하는가
3. 평면화 강도(λ1)를 낮추면 무편향성이 언제 깨지는가 — 곡면 물체 무대에서 이 trade-off의 위치
