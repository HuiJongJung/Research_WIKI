---
type: "concept"
slug: "descriptor-matching"
title: "Descriptor Matching"
status: "draft"
modified_at: "2026-06-02T19:10:04.885130+00:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "raw/papers/Discriminative Unsupervised Feature Learning with Exemplar Convolutional Neural Networks.pdf"
tags:
  - "descriptor-matching"
  - "feature-matching"
  - "correspondence"
  - "sift"
  - "mvs"
  - "sfm"
---

# Descriptor Matching

## Definition
Descriptor matching은 두 이미지의 local point/patch를 descriptor vector로 표현한 뒤, 벡터 간 유사도를 비교해 같은 지점이나 같은 local structure를 대응시키는 작업이다.

넓게 보면 feature matching의 한 방식이다.

```text
feature matching: 이미지 간 feature 대응을 찾는 넓은 개념
descriptor matching: local feature를 descriptor vector로 만들고 거리/유사도로 matching하는 방식
```

## Why It Matters
Descriptor matching은 object category를 맞히는 classification과 다르다. 핵심 질문은 “이 이미지가 어떤 class인가?”가 아니라 “이미지 A의 이 patch가 이미지 B의 어느 patch와 같은 구조인가?”이다.

그래서 class label보다 edge, texture, local shape, geometry, viewpoint/blur/lighting 변화에 대한 robustness가 중요하다.

## Where It Appears
- Exemplar-CNN Section 5는 classification이 아니라 descriptor matching에서 learned CNN feature를 평가한다.
- 비교 대상은 SIFT, supervised AlexNet feature, Exemplar-CNN-orig, Exemplar-CNN-blur이다.
- MVS, SfM, SLAM, image stitching, stereo matching 등에서도 correspondence를 찾기 위해 같은 계열의 개념이 쓰인다.

## Mechanisms
일반적인 흐름은 다음과 같다.

```text
1. 이미지에서 interest point 또는 local region을 찾음
2. 각 point/patch 주변을 descriptor vector로 표현함
3. descriptor 간 distance 또는 similarity를 계산함
4. 가장 가까운 descriptor pair를 match로 선택함
5. 필요하면 geometric verification으로 잘못된 match를 제거함
```

예시:

```text
patch A -> descriptor d_A
patch B -> descriptor d_B

distance(d_A, d_B)가 작으면 같은 지점/구조일 가능성이 높음
```

## Failure Modes / Bias
- Blur, lighting change, viewpoint change, scale change에 descriptor가 약하면 matching이 실패한다.
- 비슷한 반복 패턴이 많으면 잘못된 correspondence가 생길 수 있다.
- Classification label로 학습한 supervised feature는 semantic category에는 강하지만, local correspondence에는 최적이 아닐 수 있다.
- Descriptor distance가 작아도 실제 geometry상 대응점이 아닐 수 있어 geometric verification이 필요할 수 있다.

## Open Questions
- Classification용 representation과 descriptor matching용 representation은 어떤 invariance/equivariance를 다르게 가져야 하는가?
- SIFT 같은 hand-crafted descriptor와 CNN descriptor는 blur/viewpoint/lighting 변화에서 어떤 failure mode가 다른가?
- MVS/SfM에서 learned descriptor를 사용할 때, local matching 성능과 downstream 3D reconstruction 품질은 얼마나 직접적으로 연결되는가?
