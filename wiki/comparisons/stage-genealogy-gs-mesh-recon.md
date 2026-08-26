---
type: "comparison"
slug: "stage-genealogy-gs-mesh-recon"
title: "무대의 계보 — GS mesh 재구성 (3DGS → Gaussian Sculpting)"
status: "draft"
modified_at: "2026-08-21T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "raw/papers/MILo.pdf"
  - "raw/papers/GOF_Gaussian Opacity Fields - Efficient Adaptive Surface Reconstruction in Unbounded Scenes.pdf"
  - "raw/papers/2D Gaussian Splatting for Geometrically Accurate Radiance Fields.pdf"
  - "https://arxiv.org/abs/2311.12775"
  - "https://arxiv.org/abs/2406.06521"
tags:
  - "stage-genealogy"
  - "survey-q28a"
  - "related-work"
  - "gs-mesh"
---

# 무대의 계보 — GS mesh 재구성 (3DGS → Gaussian Sculpting)

> SURVEY_BRIEF Q-28a. **무대의 계보**이며 문제의 계보는 [[problem-genealogy-observation-deficit]](Q-28b)에 따로 있다 (rules-research 1-2).
> 기존 위키 소화분(GOF·PGSR·MILo·AmbiSuR·CoMe 소스 페이지)을 재사용해 조립하고 빈 마디만 신규 확인했다. 형식은 rules-research 1-5(의도 축).
> 조사일 2026-08-21.

## 1. 한 장 계보 — 물려받음 / 푼 것 / 남긴 것

| 마디 | 물려받은 문제 | 의도 (왜 그 방법이 풀 것이라 봤나) | 푼 것 (지표) | **남긴 것** |
| --- | --- | --- | --- | --- |
| **3DGS** (SIGGRAPH 2023) | NeRF의 느린 학습·렌더 | 명시적 primitive + 타일 래스터화면 실시간이 된다 | 실시간 NVS | **기하는 목표가 아니었다.** §7.4 "In regions where the scene is not well observed we have artifacts" 자인, §8은 mesh화를 열린 문제로 남김 `[원문 확인, 게재본]` |
| **SuGaR** (CVPR 2024) | 최적화된 Gaussian이 표면에 안 붙음 — "the Gaussians do not take an ordered structure in general and do not correspond well to the actual surface" `[원문 확인, HTML v3]` | **정렬을 강제**하면(정규화) Poisson으로 mesh를 뽑을 수 있다 | GS에서 mesh를 뽑는 첫 실용 경로 | 정규화의 대가 — PSNR 27.27 대 3DGS 28.69 (Table 1). **기하-외관 절충의 계보 첫 수치** |
| **2DGS** (SIGGRAPH 2024) | 3D Gaussian은 뷰마다 다른 교차면을 평가해 다중 뷰 불일치 | primitive를 **2D 디스크로 눌러** 광선-splat 교차를 명시하면 뷰 일관 기하가 나온다 | 뷰 일관 깊이·법선 → TSDF mesh (DTU 0.80) | §7 자인 셋: densification의 **질감 편향**, 정규화의 **over-smoothing**, 반투명 실패 `[원문 확인, p.8]` |
| **GOF** (SIGGRAPH Asia 2024) | 렌더 깊이 의존 추출(SuGaR·2DGS)이 volume rendering과 불일치, 배경·thin에서 mesh가 비거나 noisy | **광선-Gaussian 교차로 3D 임의 점 opacity를 정의**하고 뷰별 min을 취하면 뷰 독립 field가 되어 level set을 직접 뽑을 수 있다 | Poisson·TSDF 없이 추출, T&T F1 0.46 / DTU 0.74 | Delaunay 병목, **SH가 반사를 기하로 오인** `[원문 확인, 위키 소스 p.10]` |
| **RaDe-GS** (2024) | 위와 같은 깊이 편향 계열 | 래스터화 깊이를 정밀화하고 tetrahedra로 추출 | DTU 0.68 | §5 자인: 대규모 TSDF **해상도 한계**, DTU Metal Scissor 반사 실패 `[원문 확인]` |
| **PGSR** (TVCG 2024) | Gaussian 무질서 + 이미지 loss만으로 기하·다중 뷰 일관성 보장 불가 | Gaussian을 평면으로 압축해 **평면 파라미터를 렌더한 뒤 나눠서** 편향 없는 깊이를 얻고, 그 깊이의 homography 전후방 오차를 **가림 게이트**로 쓴다 | DTU 0.52 / T&T 0.52, **가림 게이트 ablation F1 0.52↔0.28** | §VI 자인: **관측이 없거나 부족한 영역**, 반사, floater. mesh는 loss에 없고 사후 추출 `[원문 확인, v2]` |
| **MILo** (SIGGRAPH Asia 2025) | 사후 추출이라 volumetric과 mesh가 불일치, fine detail 손실, 수천만 정점 | mesh 추출을 **매 iteration에 넣어** Gaussian을 mesh의 implicit 매개변수로 삼으면 mesh→Gaussian gradient가 흐른다 | T&T F1 0.49(explicit best), 정점 4.36M(경쟁 14–16M) | 학습 시간, **Gaussian 초기 분포 의존** `[원문 확인, 위키 소스 p.11]` |
| **GeoSVR / AmbiSuR / Gaussian Sculpting** (2025–2026) | 위 계열 전체의 photometric 모호성·정확도 한계 | 각각 sparse voxel / **SH 크기로 모호 영역 식별 후 prior 차등 투입** / SDF 직접 최적화 + Gaussian을 렌더 프록시로 | DTU 0.47 / 0.46 / (OmniObject3D, mesh 품질 지표) | AmbiSuR 부록 L: sparse-view에서 "**will downgrade the importance of our technique**" 자인 `[원문 확인, 위키 소스]` |

## 2. 축 둘로 재정리

**축 A — primitive 유형**: 3D Gaussian(3DGS·GOF·RaDe-GS) → 평면·2D(2DGS·PGSR) → mesh/SDF 앵커(MILo·Gaussian Sculpting) → voxel(GeoSVR, 계열 이탈)

**축 B — mesh 추출 시점**: 사후 Poisson(SuGaR) → 사후 TSDF(2DGS·PGSR·RaDe-GS) → 사후 level set(GOF) → **in-loop**(MILo) → SDF가 주역(Gaussian Sculpting)

두 축의 공통 방향은 **"mesh를 최적화에 점점 가깝게 끌어들인다"**이다. SuGaR가 정규화로 간접 유도, GOF가 추출을 원리화, MILo가 loop 안으로, Gaussian Sculpting이 SDF를 주역으로. 계보의 추진력이 여기 있다.

### 2-1. 축 A의 신규 마디 — QGS (Q-32, 08-25 추가)

**Quadratic Gaussian Splatting** (arXiv 2411.16392) `[2차 자료]`: primitive를 **quadratic paraboloid**로 정의해 볼록과 오목 사이를 **연속 전이**시킨다. 평면(2DGS)보다 기하 적합 자유도가 크다.

- 축 A의 다음 칸에 해당한다: 3D Gaussian → 2D 디스크·평면 → **quadric** → mesh·SDF 앵커
- **표현이 오목을 담을 수 있게 만든 마디**이지 관측 결핍을 다루지 않는다. SatSplat §4.5가 지목한 "2DGS 평면 가정의 오목 over-smoothing"(Q-23①)에 대한 **표현 축의 답**이라는 위치
- 우리 표적과의 관계: 표현 한계(오목을 그릴 수 있는가)와 관측 한계(그 안을 볼 수 있는가)의 구분 — Q-26의 GW 진단 구상과 같은 대비다. QGS가 있어도 어두운 깊은 내부의 관측 결핍은 남는다. **판단 필요**

## 3. hole·오목·관측 결핍은 계보의 어디에 등장하는가

**"남긴 것" 칸에서만 등장하고, 어느 마디도 그것을 표적으로 삼지 않았다.**

| 마디 | 관측 결핍 계열 등장 위치 |
| --- | --- |
| 3DGS | §7.4 자인 (관측 부족 영역 artifacts) — 계보의 출발점부터 있었다 |
| 2DGS | §7 over-smoothing·질감 편향 (오목 손실의 기전) |
| GOF·RaDe-GS | 반사·해상도로 표현되나 관측 결핍은 아님 |
| **PGSR** | §VI **"관측이 없거나 부족한 영역"** — 계보에서 가장 직접적인 자인. 동시에 가림 게이트로 **부분적으로 다룬** 유일 마디(ablation 0.52↔0.28) |
| MILo | 초기 분포 의존 (내부에 SfM 점이 없으면 불리 — 우리 표적과 연결) |
| AmbiSuR | sparse-view 자인 (관측이 희박하면 자기 기법의 중요도가 내려감) |

**읽히는 것**: 계보는 표현(primitive)과 추출 시점을 개선해 왔고, 관측 결핍은 매 마디의 잔여물로 이월됐다. PGSR만이 가림을 방법으로 다뤘으나 그 대상은 **뷰 간 모순의 배제**이지 결핍 영역의 처방이 아니다 ([[problem-genealogy-observation-deficit]] 마디 2와 같은 성격). **우리 자리는 축 A·B 어느 쪽의 다음 칸도 아니고, 모든 마디의 "남긴 것" 칸에 공통으로 이월된 항목**이라는 것이 이 표의 결론이다. **판단 필요.**

## 4. 계보도 텍스트 스펙 (그림용)

```
[3DGS 2023] 실시간 NVS — 기하는 목표 아님
   |  (Gaussian이 표면에 안 붙는다)
   +--> [SuGaR 2024] 정렬 정규화 + Poisson ......... 대가: PSNR 하락
   |  (뷰마다 다른 교차면)
   +--> [2DGS 2024] primitive를 2D 디스크로 ....... 남김: 질감 편향·over-smoothing
   |        |  (렌더 깊이 의존이 volume과 불일치)
   |        +--> [GOF 2024] 광선-교차 opacity field, level set
   |        +--> [RaDe-GS 2024] 정밀 깊이 + tetra
   |  (이미지 loss만으로 다중 뷰 일관성 불가)
   +--> [PGSR 2024] 평면 압축 + unbiased depth + 가림 게이트 ★관측 결핍을 방법으로 다룬 유일 마디
            |  (사후 추출이라 mesh와 불일치)
            +--> [MILo 2025] mesh-in-the-loop
            +--> [AmbiSuR 2026] SH로 모호 영역 식별 → prior 차등  ← 현 SOTA
            +--> [Gaussian Sculpting 2026] SDF 주역, Gaussian은 렌더 프록시

축 A primitive: 3D → 2D/평면 → mesh·SDF 앵커
축 B 추출 시점: 사후 Poisson → 사후 TSDF/level set → in-loop → SDF 주역
공통 추진력: mesh를 최적화에 점점 가깝게
이월된 잔여물(모든 마디의 '남긴 것'): 관측 결핍 · 오목 · 내부
```

## 5. 탐색 경로와 남긴 것

재사용: GOF·PGSR·MILo·AmbiSuR·CoMe 소스 페이지(정독 산출물), 2DGS 로컬 PDF p.8, 3DGS 게재본(08-09 확인), [[gs-surface-recon-sota-2026]] 수치. 신규: SuGaR HTML v3(문제 서술·PSNR 절충).

- SuGaR는 limitations 전용 절이 없다 — 절충 수치는 Table 1에서 읽은 것 `[원문 확인, HTML v3]`
- RaDe-GS·GeoSVR·Gaussian Sculpting은 소스 페이지가 없어 기확보 단편으로 채웠다 (정독하면 이 표를 갱신할 것)
- 2DGS·SuGaR·RaDe-GS의 소스 페이지 부재가 계보 표의 해상도 차이를 만든다 — 정독 우선순위 재료
- CoMe는 표에서 뺐다 (계보 본류라기보다 confidence 계열 — [[come-confidence-based-mesh-extraction]])
