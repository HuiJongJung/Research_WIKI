---
type: "system"
slug: "research-status"
title: "연구 현재 상태 (공용 최신본)"
status: "reviewed"
modified_at: "2026-08-21T12:00:00.000000+00:00"
author: "정휘종"
language: "ko"
confidence: "high"
sources:
  - "C:/Users/jinsw712/Desktop/Files/UnderConstrained-GS-Recon/EXPERIMENT.md"
tags:
  - "status"
  - "system"
  - "shared-context"
---

# 연구 현재 상태 (공용 최신본)

> **이 문서는 세 갈래 세션이 공유하는 단일 최신본이다.** 방향 논의 세션, 조사·문헌 세션, 실험 세션(`UnderConstrained-GS-Recon`)이 작업 시작 시 읽는다.
>
> 갱신일 **2026-08-26** (같은 날 2차 — 서베이 정독·Q-35·Q-36 회수: 표적 연속량화, 가설 통합, 용어 확정). 배경 재구성 시대의 가설·판별값·실측을 정리하고 hole 오브젝트 무대 기준으로 다시 세웠다. **"현재 연구 상황"은 이 문서, "이전 연구 상황"은 `raw/status-archive/`의 날짜별 스냅샷이다.** 배경 시대의 상세(가설 H1~H3, 판별값 설계, 실측, 판정 이력)는 `raw/status-archive/research-status-2026-08-21.md`에 통째로 보존되어 있다.

## 0. 참조 규칙

| 알고 싶은 것 | 볼 곳 |
| --- | --- |
| 연구 방법 원론 (논의 전 필독) | `wiki/system/rules-research.md` |
| 내 연구가 어디로 가고 있는지 (주간 일지) | `direction/26년M월N주차.md` (주 = 월~일, 주차 = 그 주 월요일 기준) |
| **이전 연구 상황** | **`raw/status-archive/`** (버전 스냅샷) · `progress-*.md` (08-21 종료된 이전 형식) |
| 발표 자료·발표 방법 규율 | `wiki/system/rules-deck.md` · `rules-talk.md` |
| 실험 상태, 수치, 실행 기록 | `C:/Users/jinsw712/Desktop/Files/UnderConstrained-GS-Recon/EXPERIMENT.md` (실험의 진실 원천) |
| 문헌 조사 임무와 큐 | 이 저장소 `SURVEY_BRIEF.md` |
| 논문 정리, 개념 페이지 | 이 저장소 `wiki/sources/`, `wiki/concepts/` |

**어느 세션도 방향을 독자적으로 바꾸지 않는다.** 방향 의문은 `EXPERIMENT.md`의 "열린 질문" 또는 `SURVEY_BRIEF.md` 큐에 "판단 필요"로 남긴다. 판정은 방향 논의 세션이 한다.

## 1. 연구 한 줄 (잠정)

**hole(깊은 공동·파이프 내부 등 깊이가 있는 내부)이 있는 단일 오브젝트에서, GS 기반 mesh 재구성의 품질을 개선한다.**

- **잠정인 이유**: 문제 제기는 계보를 소화한 뒤에 한다 (`rules-research.md` 1-1). 지금 이 문장은 표적 선언이지 motivation이 아니다.
- 관통 구멍(가위 손잡이 등)이 아니라 **깊이가 있는 내부**가 표적이다. 양쪽에서 보이는 구멍은 실패하지 않는다.
- **정밀화 ② (08-26 채택 — 연속량으로)**: 표적은 hole의 유무(이분법)가 아니라 **개구부가 좁아 관측 다양성이 구조적으로 낮은 깊은 내부**다. 실패를 부르는 것은 구멍의 존재가 아니라 **깊이 대비 개구부의 좁음**이다. 판별 변수 후보: 개구부 입체각 / 깊이–폭 비 / 그 영역을 실제로 본 뷰 수. 근거는 육안 관측 `[정량 미측정]`이므로 **연속성 자체가 예측(P-b)이며 측정 대상**이다.
  - 파급: 무대 선정 기준이 "hole 있는 물체"에서 **"깊이/폭 비가 여러 값으로 분포하는 물체"**로 바뀐다. motivation 그림도 성공/실패 두 장이 아니라 **연속으로 무너지는 곡선**이 된다. scan69와 scan65는 두 범주가 아니라 **한 축 위의 두 점**이다
  - 계측 도구는 이미 있다: **자유공간 광선의 밀도가 곧 관측 다양성의 대리 측정**이다. v0의 증거 지도가 깎는 동시에 정도를 잰다
- **정밀화 ① (08-24, Kutulakos & Seitz §2.2 채택)**: 질감 있는 오목은 photo-consistency가 깎을 수 있다 ("can contain concavities"). 따라서 남는 표적은 **어둡거나 무질감인 깊은 내부** — photo-consistency도 실루엣도 못 미치는 곳이다.

## 2. 지금 할 일 (병렬 두 줄기)

**실험 줄기 — 현 SOTA가 어디까지 되는지 실측**

1. hole 있는 오브젝트를 찾아 선정한다
2. MILo · AmbiSuR로 재구성한다
3. PGSR을 세팅해서 같은 씬을 돌린다
4. 목적: SOTA의 실패 지점을 본인 눈으로 확인. motivation 그림의 원판
5. **X1 (08-26 등록): MILo 사면체 라벨링 코드 교차 확인** — Delaunay 사면체의 내부/외부 결정에 **가시성 항이 정말 없는지** (조사 관찰 `[코드 미확인]`, Q-33 B축). 코드 읽기만으로 판정 가능. **확인되면 가설 후보 1호가 검증 가능한 표적을 얻는다**
6. 평가 규약 (08-26 추가): 정성 단면(씬별 절단 평면 사전 등록) + **위상 지표 병기** — 연결 성분 수·경계 변·Betti/genus. Chamfer는 관통이 닫혀도 국소 거리 오차로만 계상하므로 위상 지표 없이는 우리 표적이 채점되지 않는다 (Q-33 C축, 기존 C4·Q-20 검토와 통합)

**공부 줄기 — 계보와 의도**

1. 같은 계보의 논문과 survey를 읽으며 **이 큰 틀의 문제와, 여러 방법이 해결하려 한 공통 목표·의도**를 머리에 넣는다
2. 각 논문에서 정리할 것: **꼬집는 문제 상황 / 동기 / 어떤 의도로 어떤 시도를 했는가 / 결과 지표 / 남는 한계** (`rules-research.md` 1-5 — 의도를 축으로 잇는다)
3. 그 위에서 내 문제 제기와 해결 방법을 찾는다

## 3. 남기는 아이디어 (배경 시대에서 살아남은 것)

1. **Observation confidence map** — 학습 전에 만드는 신뢰도 지도라는 아이디어 자체.
   - 설계 데이터는 백지에서 재검토한다. **SfM 부산물을 쓸 수도 있다** 정도만 유지 (확정 아님)
2. **confidence에 따른 차등 supervision**
   - threshold를 임의로 정하려면 근거가 있어야 하고, 아니면 **learnable**이 가능한지 검토한다 (`rules-research.md` 4-1)
   - 차등의 기여 지점 후보: regularization 가중 / densification 제어 / prior 배분 / **추출 단계 개입 — Labatut식 가시성 carving 재소환 (08-26 후보 등록, Q-33 B축)**: 고전 Delaunay graph-cut은 가시성 항으로 사면체를 깎아 관통이 열렸는데 GS 계열은 이 항을 잃었다. X1 확인 시 정확히 그 빈 곳을 채우는 개입. 고전 재소환 서술은 Laurentini 패턴(Q-26③)과 동일 구조 — 전부 재검토 대상
3. **어떤 기법에든 붙는 독립 모듈** — 특정 baseline(MILo) 비고집 (방향 일지 §3, 원칙 8)

## 4. 열린 질문

| # | 질문 | 상태 |
| --- | --- | --- |
| Q-A | **"photometric을 개선하면 mesh도 개선되는 것이 정상"이라는 통념이 맞는가.** | **판정 (08-24): 3층 구분 채택.** "photometric"을 갈라야 답이 선다 — ① training view 적합: 기하와 원리적 무관 가능 (NeRF++ §3 shape-radiance ambiguity `[원문 확인]`) ② novel view 일반화: 부분 상관 ③ **mesh 품질: 역관계까지 실측** (Desiatov & Sattler §5.3 "inverse relationship between NVS quality and F1 scores" `[원문 확인]`). 통념은 ③층에서 성립하지 않는다. 사용자 체감("NVS에서 geometry 희생")이 근거로 승격됨. 인용문 은행: `wiki/questions/photometric-vs-mesh-quality-evidence.md`. 잔여 보강: PSNR↑·Chamfer↓ 동시 표 사례 미특정 |
| Q-B | 차등 threshold를 **learnable**로 만들 수 있는가 | **재료 확보 (08-24), 노선 선택은 method 설계 시점으로 보류.** 문헌 주류는 "임계를 없애고 연속 가중을 학습"(Kendall & Gal→NeRF-W→CoMe)이며 **전부 잔차가 감독자** — 그런데 잔차 감독은 관측 결핍에서 침묵한다. 관문 질문 확정: **기하 유래 confidence의 learnable 임계는 무엇이 감독하는가** (후보: 합성 무대의 기하 오차 / 분포 기반 유도(AmbiSuR percentile·Bulò 닫힌형) / 연속 가중으로 임계 자체 회피). 선례 표: `wiki/questions/learnable-threshold-precedents.md` |
| Q-C | GS를 개선했을 때 mesh에 **어떤 경로로** 영향이 가는가 | Q-A의 3층 구분이 부분 답 (training 적합↑이 mesh↑를 함의하지 않음이 이론·실측 양쪽 확보). 실측 경로 확인은 실험 줄기에서. 전제가 아니라 증명 대상 (`rules-research.md` 2-2) |

## 5. related work (현 방향 기준 임시 정리)

> 각 항목의 "참고할 것"은 임시 메모다. 정독하면 `wiki/sources/`로 옮기고 이 표를 갱신한다.

| 논문 | 계보 위치 | 참고할 것 (임시) |
| --- | --- | --- |
| 2DGS | 무대 계보 (GS→mesh) | mesh 추출 절차(렌더 깊이→TSDF), 정규화 두 항의 실제 식 |
| PGSR | 무대 계보 — **실질 1순위** | occlusion 추정 기전 (ablation F1 0.52↔0.28), 렌더 깊이→TSDF 경로 구조 |
| MILo | 현재 실험 baseline | in-loop mesh 구조, prior 주입 경로 |
| AmbiSuR | 현 SOTA 참조선 | photometric ambiguity 처리 방식, hole에서의 한계 |
| Gaussian Sculpting | 최근접 경쟁 | 방법 차이, mesh 품질 지표(내각·sliver) 정의 |
| CDGS | 인접 선행 — 학습 전 confidence로 깊이 감독 가중 | 차별화 축 |
| VAD-GS | 인접 선행 — 가시성 + densification 조향 | 가시성 채널 설계 |
| **Mind the Gap** (arXiv 2607.01556) | 가설 축 2·3 **선점자** (`[원문 확인]`) | §5.2 "SH coefficients can compensate for geometric errors". SH 차수 분해 진단법 — 인용해 타고 간다. 축은 궤적 외삽이지 self-occlusion 아님 |
| Desiatov & Sattler | Q-A 근거 (`[원문 확인]`) | §5.3 역관계 실측 — NVS 품질과 F1의 inverse relationship (ScanNet++ 레이저 GT) |
| Kutulakos & Seitz (IJCV 2000) | 문제 계보 마디 1 — **명제의 원전** (`[원문 확인]`, 로컬 PDF) | "no finite set of input photographs can uniquely determine their shape" (§1.1), photo hull = 알고리즘 무관 최대 경계, §2.2 오목 정밀화 |
| Smith 외 2018 | 문제 계보 (uncertainty-aware) | 가시성·거리·각도 결합식의 원전 |
| **Xu 외, GS surface recon survey** (PeerJ CS, 2025-08-05) | 공부 줄기 1번 — 지도 획득용 | 60+ 기법, 3단계 분류(표현→최적화→추출). **hole·오목·관측 결핍 절 없음 — 분류 축 자체에 부재** = 측정 공백 서사 보강 |

**문제의 계보 (Q-28b 완료, 08-24 판정)**: 5마디 정리 완료 — `wiki/comparisons/problem-genealogy-observation-deficit.md`. **빈칸의 존재는 채택**: "촬영 불변 + 채우기 비원" 조건을 다룬 마디가 없고(마디별 전제: 재촬영 가능/잔차 존재/채움 허용), survey 분류 축에도 관측 결핍이 없다(Q-29) — 이중 확인. 우리 자리 후보 = **마디 1(결정 불가 영역의 식별 가능성) × 마디 4(촬영 기하 사전 예측)를 고정 캡처의 학습 내부로 가져오는 것.** 단 **빈칸의 가치(수요)는 아직 미증명** — "필요 없었던 것" 반론(rules-research 1-3)은 SOTA가 실제로 실패하는 실측(실험 줄기)이 나와야 최종으로 막힌다.

**무대의 계보 (Q-28a 완료, 08-24 판정)**: 8마디 조립 완료 — `wiki/comparisons/stage-genealogy-gs-mesh-recon.md`. 3DGS → SuGaR → 2DGS → {GOF, RaDe-GS} → PGSR → {MILo, AmbiSuR, Gaussian Sculpting}. 두 축(primitive / 추출 시점)의 공통 추진력은 "mesh를 최적화에 가깝게 끌어들이기". **채택된 결론: hole·오목·관측 결핍은 어느 마디의 "푼 것"에도 없고 전 마디의 "남긴 것"에만 이월됐다** (3DGS §7.4 자인부터 PGSR §VI "관측이 없거나 부족한 영역"까지). **우리 자리는 축의 다음 칸이 아니라 전 마디 공통 이월 잔여물** — 문제 계보(Q-28b)의 빈칸 판정과 독립 경로로 같은 결론. 같은 조건부 적용: 수요 증명은 SOTA 실측 대기. 부수 확보: SuGaR Table 1 절충 수치(R-SuGaR-15K PSNR 27.27 vs 3DGS 28.69) — 기하-외관 절충이 계보의 상수라는 Q-A 재료(인용문 은행 1-5b).

**위상 축 (Q-33 완료, 08-26 판정)**: 근거 전문은 `SURVEY_BRIEF.md` Q-33 블록. **채택된 연구 자리 문장** — "GS 표면 재구성 평가에는 구멍이 막혔는지를 재는 표준 지표가 없고(인접 분야에는 있다 — Sulzer 성분 수·경계 변, TopoSculpt Betti, High-Genus IR의 PH 채점 — GS 평가가 안 쓰는 것), 추출 계열은 위상을 논의조차 하지 않는다(MILo·GOF·2DGS·SuGaR 전부 부재, GW의 'closing holes'는 hole=닫을 결함 태도의 실물 증거)." 서술 주의: **"지표가 없다"가 아니라 "인접 분야에 있는데 GS 평가가 안 쓴다"** — 1-3 반론 대비. 계보적 원인 후보(B축): 고전에는 안 메우는 계열(BPA·α-shapes)과 **가시성이 위상을 결정하는 계열(Labatut Delaunay graph-cut)**이 있었으나, GS는 렌더 깊이 노이즈 때문에 watertight 지향(TSDF/Poisson)으로 수렴했고 MILo의 Delaunay는 가시성 항 없이 learnable SDF 부호에 위상을 맡긴다 `[코드 미확인 — X1]`. 데이터셋: GSO(실물 스캔 1030, CC-BY 4.0) 신규 확보. 학습 전 a priori 가림 판정을 감독에 쓴 사례 없음 재확인(E축).

참고: hole만 전담한 논문은 존재하지 않음이 확인되었다 (Q-24). 부재 자체가 자리일 수도, "필요 없었던 것"일 수도 있다 (`rules-research.md` 1-3의 반론을 먼저 받을 것).

## 6. 가설 (재수립 중)

**현재 확정된 가설은 없다.** 배경 시대 가설(H1·H2·H3)은 §7과 함께 폐기했다.

### 가설 후보 (08-26 통합판, 미확정)

**상위 진단**: **GS 계열에서 가시성은 독립적 증거로 작동하지 않는다.** 두 단계에서 서로 다른 이유로 그렇다.

| 단계 | 왜 작동 안 하나 | 검증 |
| --- | --- | --- |
| **최적화 중** | 가시성이 **기하에서 파생**되므로 순환한다: 기하 → transmittance → 어느 뷰가 무엇을 감독하나 → 기하. 그래서 **얕고 잘못된 기하가 자기 가시성을 스스로 정당화**한다 — 입구의 막이 안쪽을 가려 안쪽이 감독에서 빠지고, 빠지니 막을 치울 이유가 없어진다. SH가 가세해 원래 **가시성 변화**였던 신호를 색으로 흡수하면 얕은 해가 손실상 더 싸진다 | P-a (SH 차수 ↓) · P-b (깊이/폭 비 단조성) |
| **추출 중** | 가시성 항이 **아예 없다**. MILo Delaunay는 learnable SDF 부호에 위상을 맡긴다 (Labatut은 가시성으로 사면체를 깎았다) | X1 (코드) · 뷰 수 스윕 |

원래 "가설 후보 1호"(구멍 안 사면체가 채워지면 뷰를 늘려도 안 뚫린다)는 이 진단의 **추출 단계 사례**다. 08-26 서베이 정독분과 대조한 결과 **둘은 경쟁이 아니라 같은 진단의 두 자리**로 판정했다.

**우리 처방이 둘 다 깨는 이유 (통합의 실익)**: SfM 점은 **GS 학습 이전에, 현재 기하와 무관하게** 삼각측량된다. 그래서 거기서 나온 자유공간 증거는 최적화 단계에서는 **순환 밖의 증거**라 순환을 끊고, 추출 단계에서는 **없던 항**을 채운다. 하나의 개입이 두 자리에 동시에 듣는다.

### 선점된 것과 남은 것 (Q-35 회수, 08-26)

| 축 | 지위 | 처리 |
| --- | --- | --- |
| 2. SH 표현력 ↔ 기하 품질 | **선점됨** — Mind the Gap (arXiv 2607.01556) §5.2 verbatim: "SH coefficients can compensate for geometric errors ... the geometric and view-dependent components interact rather than sum perfectly" `[원문 확인]`. 고차 SH가 외삽을 3개 씬에서 **해쳤다**는 실측까지 있음 | **우리 것으로 주장하지 않는다.** 인용해서 타고 간다 |
| 3. shape-radiance ambiguity 확장 | **부분 선점** — 같은 논문이 기하 오차 보상으로 확장. 단 **가시성 축으로는 확장 안 됨** | 확장의 방향이 다름을 명시 |
| **1. 가시성 차이를 색이 흡수한다는 지적** | **빈자리** — 찾지 못함. 인접(반사·MSGS 계열)은 self-occlusion이 아님 | **우리 몫** |
| **4. 가시성을 기하와 독립 제약으로 / 순환의 명시** | **빈자리** — 기하→가시성→감독→기하 순환을 명시적으로 짚은 문헌 없음. 확인된 것은 전부 기하 참조(PGSR·VAD-GS·GW) | **우리 몫.** Q-16·Q-25·Q-33 E축 누적 결론과 일치 |

**서술 규율**: Mind the Gap의 축은 **궤적 외삽**이고 우리 축은 **self-occlusion**이다. "SH가 기하를 보상한다"는 그들 문장이며, 우리 기여는 **그 기전이 가시성 축에서도 작동한다**는 확장이다. 이 구분을 흐리면 선행 도용으로 읽힌다 (rules-research 3-1 — 겹침은 정상이고 일은 차이를 찾는 것).

**P-a는 선례가 있다**: SH 차수 분해를 진단으로 쓰는 방법 자체를 Mind the Gap이 이미 했다. **재발명하지 말고 그 방법을 인용해 우리 무대에 적용한다.** SH ablation은 여전히 진단 도구이지 기여가 아니다.

**P-a의 교란 경고**: SH 차수를 낮추면 전체 표현력이 함께 떨어지므로, hole 거동 변화가 흡수 경로 차단 때문인지 일반 열화 때문인지 구분되지 않는다. **특이성을 재야 한다** — Δ(hole 구역) 대 Δ(비 hole 구역). hole 쪽만 나아져야 기전 증거다 (rules-research 2-4).

**PGSR과의 차별 축 (한 문장)**: "기존 가시성 처리는 자기 기하(렌더 깊이)에서 파생되므로 순환 안에 있다. 우리는 학습 이전에 확정된 SfM 관측에서 가시성을 가져오므로 순환 밖에 있다."

### 용어 확정 (Q-36 회수, 08-26)

- **맨 `view-dependent`를 가시성에 쓰지 않는다.** NeRF·3DGS 모두 이 말을 **색·외관에만** 쓰며, 청중은 SH 색으로 알아듣는다 `[원문 확인]`
- 우리 현상은 **"self-occlusion으로 인한 뷰 간 가시성 변화"**로 부른다. 짧게 써야 하면 `view-dependent visibility`처럼 **수식어를 붙인 복합어**만 허용
- **어두운 내부는 뷰 의존이 아니다.** DTU는 조명 고정 + 카메라 이동이므로 어두움은 **위치의 함수**다. `ambient occlusion` 또는 "낮은 조도"로 부르고 가시성 논의와 섞지 않는다

가설은 §2의 두 줄기(SOTA 실측 + 계보 소화)가 만나는 지점에서 다시 세운다. 계보 쪽 입력은 도착했다(§5 빈칸·위상 판정) — **실험 줄기의 SOTA 실측이 남은 반쪽**이다. 세울 때 `rules-research.md` §2를 따른다 — **가설의 전제 자체를 증명 대상으로 명시한다.**

## 7. 폐기 목록 (2026-08-21 확정, 이유와 함께)

| 폐기 | 이유 |
| --- | --- |
| 배경(원거리 외벽) 재구성 표적 전체 | GS용 데이터(중앙 물체 360도)로 배경을 만드는 것 자체가 과도하게 specific한 task (08-19 판정) |
| 삼각측량각 · 최대 쌍각 · pot_angle · robust spread 판별값 설계 전체 | 배경 무대 위의 설계. 설계 데이터는 백지에서 재검토하며 "SfM 부산물을 쓸 수도 있다"만 남긴다 |
| H1·H2 등 기존 실측 전체 | 배경 무대의 결과인 데다, 자동 산출된 수치를 본인이 해석하지 못한 상태라 근거로 쓰지 않는다 |
| 4상태(WELL/DEGEN/UNSUPPORTED/…) 정의, voxel 수축격자, Spires 무대 | 판별값 폐기와 같은 계열 |
| 건전성 비대칭 서술, 관측 원뿔 2·atan(r/d) 이론 훅 | 판별값 폐기와 함께 **보류**. 재설계에서 다시 유효해지면 그때 스냅샷에서 되살린다 |

상세와 당시 근거는 전부 `raw/status-archive/research-status-2026-08-21.md`에 있다.

## 8. 용어 규칙

산출물(발표, 보고, 논문, 위키, 코드 주석, 그림 라벨)에 모두 적용한다. 배경 시대 전용 항목(외벽/파사드 등)은 표에서 제외했다.

| 쓸 것 | 쓰지 말 것 |
| --- | --- |
| under-constrained | 저관측 |
| artifacts, floaters, holes | 붕괴 |
| photometric ambiguity | cheating (인용 시 따옴표로만) |
| 판별값, 지표, confidence | 신호 |
| 동일 기준 비교, 정량 대조 | 채점 |
| prior | (표준 용어이므로 유지) |

### 8-1. 서술 규칙 (발표·논문 공통)

- **방법을 특정 baseline에 국한된 것으로 서술하지 않는다.** 방침 자체가 독립 모듈이다 (§3-3). 문제는 GS 기반 표면 재구성 전반의 공통 문제로 서술하고, 실험이 특정 baseline 위에서 이루어졌음을 밝힌다.
- **"학습 전"을 "학습 없이"로 번역하지 않는다.** confidence map 접근은 baseline을 그대로 전부 학습시키고 감독의 배분만 바꾼다.

## 9. 갱신 규칙

- 방향이나 판정이 바뀌면 **주간 방향 일지(`direction/26년M월N주차.md`)에 무엇이 왜 바뀌었는지 적고, 이 문서의 해당 절을 덮어쓴다.**
- **덮어쓰기 전에 이전 버전을 보관한다.** 그날 첫 수정이면 `raw/status-archive/research-status-<날짜>.md`로 통째 복사한다 (하루 한 번이면 충분, 같은 날 나머지 변경은 git이 잡는다). 예전에 냈던 의견과 판단이 나중에 다시 쓸모 있을 수 있기 때문이다.
- 실험 수치는 이 문서에 요약만 두고 상세는 `EXPERIMENT.md`에 남긴다. 두 곳의 숫자가 어긋나면 `EXPERIMENT.md`가 옳다.
- 갱신 책임은 방향 논의 세션에 있다. 다른 세션은 이 문서를 읽기만 한다.
