---
type: "concept"
slug: "opaque-triangle-training-schedule"
title: "Opaque Triangle Training Schedule"
status: "draft"
modified_at: "2026-06-18T07:12:55.413285+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "C:\\Users\\jinsw712\\Desktop\\Files\\Research_WIKI\\raw\\papers\\Triangle Splatting Plus.pdf"
tags:
  - "opaque-triangles"
  - "training-schedule"
  - "pruning"
  - "annealing"
  - "differentiable-rendering"
---

# Opaque Triangle Training Schedule

## Definition
Opaque triangle training schedule은 최종 결과를 solid/opaque triangle mesh로 만들기 위해, 학습 초반에는 soft/semi-transparent triangle로 gradient flow를 확보하고 후반에는 smoothness와 opacity domain을 anneal해 sharp/opaque triangle로 수렴시키는 절차다. Triangle Splatting+에서는 shared `sigma`를 `1.0`에서 `0.0001`까지 낮추고, opacity floor `O_t`를 점차 올려 최종 triangle이 transparent하게 남지 못하게 한다.

## Why It Matters
처음부터 opaque/sharp triangle로 학습하면 triangle boundary 밖으로 gradient가 잘 흐르지 않아 geometry optimization이 거의 진행되지 않는다. 반대로 끝까지 soft/semi-transparent를 허용하면 visual quality는 좋아질 수 있지만, game engine에서 sorting 없이 빠르게 렌더링되는 solid mesh가 되지 않는다. 이 schedule은 differentiable splatting의 학습 편의성과 mesh renderer deployment의 제약을 연결한다.

## Where It Appears
- Triangle Splatting+ Sec. 3.4: soft/semi-transparent training에서 solid/opaque final representation으로 전환하는 전략. (p.4-5)
- Triangle Splatting+ Table 2: sigma decay 제거 시 PSNR `-6.84`, LPIPS `+0.243`, SSIM `-0.282`로 가장 큰 성능 악화. (p.8)
- Triangle Splatting+ Table 3: free opacity/soft triangle이 visual quality만 보면 더 좋지만, fast game-engine rendering을 위해 final opaque constraint가 필요하다고 해석한다. (p.8)

## Mechanisms
1. Smoothness `sigma`를 shared parameter로 두고 `1.0`에서 시작한다.
2. 학습이 진행되면서 `sigma`를 `0.0001`까지 anneal하여 window function을 sharp triangle에 가깝게 만든다.
3. Opacity activation을 `opacity(x)=O_t+(1-O_t)sigmoid(x)`로 두어 opacity domain을 `[O_t,1]`로 제한한다.
4. 첫 5k iteration 이후 opacity floor `O_t`를 점차 올려 transparent triangle이 남지 않게 한다.
5. 5k hard pruning과 이후 blending-weight pruning을 결합해, 나중에 opaque artifact가 될 불필요 triangle을 제거한다.

## Failure Modes / Bias
- Opacity를 강제하면 transparent/specular objects를 표현하기 어렵다.
- Pruning timing이나 threshold가 잘못되면 중요한 triangle을 너무 일찍 제거하거나, 불필요 triangle이 opaque artifact로 남을 수 있다.
- Opaque final state는 training view orbit 밖에서 Gaussian류 soft representation보다 artifact가 더 뚜렷해질 수 있다.

## Open Questions
- Opaque branch와 transparent/soft residual branch를 함께 두면 game-engine compatibility와 transparent object 표현을 동시에 얻을 수 있는가?
- `sigma`와 opacity floor schedule은 scene-dependent하게 조절되어야 하는가?
- Blending-weight pruning 외에 normal/depth/semantic consistency를 pruning criterion에 넣으면 더 안정적인가?
