---
type: "comparison"
slug: "hole-object-dataset-candidates"
title: "hole 오브젝트 데이터셋 후보 — 조건 완화판 (실물 특정)"
status: "draft"
modified_at: "2026-08-19T12:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://arxiv.org/abs/2608.10602"
  - "https://arxiv.org/abs/2406.01467"
  - "https://graphics.stanford.edu/data/3Dscanrep/"
  - "https://arxiv.org/abs/2308.16139"
  - "https://arxiv.org/abs/1605.04797"
tags:
  - "dataset"
  - "hole"
  - "survey-q22"
  - "m2"
---

# hole 오브젝트 데이터셋 후보 — 조건 완화판 (실물 특정)

> SURVEY_BRIEF Q-22. 필수 조건 둘뿐: ① hole·관통·오목·내부 공간이 있는 단일 오브젝트 ② 정확도 평가 참조(GT mesh 최선, 정밀 점군·GT depth 가능). 나머지는 전부 가산점. Q-15의 "교집합 프레임"은 폐기됐다.
> **핵심 산출물은 hole의 실물 서술**이다.
> 조사일 2026-08-19.

## 1. 후보 표 — hole의 실물

| 후보 | **hole 실물 (구체)** | 촬영 | GT 형식 | 라이선스 | GS 선례 | 다운로드 |
| --- | --- | --- | --- | --- | --- | --- |
| **DTU scan65 (해골)** | **안와(눈구멍) 2개, 비강 개구, 치아 사이 틈, 하악-두개 사이 공간** — 입력 이미지에서 직접 확인 `[원문 확인, 08-09 이미지]` | 실사 49/64장 | 구조광 점군 | free+인용 요구 | 표면 재구성 표준 | 공개 (전처리판 다수) |
| **DTU scan37 (금속 가위)** | **손잡이 링 관통 2개** — 가위 구조상 확실. **근거 분리 (08-19 위키 정정)**: RaDe-GS는 "Metal Scissor of DTU"라고만 하며 **scan 번호를 명시하지 않는다** `[원문 확인, RaDe-GS Limitations·Fig.7]`. scan37=가위 매핑은 독립 논문들로 별도 확인 — "scissors' handles in Scan37"(arXiv 2408.02079), "fuse together in Scan37" `[원문 확인, 08-19 위키 검증]`. 후자의 "붙어버림"은 링 닫힘 = **hole 닫힘 실패의 직접 문헌 근거**로 승격 후보 | 실사 | 구조광 점군 | 동일 | RaDe-GS가 실패 사례로 사용 | 공개 |
| **OmniObject3D 선별** | **teapot(핸들 링 관통 + 주둥이 개구 + 뚜껑), handbag(핸들 관통), kennel(개집 — 입구 개구 + 내부 공간), pan(핸들)** — Gaussian Sculpting의 12물체 목록에서 확정 `[원문 확인, Table 1]` | 실사 멀티뷰 영상 | 실물 스캔 textured mesh | 미확인 `[미검증]` | **Gaussian Sculpting이 mesh 평가에 사용** — hole 물체 선별 선례 자체 | OpenXLab 등록 |
| **MobileBrick (LEGO)** | 스터드 사이 틈, 브릭 하부 공동(내부 공간), 조립 틈새. 관통 구멍은 모델별(테크닉류) `[2차 자료]` | 실사 | GT depth의 TSDF fusion mesh | 저장소 MIT | GS2Mesh 평가 코드 | GitHub 공개 |
| **NeRF-Synthetic** | **lego(불도저 — 캐터필러 트레드 틈, 캐빈 개구, 버킷 오목), mic(그릴 망 + 스탠드 링), chair(등받이·팔걸이 개구), ship(난간·마스트)** — 세부는 blend 렌더로 확인 필요 `[미검증, 통용 서술]` | 렌더 (blend 제공) | blend에서 GT mesh 추출 관행 (TriaGS·RayDF) `[원문 확인, 08-09]` | 공개 | 표준 무대 | 공개 |
| **MedShapeNet 선별** | 후보 해부 구조: **두개골(안와·비강·대후두공), 척추뼈(추공 — 고리 관통), 골반(폐쇄공 — 큰 관통 2개), 심장·혈관(내강)**. 해부학 일반 지식이며 **데이터셋 내 구체 품목은 포털 확인 필요** `[미검증]` | 없음 (렌더 필요) | 환자 영상 유래 mesh | 대부분 CC/CC BY 4.0 `[2차 자료]` | 없음 (확인 범위) | 포털+API |
| **Thingi10K 선별** | genus 높은 프린팅 부품 다수: 브래킷의 볼트 구멍, 기어 중심공, 격자 구조 등 — **모델별 genus·다양체 통계가 제공되어 hole 있는 물체를 통계로 선별 가능** `[2차 자료]` | 없음 (렌더 필요) | 원본 mesh (설계물 = 정의상 정확) | 모델별 CC 상이 | 없음 (확인 범위) | PyPI·HuggingFace |
| **Stanford 3D Scanning Repository** | **Happy Buddha·Dragon — "free holes, small bridges" (받침·조각 사이 관통)** `[2차 자료]`. **Bunny는 바닥에 스캔 결손 구멍 2개** — 관통이 아니라 결손이며, "GT 자체에 hole이 있는 유명 사례"로 별도 가치 | 없음 (렌더 필요) | 레이저 스캔 재구성 mesh | 학술 크레딧, 상업 불가 `[2차 자료]` | 그래픽스 반세기 표준 | 공식 페이지 직접 |

## 2. 조건별 정리

- **필수 ①+② 최강 조합 (촬영까지 있음)**: DTU scan65 + scan37, OmniObject3D 선별(teapot·kennel), MobileBrick
- **hole 다양성 최강 (렌더 필요)**: Thingi10K(genus 통계 선별) > MedShapeNet(해부 구조) > Stanford(고전 2~3종)
- **GT mesh 관점**: OmniObject3D(스캔 mesh)·Thingi10K(설계 mesh = 정의상 정확)·NeRF-Synthetic(blend)이 mesh를 주고, DTU 계열은 점군이다. Thingi10K의 "설계물이라 GT 논란이 없다"는 성질은 Q-19의 조건(원본 정밀도 한 급 위)을 자동 충족한다

## 3. 기존 데이터셋에 hole 오브젝트를 삽입하는 경로

교수 허가는 이미 있고, 선례는 세 층으로 받친다.

1. **표준 test model 관행**: Utah teapot(1975)·Stanford bunny(1994) 이래 표준 mesh를 렌더 벤치마크에 쓰는 것은 그래픽스의 기본 관행이다 `[2차 자료]`. teapot 자체가 "핸들·주둥이" 때문에 곡면 시험물로 만들어졌다
2. **벤치마크 제작 선례**: Asset Inspection Benchmark(BlenderKit 에셋으로 씬 구성 + GT mesh·depth·포즈), OB3D(Blender Python API 렌더) — 에셋을 씬에 넣어 렌더한 공표 벤치마크 `[원문 확인, 08-05·08-09]`
3. **도구**: BlenderNeRF의 Camera on Sphere가 궤도 캡처·transforms.json 출력을 자동화 `[원문 확인, 08-09]`

즉 "DTU식 궤도 + Stanford/Thingi10K hole mesh" 조합은 세 층 모두 선례가 있는 경로다. **NeRF-Synthetic blend에 물체를 추가 삽입하는 변형**도 같은 논리로 성립한다.

## 4. 기존 확보분의 hole 관점 한 줄 재평가

- **DTU scan65**: 안와·비강·치간 — hole 표적으로 **유효**, 촬영까지 보유한 최상위
- **MobileBrick**: 틈·공동은 확실, 관통은 모델별 — **유효(선별 필요)**
- **OmniObject3D**: teapot·kennel 확정 — **유효**, 라이선스만 미해결
- **MedShapeNet**: 해부 구조상 관통 후보 풍부 — **조건부 유효(품목 확인 선행)**
- **Thingi10K**: genus 통계 선별 가능 — **유효**, 라이선스 모델별

## 5. 탐색 경로와 남긴 것

검색: Stanford repo 위상·라이선스, BlendedMVS(textured mesh가 자체 재구성물이라 GT 지위 약함 → 표에서 제외), DTU 물체 목록(특정 실패, scan37은 RaDe-GS 원문으로 확증), 삽입 관행. 원문: Gaussian Sculpting Table 1.

- DTU 15개 표준 스캔의 전체 물체 목록 미특정 — 필요 시 scan별 입력 이미지 1장씩 내려받아 확인 가능 (scan65에서 검증한 방법)
- NeRF-Synthetic 각 씬의 관통 여부 세부 (blend 렌더 확인 필요)
- MedShapeNet 포털에서 두개골·척추·골반 품목 존재 확인
- OmniObject3D 라이선스 (반복 미해결)
- Stanford 라이선스 원문 페이지 문구 재확인
