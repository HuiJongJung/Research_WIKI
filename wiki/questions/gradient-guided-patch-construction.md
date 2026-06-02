---
type: "question"
slug: "gradient-guided-patch-construction"
title: "Gradient-Guided Patch Construction"
status: "draft"
modified_at: "2026-06-02T04:55:35.581735+00:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "raw/papers/Discriminative Unsupervised Feature Learning with Exemplar Convolutional Neural Networks.pdf"
tags:
  - "discussion-capture"
  - "patch-sampling"
  - "gradient-guidance"
  - "self-supervised-learning"
  - "augmentation-design"
---

# Gradient-Guided Patch Construction

## Discussion Capture

Exemplar-CNN은 patch를 새로 합성하지 않는다. 후보 crop 내부의 mean squared image-gradient magnitude에 비례하여 patch를 샘플링한다. 따라서 edge, texture, local structure가 있는 위치를 빈 배경보다 자주 선택한다.

사용자 아이디어는 이 heuristic을 확장하여 gradient 정보를 patch construction 자체에 활용할 수 있는지 검토하는 것이다.

## Distinction

```text
논문의 방식:
image-gradient score -> crop 위치의 sampling probability 조정

확장 아이디어:
gradient structure -> patch 생성, 변형, 혼합 또는 학습 curriculum 설계
```

## Research Questions

- gradient magnitude만 사용할 것인가, 방향과 edge topology도 보존할 것인가?
- crop selection 개선인지, synthetic patch generation인지, augmentation policy인지 명확히 구분해야 하는가?
- gradient가 큰 영역만 강조하면 texture bias가 커지거나 smooth object region을 놓치는가?
- downstream task가 classification, descriptor matching, denoising 중 무엇인지에 따라 유효한 gradient signal이 달라지는가?
- random sampling, gradient-weighted sampling, learned sampling, gradient-guided generation을 어떤 ablation으로 비교할 것인가?

## Initial Interpretation

가능성은 있다. 특히 self-supervised pretext task에서 학습에 유용한 local structure를 더 자주 보여주는 curriculum 또는 hard-example sampling으로 읽을 수 있다. 그러나 gradient magnitude가 의미 정보와 동일한 것은 아니다. 성능 개선이 semantic representation 향상인지 단순 texture emphasis인지 분리해서 검증해야 한다.

## Evidence Anchor

- Exemplar-CNN Section 2, p.2: patch sampling probability is proportional to mean squared gradient magnitude within the patch.
