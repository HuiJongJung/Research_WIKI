---
type: "concept"
slug: "dssim-luminance-decoupled-appearance"
title: "D-SSIM Luminance-Decoupled Appearance"
status: "draft"
modified_at: "2026-07-14T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\CoMe - Confidence-Based Mesh Extraction from 3D Gaussians.pdf"
tags:
  - "appearance-embedding"
  - "d-ssim"
  - "illumination"
  - "exposure"
  - "gaussian-splatting"
  - "surface-reconstruction"
---

# D-SSIM Luminance-Decoupled Appearance

## Definition
D-SSIM 손실을 luminance·contrast·structure 세 항으로 분해했을 때, **조명에 지배되는 luminance 항에만 appearance-보정 이미지 `Î_app`를 투입**하고 contrast·structure에는 원본 렌더 `Î`를 쓰는 appearance 모델링 기법. CoMe의 수식: `ℒ_D-SSIM^dec = 1 − l(I, Î_app)·c(I, Î)·s(I, Î)`.

> 전제가 되는 SSIM 자체의 원리(세 항 분해의 유래·수식·조명 불변성 표·"접힌 공식" 함정)는 [[ssim-three-term-decomposition]]에 있다. 요약: **s만 조명 불변, l은 항상 얻어맞음** → "SSIM은 구조적이다"는 s에만 참인 명제였다.

## Why It Matters
카메라별 ISP(노출·비네팅·색보정)를 3DGS point cloud가 흡수하면 mesh 품질이 나빠진다. 기존 관행(VastGaussian·PGSR)은 보정 이미지를 L1 항에만 쓰고 D-SSIM엔 "SSIM은 구조적"이라는 이유로 원본을 썼다. 그러나 D-SSIM의 **luminance 항은 실제로는 조명 변화에 지배되는 비구조적 항**이다(CoMe Fig.2: appearance embedding으로 luminance error 9× 감소). luminance만 보정하고 조명 불변인 contrast·structure는 원본을 쓰면, appearance 모델이 잘못된 렌더를 보상하는 오염을 막아 표면 재구성 지표가 크게 오른다.

## Why It Matters (연결)
표면 추출은 "일관된 3D scene 표현"에 의존하므로, appearance 보정을 어느 loss 항에 어떻게 넣느냐가 mesh 품질에 직결된다. CoMe에서는 이 조각 하나만으로 SOF baseline이 MILo를 능가했다(Table 3).

## Where It Appears
- **CoMe**(2603.24725): Eq.8. VastGaussian embedding 개선(sigmoid→exp activation, zero-init, ds32 detach, reflection-padding, u/v/r positional encoding으로 비네팅 보상, fused CUDA 5×). Table 4에서 "w/o SSIM Decoupling"보다 "Ours(contrast·structure에 원본)"가 더 강함. → [[come-confidence-based-mesh-extraction]]
- 계보: NeRF-in-the-Wild(GLO latent), VastGaussian/H3DGS(per-image affine), PGSR(exp(a)·render+b), PPISP(물리 기반 ISP). CoMe는 이 embedding들을 mesh 추출 관점에서 분석·개선.

## Mechanisms
- **항별 선택 투입**: luminance l(·)에만 Î_app, contrast c(·)·structure s(·)에는 Î. 조명 불변 항에 보정 이미지를 넣으면 CNN 업샘플 artifact가 gradient를 오염시키므로 배제.
- **embedding 구조**: per-image latent ρ_i(R^64) + downsampled render를 CNN에 넣어 per-channel corrective mapping M_i 예측 → σ(M_i) 또는 exp로 렌더 변환. Î_app는 gradient가 3DGS로 역전파되지 않게 입력을 detach.
- **inference vs reconstruction 목적 구분**: PPISP류는 NVS(inference)를 겨냥하지만, 이 기법은 "camera-dependent 효과를 설명해 3D 일관성을 확보"하는 재구성 목적.

## Failure Modes / Bias
- luminance-only 보정이라 chromaticity가 심하게 변하는 in-the-wild 데이터는 부분적으로만 보상(H3DGS의 full affine이 색 채널별 스케일에 유리).
- CNN 기반 embedding은 업샘플 artifact 위험 — 잘못된 항에 넣으면 gradient 오염.
- appearance 모델이 과강하면 잘못된 geometry를 색으로 덮어 photometric ambiguity를 오히려 은폐할 수 있음.

## Open Questions
- luminance/contrast/structure 분해가 아닌 다른 지표 분해에서도 "조명 지배 항만 보정" 원리가 유효한가?
- appearance 보정과 photometric confidence를 함께 쓸 때 서로의 신호를 교란하지 않는가?
- 심한 조명 변화(주야·계절) 하에서 per-image latent가 geometry로 새는 것을 어떻게 막는가?
