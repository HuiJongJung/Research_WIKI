---
type: "concept"
slug: "covisibility-grouped-bundle-adjustment"
title: "Covisibility 기반 Grouped Bundle Adjustment (Redundant View Mining)"
status: "draft"
modified_at: "2026-08-09T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/SfM.pdf"
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\SfM.pdf"
tags:
  - "bundle-adjustment"
  - "covisibility"
  - "redundant-view-mining"
  - "parameter-reduction"
  - "optimization-efficiency"
  - "structure-from-motion"
---

# Covisibility 기반 Grouped Bundle Adjustment (Redundant View Mining)

## Definition

Bundle adjustment에서 **최근 변경에 영향받지 않았고 서로 시야가 크게 겹치는 카메라들을 소규모 그룹으로 묶어, 그룹 전체를 단일 강체 변환 파라미터 하나로 대체**하는 파라미터화 기법. 그룹 내 상대 pose는 고정하고 그룹의 `SE(3)` pose만 최적화한다.

## Why It Matters

BA는 SfM의 성능 병목이고, reduced camera system 풀이 비용은 카메라 수에 대해 direct method에서 3제곱, indirect에서 1제곱으로 증가한다. 그런데 unordered 사진 컬렉션에는 **거의 같은 시점의 중복 이미지가 대량으로 존재**한다. 이들을 개별 파라미터로 두는 것은 비용은 다 내면서 정보는 거의 없는 셈이다.

핵심 통찰 두 가지.

1. **Incremental SfM은 국소적으로 확장된다.** 최신 확장에 영향받은 부분만 실제로 크게 움직이고, 나머지는 drift 보정 정도만 받는다. → "영향받음/안 받음"이라는 무료로 얻어지는 분할이 존재한다.
2. **중복은 비용이지만 동시에 근사의 근거다.** 시야가 크게 겹치는 카메라들은 서로에 대한 상대 pose가 이미 잘 결정돼 있으므로, 그 상대 관계를 고정해도 잃는 게 적다.

Ni et al.의 out-of-core BA와 목적은 같지만 반대 방향으로 간다. **큰 submap 몇 개가 아니라 작고 겹침이 큰 그룹 다수**로 쪼개서, separator 변수 교대 최적화 자체를 없앤다.

## Where It Appears

- **COLMAP / SfM Revisited (CVPR 2016)**: 원전. `V = 0.4`로 Colosseum 전체 파이프라인 런타임 36% 단축, 재구성은 동등.
- **Ni et al. (ICCV 2007)**: graph-cut으로 카메라/점을 submap 분할, separator 변수를 교대 최적화. COLMAP이 대체하려는 대상.
- **Kushal & Agarwal (CVPR 2012)**: visibility 패턴으로 reduced camera system을 preconditioning. 같은 관찰(공가시성 = 상호작용 정도)의 다른 활용.
- **Carlone et al. (BMVC 2014)**: 저랭크 점 다수를 하나의 고랭크 factor로 collapse. 카메라가 점을 많이 공유할 때 이득.
- (연결) [[covisibility-count-weighted-supervision]] — 같은 covisibility 통계를 효율이 아니라 supervision 가중에 쓰는 계열.

## Mechanisms

```text
1. 분할
   영향받은 이미지 = 최근 확장에서 추가됨  OR  관측의 비율 eps_r 이상이
                     reprojection error > r  (재triangulate된 카메라 정제용)
     -> 개별 파라미터화 (표준 BA)
   영향받지 않은 이미지 -> 그룹핑 대상

2. 겹침 척도 (binary visibility vector v_i ∈ {0,1}^{N_X})
   V_ab = ||v_a AND v_b|| / ||v_a OR v_b||        # 비트연산 IoU

3. 그룹 구성 (greedy)
   이미지를 ||v_i|| 내림차순 정렬
   첫 이미지 I_a를 빼서 그룹 G_r 시작
   V_ab를 최대화하는 I_b 탐색
     -> V_ab > V  AND  |G_r| < S  이면 G_r에 추가, 아니면 새 그룹 시작
   탐색 비용 절감: 공통 시선 방향 ±beta 이내의 공간 최근접 이웃 K_r개로 후보 제한

4. 파라미터화
   그룹 내 각 이미지를 그룹-로컬 좌표계로 표현
   E_g = sum_j rho_j( ||pi_g(G_r, P_c, X_k) - x_j||² )
   P_cr = P_c G_r          # 회전 합성은 quaternion
   최적화 변수는 G_r ∈ SE(3) 뿐, 그룹 내 P_c는 고정
   전체 비용 = grouped + ungrouped 합
```

**효과의 성질**: 그룹 크기가 2여도 이득이 있고, 문제가 클수록 이득이 커진다. 특히 direct method(카메라 수 3제곱)에서 indirect(1제곱)보다 이득이 크다. `pi_g` 계산 오버헤드가 그룹 크기에 비해 상대적으로 작아지기 때문에 큰 그룹일수록 유리하다.

**측정된 트레이드오프**(COLMAP §5):

| 겹침 임계 `V` | 총 런타임 단축 | 평균 reproj. error |
| --- | --- | --- |
| 표준 BA | — | 0.26px |
| 0.6 | 5% | 0.27px |
| 0.3 | 14% | 0.28px |
| 0.1 | 32% | 0.29px |

`V > 0.3`에서 품질이 사실상 동등하고 그 아래로는 급격히 나빠진다. 즉 **"겹침이 충분히 크면 상대 pose를 고정해도 된다"는 가정에 명확한 경험적 경계가 있다.**

## Failure Modes / Bias

- **`V`가 작아지면 재구성이 저하된다**(`V ≤ 0.3`). 겹침이 작은 카메라를 묶으면 고정된 상대 pose의 오차가 실제로 문제가 된다.
- **Greedy 그룹핑**이라 전역적으로 최적인 분할이 아니다. `||v_i||` 내림차순이라는 휴리스틱 순서에 의존.
- **공간 최근접 + 시선 방향 ±beta 제한은 휴리스틱**이다. 멀리 있지만 같은 구조를 보는(예: 광장 반대편) 카메라 쌍은 후보에서 빠진다.
- **"영향받음" 판정이 임계값 기반**(`eps_r`, `r`)이라, 실제로는 크게 움직여야 할 카메라가 그룹에 갇힐 수 있다.
- **인터넷 사진 컬렉션 전제.** 시점 중복이 크다는 가정에 기대므로, 균일하게 배치된 통제 캡처(Mip-NeRF360, DTU 등)에서는 묶을 게 별로 없어 이득이 작을 것으로 보인다(추론).
- **논문 내 수치 정합성 미확인**: "V=0.3에서 14% 단축"과 "Colosseum에서 V=0.4로 36% 단축"이 서로 다른 측정 대상으로 보이나 명시적 구분이 없다.

## Open Questions

- 3DGS 학습에 같은 발상을 적용할 수 있는가? "겹침이 큰 training view들을 묶어 한 iteration에 하나만 쓰기"는 사실상 view 중복 제거인데, 이게 배경/저관측 영역의 상대적 supervision 비중을 올리는 효과를 내는가?
- `V_ab` 비트연산 IoU는 매우 값싸다. 이 통계를 효율이 아니라 **신뢰도**로 쓰면 — 즉 "이 영역을 보는 뷰들이 서로 얼마나 중복인가"를 measure of effective observation count로 — [[covisibility-count-weighted-supervision]]의 카운트보다 나은 proxy가 되는가? (10장이 거의 같은 시점이면 유효 관측은 10이 아니다)
- 그룹 pose 고정 대신 soft coupling(그룹 내 상대 pose에 강한 prior)을 주면 `V` 경계가 낮아지는가?
- Photogrammetry식 정확한 uncertainty 대신 이런 값싼 대리 지표로 근사하는 패턴(NBV의 [[multiresolution-visibility-pyramid-score]]와 동형)은 GS 쪽 어디에 더 적용 가능한가?

## Related

- [Structure-from-Motion Revisited (COLMAP)](../sources/sfm-revisited-colmap.md)
- [[covisibility-count-weighted-supervision]] — 같은 covisibility 통계, 다른 용도(supervision 가중)
- [[multiresolution-visibility-pyramid-score]] — 같은 논문의 "비싼 계산을 값싼 대리 지표로" 패턴
- [[recursive-ransac-multiview-triangulation]] — track 길이를 늘려 이 단계의 redundancy를 공급하는 상류
