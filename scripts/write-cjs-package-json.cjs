const { writeFileSync, mkdirSync } = require("node:fs");
const { join } = require("node:path");

const dir = join(__dirname, "..", "dist", "cjs");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "package.json"), JSON.stringify({ type: "commonjs" }, null, 2) + "\n");
console.log("[build] Wrote dist/cjs/package.json");
