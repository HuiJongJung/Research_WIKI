---
type: "concept"
slug: "primitive-lifecycle-for-splatting"
title: "Primitive Lifecycle for Splatting"
status: "draft"
modified_at: "2026-06-17T07:08:36.391943+00:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Triangle Splatting.pdf"
tags:
  - "splatting"
  - "densification"
  - "pruning"
  - "primitive-lifecycle"
  - "optimization"
---

# Primitive Lifecycle for Splatting

## Definition
Primitive lifecycle for splatting은 splatting representation에서 primitive를 어떻게 초기화, 이동, split/densify, clone, prune, opacity reset/anneal할지를 정하는 optimization-side 설계다. Triangle Splatting에서는 triangle의 compact support 때문에 coverage가 부족한 곳을 채우고 single-view overfit triangle을 제거하는 pruning/splitting routine이 핵심 구성요소다.

## Why It Matters
Splatting 성능은 loss function만으로 결정되지 않는다. 어떤 primitive가 늘어나고 줄어드는지, 어떤 shape가 split되는지, 어떤 primitive가 투명해져 제거되는지가 최종 geometry와 artifact를 크게 좌우한다. Triangle Splatting의 `L_o`, `L_s`, opacity/`sigma^-1` sampling, two-view pruning은 모두 primitive lifecycle 설계다.

## Where It Appears
- Triangle Splatting Sec. 3.2: pruning and densification. (p.5-6)
- Fig. 4: two-view visibility pruning으로 floaters를 줄임. (p.5)
- Table 3: opacity loss 제거가 가장 큰 성능 악화를 만듦. (p.8)
- Supplementary A.2: 500-25000 iteration 사이 500 iteration마다 shape 수 30% 증가. (p.16)
- Effective Rank GS와 연결: Gaussian shape regularization도 densification/split criterion과 함께 설계되어야 한다.

## Mechanisms
- **Pruning by weight**: training view 전체에서 maximum blending weight `T · o`가 threshold보다 낮으면 triangle 제거.
- **Pruning by multi-view visibility**: 두 view 이상에서 1 pixel 초과로 보이지 않는 triangle 제거.
- **Densification by learned state**: opacity와 inverse `sigma`를 번갈아 sampling probability로 사용해 split할 triangle 선택.
- **Midpoint subdivision**: 선택 triangle의 edge midpoint를 연결해 4개 smaller triangle로 분할.
- **Small triangle clone**: 너무 작은 triangle은 split 대신 plane orientation 방향 noise를 더해 clone.
- **Size regularization**: sparse region coverage를 위해 작은 triangle에 penalty를 준다.

## Failure Modes / Bias
- Pruning threshold가 높으면 필요한 thin/far geometry가 사라질 수 있다.
- Low `sigma`를 선호하는 densification은 solid surface coverage에는 좋지만 fuzzy/transparent phenomenon에는 bias가 있을 수 있다.
- Multi-view visibility pruning은 sparse camera setup에서 실제 구조를 overfit으로 오해할 수 있다.
- Lifecycle hyperparameter가 dataset/scene type에 민감할 수 있다.

## Open Questions
- Lifecycle rule을 hand-designed threshold 대신 uncertainty, visibility, normal consistency, gradient distribution으로 자동화할 수 있는가?
- Gaussian, 2DGS, triangle이 섞인 hybrid splatting에서는 primitive type별 lifecycle을 어떻게 조정해야 하는가?
- Prune/split decision이 final mesh compatibility나 connectedness를 직접 개선하도록 만들 수 있는가?
