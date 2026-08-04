---
type: "question"
slug: "observation-weighted-view-sampling"
title: "Observation-Weighted View Sampling"
status: "draft"
modified_at: "2026-07-06T00:00:00+00:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "ICML 2026 Tutorial: Is numerical optimization theory irrelevant to ML practice in 2026? (Mark Schmidt, UBC)"
tags:
  - "discussion-capture"
  - "view-sampling"
  - "importance-sampling"
  - "background-underconstraint"
  - "optimization"
---

# Observation-Weighted View Sampling

## Discussion Capture

ICML 2026 Schmidt 튜토리얼의 importance sampling 슬라이드에서 나온 아이디어다. 고전 SGD 이론에서는 example을 uniform하게 뽑지만, "sharp"하거나 학습에 유용한 example을 더 자주 뽑으면 gradient-dominated phase에서 수렴을 가속할 수 있다(automatic curriculum).

이걸 3DGS/MILo 학습에 번역하면, training view를 uniform하게 도는 대신 **저관측/배경 영역이 많이 보이는 view를 oversample**하는 전략이 된다. 배경 mesh 붕괴 문제의 층2(prior 차등 배분)와 같은 방향이며, "under-observed 영역에 optimization budget을 더 준다"는 발상을 데이터 샘플링 쪽에서 구현하는 셈이다.

## Distinction

```text
Schmidt 튜토리얼(SGD):
per-example sharpness(L_i) -> non-uniform example sampling -> gradient-dominated phase 가속

번역 아이디어(3DGS/MILo):
per-view 배경/저관측 비중 -> non-uniform view sampling -> 저관측 Gaussian의 유효 업데이트 빈도 증가
```

3DGS는 한 iteration에 view 1장을 렌더링하고, 그 view에서 보이는 Gaussian만 gradient를 받는다. 따라서 view sampling 분포를 바꾸는 것은 곧 각 Gaussian의 **업데이트 빈도**를 바꾸는 것이고, 저관측 Gaussian에는 gradient가 더 자주 들어오게 만드는 직접적 레버가 된다.

## Research Questions

- view의 "저관측 비중"을 무엇으로 측정할 것인가? (SfM point 밀도, depth 신뢰도, 배경 마스크 면적, per-Gaussian 관측 카운트 등)
- 데이터 샘플링(view oversampling)과 loss 가중(per-pixel/per-region weighting), prior 차등 배분(층2)은 서로 대체재인가 보완재인가?
- oversampling이 배경을 살리는 대신 foreground 품질(PSNR)이나 densification 균형을 해치지 않는가?
- 고정 분포 vs 학습 중 적응(관측이 충분해지면 가중 감소)의 차이는?
- ablation: uniform / SfM-density-weighted / observation-count-weighted / learned sampling 비교.

## Initial Interpretation

방향은 층2와 정합적이고, GS의 "view 1장 = per-view gradient" 구조 덕분에 SGD importance sampling보다 오히려 레버가 더 직접적이다. 다만 **주의**: Schmidt 본인은 importance sampling이 신경망 학습 실무에서는 별 도움이 안 되더라고 결론냈다(단, interpolation이나 variance-reduced SGD 상황에서는 도움). GS는 per-view gradient가 sparse해서 그의 결론이 그대로 적용될지 불명확하므로, "된다"고 가정하지 말고 직접 ablation으로 확인해야 한다.

연결: 저관측 Gaussian이 gradient를 드물게 받는 성질은 AdaGrad/Adam의 sparse-but-informative feature 논리와 같은 구조다(3DGS가 Adam optimizer를 쓰는 이유이기도 하다). view oversampling은 이 sparse 업데이트 빈도를 데이터 쪽에서 직접 끌어올리는 접근으로 볼 수 있다.

## Evidence Anchor

- Schmidt ICML 2026 Tutorial, "Importance Sampling" 슬라이드(p.194): sample the sharp examples more often → automatic curriculum, gradient-dominated phase에서 rate 개선. 단, "does not seem to help much for training neural networks."
- Schmidt ICML 2026 Tutorial, AdaGrad/Adam 슬라이드(p.151): important-but-usually-zero feature에 큰 step을 준다(sparse-but-informative feature 논리).
