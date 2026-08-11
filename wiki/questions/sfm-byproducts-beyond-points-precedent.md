---
type: "question"
slug: "sfm-byproducts-beyond-points-precedent"
title: "SfM 부산물을 점 좌표 이상으로 쓴 선례 (측량각 역산 포함)"
status: "draft"
modified_at: "2026-08-11T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://arxiv.org/abs/2107.02791"
  - "https://arxiv.org/abs/2312.00451"
  - "https://arxiv.org/abs/2606.30545"
  - "https://arxiv.org/abs/2512.06269"
tags:
  - "sfm-byproducts"
  - "prior-art"
  - "survey-q11"
  - "reference-bank"
---

# SfM 부산물을 점 좌표 이상으로 쓴 선례 (측량각 역산 포함)

> SURVEY_BRIEF Q-11. Q-02([[triangulation-angle-in-training-precedent]])가 "각을 학습 내부에 쓴 사례"로 좁게 물었다면, 이 조사는 넓게 묻는다: GS(또는 NeRF) 재구성에서 SfM 부산물(재투영 오차, track 길이, covisibility, 측량각)을 점 좌표·색 이상으로 활용한 시도가 있는가. 효과가 있으면 왜라고 하는가, 실패했으면 왜라고 하는가. 참고문헌 뱅크 용도.
> 조사일 2026-08-11.

## 1. 결론

**각을 점별로 역산해 하류(GS/NeRF 재구성)에서 쓴 사례는 이번에도 찾지 못했다.** Q-02의 결론이 넓힌 범위에서도 유지된다.

대신 **다른 SfM 부산물을 쓴 선례는 있다.** 재투영 오차(DS-NeRF), 점 위치를 통한 척도 정렬(DRGS 계열), covisibility 개수(CoMapGS)의 세 갈래이며, 각각 효과와 한계의 담론이 문헌에 남아 있다. 인용 사다리로 쓸 수 있다.

## 2. 선례 사다리 (부산물별)

### 2-1. 재투영 오차 → 깊이 감독의 불확실도 — DS-NeRF

Deng, Liu, Zhu, Ramanan, "Depth-supervised NeRF: Fewer Views and Faster Training for Free" (CVPR 2022, arXiv 2107.02791). **SfM 부산물을 감독 가중에 쓴 원조격.**

- COLMAP이 점군과 함께 출력하는 **재투영 오차**를 그 점 깊이의 불확실도로 해석한다. 깊이를 SfM 점 깊이 중심의 정규분포로 모델링하고, 광선의 종단 분포와의 KL 발산을 loss로 더한다 `[분산 유도식은 원문 재확인 권장]`
- 효과 주장: few-shot에서 NeRF 대비 큰 폭 개선, 학습 2~6배 가속. 논리는 "SfM이 이미 계산한 sparse depth는 공짜 감독"이라는 것
- **우리와의 차이가 논거가 된다.** 재투영 오차는 "이 점이 이미지와 얼마나 잘 맞았는가"(측정 잔차)이고, 측량각은 "이 점의 깊이 방향이 얼마나 제약되는가"(기하 조건성)다. 잔차가 작아도 각이 좁으면 깊이는 결정되지 않는다. **성공한 photometric ambiguity가 잔차를 남기지 않는다는 CoMe 반박 논리와 같은 구조**가 SfM 부산물 안에서도 성립한다

### 2-2. 점 위치 → 단안 깊이의 척도 정렬 — DRGS 계열과 그 비판

- DRGS(Chung 외, "Depth-Regularized Optimization for 3D Gaussian Splatting in Few-Shot Images")는 단안 깊이를 sparse SfM 점에 정렬한 뒤 깊이 정칙화에 쓴다. SfM 점이 **prior의 척도 앵커** 역할
- 후속 논문의 비판이 기록되어 있다. StereoGS(arXiv 2606.30545)는 이 정렬이 "희소 관측에서 추정한 고정 척도를 전 화소에 균일 적용"하는 조잡한 것이라고 적는다. **SfM 점 기반 정렬의 실패 담론**으로 인용 가능
- FSGS(arXiv 2312.00451)·SPARS3R 계열은 전제 자체의 한계를 적는다: sparse-view에서는 SfM이 실패하거나 점이 극히 희소해진다. **SfM 부산물 활용의 전제조건 담론**

### 2-3. covisibility 개수 → 감독 재가중 — CoMapGS

이미 위협표에 있는 상대다 ([[comapgs-covisibility-sparse-view-synthesis]], [[covisibility-count-weighted-supervision]]). SfM의 covisibility **개수**를 학습 전에 계산해 감독을 재가중한다. sparse-view NVS에서 효과를 보고한다. **개수 기반이라는 점이 우리와의 경계이며, 이 경계는 E4 판정(개수에서 품질로)에 이미 반영되어 있다.**

### 2-4. 각 자체는 SfM 안에서 소비되고 하류로 전달되지 않는다

- COLMAP은 min triangulation angle(기본 2도) 필터로 각을 **점을 버리는 데** 쓴다 (B1, [[sfm-revisited-colmap]]). 각으로 걸러진 결과만 남고 **각 값 자체는 출력 파일에 없다.** points3D 출력에 남는 부산물은 track과 재투영 오차다
- 따라서 하류에서 각을 쓰려면 포즈와 track에서 **역산**해야 한다. DS-NeRF가 재투영 오차를 쓴 것과 아무도 각을 쓰지 않은 것의 구조적 차이에 대한 한 가지 해석: 재투영 오차는 출력에 바로 있고 각은 역산이 필요하다. `[이것은 조사 세션의 해석이며 문헌에 명시된 이유가 아니다. 문헌에는 "왜 안 썼는가"의 명시적 진술 자체가 없다]`

### 2-5. 각 기반 불확실도의 인접 (Q-02에서 확보, 재게)

- 고전 MVS: 각이 클수록 깊이 불확실 타원체가 작아진다 (Rumpler 외, AAPR 2011). **"효과가 있는 이유"의 기하학적 근거**
- PanoLOG (arXiv 2607.08769): 시차각에서 깊이 불확실도를 유도하되 용도는 학습 전 공간 분할
- TriaGS (arXiv 2512.06269): 삼각측량 합의점 거리를 loss로 쓰되 각은 계산하지 않음

## 3. 참고문헌 뱅크로서의 정리

| 쓰임새 | 인용 |
| --- | --- |
| SfM 부산물을 감독 불확실도로 쓴 선례 | DS-NeRF (CVPR 2022) |
| 잔차 기반 부산물의 한계 논리 | DS-NeRF의 재투영 오차 대 측량각 대비 (2-1절 셋째 항목) + CoMe 반박 논리와의 동형성 |
| SfM 점 기반 척도 정렬과 그 비판 | DRGS → StereoGS의 "균일 척도" 비판 |
| 개수 기반 재가중의 선행 | CoMapGS (E4 인용 사다리와 동일) |
| 각과 깊이 불확실도의 기하학 | Rumpler 외 (AAPR 2011) |
| 각이 하류로 전달되지 않는 구조 | COLMAP 원전 (B1) + 조사 세션 해석 (명시 표기 필요) |

## 4. 남긴 것

- DS-NeRF의 분산 유도식(재투영 오차가 정확히 어떻게 분산이 되는지) 원문 수식 미확인
- DRGS 원문을 직접 읽지 않았다 (StereoGS의 서술 경유)
- CoMapGS 외에 track 길이를 직접 가중치로 쓴 사례는 검색 4갈래에서 찾지 못했으나 전수 확인은 아니다
- 비영어권·사진측량 학술지 미탐색 (Q-02와 동일한 한계)
