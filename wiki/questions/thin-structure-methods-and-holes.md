---
type: "question"
slug: "thin-structure-methods-and-holes"
title: "가는 구조 계열과 구멍 — GW의 hole 거동과 진단 런 근거"
status: "draft"
modified_at: "2026-08-20T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://arxiv.org/abs/2604.07337"
  - "https://ieeexplore.ieee.org/document/273735"
  - "https://arxiv.org/abs/2506.21401"
  - "https://arxiv.org/abs/2409.12886"
tags:
  - "gaussian-wrapping"
  - "thin-structures"
  - "survey-q26"
  - "diagnostic-run"
---

# 가는 구조 계열과 구멍 — GW의 hole 거동과 진단 런 근거

> SURVEY_BRIEF Q-26. 가설: 가는 고체(표현 한계)와 빈 공동(관측 한계)은 반대 문제다. ①은 08-20 단독 회신 완료(진단 런 가능 판정), 이 페이지는 ①의 근거와 ②③을 담는다.
> 조사일 2026-08-20.

## 1. ① GW 재확인 — 진단 런 가능, 예측을 문헌이 미리 지지

- **셋업**: 코드 전부 공개(diego1401/GaussianWrapping), install.py, Python 3.9 + CUDA 11.8/12.1, COLMAP 입력(scan69는 DTU 표준 전처리로 가능). 주의: OOM 시 `--N_max_gaussians`, **진단은 비후처리 mesh로**(후처리가 물체를 지우는 경우 README 자인), DTU 평가 스크립트 부재(정성 진단이라 무관) `[원문 확인, 저장소 08-09·19]`
- **핵심 신규 확인 — vacancy는 카메라 광선 carving이다** (Eq.7) `[원문 확인, HTML]`: "we compute the vacancy by iterating over the set of all training camera rays" — 모든 학습 광선 중 가장 방해받지 않은 광선의 투과율로 빈 공간을 판정. **어느 한 광선이라도 그 점을 뚫고 지나가면 빈 공간이 된다**
- **함의**: 눈송이 관통(직선 광선 통과 가능)은 열릴 구조적 이유가 있고, 안와(외부 광선이 통과 불가한 막힌 공동)는 닫힐 구조적 이유가 있다. 진단 런의 양쪽 결과 모두 해석 틀이 선다
- 논문은 물체의 위상 구멍을 논하지 않는다. "closing holes"는 shell 틈 메우기 의미 `[원문 확인]` — Q-27 검색 함정의 실례

## 2. ② 가는 구조 계열의 관통 구멍 취급

- **GW의 스포크 성공은 wrapping(표현) + carving(관측)의 합작**이다. 스포크는 가는 **고체**라 wrapping이 감싸고, 스포크 **사이 공간**은 광선이 통과하므로 carving이 비운다. 즉 "스포크 성공"의 절반은 이미 관통-열기 능력이다 — 단 **광선이 통과할 수 있을 때만**
- 따라서 "스포크 성공이 구멍 열기로 이전되는가"의 답은 **조건부다**: 관통(광선 통과 가능)에는 이전될 구조가 있고, 깊은 공동(광선 통과 불가)에는 이전될 수 없다. 이 비대칭이 진단 런의 예측 그 자체다
- curve 계열(Curve-aware GS arXiv 2506.21401, EdgeGaussians arXiv 2409.12886)은 **곡선·edge 재구성**이지 표면 위상이 아니다. 관통 구멍을 다룬 서술 확인 안 됨 `[제목·초록 수준, 본문 미독]`

## 3. ③ 관통(위상 보존) 대 깊은 내부(관측 결핍)의 구분 선행

**현대 재구성 문헌에서 이 구분을 명시한 논문은 찾지 못했다.** 인접뿐: amodal completion 계열(가림 보완, 구분 아님), 지각심리학의 visual holes 논의.

**단 구분의 원리는 고전에 있다** — Laurentini 1994 (TPAMI 16(2)): visual hull 표면 위의 특징만 실루엣으로 재구성 가능하며 오목은 원리적 불가. 관통은 실루엣에 구멍으로 나타나는 시점이 존재할 수 있고(정보 있음), 깊은 내부는 어떤 실루엣에도 나타나지 않는다(정보 없음). **우리 서술은 발명이 아니라 이 고전의 재소환으로 세울 수 있다** — "관통 대 내부" 구분을 현대 GS 문헌에 명시적으로 가져오는 것 자체는 빈자리로 남아 있으므로 서술 자산도 유지된다.

## 4. 탐색 경로와 남긴 것

GW HTML(vacancy·topology·hole 전수 검색), through-hole/aperture+구분 검색, Laurentini(Q-27과 공유), curve 계열 기존 확보분 대조.

- Curve-aware GS·EdgeGaussians 본문 미독 (관통 서술 유무)
- GW의 vacancy 임계·carving 해상도 등 구현 세부 `[코드 미확인]` — 진단 런에서 실측이 대신함
- amodal 계열(Amodal3R 등)의 구멍 취급 미확인
