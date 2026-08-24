---
type: "question"
slug: "photometric-vs-mesh-quality-evidence"
title: "photometric 개선 = mesh 개선인가 — 통념 검증 인용문 은행"
status: "draft"
modified_at: "2026-08-21T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://arxiv.org/abs/2010.07492"
  - "https://arxiv.org/abs/2603.20714"
  - "raw/papers/CoMe - Confidence-Based Mesh Extraction from 3D Gaussians.pdf"
  - "https://doi.org/10.5194/isprs-annals-X-G-2025-641-2025"
tags:
  - "photometric-geometry"
  - "survey-q30"
  - "citation-bank"
  - "q-a"
---

# photometric 개선 = mesh 개선인가 — 통념 검증 인용문 은행

> SURVEY_BRIEF Q-30, research-status §4 Q-A의 조사 담당분. 통념의 성립·불성립 양쪽 재료를 모은다. **판정은 하지 않는다** — 방향 세션이 한다.
> 조사일 2026-08-21.

## 0. 종합에서 드러난 정밀화 (판정 재료)

수집 결과 "photometric"이 무엇을 가리키느냐로 답이 갈린다.

- **training view 적합**: 기하와 원리적으로 무관할 수 있다 (NeRF++의 shape-radiance ambiguity)
- **novel view 일반화**: 기하와 부분 상관 (같은 NeRF++ 기전 — 틀린 기하는 고주파 radiance를 요구해 novel view에서 무너진다)
- **mesh 품질**: NVS 품질과 **역관계까지 실측됨** (Desiatov & Sattler)

통념 문장을 검증하려면 이 세 층을 갈라야 한다는 것 자체가 조사의 산출물이다. **판단 필요.**

## 1. 불성립 방향 (통념 반박 재료)

### 1-1. 이론 원전 — NeRF++의 shape-radiance ambiguity

Zhang·Riegler·Snavely·Koltun, "NeRF++: Analyzing and Improving Neural Radiance Fields" (arXiv 2010.07492) §3 `[원문 확인, ar5iv]`.

- 꼬집는 문제: NeRF가 학습 뷰를 완벽히 맞추고도 기하가 틀릴 수 있는 이유의 규명
- verbatim: **"one can fit a set of training images perfectly for an arbitrary incorrect geometry by a suitable choice of outgoing 2D radiance at each surface point."**
- 의도: 이 모호성이 실제로 안 터지는 이유(올바른 기하일수록 radiance가 매끈해 학습이 선호)를 밝혀 개선 방향을 세움
- 함의: **training-view photometric 완벽 적합과 임의의 틀린 기하가 양립** — 통념이 원리 수준에서 성립하지 않음의 고전 원전

### 1-2. 역관계 실측 — Desiatov & Sattler

"The Role of Initialization in 3D Gaussian Splatting" (arXiv 2603.20714v3, 2026-07-18) §5.3 `[원문 확인, HTML]`.

- 조건: ScanNet++ 레이저 스캔 GT, F1 임계 0.05m, 렌더 깊이→TSDF 융합→점군 추출 프로토콜 (§4.4)
- verbatim: **"there seems to be an inverse relationship between NVS quality and F1 scores — densification methods that are worse at NVS tend to better adhere to the scene's true geometric structure."** (SfM 초기화 조건)
- 수치: SfM 초기화 F1 27 대 dense 초기화 41~53 (IDHFR 조합) — dense 초기화는 기하를 크게 올리되 NVS 개선은 미미
- **NVS 품질과 mesh 기하 품질의 역관계를 명시한 유일하게 확보된 실측 진술**

### 1-3. photometric의 둔감성 실측 — CoMe p.31

`[원문 확인, 위키 소스 경유 로컬 PDF]` 실외 배경의 spurious geometry가 저신뢰로 가지치기되어 **primitive 26% 감소(4.38M→2.58M), PSNR 손실 0.02dB**.

- 함의: 기하 쪽에서 잉여 구조를 대량 제거해도 photometric은 거의 변하지 않는다 — **photometric 지표가 기하 오류에 둔감하다는 역방향 정량**

### 1-4. 기전 서술 — CoMe 문제 설정

`[원문 확인, 위키 소스]` "3DGS는 geometry와 appearance가 결합돼 있어, view-dependent 효과가 강한 영역에서 **photometric loss를 줄이는 유일한 길이 geometry를 왜곡하는 것**" (반투명 표면 뒤 불투명 Gaussian). photometric 최소화가 기하 왜곡을 **유발**하는 기전의 GS판.

### 1-5. SOTA의 절충 자인 둘

- GeoSVR 부록 I `[원문 확인, 08-19]`: "rendering quality slightly drops when the model is forced to learn accurate geometry" — 정확한 기하를 강제하면 렌더 품질이 내려간다는 자인
- AmbiSuR `[원문 확인, 위키 소스]`: Mip-NeRF360 NVS에서 SOTA 아님을 인정 (표면 정확도와의 절충)

### 1-6. 무대 실측 — ISPRS (기확보 재게)

Petrovska & Jutzi (ISPRS Annals X-G-2025) `[원문 확인, 08-05]`: NVS 대표인 GS·NeRF가 같은 무대 cloud-to-mesh에서 MVS에 정확도·완전성 열세. 이유 명시 — "기하가 이미지 재구성 loss의 최소화로 만들어지기 때문".

### 1-7. 보조 (기확보 재게)

2DGS p.2 "unconstrained" 문장, MILo p.2 "렌더에 보이던 fine detail이 mesh 추출에서 사라질 수 있다" — Q-18 페이지([[gs-improvement-mesh-improvement-link]]) 참조.

## 2. 성립 방향 (공정 보고)

- **novel view 일반화 경로**: NeRF++ 같은 절이 통념의 옹호 논리도 담는다 — 틀린 기하는 고주파 radiance를 요구하므로 **novel view에서는 기하 오류가 드러난다** ("very unlikely to accurately interpolate such a complex function"). 즉 held-out photometric은 기하의 간접 감시자다
- **표면 계열의 공통 주장**: 2DGS·GOF 등은 기하 정규화 후에도 NVS 경쟁력이 유지된다고 보고한다 (2DGS 초록 "competitive appearance quality" 취지) `[원문 확인, 게재본 p.8 §7 인접 서술]` — 절충이 존재하되 파국적이지 않다는 방향
- Desiatov & Sattler에서도 dense 초기화가 기하와 **off-trajectory 일반화를 함께** 개선 — 궤적 밖 photometric과 기하는 같은 방향일 수 있다

## 3. 탐색 경로와 남긴 것

원문 재확인: CoMe 위키 소스(p.7·20·31·문제 설정), Desiatov & Sattler HTML §4.4·5.3, NeRF++ ar5iv §3. 기확보 재게: GeoSVR·AmbiSuR·ISPRS·2DGS·MILo.

- PSNR↑이면서 Chamfer↓를 **같은 표 안에서** 보인 GS 논문 표는 아직 특정하지 못했다 (Desiatov & Sattler가 최근접이나 NVS 지표와 F1이 다른 표). 추가 수집 여지
- NeRF++ 게재본(CVPR? arXiv only) 지위 미확인
- CoMe p.31 수치는 위키 소스 경유이며 이번에 PDF 재대조는 안 했다 (소스 페이지 자체가 정독 산출물)
