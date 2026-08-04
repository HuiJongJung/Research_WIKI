---
type: "concept"
slug: "covisibility-count-weighted-supervision"
title: "Covisibility Count 가중 Supervision"
status: "draft"
modified_at: "2026-07-28T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\CoMapGS.pdf"
tags:
  - "covisibility"
  - "observation-count"
  - "adaptive-supervision"
  - "uncertainty"
  - "sparse-view-synthesis"
---

# Covisibility Count 가중 Supervision

## Definition

픽셀(또는 3D 위치의 투영점)이 **몇 개의 훈련 뷰에서 관측되는가**를 세어 만든 count 필드(covisibility map)를 supervision 항의 가중치로 쓰는 메커니즘. binary visibility mask와 달리 관측 "개수"를 보존하므로, 영역별 constraint 강도의 연속적 프록시가 된다.

## Why It Matters

Photometric loss는 구조적으로 자주 보이는 영역을 더 많이 supervise한다(뷰마다 loss에 등장하는 횟수 자체가 다름). 이 불균형은 명시적으로 보정하지 않으면 저관측 영역의 체계적 붕괴로 나타난다. Covisibility count는 이 불균형을 **a-priori로**(잔차를 보기 전에, 데이터 기하만으로) 정량화할 수 있는 가장 값싼 신호 중 하나다. "Sparse함"을 뷰 개수가 아니라 영역별 covisibility로 재정의하는 관점(CoMapGS Discussion, DyCheck EMF)도 이 개념의 연장.

## Where It Appears

- **CoMapGS (CVPR 2025)**: MASt3R dense correspondence로 M_i(x,y)=Σδ 카운트 맵 구성, proximity loss 가중 w_in=1/(M+1)로 저관측 영역 supervision 강화 + scene 평균 covisibility S로 frustum 밖 가중 w_out 조절. 원전.
- **DyCheck (NeurIPS 2022)**: binary covisibility mask로 동적 NVS의 공정 "평가"에 사용 — supervision이 아닌 평가용, count 아님.
- **NeRFVS**: view coverage map으로 저커버리지 영역 규제 강화 — dense video 입력 전제.
- **InfoNorm (ECCV 2024)**: 상관 높은 장면 점들의 mutual information으로 normal 규제 — 구조화 장면 국소 영역 한정.
- (연결) 내 메인 연구의 SfM observation field(H1a) — dense-view mesh recon 무대에서의 관측 카운트 필드.

## Mechanisms

1. **Count 수집**: 각 뷰 픽셀마다 다른 뷰들과의 dense correspondence 매칭 존재 여부를 누적 (M ∈ {0..n−1}). morphological 연산으로 노이즈 정제.
2. **역가중(복원 방향)**: w = 1/(M+1) — 관측 많은 영역은 photometric supervision이 이미 충분하므로 보조 loss(기하 prior)를 약하게, mono-view(M=0) 영역은 최대로. CoMapGS의 선택.
3. **Scene-level 통계 활용**: S=AVG(M)로 장면 전체의 관측 균형도를 재고, 고균형 장면에서만 frustum 밖 supervision을 켬 — 픽셀 단위와 장면 단위 두 층으로 사용.
4. **초기화와의 결합**: count 맵으로 mono-view 영역을 식별해 point cloud 주입 대상을 정함 — supervision 가중 단독으로는 초기 앵커가 없으면 무효라는 것이 CoMapGS Table 3의 핵심 교훈.

## Failure Modes / Bias

- **Count ≠ constraint 품질**: 같은 count라도 baseline이 좁으면(카메라가 몰려 있으면) 기하 constraint는 여전히 약함. 각도 다양성·거리·블러를 무시하는 순수 카운트의 근본 한계 (DyCheck EMF가 지적하는 지점).
- **Correspondence 모델 의존**: MASt3R가 틀리면 count 자체가 오염 — 무텍스처·반복 패턴에서 위험. CoMapGS는 재투영 오차 검증으로 완화.
- **투영 기준의 순환성**: 잘못 위치한 primitive가 고covisibility 영역에 투영되면 오히려 약한 supervision을 받음.
- **부호 선택 문제**: 저관측 영역을 "강화"(CoMapGS: prior 주입)할지 "불신"(CoMe류: photometric 주장 discount)할지는 무대에 따라 다름 — 화질 복원 vs 기하 신뢰도라는 목적 차이가 부호를 가른다.

## Open Questions

- count의 공간 gradient(관측 절벽)가 배경 mesh 붕괴 위치를 예측하는가? — 내 H1 실험과 직결.
- 관측 count에 각도 다양성/베이스라인을 곱한 "effective observation" 필드가 순수 count보다 나은가?
- dense-view에서도 count 불균형이 성능 병목인가, 아니면 sparse 전용 신호인가?

## Related WIKI Pages

- [comapgs-covisibility-sparse-view-synthesis](../sources/comapgs-covisibility-sparse-view-synthesis.md)
- [photometric-primary-geometry-underconstraint](photometric-primary-geometry-underconstraint.md)
- [learned-confidence-photometric-geometric-balancing](learned-confidence-photometric-geometric-balancing.md) — a-posteriori(잔차 기반) 대응물
- [confidence-steered-densification](confidence-steered-densification.md)
- [proximity-classifier-geometry-prior](proximity-classifier-geometry-prior.md)
