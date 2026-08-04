import fs from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { FileBlob, PresentationFile } = await import(pathToFileURL(require.resolve("@oai/artifact-tool")).href);

const SOURCE = "C:\\Users\\jinsw712\\Desktop\\Files\\논문 발표\\PhysGaussian 발표\\PhysGaussian_정휘종.pptx";
const OUT = "C:\\Users\\jinsw712\\Desktop\\Files\\논문 발표\\PhysGaussian 발표\\PhysGaussian_정휘종_revised.pptx";
const WORKSPACE = path.join(os.tmpdir(), "codex-presentations", "manual-physgaussian", "formula-insertions");
const PREVIEW_DIR = path.join(WORKSPACE, "preview");
const LAYOUT_DIR = path.join(WORKSPACE, "layout");
const QA_DIR = path.join(WORKSPACE, "qa");

async function writeBlob(filePath, blob) {
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

function addTitle(slide, title, pageLabel) {
  slide.shapes.add({
    geometry: "rect",
    position: { left: 0, top: 0, width: 1280, height: 720 },
    fill: "#FFFFFF",
    line: { style: "solid", fill: "none", width: 0 },
  });
  const titleBox = slide.shapes.add({
    geometry: "textbox",
    position: { left: 82, top: 62, width: 880, height: 54 },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  titleBox.text = title;
  titleBox.text.style = { typeface: "Arial", fontSize: 36, bold: true, color: "#000000" };

  const label = slide.shapes.add({
    geometry: "textbox",
    position: { left: 1180, top: 64, width: 48, height: 22 },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  label.text = pageLabel;
  label.text.style = { typeface: "Arial", fontSize: 11, color: "#666666", alignment: "right" };

  slide.shapes.add({
    geometry: "rect",
    position: { left: 72, top: 128, width: 1136, height: 1 },
    fill: "#E5E5E5",
    line: { style: "solid", fill: "#E5E5E5", width: 0 },
  });
}

function addBox(slide, { left, top, width, height, fill = "#F6F7F9", title, body, fontSize = 19 }) {
  const box = slide.shapes.add({
    geometry: "roundRect",
    position: { left, top, width, height },
    fill,
    line: { style: "solid", fill: "#D9D9D9", width: 1 },
    borderRadius: "rounded-lg",
  });
  if (title) {
    const t = slide.shapes.add({
      geometry: "textbox",
      position: { left: left + 24, top: top + 18, width: width - 48, height: 30 },
      fill: "none",
      line: { style: "solid", fill: "none", width: 0 },
    });
    t.text = title;
    t.text.style = { typeface: "Arial", fontSize: 18, bold: true, color: "#222222" };
  }
  const b = slide.shapes.add({
    geometry: "textbox",
    position: { left: left + 24, top: top + (title ? 58 : 24), width: width - 48, height: height - (title ? 76 : 48) },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  b.text = body;
  b.text.style = { typeface: "Arial", fontSize, color: "#222222", fit: "shrink" };
  return box;
}

function addFormula(slide, text, { left, top, width, height, fill = "#F1F5F9", fontSize = 22 }) {
  const box = slide.shapes.add({
    geometry: "roundRect",
    position: { left, top, width, height },
    fill,
    line: { style: "solid", fill: "#CBD5E1", width: 1 },
    borderRadius: "rounded-lg",
  });
  const f = slide.shapes.add({
    geometry: "textbox",
    position: { left: left + 22, top: top + 18, width: width - 44, height: height - 36 },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  f.text = text;
  f.text.style = { typeface: "Cambria Math", fontSize, color: "#111111", fit: "shrink" };
  return box;
}

function addBulletList(slide, items, { left, top, width, height, fontSize = 21 }) {
  const text = items.map((x) => `• ${x}`).join("\n");
  const box = slide.shapes.add({
    geometry: "textbox",
    position: { left, top, width, height },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  box.text = text;
  box.text.style = { typeface: "Arial", fontSize, color: "#111111", fit: "shrink" };
  return box;
}

function buildGridVelocitySlide(slide) {
  addTitle(slide, "MPM: Grid Velocity Update", "09-1");
  addFormula(
    slide,
    "mᵢ / Δt · (vᵢⁿ⁺¹ − vᵢⁿ)\n= −Σₚ Vₚ⁰ · (∂Ψ/∂F)(Fₚᴱ,ⁿ)(Fₚᴱ,ⁿ)ᵀ ∇wᵢₚⁿ + fᵢᵉˣᵗ",
    { left: 104, top: 166, width: 1072, height: 142, fill: "#F8FAFC", fontSize: 25 },
  );
  addBox(slide, {
    left: 104,
    top: 340,
    width: 336,
    height: 184,
    fill: "#F3F4F6",
    title: "왼쪽 항",
    body: "grid node i에서\n시간 n → n+1 사이의\n운동량 변화량을 의미함",
    fontSize: 21,
  });
  addBox(slide, {
    left: 472,
    top: 340,
    width: 336,
    height: 184,
    fill: "#EEF6FF",
    title: "오른쪽 첫 항",
    body: "주변 particle들이 grid node i에 전달하는\n내부 stress force의 합",
    fontSize: 21,
  });
  addBox(slide, {
    left: 840,
    top: 340,
    width: 336,
    height: 184,
    fill: "#F8F4EC",
    title: "오른쪽 둘째 항",
    body: "gravity, collision, user force 같은\n외부 힘을 더함",
    fontSize: 21,
  });
  addBulletList(
    slide,
    [
      "particle별 힘을 직접 다 계산하지 않고, grid node에 모아 근사 계산함",
      "계산된 grid velocity가 다시 particle 상태 업데이트에 사용됨",
    ],
    { left: 128, top: 560, width: 1040, height: 88, fontSize: 22 },
  );
}

function buildElasticUpdateSlide(slide) {
  addTitle(slide, "MPM: Elastic Update / Plasticity", "09-2");
  addFormula(slide, "Fₚᴱ,ⁿ⁺¹ = (I + Δt ∇vₚ) Fₚᴱ,ⁿ", {
    left: 104,
    top: 164,
    width: 506,
    height: 92,
    fill: "#F8FAFC",
    fontSize: 29,
  });
  addFormula(slide, "Fₚᴱ,ⁿ⁺¹ ← Z(Fₚᴱ,ⁿ⁺¹)", {
    left: 670,
    top: 164,
    width: 506,
    height: 92,
    fill: "#FFF7ED",
    fontSize: 29,
  });
  addBox(slide, {
    left: 104,
    top: 294,
    width: 506,
    height: 230,
    fill: "#F3F4F6",
    title: "Fᴱ update",
    body: "particle 주변의 velocity gradient ∇vₚ로\nelastic deformation gradient를 업데이트함\n\n즉, 현재 주변 속도장이 만드는 작은 변형을\n기존 elastic deformation에 누적하는 과정임",
    fontSize: 20,
  });
  addBox(slide, {
    left: 670,
    top: 294,
    width: 506,
    height: 230,
    fill: "#FEF3C7",
    title: "return mapping / plasticity regularization",
    body: "plastic material에서는 elastic deformation이\n무한히 커질 수 없음\n\nZ(·)는 허용 가능한 elastic region 밖으로 나간 Fᴱ를\n재료 모델에 맞게 다시 보정하는 함수임",
    fontSize: 20,
  });
  addBulletList(
    slide,
    [
      "stress는 주로 elastic deformation Fᴱ에서 계산됨",
      "elastic limit을 넘은 변형은 plastic deformation, 즉 영구 변형으로 반영됨",
    ],
    { left: 128, top: 558, width: 1040, height: 90, fontSize: 22 },
  );
}

function buildRegularizerFormulaSlide(slide) {
  addTitle(slide, "Anisotropy Regularizer: Eq. (12)", "12-1");
  addFormula(slide, "Lₐₙᵢₛₒ = (1 / |P|) · sum over p∈P max{ max(Sₚ) / min(Sₚ), r } − r", {
    left: 170,
    top: 164,
    width: 940,
    height: 110,
    fill: "#F8FAFC",
    fontSize: 31,
  });
  addBox(slide, {
    left: 104,
    top: 322,
    width: 328,
    height: 178,
    fill: "#F3F4F6",
    title: "Sₚ",
    body: "Gaussian p의 scaling 값\n\n각 축 방향으로 얼마나 퍼져 있는지를 나타냄",
    fontSize: 20,
  });
  addBox(slide, {
    left: 476,
    top: 322,
    width: 328,
    height: 178,
    fill: "#EEF6FF",
    title: "max(Sₚ) / min(Sₚ)",
    body: "장축 / 단축 비율\n\n값이 클수록 길고 얇은 Gaussian에 가까움",
    fontSize: 20,
  });
  addBox(slide, {
    left: 848,
    top: 322,
    width: 328,
    height: 178,
    fill: "#FEF3C7",
    title: "threshold r",
    body: "허용 가능한 anisotropy 한계\n\n비율이 r을 넘으면 penalty를 줌",
    fontSize: 20,
  });
  addBulletList(
    slide,
    [
      "목적은 static rendering 품질만이 아니라, 이후 큰 deformation에서 artifact를 줄이는 것임",
      "너무 skinny한 Gaussian이 surface 밖으로 튀어나오는 문제를 완화함",
    ],
    { left: 128, top: 548, width: 1040, height: 92, fontSize: 22 },
  );
}

async function main() {
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(LAYOUT_DIR, { recursive: true });
  await fs.mkdir(QA_DIR, { recursive: true });

  const presentation = await PresentationFile.importPptx(await FileBlob.load(SOURCE));
  const slides = presentation.slides.items;
  const originalSlide9 = slides[8];
  const originalRegularizer = slides[11];

  const { slide: gridSlide } = presentation.slides.insert({ after: originalSlide9 });
  buildGridVelocitySlide(gridSlide);
  const { slide: elasticSlide } = presentation.slides.insert({ after: gridSlide });
  buildElasticUpdateSlide(elasticSlide);
  const { slide: regEqSlide } = presentation.slides.insert({ after: originalRegularizer });
  buildRegularizerFormulaSlide(regEqSlide);

  for (const [index, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    await writeBlob(path.join(PREVIEW_DIR, `${stem}.png`), await presentation.export({ slide, format: "png", scale: 1 }));
    await fs.writeFile(path.join(LAYOUT_DIR, `${stem}.layout.json`), await (await slide.export({ format: "layout" })).text());
  }

  await writeBlob(path.join(PREVIEW_DIR, "contact-sheet.webp"), await presentation.export({ format: "webp", montage: true, scale: 1 }));
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(OUT);

  const inspect = await presentation.inspect({ kind: "slide,textbox,shape,image,layout", maxChars: 12000 });
  await fs.writeFile(path.join(QA_DIR, "inspect.ndjson"), inspect.ndjson);
  await fs.writeFile(
    path.join(QA_DIR, "visual-qa.txt"),
    [
      "PhysGaussian revised insertion QA",
      `Source: ${SOURCE}`,
      `Output: ${OUT}`,
      "Inserted slides: after original slide 9 (MPM grid velocity update, F^E update / return mapping), after original regularizer slide (Eq. 12 explanation).",
      "Existing slides were imported from the original deck and left otherwise unchanged.",
      "Rendered all final slides to preview PNG and contact sheet for inspection.",
    ].join("\n"),
  );
  console.log(OUT);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
