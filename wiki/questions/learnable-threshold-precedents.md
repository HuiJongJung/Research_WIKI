---
type: "question"
slug: "learnable-threshold-precedents"
title: "차등 supervision의 learnable threshold 선례"
status: "draft"
modified_at: "2026-08-21T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://arxiv.org/abs/1703.04977"
  - "raw/papers/CoMe - Confidence-Based Mesh Extraction from 3D Gaussians.pdf"
  - "https://arxiv.org/abs/2508.04078"
  - "https://arxiv.org/abs/2403.20309"
tags:
  - "learnable-threshold"
  - "survey-q31"
  - "q-b"
  - "method-design"
---

# 차등 supervision의 learnable threshold 선례

> SURVEY_BRIEF Q-31, research-status §4 Q-B의 조사 담당분. confidence 차등에서 임계·가중을 learnable로 둔 선례 (GS·NeRF·MVS 불문). rules-research 1-5 의도 축 + 4-1(임계값을 임의로 정하지 않는다)의 문헌 기반.
> 조사일 2026-08-21.

## 1. 원전 — 학습되는 가중의 정식화

**Kendall & Gal, "What Uncertainties Do We Need in Bayesian Deep Learning for Computer Vision?"** (NeurIPS 2017, arXiv 1703.04977) `[2차 자료 — 수식 원문 미대조]`.

- 꼬집는 문제: loss 가중을 손으로 정하면 데이터마다 틀린다
- 방법: 관측별 분산 σ를 **네트워크 출력으로 학습**하고 loss를 잔차/σ² + log σ 형태로 재구성
- **의도**: 가중을 하이퍼파라미터에서 떼어내 **loss 자체가 감독하게** 하면(잔차 큰 곳은 σ를 키워 벌점 회피, log σ가 무한 팽창을 막음) 임계 선택 문제가 사라진다 — "**learned loss attenuation**"
- 결과: heteroscedastic 회귀·분할에서 개선. **"임계 대신 learnable"의 표준 인용**
- 남는 한계: 감독자는 여전히 잔차 — 잔차가 없는 곳(관측 결핍)은 못 본다

## 2. 재구성 계열의 실물 선례

| 선례 | learnable로 둔 것 | 파라미터화 | 무엇이 감독하나 | 결과 | 격 |
| --- | --- | --- | --- | --- | --- |
| **CoMe** (ECCV 2026) | per-primitive confidence Ĉ 자체 (임계 없음, 연속) | 학습 스칼라, ℒ_conf = ℒ_rgb·Ĉ − β·logĈ (최적 Ĉ*=β/ℒ_rgb) | photometric 잔차 (β는 상수로 남음 — β-ablation Fig.7: 0.075 최적) | T&T F1 0.521, 조향 끄면 primitive 20%↑ | `[원문 확인, 위키 소스]` |
| **NeRF-W** | 화소별 불확실도 β (transient 완화) | NeRF 출력 확장 | photometric 잔차 (Kendall & Gal 형) | in-the-wild NVS 표준 | `[2차 자료]` |
| **InstantSplat v6** | 점별 학습률 배율 | (1 − sigmoid(O_init))·β — **sigmoid 온도형 soft 변환의 실물** | 없음 (초기 confidence 고정, β는 하이퍼) | NVS 수렴 개선 주장 | `[원문 확인, 08-09]` |
| **RLGS** (arXiv 2508.04078) | **densification 임계 자체를 포함한 하이퍼파라미터** | RL 정책 모듈 | 렌더 품질 보상 | plug-and-play 주장 | `[2차 자료]` |
| **LeGS** (ICML 2026) | densification 결정 자체 | RL 정책 (sensitivity 보상) | Gaussian별 한계 기여 | NVS | `[2차 자료]` |

**패턴**: "임계를 learnable로" 직접 사례는 RL 계열(RLGS·LeGS)이고, 더 흔한 형태는 **임계를 없애고 연속 가중을 학습**하는 것(Kendall & Gal → NeRF-W → CoMe)이다. 후자가 주류이며 전부 **잔차가 감독자**다.

## 3. 반대 노선 — learnable 없이 근거를 만든 쪽

- **분포 기반 percentile**: AmbiSuR가 지표 상·하위 백분위(η_U 5% 등)로 개입 대상을 고른다 — 값 임계가 아니라 **비율 임계**라 씬 간 이식 가능. 단 비율 고정의 한계(깨끗한 씬에서도 강제 선발)는 위키 소스에 기록됨 `[원문 확인, 위키 소스]`
- **닫힌형 유도**: Bulò 외의 clone opacity 보정 α̂ = 1−√(1−α) — 보존 조건에서 유일하게 유도되는 상수 `[원문 확인, 08-19]`. rules 4-1의 "분포 기반 유도" 모범
- **민감도 곡선**: CoMe의 β-ablation(Fig.7)이 상수를 남기되 민감도를 보인 사례

## 4. Q-B에 넘기는 정리

1. learnable 노선의 공통 전제: **감독자가 있어야 한다.** 잔차 감독(주류)은 관측 결핍 영역에서 침묵한다 — 우리 confidence가 잔차가 아닌 촬영 기하에서 온다면, **무엇이 learnable 임계를 감독하는가**가 설계 질문이 된다 (GT mesh 있는 합성 무대라면 기하 오차가 감독자 후보). **판단 필요**
2. 대안 셋의 문헌 지위: RL(임계 직접, 무겁다) / 연속 가중 학습(주류, 잔차 전제) / 분포·유도 기반(learnable 없이 근거, AmbiSuR·Bulò 모범)
3. sigmoid 온도형 soft threshold의 실물 파라미터화는 InstantSplat 형태가 참고

## 탐색 경로와 남긴 것

검색: Kendall & Gal + NeRF-W learnable uncertainty. 기확보 재사용: CoMe·InstantSplat·RLGS·LeGS·AmbiSuR·Bulò.

- Kendall & Gal 수식 원문 미대조 (인용 전 필요)
- NeRF-W 원문 미독 (β 파라미터화 상세)
- MVS 쪽 learnable threshold(학습형 confidence 필터 등) 미탐색 — DeepC-MVS 계열이 후보
- RLGS·LeGS 본문 미독 (반복)
