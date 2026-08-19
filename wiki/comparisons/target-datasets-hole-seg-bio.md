---
type: "comparison"
slug: "target-datasets-hole-seg-bio"
title: "표적 데이터셋 후보 — hole·segmentation·바이오"
status: "draft"
modified_at: "2026-08-19T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://arxiv.org/abs/2308.16139"
  - "https://arxiv.org/abs/2303.01932"
  - "https://arxiv.org/abs/1605.04797"
  - "https://arxiv.org/abs/2510.20155"
  - "https://arxiv.org/abs/2608.10602"
tags:
  - "dataset"
  - "survey-q15"
  - "bio"
  - "segmentation"
  - "hole"
---

# 표적 데이터셋 후보 — hole·segmentation·바이오

> SURVEY_BRIEF Q-15. 새 표적(hole 있는 단일 오브젝트의 mesh 품질) 기준. GT mesh 또는 정밀 점군 보유가 필수 조건이다.
> 조사일 2026-08-19. 기존 확보분([[gt-mesh-benchmark-candidates]], 08-05~10)과 통합했고, 그쪽에서 검증된 사실은 재검증하지 않았다.

## 0. 구조: 촬영 보유 대 렌더 필요

GS 학습에는 멀티뷰 이미지가 필요하다. 후보는 두 부류로 갈리며, **mesh만 있는 부류는 Blender 렌더를 거쳐야 한다**(기존 데이터셋에 오브젝트 추가 허용 확인됨 — progress-2026-08-19).

## 1. 촬영 이미지 보유 (바로 학습 가능)

| 후보 | 규모 | GT 형식 | 라이선스 | GS 선례 | seg | 표적 정합 |
| --- | --- | --- | --- | --- | --- | --- |
| **DTU scan65 (해골)** | 이미지 49/64장, 1600x1200 | 구조광 **점군** (mesh 아님) `[원문 확인, 08-09]` | 페이지는 "freely available"+인용 요구 | 표면 재구성 표준 무대 | 없음 | **바이오 + 촬영 보유의 유일 교집합.** 눈구멍·코곽·이빨 틈 = hole 표적. 뒤통수 미관측(M7 관측 예정) |
| **MobileBrick** | 153 물체(평가 18), 실사 | GT depth의 TSDF fusion mesh (PLY) `[원문 확인]` | 저장소 MIT, 데이터 별도 미확인 | GS2Mesh가 평가 코드 보유 | 없음 | **LEGO는 스터드·틈·관통 구멍이 구조적으로 많다.** hole 표적과 정합 |
| **OmniObject3D** | 실물 스캔 6,000 물체, 190 카테고리, 멀티뷰 영상 | textured **mesh** + 점군 | 미확인 `[미검증]` (OpenXLab 경유) | GaussianObject(NVS), **Gaussian Sculpting이 12물체로 mesh 평가** `[원문 확인]` | 카테고리 라벨 (part seg 아님) | 실물 스캔 + GT mesh + 촬영의 3박자. 물체 선별로 hole 카테고리 추출 가능 |

## 2. mesh만 보유 (Blender 렌더 필요)

| 후보 | 규모 | GT 형식 | 라이선스 | seg | 표적 정합 |
| --- | --- | --- | --- | --- | --- |
| **MedShapeNet** (arXiv 2308.16139) | **의료 형상 10만+ 개, 원천 데이터셋 23종** — 뼈·장기·혈관·수술 도구 | **mesh(.stl)** + 점군 + 복셀 3형식 배포 `[2차 자료]` | 원천 대부분 CC 또는 CC BY 4.0 `[2차 자료]` | 해부 구조 단위 주석(부위별 형상 분리 제공) | **바이오 정답 후보.** 교수 선호(해골·장기·뼈)와 직결. 두개골 포함 여부는 포털에서 확인 필요 `[미검증]` |
| **Thingi10K** (arXiv 1605.04797) | 3D 프린팅 mesh 10,000개 | mesh (STL) | **모델별 CC 상이** — 채택 모델 단위 확인 필요 | 없음 | genus 높은 물체 다수 = hole 표적. 자기교차·비다양체 통계 제공 |
| **PartNet** | 26,671 모델, 573,585 부위 인스턴스, 24류 `[2차 자료]` | mesh + 점군 (ShapeNet 유래 CAD) | ShapeNet 연구용 등록제 `[미검증]` | **세밀·계층·인스턴스 3종 part seg** | **segmentation 정답 후보.** 단 CAD mesh라 실물 질감 없음 → 렌더 시 텍스처 처리 판단 필요 |
| ShapeNet-Part | 16,881 모델, 16류 50부위 `[2차 자료]` | 위와 동일 | 위와 동일 | part seg | PartNet의 경량판 |
| PartNeXt (arXiv 2510.20155) | 차세대 part 데이터셋 `[미검증, 제목 수준]` | — | — | 세밀·계층 | PartNet 후속 후보. 본문 미독 |
| NeRF-Synthetic blend | 8씬 (Lego 포함) | blend에서 mesh 추출 관행 (TriaGS·RayDF) `[원문 확인, 08-09]` | — | 없음 | **Lego 씬 자체가 hole 다수.** 관행 검증 완료라 정당성 부담 없음 |

## 3. 합성 삽입 선례 (한 줄씩)

- Asset Inspection Benchmark(arXiv 2603.17358): BlenderKit 에셋으로 씬을 구성해 GT mesh·depth·포즈를 냈다 `[원문 확인, 08-05]`
- OB3D(arXiv 2505.20126): Blender Python API로 카메라를 지정해 렌더한 벤치마크 `[원문 확인, 08-09]`
- 즉 "기존 무대에 물체를 넣고 렌더"는 벤치마크 제작 관행으로 이미 수용되어 있다

## 4. 정리 — 세 요구의 교집합

| 요구 | 최우선 후보 | 차선 |
| --- | --- | --- |
| hole 단일 오브젝트 | MobileBrick(실사), NeRF-Synthetic Lego(합성 관행), Thingi10K(대량 선별) | OmniObject3D 선별 |
| segmentation | **PartNet** (부위 채점용 라벨의 사실상 유일 공급원) | ShapeNet-Part, PartNeXt |
| 바이오 (해골·장기·뼈) | **DTU scan65**(촬영 보유) + **MedShapeNet**(mesh 대량, 렌더 필요) | — |

**교집합이 비어 있다는 것이 구조적 발견이다.** 촬영+GT mesh+seg+바이오를 동시에 주는 기성 데이터셋은 없다. 조합이 불가피하다: 실사 축(DTU65·MobileBrick·OmniObject3D)과 렌더 축(MedShapeNet·PartNet·Thingi10K)을 나눠 쓰는 구성이며, 렌더 축의 정당성은 3절 선례가 받친다. **어느 조합으로 갈지는 M2(무대 확정) 판정.**

## 5. 탐색 경로와 남긴 것

검색: MedShapeNet/skull·organ·bone, PartNet/ShapeNet-Part/OmniObject3D seg 축. 기존 페이지 재사용: DTU65·MobileBrick·Thingi10K·NeRF-Synthetic·OmniObject3D.

- MedShapeNet의 두개골 포함 여부와 개별 라이선스, 포털 실사용 확인 `[미검증]`
- OmniObject3D 라이선스 (08-05부터 미해결)
- PartNet 렌더 시 텍스처 부재 문제 (CAD mesh 무질감 → GS 학습 입력으로서의 적합성은 실험 확인 사항)
- PartNeXt 본문 미독
- 의료 촬영(CT 유래) mesh의 "정밀 점군" 인정 여부 — GT 지위 논거는 Q-19와 연결
