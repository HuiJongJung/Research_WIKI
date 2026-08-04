---
type: "concept"
slug: "recursive-ransac-multiview-triangulation"
title: "Recursive RANSAC Multi-View Triangulation"
status: "draft"
modified_at: "2026-08-04T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/SfM.pdf"
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\SfM.pdf"
tags:
  - "triangulation"
  - "ransac"
  - "feature-track"
  - "outlier-robustness"
  - "track-length"
  - "structure-from-motion"
---

# Recursive RANSAC Multi-View Triangulation

## Definition

Outlier 비율이 매우 높은 feature track에서 3D 점을 복원할 때, (a) two-view triangulation을 minimal model로 하는 RANSAC으로 consensus set을 찾고, (b) **찾은 consensus set을 제거한 뒤 남은 measurement로 재귀 반복**해서, 하나의 track에 잘못 병합된 여러 독립 점을 분리 복원하는 메커니즘.

## Why It Matters

Feature track은 two-view correspondence를 이어 붙여 만든다. 이렇게 하면 baseline이 큰 뷰 쌍까지 연결되어 triangulation이 정확해지지만, **한 번의 잘못된 매치가 서로 다른 두 3D 점의 track을 통째로 병합**한다. 길이가 같은 4개 track이 잘못 합쳐지면 outlier 비율은 75%가 된다. COLMAP이 Dubrovnik에서 측정한 track outlier 비율 분포는 0부터 1까지 넓게 퍼져 있다.

이 상황에서 기존 multi-view triangulation(L∞ 최소화, QCQP, optimal inlier selection 등)은 두 가지로 부족하다. 첫째, 그 정도의 outlier 비율을 감당 못 한다. 둘째 — 더 중요하게 — **"이 track에는 점이 하나"라는 가정 자체가 틀렸다**. 병합된 track에서는 점이 여러 개다. 재귀가 필요한 이유가 여기 있다.

결과적으로 이 메커니즘은 **track 길이를 늘린다**. 그리고 track 길이는 곧 BA에 들어가는 redundancy이고, 3D 점 하나가 받는 constraint의 개수다.

## Where It Appears

- **COLMAP / SfM Revisited (CVPR 2016)**: 원전. Dubrovnik 2.9M track에서 Bundler 대비 점 713,824 → 906,501, 평균 track 길이 7.824 → 8.795.
- **Bundler (Snavely)**: 대조군. track 원소의 모든 쌍을 exhaustive하게 two-view triangulate하고, 충분한 각도의 해가 하나라도 있으면 전체 track으로 multi-view triangulation 후 cheirality 검사. → 병합된 점을 분리 못 하고 조합 폭발.
- **Kang et al. (Pattern Recognition 2014), Li (CVPR 2007), Olsson et al. (CVPR 2010)**: outlier에 어느 정도 강한 multi-view triangulation 계열. COLMAP은 이들이 높은 outlier 비율을 감당 못 한다고 지적.
- (연결) 3DGS 초기화 — COLMAP sparse point cloud의 점 개수와 track 길이 분포가 이 메커니즘의 직접 산물이다.

## Mechanisms

```text
입력: feature track T = {T_n},  T_n = (정규화 관측 x̄_n, 카메라 pose P_n)
      사전 inlier 비율 미상

repeat:
  RANSAC:
    1. unique한 minimal set(크기 2) 샘플링      # 작은 N_T에서 중복 샘플 방지
    2. X_ab ~ tau(x̄_a, x̄_b, P_a, P_b)           # tau = DLT
       - panoramic으로 라벨된 쌍은 제외
    3. well-conditioned 검사:
         (i)  triangulation angle alpha 충분      # 실험값 alpha = 2도
         (ii) 두 뷰에서 depth > 0 (cheirality)
    4. 각 T_n이 모델에 부합하는지:
         depth d_n > 0  AND  reprojection error e_n < t   # 실험값 t = 8px
    5. 반복 횟수 K: 초기 inlier 비율 eps_0 = 0.03로 시작,
       더 큰 consensus set을 찾을 때마다 K를 적응적으로 갱신 (adaptive stopping)

  consensus set을 결과 점으로 확정하고 T에서 제거
until  최신 consensus set 크기 < 3
```

**세 가지 설계 결정과 그 이유.**

1. **Minimal set = 2 (two-view)**: multi-view를 minimal model로 쓰면 샘플이 커져 RANSAC 반복이 폭증한다. two-view로 가설을 만들고 나머지는 검증만 한다.
2. **Unique sampler**: `N_T`가 작으면 균등 랜덤 샘플링이 같은 쌍을 반복 뽑는다. 중복 제거로 짧은 track에서도 효율을 유지.
3. **Adaptive stopping**: 사전 inlier 비율을 모르므로 작게 시작해(`eps_0 = 0.03`) 낙관적으로 갱신한다. 이게 exhaustive 대비 10–40배 속도차의 주 원인.

**재귀가 실제로 하는 일**(Table 2로 확인 가능): exhaustive 기준 non-recursive 861,591점 → recursive 894,294점. 즉 3만 개 이상의 점이 "병합된 track에서 분리 복원"된 것이다. RANSAC 계열에서는 `eta`를 낮출수록(0.5) track이 조금 짧아지는 대신 점 개수는 오히려 가장 많아진다(906,501) — 느슨한 consensus가 track을 더 잘게 쪼개기 때문.

## Failure Modes / Bias

- **`t = 8px`는 관대한 임계**다. 부정확한 pose로 인한 오차를 흡수하려는 선택으로 보이나(추론), 그만큼 잘못된 관측이 consensus에 들어올 여지가 있다. 이후 BA filtering이 이를 다시 정리하는 구조.
- **`alpha = 2°`는 hard gating**이다. baseline이 작은 영역(원거리 배경, 좁은 궤적 캡처)의 점은 아예 만들어지지 않는다 → 그 영역이 하류 3DGS에서 초기점 없이 시작하게 되는 직접 원인.
- **재귀 정지 조건이 크기 3**이라 2-view만으로 관측되는 실제 점은 버려진다.
- **속도/완전성 트레이드오프가 `eta` 하나에 걸려 있다.** 낮추면 빠르지만 track이 짧아져 BA redundancy가 준다. 논문은 "marginally inferior"라 하지만 최종 재구성 품질에 미치는 영향은 분리 측정되지 않았다.
- **Pose가 부정확한 초기 단계에서는 모든 판정이 오염된다.** 그래서 COLMAP은 BA 후 re-triangulation(post-BA RT)으로 이 단계를 다시 돌린다 — 즉 이 메커니즘 단독으로는 완결되지 않고 반복 정제와 짝을 이룬다.
- **RANSAC 특유의 비결정성**: 같은 입력에 대해 실행마다 결과가 미세하게 달라진다. 3DGS 실험의 재현성에 영향(추론).

## Open Questions

- Track 길이를 3DGS/mesh reconstruction의 per-point 신뢰도로 직접 쓸 수 있는가? COLMAP이 track 길이를 핵심 품질 지표로 취급한다는 사실은 그 해석에 근거를 준다.
- Track 길이 vs median triangulation angle — 어느 쪽이 under-constrained 영역을 더 잘 예측하는가? 전자는 "몇 번 봤나", 후자는 "얼마나 유용하게 봤나"다.
- `alpha = 2°` 미만이라 버려진 관측은 어디로 가는가? 그 관측들이야말로 "photometric으로는 보이지만 geometric으로는 제약이 없는" 영역의 지표 아닌가? — [[photometric-primary-geometry-underconstraint]]의 상류 증거로 쓸 수 있는지.
- 학습 기반 dense matcher(MASt3R 등)로 track을 만들면 outlier 비율 분포가 어떻게 바뀌고, 재귀 분리가 여전히 필요한가?
- 재귀를 "여러 점으로 분리"가 아니라 "하나의 점 + 불확실성"으로 바꾸면(soft assignment) 하류 GS 초기화에 더 유용한 정보가 되는가?

## Related

- [Structure-from-Motion Revisited (COLMAP)](../sources/sfm-revisited-colmap.md)
- [[scene-graph-augmentation-two-view-model-selection]] — panoramic 배제 규칙의 공급원
- [[covisibility-grouped-bundle-adjustment]] — 같은 파이프라인의 하류, track 길이가 redundancy로 바뀌는 곳
- [[covisibility-count-weighted-supervision]] — 관측 카운트를 신뢰도로 쓰는 계열
- [[photometric-primary-geometry-underconstraint]] — geometric constraint 부재의 하류 결과
