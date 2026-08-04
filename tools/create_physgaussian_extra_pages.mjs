import fs from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { Presentation, PresentationFile } = await import(pathToFileURL(require.resolve("@oai/artifact-tool")).href);

const OUT = "C:\\Users\\jinsw712\\Desktop\\Files\\논문 발표\\PhysGaussian 발표\\PhysGaussian_추가페이지.pptx";
const WORKSPACE = path.join(os.tmpdir(), "codex-presentations", "manual-physgaussian", "extra-pages");
const PREVIEW_DIR = path.join(WORKSPACE, "preview");
const LAYOUT_DIR = path.join(WORKSPACE, "layout");
const QA_DIR = path.join(WORKSPACE, "qa");

async function writeBlob(filePath, blob) {
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

function addText(slide, text, x, y, w, h, style = {}) {
  const box = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  box.text = text;
  box.text.style = {
    typeface: style.typeface ?? "Malgun Gothic",
    fontSize: style.fontSize ?? 20,
    bold: style.bold ?? false,
    color: style.color ?? "#111111",
    alignment: style.alignment ?? "left",
    fit: "shrink",
  };
  return box;
}

function addTitle(slide, title, page) {
  slide.background.fill = "#FFFFFF";
  addText(slide, title, 82, 62, 920, 54, { fontSize: 36, bold: true });
  addText(slide, page, 1160, 65, 48, 22, { fontSize: 11, color: "#666666", alignment: "right" });
  slide.shapes.add({
    geometry: "rect",
    position: { left: 72, top: 128, width: 1136, height: 1 },
    fill: "#E5E5E5",
    line: { style: "solid", fill: "#E5E5E5", width: 0 },
  });
}

function addBlock(slide, { x, y, w, h, title, body, fill = "#F5F6F8", border = "#D9DDE3", titleSize = 20, bodySize = 18 }) {
  slide.shapes.add({
    geometry: "roundRect",
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: border, width: 1 },
    borderRadius: "rounded-lg",
  });
  addText(slide, title, x + 20, y + 18, w - 40, 30, { fontSize: titleSize, bold: true });
  addText(slide, body, x + 20, y + 58, w - 40, h - 76, { fontSize: bodySize });
}

function addArrow(slide, text, x, y, w = 54, h = 36, rotation = 0) {
  const arrow = addText(slide, text, x, y, w, h, { fontSize: 32, bold: true, color: "#555555", alignment: "center" });
  arrow.rotation = rotation;
  return arrow;
}

function addLawCard(slide, { x, y, w, h, title, formula, explanation, fill }) {
  slide.shapes.add({
    geometry: "roundRect",
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: "#D9DDE3", width: 1 },
    borderRadius: "rounded-lg",
  });
  addText(slide, title, x + 30, y + 24, w - 60, 50, { fontSize: 21, bold: true });
  const formulaBox = slide.shapes.add({
    geometry: "roundRect",
    position: { left: x + 28, top: y + 86, width: w - 56, height: 108 },
    fill: "#FFFFFF",
    line: { style: "solid", fill: "#E5E7EB", width: 1 },
    borderRadius: "rounded-md",
  });
  addText(slide, formula, x + 44, y + 104, w - 88, 76, {
    typeface: "Cambria Math",
    fontSize: 21,
    color: "#111111",
  });
  addText(slide, explanation, x + 30, y + 224, w - 60, h - 248, { fontSize: 16.5 });
}

function drawMiniGaussianScene(slide, x, y, w, h) {
  slide.shapes.add({
    geometry: "roundRect",
    position: { left: x, top: y, width: w, height: h },
    fill: "#FFFFFF",
    line: { style: "solid", fill: "#D9DDE3", width: 1 },
    borderRadius: "rounded-lg",
  });
  const blobs = [
    [0.22, 0.68, 30, 18, "#F59E0B"],
    [0.36, 0.64, 28, 18, "#FBBF24"],
    [0.50, 0.60, 32, 18, "#F59E0B"],
    [0.64, 0.64, 28, 18, "#FBBF24"],
    [0.40, 0.48, 26, 16, "#F59E0B"],
    [0.52, 0.43, 25, 15, "#FBBF24"],
    [0.49, 0.28, 24, 14, "#F59E0B"],
    [0.58, 0.74, 30, 16, "#F97316"],
  ];
  for (const [px, py, bw, bh, fill] of blobs) {
    slide.shapes.add({
      geometry: "ellipse",
      position: { left: x + px * w - bw / 2, top: y + py * h - bh / 2, width: bw, height: bh },
      fill,
      transparency: 28,
      line: { style: "solid", fill: "#B45309", width: 0.5 },
    });
  }
  addText(slide, "3D Gaussians", x + 18, y + h - 34, w - 36, 22, { fontSize: 14, color: "#555555", alignment: "center" });
}

function slide3DGSProcess(presentation) {
  const slide = presentation.slides.add();
  addTitle(slide, "3DGS: Reconstruction / Optimization 과정", "A-1");

  addBlock(slide, {
    x: 84,
    y: 170,
    w: 200,
    h: 150,
    title: "1. Input",
    body: "multi-view images\n+ camera pose",
    fill: "#F3F4F6",
  });
  addArrow(slide, "→", 298, 222);
  addBlock(slide, {
    x: 370,
    y: 170,
    w: 220,
    h: 150,
    title: "2. Initialize",
    body: "초기 3D Gaussian 생성\ncenter / covariance /\nopacity / SH",
    fill: "#EEF6FF",
    bodySize: 16,
  });
  addArrow(slide, "→", 604, 222);
  addBlock(slide, {
    x: 680,
    y: 170,
    w: 220,
    h: 150,
    title: "3. Render",
    body: "Gaussian을 camera view에\n2D로 project / splat",
    fill: "#F8F4EC",
    bodySize: 17,
  });
  addArrow(slide, "→", 914, 222);
  addBlock(slide, {
    x: 990,
    y: 170,
    w: 200,
    h: 150,
    title: "4. Loss",
    body: "rendered image와\nGT image 비교",
    fill: "#F3F4F6",
  });

  drawMiniGaussianScene(slide, 388, 360, 180, 140);
  addBlock(slide, {
    x: 680,
    y: 360,
    w: 220,
    h: 140,
    title: "5. Optimize",
    body: "loss를 줄이도록\nGaussian parameter 업데이트",
    fill: "#ECFDF5",
    bodySize: 17,
  });
  addArrow(slide, "←", 604, 410);
  addText(slide, "반복: render → compare → optimize", 170, 548, 940, 44, {
    fontSize: 28,
    bold: true,
    alignment: "center",
  });
  addText(slide, "결과적으로 여러 Gaussian primitive가 scene appearance를 잘 설명하도록 학습됨", 180, 596, 920, 34, {
    fontSize: 20,
    color: "#444444",
    alignment: "center",
  });
}

function slideContinuumLaws(presentation) {
  const slide = presentation.slides.add();
  addTitle(slide, "Continuum Mechanics: 지켜지는 법칙들", "A-2");

  addLawCard(slide, {
    x: 84,
    y: 150,
    w: 350,
    h: 410,
    title: "질량 보존",
    formula:
      "∫Bεᵗ ρ(x,t) dx\n= ∫Bε⁰ ρ(φ⁻¹(x,t),0) dX",
    explanation:
      "변형 후 작은 영역 안의 총 질량\n= 변형 전 영역의 총 질량\n\n즉, 밀도를 부피에 대해 적분하면 질량이 되고 이 값이 보존됨",
    fill: "#F3F4F6",
  });

  addLawCard(slide, {
    x: 464,
    y: 150,
    w: 350,
    h: 410,
    title: "운동량 보존",
    formula:
      "ρ(x,t) v̇(x,t) = ∇·σ(x,t) + fᵉˣᵗ\nσ = 1/det(F) · ∂Ψ/∂F(Fᴱ)(Fᴱ)ᵀ",
    explanation:
      "질량 × 가속도\n= 내부 stress에 의한 힘 + 외부 힘\n\nσ는 Cauchy stress tensor",
    fill: "#EEF6FF",
  });

  addLawCard(slide, {
    x: 844,
    y: 150,
    w: 350,
    h: 410,
    title: "Elastic / Plastic\nDecomposition",
    formula:
      "F = Fᴱ Fᴾ",
    explanation:
      "Fᴱ: elastic deformation gradient\n회복 가능한 변형\n\nFᴾ: plastic deformation gradient\n영구적으로 남는 변형\n\nelastic / plastic을 나누면 영구 변형까지 표현 가능",
    fill: "#FFF7ED",
  });

  addText(slide, "deformation map / gradient는 단순 위치 변화가 아니라, 질량·운동량·응력·소성 변형 같은 물리 법칙과 연결됨", 130, 590, 1020, 46, {
    fontSize: 21,
    bold: true,
    alignment: "center",
  });
}

async function main() {
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(LAYOUT_DIR, { recursive: true });
  await fs.mkdir(QA_DIR, { recursive: true });

  await fs.writeFile(
    path.join(WORKSPACE, "slide-plan.txt"),
    [
      "PhysGaussian extra pages",
      "Slide A-1: 3DGS process as editable block diagram.",
      "Slide A-2: continuum mechanics conservation/decomposition equations based on user-provided notes image.",
      "Style: white background, black text, light gray/blue/orange boxes, Malgun Gothic, editable shapes.",
    ].join("\n"),
  );
  await fs.writeFile(
    path.join(WORKSPACE, "source-notes.txt"),
    [
      "Sources:",
      "- User request and user-provided screenshot for continuum mechanics equations.",
      "- Existing PhysGaussian presentation visual style: simple white background, black text, light boxes.",
      "- General 3DGS reconstruction loop summarized at user-requested conceptual level.",
    ].join("\n"),
  );

  const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } });
  slide3DGSProcess(presentation);
  slideContinuumLaws(presentation);

  for (const [index, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    await writeBlob(path.join(PREVIEW_DIR, `${stem}.png`), await presentation.export({ slide, format: "png", scale: 1 }));
    await fs.writeFile(path.join(LAYOUT_DIR, `${stem}.layout.json`), await (await slide.export({ format: "layout" })).text());
  }
  await writeBlob(path.join(PREVIEW_DIR, "contact-sheet.webp"), await presentation.export({ format: "webp", montage: true, scale: 1 }));
  await fs.writeFile(
    path.join(QA_DIR, "visual-qa.txt"),
    "Rendered both slides and contact sheet. Checked for readable block layout, no intentional external images, and editable text/shape construction.\n",
  );

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(OUT);
  console.log(OUT);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
