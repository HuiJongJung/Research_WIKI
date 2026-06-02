---
type: "source"
slug: "physgaussian-physics-integrated-3d-gaussians"
title: "PhysGaussian: Physics-Integrated 3D Gaussians for Generative Dynamics"
status: "draft"
modified_at: "2026-06-02T07:40:17.151987+00:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Physics-Integrated 3D Gaussians for Generative Dynamics.pdf"
tags:
  - "3d-gaussian-splatting"
  - "physics-based-dynamics"
  - "mpm"
  - "continuum-mechanics"
  - "generative-dynamics"
---

# PhysGaussian: Physics-Integrated 3D Gaussians for Generative Dynamics

## Ingest Metadata
- PDF: `C:\Users\jinsw712\Desktop\Files\Research_WIKI\raw\papers\Physics-Integrated 3D Gaussians for Generative Dynamics.pdf`
- 읽기 방식: `pdf_render_screenshots`로 전체 13페이지 이미지+텍스트를 먼저 확인하고, 5-8페이지는 `pdf_extract_text`로 보강했다.
- 주요 시각 근거: Fig. 1 WS2 개념, Fig. 2 전체 pipeline, Fig. 3 재질 다양성, Fig. 4 baseline 비교, Fig. 5 ablation, Fig. 6 internal filling, Fig. 7 volume conservation, Fig. 8 anisotropy regularizer, Tab. 1 PSNR 비교, Tab. 2-3 constitutive model/material parameter appendix.

## Paper Says

### Problem / Setting
- 기존 NeRF/3DGS 기반 동적 장면 또는 편집 방법은 렌더링 표현과 시뮬레이션 표현이 분리되는 경우가 많다. mesh, tetrahedralization, cage mesh, exported mesh 같은 중간 geometry embedding이 필요해질 수 있고, 이 과정에서 시뮬레이션 해상도와 렌더링 해상도 사이의 불일치가 생긴다.
- 목표는 정적 이미지와 camera information으로 학습한 3D Gaussian scene을, 별도 mesh 변환 없이 물리 기반 novel motion으로 진화시키고 여러 viewpoint에서 렌더링하는 것이다.

### Core Proposal
- PhysGaussian은 3D Gaussian kernel 자체를 continuum discretization의 particle처럼 다룬다. 즉 같은 Gaussian들이 시뮬레이션의 물질점이자 렌더링 primitive가 된다.
- 논문은 이 원리를 “what you see is what you simulate (WS2)”로 설명한다. 렌더링에 보이는 representation과 물리적으로 움직이는 representation을 통일한다는 뜻이다.
- 물리 쪽은 custom Material Point Method (MPM)와 continuum mechanics로 처리하고, 렌더링 쪽은 변형된 Gaussian을 기존 3DGS splatting 절차로 직접 그린다.

### Method Pipeline
- 입력 이미지와 카메라 정보를 사용해 정적 3D Gaussian Splatting 표현 `{X_p, A_p, sigma_p, C_p}`를 재구성한다.
- 선택적으로 anisotropic loss term을 넣어 지나치게 가늘어진 Gaussian kernel을 억제한다.
- 선택적으로 opacity field 기반 internal filling을 수행해 표면 근처에만 있는 Gaussian 분포를 volumetric particle set으로 보강한다.
- Gaussian ellipsoid를 continuum particle로 보고 MPM time integration을 수행한다.
- deformation map과 deformation gradient로 Gaussian center, covariance, spherical harmonics 방향을 업데이트한다.
- 변형된 Gaussian `{x_p(t), a_p(t), sigma_p, C_p}`를 여러 viewpoint에서 splatting 렌더링한다.

### Key Equations / Symbols
- 3DGS rendering: Eq. (1)은 z-depth ordered opacity compositing으로 pixel color를 계산한다. Gaussian center `x_p`, opacity `sigma_p`, covariance `A_p`, spherical harmonic coefficient `C_p`가 기본 scene primitive다.
- Continuum mechanics: deformation map `x = phi(X,t)`, deformation gradient `F = nabla_X phi`가 local stretch, rotation, shear를 표현한다. Eq. (2)는 mass conservation, Eq. (3)는 momentum conservation이다.
- MPM update: Eq. (4)는 grid velocity update에서 stress term과 external force를 사용한다. particle-grid transfer로 velocity, position, elastic deformation gradient를 갱신한다.
- Gaussian kinematics: Eq. (5)-(8)은 local affine approximation `x_p + F_p(X-X_p)` 아래 material-space Gaussian이 world-space Gaussian으로 유지되고 covariance가 `F_p A_p F_p^T`로 변환됨을 보인다.
- SH orientation: Eq. (9)는 polar decomposition `F_p = R_p S_p`에서 회전 `R_p`를 얻고, view direction에 inverse rotation을 적용해 spherical harmonic basis를 회전시키는 방식이다.
- Incremental covariance: Eq. (10)은 deformation gradient 전체를 직접 쓰지 않고 `dot a = grad(v)a + a grad(v)^T` rate form으로 covariance를 갱신하는 대안이다.
- Internal filling: Eq. (11)은 Gaussian opacity field `d(x)`를 만들고 threshold crossing ray test로 내부 candidate grid를 찾는다.
- Anisotropy regularizer: Eq. (12)는 Gaussian scaling의 장축/단축 비율이 threshold `r`을 넘지 않게 penalize한다.

### Runtime vs Training Inputs
- Training/reconstruction input: 정적 장면의 multi-view images와 camera info. real-world toast/jam은 iPhone으로 촬영하고 COLMAP으로 initial point cloud/camera parameter를 얻었다고 설명한다.
- Simulation input: 사용자가 선택한 simulation region, material parameters, density, velocity edits/external forces 등. 일부 particle의 velocity를 선택적으로 바꿔 controlled motion을 만든다.
- Runtime/rendering input: time-integrated Gaussian states와 원하는 camera viewpoint. 결과는 physics-based dynamics sequence와 novel-view rendering이다.

### Losses / Supervision
- 기본 3DGS 학습은 per-view `L1` loss와 SSIM loss를 사용한다.
- PhysGaussian 자체의 motion generation은 비디오 supervision으로 dynamic field를 학습하는 방식이 아니라, 정적 3DGS에 물리 시뮬레이션을 부여하는 방식이다.
- optional anisotropic regularizer `L_aniso`를 정적 3DGS reconstruction 학습에 추가할 수 있다.
- material parameter는 자동 추정하지 않고 수동 설정한다.

### Baselines / Metrics / Results
- Material versatility: Fig. 3은 elastic fox, plastic metal plane, toast fracture, granular ruins, viscoplastic jam, sofa collision을 보여준다.
- 일부 단순 dynamics는 1/24초 frame 기준 real-time에 근접하거나 초과한다고 보고한다: plane 30 FPS, toast 25 FPS, jam 36 FPS.
- Lattice deformation benchmark에서 NeRF-Editing, Deforming-NeRF, PAC-NeRF와 비교한다. Tab. 1에서 Ours가 wolf/stool/plant의 bend/twist 전 케이스에서 가장 높은 PSNR을 보인다.
- Ablation은 Fixed Covariance, Rigid Covariance, Fixed Harmonics를 비교한다. Gaussian covariance를 변형 가능하게 만들고 spherical harmonics를 회전시키는 설계가 artifact 감소와 PSNR 향상에 기여한다고 주장한다.
- Fig. 6은 internal filling이 없으면 hollow-shell처럼 collapse하기 쉽고, filling이 있으면 Young's modulus `E`와 Poisson ratio `nu`에 따라 stiffness/volume preservation 제어가 가능함을 보여준다.
- Fig. 7은 ARAP 기반 NeRF-Editing보다 volume conservation을 더 잘 유지한다고 주장한다. Fig. 8은 anisotropy regularizer가 burr/plush artifact를 줄이는 예시다.

### Limitations / Assumptions
- Shadow evolution을 고려하지 않는다.
- material parameters는 수동 설정이다.
- 자동 parameter assignment는 GS segmentation과 differentiable MPM을 결합하는 미래 작업으로 제안된다.
- geometry-aware 3DGS reconstruction을 도입하면 dynamics 품질을 개선할 수 있다고 본다.
- 더 다양한 liquid-like materials와 직관적 user control, LLM 기반 control 가능성을 future work로 언급한다.
- Opacity와 SH coefficient는 기본적으로 시간 불변으로 두며, SH는 local rotation만 보정한다. 큰 topological/appearance change에서 이 가정이 깨질 수 있다.

## Interpretation
- 이 논문의 핵심은 “3DGS를 예쁜 렌더링 primitive로만 보지 않고, 시뮬레이션 particle로도 쓰자”는 representation unification이다. 4DGS류가 관측된 동작을 맞추는 쪽이라면, PhysGaussian은 정적 장면을 물리 법칙으로 움직이게 하는 생성형 dynamics에 가깝다.
- 중요한 기술적 연결고리는 deformation gradient다. center만 옮기는 것이 아니라 covariance ellipsoid와 SH 방향까지 local affine deformation에 맞춰 갱신하기 때문에, rendering primitive의 모양과 appearance orientation이 물리 변형을 따라간다.
- 연구 아이디어 관점에서는 “rendering representation을 simulation state로 격상시키는 것”이 재사용 가치가 크다. Gaussian, point, surfel, voxel 등 다른 explicit representation에도 같은 질문을 던질 수 있다: 보이는 primitive가 곧 물리 상태인가, 아니면 proxy에 embedding되어 있는가?
- 다만 이 논문은 물성 추정이나 control learning 문제를 풀지는 않는다. 실제 asset production이나 robotics-style interaction으로 확장하려면 material parameter inference, segmentation, contact/control interface가 별도 핵심 문제가 된다.

## Open Questions
- 정적 multi-view image만으로 얻은 Gaussian 분포가 실제 mass distribution을 얼마나 잘 근사하는가?
- opacity field 기반 internal filling은 복잡한 topology, thin structure, transparent/reflective object에서 얼마나 안정적인가?
- material parameter를 수동 지정할 때, visual plausibility와 physical correctness 사이의 trade-off를 어떻게 평가할 수 있는가?
- SH coefficient를 시간 불변으로 두는 가정은 fracture, wetness, lighting change, self-shadowing 같은 appearance dynamics에서 얼마나 한계가 되는가?
- MPM resolution과 Gaussian count 사이의 mismatch가 커질 때 WS2 원리가 실제로 얼마나 유지되는가?

## Relations
- Related concepts: `what-you-see-is-what-you-simulate`, `deformation-gradient-gaussian-kinematics`, `opacity-field-internal-filling`, `anisotropy-regularized-gaussian-reconstruction`.
- Related baselines discussed by paper: 3D Gaussian Splatting, Dynamic/4D Gaussian Splatting, NeRF-Editing, Deforming-NeRF, PAC-NeRF, MPM-based continuum simulation.
