---
type: "concept"
slug: "transformation-invariance-and-equivariance"
title: "Transformation Invariance and Equivariance"
status: "draft"
modified_at: "2026-06-01T15:11:25.017006+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Discriminative Unsupervised Feature Learning with Exemplar Convolutional Neural Networks.pdf"
  - "raw/papers/Self-Supervised Representation Learning by Rotation Feature Decoupling.pdf"
  - "raw/papers/Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture.pdf"
tags:
  - "self-supervised-learning"
  - "invariance"
  - "equivariance"
  - "augmentation"
  - "feature-decoupling"
---

# Transformation Invariance and Equivariance

## 정의
- invariance: 입력 변환이 있어도 표현이 유지되는 성질
- equivariance: 입력 변환에 따라 표현도 구조적으로 변하는 성질

## 논문 연결
- Exemplar-CNN은 seed patch의 여러 변환을 같은 surrogate class로 묶어 augmentation-induced invariance를 학습한다.
- Rotation Feature Decoupling은 모든 회전 정보를 버리지 않고 rotation-related feature와 rotation-unrelated feature를 분리한다.
- I-JEPA는 handcrafted view augmentation에 직접 의존하지 않고 context에서 target representation을 예측한다.

## 핵심 쟁점
어떤 변환을 nuisance로 볼지는 downstream task에 따라 달라진다. 분류에는 회전 불변성이 유리할 수 있지만 자세 추정이나 공간 예측에는 회전 정보가 필요하다.

## 연구 질문
- 단일 embedding에 여러 요구를 강제할지, subspace나 head를 분리할지 선택 기준은 무엇인가?
- augmentation을 줄인 예측 기반 학습은 불변성을 어디에서 획득하는가?
