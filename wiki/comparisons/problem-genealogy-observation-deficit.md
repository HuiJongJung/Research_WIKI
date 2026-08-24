---
type: "comparison"
slug: "problem-genealogy-observation-deficit"
title: "문제의 계보 — 관측이 결정하지 못하는 영역을 다뤄온 역사"
status: "draft"
modified_at: "2026-08-21T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://www.cs.toronto.edu/~kyros/pubs/00.ijcv.carve.pdf"
  - "https://ieeexplore.ieee.org/document/273735"
  - "https://dl.acm.org/doi/10.1109/TPAMI.2009.161"
  - "https://arxiv.org/abs/2107.02791"
  - "https://dl.acm.org/doi/10.1145/3272127.3275010"
tags:
  - "problem-genealogy"
  - "survey-q28b"
  - "observation-deficit"
  - "related-work"
---

# 문제의 계보 — 관측이 결정하지 못하는 영역을 다뤄온 역사

> SURVEY_BRIEF Q-28b. 무대 계보(Q-28a)와 구분되는 **문제의 계보**: "관측이 결정하지 못하는 영역을 어떻게 다룰 것인가"의 마디들. 정리 형식은 rules-research 1-5(의도 축)와 산출 요구(물려받음/풀었음/**전제**).
> 조사일 2026-08-21.

## 마디 1. Space carving / visual hull — 결정 가능한 것의 형식화 (1994–2000)

**Laurentini 1994** (IEEE TPAMI 16(2), 150–162) `[2차 자료 — 원문 유료]`: visual hull 표면 위의 특징만 실루엣으로 재구성 가능. 오목은 원리적 불가.

**Kutulakos & Seitz, "A Theory of Shape by Space Carving"** (IJCV 38, 199–218, 2000) `[원문 확인, 공식 PDF p.201–203]`.

- **꼬집는 문제**: 기존 재구성이 정규화 휴리스틱으로 모호성을 덮는다 — "smoothness heuristics and regularization ... typically penalizes discontinuities and sharp edges" (§1.1). 그리고 어떤 알고리즘이 무엇을 복원할 수 있는지의 이론이 없다
- **방향성·방법**: 사진과 모순되지 않는 모든 형상의 등가류를 분석하고, 그 **최대 원소(photo hull)** 를 carving으로 계산
- **의도**: 임의 선택 대신 "least commitment" — 모든 photo-consistent 형상을 부분집합으로 갖는 유일 형상을 고르면, 무엇이 결정되고 무엇이 안 되는지가 형상 자체에 담긴다
- **결과**: photo hull의 존재 증명 + provably-correct 알고리즘. 기여 2 verbatim: "the tightest possible bound on the shape ... **regardless of the specific algorithm being employed**" (p.201)
- **핵심 verbatim (우리 명제의 원전급)**: "there are 3D scenes for which **no finite set of input photographs can uniquely determine their shape**: in general, there exists an **uncountably-infinite equivalence class** of shapes each of which reproduces all of the input photographs" (§1.1, p.202)
- **전제**: locally computable radiance(투명·거울 제외), 배경 식별(hull), 알려진 카메라
- **물려준 것**: "관측이 결정하는 것"의 경계가 알고리즘 무관의 기하학적 사실이라는 인식. 덤 — radiance 제약은 hull과 달리 "can contain concavities" (§2.2): **질감 있는 오목은 photo-consistency가 깎을 수 있다.** 어두운 무질감 내부만 남는다는 우리 표적의 정밀화에 직결
- **남긴 한계**: 등가류의 존재를 알려주되, 그 **내부**(결정 불가 영역)를 하류 재구성에서 어떻게 다룰지는 다루지 않음

## 마디 2. MVS의 가시성 추론 — 감독에서 배제하기 (2007–2016)

**Furukawa & Ponce, "Accurate, Dense, and Robust Multiview Stereopsis" (PMVS)** (TPAMI 32(8), 2010) `[2차 자료 + 초록]`.

- **꼬집는 문제**: 가림·거짓 매칭이 조밀 재구성을 오염시킴
- **방법·의도**: match–expand–filter 반복. "visibility constraints to filter away false matches" — 가시성을 명시적으로 추론해 **모순 관측을 감독에서 제거**하면 photometric consistency가 남은 곳에서만 작동해 강건해진다
- **결과**: 조밀·강건 MVS의 표준. COLMAP §4.1(panoramic 쌍 비삼각측량)·PGSR occlusion 게이트(ablation 0.52↔0.28)로 이어지는 관행의 원전급
- **전제**: 질감이 있어 photometric consistency 판정이 가능할 것
- **남긴 한계**: 무질감·가림 영역은 **버려진다**(sparse). 배제는 오염을 막지만 결핍 영역 자체는 빈 채로 남음

## 마디 3. 불확실도 인지 재구성 — 확신을 값으로 (2016–현재)

DS-NeRF(CVPR 2022, 재투영 오차→깊이 감독 분산), CDGS(화소 confidence→깊이 가중), CoMe(학습 confidence→photometric 재가중), Kendall & Gal 계보 — 전부 기확보 (`[[sfm-byproducts-beyond-points-precedent]]`, `[[learned-frontend-confidence-usage]]`).

- **공통 의도**: 불확실도를 스칼라로 만들어 감독의 세기에 곱하면, 나쁜 감독의 해를 줄이면서 버리지는 않는다 (마디 2의 이진 배제를 연속화)
- **전제**: 불확실도가 **측정 가능한 잔차·분산에서 유도**될 것
- **남긴 한계**: 대부분 학습 중·잔차 기반 — 성공한 photometric ambiguity는 잔차를 남기지 않는다(CoMe 반박 논리·NeRF++ §3). **관측이 애초에 없는 곳은 잔차도 없다**

## 마디 4. NBV · reconstructability — 촬영 기하로 사전 예측 (2011–현재)

**Smith 외 2018** (SIGGRAPH Asia, TOG 37(6)) `[2차 자료 — 수식 원문 미확보]`: reconstructability를 표면점마다 가시성·거리·각도의 가우시안 함수 합으로 정의. Rumpler 2011(각도-불확실도), AREA3D(복셀 불확실도 field)로 이어짐.

- **의도**: 촬영 기하만으로 재구성 품질을 **찍기 전에** 예측할 수 있다면 다음 촬영 위치를 고를 수 있다
- **우리 방법의 직계 조상** — 단 용도가 "다음에 어디서 찍을까"
- **전제**: **촬영을 바꿀 수 있다** (능동 캡처)
- **남긴 한계**: 고정 캡처에는 처방이 없다. 예측량은 있는데 쓸 곳이 촬영 계획뿐

## 마디 5. Shape completion — 없는 곳을 prior로 채우기 (반대 노선)

ShapeHD 계열 (Q-27 기확보) `[2차 자료]`.

- **의도**: 관측이 없어도 학습 분포가 아는 형상이면 그럴듯하게 채울 수 있다
- **전제**: 학습 분포가 대상을 덮을 것 + **채우는 것이 목표에 부합할 것**
- **남긴 한계**: 실물 구멍과 관측 결손을 구분하는 장치가 없다 (Q-27). 채우기가 목표가 아닐 때는 노선 자체가 무효

## 빈칸 확인 (산출 요구)

**"촬영을 바꿀 수 없고 + 채우기를 원하지 않을 때" 결정 불가 영역을 정면으로 다룬 마디는 확인 범위에서 없다.**

| 마디 | 결정 불가 영역의 취급 |
| --- | --- |
| 1 carving | 존재를 형식화 (least commitment로 최대 형상 선택에서 멈춤) |
| 2 MVS | 감독에서 배제 (영역은 빈 채로) |
| 3 불확실도 | 잔차 기반 가중 (관측 없는 곳은 잔차도 없음) |
| 4 NBV | 예측 후 **재촬영** (고정 캡처엔 처방 없음) |
| 5 completion | prior로 채움 (보존 목표와 충돌) |

마디 1이 "결정 불가 영역이 어디인지는 알 수 있다"를 주고, 마디 4가 "촬영 기하로 사전 예측 가능"을 주는데, **둘을 고정 캡처의 학습 내부(감독 배분·표시)로 가져온 마디가 비어 있다.** 이것이 우리 자리 후보다. **판단 필요** — rules-research 1-3의 반론("필요 없었던 것 아닌가")은 Q-29의 survey 부재 사실과 함께 방향 세션이 받을 것.

## 탐색 경로와 남긴 것

원문: Kutulakos & Seitz 공식 PDF p.201–203 정독. 2차: Laurentini(유료), PMVS(초록), Smith 2018(수식 미확보). 기확보 재사용: 마디 3·5 전체, Rumpler·AREA3D.

- Laurentini 정식화 원문 대조 (유료 — 본인 열람 배정 후보)
- Smith 2018 수식 원문 (reconstructability 정의식 — 마디 4의 핵심인데 2차 자료 상태)
- PMVS의 가시성 추론 기전 상세 (§ 번호 미확보)
- 베이지안 MVS 고전(마디 3의 전사)은 미탐색
