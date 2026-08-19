---
type: "concept"
slug: "reprojection-error-gated-occlusion-weighting"
title: "왕복 사영 오차 기반 가림 게이트 (Reprojection-Error-Gated Occlusion Weighting)"
status: "draft"
modified_at: "2026-08-19T18:35:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\PGSR_Planar-based Gaussian Splatting for Efficient.pdf"
tags:
  - "occlusion-estimation"
  - "multi-view-consistency"
  - "supervision-weighting"
  - "self-consistency"
  - "in-training-confidence"
---

# 왕복 사영 오차 기반 가림 게이트

## Definition

다중 뷰 감독 항에서, 어떤 픽셀을 감독에 포함할지를 **그 픽셀을 이웃 뷰로 사영했다가 되돌려 왔을 때의 위치 오차**로 정하는 픽셀별 가중 기법. PGSR의 "geometric occlusion estimation"이 대표 사례다 (Eq. 9·10, p.7).

```
φ(p_r) = ‖p_r − H_nr H_rn p_r‖         왕복 사영 오차 (픽셀 단위)
w(p_r) = 1/exp(φ)   if φ < 1
       = 0          if φ ≥ 1
```

`w`는 multi-view 기하 항(Eq. 9)과 multi-view 광도 NCC 항(Eq. 11)에 **공통으로** 곱해지고, gradient는 detach된다. 사영 변환 `H`는 그 픽셀에서 렌더된 평면 파라미터(거리 `d_r`, 법선 `n_r`)로 세운다.

## Why It Matters

- **효과가 지배적이다.** PGSR TnT ablation에서 이 게이트만 제거하면 F1 0.52 → 0.28, PSNR 26.73 → 21.70. multi-view 정규화를 통째로 빼는 것(0.32)보다 **더 나쁘다.** 가림 처리 없는 다중 뷰 감독은 안 하느니만 못하다는 뜻이다.
- **"학습 중 confidence"의 최소 구현**이다. 학습 가능한 파라미터도, 사전 학습 모델도, 외부 prior도 없이, 자기가 렌더한 기하만으로 픽셀별 신뢰도를 만든다.
- 감독 배분 연구에서 **비교 기준선**이 된다: 어떤 학습-전 판별값이든 "이것보다 나은가"를 물을 수 있다.

## Where It Appears

- **PGSR** (TVCG 2024): Eq. 9·10. 임계 1픽셀, 지수 감쇠. 두 multi-view 항에 공통 적용
- **전통 MVS**: left-right consistency check로 폐색 화소를 걸러내는 관행의 계승 (PGSR 스스로 MVS를 인용원으로 든다)
- 대비 계열 — 학습된 confidence: [[learned-confidence-photometric-geometric-balancing]], 노출 신뢰도: [[exposure-reliability-weighted-geometric-supervision]], 공가시성 횟수: [[covisibility-count-weighted-supervision]]

## Mechanisms

1. **자기참조**: 판정 재료가 외부 신호가 아니라 **현재 추정 기하 자신**이다. 그래서 학습 초기에는 대부분의 픽셀에서 φ가 크고, 기하가 좋아질수록 게이트가 열린다 — 암묵적 커리큘럼이 생긴다.
2. **비대칭 처리**: φ가 임계를 넘으면 감쇠가 아니라 **완전 배제**(w=0). 잘못 배제해도 손해가 없다는 가정 위에 서 있다.
3. **detach**: 가중 자체에 gradient를 흘리지 않으므로, 모델이 "가중을 낮춰 loss를 줄이는" 퇴화 해를 찾지 못한다.
4. **평면 파라미터 경유**: `H`가 `n/d`로 구성되므로 게이트는 가림뿐 아니라 **평면 가정 위반**에도 반응한다.

## Failure Modes / Bias

- **가림과 기하 오차를 구분하지 못한다.** 논문 자인: "If these pixels are mistakenly identified as occluded due to geometric errors, it does not affect our final convergence" (p.8) — 구분 불가를 인정하고 수렴 논거로 넘긴다. 근거 실험은 없다.
- **순환성**: 기하가 틀린 곳에서 게이트가 닫히고, 닫히면 다중 뷰 감독이 사라져 고쳐질 경로가 줄어든다. 자기실현적 실패가 가능하다.
- **오목·비평면 편향**: 평면 유도 homography를 쓰므로 오목·굴곡 영역에서 φ가 구조적으로 커진다. **가림 게이트가 곡률 게이트로도 작동**한다 — 정확히 관측이 어려운 곳이 감독에서 먼저 빠진다.
- **임계 1픽셀이 고정값**이다. 해상도·물체 거리·씬 규모에 따라 의미가 달라지는데 민감도 분석이 없다.
- **씬 편차가 크다**: 제거 시 Caterpillar 0.44→0.03(붕괴), Courthouse 0.20→0.17(경미). "절반"이라는 평균 서술은 씬별 실상을 가린다 (Table I1, p.14).

## Open Questions

1. `w=0` 픽셀의 공간 분포는 실제 가림 영역과 얼마나 겹치는가? 렌더 시 w 맵을 덤프하면 바로 측정된다
2. 학습 전 촬영 기하로 만든 판별값과 이 게이트가 같은 픽셀을 가리키는가, 다른 픽셀을 가리키는가? 겹치면 "미리 알 수 있었다"의 증거, 갈리면 상보성의 증거
3. 배제(w=0) 대신 **저가중 유지**로 바꾸면 순환성이 완화되는가, 아니면 0.28로 붕괴하는가
4. 게이트를 외생 판별값으로 **미리 열어두면** (선험적으로 신뢰 가능하다고 표시된 픽셀은 φ가 커도 유지) 오목 영역이 회수되는가
