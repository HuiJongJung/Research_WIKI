---
type: "comparison"
slug: "mvs-vs-gs-surface-reconstruction-evidence"
title: "고전 MVS 대 GS 표면 재구성, 같은 무대의 실측"
status: "draft"
modified_at: "2026-08-05T16:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://doi.org/10.5194/isprs-annals-X-G-2025-641-2025"
  - "https://arxiv.org/abs/2412.01402"
  - "https://arxiv.org/abs/2605.30310"
tags:
  - "mvs"
  - "gaussian-splatting"
  - "justification"
  - "survey-q07"
---

# 고전 MVS 대 GS 표면 재구성, 같은 무대의 실측

> SURVEY_BRIEF Q-07, 등록부 A1. **논거 구성은 위키 판단 세션이 한다.** 이 페이지는 재료만 모은다.
> 조사일 2026-08-05.

## 1. 같은 무대에서 비교된 표가 있다

Petrovska, Jutzi, "3D Gaussian Splatting Methods for Real-World Scenarios", ISPRS Annals Vol. X-G-2025, ISPRS Geospatial Week 2025, Dubai. CC BY 4.0. doi 10.5194/isprs-annals-X-G-2025-641-2025.

무대는 실제 촬영 두 장면이다. **Original**은 가림이 없는 실내, **Vegetation**은 식생 뒤에 대상이 놓인 실외다. 평가는 GT mesh에 대한 점군의 cloud-to-mesh 거리이며 부호를 갖는다. 대상은 불상 하나이므로 **도시 규모가 아니다.**

### Table 1 (정확도 mm, 완전성 퍼센트)

| 장면 | 방법 | 평균 | 표준편차 | RMSE | 점 수 | 완전성 |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Original | **MVS** | **0.16** | **1.42** | **1.43** | 845,456 | 97.35 |
| Original | NeRF | -2.94 | 4.48 | 5.36 | 1,682,388 | 98.23 |
| Original | 3DGS-Basic | -2.02 | 4.29 | 4.74 | 352,298 | 82.75 |
| Original | Splatfacto | -3.15 | 6.56 | 7.28 | 51,209 | 79.83 |
| Original | 3DGS-MCMC | -1.60 | 5.58 | 5.80 | 1,556,040 | **99.45** |
| Original | 3DGS-LumaAI | -3.47 | 6.11 | 7.02 | 167,470 | 88.77 |
| Vegetation | **MVS** | **0.53** | **3.18** | **3.23** | 117,427 | **75.95** |
| Vegetation | NeRF | -5.43 | 11.44 | 12.67 | 181,058 | 69.95 |
| Vegetation | 3DGS-Basic | -2.54 | 7.05 | 7.49 | 40,807 | 42.71 |
| Vegetation | Splatfacto | -6.21 | 12.33 | 13.80 | 10,518 | 31.80 |
| Vegetation | 3DGS-MCMC | -7.35 | 15.70 | 17.36 | 69,719 | 65.93 |
| Vegetation | 3DGS-LumaAI | -1.95 | 7.32 | 7.58 | 7,173 | 27.02 |

### Table 2 (공개 여부와 학습 시간)

| 방법 | 오픈소스 | 학습 시간 |
| --- | --- | --- |
| MVS | 예 | 1시간 15분 |
| NeRF | 예 | 15분 |
| 3DGS-Basic | 예 | 49분 |
| Splatfacto | 예 | 25분 |
| 3DGS-MCMC | 아니오 | 43분 |
| 3DGS-LumaAI | 아니오 | 45분 |

### 저자들의 진술

- MVS가 정확도에서 압도하며 완전성도 높지만 **가장 느리다.** 원인은 조밀 매칭의 비용이다
- NeRF와 모든 3DGS가 MVS보다 정확도가 낮은 이유를 저자들이 명시한다. **기하가 이미지 재구성 loss의 최소화로 만들어지기 때문**이며, 점이 표면에 밀착하지 않고 물체 내부에 artifact 점이 생겨 정확도를 왜곡하되 완전성에는 기여하지 않는다
- 3DGS 계열은 가림 장면에서 완전성 하락 폭이 MVS와 NeRF보다 크다. 저자들은 이것이 가림 상황에서의 견고성을 제한한다고 적는다
- 반대편 근거도 같은 논문에 있다. 3DGS가 **식생 뒤의 기하를 복원할 수 있음**을 보이고 임업 응용의 가능성을 든다

**이 표는 A1에 유리하지 않다.** 정확도와 완전성 모두 MVS가 앞서고 GS의 이점은 속도와 가림 뒤 복원 쪽에 있다. 다만 무대가 물체 하나이며 GS 계열 중 표면 재구성 전용 기법(2DGS, GOF, MILo 등)이 아니라 렌더링용 구현들이 비교되었다는 한계가 있다.

## 2. 대규모에서는 같은 표가 없다

- **City-Mesh3R** (arXiv 2605.30310, 2026-05): 도시 규모 watertight mesh. 비교 대상은 CityGaussian v2와 CityGaussian-X, 소규모 기법으로 MILo, MeshSplatting, Radiance Meshes다. **고전 MVS 파이프라인과의 비교가 없다.** 실행 시간은 CUHK-LOWER에서 자기 방법 95분, CityGS-v2 341분, CityGS-X 75분. 기하 지표는 같은 씬에서 F1 0.1110 대 0.1009 수준이다
- **ULSR-GS** (arXiv 2412.01402, ISPRS 저널 판본 있음): 초록은 GS가 **대규모 항공 이미지의 표면 추출에서 부족하다**고 적고, 비교 대상을 다른 GS 기법으로 한정한다. 고전 MVS와의 직접 비교 주장은 초록에서 확인되지 않는다 `[미검증]` 저널 판본 본문은 접근하지 못했다

도시 규모에서 GS 계열의 F1이 0.11 수준이라는 점은 **그 규모에서 GS mesh가 아직 측량 수준이 아니라는 뜻**으로 읽힌다. 지표 정의와 임계가 논문마다 다르므로 절대값 비교는 하지 않는다.

## 3. 판단 세션에 넘기는 재료

- GS를 써야 할 이유로 **정확도**를 내세우면 위 표가 반례가 된다
- 남는 후보는 세 가지다. **속도**(다만 최속은 NeRF), **가림 뒤 복원**, 그리고 **하나의 표현으로 렌더링과 기하를 함께 얻는다**는 성질
- 본 연구의 문제의식과 직접 이어지는 문장이 이 논문 안에 있다. **기하가 이미지 재구성 loss로 만들어지기 때문에 정확도가 낮다**는 저자들의 설명은 photometric ambiguity 서사와 같은 진단이다. 인용 가치가 높다

## 4. 남긴 것

- 고전 MVS의 **도시 규모** 달성 범위와 비용을 다룬 원전을 확보하지 못했다. ISPRS 저널 계열 두 편이 유료 접근이라 초록도 읽지 못했다 `[미검증]`
- 표면 재구성 전용 GS 기법(2DGS, GOF, MILo)과 MVS를 같은 표에 놓은 문헌은 **찾지 못했다**
- ULSR-GS 저널 판본 본문 미확인
