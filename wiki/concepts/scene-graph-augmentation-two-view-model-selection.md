---
type: "concept"
slug: "scene-graph-augmentation-two-view-model-selection"
title: "Scene Graph Augmentation과 Two-View 기하 모델 선택"
status: "draft"
modified_at: "2026-08-09T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/SfM.pdf"
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\SfM.pdf"
tags:
  - "scene-graph"
  - "geometric-verification"
  - "model-selection"
  - "degeneracy-detection"
  - "structure-from-motion"
  - "a-priori-confidence"
---

# Scene Graph Augmentation과 Two-View 기하 모델 선택

## Definition

Geometric verification을 "이 이미지 쌍이 유효한가"라는 **이진 판정**에서, "이 쌍은 어떤 기하 관계인가(general / panoramic / planar)와 그 관계가 얼마나 신뢰할 만한가"를 함께 라벨링하는 **다중 모델 분류**로 확장하고, 그 라벨을 scene graph의 edge 속성으로 저장해 이후 단계(initialization, triangulation)의 결정에 쓰는 메커니즘.

## Why It Matters

Downstream 3D reconstruction의 실패는 대부분 "잘못된 관측이 들어와서"가 아니라 **"구조적으로 3D 정보를 담을 수 없는 관측이 유효한 것처럼 들어와서"** 생긴다. 순수 회전(panoramic) 쌍은 매칭이 완벽해도 depth를 만들 수 없고, 평면 장면은 degenerate configuration을 만든다. 이걸 나중에 잔차로 걸러내려 하면 이미 오염된 파라미터를 기준으로 판단하게 된다.

핵심 통찰은 **모델 선택을 신뢰도 신호로 재해석**하는 것이다. 어떤 기하 모델이 데이터를 가장 잘 설명하는지는 곧 "이 관측 쌍에서 무엇을 추출해도 되는가"의 답이고, 이건 최적화가 시작되기 전에(a-priori) 값싸게 계산된다. 잔차 기반 a-posteriori 신뢰도([[learned-confidence-photometric-geometric-balancing]], CoMe 계열)와 정확히 반대 방향의 신호원이다.

## Where It Appears

- **COLMAP / SfM Revisited (CVPR 2016)**: 원전. `F` → `H` → `E` 순으로 추정하고 inlier 개수 비율로 모델을 분류. 라벨을 initialization seed 선택과 triangulation 배제에 사용. WTF(watermark/timestamp/frame) 쌍을 similarity transform inlier 비율로 제거.
- **GRIC (Torr, 1997)**: information criterion 기반 정식 모델 선택. COLMAP은 이걸 inlier 비율 임계로 근사한다(비용 문제).
- **QDEGSAC (Frahm & Pollefeys, 2006)**: quasi-degenerate 데이터에 대한 RANSAC. 같은 문제(degeneracy)를 추정기 안에서 다룸.
- **Efficient two-view geometry classification (Schönberger et al., GCPR 2015)**: 같은 저자가 이 분류 자체를 학습 문제로 다룬 후속.
- (연결) 3DGS/mesh reconstruction 파이프라인 — COLMAP이 이 라벨을 이미 계산하지만, 관례적으로 GS 학습에는 전달되지 않는다.

## Mechanisms

```text
입력: 매칭된 이미지 쌍 (I_a, I_b)와 correspondence M_ab

1. F 추정 -> inlier N_F
   N_F >= N_F^min 이 아니면 -> scene graph에서 제외 (검증 실패)

2. H 추정 -> inlier N_H
   N_H / N_F < eps_HF  =>  "general scene에서 움직이는 카메라" (GRIC의 저비용 근사)

3. (calibrated인 경우) E 추정 -> inlier N_E
   N_E / N_F > eps_EF  =>  "calibration이 맞다"

4. calibration OK  AND  N_H/N_F < eps_HF 이면:
     E 분해 -> inlier triangulate -> median triangulation angle alpha_m
     alpha_m로 panoramic(순수 회전) vs planar 구분

5. WTF 검출: 이미지 경계에서 similarity transform inlier N_S
   N_S/N_F > eps_SF  OR  N_S/N_E > eps_SE  =>  워터마크/타임스탬프/프레임 때문에
   서로 다른 랜드마크가 잘못 연결된 쌍 -> scene graph에서 제외

출력: edge 라벨 (general | panoramic | planar) + 최대 support 모델의 inlier 집합
```

**라벨의 소비처가 핵심이다.** 라벨 자체가 아니라 그것이 바꾸는 결정이 기여다.

1. **Initialization seed 제한**: non-panoramic이고 가급적 calibrated인 쌍에서만 두-뷰 재구성을 시작한다. 나쁜 초기화는 회복 불가능하므로 여기서 거르는 것이 가장 값싸다.
2. **Triangulation 배제**: panoramic 쌍에서는 아예 triangulate하지 않는다. baseline이 없는데 억지로 만든 점은 triangulation angle이 부정확하게 계산돼 이후 image registration까지 오염시킨다.

즉 이 메커니즘은 "나쁜 데이터를 지우는 필터"가 아니라 **"각 데이터가 무엇에 쓰일 자격이 있는지를 정하는 타입 시스템"** 에 가깝다.

## Failure Modes / Bias

- **임계값 의존성이 크다.** `eps_HF`, `eps_EF`, `eps_SF`, `eps_SE`의 구체적 값이 논문 본문에 없고, 장면 종류(실내 평면 위주 / 실외 일반)에 따라 최적값이 다를 것으로 보인다(추론).
- **Inlier 비율은 GRIC의 근사일 뿐이다.** 모델 복잡도와 데이터 차원을 제대로 penalize하지 않으므로, 경계 사례(약한 시차의 거의-평면 장면)에서는 오분류 가능.
- **이진 배제의 대가**: panoramic으로 분류된 쌍은 triangulation에서 완전히 빠진다. 실제로는 부분적으로 유용한 시차를 가진 쌍이 통째로 버려질 수 있다 — soft weighting이 아니라 hard gating이다.
- **WTF 검출은 경계 영역 가정에 의존**한다. 워터마크가 이미지 중앙에 있거나 프레임이 없는 형태면 놓친다.
- **평면 라벨의 활용이 비대칭적이다.** panoramic은 명시적으로 배제되지만 planar 라벨이 이후 어떻게 쓰이는지는 논문에서 덜 구체적이다.

## Open Questions

- 이 라벨을 3DGS/mesh reconstruction 학습으로 전달하면 무엇이 개선되는가? "COLMAP이 panoramic이라 판단해 3D 구조를 못 만든 영역"은 GS에서도 under-constrained일 가능성이 높다 — 이미 계산돼 있으나 버려지는 a-priori 신뢰도 신호로 쓸 수 있는가?
- Hard gating 대신 soft weight(예: `1 − N_H/N_F`를 그 쌍에서 유래한 점의 신뢰도로)로 바꾸면 completeness와 accuracy의 트레이드오프는 어떻게 움직이는가?
- 학습 기반 dense matcher(DUSt3R/MASt3R 계열)는 이 분류 단계를 우회하는데, 그때 degeneracy 판정은 무엇이 대신하는가? 아니면 판정 없이 진행되어 조용한 오류가 남는가?
- Median triangulation angle `alpha_m`은 panoramic 판정용으로만 쓰이는데, 이걸 연속값 신뢰도로 유지하면 [[covisibility-count-weighted-supervision]]보다 나은 proxy가 되는가?

## Related

- [Structure-from-Motion Revisited (COLMAP)](../sources/sfm-revisited-colmap.md)
- [[recursive-ransac-multiview-triangulation]] — 이 라벨의 직접 소비처(panoramic 쌍 배제)
- [[descriptor-matching]] — 이 단계의 입력을 만드는 상류
- [[covisibility-count-weighted-supervision]] — 같은 "관측의 질을 정량화" 계열, 단 count 기반
- [[gs-failure-mode-taxonomy]] — under-constrained 영역의 상류 원인으로 연결
