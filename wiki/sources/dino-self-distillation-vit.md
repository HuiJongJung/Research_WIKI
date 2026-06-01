---
type: "source"
slug: "dino-self-distillation-vit"
title: "Emerging Properties in Self-Supervised Vision Transformers"
status: "draft"
modified_at: "2026-06-01T15:10:14.786482+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Emerging Properties in Self-Supervised Vision Transformers.pdf"
tags:
  - "self-supervised-learning"
  - "dino"
  - "vision-transformer"
  - "self-distillation"
  - "momentum-teacher"
  - "emergent-segmentation"
---

# Emerging Properties in Self-Supervised Vision Transformers

## 논문 정보
- 저자: Mathilde Caron 외
- 주제: DINO 자기증류와 자기지도 Vision Transformer의 emergent properties
- PDF: `raw/papers/Emerging Properties in Self-Supervised Vision Transformers.pdf`

## 핵심 주장
라벨 없는 self-distillation 방식인 DINO로 ViT를 학습하면, 분류 성능뿐 아니라 물체 경계와 장면 배치 정보가 self-attention에 자연스럽게 나타난다. 이러한 특징은 단순 k-NN 분류기에서도 매우 강하다.

## 접근 방법
- student와 teacher는 같은 backbone과 projection head를 사용한다.
- teacher는 student weight의 EMA(momentum encoder)로 갱신한다.
- student는 서로 다른 crop에서 teacher output distribution을 cross-entropy로 예측한다.
- teacher output의 centering과 sharpening으로 collapse를 방지하며 multi-crop 학습을 사용한다.

## 구현과 실험
- ImageNet 라벨 없이 ViT 및 ResNet을 사전학습한다.
- 작은 ViT의 k-NN ImageNet top-1은 `78.3%`, ViT-Base linear evaluation은 `80.1%`다.
- ViT-B/8 DINO feature를 frozen 상태로 DAVIS-2017 video object segmentation에 사용하면 `(J&F)m 71.4`를 기록한다.
- momentum encoder가 없으면 ablation에서 k-NN과 linear 평가가 모두 `0.1`로 붕괴한다. multi-crop과 cross-entropy도 중요한 구성 요소다.
- 제한된 계산 환경에서도 두 대의 8-GPU 서버로 3일 학습해 ImageNet linear `76.1`을 달성한다고 보고한다.

## 해석
DINO의 의미는 단순한 분류 점수 개선에 그치지 않는다. ViT의 attention이 별도 segmentation supervision 없이 물체 단위 공간 구조를 드러내며, momentum teacher가 학습 중 더 나은 ensemble target 역할을 한다.

## 근거 위치
- p.1-2: emergent segmentation, k-NN 성능, DINO 개요
- p.3-5: self-distillation, EMA teacher, 구현
- p.6-10: 분류, segmentation, ablation, 계산 비용

## 연결할 개념
- self-distillation without labels
- momentum teacher
- collapse prevention
- emergent object segmentation
