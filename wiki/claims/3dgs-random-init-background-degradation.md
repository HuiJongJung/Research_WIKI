---
type: "claim"
slug: "3dgs-random-init-background-degradation"
title: "3DGS 원논문은 무작위 초기화의 저하가 주로 배경에서 일어난다고 적었다"
status: "reviewed"
modified_at: "2026-08-05T13:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "high"
sources:
  - "https://arxiv.org/abs/2308.04079"
  - "https://ar5iv.labs.arxiv.org/html/2308.04079"
tags:
  - "3dgs"
  - "initialization"
  - "ablation"
  - "survey-q03"
  - "verified"
---

# 3DGS 원논문은 무작위 초기화의 저하가 주로 배경에서 일어난다고 적었다

> SURVEY_BRIEF Q-03, 등록부 B6의 미검증 항목. 확인 완료이며 **인용 가능**하다.
> 확인일 2026-08-05. 원전은 Kerbl, Kopanas, Leimkühler, Drettakis, "3D Gaussian Splatting for Real-Time Radiance Field Rendering", ACM TOG 42(4), SIGGRAPH 2023, arXiv 2308.04079.

## 1. 확인된 사실 (게재본 PDF 대조 완료)

**7.3절 Ablations의 "Initialization from SfM" 항목**에 다음 내용이 있다. ACM TOG 게재본 p.9에서 직접 확인했다.

- SfM 점 없이도 완전한 실패는 피한다고 먼저 적는다
- 이어서 저하가 어디서 일어나는지를 명시한다. 원문은 "Instead, it degrades mainly in the background, see Fig. 7."이다
- 학습 뷰가 잘 덮지 못한 영역에 관한 문장은 게재본 기준으로 "appears to have more **artifacts** that cannot be removed by optimization"이다. **"floaters"가 아니라 "artifacts"다.** ar5iv 변환본이 floaters로 전달했으나 게재본과 다르므로 인용은 artifacts로 한다
- 대조 조건은 카메라 경계 상자를 3배로 키운 정육면체 안의 균일 표집이다
- **합성 NeRF 데이터셋에서는 이 저하가 나타나지 않는다.** 게재본 원문은 배경이 없고 입력 카메라로 잘 제약되기 때문이라고 적는다

마지막 항목이 예상 밖의 수확이다. 저하가 배경에서 일어난다는 진술이, 배경이 없는 데이터셋에서 저하가 사라진다는 대조로 원논문 안에서 한 번 더 확인된다.

같은 페이지에서 두 가지를 추가로 확보했다.

- **Densification ablation에도 배경이 나온다.** 큰 Gaussian의 split이 "good reconstruction of the background"에 중요하다고 적는다 (7.3절 Densification, Fig. 8)
- **7.4 Limitations 첫 문장이 관측 부족 영역의 artifacts를 자인한다.** "In regions where the scene is not well observed we have artifacts"이며 Mip-NeRF360도 같은 곳에서 어렵다고 덧붙인다 (Fig. 11)

## 2. 정량 수치

**Table 3 "PSNR score for ablation runs."** 열은 씬과 반복 수(5K, 30K)의 조합이다. 표의 입력은 고해상도 원본을 직접 다운샘플한 것이며 사전 축소된 Mip-NeRF360 입력과 다르다는 단서가 캡션에 붙어 있다.

| 조건 | Truck-5K | Garden-5K | Bicycle-5K | Truck-30K | Garden-30K | Bicycle-30K | 평균-5K | 평균-30K |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Random Init | 16.75 | 20.90 | 19.86 | 18.02 | 22.19 | 21.05 | 19.17 | 20.42 |
| Full | 22.71 | 25.82 | 23.18 | 24.81 | 27.70 | 25.65 | 23.90 | 26.05 |

30K 기준 평균 격차는 5.63 dB다.

시각 근거는 **Fig. 7**이며 캡션은 "Initialization with SfM points helps."다. 위가 무작위 점군, 아래가 SfM 점 초기화이고, 씬은 Mip-NeRF360 **Garden**이다(게재본 p.10 그림 확인). 무작위 초기화 쪽에서 배경 수풀이 뭉개지는 것이 보인다.

## 3. 본 연구와의 연결

- B6의 미검증 표시를 해제할 수 있다. **원논문이 배경 영역을 명시했다는 기억은 사실이었다.**
- 다만 인용할 때 범위를 지킬 것. 원논문이 말한 것은 **초기화 점군의 유무**가 배경 품질을 가른다는 것이다. 관측 각도나 삼각측량각을 언급한 것이 아니다. "원논문도 배경이 어렵다고 했다"까지가 인용 가능 범위이며 "원논문도 각도가 문제라고 했다"는 과장이다.
- 지표가 PSNR이라는 점도 그대로 둔다. 표면 품질 지표가 아니다.

## 4. 검증 상태

2026-08-09 보완 조사에서 게재본 PDF(ACM TOG 42(4), 저자 배포판)의 p.9 Table 3과 7.3절 원문, p.10 Fig. 7을 직접 대조했다. Table 3 수치는 ar5iv 변환본과 완전히 일치한다. 유일한 차이는 위 1절에 적은 "floaters 대 artifacts" 표현이며 게재본 기준 artifacts로 인용한다. 남은 미검증 없음.
