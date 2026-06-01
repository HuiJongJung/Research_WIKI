---
type: "concept"
slug: "shortcut-avoidance-in-self-supervision"
title: "Shortcut Avoidance in Self-Supervision"
status: "draft"
modified_at: "2026-06-01T15:11:24.370331+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Unsupervised Visual Representation Learning by Context Prediction.pdf"
  - "raw/papers/Unsupervised Learning of Visual Representations by Solving Jigsaw Puzzles.pdf"
tags:
  - "self-supervised-learning"
  - "shortcut-avoidance"
  - "pretext-task"
  - "ablation"
---

# Shortcut Avoidance in Self-Supervision

## 정의
자기지도 과제에서 모델이 연구자가 의도한 의미 구조 대신 더 쉬운 저수준 단서를 이용해 정답을 맞히는 현상을 통제하는 설계 원칙이다.

## 사례
- Context Prediction은 렌즈 chromatic aberration이 패치의 절대 위치를 드러내는 문제를 발견하고 color projection 또는 channel dropping을 사용한다.
- Jigsaw Puzzle은 타일 경계의 연속성이나 색수차만으로 순열을 맞히지 못하도록 gap, jitter, grayscale 변환을 사용한다.

## 체크리스트
- 데이터 수집 장치의 흔적이 라벨과 연관되는가?
- crop, resize, padding, compression artifact가 정답을 누설하는가?
- 저수준 통계를 제거한 뒤에도 성능이 유지되는가?
- shortcut 제거가 의미 정보까지 과도하게 없애지는 않는가?

## 연구 시사점
pretext task 성능이 높다는 사실만으로 좋은 표현을 보장할 수 없다. 우회 경로를 통제한 ablation과 downstream transfer를 함께 봐야 한다.
