---
type: "question"
slug: "confidence-representation-layer-precedents"
title: "confidence 표현 층 선례 — per-primitive 기하량과 감독 라우팅 field"
status: "draft"
modified_at: "2026-08-20T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://arxiv.org/abs/2508.01239"
  - "https://arxiv.org/abs/2311.17245"
  - "https://openaccess.thecvf.com/content/CVPR2025/papers/Hanson_PUP_3D-GS_Principled_Uncertainty_Pruning_for_3D_Gaussian_Splatting_CVPR_2025_paper.pdf"
  - "https://users.aalto.fi/~laines9/publications/kontkanen2005i3d_paper.pdf"
tags:
  - "confidence-field"
  - "representation-layer"
  - "survey-q25"
  - "field-v2"
---

# confidence 표현 층 선례 — per-primitive 기하량과 감독 라우팅 field

> SURVEY_BRIEF Q-25. 물체 무대 전환으로 표현 층(96³ 수축 격자 → bbox 격자 또는 per-Gaussian 직접 평가)을 재검토하는 데 필요한 선례. "voxel은 방법이 아니라 캐시다"(progress-2026-08-20)의 문헌 대조.
> 조사일 2026-08-20.

## 1. ① 카메라 기하량을 primitive별 속성으로 계산해 감독에 쓴 사례

### per-Gaussian 통계 추적은 표준 관행이다 — 단 전부 "학습된 렌더 상태"의 통계

- LightGaussian·Mini-Splatting·RadSplat·AtomGS 계열: Gaussian별 **누적 광선 기여**(hit count, 투과율, 불투명도, 부피의 혼합)로 중요도 점수를 만들어 **pruning·압축**에 쓴다 `[2차 자료]`
- PUP 3D-GS (CVPR 2025): 원리적 불확실도 기반 pruning `[2차 자료]`
- 공통점 둘: (a) 양이 **학습 중 렌더 상태에서 나온다** — 촬영 기하의 a priori 양이 아니다. (b) 용도가 **pruning·압축**이다 — 감독 배분이 아니다

### 관측 수 계열 — OCSplats (인접, 정의 미확인)

OCSplats (arXiv 2508.01239, 2025-08) `[2차 자료]`: "관측 완전성 정량화"로 label noise(움직임·그림자·비램버시안)를 분리하는 anti-noise 재구성. **관측 완전성의 계산 방식(기하량인지 학습량인지)과 시점(학습 전/중)이 초록에서 확인되지 않는다** `[미검증]`. 표적이 distractor 분리라 인접.

### 결론 ①

**학습 전 카메라 기하량(관측 수·시차각·가시성)을 primitive별로 계산해 loss·densification 배분에 쓴 사례는 찾지 못했다.** Q-02(각을 학습에 쓴 사례 없음)·Q-11(SfM 부산물은 잔차·개수까지만)의 결론이 per-primitive 층위에서도 유지된다. per-Gaussian 통계 인프라는 어디에나 있으므로 **구현 장벽이 아니라 발상의 빈자리**다.

## 2. ② 감독 라우팅용 field (bbox 격자·octree·다해상도)

기존 확보분이 전부이며 새 사례는 찾지 못했다.

| 사례 | field | 용도 | 격 |
| --- | --- | --- | --- |
| G4Splat | 이진 가시성 격자 | prior 주입 게이트 | 위협표 기존 (개수·이진의 한계는 E4 논리) |
| AREA3D | 복셀 불확실도 field | **능동 촬영** 시점 선택 | 08-05 확보 |
| VAD-GS | 복셀 가시성(track 합집합) + z-buffer | densification 판정 | 08-11 확보 |
| CoMapGS | covisibility 맵 | 감독 재가중 (이미지 공간 경유) | 위협표 기존 |

**octree·다해상도 격자를 감독 라우팅에 쓴 사례는 찾지 못했다.** 다해상도 격자(Instant-NGP hash 등)는 장면 **표현**이지 감독 배분 자료구조가 아니다.

## 3. ③ voxel 캐시 대 연속 함수 직접 평가

재구성 문헌에서 이 트레이드를 명시적으로 논한 사례는 **찾지 못했다.** 인접 선례는 그래픽스 고전에 있다.

- **Ambient Occlusion Fields** (Kontkanen & Laine, I3D 2005) `[2차 자료]`: 연속으로 정의되는 가림량을 **격자에 사전 계산(baking)해 캐시**하는 관행의 원전급. "연속 함수 대 격자 캐시"가 정확도-비용 절충이라는 프레임 자체가 그래픽스 표준이다
- 이 프레임을 빌리면 우리 서술("voxel은 방법이 아니라 캐시")은 그래픽스 관행의 언어로 자연스럽게 선다: conf(x)는 카메라에서 정의된 연속 함수이고, 96³ 격자는 그 baking이며, 물체 규모에서는 baking 없이 직접 평가가 가능하다

## 4. 결론 (④)

**per-primitive a priori confidence는 빈자리다.** ① 학습 전 기하량의 per-primitive 감독 배분 없음, ② 감독 라우팅 field는 격자 4종(전부 용도 또는 양이 다름)뿐, ③ 캐시 대 직접 평가 논의는 재구성 문헌에 없음(그래픽스 baking 프레임 차용 가능). 표현 층을 바꿔도(격자 → per-Gaussian) novelty 지형이 흔들리지 않으며, 오히려 "field가 아니라 함수"라는 서술이 AREA3D류 field 선점과의 거리를 벌린다. **판단 필요: v2 설계에서 이 서술 채택.**

## 5. 탐색 경로와 남긴 것

검색: per-Gaussian observation count/view count/statistics supervision, OCSplats 초록. 기존 대조: Q-02·Q-11·Q-16, G4Splat·AREA3D·VAD-GS·CoMapGS.

- OCSplats 본문 미독 — 관측 완전성의 정의가 기하량이면 인접도가 올라간다. 본문 확인 가치 있음
- FastGS(arXiv 2511.04283)의 통계 사용 방식 미확인
- Ambient Occlusion Fields 원문 미독 (baking 프레임의 정확한 서술)
- pruning 계열 전수 확인 아님 (4종 검색 요약 기준)
