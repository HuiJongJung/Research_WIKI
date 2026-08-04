import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { Presentation, PresentationFile } from "file:///C:/Users/jinsw712/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const ROOT = "C:/Users/jinsw712/Desktop/Files/Research_WIKI";
const TASK_SLUG = "physgaussian-simple-class-presentation";
const WORKSPACE = path.join(os.tmpdir(), "codex-presentations", "manual-physgaussian", TASK_SLUG);
const TMP_DIR = path.join(WORKSPACE, "tmp");
const PREVIEW_DIR = path.join(TMP_DIR, "preview");
const LAYOUT_DIR = path.join(TMP_DIR, "layout");
const QA_DIR = path.join(TMP_DIR, "qa");
const OUTPUT_DIR = path.join(ROOT, "outputs", "physgaussian-presentation");
const FINAL_PPTX = path.join(OUTPUT_DIR, "physgaussian-simple-class-presentation.pptx");

const W = 1280;
const H = 720;
const BLACK = "#000000";
const DARK = "#333333";
const MID = "#666666";
const LINE = "#BDBDBD";
const WHITE = "#FFFFFF";
const FONT = "Malgun Gothic";

async function ensureDirs() {
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(LAYOUT_DIR, { recursive: true });
  await fs.mkdir(QA_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

function addText(slide, text, left, top, width, height, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left, top, width, height },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    typeface: style.typeface ?? FONT,
    fontSize: style.fontSize ?? 24,
    bold: style.bold ?? false,
    color: style.color ?? BLACK,
    alignment: style.alignment ?? "left",
  };
  return shape;
}

function addTitle(slide, title, pageNo) {
  addText(slide, title, 72, 60, 1030, 56, { fontSize: 36, bold: true });
  slide.shapes.add({
    geometry: "line",
    position: { left: 72, top: 130, width: 1080, height: 0 },
    fill: "none",
    line: { style: "solid", fill: "#DDDDDD", width: 1 },
  });
  addText(slide, String(pageNo).padStart(2, "0"), 1168, 62, 42, 22, {
    fontSize: 12,
    color: MID,
    alignment: "right",
  });
}

function addFooter(slide, source = "PhysGaussian, arXiv:2311.12198v3") {
  addText(slide, source, 72, 674, 700, 20, { fontSize: 10, color: MID });
}

function addBullets(slide, bullets, left = 112, top = 180, width = 1000, gap = 72, fontSize = 25) {
  bullets.forEach((bullet, idx) => {
    const y = top + idx * gap;
    addText(slide, "•", left, y - 2, 26, 34, { fontSize, bold: true });
    addText(slide, bullet, left + 34, y, width - 34, 54, { fontSize, color: BLACK });
  });
}

function addPlaceholder(slide, label, left, top, width, height) {
  slide.shapes.add({
    geometry: "rect",
    position: { left, top, width, height },
    fill: WHITE,
    line: { style: "dash", fill: LINE, width: 1.5 },
  });
  addText(slide, `[그림 삽입 후보: ${label}]`, left + 22, top + height / 2 - 16, width - 44, 32, {
    fontSize: 18,
    color: MID,
    alignment: "center",
  });
}

function addNotes(slide, notes) {
  slide.speakerNotes.textFrame.setText(notes);
  slide.speakerNotes.setVisible(true);
}

function createSlide(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = WHITE;
  return slide;
}

const slides = [
  {
    kind: "cover",
    title: "PhysGaussian",
    subtitle: "Physics-Integrated 3D Gaussians for Generative Dynamics",
    line: "3D Gaussian을 rendering primitive이자 simulation particle로 사용하는 방법",
    notes: [
      "논문 링크는 arXiv:2311.12198v3입니다.",
      "한 줄 요약은 3D Gaussian을 rendering primitive이자 simulation particle로 동시에 사용하는 방법입니다.",
      "핵심 키워드는 What you see is what you simulate입니다.",
      "발표는 문제 설정, 배경, 핵심 아이디어, 방법 디테일, 실험, 한계 순서로 진행합니다.",
    ],
  },
  {
    title: "Contents",
    bullets: [
      "Problem",
      "Background: 3DGS / MPM",
      "Core Idea: WS2",
      "Method Overview",
      "Method Details",
      "Experiments",
      "Limitations",
    ],
    notes: [
      "목차에는 마지막 Thank you slide를 넣지 않습니다.",
      "앞부분은 청중이 3DGS와 MPM을 따라올 수 있도록 최소 배경을 잡습니다.",
      "중간부에서는 covariance update와 SH orientation을 핵심 디테일로 설명합니다.",
      "마지막에는 실험 결과와 limitation을 분리해 정리합니다.",
    ],
  },
  {
    title: "이 논문이 풀려는 문제",
    bullets: [
      "novel dynamics 생성은 기존 novel view synthesis보다 어렵다.",
      "기존 방법은 quasi-static shape editing이나 mesh/cage/tetrahedral proxy에 의존하는 경우가 많다.",
      "보이는 visual geometry와 실제 simulation geometry가 달라지면 mismatch가 생긴다.",
      "핵심 질문: 보이는 representation을 그대로 시뮬레이션할 수 있는가?",
    ],
    notes: [
      "문제상황은 novel dynamics generation입니다.",
      "기존 NeRF/GS editing은 quasi-static shape editing에 가까운 경우가 많고, 물리 simulation을 위해 mesh나 cage에 embedding하는 흐름이 자주 등장합니다.",
      "이때 보이는 것과 시뮬레이션하는 것이 달라지므로 resolution mismatch나 geometry mismatch가 생깁니다.",
      "PhysGaussian의 질문은 이 변환을 줄이고, 3D Gaussian 자체를 물리적으로 움직일 수 있느냐입니다.",
    ],
  },
  {
    title: "Background: 3D Gaussian Splatting",
    bullets: [
      "scene을 여러 3D Gaussian primitive 집합으로 표현한다.",
      "각 primitive는 position x, opacity σ, covariance A, SH coefficient C를 가진다.",
      "covariance는 Gaussian ellipsoid의 크기와 방향을 결정한다.",
      "SH coefficient는 view direction에 따른 색 변화, 즉 view-dependent appearance를 표현한다.",
    ],
    placeholder: "3DGS primitive / Eq. 1 rendering equation",
    notes: [
      "3DGS는 scene을 여러 Gaussian primitive의 집합으로 표현합니다.",
      "각 primitive는 position, opacity, covariance matrix, spherical harmonics coefficient를 가집니다.",
      "pixel color는 앞에서부터 보이는 Gaussian 색을 opacity 누적에 따라 alpha compositing하는 방식으로 계산됩니다.",
      "SH coefficient는 view direction에 따라 색이 달라지는 효과를 표현합니다.",
      "기존 dynamic 3DGS는 주로 video loss를 줄이는 data-driven deformation이지만, 이 논문은 continuum mechanics로 시간 변화를 계산하려고 합니다.",
    ],
  },
  {
    title: "Background: Material Point Method (MPM)",
    bullets: [
      "MPM은 continuum mechanics를 discrete particle + grid 계산으로 근사하는 방법이다.",
      "particle은 mass, position, velocity, deformation gradient 같은 상태 저장에 좋다.",
      "grid는 force, momentum update, collision 계산을 안정적으로 처리하기 좋다.",
      "PhysGaussian에서는 3DGS primitive 자체를 MPM particle로 사용한다.",
    ],
    notes: [
      "MPM은 연속체를 그대로 계산하기 어렵기 때문에 discrete particle과 Eulerian grid를 함께 쓰는 방법입니다.",
      "particle은 물질을 따라다니는 Lagrangian 관점이라 mass, position, deformation gradient를 저장하기 좋습니다.",
      "grid는 공간에 고정된 Eulerian 관점이라 force, gravity, collision, momentum update를 안정적으로 계산하기 좋습니다.",
      "이 논문에서는 3DGS primitive 자체를 particle로 쓰기 때문에 3DGS와 MPM이 자연스럽게 연결됩니다.",
      "MPM update에서 얻은 deformation gradient는 이후 Gaussian covariance를 F A F transpose 형태로 변형하는 데 사용됩니다.",
    ],
  },
  {
    title: "What You See Is What You Simulate",
    bullets: [
      "PhysGaussian의 핵심 철학은 rendering primitive와 simulation primitive를 통일하는 것이다.",
      "3D Gaussian에 velocity, strain, stress, plasticity 같은 물리 속성을 부여한다.",
      "Gaussian 자체를 MPM material particle처럼 사용한다.",
      "mesh extraction, tetrahedralization, cage embedding 없이 simulation과 rendering을 연결한다.",
    ],
    placeholder: "Fig. 1 WS2",
    notes: [
      "WS2는 What You See Is What You Simulate의 약자입니다.",
      "보이는 primitive와 시뮬레이션하는 primitive가 같아야 한다는 철학입니다.",
      "PhysGaussian은 3D Gaussian에 velocity, strain, elastic energy, stress, plasticity 같은 속성을 부여합니다.",
      "따라서 Gaussian은 rendering primitive이면서 동시에 MPM material particle이 됩니다.",
      "이 덕분에 mesh나 cage embedding 없이 reconstruction된 scene에도 physics-based dynamics를 적용할 수 있습니다.",
    ],
  },
  {
    title: "전체 Overview",
    bullets: [
      "Input images + camera info로 static 3DGS scene을 reconstruction한다.",
      "Optimization 단계에서 anisotropic loss로 너무 길쭉한 Gaussian을 줄인다.",
      "Kernel filling으로 object 내부에 particle을 채워 volume support를 만든다.",
      "Dynamics는 continuum mechanics + MPM/time integration으로 계산한다.",
      "Kinematics는 position, covariance, SH orientation을 Gaussian representation에 반영한다.",
    ],
    placeholder: "Fig. 2 Method Overview",
    notes: [
      "Fig. 2는 전체 방법을 한 장으로 보여줍니다.",
      "먼저 input image와 camera info로 static 3DGS scene을 reconstruction합니다.",
      "anisotropic loss는 너무 길쭉한 Gaussian이 생기는 것을 막아 이후 물리 변형 artifact를 줄이기 위한 항입니다.",
      "kernel filling은 표면 위주 Gaussian 분포를 volumetric simulation에 맞게 내부까지 보완하는 단계입니다.",
      "Physics Integration은 Dynamics와 Kinematics로 나눌 수 있습니다. Dynamics는 물리법칙에 따라 상태를 계산하고, Kinematics는 그 결과를 Gaussian position, covariance, SH orientation에 반영합니다.",
    ],
  },
  {
    title: "Center뿐 아니라 Stretch / Shear 반영",
    bullets: [
      "deformation map ϕ(X,t)는 material point X가 시간 t에 어디로 가는지 나타낸다.",
      "center update에는 ϕ(X,t)를 사용하면 된다.",
      "하지만 center만 움직이면 Gaussian 내부의 stretch, shear, rotation을 놓친다.",
      "deformation gradient F = ∇Xϕ(X,t)는 local deformation의 1차 정보를 담는다.",
      "따라서 F를 사용하면 Gaussian ellipsoid shape 자체를 변형할 수 있다.",
    ],
    notes: [
      "deformation map은 물체의 material space와 deformed space 사이의 대응 함수입니다.",
      "Gaussian center position은 deformation map을 따라 움직이면 됩니다.",
      "하지만 Gaussian은 점이 아니라 ellipsoid이므로, 주변이 얼마나 늘어나고 찌그러지고 회전하는지도 반영해야 합니다.",
      "이를 위해 deformation map을 미분한 deformation gradient F를 사용합니다.",
      "F는 stretch, shear, rotation을 담기 때문에 covariance update에 들어갈 수 있습니다.",
    ],
  },
  {
    title: "Covariance Update: Deformation Gradient",
    bullets: [
      "Gaussian 주변에서는 nonlinear deformation map을 local affine approximation으로 근사한다.",
      "ϕ(X,t) ≈ xₚ + Fₚ(X - Xₚ)",
      "식: aₚ(t) = Fₚ(t) Aₚ Fₚ(t)ᵀ",
      "affine transform을 Gaussian에 적용하면 Gaussian 형태가 유지된다.",
      "이 식이 PhysGaussian의 가장 중요한 technical bridge다.",
    ],
    placeholder: "Eq. 5-8 / covariance update 설명 그림",
    notes: [
      "물체 전체의 deformation map은 비선형일 수 있습니다.",
      "그런데 Gaussian 전체에 비선형 변환을 그대로 적용하면 변형 후 모양이 Gaussian이 아닐 수 있습니다.",
      "그래서 각 Gaussian이 충분히 작다고 보고, Gaussian 주변에서는 deformation map을 local affine approximation으로 근사합니다.",
      "affine transform은 Gaussian 형태를 유지하므로 covariance를 F A F transpose로 업데이트할 수 있습니다.",
      "이 식이 MPM에서 얻은 deformation gradient와 3DGS renderer가 요구하는 Gaussian primitive를 연결합니다.",
    ],
  },
  {
    title: "SH Orientation",
    bullets: [
      "3DGS color는 SH coefficient와 view direction으로 계산된다.",
      "Gaussian geometry가 회전해도 SH basis orientation은 자동으로 같이 회전하지 않는다.",
      "F를 polar decomposition해서 Fₚ = RₚSₚ로 나눈다.",
      "world-space view direction d 대신 Rₚᵀd를 SH에 넣는다.",
      "핵심 식: fᵗ(d) = f⁰(Rₚᵀ d)",
    ],
    notes: [
      "3DGS의 색은 SH coefficient와 view direction으로 계산됩니다.",
      "문제는 Gaussian geometry가 회전해도 SH basis나 coefficient가 자동으로 회전하지 않는다는 점입니다.",
      "GS framework에서는 SH basis가 hard-coded되어 있어 basis나 coefficient를 직접 회전시키기 어렵습니다.",
      "대신 deformation gradient를 polar decomposition해서 local rotation R을 얻고, world-space view direction d에 inverse rotation R transpose를 적용합니다.",
      "즉 같은 SH coefficient를 쓰지만 입력 direction을 local frame으로 되돌려 appearance가 물체와 함께 회전한 것처럼 만듭니다.",
    ],
  },
  {
    title: "Internal Filling",
    bullets: [
      "3DGS reconstruction은 visible surface 근처에 Gaussian이 분포하는 경향이 있다.",
      "그대로 MPM particle로 쓰면 object 내부가 hollow shell처럼 비어 있을 수 있다.",
      "opacity field d(x)를 3D grid로 discretize하고 threshold / ray test로 내부 cell을 찾는다.",
      "내부 particle은 nearest Gaussian의 opacity와 SH coefficient를 상속한다.",
      "covariance는 particle volume 기반 isotropic Gaussian으로 초기화한다.",
    ],
    placeholder: "Fig. 6 internal filling",
    notes: [
      "3DGS reconstruction은 보이는 surface appearance를 잘 맞추는 데 집중합니다.",
      "따라서 reconstructed Gaussian만 MPM particle로 사용하면 내부가 빈 shell처럼 될 수 있습니다.",
      "PhysGaussian은 Gaussian opacity와 covariance로 continuous opacity field를 만들고, 이를 grid에 discretize합니다.",
      "ray가 낮은 opacity에서 높은 opacity로 넘어가는 지점을 surface intersection으로 보고, 6축 ray casting과 추가 ray로 internal cell candidate를 찾습니다.",
      "내부 particle은 nearest Gaussian의 opacity와 SH coefficient를 상속하고, covariance는 isotropic하게 초기화합니다.",
    ],
  },
  {
    title: "Regularization",
    bullets: [
      "너무 길고 얇은 Gaussian은 큰 변형에서 surface 밖으로 튀어나오는 artifact를 만들 수 있다.",
      "PhysGaussian은 reconstruction training 중 anisotropy regularizer를 추가한다.",
      "장축/단축 scale ratio가 threshold r을 넘지 않도록 제한한다.",
      "목적은 static rendering quality만이 아니라 downstream dynamics robustness를 높이는 것이다.",
    ],
    placeholder: "Fig. 8 anisotropy artifact",
    notes: [
      "3DGS에서 anisotropic Gaussian은 표현 효율을 높일 수 있습니다.",
      "하지만 Gaussian을 simulation particle로도 사용하면 너무 길고 얇은 Gaussian이 문제가 됩니다.",
      "큰 변형 후 surface 밖으로 튀어나오거나 burr-like artifact를 만들 수 있기 때문입니다.",
      "그래서 논문은 reconstruction training 중 scale ratio가 threshold r을 넘지 않도록 regularizer를 추가합니다.",
    ],
  },
  {
    title: "실험 결과: 정성 + 정량",
    bullets: [
      "정성 결과: elastic, plastic metal, fracture, granular, viscoplastic paste 등 다양한 material behavior를 보여준다.",
      "정량 결과: BlenderNeRF 기반 lattice deformation benchmark에서 NeRF-Editing, Deforming-NeRF, PAC-NeRF와 비교한다.",
      "Table 1에서 Wolf/Stool/Plant의 bend/twist case 모두 PhysGaussian이 가장 높은 PSNR을 보고한다.",
      "Ablation은 Fixed Covariance, Rigid Covariance, Fixed Harmonics를 비교한다.",
      "핵심 해석: covariance와 SH orientation update가 full method의 중요한 구성요소다.",
    ],
    placeholder: "Fig. 3, Fig. 4, Fig. 5, Table 1",
    notes: [
      "실험은 정성 결과와 정량 결과로 나눠 설명합니다.",
      "정성적으로는 elastic object, plastic metal, fracture, granular material, viscoplastic paste 등 다양한 물성 움직임을 보여줍니다.",
      "정량적으로는 BlenderNeRF 기반 lattice deformation benchmark에서 NeRF-Editing, Deforming-NeRF, PAC-NeRF와 비교합니다.",
      "Table 1에서는 Wolf, Stool, Plant의 bend와 twist case에서 PhysGaussian이 가장 높은 PSNR을 보고합니다.",
      "Ablation은 Fixed Covariance, Rigid Covariance, Fixed Harmonics를 비교해 center-only나 rigid-only update가 부족하다는 점을 보여줍니다.",
    ],
  },
  {
    title: "Limitations",
    bullets: [
      "물성을 자동으로 알아내는 방법은 아니고, 사용자가 config로 직접 조정해야 한다.",
      "3DGS Gaussian의 opacity/covariance가 실제 mass, density, volume을 보장하지 않는다.",
      "shadow evolution과 복잡한 lighting 변화는 고려하지 않는다.",
      "internal filling은 heuristic이므로 thin/open/noisy geometry에서 실패할 수 있다.",
      "benchmark는 실제 physics ground truth 검증보다는 rendering fidelity 검증에 가깝다.",
    ],
    notes: [
      "마지막으로 한계를 정리합니다.",
      "가장 먼저, 물성을 자동으로 알아내는 방법이 아니라 사용자가 config로 직접 조정해야 합니다.",
      "또한 보이는 Gaussian이 실제 mass나 density를 의미한다고 보장할 수 없습니다.",
      "internal filling도 heuristic이고, benchmark도 물리 ground truth 검증이라기보다 rendering fidelity 검증에 가깝습니다.",
    ],
  },
  {
    kind: "thanks",
    title: "Thank you",
    subtitle: "Questions?",
    line: "Key idea: 3D Gaussians become both what we render and what we simulate.",
    notes: [
      "마지막 슬라이드는 질문을 받는 용도입니다.",
      "핵심 문장을 한 번 더 반복합니다.",
      "PhysGaussian의 핵심은 3D Gaussian이 렌더링 대상이면서 동시에 시뮬레이션 대상이 된다는 점입니다.",
    ],
  },
];

async function main() {
  await ensureDirs();
  const presentation = Presentation.create({ slideSize: { width: W, height: H } });

  slides.forEach((spec, idx) => {
    const slide = createSlide(presentation);
    const pageNo = idx + 1;

    if (spec.kind === "cover") {
      addText(slide, spec.title, 72, 150, 900, 72, { fontSize: 58, bold: true });
      addText(slide, spec.subtitle, 76, 246, 980, 40, { fontSize: 24, color: DARK });
      addText(slide, spec.line, 76, 344, 980, 50, { fontSize: 27, color: BLACK });
      addText(slide, "Tianyi Xie et al. · arXiv:2311.12198v3", 76, 610, 700, 28, { fontSize: 16, color: MID });
      addText(slide, "01", 1168, 62, 42, 22, { fontSize: 12, color: MID, alignment: "right" });
    } else if (spec.kind === "thanks") {
      addText(slide, spec.title, 72, 190, 900, 82, { fontSize: 60, bold: true });
      addText(slide, spec.subtitle, 76, 294, 900, 46, { fontSize: 36 });
      addText(slide, spec.line, 76, 610, 1060, 28, { fontSize: 18, color: DARK });
      addText(slide, "15", 1168, 62, 42, 22, { fontSize: 12, color: MID, alignment: "right" });
    } else {
      addTitle(slide, spec.title, pageNo);
      const hasPlaceholder = Boolean(spec.placeholder);
      if (hasPlaceholder) {
        addBullets(slide, spec.bullets, 102, 172, 650, 68, spec.bullets.length >= 5 ? 21 : 23);
        addPlaceholder(slide, spec.placeholder, 800, 196, 350, 260);
      } else {
        const gap = spec.bullets.length >= 5 ? 76 : 86;
        const fontSize = spec.bullets.length >= 5 ? 24 : 26;
        addBullets(slide, spec.bullets, 116, 182, 1000, gap, fontSize);
      }
      addFooter(slide);
    }

    addNotes(slide, spec.notes);
  });

  await writeSupportFiles();

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
    "- Rendered 15 slides to PNG.",
    "- Used pure white background and black text.",
    "- Did not insert paper figures or image media; figure locations are text placeholders.",
    "- Contents slide excludes Thank you.",
    "- Speaker notes were added to all 15 slides.",
    `- Final file size: ${stat.size} bytes.`,
  ].join("\n"), "utf8");

  console.log(JSON.stringify({
    finalPptx: FINAL_PPTX,
    workspace: WORKSPACE,
    slideCount: slides.length,
    bytes: stat.size,
  }, null, 2));
}

async function writeSupportFiles() {
  const slidePlan = [
    "PhysGaussian simple deck slide plan",
    "",
    "Style: pure white background, black text, simple bullets, no paper images.",
    "Slide count: 15.",
    "Contents slide excludes Thank you.",
    "",
    ...slides.map((slide, index) => `${index + 1}. ${slide.title}`),
  ].join("\n");
  await fs.writeFile(path.join(TMP_DIR, "slide-plan.txt"), slidePlan, "utf8");

  const sourceNotes = [
    "PhysGaussian simple presentation source notes",
    "",
    "Source paper: PhysGaussian: Physics-Integrated 3D Gaussians for Generative Dynamics",
    "Version: arXiv:2311.12198v3, 2024-04-15",
    "Local PDF: raw/papers/Physics-Integrated 3D Gaussians for Generative Dynamics.pdf",
    "",
    "No paper images are embedded in this simple deck.",
    "Figure placeholders indicate where the user can manually insert source figures.",
  ].join("\n");
  await fs.writeFile(path.join(TMP_DIR, "source-notes.txt"), sourceNotes, "utf8");
}

await main();
