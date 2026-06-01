---
type: "concept"
slug: "spatial-context-and-part-reasoning"
title: "Spatial Context and Part Reasoning"
status: "draft"
modified_at: "2026-06-01T15:11:24.716252+00:00"
author: "Codex"
language: "ko"
confidence: "medium"
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
---

# Spatial Context and Part Reasoning

## 정의
이미지의 일부만 보고 주변 위치, 물체 부분, 장면 배치를 추론하도록 학습하여 공간적으로 구조화된 시각 표현을 얻는 관점이다.

## 논문 연결
- Context Prediction은 두 패치의 상대 위치를 예측하여 물체와 부분 관계를 학습한다.
- Jigsaw Puzzle은 여러 타일의 배열을 복원하여 부분 간 공간 배치를 학습한다.
- DINO는 직접 공간 과제를 주지 않았는데도 ViT self-attention에서 물체 경계와 장면 배치가 나타난다.

## 비교 관점
초기 방법은 공간 추론을 명시적 pretext task로 요구한다. DINO는 self-distillation과 ViT 구조만으로 유사한 공간 정보가 emergent property로 나타날 수 있음을 보인다.

## 연구 질문
- 명시적 공간 과제와 emergent attention 구조는 어떤 조건에서 같은 정보를 학습하는가?
- 작은 patch 크기와 local context 설계가 dense task 전이에 어떤 영향을 주는가?
