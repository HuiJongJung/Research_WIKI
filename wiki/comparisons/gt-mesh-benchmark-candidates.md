---
type: "comparison"
slug: "gt-mesh-benchmark-candidates"
title: "GT mesh 제공 데이터셋 후보 대조표"
status: "draft"
modified_at: "2026-08-05T12:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://roboimagedata.compute.dtu.dk/?page_id=36"
  - "https://arxiv.org/abs/2410.21739"
  - "https://arxiv.org/abs/2303.01932"
  - "https://arxiv.org/abs/1906.05797"
  - "https://arxiv.org/abs/2311.10091"
  - "https://arxiv.org/abs/2301.07525"
  - "https://arxiv.org/abs/2603.17358"
tags:
  - "dataset"
  - "ground-truth-mesh"
  - "evaluation"
  - "survey-q01"
---

# GT mesh 제공 데이터셋 후보 대조표

> SURVEY_BRIEF Q-01, 등록부 C5·A2의 재료. 개입 증명 무대를 통제된 곳으로 옮기는 경우의 후보를 모았다.
> 조사일 2026-08-05. 라이선스는 원전 페이지에서 확인한 것만 적고 나머지는 `[미검증]`으로 둔다.

## 1. 표

| 이름 | 규모 | GT 형식 | 라이선스 | GS 계열 사용 사례 |
| --- | --- | --- | --- | --- |
| DTU MVS 2014 | 124 씬(평가 80, 회전 변형 44), 씬당 49 또는 64장, 1600x1200, 조명 7종 | **구조광 점군**. mesh는 "Poisson surface reconstruction of the MVS point clouds"로 제공되며 이는 GT가 아니라 MVS 결과의 후처리다 | 공식 페이지는 "freely available"이라고만 적고 논문 인용을 요구한다. 명시적 라이선스 문구 없음 | 2DGS, GOF, MILo 등 표면 재구성 논문의 사실상 표준 (Chamfer 보고) |
| Tanks and Temples | 중간 8씬, 학습 7씬 | 레이저 스캔 **점군** | [미검증] | 표준 (F1 보고). 본 연구도 Ignatius 사용 |
| MobileBrick (CVPR 2023) | 153 모델, 시퀀스 135 학습 / 18 평가 | **정확 mesh**. LEGO 브릭의 기지 기하로 GT를 구성하며 고급 스캐너를 쓰지 않는다 | [미검증] | [미검증] |
| Replica | 실내 18 씬 | **dense mesh** + HDR 텍스처 + 인스턴스/의미 라벨. 미관측 영역을 잘라낸 평가용 GT mesh가 별도 배포됨 | 연구·교육 한정 (Replica Research License) | GS SLAM 계열의 표준 무대 |
| Shelly (Adaptive Shells, SIGGRAPH Asia 2023) | object 6씬(KHADY, Pug, KITTY, HORSE, FERNVASE, WOOLLY), 씬당 학습 128 / 평가 32 뷰 | 합성 **GT mesh**. 머리카락, 털, 잎처럼 표면 기반 기법이 어려워하는 형상 | [미검증] | Gaussian Frosting이 SuGaR와 비교하며 사용 |
| SS3DM (NeurIPS 2024 D&B) | CARLA 8개 타운에서 28 시퀀스, 데이터 프레임 13,535 | **삼각 mesh**. 도로면과 가로등 기둥, 주차 차량, 버스 정류장 같은 세밀 구조 포함. 법선까지 제공 | CC BY 4.0 | SuGaR가 벤치마크 대상에 포함됨 |
| OmniObject3D (CVPR 2023) | 6,000개 물체, 190 카테고리 | **textured mesh** + 점군 + 멀티뷰 렌더 + 실촬영 영상 | [미검증] | GaussianObject의 평가 무대 |
| Asset Inspection Benchmark (arXiv 2603.17358, 2026-03) | 합성 3씬 (office 4,763 프레임, crane 642, bridge 1,074), 1920x1080 | **GT mesh + GT depth + 포즈**. office는 동일 기하에 오염도 4단계 | 에셋은 BlenderKit RF/CC0 또는 BSD 3-Clause | **GS 계열은 평가되지 않았다.** COLMAP, GLOMAP, VGGT, π³, Depth Anything 3만 비교 |

## 2. 해골 씬의 정체

**DTU scan65가 해골이다.** 다만 GT는 mesh가 아니라 구조광 점군이다.

- 근거는 2차 자료 두 건이다. 공개 설정 파일이 scan65를 `skull`로 명명하고, 공개 데이터 사본이 `dtu-scan65`를 해골 재구성에 쓴다. **DTU 원전에서 물체 이름표를 직접 확인하지는 못했다.** `[부분 검증]`
- DTU를 통제 무대로 쓸 경우 GT는 점군이며, mesh 대 mesh 비교를 하려면 GT를 별도로 mesh화해야 한다. 그 mesh화가 평가에 개입한다는 점을 명시해야 한다.

## 3. 구멍과 가늘고 긴 구조물을 표적으로 삼은 선행

직접 표적으로 삼은 것은 **가늘고 긴 구조물 쪽만 찾았다.** 구멍 있는 물체를 표적으로 명시한 재구성 연구는 **찾지 못했다.**

- Curve-aware Gaussian Splatting (ICCV 2025): 3D 매개변수 곡선 재구성. 전선과 기둥 같은 선형 구조가 대상. `[제목 수준 확인, 본문 미독]`
- EdgeGaussians (WACV 2025): Gaussian splatting으로 3D edge를 매핑. `[제목 수준 확인, 본문 미독]`
- SBP-Net (arXiv 2606.04251): 가늘고 긴 구조 재구성 전용. 산업용 배관 합성 데이터 PipeForge3D(mesh와 점군 형식, 모델 50개)와 폐동맥 CT(PARSE 2022), 실측 점군을 씀. 지표는 Chamfer, Hausdorff, **연결 성분 수(Connected Components)**
- Asset Inspection Benchmark: crane 씬의 트러스 구조에서 기존 기법이 부분을 뭉개는 현상을 보고한다

연결 성분 수는 "끊어졌는가"를 재는 지표이므로 C4의 mesh 자체 품질 지표 후보로 옮길 만하다. Q-08과 연결된다.

## 4. 대상 선별 복원의 선례

**SparseGS는 SAM을 쓰지 않는다.** v2와 v4 본문 어디에도 SAM, Segment Anything, 분할, 마스크 기반 대상 선별이 없다. SparseGS의 구성은 깊이 prior(Marigold 기반 patch Pearson 상관), mode-selection과 softmax-scaling 깊이 렌더링, dip test 기반 floater 제거, 미관측 시점 정칙화(SDS + 깊이 워핑)다. 평가는 Mip-NeRF360, LLFF, DTU.

대상 선별의 선례는 **GaussianObject** (SIGGRAPH Asia 2024, TOG)다.

- 마스크가 없는 데이터셋에는 SA3D로 대상 물체 마스크를 얻는다. SAM 자체가 아니라 3D 확장판이다
- 마스크의 용도는 대상 선별이 아니라 **visual hull 구성을 통한 초기화**다. 뷰 절두체와 마스크의 교집합 안에서 rejection sampling으로 점을 뿌린다
- 평가는 LPIPS, PSNR, SSIM만이며 **mesh나 표면 정확도는 보고하지 않는다**

## 5. 남긴 것

- MobileBrick, Shelly, OmniObject3D, Tanks and Temples의 라이선스 원문 미확인
- Curve-aware GS와 EdgeGaussians는 본문을 읽지 않았다. 정확한 arXiv 번호도 미확보
- NeRF-Synthetic(Blender 8씬)이 GT mesh를 배포하는지 확인하지 않았다. 배포물은 이미지와 포즈뿐인 것으로 알려져 있으나 원전 확인 전이다
