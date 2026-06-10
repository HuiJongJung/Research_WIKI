---
type: "concept"
slug: "rank-aware-gaussian-densification"
title: "Rank-Aware Gaussian Densification"
status: "draft"
modified_at: "2026-06-10T09:10:40.756432+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Effective Rank GS.pdf"
tags:
  - "gaussian-splatting"
  - "densification"
  - "effective-rank"
  - "adaptive-density-control"
---

# Rank-Aware Gaussian Densification

## Definition
Rank-aware Gaussian densification은 3DGS의 primitive split/densification rule을 Gaussian shape spectrum과 함께 설계하는 관점이다. Effective Rank GS에서는 direct rank-conditioned split rule을 새로 만들지는 않지만, erank regularization과 함께 revised ADC를 사용해 disk-like Gaussian이 gradient cancellation 때문에 split되지 않는 문제를 줄인다.

## Why It Matters
3DGS의 Gaussian shape는 loss term만으로 결정되지 않는다. Densification, splitting, pruning, opacity reset 같은 primitive lifecycle이 어떤 Gaussian을 늘리고 줄이는지도 최종 geometry를 크게 바꾼다. Effective Rank GS는 disk-like Gaussian을 유도하는 regularizer가 있어도, 기존 ADC가 disk-like Gaussian을 잘 split하지 못하면 optimization이 needle-like shape로 흐를 수 있음을 보여준다.

## Where It Appears
- Effective Rank GS p.7: 저자들은 revised densification algorithm을 채택하고, disk-like Gaussian은 기존 Eq. 3 criterion을 만족하기 어렵다고 설명한다.
- Appendix A.4 p.12: gradient norm을 pixel별로 계산해 합산하는 ADC fix를 명시한다.
- Appendix A.6 p.13-15: 긴 축 방향 gradient가 작고 split이 충분히 일어나지 않아 Gaussian이 scale adjustment 쪽으로 bias된다는 원인 분석을 제공한다.

## Mechanisms
기존 ADC는 대략 다음 기준을 사용한다.

```text
|| sum_{i in P} dL/dp_i * dp_i/du ||_2 > tau
```

Effective Rank GS가 채택한 revised criterion은 다음처럼 pixel별 norm을 먼저 계산해 합산한다.

```text
sum_{i in P} || dL/dp_i * dp_i/du ||_2 > tau
```

이 차이는 disk-like Gaussian에서 중요하다. Disk-like primitive는 넓은 pixel area를 덮기 때문에 여러 방향의 gradient가 cancel될 수 있다. Norm-first aggregation은 cancellation을 줄이고, Gaussian이 필요한 방향으로 split될 기회를 늘린다.

## Failure Modes / Bias
- Densification rule이 rank-aware하지 않으면 regularizer가 만든 disk-like Gaussian이 충분히 분할되지 않을 수 있다.
- 반대로 과도한 split은 memory/storage를 늘리고 small primitive overfitting을 만들 수 있다.
- Rank-aware split이 thin structure를 잘못 쪼개면 필요한 elongated support를 잃을 수 있다.
- Densification은 renderer, loss, camera distribution, scene scale에 강하게 의존하므로 universal threshold 설계가 어렵다.

## Open Questions
- Split direction과 split timing을 covariance eigenvectors/effective rank로 직접 결정할 수 있는가?
- Needle-like Gaussian은 prune할지, split할지, disk-like로 reshape할지 어떤 기준으로 선택해야 하는가?
- Rank-aware densification과 depth/normal/ray-based structure loss를 함께 쓰면 surface reconstruction과 novel view quality 사이 trade-off를 더 줄일 수 있는가?
