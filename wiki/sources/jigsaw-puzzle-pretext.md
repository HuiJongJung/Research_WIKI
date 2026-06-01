---
type: "source"
slug: "jigsaw-puzzle-pretext"
title: "Unsupervised Learning of Visual Representations by Solving Jigsaw Puzzles"
status: "draft"
modified_at: "2026-06-01T15:10:14.166407+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Unsupervised Learning of Visual Representations by Solving Jigsaw Puzzles.pdf"
tags:
  - "self-supervised-learning"
  - "jigsaw-puzzle"
  - "spatial-reasoning"
  - "shortcut-avoidance"
  - "transfer-learning"
---

# Unsupervised Learning of Visual Representations by Solving Jigsaw Puzzles

## 논문 정보
- 저자: Mehdi Noroozi, Paolo Favaro
- 주제: jigsaw puzzle 풀이를 이용한 비지도 시각 표현 학습
- PDF: `raw/papers/Unsupervised Learning of Visual Representations by Solving Jigsaw Puzzles.pdf`

## 핵심 주장
이미지 타일의 순열을 맞추는 jigsaw puzzle을 풀게 하면, 네트워크는 물체 부분과 공간 배치를 이해하는 전이 가능한 표현을 학습한다.

## 접근 방법
- 이미지를 `3x3` 타일로 나누고 순서를 섞는다.
- Context-Free Network(CFN)는 9개 weight-sharing branch에서 타일을 개별 처리한 뒤 feature를 결합하여 순열 클래스를 예측한다.
- 가능한 `9!` 순열 전체 대신 Hamming distance를 고려해 선택한 순열 subset을 사용한다.

## shortcut 방지
타일 사이 gap, 위치 jitter, 일부 grayscale 변환을 사용한다. 모델이 경계의 연속성이나 색수차 같은 저수준 단서만으로 puzzle을 풀지 못하도록 설계한다.

## 구현과 실험
- ImageNet 약 130만 장을 라벨 없이 사용한다.
- CFN은 약 `27.5M` 파라미터로 AlexNet보다 작고, 사전 과제 학습은 약 `59.5`시간이다.
- PASCAL 전이 평가에서 classification `67.6`, detection `53.2`, segmentation `37.6`을 기록하여 당시 여러 비지도 기준선을 앞섰다.
- permutation 수와 선택 방식에 대한 ablation으로 과제 난이도의 중요성을 확인한다.

## 해석
좋은 pretext task는 지나치게 단순하지도, 모호하지도 않아야 한다. 공간 구조 학습을 유도하면서 shortcut을 통제하는 설계 사례다.

## 근거 위치
- p.1-2: jigsaw pretext task의 동기
- p.6-9: CFN, 순열 subset, shortcut 방지, 구현
- p.10-13: PASCAL 결과, ablation, 결론

## 연결할 개념
- jigsaw puzzle pretext
- shortcut avoidance in self-supervision
- part-based spatial reasoning
