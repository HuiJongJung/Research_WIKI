---
type: "comparison"
slug: "splatting-trends-2025h2-2026h1"
title: "Splatting Trends 2025H2-2026H1"
status: "draft"
modified_at: "2026-06-18T19:37:34+09:00"
author: "Codex"
language: "ko"
confidence: "medium"
sources:
  - "discussion:2026-06-18-splatting-trends-user-question"
  - "discussion:2026-06-18-seminar-reframing-gs-triangle-usability"
  - "https://arxiv.org/abs/2506.24096"
  - "https://openaccess.thecvf.com/content/ICCV2025/html/Gao_SurfaceSplat_Connecting_Surface_Reconstruction_and_Gaussian_Splatting_ICCV_2025_paper.html"
  - "https://openaccess.thecvf.com/content/ICCV2025/html/Zhou_MGSR_2D3D_Mutual-boosted_Gaussian_Splatting_for_High-fidelity_Surface_Reconstruction_under_ICCV_2025_paper.html"
  - "https://arxiv.org/html/2509.22276v2"
  - "https://arxiv.org/abs/2509.25122"
  - "https://arxiv.org/abs/2602.14493"
  - "https://arxiv.org/html/2603.24725v2"
  - "https://arxiv.org/html/2605.00569v1"
  - "https://arxiv.org/html/2605.10360v1"
  - "https://arxiv.org/abs/2605.26115"
  - "https://arxiv.org/pdf/2606.00444"
tags:
  - "comparison"
  - "gaussian-splatting"
  - "surface-reconstruction"
  - "mesh-extraction"
  - "simulation-ready"
  - "triangle-splatting"
  - "research-trends"
---

# Splatting Trends 2025H2-2026H1

## 요약

2025년 후반부터 2026년 초반 splatting 계열의 흐름은 "보기 좋은 radiance primitive"에서 "실제로 쓸 수 있는 surface, mesh, material, physics-compatible representation"으로 이동하고 있다. 핵심 문제의식은 단순하다. 3DGS는 novel view rendering에는 강하지만, photometric loss로 최적화된 fuzzy/volumetric primitive이므로 downstream에서 필요한 watertight mesh, fixed topology, collision, relighting, material label, simulation property를 안정적으로 제공하지 못한다.

따라서 최신 흐름은 3DGS를 그대로 고도화하기보다, surface prior나 mesh/topology를 optimization loop 안에 넣거나, 아예 triangle/surface sample primitive로 splatting을 재정의하는 방향으로 갈라진다.

## 관찰된 큰 방향

### 1. Post-hoc mesh extraction에 대한 불신

기존 방식은 3DGS를 먼저 잘 학습한 뒤 depth fusion, Poisson reconstruction, TSDF, marching cubes 등으로 mesh를 뽑는다. 그러나 이 접근은 photometric optimum과 geometric optimum이 다르다는 문제를 피하기 어렵다.

- view-dependent appearance가 geometry로 흡수된다.
- reflective/transparent/fuzzy 영역에서 surface가 흔들린다.
- floating Gaussian과 needle-like artifact가 mesh extraction 단계에서 noise가 된다.
- dynamic scene에서는 frame마다 topology가 바뀌어 physics engine에 넣기 어렵다.

MILo는 이 문제를 "a posteriori conversion"의 한계로 보고, mesh를 매 iteration에서 differentiably 추출해 Gaussian과 mesh가 같은 geometry를 보도록 만든다. Confidence-Based Mesh Extraction도 view-dependent effect가 많은 장면에서 photometric/geometric supervision의 균형을 self-supervised confidence로 조절하려 한다.

### 2. 2DGS, SDF, normal/depth prior를 통한 surface alignment

3D Gaussian을 완전한 volumetric ellipsoid로 두면 surface ambiguity가 크다. 그래서 2DGS나 surface-aligned primitive를 쓰고, monocular depth/normal prior 또는 SDF를 붙여 geometry를 더 강하게 잡는 흐름이 강하다.

- SurfaceSplat: SDF는 coarse/global geometry를 제공하고, 3DGS rendering은 detail과 novel view를 보강한다.
- MGSR: 2DGS branch가 surface reconstruction을 담당하고, 3DGS branch가 rendering과 illumination decomposition을 담당한다.
- 2D-SuGaR: 2DGS를 depth/normal prior로 초기화 및 regularization하고, pruning과 mesh refinement를 붙인다.
- SwiftNDC: neural depth correction으로 dense geometry initialization을 개선해 GS 기반 mesh reconstruction을 빠르고 안정적으로 만든다.

이 흐름의 요지는 "splatting이 geometry를 알아서 배울 것"이라고 믿지 않고, surface evidence를 외부/내부 prior로 계속 밀어 넣는 것이다.

### 3. Mesh-in-the-loop와 mesh-native splatting

더 강한 흐름은 mesh를 후처리 산물이 아니라 학습 대상의 일부로 넣는 것이다.

- MILo: Gaussian parameter에서 vertex와 connectivity를 반복적으로 구성한다.
- Gaussian Mesh Renderer: mesh triangle에서 Gaussian primitive를 analytic하게 유도해 lightweight differentiable mesh rendering을 한다.
- MeshSplatting 계열: mesh-based reconstruction과 splatting appearance를 결합해 AR/VR, game engine pipeline compatibility를 노린다.
- Triangle Splatting / Triangle Splatting+: Gaussian 대신 triangle을 differentiable splatting primitive로 직접 최적화한다.
- TriSplat: sparse/pose-free setting에서 oriented triangle primitive를 feed-forward로 예측하고 simulation-ready mesh scene을 바로 export하는 방향이다.

특히 Triangle Splatting+와 TriSplat은 "Gaussian을 mesh로 바꾸자"보다 한 단계 더 나아가 "처음부터 triangle primitive로 radiance field를 만들자"에 가깝다.

### 4. Rendering benchmark에서 실제 활용 benchmark로 이동

최근 논문들은 PSNR/SSIM/LPIPS만 보지 않고, 다음 downstream 요구를 점점 명시한다.

- physics simulation: fixed topology, collision, volumetric filling, MPM/soft body compatibility
- robotics/sensor simulation: material label, LiDAR reflectivity, digital twin
- game/AR/VR: standard renderer, mesh export, collision mesh, navigation mesh
- relighting/inverse rendering: normal, roughness, reflectance, illumination decomposition
- dynamic scene: temporally consistent mesh, topology stability

Real-Time Physics Simulation with Dynamic Mesh-Gaussian Reconstructions는 varying-topology high-fidelity mesh를 fixed-topology physics mesh로 후처리 변환하면 65-80% geometric degradation이 생길 수 있다고 보고한다. 즉, physics-ready topology는 reconstruction 후처리로 쉽게 붙는 속성이 아니라 처음부터 objective에 들어가야 한다는 쪽으로 결론이 난다.

## 최신 논문 지도

| 시기 | 논문 | 방향 | 메모 |
| --- | --- | --- | --- |
| 2025.06 | MILo | mesh-in-the-loop | Gaussian으로부터 mesh vertex/connectivity를 매 iteration differentiable하게 구성 |
| 2025 ICCV | SurfaceSplat | SDF + 3DGS hybrid | SDF의 global geometry와 3DGS의 rendering detail을 상호 보완 |
| 2025 ICCV | MGSR | 2DGS + 3DGS mutual boost | 2DGS는 surface, 3DGS는 rendering/illumination decomposition |
| 2025.09 | GS-2M | material-aware mesh reconstruction | reflective surface에서 view-dependent artifact가 geometry를 망치는 문제를 material/roughness supervision으로 완화 |
| 2025.09 | ROS-GS | relightable outdoor GS | 2DGS geometry 기반으로 outdoor lighting decomposition |
| 2025.09 | Triangle Splatting+ | opaque triangle splatting | engine-compatible opaque/semi-connected triangle output 지향 |
| 2025.11 | Material-informed GS for Digital Twin | mesh + material label | camera-only GS reconstruction을 mesh/material/sensor simulation으로 연결 |
| 2026.02 | Gaussian Mesh Renderer | mesh-derived Gaussian renderer | triangle mesh optimization을 3DGS rasterization 방식으로 가볍게 미분 |
| 2026.02 | SwiftNDC | depth-corrected initialization | neural depth correction으로 GS mesh reconstruction 초기 geometry 개선 |
| 2026.03 | Confidence-Based Mesh Extraction | confidence-guided geometry | view-dependent ambiguity에서 photometric/geometric supervision 균형 조절 |
| 2026.05 | 2D-SuGaR | 2DGS + depth/normal prior | SfM 의존성을 줄이고 degenerate Gaussian pruning 및 mesh refinement |
| 2026.05 | 3DSS | surface splatting for inverse rendering | oriented surface samples로 geometry, NVS, relighting을 함께 다룸 |
| 2026.05 | DySurface | dynamic mesh extraction | explicit Gaussian, dynamic SDF, mesh를 연결해 temporally consistent deformable mesh 추출 |
| 2026.05 | TriSplat | feed-forward triangle primitive | pose-free sparse view에서 simulation-ready mesh를 단일 forward pass로 export |
| 2026.05 | UAV Scan-to-Simulation | GS + MPM simulation | low-anisotropy 3DGS와 volumetric conversion으로 landslide simulation 연결 |
| 2026.06 | Real-Time Physics Simulation with Dynamic Mesh-Gaussian Reconstructions | fixed-topology physics mesh + GS rendering | physics-ready topology와 high-fidelity reconstruction의 trade-off를 정량 평가 |

## 방법론별 차이

| 계열 | representation | 장점 | 약점 |
| --- | --- | --- | --- |
| 순수 3DGS 개선 | anisotropic 3D Gaussian | photorealistic, fast rendering, capture-friendly | surface/mesh/topology 보장 약함 |
| surface-aligned GS / 2DGS | flattened Gaussian disk | geometry consistency와 mesh extraction이 쉬움 | fuzzy, transparent, volumetric 효과 표현이 줄어듦 |
| SDF + GS hybrid | implicit field + splats | global coherence와 detail을 같이 노림 | 시스템 복잡도 증가, neural component 비용 |
| mesh-in-the-loop | Gaussian + differentiable mesh | 후처리 손실을 줄이고 mesh를 학습 중 교정 | connectivity construction과 optimization 안정성이 어려움 |
| triangle splatting | triangle primitive | renderer/engine compatibility, sharp boundary, high FPS | connected/watertight/manifold mesh는 별도 문제 |
| mesh-Gaussian dual representation | mesh for physics/editing + GS for appearance | simulation/editing과 photorealistic rendering 분업 | 두 representation의 consistency 유지가 핵심 난점 |
| material-aware GS | geometry + roughness/reflectance/material | reflective/specular artifact가 geometry를 오염시키는 문제 완화 | material supervision/segmentation/lighting decomposition이 필요 |

## 연구 방향성

### A. Mesh는 결과물이 아니라 constraint가 되어야 한다

앞으로 "3DGS to mesh"만으로는 novelty가 약하다. 강한 방향은 mesh를 학습 loop 안에 넣거나, mesh-compatible primitive를 직접 최적화하는 것이다. MILo, Triangle Splatting+, TriSplat이 이 방향의 기준점이다.

### B. 단일 primitive보다 역할 분리가 중요해진다

모든 영역을 Gaussian, 2D disk, triangle 중 하나로 설명하려는 접근은 실패 모드가 명확하다. 더 유망한 방향은 region별 역할 분리다.

- stable opaque surface: triangle, mesh, 2DGS
- thin/high-frequency structure: small triangle, line-like primitive, rank-aware primitive
- fuzzy/uncertain appearance: residual 3D Gaussian
- reflective/specular: material/lighting residual layer
- transparent/translucent: 별도 transparent-aware primitive 또는 auxiliary layer

이 관점은 기존 [[geometry-prior-and-residual-layer-splatting]] 및 [[material-uncertainty-auxiliary-splat-layers]]와 직접 연결된다.

### C. "보이는 것"과 "쓸 수 있는 것"의 metric이 분리된다

Rendering quality와 usable geometry는 다른 objective다. 앞으로 평가도 다음 축을 포함해야 한다.

- mesh accuracy: Chamfer, normal consistency, watertightness, edge preservation
- engine compatibility: triangle count, renderer FPS, exportability
- physics readiness: fixed topology, collision stability, volumetric filling, simulator FPS
- material readiness: roughness/reflectance label quality, relighting error, sensor simulation error
- dynamic consistency: temporal topology stability, deformation plausibility

### D. Post-hoc conversion보다 native fixed topology가 중요하다

2026년 physics 관련 결과는 high-fidelity varying-topology mesh를 나중에 fixed topology로 바꾸면 품질 손실이 크다는 쪽이다. simulation-ready를 목표로 한다면 reconstruction 단계에서 fixed topology 또는 template/part-aware topology를 직접 제약해야 한다.

## Novelty Risk for User Claims

사용자 아이디어가 "Gaussian을 잘 mesh로 변환한다" 수준이면 SuGaR, GS2Mesh, MILo, 2D-SuGaR, Confidence-Based Mesh Extraction과 겹칠 위험이 크다.

사용자 아이디어가 "triangle을 직접 splatting한다" 수준이면 Triangle Splatting, Triangle Splatting+, TriSplat과 겹친다.

사용자 아이디어가 "mesh와 Gaussian을 같이 둔다" 수준이면 MeshGS, MaGS, MeshSplatting, material-informed digital twin 계열과 겹칠 수 있다.

차별화 가능성이 큰 지점은 다음이다.

- primitive mixture 자체보다 **failure-mode-specific role assignment**
- surface primitive와 residual primitive의 **objective separation**
- geometry confidence, material uncertainty, effective rank를 이용한 **region-wise primitive selection**
- physics/editing/relighting 중 하나를 명확히 목표로 한 **downstream-first benchmark**
- fixed-topology constraint와 photorealistic residual layer를 동시에 다루는 **dual representation consistency**

## Working Claim

2025H2-2026H1 splatting 연구의 중심은 "3DGS의 rendering fidelity를 더 높이는 것"에서 "photorealistic representation을 mesh, material, topology, physics와 어떻게 결합해 실제 pipeline에 넣을 것인가"로 이동했다. 따라서 새 연구 아이디어는 단순히 Gaussian, 2DGS, triangle 중 하나를 고르는 문제가 아니라, scene region의 geometry/material/uncertainty evidence에 따라 surface layer와 residual layer의 역할을 분리하고, 그 결과가 downstream task에서 실제로 유효함을 보여야 한다.

## User Idea Connection

사용자의 초기 관심은 `GS + triangle primitive로 rendering quality를 높이기`였지만, 이 비교에서 드러난 최신 흐름은 claim을 다음처럼 바꿔야 함을 시사한다.

```text
Not: hybrid primitive로 PSNR/visual quality만 높이기.
But: Triangle Splatting 계열의 mesh-compatible 장점을 유지하면서,
     SfM initialization, connectivity, pruning, pure triangle optimization의 한계를
     temporary Gaussian residual/uncertainty probe로 진단하고,
     충분히 geometry로 확신되는 영역만 mesh refinement로 승격하기.
```

이 연결은 [[residual-guided-mesh-refinement-splatting]] claim에서 구체화된다.

## Open Questions

- Triangle primitive가 Gaussian을 대체할 것인가, 아니면 surface layer만 담당하고 appearance residual은 Gaussian이 남을 것인가?
- Fixed topology를 처음부터 강제하면 reconstruction fidelity가 얼마나 희생되는가?
- Reflective/transparent material에서 geometry와 view-dependent residual을 분리하는 최소 supervision은 무엇인가?
- Effective rank, normal consistency, depth variance, photometric residual을 하나의 primitive assignment policy로 묶을 수 있는가?
- 평가를 rendering 중심에서 simulation/editing/relighting 중심으로 옮길 때 가장 설득력 있는 benchmark는 무엇인가?

## 2026-07 Landscape Scan (5-axis, ~200편 병렬 조사)

geometry/mesh · dynamic/physics · feed-forward/efficiency · appearance/rendering · generative/applications 5축을 독립 에이전트로 훑은 전면 스캔. 위 §들이 geometry/mesh 축에 집중했다면, 이 절은 GS 전체 지형도를 기록한다.

### 메타 트렌드: feed-forward foundation model이 전 축을 먹는 중

5축에서 독립적으로 같은 결론 도출 — **per-scene optimization → single feed-forward pass 붕괴.** DUSt3R→VGGT→LRM 계열 geometry foundation model이 backbone이 되며 reconstruction·generation(FlashWorld 텍스트→씬 9s)·semantics(SegSplat, LangSplat 대비 59×)·SLAM(Flash-Mono)까지 단일 패스로 이동. 월 단위 cadence + 서베이·벤치마크(E3D-Bench, ReactSim-Bench) 등장 = consolidation/표준화 국면. **glTF KHR_gaussian_splatting 표준 2026 Q2 비준 예정** — GS가 산업 교환 포맷으로. GS는 이제 렌더러가 아니라 생성·언어·에이전트가 공유하는 3D world representation.

### 축별 히트맵

| 축 | 주요 movement | 🔴 포화 | 🟢 신흥(2026) |
| --- | --- | --- | --- |
| geometry/mesh | post-hoc 추출 → explicit primitive를 미분 loop 안에 | "2DGS+regularizer" 우물 말랐음, DTU/T&T object-level 포화 | closed-form watertight 추출(Gaussian Wrapping), rasterizable-SDF end-to-end(SDFRaster), robotics용 distance field(SplatlessDF), polarimetric geometry |
| dynamic/physics | GS+실제 물리엔진=sim-ready 4D | 4D 압축/스트리밍, 단일물체 MPM 클론, SMPL+LBS 아바타 | scene-level heterogeneous 물리(unified particle, 2606.21753), physics를 recon prior로(PersistGS/NGFF), robotics digital-twin |
| feed-forward/efficiency | foundation model backbone화 (분야 최고속) | pixel-aligned 2-view FF-GS, pose-free 변주, anchor+entropy 압축 | one-Gaussian-per-pixel 탈피(VolSplat/SparseSplat), feed-forward 압축, in-the-wild/streaming |
| appearance/rendering | deferred PBR + explicit ray tracing(3DGRT/3DGUT) | object-centric specular(논문 10+ 미세변주), 기본 AA | GI-correct inverse rendering, 새 재질(translucent/SSS·glass), GS↔엔진 브릿지(GaSLight/GBake) |
| generative/apps | GS × video-diffusion/world-model 융합 | 단일이미지→씬 생성, LangSplat식 per-scene 증류 | feed-forward semantics, MLLM-agent 3D reasoning, executable GS(SAGE-3D+InteriorGS), driving world model |

### 교차 패턴 3

1. **feed-forward가 전부를 삼킴** — per-scene optimization은 "구 패러다임"화.
2. **physics는 meshless가 이김** — MPM/particle이 continuum·fracture·fluid·scene-level 지배. mesh/FEM은 rigid-contact·저작·엔진 interop 니치로 후퇴. → [[residual-guided-mesh-refinement-splatting]]의 Novelty Review corridor를 landscape 차원에서 재확인.
3. **ray tracing + PBR + engine interop 표준화** — raster/RT 경계 붕괴, glTF 표준, GS→Blender/Unity 브릿지. "usable/engine-compatible"이 분야 전체 방향.

### 핵심 주요 논문 (축별, 최신순 발췌)

- **geometry/mesh**: Gaussian Wrapping/From Blobs to Spokes(2604.07337, watertight closed-form), SDFRaster(2604.23537), MeshSplatting(2512.06818), OMeGa(2509.24308, joint mesh+GS Chamfer −47%), MILo(2506.24096), QGS(quadric, ICCV'25), AmbiSuR(2605.12494, photometric ambiguity 정식화), SplatlessDF(2606.13990), GSPrior(CVPR'26).
- **dynamic/physics**: Scene-Level Heterogeneous Physics(2606.21753, CVPR'26, unified particle), i-PhysGaussian(2602.17117, implicit MPM 20× step), GaussianFluent(2601.09265, brittle fracture CD-MPM), NGFF(2602.00148, ICLR'26), PersistGS(2606.03479, rigid-body prior), GS-Verse(2510.11878, mesh-FEM), GaussTwin(2603.05108).
- **feed-forward**: VGGT(CVPR'25 backbone), AnySplat(SIGA'25), Long-LRM++(64뷰), VolSplat(voxel-aligned), YoNoSplat(2511.07321, universal), Mamba-VGGT(long-seq), 서베이 2507.14501.
- **appearance**: 3DGUT(CVPR'25 Oral, secondary rays), 3DGRT(NVIDIA), MaterialRefGS(2510.11387), Path-Traced Inverse Rendering w/ GI(2606.09606), RT-GS/RT-Splatting(glass), GaSLight(→Blender)/GBake(→Unity).
- **generative/apps**: FlashWorld(ICLR'26 Oral, 텍스트→씬 9s), SegSplat(2511.18386), REALM(CVPR'26 MLLM-agent), SAGE-3D(2510.21307, executable GS+InteriorGS), GSWorld/D-REX(robotics real2sim), Flash-Mono(feed-forward SLAM).

### 사용자 방향에의 함의 — 열린 자리 3

분야 지표가 Chamfer → vertex-count/compactness/sim-readiness로 이동 중(usable-geometry가 시대정신). **단, 네가 서 있던 정확한 자리("mesh-in-the-loop + watertight 추출")는 MILo/OMeGa/Gaussian Wrapping이 top 선점 = 붐빔.** 지형도가 가리키는 열린 공터:

- **A. usable-geometry의 소비자 downstream으로 내려가기** — geometry-recon 축 자체보다, 그 geometry를 실제로 쓰는 executable GS(SAGE-3D), robotics real2sim(GSWorld/D-REX), embodied nav가 더 신선하고 비어 있음. "렌더만 되는 geometry"가 실패하는 게 명확 → "usable ≠ accurate" 문제의식이 진짜 고객을 만남. **(추천)**
- **B. feed-forward × usable geometry** — 거의 모든 게 feed-forward로 넘어가는데 watertight/sim-ready geometry의 feed-forward 버전은 아직 얕음(SurfelSplat, MeshSplat AAAI'26 정도). 열린 조합.
- **C. meshless가 못 하는 corridor 실증** — [[residual-guided-mesh-refinement-splatting]] make-or-break와 동일. landscape가 "meshless가 이겼다"를 확인해줬으니 그 예외를 못 박는 가치가 더 분명.

## Related WIKI Pages

- [[geometry-prior-and-residual-layer-splatting]]
- [[adaptive-rank-primitive-splatting]]
- [[mesh-compatible-radiance-field]]
- [[mesh-based-novel-view-synthesis]]
- [[material-uncertainty-auxiliary-splat-layers]]
- [[what-you-see-is-what-you-simulate]]
- [[triangle-splatting]]
- [[triangle-splatting-plus]]
- [[gs-mesh-extraction-reading-map]]
- [[residual-guided-mesh-refinement-splatting]]
