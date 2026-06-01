---
type: "source"
slug: "rotation-feature-decoupling"
title: "Self-Supervised Representation Learning by Rotation Feature Decoupling"
status: "draft"
modified_at: "2026-06-01T15:10:14.478028+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Self-Supervised Representation Learning by Rotation Feature Decoupling.pdf"
tags:
  - "self-supervised-learning"
  - "rotation-prediction"
  - "feature-decoupling"
  - "instance-discrimination"
  - "equivariance"
---

# Self-Supervised Representation Learning by Rotation Feature Decoupling

## 논문 정보
- 주제: 회전 관련 특징과 회전 무관 특징을 분리하는 자기지도 표현 학습
- PDF: `raw/papers/Self-Supervised Representation Learning by Rotation Feature Decoupling.pdf`

## 핵심 주장
회전 예측과 instance discrimination을 그대로 결합하면 방향성이 모호한 이미지의 noisy rotation label과 상충하는 불변성 요구가 문제가 된다. 표현을 rotation-related feature와 rotation-unrelated feature로 분리하여 두 목표를 decouple하면 더 나은 전이 성능을 얻는다.

## 접근 방법
- `0`, `90`, `180`, `270`도 회전 예측을 사용한다.
- 이미지의 기본 방향일 확률을 추정하여 회전 label noise를 완화하는 weighted loss를 둔다.
- feature를 두 부분으로 나눈다. rotation-related 부분은 회전 분류에, rotation-unrelated 부분은 회전 간 거리 차이를 줄이는 regularization과 instance discrimination에 사용한다.
- non-parametric instance classification에는 NCE 기반 목적함수를 사용한다.

## 구현과 실험
- 축소 AlexNet 계열 구조, batch normalization, 200 epoch ImageNet 학습을 사용한다.
- ImageNet linear 평가에서 conv5 `44.3`을 기록하여 RotNet `36.5`를 개선했다.
- PASCAL 전이 평가에서 classification `74.3`, detection `57.5`, segmentation `45.3`을 기록했다.
- 회전된 PASCAL 평가에서도 decoupled representation의 강점을 확인한다.

## 해석
모든 변환을 단순히 없애야 할 nuisance로 볼 수는 없다. 어떤 downstream task에서는 변환 정보를 보존해야 하므로 equivariance와 invariance를 표현 내부에서 분리하는 설계가 유용하다.

## 근거 위치
- p.1-2: 문제 정의와 기여
- p.3-5: weighted rotation loss, feature split, NCE 목적함수
- p.7-8: ImageNet 및 PASCAL 결과

## 연결할 개념
- transformation invariance and equivariance
- instance discrimination
- noisy pretext labels
