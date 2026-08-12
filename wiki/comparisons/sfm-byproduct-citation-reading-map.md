---
type: "comparison"
slug: "sfm-byproduct-citation-reading-map"
title: "SfM 부산물 인용 사다리 읽기 지도"
status: "draft"
modified_at: "2026-08-11T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://arxiv.org/abs/2107.02791"
  - "https://arxiv.org/abs/2603.20714"
  - "https://arxiv.org/abs/2606.28581"
  - "https://arxiv.org/abs/2606.30545"
tags:
  - "reading-map"
  - "related-work"
  - "survey-q11"
  - "citation-bank"
---

# SfM 부산물 인용 사다리 읽기 지도

> Q-11의 후속. 조사에서 확보한 참고문헌을 **읽을 순서와 건질 것** 단위로 정리한다. 조사 세션은 어떤 문헌이 무엇에 쓰이는지까지만 정하고, 읽기 배정과 인용 채택은 방향 논의 세션이 판정한다.
> 근거는 [[sfm-byproducts-beyond-points-precedent]], [[triangulation-angle-in-training-precedent]].
> 작성일 2026-08-11.

## 0. 이 목록이 성립하는 이유

related work를 이 순서로 세울 수 있다는 것이 조사의 결론이다.

1. 각이 문제라는 인식은 이미 있다 (SatSplat)
2. SfM 부산물을 감독에 쓴 선행이 있다 (DS-NeRF의 잔차, CoMapGS의 개수)
3. 그런데 초기화에만 실은 정보는 시각 품질에서 씻겨나간다 (Desiatov & Sattler)
4. **같은 논문이 기하 일관성에는 남는다고 보고한다.** 각을 감독 배분으로, 기하 표적에 쓰는 자리가 비어 있다

각 칸을 채우려면 아래를 읽어야 한다.

## 1. 티어 1 — 인용 확정, 정독 필요

| 논문 | 왜 읽나 | 건질 것 (이것만 건지면 됨) |
| --- | --- | --- |
| **DS-NeRF** (Deng 외, CVPR 2022, arXiv 2107.02791) | 인용 사다리의 첫 칸. SfM 부산물을 감독 불확실도로 쓴 원조 | ① 재투영 오차가 **정확히 어떤 식으로 분산 σ가 되는지** 유도식 ② KL 깊이 loss의 최종 형태 ③ "공짜 감독"에 해당하는 문장 verbatim (15단어 이내) ④ few-shot 이득을 무엇에 귀속시키는지. **우리 대비 문장을 여기서 뽑는다: 잔차는 측정이 얼마나 맞았는지이고 각은 그 자리가 결정 가능한지다** |
| **Desiatov & Sattler**, The Role of Initialization in 3DGS (arXiv 2603.20714) | 무효화 반론("초기화 정보는 densification에 씻긴다")의 근거이자 그 반전 | ① "dense initialization does not lead to consistent visual improvements" 실험 조건 (어떤 densification 설정, 어떤 데이터셋) ② **"geometric consistency"를 무슨 지표로 쟀는지** — 우리 C4 지표 설계와 직결되므로 가장 중요 ③ off-trajectory view 실험 설계 ④ 인용 범위 확정: 그들이 잰 것은 초기화 점군의 밀도·품질이지 각 가중이 아니다 |
| **Rumpler·Irschara·Bischof**, Multi-View Stereo: Redundancy Benefits (AAPR 2011) | "각이 왜 의미 있는가"의 기하학적 근거. B3 임계값 유도의 후보 | ① 각과 3D 불확실 타원체의 **관계식** ② 다중뷰가 두 뷰 융합보다 한 자릿수 우수하다는 정량 근거 ③ 각이 커질 때 불확실도 감소의 함수 형태 (선형인지 아닌지 — 우리 밴드 설계에 걸림) |
| **COLMAP 원전** (Schönberger & Frahm, CVPR 2016) | B1. **이미 정독 완료**로 기록됨 (`my-tasks.md`) | 추가 확인 하나만: points3D 출력에 각이 남지 않고 track과 재투영 오차만 남는다는 사실을 **원문 근거로 못 박을 수 있는지.** Q-11의 핵심 해석이 여기 걸려 있다 |

## 2. 티어 2 — 인용 후보, 해당 절만

| 논문 | 왜 읽나 | 건질 것 |
| --- | --- | --- |
| **SatSplat** (Song·Kim·Qin, arXiv 2606.28581) | "각이 문제임은 알려져 있으나 아무도 방법에 안 쓴다"의 실물 증거 | ① 초록의 "small intersection angles" 문장 verbatim ② **본문에 각 관련 서술이 더 있는지** (조사는 HTML 1회만 확인) ③ 방법 절에 각 값이 정말 안 들어가는지 재확인. 이 셋이 맞으면 B7 공백 주장의 가장 강한 인용이 된다 |
| **StereoGS** (arXiv 2606.30545) | SfM 점 기반 척도 정렬의 실패 담론 | DRGS의 정렬을 "희소 관측에서 추정한 고정 척도를 전 화소에 균일 적용"이라 비판한 문장 verbatim. D2(prior 척도) 논거 |
| **PanoLOG** (arXiv 2607.08769) | 각을 학습 전에 쓴 유일한 인접 사례 | ① 시차각에서 깊이 불확실도를 유도하는 **1차 오차 전파 수식** ② 그 값을 경계 상자 여백으로 바꾸는 지점 ③ 감독 배분을 하지 않는다는 확인. 인용 사다리의 "전역 분할까지는 갔다" 칸 |
| **TriaGS** (arXiv 2512.06269) | 명명 충돌 회피 | ① "triangulation-guided"의 정의 ② 각을 계산하지 않고 합의점 거리만 쓴다는 확인. 우리 명명을 무엇으로 할지의 재료 |
| **DRGS** (Chung 외) | 위 StereoGS 비판의 대상 원문 | 척도 정렬을 실제로 어떻게 하는지. StereoGS 서술만으로 인용하면 위험 |

## 3. 티어 3 — 필요할 때만

- **SplatMAP** (arXiv 2501.07015): 읽을 필요 낮음. "깊이 공분산 가중"이 각이 아니라 optical flow 신뢰도임을 조사에서 확인했다. **혼동 방지용 각주 한 줄**로 충분
- **FSGS**(arXiv 2312.00451), **SPARS3R**: sparse-view에서 SfM 자체가 실패한다는 전제 담론. `my-tasks.md` 유보 목록의 "sparse-view 구별 문단 집필 시" 조건과 동일하므로 **그때 함께**
- **reconstructability 2편, Mostegel**: 이미 유보 목록에 있다. 각 기반 촬영 계획 계보이므로 Q-11 사다리의 "촬영 계획 쪽에서는 각을 써왔다" 칸과 겹친다. intro·계보 문단 집필 시 해제 조건 그대로

## 4. 읽지 않아도 되는 것 (조사에서 확보 완료)

| 항목 | 확보 위치 |
| --- | --- |
| CoMapGS의 covisibility 개수 재가중 | [[comapgs-covisibility-sparse-view-synthesis]], [[covisibility-count-weighted-supervision]] |
| CoMe의 confidence 구조와 수치 | [[come-confidence-based-mesh-extraction]] |
| AmbiSuR의 SH ambiguity와 벤치마크 위치 | [[ambisur-photometric-ambiguity]], [[gs-surface-recon-sota-2026]] |
| 3DGS 원논문의 배경 저하 문장과 Table 3 | [[3dgs-random-init-background-degradation]] (게재본 대조 완료, 재확인 불필요) |
| Depth Anything V2·V3 정확도 | [[prior-model-reported-accuracy]] 3-1절 |

## 5. 권장 읽기 순서

1. **Desiatov & Sattler 먼저.** 무효화 반론의 강도를 알아야 나머지 인용의 배치가 정해진다. 특히 geometric consistency 측정 방식이 C4와 직결
2. **DS-NeRF.** 사다리 첫 칸이자 우리 대비 문장의 출처
3. **SatSplat 해당 절.** 공백 주장의 증거 확정
4. Rumpler는 B3(임계값 근거) 착수 시점에
5. 나머지는 related work 집필 착수 시

## 6. 남긴 것

- 티어 1의 넷 중 셋(DS-NeRF, Desiatov & Sattler, Rumpler)은 **조사 세션이 본문을 읽지 않았다.** 초록·검색·부분 확인 수준이므로 위 "건질 것"은 확인 대상이지 확정 사실이 아니다
- DRGS 원문 미확인
- 각 논문의 정확한 발표처·페이지는 인용 시 재확인 필요
