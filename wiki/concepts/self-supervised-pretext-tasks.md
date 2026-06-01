---
type: "concept"
slug: "self-supervised-pretext-tasks"
title: "Self-Supervised Pretext Tasks"
status: "draft"
modified_at: "2026-06-01T15:11:23.706547+00:00"
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
---

# Self-Supervised Pretext Tasks

## 정의
라벨 없이 만들 수 있는 대리 문제를 풀게 하여 downstream task에 전이 가능한 표현을 학습하는 접근이다. 핵심은 정답을 자동 생성할 수 있으면서도, 정답을 잘 맞히려면 의미 있는 시각 구조를 이해해야 한다는 점이다.

## 대표 사례
- Exemplar-CNN: seed patch마다 surrogate class를 만들고 변환된 샘플을 같은 클래스로 구분한다.
- Context Prediction: 두 패치의 상대 위치를 예측한다.
- Jigsaw Puzzle: 섞인 `3x3` 타일의 순열을 예측한다.
- Rotation Feature Decoupling: 회전 예측을 사용하되 instance discrimination과 충돌하지 않도록 표현을 분리한다.

## 설계 원칙
- 과제가 너무 쉬우면 저수준 통계나 촬영 장치의 흔적만 학습한다.
- 과제가 지나치게 모호하면 학습 신호가 노이즈가 된다.
- pretext task가 요구하는 invariance와 equivariance가 downstream task에 적합한지 점검해야 한다.

## 연구 시사점
초기 자기지도 학습은 과제 설계 자체가 inductive bias였다. DINO나 I-JEPA처럼 별도 분류형 pretext task를 약화한 후속 방법과 비교하면, 어떤 의미 정보가 명시적 과제에서 오고 어떤 정보가 구조와 학습 동역학에서 오는지 분석할 수 있다.
