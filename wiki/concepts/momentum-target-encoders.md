---
type: "concept"
slug: "momentum-target-encoders"
title: "Momentum Target Encoders"
status: "draft"
modified_at: "2026-06-01T15:11:26.004633+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Emerging Properties in Self-Supervised Vision Transformers.pdf"
  - "raw/papers/Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture.pdf"
tags:
  - "self-supervised-learning"
  - "ema"
  - "momentum-encoder"
  - "teacher-student"
  - "collapse-prevention"
---

# Momentum Target Encoders

## 정의
온라인 encoder의 파라미터를 exponential moving average(EMA)로 누적하여 target encoder 또는 teacher를 갱신하는 패턴이다. 급격히 변하는 온라인 표현 대신 안정적인 학습 목표를 제공한다.

## 논문 연결
- DINO는 EMA teacher가 student보다 안정적이고 더 강한 target을 제공한다고 해석한다. momentum을 제거하면 단순 centering만으로는 collapse가 발생한다.
- I-JEPA는 context encoder의 EMA로 target encoder를 갱신하고, target block의 representation-space 목표를 만든다.

## 공통점과 차이
두 방법 모두 EMA target을 사용하지만 목적함수는 다르다. DINO는 crop 간 출력 분포를 cross-entropy로 정렬하고, I-JEPA는 context에서 target patch embedding을 L2 loss로 예측한다.

## 연구 질문
- EMA decay schedule이 안정성과 적응 속도 사이 균형에 미치는 영향은 무엇인가?
- target encoder의 품질을 독립적으로 진단할 수 있는 지표는 무엇인가?
