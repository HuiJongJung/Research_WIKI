---
type: "concept"
slug: "anisotropy-regularized-gaussian-reconstruction"
title: "Anisotropy-Regularized Gaussian Reconstruction"
status: "draft"
modified_at: "2026-06-02T09:33:45.102327+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Physics-Integrated 3D Gaussians for Generative Dynamics.pdf"
tags:
  - "anisotropy-regularization"
  - "3d-gaussian-splatting"
  - "reconstruction-loss"
  - "dynamic-artifacts"
---

# Anisotropy-Regularized Gaussian Reconstruction

## Definition
Anisotropy-regularized Gaussian reconstruction은 3D Gaussian Splatting의 reconstruction training 중 Gaussian scaling의 장축/단축 비율이 지나치게 커지지 않도록 추가 loss를 주는 방법이다. PhysGaussian에서는 large deformation 상황에서 over-skinny Gaussian kernel이 surface 밖으로 튀어나오며 만드는 burr/plush artifact를 줄이기 위해 optional `L_aniso`를 사용한다.

## Why It Matters
3DGS의 anisotropic ellipsoid는 static rendering에서는 표현 효율을 높이는 장점이 있다. 하지만 Gaussian을 물리 simulation particle로도 사용할 때, 극단적으로 가느다란 ellipsoid는 deformation 후 surface coverage를 망치거나 visual artifact를 만들 수 있다. 따라서 static reconstruction quality만 보는 것이 아니라 downstream dynamics robustness를 고려해 Gaussian shape distribution을 regularize해야 한다.

## Where It Appears
- Sec. 3.8 Eq. 12: Gaussian scaling `S_p`의 major/minor axis ratio를 threshold `r`로 제한하는 loss를 제안한다. (p.5)
- Fig. 2: “Anisotropic Loss Term”이 3DGS optimization의 optional step으로 들어간다. (p.3)
- Fig. 8: anisotropy regularizer가 dynamic condition에서 burr-like artifact를 줄인다는 qualitative comparison을 보여준다. (p.8)

## Mechanisms
- 3DGS reconstruction 중 각 Gaussian scaling `S_p`의 `max(S_p)/min(S_p)`를 계산한다.
- Ratio가 threshold `r`을 넘는 경우 loss가 증가하도록 regularization을 추가한다.
- 이 loss는 원래 3DGS photometric loss를 대체하는 것이 아니라 optional additive term이다.
- 결과적으로 Gaussian이 지나치게 needle-like shape으로 수렴하는 것을 억제한다.
- Deformation-gradient covariance update 이후에도 surface를 더 안정적으로 덮도록 돕는다.

## Failure Modes / Bias
- 모든 anisotropy가 나쁜 것은 아니다. Thin surface, edge, hair-like geometry는 anisotropic Gaussian이 필요할 수 있다.
- Threshold `r`가 너무 낮으면 static reconstruction fidelity가 떨어질 수 있다.
- Regularizer는 visual artifact를 줄이지만, Gaussian이 실제 physical volume/mass를 올바르게 나타내도록 보장하지 않는다.
- PDF의 Eq. 12 표기는 설명상 의도와 구현 확인이 필요한 부분이 있어, 실제 code를 볼 때 thresholding 형태를 확인해야 한다.

## Open Questions
- Dynamic robustness와 static PSNR/SSIM 사이의 optimal anisotropy tradeoff를 자동으로 찾을 수 있는가?
- Geometry-aware 3DGS reconstruction과 anisotropy regularization을 결합하면 over-skinny artifact를 더 근본적으로 줄일 수 있는가?
- Material type에 따라 허용해야 할 anisotropy threshold가 달라져야 하는가?
- Rendering primitive가 simulation particle로도 쓰이는 경우, reconstruction loss에 physical regularity term을 어디까지 넣어야 하는가?
