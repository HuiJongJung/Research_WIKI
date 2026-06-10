---
type: "concept"
slug: "needle-like-gaussian-artifacts"
title: "Needle-Like Gaussian Artifacts"
status: "draft"
modified_at: "2026-06-10T09:10:36.736449+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Effective Rank GS.pdf"
tags:
  - "gaussian-splatting"
  - "artifacts"
  - "needle-like-gaussians"
  - "surface-reconstruction"
---

# Needle-Like Gaussian Artifacts

## Definition
Needle-like Gaussian artifact는 3D Gaussian Splatting에서 Gaussian covariance가 한 축만 크게 남고 나머지 축이 작아져 `erank ~= 1`에 가까운 elongated primitive가 많이 생기면서, novel view rendering이나 normal/mesh reconstruction에 spiky, hollow, transparent, hole-like artifact를 만드는 현상이다.

## Why It Matters
3DGS에서는 anisotropic Gaussian이 표현 효율을 높이지만, surface reconstruction에서는 Gaussian이 의미 있는 surface area를 덮어야 한다. Needle-like Gaussian은 flat하게 보일 수 있어도 disk-like surface primitive와 달리 surface coverage가 작고, training view에 overfit된 geometry를 만들 수 있다. Effective Rank GS는 needle count가 증가해도 PSNR/Chamfer가 plateau되는 사례를 보여 artifact와 overfitting의 연결을 제시한다.

## Where It Appears
- Effective Rank GS Fig. 1: vanilla 3DGS novel view에서 needle-like artifact가 나타나고 erank regularization이 이를 완화한다. (p.2)
- Fig. 2: 3DGS, SuGaR, 2DGS 모두 training 후반에 `erank ~= 1` Gaussian으로 몰리는 histogram을 보인다. (p.3, p.6)
- Fig. 5: pear normal reconstruction에서 needle-like Gaussian이 hollow/incomplete surface를 만든다. (p.8)
- Fig. 6: `erank(G_k) < 1.02` Gaussian을 red로 시각화해 artifact 위치와 연결한다. (p.9)
- Table 5: DTU scene 37에서 3DGS needle count가 0 -> 3170 -> 16320으로 증가하지만 PSNR은 plateau된다. (p.14)

## Mechanisms
- 3DGS optimization은 sparse SfM point에서 시작하고 photometric loss로 primitive를 움직인다.
- Screen-space dilation과 implicit shrinkage bias 때문에 scale이 과소 추정될 수 있다.
- 긴 축 방향 이동은 pixel 변화가 작아 gradient가 약하다.
- 기존 ADC는 gradient vector를 먼저 합산한 뒤 norm을 취하므로 disk-like Gaussian의 넓은 support에서 signal cancellation이 생길 수 있다.
- Split이 충분히 일어나지 않으면 primitive가 긴 축을 따라 분할되는 대신 scale 조절로 대응하고, 한 축 지배적 needle shape로 수렴한다.

## Failure Modes / Bias
- Needle-like Gaussian을 모두 제거하면 실제 thin structure 표현력이 떨어질 수 있다.
- Artifact 판단을 rank 값 하나로만 하면, 필요한 elongated support와 overfitting artifact를 혼동할 수 있다.
- Novel view에서만 드러나는 artifact는 training-view photometric loss로는 잘 잡히지 않을 수 있다.
- Normal/mesh quality와 PSNR이 서로 다르게 움직일 수 있어, single metric 평가가 부족하다.

## Open Questions
- `erank < 1.02` 같은 needle threshold는 scene과 scale에 따라 어떻게 calibration해야 하는가?
- Thin object, hair, wire, foliage처럼 elongated geometry가 필요한 경우와 overfit needle artifact를 어떻게 분리할 수 있는가?
- Rank-aware pruning/splitting을 쓰면 loss regularization 없이도 needle population을 줄일 수 있는가?
