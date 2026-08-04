# Research WIKI Log (종료됨)

> **2026-08-04부로 이 기록은 닫혔다. 더 이상 추가하지 않는다.**
> 진행 기록은 `wiki/system/progress-YYYY-MM-DD.md`로 옮겼고, 현재 상태는 `wiki/system/research-status.md`에 있다.
> 아래는 2026-06-02부터 2026-07-06까지의 위키 유지보수 이력이며 참고용으로 보존한다.

- [2026-06-02 00:12] Registered 6 raw self-supervised vision papers as Korean source pages, extracted 8 reusable concept pages, refreshed the WIKI index, and verified all 6 papers as reflected.
- [2026-06-02 13:22] Deepened source/exemplar-cnn after PDF image-plus-text review: added key equations, Fig. 1-11 evidence, implementation details, classification and descriptor-matching results, limitations, and open questions.
- [2026-06-02 13:44] Added canonical WIKI image attachments and embedded 6 selected Exemplar-CNN PDF pages beside visual-evidence and equation notes.
- [2026-06-02 13:51] Added client-invoked discussion capture for durable research knowledge and GUI browsing by WIKI object type and linked paper.
- [2026-06-02 13:56] Captured question/gradient-guided-patch-construction from the Exemplar-CNN reading discussion, distinguishing gradient-weighted crop sampling from gradient-guided patch generation.
- [2026-06-10 14:49] Added claim/adaptive-rank-primitive-splatting as a seed note for continuous point-line-surface-volume splat primitives and linked key Gaussian/mesh hybrid prior work.
- [2026-06-10 15:05] Updated claim/adaptive-rank-primitive-splatting with a minimal 3DGS-based hybrid candidate set: 3D Gaussian, 2D Gaussian/surface splat, and Triangle/mesh patch.
- [2026-06-18 16:13] Organized user notes on 2DGS, SuGaR, MeshGS, Effective Rank GS, and Triangle Splatting into a comparison page, added an auxiliary splat layer concept, and updated the adaptive rank primitive claim.
- [2026-06-18 17:04] Added a comparison note on 2025H2-2026H1 splatting trends, covering mesh-in-the-loop, surface-aligned GS, triangle splatting, material-aware reconstruction, and simulation-ready directions.
- [2026-06-18 17:21] Added a claim note for residual-guided mesh refinement splatting, framing Gaussian residuals as mesh reconstruction failure probes rather than final visual fudge layers.
- [2026-06-18 19:37] Connected the seminar framing to the WIKI claims, linking the original GS+triangle rendering-quality idea to the newer usable-geometry trend and the residual-guided mesh refinement claim.
- [2026-06-18 18:10] Reframed residual-guided mesh refinement around Triangle Splatting+ sparse/topology limits, uncertainty-aware pruning, temporary Gaussian holders, and evidence-based topology repair.
- [2026-07-01 10:26] Added comparison/gs-mesh-extraction-reading-map: reviewed the user's mesh-extraction reading list (GOF, RaDe-GS, GGGS, Gaussian Wrapping, 2D-SuGaR, MILo), split reading into primitive vs extraction axes, added 2D Triangle Splatting (2506.18575), and fixed a 7-step reading order.
- [2026-07-01 10:40] Added tools/pdf_figure_crop.py (grid+crop) to cut individual figures/tables from PDFs; reworked source/triangle-splatting into TL;DR + 한눈에 table + numbered sections with 8 inline cropped figures replacing full-page screenshots; updated paper-source-writing SKILL.md with the cropping workflow and new template.
- [2026-07-01 11:05] Rewrote 4 source pages (triangle-splatting-plus, effective-rank-gs, gaussian-splashing-unified-particles, physgaussian) into the new format with inline cropped figures (9/7/8/6 crops) replacing full-page screenshots; verified all image refs resolve with no orphans/strays; corrected a few stale page anchors found against the real PDFs.
- [2026-07-06 00:00] Updated comparison/gs-mesh-extraction-reading-map: added a joint/post-hoc optimization-axis column to the lineage table, detailed Gaussian Wrapping's oriented-normal→reciprocal-attenuation→OaV closed-form occupancy mechanism, and placed OMeGa (2509.24308) on the texture-less-indoor axis explicitly distinct from the user's under-observed axis; recorded the "MILo still valid as in-loop extraction SOTA; −47% is vs 2DGS not MILo" conclusion plus unverified caveats to check in OMeGa's full paper; added a Discussion Capture.
