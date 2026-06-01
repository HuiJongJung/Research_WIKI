---
type: "concept"
slug: "self-distillation-without-labels"
title: "Self-Distillation Without Labels"
status: "draft"
modified_at: "2026-06-01T15:11:25.352369+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Emerging Properties in Self-Supervised Vision Transformers.pdf"
tags:
  - "self-supervised-learning"
  - "self-distillation"
  - "dino"
  - "momentum-teacher"
  - "collapse-prevention"
---

# Self-Distillation Without Labels

## 정의
고정된 지도 label 없이 student가 teacher의 출력 분포를 따라가도록 학습하는 자기지도 접근이다. teacher는 외부 pretrained model이 아니라 학습 중인 student의 누적 상태로 만들 수 있다.

## DINO 사례
- student와 teacher는 동일한 구조를 사용한다.
- teacher는 student weight의 EMA로 갱신된다.
- 서로 다른 crop 간 teacher output과 student output을 cross-entropy로 정렬한다.
- centering과 sharpening으로 collapse를 방지한다.
- multi-crop 학습과 momentum teacher가 성능에 핵심적이다.

## 관찰
DINO의 momentum teacher는 학습 과정에서 student보다 지속적으로 높은 성능을 보이며 ensemble target처럼 동작한다. ViT와 결합하면 단순 k-NN 분류와 attention 기반 공간 정보가 강하게 나타난다.

## 연구 질문
- EMA teacher가 제공하는 안정성이 어떤 조건에서 collapse 방지와 표현 품질 개선으로 이어지는가?
- teacher update, crop 구성, patch 크기를 바꿀 때 dense representation 품질은 어떻게 달라지는가?
