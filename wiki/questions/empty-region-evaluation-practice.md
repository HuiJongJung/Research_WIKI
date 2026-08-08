---
type: "question"
slug: "empty-region-evaluation-practice"
title: "비어야 할 영역을 표면 재구성 벤치마크는 어떻게 다루는가"
status: "draft"
modified_at: "2026-08-05T15:20:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://arxiv.org/abs/2411.10546"
  - "https://arxiv.org/abs/2410.21739"
  - "https://arxiv.org/abs/2606.20856"
tags:
  - "evaluation"
  - "sky"
  - "completeness"
  - "survey-q06"
---

# 비어야 할 영역을 표면 재구성 벤치마크는 어떻게 다루는가

> SURVEY_BRIEF Q-06, 등록부 C1. accuracy 계열을 포기한 결정과 직결된다.
> 조사일 2026-08-05.

## 1. 한 줄 결론

**기존 벤치마크는 비어야 할 영역을 재지 않는다. 재기 전에 지운다.** 크롭, 가시성 필터, 마스크가 그 장치이며 세 벤치마크 모두 같은 방향이다. 결과적으로 "없어야 할 것이 있음"은 지표에 거의 들어오지 않는다.

## 2. 벤치마크별 장치

### Oxford Spires (arXiv 2411.10546, IJRR 2025) — 본 연구의 주 무대

- accuracy는 재구성에서 GT로 가는 점 대 점 거리, completeness는 GT에서 재구성으로 오는 거리다. 임계는 **5cm와 10cm** 두 가지
- **GT가 재구성되지 않은 영역 바깥의 재구성 점을 걸러낸다.** 즉 TLS가 닿지 않은 곳에 생긴 기하는 평가에 들어오지 않는다
- 하늘에 대한 명시적 서술이 있다. **Nerfacto에 대해서는 하늘을 특별히 제거해야 한다**고 적으며, 그 이유로 밀집 표현이 가용한 깊이 단서로 하늘까지 재구성하려 든다는 점을 든다

세 번째 항목이 중요하다. **우리 무대의 벤치마크 논문 자신이 radiance field 계열은 하늘에 기하를 만든다고 적었고, 그것을 측정 대상이 아니라 제거 대상으로 처리했다.**

### Tanks and Temples

- 재구성과 GT의 겹치는 축정렬 경계 상자를 구해 양쪽을 크롭하고 ICP로 정렬한 뒤 계산한다
- precision은 재구성 점 중 GT까지의 거리가 임계 이하인 비율, recall은 그 반대 방향이며 F는 조화평균이다
- 크롭 밖의 기하는 평가에서 사라진다. 본 연구가 Ignatius에서 확인한 **원시 스캔 점의 46.8퍼센트가 공식 crop 밖**이라는 실측과 같은 구조의 문제다

### SS3DM (arXiv 2410.21739)

- 카메라 포즈를 이용해 **보이지 않는 삼각형 면을 먼저 걸러낸 뒤** 리샘플한다
- **카메라 궤적의 경계 상자를 각 방향으로 25m 확장한 상자로 크롭**한다
- 크롭의 근거를 명시한다. 현재 기법들이 원거리 표면을 제대로 못 만들기 때문에 원거리 점 평가가 의미 없고, 그런 점이 많으면 지표 수치를 지배해 근거리의 성능 차이를 가린다는 것이다
- 지표는 Chamfer와 Normal Chamfer를 각각 Accuracy와 Completeness로 분해해 보고한다

SS3DM의 크롭 근거는 **본 연구의 문제 제기와 정확히 반대 방향의 같은 관찰이다.** 원거리가 나쁘다는 것을 알고 있고, 그래서 지운다.

## 3. "있어야 할 것이 없음" 대 "없어야 할 것이 있음"

구분해서 재는 장치는 이미 표준이다.

| 무엇을 재는가 | 지표 |
| --- | --- |
| 있어야 할 것이 없음 | completeness, recall |
| 없어야 할 것이 있음 | accuracy, precision |

문제는 지표가 없는 것이 아니라 **후자가 앞 단계의 필터로 이미 무력화된다는 것이다.**

이 지적을 명시적으로 한 문헌이 있다. Sakuma, Okutomi, "Stochastic Signed Distance Processes" (Institute of Science Tokyo, arXiv 2606.20856v2, 2026-06). **본문 확인 완료 (2026-08-09).**

- 비판 원문: "This process underestimates the penalty for spurious surfaces, making it difficult to evaluate a trade-off between false positives and false negatives."
- 대안 원문: "We additionally evaluate the reconstructed mesh filtered with the union of viewing frustums instead of the visual hull."
- 절두체 기준을 unmasked, visual hull 기준을 masked 규약이라 부르고, **DTU와 MobileBrick 전 실험에서 두 규약의 Chamfer를 별도 열로 나란히 보고한다** (Table 2와 3). 두 규약 병기가 실제로 실행 가능한 보고 형식임을 보여주는 선례다.

DTU 표준 평가의 내부 구조도 확인했다 (DTUeval-python 코드 직접 확인, 2026-08-09).

- accuracy: 재구성 점 중 **ObsMask**(관측 가능 영역을 표시한 3D 격자) 안에 있는 것만 남겨 GT까지의 거리를 잰다
- completeness: GT 점 중 **바닥 평면 위**의 것만 남기되 ObsMask는 적용하지 않고 재구성까지의 거리를 잰다
- 즉 필터가 비대칭이다. **관측 영역 밖의 허위 기하는 accuracy에 아예 들어오지 않는다.** 위 비판이 겨냥하는 구조가 표준 구현에 그대로 있다.

## 4. 본 연구에 걸리는 지점

- **accuracy 계열 포기 결정은 재검토할 가치가 있다.** 포기 사유는 절단 문제였는데, 절단 자체가 관행의 산물임이 확인되었다. unmasked 규약(절두체 합집합)을 쓰면 크롭으로 지워지던 영역의 허위 기하를 되살려 잴 수 있다
- Spires가 Nerfacto에 대해 하늘 제거를 요구했다는 사실은 인용 가치가 크다. **어떤 벤치마크도 그곳을 측정하지 않는다는 우리 명제의 직접 증거**가 된다. 다만 그 문장은 하늘에 한정된 것이며 원거리 외벽 전반으로 확대 해석하면 과장이 된다
- 판정이 필요한 것은 자체 지표를 어디에 놓느냐다. 밴드별 completeness는 "있어야 할 것이 없음"만 잰다. "없어야 할 것이 있음"까지 재려면 절두체 기준 accuracy를 추가해야 하고, 그러면 지표가 둘로 늘어난다

## 5. 남긴 것

- ~~DTU ObsMask~~ **해소.** 3절에 반영했다 (accuracy만 걸러지는 비대칭 구조)
- ~~arXiv 2606.20856 본문~~ **해소.** 3절에 verbatim 인용과 보고 형식을 반영했다
- T&T 공식 crop 파일이 어떤 기준으로 만들어졌는지 원전 확인하지 않았다
- Spires 논문의 필터 문장은 arXiv v2 본문에서 읽었고 IJRR 게재본과 대조하지 않았다
- 하늘 점이 GT 점군에 찍히는 경우의 처리는 사례를 찾지 못했다. TLS와 레이저 스캔은 하늘에서 반사를 얻지 못하므로 애초에 점이 생기지 않는다는 것이 일반적 이해이나 원전으로 확인하지 않았다
