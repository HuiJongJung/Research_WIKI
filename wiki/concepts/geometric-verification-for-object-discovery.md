---
type: "concept"
slug: "geometric-verification-for-object-discovery"
title: "Geometric Verification for Object Discovery"
status: "draft"
modified_at: "2026-06-02T19:51:51.388835+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Unsupervised Visual Representation Learning by Context Prediction.pdf"
tags:
  - "object-discovery"
  - "geometric-verification"
  - "visual-data-mining"
  - "patch-constellation"
  - "self-supervised-learning"
---

# Geometric Verification for Object Discovery

## Definition
패치나 local feature의 nearest neighbor가 단순히 appearance만 비슷한지, 아니면 여러 부분이 다른 이미지에서도 일관된 공간 배열을 유지하는지를 확인하여 object-like cluster를 고르는 절차다.

## Why It Matters
단일 patch nearest neighbor는 object part뿐 아니라 반복 texture에도 쉽게 반응한다. Object discovery에서는 여러 patch가 함께 같은 구조를 이루는지 확인해야 texture cluster와 object cluster를 구분할 수 있다. Context Prediction 논문은 self-supervised patch feature와 약한 geometric verification을 결합해 label 없는 object discovery를 수행한다.

## Where It Appears
Context Prediction Section 4.5는 네 개 adjacent patch constellation을 샘플링하고, 각 patch의 strong nearest neighbor가 있는 top 100 images를 찾은 뒤, 네 match가 같은 공간 구성을 유지하는지 검증한다. Pascal VOC 2011에서는 cats, people, birds, torsos, food plates 같은 cluster를 발견하고, Paris Street View에서는 scene layout과 architectural element cluster를 발견한다. (p.7-9, Fig. 7-9)

## Mechanisms
1. Query constellation sampling: 한 이미지에서 서로 인접한 네 patch를 뽑아 작은 object/part layout 후보를 만든다.
2. Independent feature matching: 각 patch의 feature nearest neighbor를 찾되, 처음에는 spatial layout을 무시한다.
3. Spatial consistency check: 네 match center에 가장 잘 맞는 정사각형 `S`를 least squares로 맞추고, 정규화된 squared error가 threshold보다 작은지 본다.
4. Cluster ranking: top 100 match 중 geometric verification을 통과한 비율로 constellation을 ranking한다.
5. Redundancy control: 많은 cluster가 중복되므로 coverage 기준으로 cluster를 선택한다.

```text
normalized_error = SSE(patch_centers, S) / side(S)^2
verified if normalized_error < 1
```

## Failure Modes / Bias
- Deformable object는 rigid square-like verification에 일부 실패할 수 있다.
- 너무 약한 검증은 purity를 낮추고, 너무 강한 검증은 coverage를 낮춘다.
- 반복 구조가 규칙적인 texture나 architectural pattern은 object처럼 통과할 수 있다.
- Context Prediction 논문은 object mask를 자동 산출하지 못한다고 명시한다. 더 많은 sub-patch를 동적으로 추가하는 방법이 가능한 개선 방향으로 언급된다. (p.7)

## Open Questions
- Modern DINO/MAE/I-JEPA feature를 쓰면 patch constellation verification의 purity와 mask 품질이 얼마나 좋아지는가?
- Square constraint 대신 deformable part graph나 learned geometric model을 쓰면 bird, torso, animal 같은 deformable object를 더 잘 찾을 수 있는가?
- Object discovery cluster ranking에서 coverage와 purity를 동시에 최적화하는 calibration-free score를 만들 수 있는가?
