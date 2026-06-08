---
type: "concept"
slug: "momentum-target-encoders"
title: "Momentum Target Encoders"
status: "draft"
modified_at: "2026-06-08T08:46:30.462091+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/DINO-Emerging Properties in Self-Supervised Vision Transformers.pdf"
  - "raw/papers/Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture.pdf"
tags:
  - "self-supervised-learning"
  - "ema"
  - "momentum-encoder"
  - "teacher-student"
  - "target-encoder"
  - "model-averaging"
---

# Momentum Target Encoders

## Definition
Momentum target encoder는 online/student encoder의 parameter를 exponential moving average로 누적해 teacher 또는 target encoder를 만드는 패턴이다. 직접 gradient를 받는 branch와 느리게 움직이는 target branch를 분리해, 빠르게 흔들리는 online model보다 더 안정적인 학습 목표를 제공한다.

## Why It Matters
라벨 없는 학습에서는 target이 불안정하면 representation collapse가 나기 쉽다. Momentum target encoder는 target을 과거 student들의 가중 평균으로 만들어 online ensemble처럼 작동하게 한다. DINO에서는 이 teacher가 학습 내내 student보다 높은 k-NN 성능을 보이며, student가 더 나은 target을 추종하도록 만든다.

## Where It Appears
- DINO: [Emerging Properties in Self-Supervised Vision Transformers](../sources/dino-self-distillation-vit.md)
- I-JEPA: [I-JEPA](../sources/ijepa.md)
- DINO p.4: teacher update rule과 Polyak-Ruppert averaging 해석.
- DINO p.9: Fig. 6에서 momentum teacher, previous epoch teacher, student copy를 비교.
- DINO p.15: Table 15에서 momentum이 없으면 centering만으로 collapse하고, momentum이 안정성과 성능을 모두 개선함을 보임.

## Mechanisms
```text
theta_t <- lambda theta_t + (1 - lambda) theta_s
```

- `theta_s`: gradient로 업데이트되는 student/online parameter.
- `theta_t`: stop-gradient target/teacher parameter.
- `lambda`: momentum coefficient. DINO에서는 0.996에서 1까지 증가하는 cosine schedule을 사용한다.
- target encoder는 현재 mini-batch gradient에 직접 흔들리지 않는다.
- EMA는 최근 student를 반영하되 고주파 noise를 줄여 안정적 target을 만든다.

DINO에서는 momentum teacher가 contrastive queue의 대체물이 아니라, teacher-student distillation의 target generator다. I-JEPA에서는 context encoder가 EMA target encoder의 representation-space target block을 예측한다. 두 경우 모두 target branch는 stop-gradient이고, online branch만 loss로 업데이트된다.

## Failure Modes / Bias
- momentum이 너무 낮으면 teacher가 student를 거의 복사해 target이 불안정해질 수 있다.
- momentum이 너무 높으면 teacher adaptation이 느려져 새로운 representation 구조를 늦게 반영할 수 있다.
- DINO에서는 momentum이 없을 때 centering만으로 collapse가 난다.
- EMA teacher는 과거 bias를 평균하므로, 초기 collapse 또는 shortcut이 생기면 target 자체가 그 bias를 보존할 수 있다.

## Open Questions
- momentum schedule은 학습 단계별 target entropy, feature anisotropy, dense correspondence에 어떤 영향을 주는가?
- online model보다 target model이 좋은 순간을 자동 감지해 target update 속도를 조절할 수 있는가?
- DINO식 distribution target과 I-JEPA식 representation target에서 EMA teacher가 하는 역할은 어디까지 같은가?
