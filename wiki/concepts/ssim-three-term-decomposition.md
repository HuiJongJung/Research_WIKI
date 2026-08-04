---
type: "concept"
slug: "ssim-three-term-decomposition"
title: "SSIM Three-Term Decomposition (Luminance / Contrast / Structure)"
status: "draft"
modified_at: "2026-07-14T00:00:00+09:00"
author: "Claude"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\CoMe - Confidence-Based Mesh Extraction from 3D Gaussians.pdf"
tags:
  - "ssim"
  - "d-ssim"
  - "photometric-loss"
  - "image-quality-assessment"
  - "illumination"
  - "gaussian-splatting"
---

# SSIM (Structural Similarity)

두 이미지가 (사람 눈에) 얼마나 유사한지를 재는 지표. **밝기 / 대비 / 구조 3개 축으로 분해해서** 측정한다.

## Definition

### 세 축의 분해

원본 `x`에서 벗겨내면:

```text
평균 μₓ 그 자체        = 밝기 (luminance)
표준편차 σₓ 그 자체     = 대비 (contrast)
(x − μₓ)/σₓ 로 남는 것  = 구조 (structure)
```

→ 임의로 고른 3개가 아니라 **"벗겨내기"의 결과**라서 3개다.

### 수식 — 세 항은 곱해진다

```text
SSIM = l · c · s            (지수 α=β=γ=1)

l = (2μₓμᵧ + C₁) / (μₓ² + μᵧ² + C₁)     ← 평균만
c = (2σₓσᵧ + C₂) / (σₓ² + σᵧ² + C₂)     ← 표준편차만
s = (σₓᵧ + C₃)   / (σₓσᵧ + C₃)          ← 공분산/(σσ) = 상관계수

C₁,C₂,C₃ = 분모가 0 근처에서 터지는 걸 막는 안정화 상수
```

★ **곱이기 때문에 항마다 독립적으로 입력을 바꿔 끼울 수 있다** (CoMe가 이걸 이용)

※ 구조 "성분"은 `(x−μ)/σ`, 구조 "항" `s`는 두 구조 성분을 비교한 상관계수. 층위가 다름.

### 계산 방식

11×11 Gaussian window(σ=1.5)로 국소 통계를 내고, 이미지 전체에 평균 (Mean SSIM)

## Why It Matters

- **MSE·PSNR은 픽셀을 서로 독립으로 본다** → SSIM은 **국소 이웃 안의 "관계"**를 본다. 인간 시각계가 구조 추출에 특화돼 있다는 관찰(Wang et al. 2004)에서 출발.
- **원래 용도는 화질 평가(IQA)**: *"이 JPEG 압축본이 원본과 얼마나 같나"* → 거기선 밝기 차이 = 진짜 결함이므로 **l이 벌점 주는 게 정상 동작**이다.
- 3DGS가 이걸 **다른 용도**(렌더 vs 사진 비교)로 가져다 쓰면서 문제가 시작된다 — 밝기 차이가 *카메라 탓*일 수 있는데 벌은 Gaussian이 받는다. **도구는 정상, 용도가 바뀐 것.** → [[dssim-luminance-decoupled-appearance]]

## Where It Appears

- **3DGS(Kerbl 2023)부터 표준 photometric loss**. 후속(2DGS·GOF·SOF·MILo·PGSR·Triangle Splatting 등)이 거의 그대로 물려받음.
```text
D-SSIM = 1 − SSIM                           ← loss로 쓰려고 뒤집음
ℒ = (1−λ)·ℒ₁ + λ·ℒ_D-SSIM,   λ = 0.2
```
L1과 섞는 이유: L1만 쓰면 blurry / SSIM만 쓰면 절대 색·밝기가 흐트러짐.
- **CoMe**(2603.24725)가 이걸 **§3.1 Preliminaries**에 둠 = *"다들 아는 기본"*이라는 뜻. 그리고 세 항 분해를 **원형으로 되돌려** l에만 appearance 보정을 투입. → [[come-confidence-based-mesh-extraction]]
- 원전: Wang et al., *Image Quality Assessment: From Error Visibility to Structural Similarity*, IEEE TIP 2004. 해설: Nilsson & Akenine-Möller, *Understanding SSIM* (2020).

## Mechanisms

### ★ 조명을 먹여보면

```text
y = x + b  (더하기)  →   l ✗맞음   c ✓안전   s ✓안전
y = a·x    (곱하기)  →   l ✗맞음   c ✗맞음   s ✓안전

∴ s만 조명 불변. l은 항상 얻어맞는다.
∴ "SSIM은 구조적이다"는 s에만 참인 명제였다.
```

**s가 불변인 이유 = 분모의 정규화.** 공분산만 쓰면 밝기가 2배될 때 공분산도 커져 얻어맞지만, `σₓσᵧ`로 나누면 스케일이 상쇄되어 **"같은 방향으로 움직이는가"만 남는다.**

## Failure Modes / Bias

### 함정 — 흔히 보는 공식은 세 항을 "접은" 것

```text
α=β=γ=1, C₃=C₂/2 이면 c·s가 합쳐져서:
SSIM = [(2μₓμᵧ+C₁)(2σₓᵧ+C₂)] / [(μₓ²+μᵧ²+C₁)(σₓ²+σᵧ²+C₂)]
```

- **세 항 분해가 원형이고, 이건 접은 버전이다.** 다들 접힌 형태로만 보니 **안에 l이 있다는 걸 잊었다.** CoMe는 새로 쪼갠 게 아니라 원형으로 되돌린 것뿐.
- **이름이 만든 오독**: "Structural Similarity"라는 이름 때문에 "구조만 보는 지표"로 통용됨. 그 통념 위에서 *"SSIM is inherently more structural"*(CoMe p.6 인용)이라는 **틀린 논증**으로 D-SSIM에 appearance 보정을 안 넣는 관행이 굳었다. 무지가 아니라 **검산 안 한 논증**.
- **실측 귀결**: 보정 없는 l 항은 조명 노이즈만 물고 있어 **무용지물**이었다 — D-SSIM에서 l을 통째로 제거해도 성능 동일(CoMe Table 4: `w/o l(·)` 0.483 vs `VastG.(Imp.)` 0.484).

## Open Questions

- λ=0.2와 세 항 지수(α=β=γ=1)는 3DGS 세팅에서 검증된 적이 있는가? IQA용 기본값을 그대로 물려받은 것 아닌가?
- c의 오차가 세 항 중 가장 큰데(CoMe Fig.2: 0.167) 보정으로 안 줄어든다 = 대부분 **진짜 재구성 오차**다. 여기에 손댈 방법이 있는가?
- 11×11 window가 렌더링 세팅에 최적인가? (원래는 자연 이미지 IQA용 기본값)
- SSIM 대신 다른 지각 지표(LPIPS 등)를 loss 항으로 쓰면 같은 조명 취약성이 생기는가?
