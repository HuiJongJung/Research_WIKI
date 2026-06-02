---
type: "concept"
slug: "anisotropy-regularized-gaussian-reconstruction"
title: "Anisotropy-Regularized Gaussian Reconstruction"
status: "draft"
modified_at: "2026-06-02T07:46:09.112640+00:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Physics-Integrated 3D Gaussians for Generative Dynamics.pdf"
tags:
  - "anisotropy-regularization"
  - "3d-gaussian-splatting"
  - "dynamic-rendering"
  - "artifact-control"
---

# Anisotropy-Regularized Gaussian Reconstruction

## Definition
Anisotropy-regularized Gaussian reconstruction은 3D Gaussian의 scaling에서 장축/단축 비율이 지나치게 커지지 않도록 학습 loss를 추가하는 방법이다. PhysGaussian에서는 Eq. (12)의 `L_aniso`가 Gaussian kernel의 extreme anisotropy를 제한한다.

## Why It Matters
- 3DGS는 anisotropic ellipsoid 덕분에 표현 효율이 높지만, 매우 가느다란 Gaussian은 큰 deformation에서 바깥으로 튀어나오며 burr/plush artifact를 만들 수 있다.
- 물리 기반 변형에서는 정적 reconstruction 때 harmless해 보이던 over-skinny kernel이 dynamics 품질을 크게 해칠 수 있다.
- reconstruction 단계에서 dynamic robustness를 고려하는 regularization이라는 점에서 재사용 가치가 있다.

## Where It Appears
- Fig. 2 pipeline의 optional anisotropic loss term.
- Sec. 3.8 Eq. (12): scaling ratio가 threshold `r`을 넘지 않게 하는 loss.
- Fig. 8: regularizer 유무에 따른 stool deformation artifact 비교.

## Mechanisms
- 각 Gaussian scaling `S_p`에서 `max(S_p)/min(S_p)`를 계산한다.
- ratio가 threshold `r`보다 커지는 경우 평균 penalty를 부여한다.
- 정적 3DGS reconstruction loss에 optional term으로 추가한다.
- 이후 physics-driven deformation에서 Gaussian shape가 덜 극단적이어서 surface coverage와 rendering fidelity가 안정된다.

## Failure Modes / Bias
- 지나친 regularization은 정적 장면의 fine detail 표현력을 낮출 수 있다.
- 모든 anisotropic Gaussian이 나쁜 것은 아니므로, threshold 선택이 scene/material에 따라 달라질 수 있다.
- dynamic artifact를 줄이지만 물리 parameter나 internal mass distribution 문제를 해결하지는 않는다.
- thin object나 hair/cloth-like structure에서는 anisotropy 제한이 오히려 표현을 방해할 수 있다.

## Open Questions
- 정적 rendering PSNR과 dynamic deformation robustness 사이의 최적 regularization 강도는 어떻게 선택할 수 있는가?
- material class에 따라 anisotropy threshold를 다르게 학습하거나 예측할 수 있는가?
- geometry-aware Gaussian reconstruction과 함께 쓰면 over-skinny artifact를 더 근본적으로 줄일 수 있는가?
