---
type: "concept"
slug: "log-sum-exp"
title: "Log-Sum-Exp"
status: "draft"
modified_at: "2026-06-02T16:05:09.250343+00:00"
author: "Codex"
language: "ko"
confidence: "high"
sources:
  - "raw/papers/Discriminative Unsupervised Feature Learning with Exemplar Convolutional Neural Networks.pdf"
tags:
  - "log-sum-exp"
  - "softmax"
  - "cross-entropy"
  - "jensen-gap"
  - "convexity"
  - "exemplar-cnn"
---

# Log-Sum-Exp

## Definition
Log-sum-exp는 다음 형태의 함수다.

```text
LSE(z) = log sum_k exp(z_k)
```

Exemplar-CNN 논문에서는 같은 값을 다음처럼 쓴다.

```text
log ||exp(z)||_1
```

여기서 `||exp(z)||_1`은 어려운 notation이 아니라, `exp(z_k)`들을 전부 더한 값이다.

```text
||exp(z)||_1 = sum_k exp(z_k)
```

즉:

```text
log ||exp(z)||_1 = log(sum_k exp(z_k))
```

## Notation
- `z`: class별 score/logit 벡터
- `h(x)`: CNN이 softmax 전에 내는 class별 raw score, 즉 logit
- `exp(z)`: 벡터 `z`의 각 원소에 exponential을 적용한 값
- `||v||_1`: L1 norm, 벡터 원소들의 절댓값 합
- `softmax(z)_k`: k번째 class의 확률처럼 해석되는 값

예를 들어:

```text
v = [-2, 5, -1]
||v||_1 = |-2| + |5| + |-1| = 8
```

그런데 `exp(z)`는 모든 값이 양수라서:

```text
||exp(z)||_1 = exp(z_1) + exp(z_2) + ... + exp(z_k)
```

## Numeric Example
```text
z = [2, 1, 0]
```

각 원소에 exp를 씌우면:

```text
exp(z) = [exp(2), exp(1), exp(0)]
       ~= [7.39, 2.72, 1]
```

L1 norm은 이 값들을 더한 것이다.

```text
||exp(z)||_1 = 7.39 + 2.72 + 1 = 11.11
```

마지막으로 log를 씌우면:

```text
log ||exp(z)||_1 = log(11.11) ~= 2.41
```

따라서:

```text
LSE([2,1,0]) ~= 2.41
```

## Smooth Max Intuition
Log-sum-exp는 여러 score 중 가장 큰 값을 부드럽게 고르는 함수처럼 동작한다.

```text
max([2,1,0]) = 2
LSE([2,1,0]) ~= 2.41
```

더 극단적인 경우:

```text
z = [10, 1, 0]
exp(z) ~= [22026, 2.72, 1]
sum exp(z) ~= 22029.72
LSE(z) = log(22029.72) ~= 10.00017
```

가장 큰 값 `10`이 exp 이후 합을 거의 지배하므로, LSE는 max에 가까워진다. 다만 진짜 max와 달리 미분 가능하기 때문에 softmax/cross-entropy 분석에서 자주 등장한다.

## Relation to Softmax
Softmax는 log-sum-exp와 직접 연결된다.

```text
softmax(z)_k = exp(z_k) / sum_j exp(z_j)
```

Log-sum-exp를 k번째 score `z_k`에 대해 미분하면 softmax가 된다.

```text
LSE(z) = log sum_j exp(z_j)

partial LSE(z) / partial z_k
= exp(z_k) / sum_j exp(z_j)
= softmax(z)_k
```

즉:

```text
gradient of LSE = softmax
```

반대로 말하면 LSE는 softmax의 potential function처럼 볼 수 있다.

## Sensitivity Interpretation
`softmax(z)_k`는 `z_k`를 조금 올렸을 때 LSE가 얼마나 증가하는지를 나타낸다.

```text
softmax(z)_k = partial LSE(z) / partial z_k
```

따라서 softmax 값은 각 score가 LSE에 미치는 민감도/기여도로 볼 수 있다.

예를 들어:

```text
z = [10, 10, 1]
softmax(z) ~= [0.49997, 0.49997, 0.00006]
```

해석:

```text
z1과 z2는 LSE에 거의 같은 정도로 큰 영향을 준다.
z3는 LSE에 거의 영향을 주지 않는다.
```

작은 변화 `delta`에 대해서는 다음처럼 볼 수 있다.

```text
LSE(z + delta e_k) ~= LSE(z) + softmax(z)_k * delta
```

즉 `z_k`를 아주 조금 올렸을 때, LSE는 softmax 값에 비례해서 증가한다.

## In Softmax Cross-Entropy
Softmax cross-entropy에서 log-sum-exp는 자연스럽게 나온다.

정답 class가 `i`일 때:

```text
CE = -log softmax(h)_i
```

softmax를 대입하면:

```text
softmax(h)_i = exp(h_i) / sum_j exp(h_j)
```

따라서:

```text
-log softmax(h)_i
= -log(exp(h_i) / sum_j exp(h_j))
= -h_i + log sum_j exp(h_j)
= -h_i + LSE(h)
```

즉 softmax CE는:

```text
- 정답 class logit
+ 전체 class logit의 log-sum-exp
```

형태다. 이 loss를 줄이면 정답 class logit이 다른 class logit보다 커지도록 학습된다.

## In Exemplar-CNN
Exemplar-CNN 3.1 formal analysis에서 LSE는 두 곳에서 중요하다.

### Eq. 6 위 항
Eq. 6의 위 항은 softmax CE와 같은 형태다.

```text
-<e_i, W g_bar_i> + log ||exp(W g_bar_i)||_1
```

여기서:

```text
<e_i, W g_bar_i>
```

는 평균 feature `g_bar_i`를 classifier에 넣었을 때 정답 surrogate class `i`의 logit만 뽑는 내적이다.

따라서 위 항은:

```text
평균 transformed feature g_bar_i를 surrogate class i로 분류하는 CE loss
```

이다. 이 항은 서로 다른 seed patch를 구분하도록 만들기 때문에 discriminative feature와 연결된다.

### Eq. 6 아래 항
Eq. 6의 아래 항은 다음 형태로 볼 수 있다.

```text
E_alpha[A(h_alpha)] - A(E_alpha[h_alpha])
```

여기서:

```text
A(z) = LSE(z) = log ||exp(z)||_1
h_alpha = h(T_alpha x_i)
```

즉 아래 항은:

```text
각 transformed sample의 logit에 LSE를 적용한 뒤 평균낸 값
-
transformed logits를 먼저 평균낸 뒤 LSE를 적용한 값
```

의 차이다.

LSE는 convex function이므로 Jensen inequality에 의해:

```text
E[A(h_alpha)] - A(E[h_alpha]) >= 0
```

이 차이는 transformation마다 output/logit이 많이 다르면 커지고, 비슷하면 작아진다. 따라서 같은 seed에서 나온 transformed samples가 비슷한 output을 내도록 압박하는 invariance regularizer로 해석된다.

## Common Confusions
- `||exp(z)||_1`은 복잡한 게 아니라 `exp(z_k)`를 전부 더한 값이다.
- `log||exp(z)||_1`은 `log(sum_k exp(z_k))`와 같다.
- log-sum-exp는 확률 자체가 아니다. Softmax 분모에 log를 씌운 형태다.
- `h`는 softmax 전 logit이고, `f`는 softmax 후 확률이다.
- LSE는 max와 비슷하게 동작하지만, max보다 부드럽고 미분 가능하다.
- Softmax는 LSE의 gradient이므로, softmax 값은 각 score가 LSE에 미치는 민감도처럼 볼 수 있다.

## Open Questions
- Exemplar-CNN의 Eq. 6 아래 항을 실제 학습 로그에서 측정하면 augmentation policy별 invariance 정도를 비교할 수 있는가?
- Contrastive learning의 InfoNCE에서도 LSE/softmax normalization이 어떤 representation bias를 만드는가?
- Smooth max로서 LSE를 temperature scaling과 함께 보면 invariance/discrimination tradeoff를 더 직관적으로 설명할 수 있는가?
