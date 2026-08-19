---
type: "comparison"
slug: "single-object-sota-failure-modes"
title: "단일 물체 GS mesh recon SOTA와 자인된 실패 사례"
status: "draft"
modified_at: "2026-08-19T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "raw/papers/2D Gaussian Splatting for Geometrically Accurate Radiance Fields.pdf"
  - "raw/papers/MILo.pdf"
  - "raw/papers/GOF_Gaussian Opacity Fields - Efficient Adaptive Surface Reconstruction in Unbounded Scenes.pdf"
  - "raw/papers/Revisiting Photometric Ambiguity for Accurate Gaussian-Splatting.pdf"
  - "https://arxiv.org/abs/2406.06521"
  - "https://arxiv.org/abs/2406.01467"
  - "https://arxiv.org/abs/2509.18090"
  - "https://arxiv.org/abs/2608.10602"
tags:
  - "sota-survey"
  - "failure-modes"
  - "survey-q14"
  - "motivation"
---

# 단일 물체 GS mesh recon SOTA와 자인된 실패 사례

> SURVEY_BRIEF Q-14. 목적은 motivation의 "SOTA는 [특정 케이스]에서 실패한다"를 원문 근거로 채우는 것이며, **실패 사례가 가장 중요한 산출물**이다.
> 조사일 2026-08-19. SOTA 순위표는 [[gs-surface-recon-sota-2026]](08-09 확정, 재조사 안 함)을 재사용하고, 이 페이지는 실패 사례를 얹는다.

## 1. 단일 물체 SOTA 현황 (DTU mean Chamfer, 낮을수록 좋음)

[[gs-surface-recon-sota-2026]]의 표를 물체 무대 기준으로 요약한다. 수치 출처는 그 페이지에 셀 단위로 있다.

| 순위 | 기법 | DTU CD | 코드 | 계열 |
| --- | --- | --- | --- | --- |
| 1 | AmbiSuR (ICML 2026) | 0.46 | 공개 `[원문 확인]` | GS, PGSR 개량 |
| 2 | GeoSVR (NeurIPS 2025 Spotlight) | 0.47 | 공개 | sparse voxel (GS 아님) |
| 3 | GVGS (arXiv 2601.20331) | 0.49 | 공개 | GS, 가시성 인지 (자기 표 SOTA 주의) |
| 4 | PGSR (TVCG 2024) | 0.52 | 공개 | GS, 평면 기반 |
| 4 | GausSurf (arXiv 2411.19454) | 0.52 `[2차 자료]` | coming soon | GS + MVS 반복 |
| — | MILo (SIGGRAPH Asia 2025) | 0.68 | 공개 | GS, in-loop. **base 중 하나** |

**신규 발견 (08-19)**: Gaussian Sculpting (arXiv 2608.10602v1, 2026-08-11, DUT 외) `[원문 확인]`. **코드 미공개, v1이 최신** (Q-23③, 08-19 확인 — 공식 저장소 검색 불발, 추적 계속). SDF를 직접 최적화하고 Gaussian을 mesh 표면에 앵커된 렌더 프록시로 쓴다. **무대가 OmniObject3D 실물 스캔 12물체 + NeRF Synthetic 5씬**이고, Chamfer 외에 **mesh 자체 품질 지표(내각 분포, sliver 삼각형 비율)를 보고**한다. "limited viewpoints로 인한 missing structures 복원"을 표방한다. 새 표적과 무대·지표·문제의식이 전부 겹치는 최근접 논문이다. DTU 수치가 없어 위 표와 직접 비교 불가. (위협 분류는 08-19 판정 완료 — 경쟁 후보 등재, novelty 위협 아님. progress-2026-08-19 참조)

## 2. 자인된 실패 사례 (원문 수집)

### 2-1. 표적 관련도 순 정리

| 기법 | 자인 위치 | 실패 사례 (verbatim 또는 요약) | 표적 관련 |
| --- | --- | --- | --- |
| **PGSR** | §VI `[원문 확인, HTML v?]` | "cannot perform geometric reconstruction in regions with **missing or limited viewpoints**, leading to incomplete or less accurate geometry" | **관측 결핍 → 불완전.** self-occlusion 케이스를 포괄하는 가장 직접적인 자인 |
| **PGSR** | §V-C ablation `[원문 확인]` | 기하 occlusion 추정을 제거하면 **F1 0.52 → 0.28** | 가림 처리가 성능의 절반을 좌우한다는 정량 근거 |
| **2DGS** | §7 p.8 `[원문 확인, 게재본]` | "our current densification strategy **favors texture-rich over geometry-rich areas**, occasionally leading to less accurate representations of fine geometric structures" | densification의 질감 편향 자인. Q-17과 직결 |
| **2DGS** | §7 p.8 `[원문 확인]` | "our regularization ... can potentially lead to **over-smoothing** in certain regions" | 오목·디테일 손실 계열 |
| **2DGS** | §7 p.8, Fig.12 `[원문 확인]` | 반투명(유리) 표면 실패 | 공통 실패 |
| **MILo** | p.2–3 `[원문 확인, 위키 소스]` | 2단계 파이프라인 비판: cheating이 "floater·cavity 같은 hallucinated structure"를 만들고, naive isosurfacing은 "**thin structure에서 over-inflation·erosion**" | **cavity(내부 잉여)·thin 실패의 명시.** 단 자기 실패가 아니라 기존 계열 비판이므로 인용 시 구분 |
| **AmbiSuR** | 부록 M·L `[원문 확인, 위키 소스]` | specular 미해결(primary-ray-only), 투명면 "currently cannot well solve", **sparse-view에서 "will downgrade the importance of our technique"** 자인 | 관측 결핍 조건에서 SOTA 스스로 중요도 격하를 인정 |
| **RaDe-GS** | §5 (arXiv v2, 2024-06-24) `[원문 확인]` | DTU **Metal Scissor** 반사면 실패를 씬 이름까지 명시, 대규모 TSDF 해상도 한계 | DTU 안에 공인된 실패 씬이 존재한다는 근거 |
| **GeoSVR** | 부록 I `[원문 확인, HTML]` | 반사("serious reflections" → "suboptimal geometry"), 질감 부족, 투명면 | 공통 실패 |
| **GOF** | p.10 `[원문 확인, 위키 소스]` | SH가 **반사를 기하로 오인**(DTU에서 implicit과의 격차 원인), Delaunay 병목 | 공통 실패 |
| **Gaussian Wrapping** | §6 (arXiv v1, 2026-04-08) `[원문 확인]` | PAM의 균일 표집이 고디테일 씬에 suboptimal. **논문에는 실패 자인이 거의 없음.** 단 저장소 README는 "후처리 mesh가 씬의 물체를 제거하는 경우"를 자인 | 논문 주장과 코드 실물의 간극 사례 |
| **PhysGaussian** | §3.7, Fig.6 `[원문 확인, 위키 concepts]` | 3DGS 재구성은 내부가 관측되지 않아 **hollow shell**로 남는다 (시뮬레이션을 위해 내부 채움이 필요했다는 것 자체가 근거) | **내부 문제의 원전** |

### 2-2. 오목(concavity) 자인 — 원전 특정 완료 (Q-23①, 08-19)

**SatSplat §4.5 Limitations and Failure Cases, Fig. 10** (arXiv 2606.28581v1) `[원문 확인]`:

> "the strict piecewise planar assumptions of the 2DGS representation can lead to **over-smoothing in challenging narrow concavities**, failing to recover deep architectural gaps. This issue is absent when using the more flexible, volumetric 3DGS primitive, indicating that it is a direct consequence of the 2DGS surface assumptions struggling to represent high-frequency depth discontinuities."

- **2DGS의 오목 실패를 정면 자인한 유일하게 확보된 원문**이다. 위성 무대 맥락이지만 서술은 표현(primitive)의 가정에 대한 일반 진술이다
- 덤: "3DGS primitive에서는 이 문제가 없다"는 대비까지 있어, 오목 실패가 **표현의 가정에서 오는 기전**임을 SOTA 계열이 스스로 서술한 형태다. motivation 인용 은행 등재 후보

## 3. 핵심 관찰 (판단 필요)

**hole·오목·내부·self-occlusion을 정면으로 자인한 SOTA 논문은 드물다.** 공통 자인은 반사·투명·질감 부족·관측 결핍 네 가지에 몰려 있다.

- 표적과 가장 가까운 자인은 PGSR의 "관측 결핍 → 불완전"과 MILo의 cavity·thin 서술, PhysGaussian의 hollow shell이다
- 이 **자인의 부재 자체가 발견**이다. SOTA들은 hole·오목 실패를 인정하지 않는 것이 아니라 **측정하지 않는다**(DTU 프로토콜은 ObsMask로 관측 영역만 채점 — [[empty-region-evaluation-practice]]). 자인이 없으므로 motivation은 문헌 인용만으로 완성되지 않고 **실측 시연(X 실험)과 결합**해야 한다
- 반대 방향의 재료는 있다: PGSR의 occlusion ablation(0.52→0.28)은 가림이 성능을 절반 좌우함을 SOTA 스스로 보인 정량 근거다

## 4. 탐색 경로

로컬 PDF 원문 확인: 2DGS p.8, MILo(위키 소스 경유 p.2–3·11), GOF(위키 소스 p.10), AmbiSuR(위키 소스 부록 M·L). 웹 원문 확인: PGSR·RaDe-GS·GeoSVR·GW·Gaussian Sculpting HTML. 검색어: limitation+concave/self-occlusion/hollow/occluded 조합, "strong concavity" 문구 추적. GSSA는 MDPI 403으로 미확인.

## 5. 남긴 것

- ~~PGSR HTML의 arXiv 판본 번호 미기록~~ **해소(08-19, 로컬 PDF 정독).** arXiv:2406.06521**v2** (2025-01-10), 게재본 TVCG DOI 10.1109/TVCG.2024.3494046. §VI 문구·ablation 0.52→0.28 모두 이 판본에서 재확인. 상세는 [[pgsr-planar-gaussian-splatting]]
- ~~오목 자인 문장의 원전 특정~~ **해소(Q-23①).** SatSplat §4.5 (2-2절)
- ~~Gaussian Sculpting 코드 공개 여부~~ **해소(Q-23③).** 미공개·v1 최신, 추적 계속. DTU 부재로 인한 순위 비교 불가는 유지
- GVGS·GausSurf의 limitations 미수집 (전자는 자기 표 SOTA 문제가 이미 기록됨)
- 실패 그림(figure) 수집은 하지 않았다. 필요 시 2DGS Fig.12, RaDe-GS Metal Scissor, MILo Fig.8(interior 단면)이 후보
