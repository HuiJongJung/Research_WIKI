---
type: "question"
slug: "gs-improvement-mesh-improvement-link"
title: "GS 개선이 mesh 개선으로 이어지는가를 다룬 선행"
status: "draft"
modified_at: "2026-08-19T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "raw/papers/2D Gaussian Splatting for Geometrically Accurate Radiance Fields.pdf"
  - "raw/papers/MILo.pdf"
  - "https://arxiv.org/abs/2603.20714"
  - "https://doi.org/10.5194/isprs-annals-X-G-2025-641-2025"
tags:
  - "gs-to-mesh"
  - "survey-q18"
  - "motivation"
---

# GS 개선이 mesh 개선으로 이어지는가를 다룬 선행

> SURVEY_BRIEF Q-18. 방향 전환의 3번 항목("GS 개선 = mesh 개선"을 전제하지 않고 연결 자체를 실측으로 증명한다)의 문헌 기반.
> 조사일 2026-08-19.

## 1. 연결이 자명하지 않다는 원문 근거 (반례 계열)

**"렌더링은 좋은데 mesh는 나쁘다"는 문헌에 명시적으로 존재한다.** 넷 확보.

| 출처 | 원문/내용 | 격 |
| --- | --- | --- |
| 2DGS 초록 (arXiv 2403.17888v3, SIGGRAPH 2024 게재본) | "3DGS **fails to accurately represent surfaces** due to the multi-view inconsistent nature of 3D Gaussians" — 렌더링 혁신 인정 직후의 문장 | `[원문 확인, p.1]` |
| 2DGS p.2 | 3DGS는 "falls short in capturing intricate geometry"이며 volumetric Gaussian이 "**conflicts with the thin nature of surfaces**" | `[원문 확인]` |
| MILo p.2 | 2단계 파이프라인에서는 "rendering에서 보이던 fine detail이 mesh 추출에서 사라질 수 있다" — 최적화가 mesh를 고려하지 않으므로 일치 보장이 없다 | `[원문 확인, 위키 소스]` |
| 3DGS 원논문 §8 p.11 | mesh 재구성 가능 여부 자체를 열린 문제로 남긴다: "It would be interesting to see if our Gaussians can be used to perform mesh reconstructions ... better understand where our method stands exactly in the **continuum between volumetric and surface** representations" | `[원문 확인, 게재본 스캔 08-09]` |

**보너스 원문 (용어 직결)**: 2DGS p.2가 노이즈 재구성의 원인을 이렇게 적는다. "optimizing solely with photometric losses can lead to noisy reconstructions, due to the inherently **unconstrained** nature of 3D reconstruction tasks" (Barron 2022b, Yu 2022b, Zhang 2020 인용 첨부). **표면 재구성 대표 기법이 photometric 단독 최적화의 unconstrained 성질을 명시한 문장**이다. 우리 under-constrained 서사의 최근접 원문이며 인용 은행에 등록할 가치가 있다.

## 2. 시각 품질과 기하 품질의 분리 실측 (정량)

| 출처 | 실측 | 함의 |
| --- | --- | --- |
| Desiatov & Sattler (arXiv 2603.20714) | dense 초기화가 "**visual improvements 없음** + geometric consistency는 유의미 개선" | 같은 개입이 시각과 기하에 다르게 작용 — 두 품질 축의 분리 실증 `[원문 확인, 초록. 본문 기확보 08-11]` |
| Petrovska & Jutzi (ISPRS Annals X-G-2025) | GS가 NVS 대표인데 같은 무대 cloud-to-mesh에서 MVS에 정확도·완전성 모두 열세. 이유: "기하가 이미지 재구성 loss의 최소화로 만들어지기 때문" | 렌더링 최적화 ≠ 기하 최적화의 무대 실측 `[원문 확인, 08-05]` |
| CoMe Table 5 (위키 소스) | densification 조절을 끄면 **primitive 20% 증가 + F1 하락** | Gaussian 수 증가가 mesh 품질과 **비단조** 관계임을 SOTA ablation이 직접 보임 `[원문 확인, 기존 페이지]` |

## 3. 비 in-loop 기법에서 GS 개선 → mesh 개선 사례 (순방향)

연결이 **정규화를 매개로는** 성립한다는 것이 2DGS·PGSR 계열의 존재 이유다.

- 2DGS: depth distortion + normal consistency 정규화 → TSDF mesh 개선 (DTU 0.80). primitive 표현 변경(3D→2D 디스크) 자체가 개입
- PGSR: 평면 정규화 + 다중 뷰 기하 일관성 → TSDF mesh 0.52
- 즉 "Gaussian 배치·정렬을 기하 쪽으로 당기는 개입은 후추출 mesh를 개선한다"는 순방향 사례는 많다. **단 이들이 잰 것은 최종 mesh 지표뿐이며, "Gaussian 품질 지표 → mesh 품질 지표"의 매개 관계를 정량 분해한 논문은 찾지 못했다** (탐색 경로 4절)

## 4. 결론과 남는 자리

- 반례(렌더링 좋음·mesh 나쁨)와 순방향(정규화 개입 → mesh 개선) 모두 문헌에 있으나, **"Gaussian 상태의 어떤 양이 mesh 품질을 예측하는가"를 정량으로 다룬 논문은 찾지 못했다.** 찾은 최근접은 CoMe의 primitive 수 ablation(단일 인자)과 Desiatov & Sattler의 초기화 밀도(단일 인자)다
- 따라서 방향 전환 3번("연결 자체를 실측으로 증명")의 실험(X3)은 선행과 겹치지 않는 것으로 보인다. **판단 필요: X3 설계 시 위 두 단일 인자 실측을 baseline 비교축으로 쓸지**

탐색 경로: 검색어 "high-quality rendering but poor geometry" GS 계열 + Trim 3DGS·G2SDF 초록 훑음(매개 정량 없음), 2DGS·MILo 로컬 원문, 기존 위키 재사용.

## 5. 남긴 것

- Trim 3DGS (arXiv 2406.07499) 본문 미독 — "Gaussian 정리 → 기하 개선" 계열로 3절 보강 후보
- LeGS·RLGS가 mesh 지표를 보고하는지 (Q-17과 공유 미확인)
- "unconstrained" 문장이 인용한 Barron 2022b·Zhang 2020 원전 미확인 (NeRF 계열의 같은 진단 계보 — 인용 사다리 소급 가능)
