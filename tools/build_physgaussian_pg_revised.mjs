import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { Presentation, PresentationFile } from "file:///C:/Users/jinsw712/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const ROOT = "C:/Users/jinsw712/Desktop/Files/논문 발표/PhysGaussian 발표";
const SOURCE_PPTX = path.join(ROOT, "pg.pptx");
const FINAL_PPTX = path.join(ROOT, "pg_revised.pptx");
const FIG_DIR = path.join(ROOT, "figure");
const WORKSPACE = path.join(os.tmpdir(), "codex-presentations", "manual-physgaussian", "pg-revised");
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
const LINE = "#D8D8D8";
const SOFT = "#F5F5F5";
const SOFT_BLUE = "#F0F5FB";
const SOFT_GREEN = "#F0F7F3";
const SOFT_ORANGE = "#FBF2EA";
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
  experiment: path.join(FIG_DIR, "experiment.png"),
  table1: path.join(FIG_DIR, "Table1.png"),
  tree: path.join(FIG_DIR, "tree.gif"),
};

async function ensureDirs() {
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(LAYOUT_DIR, { recursive: true });
  await fs.mkdir(QA_DIR, { recursive: true });
}

async function readImage(file) {
  const bytes = await fs.readFile(file);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function contentType(file) {
  const lower = file.toLowerCase();
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "image/png";
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
    fontSize: style.fontSize ?? 21,
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

function createSlide(presentation, title, num) {
  const slide = presentation.slides.add();
  slide.background.fill = WHITE;
  if (title) addTitle(slide, title, num);
  return slide;
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

function infoBox(slide, title, body, left, top, width, height, fill = SOFT) {
  box(slide, left, top, width, height, fill);
  addText(slide, title, left + 18, top + 14, width - 36, 25, {
    fontSize: 17,
    bold: true,
    color: DARK,
  });
  addText(slide, body, left + 18, top + 47, width - 36, height - 58, {
    fontSize: 17,
  });
}

function bullet(slide, value, left, top, width, fontSize = 21, height = 48) {
  addText(slide, "•", left, top - 2, 26, 30, { fontSize, bold: true });
  addText(slide, value, left + 32, top, width - 32, height, { fontSize });
}

function bullets(slide, list, left, top, width, gap = 56, fontSize = 21) {
  list.forEach((value, i) => bullet(slide, value, left, top + i * gap, width, fontSize, Math.max(42, gap - 8)));
}

async function addImage(slide, file, left, top, width, height, alt, fit = "contain") {
  slide.images.add({
    blob: await readImage(file),
    contentType: contentType(file),
    alt,
    fit,
    position: { left, top, width, height },
  });
}

function label(slide, value, left, top, width) {
  addText(slide, value, left, top, width, 24, {
    fontSize: 15,
    bold: true,
    color: DARK,
    alignment: "center",
  });
}

function drawMotivationCard(slide, left, top, width, height, title, kind) {
  box(slide, left, top, width, height, WHITE);
  label(slide, title, left, top + height - 36, width);
  const cx = left + width / 2;
  const cy = top + 90;
  if (kind === "mesh") {
    slide.shapes.add({ geometry: "ellipse", position: { left: cx - 54, top: cy - 36, width: 108, height: 72 }, fill: "#DDE7F5", line: { style: "solid", fill: BLUE, width: 2 } });
    for (let i = 0; i < 5; i++) {
      slide.shapes.add({ geometry: "line", position: { left: cx - 82, top: cy - 54 + i * 27, width: 164, height: 0 }, fill: "none", line: { style: "solid", fill: "#9B9B9B", width: 1 } });
      slide.shapes.add({ geometry: "line", position: { left: cx - 82 + i * 41, top: cy - 54, width: 0, height: 108 }, fill: "none", line: { style: "solid", fill: "#9B9B9B", width: 1 } });
    }
    addText(slide, "visual geometry\n→ mesh로 변환", left + 22, top + 172, width - 44, 42, { fontSize: 14, color: MID, alignment: "center" });
  } else if (kind === "cage") {
    slide.shapes.add({ geometry: "ellipse", position: { left: cx - 44, top: cy - 28, width: 88, height: 58 }, fill: "#F4E4D7", line: { style: "solid", fill: ORANGE, width: 2 } });
    slide.shapes.add({ geometry: "rect", position: { left: cx - 72, top: cy - 56, width: 144, height: 112 }, fill: "none", line: { style: "dash", fill: ORANGE, width: 2 } });
    for (const [x, y] of [[-72, -56], [72, -56], [-72, 56], [72, 56]]) {
      slide.shapes.add({ geometry: "ellipse", position: { left: cx + x - 6, top: cy + y - 6, width: 12, height: 12 }, fill: ORANGE, line: { style: "solid", fill: ORANGE, width: 0 } });
    }
    addText(slide, "proxy cage를 움직여\n내부 geometry 제어", left + 22, top + 172, width - 44, 42, { fontSize: 14, color: MID, alignment: "center" });
  } else {
    const pts = [[cx, cy - 62], [cx - 72, cy + 50], [cx + 72, cy + 50], [cx, cy + 6]];
    for (const [a, b] of [[0, 1], [0, 2], [1, 2], [0, 3], [1, 3], [2, 3]]) {
      const [x1, y1] = pts[a];
      const [x2, y2] = pts[b];
      slide.shapes.add({ geometry: "line", position: { left: x1, top: y1, width: x2 - x1, height: y2 - y1 }, fill: "none", line: { style: "solid", fill: GREEN, width: 2 } });
    }
    for (const [x, y] of pts) {
      slide.shapes.add({ geometry: "ellipse", position: { left: x - 6, top: y - 6, width: 12, height: 12 }, fill: GREEN, line: { style: "solid", fill: GREEN, width: 0 } });
    }
    addText(slide, "volume proxy로\n물리 계산", left + 22, top + 172, width - 44, 42, { fontSize: 14, color: MID, alignment: "center" });
  }
}

function drawThinGaussian(slide, left, top, width, height) {
  box(slide, left, top, width, height, WHITE);
  slide.shapes.add({
    geometry: "ellipse",
    position: { left: left + 114, top: top + 92, width: 250, height: 32, rotation: -23 },
    fill: "#E6EDF7",
    line: { style: "solid", fill: BLUE, width: 2 },
  });
  slide.shapes.add({ geometry: "line", position: { left: left + 132, top: top + 214, width: 290, height: 0 }, fill: "none", line: { style: "solid", fill: "#AAAAAA", width: 2 } });
  addText(slide, "over-skinny Gaussian", left + 76, top + 36, width - 152, 28, { fontSize: 18, bold: true, color: BLUE, alignment: "center" });
  addText(slide, "큰 변형 후 surface 밖 artifact 가능", left + 48, top + 244, width - 96, 28, { fontSize: 16, color: MID, alignment: "center" });
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
  drawMotivationCard(s, 86, 160, 310, 250, "Mesh proxy", "mesh");
  drawMotivationCard(s, 486, 160, 310, 250, "Cage control", "cage");
  drawMotivationCard(s, 886, 160, 310, 250, "Tetrahedral proxy", "tetra");
  bullets(s, [
    "novel dynamics 생성은 기존 방법에서 mesh / cage / tetrahedral proxy에 의존하는 경우가 많음",
    "보이는 visual geometry와 simulation geometry가 달라 mismatch 생김",
    "따라서 보이는 representation을 그대로 simulation할 수 있는가에서 출발함",
  ], 118, 460, 1000, 58, 22);

  s = createSlide(presentation, "Background: 3D Gaussian Splatting", 4);
  await addImage(s, figures.primitive, 78, 166, 300, 250, "3DGS primitive");
  await addImage(s, figures.sh, 414, 176, 300, 230, "Spherical harmonics");
  addText(s, "3D Scene을 3D Gaussian Primitive 집합으로 표현함", 748, 166, 410, 46, { fontSize: 22, bold: true });
  const elems = [["position / center", "primitive 위치"], ["opacity", "투명도 / alpha"], ["covariance", "ellipsoid 크기와 방향"], ["SH coefficient", "view-dependent color"]];
  elems.forEach(([a, b], i) => infoBox(s, a, b, 748 + (i % 2) * 214, 238 + Math.floor(i / 2) * 104, 190, 82, "#F5F5F5"));
  infoBox(s, "covariance 의미", "Gaussian ellipsoid의 퍼짐과 방향을 결정함", 82, 468, 508, 92);
  infoBox(s, "SH coefficient 의미", "view direction별 색 변화와 appearance를 표현함", 624, 468, 508, 92);

  s = createSlide(presentation, "Background: Material Point Method (MPM)", 5);
  box(s, 80, 168, 480, 318, WHITE);
  for (let i = 0; i <= 5; i++) {
    slideLine(s, 138 + i * 73, 214, 0, 226, "#D8D8D8", 1);
    slideLine(s, 138, 214 + i * 45, 364, 0, "#D8D8D8", 1);
  }
  for (const [x, y] of [[203, 263], [305, 286], [443, 259], [258, 340], [404, 309], [364, 367]]) {
    s.shapes.add({ geometry: "ellipse", position: { left: x - 7, top: y - 7, width: 14, height: 14 }, fill: BLUE, line: { style: "solid", fill: BLUE, width: 0 } });
  }
  addText(s, "particle state", 148, 194, 150, 24, { fontSize: 15, bold: true, color: BLUE });
  addText(s, "grid update", 404, 448, 120, 24, { fontSize: 15, bold: true, color: GREEN });
  addText(s, "continuum mechanics를 discrete particle +\ngrid로 근사하는 방식", 620, 178, 520, 58, { fontSize: 22, bold: true });
  addText(s, "전체 운동량 변화량 = 내력 + 외력\n→ grid에 속한 particle 정보를 모아 근사 계산함", 620, 248, 540, 70, { fontSize: 19 });
  infoBox(s, "particle 장점", "mass, position, velocity, deformation gradient 같은 상태 저장에 좋음", 610, 340, 250, 118);
  infoBox(s, "grid 장점", "force, momentum update, collision 계산을 안정적으로 처리함", 886, 340, 250, 118);
  infoBox(s, "PhysGaussian 연결", "3DGS primitive 자체를 MPM particle로 사용함", 610, 488, 526, 72, SOFT_BLUE);

  s = createSlide(presentation, "Deformation Map / Gradient", 6);
  infoBox(s, "deformation map ϕ(X,t)", "material point X가 시간 t에 어디로 이동하는지 나타냄", 110, 190, 470, 118);
  infoBox(s, "deformation gradient F = ∇Xϕ(X,t)", "한 점 주변의 local stretch, shear, rotation을 담음", 700, 190, 470, 118);
  addText(s, "직관", 120, 398, 120, 28, { fontSize: 21, bold: true });
  bullets(s, [
    "map은 위치 변화 자체를 설명함",
    "gradient는 주변 모양이 어떻게 늘어나고 찌그러지는지 설명함",
    "즉 같은 움직임이라도 center 이동과 local shape 변화는 구분해서 봐야 함",
  ], 150, 444, 930, 54, 22);

  s = createSlide(presentation, "What You See Is What You Simulate", 7);
  await addImage(s, figures.ws2, 92, 166, 330, 330, "What you see is what you simulate");
  addText(s, "WS2 = What You See Is What You Simulate", 488, 168, 610, 36, { fontSize: 25, bold: true });
  bullets(s, [
    "3DGS에 velocity, strain(stretch / shear / rotation), stress 등 물리 속성 부여함",
    "Gaussian을 MPM material particle로 사용함",
    "기존 방법처럼 mesh, cage, tetrahedralization 없이 simulation과 rendering을 통합함",
  ], 488, 238, 650, 70, 22);
  infoBox(s, "핵심", "보이는 Gaussian이 곧 시뮬레이션되는 Gaussian임", 488, 502, 560, 70, SOFT_BLUE);

  s = createSlide(presentation, "Overview", 8);
  await addImage(s, figures.overview, 72, 154, 1080, 270, "PhysGaussian overview");
  const steps = [
    "1. static 3DGS reconstruction",
    "2. anisotropic loss로 skinny Gaussian 억제",
    "3. kernel filling으로 내부 particle 보완",
    "4. Gaussian ellipsoid를 continuum particle로 봄",
    "5. CM/MPM으로 물리 움직임을 계산 -> Gaussian의 위치, 모양, SH 방향에 반영",
    "6. 변형된 Gaussian을 다시 3DGS renderer로 렌더링",
  ];
  steps.forEach((t, i) => addText(s, t, 94 + (i % 2) * 550, 452 + Math.floor(i / 2) * 56, 500, 34, { fontSize: 17 }));

  s = createSlide(presentation, "Physics-Integrated 3DGS", 9);
  infoBox(s, "center update", "deformation map ϕ(X,t)로 Gaussian center 위치를 업데이트함\nxₚ(t) = ϕ(Xₚ,t)", 86, 166, 500, 124, SOFT_BLUE);
  infoBox(s, "covariance update", "deformation gradient F로 covariance를 업데이트함\naₚ(t) = Fₚ(t) Aₚ Fₚ(t)ᵀ", 634, 166, 500, 124, SOFT_GREEN);
  infoBox(s, "covariance 의미", "Gaussian ellipsoid의 퍼짐과 방향을 의미함\n따라서 covariance update는 local stretch / shear / rotation을 shape에 반영하는 것임", 86, 332, 500, 134);
  infoBox(s, "local affine approximation", "deformation map은 비선형일 수 있으므로 Gaussian 주변에서는 affine하게 근사함\nopacity와 SH coefficient 값은 유지하고 orientation은 다음 슬라이드에서 처리함", 634, 332, 500, 134, SOFT_ORANGE);

  s = createSlide(presentation, "SH Orientation", 10);
  await addImage(s, figures.orientation, 80, 172, 430, 220, "SH orientation");
  bullets(s, [
    "SH 평가는 view direction을 넣으면 그 방향에서의 색상값을 계산하는 것임",
    "SH coefficient / basis 자체는 hard-coded라서 값을 직접 바꾸지 않음",
    "GS가 회전하면 입력 view-direction에 inverse rotation을 적용해 같은 효과를 냄",
    "deformation gradient의 polar decomposition F = R S에서 rotation R만 사용함",
  ], 570, 170, 600, 68, 21);
  infoBox(s, "핵심 식", "fᵗ(d) = f⁰(Rᵀd)", 180, 448, 260, 76, SOFT_BLUE);

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

  s = createSlide(presentation, "Experiments", 13);
  await addImage(s, figures.experiment, 72, 150, 620, 280, "PhysGaussian qualitative material experiments");
  await addImage(s, figures.table1, 724, 150, 420, 210, "Table 1 PSNR comparison");
  await addImage(s, figures.tree, 724, 390, 160, 160, "Tree dynamics gif");
  infoBox(s, "정성", "elastic, plastic metal, fracture, granular, viscoplastic paste 등 다양한 material에 적용함", 94, 464, 560, 78);
  infoBox(s, "정량", "기존 방법과 비교해 Wolf / Stool / Plant bend·twist case에서 높은 PSNR을 보고함", 906, 390, 250, 160, SOFT_BLUE);

  s = createSlide(presentation, "Limitations", 14);
  bullets(s, [
    "shadow evolution같은 복잡한 lighting 변화는 고려하지 않음",
    "물성을 사용자가 수동으로 조정해야 함",
    "liquid같은 material은 다루지 못함",
    "internal filling도 heuristic이라 thin / open / noisy geometry에서 실패할 수 있음",
  ], 130, 186, 980, 82, 25);

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
    `Source pg preserved at: ${SOURCE_PPTX}`,
    `Source size at build: ${sourceStat.size}`,
    `Final: ${FINAL_PPTX}`,
    "- Revised motivation diagrams, deformation map slide, overview, physics-integrated slide, experiments, and limitations.",
    "- Rendered 15 PNG previews.",
    `Final size: ${finalStat.size}`,
  ].join("\n"), "utf8");
  console.log(JSON.stringify({ sourcePptx: SOURCE_PPTX, finalPptx: FINAL_PPTX, workspace: WORKSPACE, slides: 15, bytes: finalStat.size }, null, 2));
}

function slideLine(slide, left, top, width, height, color, lineWidth) {
  slide.shapes.add({
    geometry: "line",
    position: { left, top, width, height },
    fill: "none",
    line: { style: "solid", fill: color, width: lineWidth },
  });
}

async function writeSupportFiles(sourceStat) {
  await fs.writeFile(path.join(TMP_DIR, "source-notes.txt"), [
    "PhysGaussian pg_revised source notes",
    `Source PPTX: ${SOURCE_PPTX}`,
    `Source size: ${sourceStat.size}`,
    "Figures used: 3dgs_primitive.png, SH.png, WS2.png, overview.png, orientation_sh.png, internal_filling.png, experiment.png, Table1.png, tree.gif",
  ].join("\n"), "utf8");
  await fs.writeFile(path.join(TMP_DIR, "edit-plan.txt"), [
    "Revision plan",
    "Build pg_revised.pptx from pg.pptx content requirements while preserving pg.pptx.",
    "Update slides 3, 6, 8, 9, 13, 14 per user instructions.",
  ].join("\n"), "utf8");
}

await build();
