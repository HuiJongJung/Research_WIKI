---
type: "concept"
slug: "shortcut-avoidance-in-self-supervision"
title: "Shortcut Avoidance in Self-Supervision"
status: "draft"
modified_at: "2026-06-02T19:51:13.503210+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Unsupervised Visual Representation Learning by Context Prediction.pdf"
  - "raw/papers/Unsupervised Learning of Visual Representations by Solving Jigsaw Puzzles.pdf"
tags:
  - "self-supervised-learning"
  - "shortcut-avoidance"
  - "pretext-task"
  - "ablation"
  - "dataset-bias"
---

# Shortcut Avoidance in Self-Supervision

## Definition
자기지도 pretext task에서 모델이 연구자가 의도한 의미 구조 대신, 정답을 쉽게 누설하는 저수준 단서나 데이터 수집 artifact를 이용해 문제를 푸는 현상을 막는 설계 원칙이다.

## Why It Matters
자기지도 학습은 label을 자동 생성하기 때문에, label 생성 규칙이 이미지의 원치 않는 artifact와 연결되면 모델은 semantic representation을 배우지 않고도 높은 pretext accuracy를 얻을 수 있다. 따라서 pretext task의 성공 여부는 task accuracy보다 shortcut을 얼마나 찾아내고 제거했는지, 그리고 downstream transfer가 남아 있는지로 판단해야 한다.

## Where It Appears
- Context Prediction: patch boundary continuity를 막기 위해 patch 사이에 `48` pixel gap을 두고, 위치를 `-7` to `7` pixel jitter한다. 더 중요한 shortcut으로 chromatic aberration을 발견하고, green-magenta projection 또는 color dropping으로 제거한다. (p.3-5)
- Jigsaw Puzzle: tile boundary, chromatic aberration, 색 통계 같은 단서로 permutation을 맞히지 못하게 gap, jitter, grayscale/color 변형을 사용한다.

## Mechanisms
1. 누설 경로 가정: crop boundary, texture continuation, camera/lens artifact, padding, compression, resize pattern처럼 label과 상관될 수 있는 신호를 나열한다.
2. 직접 실험: Context Prediction은 patch의 절대 `(x, y)` 좌표를 예측하는 네트워크를 학습시켜 chromatic aberration shortcut을 실증했다. 상위 10% 이미지에서 RMSE `.255`는 center baseline `.371`보다 좋았고, projection 후 `.321`로 약해졌다. (p.5)
3. 전처리 또는 sampling 수정: gap, jitter, channel dropping, color projection처럼 task의 의미 구조는 보존하되 쉬운 단서를 제거한다.
4. Transfer 재검증: shortcut 제거 후에도 VOC detection, NYUv2, object discovery에서 표현이 전이되는지 확인한다.

## Failure Modes / Bias
- Shortcut 제거가 과도하면 실제 의미 정보까지 지워질 수 있다.
- 알려진 shortcut만 제거하면 다른 artifact로 우회 학습할 수 있다.
- Pretext validation set이 같은 수집 pipeline에서 오면 shortcut generalization을 실제 semantic generalization으로 오해할 수 있다.
- Downstream task가 shortcut과 같은 bias를 공유하면 transfer 성능도 오염될 수 있다.

## Open Questions
- 특정 pretext task에서 가능한 shortcut 목록을 자동으로 발견하는 diagnostic benchmark를 만들 수 있는가?
- Shortcut 제거 전후 representation의 layer별 변화는 어떤 feature statistic으로 관찰할 수 있는가?
- 현대 self-supervised ViT/MAE/DINO에서도 crop 위치, augmentation metadata, camera pipeline shortcut이 어떤 방식으로 남는가?
