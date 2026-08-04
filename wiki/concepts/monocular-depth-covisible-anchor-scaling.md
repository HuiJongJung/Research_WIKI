---
type: "concept"
slug: "monocular-depth-covisible-anchor-scaling"
title: "Covisible Anchor 기반 Mono-Depth 스케일 정렬"
status: "draft"
modified_at: "2026-07-28T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\CoMapGS.pdf"
tags:
  - "monocular-depth"
  - "scale-alignment"
  - "point-cloud-initialization"
  - "mono-view-regions"
  - "sparse-view-synthesis"
---

# Covisible Anchor 기반 Mono-Depth 스케일 정렬

## Definition

Monocular depth를 unproject한 점들(스케일 임의)을, **다수 뷰에서 관측되어 metric 스케일이 확정된 anchor 점들**(삼각측량 점)과 겹치는 covisible 영역에서 회귀시켜 스케일 변환 f_scale을 학습하고, 그 변환을 anchor가 없는 mono-view 영역의 점들에 외삽 적용하는 메커니즘. "multiview가 보증하는 곳에서 배운 스케일을 multiview가 못 미치는 곳으로 넘긴다"는 구조.

## Why It Matters

Mono-view 영역은 삼각측량이 원리적으로 불가능해 기하 정보를 mono depth prior에 의존할 수밖에 없는데, mono depth의 최대 약점이 스케일 불확정성이다. covisible 영역을 supervision 삼는 이 패턴은 별도 GT 없이 스케일 문제를 해소하고, COLMAP 좌표계에 정렬된 점들을 저관측 영역까지 주입할 수 있게 한다. CoMapGS ablation에서 supervision 가중 단독은 무효였고 이 초기화 보강이 결합되어야 효과가 났다는 점에서, 저관측 영역 복원의 **전제 조건** 역할.

## Where It Appears

- **CoMapGS (CVPR 2025)**: f_scale(P_d^low) ≈ P_u^low 를 anisotropic linear regression으로 학습(Eq.3), M=0 영역 점 P_d^high에 적용(Eq.5)해 P_final 구성. Metric3D v2 depth + MASt3R 삼각측량 anchor. 재투영 오차 ≤2px 검증으로 anchor 오염 방지 (보충 E.1).
- (인접 계열) DNGaussian, FSGS 등 depth 규제 sparse-GS — depth를 loss로 쓰지만 대개 상대적 depth ranking/정규화로 스케일 문제를 회피, 점 주입용 metric 정렬은 아님.
- (인접 계열) MASt3R/DUSt3R 자체의 metric 정렬 — 모델 내부 스케일 추정 vs CoMapGS는 COLMAP 좌표계 기준 외부 정렬.

## Mechanisms

1. **Anchor 선택**: P_u(COLMAP+삼각측량 병합 PCL)를 각 뷰에 투영해 M≥1인 점만 P_u^low로 선택 — "multiview 검증을 통과한 점"만 GT 역할.
2. **회귀**: 같은 픽셀에 대응하는 unprojected mono 점과 anchor 점 쌍으로 linear regression — anisotropic(축별) 스케일 허용.
3. **외삽**: 학습된 f_scale을 M=0 영역 점에 적용 — mono-view 영역이 같은 좌표계·스케일로 편입됨.
4. **검증 게이트**: anchor 자체를 재투영 오차로 필터링해 correspondence 오류 전파 차단.

## Failure Modes / Bias

- **외삽 가정의 취약성**: covisible 영역에서 배운 선형 스케일이 mono-view 영역에서도 유효하다는 가정 — depth 모델의 오류가 영역별로 불균질하면(근경은 정확, 원경 과소평가 등) 외삽이 계통 오차를 주입. (모델 추론)
- **무구조 환경**: DTU처럼 배경이 검고 무텍스처면 depth 예측·COLMAP 포즈 둘 다 무너져 anchor도 mono 점도 신뢰 불가 (CoMapGS 명시 한계).
- **하늘/무한대 기하**: 무한대로 투영되는 배경은 선형 스케일 정렬의 정의역 밖 (CoMapGS 명시 한계).
- 선형 변환의 표현력 한계 — depth 왜곡이 비선형이면(렌즈·모델 bias) 잔여 오차 존재. (모델 추론)

## Open Questions

- 전역 선형 대신 국소(공간 가변) 스케일 필드로 확장하면 외삽 오차가 줄어드는가?
- mesh recon에서 배경 영역 초기 기하 주입에 같은 패턴을 쓸 수 있는가 — anchor를 SfM track 기반으로 대체한다면?
- 스케일 정렬 실패를 사전 감지하는 신호(회귀 잔차의 공간 분포)가 있는가?

## Related WIKI Pages

- [comapgs-covisibility-sparse-view-synthesis](../sources/comapgs-covisibility-sparse-view-synthesis.md)
- [covisibility-count-weighted-supervision](covisibility-count-weighted-supervision.md)
- [rendered-depth-normal-supervision](rendered-depth-normal-supervision.md) — depth를 loss로 쓰는 인접 계열
