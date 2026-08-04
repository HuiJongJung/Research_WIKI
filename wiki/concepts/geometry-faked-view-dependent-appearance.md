---
type: "concept"
slug: "geometry-faked-view-dependent-appearance"
title: "Geometry-Faked View-Dependent Appearance (SH Frequency Limit)"
status: "draft"
modified_at: "2026-07-14T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\CoMe - Confidence-Based Mesh Extraction from 3D Gaussians.pdf"
tags:
  - "spherical-harmonics"
  - "view-dependent"
  - "photometric-shortcut"
  - "failure-mode"
  - "gaussian-splatting"
  - "mesh-extraction"
  - "specular"
---

# Geometry-Faked View-Dependent Appearance (SH Frequency Limit)

## Definition
SH(spherical harmonics)가 **저주파 성분에 국한**되어 고주파 view-dependent 외관(날카로운 specular highlight, 거울 반사)을 표현하지 못할 때, 3DGS가 그 효과를 **기하(가림)로 대신 만들어내는** 실패 모드. 구체적 형태는 **반투명 primitive 층 뒤에 불투명 primitive를 숨기는 2층 구조**로, 시점에 따라 가림 정도가 달라지며 색이 변한다. **appearance를 강화하는 것이 아니라 대체(위조)하는 것** — SH는 그 자리에서 손을 놓고 기하가 역할을 훔쳐간다.

## Why It Matters
이 위조는 **학습 뷰의 photometric error를 진짜로 줄인다** — optimizer 입장에선 성공이다. 그러나 표면 뒤에 실재하지 않는 불투명 덩어리가 남아 mesh 추출이 망가진다. 즉 **"photometric 만족 + geometry 오류"가 공존**하는 대표 사례이며, photometric supervision만으로 geometry를 얻으려 할 때 생기는 구조적 충돌의 교과서적 서술이다. → [[photometric-primary-geometry-underconstraint]]

## Where It Appears
- **CoMe**(2603.24725) p.2: "highly opaque Gaussians **behind a semi-transparent surface**, which are only visible from certain viewpoints" / p.8: "highly opaque primitives just behind surfaces, which are **blocked in different amounts** by semi-transparent primitives **depending on the viewing angle**". 처방 = per-primitive variance loss. → [[come-confidence-based-mesh-extraction]], [[per-primitive-blending-variance-loss]]
- 계보: NeRF++ shape-radiance ambiguity(같은 병의 volumetric 버전), Spherical Voronoi(SH 주파수 한계 지적), Radiance Surfaces(per-sample loss로 억제).

## Mechanisms

**① 원인 — SH의 표현 한계**
Gaussian 하나의 색은 `sh(θ_i, d)`로 방향 `d`에 따라 **완만하게만** 변한다. 실제 고주파 효과는 각도가 조금만 틀어져도 색이 확 바뀌므로 저차 SH로는 못 그린다.

**② 유일한 대안 — 기하**
appearance로 못 맞추는데 optimizer는 photometric error를 줄여야 한다 → 남은 손잡이가 geometry뿐. 논문 표현: geometry 갱신이 *"the only viable way to truly minimize the photometric error"*가 되기도 한다.

**③ 위조 구조 — 2층 가림**
```
   [반투명 층]        [불투명 blob]
   진짜 표면 위치      그 바로 뒤

시점 A ──────┊──────────■    통과 많음 → blob 색 섞임 → 밝게
시점 B ────↗ ┊          ■    통과 적음 → blob 가려짐 → 어둡게
```
각도별로 가림이 달라지는 두 메커니즘:
- **이방성**: Gaussian은 찌그러진 타원체 → 정면에선 두껍고(α↑) 비스듬히는 얇음(α↓). 같은 반투명 primitive라도 각도에 따라 통과율 T가 달라진다.
- **시차**: 카메라가 움직이면 ray가 반투명 층의 다른 부분을 지나고 가림 관계 자체가 바뀐다.

원리적으로 **렌티큘러/블라인드**와 같다 — 특수 재질 없이 가림 구조만으로 각도별 다른 색을 만든다.

**④ 왜 막을 것이 없나 (구조적 허점)**
> p.8: "Since **only the blended final color** is used to compute the loss, **individual primitives have no incentive to correctly model radiance.**"

alpha-blending은 합쳐진 최종 색만 채점한다. 개별 primitive가 물리적으로 말이 되는지 아무도 묻지 않는다. SH로는 못 맞추고, 이 트릭으로는 맞고, 벌점은 없다.

**⑤ 진단법 — first-hit 렌더링**
맨 앞에 맞는 Gaussian의 색·normal만 렌더하면 드러난다. variance loss 없이는 first-hit이 엉망 = *맨 앞 primitive가 올바른 색을 안 들고 있다* = 뒤쪽 뭔가가 색을 담당한다는 직접 증거. (CoMe Fig.4 p.8, Fig.13 p.32)

## Failure Modes / Bias

**씬 종류 의존성이 매우 크다 — 보편 실패 모드가 아니다.** CoMe Table 3의 기여 분해(증분)가 이를 직접 드러낸다:

| loss | T&T (반사·광택 풍부) | ScanNet++ (평면·textureless 실내) |
| --- | --- | --- |
| `ℒ_conf` | +0.016 | **+0.030** |
| `ℒ_color-var` (위조 트릭 억제) | **+0.010** | +0.003 |
| `ℒ_normal-var` | +0.002 | **+0.010** |

- **specular/반사가 강한 씬에서만 지배적**: color variance loss는 T&T에서 +0.010이지만 ScanNet++에선 +0.003으로 거의 논다. 논문도 *"yields the strongest gains on Tanks & Temples, where such high-frequency effects are **abundant**"*라고 명시.
- **textureless 구간은 다른 병**: 거기선 위조 트릭이 아니라 **ambiguity from lack of texture**가 주범이며, 처방도 다르다(ScanNet++에선 `ℒ_conf`·`ℒ_normal-var`가 일함). 같은 "mesh가 안 나온다"라도 **원인이 다르면 처방이 다르다**는 것이 표에 그대로 찍혀 있다.
- **빈도가 정량화되지 않음(주장 vs 증거 구분)**: 논문은 "often"(p.2), "most frequently"(p.8)라고 쓰지만 *"전체 primitive 중 몇 %가 이 배치인가"* 같은 통계는 **없다**. 저자가 주요 실패 모드로 **지목**하고, 고치니 지표가 오른다 — 거기까지가 증거다.

## Open Questions
- 이 배치의 실제 빈도를 정량화할 수 있는가? (first-hit vs full-blending 색 차이의 분포 등)
- 진짜 view-dependent(물리적으로 옳은 반사)와 위조를 구분할 수 있는가, 아니면 variance loss가 둘 다 눌러 과평활을 유발하는가?
- SH 차수를 올리거나 다른 directional 표현(Spherical Voronoi·Deformable Beta 등)으로 바꾸면 위조 동기 자체가 사라지는가? 즉 이 병은 SH 탓인가 alpha-blending 탓인가?
- textureless의 "ambiguity from lack of texture"와 이 위조 트릭은 진단 신호가 다른가? (전자는 잔차가 작고 후자는 큼 → 잔차 기반 신호의 커버리지가 갈림) → [[learned-confidence-photometric-geometric-balancing]]
