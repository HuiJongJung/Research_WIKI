---
type: "concept"
slug: "multiresolution-visibility-pyramid-score"
title: "Multi-Resolution Visibility Pyramid Score (Next Best View)"
status: "draft"
modified_at: "2026-08-09T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/SfM.pdf"
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\SfM.pdf"
tags:
  - "next-best-view"
  - "view-selection"
  - "observation-distribution"
  - "uncertainty-approximation"
  - "structure-from-motion"
  - "view-sampling"
---

# Multi-Resolution Visibility Pyramid Score (Next Best View)

## Definition

이미지 내 관측점의 **개수와 공간적 균일성을 하나의 스칼라로 합치는** 점수 함수. 이미지를 여러 해상도의 격자로 분할하고, 각 셀이 "처음 채워질 때만" 해상도별 가중치를 더하는 방식으로 계산한다. 비싼 covariance propagation 없이 pose 추정의 well-conditionedness를 근사한다.

## Why It Matters

"관측이 얼마나 있는가"를 개수만으로 재면 틀린다. 한 구석에 뭉친 100개 점과 화면 전체에 퍼진 100개 점은 추정 안정성이 전혀 다르다 — PnP pose 정확도는 관측 개수와 이미지 내 분포 둘 다에 의존한다(Lepetit et al.). 반대로 분포만 재면 점이 적을 때 무의미하다.

이 점수의 우아함은 **두 성질이 자동으로 교대**한다는 데 있다. 점이 적으면 거의 모든 점이 서로 다른 셀에 떨어지므로 점수가 개수에 비례하고, 점이 많아지면 셀이 포화되어 분포가 점수를 지배한다. 별도의 하이퍼파라미터로 두 항을 섞을 필요가 없다.

그리고 **온라인 갱신 가능하고 런타임의 0.1% 미만**이다(COLMAP Fig. 7). 정확한 uncertainty 계산(후보마다 covariance 전파)은 후보가 수천 개인 인터넷 데이터셋에서 불가능하다.

## Where It Appears

- **COLMAP / SfM Revisited (CVPR 2016)**: 원전. 다음에 등록할 이미지를 고르는 데 사용. Quad 데이터셋에서 Number(점 개수 최대, Bundler)·Ratio(가시/잠재가시 비율) 전략보다 낮은 pose 오차를 달성.
- **Haner & Heyden (ECCV 2012)**: covariance propagation 기반 NBV. COLMAP이 근사하려는 원본.
- **Irschara et al. (CVPR 2009)**: 관측 분포를 점수화하는 아이디어의 선행.
- (연결) [[observation-weighted-view-sampling]] — 3DGS training view sampling으로의 번역 후보.
- (연결) [[covisibility-count-weighted-supervision]] — 관측을 세는 계열이지만 공간 분포 항이 없다.

## Mechanisms

```text
파라미터: 레벨 수 L,  레벨별 격자 해상도 K_l = 2^l,  가중치 w_l = K_l²

각 후보 이미지 i에 대해:
  모든 레벨 l = 1..L 의 K_l x K_l 격자를 유지, 각 셀 상태 ∈ {empty, full}

  재구성 중 어떤 3D 점이 이미지 i에서 새로 보이게 되면:
    그 점이 떨어지는 셀들 중 empty인 것만 -> full로 전환, S_i += w_l
    (이미 full인 셀은 기여하지 않음)

  S_i = 모든 레벨에 걸친 누적 점수

후보 = "triangulate된 점을 N_t > 0 개 이상 보는 미등록 이미지"
다음 뷰 = argmax_i S_i
```

**설계 논리 세 가지.**

1. **셀은 한 번만 기여한다** → 같은 셀에 점이 몰리면 추가 점수가 없다. 자연스럽게 균일 분포를 선호한다.
2. **단일 해상도로는 부족하다** → 점 개수가 `N_t ≪ K_l²`이면 모든 점이 각자 다른 셀에 떨어져 분포 정보가 사라진다. 그래서 거친 격자부터 고운 격자까지 쌓는다.
3. **가중치가 해상도에 따라 커진다**(`w_l = K_l²`) → 고해상도에서 여러 셀을 채우는(= 실제로 넓게 퍼진) 배치가 보상받는다.

**실증적으로 중요한 관찰**: COLMAP 실험(Fig. 5)에서 세 전략 모두 **결국 같은 이미지 집합을 등록**한다. 그런데 최종 pose 오차는 다르다(Pyramid가 최소). 즉 이 메커니즘의 이득은 completeness가 아니라 **누적 오차 억제**에서 온다. "무엇을 쓰느냐"가 아니라 "어떤 순서로 쓰느냐"가 최종 품질을 만든다는 실증.

## Failure Modes / Bias

- **셀 경계 효과**: 점이 셀 경계 근처에 몰리면 미세한 이동으로 점수가 불연속적으로 변한다. 이산 격자의 본질적 한계.
- **관측의 질을 구분하지 않는다.** 셀을 채운 점이 triangulation angle이 좋은 점인지, 신뢰도가 낮은 점인지 무관하다. 개수·분포만 본다.
- **Depth 분포를 무시한다.** 이미지 내 2D 균일성만 보고, 관측점들이 하나의 평면에 있는지(degenerate) 여부는 이 점수로 잡히지 않는다 — 그 역할은 [[scene-graph-augmentation-two-view-model-selection]]이 별도로 맡는다.
- **Greedy이다.** 매 스텝 argmax를 취할 뿐 전체 등록 순서를 최적화하지 않는다. 나중에 필요한 뷰를 미리 확보하는 non-greedy 배분은 다루지 않는다.
- **`L`과 `w_l`의 선택 근거가 실험적**이다(실험에서 `L = 6`). 이론적 최적성 논증은 없다.
- (미확인) 논문 Fig. 3의 구체적 점수값(66/80/146/200)을 위 규칙으로 산술 재현하지 못했다. 가중치 정의를 잘못 읽었을 가능성이 있어 구현 시 COLMAP 소스 확인이 필요하다.

## Open Questions

- 3DGS training view sampling에 그대로 옮길 수 있는가? "등록된 점" 대신 "지금까지 충분히 supervise된 Gaussian"으로 셀을 채우면, 저관측 영역이 많이 보이는 view가 자동으로 높은 점수를 받는다 — [[observation-weighted-view-sampling]]의 구체적 구현안이 된다.
- 점수를 "높은 쪽 선택"이 아니라 "낮은 쪽 보강"으로 뒤집으면(= 점수가 낮은 영역에 supervision을 더 주면) [[covisibility-count-weighted-supervision]]의 공간-분포 인지 버전이 되는가?
- 셀 채움 여부(binary) 대신 셀 내 관측의 triangulation angle 중앙값을 쓰면 더 나은 conditioning proxy가 되는가?
- Greedy argmax를 non-greedy 배분(전체 예산을 뷰들에 분배)으로 바꾸면 SfM에서도 이득이 있는가? (ICML 2026 LASER의 non-greedy 배분 아이디어와 구조가 같음)
- 3D 공간 격자로 확장하면(이미지 평면 대신 scene 공간) mesh reconstruction의 under-observed 영역 탐지에 직접 쓸 수 있는가?

## Related

- [Structure-from-Motion Revisited (COLMAP)](../sources/sfm-revisited-colmap.md)
- [[observation-weighted-view-sampling]] — 3DGS로의 번역 질문
- [[covisibility-count-weighted-supervision]] — 개수 기반, 분포 항 없음
- [[scene-graph-augmentation-two-view-model-selection]] — 상보적 신뢰도 신호(기하 degeneracy)
- [[photometric-primary-geometry-underconstraint]] — 관측 불균형이 만드는 하류 문제
