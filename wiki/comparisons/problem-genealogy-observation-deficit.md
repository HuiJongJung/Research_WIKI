---
type: "comparison"
slug: "problem-genealogy-observation-deficit"
title: "문제의 계보 — 관측이 결정하지 못하는 영역을 다뤄온 역사"
status: "draft"
modified_at: "2026-08-25T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://www.cs.toronto.edu/~kyros/pubs/00.ijcv.carve.pdf"
  - "https://ieeexplore.ieee.org/document/273735"
  - "https://dl.acm.org/doi/10.1109/TPAMI.2009.161"
  - "https://arxiv.org/abs/2107.02791"
  - "https://dl.acm.org/doi/10.1145/3272127.3275010"
  - "https://doi.org/10.7717/peerj-cs.3034"
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

## 보강 — 2025 서베이가 꼽은 "남은 과제" 셋 (08-25 추가, 방향 세션)

Xu 외, *A survey on surface reconstruction based on 3D Gaussian splatting*, PeerJ Comput. Sci. 11:e3034 (2025-08-05) `[원문 확인, 로컬 PDF raw/papers/3DGS_RECON_SURVEY.pdf]`. Q-29가 존재를 확인한 그 서베이의 CHALLENGES 절(p20–21)을 방향 세션이 직접 읽은 결과.

절 도입부는 "재구성된 표면과 실제 모델 기하 사이의 성능 격차가 여전하다"로 시작한 뒤, 남은 과제를 셋으로 정리한다 (p20–21).

| # | 저자가 세운 과제 | 저자가 지목한 원인 | 저자가 낸 해법 | 환원되는 축 |
| --- | --- | --- | --- | --- |
| 1 | 더 높은 품질의 데이터셋 구축 | 실험실 데이터셋은 다양성·조명·재질 결여, 합성 데이터셋은 환경 맥락 무시 | 대규모·세밀 데이터셋 구축 | **데이터의 양** |
| 2 | 대규모 씬의 배치 추출 | 방대한 Gaussian 전체 정규화의 계산 비용 | Gaussian 조직 방식 재구성 + 배치 모델링 전략 | **연산 자원** |
| 3 | 표면 기하 디테일의 품질 향상 | **학습 이미지의 고정 해상도 의존** | 가변 해상도 파이프라인 + 이미지 업스케일링 | **픽셀의 양** |

**셋 모두 자원의 문제로 환원되어 있고, 원리적 결정 불가의 층위는 등장하지 않는다.**

특히 3번이 결정적이다. "표면 기하 디테일이 부족하다"는 관찰은 우리와 같은데, 저자는 그 원인을 **입력 이미지의 해상도**로 돌리고 해법도 업스케일링으로 낸다 — 즉 *픽셀을 더 주면 해결된다*는 진단이다. 우리 표적(어둡거나 무질감한 깊은 내부)은 해상도를 올려도 photo-consistency가 쓸 신호가 생기지 않는 영역이므로, **같은 증상에 대한 진단이 갈리는 지점**이다.

**부재가 우연이 아니라는 방증**: 같은 서베이의 Survey methodology 절(p5)이 밝힌 자체 문헌 수집 키워드는 `3D Gaussian splatting` · `3D GS` · `mesh` · `surface` 넷뿐이다 `[원문 확인, p5]`. 관측 결핍 축의 어휘는 **수집 단계에서 구조적으로 배제**되었다. 본문 21쪽 전체 검색에서도 hole·cavity·concave·interior·unseen의 의미 있는 용례는 둘뿐이며(p6 표현력 문맥의 convex/concave 변환, p11 동적 씬 occlusion 대응), 어느 것도 재구성 실패의 서술이 아니다 `[원문 확인, 전문 검색]`.

**빈칸 절과의 연결**: 위 다섯 마디에서 확인한 빈칸이 2025년 시점의 분야 자기인식에서도 재확인된다 — 분야가 스스로 꼽은 남은 과제 어디에도 "관측이 결정하지 못하는 영역"이 없다. 단 rules-research 1-3의 반론("필요 없었던 것 아닌가")은 이것으로 닫히지 않는다. **판단 필요** 상태 유지.

**남은 확인 (→ SURVEY_BRIEF Q-32)**: 이 서베이의 실질 커버리지는 2024년 말까지다 — 투고 2025-01-06, 게재 2025-08-05, 참고문헌 연도 분포 2024년 57편 대 2025년 3편 `[원문 확인, p1 및 참고문헌 전수]`. **2025-01~2026-08의 약 20개월이 미확인 구간**으로 남는다.

## 시간 축 후속 — 2025-01 ~ 2026 하반기 신규분 (Q-32, 08-25)

서베이 커버리지가 2024년 말에서 끊기므로 그 이후를 별도로 훑었다. **결론: A(대상 물체의 깊은 내부를 난점으로 세운 계열)를 정면 표적으로 삼은 신규 연구는 찾지 못했다.** 빈칸은 유지된다.

### 확인한 것 — 전부 A가 아니다

| 신규분 | 무엇인가 | A가 아닌 이유 |
| --- | --- | --- |
| **G4Splat** (ICLR 2026, arXiv 2510.12099) | 평면 구조(Manhattan)로 scale-accurate 기하 제약을 유도하고, **video diffusion inpainting으로 미관측 영역을 채운다** | 미관측의 원인이 **B 계열 조건 = 씬의 sparse view**이지 물체의 깊은 내부가 아니다. 무대도 Replica·ScanNet++·DeepBlending·Mip-NeRF360 **실내 씬**. 노선은 계보 마디 5(prior로 채우기) `[2차 자료 — OpenReview PDF는 인증벽, arXiv 초록·요약 경유]` |
| **InnerGS** (arXiv 2508.13287v4, 2026-07) | 내부 구조 재구성·분할을 표방 — 이름만 보면 A의 정답처럼 보인다 | **입력이 sparse sliced data(단층)이고 카메라 포즈가 필요 없다** `[원문 확인, 초록]`. 외부 카메라로 못 보는 문제 자체가 성립하지 않는다. 우리 조건 밖 |
| **QGS (Quadratic Gaussian Splatting)** (arXiv 2411.16392) | primitive를 quadratic paraboloid로 두어 **볼록·오목을 연속 전이** | 오목을 **표현할 수 있게** 만든 축(축 A 계열 후속)이지 관측 결핍을 다루지 않는다. Q-28a 계보의 primitive 축에 꽂히는 마디 `[2차 자료]` |
| 치과·내시경 계열 (DenSplat, DentalGS, DentalSplat, ColonSplat 등 2026 다수) | 구강·장기의 국소·제한 시점 촬영 | **카메라가 공동 안에 들어간다** (Q-24의 C3VD와 같은 구조). 관측 기하가 반대이며 지표도 PSNR·SSIM 중심 `[2차 자료]`. DenSplat 원문은 ScienceDirect 403 `[미검증]` |
| GAVIS (arXiv 2605.30342), HGS-Planner | 미관측 영역에 높은 불확실도를 부여 | 용도가 **능동 매핑**(다음 촬영 위치) — 계보 마디 4. "촬영을 바꿀 수 있다" 전제 유지 `[2차 자료]` |

### 부수 확인

- **2026년판 GS 표면 재구성 전용 survey는 없다.** 갱신된 것은 applications survey(arXiv 2508.09977, 2026-06-15 갱신 — segmentation·editing·generation)와 일반 GS survey들뿐이다. Q-29의 PeerJ 판이 여전히 유일한 전용 survey이며, 따라서 **커버리지 공백(2025 이후)도 그대로다** `[2차 자료, 검색 목록 대조]`
- 응용축에서 A가 실물로 존재하는 분야(내시경·구강)는 전부 **카메라를 안으로 넣는 것으로 문제를 우회**한다. 이것은 부재의 이유에 대한 단서다 — 산업이 A를 만나면 관측 기하를 바꿔 버리므로, "외부 궤도 고정 + 깊은 내부"라는 조건이 문헌에 남지 않는다. **판단 필요** (rules-research 1-3 반론과 직결: 필요 없었던 것인가, 우회되어 온 것인가)

### 탐색 경로 (부재 주장의 근거)

검색어 4축을 각각 2025-01 이후 필터로: **형상축**(deep cavity / concave object / non-convex object reconstruction / deep recess / hollow object / interior geometry), **관측축**(unobserved region / under-observed / view coverage / limited visibility / occluded interior), **방법축**(visibility-aware supervision / coverage-aware / observation confidence / uncertainty-guided densification), **응용축**(intraoral / endoscopic / borehole / pipe inspection / internal bore metrology / cavity inspection). 2026 학회·arXiv 최신 목록 대조 포함. 훑은 결과 목록 약 60건 중 본문·초록 확인 5편(G4Splat·InnerGS·GSPrior·DenSplat 시도·QGS), 나머지는 제목·요약 수준에서 A 아님으로 배제.

**주의**: 검색 요약이 만든 문장에 속지 않도록 GSPrior(arXiv 2603.19682v1)를 본문 확인했다 — 요약이 전한 "repetitive patterns, deep occlusions, narrow gaps" 문장은 **원문에 없다** `[원문 확인, HTML]`. 일반 기하 정확도 논문이다.

## 탐색 경로와 남긴 것

원문: Kutulakos & Seitz 공식 PDF p.201–203 정독. 2차: Laurentini(유료), PMVS(초록), Smith 2018(수식 미확보). 기확보 재사용: 마디 3·5 전체, Rumpler·AREA3D.

- Laurentini 정식화 원문 대조 (유료 — 본인 열람 배정 후보)
- Smith 2018 수식 원문 (reconstructability 정의식 — 마디 4의 핵심인데 2차 자료 상태)
- PMVS의 가시성 추론 기전 상세 (§ 번호 미확보)
- 베이지안 MVS 고전(마디 3의 전사)은 미탐색
