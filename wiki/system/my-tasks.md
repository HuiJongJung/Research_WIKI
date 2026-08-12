---
type: "system"
slug: "my-tasks"
title: "본인 작업 목록"
status: "reviewed"
modified_at: "2026-08-12T10:00:00.000000+00:00"
author: "정휘종"
language: "ko"
confidence: "high"
sources:
  - "wiki/system/open-items.md"
tags:
  - "tasks"
  - "system"
---

# 본인 작업 목록

> 사용자가 직접 수행하는 작업만 담는다. 전체 열린 항목은 `open-items.md`, 현재 상태는 `research-status.md`.
> **현재분만 유지하며 덮어쓴다.** 이력은 `progress-YYYY-MM-DD.md`.

기준일 2026-08-12 (Q-11 회수, 가산형 4열 회수 반영)

---

## 완료 처리

- COLMAP 원전 정독 + 코드 확인 (채널 출처는 research-status 4절)
- confidence 수식 재설계 (κ 유도·검증 후 실측 기각, 최대 쌍각 유지)
- 활용처 설계 확정 (lever⑤ 정규화 차등 + ④′ clone 억제)
- 용어 정리 (`pot_angle` 폐지 → **최대 쌍각**)

---

## 1. 구조도 2장 [최우선]

재료 전부 확정. 사양서 `design_log/2026-08-09_kappa-field-spec.md` §6이 설계도.

- [ ] **overview**: MILo 파이프라인 회색 + 본 연구 추가분 파랑. 입력 → 파이프라인 → 출력
- [ ] **디테일**: SfM 산출물에서 최대 쌍각을 복원해 field가 되고, conf가 ⓐ mesh 정규화 가중(픽셀 단위, 렌더 조회) ⓑ clone 게이트(프리미티브 단위, 직접 조회)로 흘러가는 경로를 화살표 끝까지

"field를 만들었다"는 기여가 아니다(AREA3D 선점). **이 그림이 보여주는 "어디에 어떻게 넣는가"가 기여다.**

## 2. Desiatov & Sattler 정독 (arXiv 2603.20714) [신규, 읽기 1순위]

Q-11 읽기 지도의 첫 번째. **그들의 결론이 우리 실험과 같은 모양**이다 — "초기화 정보는 시각 품질에서 씻기나 기하 일관성에는 남는다" 대 우리의 "F-score로는 차이가 작으나 crop 밖 GT로는 갈린다".

- [ ] geometric consistency를 **정확히 무슨 지표로** 쟀나 (C4 위상 지표 검토와 직결)
- [ ] "시각 품질에서 씻긴다"가 **어떤 실험 설계**에서 나왔나 (densification 강도가 변수인지)
- [ ] **왜 기하에는 남는다고 해석**했나 — 주장 (A)의 파급 효과 관측에 인용할 어깨

## 3. Rumpler 외 정독 (AAPR 2011) [신규, 읽기 2순위, 목표 한정]

각과 깊이 불확실도 관계의 원전. 우리 판별값의 이론 어깨.

- [ ] 각↔불확실도 관계의 공식 형태와 유도 (인용 가능한 형태로)
- [ ] 그들이 이 관계를 **어디에 썼는지**(촬영 계획인지 재구성인지) — 사다리 3번 칸 확인

## 4. Expo-GS 훑기 (30분)

- [ ] ablation 표 수집 (균일 제약 유해: 41.38 → 36.59)

## 5. 박사분께 용어 확인

- [ ] mesh 분야에서 regularization, densification 대신 쓰는 용어

## 선택 (마감 없음)

- 설명 파일(`confidence_설계_설명_260809.md`) 통독 — 부록 8개로 불어나 재정리 검토 중
- Blender 본판 씬 제작 (급하지 않음)

---

## 위임 현황 (본인 작업 아님)

### 실험 세션

| 항목 | 상태 |
| --- | --- |
| global_rep2 (주장 A 재현) | 진행 |
| DEGEN·WELL 축 분해 | **불가 판정** — 개입 영역과 GT 영역 교집합 공집합 |
| **Spires GT 커버 voxel 각도 분포** | 신규 요청 (CPU 즉시) — 세 층 명제를 두 사이트로 |
| base2 (가산형 노이즈 바닥) | 대기 |
| ④′ clone 억제 이진판 | 대기. 실행 전 crop 밖 GT 밴드 각도 분포 확인 조건 |
| AmbiSuR·MILo 재추출 | 대기 (주장 B 문구 확정의 전제) |
| 샘플링 도구 결함 수정 | 진행 — 수정 전 해당 수치 인용 금지 |
| use_mono (DA3 세대 효과) | 후순위 |
| COLMAP points3D 각 필드 부재 확인 | 신규 (문헌보다 코드로 확정) |

### 조사 세션

- **DS-NeRF 본문 확인** (신규) — "재투영 오차를 어떻게 감독에 넣었나" 하나
- **reconstructability 2편·Mostegel** — 유보에서 당겨옴. 티어 2, abstract·method 요약으로 충분. 확인 대상: "각을 촬영 계획에 썼고 재구성 목적함수에는 넣지 않았다"가 맞는지 (사다리 3번 칸)
- Q-09 잔여 3건 (PipeForge3D, Thingi10K 라이선스, GW 평가 스크립트) — 본판 시점

### 위키 세션

- 실험 회신 판정 (rep2 / ④′ / 재추출)
- related work 골격을 인용 사다리 4칸으로 작성

---

## 읽지 않아도 되는 것 (조사에서 확보 완료)

CoMapGS, CoMe, AmbiSuR, 3DGS 원논문 초기화 ablation, Depth Anything V2·V3. 위키 페이지에 수치와 인용문까지 있다.

## 유보 목록과 해제 조건

| 항목 | 해제 조건 |
| --- | --- |
| G4Splat, Two-Stage, StreetSurf, Free360 | related work 집필 착수 시 |
| GaussianObject | 표적을 물체로 전환 확정 시 (현재 스코프상 가능성 낮음) |
| FSGS, DNGaussian | sparse-view 구별 문단 집필 시 |
| ~~reconstructability, Mostegel~~ | **해제됨 — Q-11 사다리 3번 칸으로 당겨 조사 세션 배정** |
| TurboGS, LeGS, GSFixer, Motive, LASER, NBV view-sampling | 개입 재설계 착수 시 |
