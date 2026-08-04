---
type: "comparison"
slug: "gs-mesh-extraction-reading-map"
title: "GS Mesh Extraction Reading Map"
status: "draft"
modified_at: "2026-07-06T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "medium"
sources:
  - "discussion:2026-07-01-user-reading-list-review"
  - "discussion:2026-07-06-joint-vs-post-omega-placement"
  - "https://arxiv.org/abs/2509.24308"
  - "https://baowenz.github.io/geometry_grounded_gaussian_splatting/"
  - "https://arxiv.org/html/2601.17835v2"
  - "https://baowenz.github.io/radegs/"
  - "https://arxiv.org/abs/2404.10772"
  - "https://anttwo.github.io/milo/"
  - "https://arxiv.org/abs/2506.24096"
  - "https://diego1401.github.io/BlobsToSpokesWebsite/"
  - "https://arxiv.org/html/2604.07337"
  - "https://arxiv.org/abs/2605.00569"
  - "https://arxiv.org/abs/2506.18575"
  - "https://arxiv.org/abs/2509.25122"
  - "https://meshsplatting.github.io/"
  - "https://arxiv.org/html/2512.06818"
tags:
  - "comparison"
  - "gaussian-splatting"
  - "mesh-extraction"
  - "surface-reconstruction"
  - "reading-plan"
  - "triangle-splatting"
---

# GS Mesh Extraction Reading Map

## 목적

사용자가 읽으려는 mesh 관련 splatting 논문 리스트를 검토하고, 이미 읽은 논문과의 관계를 정리해 읽는 순서를 확정한 페이지다. 넓은 트렌드 정리는 [[splatting-trends-2025h2-2026h1]], primitive prior 비교는 [[geometry-prior-and-residual-layer-splatting]]에 있으므로, 여기서는 **"GS에서 mesh를 어떻게 확보하는가"** 축의 reading plan에 집중한다.

## 두 축으로 나눠 보기

사용자의 전체 독서는 두 축으로 갈린다.

- **Primitive / representation 축 (이미 읽음)**: 렌더 primitive 자체를 mesh 친화적으로 만드는 방향.
  - 2DGS, SuGaR, MeshGS, Effective Rank GS([[effective-rank-gs]]), Triangle Splatting([[triangle-splatting]]), Triangle Splatting+([[triangle-splatting-plus]])
- **Extraction / field 축 (이번 리스트)**: 학습된 Gaussian에서 surface/mesh를 뽑는 방향.
  - GOF, RaDe-GS, GGGS, Gaussian Wrapping, 2D-SuGaR, MILo

두 축은 경쟁이 아니라 **상보적**이다. primitive 축은 "무엇으로 그릴까", extraction 축은 "그린 것에서 어떻게 표면을 꺼낼까"를 다룬다. 사용자가 이미 primitive 축을 커버했으므로, 이번 리스트는 그 위에 얹는 extraction 지식으로 읽으면 된다.

## 대상 논문 계보

extraction 축의 논문들은 네 계보로 묶인다. **핵심 구분 축은 "최적화 시점": mesh를 학습 loop 안에서 함께 최적화(joint)하는가, 학습 끝난 Gaussian에서 사후 추출(post-hoc)하는가.**

| 계보 | 대표 논문 (그룹) | 최적화 축 | mesh 확보 방식 | "바로 쓰는 mesh"인가 |
| --- | --- | --- | --- | --- |
| depth/field → marching | GOF, RaDe-GS, GGGS (RaDe-GS→GGGS 동일 baowenz) | **post-hoc** | opacity/transmittance field → depth → TSDF fusion + Marching Cubes/Tetra | 후처리 필수, recon 품질 mesh |
| occupancy shell | Gaussian Wrapping = From Blobs to Spokes | **post-hoc (closed-form)** | oriented normal로 half-space indicator → attenuation을 reciprocal화 → OaV 이론으로 closed-form occupancy `v(x)=0.5` 유도 → 2-pivot Marching Tetra | watertight + thin structure(스포크), "직접 사용" 주장 |
| mesh-in-the-loop 추출 | MILo (SuGaR→MILo, Guédon) | **joint (진짜 in-loop)** | 매 iter Gaussian을 pivot으로 Delaunay 미분가능 추출, mesh↔Gaussian 양방향 gradient | downstream-ready(적은 vertex, sim/anim) |
| mesh-frame binding | OMeGa(2509.24308), 2D-SuGaR (2DGS 확장) | **joint (binding)** | explicit mesh에 2DGS를 bind(mesh frame) + monocular normal 감독 + face split/prune 공동 최적화 | **texture-less indoor** 강함 (≠ under-observed) |

추가로 검토한 **2D Triangle Splatting for Direct Differentiable Mesh Training**(2506.18575, GaodeRender)은 사용자가 읽은 Held 계열 Triangle Splatting(+)과 **다른 그룹의 별개 논문**이다. 삼각형을 splat으로 최적화 후 export하는 Held 계열과 달리, 처음부터 mesh를 미분가능하게 직접 학습하는 접근이라 "바로 쓰는 mesh" 주제에 정확히 맞아 리스트에 추가한다.

## GGGS의 mesh는 "바로 쓸 수 있는가" (사용자 최초 질문)

- GGGS는 Gaussian을 stochastic solid로 보고 transmittance field에서 depth map을 렌더한 뒤, DTU는 **Open3D TSDF fusion → Marching Cubes**, Tanks&Temples 대규모 씬은 **Marching Tetrahedra**로 mesh를 뽑는다. 어떤 view에서든 transmittance < 0.5로 가려지면 내부로 판정한다.
- 즉 Gaussian을 mesh face에 붙이는 게 아니라, **depth 후처리로 복원하는 표준 surface reconstruction mesh**다. 로드해서 쓸 수는 있으나 후처리가 필수이고, watertight/clean 보장이 아닌 reconstruction 품질(DTU Chamfer ~0.47, T&T F1 ~0.60)이다.
- "바로 쓰는 mesh" 주제에 직접 답하는 건 오히려 **MILo(적은 vertex, sim/animation-ready)** 와 **Gaussian Wrapping(watertight, thin structure)** 이다.

## joint vs post-hoc, 그리고 OMeGa/Wrapping 정밀 배치 (2026-07-06)

사용자 질문("Wrapping은 후처리니 in-loop SOTA는 MILo로 유효한가")에서 파생된 정리. 두 축을 섞으면 안 된다.

### Gaussian Wrapping이 post-hoc인데도 깨끗한 이유 = 표현 설계

- 핵심 트릭은 **Gaussian마다 학습 normal `n_i`를 붙이고 half-space indicator `𝟙[n_iᵀ(x−μ_i)≥0]`로 attenuation을 자르는 것**. 이걸로 기존 3DGS의 방향 의존 attenuation(σ(x,w)≠σ(x,−w))이 **reciprocal**해진다.
- reciprocal이 되면 Objects-as-Volumes(OaV) 이론을 적용 가능 → **vacancy/occupancy field `v(x)`가 학습 없이 closed-form으로 유도**된다. 표면은 `v(x)=0.5` 등가면. NeuS류처럼 SDF를 따로 학습하지 않는다.
- 추출은 Gaussian당 **pivot 2개**(center μ_i, `μ_i+3s_i·n_i`)만 쓰는 Marching Tetra → 가볍고 완전 watertight.
- **함의: MILo가 "mesh를 loop에 넣어" 얻은 정합성을, Wrapping은 "표현(normal)만 바꿔 loop 밖에서 closed-form으로" 얻는다.** = post-hoc이지만 joint급 품질. 단 이 우아함은 **조밀한 multi-view 관측을 전제**(normal alignment loss는 depth gradient, densification은 multi-view 표면 신호에 의존)한다.

### OMeGa는 "texture-less 축"이지 "under-observed 축"이 아니다 (사용자 (B)와 무충돌)

초록+페이지 확인 결과:

- **joint 여부**: "jointly optimizes an explicit triangle mesh and 2D Gaussian splats via a flexible binding strategy(mesh frame)" → 진짜 joint. 단 MILo식 미분 추출이 아니라 **SuGaR 계보의 mesh-frame binding + monocular normal + iterative face split/prune**.
- **"robust"의 정체**: "inaccurate geometry in **texture-less indoor regions**"를 monocular normal supervision으로 고침. → **관측은 충분한데 photometric 신호가 없는** 무텍스처 영역이 타깃. **저관측(under-observed)이 아님.**
- **−47.3% Chamfer는 2DGS 대비**, MILo 대비가 아님. 초록에 MILo 비교 없음. indoor/2DGS 기반이라 MILo(DTU·T&T·object+scene)와 벤치마크가 겹치지 않을 가능성.

| | OMeGa가 고치는 것 | 사용자 (B)가 고치는 것 |
| --- | --- | --- |
| 문제 | texture-less (관측O, 색 신호X) | under-observed (관측 자체 부족, 배경/few-view) |
| 처방 | monocular normal prior (한 장 법선) | SfM confidence 진단 + prior 차등 배분 |
| 왜 다른가 | 뷰 많으니 normal로 채움 | 한 장 법선이 **부재한 multi-view 신호를 대체 못 함** |

→ OMeGa는 옆칸(무텍스처)을 채워 사용자의 빈 칸(저관측)을 **더 또렷하게** 만든다. intro gap statement로 재활용 가능: *"무텍스처는 monocular normal로 해결됐으나, 저관측은 근본적으로 다른 실패 모드이며 어떤 normal prior도 없는 multi-view 신호를 만들 수 없다 → confidence-aware allocation 필요."*

### 결론 — "in-loop SOTA는 MILo로 유효한가"

- **① mesh-in-the-loop 추출(Gaussian에서 미분 추출) 메커니즘 안에서는 MILo가 사실상 무경쟁 SOTA로 유효.** Wrapping/GGGS/GOF는 post-hoc이라 이 링에 없다.
- OMeGa는 ②(mesh-frame binding joint)로 **다른 부류**이며, 헤드라인 −47%가 2DGS 대비라 **MILo 대체 근거가 아직 없다.**
- **미확정 caveat**(본문 정독 필요): (a) OMeGa 본문 table에 MILo 실제 비교 존재 여부, (b) 벤치마크가 ScanNet++ 계열이면 MILo와 비교 불가 확정.
- 어떤 post-hoc/joint 추출기든 **저관측 confidence 신호는 아무도 추출로 안 가져간다** → 사용자 (B)의 열린 자리는 유지.

## 확정 읽기 순서

의존성과 다리 역할을 반영한 순서다.

1. **MILo** — 사용자가 읽은 Triangle Splatting+가 직접 벤치마크하는 지점("MiLo 대비 2× 빠르고 PSNR 4–10dB↑, 후처리 없이 엔진에 바로"). primitive 축↔extraction 축을 잇는 다리.
2. **RaDe-GS** (스킴) — GGGS의 선행(동일 그룹). 개념만 5분 훑고 넘어가기.
3. **GGGS** — transmittance/stochastic solid 기반 depth→marching.
4. **GOF** — opacity field + Marching Tetrahedra.
5. **Gaussian Wrapping** — closed-form occupancy로 watertight, thin structure(자전거 스포크) 복원.
6. **2D-SuGaR** — 2DGS + depth/normal prior + degenerate pruning + mesh joint refinement.
7. **2D Triangle Splatting (2506.18575)** — Held 계열과 대비되는 "direct differentiable mesh" 접근.
8b. **OMeGa (2509.24308)** — mesh-frame binding joint(2DGS를 mesh에 bind) + monocular normal + face split/prune. **texture-less indoor 타깃**, Chamfer −47%는 2DGS 대비(MILo 대비 아님). MILo와의 정면 비교/벤치마크 겹침 여부를 본문에서 확인할 것 = 사용자 base 유효성·(B) 영토 안전성 둘 다 걸린 지점.
9. **MeshSplatting (2512.06818)** — mesh를 splat primitive로 직접 최적화(restricted Delaunay로 connectivity 강제, surface consistency). Triangle Splatting 계열의 "geometry 검증 부재" 고질병을 일부 메운 지점 — **DTU Chamfer를 실제 보고**(mean 0.79)한다. 단 저자 스스로 **watertight는 강제하지 않는다고 명시** → topology 정합성은 여전히 열린 틈. [[residual-guided-mesh-refinement-splatting]]의 직접 기준점.

중복 메모: GOF↔RaDe-GS는 "depth/field→marching"으로 성격이 유사하고 RaDe-GS↔GGGS는 동일 그룹 선행/확장이라, RaDe-GS는 배경으로 가볍게 두고 정독은 GGGS·GOF에 집중해도 된다.

### Triangle/explicit-primitive splatting 계열의 geometry 지표 유무 (2026-07-01 확인)

Triangle splatting 고질병("mesh usability는 보이지만 recon accuracy·watertight 미검증")을 누가 얼마나 메웠는지 조사한 결과:

| 논문 | primitive | geometry 지표 | watertight/topology |
| --- | --- | --- | --- |
| Triangle Splatting / Triangle Splatting+ (Held) | 삼각형 | ❌ (PSNR/SSIM/LPIPS·verts만) | ❌ |
| 3D Convex Splatting (Held) | convex | ❌ (edge는 정성적) | ❌ |
| 2D Triangle Splatting (GaodeRender) | 삼각형 | △ Chamfer(NeRF-Synthetic·DTU), T&T F1 없음 | ❌ |
| MeshSplatting | mesh(Delaunay) | △ DTU Chamfer(0.79) | ❌ (자기 인정) |
| TetSphere Splatting | tetrahedral | ✅ Chamfer·F-Score·Normal·Manifoldness 100% | ✅ (단 object 도메인, scene 아님) |

결론: **scene-level triangle/mesh splatting에서 geometry accuracy + watertight를 동시에 제대로 검증한 논문은 아직 없다.** MeshSplatting이 가장 근접하지만 watertight를 명시적으로 포기 → 이 지점이 claim 표적.

## 사용자 연구와의 연결

- extraction 축을 다 읽고 나면, 사용자의 기존 claim([[adaptive-rank-primitive-splatting]], [[residual-guided-mesh-refinement-splatting]])과 붙일 지점이 명확해진다. 핵심은 "post-hoc conversion의 photometric↔geometric optimum 불일치"를 어떻게 피하느냐이며, MILo/Gaussian Wrapping이 그 기준점이다.
- Effective Rank([[effective-rank-gs]])의 disk-like 정규화 논리는 GOF/RaDe-GS/2DGS가 flat primitive를 선호하는 이유와 직접 연결되므로, extraction 축을 읽을 때 rank 관점을 계속 대응시키면 좋다.

## Open Questions

- MILo/Gaussian Wrapping의 "직접 사용 가능" 주장이 실제 downstream(physics fixed-topology, engine export)에서 어디까지 성립하는가?
- depth/field→marching 계열(GOF/RaDe-GS/GGGS)의 후처리 품질 차이는 field 정의(opacity vs transmittance vs occupancy)에서 얼마나 오는가?
- Held 계열 Triangle Splatting과 GaodeRender의 2D Triangle Splatting은 "triangle 직접 최적화" 목표가 같은데, connectivity/watertightness 확보에서 실제 delta가 무엇인가?

## Discussion Captures

### 2026-07-06

joint vs post-hoc 축을 명시화하고 OMeGa/Gaussian Wrapping을 정밀 배치한 논의.

- Gaussian Wrapping은 oriented normal → reciprocal attenuation → OaV closed-form occupancy로 **post-hoc이면서 watertight**를 얻는다(표현 설계로 loop 우회). 단 조밀 관측 전제.
- OMeGa의 "robust"는 **texture-less indoor**(monocular normal로 처리)이지 **under-observed**가 아니다. −47% Chamfer는 2DGS 대비이므로 MILo 대체 근거가 아니다.
- **결론: ① mesh-in-loop 추출 SOTA로 MILo 유효 / 사용자 (B)=저관측 confidence 영토는 무충돌·유지.**
- Capture rationale: MILo base의 지속 유효성과 (B) 라인의 리뷰어 방어 논리(무텍스처≠저관측)를 lab memory로 고정. OMeGa 본문 정독으로 검증할 미확정 항목(MILo 실측 비교, 벤치마크 겹침) 명시.

## Related WIKI Pages

- [[splatting-trends-2025h2-2026h1]]
- [[geometry-prior-and-residual-layer-splatting]]
- [[adaptive-rank-primitive-splatting]]
- [[residual-guided-mesh-refinement-splatting]]
- [[effective-rank-gs]]
- [[triangle-splatting]]
- [[triangle-splatting-plus]]
