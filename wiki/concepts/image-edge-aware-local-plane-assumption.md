---
type: "concept"
slug: "image-edge-aware-local-plane-assumption"
title: "이미지 에지 인지 로컬 평면 가정 (Image-Edge-Aware Local Plane Assumption)"
status: "draft"
modified_at: "2026-08-19T18:37:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\PGSR_Planar-based Gaussian Splatting for Efficient.pdf"
tags:
  - "single-view-regularization"
  - "local-planarity"
  - "normal-consistency"
  - "edge-aware-weighting"
  - "concavity-failure"
---

# 이미지 에지 인지 로컬 평면 가정

## Definition

이웃 픽셀들이 같은 평면 위에 있다고 가정해 깊이에서 유도한 법선과 렌더 법선을 맞추되, **이미지 gradient가 큰 곳에서는 그 가정을 완화**하는 단일 뷰 정규화 (PGSR Eq. 5·6, p.6).

```
N_d(p) = (P1−P0) × (P3−P2) / |·|                       상하좌우 4점에서 유도한 법선
L_svgeom = (1/W) Σ_p (1 − ∇I)² ‖N_d(p) − N(p)‖₁        ∇I: 0~1로 정규화된 이미지 gradient
```

기하 에지에서는 로컬 평면 가정이 깨지므로 감독을 약하게 걸어야 하는데, 기하 에지를 알 방법이 없으니 **이미지 에지로 대리**한다.

## Why It Matters

- 다중 뷰 정보 없이 단일 뷰만으로 초기 기하 정확도를 확보하는 가장 값싼 수단. PGSR ablation에서 제거 시 TnT F1 0.52 → 0.49
- 그러나 이 항이 단독으로는 **고반사 금속 물체에 구멍을 만든다** (Fig. I2b, p.14). 정규화가 기하를 개선하면서 동시에 파괴할 수 있음을 보이는 사례
- **감독 가중을 무엇으로 정하는가**의 전형적 답이 여기 있다: 이미지 gradient. 우리 연구가 이 자리를 촬영 기하 판별값으로 대체하려는 대상 자체

## Where It Appears

- **PGSR** (TVCG 2024): Eq. 6. edge-aware 제거 시 0.52 → 0.51(소폭)이지만 Fig. I1에서 디테일 보존 효과가 시각적으로 확인됨
- 단안 깊이·법선 추정 계열의 관행 계승 (PGSR이 GeoNet, Adaptive Surface Normal Constraint를 인용원으로 든다)
- 인접 개념: [[rendered-depth-normal-supervision]], [[volume-surface-consistency-regularization]], [[amorphous-local-regularizer]]

## Mechanisms

1. **대리 신호**: 기하 불연속 ↔ 광도 불연속의 상관에 기댄다. 두 신호가 일치할 때만 완화가 옳은 자리에 걸린다.
2. **제곱 가중**: `(1−∇I)²`은 gradient가 조금만 있어도 가중을 빠르게 떨어뜨린다 — 완화 쪽으로 보수적이다.
3. **4점 유한차분**: 법선을 이웃 4픽셀의 외적으로 만들므로 해상도 한 픽셀 단위의 곡률만 잡히고, 그보다 완만한 굴곡은 평면으로 취급된다.
4. **자기감독**: 감독 신호가 자기 깊이에서 나온다. 외부 GT나 prior 없이 depth–normal 정합만 강제한다 — 틀린 기하도 자기일관적이면 통과한다.

## Failure Modes / Bias

- **텍스처 없는 오목**: 매끈한 오목 접힘은 `∇I ≈ 0`이므로 가중이 1에 가깝게 유지된다. 완화가 안 걸리고 평면 가정이 그대로 걸려 **오목을 눌러 편다.** hole·오목 무대에서 이 항이 구조적 위험이 되는 지점
- **텍스처 있는 평면**: 그림·무늬가 있는 평평한 벽은 `∇I`가 커서 감독이 약해진다 — 정확히 잡을 수 있는 곳에서 감독을 놓친다
- **자기일관성의 함정**: depth와 normal이 서로 맞기만 하면 되므로, **틀린 기하를 매끄럽게 굳힐 수 있다.** 관측이 부족한 영역에서 이 항은 오류를 고정한다
- 단독 사용 시 고반사면에 구멍 (Fig. I2b). 반사로 인한 깊이 불일치가 법선 감독에 그대로 전달됨

## Open Questions

1. `(1−∇I)²`를 촬영 기하 기반 confidence로 **대체**했을 때와 **곱했을 때**의 차이는? 두 신호는 독립인가
2. 텍스처 없는 오목에서의 과평탄화를 실측으로 분리할 수 있는가 — 오목 부위 곡률 오차를 텍스처 강도로 층화해 보면 나올 것
3. 4점 템플릿을 넓히면(예: 8점·다중 스케일) 완만한 오목이 잡히는가, 아니면 노이즈만 늘어나는가
