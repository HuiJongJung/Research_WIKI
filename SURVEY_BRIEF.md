# 조사 세션 브리프

> 이 파일은 **문헌 조사 전담 세션**의 부트스트랩 문서다. 세션 시작 시 이 파일을 먼저 읽고, 아래 지시대로 참고 파일을 읽은 뒤 조사 큐의 최상단 항목부터 수행한다.

## 0. 먼저: 이 저장소의 AGENTS.md는 적용하지 않는다

`AGENTS.md`와 `journal.md`는 이 저장소에서 과거에 진행한 **위키 MCP 도구 개발 프로젝트**의 운영 규칙과 빌드 로그다. 연구 조사 임무와 무관하다. `TASK.md` 한 항목씩 처리, 구현 루프, 검증 커맨드 등의 규율은 **따르지 않는다**. 조사 임무의 규율은 이 문서가 정한다.

## 1. 역할 경계

세 세션이 있고 이 세션은 그중 하나다.

| 세션 | 담당 | 산출물 |
| --- | --- | --- |
| 위키 판단 세션 | 방향, 판정, 설계, novelty | 메모리 파일, EXPERIMENT.md 판정 절 |
| 실험 세션 | 코드, 학습, 측정 | EXPERIMENT.md 실험 절, experiments/ 카드 |
| **조사 세션 (이 세션)** | **문헌 조사, 사실 확인, 위키 페이지 작성** | **wiki/ 페이지, 이 파일의 큐 상태** |

**이 세션이 하지 않는 것**

- 연구 방향을 바꾸지 않는다. 조사 결과가 방향에 영향을 준다고 판단되면 큐 항목의 결과란에 "판단 필요"로 적고 넘긴다.
- 메모리 파일(`.claude/projects/.../memory/`)을 수정하지 않는다. 읽기만 한다. 소유자는 위키 판단 세션이다.
- `UnderConstrained-GS-Recon/EXPERIMENT.md`를 수정하지 않는다.
- 조사 범위를 스스로 넓히지 않는다. 큐에 없는 주제로 확장하지 않는다.

## 2. 세션 시작 시 읽을 파일 (이 순서)

1. **연구 공용 최신본**: `wiki/system/research-status.md` (이 저장소)
   연구 한 줄, 남긴 아이디어, 열린 질문, related work, 폐기 목록, 용어 규칙이 전부 여기 있다. **세 갈래 세션이 공유하는 단일 최신본이며 이것만 읽으면 맥락이 선다.** (08-21 전면 재작성 — 배경 시대 내용은 `raw/status-archive/`로 이동, 옛 큐 항목의 배경·판별값 맥락은 그 스냅샷에 있다)
2. **연구 방법 규율**: `wiki/system/rules-research.md`
   특히 **1-5 (문헌은 의도를 축으로 잇는다)** — 이 세션의 모든 논문 정리는 이 형식을 따른다: 꼬집는 문제 상황 → 방향성·방법 → **의도(왜 그 방법이 그 문제를 풀 것이라 생각했는가)** → 결과 지표 → 남는 한계.
3. (필요 시) **실험 상태**: `C:\Users\jinsw712\Desktop\Files\UnderConstrained-GS-Recon\EXPERIMENT.md`
   조사 항목이 특정 실험 결과와 얽힐 때만 해당 절을 읽는다. 전체 정독 불필요.
4. (필요 시) **연구 이력**: `wiki/system/progress-YYYY-MM-DD.md`
   "언제 왜 이렇게 정해졌나"가 필요할 때만 날짜를 지정해 읽는다. 평소에는 읽지 않는다.
5. (필요 시) **용어 상세**: `C:\Users\jinsw712\.claude\projects\C--Users-jinsw712-Desktop-Files-Research-WIKI\memory\terminology-preferences.md`
   확정 용어표 전문과 인용문 은행. 핵심 금지어는 위 1번에 이미 들어 있다.

**읽지 않는 것**: `journal.md`, `harness/`, `specs/`, `PRD.md`, `TASK.md`, `docs/`, `AGENTS.md`. 2026년 6월에 끝난 위키 MCP 도구 개발 프로젝트의 유물이다.

## 3. 조사 규율

> 08-19 확장판. 추가된 규칙은 전부 이 프로젝트에서 실제로 겪은 사고에서 나왔다 — 괄호의 사례가 그것이다.

**출처의 격**

- **출처 없는 문장을 쓰지 않는다.** 모든 사실 주장에 논문 제목, 발표처, 연도, arXiv 번호 또는 URL을 붙인다.
- **모든 사실에 `[원문 확인]` / `[2차 자료]` / `[미검증]` 셋 중 하나를 단다.** 기억이나 추론으로 빈칸을 메우지 않는다.
- **수치는 표 번호·절 번호까지** 적는다 ("Table 3", "§4.1"). "논문에 있다"는 출처가 아니다.
- **arXiv는 판본과 날짜를 박는다.** 판본에 따라 문구가 달랐던 사고가 있다 (3DGS 게재본 "artifacts" 대 ar5iv판 "floaters").
- **2차 자료의 수치는 원전과 대조한다.** 논문 A가 전하는 논문 B의 수치가 B 원문과 어긋난 사례가 있다 (StableNormal이 전한 DSINE 수치 18.6 대 원전 16.4). 어긋나면 둘 다 기록하고 어느 쪽을 쓸지는 판단 세션에 넘긴다.

**논문 주장과 실물의 구분**

- **"논문이 주장한다 / 표가 보여준다 / 코드가 실제로 한다"를 구분해 쓴다.** 논문 임계값과 코드 기본값이 달랐고(COLMAP 논문 2° 대 코드 1.5°), 논문에 없는 동작이 코드에 하드코딩돼 있었다(AmbiSuR의 배경 crop).
- 기법의 핵심 동작은 가능하면 공개 코드에서 교차 확인한다. 코드를 못 봤으면 `[코드 미확인]`을 단다.
- **SOTA·비교 주장은 그 비교표에 누가 빠져 있는지부터 본다.** 자기 표에서만 SOTA인 사례가 있다 (GVGS — 비교표에 GeoSVR·AmbiSuR 부재).
- **서로 다른 프로토콜의 수치를 한 문장에 섞지 않는다** (상대 깊이 표와 절대 깊이 표의 혼합 금지 — DA3 Table 4 대 Table 11).

**부정 결과와 공정성**

- **찾지 못했으면 "찾지 못함"이라고 적는다.** 그것은 실패가 아니라 결론이다. 단 **탐색 경로(검색어·훑은 목록)를 함께 남겨야** 부재 주장이 선다. 느슨하게 관련된 논문으로 대체하지 않으며, 대체할 경우 "인접 항목, 직접 답 아님"이라고 이유와 함께 표시한다.
- **우리 가설에 불리한 발견을 우선 보고한다.** 유리한 해석을 먼저 찾지 않는다. 경쟁 기법의 limitations 자인은 verbatim으로 기록한다 — 반박 불가 재료다.

**인용**

- **원문 우선.** 요약 사이트나 블로그가 아니라 논문 본문에서 확인한다. 인용문은 verbatim, 15단어 이내, 위치 명기. 의역해 놓고 따옴표를 치지 않는다.

## 4. 용어 (전문은 terminology-preferences.md)

- under-constrained (저관측 금지), artifacts / floaters / holes (붕괴 금지), photometric ambiguity
- **"신호(signal)" 사용 금지.** 판별값, 지표, confidence, 측도로 치환한다.
- **"채점" 사용 금지.** 동일 기준 비교, 정량 대조로 치환한다.
- 대시를 쓰고 뒤에 덧붙이는 문장 구조를 쓰지 않는다.
- 문서 하나 안에서 말투를 통일한다.

## 5. 산출물 형식

- 논문 하나를 소화했으면 `wiki/sources/<slug>.md`, 재사용 가능한 개념은 `wiki/concepts/<slug>.md`로 남긴다. 형식은 기존 페이지를 따른다.
- 조사 항목 하나가 끝날 때마다 **이 파일의 큐에 결과 요약 3줄 이내와 상태를 갱신**한다.
- 큐 항목의 결과가 연구 판단을 요구하면 "판단 필요"로 표시한다. 위키 판단 세션이 회수한다.

---

## 6. 조사 큐

상태: `대기` / `진행중` / `완료` / `판단 필요`

### Q-01. 통제된 실험 무대 후보 조사 [완료] (우선순위 1)

**결과**: GT mesh 제공 후보 8종을 표로 정리했다 (`wiki/comparisons/gt-mesh-benchmark-candidates.md`). 실외 대규모는 SS3DM(CARLA 합성 mesh, CC BY 4.0), 정밀 물체는 MobileBrick, 가늘고 긴 구조물은 Asset Inspection Benchmark의 crane 씬이 후보다.
해골 씬은 **DTU scan65**이며 GT는 mesh가 아니라 구조광 점군이다(2차 자료 근거, 원전 미확인). 구멍 있는 물체를 표적으로 삼은 선행은 찾지 못했고, 가늘고 긴 구조물 쪽만 존재한다.
**SparseGS는 SAM을 쓰지 않는다**(v2·v4 확인). 대상 선별 선례는 GaussianObject(SA3D 마스크로 visual hull 초기화, NVS 전용, mesh 미보고)다.
**보완(08-09)**: scan65 입력 이미지를 내려받아 해골임을 직접 확인(검증 완료). MobileBrick은 MIT, gt_mesh는 GT depth의 TSDF fusion. T&T는 비상업 제한 확실(명칭 혼재). NeRF-Synthetic은 blend 파일에서 GT mesh를 뽑는 관행(TriaGS·RayDF). Shelly는 공식 배포처를 찾지 못함. 선례 arXiv 번호 확보(Curve-aware GS 2506.21401, EdgeGaussians 2409.12886).


배경 전체를 표적으로 삼는 것이 석사 범위를 넘는다는 지적을 받았다. GT mesh가 있는 통제된 무대로 옮기는 안을 검토 중이다.

- GT mesh를 제공하는 합성 씬 및 object 중심 데이터셋 후보를 표로 정리 (이름, 규모, GT 형식, 라이선스, GS 계열에서의 사용 사례)
- 3DGS 계열에서 흔히 쓰는 데이터셋 중 GT mesh가 함께 제공되는 것이 있는지 확인. 해골이 등장하는 씬에 GT mesh가 있다는 제보가 있으니 그 씬의 정체를 특정할 것
- 구멍이 있는 물체, 가늘고 긴 구조물(파이프 등)처럼 재구성이 어려운 형상을 표적으로 삼은 선행 연구가 있는지
- SparseGS가 SAM으로 대상을 선별해 복원한다고 알려져 있다. 그 선별 기준과 목적을 확인 (표적을 object로 옮길 경우의 선례)

### Q-02. 삼각측량각을 사용한 선례 조사 [완료] (우선순위 2)

**결과**: 학습 내부에서 각을 loss 가중·prior 게이트·densification 제어에 쓴 사례는 **찾지 못했다** (`wiki/questions/triangulation-angle-in-training-precedent.md`).
가장 가까운 인접은 PanoLOG(arXiv 2607.08769)로, 시차각에서 깊이 불확실도를 유도해 **학습 전 경계 상자 여백**을 정한다. 감독 배분은 하지 않는다. TriaGS(arXiv 2512.06269)는 삼각측량을 쓰되 각이 아니라 합의점 거리 loss다.
각과 깊이 불확실도의 관계는 고전 MVS(Rumpler 외, AAPR 2011)가 이미 확립했다. "쓸모없어서 안 쓴 것이 아니라 학습 감독으로 옮긴 사례가 없다"는 서술이 가능하다. **판단 필요.**


우리 판별값의 신뢰도 확보용이자, "5년간 아무도 안 썼으면 쓸모없는 것 아니냐"는 반론에 대한 답이다.

- 삼각측량각(parallax angle, triangulation angle)을 NeRF 또는 3DGS **학습 내부**에서 loss 가중, prior 주입 게이트, densification 제어에 쓴 사례가 있는가
- 촬영 계획(next-best-view, capture planning) 용도는 이미 파악되어 있으므로 제외한다. 고정 캡처의 재구성 목적함수 안으로 가져온 사례만 찾는다
- 없으면 "찾지 못함"으로 명확히 결론낼 것. 그 자체가 우리 기여의 근거가 된다

### Q-03. 3DGS 원논문 초기화 ablation 문구 확인 [완료] (우선순위 2)

**결과**: 확인됨. 7.3절에 "Instead, it degrades mainly in the background"가 있고 Fig. 7을 가리킨다. **인용 가능**하며 B6의 미검증 표시를 해제할 수 있다 (`wiki/claims/3dgs-random-init-background-degradation.md`).
Table 3 기준 Random Init 대 Full의 30K 평균은 20.42 대 26.05 (격차 5.63 dB). 무작위 초기화는 카메라 경계 상자 3배 정육면체 안의 균일 표집이다.
덤으로 **합성 NeRF 데이터셋에서는 이 저하가 나타나지 않으며 그 이유로 배경 부재를 든다**는 문장도 있다. 인용 범위는 "점군 유무가 배경을 가른다"까지이며 각도 언급은 없다.
**보완(08-09)**: 게재본 PDF(p.9~10) 대조 완료. 수치 일치. 단 정정 하나 — 게재본 문장은 "more **artifacts** that cannot be removed"이며 ar5iv가 전한 "floaters"가 아니다. Fig. 7은 Garden 씬. 7.4 Limitations 첫 문장("In regions where the scene is not well observed we have artifacts")과 split이 배경 재구성에 중요하다는 문장도 추가 확보. 미검증 잔여 없음.


- Kerbl et al., "3D Gaussian Splatting for Real-Time Radiance Field Rendering" (SIGGRAPH 2023, arXiv 2308.04079)의 초기화 ablation에서, SfM 점 대신 무작위 초기화를 썼을 때 **어느 영역의 품질이 저하된다고 적었는지** 정확한 문장을 확인한다
- 배경 영역을 명시했다는 기억이 있으나 미검증 상태다. 확인 전까지 인용 금지
- 정량 수치(PSNR 차이, 표 번호)도 함께 수집

### Q-04. 학습 프론트엔드 confidence의 사용처 조사 [판단 필요] (우선순위 2)

**결과**: 대부분은 초기화 시 점 필터링이며 위협이 아니다. VGGT-X는 VGGT confidence를 쓰지 않기로 하고 대응점 가중으로 대체했다 (반례). 상세는 `wiki/questions/learned-frontend-confidence-usage.md`.
**위협 후보 1건**: CDGS(arXiv 2502.14684)가 학습 전에 만든 화소별 confidence로 깊이 감독을 가중하고 T&T에서 F-score와 M3C2까지 보고한다. 다만 그 confidence는 학습 프론트엔드가 아니라 Canny·Laplacian·깊이 기울기의 손설계 결합이다.
**구조 선점 1건**: AREA3D(arXiv 2512.05131)가 per-pixel depth confidence를 복셀 격자에 splat해 3D 불확실도 field를 만든다. 용도는 능동 촬영 시점 선택이다. mesh 품질을 표적으로 한 사례는 찾지 못했다.
**보완(08-09)**: InstantSplat v6 본문 3.4절에서 confidence-aware optimizer 확인. **위협 후보로 격상.** MASt3R confidence로 점별 학습률을 조정하되 방향이 우리와 반대다(저신뢰 점을 더 크게 움직임, "prioritizing points with lower confidence"). 평가는 여전히 NVS이며 mesh 지표 없음. 위협표 등재 여부와 개입 방향 반대를 차별화 논거로 쓸지 판단 필요.


새로 발견된 인접 위협이다.

- DUSt3R, MASt3R, VGGT 등이 출력하는 per-pixel confidence가 3DGS 파이프라인에서 어떻게 쓰이는지 열거한다. 초기화 시 점 필터링인지, 학습 중 loss 가중인지, prior 주입 게이트인지 구분할 것
- 그 confidence를 **3D 공간 격자로 올려** 공간적으로 사용한 사례가 있는가
- mesh 또는 표면 재구성 품질을 표적으로 한 사례가 있는가 (대부분 novel view synthesis일 것으로 예상)
- 점 필터링과 pruning은 위협이 아니다. supervision 배분에 쓴 경우만 위협으로 분류한다

### Q-05. prior 모델의 공표 정확도 조사 [완료] (우선순위 3)

**결과**: 공표 정확도는 실내와 근거리에 몰려 있다 (`wiki/comparisons/prior-model-reported-accuracy.md`). Depth Anything V2의 기본 출력은 affine-invariant inverse depth(상대)이고, 절대 깊이는 Hypersim·Virtual KITTI 미세조정 별도 판본이며 **그 정량 결과가 원논문에 없다**.
저자들이 영교차 표의 수치가 강점을 반영하지 못한다고 스스로 유보를 달았다. 하늘(구름) 깊이 오예측을 실패 사례로 자인한다. DA-2K 실외 93.9퍼센트는 거리 오차가 아니라 상대 순위 정답률이다.
법선은 StableNormal 기준 벤치마크 넷이 **전부 실내**이며 평균각오차가 13~20도다. 실외 대규모의 근거는 깊이·법선 모두 없다.
**보완(08-09)**: DSINE 원논문(arXiv 2403.00712) Table 2 확보 — NYUv2 16.4/8.4, ScanNet 16.2/8.3, iBims-1 17.1/6.1. StableNormal 표가 전하는 DSINE 수치와 다르므로(NYUv2 18.6 대 16.4) 인용 시 출처 표를 명시할 것. 실내 한정 결론은 불변.
**발표용 보강(08-10, DA V2·V3)**: Depth Anything 3(arXiv 2511.10647)는 any-view 기하 모델로 성격이 바뀌었고, **V2에 없던 절대 깊이 정량표(Table 11)가 있다.** DA3-metric이 ETH3D에서 δ₁ 0.917/AbsRel 0.104로 표 내 최고(실외 강세), NYU·KITTI는 UniDepth 계열이 우위. 상대 깊이 V2 대 V3는 ETH3D +12.1pt가 최대 변화(Table 4). 하늘은 teacher의 sky mask 공동 예측으로 학습 오염을 막는 구조로 바뀜(잘 맞힌다는 뜻 아님). 한 줄 결론 개정: "실외 절대 깊이 정량 부재"는 V3에서 부분 수정, 단 수백 m 원거리 벤치마크는 여전히 없음. 페이지 1절·3-1절 갱신.


주입하는 prior를 얼마나 믿을 수 있는지 기준을 세우기 위함이다.

- Depth Anything V2 등 단안 깊이 추정 모델이 논문에서 제시하는 정확도 지표를 수집 (어떤 데이터셋에서 어떤 지표로 몇 인지)
- 법선(normal) 추정 모델도 같은 방식으로
- 상대 깊이인지 절대 깊이인지, 실외 대규모 장면에서의 성능이 별도로 보고되는지 확인
- 목적: "재구성된 mesh를 믿을 것인가, 추정된 깊이를 믿을 것인가"의 판단 기준 수립

### Q-06. 빈 영역의 평가 관행 조사 [판단 필요] (우선순위 3)

**결과**: 기존 벤치마크는 비어야 할 영역을 재지 않고 재기 전에 지운다 (`wiki/questions/empty-region-evaluation-practice.md`). **Spires 논문 자신이 Nerfacto에 대해 하늘을 특별히 제거해야 한다고 적었고**, GT가 재구성되지 않은 영역 밖의 재구성 점도 걸러낸다. 임계는 5cm와 10cm.
SS3DM은 비가시 삼각형 제거와 카메라 궤적 25m 확장 크롭을 쓰며, 근거로 원거리 점이 지표를 지배해 근거리 차이를 가린다는 점을 든다. T&T는 겹치는 경계 상자 크롭 후 ICP 정렬이다.
구분 지표는 이미 있다(없음=completeness/recall, 허위=accuracy/precision). 다만 마스크 필터가 후자를 무력화한다는 지적이 있고 절두체 합집합 기준(unmasked 규약)이 대안이다. **accuracy 포기 결정 재검토 필요.**
**보완(08-09)**: unmasked 규약 원문 확인(Sakuma·Okutomi, arXiv 2606.20856v2). DTU·MobileBrick 전 실험에서 masked/unmasked Chamfer를 별도 열로 병기하는 보고 형식까지 확인. DTU 표준 평가 코드도 직접 확인 — accuracy만 ObsMask로 걸러지고 completeness는 바닥 평면 필터만 받는 **비대칭 구조**라, 관측 영역 밖 허위 기하는 accuracy에 아예 안 들어온다.


- 하늘처럼 mesh가 존재해서는 안 되는 영역을 기존 표면 재구성 벤치마크가 어떻게 처리하는지 조사
- GT 점군에 하늘 방향 점이 찍혀 있는 경우의 처리 방식
- sky mask, 거리 상한, crop 등 어떤 장치를 쓰는지와 그 근거
- 표면 재구성에서 "있어야 할 것이 없음"과 "없어야 할 것이 있음"을 구분해 재는 지표가 있는지

### Q-07. GS로 mesh를 만들어야 할 이유의 근거 조사 [판단 필요] (우선순위 3)

**결과**: 같은 무대에서 MVS와 GS를 비교한 표를 확보했다 (Petrovska·Jutzi, ISPRS Annals X-G-2025). **MVS가 정확도와 완전성 모두 앞선다.** 실내 RMSE 1.43mm 대 3DGS-Basic 4.74mm, 식생 뒤 3.23mm 대 7.49mm. 대신 MVS가 가장 느리다(1시간 15분 대 15~49분). 상세는 `wiki/comparisons/mvs-vs-gs-surface-reconstruction-evidence.md`.
저자들이 **기하가 이미지 재구성 loss로 만들어지기 때문에 GS와 NeRF의 정확도가 낮다**고 명시한다. 우리 서사와 같은 진단이며 인용 가치가 높다. GS 쪽 이점 근거는 속도와 식생 뒤 기하 복원이다.
도시 규모에서는 GS 논문들이 고전 MVS와 비교하지 않는다(City-Mesh3R은 GS 계열끼리만, F1 0.11 수준). 고전 MVS의 도시 규모 비용 원전은 유료 접근으로 확보하지 못했다. **A1은 읽기로 닫히지 않는다는 등록부 판단이 유지된다.**
**보완(08-09)**: SS3DM Table 2 확보 — 도로 규모 같은 GT mesh 위에서 SuGaR(F 0.056)가 StreetSurf neural SDF(F 0.198)에 진다. SuGaR 도로면에 "bubble-like structures" 지적. 고전 MVS는 이 표에도 없어 도시 규모 직접 대결은 여전히 문헌에 없음이 확정적. MDPI 대규모 리뷰는 403 차단으로 미확보 유지.


"point cloud 기반 재구성으로도 도시 규모가 되는데 왜 GS인가"라는 지적에 답하기 위한 재료 수집이다. 논거 구성 자체는 위키 판단 세션이 한다.

- 고전 MVS 및 point cloud 기반 대규모 표면 재구성이 실제로 달성하는 범위와 비용 (대표 사례, 입력 조건, 실행 시간)
- GS 계열 표면 재구성이 그 대비 주장하는 이점이 무엇인지, 논문들이 스스로 어떻게 정당화하는지 verbatim 수집
- 양쪽이 같은 벤치마크에서 비교된 표가 있는지

---

### Q-08. CAD 분야의 mesh 품질 평가 관행 [판단 필요] (우선순위 3)

**결과**: CAD·FEM 지표(aspect ratio, skewness, warpage, 최소 변 길이)는 생성과 시뮬레이션 용도로 남아 있고, 품질 기준 자체가 하류 시뮬레이션에 상대적이다 (`wiki/comparisons/mesh-intrinsic-quality-metrics.md`).
재구성 평가에서 실제로 함께 보고되는 mesh 자체 지표는 **위상 지표**다. Sulzer 외 survey(arXiv 2301.13656)가 Chamfer·F1에 더해 IoU, Normal Consistency, 연결 성분 수, 경계 변, 비다양체 변을 보고한다. SBP-Net도 연결 성분 수를 쓴다.
위상 지표는 **crop과 마스크에 의존하지 않아** Q-06의 공백을 우회할 수 있다. floaters는 성분 수를, holes는 경계 변을 늘린다. 다만 실외 장면에서는 그대로 쓸 수 없고 밴드별 상대량으로 재정의해야 한다. **판단 필요.**


mesh 자체의 기하 품질을 정밀하게 다루는 분야를 참고한다. 등록부 A4 항목.

- CAD 및 기하 처리 분야에서 mesh 품질을 재는 표준 지표 (내각, 변 길이 비, aspect ratio, valence 등)와 각각이 무엇을 잡아내는지
- 그 지표들이 재구성된 mesh 평가에 쓰인 사례가 있는지, 아니면 생성 및 시뮬레이션 용도로만 쓰이는지
- 표면 재구성 논문에서 Chamfer와 F1 외에 mesh 자체 품질을 함께 보고한 사례

### Q-09. 통제 무대 SOTA 현황 측정의 준비물 확인 [완료] (우선순위 2)

**결과**: 후보 6종 전부 공식 저장소와 mesh 추출 스크립트가 있다 (`wiki/comparisons/controlled-stage-sota-toolkit.md`). **Gaussian Wrapping의 정체는 "From Blobs to Spokes"(arXiv 2604.07337, 2026-04)이며 코드 공개 확인**(diego1401/GaussianWrapping). 단 DTU 평가는 "coming soon"이고, CUDA 요구가 11.3(GOF)~13.0(RaDe-GS)으로 갈라져 환경 공존이 어려울 수 있다.
2026년 신규 코드 공개는 Gaussian Wrapping(wrapping shell)과 MeshSplat(AAAI 2026, feed-forward 일반화 계열이라 per-scene 비교군 편입 여부는 판정 사항). 계열 커버리지는 TSDF(2DGS·PGSR)/field(GOF·RaDe-GS)/in-loop(MILo)/wrapping(GW)로 4계열.
Blender 자산은 Poly Haven이 CC0 확정, 구멍 물체는 기본 primitive로 직접 제작이 정확하다. 카메라 궤적 선례는 OB3D(Blender Python API, 단 dense GT mesh 미포함)와 BlenderNeRF 애드온, 가늘고 긴 구조물은 PipeForge3D 생성기가 있다.
**2차 보완(08-09)**: 라이선스는 전 후보 비상업 연구 라이선스(2DGS·GOF·RaDe-GS·GW가 Inria-MPII GS 라이선스, PGSR은 ZJU 커스텀, 원문 확인). Blender transforms.json 직접 입력은 2DGS·GOF·RaDe-GS만 지원하고 PGSR·GW·MILo는 COLMAP 전용이다. **Blender 로더의 초기화는 무작위 점군이라(코드 확인) Q-03 결과와 맞물려 초기화 경로 통일이 통제 변인이 된다.**
추천 3안은 2DGS(TSDF)+RaDe-GS 또는 GOF(field)+GW(wrapping)이며 MILo 기준점 포함 시 4계열 커버. 선정은 판단 필요. 실사 데이터셋 중 "근거리+원거리 공존, 물체별 호 폭 상이" 조건은 **찾지 못함** — 물체 중심 실사는 물체가 하나뿐이고 궤적 고정 실사는 호 폭이 궤적에 박혀 있어 "원거리+넓은 호" 대조를 원리적으로 못 만든다. 합성 제작 근거 성립. 궤도 캡처는 BlenderNeRF의 Camera on Sphere 방식이 호 폭 통제에 직접 쓰인다.

물체 난이도 × 관측 호 폭 격자에서 SOTA 표면 재구성 현황을 측정하는 실험의 준비물이다. 등록부 C7 항목.

- **후보 모델의 코드 공개와 재현 조건 확인**: 2DGS, GOF, RaDe-GS, PGSR, Gaussian Wrapping. 각각에 대해 공식 저장소 유무, mesh 추출 스크립트 포함 여부, 학습 환경(CUDA·의존성), 알려진 재현 이슈를 표로. 특히 Gaussian Wrapping은 코드 공개 여부 자체가 미확인이다
- **2026년 GS 표면 재구성 신규 기법 중 코드가 공개된 것**이 있는지. 있으면 계열(TSDF 융합 / SDF·opacity field / in-loop mesh / 평면 기반)을 함께 표기
- **Blender에서 쓸 수 있는 GT mesh 포함 물체 자산**: hole이 있는 물체(토러스류·격자류), 가늘고 긴 구조물(파이프·크레인류), 복잡 형상. 라이선스와 함께. 합성 씬 직접 제작의 선례(카메라 궤도 스크립트 공개 여부)도 확인
- 이 실험은 개선 주장이 아니라 현황 측정이다. 모델 선정 기준은 mesh 추출 공식 지원, 재현 가능, 계열 비중복 세 가지다

### Q-10. 표면 재구성 SOTA의 역추적 검증과 C7 모델 목록 보강 [판단 필요] (우선순위 2)

**결과**: 서면·실행 가능 SOTA 모두 **AmbiSuR**(ICML 2026, DTU 0.46·T&T 0.589, 코드 실재 확인)이다. 직전 SOTA는 GeoSVR(NeurIPS 2025 Spotlight, voxel 계열, 코드 공개)로 제3자 표에서 교차 확인된다. 상세는 `wiki/comparisons/gs-surface-recon-sota-2026.md`.
**MILo는 서면 SOTA가 아니다**(DTU 0.68 대 0.46, T&T 0.49 대 0.589). CoMe는 ECCV 2026·코드 공개·T&T 0.521·18분. GW는 표준 프로토콜 수치가 없어 자체 프로토콜 SOTA 주장뿐. StableGS는 표면 재구성 논문으로 찾지 못함. GausSurf는 코드 coming soon.
**C7 수정 제안**: AmbiSuR 추가(PGSR 제외 판정과 충돌하므로 대체 형태 검토), GeoSVR은 GS 아님(스코프 판정 선행), CoMe는 위협·측정 대상 이중 지위. 채택은 판단 필요.


### Q-11. track 길이·재투영 오차를 감독 가중에 쓴 선례 조사 [대기] (우선순위 2)

Q-02가 **삼각측량각**에 대해 "학습 내부 사용 선례 없음"을 확인했다. 그러나 COLMAP이 파일에 그대로 저장하는 나머지 두 부산물은 아직 확인되지 않았다. 이 둘은 각과 달리 후처리도 필요 없이 바로 읽히기 때문에, 선례가 있다면 각보다 훨씬 흔할 수 있고 C6 표의 CoMapGS 행과 겹칠 여지가 있다.

**대상 물량 (COLMAP 출력에 이미 있는 것)**

- **track 길이**: `points3D`의 track 원소 수. 그 3D 점이 몇 장의 등록 이미지에서 관측되는가
- **점별 재투영 오차**: `points3D`의 error 필드. 그 점의 평균 reprojection error

- 위 두 양을 NeRF 또는 3DGS **학습 내부**에서 loss 가중, prior 주입 게이트, densification·pruning 제어, 점별 학습률 조정에 쓴 사례가 있는가
- **초기화 시 점 필터링(오차 큰 점 버리기, track 짧은 점 버리기)은 위협이 아니다.** Q-04와 같은 기준을 쓴다. 남은 점들 사이에 **차등 가중**을 준 경우만 위협으로 분류한다
- COLMAP 출력을 sparse depth 감독으로 쓰는 사례는 이미 흔하다고 보고 제외한다. 다만 그 depth 감독에 **track 길이나 오차로 가중을 준** 사례가 있으면 그것은 포함한다
- 표적이 novel view synthesis인지 표면·mesh 재구성인지 구분할 것
- CoMapGS가 covisibility를 쓰면서도 COLMAP track이 아니라 MASt3R를 새로 돌린 이유가 논문에 적혀 있는지 확인. 있으면 "왜 이미 있는 것을 안 쓰는가"에 대한 인용 가능한 답이 된다
- 없으면 "찾지 못함"으로 명확히 결론낼 것. Q-02와 합쳐 "SfM 부산물 통계 전반이 감독 배분에 쓰인 적 없다"는 서술이 가능해진다

### Q-11. SfM 부산물을 점 이상으로 쓴 선례 (측량각 역산 포함) [완료] (우선순위 2)

**결과**: 각을 점별로 역산해 하류에서 쓴 사례는 넓힌 범위에서도 **찾지 못했다** (`wiki/questions/sfm-byproducts-beyond-points-precedent.md`). Q-02 결론 유지.
다른 부산물의 선례 셋: DS-NeRF(CVPR 2022, 재투영 오차→깊이 감독 불확실도, few-shot 개선+2~6배 가속 주장), DRGS 계열(점 위치→단안 깊이 척도 정렬, StereoGS가 "균일 척도" 조잡함 비판), CoMapGS(covisibility 개수→재가중, 기존 위협표 상대).
각은 COLMAP 안에서 필터로 소비되고 **출력 파일에 값이 남지 않아 역산이 필요**하다. 재투영 오차(출력에 있음)와의 이 구조적 차이는 조사 세션의 해석이며 문헌에 명시된 이유는 없다. 재투영 오차=측정 잔차 대 측량각=기하 조건성의 대비는 CoMe 반박 논리와 동형이라 인용 사다리로 쓸 수 있다.
**2차 검토(08-11)**: 공분산 경유 초기화·SLAM 깊이 공분산·사진측량 용어·초기화 무효화 담론 네 갈래로 재확인. 결론 유지(각 역산 사례 없음). 추가 확보: SatSplat(arXiv 2606.28581)이 작은 교차각을 저하 원인으로 초록에 명시하되 **방법에는 안 씀**(공백의 직접 증거), Desiatov & Sattler(arXiv 2603.20714)가 초기화 점별 정보는 시각 품질에선 densification에 씻기지만 **기하 일관성에는 유의미하게 남는다**고 보고(기하 표적 사용의 외부 근거). SplatMAP의 공분산 가중은 각이 아니라 optical flow 신뢰도로 확인.
**읽기 지도 작성(08-11)**: 확보 문헌을 "읽을 순서 + 논문마다 건질 것" 단위로 `wiki/comparisons/sfm-byproduct-citation-reading-map.md`에 정리. 티어 1 정독 4편(DS-NeRF, Desiatov & Sattler, Rumpler, COLMAP 재확인 1건), 티어 2 절 단위 5편, 이미 확보되어 안 읽어도 되는 것 5건 명시. 읽기 배정과 인용 채택은 방향 세션 판정 사항.

### Q-12. 복셀 confidence field의 가림 문제와 대안 설계 재료 [판단 필요] (우선순위 2)

**결과**: 문제가 문헌에 인지되어 있다. VAD-GS(arXiv 2510.09364)가 다중 뷰 점군 누적이 가림 인지가 없어 광선이 가려진 구조를 통과해 비가시 기하를 잘못 갱신한다고 명시한다. 상세는 `wiki/questions/occlusion-aware-confidence-field-design.md`.
대안 재료 4갈래: ⓐ z-buffer 가시 판정을 복셀에 붙이기(VAD-GS), ⓑ 표면점 기준 reconstructability로 재정의(Smith 외 SIGGRAPH Asia 2018 — 가시성·거리·각도가 원래 한 식), ⓒ 표면 confidence를 복셀로 누적(arXiv 2405.02568), ⓓ TSDF의 입사각·거리 가중 관행(우리 각 판별값과 직교하는 축).
**즉시 확인 가능한 것**: COLMAP track은 실제 정합된 이미지만 담으므로 **point 채널은 이미 가림을 반영하고 pose 채널만 눈이 멀었다**(조사 세션 관찰). 두 채널의 불일치를 가림 지표로 쓰는 안은 새 계산 없이 기존 데이터 재판독으로 확인 가능. 선택지 A~D 표로 정리, 채택은 B4 판정.



## 7. 결과 인계 형식

항목 하나를 끝낼 때마다 아래 두 가지를 한다.

1. **이 파일의 해당 큐 항목**에 상태를 바꾸고 결과 요약을 3줄 이내로 적는다.
2. **인계 블록**을 대화에 출력한다. 사용자가 이것을 방향 논의 세션에 그대로 붙여 넣는다.

인계 블록 형식.

```
[조사 결과 인계 — Q-0N: 제목]
상태: 완료 / 부분 완료 / 찾지 못함
핵심 발견: (3줄 이내. 각 줄에 출처)
연구에 미치는 영향: (등록부 항목 번호와 함께. 없으면 "없음")
판단 필요: (방향 논의 세션이 결정해야 할 것. 없으면 "없음")
만든 위키 페이지: (경로. 없으면 "없음")
미검증으로 남긴 것:
```

"연구에 미치는 영향"과 "판단 필요"는 **조사 세션이 결론을 내리는 칸이 아니다.** 무엇이 걸리는지만 지목하고 판정은 넘긴다.

## 8. 완료 항목

2026-08-05 1차 수행(Q-01~Q-08), 2026-08-09 보완 수행(미검증 해소 + Q-09). 상태는 각 항목에 적었고 산출 페이지는 아래와 같다.

| 항목 | 상태 | 산출 페이지 |
| --- | --- | --- |
| Q-01 통제된 실험 무대 후보 | 완료 (scan65 검증, 라이선스 보완) | `wiki/comparisons/gt-mesh-benchmark-candidates.md` |
| Q-02 삼각측량각 선례 | 찾지 못함 (인접 3건) | `wiki/questions/triangulation-angle-in-training-precedent.md` |
| Q-03 3DGS 초기화 ablation | 완료, 게재본 대조 완료, 인용 가능 | `wiki/claims/3dgs-random-init-background-degradation.md` |
| Q-04 학습 프론트엔드 confidence | 판단 필요 (InstantSplat v6 위협 후보 격상) | `wiki/questions/learned-frontend-confidence-usage.md` |
| Q-05 prior 공표 정확도 | 완료 (DSINE 원 수치 확보) | `wiki/comparisons/prior-model-reported-accuracy.md` |
| Q-06 빈 영역 평가 관행 | 판단 필요 (unmasked 규약·ObsMask 원전 확인) | `wiki/questions/empty-region-evaluation-practice.md` |
| Q-07 GS를 써야 할 이유 | 부분 완료, 판단 필요 (SS3DM 표 추가) | `wiki/comparisons/mvs-vs-gs-surface-reconstruction-evidence.md` |
| Q-08 CAD mesh 품질 관행 | 판단 필요 | `wiki/comparisons/mesh-intrinsic-quality-metrics.md` |
| Q-09 SOTA 측정 준비물 | 완료 (2차 보완: 라이선스·Blender 입력·추천 3안·실사 공백 확인) | `wiki/comparisons/controlled-stage-sota-toolkit.md` |
| Q-10 SOTA 역추적·C7 보강 | 판단 필요 (AmbiSuR=실행 가능 SOTA, MILo 서면 위치 확정) | `wiki/comparisons/gs-surface-recon-sota-2026.md` |
| Q-11 SfM 부산물 활용 선례 | 완료 (각 역산 사례 없음, 부산물 선례 3갈래 확보) | `wiki/questions/sfm-byproducts-beyond-points-precedent.md` + `wiki/comparisons/sfm-byproduct-citation-reading-map.md` |
| Q-12 복셀 field의 가림 문제 | 판단 필요 (대안 4갈래, 무비용 선택지 C 존재) | `wiki/questions/occlusion-aware-confidence-field-design.md` |
| Q-14 단일 물체 SOTA·실패 사례 | 완료 (자인 부재=측정 부재 관찰, Gaussian Sculpting 위협 판단 필요) | `wiki/comparisons/single-object-sota-failure-modes.md` |
| Q-15 표적 데이터셋 hole·seg·바이오 | 완료 (교집합 부재 — 실사 축+렌더 축 조합 불가피, M2 판정 대기) | `wiki/comparisons/target-datasets-hole-seg-bio.md` |
| Q-16 self-occlusion 선행 | 완료 (Nerfbusters 프러스텀 한계 자인, VAD-GS track 가시성 선행) | `wiki/questions/pretraining-self-occlusion-estimation.md` |
| Q-17 densification 과잉 선행 | 완료 (Bulò 원전, LeGS 특정, CoMe·Expo-GS mesh 개선 사례) | `wiki/questions/densification-excess-quality-degradation.md` |
| Q-18 GS→mesh 연결 선행 | 완료 (반례 원문 확보, 정량 분해 논문은 부재 — X3 빈자리) | `wiki/questions/gs-improvement-mesh-improvement-link.md` |
| Q-19 점군→mesh GT 선례 | 완료 (관행 3종, 성립 조건 3개) | `wiki/questions/pointcloud-derived-mesh-as-gt.md` |
| Q-20 CAD 지표·FID | 완료 (Q-08 부재 해소 — Gaussian Sculpting 사례) | `wiki/comparisons/mesh-intrinsic-quality-metrics.md` 3-1절 |
| Q-21 seg 기반 평가 | 완료 (부위별 채점 선례 확보, GS 이식은 빈자리) | `wiki/questions/segmentation-based-mesh-evaluation.md` |

**추가 질의 (2026-08-10)**: "복잡 오브젝트 + GT mesh + 실내/단일 물체" 단일 무대 추천 질의에 **MobileBrick**으로 답함 (근거 4·유보 2·차순위 포함, `gt-mesh-benchmark-candidates.md` 6절). DTU 부분호 예비판과 보완 관계. 채택 판정 필요.

### 보완 후에도 닫히지 않은 것

- **고전 MVS의 도시 규모 달성 범위와 비용** (Q-07): ISPRS 저널 두 편 유료, MDPI 리뷰(Remote Sensing 16(5):773)는 403 차단. 기관 프록시 등 접근 경로가 있어야 닫힌다
- 표면 재구성 전용 GS와 **고전** MVS의 동일 무대 비교는 문헌에 없음이 거의 확정 (SS3DM도 상대가 neural SDF)
- Curve-aware GS(2506.21401)와 EdgeGaussians(2409.12886) 본문 정독
- Shelly·OmniObject3D 라이선스, T&T 라이선스 명칭 확정
- Splatt3R·MASt3R-GS·DroneSplat 등 DUSt3R 계열 본문 (감독 배분 사례 추가 존재 가능성)
- Frey·Borouchaki 표면 mesh 품질 원전(IJNME), valence 지표 원전
- Spires IJRR 게재본 대조, T&T 공식 crop 작성 기준

### Q-13. 배경·무경계 영역 mesh 산출을 표방한 기법 조사 [보류 — 08-19 방향 전환으로 우선순위 소멸]

> 번호 정정: 조사 세션이 가림 문제 조사에 Q-12를 먼저 사용했으므로 이 항목을 Q-13으로 옮긴다.

**배경**: AmbiSuR를 논적 자리에서 내리고 참조선으로 재배치했다(08-12 판정). 정당한 논적 후보를 찾는 항목이다. **못 찾는 결과도 유효하며 오히려 주장 (B)의 확증이 된다** — 편향 없이 조사할 것.

- 3DGS 계열 표면 재구성 기법 중 **무경계(unbounded) 씬의 mesh 추출을 명시적으로 기여로 내건** 것을 열거한다. TSDF 볼륨이나 최대 연결 성분 후처리로 중심부만 남기지 않는다고 주장하는 기법이 대상이다
- 각 후보에 대해 확인할 것 넷: ① 무경계 mesh를 방법 기여로 표방하는가(초록·기여 목록에 명시) ② **배경 영역을 정량 평가하는가** — 마스크·crop 없이 재는 실험이 논문에 있는가 ③ 평가 무대와 지표 ④ limitations에 배경을 적었는가
- ②가 핵심이다. 표방만 하고 평가는 crop 안에서 하는 경우가 많을 것으로 예상되며, 그렇다면 "표방은 있으나 검증은 없다"로 기록한다
- 촬영 계획, NVS 전용, 실내 한정은 제외한다. **표면 재구성 + 무경계**만 본다
- 하나도 찾지 못하면 "찾지 못함"으로 명확히 결론낸다. 느슨하게 관련된 기법으로 대체하지 않는다

**참고 맥락**: 우리 실측에서 d/R≥4 면수가 MILo 172k 대 AmbiSuR 0이다. 즉 우리 base인 MILo는 이미 그 영역을 산출한다. 산출과 평가는 별개이므로 "산출하는 기법"과 "평가하는 기법"을 구분해 기록할 것.


---

## ★08-19 방향 전환 후 신규 큐 (Q-14~Q-21)

> **전제가 바뀌었다.** 배경 재구성은 폐기됐고 새 표적은 **hole 있는 단일 오브젝트의 mesh 품질**이다. 시작 전에 `wiki/system/research-status.md` 상단 배너와 `wiki/system/progress-2026-08-19.md`를 읽을 것. 배경·원거리 전제의 기존 페이지들과 충돌하면 새 방향이 우선.

### Q-14. 단일 물체 GS mesh recon SOTA와 실패 사례 [완료] (우선순위 1)

**결과**: SOTA 순위는 08-09 표 재사용(AmbiSuR 0.46 > GeoSVR 0.47 > GVGS 0.49 > PGSR 0.52, MILo 0.68). 실패 자인을 원문으로 수집했다 (`wiki/comparisons/single-object-sota-failure-modes.md`). 표적과 가장 가까운 자인: PGSR §VI "missing or limited viewpoints → incomplete geometry" + occlusion 추정 제거 시 F1 0.52→0.28, 2DGS §7 densification의 질감 편향("favors texture-rich over geometry-rich areas")과 over-smoothing, MILo p.2–3의 cavity·thin over-inflation/erosion, PhysGaussian의 hollow shell(내부 원전).
**핵심 관찰(판단 필요)**: hole·오목·내부·self-occlusion을 정면 자인한 SOTA는 드물다. 공통 자인은 반사·투명·질감 부족·관측 결핍 4종. 자인의 부재는 "측정하지 않기 때문"(ObsMask 관행)으로 읽히며, motivation은 인용+실측 시연 결합이 필요하다.
**신규 발견**: Gaussian Sculpting(arXiv 2608.10602v1, 2026-08-11) — OmniObject3D 12물체에서 mesh 자체 품질 지표(내각 분포·sliver 비율)까지 보고하고 "limited viewpoints의 missing structures 복원"을 표방. 새 표적과 최근접. **위협 분류 판단 필요.**

- 단일 물체 표면 재구성에서 현재 SOTA로 인정되는 GS 계열 기법 열거 (AmbiSuR 포함, 그 외 — 2DGS·PGSR·GOF 계열의 최신 후속 포함)
- **각 기법이 스스로 인정하는 실패 사례** 수집: hole·오목·내부·self-occlusion·얇은 구조. limitations 절과 실패 그림을 원문에서
- 목적: motivation의 "SOTA는 [특정 케이스]에서 실패한다"를 원문 근거로 채우는 것. **실패 사례가 가장 중요한 산출물**
- 평가 무대·지표(DTU Chamfer 등)와 대표 수치도 표로

### Q-15. 표적 데이터셋 — hole·segmentation·바이오 [완료] (우선순위 1)

**결과**: 촬영 보유 축(DTU scan65 해골, MobileBrick LEGO, OmniObject3D 실물 6천)과 렌더 필요 축(MedShapeNet 의료 10만+, PartNet seg 57만 부위, Thingi10K)으로 정리했다 (`wiki/comparisons/target-datasets-hole-seg-bio.md`).
바이오 정답 후보는 **MedShapeNet**(arXiv 2308.16139, 뼈·장기·혈관 mesh 10만+, 대부분 CC/CC BY 4.0, 렌더 필요)이고, seg 정답 후보는 **PartNet**(부위 채점 라벨의 사실상 유일 공급원, ShapeNet 등록제). 촬영+바이오 교집합은 DTU scan65뿐이다.
**구조적 발견(판단 필요)**: 촬영+GT mesh+seg+바이오를 동시에 주는 기성 데이터셋은 없다. 실사 축과 렌더 축의 조합이 불가피하며 렌더 정당성 선례(Asset Inspection·OB3D·NeRF-Synthetic 관행)는 확보됨. 조합 확정은 M2.

- hole 있는 단일 오브젝트를 포함한 데이터셋 (GT mesh 또는 정밀 점군 보유 필수)
- **segmentation 정보가 함께 제공되는** 3D 데이터셋
- **바이오 계열: 해골 스캔·장기·뼈** (교수 선호 확인됨). 의료 영상 유래 mesh 데이터셋 포함
- 기존 후보와 통합 검토: DTU scan65(구조광 점군), MobileBrick(GT depth fusion), Thingi10K(Q-09 잔여), NeRF-Synthetic blend 추출
- 각 후보: 규모 / GT 형식 / 라이선스 / GS 계열 사용 선례 / segmentation 유무
- 참고: "기존 데이터셋에 오브젝트를 추가해도 된다"는 허가 있음 — 합성 삽입 선례도 한 줄

### Q-16. self-occlusion을 다룬 판별·가시성 선행 [완료] (우선순위 2)

**결과**: 학습 전 도구는 HPR(Katz·Tal·Basri, SIGGRAPH 2007 — 표면·법선 없이 점군 가시성, Open3D 구현 존재). 가시성→supervision 직접 선례는 Nerfbusters §4.4의 가시성 loss이며, **"does not handle occlusions, instead overestimates the number of views" 자인이 원문에 있다** — 우리 프러스텀 한계(E1 20배 과대평가)와 동일 구조의 선행 자인 (`wiki/questions/pretraining-self-occlusion-estimation.md`).
**우리 발상(track=가림 반영)의 선행은 있다**: VAD-GS가 복셀 가시성을 "구성 점들의 관측 뷰 합집합"으로 정의(08-11 원문 확인). 단 용도가 densification 판정이며 감독 배분이 아니다. "찾지 못함"이 아니라 "용도가 다른 선행 존재"가 결론.
인용 사다리: HPR(도구)→Nerfbusters(loss+한계 자인)→VAD-GS(track 가시성)→본 연구(감독 배분+각 결합). **VAD-GS 위협표 등재 판단 필요.**

- **학습 전 단계에서** 자기 가림을 추정한 기법 (SfM track 기반, 점군 가시성, hidden point removal 등)
- 가시성 정보를 학습 supervision에 쓴 사례
- 우리 계획(track은 실제 매칭만 담아 가림을 반영)과 같은 발상의 선행이 있는지 — 있으면 인용, 없으면 "찾지 못함" 명시

### Q-17. densification 과잉 → 품질 저하 선행 [완료] (우선순위 2)

**결과**: "0.7+0.7" 기전의 원전은 Bulò 외 "Revising Densification in Gaussian Splatting"(ECCV 2024, arXiv 2404.06109) §3.3 — clone 시 합성 가중이 (1−α)→(1−α)²로 부풀며 보정식 α̂=1−√(1−α). 단 개선 보고는 SSIM·LPIPS뿐, 기하 지표 없음 (`wiki/questions/densification-excess-quality-degradation.md`).
**ICML RL densification의 정체 = LeGS** "Beyond Heuristics: Learnable Density Control"(arXiv 2605.00408, sensitivity 기반 보상으로 RL 정책이 clone/split 결정). 게재처 ICML 2026 여부는 미확정 [미검증]. 인접 RLGS(2508.04078).
**densification 조절→mesh 개선 사례 있음**: CoMe Table 5(조절 끄면 primitive 20%↑·F1 하락), Expo-GS SDF 조향(기존 위키). 남는 자리: 학습 전 촬영 기하 판별값으로 조향한 사례는 없음 — lever④′ novelty 경계. **판단 필요.**

- clone/split 과잉이 품질을 떨어뜨린다는 문제 제기 논문들 (0.7+0.7=1.4 기전)
- **ICML의 강화학습 기반 densification 조절** (교수 언급) — 정체 특정
- densification 조절로 **mesh 품질**(렌더링 아니라)을 개선한 사례가 있는지

### Q-18. GS 개선 → mesh 개선 연결을 다룬 선행 [완료] (우선순위 2)

**결과**: 반례(렌더링 좋음·mesh 나쁨)는 원문으로 존재한다 — 2DGS 초록 "3DGS fails to accurately represent surfaces", MILo p.2 "fine detail이 mesh 추출에서 사라질 수 있다", 3DGS 원논문 §8은 mesh화를 열린 문제로 남김 (`wiki/questions/gs-improvement-mesh-improvement-link.md`).
분리 실측: Desiatov & Sattler(시각 개선 없이 기하 일관성 개선), ISPRS(같은 무대에서 GS가 MVS에 열세), CoMe Table 5(primitive 20%↑인데 F1 하락 — 비단조). **"Gaussian 상태의 어떤 양이 mesh 품질을 예측하는가"의 정량 분해 논문은 찾지 못함** — X3 실험이 선행과 겹치지 않는 것으로 보임.
**보너스 원문**: 2DGS p.2 "noisy reconstructions, due to the inherently unconstrained nature of 3D reconstruction tasks" — 우리 용어의 최근접 원문. 인용 은행 등록 가치. **판단 필요.**

- Gaussian 품질(수·밀도·배치)과 추출 mesh 품질의 관계를 정량으로 다룬 논문
- **mesh-in-the-loop가 아닌 기법**(학습 후 TSDF/Poisson 추출)에서 GS 개선이 mesh 개선으로 이어졌는지
- 이 연결이 자명하지 않다는 반례(렌더링은 좋은데 mesh는 나쁜 사례)가 문헌에 있는지

### Q-19. point cloud → mesh를 GT로 쓴 선례 [완료] (우선순위 3)

**결과**: 파생 mesh를 GT로 쓰는 관행 셋 확보 (`wiki/questions/pointcloud-derived-mesh-as-gt.md`). MobileBrick(GT depth의 TSDF fusion, README 각주로 유래 명시 — 수용된 표기 형식), MedShapeNet(환자 영상에서 직접 모델링, seg→mesh 절차는 미검증), DTU 비공식 관행(Poisson 참조 mesh, 개별 논문 미특정 [2차 자료]).
성립 조건 셋이 읽힌다: 유래 명시, 원본 정밀도가 평가 대상보다 한 급 위, 파생 절차의 개입 인정. DTU 공식 평가는 파생 mesh를 쓰지 않고 점군 기준이다(코드 확인 08-09). 대규모 실측(Spires·T&T)은 mesh화하지 않는다는 대조도 기록.

- 스캔 점군에서 만든 mesh(Poisson 등)를 GT로 평가한 논문이 있는지, 어떤 조건·표기로
- MobileBrick의 "GT depth 기반 fusion mesh" 관행과 비교

### Q-20. mesh 품질 지표 — CAD 계열과 FID [완료] (우선순위 3)

**결과**: Q-08의 "CAD 지표 사용 사례 찾지 못함"이 **해소됐다** — Gaussian Sculpting(arXiv 2608.10602)이 OmniObject3D 재구성 평가에서 내각 분포·sliver 비율을 보고한다. 기존 페이지에 3-1절로 병합 (`wiki/comparisons/mesh-intrinsic-quality-metrics.md`).
FID는 3D 생성 계열의 렌더 이미지 관행(OctFusion 등 20시점)이고 재구성 쪽은 PointDreamer(점군→textured mesh) 사례가 있으나, **GS/NeRF 표면 재구성 벤치마크의 표준 지표로 쓴 사례는 찾지 못했다.** 채택 시 논거는 "분포 비교라 GT 정합 없는 영역도 잰다"는 성질.
위상 지표(성분 수·경계 변)의 기존 검토는 유효하며, 단일 물체 무대에서는 "닫힌 물체 전제" 제약이 사라져 **오히려 적용이 쉬워진다**. 판단 필요.

- CAD/기하처리 쪽 지표(dihedral angle, edge length 분포, 법선 일관성 등)가 GS/NeRF mesh recon 평가에 쓰인 사례
- FID의 mesh 평가 사용 사례 (렌더 이미지 FID 보조 사용 포함. 없으면 "없음" 확정)
- 위상 지표(성분 수·경계 변·watertight)의 사용 선례 — 기존 C4 검토와 통합

### Q-21. segmentation 기반 평가의 실체 [완료] (우선순위 3)

**결과**: (b) 부위별 mesh 채점 **사례 있음** — articulated object 계열의 표준이다 (`wiki/questions/segmentation-based-mesh-evaluation.md`). PARIS(ICCV 2023)가 전체/정적/가동 CD를 분리 보고하고, Neural Part Priors가 의미 대응 부위 쌍별 Chamfer + **결손 부위 처리 규칙**(중심 대체 후 평균)까지 명시한다. 결손 처리 규칙은 hole 표적과 직결.
(a) seg를 품질 판별 입력으로 쓴 사례와 seg→confidence 연결 사례는 **찾지 못했다**. 부위별 채점을 GS 표면 재구성에 가져온 논문도 없음 — 빈자리로 보이며 새 평가 설계 채택은 판단 필요.
전부 검색 요약 경유 [2차 자료]라 채점 규칙 인용 전 원문 확인 필요.

- 두 해석 확인: (a) semantic seg를 재구성 품질 판별의 입력으로 (b) **부위별(per-part) mesh 채점**
- (b) 사례 우선 — 부위 나눠 채점한 mesh 평가 논문
- seg 정보를 confidence/uncertainty에 연결한 사례가 있는지


### Q-22. 데이터셋 재조사 — 조건 완화판, hole 실물 특정 [완료] (우선순위 1)

**결과**: hole 실물을 후보별로 특정했다 (`wiki/comparisons/hole-object-dataset-candidates.md`). 촬영까지 보유한 최강 조합은 **DTU scan65(안와·비강·치간, 이미지 확인) + scan37 금속 가위(손잡이 링 관통 2개, RaDe-GS가 실패 씬으로 명시해 존재 확증) + OmniObject3D 선별(teapot 핸들 관통·kennel 내부 공간 — Gaussian Sculpting 12물체 목록에서 확정) + MobileBrick**.
렌더 축의 hole 다양성은 Thingi10K(genus 통계로 선별 가능, 설계 mesh라 GT 논란 없음) > MedShapeNet(두개골·척추 추공·골반 폐쇄공 후보, 품목 확인 필요) > Stanford(Happy Buddha·Dragon "free holes", Bunny는 바닥 결손 구멍 — GT 자체에 hole이 있는 유명 사례).
삽입 경로는 3층 선례로 성립: 표준 test model 관행(teapot·bunny) + 벤치마크 제작 선례(Asset Inspection·OB3D) + 도구(BlenderNeRF COS). **M2 확정 대기.**

> 원 지시 (위키 판단 세션):

**필수 조건 (이것만)**
- **hole·관통·오목·내부 공간이 있는 단일 오브젝트**가 들어 있을 것
- 정확도 평가가 가능한 참조가 있을 것 — GT mesh면 최선, 정밀 점군·GT depth도 가능

**가산점 (필수 아님)**
- GT mesh 제공 (없으면 아쉬운 정도)
- multi-view 실사 촬영 이미지가 이미 있음 (없으면 mesh 렌더로 대체 가능 — 렌더 정당성 선례는 Q-15에서 확보됨)
- GS 계열 사용 선례, 명확한 라이선스, hole 크기·개수의 다양성
- segmentation(부위 라벨), 바이오 계열 — 둘 다 **비필수 가산점**으로 강등

**산출 요구**
- 후보별로: **hole이 있는 실물 예시**(어떤 오브젝트에 어떤 hole인지 구체적으로 — "구멍 있는 물체 있음"이 아니라 "핸들 관통 머그, 눈구멍 있는 두개골"식) / 촬영 유무 / GT 형식 / 라이선스 / GS 선례 / 실제 다운로드 가능 여부
- **기존 데이터셋에 hole 오브젝트를 추가하는 경로도 한 절로**: 표준 mesh(Stanford bunny 등)를 씬에 삽입·렌더한 관행의 선례 (사용자가 교수로부터 허가 확인받음)
- 기존 확보분(DTU scan65 해골·MobileBrick·OmniObject3D·MedShapeNet·Thingi10K)은 재조사하지 말고 **hole 관점에서 한 줄 재평가**만

### Q-23. 잔여 확인 묶음 [완료] (우선순위 2)

**결과**: 4건 전부 해소.
① 오목 자인 원전 = **SatSplat §4.5 Limitations, Fig. 10** (GSSA 아니었음). "over-smoothing in challenging narrow concavities" + **3DGS primitive에서는 이 문제가 없다는 대비까지** 원문 확보 — 오목 실패가 표현의 가정에서 온다는 기전 서술. 인용 가능 (`single-object-sota-failure-modes.md` 2-2절).
② PARIS(§5.3: 1만 점 양방향·×1000 단위, 결손 규칙은 본문 미명시)·Neural Part Priors(CVPR 2022 부록 B: 부위 쌍별 1만 점, **"we use the center of the mesh as a missing part"** — 결손 규칙 verbatim) 원문 확인 승격 (`segmentation-based-mesh-evaluation.md`).
③ Gaussian Sculpting **코드 미공개, v1(08-11)이 최신.** 추적 계속. ④ **LeGS = ICML 2026 확정 + 코드 공개**(AaronNZH/LeGS 저장소 표제) — 교수 언급과 일치 (`densification-excess-quality-degradation.md`).

- ① 오목 자인 문장 원전 특정 (GSSA 후보, MDPI 403 — 다른 경로 시도)
- ② PARIS·Neural Part Priors **원문**에서 부위별 채점·결손 부위 처리 규칙 확인 (현재 전부 2차 자료)
- ③ Gaussian Sculpting 코드 공개 여부·후속 판본 추적
- ④ LeGS 게재처 확인 (ICML 2026 여부)


### Q-24. 표적 정의 정밀화 재조사 — "깊은 구멍" [완료] (우선순위 1)

**결과**: `wiki/comparisons/deep-cavity-target-datasets.md`. **PipeForge3D는 부적합 판정** — 생성기이며 관의 외부 표면 대상(원문 확인, GitHub 공개). 관 내부의 정답급 무대는 C3VD/C3VDv2(실리콘 대장 팬텀 + HD 내시경 + 로봇 궤적 + GT 깊이·법선·포즈·3D 모델)이나 **카메라가 관 안에 들어가는 관측 기하라 인접 항목**이다. 하수관·터널 GS 무대는 찾지 못함.
측도는 **AO(ambient occlusion)가 "깊이 대 개구 비"의 최적 대리** — 외부 도달 가능성과 동형이라 mesh만으로 사전 선별 가능(Thingi10K genus 필터의 대체). 가시성 부분집합 분해 채점 선례는 VolFill(visible/occluded/complete별 one-way Chamfer+coverage). **외부 궤도+개구 제한 관측으로 깊은 내부를 표적한 GS/NeRF 선행은 찾지 못했다** — 빈자리.
촬영 보유 깊은-구멍 실물은 OmniObject3D kennel(비 ~1–2)·teapot과 DTU scan65 안와·비강뿐이며 깊이 비를 키우려면 렌더 축(AO 선별) 또는 직접 제작(보어 깊이 파라미터화)이 필요. mug·vase류는 카테고리 목록 미확보로 미검증. **M2 판정 대기.**

사용자가 hole의 정의를 좁혔다. **관통 링(가위류)이 아니라 깊은 오목·관·내부 공간** — 파이프 내부, 컵·화병 안쪽, 개구로만 보이는 공동. 핵심 변수 = **깊이 대 개구 비**. 주의: 막힌 깊은 구멍은 genus 0이므로 **위상 필터로는 못 고른다** (Q-22의 genus 선별 기준은 이 표적에 부적합 판정됨).

1. **파이프·관 데이터셋** — Q-09 잔여 PipeForge3D 확인 포함(정체·GT·라이선스), 산업 배관·점검 계열, 파이프/터널/보어 내부 재구성 선행의 무대
2. **기존 확보분 재선별** — OmniObject3D의 깊은 내부 카테고리(kennel 확보, mug·cup·vase·bottle·jar — Gaussian Sculpting 12물체 밖 포함), DTU 124스캔 중 깊은 오목 물체(문헌·웹 확인 가능분만), Thingi10K를 깊이 기준으로 고르는 방법
3. **깊이 대 개구 비의 정량 측도 선례** — accessibility·ambient occlusion·shape diameter function 등이 물체 선별이나 부위 채점에 쓰인 재구성 논문
4. **깊은 오목·내부 recon을 표적한 선행** — cavity·bore·interior를 명시한 GS/NeRF/MVS 논문의 실패 자인과 무대

산출: 후보별 구멍의 실물 / 깊이 대 개구 비 추정 / 촬영 유무 / GT / 라이선스.


### Q-25. confidence의 표현 층 선례 — voxel 격자 밖 [완료] (우선순위 2)

**결과**: `wiki/questions/confidence-representation-layer-precedents.md`. **per-primitive a priori confidence는 빈자리 확정.** per-Gaussian 통계 추적(hit count·투과율·기여도)은 LightGaussian·Mini-Splatting·PUP 3D-GS 등에서 표준 관행이나 전부 ⓐ 학습된 렌더 상태의 통계이고 ⓑ 용도가 pruning·압축이다. 학습 전 카메라 기하량을 primitive별로 계산해 감독 배분에 쓴 사례는 찾지 못함 — 인프라는 어디에나 있으므로 구현 장벽이 아니라 발상의 빈자리.
감독 라우팅 field는 기존 4종(G4Splat 이진 가시성·AREA3D 능동·VAD-GS densification·CoMapGS 개수)이 전부이고 octree·다해상도 라우팅은 없음. OCSplats(arXiv 2508.01239, 관측 완전성→noise 분리)는 정의 미확인 인접 [미검증, 본문 확인 가치].
캐시 대 직접 평가 트레이드는 재구성 문헌에 없고, 그래픽스 고전(Ambient Occlusion Fields, I3D 2005 — 연속량의 격자 baking)이 인접 프레임 — **"voxel은 방법이 아니라 캐시" 서술을 그래픽스 관행 언어로 세울 수 있다.** 판단 필요: v2 설계 서술 채택.

물체 무대 전환으로 구현 층을 재검토 중이다. 배경: 현행 96³ 수축 격자는 무한 씬용 설계라 물체에는 낭비이며, 물체 규모(카메라 ~100대)에서는 conf(x)를 Gaussian 위치에서 직접 계산해도 싸다. 선례를 확인한다.

1. **카메라 기하량을 primitive별 속성으로 계산해 학습에 쓴 사례** — Gaussian/점마다 관측 수·시차각·가시성을 붙여 loss·densification에 쓴 기법 (많은 코드베이스가 per-Gaussian 관측 통계를 추적한다 — 그것을 감독 배분에 쓴 사례가 있는가)
2. 물체 bbox 맞춤 격자·octree·다해상도로 **감독 라우팅용 field**를 만든 사례
3. voxel 캐시 대 연속 함수 직접 평가의 트레이드를 논한 사례
4. 없으면 "찾지 못함" — per-primitive a priori confidence가 빈자리라는 뜻

### Q-26. 가는 구조 계열과 구멍 — GW의 hole 거동 [완료] (우선순위 2)

**결과**: `wiki/questions/thin-structure-methods-and-holes.md`. ①(08-20 단독 회신 완료) **진단 런 가능** — 코드 전부 공개·CUDA 11.8·COLMAP 입력, 비후처리 mesh로 판독할 것. 핵심 신규 확인: **GW vacancy(Eq.7)는 카메라 광선 carving**("iterating over the set of all training camera rays")이라 관통은 열릴 구조적 이유가, 막힌 공동은 닫힐 구조적 이유가 있다 — 진단 런 예측을 문헌이 미리 지지 [원문 확인].
② 스포크 성공은 wrapping(표현)+carving(관측)의 합작이며, 구멍 열기로의 이전은 **광선 통과 가능할 때만** 성립하는 조건부다. curve 계열은 곡선 재구성이라 표면 위상 무관.
③ 관통 대 깊은 내부를 구분해 명시한 현대 재구성 선행은 **찾지 못함** — 구분의 원리는 Laurentini 1994(visual hull)에 있고, 그것을 GS 문헌에 명시적으로 가져오는 것은 빈자리 = **우리 서술 자산 유지, 단 발명이 아니라 고전 재소환으로 서술**.

사용자 관찰: Gaussian Wrapping 계열이 자전거 살(가는 고체)을 잘 재구성했다. **가는 고체(표현 한계)와 빈 공동(관측 한계)은 반대 문제**라는 가설 아래:

1. **GW(기존 위키 등록분) 재확인**: 논문이 구멍·개구·관통에 대해 말하는 것, 실패 자인, 코드 공개·셋업 난이도 — scan69 진단 런(눈송이 관통을 여는가) 가능성 판단용
2. 가는 구조 특화 계열(wrapping·curve-aware 등)이 **관통 구멍**을 다룬 사례 — 스포크 성공이 구멍 열기로 이전되는가
3. **관통(위상 보존)과 깊은 내부(관측 결핍)를 구분해 명시한 선행**이 있는가 — 없으면 이 구분 자체가 우리 서술 자산


### Q-27. 구멍 있는 물체를 다룬 케이스 전반 — wrapping 계열 밖 [완료] (우선순위 1)

**결과**: `wiki/questions/real-hole-preservation-precedents.md`. **실물 구멍 보존을 표적한 연구는 존재하나 전부 GS/NeRF 밖이다** — 최근접은 "Inverse Rendering for High-Genus 3D Surface Meshes with Persistent Homology Priors"(arXiv 2601.12155, 2026-01, Gu 그룹): 다중 뷰 이미지→mesh 역렌더링 + PH prior로 tunnel·handle 보존, Thingi10K 무대, Betti 채점 [원문 확인]. GS/NeRF에서 genus·위상을 표적·채점한 논문은 **찾지 못함 — 빈자리 확정.**
위상 채점 도구는 준비돼 있다: Betti·PH 제약(TopoSculpt TIB), "voxel 겹침 측도는 위상 정확성을 못 잡는다" 서술 확보. implicit+PH 계열(STITCH 등)은 점군 입력이고 STITCH의 제약은 단일 성분 강제라 오히려 구멍 제거 방향일 수 있음. shape completion은 보존/메움의 명시 서술 자체를 찾지 못함.
**visual hull 고전 앵커 확보**: Laurentini, IEEE TPAMI 16(2) 150–162 (1994) — hull 표면 위 특징만 실루엣으로 재구성 가능, 오목은 원리적 불가. 관통(실루엣이 봄) 대 깊은 내부(못 봄) 구분의 원전이며, GW vacancy carving(Eq.7)이 이 논리의 GS판임까지 연결됨(Q-26). "hole=메울 결함" 대세의 실례가 GW 논문 안에도 있음("closing holes"=shell 틈).

Q-14(SOTA 자인)·Q-24(깊은 내부 표적 선행)보다 넓은 그물이다. **어떤 계열이든** 실물 구멍이 있는 물체를 명시적으로 다룬 사례를 찾는다.

**검색 함정 명시**: "hole"의 mesh 문헌 대다수는 **스캔 결함 메우기(hole filling)** — 우리 목표(실물 구멍의 보존)와 정반대다. 검색어를 topology-aware / genus / through-hole / tunnel / handle / aperture / opening 계열로 갈아 끼울 것. **문헌 전체가 구멍을 "메울 결함"으로만 다룬다면 그 자체가 결론** — "실물 구멍 보존 문제는 비어 있다."

1. **GS/NeRF/implicit 표면 재구성에서 genus>0 물체를 명시적으로 평가·표적한 논문** — 위상 정확성(topology correctness), 터널·핸들 보존을 내건 것
2. **위상 인지 재구성 계열** (고전+신경) — persistent homology 유도, 위상 통제 level set, genus 제약 재구성. 무대와 한계
3. **위상을 채점하는 지표·벤치마크** — genus 오차, Betti 수. 기존 위상 지표 검토(C4·Q-20)와 통합
4. **고전 앵커 — visual hull/space carving**: 실루엣 기반은 관통 구멍을 (들여다보이면) 깎아낼 수 있으나 오목은 원리적으로 불가라는 고전 결과. 관통(실루엣이 봄)과 깊은 내부(아무것도 못 봄)의 구분에 원전 근거가 됨 — 원전과 정확한 서술 확보
5. shape completion 계열이 구멍을 보존하는지 메우는지 — 학습 prior가 구멍을 어떻게 취급하는가

산출: 계열별 표(무엇을 보존/메움, 무대, GS 이식 가능성). 엄밀성 규칙 상시.


### Q-29. ★GS mesh recon survey 존재 확인 [완료] (우선순위 1 — 최우선, 짧은 항목)

**결과**: **존재한다.** Xu·Chen·Li·Chen·Cheng, "A survey on surface reconstruction based on 3D Gaussian splatting", **PeerJ Computer Science, 2025-08-05** (PMC12453780) [원문 확인, PMC 게재본]. 약 60+ 기법 커버(2DGS·SuGaR·PGSR·GOF·RaDe-GS·GS2Mesh·DN-Splatter·GSDF·NeuSG 등), 분류는 3단계 처리 흐름(장면 표현 → Gaussian 최적화 → 표면 추출, 각각 정적/동적 구분).
**우리 표적을 다루는 절은 없다** — hole·오목·가림·미관측 영역을 체계적으로 다루는 절이 부재하고, 실패 언급은 "표면 불연속·왜곡 가능", "SDF는 투명 물체 곤란" 수준의 산발 문장뿐 [원문 확인]. survey의 분류 축 자체에 관측 결핍이 없다는 것이 측정 공백 서사의 보강 재료. 단 1-3 반론("필요 없었던 것") 검토용으로 부재 사실 그대로 기록.
MILo·AmbiSuR·Gaussian Sculpting 커버 여부는 확인 목록에 없었음 [미검증 — 2025-08 출판이라 시기상 MILo까지는 가능]. 2026년판 전용 survey는 검색에서 미발견(탐색: survey/review+GS+surface/mesh 2026, arXiv 목록 대조). 대체 후보: 일반 GS survey의 표면 절(arXiv 2401.03890, 2407.17418), 준-survey로는 MILo related work(2단계 계보 정리 충실, 위키 소스 기확보)와 Gaussian Sculpting(2026-08이라 최신 지형 반영).

**질문**: GS 기반 표면/mesh 재구성을 다룬 **survey·리뷰 논문이 존재하는가.** 사용자가 계보 공부의 출발점으로 삼을 문서를 찾는 것이 목적이다.

- 있으면: 제목·발표처·버전·범위(다루는 기법 목록)와 함께 **"우리 표적(hole·오목·관측 결핍)을 다루는 절이 있는지"**를 확인해 보고
- 없으면: "없음"을 탐색 경로와 함께 확정하고, 대체 후보를 제시 — ① 인접 survey(NeRF 계열 surface recon, 고전 MVS survey 중 최신) ② related work 절이 특히 충실한 논문 2~3편 (준-survey 역할)
- **부재 자체가 정보다**: 부재 시 "필요 없었던 것 아닌가"(rules-research 1-3)의 반론 검토 재료로 부재 사실을 그대로 기록

### Q-30. "photometric 개선 = mesh 개선" 통념 검증 재료 [완료 — 08-24 판정: 3층 구분 채택] (우선순위 1)

**결과**: 인용문 은행 완성 (`wiki/questions/photometric-vs-mesh-quality-evidence.md`). **역관계의 실측 진술 확보** — Desiatov & Sattler §5.3 "inverse relationship between NVS quality and F1 scores"(ScanNet++ 레이저 GT, SfM 초기화 조건) [원문 확인]. 이론 원전은 NeRF++ §3 shape-radiance ambiguity("fit ... perfectly for an arbitrary incorrect geometry") [원문 확인]. photometric의 둔감성 정량은 CoMe p.31(primitive 26% 제거에 PSNR 손실 0.02dB), 기전 서술은 CoMe 문제 설정(photometric을 줄이는 유일한 길이 기하 왜곡).
성립 방향도 공정 수집: NeRF++ 같은 절이 novel view에서는 기하 오류가 드러난다는 옹호 논리를 담고, 표면 계열은 기하 정규화 후 NVS 경쟁력 유지를 보고, D&S의 dense 초기화는 기하와 궤적 밖 일반화를 함께 올린다.
**종합의 정밀화(판단 필요)**: "photometric"이 training view 적합(기하와 원리적 무관)인지 novel view 일반화(부분 상관)인지 mesh 품질(역관계 실측)인지로 답이 갈린다 — Q-A 판정 시 이 3층 구분의 채택 여부. PSNR↑·Chamfer↓를 한 표에서 보인 사례는 미특정(추가 수집 여지).

research-status §4 **Q-A**의 조사 담당분. 사용자 체감: photometric을 올리며 geometry를 희생하는 케이스가 많다(특히 NVS). 통념의 성립·불성립 양쪽 재료를 모은다.

1. **확보된 단서 원문 재확인**: CoMe Table 5(수치와 주장 verbatim), Desiatov & Sattler(기하≠시각 — 정확한 주장 범위와 실험 조건)
2. **추가 사례 수집**: photometric 지표(PSNR 등)가 오르면서 geometry 지표(Chamfer/F1/normal)가 내려간 실측이 있는 논문. shape-radiance ambiguity 계열(NeRF++), floater/geometry 희생을 자인한 GS 논문
3. **반대편도 공정하게**: photometric과 geometry가 같이 오른다는 실측·주장이 있으면 그것도 기록 (불리한 발견 우선 보고 규율)
4. 산출: 인용문 은행 (verbatim + 표·절 번호). 판정은 하지 않는다 — "판단 필요"로 넘긴다

### Q-31. 차등 supervision의 learnable threshold 선례 [완료 — 08-24 판정: 관문 질문 확정, 노선은 설계 시점 보류] (우선순위 2)

**결과**: `wiki/questions/learnable-threshold-precedents.md`. 원전은 Kendall & Gal(NeurIPS 2017)의 learned loss attenuation — 가중을 네트워크 출력 σ로 학습하고 loss(잔차/σ²+logσ)가 스스로 감독. 재구성 실물: CoMe(연속 confidence, 임계 자체를 제거, 단 β는 상수 잔존), NeRF-W(화소 β), InstantSplat(sigmoid 온도형 soft 변환), **임계 직접 learnable은 RL 계열**(RLGS가 densification 임계를 RL로, LeGS가 결정 자체를 정책으로).
**패턴**: 주류는 "임계를 learnable로"가 아니라 "임계를 없애고 연속 가중을 학습" — 그리고 전부 잔차가 감독자다. 반대 노선(learnable 없이 근거): AmbiSuR percentile(비율 임계), Bulò 닫힌형 유도(α̂=1−√(1−α)), CoMe β 민감도 곡선.
**Q-B 판정 재료**: learnable의 공통 전제 = 감독자 존재. 잔차 감독은 관측 결핍 영역에서 침묵하므로, 촬영 기하 유래 confidence의 임계를 learnable로 두려면 무엇이 감독하는지가 설계 질문(합성 무대면 기하 오차가 후보). **판단 필요.**

research-status §4 **Q-B**의 조사 담당분. confidence에 따른 차등에서 임계·가중을 **learnable 파라미터로 둔 선례**가 있는가 (GS·NeRF·MVS 불문).

- 각 선례: 무엇을 learnable로 뒀나 / 어떻게 파라미터화했나(sigmoid 온도, soft threshold 등) / 무엇이 그것을 감독하나 / 잘 됐나
- 반대 노선도: 임계를 분포 기반으로 유도한 사례 (learnable 없이 근거를 만든 쪽)
- 정리 형식: rules-research 1-5 (의도 축)

### Q-28b. ★문제의 계보 — 관측 결핍 처리의 역사 [완료 — 08-24 판정: 빈칸 존재 채택(가치는 SOTA 실측 대기), §2.2 표적 정밀화 채택] (우선순위 1)

**결과**: 5마디 계보를 의도 축으로 완성 (`wiki/comparisons/problem-genealogy-observation-deficit.md`). **photo hull 원전 verbatim 확보** — Kutulakos & Seitz IJCV 2000 §1.1: "no finite set of input photographs can uniquely determine their shape ... uncountably-infinite equivalence class" + 기여 2 "tightest possible bound ... regardless of the specific algorithm being employed" [원문 확인, 공식 PDF p.201–203]. 덤: radiance 제약은 visual hull과 달리 "can contain concavities"(§2.2) — 질감 있는 오목은 깎이고 어두운 무질감 내부만 남는다는 표적 정밀화 재료.
마디별 전제: ①carving=국소 radiance·배경 분리 ②MVS 가시성 필터(PMVS)=질감 존재 ③불확실도=잔차 유도 가능(관측 없으면 잔차도 없음) ④NBV(Smith 2018)=**촬영 변경 가능** ⑤completion=채우기가 목표에 부합.
**빈칸 확정**: "촬영 불변 + 채우기 비원" 조건에서 결정 불가 영역을 다룬 마디 없음 — 마디 1(결정 불가 영역의 식별 가능성)과 마디 4(촬영 기하 사전 예측)를 고정 캡처의 학습 내부로 가져온 자리가 비어 있다. 1-3 반론은 Q-29 survey 부재 사실과 함께 판정으로 넘김. **판단 필요.**

**이것이 우리 문제의 계보다.** Q-28a(GS mesh recon)는 무대의 계보일 뿐이다. 질문: **"관측이 결정하지 못하는 영역을 어떻게 다룰 것인가"**를 다뤄온 마디들과, 각 마디가 무엇을 전제했고 무엇을 남겼는가.

추적할 마디 (전부 원전 확인 대상, 순서는 시대순 가설)

1. **Space carving / visual hull** — Kutulakos & Seitz(photo hull = 사진과 모순되지 않는 최대 형상, 그 안쪽은 원리적 결정 불가), Laurentini(visual hull, 오목은 실루엣이 못 깎음). **우리 명제의 원전 후보** — "관측이 결정하는 것과 아닌 것"을 처음 형식화한 자리
2. **MVS의 가시성 추론** — 가림을 명시적으로 추론해 감독에서 배제하는 관행(Furukawa & Ponce 계열 등). PGSR 왕복 게이트의 뿌리
3. **불확실도 인지 재구성** — 베이지안 MVS, NeRF/GS uncertainty 계열. 확신을 값으로 만들어 다루는 노선
4. **Next-best-view · reconstructability** — Smith 2018 등. **촬영 기하로 재구성 가능성을 사전 예측 = 우리 방법의 직계 조상.** 단 용도가 "다음에 어디서 찍을까"
5. **Shape completion** — 관측 없는 곳을 prior로 채우는 반대 노선

**산출 요구**
- 정리 형식은 rules-research 1-5(의도 축): 각 마디의 꼬집는 문제 → 의도 → 결과 → 남긴 한계
- 마디별 한 줄: 무엇을 물려받았나 / 무엇을 풀었나 / **무엇을 전제했나**(이게 핵심 — 각 답이 성립하려면 무엇이 가능해야 했는가)
- **빈칸 확인**: "촬영을 바꿀 수 없고 + 채우기를 원하지 않을 때"를 정면으로 다룬 마디가 있는가. 없으면 그것이 우리 자리
- 원전 인용문 확보 (photo hull 정의, visual hull의 오목 한계는 특히 정확히)

### Q-28a. 무대의 계보 — GS mesh recon [완료 — 08-24 판정: 전 마디 이월 잔여물 서술 채택, 정독 우선순위 불변] (우선순위 2)

**판정 (08-24)**: 결론 채택 — Q-28b 빈칸과 독립 수렴. 같은 조건부(수요 증명은 SOTA 실측 대기). SuGaR 절충 수치는 Q-30 은행 1-5b 교차 등재 확인. (08-25: 큐 소진 상태 해소 — 방향 세션이 **Q-32** 등록.)

**결과**: 8마디 계보를 의도 축으로 조립 (`wiki/comparisons/stage-genealogy-gs-mesh-recon.md`). 3DGS→SuGaR→2DGS→{GOF, RaDe-GS}→PGSR→{MILo, AmbiSuR, Gaussian Sculpting}. 축 A(primitive: 3D→2D/평면→mesh·SDF 앵커)와 축 B(추출 시점: 사후 Poisson→사후 TSDF/level set→in-loop→SDF 주역)로 정리했고, **공통 추진력은 "mesh를 최적화에 점점 가깝게 끌어들이기"**다. 계보도 텍스트 스펙 포함(그림용).
**핵심 관찰(판단 필요)**: hole·오목·관측 결핍은 **모든 마디의 "남긴 것" 칸에만 등장**하고 어느 마디도 표적으로 삼지 않았다. 3DGS §7.4에서 이미 자인됐고(계보 출발점부터 존재) PGSR §VI가 가장 직접적이며, PGSR만이 가림을 방법으로 다뤘으나 대상이 **뷰 간 모순의 배제**이지 결핍 영역의 처방이 아니다. 즉 우리 자리는 축 A·B의 다음 칸이 아니라 **전 마디에 이월된 잔여물**이라는 것이 표의 결론.
신규 확인: SuGaR 문제 서술 verbatim("the Gaussians do not take an ordered structure in general and do not correspond well to the actual surface")과 정규화 대가(PSNR 27.27 대 3DGS 28.69, Table 1) — **기하-외관 절충의 계보 첫 수치**로 Q-30 은행에도 해당.

사용자의 지식 체계화용 등뼈. **기존 위키 소화분(2DGS·PGSR·MILo·AmbiSuR·GOF·RaDe-GS 소스 페이지들)을 재사용해 조립하고, 빈 마디만 신규 조사한다.**

- 한 장 계보: 3DGS → SuGaR → 2DGS → GOF → RaDe-GS → PGSR → MILo → GeoSVR/AmbiSuR/GS Sculpting. **각 마디마다: 무슨 문제를 물려받았고, 무엇을 풀었고, 무엇을 남겼나** (한 줄씩)
- 축 둘로 정리: primitive 유형(3D vs 평면 vs SDF 앵커), mesh 추출 시점(사후 TSDF vs in-loop)
- 각 마디의 "남긴 문제"에서 **hole·오목·관측 결핍이 어디에 등장하는지** 표시 — 우리 자리가 계보 어디에 꽂히는지가 산출물
- 형식: comparison 페이지 1장 + (가능하면) 그림용 계보도 텍스트 스펙

### Q-32. ★hole 있는 오브젝트를 표적으로 삼은 계열 — 2025-01 ~ 2026 하반기 [완료, 판단 필요] (우선순위 1)

**결과**: **A(대상 물체의 깊은 내부를 난점으로 세운 계열)를 정면 표적으로 삼은 2025-01 이후 신규 연구는 찾지 못했다. 빈칸 유지.** 반영: `problem-genealogy-observation-deficit.md`의 "시간 축 후속" 절, `stage-genealogy-gs-mesh-recon.md` 2-1절.
확인한 신규분은 전부 A가 아니다 — G4Splat(ICLR 2026): 미관측의 원인이 씬 sparse view이고 video diffusion으로 채움 = 계보 마디 5 노선, 무대도 실내 씬. InnerGS: **입력이 단층(sliced) 데이터**라 외부 카메라 조건 자체가 성립 안 함. QGS: 오목을 **표현**할 수 있게 한 축 A 신규 마디(관측 결핍 아님, 계보에 등재). 치과·내시경 2026 다수: **카메라가 공동 안으로 들어감**(관측 기하 반대). GAVIS·HGS-Planner: 능동 매핑 = 마디 4.
**부수 확인 둘**: ① 2026년판 GS 표면 재구성 전용 survey 없음 — PeerJ판이 유일하며 2025 이후 커버리지 공백 그대로 ② 응용 분야는 A를 만나면 **카메라를 안에 넣어 우회**한다. 이는 1-3 반론("필요 없었던 것 아닌가")의 직접 재료 — 필요 없었던 게 아니라 우회되어 왔을 가능성. **판단 필요.**
탐색 경로: 형상·관측·방법·응용 4축 검색어를 2025-01 이후 필터로, 2026 학회·arXiv 최신 목록 대조, 약 60건 중 5편 본문·초록 확인. 검색 요약이 지어낸 문장(GSPrior의 "deep occlusions, narrow gaps")은 원문 확인으로 배제했다.

**배경**. Q-29가 확인한 PeerJ 서베이(Xu 외, PeerJ Comput. Sci. 11:e3034)의 **실질 커버리지는 2024년 말까지**다 — 투고 2025-01-06, 게재 2025-08-05, 참고문헌 연도 분포가 2024년 57편 대 2025년 3편 `[원문 확인, 로컬 PDF raw/papers/3DGS_RECON_SURVEY.pdf p1 및 참고문헌 전수]`. 방향 세션이 CHALLENGES 절(p20–21)을 직접 읽어 "남은 과제 셋이 전부 자원(데이터·연산·픽셀)의 양 문제로 환원된다"를 확인했고, 결과는 `wiki/comparisons/problem-genealogy-observation-deficit.md` 보강 절에 있다. 이 항목은 그 확인의 **시간 축 후속**이다.

---


### ⚠ 먼저: 두 가지 "hole"을 가른다 — 이 구분이 이 항목의 전부다

| | 뜻 | 우리 표적인가 |
| --- | --- | --- |
| **A. 오브젝트가 가진 hole** | **재구성 대상 물체 자체의 기하**에 깊이 있는 공동·내부가 있음. 파이프 내부, 깊은 컵·병, 보어, 구강, 조개 내부 등. 재구성 난이도의 **원인** | **✅ 이것을 찾는다** |
| **B. 결과물에 생긴 hole** | 재구성된 mesh에 뚫린 구멍·빈 면. 관측 실패나 알고리즘 실패의 **증상** | ❌ 아니다 |

**검색어 `hole`은 압도적으로 B를 가리킨다** (hole filling, hole repair, mesh completion, watertight reconstruction). 그대로 검색하면 B 문헌에 파묻히고 A는 한 편도 안 잡힌다. 조사 세션은 **A만 수집한다.**

- B 계열 자체는 이미 다뤘다 — 계보 마디 5(shape completion, "없는 곳을 prior로 채우기")가 그것이고, 우리 노선과 **반대**로 판정돼 있다. 재조사하지 않는다.
- **단 하나의 예외**: B를 다루는 논문이 그 원인으로 **A(대상 물체의 깊은 내부·오목 형상)를 명시적으로 지목**했다면 인접 재료로 기록한다. 반드시 "B 계열, 원인 서술만 해당"이라고 표시할 것.

**A의 정확한 범위** (research-status §1 기준):
- 관통 구멍(가위 손잡이, 도넛)은 **아니다** — 양쪽에서 보이므로 실패하지 않는다
- **깊이가 있는 내부**가 표적이다
- 08-24 정밀화 반영: 질감 있는 오목은 photo-consistency가 깎을 수 있으므로(Kutulakos & Seitz §2.2), 남는 표적은 **어둡거나 무질감한 깊은 내부**다

---

**질문**: 2025-01 이후 ~ 2026년 하반기(조사 시점 최신)까지 발표된 연구 중, **hole/깊은 내부를 가진 오브젝트의 재구성을 정면으로 표적 삼은 계열**이 있는가. GS 기반을 우선하되 인접(NeRF·MVS·SDF·스캐닝)도 포함한다.

찾는 것은 "그런 물체를 어쩌다 실험에 포함한 논문"이 아니라 **그 물체 형상 자체를 난점으로 세운 논문**이다. 방법 논문·데이터셋 논문·응용 논문 어느 쪽이든 좋다.

**중복 방지**. Q-14·16·22·24·26·27·28a·28b에서 훑은 범위는 재조사하지 않는다. **2025-01 이후 신규분만.** 데이터셋 쪽은 `hole-object-dataset-candidates.md` · `deep-cavity-target-datasets.md`에 이미 정리돼 있으니 **거기 없는 것만** 추가한다. 기확인 기법(MILo·AmbiSuR·Gaussian Sculpting·GeoSVR·PGSR)은 "이 축을 **표적**으로 삼았는가"만 재확인한다.

**검색어 설계 (핵심)**. 서베이가 §Survey methodology(p5)에서 밝힌 자체 수집 키워드는 `3D Gaussian splatting` · `3D GS` · `mesh` · `surface` **넷뿐**이다 `[원문 확인]`. 그 집합으로 다시 찾으면 같은 맹점을 재생산할 뿐이다. 축을 틀어서 검색한다.

- **형상축(A를 직접 가리키는 말)**: deep cavity, concave object, interior geometry, hollow object, recessed surface, deep recess, self-occluded geometry, non-convex object reconstruction
- **관측축**: unobserved / under-observed region, limited visibility, view coverage, occluded interior, textureless interior, incomplete observation
- **방법축**: visibility-aware supervision, coverage-aware, observation confidence, uncertainty-guided densification
- **응용축 — 여기가 가능성이 제일 높다.** A가 실물로 존재해 그 분야 사람들이 이미 싸우고 있는 곳: endoscopic / intraoral / dental scanning, borehole·well logging, pipe·duct·conduit inspection, cavity inspection, 주물·기계부품의 internal bore metrology, 문화재 내부·동굴
- 연도 필터 2025-01 이후. **2026년 하반기 신착까지 반드시 포함** — arXiv 최신 목록, 2026년 학회(CVPR/ICCV/ECCV/SIGGRAPH/NeurIPS) accepted 목록을 별도로 훑는다

**산출 요구**
- 발견 시: rules-research 1-5 형식(꼬집는 문제 상황 → 방향성·방법 → **의도** → 결과 지표 → 남는 한계). 더해 **우리 표적과의 겹침 정도**를 명시 — 같은 문제인가 / 인접일 뿐인가 / 응용만 겹치고 기전은 다른가 / A가 아니라 B인가
- **불리한 발견을 우선 보고한다.** 누군가 이미 A를 정면으로 했다면 그것이 이 항목의 가장 중요한 결과다. 완화하거나 뒤에 배치하지 않는다
- 미발견 시: 부재를 **탐색 경로(사용한 검색어 전부 · 훑은 목록 · 연도 필터 · 훑은 편수)와 함께** 확정한다. 경로 없는 부재 주장은 서지 않는다
- **2026년판 GS 표면 재구성 survey**가 새로 나왔는지 함께 확인 (Q-29 시점 미발견). 나왔다면 그 challenges 절이 A를 다루는지가 즉시 확인 대상
- 반영처: `problem-genealogy-observation-deficit.md` 빈칸 절, `stage-genealogy-gs-mesh-recon.md`

**판정은 하지 않는다.** rules-research 1-3의 반론("필요 없었던 것 아닌가")과 직결되므로 재료만 모아 "판단 필요"로 넘긴다.

---

### Q-33. 위상(topology) 축 5개 판정 [완료 — 08-26 판정 4건 반영: 자리 문장 채택·X1 등록·carving 후보 등재·위상 지표 편입] (우선순위 1 — 슬라이드/방향 세션 요청, 08-26)

> 요청 형식대로 축별 판정만 기록한다 (새 페이지 없음). 근거 대부분은 기존 페이지 재사용이며 신규 조사는 B(고전 위상 취급)·D(GSO)뿐이다.
> (재저장 08-26: 최초 기록이 방향 세션 커밋과의 동시 수정으로 유실되어 다시 저장함)

**A. GS mesh 추출 계열의 위상 취급 — 판정: 없음** `[기확보 종결]`
MILo·GOF·2DGS·SuGaR 본문·limitations에 관통 구멍·개구부의 위상 논의 없음 (각 소스 페이지 정독 + 2DGS 게재본 §7 + SuGaR는 limitations 절 자체가 없음, 08-21 확인). GW는 "hole"이 등장하나 의미가 반대다 — "High-error Gaussians are cloned with flipped normals, **closing holes** and reinforcing the shell" [원문 확인, Q-26]: shell 틈 메우기이며, 물체의 위상 구멍 보존은 논의 없음. 오히려 **hole=닫을 결함이라는 태도의 GS 내 실물 증거**. 유일한 오목 자인은 SatSplat §4.5(2DGS 평면 가정의 오목 over-smoothing)이나 이는 오목이지 위상이 아님. → 공백 근거 성립. 부수: scan37 가위 링이 "fuse together in Scan37"로 닫힌다는 제3자 문헌도 기확보(hole-object-dataset-candidates.md).

**B. 고전 표면 재구성의 위상 취급 — 판정: 있음 (구멍을 안 메우는 계열이 GS 이전에 존재)** `[신규 조사, 2차 자료 중심]`
- **Poisson은 구조적으로 watertight다**: indicator function(내부/외부 지시 함수)을 복원하므로 정의상 닫힌 표면이며, "robust to missing data through **filling the corresponding holes**" — hole filling이 설계 의도다 [2차 자료, CGAL 매뉴얼·Screened Poisson TOG 2013 계열]. 완화 장치로 density 기반 trimming(Screened Poisson 배포물의 SurfaceTrimmer)이 관행.
- **안 메우는 계열**: Ball-Pivoting(Bernardini 외, TVCG 1999 [원문 PDF 존재]) — 표집 밀도가 낮으면 edge를 만들지 않아 **구멍이 남는다**(보간하지 않음). α-shapes 계열 동일("Topologically Correct Surface Reconstruction Using Alpha Shapes", 2008). **Labatut 계열 Delaunay graph-cut** — 가시성 항으로 사면체 내부/외부를 라벨링하므로 **광선이 통과한 관통은 원리적으로 깎인다**(결과는 watertight이되 위상은 가시성이 결정) [2차 자료].
- **왜 GS가 안 쓰나 (관찰, 해석 표기)**: GS 계열의 입력은 점군이 아니라 렌더 깊이·Gaussian이라 노이즈에 강건한 TSDF/Poisson을 채택(2DGS가 TSDF의 floater·노이즈 강건성을 채택 이유로 언급). BPA·α-shape는 표집 밀도에 민감해 렌더 깊이 노이즈와 상성이 나쁨. **핵심 관찰: MILo는 Delaunay를 쓰면서 Labatut의 가시성 항 없이 learnable SDF 부호에 위상을 맡긴다** — 사용자 가설(구멍 안 사면체가 채워지면 안 뚫림)과 정확히 맞물리는 구조적 차이. 단 이는 조사 세션의 관찰이며 MILo 코드로 교차 확인 필요 `[코드 미확인]`.

**C. 위상을 재는 지표 — 판정: 부분 (지표는 존재, GS/NeRF 표면 재구성 평가에는 부재)** `[기확보 종결]`
- 존재하는 것: Sulzer 외 survey(arXiv 2301.13656)가 성분 수·경계 변·비다양체 변을 Chamfer와 병렬 보고(점군 입력 고전·학습 계열 무대) [원문 확인]. TopoSculpt(arXiv 2509.03938)의 Betti 제약 TIB + "voxel 단위 겹침 측도는 위상 정확성을 못 잡는다"는 필요성 서술(의료) [2차 자료]. **High-Genus IR(arXiv 2601.12155, 다중 뷰 mesh 역렌더링)이 Betti·PH 채점을 실제 사용** — tunnel·handle 보존을 지표로 잰 최근접 사례, 단 GS 아님 [원문 확인].
- 부재하는 것: **GS/NeRF 표면 재구성 벤치마크에서 genus·Euler·Betti를 채점한 사례는 Q-27 누적 탐색에서 찾지 못했다.** Gaussian Sculpting의 mesh 품질 지표(내각·sliver)도 기하 품질이지 위상이 아님.
- **확정 가능 문장**: "GS 표면 재구성 평가에서 구멍이 막혔는지를 재는 표준 지표는 없다 — Chamfer·F-score는 관통이 닫혀도 국소 거리 오차로만 계상하고, DTU 프로토콜은 ObsMask로 관측 영역만 채점한다(Q-06)." 단 "지표가 없다"가 아니라 "지표는 인접 분야에 있는데 GS 평가가 안 쓴다"로 서술해야 정확 (1-3 반론 대비).

**D. 관통 구조 GT mesh 데이터셋 — 판정: 있음 (기확보 + GSO 신규)** `[신규 1건]`
기확보 표(hole-object-dataset-candidates.md·deep-cavity-target-datasets.md) 유효. 신규: **GSO(Google Scanned Objects, ICRA 2022)** — 실물 스캔 가정용품 1030개, OBJ mesh, **CC-BY 4.0**, "nearly all 1030 models had closed manifold meshes" [2차 자료, 공식 블로그·게재 논문]. **High-Genus IR이 Google Scans를 고 genus 평가 무대로 실사용** — 관통 물체 존재의 간접 확인 [원문 확인]. 개별 관통 품목 목록은 미확인 `[미검증]`. MobileBrick(모델별)·OmniObject3D(teapot 핸들 확정)은 기확보 그대로.

**E. 가림을 명시적으로 모델링하는 GS — 판정: 있음(부분) — 전부 학습 중·자기참조이며 학습 전 a priori는 부재** `[기확보 종결]`
- PGSR: 렌더 깊이 homography 전후방 사영 오차를 가림 게이트로 사용, 제거 시 F1 0.52→0.28 [원문 확인] — 학습 중, 자기 기하 참조.
- VAD-GS(arXiv 2510.09364): 점군 복셀화 + z-buffer로 가시성 판정 → densification [원문 확인]. GW: 카메라 광선 vacancy carving(Eq.7) [원문 확인].
- 반대편 자인: Nerfbusters §4.4 — 프러스텀 가시성은 "does not handle occlusions, instead overestimates the number of views" [원문 확인]. 우리 field의 알려진 한계와 동일 구조의 선행 자인.
- **빈자리 유지**: 학습 전에 계산하는 가림 인지 가시성(HPR·SfM track 멤버십)을 감독 배분에 쓴 사례는 없음 (Q-16·Q-25 결론).

**요청자 가설(위상 문제)에 걸리는 종합**: A·C가 "없음/부분"으로 나와 공백이 서고, B가 그 공백의 계보적 원인 후보를 준다 — 고전에는 구멍을 안 메우는 계열(BPA·α-shape)과 가시성으로 위상을 결정하는 계열(Labatut)이 있었는데, GS 계열은 렌더 깊이 노이즈 때문에 TSDF/Poisson(watertight 지향)으로 수렴했고 MILo의 Delaunay는 가시성 항 없이 SDF에 위상을 맡긴다. **판단 필요**: MILo 코드에서 사면체 라벨링에 가시성이 정말 없는지 교차 확인(실험 세션 X 후보), Labatut식 가시성 carving의 재소환을 개입 설계에 넣을지.

---

### Q-34. naive v0 설계 입력 — 미관측 구역의 표면 처리 선례 [완료, 판단 필요] (우선순위 1)

> **요청 성격이 다르다.** 사용자가 지금 논문을 직접 읽을 수 없는 상황이라, **핵심만 추려 오는 것**이 목적이다. 각 항목 3~6줄. 전문 요약이나 방법 상세는 필요 없고, **우리 설계에 바로 꽂히는 사실과 verbatim 한두 개**만 가져온다.
> 배경: `wiki/system/design-2026-08-26-naive-v0.md` (naive v0 — 자유공간 단언 + 미관측 구역 매끄러운 연장). §4-c와 §5가 이 조사의 소비처다.

**① 곡률 연속 hole filling — "캡 씌우기"가 아니라 "경계 기하 연장"을 하는 계열**

mesh 처리 문헌의 hole filling 중 **경계의 곡률·법선을 이어받아 매끄럽게 잇는** 기법. Liepa 2003(fairing), Poisson patching 계열이 후보.

- 각각: 무엇을 최소화하나(막·박판 에너지 등) / 경계 조건을 어떻게 거나 / **연장이 어디서 멈추나**
- **우리가 알고 싶은 핵심**: 이들이 "구멍을 막는" 용도로 쓰였는데, 우리는 같은 수학을 **안쪽으로 연장하는** 데 쓰려 한다. 그 전용이 자연스러운지, 아니면 캡 씌우기 전용의 가정(경계가 닫힌 루프 등)이 박혀 있는지
- 주의: 검색어 `hole filling`은 우리 표적과 반대 의미다 (Q-32 ⚠ 참조). 여기서는 **기법의 수학만** 가져온다

**② 증거 없는 곳에 표면을 주장하지 않는 선례 — Screened Poisson의 density trimming**

Screened Poisson 배포물의 SurfaceTrimmer가 점 밀도 기반으로 외삽 표면을 잘라내는 관행 (Q-33 B축에서 확인됨).

- 무엇을 기준으로 자르나(density 값의 의미), 임계는 어떻게 정하나(고정? 사용자 지정? 분포 기반?)
- **핵심 질문**: 이것이 "증거 없는 곳엔 표면을 주장하지 않는다"의 기성 선례로 인용 가능한가. 가능하면 verbatim 한 줄
- Q-B(임계 근거)의 분포 기반 노선 재료로도 쓰인다

**③ normal consistency / smoothness를 구역별로 다르게 준 선례**

2DGS의 normal consistency 항이 원형인데, 그것을 **구역·화소별로 차등 적용**한 사례가 GS·NeRF·MVS 어디에든 있는가.

- 있으면: 무엇으로 구역을 갈랐나(마스크·불확실도·가시성?) / 무엇이 그 구분을 감독하나
- **없으면 그것이 결론** — 부재를 탐색 경로와 함께 확정한다. 우리 §4-c가 새 자리라는 근거가 된다

**산출 형식**: 이 큐 항목 바로 아래에 결과를 적는다. 새 위키 페이지는 만들지 않는다 (분량이 커지면 그때 판단 필요로 넘긴다). 출처 등급·절 번호 규율은 평소대로.

---

**결과 (08-26)**

**① 곡률 연속 hole filling — 전용 가능, 단 경계는 닫힌 루프 전제**
Liepa, "Filling Holes in Meshes" (Eurographics SGP 2003) `[2차 자료 — 원문 PDF 미확보, 공식 초록·구현 문서 경유]`. 4단계: 경계 식별 → 구멍 삼각분할(min-max 이면각 또는 최소 면적) → 세분 → **fairing**. 패치가 "interpolate the shape and density of the surrounding mesh" — 우리가 원하는 "경계 기하 이어받기"가 바로 이 문장이다.
fairing은 umbrella 연산자 계열(uniform / scale-dependent / harmonic)로 이산 라플라시안을 최소화한다. 즉 막·박판 에너지의 이산판이며, **경계 정점의 위치·법선을 Dirichlet 조건으로 고정**하고 내부만 완화한다.
**전용 판단**: 수학 자체(라플라시안 최소화 + 경계 고정)는 방향 무관이라 안쪽 연장에 그대로 쓸 수 있다. **단 박혀 있는 가정은 "경계가 닫힌 루프"**이며 — 삼각분할 단계가 루프를 전제로 패치를 만든다 — 정지 규칙이 **루프가 닫히는 순간**이다. 막힌 보어처럼 반대편 경계가 없으면 이 단계가 성립하지 않는다. **§4-c의 정지 규칙("FREE 증거가 닿는 데까지")은 Liepa식 루프 폐합을 대체하는 별도 장치여야 한다. 판단 필요.**

**② 증거 없는 곳에 표면을 주장하지 않는 선례 — 인용 가능**
Kazhdan PoissonRecon 배포물의 **SurfaceTrimmer** `[원문 확인, 공식 배포 페이지·저장소 문서]`. 재구성기의 `--density` 플래그가 등위면 정점마다 **입력 표본까지의 추정 깊이(표집 밀도 신호)**를 함께 출력하고, SurfaceTrimmer가 그 값이 임계 미만인 부분을 잘라낸다.
공식 문서 문구: 목적이 "removing parts of a reconstructed surface that are generated in **low-sampling-density regions**"이고, 결과로 **"allowing for the generation of non-water-tight surface"** — 즉 **watertight 강제를 의도적으로 푸는 공식 장치**다.
**인용 가능 판정: 가능.** "증거 없는 곳엔 표면을 주장하지 않는다"의 기성 선례로 서며, Q-33 B축(Poisson=구조적 watertight)의 완화 장치가 배포물 자체에 있다는 점이 핵심이다.
**임계는 사용자 지정 부동소수**이며 분포 기반 유도가 아니다 — Q-B에는 "관행도 임계를 손으로 정한다"는 재료로 쓰이지, 유도 노선의 모범은 아니다. `[미검증]` 원논문(TOG 2013)이 이 trimming을 본문에서 논하는지는 미확인.

**③ normal consistency를 구역별로 차등 적용한 선례 — 찾지 못함**
2DGS의 normal consistency를 **구역·화소별로 차등**한 사례를 GS·NeRF·MVS에서 찾지 못했다. 최근접은 SVR-GS(arXiv 2509.11116, 2025-09)인데 **공간 가변 대상이 sparsity/pruning 마스크**이고 표적이 압축·경량화다 `[원문 확인, 초록]` — 기하 정칙화가 아니라 우리 축이 아니다.
인접 계열도 전부 다른 것을 가른다: 4DGS-in-the-wild(불확실도로 적응 정칙화, 표적은 동적 씬), sparse-view 계열의 spatial-aware mask(전경 신뢰 구역 강조, 깊이 prior 가중), Gaussian Surfels(정칙화 자체는 균일). **"관측 결핍 구역에서 photometric을 낮추고 기하 정칙화를 올린다"는 조합은 확인 범위에 없다.**
탐색 경로: normal consistency/smoothness + spatially varying·per-region·mask·uncertainty·adaptive strength·unobserved 조합, 2025~2026 필터. 기존 위키 대조(CoMe·AmbiSuR percentile·Expo-GS·CDGS) — 전부 **photometric 또는 prior 쪽을 가중**하지 기하 정칙화를 구역별로 올리지 않는다.
**→ §4-c가 새 자리라는 근거 성립.** 단 AmbiSuR가 "모호 구역에 normal prior를 선택 투입"하는 것과 **겉모습이 비슷**하므로(투입 대상이 prior냐 정칙화냐, 구분 근거가 학습된 지표냐 학습 전 가시성이냐) 차별 축을 서술로 못박아야 한다. **판단 필요.**
