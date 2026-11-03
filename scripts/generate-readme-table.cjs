const { readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const ROOT = join(__dirname, "..");
const ICONS_SOURCE = readFileSync(join(ROOT, "src", "generated", "icons.ts"), "utf-8");
const README_PATH = join(ROOT, "README.md");

const START_MARKER = "<!-- ICON_TABLE_START -->";
const END_MARKER = "<!-- ICON_TABLE_END -->";

const keyRegex = /^\s{2}(\w+): \{\n\s+viewBox: "([^"]+)",/gm;
const rows = [];
let match;
while ((match = keyRegex.exec(ICONS_SOURCE)) !== null) {
  rows.push({ name: match[1], viewBox: match[2] });
}

if (rows.length === 0) {
  throw new Error("[generate-readme-table] No icons found in src/generated/icons.ts");
}

const table = [
  "| Name | `IconName` | viewBox |",
  "| --- | --- | --- |",
  ...rows.map((r) => `| \`${r.name}\` | \`"${r.name}"\` | \`${r.viewBox}\` |`),
].join("\n");

const readme = readFileSync(README_PATH, "utf-8");
const startIdx = readme.indexOf(START_MARKER);
const endIdx = readme.indexOf(END_MARKER);

if (startIdx === -1 || endIdx === -1) {
  throw new Error("[generate-readme-table] Could not find icon table markers in README.md");
}

const updated =
  readme.slice(0, startIdx + START_MARKER.length) +
  "\n\n" +
  table +
  "\n\n" +
  readme.slice(endIdx);

writeFileSync(README_PATH, updated, "utf-8");
console.log(`[generate-readme-table] Wrote table for ${rows.length} icon(s) into README.md`);
