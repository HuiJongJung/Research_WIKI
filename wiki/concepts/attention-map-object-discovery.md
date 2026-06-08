---
type: "concept"
slug: "attention-map-object-discovery"
title: "Attention Map Object Discovery"
status: "draft"
modified_at: "2026-06-08T08:46:50.681737+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/DINO-Emerging Properties in Self-Supervised Vision Transformers.pdf"
tags:
  - "vision-transformer"
  - "self-attention"
  - "object-discovery"
  - "emergent-segmentation"
  - "dense-representation"
  - "self-supervised-learning"
---

# Attention Map Object Discovery

## Definition
Attention map object discovery는 supervised segmentation label 없이 학습된 Vision Transformer의 self-attention map에서 object boundary, object part, scene layout 같은 공간 구조를 추출하는 관찰 또는 기법이다. DINO에서는 마지막 layer의 [CLS] token attention head가 semantic object 영역에 집중하며, thresholding만으로도 object-like mask를 얻을 수 있다.

## Why It Matters
라벨 없는 학습이 classification feature만 만드는 것이 아니라, dense spatial information을 내부 attention 구조에 보존할 수 있음을 보여준다. 이 성질은 weakly supervised segmentation, object localization, video correspondence, pseudo-mask generation, object-centric representation 연구에 재사용될 수 있다.

## Where It Appears
- DINO source page: [Emerging Properties in Self-Supervised Vision Transformers](../sources/dino-self-distillation-vit.md)
- p.1 Fig. 1: ViT-S/8 DINO의 [CLS] attention이 object segmentation처럼 보이는 예시.
- p.7 Fig. 3: 서로 다른 attention head가 object, part, small object에 집중하는 예시.
- p.8 Fig. 4: supervised ViT와 DINO ViT의 thresholded attention mask 및 PASCAL VOC12 Jaccard 비교.
- p.15 Fig. 8: reference point별 self-attention visualization 추가 예시.

## Mechanisms
- 이미지를 patch token sequence로 나누고 [CLS] token을 추가한다.
- ViT의 마지막 block에서 [CLS] token이 각 patch token에 주는 attention weight를 읽는다.
- 특정 attention head 또는 여러 head를 선택해 spatial grid로 reshape한다.
- attention mass의 일정 비율을 thresholding하면 rough object mask가 된다.
- 작은 patch(`/8`)는 token 해상도를 높여 object boundary와 dense correspondence에 유리하다.

DINO에서 이 현상은 segmentation loss로 직접 최적화된 결과가 아니다. 논문은 self-supervised ViT feature가 scene layout을 포함하고, 그 정보가 attention module에서 직접 접근 가능하다는 점을 강조한다.

## Failure Modes / Bias
- attention map은 mask objective로 학습된 것이 아니므로 경계가 부드럽고 instance 분리가 불완전할 수 있다.
- head마다 집중 대상이 달라 head selection이 결과에 큰 영향을 줄 수 있다.
- background clutter, occlusion, small object에서는 attention이 object 전체가 아니라 discriminative part에 몰릴 수 있다.
- supervised ViT보다 DINO가 낫다는 관찰이 모든 SSL objective에서 동일한 downstream segmentation 성능을 보장하지는 않는다.

## Open Questions
- attention head를 자동 선택하거나 ensemble하는 가장 안정적인 기준은 무엇인가?
- attention map object discovery가 feature geometry, patch size, multi-crop, teacher entropy 중 어느 요인에 의해 가장 크게 생기는가?
- DINO attention mask를 pseudo-label로 사용하면 segmentation model 학습에서 어떤 noise filtering이 필요한가?
