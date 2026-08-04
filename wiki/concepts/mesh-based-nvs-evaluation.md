---
type: "concept"
slug: "mesh-based-nvs-evaluation"
title: "Mesh-Based Novel View Synthesis Evaluation"
status: "draft"
modified_at: "2026-07-01T11:20:00+09:00"
author: "Claude"
language: "ko"
confidence: "medium"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\MILo.pdf"
tags:
  - "evaluation-protocol"
  - "mesh-quality"
  - "novel-view-synthesis"
  - "surface-reconstruction"
---

# Mesh-Based Novel View Synthesis Evaluation

## Definition
GT 3D geometry가 없는 영역(특히 background)에서 mesh 품질을 평가하기 위한 **proxy metric**. 추출된 mesh를 rasterize하고 색을 입혀 test view를 렌더한 뒤 GT 이미지와 비교(PSNR/SSIM/LPIPS)한다. 핵심 가정은 "geometry가 좋을수록 mesh 기반 rendering도 좋다".

## Why It Matters
- **background 평가 공백:** DTU·Tanks&Temples는 foreground에만 GT geometry를 줘서 full-scene(배경 포함) mesh를 정량 평가할 방법이 없었다.
- **artifact·completeness 포착:** erosion/inflation, 누락된 geometry, 배경 재구성 품질을 이미지 오차로 간접 측정.
- **해상도-색 분리:** vertex color 대신 neural color field로 텍스처링하면 sparse하지만 정확한 mesh가 색 해상도 때문에 불이익 받는 편향을 제거한다.

## Where It Appears
- [[milo]] (MILo, §6.3): nvdiffrast로 mesh rasterize → 각 pixel의 backprojected 3D 점을 **neural color field `F_color:R³→[0,1]³`**(TensoRF backbone, 5k iter)로 질의해 색 결정 → test view 렌더 후 GT와 비교. Table 4에서 이 metric 순위가 T&T의 GT-based F1 순위와 잘 정렬됨을 보임.
- 뿌리: surface-based view synthesis 평가(Binary Opacity Grids 등 mesh-based rendering 계열)에서 착안.

## Mechanisms
1. **rasterization:** 평가할 mesh를 test 카메라로 rasterize, 각 pixel에 삼각형 교차점.
2. **backprojection:** depth로 pixel의 3D surface 점 `P`를 복원.
3. **neural texturing:** `F_color(P)`로 색을 얻음 — mesh 해상도와 독립.
4. **학습/비교:** training view로만 color field 학습 후 test view 렌더, PSNR/SSIM/LPIPS로 GT와 비교.

## Failure Modes / Bias
- **dense test view 가정:** sparse test set에서는 좋은 mesh-rendering이 좋은 geometry를 보장하지 않는다(저자 명시).
- **color field가 geometry 오차를 가림:** 강력한 neural texture가 약간의 geometry 오차를 시각적으로 보정해 metric을 관대하게 만들 수 있다.
- **간접성:** 결국 rendering metric이라 geometry의 국소 오차(예: 내부 cavity)를 직접 재지 못함.
- **미성숙:** 저자도 "초기 시도"라 명시 — 표준화된 surface-이미지 정렬 protocol 부재.

## Open Questions
- sparse-view에서도 신뢰할 수 있게 만들려면 어떤 정규화·view 선택이 필요한가?
- geometry 오차를 color field가 흡수하지 못하게 하는 제약(예: 고정/저용량 texture)은?
- 이 proxy를 GT-based Chamfer/F1과 결합한 복합 지표가 더 안정적인가?
