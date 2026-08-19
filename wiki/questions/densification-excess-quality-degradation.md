---
type: "question"
slug: "densification-excess-quality-degradation"
title: "densification 과잉이 품질을 떨어뜨린다는 선행과 RL 조절"
status: "draft"
modified_at: "2026-08-19T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://arxiv.org/abs/2404.06109"
  - "https://arxiv.org/abs/2605.00408"
  - "https://arxiv.org/abs/2508.04078"
  - "raw/papers/2D Gaussian Splatting for Geometrically Accurate Radiance Fields.pdf"
tags:
  - "densification"
  - "survey-q17"
  - "prior-art"
---

# densification 과잉이 품질을 떨어뜨린다는 선행과 RL 조절

> SURVEY_BRIEF Q-17. 세 질문: ① clone/split 과잉의 품질 저하 문제 제기 ② ICML의 RL 기반 densification 조절 정체 ③ densification 조절로 **mesh 품질**을 개선한 사례.
> 조사일 2026-08-19.

## 1. 과잉·편향 densification의 문제 제기 (원전들)

### 1-1. "0.7+0.7" 기전의 원전 — clone의 불투명도 부풀림

Bulò, Porzi, Kontschieder, "Revising Densification in Gaussian Splatting" (ECCV 2024, arXiv 2404.06109) §3.3 `[원문 확인, ar5iv]`.

- clone 시 원래 opacity를 그대로 복제하면 알파 합성에서 뒤로 전달되는 가중이 (1−α)에서 **(1−α)²로 줄어** 복제된 primitive의 시각 가중이 인위적으로 부푼다. 원문: "Before we clone, the rendered color depends with weight 1−α on what comes next. After we clone ... with weight (1−α)²."
- 보정식: **α̂ = 1 − √(1−α)** (합성 상태 보존 조건 (1−α)=(1−α̂)²의 해)
- 개선 보고는 **SSIM·LPIPS**(Mip-NeRF 360 LPIPS 0.250→0.223 등, Tables 1–3). **기하 지표는 없다** — 렌더링 논문이다

구두로 전해지던 "0.7+0.7=1.4" 기전이 이 논문의 합성 가중 논증과 대응한다. 인용은 이 형태(가중 부풀림)로 해야 정확하다.

### 1-2. 질감 편향 — 2DGS의 자인

2DGS §7 p.8 `[원문 확인, 게재본]`: "our current densification strategy **favors texture-rich over geometry-rich areas**, occasionally leading to less accurate representations of fine geometric structures." 표면 재구성 대표 기법이 densification의 기하 무관심을 스스로 인정한 문장.

### 1-3. over-densification과 위조의 서식지 — CoMe (위키 기확보)

[[confidence-steered-densification]] `[원문 확인, 기존 페이지]`: gradient 기반 densification은 view-dependent 외관이 강한 영역에서 큰 gradient를 유발해 over-densification을 일으키고, **그 과밀 영역이 바로 geometry로 외관을 위조하기 쉬운 곳**이다. CoMe는 임계값을 confidence로 나눠(Eq.12) 저신뢰 영역의 분열을 억제한다.

## 2. ICML의 RL densification — 정체 특정

- **LeGS, "Beyond Heuristics: Learnable Density Control for 3D Gaussian Splatting"** (arXiv 2605.00408, 2026-05) `[2차 자료]`. density control을 **RL 정책 네트워크**로 재정식화하고, Gaussian 하나가 재구성 품질에 주는 한계 기여를 sensitivity 분석으로 정량화한 **보상 함수**로 학습한다. 손설계 규칙(gradient 임계) 대체가 목표
- 교수 언급의 "ICML 강화학습 densification"은 LeGS로 특정된다. 본인 ICML 2026 청취 기록에도 LeGS가 있다 `[본인 청취 기록]`. **단 게재처가 ICML 2026인지는 arXiv 페이지에서 확정하지 못했다** `[미검증]`
- 인접: RLGS (arXiv 2508.04078, 2025-08) `[2차 자료]` — densification 임계 포함 하이퍼파라미터를 RL로 동적 조정하는 plug-and-play 모듈

두 편 모두 **평가는 렌더링(NVS)**으로 보인다. mesh 지표 보고 여부는 본문 미독 `[미검증]`.

## 3. densification 조절로 mesh 품질을 개선한 사례 (③의 답)

**있다. 둘 확보, 모두 기존 위키에서.**

| 사례 | 조절 방식 | mesh 지표에 미친 효과 |
| --- | --- | --- |
| **CoMe** (ECCV 2026) | confidence로 분열 임계 상승 (Eq.12) | **끄면 primitive 20% 증가 + F1 소폭 하락** (Table 5) `[원문 확인, 기존 페이지]`. 조절이 mesh F1에 기여함을 ablation으로 보인 직접 사례 |
| **Expo-GS** | SDF 조향 성장·제거 score ([[sdf-guided-density-control]], Eq.13–14) | 표면 근접도를 성장 신호에 결합해 노출 경계의 hallucinated 구조를 생성 단계에서 억제 `[원문 확인, 기존 페이지]` |

즉 "densification을 photometric gradient 단독에서 떼어내 다른 판별값으로 조향하면 mesh가 좋아진다"는 방향의 선행은 존재한다. 남는 자리: **학습 전에 계산되는 촬영 기하 판별값**으로 조향한 사례는 위 어느 것도 아니다 (CoMe는 학습된 confidence, Expo-GS는 학습 중 SDF, LeGS는 학습된 정책). lever④′(clone 억제)의 novelty 경계가 여기서 선다. **판단 필요.**

## 4. 탐색 경로와 남긴 것

검색: ICML 2026 RL densification, RL adaptive density control reward. 원문: Bulò ar5iv, 2DGS 게재본 p.8. 위키 재사용: confidence-steered-densification, sdf-guided-density-control.

- LeGS 본문 미독 (보상 함수의 구체형, mesh 지표 유무, 게재처)
- RLGS 본문 미독
- Mini-Splatting·Taming 3DGS 등 densification 예산 계열은 훑지 않았다 (렌더링 표적으로 보이나 미확인)
- 3DGS-MCMC(densification의 MCMC 재해석)도 미조사 — C7 예비판과 무관하지 않을 수 있음
