---
type: "concept"
slug: "self-supervised-pretext-tasks"
title: "Self-Supervised Pretext Tasks"
status: "draft"
modified_at: "2026-06-02T19:50:52.878623+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Discriminative Unsupervised Feature Learning with Exemplar Convolutional Neural Networks.pdf"
  - "raw/papers/Unsupervised Visual Representation Learning by Context Prediction.pdf"
  - "raw/papers/Unsupervised Learning of Visual Representations by Solving Jigsaw Puzzles.pdf"
  - "raw/papers/Self-Supervised Representation Learning by Rotation Feature Decoupling.pdf"
tags:
  - "self-supervised-learning"
  - "pretext-task"
  - "representation-learning"
  - "automatic-labels"
  - "transfer-learning"
---

# Self-Supervised Pretext Tasks

## Definition
사람이 직접 붙인 semantic label 없이, 데이터 자체에서 자동 생성할 수 있는 대리 문제를 풀게 하여 downstream task에 전이 가능한 표현을 학습하는 접근이다. 핵심 조건은 정답을 자동으로 만들 수 있으면서도, 정답을 잘 맞히려면 의미 있는 시각 구조, 불변성, equivariance, 또는 관계 추론을 배워야 한다는 점이다.

## Why It Matters
Pretext task는 초기 자기지도 학습에서 representation learning의 inductive bias를 직접 설계하는 장치였다. 어떤 정답을 만들고 어떤 shortcut을 막느냐에 따라 모델이 배우는 정보가 달라진다. Context Prediction에서는 8-way 상대 위치 label이 자동으로 생성되고, Exemplar-CNN에서는 seed patch identity가 surrogate class가 되며, Jigsaw Puzzle에서는 tile permutation이 정답이 된다. 이들은 모두 라벨 없는 이미지에서 supervised classification 형태의 학습 신호를 만든다.

## Where It Appears
- Exemplar-CNN: seed patch마다 surrogate class를 만들고, 변환된 sample을 같은 class로 분류하게 한다.
- Context Prediction: 같은 이미지에서 뽑은 두 patch의 8개 상대 위치를 예측한다. 정답은 crop geometry에서 자동 생성된다.
- Jigsaw Puzzle: `3x3` tile 배열의 permutation을 예측한다.
- Rotation Feature Decoupling: rotation prediction을 사용하되 instance discrimination과 충돌하지 않도록 표현을 분리한다.

## Mechanisms
1. 자동 label 생성: crop 위치, patch identity, tile permutation, rotation angle처럼 데이터 변환에서 label을 만든다.
2. 의미 구조 강제: label을 맞히려면 object part, spatial layout, appearance invariance, transformation equivariance 같은 정보를 써야 하도록 설계한다.
3. Shortcut 통제: boundary continuity, chromatic aberration, 색 통계, padding artifact 같은 쉬운 단서가 답을 누설하지 않도록 전처리와 sampling을 조정한다.
4. Transfer 검증: pretext accuracy만 보지 않고 detection, classification, geometry, retrieval, dense task에서 feature 품질을 확인한다.

## Failure Modes / Bias
- 과제가 너무 쉬우면 모델은 저수준 artifact만 배운다.
- 과제가 너무 모호하면 학습 신호가 noisy해져 downstream 전이가 약해진다.
- 자동 label 생성 규칙이 특정 dataset bias와 결합하면 representation이 실제 semantic factor 대신 촬영 장치나 crop pipeline을 학습할 수 있다.
- Pretext task의 invariance/equivariance가 downstream task 요구와 어긋나면 좋은 pretext accuracy가 좋은 표현을 보장하지 않는다.

## Open Questions
- 현대 joint-embedding 또는 masked prediction 방법에서도 명시적 pretext task 설계의 어떤 원칙이 여전히 유효한가?
- Pretext accuracy, shortcut 제거, transfer performance 사이의 관계를 어떻게 정량화할 수 있는가?
- 자동 label이 요구하는 정보와 downstream task가 요구하는 정보의 overlap을 사전에 예측할 수 있는가?
