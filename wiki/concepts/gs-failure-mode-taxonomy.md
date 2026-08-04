---
type: "concept"
slug: "gs-failure-mode-taxonomy"
title: "GS Failure Mode Taxonomy (Under-Constrained / Capacity / Data Quality)"
status: "draft"
modified_at: "2026-07-14T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "medium"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\CoMe - Confidence-Based Mesh Extraction from 3D Gaussians.pdf"
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\GOF_Gaussian Opacity Fields - Efficient Adaptive Surface Reconstruction in Unbounded Scenes.pdf"
tags:
  - "taxonomy"
  - "under-constrained"
  - "textureless"
  - "photometric-ambiguity"
  - "failure-mode"
  - "gaussian-splatting"
  - "surface-reconstruction"
  - "thesis-motivation"
---

# GS Failure Mode Taxonomy

## Definition

GS surface reconstruction이 어려워하는 구역을 **세 축**으로 가른 분류. 축을 가르는 기준은 증상이 아니라 **"무엇이 부족한가"**이며, 실무적으로 가장 중요한 분기점은 **photometric 잔차가 남느냐 0이 되느냐**다 — 그것이 *진단 도구가 작동하는지*를 결정하기 때문이다.

```text
축 A. 제약 부족 (under-constrained)   →  잔차 0    →  신호가 없음
축 B. 표현 용량 부족 (capacity)        →  잔차 큼   →  신호가 있음
축 C. 관측 오염 (data quality)         →  신호가 있는데 틀림
```

### 축 A — 제약 부족 (under-constrained)

| | 원인 | 증상 | 관측을 늘리면? |
| --- | --- | --- | --- |
| **A1** 관측 0 | unobserved / severely occluded | **hole, cavity** | 해결됨 (찍으면 됨) |
| **A2** 전역 관측 부족 | sparse-view **capture setting** | 학습뷰 완벽 / **novel view 붕괴** | 해결됨 |
| **A3** 국소 관측 부족 | **삼각측량각 퇴화** (CoMe는 "distant"로만 서술) | 잔차 0인데 미결정 | **해결됨 (각도만 확보하면)** |
| **A4** 장면에 신호 없음 | **textureless** | 잔차 0인데 미결정 | **해결 안 됨** ← 정보 상한이 다름 |

**A2 vs A3 = 전역 vs 국소.** CoMe §5가 `Furthermore`로 문단을 끊고 **처방을 다르게** 준 것이 저자가 둘을 구분했다는 증거(전역 결핍→전역 prior / 국소 결핍→국소 densification recipe). 메커니즘은 같다 — **자유도 > 제약 → SH가 학습 뷰를 외움 → 잔차 0** — 스코프만 다르다.

### 축 B — 표현 용량 부족

| | 원인 | 증상 | 처방 |
| --- | --- | --- | --- |
| **B1** 외관 용량 | **specular·거울**: SH 각 대역폭 ~60° < 필요(하이라이트 ~10°) | 잔차 큼 | mesh 목적이면 **cheating 봉쇄 후 포기**(CoMe의 선택) / **표현 교체**도 가능(Spec-Gaussian·Spherical Voronoi·Deformable Beta) |
| **B2** 기하 용량 | **foliage·얇은 구조**: primitive 수 < 필요 | 잔차 큼 | **densify 필요** |

**⚠ B1과 B2는 처방이 반대인데 증상이 같다** — 둘 다 "잔차 큼 → gradient 큼 → densify 폭주". 거울은 primitive를 **줄여야**(위조 재료 차단) 하고 foliage는 **늘려야**(진짜 복잡) 한다. **CoMe는 Ĉ 하나로 둘 다 억제한다**(Fig.3이 *"reflective surfaces, thin foliage"*를 나란히 저신뢰로 놓음; Fig.12에서 실외 primitive 4.38M→2.58M) = **CoMe의 약점**. 단 실측상 PSNR 손해는 0.02dB뿐이고, "진짜 나뭇잎 기하를 잃었나"는 아무도 안 쟀다.

**용어 주의**: `photometric ambiguity`는 **B1에만** 정확히 적용된다(CoMe·AmbiSuR의 용어). **B2는 ambiguity가 아니라 해상도 부족**이다.

### 축 C — 관측 오염

| | 내용 | 대응 |
| --- | --- | --- |
| **C1** 조명·노출 불일치 | 카메라 ISP 차이를 GS가 색·기하에 흡수 → **조명이 point cloud에 구워짐** | appearance embedding (NeRF-W 2021 → **VastGaussian 2024 = GS 표준** → CoMe가 개선). → [[dssim-luminance-decoupled-appearance]] |
| **C2** motion blur / defocus | 틀린 신호 | — |
| **C3** dynamic objects | view 간 모순. Jancosek: *"ground planes... occluded by moving objects"* | — |

## Why It Matters

**★ 축 A와 축 B를 가르는 것이 "잔차가 남느냐"이고, 그것이 진단 도구의 작동 여부를 결정한다.**

```text
축 B (잔차 큼)  →  잔차 기반 신호(CoMe의 Ĉ)가 작동하는 세계
축 A (잔차 0)   →  잔차 기반 신호가 원리적으로 무력한 세계
```

CoMe의 `Ĉ* = β/ℒ_rgb`는 **잔차의 역수**다. 축 A에선 `ℒ_rgb ≈ 0` → **Ĉ = 5 (최대 신뢰)** → *"여기 완벽함"*이라고 표시한다. 못 보는 게 아니라 **반대로 본다**. → [[learned-confidence-photometric-geometric-balancing]]

그리고 **처방이 축마다 반대**라서(B1은 primitive를 줄이고 B2는 늘림, A3는 각도 확보로 해결되고 A4는 안 됨) 뭉뚱그리면 **틀린 처방이 나간다**. 분류가 곧 처방의 전제다.

## Where It Appears

**"under-constrained"의 범위가 논문마다 다르다 — 최소 3가지 용법:**

| 논문 | 인용 | 범위 |
| --- | --- | --- |
| **G4Splat** | *"under-constrained areas (i.e., regions **distant from or invisible to** the input views)"* | 관측 기반. **textureless 제외** |
| **CoMe** | *"underconstrained regions such as the **textureless floor**"* (p.10) | **제약 기반. textureless 포함** |
| **GOF** | *"3D reconstruction from multi-views is an **underconstrained problem**"* | 문제 일반(최적화 의미) |

⇒ 맨 `under-constrained regions`만 쓰면 독자마다 다르게 읽는다. **한정어 필수** — 우리 대상은 **"observed yet under-constrained"**. 그리고 그것만으론 부족하다(textureless도 observed yet under-constrained다) → **우리 차별화는 "under-constrained를 다룬다"가 아니라 "그 원인 중 관측 기하를 학습 전에 잰다"** = 우산이 아니라 우산살 하나. → [[terminology-preferences]]

**CoMe §5의 4단 그라데이션** (문단·처방이 갈리므로 저자가 다른 병으로 진단한 것):
- `"unobserved"` / `"severely occluded"` → **holes/cavities** (증상 명시)
- `"sparse-view capture settings"` → **증상 서술 없음**. 이름만 부르고 처방만 붙임
- `"distant background regions"` / `"insufficient view density"` → **"insufficiently densified"**
- `"moderately dense capture setting"` → 그들의 작동 가정

**textureless는 관례 데이터셋에 흔하다** — CoMe가 ScanNet++ 씬 **선정 기준**으로 명시: *"ensuring a diverse coverage of reflections, **textureless areas**, and motion blur"*(p.21) / *"the inherent ambiguities of indoor scenes, such as **untextured walls**, inconsistent lighting, and occasional blur"*(p.11). 실내 씬(ScanNet++·Mip360 room/counter/kitchen·T&T Meetingroom의 "textureless floor")은 거의 다 해당. T&T 실외(Barn·Truck·Ignatius)만 보면 안 보인다.

## Mechanisms

### A3(각도 퇴화) vs A4(textureless) — 결정적 차이

```text
A3 각도 퇴화  :  시차가 "작다"           →  각도를 늘리면 해결
A4 textureless:  시차를 "읽을 수 없다"   →  각도를 늘려도 여전히 못 읽음
```

**textureless의 정확한 메커니즘**: Gaussian이 틀린 depth에 있으면 다른 view에서 2D 위치가 어긋난다(=시차). **그게 오차의 증거인데, 주변이 다 같은 색이라 어긋나도 같은 색이 렌더된다** → 잔차 0. **시차는 존재하는데 그것을 읽을 대비(contrast)가 없다.**

**"texture 0"은 이상화**다. 실제 벽엔 미세 얼룩·붓자국·조명 그라데이션·센서 노이즈가 있고, **경계(모서리·창틀·접합부)는 확실히 있다**. 그래서 실제 실패는:
```text
경계  →  depth 결정됨
내부  →  미결정 → 경계에서 보간 → 그 보간이 맞는지 아무도 검증 안 함
      →  평면이면 우연히 맞고, 미묘한 굴곡이면 틀림
```
즉 *"depth를 알 수 없다"*가 아니라 **"내부가 경계에서 보간되고 검증되지 않는다"**.

### ★ A3와 A4는 SfM에서 **같은 증상**을 낸다 — 오진 위험

```text
SfM 포인트 0 의 3원인:
  ① 안 보임 (frustum 밖)                  →  A1 invisible
  ② 텍스처가 없어 특징점을 못 잡음         →  A4 textureless
  ③ COLMAP min tri-angle 필터가 걸러냄     →  ★ A3 각도 퇴화 (= 우리 표적)
```
**②와 ③이 똑같이 "포인트 없음"으로 나온다.** 포인트 신호만 보면 구별 불가 → *"포인트 없음 = 관측 부족"*으로 읽으면 textureless를 표적으로 **오진**한다.

**해법 = pose 신호 결합.** 포인트가 없어도 **카메라 배치만으로 그 지점의 "잠재 삼각측량각"이 계산된다**(그 지점을 보는 카메라들의 위치 → 그들 사이의 각도. 포인트 불필요).

```text
잠재 각도 없음(안 보임)        →  A1 invisible
잠재 각도 좋음 + 포인트 없음   →  A4 textureless      (각도는 되는데 신호가 없음)
잠재 각도 나쁨 + 포인트 없음   →  ★ A3 각도 퇴화       (신호는 있는데 각도가 없음)
잠재 각도 좋음 + 포인트 있음   →  well-constrained
```
**포인트 신호만으론 ②③을 못 가르고, pose 신호만으론 ②④를 못 가른다.** 둘 다 필요하다.

### 축 A에서 남은 신호마저 순환 논리다

잔차 0 → Ĉ=5 → photometric 신호 0 → **`ℒ_geom`만 남음**. 그런데 `ℒ_geom`(depth-normal consistency)은 **self-supervised**(기준 normal이 GT가 아니라 자기 렌더의 depth gradient) → **GT 앵커가 없으면 틀린 값에 서로 합의** → 매끄럽고 일관되고 **틀린** 기하. → [[rendered-depth-normal-supervision]]

## Failure Modes / Bias

- **실제로는 섞여서 나타난다.** 원거리 배경은 A3(각도 퇴화) + A4(뭉개져서 텍스처 소실) + C2(blur)가 겹칠 수 있다. 이 표는 **원인 축의 분해**이지 상호배타적 라벨이 아니다.
- **경계가 연속적이다.** "각도 퇴화"와 "well-constrained" 사이에 임계값이 없다. 이진 분할이 아니라 연속 field로 다뤄야 한다.
- **축 C가 가장 덜 정리됐다.** C2·C3는 대응 기법을 여기 적지 않았다(각각 별도 분야).
- **B1의 "구조적 불가능"은 SH ℓ=3에 한해서다.** 표현을 바꾸면 가능하다. "포기가 최선"은 **mesh 목적일 때의 조건부 참**이며 CoMe의 선택이지 유일한 답이 아니다.
- 이 분류는 **2026-07-14 CoMe 정독 중 도출**된 것으로, 원문 수확으로 전수 검증되지 않았다. 특히 축 C의 완결성과 A2 증상 서술(문헌 근거가 CoMe 밖)은 미확인.

## Open Questions

- A3와 A4를 "잠재 삼각측량각 + SfM 포인트 유무"로 실제로 가를 수 있는가? 경계 케이스(약한 텍스처 + 나쁜 각도)는 어떻게 되는가?
- A4(textureless)의 정보 상한은 어디인가? 경계로부터의 보간이 어디까지 신뢰 가능한가?
- B1과 B2를 잔차 말고 무엇으로 가를 수 있는가? (CoMe가 구분 못 하는 지점 — 관측 기하로 가능한가?)
- 축 A에서 `ℒ_geom`의 순환을 끊는 최소 외부 신호는 무엇인가?
- A2(sparse-view) 처방을 A3에 이식하면 well-constrained 영역이 얼마나 망가지는가? (균일 prior의 해악 — 실측: depth-order strong이 rough% 23.8→21.8 개선 대신 bndEdge% 0.034→0.051 악화)

## Related WIKI Pages

- [[come-confidence-based-mesh-extraction]]
- [[geometry-faked-view-dependent-appearance]] — B1의 상세
- [[learned-confidence-photometric-geometric-balancing]] — 잔차 기반 신호가 축 A에 무력한 이유
- [[photometric-primary-geometry-underconstraint]] — 근본 원인(파라미터 81%가 SH)
- [[rendered-depth-normal-supervision]] — 축 A의 순환 논리
- [[confidence-steered-densification]] — B1/B2 처방 충돌
- [[dssim-luminance-decoupled-appearance]] — C1 대응
