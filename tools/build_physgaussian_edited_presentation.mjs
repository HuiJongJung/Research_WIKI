import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { Presentation, PresentationFile } from "file:///C:/Users/jinsw712/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const ROOT = "C:/Users/jinsw712/Desktop/Files/논문 발표/PhysGaussian 발표";
const SOURCE_PPTX = path.join(ROOT, "physgaussian-simple-class-presentation.pptx");
const FINAL_PPTX = path.join(ROOT, "physgaussian-simple-class-presentation-edited.pptx");
const FIG_DIR = path.join(ROOT, "figure");
const WORKSPACE = path.join(os.tmpdir(), "codex-presentations", "manual-physgaussian", "edited-with-figures");
const TMP_DIR = path.join(WORKSPACE, "tmp");
const PREVIEW_DIR = path.join(TMP_DIR, "preview");
const LAYOUT_DIR = path.join(TMP_DIR, "layout");
const QA_DIR = path.join(TMP_DIR, "qa");

const W = 1280;
const H = 720;
const FONT = "Malgun Gothic";
const BLACK = "#000000";
const DARK = "#252525";
const MID = "#666666";
const LINE = "#D0D0D0";
const SOFT = "#F2F2F2";
const SOFT2 = "#F7F7F7";
const BLUE = "#2F5F9F";
const GREEN = "#2D6A4F";
const ORANGE = "#B96B2C";
const WHITE = "#FFFFFF";

const figures = {
  primitive: path.join(FIG_DIR, "3dgs_primitive.png"),
  sh: path.join(FIG_DIR, "SH.png"),
  ws2: path.join(FIG_DIR, "WS2.png"),
  overview: path.join(FIG_DIR, "overview.png"),
  orientation: path.join(FIG_DIR, "orientation_sh.png"),
  filling: path.join(FIG_DIR, "internal_filling.png"),
};

async function ensureDirs() {
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(LAYOUT_DIR, { recursive: true });
  await fs.mkdir(QA_DIR, { recursive: true });
}

async function imageBytes(file) {
  const bytes = await fs.readFile(file);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function addText(slide, value, left, top, width, height, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left, top, width, height },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = value;
  shape.text.style = {
    typeface: style.typeface ?? FONT,
    fontSize: style.fontSize ?? 22,
    bold: style.bold ?? false,
    color: style.color ?? BLACK,
    alignment: style.alignment ?? "left",
  };
  return shape;
}

function addTitle(slide, title, num) {
  addText(slide, title, 72, 54, 1030, 58, { fontSize: 36, bold: true });
  slide.shapes.add({
    geometry: "line",
    position: { left: 72, top: 128, width: 1080, height: 0 },
    fill: "none",
    line: { style: "solid", fill: "#E0E0E0", width: 1 },
  });
  addText(slide, String(num).padStart(2, "0"), 1168, 58, 42, 18, {
    fontSize: 11,
    color: MID,
    alignment: "right",
  });
}

function box(slide, left, top, width, height, fill = SOFT, line = LINE) {
  return slide.shapes.add({
    geometry: "roundRect",
    position: { left, top, width, height },
    fill,
    line: { style: "solid", fill: line, width: 1 },
    borderRadius: 8,
  });
}

function bullet(slide, text, left, top, width, style = {}) {
  addText(slide, "•", left, top - 2, 26, 28, {
    fontSize: style.fontSize ?? 21,
    bold: true,
    color: style.color ?? BLACK,
  });
  addText(slide, text, left + 32, top, width - 32, style.height ?? 42, {
    fontSize: style.fontSize ?? 21,
    color: style.color ?? BLACK,
  });
}

function bullets(slide, list, left, top, width, gap = 54, fontSize = 21) {
  list.forEach((item, i) => bullet(slide, item, left, top + i * gap, width, {
    fontSize,
    height: Math.max(42, gap - 6),
  }));
}

async function addImage(slide, file, left, top, width, height, alt, fit = "contain") {
  slide.images.add({
    blob: await imageBytes(file),
    contentType: file.toLowerCase().endsWith(".jpg") || file.toLowerCase().endsWith(".jpeg") ? "image/jpeg" : "image/png",
    alt,
    fit,
    position: { left, top, width, height },
  });
}

function createSlide(presentation, title, num) {
  const slide = presentation.slides.add();
  slide.background.fill = WHITE;
  if (title) addTitle(slide, title, num);
  return slide;
}

function miniLabel(slide, label, left, top, width) {
  addText(slide, label, left, top, width, 24, {
    fontSize: 16,
    bold: true,
    color: DARK,
    alignment: "center",
  });
}

function drawMesh(slide, left, top, width, height, label, kind) {
  box(slide, left, top, width, height, WHITE, LINE);
  miniLabel(slide, label, left, top + height - 34, width);
  const cx = left + width / 2;
  const cy = top + height / 2 - 12;
  if (kind === "mesh") {
    for (let i = 0; i < 5; i++) {
      slide.shapes.add({
        geometry: "line",
        position: { left: left + 42, top: top + 42 + i * 28, width: width - 84, height: 0 },
        fill: "none",
        line: { style: "solid", fill: MID, width: 1 },
      });
      slide.shapes.add({
        geometry: "line",
        position: { left: left + 50 + i * 34, top: top + 34, width: 0, height: height - 86 },
        fill: "none",
        line: { style: "solid", fill: MID, width: 1 },
      });
    }
    slide.shapes.add({ geometry: "ellipse", position: { left: cx - 42, top: cy - 32, width: 84, height: 64 }, fill: "#DDE7F5", line: { style: "solid", fill: BLUE, width: 2 } });
  } else if (kind === "cage") {
    slide.shapes.add({ geometry: "rect", position: { left: cx - 58, top: cy - 50, width: 116, height: 100 }, fill: "none", line: { style: "dash", fill: ORANGE, width: 2 } });
    slide.shapes.add({ geometry: "ellipse", position: { left: cx - 38, top: cy - 28, width: 76, height: 56 }, fill: "#F4E4D7", line: { style: "solid", fill: ORANGE, width: 2 } });
    for (const [x, y] of [[-58, -50], [58, -50], [-58, 50], [58, 50]]) {
      slide.shapes.add({ geometry: "ellipse", position: { left: cx + x - 5, top: cy + y - 5, width: 10, height: 10 }, fill: ORANGE, line: { style: "solid", fill: ORANGE, width: 0 } });
    }
  } else {
    const points = [
      [cx, cy - 56], [cx - 58, cy + 46], [cx + 58, cy + 46], [cx, cy + 14],
    ];
    const lines = [[0, 1], [0, 2], [1, 2], [0, 3], [1, 3], [2, 3]];
    for (const [a, b] of lines) {
      const [x1, y1] = points[a];
      const [x2, y2] = points[b];
      slide.shapes.add({ geometry: "line", position: { left: x1, top: y1, width: x2 - x1, height: y2 - y1 }, fill: "none", line: { style: "solid", fill: GREEN, width: 2 } });
    }
    for (const [x, y] of points) {
      slide.shapes.add({ geometry: "ellipse", position: { left: x - 5, top: y - 5, width: 10, height: 10 }, fill: GREEN, line: { style: "solid", fill: GREEN, width: 0 } });
    }
  }
}

function drawMpm(slide, left, top, width, height) {
  box(slide, left, top, width, height, WHITE, LINE);
  const gx = left + 58;
  const gy = top + 46;
  const gw = width - 116;
  const gh = height - 92;
  for (let i = 0; i <= 5; i++) {
    slide.shapes.add({ geometry: "line", position: { left: gx + i * gw / 5, top: gy, width: 0, height: gh }, fill: "none", line: { style: "solid", fill: "#D8D8D8", width: 1 } });
    slide.shapes.add({ geometry: "line", position: { left: gx, top: gy + i * gh / 5, width: gw, height: 0 }, fill: "none", line: { style: "solid", fill: "#D8D8D8", width: 1 } });
  }
  const particles = [[0.18, 0.22], [0.33, 0.56], [0.46, 0.32], [0.62, 0.68], [0.73, 0.42], [0.84, 0.20]];
  for (const [px, py] of particles) {
    slide.shapes.add({
      geometry: "ellipse",
      position: { left: gx + px * gw - 7, top: gy + py * gh - 7, width: 14, height: 14 },
      fill: BLUE,
      line: { style: "solid", fill: BLUE, width: 0 },
    });
  }
  addText(slide, "particle state", gx, top + 18, 150, 24, { fontSize: 15, bold: true, color: BLUE });
  addText(slide, "grid update", left + width - 210, top + height - 44, 150, 24, { fontSize: 15, bold: true, color: GREEN, alignment: "right" });
}

function drawThinGaussian(slide, left, top, width, height) {
  box(slide, left, top, width, height, WHITE, LINE);
  slide.shapes.add({
    geometry: "ellipse",
    position: { left: left + 122, top: top + 98, width: 240, height: 34, rotation: -24 },
    fill: "#E6EDF7",
    line: { style: "solid", fill: BLUE, width: 2 },
  });
  slide.shapes.add({
    geometry: "line",
    position: { left: left + 140, top: top + 212, width: 280, height: 0 },
    fill: "none",
    line: { style: "solid", fill: "#AAAAAA", width: 2 },
  });
  addText(slide, "over-skinny Gaussian", left + 78, top + 38, width - 156, 26, { fontSize: 18, bold: true, alignment: "center", color: BLUE });
  addText(slide, "큰 변형 후 surface 밖 artifact 가능", left + 58, top + 244, width - 116, 28, { fontSize: 16, alignment: "center", color: MID });
}

function infoBox(slide, title, body, left, top, width, height, fill = SOFT2) {
  box(slide, left, top, width, height, fill, "#E2E2E2");
  addText(slide, title, left + 18, top + 14, width - 36, 24, { fontSize: 17, bold: true, color: DARK });
  addText(slide, body, left + 18, top + 46, width - 36, height - 58, { fontSize: 17, color: BLACK });
}

async function build() {
  await ensureDirs();
  const sourceStat = await fs.stat(SOURCE_PPTX);
  const presentation = Presentation.create({ slideSize: { width: W, height: H } });

  let s;

  s = createSlide(presentation, null, 1);
  addText(s, "PhysGaussian", 72, 150, 900, 78, { fontSize: 60, bold: true });
  addText(s, "Physics-Integrated 3D Gaussians for Generative Dynamics", 76, 248, 980, 38, { fontSize: 24, color: DARK });
  addText(s, "3D Gaussian을 rendering primitive이자 simulation particle로 사용하는 방법", 76, 342, 1020, 44, { fontSize: 27 });
  addText(s, "01", 1168, 58, 42, 18, { fontSize: 11, color: MID, alignment: "right" });

  s = createSlide(presentation, "Contents", 2);
  bullets(s, ["Motivation", "Background: 3DGS / MPM", "Deformation Map / Gradient", "Core Idea: WS2", "Method Overview", "Method Details", "Experiments / Limitations"], 120, 184, 900, 60, 25);

  s = createSlide(presentation, "Motivation", 3);
  drawMesh(s, 90, 174, 300, 230, "Mesh proxy", "mesh");
  drawMesh(s, 490, 174, 300, 230, "Cage control", "cage");
  drawMesh(s, 890, 174, 300, 230, "Tetrahedral proxy", "tetra");
  bullets(s, [
    "novel dynamics 생성은 기존 방법에서 mesh / cage / tetrahedral proxy에 의존하는 경우가 많음",
    "보이는 visual geometry와 simulation geometry가 달라 mismatch 생김",
    "따라서 보이는 representation을 그대로 simulation할 수 있는가에서 출발함",
  ], 118, 456, 1000, 58, 22);

  s = createSlide(presentation, "Background: 3D Gaussian Splatting", 4);
  await addImage(s, figures.primitive, 78, 166, 300, 250, "3DGS primitive");
  await addImage(s, figures.sh, 414, 176, 300, 230, "Spherical harmonics");
  addText(s, "3D Scene을 3D Gaussian Primitive 집합으로 표현함", 748, 166, 410, 46, { fontSize: 22, bold: true });
  const elems = [
    ["position / center", "primitive 위치"],
    ["opacity", "투명도 / alpha"],
    ["covariance", "ellipsoid 크기와 방향"],
    ["SH coefficient", "view-dependent color"],
  ];
  elems.forEach(([a, b], i) => infoBox(s, a, b, 748 + (i % 2) * 214, 238 + Math.floor(i / 2) * 104, 190, 82, "#F5F5F5"));
  infoBox(s, "covariance 의미", "Gaussian ellipsoid의 퍼짐과 방향을 결정함", 82, 468, 508, 92);
  infoBox(s, "SH coefficient 의미", "view direction별 색 변화와 appearance를 표현함", 624, 468, 508, 92);

  s = createSlide(presentation, "Background: Material Point Method (MPM)", 5);
  drawMpm(s, 80, 168, 480, 318);
  addText(s, "continuum mechanics를 discrete particle + grid로 근사하는 방식", 610, 166, 520, 34, { fontSize: 22, bold: true });
  addText(s, "전체 운동량 변화량 = 내력 + 외력\n→ particle별 직접 계산이 아니라 grid에 속한 particle 정보를 모아 근사 계산함", 610, 220, 540, 82, { fontSize: 20 });
  infoBox(s, "particle 장점", "mass, position, velocity, deformation gradient 같은 상태 저장에 좋음", 610, 330, 250, 128);
  infoBox(s, "grid 장점", "force, momentum update, collision 계산을 안정적으로 처리함", 886, 330, 250, 128);
  infoBox(s, "PhysGaussian 연결", "3DGS primitive 자체를 MPM particle로 사용함", 610, 474, 526, 82, "#F2F6FA");

  s = createSlide(presentation, "Deformation Map / Gradient", 6);
  infoBox(s, "deformation map ϕ(X,t)", "material point X가 시간 t에 어디로 이동하는지 나타냄\n→ Gaussian center position 이동에 사용함", 88, 178, 500, 150);
  infoBox(s, "deformation gradient F = ∇Xϕ(X,t)", "주변 local stretch, shear, rotation을 담음\n→ Gaussian shape 변형에 사용함", 654, 178, 500, 150);
  bullets(s, [
    "이후 covariance update에서 F를 사용해 Gaussian ellipsoid를 변형함",
    "SH orientation에서도 F의 rotation 성분을 사용함",
    "즉 center 이동뿐 아니라 local deformation까지 representation에 반영함",
  ], 120, 406, 980, 60, 23);

  s = createSlide(presentation, "What You See Is What You Simulate", 7);
  await addImage(s, figures.ws2, 92, 166, 330, 330, "What you see is what you simulate");
  addText(s, "WS2 = What You See Is What You Simulate", 488, 168, 610, 36, { fontSize: 25, bold: true });
  bullets(s, [
    "3DGS에 velocity, strain(stretch / shear / rotation), stress 등 물리 속성 부여함",
    "Gaussian을 MPM material particle로 사용함",
    "기존 방법처럼 mesh, cage, tetrahedralization 없이 simulation과 rendering을 통합함",
  ], 488, 238, 650, 70, 22);
  infoBox(s, "핵심", "보이는 Gaussian이 곧 시뮬레이션되는 Gaussian임", 488, 502, 560, 70, "#F2F6FA");

  s = createSlide(presentation, "Overview", 8);
  await addImage(s, figures.overview, 72, 154, 1080, 270, "PhysGaussian overview");
  const steps = [
    "1. input image + camera로 static 3DGS reconstruction",
    "2. anisotropic loss로 skinny Gaussian 억제",
    "3. kernel filling으로 내부 particle 보완",
    "4. Gaussian ellipsoid를 continuum particle로 봄",
    "5. dynamics는 CM/MPM, kinematics는 Gaussian state update",
    "6. 변형된 Gaussian을 다시 3DGS renderer로 렌더링",
  ];
  steps.forEach((t, i) => addText(s, t, 94 + (i % 2) * 550, 454 + Math.floor(i / 2) * 56, 500, 34, { fontSize: 17 }));

  s = createSlide(presentation, "Physics-Integrated 3DGS", 9);
  infoBox(s, "문제", "deformation map 자체는 전체 물체 기준으로 비선형일 수 있음\n그대로 적용하면 Gaussian 형태가 깨질 수 있음", 88, 170, 480, 130);
  infoBox(s, "근사", "각 Gaussian 주변에서는 local affine approximation으로 근사함\nϕ(X,t) ≈ xₚ + Fₚ(X - Xₚ)", 632, 170, 480, 130);
  infoBox(s, "업데이트", "center와 covariance를 동시에 업데이트함\nxₚ(t)=ϕ(Xₚ,t),  aₚ(t)=FₚAₚFₚᵀ", 88, 344, 480, 130, "#F2F6FA");
  infoBox(s, "유지되는 값", "opacity와 SH coefficient 값은 유지함\n단, SH orientation은 다음 슬라이드에서 별도 회전 처리함", 632, 344, 480, 130, "#F7F7F7");

  s = createSlide(presentation, "SH Orientation", 10);
  await addImage(s, figures.orientation, 80, 172, 430, 220, "SH orientation");
  bullets(s, [
    "SH 평가는 view direction을 넣으면 그 방향에서의 색상값을 계산하는 것임",
    "SH coefficient / basis 자체는 hard-coded라서 값을 직접 바꾸지 않음",
    "GS가 회전하면 입력 view-direction에 inverse rotation을 적용해 같은 효과를 냄",
    "deformation gradient의 polar decomposition F = R S에서 rotation R만 사용함",
  ], 570, 170, 600, 68, 21);
  infoBox(s, "핵심 식", "fᵗ(d) = f⁰(Rᵀd)", 180, 448, 260, 76, "#F2F6FA");

  s = createSlide(presentation, "Internal Filling", 11);
  await addImage(s, figures.filling, 76, 166, 360, 250, "Internal filling");
  infoBox(s, "문제점", "Gaussian이 visible surface 근처에 분포하는 경향 있음\nobject 내부가 비어 제대로 된 물리 시뮬레이션이 어려울 수 있음", 486, 166, 640, 112);
  infoBox(s, "intersection", "opacity가 threshold 기준으로 낮았다가 높아지면 surface와 intersect한 것으로 봄", 486, 302, 640, 76);
  bullets(s, [
    "opacity field를 3D grid로 이산화하고 threshold 기반 ray test로 internal cell 판별함",
    "cell에서 6방향 ray를 쏴서 internal cell candidate를 찾음",
    "추가 ray 교차 횟수로 최종 internal cell을 결정함",
    "internal cell에는 particle을 추가하고 nearest Gaussian의 opacity와 SH coefficient로 초기화함",
  ], 104, 458, 1000, 44, 19);

  s = createSlide(presentation, "Anisotropy Regularizer", 12);
  drawThinGaussian(s, 86, 178, 440, 330);
  bullets(s, [
    "너무 길고 얇은 Gaussian은 큰 변형에서 surface 밖으로 튀어나오는 artifact를 만들 수 있음",
    "이를 막기 위해 reconstruction training 중 anisotropy regularizer를 추가함",
    "장축/단축 scale ratio가 threshold r을 넘지 않도록 제한함",
    "한쪽 방향으로 과하게 길어지는 것을 막기 위한 목적임",
  ], 590, 188, 560, 72, 22);

  s = createSlide(presentation, "실험 결과: 정성 + 정량", 13);
  bullets(s, [
    "정성 결과: elastic, plastic metal, fracture, granular, viscoplastic paste 등 다양한 material behavior를 보여줌",
    "정량 결과: BlenderNeRF 기반 lattice deformation benchmark에서 NeRF-Editing, Deforming-NeRF, PAC-NeRF와 비교함",
    "Table 1에서 Wolf/Stool/Plant의 bend/twist case 모두 PhysGaussian이 가장 높은 PSNR을 보고함",
    "Ablation은 Fixed Covariance, Rigid Covariance, Fixed Harmonics를 비교함",
    "해석: covariance와 SH orientation update가 full method의 중요한 구성요소임",
  ], 112, 168, 1000, 70, 22);

  s = createSlide(presentation, "Limitations", 14);
  bullets(s, [
    "물성을 자동으로 알아내는 방법은 아니고, 사용자가 config로 직접 조정해야 함",
    "3DGS Gaussian의 opacity / covariance가 실제 mass, density, volume을 보장하지 않음",
    "shadow evolution과 복잡한 lighting 변화는 고려하지 않음",
    "internal filling은 heuristic이라 thin / open / noisy geometry에서 실패할 수 있음",
    "benchmark는 실제 physics ground truth 검증보다는 rendering fidelity 검증에 가까움",
  ], 112, 176, 1000, 72, 23);

  s = createSlide(presentation, null, 15);
  addText(s, "Thank you", 72, 190, 900, 82, { fontSize: 60, bold: true });
  addText(s, "Questions?", 76, 294, 900, 46, { fontSize: 36 });
  addText(s, "Key idea: 3D Gaussians become both what we render and what we simulate.", 76, 610, 1060, 28, { fontSize: 18, color: DARK });
  addText(s, "15", 1168, 58, 42, 18, { fontSize: 11, color: MID, alignment: "right" });

  await writeSupportFiles(sourceStat);

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

  const finalStat = await fs.stat(FINAL_PPTX);
  await fs.writeFile(path.join(QA_DIR, "visual-qa.txt"), [
    "Visual QA summary",
    `Source original preserved at: ${SOURCE_PPTX}`,
    `Original size before build: ${sourceStat.size}`,
    `Final PPTX: ${FINAL_PPTX}`,
    "- Built 15 slides.",
    "- No speaker notes were added.",
    "- Removed visible arXiv/footer text.",
    "- Replaced placeholder boxes with provided images or editable diagrams.",
    "- Slide 3 proxy diagrams use equal frame sizes.",
    `Final size: ${finalStat.size}`,
  ].join("\n"), "utf8");

  console.log(JSON.stringify({
    sourcePptx: SOURCE_PPTX,
    finalPptx: FINAL_PPTX,
    workspace: WORKSPACE,
    slides: 15,
    bytes: finalStat.size,
  }, null, 2));
}

async function writeSupportFiles(sourceStat) {
  await fs.writeFile(path.join(TMP_DIR, "source-notes.txt"), [
    "PhysGaussian edited deck source notes",
    `Original PPTX: ${SOURCE_PPTX}`,
    `Original size at start: ${sourceStat.size}`,
    "Provided figures used:",
    "- figure/3dgs_primitive.png",
    "- figure/SH.png",
    "- figure/WS2.png",
    "- figure/overview.png",
    "- figure/orientation_sh.png",
    "- figure/internal_filling.png",
    "New visuals are editable shape diagrams for mesh/cage/tetrahedral proxies, MPM particle-grid, and skinny Gaussian artifact.",
  ].join("\n"), "utf8");
  await fs.writeFile(path.join(TMP_DIR, "edit-plan.txt"), [
    "Edit plan",
    "Create a new edited PPTX in the same folder while preserving the original.",
    "Use no speaker notes and no footer/arXiv text.",
    "Use Korean noun-ending style throughout the body.",
    "Replace image placeholders with actual images or simple editable diagrams.",
  ].join("\n"), "utf8");
}

await build();
