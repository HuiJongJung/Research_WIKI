---
type: "source"
slug: "ijepa"
title: "Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture"
status: "draft"
modified_at: "2026-06-01T15:10:15.114982+00:00"
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
  - "multi-block-masking"
  - "vision-transformer"
---

# Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture

## 논문 정보
- 저자: Mahmoud Assran 외
- 주제: 표현 공간의 masked prediction을 이용하는 Image-based JEPA
- PDF: `raw/papers/Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture.pdf`

## 핵심 주장
I-JEPA는 handcrafted view augmentation이나 픽셀 복원 없이, 하나의 context block에서 같은 이미지의 여러 target block 표현을 예측하여 semantic representation을 학습한다.

## 접근 방법
- context encoder가 겹치는 target 영역을 제거한 하나의 context block을 처리한다.
- EMA로 갱신되는 target encoder가 이미지의 target block 표현을 만든다.
- predictor는 context 표현과 위치가 포함된 mask token을 받아 target 표현을 예측한다.
- loss는 예측 patch representation과 target patch representation 사이 평균 L2 거리다.
- 기본 multi-block masking은 target scale `(0.15, 0.2)`의 블록 4개와 context scale `(0.85, 1.0)`을 사용한다.

## 구현과 실험
- ViT-Huge/14를 16대 A100 GPU에서 72시간 이내에 학습할 수 있다고 보고한다.
- ImageNet linear evaluation에서 ViT-H/14 `79.3`, 고해상도 ViT-H/16 `81.1`을 기록한다.
- ImageNet 1% 평가에서 고해상도 ViT-H/16은 `77.3`이다.
- representation-space target은 pixel-space target보다 ImageNet 1% linear 평가에서 `66.9` 대 `40.7`로 우수하다.
- multi-block masking은 비교한 masking 전략 중 가장 높은 `54.2`를 기록하며, 충분히 큰 target과 풍부한 context가 중요하다.

## 해석
I-JEPA는 augmentation으로 불변성을 직접 주입하는 계열과 픽셀을 복원하는 생성 계열 사이의 다른 선택지를 제시한다. 예측 대상을 표현 공간으로 옮겨 저수준 세부 묘사보다 의미 수준 구조를 우선하도록 만든다.

## 근거 위치
- p.1-3: JEPA의 위치, 핵심 아이디어, 구조
- p.4: multi-block masking과 L2 objective
- p.5-8: 성능, scaling, local task, masking ablation
- p.14-15: target/context 크기와 masking 위치 ablation

## 연결할 개념
- joint-embedding predictive architecture
- latent-space prediction
- multi-block masking
- EMA target encoder
