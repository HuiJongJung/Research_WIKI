---
type: "concept"
slug: "deformation-gradient-gaussian-kinematics"
title: "Deformation-Gradient Gaussian Kinematics"
status: "draft"
modified_at: "2026-06-02T09:33:06.492582+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Physics-Integrated 3D Gaussians for Generative Dynamics.pdf"
tags:
  - "deformation-gradient"
  - "gaussian-kinematics"
  - "3d-gaussian-splatting"
  - "continuum-mechanics"
  - "spherical-harmonics"
---

# Deformation-Gradient Gaussian Kinematics

## Definition
Deformation-gradient Gaussian kinematics는 continuum deformation gradient `F_p`를 사용해 3D Gaussian의 center뿐 아니라 covariance ellipsoid와 spherical harmonic orientation까지 시간에 따라 갱신하는 메커니즘이다. PhysGaussian에서는 local affine approximation 아래 material-space Gaussian이 world-space에서도 Gaussian 형태를 유지하고, covariance가 `F_p A_p F_p^T`로 변환된다.

## Why It Matters
동적 3DGS에서 center만 이동시키면 Gaussian ellipsoid가 실제 local stretch, shear, rotation을 반영하지 못한다. Rigid transform만 적용해도 non-rigid deformation의 local shape change를 놓친다. Deformation gradient를 covariance update에 쓰면 rendering primitive가 물리적 deformation의 first-order structure를 담기 때문에, deformed surface coverage와 view-dependent appearance consistency가 좋아질 수 있다.

## Where It Appears
- Sec. 3.2: `F(X,t)=nabla_X phi(X,t)`가 local stretch, rotation, shear를 encoding한다고 설명한다. (p.3)
- Sec. 3.4 Eq. 5-8: nonlinear deformation map을 local affine approximation으로 근사해 deformed Gaussian covariance `F_p A_p F_p^T`를 얻는다. (p.4)
- Sec. 3.5 Eq. 9: `F_p = R_p S_p` polar decomposition으로 local rotation을 얻고 SH basis orientation을 갱신한다. (p.5)
- Sec. 3.6 Eq. 10: total `F_p` 없이 velocity gradient로 covariance를 incrementally update하는 대안을 제시한다. (p.5)
- Fig. 5/Table 1: Fixed Covariance, Rigid Covariance, Fixed Harmonics ablation이 full kinematics의 필요성을 검증한다. (p.7-8)

## Mechanisms
- Material point `X_p` 주변에서 deformation map을 `x_p + F_p(X-X_p)`로 1차 근사한다.
- Gaussian center는 `x_p(t)=phi(X_p,t)`를 따른다.
- Gaussian covariance는 `a_p(t)=F_p(t) A_p F_p(t)^T`로 변형된다.
- Polar decomposition `F_p=R_pS_p`에서 `R_p`를 얻어 SH view direction에 inverse rotation을 적용한다.
- Incremental formulation에서는 `dot a=(nabla v)a+a(nabla v)^T`를 time discretization해 covariance를 갱신한다.

## Failure Modes / Bias
- Local affine approximation은 Gaussian support 안에서 deformation이 충분히 부드럽다는 가정에 의존한다. Fracture, contact, sharp bending 근처에서는 한 Gaussian 내부의 deformation이 affine하지 않을 수 있다.
- Covariance가 물리적 material volume을 정확히 뜻하는 것은 아니다. 3DGS covariance는 rendering optimization의 산물이므로 physical inertia/mass와 불일치할 수 있다.
- SH rotation은 local rotation만 반영하고, shadow evolution이나 complex lighting change는 다루지 않는다.
- Full method와 일부 ablation의 PSNR 차이가 작은 case가 있어, qualitative artifact와 metric을 함께 봐야 한다.

## Open Questions
- Gaussian covariance를 physical strain/volume과 더 엄밀하게 맞추는 reconstruction objective를 만들 수 있는가?
- Contact/fracture boundary에서 Gaussian splitting 또는 topology-aware covariance update가 필요한가?
- Dynamic 3DGS의 learned deformation field와 MPM deformation gradient를 결합하면 관측 motion과 physics prior를 함께 사용할 수 있는가?
- SH orientation update 외에 shadow, interreflection, material appearance change를 physics state와 연결할 수 있는가?
