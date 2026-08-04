---
type: "concept"
slug: "proximity-classifier-geometry-prior"
title: "Proximity Classifier 기하 Prior (Frustum 독립 supervision)"
status: "draft"
modified_at: "2026-07-28T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\CoMapGS.pdf"
tags:
  - "geometry-prior"
  - "mlp-classifier"
  - "proximity-loss"
  - "frustum-independent-supervision"
  - "gaussian-splatting"
---

# Proximity Classifier 기하 Prior (Frustum 독립 supervision)

## Definition

큐레이션된 scene point cloud를 positive, 원거리 random 점을 negative로 학습한 경량 MLP f_p: R³→[0,1]로 임의 3D 위치의 "장면 기하 근접도" score를 출력하게 하고, primitive(Gaussian) 위치에 (1−s) 페널티를 부여하는 기하 prior. 핵심 성질은 **가시성과 무관하게** 모든 primitive에 작용한다는 것.

## Why It Matters

Photometric/depth loss는 래스터화를 거치므로 현재 뷰 frustum 안에 투영되는 primitive만 gradient를 받는다. 즉 "보이지 않는 곳"은 supervision 사각지대다. 위치만 입력받는 MLP prior는 이 구조적 한계를 우회해, frustum 밖·저관측 영역의 primitive에도 기하 정렬 압력을 가할 수 있다. 잘못 위치한 primitive를 초기화·densification이 만든 정상 점들을 훼손하지 않으면서 선별적으로 penalize한다 (CoMapGS 보충 C.2).

## Where It Appears

- **CoMapGS (CVPR 2025)**: P_final(보강된 초기 PCL) 기반 3-layer MLP(3→128→128→1, ReLU+sigmoid, BCE, Adam lr 0.001, scene당 1000 iter, 학습 ~28s). covisibility 가중과 결합해 L_p 구성. 매 iteration 전체 Gaussian에 batch 실행(+5.36m 오버헤드).
- (유사 구조) SDF/occupancy 기반 규제들 — 연속 필드로 기하를 요약해 primitive를 끌어당기는 계열. 단 CoMapGS는 SDF처럼 거리값 회귀가 아닌 근접 "분류"로 단순화.
- (평가 용도) CoMapGS 보충 A: 학습된 f_p를 **재구성 기하 정합성의 사후 진단 도구**로도 사용 (Gaussian 위치 blue/red 분류 시각화, Fig. 7-8).

## Mechanisms

1. **데이터 생성**: positive = 보강 PCL 점(장면 기하 대표), negative = P_final에서 멀리 떨어지도록 제약된 random 점. 좋은 prior의 전제는 좋은 PCL — 초기화 품질에 종속.
2. **Loss 결합**: L_p = (1/|G|) Σ w(g)·(1−f_p(g)). 가중 w는 frustum 내면 covisibility 역수, 밖이면 scene-level 가중 — prior 강도를 다른 신호로 변조하는 조합 가능 구조.
3. **진단 재사용**: 동일 classifier(더 많은 뷰로 학습)를 threshold 0.5로 잘라 재구성 결과의 기하 이탈을 시각화 — 학습용 prior와 평가용 지표의 겸용.

## Failure Modes / Bias

- **PCL 품질 종속**: positive 셋이 오염되면(depth 오류 등) prior가 잘못된 기하를 강화. CoMapGS의 DTU 실패가 이 경로 (mono-view 영역의 잘못된 depth → 잘못된 P_final → 잘못된 prior).
- **분류 vs 거리**: 근접 "분류"라 표면까지의 거리 정보가 없음 — 표면 세밀 정렬(mesh recon 수준)에는 해상도 부족 가능. (모델 추론)
- **정적 prior**: 훈련 중 f_p는 고정 — Gaussian 분포가 진화해도 prior는 초기 PCL 시점에 머묾. 초기 PCL이 놓친 실제 구조는 계속 penalize됨. (모델 추론)
- 매 iter 전체 Gaussian 평가 비용 — 대규모 장면에서 스케일 문제 가능.

## Open Questions

- mesh recon에서 f_p를 SDF/occupancy prior로 바꾸면 (MILo의 mesh-in-the-loop과 결합해) frustum 밖 배경 기하 규제로 쓸 수 있는가?
- prior를 훈련 중 주기적으로 재학습(EM식 교대)하면 정적 prior 문제가 해소되는가?
- 관측 통계로 prior 강도를 변조하는 CoMapGS 패턴을 confidence field로 일반화하면?

## Related WIKI Pages

- [comapgs-covisibility-sparse-view-synthesis](../sources/comapgs-covisibility-sparse-view-synthesis.md)
- [covisibility-count-weighted-supervision](covisibility-count-weighted-supervision.md)
- [gaussian-pivots-learnable-sdf](gaussian-pivots-learnable-sdf.md) — 연속 필드로 기하를 요약하는 인접 계열
- [mesh-in-the-loop-differentiable-extraction](mesh-in-the-loop-differentiable-extraction.md)
