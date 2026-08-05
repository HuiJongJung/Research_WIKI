---
type: "question"
slug: "triangulation-angle-in-training-precedent"
title: "삼각측량각을 학습 내부에 쓴 선례가 있는가"
status: "draft"
modified_at: "2026-08-05T12:30:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://arxiv.org/abs/2607.08769"
  - "https://arxiv.org/abs/2512.06269"
  - "https://www.tugraz.at/fileadmin/user_upload/Institute/ICG/Images/team_fraundorfer/personal_pages/markus_rumpler/multiview_aapr2011.pdf"
  - "https://arxiv.org/abs/2511.06765"
tags:
  - "triangulation-angle"
  - "prior-art"
  - "survey-q02"
  - "novelty"
---

# 삼각측량각을 학습 내부에 쓴 선례가 있는가

> SURVEY_BRIEF Q-02, 등록부 B7. 촬영 계획(next-best-view, capture planning) 용도는 제외하고, 고정 캡처의 재구성 목적함수 안으로 각을 가져온 사례만 찾았다.
> 조사일 2026-08-05.

## 1. 결론

**찾지 못했다.** 삼각측량각 또는 시차각을 NeRF나 3DGS의 **학습 내부**에서 loss 가중치, prior 주입 게이트, densification 제어에 쓴 논문을 확인하지 못했다.

찾지 못했다는 것은 존재하지 않는다는 증명이 아니다. 검색은 영어 키워드 조합 여섯 갈래(triangulation angle, parallax angle, baseline angle, angular diversity, viewing angle spread 각각에 loss weight, densification, prior gating을 교차)로 수행했고 arXiv 본문 확인은 아래 네 편에 한정했다.

## 2. 인접 사례 세 갈래

### 2-1. 각을 쓰지만 학습 전 공간 분할에 쓴다 — PanoLOG

"Geometry and Gradient-based Partitioning for Panoramic Outdoor Reconstruction" (Chen 외, arXiv 2607.08769, 2026-07-09). 과제는 대규모 실외 파노라마의 novel view synthesis다.

- 각을 명시적으로 정의한다. "triangulation reliability is governed by the angular parallax"이며 소시차 근사에서 깊이는 시차에 반비례한다. 1차 오차 전파로 상대 깊이 불확실도가 유도된다
- **용도는 경계 상자의 확장 여백 결정이다.** 삼각측량 도달 범위 인자로 여백을 정하고, 빈 블록을 막아 블록 단위 정제가 관측 제약이 있는 영역에 집중되게 한다
- 즉 각으로 **어디까지를 재구성 대상으로 볼지**를 정하며, **감독의 세기를 배분하지는 않는다**

이 논문은 각 기반 양이 학습 전에 계산 가능한 신뢰도 척도라는 점을 분야가 이미 받아들이고 있음을 보여준다. 동시에 그 쓰임이 아직 공간 분할에 머물러 있음도 보여준다. **본 연구의 진입점과 가장 가까운 인접 사례다.**

### 2-2. 삼각측량을 쓰지만 각이 아니라 점을 쓴다 — TriaGS

"TriaGS: Differentiable Triangulation-Guided Geometric Consistency for 3D Gaussian Splatting" (Tran, Dang, arXiv 2512.06269, 2025-12).

- 렌더된 3D 점을 이웃 뷰로 투영해 과결정 선형계를 세우고 미분 가능한 SVD로 합의점을 구한 뒤, 렌더된 점과 합의점의 거리를 벌점으로 준다
- **각이나 시차를 직접 계산하지 않는다.** 삼각측량의 결과물인 점만 쓴다
- 표적은 표면 mesh 재구성이다. DTU 15 스캔 Chamfer 평균 0.50mm, T&T F1, NeRF-Synthetic Chamfer, Mip-NeRF360 렌더 품질

경쟁이라기보다 **"삼각측량"이라는 단어를 선점한 인접 논문**이다. 명명 충돌을 피할 필요가 있다.

### 2-3. 각과 깊이 불확실도의 관계는 고전 MVS가 이미 확립했다

Rumpler, Irschara, Bischof, "Multi-View Stereo: Redundancy Benefits for 3D Reconstruction" (AAPR 2011). 삼각측량점의 3D 불확실 타원체를 분석해 각이 커질수록 깊이 불확실도가 줄어듦을 보인다. 다중뷰 삼각측량이 두 뷰 융합보다 깊이 정확도에서 최소 한 자릿수 우수하다고 보고한다.

"5년간 아무도 쓰지 않았으면 쓸모없는 것 아니냐"에 대한 답은 여기에 있다. **각과 기하 불확실도의 관계는 쓸모가 없어서 안 쓰인 것이 아니라 이미 고전 MVS에서 확립되어 당연시된 관계이며, 그것을 학습 기반 재구성의 감독 배분으로 옮긴 사례가 없는 것이다.** 이 서술의 성립 여부는 판정 사항이다.

## 3. 확인해서 배제한 것

- "Robust and High-Fidelity 3D Gaussian Splatting" (Guo 외, arXiv 2511.06765): 검색 요약이 "baseline angle로 초기 Gaussian의 축 크기를 보정한다"고 제시했으나 **본문에 baseline angle, parallax가 없다.** 각 관련 서술은 법선 정렬 벌점뿐이다. 검색 요약의 오귀속이다
- RGS-SLAM (arXiv 2601.00705): 초록에 각 관련 서술 없음. 본문 미확인 `[미검증]`

## 4. 남긴 것

- 촬영 계획 계열은 지시대로 제외했으므로 이 페이지에 없다
- PanoLOG의 여백 유도식을 원문 수식 수준으로 옮겨 적지 않았다. 인용이 필요하면 재확인해야 한다
- 비영어권 문헌과 학술지(ISPRS 계열) 검색은 하지 않았다. 사진측량 분야에 유사 용례가 있을 가능성이 남는다
