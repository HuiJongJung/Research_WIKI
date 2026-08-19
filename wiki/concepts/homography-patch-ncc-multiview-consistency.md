---
type: "concept"
slug: "homography-patch-ncc-multiview-consistency"
title: "평면 유도 homography 패치 NCC 다중 뷰 일관성 (Homography-Patch NCC Multi-View Consistency)"
status: "draft"
modified_at: "2026-08-19T18:38:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\PGSR_Planar-based Gaussian Splatting for Efficient.pdf"
tags:
  - "multi-view-consistency"
  - "photometric-consistency"
  - "ncc"
  - "homography"
  - "mvs-inspired-regularization"
---

# 평면 유도 homography 패치 NCC 다중 뷰 일관성

## Definition

렌더된 평면 파라미터(법선 `n_r`, 거리 `d_r`)로 두 뷰 사이 homography를 세우고, 그 변환으로 **패치를 warp해 NCC로 비교**하는 다중 뷰 광도 정규화. 전통 MVS의 평면 스윕 patch matching을 3DGS 학습 loss로 옮긴 것 (PGSR Eq. 8·11, p.7~8).

```
H_rn = K_n (R_rn − T_rn n_rᵀ / d_r) K_r⁻¹                        (Eq. 8)
L_mvrgb = (1/V) Σ w(p_r) (1 − NCC(I_r(p_r), I_n(H_rn p_r)))      (Eq. 11)
```

패치는 **7×7 그레이스케일**. `w(p_r)`은 [[reprojection-error-gated-occlusion-weighting]]의 가림 가중.

## Why It Matters

- **다중 뷰 항 중 광도 쪽이 기하 쪽보다 강하다.** PGSR ablation: multi-view photometric 제거 시 F1 0.52 → 0.39, multi-view geometric 제거 시 0.52 → 0.49 (Table IV, p.9). 기하 일관성보다 광도 일관성이 3배 이상 기여
- 사전 학습 prior 없이 **다중 뷰 대응 자체를 감독 신호로 만드는** 경로. "geometric prior 없음"을 지키면서 MVS급 제약을 얻는다
- **모듈 이식성이 실증된 항**이다: 이 multi-view 정규화를 2DGS에 붙이면 TnT F1 0.32 → 0.41(median) / 0.47(expected) (Table I3, p.14)

## Where It Appears

- **PGSR** (TVCG 2024): 원 적용. NCC 유무 비교(Fig. I3)로 밝기 불변성의 필요를 시각 논증
- **AmbiSuR** (ICML 2026): PGSR 기반 계승
- **GausSurf**: patch-match MVS 반복 계열 (미독)
- 전통 MVS 계보: PatchMatch, Gipuma, COLMAP MVS — [[recursive-ransac-multiview-triangulation]]
- 인접: [[dssim-luminance-decoupled-appearance]], [[ssim-three-term-decomposition]]

## Mechanisms

1. **NCC를 쓰는 이유**: 절대 화소차는 밝기 변화에 민감해 고반사 씬에서 무너진다. NCC는 상관계수 기반이라 밝기·대비 변화에 불변 (Fig. I3, p.14). exposure 보정 모델과 역할이 겹치지 않는다 — 하나는 이미지 전역, 하나는 패치 국소
2. **그레이스케일 변환**: 색을 버리고 구조만 본다. "Focusing on geometric details" (p.8)
3. **이웃 프레임 집합을 학습 전에 포즈로 정한다** (보충 §I-A, p.13): 최대 8장, **상대각 30도 이하**, 상대 위치 0.01~1.5. 학습 중에는 매 iteration 하나를 무작위 추출
4. **기하를 광도로 감독한다**: NCC가 좋아지려면 `n_r, d_r`이 맞아야 하므로, gradient가 평면 파라미터를 통해 Gaussian 위치·회전으로 흘러간다

## Failure Modes / Bias

- **좁은 baseline 편향**: 상대각 30도 상한은 시차가 큰 쌍을 버린다. 삼각측량 관점에서는 정보가 가장 많은 쌍을 쓰지 않는 셈이며, 좁은 시차에서는 깊이 오차가 광도 차이로 잘 드러나지 않는다 — 우리 최대 쌍각 판별값과 **재료는 같고 방향이 반대**
- **평면 가정 종속**: `H`가 `n/d`로 만들어지므로 곡률이 큰 표면·오목에서 warp 자체가 부정확하다. 그 결과 φ가 커져 `w→0`이 되고 그 픽셀이 감독에서 빠진다 — **곡률이 자동 배제로 이어지는 경로**
- **텍스처 의존**: 무텍스처 영역에서 NCC는 판별력이 없다(어디로 warp해도 상관이 높다). 4상태 정의의 TEXTURELESS와 정확히 겹치는 실패
- 7×7 고정 패치 — 스케일 적응이 없다
- 렌더 품질을 소폭 떨어뜨린다 (PSNR 26.83 → full 26.73 사이 trade-off; 기하 제약 전반의 성질)

## Open Questions

1. 상대각 상한 30도를 넓히면 무슨 일이 나는가? 성능이 좁은 baseline 선택에 얼마나 의존하는지가 우리 각 기반 논거의 반증/보강 재료
2. 무텍스처 영역에서 NCC 항이 실제로 gradient를 얼마나 흘리는가 — 죽은 감독의 비율
3. 이웃 프레임 선정을 우리 confidence field 기준으로 바꾸면(각이 넓은 쌍을 의도적으로 포함) 오목 회수가 되는가, 아니면 대응 실패로 붕괴하는가
