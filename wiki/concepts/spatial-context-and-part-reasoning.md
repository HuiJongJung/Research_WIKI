---
type: "concept"
slug: "spatial-context-and-part-reasoning"
title: "Spatial Context and Part Reasoning"
status: "draft"
modified_at: "2026-06-02T19:51:32.241580+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Unsupervised Visual Representation Learning by Context Prediction.pdf"
  - "raw/papers/Unsupervised Learning of Visual Representations by Solving Jigsaw Puzzles.pdf"
  - "raw/papers/Emerging Properties in Self-Supervised Vision Transformers.pdf"
tags:
  - "self-supervised-learning"
  - "spatial-reasoning"
  - "part-reasoning"
  - "vision-transformer"
  - "dense-representation"
  - "geometry"
---

# Spatial Context and Part Reasoning

## Definition
이미지의 일부 patch, token, 또는 region을 보고 주변 위치, 물체 부품, 장면 배치를 추론하게 하여 공간적으로 구조화된 시각 표현을 얻는 관점이다. 표현은 단일 object category뿐 아니라 part layout, pose, surface geometry, dense correspondence에 유용한 정보를 담을 수 있다.

## Why It Matters
시각 장면은 독립적인 texture bag이 아니라 부품과 객체가 특정 공간 관계로 놓인 구조다. Context Prediction 논문은 두 patch의 상대 위치를 맞히는 과제가 object와 part를 인식하게 만든다고 주장했고, NYUv2 surface normal 결과를 통해 이런 spatial reasoning이 category recognition과 다른 geometry bias를 줄 수 있음을 보였다.

## Where It Appears
- Context Prediction: 두 patch의 8-way relative position을 예측한다. Fig. 1은 물체를 알아보면 상대 위치 판단이 쉬워진다는 직관을 보여주고, Table 2는 NYUv2 surface normal transfer에서 ImageNet label pretraining과 거의 같은 mean error를 보고한다. (p.1, p.7)
- Jigsaw Puzzle: 여러 tile의 permutation을 복원하며 part arrangement와 global layout을 요구한다.
- DINO Self-Distillation ViT: 명시적 spatial pretext 없이도 attention map에서 object boundary와 part-like grouping이 emergent property로 관찰된다.

## Mechanisms
1. Local evidence extraction: 각 patch/token에서 edge, texture, part cue를 추출한다.
2. Relative relation prediction: 주변 patch와의 방향, 거리, 또는 배열을 맞히게 하여 spatial equivariance를 요구한다.
3. Part-to-object aggregation: 여러 local cue가 동일 object나 scene layout 안에서 일관되게 놓이는지를 학습한다.
4. Geometry transfer: category label 없이도 surface normal, dense matching, object discovery 같은 spatial task로 전이될 수 있다.

## Failure Modes / Bias
- Patch 위치가 camera artifact, boundary continuation, color statistics에 의해 누설되면 spatial reasoning이 아니라 shortcut을 학습한다.
- 너무 작은 patch는 semantic part보다 texture에 치우칠 수 있고, 너무 큰 patch는 과제가 쉬워지거나 global context를 직접 담아버릴 수 있다.
- 명시적 spatial task는 특정 grid/crop 방식에 overfit될 수 있다.
- Emergent spatial attention은 항상 dense geometry understanding을 의미하지 않는다. 별도 probing과 downstream 검증이 필요하다.

## Open Questions
- 명시적 relative-position pretext와 DINO류 emergent spatial grouping은 어떤 조건에서 같은 정보를 학습하는가?
- Patch 크기, gap, jitter, tokenization 방식은 geometry-aware representation에 어떤 영향을 주는가?
- Spatial context 학습은 3D reconstruction, Gaussian scene representation, dynamic scene modeling에서 어떤 feature prior로 재사용될 수 있는가?
