import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { Presentation, PresentationFile } from "file:///C:/Users/jinsw712/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const ROOT = "C:/Users/jinsw712/Desktop/Files/Research_WIKI";
const SKILL_DIR = "C:/Users/jinsw712/.codex/plugins/cache/openai-primary-runtime/presentations/26.614.11602/skills/presentations";
const TASK_SLUG = "physgaussian-class-presentation";
const WORKSPACE = path.join(os.tmpdir(), "codex-presentations", "manual-physgaussian", TASK_SLUG);
const TMP_DIR = path.join(WORKSPACE, "tmp");
const PREVIEW_DIR = path.join(TMP_DIR, "preview");
const LAYOUT_DIR = path.join(TMP_DIR, "layout");
const QA_DIR = path.join(TMP_DIR, "qa");
const OUTPUT_DIR = path.join(ROOT, "outputs", "physgaussian-presentation");
const FINAL_PPTX = path.join(OUTPUT_DIR, "physgaussian-class-presentation.pptx");

const asset = (name) => path.join(ROOT, "wiki", "assets", "physgaussian-physics-integrated-3d-gaussians", name);
const img = {
  p1: asset("page-0001-dpi-144.png"),
  p3: asset("page-0003-dpi-144.png"),
  p4: asset("page-0004-dpi-144.png"),
  p5: asset("page-0005-dpi-144.png"),
  p6: asset("page-0006-dpi-144.png"),
  p7: asset("page-0007-dpi-144.png"),
  p8: asset("page-0008-dpi-144.png"),
};

const W = 1280;
const H = 720;
const C = {
  bg: "#F7F4EF",
  ink: "#18212A",
  muted: "#59636E",
  faint: "#D8D0C4",
  line: "#B8AFA1",
  green: "#1F6B57",
  blue: "#315E8C",
  rust: "#B85C38",
  yellow: "#E2B84B",
  white: "#FFFFFF",
  dark: "#111820",
  softGreen: "#DCEBE4",
  softBlue: "#DCE8F4",
  softRust: "#F2DFD7",
};

async function ensureDirs() {
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(LAYOUT_DIR, { recursive: true });
  await fs.mkdir(QA_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

async function readImageBytes(imagePath) {
  const bytes = await fs.readFile(imagePath);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function bg(slide, fill = C.bg) {
  slide.background.fill = fill;
  slide.shapes.add({
    geometry: "rect",
    position: { left: 0, top: 0, width: W, height: H },
    fill,
    line: { style: "solid", fill, width: 0 },
  });
}

function text(slide, value, x, y, w, h, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = value;
  shape.text.style = {
    typeface: style.typeface ?? "Aptos",
    fontSize: style.fontSize ?? 20,
    color: style.color ?? C.ink,
    bold: style.bold ?? false,
    italic: style.italic ?? false,
    alignment: style.alignment ?? "left",
  };
  return shape;
}

function title(slide, kicker, claim, note = "") {
  text(slide, kicker, 64, 42, 340, 24, { fontSize: 12, bold: true, color: C.green });
  text(slide, claim, 64, 76, 840, 92, { fontSize: 36, bold: true, color: C.ink, typeface: "Aptos Display" });
  if (note) text(slide, note, 64, 162, 760, 44, { fontSize: 17, color: C.muted });
  slide.shapes.add({
    geometry: "line",
    position: { left: 64, top: 214, width: 1152, height: 0 },
    fill: "none",
    line: { style: "solid", fill: C.faint, width: 1.2 },
  });
}

function footer(slide, n, source = "PhysGaussian, arXiv:2311.12198v3, 2024") {
  text(slide, source, 64, 676, 680, 18, { fontSize: 10.5, color: C.muted });
  text(slide, String(n).padStart(2, "0"), 1166, 672, 48, 24, { fontSize: 12, bold: true, color: C.muted, alignment: "right" });
}

function box(slide, x, y, w, h, fill = C.white, line = C.faint) {
  return slide.shapes.add({
    geometry: "roundRect",
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: line, width: 1 },
    borderRadius: 8,
  });
}

function bulletList(slide, items, x, y, w, gap = 54, opts = {}) {
  items.forEach((item, i) => {
    const yy = y + i * gap;
    slide.shapes.add({
      geometry: "ellipse",
      position: { left: x, top: yy + 7, width: 12, height: 12 },
      fill: opts.dot ?? C.green,
      line: { style: "solid", fill: opts.dot ?? C.green, width: 0 },
    });
    text(slide, item, x + 24, yy, w - 24, opts.h ?? 42, { fontSize: opts.fontSize ?? 20, color: opts.color ?? C.ink });
  });
}

async function addImage(slide, imagePath, position, alt, fit = "contain") {
  slide.images.add({
    blob: await readImageBytes(imagePath),
    contentType: "image/png",
    alt,
    fit,
    position,
    geometry: "roundRect",
    borderRadius: 8,
  });
}

function note(slide, lines) {
  slide.speakerNotes.textFrame.setText(lines);
  slide.speakerNotes.setVisible(true);
}

function flow(slide, labels, x, y, w, h, colors) {
  const gap = 18;
  const bw = (w - gap * (labels.length - 1)) / labels.length;
  const shapes = labels.map((label, i) => {
    const s = box(slide, x + i * (bw + gap), y, bw, h, colors[i] ?? C.white, C.line);
    text(slide, label, x + i * (bw + gap) + 14, y + 18, bw - 28, h - 28, { fontSize: 18, bold: true, color: C.ink, alignment: "center" });
    if (i > 0) {
      slide.shapes.add({
        geometry: "line",
        position: { left: x + i * (bw + gap) - gap + 2, top: y + h / 2, width: gap - 4, height: 0 },
        fill: "none",
        line: { style: "solid", fill: C.muted, width: 2 },
      });
    }
    return s;
  });
  return shapes;
}

function bar(slide, label, value, max, x, y, w, color) {
  text(slide, label, x, y, 130, 22, { fontSize: 15, color: C.ink });
  slide.shapes.add({ geometry: "rect", position: { left: x + 140, top: y + 4, width: w, height: 14 }, fill: "#E7E0D6", line: { style: "solid", fill: "#E7E0D6", width: 0 } });
  slide.shapes.add({ geometry: "rect", position: { left: x + 140, top: y + 4, width: w * value / max, height: 14 }, fill: color, line: { style: "solid", fill: color, width: 0 } });
  text(slide, value.toFixed(2), x + 150 + w, y - 1, 60, 22, { fontSize: 14, bold: true, color: C.ink });
}

const deckFacts = {
  title: "PhysGaussian: Physics-Integrated 3D Gaussians for Generative Dynamics",
  pdf: "raw/papers/Physics-Integrated 3D Gaussians for Generative Dynamics.pdf",
  arxiv: "arXiv:2311.12198v3, 2024-04-15",
};

async function build() {
  await ensureDirs();
  const presentation = Presentation.create({ slideSize: { width: W, height: H } });

  const slides = [];
  function add() {
    const s = presentation.slides.add();
    bg(s);
    slides.push(s);
    return s;
  }

  let s = add();
  await addImage(s, img.p1, { left: 690, top: 58, width: 480, height: 560 }, "PhysGaussian paper first page", "cover");
  text(s, "PHYSICS + 3D GAUSSIANS", 64, 58, 500, 26, { fontSize: 13, bold: true, color: C.green });
  text(s, "PhysGaussian", 64, 116, 540, 72, { fontSize: 60, bold: true, typeface: "Aptos Display" });
  text(s, "3DGS를 물리 시뮬레이션 particle로 재해석하면 무엇이 달라지는가", 68, 204, 560, 112, { fontSize: 28, bold: true, color: C.ink });
  text(s, "수업 발표용 논문 리뷰 · 25-30분\nTianyi Xie et al., arXiv:2311.12198v3", 68, 548, 560, 52, { fontSize: 18, color: C.muted });
  footer(s, 1, "Paper: PhysGaussian, arXiv:2311.12198v3");
  note(s, [
    "오늘 발표의 핵심 질문은 '보이는 3D Gaussian을 그대로 물리 particle로 쓸 수 있는가'입니다.",
    "PhysGaussian은 별도 mesh나 cage를 만들지 않고, 3DGS primitive와 MPM simulation particle을 통일하려는 논문입니다.",
    "발표는 배경, 핵심 수식, 실험, 한계 순서로 진행하겠습니다.",
    "수업 발표이므로 수식은 기호보다 직관을 먼저 잡고 가겠습니다.",
  ]);

  s = add();
  title(s, "PROBLEM", "기존 파이프라인은 '보이는 것'과 '시뮬레이션하는 것'이 갈라진다.", "렌더링 표현과 물리 표현 사이의 변환이 불일치와 준비 비용을 만든다.");
  flow(s, ["capture / NeRF / 3DGS", "mesh extraction", "tetrahedralization", "physics simulation", "rendering"], 84, 278, 1100, 112, [C.softBlue, C.softRust, C.softRust, C.softGreen, C.softBlue]);
  bulletList(s, [
    "문제 1: simulation-ready geometry를 만들기 위해 meshing, cage, embedding이 필요하다.",
    "문제 2: proxy mesh와 최종 렌더링 geometry 사이에 해상도와 위치 mismatch가 생긴다.",
    "문제 3: static reconstruction은 잘해도, 새로운 물리 motion을 만들기는 어렵다.",
  ], 94, 454, 1040, 48);
  footer(s, 2, "p.1 Introduction");
  note(s, [
    "논문은 전통적인 물리 기반 그래픽스 파이프라인을 문제로 잡습니다.",
    "보이는 geometry를 곧바로 시뮬레이션하지 못하고, 중간에 mesh나 cage를 만들어야 합니다.",
    "이 변환 과정은 번거롭고, 렌더링 결과와 물리 상태가 어긋날 수 있습니다.",
    "PhysGaussian의 목표는 이 중간 표현을 없애자는 것입니다.",
  ]);

  s = add();
  title(s, "BACKGROUND", "3DGS는 빠르고 조작 가능한 explicit scene representation이다.", "각 Gaussian은 위치, opacity, covariance, SH color를 가진다.");
  await addImage(s, img.p3, { left: 706, top: 232, width: 448, height: 330 }, "Method overview page including 3DGS equation");
  box(s, 86, 244, 520, 86, C.white);
  text(s, "{x_p, σ_p, A_p, C_p}", 110, 264, 460, 34, { fontSize: 31, bold: true, color: C.blue, alignment: "center" });
  text(s, "center · opacity · covariance · spherical harmonics", 120, 306, 450, 20, { fontSize: 14, color: C.muted, alignment: "center" });
  bulletList(s, [
    "3D Gaussian을 image plane에 2D Gaussian으로 project한다.",
    "depth order에 따라 alpha compositing으로 pixel color를 계산한다.",
    "implicit MLP보다 직접 조작하기 쉬운 explicit primitive 집합이다.",
  ], 96, 382, 550, 46, { dot: C.blue, fontSize: 19 });
  footer(s, 3, "p.3 Sec. 3.1, Eq. 1");
  note(s, [
    "3DGS는 scene을 많은 Gaussian ellipsoid의 집합으로 나타냅니다.",
    "각 primitive는 위치, 불투명도, covariance, 그리고 view-dependent color인 SH coefficient를 가집니다.",
    "렌더링은 ray marching이 아니라 splatting과 alpha compositing에 가깝습니다.",
    "이 explicit한 성격 때문에 논문은 '그럼 이 primitive를 직접 물리적으로 움직이면 되지 않을까'라고 갑니다.",
  ]);

  s = add();
  title(s, "BACKGROUND", "MPM은 particle과 grid를 오가며 큰 변형과 다양한 물성을 다룬다.", "PhysGaussian은 Gaussian을 MPM material particle처럼 취급한다.");
  flow(s, ["particle state", "particle → grid", "grid momentum update", "grid → particle", "new Gaussian state"], 72, 270, 1136, 106, [C.softBlue, C.white, C.softGreen, C.white, C.softBlue]);
  bulletList(s, [
    "Particle은 position, velocity, deformation gradient, stress를 들고 간다.",
    "Grid는 충돌과 momentum update를 안정적으로 처리한다.",
    "Elastic, plastic, granular, viscoplastic material을 같은 framework 안에서 다룰 수 있다.",
  ], 104, 442, 990, 48, { dot: C.green, fontSize: 19 });
  footer(s, 4, "p.2-p.4 MPM motivation and Sec. 3.2-3.3");
  note(s, [
    "MPM은 물질을 particle로 들고 있다가 계산할 때 grid로 옮겨 momentum을 업데이트합니다.",
    "다시 particle로 상태를 가져오면서 position과 deformation gradient를 갱신합니다.",
    "장점은 큰 변형, 충돌, granular material 같은 복잡한 현상에 강하다는 점입니다.",
    "PhysGaussian은 이 particle 자리에 3D Gaussian을 놓습니다.",
  ]);

  s = add();
  title(s, "CORE IDEA", "핵심은 WS2: What You See Is What You Simulate.", "렌더링 primitive와 시뮬레이션 primitive를 같은 3D Gaussian kernel로 묶는다.");
  await addImage(s, img.p1, { left: 86, top: 236, width: 470, height: 330 }, "Figure 1 WS2 principle");
  box(s, 650, 252, 430, 96, C.softGreen, C.green);
  text(s, "What You See", 680, 278, 370, 28, { fontSize: 26, bold: true, color: C.green, alignment: "center" });
  text(s, "3DGS 렌더링 primitive", 690, 314, 350, 22, { fontSize: 17, color: C.ink, alignment: "center" });
  box(s, 650, 424, 430, 96, C.softBlue, C.blue);
  text(s, "What You Simulate", 680, 450, 370, 28, { fontSize: 26, bold: true, color: C.blue, alignment: "center" });
  text(s, "MPM continuum particle", 690, 486, 350, 22, { fontSize: 17, color: C.ink, alignment: "center" });
  s.shapes.add({ geometry: "line", position: { left: 864, top: 356, width: 0, height: 60 }, fill: "none", line: { style: "solid", fill: C.rust, width: 4 } });
  text(s, "same Gaussian kernel", 750, 374, 230, 28, { fontSize: 19, bold: true, color: C.rust, alignment: "center" });
  footer(s, 5, "p.1 Fig. 1, p.3 Fig. 2");
  note(s, [
    "WS2는 이 논문의 철학을 한 문장으로 압축합니다.",
    "렌더링에 쓰는 primitive와 물리 시뮬레이션에 쓰는 primitive를 분리하지 않습니다.",
    "따라서 mesh extraction이나 tetrahedralization 없이, 같은 Gaussian identity를 계속 추적합니다.",
    "다만 이것이 곧 물리적으로 완벽한 mass distribution이라는 뜻은 아닙니다. 그 한계는 뒤에서 보겠습니다.",
  ]);

  s = add();
  title(s, "PIPELINE", "PhysGaussian은 reconstruction → physics integration → splatting rendering으로 이어진다.", "optional step은 skinny Gaussian 억제와 내부 particle filling이다.");
  await addImage(s, img.p3, { left: 70, top: 238, width: 610, height: 372 }, "Figure 2 method overview");
  bulletList(s, [
    "Input image와 camera로 static 3DGS를 먼저 학습한다.",
    "Gaussian ellipsoid를 continuum discretization으로 보고 MPM을 수행한다.",
    "변형된 Gaussian을 기존 splatting renderer에 다시 넣는다.",
  ], 726, 278, 420, 62, { dot: C.rust, fontSize: 19 });
  footer(s, 6, "p.3 Fig. 2 and Method Overview");
  note(s, [
    "전체 pipeline은 먼저 static scene을 3DGS로 reconstruction하는 것에서 시작합니다.",
    "그 후 Gaussian ellipsoid를 continuum particle로 보고 물리 상태를 붙입니다.",
    "MPM이 위치와 deformation gradient를 갱신하면, 그 결과를 다시 Gaussian rendering에 사용합니다.",
    "optional하게 anisotropic loss와 internal filling이 들어가는데, 이 둘은 robustness를 위한 보정입니다.",
  ]);

  s = add();
  title(s, "KINEMATICS", "center만 움직이면 부족하다: ellipsoid의 stretch와 shear도 바뀌어야 한다.", "PhysGaussian의 핵심 수식은 deformation gradient가 covariance를 갱신한다는 점이다.");
  box(s, 92, 256, 500, 142, C.white);
  text(s, "x_p(t) = φ(X_p, t)", 132, 282, 420, 42, { fontSize: 32, bold: true, color: C.blue, alignment: "center" });
  text(s, "a_p(t) = F_p(t) A_p F_p(t)^T", 108, 334, 470, 44, { fontSize: 30, bold: true, color: C.rust, alignment: "center" });
  await addImage(s, img.p4, { left: 678, top: 236, width: 460, height: 330 }, "Page 4 Gaussian deformation equations");
  bulletList(s, [
    "F는 local deformation의 1차 정보: 회전, 늘어남, shear를 담는다.",
    "A는 material-space covariance, a는 deformed world-space covariance다.",
    "Gaussian 내부 deformation을 local affine으로 근사하면 Gaussian 형태가 유지된다.",
  ], 104, 450, 990, 48, { dot: C.rust, fontSize: 18 });
  footer(s, 7, "p.4 Sec. 3.4, Eq. 5-8");
  note(s, [
    "이 슬라이드가 발표의 수식 중심입니다.",
    "x만 움직이면 Gaussian의 중심은 따라가지만, local stretch나 shear는 표현하지 못합니다.",
    "deformation gradient F는 작은 주변 영역이 어떻게 늘어나고 회전하고 찌그러지는지를 나타냅니다.",
    "그래서 covariance를 F A F transpose로 바꾸면 ellipsoid shape 자체가 물리 변형을 따라갑니다.",
  ]);

  s = add();
  title(s, "APPEARANCE", "view-dependent color도 물체 기준으로 같이 회전해야 한다.", "SH orientation은 deformation gradient의 polar decomposition에서 얻은 rotation을 사용한다.");
  box(s, 96, 260, 440, 120, C.softBlue, C.blue);
  text(s, "F_p = R_p S_p", 134, 286, 360, 38, { fontSize: 34, bold: true, color: C.blue, alignment: "center" });
  text(s, "fᵗ(d) = f⁰(Rᵀ d)", 134, 332, 360, 36, { fontSize: 30, bold: true, color: C.blue, alignment: "center" });
  flow(s, ["world view direction", "inverse local rotation", "material-space SH lookup"], 610, 274, 520, 92, [C.white, C.softRust, C.softGreen]);
  bulletList(s, [
    "Gaussian geometry만 변형하면 specular/view-dependent appearance가 어색해질 수 있다.",
    "F에서 rotation R을 분리하고, view direction을 물체 기준으로 되돌려 SH를 평가한다.",
    "한계: shadow evolution이나 복잡한 lighting 변화까지 해결하는 것은 아니다.",
  ], 112, 450, 1010, 46, { dot: C.blue, fontSize: 18 });
  footer(s, 8, "p.5 Sec. 3.5, Eq. 9");
  note(s, [
    "3DGS는 spherical harmonics로 view-dependent color를 저장합니다.",
    "물체가 회전했는데 SH basis가 그대로 있으면, 물체 기준의 반짝임이나 색 변화가 맞지 않을 수 있습니다.",
    "논문은 deformation gradient를 polar decomposition해서 rotation R을 얻고, view direction을 R transpose로 되돌립니다.",
    "이것은 appearance consistency를 위한 보정이지만, 그림자나 간접광의 변화까지 모델링하지는 않습니다.",
  ]);

  s = add();
  title(s, "UPDATE FORM", "total F를 들고 가지 않아도 covariance를 incremental하게 업데이트할 수 있다.", "velocity gradient 기반 rate form은 updated Lagrangian 형태의 재료 모델과 맞는다.");
  box(s, 96, 278, 720, 112, C.white);
  text(s, "aₚⁿ⁺¹ = aₚⁿ + Δt(∇vₚ aₚⁿ + aₚⁿ ∇vₚᵀ)", 124, 316, 660, 40, { fontSize: 29, bold: true, color: C.rust, alignment: "center" });
  bulletList(s, [
    "∇v는 현재 velocity field의 local gradient다.",
    "covariance가 시간에 따라 어떻게 변해야 하는지를 rate로 적는다.",
    "구현 관점에서는 MPM update가 만든 local motion 정보를 Gaussian shape에 전달한다.",
  ], 124, 450, 900, 48, { dot: C.rust, fontSize: 19 });
  await addImage(s, img.p5, { left: 880, top: 250, width: 260, height: 330 }, "Page 5 incremental update and filling");
  footer(s, 9, "p.5 Sec. 3.6, Eq. 10");
  note(s, [
    "앞에서는 total deformation gradient F로 설명했지만, 논문은 incremental update도 제시합니다.",
    "velocity gradient를 이용해 covariance의 시간 미분을 적고, forward Euler처럼 업데이트합니다.",
    "직관적으로는 지금 주변 velocity field가 ellipsoid를 어떻게 당기고 비트는지 반영하는 것입니다.",
    "이 슬라이드는 수식 자체보다 'MPM에서 나온 local motion이 Gaussian shape로 들어간다'는 연결을 강조하면 됩니다.",
  ]);

  s = add();
  title(s, "INTERNAL FILLING", "표면만 있는 3DGS는 volumetric object simulation에 부족하다.", "opacity field로 내부 후보 cell을 찾고 추가 particle을 채운다.");
  box(s, 86, 260, 520, 100, C.white);
  text(s, "d(x)=Σ σₚ exp(-½(x-xₚ)ᵀAₚ⁻¹(x-xₚ))", 106, 296, 480, 34, { fontSize: 22, bold: true, color: C.green, alignment: "center" });
  flow(s, ["opacity field", "threshold crossing", "ray test", "new internal particles"], 660, 270, 490, 90, [C.softGreen, C.white, C.white, C.softBlue]);
  bulletList(s, [
    "3DGS는 관측 가능한 surface appearance에 치우쳐 내부가 비어 있을 수 있다.",
    "내부가 비면 중력이나 압축에서 hollow shell처럼 붕괴할 수 있다.",
    "nearest Gaussian에서 opacity/SH를 상속하지만, 실제 내부 구조를 보장하지는 않는다.",
  ], 110, 450, 1000, 48, { dot: C.green, fontSize: 18 });
  footer(s, 10, "p.5 Sec. 3.7, Eq. 11; p.8 Fig. 6");
  note(s, [
    "PhysGaussian이 surface Gaussian만 그대로 쓰면 volumetric simulation에는 문제가 생깁니다.",
    "그래서 opacity field를 만들고 threshold와 ray test로 내부 cell을 찾아 particle을 추가합니다.",
    "이 과정은 물리적으로 hidden density를 정확히 복원한다기보다는, simulation support를 채우는 heuristic에 가깝습니다.",
    "발표에서는 장점과 함께 thin/open geometry에서 실패 가능성이 있다는 점을 같이 말하면 좋습니다.",
  ]);

  s = add();
  title(s, "REGULARIZATION", "너무 가느다란 Gaussian은 deformation 후 burr artifact를 만든다.", "anisotropy loss는 dynamic robustness를 위한 reconstruction-time 보정이다.");
  await addImage(s, img.p8, { left: 712, top: 230, width: 450, height: 340 }, "Table and qualitative figures page 8");
  box(s, 94, 262, 500, 94, C.softRust, C.rust);
  text(s, "penalize max(Sₚ) / min(Sₚ) > r", 122, 292, 445, 32, { fontSize: 25, bold: true, color: C.rust, alignment: "center" });
  bulletList(s, [
    "static rendering에서는 anisotropy가 표현 효율을 높일 수 있다.",
    "하지만 simulation particle로 쓰면 skinny ellipsoid가 큰 변형에서 surface 밖으로 튀어나올 수 있다.",
    "논문은 optional loss로 over-skinny kernel을 억제한다.",
  ], 112, 430, 520, 54, { dot: C.rust, fontSize: 18 });
  footer(s, 11, "p.5 Sec. 3.8, Eq. 12; p.8 Fig. 8");
  note(s, [
    "3DGS에서 anisotropic Gaussian은 나쁜 것이 아닙니다. 오히려 표현 효율이 좋습니다.",
    "문제는 이것을 물리 particle로도 쓸 때 너무 가느다란 ellipsoid가 deformation 후 artifact를 만들 수 있다는 점입니다.",
    "그래서 논문은 major/minor scale ratio를 제한하는 optional anisotropy regularizer를 둡니다.",
    "여기서도 핵심은 rendering quality만이 아니라 downstream dynamics robustness를 고려한다는 것입니다.",
  ]);

  s = add();
  title(s, "MATERIALS", "논문은 같은 Gaussian-MPM pipeline으로 여러 재료를 보여준다.", "elastic, metal plasticity, fracture, granular, viscoplastic paste, collision examples.");
  await addImage(s, img.p6, { left: 70, top: 230, width: 650, height: 380 }, "Figure 3 material versatility");
  const mats = [
    ["elastic", C.softGreen],
    ["plastic metal", C.softRust],
    ["fracture", C.white],
    ["granular", "#F5E8C8"],
    ["viscoplastic", C.softBlue],
    ["collision", "#ECE7DF"],
  ];
  mats.forEach(([m, fill], i) => {
    const x = 760 + (i % 2) * 190;
    const y = 258 + Math.floor(i / 2) * 86;
    box(s, x, y, 168, 58, fill, C.line);
    text(s, m, x + 12, y + 18, 144, 20, { fontSize: 17, bold: true, alignment: "center" });
  });
  footer(s, 12, "p.6-p.7 Fig. 3 and material examples");
  note(s, [
    "Fig. 3은 논문의 demo slide로 쓰기 좋습니다.",
    "저자들은 Gaussian representation은 유지하고, constitutive model과 material parameter를 바꾸어 다양한 물성을 보여줍니다.",
    "여기서 중요한 점은 ground-truth dynamics 비교가 아니라 generative dynamics 가능성을 보여주는 qualitative evidence라는 것입니다.",
    "수업 청중에게는 '하나의 renderer + 하나의 MPM framework로 여러 재료를 만든다'로 설명하면 충분합니다.",
  ]);

  s = add();
  title(s, "BENCHMARK", "lattice deformation benchmark에서는 PhysGaussian이 모든 PSNR case에서 최고값을 보고한다.", "주요 비교는 NeRF-Editing, Deforming-NeRF, PAC-NeRF다.");
  const data = [
    ["Wolf bend", 26.96],
    ["Wolf twist", 26.46],
    ["Stool bend", 31.15],
    ["Stool twist", 26.15],
    ["Plant bend", 25.81],
    ["Plant twist", 23.87],
  ];
  data.forEach((d, i) => bar(s, d[0], d[1], 32, 100, 260 + i * 48, 430, i === 2 ? C.rust : C.blue));
  await addImage(s, img.p7, { left: 720, top: 245, width: 440, height: 330 }, "Figure 4 benchmark visual comparison");
  text(s, "PSNR of Ours", 100, 232, 300, 24, { fontSize: 16, bold: true, color: C.muted });
  footer(s, 13, "p.7 Fig. 4; p.8 Table 1");
  note(s, [
    "정량 benchmark는 BlenderNeRF synthetic scene에 lattice deformation을 적용한 setup입니다.",
    "Table 1에서 PhysGaussian은 Wolf, Stool, Plant의 bend/twist 여섯 case 모두 최고 PSNR을 보고합니다.",
    "다만 이 benchmark는 실제 물리 ground truth라기보다 deformation 후 rendering fidelity 비교에 가깝습니다.",
    "그래서 숫자는 강점으로 말하되, 물리 정확도 검증으로 과장하지 않는 것이 좋습니다.",
  ]);

  s = add();
  title(s, "ABLATION", "first-order deformation을 빼면 Gaussian surface coverage와 appearance가 무너진다.", "Fixed covariance, rigid covariance, fixed harmonics는 각각 빠진 정보를 보여준다.");
  const cols = [
    ["Fixed Cov.", "center만 이동\nshape deformation 없음", C.softRust],
    ["Rigid Cov.", "rotation만 반영\nstretch/shear 없음", C.white],
    ["Fixed SH", "appearance basis 고정\nview consistency 약화", C.softBlue],
    ["Full", "F 기반 covariance\nR 기반 SH update", C.softGreen],
  ];
  cols.forEach(([head, body, fill], i) => {
    const x = 82 + i * 282;
    box(s, x, 270, 246, 162, fill, C.line);
    text(s, head, x + 18, 292, 210, 28, { fontSize: 22, bold: true, color: i === 3 ? C.green : C.ink, alignment: "center" });
    text(s, body, x + 24, 338, 198, 70, { fontSize: 17, color: C.ink, alignment: "center" });
  });
  bulletList(s, [
    "Ablation의 메시지: 단순 translation이나 rigid transform만으로는 non-rigid deformation의 local shape change가 부족하다.",
    "Full method의 이점은 PSNR margin보다 qualitative artifact에서 더 설득력 있게 보인다.",
  ], 104, 500, 1000, 50, { dot: C.blue, fontSize: 19 });
  footer(s, 14, "p.7-p.8 Fig. 5 and Table 1 ablation");
  note(s, [
    "Ablation은 이 논문의 설계 의도를 설명하기 좋습니다.",
    "Fixed covariance는 center만 움직이므로 Gaussian ellipsoid가 변형을 따라가지 못합니다.",
    "Rigid covariance는 회전만 반영하므로 늘어남이나 shear를 놓칩니다.",
    "Fixed harmonics는 geometry는 움직여도 view-dependent appearance가 물체와 같이 회전하지 않는 문제를 보여줍니다.",
  ]);

  s = add();
  title(s, "LIMITATIONS", "PhysGaussian은 '그럴듯한 물리 motion 생성'이지 완전한 inverse physics는 아니다.", "보이는 Gaussian을 물리량으로 해석할 때 여러 가정이 남는다.");
  const lims = [
    ["Mass / volume mapping", "opacity와 covariance가 실제 질량·밀도·부피를 보장하지 않는다."],
    ["Manual material parameters", "Young's modulus, Poisson ratio 등은 대부분 수동 설정이다."],
    ["Lighting and shadows", "SH orientation은 회전 보정이지만 shadow evolution은 고려하지 않는다."],
    ["Benchmark scope", "synthetic deformation 중심이라 실제 물리 ground truth 검증은 제한적이다."],
  ];
  lims.forEach(([h, b], i) => {
    const x = 86 + (i % 2) * 558;
    const y = 250 + Math.floor(i / 2) * 150;
    box(s, x, y, 500, 108, i % 2 === 0 ? C.white : "#F1EEE8", C.line);
    text(s, h, x + 24, y + 22, 440, 26, { fontSize: 21, bold: true, color: C.rust });
    text(s, b, x + 24, y + 56, 440, 40, { fontSize: 17, color: C.ink });
  });
  footer(s, 15, "p.8-p.9 Limitations and future work");
  note(s, [
    "비판적으로 보면 PhysGaussian은 inverse physics를 푼 논문은 아닙니다.",
    "static 3DGS에서 나온 Gaussian이 실제 mass distribution을 의미한다는 보장은 없습니다.",
    "material parameter도 자동 추정이 아니라 대부분 수동 설정입니다.",
    "따라서 발표 결론은 '물리적으로 정확한 모든 것을 해결했다'가 아니라 'rendering primitive와 simulation primitive를 통합하는 강한 설계 아이디어'로 잡는 것이 안전합니다.",
  ]);

  s = add();
  title(s, "TAKEAWAYS", "이 논문의 진짜 기여는 3DGS를 '움직이는 입자'가 아니라 '변형되는 continuum kernel'로 본 것이다.", "수업 토론은 표현 통합의 장점과 물리적 해석의 위험 사이에서 잡는다.");
  bulletList(s, [
    "Takeaway 1: WS2는 mesh/cage 없이 rendering과 simulation을 같은 primitive identity로 묶는다.",
    "Takeaway 2: deformation gradient가 covariance와 SH update로 들어가는 것이 기술적 핵심이다.",
    "Takeaway 3: internal filling과 anisotropy regularization은 3DGS를 물리 particle로 쓰기 위한 보정이다.",
    "Discussion: Gaussian의 opacity/covariance를 mass와 density로 해석하려면 무엇이 더 필요할까?",
  ], 110, 250, 1010, 68, { dot: C.green, fontSize: 21, h: 50 });
  footer(s, 16, "Presenter synthesis");
  note(s, [
    "마지막 본편 슬라이드입니다.",
    "이 논문의 기여를 한 문장으로 말하면, 3DGS primitive를 물리 시뮬레이션에서 변형되는 continuum kernel로 재해석했다는 것입니다.",
    "가장 중요한 수식은 covariance update이고, 가장 중요한 철학은 WS2입니다.",
    "질문으로는 '보이는 primitive가 실제 물리량을 대표할 수 있는가'를 던지면 수업 토론이 잘 열립니다.",
  ]);

  s = add();
  title(s, "APPENDIX", "30초, 2분, 5분 설명 버전", "리허설과 구두 답변용 압축 스크립트.");
  const scripts = [
    ["30초", "3DGS의 Gaussian을 렌더링 primitive로만 쓰지 않고, MPM의 material particle처럼 물리 상태를 붙여 움직인다. 핵심은 deformation gradient로 Gaussian covariance와 SH orientation을 갱신해, 중심만 이동하는 것보다 더 자연스러운 non-rigid motion을 만든다는 점이다."],
    ["2분", "PhysGaussian은 static multi-view image에서 3DGS를 학습한 뒤, 각 Gaussian을 continuum mechanics의 material particle로 본다. MPM이 particle 위치, 속도, deformation gradient를 업데이트하고, 이 F를 이용해 covariance를 F A F^T로 바꾼다. 그래서 Gaussian ellipsoid가 local stretch, shear, rotation을 반영한다. 같은 Gaussian을 다시 splatting renderer에 넣기 때문에 별도 mesh/cage 없이 'what you see is what you simulate'를 구현한다."],
    ["5분", "배경부터 pipeline, 핵심 수식, optional filling/regularizer, 실험과 한계를 순서대로 설명한다. 특히 이것은 자동 물성 추정이나 완전한 물리 검증 논문이라기보다, 3DGS와 physics simulation을 같은 explicit primitive 위에 얹는 representation 논문으로 읽는 것이 좋다."],
  ];
  scripts.forEach(([h, b], i) => {
    const y = 242 + i * 132;
    box(s, 90, y, 1080, 104, i === 0 ? C.softGreen : C.white, C.line);
    text(s, h, 118, y + 24, 110, 30, { fontSize: 24, bold: true, color: C.green });
    text(s, b, 240, y + 18, 880, 64, { fontSize: 16.5, color: C.ink });
  });
  footer(s, 17, "Appendix A");
  note(s, [
    "이 appendix는 발표자가 리허설할 때 쓰는 압축 스크립트입니다.",
    "시간이 부족하면 30초 버전을 결론 직전에 사용하면 됩니다.",
    "질문 답변에서는 2분 버전을 기준으로 조금씩 늘리면 됩니다.",
  ]);

  s = add();
  title(s, "APPENDIX", "기호표: 발표 중 헷갈리기 쉬운 변수", "수식 슬라이드 앞뒤에서 참고할 수 있는 cheat sheet.");
  const symbols = [
    ["x_p", "world-space Gaussian center"],
    ["X_p", "material-space particle position"],
    ["A_p", "initial/material covariance"],
    ["a_p(t)", "deformed covariance"],
    ["F_p", "deformation gradient"],
    ["R_p", "local rotation from polar decomposition"],
    ["σ_p", "opacity"],
    ["C_p", "spherical harmonic coefficients"],
  ];
  symbols.forEach(([k, v], i) => {
    const x = 110 + (i % 2) * 520;
    const y = 246 + Math.floor(i / 2) * 78;
    text(s, k, x, y, 110, 34, { fontSize: 25, bold: true, color: C.blue });
    text(s, v, x + 120, y + 4, 360, 28, { fontSize: 18, color: C.ink });
    slideLine(s, x, y + 48, 440);
  });
  footer(s, 18, "Appendix B");
  note(s, [
    "기호 질문이 나오면 이 슬라이드를 사용합니다.",
    "A와 a의 차이, X와 x의 차이가 가장 중요합니다.",
    "F는 deformation gradient이고 R은 그 안에서 분리한 rotation입니다.",
  ]);

  s = add();
  title(s, "APPENDIX", "예상 질문과 답변 방향", "수업 발표 후 나올 가능성이 큰 질문.");
  const qs = [
    ["Q1. 3DGS Gaussian이 진짜 mass인가?", "아니다. 렌더링 primitive를 simulation support로 재해석한 것이며, mass/density mapping은 한계다."],
    ["Q2. center만 움직이는 dynamic GS와 차이는?", "deformation gradient로 covariance와 SH orientation까지 갱신해 local stretch/shear/rotation을 반영한다."],
    ["Q3. internal filling은 정확한가?", "heuristic에 가깝다. opacity field와 ray test에 의존하며 thin/open geometry에서 취약할 수 있다."],
    ["Q4. material parameter는 어떻게 얻나?", "논문에서는 주로 수동 설정이다. video 기반 differentiable MPM 추정은 future work에 가깝다."],
    ["Q5. 실험이 물리 정확도를 증명하나?", "주로 rendering fidelity와 qualitative dynamics evidence다. 실제 물리 ground truth 검증은 제한적이다."],
  ];
  qs.forEach(([q, a], i) => {
    const y = 238 + i * 76;
    text(s, q, 92, y, 420, 28, { fontSize: 17, bold: true, color: C.rust });
    text(s, a, 530, y, 610, 44, { fontSize: 16, color: C.ink });
  });
  footer(s, 19, "Appendix C");
  note(s, [
    "Q&A 슬라이드는 appendix에 두고 발표 중에는 숨겨도 됩니다.",
    "핵심 답변 톤은 과장하지 않고, representation idea와 limitation을 분리하는 것입니다.",
    "물리 정확도와 자동 물성 추정 질문은 limitation으로 인정하는 편이 좋습니다.",
  ]);

  function slideLine(slide, x, y, w) {
    slide.shapes.add({ geometry: "line", position: { left: x, top: y, width: w, height: 0 }, fill: "none", line: { style: "solid", fill: C.faint, width: 1 } });
  }

  await writeSourceArtifacts();

  for (const [index, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    const png = await presentation.export({ slide, format: "png", scale: 1 });
    await fs.writeFile(path.join(PREVIEW_DIR, `${stem}.png`), new Uint8Array(await png.arrayBuffer()));
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(LAYOUT_DIR, `${stem}.layout.json`), await layout.text(), "utf8");
  }
  const montage = await presentation.export({ format: "webp", montage: true, scale: 1 });
  await fs.writeFile(path.join(PREVIEW_DIR, "contact-sheet.webp"), new Uint8Array(await montage.arrayBuffer()));
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL_PPTX);
  const stat = await fs.stat(FINAL_PPTX);
  await fs.writeFile(path.join(QA_DIR, "visual-qa.txt"), [
    "Visual QA summary",
    `- Rendered ${slides.length} slides to ${PREVIEW_DIR}.`,
    "- Reviewed layout by keeping each slide title, proof object, footer, and page marker in fixed positions.",
    "- Used source page screenshots only as evidence objects, not as full-slide bitmap replacements.",
    "- Exported editable PPTX through @oai/artifact-tool PresentationFile.exportPptx.",
    `- Final file size: ${stat.size} bytes.`,
    "- Caveat: final human visual review should still be done in PowerPoint before class delivery.",
  ].join("\n"), "utf8");

  await fs.writeFile(path.join(OUTPUT_DIR, "build-info.txt"), [
    `Final PPTX: ${FINAL_PPTX}`,
    `Scratch workspace: ${WORKSPACE}`,
    `Skill dir: ${SKILL_DIR}`,
    `Slide count: ${slides.length}`,
    `Source PDF: ${deckFacts.pdf}`,
  ].join("\n"), "utf8");

  console.log(JSON.stringify({ FINAL_PPTX, OUTPUT_DIR, WORKSPACE, slides: slides.length, bytes: stat.size }, null, 2));
}

async function writeSourceArtifacts() {
  const sourceNotes = [
    "PhysGaussian presentation source notes",
    "",
    `Paper: ${deckFacts.title}`,
    `Local source: ${deckFacts.pdf}`,
    `Version/date: ${deckFacts.arxiv}`,
    "",
    "Slide evidence anchors:",
    "- Slides 1,5: p.1 Fig. 1 and abstract for WS2 principle.",
    "- Slides 2,6: p.1-p.3 introduction and Fig. 2 for pipeline mismatch and method overview.",
    "- Slides 3: p.3 Sec. 3.1 and Eq. 1 for 3DGS representation.",
    "- Slide 4: p.2-p.4 MPM motivation and continuum mechanics setup.",
    "- Slides 7-9: p.4-p.5 Eq. 5-10 for deformation-gradient covariance update and SH rotation.",
    "- Slide 10: p.5 Eq. 11 and p.8 Fig. 6 for internal filling.",
    "- Slide 11: p.5 Eq. 12 and p.8 Fig. 8 for anisotropy regularization.",
    "- Slide 12: p.6-p.7 Fig. 3 for material versatility.",
    "- Slides 13-14: p.7-p.8 Fig. 4, Fig. 5, and Table 1 for benchmark and ablation.",
    "- Slide 15: p.8-p.9 stated limitations and inferred research limitations.",
  ].join("\n");
  await fs.writeFile(path.join(TMP_DIR, "source-notes.txt"), sourceNotes, "utf8");

  const plan = [
    "Create-mode slide plan",
    "",
    "Audience: Korean class presentation, partially familiar with 3DGS and physics simulation.",
    "Timing: 25-30 minutes.",
    "Style: warm paper background, technical ink, green/blue/rust accents; Aptos Display + Aptos.",
    "Slide count: 16 main-ish slides including takeaways + 3 appendix slides.",
    "Object policy: editable text and shapes; paper figures embedded as evidence images with page anchors.",
  ].join("\n");
  await fs.writeFile(path.join(TMP_DIR, "slide-plan.txt"), plan, "utf8");

  const summary = [
    "# PhysGaussian 1페이지 핵심 요약",
    "",
    "## 한 문장",
    "PhysGaussian은 3D Gaussian Splatting의 Gaussian kernel을 렌더링 primitive로만 보지 않고, MPM 기반 continuum mechanics의 material particle로도 사용해 mesh/cage 없이 physics-based novel motion을 생성하는 방법이다.",
    "",
    "## 핵심 아이디어",
    "- WS2: What You See Is What You Simulate. 렌더링과 시뮬레이션이 같은 Gaussian primitive identity를 공유한다.",
    "- Gaussian center만 움직이지 않고, deformation gradient `F`로 covariance를 `a = F A F^T`로 갱신한다.",
    "- polar decomposition에서 얻은 local rotation으로 SH orientation도 같이 보정한다.",
    "- internal filling은 surface-biased 3DGS를 volumetric simulation에 맞추기 위한 optional 보정이다.",
    "- anisotropy regularizer는 skinny Gaussian이 큰 변형에서 만드는 artifact를 줄이는 optional reconstruction loss다.",
    "",
    "## 강점",
    "- 별도 mesh extraction, tetrahedralization, cage embedding 없이 rendering과 simulation을 연결한다.",
    "- MPM을 사용해 elastic, plastic, granular, viscoplastic 등 여러 material demo를 보여준다.",
    "- benchmark와 ablation에서 deformation-gradient 기반 covariance/SH update의 필요성을 제시한다.",
    "",
    "## 한계",
    "- 3DGS Gaussian의 opacity/covariance가 실제 mass, density, volume을 보장하지 않는다.",
    "- material parameter는 대부분 manually set된다.",
    "- shadow evolution과 복잡한 lighting 변화는 다루지 않는다.",
    "- 정량 benchmark는 실제 물리 ground truth라기보다 deformation/rendering fidelity 평가에 가깝다.",
  ].join("\n");
  await fs.writeFile(path.join(OUTPUT_DIR, "physgaussian-one-page-summary.md"), summary, "utf8");

  const qa = [
    "# PhysGaussian 예상 Q&A",
    "",
    "1. Q: 3DGS Gaussian이 실제 질량 particle이라는 뜻인가?",
    "   A: 아니다. 논문은 렌더링 primitive를 simulation support로 재해석한다. 실제 mass/density mapping은 명시적으로 보장되지 않으며 중요한 한계다.",
    "",
    "2. Q: 기존 dynamic 3DGS처럼 center만 움직이면 왜 부족한가?",
    "   A: center translation은 local stretch, shear, rotation을 담지 못한다. PhysGaussian은 deformation gradient로 covariance를 갱신해 ellipsoid shape 자체를 변형한다.",
    "",
    "3. Q: `F A F^T`는 왜 covariance update인가?",
    "   A: local affine transform `x = F X`를 random variable이나 Gaussian support에 적용하면 covariance가 선형변환 규칙에 따라 `F A F^T`가 된다.",
    "",
    "4. Q: SH rotation은 왜 필요한가?",
    "   A: object가 회전했는데 view-dependent color basis가 고정되면 appearance가 물체와 함께 회전하지 않는다. 그래서 `F=RS`에서 얻은 `R`로 view direction을 보정한다.",
    "",
    "5. Q: internal filling은 정확한 내부 구조를 복원하나?",
    "   A: 그렇지 않다. opacity field와 ray test에 기반한 heuristic이며, thin/open/noisy geometry에서는 실패할 수 있다.",
    "",
    "6. Q: material parameter는 자동으로 추정하나?",
    "   A: 논문에서는 주로 수동 설정한다. differentiable MPM을 통한 video 기반 추정은 future work 성격이다.",
    "",
    "7. Q: 실험은 물리 정확도를 증명하나?",
    "   A: 제한적이다. material demo는 qualitative이고, Table 1은 synthetic lattice deformation의 rendering fidelity 비교에 가깝다.",
    "",
    "8. Q: 가장 중요한 contribution은 무엇인가?",
    "   A: 3DGS와 MPM을 같은 Gaussian primitive 위에 통합하고, deformation gradient를 covariance/SH update로 연결한 representation-level 설계다.",
    "",
    "9. Q: 이 논문의 후속 연구 방향은?",
    "   A: 물성 자동 추정, mass/volume-aware Gaussian reconstruction, learned internal filling, observed dynamic GS와 physics prior의 결합이 자연스럽다.",
    "",
    "10. Q: 발표에서 제일 기억해야 할 수식은?",
    "    A: `a_p(t)=F_p(t)A_pF_p(t)^T`. Gaussian이 단순히 이동하는 점이 아니라 deformation을 담는 ellipsoid라는 메시지를 담는다.",
  ].join("\n");
  await fs.writeFile(path.join(OUTPUT_DIR, "physgaussian-qa.md"), qa, "utf8");

  const presenterNotes = [
    "# PhysGaussian 발표자 노트",
    "",
    "PPTX 내부 speaker notes에도 각 슬라이드별 3-5문장이 포함되어 있다.",
    "권장 리허설 시간 배분: 배경 6분, 핵심 방법 12분, 실험 5분, 한계와 토론 5분.",
    "",
    "핵심 말하기 원칙:",
    "- 논문 claim과 발표자 해석을 구분한다.",
    "- 수식은 기호보다 '무엇이 움직이고 무엇이 변형되는지'를 먼저 설명한다.",
    "- 실험 결과는 강점으로 설명하되, 물리 정확도 검증으로 과장하지 않는다.",
    "- 마지막 질문은 '보이는 Gaussian을 물리량으로 믿으려면 무엇이 더 필요한가?'로 마무리한다.",
  ].join("\n");
  await fs.writeFile(path.join(OUTPUT_DIR, "physgaussian-presenter-notes.md"), presenterNotes, "utf8");
}

await build();
