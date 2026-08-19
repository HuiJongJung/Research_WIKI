---
type: "question"
slug: "pointcloud-derived-mesh-as-gt"
title: "점군에서 만든 mesh를 GT로 쓴 선례와 표기 조건"
status: "draft"
modified_at: "2026-08-19T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://github.com/ActiveVisionLab/MobileBrick"
  - "https://arxiv.org/abs/2308.16139"
  - "https://roboimagedata.compute.dtu.dk/?page_id=36"
tags:
  - "ground-truth"
  - "survey-q19"
  - "evaluation"
---

# 점군에서 만든 mesh를 GT로 쓴 선례와 표기 조건

> SURVEY_BRIEF Q-19. 스캔 점군(또는 볼륨)에서 파생시킨 mesh를 GT로 평가에 쓴 논문이 있는지, 어떤 조건과 표기로 쓰는지.
> 조사일 2026-08-19.

## 1. 파생 mesh를 GT로 배포·사용하는 세 관행

| 관행 | GT의 유래 | 표기 방식 | 격 |
| --- | --- | --- | --- |
| **MobileBrick** | GT depth(정렬된 LEGO 기지 기하에서 렌더)의 **TSDF fusion** → `gt_mesh.ply` | README에 유래를 각주로 명시. 평가 공식 프로토콜이 이 mesh 기준 | `[원문 확인, 08-09]` |
| **MedShapeNet** | 실제 환자 영상 데이터에서 직접 모델링("directly modeled on the imaging data of real patients") — CT/MR segmentation 유래 mesh로 추정 | 형상+주석을 "ground truth"로 배포 | 초록 `[원문 확인]`, seg→mesh 절차 `[미검증]` |
| **DTU 비공식 관행** | 벤치마크가 제공하는 Poisson mesh(Tola MVS 점군 기반)를 참조 mesh로 채택하거나, GT 점군을 screened Poisson으로 mesh화해 씀 | 논문별 상이 | `[2차 자료, 개별 논문 미특정]` — 검색 요약 2건이 일치 서술하나 어느 논문인지 특정 못함 |

DTU **공식** 평가는 파생 mesh를 쓰지 않는다. GT는 구조광 점군이고 DTUeval은 재구성 mesh에서 표집한 점을 그 점군과 비교한다 `[원문 확인, 코드 08-09]`. 파생 mesh는 culling 보조(관행)나 시각화에 주로 쓰인다.

## 2. 성립 조건 (관행에서 읽히는 것)

1. **유래를 명시한다.** MobileBrick처럼 "무엇의 fusion인지"를 각주로 박는 것이 수용된 형식이다
2. **파생 원본의 정밀도가 평가 대상보다 한 급 위여야 한다.** MobileBrick은 기지 기하(LEGO), MedShapeNet은 임상 segmentation이 원본이다
3. **파생 절차가 평가에 개입함을 인정한다.** 우리가 08-05에 DTU에 대해 적었던 것("mesh화가 평가에 개입")과 같은 취지가 MobileBrick 각주의 존재 이유다

**판단 필요**: MedShapeNet mesh를 렌더 무대의 GT로 쓸 경우 위 3조건의 서술 방식. CT 유래 mesh는 "정밀 점군" 지위 논거가 별도로 필요하다.

## 3. 탐색 경로와 남긴 것

검색: DTU Poisson mesh culling GT 관행, MedShapeNet 파이프라인. 원문: MobileBrick README(08-09), MedShapeNet 초록.

- DTU Poisson 참조 mesh를 GT로 쓴 개별 논문 특정 실패 (검색 요약 2건의 일치 서술만)
- MedShapeNet의 mesh 생성 절차(marching cubes 여부)와 품질 유보 문구는 본문 미독
- Spires·T&T는 점군 GT를 유지하며 mesh화하지 않는다 — 대규모 실측 쪽은 파생 mesh GT 관행이 없다는 대조
