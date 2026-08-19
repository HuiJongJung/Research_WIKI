---
type: "question"
slug: "pretraining-self-occlusion-estimation"
title: "학습 전 self-occlusion 추정과 가시성 supervision의 선행"
status: "draft"
modified_at: "2026-08-19T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://dl.acm.org/doi/10.1145/1276377.1276407"
  - "https://arxiv.org/abs/2304.10532"
  - "https://arxiv.org/abs/2510.09364"
  - "https://arxiv.org/abs/2603.01603"
tags:
  - "self-occlusion"
  - "visibility"
  - "survey-q16"
  - "prior-art"
---

# 학습 전 self-occlusion 추정과 가시성 supervision의 선행

> SURVEY_BRIEF Q-16. 세 질문: ① 학습 전 자기 가림 추정 기법 ② 가시성을 supervision에 쓴 사례 ③ 우리 발상(track은 실제 매칭만 담아 가림을 반영)과 같은 선행.
> Q-12([[occlusion-aware-confidence-field-design]], 08-11)와 겹치는 부분은 참조로 대체하고 새 확보분만 적는다.
> 조사일 2026-08-19.

## 1. 학습 전 자기 가림 추정 도구

- **Hidden Point Removal (HPR)**: Katz, Tal, Basri, "Direct Visibility of Point Sets" (ACM TOG, SIGGRAPH 2007) `[2차 자료 + 공식 PDF 존재 확인]`. **표면 재구성도 법선 추정도 없이** 점군을 구면 반전 변환한 뒤 convex hull에 남는 점을 가시점으로 판정한다. 희소·밀집 점군 모두, 점군 내부 시점에도 적용 가능. **SfM 점군에 그대로 적용 가능한 학습 전 가시성 판정의 고전 원전.** CloudCompare·Open3D에 구현이 있어 도구 장벽이 없다
- z-buffer 래스터화 계열: VAD-GS가 점군 복셀화 후 복셀 표면 z-buffering (Q-12 2-1절 참조)
- 고전 촬영 계획의 표면점 가시성: Smith 외 2018 (Q-12 2-2절 참조)

## 2. 가시성을 supervision에 쓴 사례

### Nerfbusters — 가시성 loss의 직접 선례이자 프러스텀 한계의 자인

Weber 외, "Nerfbusters: Removing Ghostly Artifacts from Casually Captured NeRFs" (arXiv 2304.10532, ICCV 2023) §4.4 `[원문 확인, ar5iv]`.

- 가시성 loss: 어느 학습 뷰에서도 보이지 않는 위치의 밀도에 벌점을 준다. 수식은 비가시 지시함수 곱하기 밀도의 합
- **가시성 계산은 프러스텀 검사이며 가림을 다루지 않는다.** 원문 자인: "This approximation does not handle occlusions, instead **overestimates the number of views** a location is visible from."
- 그럼에도 작동하는 이유를 proposal sampler의 표면 근방 표집 덕으로 설명한다

**이 자인의 가치가 크다.** 우리 field의 알려진 한계(프러스텀 가시 집합이 가림을 무시하고 E1에서 관측 수 20배 과대평가)와 **문장 구조가 동일한 선행 자인**이다. 쓰임새 둘: ① "프러스텀 근사는 선행도 쓰고 자인한 표준 근사"라는 방어 ② "선행은 근사에서 멈췄고 본 연구는 track 기반으로 간다"는 전진 서사.

### VAD-GS — track 기반 가시성을 학습에 쓴 최근접 선행

Q-12에서 확보 (arXiv 2510.09364) `[원문 확인]`. 복셀 가시성을 "구성 점들에 연관된 **관측 뷰의 합집합**"으로 정의한다. 점의 track에서 가시성을 읽는 발상 자체는 **선행이 있다.** 다만 용도가 다르다: 그들은 densification·재초기화 **판정**에 쓰고, 감독 배분에는 쓰지 않는다.

### 부속 사례

- Sparse View Distractor-Free GS (arXiv 2603.01603) `[2차 자료]`: 정적 물체는 관측 빈도가 높다는 SfM 휴리스틱으로 distractor를 가르되, sparse-view에서는 매칭 쌍 부족으로 **이 휴리스틱이 덜 신뢰된다**고 적는다. track 통계 신뢰성의 한계 담론
- PGSR §V-C `[원문 확인, Q-14]`: 기하 occlusion 추정 제거 시 F1 0.52→0.28. 학습 중 가림 처리의 효과 정량

## 3. 결론 (③에 대한 답)

**"track 멤버십 = 가림 반영 가시성"이라는 발상의 선행은 있다** (VAD-GS의 관측 뷰 합집합). "찾지 못함"이 아니다. 남는 차이는 두 가지다.

1. **용도**: 선행은 densification 판정, 본 연구는 confidence field를 통한 감독 배분
2. **결합**: 선행은 가시성 단독, 본 연구는 가시성과 삼각측량각(제약 조건성)의 결합

인용 사다리: HPR(도구) → Nerfbusters(가시성 loss + 프러스텀 한계 자인) → VAD-GS(track 가시성, densification까지) → 본 연구(감독 배분 + 각 결합). **판단 필요: 이 사다리 채택과, VAD-GS를 위협표에 올릴지.**

## 4. 탐색 경로와 남긴 것

검색: HPR/Katz+GS·NeRF supervision, SfM track visibility supervision COLMAP. 원문 확인: Nerfbusters ar5iv, VAD-GS HTML(08-11).

- HPR 원문(TOG 2007)의 수식·한계(밀도 의존성) 미정독. 도구로 쓸 경우 정독 필요
- Nerfbusters의 가시성 loss가 3DGS 계열로 이식된 후속이 있는지 미탐색
- Sparse View Distractor-Free GS 본문 미독
- VAD-GS 코드 공개 여부 `[코드 미확인]`
