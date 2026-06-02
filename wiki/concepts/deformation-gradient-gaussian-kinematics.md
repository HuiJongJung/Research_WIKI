---
type: "concept"
slug: "deformation-gradient-gaussian-kinematics"
title: "Deformation-Gradient Gaussian Kinematics"
status: "draft"
modified_at: "2026-06-02T07:44:31.527920+00:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Physics-Integrated 3D Gaussians for Generative Dynamics.pdf"
tags:
  - "deformation-gradient"
  - "gaussian-kinematics"
  - "continuum-mechanics"
  - "3d-gaussian-splatting"
---

# Deformation-Gradient Gaussian Kinematics

## Definition
Deformation-gradient Gaussian kinematics는 continuum deformation gradient `F_p`를 사용해 3D Gaussian의 center뿐 아니라 covariance ellipsoid와 spherical harmonic orientation까지 업데이트하는 메커니즘이다. PhysGaussian에서는 local affine approximation 아래 covariance가 `F_p A_p F_p^T`로 변형된다.

## Why It Matters
- center만 이동시키는 dynamic point/Gaussian 방식보다 local stretch, rotation, shear를 더 잘 반영한다.
- 변형 후 Gaussian이 표면을 덮지 못하는 artifact를 줄인다.
- rendering primitive의 모양이 물리 시뮬레이션의 first-order deformation 정보를 따라가기 때문에 고품질 novel-view rendering을 유지하기 쉽다.

## Where It Appears
- Sec. 3.4 Eq. (5)-(8): material-space Gaussian이 local affine deformation을 거쳐 world-space Gaussian으로 유지되는 유도.
- Sec. 3.5 Eq. (9): polar decomposition `F_p = R_p S_p`로 얻은 rotation을 spherical harmonics view direction에 반영.
- Sec. 3.6 Eq. (10): total deformation gradient 대신 velocity gradient 기반 rate form으로 covariance를 incremental update하는 대안.
- Fig. 5와 Tab. 1: Fixed Covariance, Rigid Covariance, Fixed Harmonics ablation에서 설계 선택의 효과를 비교.

## Mechanisms
- MPM이 particle별 velocity와 deformation gradient를 갱신한다.
- Gaussian center는 deformation map `phi(X_p,t)`를 따른다.
- covariance는 `F_p A_p F_p^T` 또는 incremental covariance update로 변한다.
- SH basis는 실제 basis를 바꾸기보다 view direction에 inverse rotation을 적용해 등가적으로 회전시킨다.

## Failure Modes / Bias
- local affine approximation이 큰 비선형 deformation을 충분히 표현하지 못할 수 있다.
- opacity와 SH coefficient 자체는 시간 불변이라는 가정이 남아 있다.
- fracture나 topology change에서 covariance update와 appearance update의 일관성이 깨질 수 있다.
- MPM time step/grid resolution이 부적절하면 rendering artifact와 simulation instability가 동시에 나타날 수 있다.

## Open Questions
- Gaussian covariance의 물리적 의미를 실제 material volume/shape와 어떻게 정량적으로 맞출 수 있는가?
- appearance coefficient를 deformation, lighting, stress와 함께 진화시키면 어떤 supervision이 필요한가?
- dynamic 3DGS reconstruction과 physics-driven Gaussian kinematics를 결합하면 관측 기반/법칙 기반 dynamics를 어떻게 균형 잡을 수 있는가?
