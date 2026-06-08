---
type: "concept"
slug: "multi-crop-local-to-global-training"
title: "Multi-Crop Local-to-Global Training"
status: "draft"
modified_at: "2026-06-08T08:47:14.214967+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/DINO-Emerging Properties in Self-Supervised Vision Transformers.pdf"
tags:
  - "self-supervised-learning"
  - "multi-crop"
  - "local-to-global"
  - "augmentation-policy"
  - "dino"
  - "view-consistency"
---

# Multi-Crop Local-to-Global Training

## Definition
Multi-crop local-to-global training은 한 이미지에서 큰 global crop과 작은 local crop을 동시에 만들고, local view representation이 global view target과 일관되도록 학습하는 self-supervised training 패턴이다. DINO에서는 teacher가 두 global crop만 보고 target을 만들고, student가 모든 local/global crop을 teacher target에 맞춘다.

## Why It Matters
이 패턴은 augmentation을 단순 data expansion이 아니라 representation task specification으로 만든다. 작은 crop은 이미지의 일부만 보지만 global semantic target을 맞춰야 하므로, local patch가 전체 object/context와 연결된 feature를 학습한다. DINO에서 multi-crop은 성능뿐 아니라 accuracy/time tradeoff를 크게 개선한다.

## Where It Appears
- DINO source page: [Emerging Properties in Self-Supervised Vision Transformers](../sources/dino-self-distillation-vit.md)
- p.3 Eq. 3: teacher global view와 student view set `V` 사이의 cross-entropy 합으로 loss 정의.
- p.8 Table 7: multi-crop을 제거하면 k-NN과 linear 성능이 하락.
- p.9 Table 8: crop 수에 따른 time, memory, accuracy tradeoff.
- p.18 Appendix E: global/local crop scale range와 framework별 multi-crop 효과 분석.

## Mechanisms
```text
V = {two global crops, several local crops}
loss = sum_{global teacher views} sum_{student views except same view} H(P_t(global), P_s(view))
```

- global crop: 보통 224x224, 원본 이미지의 큰 영역을 포함한다.
- local crop: 보통 96x96, 원본 이미지의 작은 영역을 포함한다.
- teacher는 global crop만 처리해 안정적인 semantic target을 만든다.
- student는 local crop까지 모두 처리해 target을 예측한다.
- local-to-global consistency가 생겨 partial observation에서도 global semantic representation을 만들도록 압력이 걸린다.

DINO Appendix E는 multi-crop이 모든 SSL framework에 같은 방식으로 도움이 되는 단순 add-on이 아니라고 강조한다. BYOL에서는 multi-crop이 그대로 잘 결합되지 않았고, DINO와 MoCo-v2에서는 더 강한 효과를 보였다.

## Failure Modes / Bias
- local crop이 너무 작거나 global/local scale range가 부적절하면 object가 아닌 texture shortcut을 학습할 수 있다.
- multi-crop은 memory를 늘린다. DINO Table 8에서 crop 수가 많아질수록 peak memory가 증가한다.
- framework마다 multi-crop과 loss/teacher 구조의 상호작용이 달라, 단순히 crop 수를 늘린다고 항상 성능이 오르지는 않는다.
- local crop이 global target을 강제로 맞추는 구조는 fine-grained part distinction이 중요한 task에서 과도한 invariance를 만들 수 있다.

## Open Questions
- global/local crop scale boundary를 data distribution에 맞게 자동 조정할 수 있는가?
- local-to-global consistency가 objectness, part reasoning, texture invariance 중 무엇을 가장 크게 강화하는가?
- image crop 대신 video clip, 3D view, Gaussian scene patch 등으로 확장하면 어떤 target design이 필요한가?
