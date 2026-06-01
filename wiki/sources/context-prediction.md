---
type: "source"
slug: "context-prediction"
title: "Unsupervised Visual Representation Learning by Context Prediction"
status: "draft"
modified_at: "2026-06-01T15:10:13.861004+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Unsupervised Visual Representation Learning by Context Prediction.pdf"
tags:
  - "self-supervised-learning"
  - "context-prediction"
  - "patch-pairs"
  - "shortcut-avoidance"
  - "transfer-learning"
---

# Unsupervised Visual Representation Learning by Context Prediction

## 논문 정보
- 저자: Carl Doersch, Abhinav Gupta, Alexei A. Efros
- 주제: 이미지 패치 간 상대 위치 예측을 이용한 비지도 시각 표현 학습
- PDF: `raw/papers/Unsupervised Visual Representation Learning by Context Prediction.pdf`

## 핵심 주장
한 이미지에서 뽑은 두 패치의 상대 위치를 예측하도록 네트워크를 학습하면, 모델은 단순 픽셀 통계가 아니라 물체와 부분 구조를 인식하는 표현을 학습한다.

## 접근 방법
- 기준 패치와 주변 패치를 샘플링하고 주변 패치가 놓인 8개 상대 위치 중 하나를 분류한다.
- 두 패치는 weight-sharing AlexNet 계열 branch에서 개별 처리한 뒤 late fusion한다.
- branch가 초기에 공동 추론하지 못하도록 제한하여 각 패치 표현 자체가 의미 정보를 담도록 한다.

## shortcut 방지
렌즈의 chromatic aberration은 패치 절대 위치를 드러내는 shortcut이 될 수 있다. 저자들은 green-magenta 축 투영 또는 무작위 color-channel dropping을 사용하며, 패치 사이 gap과 jitter도 적용한다.

## 구현과 실험
- ImageNet 약 130만 장을 라벨 없이 사용하고, `96x96` 패치와 위치 jitter를 적용한다.
- VOC2007 detection에서 color-dropping 변형은 mAP `46.3`, projection 변형은 `45.7`을 기록했다. 동일 구조 scratch 학습은 `39.8`, 지도 ImageNet 사전학습 R-CNN은 `54.2`였다.
- NYUv2 surface normal estimation에서도 평균 각도 `33.2`로 지도 ImageNet 특징의 `33.3`과 근접했다.

## 해석
pretext task가 잘 작동하려면 의미 이해가 정답 예측에 필요해야 한다. 동시에 카메라 통계처럼 더 쉬운 우회 경로를 막아야 한다는 교훈을 분명하게 보여준다.

## 근거 위치
- p.1-3: 문제 정의, 8-way 상대 위치 예측, 구조
- p.4-5: chromatic aberration shortcut과 구현
- p.6-8: detection, surface normal, object discovery 결과

## 연결할 개념
- spatial context prediction
- shortcut avoidance in self-supervision
- self-supervised pretext task
