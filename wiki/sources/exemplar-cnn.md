---
type: "source"
slug: "exemplar-cnn"
title: "Discriminative Unsupervised Feature Learning with Exemplar Convolutional Neural Networks"
status: "draft"
modified_at: "2026-06-01T15:10:13.509455+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Discriminative Unsupervised Feature Learning with Exemplar Convolutional Neural Networks.pdf"
tags:
  - "self-supervised-learning"
  - "instance-discrimination"
  - "surrogate-classes"
  - "augmentation-invariance"
  - "cnn"
---

# Discriminative Unsupervised Feature Learning with Exemplar Convolutional Neural Networks

## 논문 정보
- 저자: Alexey Dosovitskiy 외
- 주제: 라벨 없이 CNN 표현을 학습하기 위한 surrogate-class 기반 instance discrimination
- PDF: `raw/papers/Discriminative Unsupervised Feature Learning with Exemplar Convolutional Neural Networks.pdf`

## 핵심 주장
무작위로 선택한 이미지 패치 하나를 하나의 surrogate class로 보고, 해당 패치에 여러 변환을 적용한 샘플을 같은 클래스로 분류하도록 CNN을 학습하면 라벨 없이도 전이 가능한 시각 표현을 얻을 수 있다.

## 동기와 기존 한계
지도학습 특징은 분류에는 강하지만 라벨이 없는 대규모 데이터에서 직접 학습하기 어렵다. 저자들은 이미지마다 자동 생성 가능한 대리 과제를 통해 서로 다른 개별 샘플은 구분하고, 허용한 변환에는 불변인 표현을 얻고자 한다.

## 접근 방법
- 그래디언트가 충분한 `32x32` seed patch를 샘플링한다.
- translation, scaling, rotation, contrast, color 변화 등을 적용하여 동일 seed의 변형 집합을 만든다.
- 각 seed를 별도 surrogate class로 간주하고 multinomial classification loss로 Exemplar-CNN을 학습한다.
- 목적함수는 샘플 간 구별 능력과 변환에 대한 불변성을 함께 유도한다.

## 구현과 실험
- Caffe 기반 CNN을 학습하고 여러 레이어의 pooled feature를 평가한다.
- 가장 큰 모델은 STL-10 `74.2±0.4`, CIFAR-10(400) `76.6±0.2`, CIFAR-10 `84.3`, Caltech-101 `87.1±0.7`, Caltech-256(30) `53.6±0.2`를 기록했다.
- 변환 ablation에서는 translation, color, contrast가 rotation과 scale보다 중요한 기여를 보였다.
- 분류 외에 descriptor matching에서도 SIFT와 비교하여 학습 특징의 활용 가능성을 검증했다.

## 해석
이 논문은 이후 instance discrimination 계열의 초기 형태로 볼 수 있다. 어떤 augmentation을 같은 의미로 간주할지 정하는 순간, 모델이 학습할 invariance가 함께 결정된다는 점이 중요하다.

## 근거 위치
- p.1: surrogate class와 augmentation 기반 학습의 개요
- p.2-3: 패치 샘플링, 변환, 목적함수
- p.5-6: 분류 결과와 transformation ablation
- p.8-12: matching 평가와 결론

## 연결할 개념
- instance discrimination
- augmentation-induced invariance
- self-supervised pretext task
