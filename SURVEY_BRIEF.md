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
   연구 방향, 가설과 판정, 핵심 명제, 4상태 정의, 확보된 실측, 경쟁 기법과의 차이, 평가 무대, 용어 규칙, 현재 진행이 전부 여기 있다. **세 갈래 세션이 공유하는 단일 최신본이며 이것만 읽으면 맥락이 선다.**
2. (필요 시) **실험 상태**: `C:\Users\jinsw712\Desktop\Files\UnderConstrained-GS-Recon\EXPERIMENT.md`
   조사 항목이 특정 실험 결과와 얽힐 때만 해당 절을 읽는다. 전체 정독 불필요.
3. (필요 시) **연구 이력**: `wiki/system/progress-YYYY-MM-DD.md`
   "언제 왜 이렇게 정해졌나"가 필요할 때만 날짜를 지정해 읽는다. 평소에는 읽지 않는다.
4. (필요 시) **용어 상세**: `C:\Users\jinsw712\.claude\projects\C--Users-jinsw712-Desktop-Files-Research-WIKI\memory\terminology-preferences.md`
   확정 용어표 전문과 인용문 은행. 핵심 금지어는 위 1번에 이미 들어 있다.

**읽지 않는 것**: `journal.md`, `harness/`, `specs/`, `PRD.md`, `TASK.md`, `docs/`, `AGENTS.md`. 2026년 6월에 끝난 위키 MCP 도구 개발 프로젝트의 유물이다.

## 3. 조사 규율

- **출처 없는 문장을 쓰지 않는다.** 모든 사실 주장에 논문 제목, 발표처, 연도, arXiv 번호 또는 URL을 붙인다.
- **검증하지 못한 것은 `[미검증]`으로 명시한다.** 기억이나 추론으로 빈칸을 메우지 않는다.
- **찾지 못했으면 "찾지 못함"이라고 적는다.** 느슨하게 관련된 논문으로 대체하지 않는다. 대체할 경우 "인접 항목, 직접 답 아님"이라고 이유와 함께 표시한다.
- **원문 우선.** 요약 사이트나 블로그가 아니라 논문 본문에서 확인한다. 인용문은 verbatim으로, 15단어 이내로.
- **경쟁 기법을 조사할 때는 공정하게 읽는다.** 우리 주장에 유리한 해석을 먼저 찾지 않는다. 그들의 limitations 자인은 그대로 기록한다.

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

---

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

### 보완 후에도 닫히지 않은 것

- **고전 MVS의 도시 규모 달성 범위와 비용** (Q-07): ISPRS 저널 두 편 유료, MDPI 리뷰(Remote Sensing 16(5):773)는 403 차단. 기관 프록시 등 접근 경로가 있어야 닫힌다
- 표면 재구성 전용 GS와 **고전** MVS의 동일 무대 비교는 문헌에 없음이 거의 확정 (SS3DM도 상대가 neural SDF)
- Curve-aware GS(2506.21401)와 EdgeGaussians(2409.12886) 본문 정독
- Shelly·OmniObject3D 라이선스, T&T 라이선스 명칭 확정
- Splatt3R·MASt3R-GS·DroneSplat 등 DUSt3R 계열 본문 (감독 배분 사례 추가 존재 가능성)
- Frey·Borouchaki 표면 mesh 품질 원전(IJNME), valence 지표 원전
- Spires IJRR 게재본 대조, T&T 공식 crop 작성 기준
