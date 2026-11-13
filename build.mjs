import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";

const src = readFileSync("src/index.js", "utf8");
const names = ["parse", "isVideoId", "watchUrl", "shortUrl", "embedUrl", "thumbnails"];
const cjs = src
  .replace(/^export default .*$/m, "")
  .replace(/^export function /gm, "function ")
  + `\nmodule.exports = { ${names.join(", ")} };\nmodule.exports.default = module.exports;\n`;
mkdirSync("dist", { recursive: true });
writeFileSync("dist/index.cjs", cjs);
copyFileSync("src/index.js", "dist/index.js");
copyFileSync("src/index.d.ts", "dist/index.d.ts");
copyFileSync("src/index.js", "docs/yt-link-parser.js");
console.log("built dist/ and docs/yt-link-parser.js");
