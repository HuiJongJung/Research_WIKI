---
type: "comparison"
slug: "gs-surface-recon-sota-2026"
title: "GS 표면 재구성 SOTA 역추적, 2026-08 기준"
status: "draft"
modified_at: "2026-08-09T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "raw/papers/Revisiting Photometric Ambiguity for Accurate Gaussian-Splatting.pdf"
  - "raw/papers/CoMe - Confidence-Based Mesh Extraction from 3D Gaussians.pdf"
  - "https://arxiv.org/abs/2506.24096"
  - "https://arxiv.org/abs/2509.18090"
  - "https://arxiv.org/abs/2604.07337"
  - "https://arxiv.org/abs/2411.19454"
tags:
  - "sota-survey"
  - "benchmark"
  - "survey-q10"
  - "c7"
---

# GS 표면 재구성 SOTA 역추적, 2026-08 기준

> SURVEY_BRIEF Q-10. SOTA의 조작적 정의는 이 조사에 한정한다: 표준 벤치마크별(DTU mean Chamfer, T&T mean F1) 최고 보고 수치. "서면 SOTA"와 "실행 가능(코드 공개) SOTA"를 구분한다.
> 조사일 2026-08-09. **절대값 혼합 금지**: 같은 기법이라도 수치는 보고한 논문의 표 단위로만 유효하다. 아래 표는 출처를 셀마다 붙인다.

## 1. 누가 누구를 이긴다고 주장하는가 (역추적 그래프)

원문 표에서 확인한 주장 관계만 적는다. 화살표는 "A의 표에서 A가 B를 이김"이다.

- **AmbiSuR → GeoSVR, PGSR, MILo, GOF, 2DGS, GS2Mesh, VCR-GauS** (AmbiSuR Table 1·2, 로컬 PDF p.6~7 확인). DTU 0.46 대 GeoSVR 0.47, T&T 0.589 대 GeoSVR 0.56. "AmbiSuRs exhibit robust reconstruction with the highest quality on the Chamfer distance" (Table 1 캡션)
- **CoMe → MILo, PGSR(bounded), GOF, SOF, QGS** (CoMe Table, 위키 소스 페이지에 상세): T&T unbounded F1 0.521 대 MILo 0.485, 18분 대 60분. 단 CoMe 자신이 DTU에서는 PGSR(0.55)이 자기(0.65)보다 낫다고 자인하고, prior 의존 비교표(Table 6)에서 GeoSVR 0.546이 자기보다 높다고 적는다
- **MILo → RaDe-GS, GOF, 2DGS, SuGaR, VCR-GauS** (MILo Table 2·3): DTU 0.68로 RaDe-GS와 동률, T&T 0.49로 명시 기반 기법 중 최고 주장 ("the best F1 score among explicit representations")
- **Gaussian Wrapping → 전체 씬 추출 기법들** (자체 프로토콜에서): "sets a new state of the art under this unbiased protocol among the full scene extraction methods". 단 **표준 T&T 프로토콜이 아니라 자체 uniform sampling(0.48)과 virtual scanning(0.53) 프로토콜**이며, virtual scanning에서는 GGGS와 동급이라고 적는다
- **GeoSVR** (NeurIPS 2025 Spotlight): 자기 표는 미확인이나 **제3자 두 곳에서 교차 확인**된다. AmbiSuR 표에서 DTU 0.47·T&T 0.56, CoMe 표에서 T&T 0.546(42분, 공정화 평가 시 0.525로 하락)

**StableGS는 표면 재구성 논문으로 찾지 못했다.** 검색 결과는 NVS 계열 동명 논문뿐이며 위 다섯 논문의 비교표에도 없다. 대신 비교표에서 발견된 미확인 기법: **GeoSVR**(추적 완료, 위), **GS2Mesh**(DTU 0.68, AmbiSuR 표), **VCR-GauS**, **QGS**, **SOF**(CoMe의 base), **GGGS**(GW가 언급, 미추적), **GeoSVR 외 implicit 계열**(Neuralangelo 0.61 등, 학습 수십 시간이라 C7 부적합).

## 2. 산출 표

DTU는 mean Chamfer(mm, ↓), T&T는 mean F1(↑). 셀의 괄호는 수치 출처다. A1 = AmbiSuR Table 1, A2 = AmbiSuR Table 2, M2/M3 = MILo Table 2/3, C = CoMe(위키 소스 페이지 경유, 원 표 p.10·30).

| 기법 | 발표처·연도 | DTU mean CD | T&T mean F1 | 코드 | 계열 |
| --- | --- | --- | --- | --- | --- |
| **AmbiSuR** | ICML 2026 | **0.46** (A1) | **0.589** (A2) | **공개 확인** (Fictionarry/AmbiSuR, 실코드 실재, PGSR·gaussian-splatting 기반, Depth Anything 3 의존) | GS, PGSR 개량 + SH ambiguity indicator |
| AmbiSuR-Mono | 〃 | 0.46 (A1) | 0.576 (A2) | 〃 (같은 저장소) | 〃 (단안 깊이판) |
| GeoSVR | NeurIPS 2025 Spotlight | 0.47 (A1) | 0.56 (A2) / 0.546, 공정화 0.525 (C) | **공개** (Fictionarry/GeoSVR) | **sparse voxel (GS 아님)** |
| PGSR | TVCG 2024 | 0.52 (A1) / 0.55 (C) / 0.47 (자기 repo 2024-07 갱신 주장, 논문 표 아님) | 0.52 (A2) / 0.496 bounded (C) | 공개 (zju3dv/PGSR) | GS, 평면 기반 + TSDF |
| GausSurf | arXiv 2411.19454 | 0.52 (자기 논문, 검색 요약 경유 `[부분 검증]`) | 미확인 | **coming soon** (저장소만 존재) | GS + patch-match MVS 반복 |
| CoMe | ECCV 2026 | 0.65 (C, unbounded 계열 최저 자평) | 0.521 (C, 18분) | 공개 (r4dl/CoMe) | GS, 학습 중 confidence + 추출 |
| MILo | SIGGRAPH Asia 2025 | 0.68 (M3 = A1 **교차 일치**) | 0.49 (M2) / MILo⁺ 0.49 (A2) / 0.485 (C) | 공개 (Anttwo/MILo) | GS, in-loop |
| RaDe-GS | 2024 | 0.68 (M3) `[자기 표 미확인]` | 0.40 (M2) | 공개 | GS, rasterized depth |
| GS2Mesh | ECCV 2024 | 0.68 (A1) | 미확인 | 공개 (yanivw12/gs2mesh) | GS + stereo 깊이 |
| Gaussian Wrapping | arXiv 2604.07337 | 부록 (미확보) | 자체 프로토콜 0.48/0.53, **표준 프로토콜 수치 없음** | 공개 (diego1401/GaussianWrapping) | GS, wrapping shell |
| GVGS | arXiv 2601.20331 (2026-04 v3) | 0.49 (자기 표) | 0.53 (자기 표, 60k iter) | 공개 (GVGScode/GVGS) | GS, 가시성 인지 다중 뷰 기하 |
| GOF | SIGGRAPH Asia 2024 | 0.74 (A1=M3) | 0.46 (A2=M2) / 0.453 (C) | 공개 | GS, opacity field |
| 2DGS | SIGGRAPH 2024 | 0.80 (A1=M3) | 0.30 (M2) | 공개 | GS, surfel + TSDF |

GVGS 주의: "establishes a new state-of-the-art with a mean Chamfer Distance of 0.49 mm"를 주장하나 **비교표에 GeoSVR(0.47)와 AmbiSuR(0.46)가 없다.** 브리프가 경고한 "자기 표에서만 성립하는 SOTA 주장"의 실사례다.

프로토콜 주의 세 건.

1. PGSR의 DTU 수치가 세 갈래다(0.47 자기 repo, 0.52 AmbiSuR, 0.55 CoMe). repo 주장은 2024-07 코드 조정 후 값이라 논문 표가 아니며, 제3자 두 곳은 0.52·0.55로 갈린다
2. CoMe는 bounded/unbounded 구분을 축으로 쓴다. CoMe의 T&T 0.521은 unbounded 계열 비교이며 PGSR bounded 0.496과 같은 표에 있으나 전처리가 다르다
3. GW의 F1은 자체 프로토콜 두 종이라 이 표의 다른 F1과 **직접 비교 불가**

## 3. 특별 확인 사항 (브리프 지정)

- **AmbiSuR 코드 공개**: 확인. 프로젝트 페이지가 ICML 2026 표기와 함께 Fictionarry/AmbiSuR를 가리키고, 저장소에 train.py, mesh_extract/, multi_view_priors/ 등 실제 코드가 있다. **"실행 가능 SOTA" 1순위 후보 성립.** PGSR 기반이므로 C7의 PGSR 제외 판정(계열 중복)은 재검토가 필요하다 — AmbiSuR를 넣으면 PGSR 계열이 자동으로 포함되는 셈이다. **판단 필요**
- **CoMe 코드**: 공개 (r4dl/CoMe, ECCV 2026). T&T 0.521·18분. 우리 위협표의 경쟁 기법이면서 C7 후보도 될 수 있는 이중 지위다
- **MILo의 서면 위치**: DTU 0.68은 서면 SOTA(0.46)와 0.22mm 격차, T&T 0.49 대 0.589. **우리 baseline은 2026-08 기준 서면 SOTA가 아니다.** MILo의 강점 주장은 정확도가 아니라 mesh 간결성(정점 수)과 in-loop 구조다. C7 서술에서 "SOTA 기법"이 아니라 "SOTA급 대표 기법"으로 칭하는 것이 안전하다
- **비교표의 미확인 기법**: GeoSVR는 추적 완료(위 표). GGGS(GW 언급), VCR-GauS, QGS, SOF는 미추적으로 남긴다

## 4. 결론

### ⓐ 서면 SOTA (2026-08)

- DTU: **AmbiSuR 0.46** (자기 표이나 baseline 수치들이 MILo 표와 교차 일치해 표 자체의 신뢰성은 확보. 직전 SOTA GeoSVR 0.47은 제3자 표에서 확인)
- T&T: **AmbiSuR 0.589** (동일 조건)

### ⓑ 코드 공개(실행 가능) SOTA

- DTU·T&T 모두 **AmbiSuR** (코드 실재 확인). 차순위 GeoSVR도 공개이나 GS 계열이 아니라 sparse voxel이다

### ⓒ C7 목록 수정 제안 (채택은 판단 필요)

| 조치 | 대상 | 근거 |
| --- | --- | --- |
| **추가** | AmbiSuR | 실행 가능 SOTA. 단 PGSR 기반이라 기존 "PGSR 제외(계열 중복)" 판정과 충돌 — PGSR 자리를 AmbiSuR가 대체하는 형태로 해소 가능 |
| 추가 검토 | GeoSVR | 서면 2위·코드 공개. 단 **GS가 아니라 voxel**이므로 "GS 표면 재구성 SOTA" 스코프에 넣을지가 먼저 결정될 문제 |
| 추가 검토 | CoMe | 속도 최상(18분)·코드 공개. 경쟁 기법(위협표)과 C7 측정 대상의 이중 지위를 어떻게 다룰지 |
| 유지 | 2DGS, GOF 또는 RaDe-GS, MILo | 계열 대표성. 단 서면상 SOTA와 0.2~0.34 격차가 있음을 C7 서술에 명시 |
| 유지 (유보 강화) | Gaussian Wrapping | 표준 프로토콜 수치가 없어 "SOTA" 칭호의 근거가 자체 프로토콜뿐. 채택 시 자체 실행으로 표준 수치를 만들어야 함 |

## 5. 남긴 것

- GeoSVR·RaDe-GS·GausSurf의 **자기 논문 표**를 열지 않았다 (GeoSVR·RaDe-GS는 제3자 표 수치만, GausSurf는 검색 요약 경유)
- GW의 DTU 부록 수치 미확보
- GGGS는 최종 검토에서도 독립 논문으로 특정하지 못했다. GW 저장소가 코드베이스로 참조할 뿐 검색으로 실체가 잡히지 않는다. VCR-GauS, QGS, SOF 미추적
- 최종 검토(08-09)에서 추가 확인: GVGS(위 표, 0.49/0.53, 코드 공개)와 Direct SDF Learning(arXiv 2509.07493, DTU 0.50 주장) 모두 AmbiSuR 아래. AmbiSuR를 이기는 주장을 확인한 논문 없음
- GausSurf 코드 상태는 "coming soon"을 2026-08-09 검색 요약으로 확인했으며 저장소 직접 방문은 하지 않았다
- AmbiSuR 저장소의 라이선스 종류 미확인 (LICENSE.md 존재만 확인)
