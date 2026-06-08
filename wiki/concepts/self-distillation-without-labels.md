---
type: "concept"
slug: "self-distillation-without-labels"
title: "Self-Distillation Without Labels"
status: "draft"
modified_at: "2026-06-08T08:46:11.245137+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/DINO-Emerging Properties in Self-Supervised Vision Transformers.pdf"
tags:
  - "self-supervised-learning"
  - "self-distillation"
  - "dino"
  - "teacher-student"
  - "collapse-prevention"
  - "soft-targets"
---

# Self-Distillation Without Labels

## Definition
Self-distillation without labels는 human label이나 fixed pretrained teacher 없이, 학습 중 생성되는 teacher signal을 student가 맞추도록 하는 self-supervised learning 패턴이다. DINO에서는 teacher와 student가 같은 architecture를 공유하고, teacher는 student weight의 EMA로 갱신되며, teacher output distribution을 center+sharpen한 soft target으로 사용한다.

## Why It Matters
이 개념은 라벨 없는 데이터에서 target을 어떻게 만들 것인가라는 SSL의 핵심 문제에 답한다. contrastive learning은 negative pair나 queue로 representation collapse를 피하지만, DINO는 teacher-student self-distillation과 output distribution 제어만으로 ViT feature를 학습한다. 그 결과 ImageNet linear evaluation뿐 아니라 k-NN, retrieval, attention-based object discovery에서도 강한 feature가 나온다.

## Where It Appears
- DINO source page: [Emerging Properties in Self-Supervised Vision Transformers](../sources/dino-self-distillation-vit.md)
- p.2: DINO를 라벨 없는 knowledge distillation으로 소개하고 Fig. 2로 student-teacher 구조를 그림.
- p.3: Eq. 1-3과 Algorithm 1에서 softmax temperature, cross-entropy, multi-crop distillation objective를 정의.
- p.4: teacher가 external model이 아니라 student EMA로 만들어진다는 점을 설명.

## Mechanisms
- 같은 이미지에서 여러 crop/view를 만든다.
- teacher는 global view를 보고 target probability distribution을 만든다.
- student는 local/global view의 output distribution을 teacher target에 맞춘다.
- teacher branch에는 stop-gradient가 걸린다.
- teacher parameter는 student parameter의 EMA로 갱신된다.
- teacher output은 centering으로 dimension domination을 줄이고, sharpening으로 uniform collapse를 막는다.

```text
H(P_t(x), P_s(x')) = - P_t(x) log P_s(x')
```

DINO의 중요한 점은 distillation target이 class label이 아니라 teacher가 만든 K차원 soft distribution이라는 것이다. 이 target은 semantic class를 직접 의미하지 않지만, 반복 학습 속에서 image/view consistency와 teacher averaging을 통해 안정적인 representation target이 된다.

## Failure Modes / Bias
- teacher를 student copy나 previous iteration으로 너무 빠르게 따라가게 만들면 collapse할 수 있다.
- centering만 쓰면 uniform output collapse를 유도할 수 있고, sharpening만 쓰면 한 dimension domination collapse가 날 수 있다.
- teacher temperature가 너무 높으면 target이 충분히 sharp하지 않아 collapse가 발생할 수 있다.
- self-distillation target은 teacher가 이미 가진 bias를 student에게 반복 전달하므로, augmentation과 crop policy가 잘못되면 잘못된 invariance를 강화할 수 있다.

## Open Questions
- teacher EMA가 왜 DINO에서는 학습 중 student보다 지속적으로 좋은 target을 만드는가?
- soft target의 dimension `K`와 entropy가 feature geometry와 k-NN 친화성에 어떤 영향을 주는가?
- self-distillation target을 dense token, video, 3D scene representation으로 확장할 때 collapse 방지 조건은 어떻게 달라지는가?
