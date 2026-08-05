---
type: "question"
slug: "learned-frontend-confidence-usage"
title: "학습 프론트엔드 confidence는 GS 파이프라인에서 어디에 쓰이는가"
status: "draft"
modified_at: "2026-08-05T14:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://arxiv.org/abs/2403.20309"
  - "https://arxiv.org/abs/2509.25191"
  - "https://arxiv.org/abs/2502.14684"
  - "https://arxiv.org/abs/2512.05131"
tags:
  - "confidence"
  - "dust3r"
  - "vggt"
  - "threat-assessment"
  - "survey-q04"
---

# 학습 프론트엔드 confidence는 GS 파이프라인에서 어디에 쓰이는가

> SURVEY_BRIEF Q-04, 등록부 E3. 분류 규칙은 브리프가 정한 대로다. **점 필터링과 pruning은 위협이 아니고, supervision 배분에 쓴 경우만 위협이다.**
> 조사일 2026-08-05.

## 1. 분류표

| 사례 | confidence의 출처 | 쓰이는 지점 | 3D로 올렸는가 | 표적 | 위협 분류 |
| --- | --- | --- | --- | --- | --- |
| InstantSplat (arXiv 2403.20309) | DUSt3R per-pixel confidence | **초기화 시 적응적 다운샘플링.** 복셀별 평균 confidence로 유지 점 수를 정함 | **예.** k³ 복셀로 공간을 나누고 복셀별 평균 confidence를 계산 | NVS 지표(PSNR/SSIM/LPIPS)와 포즈 지표(ATE/RPE)만 보고 | **비위협.** 점 유지량 결정이며 감독 배분이 아니다 |
| VGGT-X (arXiv 2509.25191) | VGGT depth confidence | **쓰지 않기로 했다.** 대신 대응점 가중치로 초기화 점을 고름 | 아니오 | NVS | **비위협.** 오히려 반례다 |
| CDGS (arXiv 2502.14684) | 단안 깊이의 다중 단서 + 희소 SfM 깊이 | **학습 중 깊이 감독의 화소별 가중과 전역 가중** | 아니오. 이미지 공간 | T&T에서 F-score와 M3C2 거리까지 보고 | **위협 후보.** 아래 3절 |
| AREA3D (arXiv 2512.05131) | 피드포워드 모델의 per-pixel depth confidence | **복셀 격자 위의 3D 불확실도 field.** 뷰별 점수를 프레임에 걸쳐 누적 | **예** | **능동 촬영 시점 선택** | 용도가 다름. 아래 4절 |

## 2. 열거된 사용처

- **초기화 시 점 필터링과 다운샘플링**이 가장 흔하다. DUSt3R 계열의 점군은 고 confidence 영역에서만 정확하다는 인식이 공유되어 있다
- **손대지 않는 경우도 있다.** VGGT-X는 VGGT의 깊이 confidence를 대리 지표로 쓰는 것이 최적이 아니라고 명시하고 대응점 기반 가중으로 대체했다
- **감독 배분에 쓴 경우는 CDGS 한 건을 확인했다.** 다만 그 confidence는 학습 프론트엔드의 출력이 아니다

## 3. CDGS를 어떻게 볼 것인가

Zhang, Wysocki, Urban, Jutzi, "CDGS: Confidence-Aware Depth Regularization for 3D Gaussian Splatting" (arXiv 2502.14684, 2025-02).

- confidence는 **학습된 프론트엔드의 확신이 아니라 손으로 설계한 이미지 단서 셋의 결합이다.** Canny 경계 기반, Laplacian 질감 기반, 깊이 공간 기울기 기반 셋을 고정 가중(0.2 / 0.5 / 0.3)으로 합친다
- **학습 전에 계산한다.** 이미지당 약 1.5초의 전처리다
- 쓰이는 곳은 깊이 loss의 **화소별 가중**이며, 여기에 정렬 품질에 따른 전역 가중이 지수 감쇠 형태로 곱해진다. 정렬이 좋을수록 깊이 감독을 강하게 준다
- 평가 무대는 **Tanks and Temples 6씬**이고 2D 지표 외에 F-score와 M3C2 점군 거리를 보고한다. 5/6 씬에서 최저 RMSE, 평균 0.120m 대 3DGS 0.124m

본 연구와의 관계.

- **겹치는 것**: 학습 전에 계산한 confidence로 깊이 감독의 세기를 화소마다 다르게 준다는 구조 자체
- **다른 것**: CDGS의 confidence는 이미지의 겉모습(경계, 질감)에서 나오며 뷰마다 다시 계산된다. 재는 대상은 **prior 자체의 신뢰도**다. 본 연구의 판별값은 촬영 기하에서 나오고 뷰에 독립이며, 재는 대상은 **그 자리를 사진으로 결정할 수 있는가**다
- **경계가 되는 질문**: 질감이 약한 곳의 confidence를 낮추는 것과 각이 좁은 곳의 confidence를 낮추는 것이 실제로 다른 영역을 지목하는가. 이것은 조사로 닫히지 않고 C6의 동일 기준 비교표가 답할 문제다. **판단 필요.**

## 4. 복셀 격자로 올린 사례는 이미 있다

AREA3D (arXiv 2512.05131, 2025-11 제출, 2026-07 개정)는 피드포워드 모델의 per-pixel depth confidence를 예측 정밀도로 해석해 [0,1]로 정규화하고, 깊이와 함께 **공용 복셀 격자에 splat한 뒤 프레임에 걸쳐 누적해 기하 불확실도 field를 만든다.** 의미 불확실도 stream과 합쳐 단일 3D 불확실도 field를 이룬다.

**용도는 능동 촬영 시점 선택이다.** 감독 배분이 아니다. 같은 계열로 Active3D(arXiv 2511.20050)가 깊이·측광 불확실도로 불확실도 복셀 맵을 만든다.

이 사실의 무게는 판정 사항이다. 지적할 점만 적는다.

- "per-pixel confidence를 3D field로 올린다"는 구성 자체는 이미 존재하며 새롭지 않다
- 남는 차이는 두 가지다. field에 들어가는 양이 **학습된 예측 확신이 아니라 촬영 기하의 물리량**이라는 것, 그리고 field의 출력이 **다음 촬영 위치가 아니라 감독의 배분**이라는 것
- 능동 촬영 계열은 "촬영을 더 할 수 있다"를 전제하지만 본 연구는 고정 캡처를 전제한다. 전제가 다르면 같은 field라도 답해야 할 질문이 다르다

## 5. 남긴 것

- Splatt3R, MASt3R-GS, DroneSplat, LM-Gaussian 등 DUSt3R 계열 GS 논문 다수는 본문을 읽지 않았다. `[미검증]` 감독 배분에 쓴 사례가 더 있을 수 있다
- InstantSplat 공개 페이지는 "point-wise uncertainty로 점별 기울기를 동적으로 조정하는 confidence-aware optimization"을 명시하지만 **arXiv v2 본문에서는 확인되지 않았다.** 확장판에만 있을 가능성이 있으므로 최신판 본문 확인이 필요하다. 사실이면 위협 분류가 바뀐다
- AREA3D의 field 구성은 검색 요약과 초록으로 확인했고 본문 수식은 보지 않았다
- mesh 품질을 표적으로 한 학습 프론트엔드 confidence 사례는 **찾지 못했다.** CDGS가 점군 거리(M3C2)까지 가는 것이 가장 멀리 간 경우다
