---
type: "comparison"
slug: "controlled-stage-sota-toolkit"
title: "통제 무대 SOTA 측정의 준비물, 모델 코드와 Blender 자산"
status: "draft"
modified_at: "2026-08-09T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://github.com/hbb1/2d-gaussian-splatting"
  - "https://github.com/autonomousvision/gaussian-opacity-fields"
  - "https://github.com/HKUST-SAIL/RaDe-GS"
  - "https://github.com/zju3dv/PGSR"
  - "https://github.com/diego1401/GaussianWrapping"
  - "https://arxiv.org/abs/2505.20126"
  - "https://polyhaven.com/license"
tags:
  - "sota-survey"
  - "reproduction"
  - "blender"
  - "survey-q09"
---

# 통제 무대 SOTA 측정의 준비물, 모델 코드와 Blender 자산

> SURVEY_BRIEF Q-09, 등록부 C7. 물체 난이도 × 관측 호 폭 격자에서 SOTA 표면 재구성 현황을 측정하는 실험의 준비물이다.
> 조사일 2026-08-09. README 수준의 확인이며 실제 빌드는 실험 세션의 몫이다.

## 1. 후보 모델의 코드와 재현 조건

전부 공식 저장소가 있고 mesh 추출 스크립트를 포함한다. **Gaussian Wrapping도 코드가 공개되어 있다.**

| 모델 | 계열 | 공식 저장소 | mesh 추출 | 환경 | 평가 스크립트 | 알려진 이슈·팁 |
| --- | --- | --- | --- | --- | --- | --- |
| 2DGS (SIGGRAPH 2024) | 2D surfel + TSDF | hbb1/2d-gaussian-splatting | `render.py`, TSDF fusion. bounded는 `depth_trunc` 조정 필요, `--unbounded`는 공간 수축 + 적응 절단 | conda `environment.yml`, `diff-surfel-rasterization` 서브모듈 | DTU 전처리 데이터 3.5GB와 `scripts/dtu_eval.py` 제공 | 주점이 이미지 중심이 아니면 수렴 실패 가능. T&T 평가는 `open3d==0.10.0` 고정. 재구현이라 논문 수치와 약간 다름을 자인 |
| GOF (SIGGRAPH Asia 2024) | opacity field level set | autonomousvision/gaussian-opacity-fields | `extract_mesh.py`, Marching Tetrahedra (tetra-nerf + Kaolin 차용) | Python 3.8, CUDA 11.3, PyTorch 1.12.1. `tetra-triangulation`에 CMake·GMP·**CGAL** 필요 | `evaluate_dtu_mesh.py`, `full_eval.py` (DTUeval-python 기반) | 2024-06 속도 2배 커밋 이후 서브모듈 재설치 필요. 설치 함정은 [[milo-server-install-gotchas]]의 tetra 계열과 동종 |
| RaDe-GS (2024) | rasterized depth + Tetrahedra | HKUST-SAIL/RaDe-GS | `mesh_extract.py` 외 3종, Marching Tetrahedra | **Python 3.12, CUDA 13.0(cu130)** 기준으로 갱신됨. CGAL을 conda로 설치 | DTU `evaluate_dtu_mesh.py`, T&T `eval_tnt/run.py` | 서브모듈 5개 컴파일 (diff-gaussian-rasterization, warp-patch-ncc, simple-knn, fused-ssim, tetra_triangulation) |
| PGSR (TVCG 2024) | 평면 기반 + TSDF | zju3dv/PGSR | `render.py`, TSDF. `--max_depth`, `--voxel_size` | Python 3.8, CUDA 11.8. `diff-plane-rasterization` 서브모듈 | DTU·T&T 제공 (DTUeval-python 기반) | 약질감 씬은 `--max_abs_split_points 0`, floaters 있으면 `--use_depth_filter`. 2024-07 조정으로 DTU 0.47 |
| **Gaussian Wrapping** = "From Blobs to Spokes" (arXiv 2604.07337, 2026-04) | oriented Gaussian wrapping shell | **diego1401/GaussianWrapping (공개 확인)** | `train_and_extract_gw_*.py` 일체형 + Primal Adaptive Meshing (`primal_adaptive_meshing_extraction.py`, occupancy 등위면에 점을 내려 Delaunay 재구성) | Python 3.9, CUDA 11.8 또는 12.1, 자체 `install.py` | T&T 6씬(균일·가상 스캔 표집 두 방식), MipNeRF360, NeRF Synthetic. **DTU는 "coming soon"** | 학습·추출 코드 전부 공개. 자전거 살 수준의 가는 구조 복원을 주장 |
| MILo (SIGGRAPH Asia 2025) | in-loop 미분 가능 추출 | Anttwo/MILo | 학습 중 mesh 동시 추출 | 본 연구의 base. 설치 함정은 [[milo-server-install-gotchas]] | 제공 | 이미 확보됨 |

계열 비중복 관점의 정리: TSDF 융합(2DGS, PGSR), field level set(GOF, RaDe-GS), in-loop(MILo), wrapping shell(Gaussian Wrapping). 여섯이 네 계열을 덮는다.

### 1-1. 라이선스와 Blender 카메라 입력 지원 (2026-08-09 2차 보완)

| 모델 | 코드 라이선스 (원문 확인) | Blender `transforms.json` 직접 입력 |
| --- | --- | --- |
| 2DGS | Inria·MPII gaussian-splatting 라이선스. **비상업**, 연구·평가 한정 | **지원.** README가 "COLMAP or NeRF Synthetic dataset"을 명시 |
| GOF | 동일 Inria·MPII 라이선스 | **지원.** `dataset_readers.py`에 `readNerfSyntheticInfo`와 `"Blender"` 콜백 확인 |
| RaDe-GS | 동일 Inria·MPII 라이선스 | **지원.** 같은 로더에 더해 `"Objaverse"` 로더까지 있음 (물체 자산 직결) |
| PGSR | ZJU CAD&CG 커스텀. 교육·연구·비영리 한정, 상업은 별도 계약 | **미지원.** COLMAP 전용. 커스텀 데이터는 `convert.py`로 COLMAP화 |
| Gaussian Wrapping | 동일 Inria·MPII 라이선스 | **미지원.** "expects a COLMAP-formatted dataset". NeRF Synthetic도 COLMAP 형식으로 넣으며 전용 스크립트는 RaDe-GS 래스터라이저만 사용 |
| MILo | GS 라이선스 부분 적용의 이중 구조. 서브모듈별 라이선스 별도 | **미지원.** COLMAP 전용 명시 |

전 후보가 비상업 연구 라이선스이므로 연구 목적 사용에는 지장이 없다.

**통제 무대에서 중요한 함의 두 가지.**

1. **COLMAP 전용 3종(PGSR, GW, MILo)은 Blender GT 포즈를 COLMAP 텍스트 모델로 변환해 넣어야 한다.** 변환 자체는 기계적이나, points3D를 무엇으로 채우느냐가 통제 변인이 된다.
2. **Blender 로더의 초기화는 무작위 점군이다** (GOF·RaDe-GS 로더 확인: COLMAP 점이 없으면 random point cloud 생성). Q-03에서 확인한 대로 초기화 점군의 유무가 배경 품질을 가르므로, **모델 간 비교에서 초기화 경로(무작위 대 SfM 점)를 통일하지 않으면 측정이 오염된다.** 실험 설계에서 고정할 항목이다.

### 1-2. 추천안 (선정은 판단 필요)

기준은 브리프가 정한 세 가지다: mesh 추출 공식 지원(전원 충족), 재현 가능, 계열 비중복. MILo는 보유 기준점이므로 제외하고 3개를 고르면.

| 순위 | 추천 | 근거 | 유보 |
| --- | --- | --- | --- |
| 1 | **2DGS** | TSDF 계열 대표, Blender json 직접 지원, 사실상의 공통 baseline이라 독자가 수치를 가늠할 수 있음 | 주점 비중심 카메라 수렴 이슈 (Blender 렌더는 중심이라 무관) |
| 2 | **RaDe-GS** (대안 GOF) | field 계열, Blender json 지원 + Objaverse 로더, 환경이 최신(CUDA 13.0)이라 신규 GPU에서 오히려 수월 | CUDA 13.0이 나머지(11.3~12.1)와 공존 불가에 가까움. 환경을 하나로 묶으려면 GOF로 대체 (단 GOF는 CUDA 11.3 고정과 tetra 설치 함정) |
| 3 | **Gaussian Wrapping** | wrapping 계열 유일 코드 공개작, **가는 구조 복원이 방법의 주장 자체**라 우리 표적(파이프·크레인류)과 정합, 2026 SOTA 주장 | COLMAP 형식 변환 필요, DTU 평가 스크립트 부재, 2026-04 공개라 커뮤니티 검증 얕음 |
| 제외 | PGSR | TSDF 계열이 2DGS와 중복, Blender 미지원 | DTU 수치는 후보 중 최상위권이므로 실사 무대 추가 비교 시 재고 |
| 제외 | MeshSplat | feed-forward 일반화 계열이라 per-scene 최적화 비교와 성격이 다름 | 계열 확장을 원하면 별도 축으로 |

이 구성이면 MILo 포함 4계열이 전부 덮인다. **선정 판정과 환경 통일 전략(RaDe-GS 대 GOF)은 방향 논의·실험 세션으로 넘긴다.**

## 2. 2026년 신규 기법 중 코드 공개

- **MeshSplat** (AAAI 2026, HanzhiChang/MeshSplat): generalizable sparse-view. 이미지 쌍에서 cost volume으로 깊이를 예측해 픽셀 정렬 2DGS를 feed-forward로 출력. **계열이 다르다** (per-scene 최적화가 아니라 일반화 모델). 통제 무대의 per-scene 비교군에 넣을지는 판정 사항
- **Gaussian Wrapping** (2026-04): 위 표에 포함. 2026년 코드 공개 기법 중 per-scene 최적화 계열의 대표
- 참고로 GS2Mesh (ECCV 2024, yanivw12/gs2mesh)는 **MobileBrick 평가 코드까지 포함**한다. Q-01의 MobileBrick 후보와 연결되는 실무적 이점

## 3. Blender 자산과 합성 씬 제작 선례

### 자산

| 출처 | 라이선스 | 내용 |
| --- | --- | --- |
| Poly Haven | **CC0** (공식 라이선스 페이지 확인) | 모델 수백 개, blend·FBX·glTF·USD 배포. 복잡 형상용 |
| BlenderKit | 혼합 (RF와 CC0 공존) | Asset Inspection Benchmark(arXiv 2603.17358)가 crane·bridge 씬을 여기 에셋으로 만들었다 |
| **Thingi10K** (Zhou, Jacobson, arXiv 1605.04797) | 모델별 Creative Commons 계열 (Thingiverse 출처라 **모델마다 다름**, 메타데이터에 라이선스 포함) | 3D 프린팅 mesh 10,000개. **자기교차·비다양체 등 문제 mesh까지 통계와 함께 제공**되어 형상 난이도 표집에 적합. genus 높은 물체(구멍 다수) 포함. PyPI·HuggingFace 배포 |
| PipeForge3D (SBP-Net, arXiv 2606.04251) | [미검증] | 산업 배관 mesh·점군 **자동 생성기.** 가늘고 긴 구조물 표적에 직접 부합 |

구멍 있는 물체는 전용 자산이 없어도 된다. Blender 기본 primitive(토러스)와 boolean modifier로 직접 만들면 GT mesh가 정의상 정확하다. RaDe-GS의 Objaverse 로더(1-1절)를 쓰면 Objaverse 자산 경로도 열리나 라이선스가 자산별로 갈린다 `[미검증]`.

### 합성 씬 제작 선례 (궤도 캡처와 GT mesh 추출 관행)

- **BlenderNeRF 애드온** (maximeraafat/BlenderNeRF, Zenodo DOI 있음): Blender 안에서 학습·평가 이미지와 `transforms_train.json`/`transforms_test.json`을 자동 생성한다. 방식 셋 중 **Camera on Sphere(COS)가 구 표면 궤도 캡처**라서 관측 호 폭 통제에 직접 쓸 수 있다. 호 폭 축은 COS의 구간 제한 또는 Subset of Frames로 구현 가능
- **OB3D** (arXiv 2505.20126): Blender Python API로 카메라 파라미터를 정확히 지정해 렌더한 12씬 벤치마크. **GT는 depth·normal 맵과 희소 점군이며 dense mesh는 미포함.** 평가 코드 공개, 데이터 CC BY-NC-SA 4.0. 카메라 궤적 스크립팅의 선례
- **NeRF-Synthetic blend 파일에서 GT mesh를 뽑는 관행** (Q-01 보완에서 확인): 원 NeRF 배포물에 .blend가 포함되어 있어 TriaGS(arXiv 2512.06269)가 NeRF-Synthetic Chamfer를 보고하고 RayDF 계열이 관측 가능 영역 마스크를 씌워 잰다. **합성 씬에서 mesh 대 mesh 정량 평가가 수용되는 관행의 근거**
- Asset Inspection Benchmark: BlenderKit 에셋으로 GT mesh·depth·포즈를 함께 낸 최신 선례. office 씬은 동일 기하에 오염도 4단계를 입혔다 (통제 변인 설계의 참고)
- 등록부 C3(입력 카메라를 그대로 써서 렌더하면 조건이 통일된다)와 직접 연결된다

### 실사 데이터셋 중 "근거리+원거리 공존, 물체별 호 폭 상이"가 있는가

**찾지 못했다.** Q-01의 후보 표와 이번 추가 검색을 합쳐 확인한 범위에서.

- 물체 중심 실사(DTU, MobileBrick, T&T 물체 씬)는 카메라가 대상 하나를 고르게 감싼다. 입력 부분집합 선택으로 **호 폭을 좁히는 방향**은 흉내낼 수 있으나, 물체가 하나라 근거리·원거리 공존이 없다
- 궤적 고정 실사(Spires 도보, SS3DM 차량)는 근거리·원거리 물체가 공존하지만 **호 폭이 촬영 궤적에 박혀 있어 바꿀 수 없다.** 특히 "원거리 물체 + 넓은 호" 대조 조건은 카메라가 원거리 물체 주위에 존재하지 않으므로 원리적으로 만들 수 없다
- ObjectCarver(arXiv 2407.19108)가 실사 30씬에 물체별 완전 mesh를 주지만, 과제가 **근접 접촉 물체의 분리**라 전 물체가 근거리이고 호 폭 축이 없다

따라서 "원거리 + 넓은 호" 대조 조건을 기성 실사 데이터셋으로 줄 수 없다는 것이 확인 범위의 결론이며, **합성 제작의 근거가 성립한다.** 반대 방향(합성 결과를 실사로 뒷받침)은 궤적 고정 실사에서 호 폭이 다른 물체들을 사후 선별하는 관찰 연구로만 가능하다.

## 4. 남긴 것

- 각 저장소를 실제로 빌드하지 않았다. CUDA 버전 요구가 11.3(GOF)부터 13.0(RaDe-GS)까지 갈라져 있어 **한 환경에 공존이 어려울 수 있다.** 환경 분리 전략은 실험 세션이 정할 일
- Gaussian Wrapping의 DTU 평가가 "coming soon"이므로 DTU 무대에서는 자체 실행이 필요하다
- Gaussian Wrapping의 추가 재현 노트 (저장소 확인): 후처리 mesh가 씬의 물체를 지우는 경우가 있어 텍스처 mesh에는 비후처리본 권장, depth-order 플래그는 논문 미사용 옵션, OOM 방지로 `--N_max_gaussians` 상한 필요
- PipeForge3D 생성기의 공개 여부와 라이선스 미확인
- MeshSplat의 학습 데이터 요구(일반화 모델이므로 사전학습 가중치 필요)를 확인하지 않았다
- Thingi10K는 모델별 라이선스가 달라 **채택 모델 단위로 라이선스를 다시 봐야 한다**
- 2DGS의 blender 로더는 README 문구로 확인했고 코드 파일은 열지 않았다 (GOF·RaDe-GS는 코드 확인)
