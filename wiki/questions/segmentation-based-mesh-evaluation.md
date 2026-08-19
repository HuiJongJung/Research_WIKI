---
type: "question"
slug: "segmentation-based-mesh-evaluation"
title: "segmentation 기반 mesh 평가의 실체 — 부위별 채점 선례"
status: "draft"
modified_at: "2026-08-19T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://arxiv.org/abs/2308.07391"
  - "https://arxiv.org/abs/2203.09375"
  - "https://arxiv.org/abs/2202.08227"
tags:
  - "segmentation"
  - "evaluation"
  - "survey-q21"
---

# segmentation 기반 mesh 평가의 실체 — 부위별 채점 선례

> SURVEY_BRIEF Q-21. 두 해석 확인: (a) semantic seg를 재구성 품질 판별의 입력으로 (b) 부위별(per-part) mesh 채점. (b) 우선 지시.
> 조사일 2026-08-19.

## 1. (b) 부위별 mesh 채점 — **사례 있음**

**articulated object 재구성 계열이 부위별 Chamfer 분해를 표준으로 쓴다.**

| 논문 | 채점 방식 | 격 |
| --- | --- | --- |
| **PARIS** (ICCV 2023, arXiv 2308.07391v1) | §5.3·Table 1: Chamfer-L1, 표면당 1만 점 양방향 표집 후 평균("we sample 10,000 points on each surface"), 수치는 ×1000 단위(A-SDF·Ditto 관례). **CD-w(전체)/CD-s(정적)/CD-m(가동) 분리 보고.** 결손 부위 규칙은 본문에 명시 없음(실패는 표에 F/* 표기) | `[원문 확인, Q-23②]` |
| **Neural Part Priors** (CVPR 2022, arXiv 2203.09375) | 부록 B: "we sample 10,000 points per part", 의미 대응 부위 쌍별 Chamfer("for every pair of semantically matching parts"), **결손 부위 규칙 명시**: "we use the center of the mesh as a missing part", 부위 평균으로 물체 점수 | `[원문 확인, Q-23②]` |
| Ditto (arXiv 2202.08227) | 같은 계열 (부위 단위 재구성·평가) | `[2차 자료]` |

읽히는 규칙 셋: ① 부위 대응을 먼저 확정하고(의미 라벨 매칭) ② 부위별 지표를 따로 보고하며 ③ **결손 부위의 처리 규칙을 명시**한다(중심 대체 등). 셋째가 우리 hole 표적과 직결된다 — 부위가 아예 안 만들어진 경우를 지표가 삼키지 않게 하는 장치가 선례에 있다.

## 2. (a) seg를 품질 판별의 입력으로 / seg → confidence 연결

- (a)의 사례는 이번 탐색에서 **찾지 못했다** (탐색 경로 3절). 인접: OccluGaussian이 씬 분할에 가시성 클러스터링을 쓰지만 품질 판별이 아니라 렌더 가속이다 `[2차 자료, 08-11]`
- **seg 정보를 confidence/uncertainty에 연결한 사례도 찾지 못했다.** AREA3D가 의미 불확실도 stream을 기하 불확실도와 융합하지만(08-05 확보) 용도가 능동 촬영이다

## 3. 탐색 경로와 남긴 것

검색: per-part / part-level Chamfer / segmentation-based error breakdown / region-wise. 부위 채점은 articulated 계열에서 즉시 확인. (a)·seg→confidence는 같은 검색과 기존 위키(OccluGaussian·AREA3D) 대조로 부재 판정.

- ~~PARIS·Neural Part Priors 본문 미독~~ **해소(Q-23②).** 원문 확인 완료, 인용 가능. Ditto만 [2차 자료] 잔존
- PartNet 계열 seg 라벨과 이 채점 관행을 잇는 GS 논문은 찾지 못했다 — **부위별 채점을 GS 표면 재구성에 가져오는 것 자체가 빈자리**로 보인다. **판단 필요: 새 평가 설계에 채택할지**
- 바이오 무대(해골 부위: 안와·비강·하악)에 부위 채점을 적용한 선례는 미탐색
