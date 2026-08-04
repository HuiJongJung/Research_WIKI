import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { Presentation } = await import(pathToFileURL(require.resolve("@oai/artifact-tool")).href);
const p = Presentation.create({ slideSize: { width: 1280, height: 720 } });
console.log(p.help("presentation.slides.insert", { include: ["index", "examples", "notes"], maxChars: 6000 }));
console.log("slides keys", Object.keys(p.slides));
console.log("add returns", p.slides.add());
console.log("insert fn", p.slides.insert?.toString?.().slice(0, 500));
