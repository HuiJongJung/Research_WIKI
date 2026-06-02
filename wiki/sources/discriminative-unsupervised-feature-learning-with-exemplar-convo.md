---
type: "source"
slug: "discriminative-unsupervised-feature-learning-with-exemplar-convo"
title: "Discriminative Unsupervised Feature Learning with Exemplar Convolutional Neural Networks"
status: "draft"
modified_at: "2026-06-02T04:38:22.872812+00:00"
author: "lab-member"
language: "ko"
confidence: "low"
sources:
  - "raw/papers/Machine Learning/Discriminative Unsupervised Feature Learning with Exemplar Convolutional Neural Networks.pdf"
tags:
  - "paper-ingest"
  - "source-draft"
---

# Discriminative Unsupervised Feature Learning with Exemplar Convolutional Neural Networks

## Ingest Metadata

- PDF: `raw/papers/Machine Learning/Discriminative Unsupervised Feature Learning with Exemplar Convolutional Neural Networks.pdf`
- Reading mode: `screenshot`
- Reflection language: `ko`

## Extracted Original Text

> This source draft preserves extracted original text. Refine it and create reusable concept pages with Codex or Claude Code.

### Page 1

1
Discriminative Unsupervised Feature Learning
with Exemplar Convolutional Neural Networks
Alexey Dosovitskiy, Philipp Fischer, Jost Tobias Springenberg, Martin Riedmiller, Thomas Brox
Abstract—Deep convolutional networks have proven to be very successful in learning task speciﬁc features that allow for
unprecedented performance on various computer vision tasks. Training of such networks follows mostly the supervised learning
paradigm, where sufﬁciently many input-output pairs are required for training. Acquisition of large training sets is one of the key
challenges, when approaching a new task. In this paper, we aim for generic feature learning and present an approach for training a
convolutional network using only unlabeled data. To this end, we train the network to discriminate between a set of surrogate classes.
Each surrogate class is formed by applying a variety of transformations to a randomly sampled ’seed’ image patch. In contrast to
supervised network training, the resulting feature representation is not class speciﬁc. It rather provides robustness to the
transformations that have been applied during training. This generic feature representation allows for classiﬁcation results that
outperform the state of the art for unsupervised learning on several popular datasets (STL-10, CIFAR-10, Caltech-101, Caltech-256).
While such generic features cannot compete with class speciﬁc features from supervised training on a classiﬁcation task, we show that
they are advantageous on geometric matching problems, where they also outperform the SIFT descriptor.
!
1
INTRODUCTION
In the recent two years Convolutional Neural Networks
(CNNs) trained in a supervised manner via backpropaga-
tion dramatically improved the state of the art performance
on a variety of Computer Vision tasks, such as image
classiﬁcation [1, 2, 3, 4], detection [5, 6], semantic seg-
mentation [7, 8]. Interestingly, the features learned by such
networks often generalize to new datasets: for example, the
feature representation of a network trained for classiﬁca-
tion on ImageNet [9] also performs well on PASCAL VOC
[10]. Moreover, a network can be adapted to a new task
by replacing the loss function and possibly the last few
layers of the network and ﬁne-tuning it to the new problem,
i.e. adjusting the weights using backpropagation. With this
approach, typically much smaller training sets are sufﬁcient.
Despite the big success of this approach, it has at least
two potential drawbacks. First, there is the need for huge
labeled datasets to be used for the initial supervised train-
ing. These are difﬁcult to collect, and there are diminishing
returns of making the dataset larger and larger. Hence,
unsupervised feature learning, which has quick access to
arbitrary amounts of data, is conceptually of large interest
despite its limited performance so far. Second, although the
CNNs trained for classiﬁcation generalize well to similar
tasks, such as object class detection, semantic segmentation,
or image retrieval, the transfer becomes less efﬁcient the
more the new task differs from the original training task.
In particular, object class annotation may not be beneﬁcial to
learn features for class-independent tasks, such as descriptor
matching.
In this work, we propose a procedure for training a
CNN that does not rely on any labeled data but rather
makes use of a surrogate task automatically generated from
•
All authors are with the Computer Science Department
at the University of Freiburg
E-mail: {dosovits, ﬁscher, springj, riedmiller, brox}@cs.uni-freiburg.de
unlabeled images. The surrogate task is designed to yield
generic features that are descriptive and robust to typical
variations in the data. The variation is simulated by ran-
domly applying transformations to a ’seed’ image. This
image and its transformed versions constitute a surrogate
class. In contrast to previous data augmentation approaches,
only a single seeding sample is needed to build such a class.
Consequently, we call thus trained networks Exemplar-CNN.
By construction, the representation learned by the
Exemplar-CNN is discriminative, while also invariant to
some typical transformations. These properties make it
useful for various vision tasks. We show that the feature
representation learned by the Exemplar-CNN performs well
on two very different tasks: object classiﬁcation and descrip-
tor matching. The classiﬁcation accuracy obtained with the
Exemplar-CNN representation exceeds that of all previous
unsupervised methods on four benchmark datasets: STL-10,
CIFAR-10, Caltech-101, Caltech-256. On descriptor match-
ing, we show that the feature representation outperforms
the representation of the AlexNet [1], which was trained in
a supervised, class-speciﬁc manner on ImageNet. Moreover,
it outperforms the popular SIFT descriptor.
1.1
Related Work
Our approach is related to a large body of work on un-
supervised learning of invariant features and training of
convolutional neural networks.
Convolutional training is commonly used in both super-
vised and unsupervised methods to utilize the invariance of
image statistics to translations [1, 11, 12]. Similar to our ap-
proach, most successful methods employing convolutional
neural networks for object recognition rely on data aug-
mentation to generate additional training samples for their
classiﬁcation objective [1, 2]. While we share the architecture
(a convolutional neural network) with these approaches, our
method does not rely on any labeled training data.
arXiv:1406.6909v2  [cs.LG]  19 Jun 2015

- Screenshot artifact: `C:\Users\jinsw712\Desktop\Files\Research_WIKI\raw\screenshots\Discriminative-Unsupervised-Feature-Learning-with-Exemplar-Convolutional-Neural-Networks-304c90e4ed90\page-0001.png`

### Page 2

2
Fig. 1. Exemplary patches sampled from the STL unlabeled
dataset which are later augmented by various transformations to
obtain surrogate data for the CNN training.
Fig. 2. Several random transformations applied to one of the
patches extracted from the STL unlabeled dataset. The original
(’seed’) patch is in the top left corner.
In unsupervised learning, several studies on learning in-
variant representations exist. Denoising autoencoders [13],
for example, learn features that are robust to noise by
trying to reconstruct data from randomly perturbed input
samples. Zou et al. [14] learn invariant features from video
by enforcing a temporal slowness constraint on the feature
representation learned by a linear autoencoder. Sohn et al.
[15] and Hui et al. [16] learn features invariant to local
image transformations. In contrast to our discriminative
approach, all these methods rely on directly modeling the
input distribution and are typically hard to use for jointly
training multiple layers of a CNN.
The idea of learning features that are invariant to trans-
formations has also been explored for supervised training of
neural networks. The research most similar to ours is early
work on tangent propagation [17] (and the related double
backpropagation [18]) which aims to learn invariance to
small predeﬁned transformations in a neural network by
directly penalizing the derivative of the output with respect
to the magnitude of the transformations. In contrast, our
algorithm does not regularize the derivative explicitly. Thus
it is less sensitive to the magnitude of the applied transfor-
mation.
This work is also loosely related to the use of unlabeled
data for regularizing supervised algorithms, for example
self-training [19] or entropy regularization [20]. In contrast
to these semi-supervised methods, Exemplar-CNN training
does not require any labeled data.
Finally, the idea of creating an auxiliary task in order to
learn a good data representation was used in [21, 22].
2
CREATING SURROGATE TRAINING DATA
The input to the proposed training procedure is a set of
unlabeled images, which come from roughly the same dis-
tribution as the images in which we later aim to compute
the learned features. We randomly sample N patches of size
32 × 32 pixels from different images at varying positions
and scales forming the initial training set X = {x1, . . . xN}.
We are interested in patches containing objects or parts
of objects, hence we sample only from regions containing
considerable gradients. More precisely, we sample a patch
with probability proportional to mean squared gradient
magnitude within the patch. Exemplary patches sampled
from the STL-10 unlabeled dataset are shown in Fig. 1.
We deﬁne a family of transformations {Tα| α ∈A}
parameterized by vectors α ∈A, where A is the set of all
possible parameter vectors. Each transformation Tα is a com-
position of elementary transformations. To learn features for
the purpose of object classiﬁcation, we used transformations
from the following list:
• translation: vertical and horizontal translation by a
distance within 0.2 of the patch size;
• scaling: multiplication of the patch scale by a factor
between 0.7 and 1.4;
• rotation: rotation of the image by an angle up to 20
degrees;
• contrast 1: multiply the projection of each patch pixel
onto the principal components of the set of all pixels by
a factor between 0.5 and 2 (factors are independent for
each principal component and the same for all pixels
within a patch);
• contrast 2: raise saturation and value (S and V compo-
nents of the HSV color representation) of all pixels to a
power between 0.25 and 4 (same for all pixels within
a patch), multiply these values by a factor between 0.7
and 1.4, add to them a value between −0.1 and 0.1;
• color: add a value between −0.1 and 0.1 to the hue
(H component of the HSV color representation) of all
pixels in the patch (the same value is used for all pixels
within a patch).
The approach is ﬂexible with regard to extending this list by
other transformations in order to serve other applications
of the learned features better. For instance, in Section 5 we
show that descriptor matching beneﬁts from adding a blur
transformation.
All numerical parameters of elementary transformations,
when concatenated together, form a single parameter vec-
tor α. For each initial patch xi ∈X we sample K ran-
dom parameter vectors {α1
i , . . . , αK
i } and apply the cor-
responding transformations Ti = {Tα1
i , . . . , TαK
i } to the
patch xi. This yields the set of its transformed versions
Sxi = Tixi = {Txi| T ∈Ti}. An example of such a set is
shown in Fig. 2 . Afterwards we subtract the mean of each
pixel over the whole resulting dataset. We do not apply any
other preprocessing.
3
LEARNING ALGORITHM
Given the sets of transformed image patches, we declare
each of these sets to be a class by assigning label i to the
class Sxi. We train a CNN to discriminate between these
surrogate classes. Formally, we minimize the following loss
function:
L(X) =
X
xi∈X
X
T ∈Ti
l(i, Txi),
(1)
where l(i, Txi) is the loss on the transformed sample Txi
with (surrogate) true label i. We use a CNN with a fully

- Screenshot artifact: `C:\Users\jinsw712\Desktop\Files\Research_WIKI\raw\screenshots\Discriminative-Unsupervised-Feature-Learning-with-Exemplar-Convolutional-Neural-Networks-304c90e4ed90\page-0002.png`

### Page 3

3
connected classiﬁcation layer and a softmax output layer
and we optimize the multinomial negative log likelihood of
the network output, hence in our case
l(i, Txi) = M(ei, f(Txi)),
M(y, f) = −⟨y, log f⟩= −
X
k
yk log fk,
(2)
where f(·) denotes the function computing the values of
the output layer of the CNN given the input data, and ei is
the ith standard basis vector. We note that in the limit of an
inﬁnite number of transformations per surrogate class, the
objective function (1) takes the form
bL(X) =
X
xi∈X
Eα[l(i, Tαxi)],
(3)
which we shall analyze in the next section.
Intuitively, the classiﬁcation problem described above
serves to ensure that different input samples can be dis-
tinguished. At the same time, it enforces invariance to
the speciﬁed transformations. In the following sections we
provide a foundation for this intuition. We ﬁrst present a
formal analysis of the objective, separating it into a well de-
ﬁned classiﬁcation problem and a regularizer that enforces
invariance (resembling the analysis in [23]). We then discuss
the derived properties of this classiﬁcation problem and
compare it to common practices for unsupervised feature
learning.
3.1
Formal Analysis
We denote by α ∈A the random vector of transformation
parameters, by g(x) the vector of activations of the second-
to-last layer of the network when presented the input patch
x, by W the matrix of the weights of the last network layer,
by h(x) = Wg(x) the last layer activations before applying
the softmax, and by f(x) = softmax (h(x)) the output of
the network. By plugging in the deﬁnition of the softmax
activation function
softmax (z) = exp(z)/∥exp(z)∥1
(4)
the objective function (3) with loss (2) takes the form
X
xi∈X
Eα
−⟨ei, h(Tαxi)⟩+ log ∥exp(h(Tαxi))∥1
.
(5)
With bgi = Eα [g(Tαxi)] being the average feature represen-
tation of transformed versions of the image patch xi we can
rewrite Eq. (5) as
X
xi∈X
−⟨ei, W bgi⟩+ log ∥exp(W bgi)∥1

+
X
xi∈X

Eα [log ∥exp(h(Tαxi))∥1] −log ∥exp(W bgi)∥1
.
(6)
The ﬁrst sum is the objective function of a multinomial
logistic regression problem with input-target pairs ( bgi, ei).
This objective falls back to the transformation-free instance
classiﬁcation problem L(X) = P
xi∈X l(i, xi) if g(xi) =
Eα[g(Tαx)]. In general, this equality does not hold and thus
the ﬁrst sum enforces correct classiﬁcation of the average
representation Eα[g(Tαxi)] for a given input sample. For
a truly invariant representation, however, the equality is
achieved. Similarly, if we suppose that Tαx = x for α = 0,
that for small values of α the feature representation g(Tαxi)
is approximately linear with respect to α and that the
random variable α is centered, i.e. Eα [α] = 0, then bgi =
Eα [g(Tαxi)] ≈Eα [g(xi) + ∇α(g(Tαxi))|α=0 α] = g(xi).
The second sum in Eq. (6) can be seen as a regularizer
enforcing all h(Tαxi) to be close to their average value, i.e.,
the feature representation is sought to be approximately
invariant to the transformations Tα. To show this we use
the convexity of the function log ∥exp(·)∥1 and Jensen’s
inequality, which yields (proof in Appendix A):
Eα [log ∥exp(h(Tαxi))∥1] −log ∥exp(W bgi)∥1 ≥0.
(7)
If the feature representation is perfectly invariant, then
h(Tαxi) = W bgi and inequality (7) turns to equality, mean-
ing that the regularizer reaches its global minimum.
3.2
Conceptual Comparison to Previous Unsupervised
Learning Methods
Suppose we want to unsupervisedly learn a feature rep-
resentation useful for a recognition task, for example clas-
siﬁcation. The mapping from input images x to a feature
representation g(x) should then satisfy two requirements:
(1) there must be at least one feature that is similar for
images of the same category y (invariance); (2) there must
be at least one feature that is sufﬁciently different for images
of different categories (ability to discriminate).
Most unsupervised feature learning methods aim to
learn such a representation by modeling the input distribu-
tion p(x). This is based on the assumption that a good model
of p(x) contains information about the category distribution
p(y|x). That is, if a representation is learned, from which
a given sample can be reconstructed perfectly, then the
representation is expected to also encode information about
the category of the sample (ability to discriminate). Addi-
tionally, the learned representation should be invariant to
variations in the samples that are irrelevant for the classiﬁ-
cation task, i.e., it should adhere to the manifold hypothesis
(see e.g. [24] for a recent discussion). Invariance is classically
achieved by regularization of the latent representation, e.g.,
by enforcing sparsity [12] or robustness to noise [13].
In contrast, the discriminative objective in Eq. (1) does
not directly model the input distribution p(x) but learns
a representation that discriminates between input samples.
The representation is not required to reconstruct the input,
which is unnecessary in a recognition or matching task.
This leaves more degrees of freedom to model the desired
variability of a sample. As shown in our analysis (see Eq.
(7)), we enforce invariance to transformations applied dur-
ing surrogate data creation by requiring the representation
g(Tαxi) of the transformed image patch to be predictive of
the surrogate label assigned to the original image patch xi.
It should be noted that this approach assumes that the
transformations Tα do not change the identity of the image
content. For example, if we use a color transformation we
will force the network to be invariant to this change and
cannot expect the extracted features to perform well in a task

- Screenshot artifact: `C:\Users\jinsw712\Desktop\Files\Research_WIKI\raw\screenshots\Discriminative-Unsupervised-Feature-Learning-with-Exemplar-Convolutional-Neural-Networks-304c90e4ed90\page-0003.png`

### Page 4

4
relying on color information (such as differentiating black
panthers from pumas)1.
4
EXPERIMENTS: CLASSIFICATION
To compare our discriminative approach to previous unsu-
pervised feature learning methods, we report classiﬁcation
results on the STL-10 [25], CIFAR-10 [26], Caltech-101 [27]
and Caltech-256 [28] datasets.
4.1
Experimental Setup
The datasets we tested on differ in the number of classes (10
for CIFAR and STL, 101 for Caltech-101, 256 for Caltech-
256) and the number of samples per class. STL is especially
well suited for unsupervised learning as it contains a large
set of 100,000 unlabeled samples. In all experiments, except
for the dataset transfer experiment, we extracted surrogate
training data from the unlabeled subset of STL-10. When
testing on CIFAR-10, we resized the images from 32 × 32
pixels to 64 × 64 pixels to make the scale of depicted ob-
jects more similar to the other datasets. Caltech-101 images
were resized to 150 × 150 pixels and Caltech-256 images to
256×256 pixels (Caltech-256 images have on average higher
resolution than Caltech-101 images, so not downsampling
them so much allows to preserve more ﬁne details).
We worked with three network architectures. A smaller
network was used to evaluate the inﬂuence of different
components of the augmentation procedure on classiﬁcation
performance. It consists of two convolutional layers with 64
ﬁlters each, followed by a fully connected layer with 128
units. This last layer is succeeded by a softmax layer, which
serves as the network output. This network will be referred
to as 64c5-64c5-128f as explained in Appendix B.1.
To compare our method to the state-of-the-art we trained
two bigger networks: a network that consists of three con-
volutional layers with 64, 128 and 256 ﬁlters respectively
followed by a fully connected layer with 512 units (64c5-
128c5-256c5-512f), and an even larger network, consisting
of three convolutional layers with 92, 256 and 512 ﬁlters
respectively and a fully connected layer with 1024 units
(92c5-256c5-512c5-1024f).
In all these models all convolutional ﬁlters are connected
to a 5 × 5 region of their input. 2 × 2 max-pooling was
performed after the ﬁrst and second convolutional layers.
Dropout [29, 30] was applied to the fully connected layers.
We trained the networks using an implementation based on
Caffe [31]. Details on the training procedure and hyperpa-
rameter settings are provided in Appendix B.2.
At test time we applied a network to arbitrarily sized
images by convolutionally computing the responses of all
the network layers except the top softmax (that is, we
computed the responses of convolutional layers normally
and then slided the fully connected layers on top of these).
To the feature maps of each layer we applied the pooling
method that is commonly used for the respective dataset:
1. Such cases could be covered either by careful selection of applied
transformations or by combining features from multiple networks
trained with different sets of transformations and letting the ﬁnal
(supervised) classiﬁer choose which features to use.
1) 4-quadrant max-pooling, resulting in 4 values per fea-
ture map, which is the standard procedure for STL-10
and CIFAR-10 [14, 16, 32, 34]
2) 3-layer spatial pyramid, i.e. max-pooling over the
whole image as well as within 4 quadrants and within
the cells of a 4×4 grid, resulting in 1+4+16 = 21 values
per feature map, which is the standard for Caltech-101
and Caltech-256 [14, 33, 35]
Finally, we trained a one-vs-all linear support vector ma-
chine (SVM) on the pooled features.
On all datasets we used the standard training and test
protocols. On STL-10 the SVM was trained on 10 pre-deﬁned
folds of the training data. We report the mean and standard
deviation achieved on the ﬁxed test set. For CIFAR-10 we
report two results:
1) Training the SVM on the whole CIFAR-10 training set
(called CIFAR-10)
2) The average over 10 random selections of 400 training
samples per class (called CIFAR-10(400))
For Caltech-101 we follow the usual protocol of selecting 30
random samples per class for training and not more than 50
samples per class for testing. For Caltech-256 we randomly
selected 30 samples per class for training and used the
rest for testing. Both for Caltech-101 and Caltech-256 we
repeated the testing procedure 10 times.
4.2
Classiﬁcation Results
In Table 1 we compare Exemplar-CNN to several unsu-
pervised feature learning methods, including the current
state of the art on each dataset. We also list the state of
the art for methods involving supervised feature learning
(which is not directly comparable). Additionally we show
the dimensionality of the feature vectors produced by each
method before ﬁnal pooling. The smallest network was
trained on 8000 surrogate classes containing 150 samples
each and the larger ones on 16000 classes with 100 samples
each.
The features extracted from both larger networks out-
perform the best prior result on all datasets. This is despite
the fact that the dimensionality of the feature vectors is
smaller than that of most other approaches and that the
networks are trained on the STL-10 unlabeled dataset (i.e.
they are used in a transfer learning manner when applied
to CIFAR-10 and Caltech). The increase in performance
is especially pronounced when only few labeled samples
are available for training the SVM, as is the case for all
the datasets except full CIFAR-10. This is in agreement
with previous evidence that with increasing feature vector
dimensionality and number of labeled samples, training an
SVM becomes less dependent on the quality of the features
[16, 32]. Remarkably, on STL-10 we achieve an accuracy of
74.2%, which is a large improvement over all previously
reported results.
1. On Caltech-101 one can either measure average accuracy over
all samples (average overall accuracy) or calculate the accuracy for
each class and then average these values (average per-class accuracy).
These differ, as some classes contain fewer than 50 test samples. Most
researchers in ML use average overall accuracy.

- Screenshot artifact: `C:\Users\jinsw712\Desktop\Files\Research_WIKI\raw\screenshots\Discriminative-Unsupervised-Feature-Learning-with-Exemplar-Convolutional-Neural-Networks-304c90e4ed90\page-0004.png`

### Page 5

5
TABLE 1
Classiﬁcation accuracies on several datasets (in percent). ∗Average per-class accuracy1 78.0% ± 0.4%. † Average per-class
accuracy 85.0% ± 0.7%. ‡ Average per-class accuracy 85.8% ± 0.7%.
Algorithm
STL-10
CIFAR-10(400) CIFAR-10 Caltech-101 Caltech-256(30) #features
Convolutional K-means Network [32]
60.1 ± 1
70.7 ± 0.7
82.0
—
—
8000
Multi-way local pooling [33]
—
—
—
77.3 ± 0.6
41.7
1024 × 64
Slowness on videos [14]
61.0
—
—
74.6
—
556
Hierarchical Matching Pursuit (HMP) [34]
64.5 ± 1
—
—
—
—
1000
Multipath HMP [35]
—
—
—
82.5 ± 0.5
50.7
5000
View-Invariant K-means [16]
63.7
72.6 ± 0.7
81.9
—
—
6400
Exemplar-CNN (64c5-64c5-128f)
67.1 ± 0.2
69.7 ± 0.3
76.5
79.8 ± 0.5∗
42.4 ± 0.3
256
Exemplar-CNN (64c5-128c5-256c5-512f)
72.8 ± 0.4
75.4 ± 0.2
82.2
86.1 ± 0.5†
51.2 ± 0.2
960
Exemplar-CNN (92c5-256c5-512c5-1024f)
74.2 ± 0.4
76.6 ± 0.2
84.3
87.1 ± 0.7‡
53.6 ± 0.2
1884
Supervised state of the art
70.1[36]
—
92.0 [37]
91.44 [38]
70.6 [2]
—
4.3
Detailed Analysis
We performed additional experiments using the 64c5-64c5-
128f network to study the effect of various design choices in
Exemplar-CNN training and validate the invariance proper-
ties of the learned features.
4.3.1
Number of Surrogate Classes
We varied the number N of surrogate classes between 50
and 32000. As a sanity check, we also tried classiﬁcation
with random ﬁlters. The results are shown in Fig. 3.
Clearly, the classiﬁcation accuracy increases with the
number of surrogate classes until it reaches an optimum at
about 8000 surrogate classes after which it did not change or
even decreased. This is to be expected: the larger the number
of surrogate classes, the more likely it is to draw very similar
or even identical samples, which are hard or impossible
to discriminate. Few such cases are not detrimental to the
classiﬁcation performance, but as soon as such collisions
dominate the set of surrogate labels, the discriminative loss
is no longer reasonable and training the network to the
surrogate task no longer succeeds. To check the validity
of this explanation we also plot in Fig. 3 the validation
error on the surrogate data after training the network. It
rapidly grows as the number of surrogate classes increases,
showing that the surrogate classiﬁcation task gets harder
with a growing number of classes. We observed that larger,
more powerful networks reach their peak performance for
more surrogate classes than smaller networks. However,
the performance that can be achieved with larger networks
saturates (not shown in the ﬁgure).
It can be seen as a limitation that sampling too many,
too similar images for training can even decrease the per-
formance of the learned features. It makes the number and
selection of samples a relevant parameter of the training
procedure. However, this drawback can be avoided for
example by clustering.
To demonstrate this, given the STL-10 unlabeled dataset
containing 100,000 images, we ﬁrst train a 64c5-128c5-256c5-
512f Exemplar-CNN on a subset of 16,000 image patches.
We then use this Exemplar-CNN to extract descriptors of
all images from the dataset and perform clustering similar
to [39]. After discarding noisy and very similar clusters
automatically (see Appendix B.3 for details), this leaves
us with 6510 clusters with approximately 10 images in
each of them. To the images in each cluster we then apply
50
100
250
500
1000 2000 4000 8000 1600032000
54
56
58
60
62
64
66
68
Number of classes (log scale)
Classification accuracy on STL−10
 
 
Classification
on STL (± σ)
Validation error on
surrogate data
0
20
40
60
80
100
Error on validation data
Fig. 3. Inﬂuence of the number of surrogate training classes. The val-
idation error on the surrogate data is shown in red. Note the different
y-axes for the two curves.
the same augmentation as in the original Exemplar-CNN.
Each augmented cluster serves as a surrogate class for
training. Table 2 shows the classiﬁcation performance of
the features learned by CNNs from this training data. Clus-
tering increases the classiﬁcation accuracy on all datasets,
in particular on STL by up to 2.4%, depending on the
network. This shows that the small modiﬁcation allows the
approach to make use of large amounts of data. Potentially,
using even more data or performing clustering and network
training within a uniﬁed framework could further improve
the quality of the learned features.
4.3.2
Number of Samples per Surrogate Class
Fig. 4 shows the classiﬁcation accuracy when the number
K of training samples per surrogate class varies between
1 and 300. The performance improves with more samples
per surrogate class and saturates at around 100 samples.
This indicates that this amount is sufﬁcient to approximate
the formal objective from Eq. (3), hence further increasing
the number of samples does not signiﬁcantly change the
optimization problem. On the other hand, if the number of
samples is too small, there is not enough data to learn the
desired invariance properties.
4.3.3
Types of Transformations
We varied the transformations used for creating the surro-
gate data to analyze their inﬂuence on the ﬁnal classiﬁcation

- Screenshot artifact: `C:\Users\jinsw712\Desktop\Files\Research_WIKI\raw\screenshots\Discriminative-Unsupervised-Feature-Learning-with-Exemplar-Convolutional-Neural-Networks-304c90e4ed90\page-0005.png`

### Page 6

6
TABLE 2
Classiﬁcation accuracies with clustering (in percent).
Algorithm
STL-10
CIFAR-10(400)
CIFAR-10
Caltech-101
Caltech-256(30)
64c5-64c5-128f
69.5 ± 0.4
70.8 ± 0.2
76.8
79.5 ± 0.6
42.9 ± 0.3
64c5-128c5-256c5-512f
74.9 ± 0.4
75.7 ± 0.2
82.6
85.7 ± 0.6
51.4 ± 0.4
92c5-256c5-512c5-1024f
75.4 ± 0.3
77.4 ± 0.2
84.3
87.2 ± 0.6
53.7 ± 0.6
1
2
4
8
16
32
64 100 150
300
45
50
55
60
65
70
Number of samples per class (log scale)
Classification accuracy on STL−10
 
 
1000 classes
2000 classes
4000 classes
random filters
Fig. 4. Classiﬁcation performance on STL for different numbers of sam-
ples per class. Random ﬁlters can be seen as ’0 samples per class’.
performance. The set of ’seed’ patches was ﬁxed. The result
is shown in Fig. 5. The value ’0’ corresponds to applying
random compositions of all elementary transformations:
scaling, rotation, translation, color variation, and contrast
variation. Different columns of the plot show the difference
in classiﬁcation accuracy as we discarded some types of
elementary transformations.
Several tendencies can be observed. First, rotation and
scaling have only a minor impact on the performance, while
translations, color variations and contrast variations are
signiﬁcantly more important. Secondly, the results on STL-
10 and CIFAR-10 consistently show that spatial invariance
and color-contrast invariance are approximately of equal
importance for the classiﬁcation performance. This indicates
that variations in color and contrast, though often neglected,
may also improve performance in a supervised learning
scenario. Thirdly, on Caltech-101 color and contrast trans-
formations are much more important compared to spatial
transformations than on the two other datasets. This is not
surprising, since Caltech-101 images are often well aligned,
and this dataset bias makes spatial invariance less useful.
We tried applying several other transformations (oc-
clusion, afﬁne transformation, additive Gaussian noise) in
addition to the ones shown in Fig. 5, none of which seemed
to improve the classiﬁcation accuracy. For the matching
task in Section 5, though, we found that using blur as an
additional transformation improves the performance.
4.3.4
Inﬂuence of the Dataset
We applied our feature learning algorithm to images sam-
pled from three datasets – STL-10 unlabeled dataset, CIFAR-
10 and Caltech-101 – and evaluated the performance of the
learned feature representations on classiﬁcation tasks on
−20
−15
−10
−5
0
Removed transformations
 
 
rotation scaling   translation color contrast  rot+sc+tr  col+con
all
−20
−15
−10
−5 
0  
Difference in classification accuracy
STL−10
CIFAR−10
Caltech−101
Fig. 5. Inﬂuence of removing groups of transformations during gen-
eration of the surrogate training data. Baseline (’0’ value) is applying
all transformations. Each group of three bars corresponds to removing
some of the transformations.
Fig. 7. Filters learned by ﬁrst layers of 64c5-64c5-128f networks when
training on surrogate data from various dataset. Top – from STL-10,
middle – CIFAR-10, bottom – Caltech-101.
these datasets. We used the 64c5-64c5-128f network for this
experiment.
We show the ﬁrst layer ﬁlters learned from the three
datasets in Fig. 7. Note how ﬁlters qualitatively differ de-
pending on the dataset they were trained on.
Classiﬁcation results are shown in Table 3. The best
classiﬁcation results for each dataset are obtained when
training on the patches extracted from the dataset itself.
However, the difference is not drastic, indicating that the
learned features generalize well to other datasets.
4.3.5
Inﬂuence of the Network Architecture on Classiﬁca-
tion Performance
We perform an additional experiment to evaluate the in-
ﬂuence of the network architecture on classiﬁcation perfor-
mance. The results of this experiment are shown in Table 4.
All networks were trained using a surrogate training set
containing either 8000 classes with 150 samples each or

- Screenshot artifact: `C:\Users\jinsw712\Desktop\Files\Research_WIKI\raw\screenshots\Discriminative-Unsupervised-Feature-Learning-with-Exemplar-Convolutional-Neural-Networks-304c90e4ed90\page-0006.png`

### Page 7

7
−20
−10
0
10
20
0
0.2
0.4
0.6
0.8
1
Translation (pixels)
Distance between feature vectors
 
 
(a)
1st layer
2nd layer
3rd layer
4−quadrant
HOG
−50
0
50
0
0.2
0.4
0.6
0.8
1
Rotation angle (degrees)
Distance between feature vectors
(b)
0.06 0.13 0.25
0.5
1
2
4
8
16
0
0.2
0.4
0.6
0.8
1
Saturation multiplier
Distance between feature vectors
(c)
−50
0
50
10
20
30
40
50
60
Rotation angle (degrees)
Classification accuracy (in %)
 
 
(d)
No movements in training data
Rotations up to 20 degrees
Rotations up to 40 degrees
−0.2
−0.1
0
0.1
0.2
0.3
10
20
30
40
50
60
Hue shift
Classification accuracy (in %)
 
 
(e)
No color transform
Hue change within ± 0.1
Hue change within ± 0.2
Hue change within ± 0.3
0.125
0.25
0.5
1
2
4
8
10
20
30
40
50
60
Contrast multiplier
Classification accuracy (in %)
 
 
(f)
No contrast transform
Contrast coefficients (2, 0.5, 0.1)
Contrast coefficients (4, 1, 0.2)
Contrast coefficients (6, 1.5, 0.3)
Fig. 6. Invariance properties of the feature representation learned by Exemplar-CNN. Top: transformations applied to an image patch (translation,
rotation, contrast, saturation, color). Bottom: invariance of different feature representations. (a)-(c): Normalized Euclidean distance between feature
vectors of the original and the translated image patches vs. the magnitude of the transformation, (d)-(f): classiﬁcation performance on transformed
image patches vs. the magnitude of the transformation for various magnitudes of transformations applied for creating the surrogate training data.
TABLE 3
Dependence of classiﬁcation performance (in %) on the training and
testing datasets. Each column corresponds to different test data, each
row to different training data (i.e. source of seed patches). We used the
64c5-64c5-128f network for this experiment.
TESTING
TRAINING
STL-10
CIFAR-10(400)
CALTECH-101
STL-10
67.1 ± 0.3
69.7 ± 0.3
79.8 ± 0.5
CIFAR-10
64.5 ± 0.4
70.3 ± 0.4
77.8 ± 0.6
CALTECH-101
66.2 ± 0.4
69.5 ± 0.2
80.0 ± 0.5
16000 classes with 100 samples each (for larger networks).
We vary the number of layers, layer sizes and ﬁlter sizes.
Classiﬁcation accuracy generally improves with the network
size indicating that our classiﬁcation problem scales well to
relatively large networks without overﬁtting.
4.3.6
Invariance Properties of the Learned Representation
We analyzed to which extent the representation learned
by the network is invariant to the transformations applied
during training. We randomly sampled 500 images from
the STL-10 test set and applied a range of transformations
(translation, rotation, contrast, color) to each image. To
avoid empty regions beyond the image boundaries when
applying spatial transformations, we cropped the central
64 × 64 pixel sub-patch from each 96 × 96 pixel image. We
then applied two measures of invariance to these patches.
First, as an explicit measure of invariance, we calculated
the normalized Euclidean distance between normalized fea-
ture vectors of the original image patch and the transformed
one [14] (see Appendix C for details). The downside of this
approach is that the distance between extracted features
does not take into account how informative and discrimi-
native they are. We therefore evaluated a second measure
– classiﬁcation performance depending on the magnitude
of the transformation applied to the classiﬁed patches
–
which does not come with this problem. To compute the
classiﬁcation accuracy, we trained an SVM on the central
64×64 pixel patches from one fold of the STL-10 training set
and measured classiﬁcation performance on all transformed
versions of 500 samples from the test set.
The results of both experiments are shown in Fig. 6.
Overall the experiment empirically conﬁrms that the
Exemplar-CNN objective leads to learning invariant fea-
tures. Features in the third layer and the ﬁnal pooled feature

- Screenshot artifact: `C:\Users\jinsw712\Desktop\Files\Research_WIKI\raw\screenshots\Discriminative-Unsupervised-Feature-Learning-with-Exemplar-Convolutional-Neural-Networks-304c90e4ed90\page-0007.png`

### Page 8

8
TABLE 4
Classiﬁcation accuracy depending on the network architecture. The name coding is as follows: NcF stands for a convolutional layer with N ﬁlters of
size F × F pixels, Nf stands for a fully connected layer with N units. For example, 64c5-64c5-128f denotes a network with two convolutional layers
containing 64 ﬁlters spanning 5 × 5 pixels each, followed by a fully connected layer with 128 units. We also show the number of surrogate classes
used for training each network.
Architecture
#classes
STL-10
CIFAR-10(400)
CIFAR-10
Caltech-101
32c5-32c5-64f
8000
63.8 ± 0.4
66.1 ± 0.4
71.3
78.2 ± 0.6
64c5-64c5-128f
8000
67.1 ± 0.3
69.7 ± 0.3
75.7
79.8 ± 0.5
64c7-64c5-128f
8000
66.3 ± 0.4
69.5 ± 0.3
75.0
79.4 ± 0.7
64c5-64c5-64c5-128f
8000
68.5 ± 0.3
70.9 ± 0.3
77.0
82.2 ± 0.7
64c5-64c5-64c5-64c5-128f
8000
64.7 ± 0.5
67.5 ± 0.3
75.2
75.7 ± 0.4
128c5-64c5-128f
8000
67.2 ± 0.4
69.9 ± 0.2
76.1
80.1 ± 0.5
64c5-256c5-128f
8000
69.2 ± 0.3
71.7 ± 0.3
77.9
81.6 ± 0.5
64c5-64c5-512f
8000
69.0 ± 0.4
71.7 ± 0.2
79.3
82.9 ± 0.4
128c5-256c5-512f
8000
71.2 ± 0.3
73.9 ± 0.3
81.5
84.3 ± 0.6
128c5-256c5-512f
16000
71.9 ± 0.3
74.3 ± 0.3
81.4
84.6 ± 0.6
64c5-128c5-256c5-512f
16000
72.8 ± 0.4
75.3 ± 0.3
82.0
85.5 ± 0.4
92c5-256c5-512c5-1024f
16000
73.9 ± 0.4
76.0 ± 0.2
83.6
86.9 ± 0.6
representation compare favorably to a HOG baseline (Fig. 6
(a), (b)). This is consistent with the results we get in Section 5
for descriptor matching, where we compare the features to
SIFT (which is similar to HOG).
Fig. 6(d)-(f) further show that stronger transformations
in the surrogate training data lead to a more invariant
classiﬁcation with respect to these transformations. How-
ever, adding too much contrast variation may deteriorate
classiﬁcation performance (Fig. 6 (f)). One possible reason is
that the contrast level can be a useful feature: for example,
strong edges in an image are usually more important than
weak ones.
5
EXPERIMENTS: DESCRIPTOR MATCHING
In recognition tasks, such as image classiﬁcation and object
detection, the invariance requirements are largely deﬁned
by object class labels. Consequently, providing these class
labels already when learning the features should be advan-
tageous. This can be seen in the comparison to the super-
vised state-of-the-art in Table 1, where supervised feature
learning performs better than the presented approach.
In contrast, matching of interest points in two images
should be independent of object class labels. As a conse-
quence, there is no apparent reason, why feature learning
using class annotation should outperform unsupervised fea-
ture learning. One could even imagine that the class anno-
tation is confusing and yields inferior features for matching.
5.1
Compared Features
We compare the features learned by supervised and un-
supervised convolutional networks and SIFT [40] features.
For a long time SIFT has been the preferred descriptor in
matching tasks (see [41] for a comparison).
As supervised CNN we used the AlexNet model trained
on ImageNet available at [31]. The architecture of the net-
work follows Krizhevsky et al. [1] and contains 5 con-
volutional layers followed by 2 fully connected layers. In
the experiments, we extract features from one of the 5
convolutional layers of the network. For large input patch
sizes, the output dimensionality is high, especially for lower
layers. For the descriptors to be more comparable to SIFT,
we decided to max-pool the extracted feature map down to
a ﬁxed 4 × 4 spatial size which corresponds to the spatial
resolution of SIFT pooling. Even though the spatial size is
the same, the number of features per cell is larger than for
SIFT.
As unsupervised CNN we evaluated the matching per-
formance of the 64c5-128c5-256c5-512f architecture, referred
to as Exemplar-CNN-orig in the following. As the experi-
ments show, neural networks cannot handle blur very well.
Increasing image blur always leads to a matching per-
formance drop. Hence we also trained another Exemplar-
CNN to deal with this speciﬁc problem. First, we increased
the ﬁlter size and introduced a stride of 2 in the ﬁrst
convolutional layer, resulting in the following architecture:
64c7s2-128c5-256c5-512f. This allows the network to identify
edges in very blurry images more easily. Secondly, we used
unlabeled images from Flickr for training, because these
represent the general distribution of natural images better
than STL. Thirdly, we applied blur of variable strength to
the training data as an additional augmentation. We thus
call this network Exemplar-CNN-blur. As with AlexNet, we
max-pooled the feature maps produced by the Exemplar-
CNNs to a 4 × 4 spatial size.
5.2
Datasets
The common matching dataset by Mikolajczyk et al. [42]
contains only 40 image pairs. This dataset size limits the
reliability of conclusions drawn from the results, especially
as we compare various design choices, such as the depth
of the network layer from which we draw the features.
We set up an additional dataset that contains 384 image
pairs. It was generated by applying 6 different types of
transformations with varying strengths to 16 base images
we obtained from Flickr. These images were not contained
in the set we used to train the unsupervised CNN.
To each base image we applied the geometric transfor-
mations rotation, zoom, perspective, and nonlinear deformation.
These cover rigid and afﬁne transformations as well as
more complex ones. Furthermore we applied changes to
lighting and focus by adding blur. Each transformation was

- Screenshot artifact: `C:\Users\jinsw712\Desktop\Files\Research_WIKI\raw\screenshots\Discriminative-Unsupervised-Feature-Learning-with-Exemplar-Convolutional-Neural-Networks-304c90e4ed90\page-0008.png`

### Page 9

9
applied in various magnitudes such that its effect on the
performance could be analyzed in depth. For each of the 16
base images we matched all the transformed versions of the
image to the original one, which resulted in 384 matching
pairs.
The dataset from Mikolajczyk et al. [42] was not gener-
ated synthetically but contains real photos taken from differ-
ent viewpoints or with different camera settings. While this
reﬂects reality better than a synthetic dataset, it also comes
with a drawback: the transformations are directly coupled
with the respective images. Hence, attributing performance
changes to either different image contents or to the applied
transformations becomes impossible. In contrast, the new
dataset enables us to evaluate the effect of each type of
transformation independently of the image content.
5.3
Performance Measure
To evaluate the matching performance for a pair of images,
we followed the procedure described in [41]. We ﬁrst ex-
tracted elliptic regions of interest and corresponding image
patches from both images using the maximally stable extremal
regions (MSER) detector [43]. We chose this detector because
it was shown to perform consistently well in [42] and it
is widely used. For each detected region we extracted a
patch according to the region scale and rotated it according
to its dominant orientation. The descriptors of all extracted
patches were greedily matched based on the Euclidean dis-
tance. This yielded a ranking of descriptor pairs. A pair was
considered as a true positive if the ellipse of the descriptor
in the target image and the ground truth ellipse in the target
image had an intersection over union (IOU) of at least 0.5.
All other pairs were considered false positives. Assuming
that a recall of 1 corresponds to the best achievable overall
matching given the detections, we computed a precision-
recall curve. The average precision, i.e., the area under this
curve, was used as performance measure.
5.4
Patch size and network layer
The MSER detector returns ellipses of varying sizes, de-
pending on the scale of the detected region. To compute
descriptors from these elliptic regions we normalized the
image patches to a ﬁxed size. It is not immediately clear
which patch size is best: larger patches provide a higher
resolution, but enlarging them too much may introduce
interpolation artifacts and the effect of high-frequency noise
may be emphasized. Therefore, we optimized the patch size
on the Flickr dataset for each method.
When using convolutional neural networks for region
description, aside from the patch size there is another fun-
damental choice – the network layer from which the features
are extracted. Features from higher layers are more abstract.
Fig. 8 shows the average performance of each method
when varying the patch size between 69 and 157. We
chose the maximum patch size value such that most el-
lipses are smaller than that. We found that in case of SIFT,
the performance monotonously grows and saturates at the
maximum patch size. SIFT is based on normalized ﬁnite
differences, and thus very robust to blurred edges caused
by interpolation. In contrast, for the networks, especially for
their lower layers, there is an optimal patch size, after which
performance starts degrading. The lower network layers
typically learn Gabor-like ﬁlters tuned to certain frequen-
cies. Therefore, they suffer from over-smoothing caused by
interpolation. Features from higher layers have access to
larger receptive ﬁelds and, thus, can again beneﬁt from
larger patch sizes.
In the following experiments we used the optimal pa-
rameters given by Fig. 8: patch size 157 for SIFT and 113 for
all other methods; layer 4 for AlexNet and Exemplar-CNN-
blur and layer 3 for Exemplar-CNN-orig.
5.5
Results
Fig. 9 shows scatter plots that compare the performance of
pairs of methods in terms of average precision. Each dot
corresponds to an image pair. Points above the diagonal
indicate better performance of the ﬁrst method, and for
points below the diagonal the AP of the second method is
higher. The scatter plots also give an intuition of the variance
in the performance difference.
Fig. 9a,b show that the features from both AlexNet and
the Exemplar-CNN outperform SIFT on the Flickr dataset.
However, especially for features from AlexNet there are
some image pairs, for which SIFT performs clearly better.
On the Mikolayczyk dataset, SIFT even outperforms fea-
tures from AlexNet. We will analyze this in more detail
in the next paragraph. Fig. 9c,f compare AlexNet with the
Exemplar-CNN-blur and show that the loss function based
on surrogate classes is superior to the loss function based
on object class labels. In contrast to object classiﬁcation,
class-speciﬁc features are not advantageous for descriptor
matching. A loss function that focuses on the invariance
properties required for descriptor matching yields better
results.
In Fig. 10 and 11 we analyze the reason for the clearly
inferior performance of AlexNet on some image pairs. The
ﬁgures show the mean average precision on the various
transformations of the datasets using the optimized param-
eters. On the Flickr dataset AlexNet performs better than
SIFT for all transformations except blur, where there is a
big drop in performance. Also on the Mikolayczyk dataset,
the blur and zoomout transformations are the main reason
for SIFT performing better overall. Actually this effect is not
surprising. At the lower layers, the networks mostly contain
ﬁlters that are tuned to certain frequencies. Also the features
at higher layers seem to expect a certain sharpness for
certain image structures. Consequently, a blurred version of
the same image activates very different features. In contrast,
SIFT is very robust to image blur as it uses simple ﬁnite
differences that indicate edges at all frequencies, and the
edge strength is normalized out.
The Exemplar-CNN-blur is much less affected by blur
since it has learned to be robust to it. To demonstrate the
importance of adding blur to the transformations, we also
included the Exemplar-CNN which was used for the classi-
ﬁcation task, i.e., without blur among the transformations.
Like AlexNet, it has problems with matching blurred images
to the original image.
Computation times per image are shown in Table 5.
SIFT computation is clearly faster than feature computa-
tion by neural networks, but the computation times of

- Screenshot artifact: `C:\Users\jinsw712\Desktop\Files\Research_WIKI\raw\screenshots\Discriminative-Unsupervised-Feature-Learning-with-Exemplar-Convolutional-Neural-Networks-304c90e4ed90\page-0009.png`

### Page 10

10
69
91
113
157
0.3
0.4
0.5
0.6
Patch size
Average matching mAP
SIFT
69
91
113
157
0.3
0.4
0.5
0.6
Patch size
Average matching mAP
AlexNet
 
 
Layer 1
Layer 2
Layer 3
Layer 4
Layer 5
69
91
113
157
0.3
0.4
0.5
0.6
Patch size
Average matching mAP
Exemplar−CNN−orig
 
 
Layer 1
Layer 2
Layer 3
Layer 4
69
91
113
157
0.3
0.4
0.5
0.6
Patch size
Average matching mAP
Exemplar−CNN−blur
 
 
Layer 1
Layer 2
Layer 3
Layer 4
Fig. 8. Analysis of the matching performance depending on the patch size and the network layer at which features are computed.
0
0.2
0.4
0.6
0.8
1
0
0.2
0.4
0.6
0.8
1
AP with SIFT
AP with AlexNet
AlexNet vs SIFT
(a)
0
0.2
0.4
0.6
0.8
1
0
0.2
0.4
0.6
0.8
1
AP with SIFT
AP with Exemplar−CNN−blur
Exemplar−CNN−blur vs SIFT
(b)
0
0.2
0.4
0.6
0.8
1
0
0.2
0.4
0.6
0.8
1
AP with AlexNet
AP with Exemplar−CNN−blur
Exemplar−CNN−blur vs AlexNet
(c)
0
0.2
0.4
0.6
0.8
1
0
0.2
0.4
0.6
0.8
1
AP with SIFT
AP with AlexNet
AlexNet vs SIFT
(d)
0
0.2
0.4
0.6
0.8
1
0
0.2
0.4
0.6
0.8
1
AP with SIFT
AP with Exemplar−CNN−blur
Exemplar−CNN−blur vs SIFT
(e)
0
0.2
0.4
0.6
0.8
1
0
0.2
0.4
0.6
0.8
1
AP with AlexNet
AP with Exemplar−CNN−blur
Exemplar−CNN−blur vs AlexNet
(f)
Fig. 9. Scatter plots for different pairs of descriptors on the Flickr dataset (upper row) and the Mikolajczyk dataset (lower row). Each point in
a scatter plot corresponds to one image pair, and its coordinates are the AP values obtained with the compared descriptors. AlexNet (supervised
training) and the Exemplar-CNN yield features that outperform SIFT on most images of the Flickr dataset (a,b), but AlexNet is inferior to SIFT on
the Mikolajczyk dataset. Features obtained with the unsupervised training procedure outperform the features from AlexNet on both datasets (c,f).
the neural networks are not prohibitively large, especially
when extracting many descriptors per image using parallel
hardware.
Method
SIFT
AlexNet
Ex-CNN-blur
CPU
4.5ms
28.2ms
103.9ms
GPU
-
0.7ms
1.8ms
TABLE 5
Feature computation times for a patch of 113 by 113 pixels.
6
CONCLUSIONS
We have proposed a discriminative objective for unsuper-
vised feature learning by training a CNN without object
class labels. The core idea is to generate a set of surrogate
labels via data augmentation, where the applied transfor-
mations deﬁne the invariance properties that are to be
learned by the network. The learned features yield a large
improvement in classiﬁcation accuracy compared to fea-
tures obtained with previous unsupervised methods. These
results strongly indicate that a discriminative objective is
superior to objectives previously used for unsupervised
feature learning. The unsupervised training procedure also
lends itself to learn features for geometric matching tasks. A
comparison to the long standing state-of-the-art descriptor
for this task, SIFT, revealed a problem when matching
neural network features in case of blur. We showed that
by adding blur to the set of transformations applied during
training, the features obtained with such a network are not
much affected by this problem anymore and outperform

- Screenshot artifact: `C:\Users\jinsw712\Desktop\Files\Research_WIKI\raw\screenshots\Discriminative-Unsupervised-Feature-Learning-with-Exemplar-Convolutional-Neural-Networks-304c90e4ed90\page-0010.png`

### Page 11

11
1
2
3
0
0.2
0.4
0.6
0.8
1
Transformation magnitude
Matching mean AP
Nonlinear
1
2
3
4
0
0.2
0.4
0.6
0.8
1
Transformation magnitude
Matching mean AP
Lighting
1
2
3
0
0.2
0.4
0.6
0.8
1
Transformation magnitude
Matching mean AP
Rotation
 
 
SIFT
AlexNet
Exemplar−CNN−orig
Exemplar−CNN−blur
1
2
3
4
5
0
0.2
0.4
0.6
0.8
1
Transformation magnitude
Matching mean AP
Perspective
1
2
3
4
5
6
0
0.2
0.4
0.6
0.8
1
Transformation magnitude
Matching mean AP
Zoom
1
2
3
0
0.2
0.4
0.6
0.8
1
Transformation magnitude
Matching mean AP
Blur
Fig. 10. Mean average precision on the Flickr dataset for various transformations. Except for the blur transformation, all networks perform
consistently better than SIFT. The network trained with blur transformations can keep up with SIFT even on blur.
1
2
3
4
5
0
0.2
0.4
0.6
0.8
Transformation magnitude
Matching mean AP
Zoom+rotation (bark)
1
2
3
4
5
0
0.2
0.4
0.6
0.8
Transformation magnitude
Matching mean AP
Blur (bikes)
1
2
3
4
5
0
0.2
0.4
0.6
0.8
Transformation magnitude
Matching mean AP
Zoomout+rotation (boat)
 
 
SIFT
AlexNet
Exemplar−CNN−orig
Exemplar−CNN−blur
1
2
3
4
5
0
0.2
0.4
0.6
0.8
Transformation magnitude
Matching mean AP
Viewpoint (graf)
1
2
3
4
5
0
0.2
0.4
0.6
0.8
Transformation magnitude
Matching mean AP
Lighting (leuven)
1
2
3
4
5
0
0.2
0.4
0.6
0.8
Transformation magnitude
Matching mean AP
Blur (trees)
1
2
3
4
5
0
0.2
0.4
0.6
0.8
Transformation magnitude
Matching mean AP
Compression (ubc)
1
2
3
4
5
0
0.2
0.4
0.6
0.8
Transformation magnitude
Matching mean AP
Viewpoint (wall)
Fig. 11. Mean average precision on the Mikolajczyk dataset. The networks perform better on viewpoint transformations, while SIFT is more robust
to strong blur and lighting transformations.

- Screenshot artifact: `C:\Users\jinsw712\Desktop\Files\Research_WIKI\raw\screenshots\Discriminative-Unsupervised-Feature-Learning-with-Exemplar-Convolutional-Neural-Networks-304c90e4ed90\page-0011.png`

### Page 12

12
SIFT on most image pairs. This simple inclusion of blur
demonstrates the ﬂexibility of the proposed unsupervised
learning strategy. The strong relationship of the approach to
data augmentation in supervised settings also emphasizes
the value of data augmentation in general and suggests the
use of more diverse transformations.
APPENDIX A
FORMAL ANALYSIS
Proposition 1. The function
Z(x) = log ∥exp(x)∥1, x ∈Rn
is convex. Moreover, for any x ∈Rn the kernel of its
Hessian matrix ∇2Z(x) is given by span (1)
Proof Since
Z(x) = log ∥exp(x)∥1 = log
n
X
i=1
exp(xi)
(8)
we need to prove the convexity of the log-sum-exp function.
The Hessian ∇2 of this function is given as
∇2Z(x) =
1
(1T u)2 ((1T u) diag (u) −uuT ),
(9)
with u = exp(x) and 1 ∈Rn being a vector of ones. To
show the convexity we must prove that zT ∇2Z(x)z ≥0 for
all x, z ∈Rn. From (9) we get
zT ∇2Z(x) z =
1
(1T u)2 ((1T u) zT diag (u) z −zT uuT z)
= (Pn
k=1 ukz2
k)(Pn
k=1 uk) −(Pn
k=1 ukzk)2
(Pn
k=1 uk)2
≥0
(10)
since
(Pn
k=1 uk)2
≥
0
and
(Pn
k=1 zkuk)2
≤
(Pn
k=1 ukz2
k)(Pn
k=1 uk)
due
to
the
Cauchy-Schwarz
inequality.
Inequality (10) only turns to equality if
√ukzk = c√uk,
(11)
where the constant c does not depend on k. This immedi-
ately gives z = c1, which proves the second statement of
the proposition.
Proposition 2. Let α ∈A be a random vector with values
in a bounded set A ⊂Rk. Let x(·): A →Rn be a
continuous function. Then inequality (7)
Eα [log ∥exp(x(α))∥1] −log ∥exp(Eα[x(α)])∥1 ≥0
holds and only turns to equality if for all α1, α2 ∈A:
(x(α1) −x(α2)) ∈span (1) .
Proof Inequality (7) immediately follows from convexity of
the function log ∥exp(·)∥1 and Jensen’s inequality.
Jensen’s inequality only turns to equality if the function
it is applied to is afﬁne-linear on the convex hull of the
integration region. In particular this implies
(x(α1) −x(α2))T ∇2Z(x(α1)) (x(α1) −x(α2)) = 0 (12)
for all α1, α2 ∈A. The second statement of Proposition 1
thus immediately gives x(α1) −x(α2) = c1, Q.E.D.
APPENDIX B
METHOD DETAILS
We describe here in detail the network architectures we
evaluated and explain the network training procedure. We
also provide details of the clustering process we used to
improve Exemplar-CNN.
B.1
Network Architecture
We tested various network architectures in combination
with our training procedure. They are coded as follows:
NcF stands for a convolutional layer with N ﬁlters of size
F × F pixels, Nf stands for a fully connected layer with
N units. For example, 64c5-64c5-128f denotes a network
with two convolutional layers containing 64 ﬁlters spanning
5 × 5 pixels each followed by a fully connected layer with
128 units. The last speciﬁed layer is always succeeded by
a softmax layer, which serves as the network output. We
applied 2 × 2 max-pooling to the outputs of the ﬁrst and
second convolutional layers.
As stated in the paper we used a 64c5-64c5-128f architec-
ture in our experiments to evaluate the inﬂuence of different
components of the augmentation procedure (we refer to this
architecture as the ’small’ network). A large network, coded
as 64c5-128c5-256c5-512f, was then used to achieve better
classiﬁcation performance.
All considered networks contained rectiﬁed linear units
in each layer but the softmax layer. Dropout was applied to
the fully connected layer.
B.2
Training the Networks
We adopted the common practice of training the network
with stochastic gradient descent with a ﬁxed momentum of
0.9. We started with a learning rate of 0.01 and gradually de-
creased the learning rate during training. That is, we trained
until there was no improvement in validation error, then
decreased the learning rate by a factor of 3, and repeated
this procedure until convergence. Training times on a Titan
GPU were roughly 1.5 days for the 64c5-64c5-128f network,
4 days for the 64c5-128c5-256c5-512f network and 9 days for
the 92c5-256c5-512c5-1024f network.
B.3
Clustering
To judge about similarity of the clusters we use the follow-
ing simple heuristics. The method of [39] gives us a set
of linear SVMs. We apply these SVMs to the whole STL-
10 unlabeled dataset and select Npercluster = 10 top ﬁring
images per SVM, which gives us a set of initial clusters. We
then compute the overlap (number of common images) of
each pair of these clusters. We set two thresholds Tmerge = 3
and Tdiscard = 1 and perform a greedy procedure: starting
from the most overlapping pair of clusters, we merge the
clusters if their overlap exceeds Tmerge and discard one of
the clusters if the overlap is between Tdiscard and Tmerge.
APPENDIX C
DETAILS OF COMPUTING THE MEASURE OF INVARI-
ANCE
We now explain in detail and motivate the computation of
the normalized Euclidean distance used as a measure of
invariance in the paper.

- Screenshot artifact: `C:\Users\jinsw712\Desktop\Files\Research_WIKI\raw\screenshots\Discriminative-Unsupervised-Feature-Learning-with-Exemplar-Convolutional-Neural-Networks-304c90e4ed90\page-0012.png`

### Page 13

13
First we compute feature vectors of all image patches
and their transformed versions. Then we normalize each
feature vector to unit Euclidean norm and compute the
Euclidean distances between each original patch and all
of its transformed versions. For each transformation and
magnitude we average these distances over all patches.
Finally, we divide the resulting curves by their maximal
values (typically it is the value for the maximum magnitude
of the transformation).
The normalizations are performed to compensate for
possibly different scales of different features. Normalizing
feature vectors to unit length ensures that the values are
in the same range for different features. The ﬁnal nor-
malization of the curves by the maximal value allows to
compensate for different variation of different features: as an
extreme, a constant feature would be considered perfectly
invariant without this normalization, which is certainly not
desirable.
The resulting curves show how quickly the feature repre-
sentation changes when an image is transformed more and
more. A representation for which the curve steeply goes up
and then remains constant cannot be considered invariant
to the transformation: the feature vector of the transformed
patch becomes completely uncorrelated with the original
feature vector even for small magnitudes of the transfor-
mation. On the other hand, if the curve grows gradually,
this indicates that the feature representation changes slowly
when the transformation is applied, meaning invariance or,
rather, covariance of the representation.
ACKNOWLEDGMENTS
AD, PF, and TB acknowledge funding by the ERC Starting
Grant VideoLearn (279401). JTS and MR are supported by
the BrainLinks-BrainTools Cluster of Excellence funded by
the German Research Foundation (EXC 1086). PF acknowl-
edges a fellowship by the Deutsche Telekom Stifung.
REFERENCES
[1]
A. Krizhevsky, I. Sutskever, and G. E. Hinton, “ImageNet
classiﬁcation with deep convolutional neural networks,”
in NIPS, 2012, pp. 1106–1114.
[2]
M. D. Zeiler and R. Fergus, “Visualizing and understand-
ing convolutional networks,” in ECCV, 2014.
[3]
J. Donahue, Y. Jia, O. Vinyals, J. Hoffman, N. Zhang,
E. Tzeng, and T. Darrell, “DeCAF: A deep convolutional
activation feature for generic visual recognition,” in ICML,
2014.
[4]
A. S. Razavian, H. Azizpour, J. Sullivan, and S. Carlsson,
“CNN features off-the-shelf: An astounding baseline for
recognition,” in CVPR Workshops 2014, 2014, pp. 512–519.
[5]
R. Girshick, J. Donahue, T. Darrell, and J. Malik, “Rich fea-
ture hierarchies for accurate object detection and semantic
segmentation,” in CVPR, 2014.
[6]
P. Sermanet, D. Eigen, X. Zhang, M. Mathieu, R. Fergus,
and Y. LeCun, “OverFeat: Integrated recognition, localiza-
tion and detection using convolutional networks.” in ICLR,
2014.
[7]
B. Hariharan, P. Arbelez, R. Girshick, and J. Malik, “Hy-
percolumns for object segmentation and ﬁne-grained lo-
calization,” CVPR, 2015.
[8]
J. Long, E. Shelhamer, and T. Darrell, “Fully convolutional
networks for semantic segmentation,” in CVPR, 2015.
[9]
J. Deng, W. Dong, R. Socher, L.-J. Li, K. Li, and L. Fei-Fei,
“ImageNet: A Large-Scale Hierarchical Image Database,”
in CVPR, 2009.
[10] M. Everingham, L. Gool, C. K. Williams, J. Winn, and
A. Zisserman, “The Pascal Visual Object Classes (VOC)
Challenge,” IJCV, vol. 88, no. 2, pp. 303–338, 2010.
[11] Y. LeCun, B. Boser, J. S. Denker, D. Henderson, R. E.
Howard, W. Hubbard, and L. D. Jackel, “Backpropagation
applied to handwritten zip code recognition,” Neural Com-
putation, vol. 1, no. 4, pp. 541–551, 1989.
[12] K. Kavukcuoglu, P. Sermanet, Y. Boureau, K. Gregor,
M. Mathieu, and Y. LeCun, “Learning convolutional fea-
ture hierachies for visual recognition,” in NIPS, 2010.
[13] P. Vincent, H. Larochelle, Y. Bengio, and P.-A. Manzagol,
“Extracting and composing robust features with denoising
autoencoders,” in ICML, 2008, pp. 1096–1103.
[14] W. Y. Zou, A. Y. Ng, S. Zhu, and K. Yu, “Deep learning
of invariant features via simulated ﬁxations in video,” in
NIPS, 2012, pp. 3212–3220.
[15] K. Sohn and H. Lee, “Learning invariant representations
with local transformations,” in ICML, 2012.
[16] K. Y. Hui, “Direct modeling of complex invariances for
visual object features,” in ICML, 2013.
[17] P. Simard, B. Victorri, Y. LeCun, and J. S. Denker, “Tangent
Prop - A formalism for specifying selected invariances in
an adaptive network,” in NIPS, 1992.
[18] H. Drucker and Y. LeCun, “Improving generalization per-
formance using double backpropagation,” IEEE Transac-
tions on Neural Networks, vol. 3, no. 6, pp. 991–997, 1992.
[19] M.-R. Amini and P. Gallinari, “Semi supervised logistic
regression,” in ECAI, 2002, pp. 390–394.
[20] Y. Grandvalet and Y. Bengio, “Entropy regularization,” in
Semi-Supervised Learning.
MIT Press, 2006, pp. 151–168.
[21] A. Ahmed, K. Yu, W. Xu, Y. Gong, and E. Xing, “Training
hierarchical feed-forward visual recognition models using
transfer learning from pseudo-tasks.” in ECCV (3), 2008,
pp. 69–82.
[22] R.
Collobert,
J.
Weston,
L.
Bottou,
M.
Karlen,
K.
Kavukcuoglu,
and
P.
Kuksa,
“Natural
language
processing (almost) from scratch,” Journal of Machine
Learning Research, vol. 12, pp. 2493–2537, 2011.
[23] S. Wager, S. Wang, and P. Liang, “Dropout training as
adaptive regularization,” in NIPS, 2013.
[24] S. Rifai, Y. N. Dauphin, P. Vincent, Y. Bengio, and X. Muller,
“The manifold tangent classiﬁer,” in NIPS, 2011.
[25] A. Coates, H. Lee, and A. Y. Ng, “An analysis of single-
layer networks in unsupervised feature learning,” AIS-
TATS, 2011.
[26] A. Krizhevsky and G. Hinton, “Learning multiple layers
of features from tiny images,” Master’s thesis, Department
of Computer Science, University of Toronto, 2009.
[27] L. Fei-Fei, R. Fergus, and P. Perona, “Learning generative
visual models from few training examples: An incremental
bayesian approach tested on 101 object categories,” in
CVPR WGMBV, 2004.
[28] G. Grifﬁn, A. Holub, and P. Perona, “Caltech-256 object
category dataset,” California Institute of Technology, Tech.
Rep. 7694, 2007.
[29] G. E. Hinton, N. Srivastava, A. Krizhevsky, I. Sutskever,
and R. R. Salakhutdinov, “Improving neural networks by
preventing co-adaptation of feature detectors,” 2012, pre-
print, arxiv:cs/1207.0580v3.
[30] N. Srivastava, G. Hinton, A. Krizhevsky, I. Sutskever, and
R. Salakhutdinov, “Dropout: A simple way to prevent neu-
ral networks from overﬁtting,” Journal of Machine Learning
Research, vol. 15, pp. 1929–1958, 2014.
[31] Y. Jia, E. Shelhamer, J. Donahue, S. Karayev, J. Long,
R. Girshick, S. Guadarrama, and T. Darrell, “Caffe: Con-
volutional architecture for fast feature embedding,” arXiv
preprint arXiv:1408.5093, 2014.

- Screenshot artifact: `C:\Users\jinsw712\Desktop\Files\Research_WIKI\raw\screenshots\Discriminative-Unsupervised-Feature-Learning-with-Exemplar-Convolutional-Neural-Networks-304c90e4ed90\page-0013.png`

### Page 14

14
[32] A. Coates and A. Y. Ng, “Selecting receptive ﬁelds in deep
networks,” in NIPS, 2011, pp. 2528–2536.
[33] Y. Boureau, N. Le Roux, F. Bach, J. Ponce, and Y. LeCun,
“Ask the locals: multi-way local pooling for image recog-
nition,” in ICCV’11.
IEEE, 2011.
[34] L. Bo, X. Ren, and D. Fox, “Unsupervised feature learning
for RGB-D based object recognition,” in ISER, June 2012.
[35] ——, “Multipath sparse coding using hierarchical match-
ing pursuit,” in CVPR, 2013, pp. 660–667.
[36] K. Swersky, J. Snoek, and R. P. Adams, “Multi-task
bayesian optimization,” in NIPS, 2013.
[37] C.-Y. Lee, S. Xie, P. Gallagher, Z. Zhang, and Z. Tu, “Deeply
supervised nets,” in Deep Learning and Representation Learn-
ing Workshop, NIPS, 2014.
[38] K. He, X. Zhang, S. Ren, and J. Sun, “Spatial pyramid
pooling in deep convolutional networks for visual recog-
nition,” in ECCV, 2014.
[39] S. Singh, A. Gupta, and A. A. Efros, “Unsupervised discov-
ery of mid-level discriminative patches,” in ECCV, 2012.
[40] D. G. Lowe, “Distinctive image features from scale-
invariant keypoints,” IJCV, vol. 60, no. 2, pp. 91–110, Nov.
2004.
[41] K. Mikolajczyk and C. Schmid, “A performance evaluation
of local descriptors,” IEEE Trans. Pattern Anal. Mach. Intell.,
vol. 27, no. 10, pp. 1615–1630, 2005.
[42] K. Mikolajczyk, T. Tuytelaars, C. Schmid, A. Zisserman,
J. Matas, F. Schaffalitzky, T. Kadir, and L. J. V. Gool, “A
comparison of afﬁne region detectors,” IJCV, vol. 65, no.
1-2, pp. 43–72, 2005.
[43] J. Matas, O. Chum, M. Urban, and T. Pajdla, “Robust wide
baseline stereo from maximally stable extremal regions,”
in Proc. BMVC, 2002, pp. 36.1–36.10, doi:10.5244/C.16.36.

- Screenshot artifact: `C:\Users\jinsw712\Desktop\Files\Research_WIKI\raw\screenshots\Discriminative-Unsupervised-Feature-Learning-with-Exemplar-Convolutional-Neural-Networks-304c90e4ed90\page-0014.png`
