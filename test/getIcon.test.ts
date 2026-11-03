import { test } from "node:test";
import assert from "node:assert/strict";
import { getIcon, icons, type IconName } from "../src/index.ts";

test("getIcon returns a well-formed SVG string with default options", () => {
  const svg = getIcon("home");

  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(svg, /width="24"/);
  assert.match(svg, /height="24"/);
  assert.match(svg, /stroke="currentColor"/);
  assert.match(svg, /stroke-width="2"/);
  assert.match(svg, /<\/svg>$/);
});

test("getIcon applies custom size, color, and stroke width", () => {
  const svg = getIcon("search", { size: 48, color: "#ff0000", strokeWidth: 1.5 });

  assert.match(svg, /width="48"/);
  assert.match(svg, /height="48"/);
  assert.match(svg, /stroke="#ff0000"/);
  assert.match(svg, /stroke-width="1\.5"/);
});

test("getIcon throws a clear error for an invalid icon name", () => {
  assert.throws(
    () => getIcon("does-not-exist" as IconName),
    /Unknown icon name: "does-not-exist"/,
  );
});

test("icons map contains all expected sample icons", () => {
  const names = Object.keys(icons);
  assert.ok(names.includes("arrowRight"));
  assert.ok(names.includes("check"));
  assert.ok(names.includes("close"));
  assert.ok(names.includes("home"));
  assert.ok(names.includes("search"));
});

test("every registered icon renders well-formed, non-empty SVG markup", () => {
  const names = Object.keys(icons) as IconName[];
  assert.ok(names.length > 0);

  for (const name of names) {
    const svg = getIcon(name);
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/, `${name} should start with <svg>`);
    assert.match(svg, /<\/svg>$/, `${name} should end with </svg>`);

    const { viewBox, path } = icons[name];
    assert.match(viewBox, /^-?\d+(\.\d+)? -?\d+(\.\d+)? \d+(\.\d+)? \d+(\.\d+)?$/, `${name} should have a valid viewBox`);
    assert.ok(path.trim().length > 0, `${name} should have non-empty inner markup`);
  }
});

test("no two icons share identical inner markup, aside from known aliases", () => {
  // Some icons are intentionally kept under two names (e.g. a library rename).
  // Anything NOT in this allowlist that collides is almost certainly a broken placeholder.
  // Same artwork published under two names by the merged source icon sets.
  const KNOWN_ALIASES = new Set(
    [
    ["accessibility2", "accessible"],
    ["adjustments", "equalizer2"],
    ["adjustmentsHorizontal", "equalizer"],
    ["alertCircle", "circleAlert"],
    ["arrowDownWideNarrow", "sortAsc"],
    ["arrowLeftEndOnRectangle", "arrowLeftOnRectangle"],
    ["arrowRightOnRectangle", "arrowRightStartOnRectangle"],
    ["banknote3", "cashBanknote"],
    ["barbell", "dumbbell2"],
    ["basket", "shoppingBasket"],
    ["blocks", "blocks2"],
    ["brandGo", "brandGolang"],
    ["brandPaypal", "brandPaypal2"],
    ["brandYoutube", "brandYoutube2"],
    ["bread", "breadSlice"],
    ["buildingHospital", "hospital2"],
    ["buildingLighthouse", "tower"],
    ["chartPie", "chartPie2"],
    ["circleUserRound", "userCircle"],
    ["clockStop", "stopwatch"],
    ["cocktail", "glassCocktail"],
    ["codeXml", "codeXml2"],
    ["crown2", "crown4"],
    ["cup", "cupStraw"],
    ["desktop", "deviceDesktop"],
    ["ellipsis", "moreHorizontal"],
    ["gitPullRequestCreate", "gitPullRequestCreateArrow"],
    ["grid", "layoutGrid"],
    ["history3", "historyToggle"],
    ["laugh", "moodHappy"],
    ["listCheck", "listChecks"],
    ["lockOpen", "unlock"],
    ["meh", "moodEmpty"],
    ["moodSmile", "smile"],
    ["shield2Game", "shieldCheckered"],
    ["shipping", "truckLoading"],
    ["store", "store3"],
    ["vectorBezier", "vectorBezier2"],
    ].map((pair) => pair.sort().join("|")),
  );

  const names = Object.keys(icons) as IconName[];
  const seen = new Map<string, string>();

  for (const name of names) {
    const key = icons[name].path.replace(/\s+/g, "");
    const collision = seen.get(key);
    if (collision !== undefined) {
      const pairKey = [collision, name].sort().join("|");
      assert.ok(
        KNOWN_ALIASES.has(pairKey),
        `"${name}" has identical markup to "${collision}" — one is likely a broken placeholder`,
      );
    }
    seen.set(key, name);
  }
});

test("renderIcon renders a per-icon export identically to getIcon by name", async () => {
  const mod = await import("../src/index.ts");
  assert.equal(mod.renderIcon(mod.homeIcon), getIcon("home"));
  assert.equal(
    mod.renderIcon(mod.searchIcon, { size: 48, color: "#ff0000", strokeWidth: 1.5 }),
    getIcon("search", { size: 48, color: "#ff0000", strokeWidth: 1.5 }),
  );
});

test("every registry entry has a matching `<name>Icon` named export", async () => {
  const mod = (await import("../src/index.ts")) as unknown as Record<string, unknown>;
  for (const name of Object.keys(icons)) {
    assert.equal(mod[`${name}Icon`], icons[name as IconName], `${name}Icon should be exported`);
  }
});
