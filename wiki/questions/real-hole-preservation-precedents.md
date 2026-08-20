---
type: "question"
slug: "real-hole-preservation-precedents"
title: "실물 구멍을 다룬 케이스 전반 — 보존인가 메우기인가"
status: "draft"
modified_at: "2026-08-20T00:00:00.000000+00:00"
author: "조사 세션"
language: "ko"
confidence: "medium"
sources:
  - "https://arxiv.org/abs/2601.12155"
  - "https://ieeexplore.ieee.org/document/273735"
  - "https://arxiv.org/abs/2412.18696"
  - "https://arxiv.org/abs/2509.03938"
  - "https://onlinelibrary.wiley.com/doi/10.1111/cgf.14496"
tags:
  - "topology"
  - "hole-preservation"
  - "survey-q27"
  - "motivation"
---

# 실물 구멍을 다룬 케이스 전반 — 보존인가 메우기인가

> SURVEY_BRIEF Q-27. 어떤 계열이든 실물 구멍이 있는 물체를 명시적으로 다룬 사례. 검색 함정(hole 문헌 대다수 = 스캔 결함 메우기)을 피해 topology / genus / through-hole / tunnel / handle / Betti 계열 검색어로 수행했다.
> 조사일 2026-08-20.

## 1. 계열별 표 — 무엇을 보존하고 무엇을 메우는가

| 계열 | 대표 | 구멍 취급 | 무대·입력 | GS 이식 가능성 |
| --- | --- | --- | --- | --- |
| **다중 뷰 mesh 역렌더링 + PH prior** | **"Inverse Rendering for High-Genus 3D Surface Meshes from Multi-view Images with Persistent Homology Priors"** (Gao 외·Xianfeng Gu 그룹, arXiv 2601.12155v1, 2026-01) `[원문 확인, PDF]` | **보존이 목표.** persistent homology prior로 tunnel·handle loop을 유지. 균일 접근이 이를 붕괴시킨다고 주장 | **다중 뷰 이미지** → 명시적 mesh (미분 가능 mesh 렌더링, GS·NeRF 아님). Thingi10K·Google Scans, Betti·위상 채점 포함 | 표현이 다르나 **"실물 구멍 보존"을 다중 뷰 사진에서 표적한 유일 확보 사례.** 코드 미확인 |
| implicit + PH (점군 입력) | STITCH (arXiv 2412.18696), Topology-controllable Implicit Surface Recon (CAD 2022), Topology-enhanced DeepSDF | **위상 통제** — 단 STITCH의 제약은 "단일 연결 성분" 강제라 방향이 오히려 구멍 제거 쪽일 수 있음 `[2차 자료]` | 점군 → SDF. 사진 아님 | 위상 loss의 미분 가능 정식화가 참고 재료 |
| 학습 기반 위상 재구성 | TopoNet, "Topology Learning for 3D Reconstruction of Objects of **Arbitrary Genus**" (CGF 2022) `[2차 자료]` | genus 임의 물체의 위상 학습 | 학습 계열 (단일 뷰로 추정) `[미검증]` | 낮음 |
| 의료 관 구조 위상 정제 | TopoSculpt (arXiv 2509.03938) `[2차 자료]` | **Betti 수 prior + 전역 무결성 제약**(TIB)으로 관 위상 교정. PH barcode로 허위 성분 제거 | 의료 볼륨 | **Betti 기반 채점·제약의 최신 사례.** "voxel 단위 겹침 측도는 위상 정확성을 못 잡는다"는 서술 확보 — 위상 채점 필요성의 문헌 근거 |
| shape completion | ShapeHD (ECCV 2018) 등 | **구멍 보존/메움의 명시 서술을 찾지 못했다.** 학습 prior는 "그럴듯함"만 벌점 — 실물 구멍과 관측 결손을 구분하는 장치가 없음 `[2차 자료]` | 단일 뷰·부분 스캔 | — |
| **고전 앵커 — visual hull** | **Laurentini, "The visual hull concept for silhouette-based image understanding" (IEEE TPAMI 16(2), 150–162, 1994)** | **visual hull 표면 위에 있는 특징만 실루엣 기반으로 재구성 가능.** 오목(그릇 내부)은 원리적 불가, 관통은 실루엣에 구멍으로 나타나는 시점이 있으면 깎임 | 이론 (실루엣 volume intersection) | **관통(실루엣이 봄) 대 깊은 내부(아무것도 못 봄) 구분의 원전.** GW의 vacancy carving(Eq.7)이 이 논리의 GS판임을 Q-26에서 확인 |

## 2. 결론

1. **실물 구멍 보존을 표적한 연구는 존재한다 — 그러나 전부 GS/NeRF 밖이다.** 최근접은 High-Genus 역렌더링(2026-01, mesh 렌더링)이고, GS/NeRF 다중 뷰 재구성에서 genus·위상 정확성을 표적하거나 채점한 논문은 **찾지 못했다.** GS 쪽 빈자리 확정
2. **"hole = 메울 결함" 대세의 실례가 GS 논문 안에도 있다.** GW의 "closing holes" 문구는 shell 틈 메우기 의미다 (Q-26 확인). 검색 함정 자체가 분야의 태도를 증언한다
3. **위상 채점 도구는 준비되어 있다.** Betti 수·PH 기반 제약(TopoSculpt TIB)·위상 지표(High-Genus IR), 그리고 "voxel 겹침 측도가 위상을 못 잡는다"는 필요성 서술까지. C4·Q-20의 위상 지표(성분 수·경계 변)와 결합하면 채점 축이 선다
4. **관통 대 깊은 내부의 구분에 고전 원전이 있다** (Laurentini 1994). 관통은 실루엣 정보가 원리적으로 존재하고, 오목·내부는 존재하지 않는다 — Q-26③의 구분 서술을 우리가 만들 필요 없이 고전에 접붙일 수 있다

## 3. 탐색 경로와 남긴 것

검색어: topology-aware + persistent homology / genus level set / TopoNet·Betti·completion prior / Laurentini visual hull concave. hole-filling 계열은 의도적으로 배제. GS+genus 직접 검색은 Q-14·Q-24의 누적 검색(concave/hollow/interior/limitation 조합)이 겸한다.

- High-Genus IR(2601.12155)의 위상 지표 정의·수치와 한계 절 미정독 (PDF 확보됨, 로컬 저장)
- Laurentini 원문은 IEEE 유료라 초록·2차 자료 수준. "hull 표면 위 특징만 재구성 가능"의 정식화 원문 대조 필요
- STITCH의 제약 방향(단일 성분 강제)이 구멍 제거인지 보존인지 본문 미확인
- TopoNet 입력(단일 뷰 여부) 미확인
- shape completion의 구멍 취급 전수 확인 아님 (ShapeHD 계열 검색 1갈래)
