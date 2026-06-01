---
type: "concept"
slug: "joint-embedding-prediction"
title: "Joint-Embedding Prediction"
status: "draft"
modified_at: "2026-06-01T15:11:25.665315+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture.pdf"
tags:
  - "self-supervised-learning"
  - "ijepa"
  - "joint-embedding-predictive-architecture"
  - "latent-prediction"
  - "masked-prediction"
---

# Joint-Embedding Prediction

## 정의
입력 공간의 픽셀을 직접 복원하는 대신, 관측한 context에서 보이지 않는 target의 embedding을 예측하는 학습 관점이다.

## I-JEPA 사례
- 하나의 context block에서 같은 이미지의 여러 target block representation을 예측한다.
- target encoder는 context encoder의 EMA로 갱신된다.
- target 위치를 나타내는 positional mask token을 predictor에 제공한다.
- target encoder 출력에서 masking하여 semantic target을 만들고 patch-level L2 loss를 사용한다.

## 생성 기반 복원과의 차이
픽셀 복원은 저수준 세부 묘사를 맞히는 데 많은 용량을 쓸 수 있다. I-JEPA는 representation-space prediction으로 불필요한 세부 정보를 줄이고 semantic abstraction을 우선한다.

## 실험적 근거
I-JEPA ablation에서 representation-space target은 pixel-space target보다 ImageNet 1% linear 평가가 높다. 충분히 큰 target block 여러 개와 정보가 풍부한 context block이 중요하다.

## 연구 질문
- 예측 대상의 semantic level을 어느 encoder layer에서 정할 것인가?
- context와 target 크기, 개수, 위치 분포가 local task와 semantic task 사이 균형에 어떤 영향을 주는가?
