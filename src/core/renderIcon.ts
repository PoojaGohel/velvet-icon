import type { IconDefinition, IconOptions } from "./types.ts";

const DEFAULT_SIZE = 24;
const DEFAULT_COLOR = "currentColor";
const DEFAULT_STROKE_WIDTH = 2;

/**
 * Renders an icon definition (e.g. `homeIcon`) as a self-contained SVG string.
 *
 * Unlike {@link getIcon}, this never touches the by-name registry, so importing
 * `renderIcon` plus the specific icons you use keeps your bundle tree-shaken:
 *
 * ```ts
 * import { renderIcon, homeIcon } from "velvet-icon";
 * renderIcon(homeIcon, { size: 32 });
 * ```
 */
export function renderIcon(icon: IconDefinition, options: IconOptions = {}): string {
  const { viewBox, path } = icon;
  const {
    size = DEFAULT_SIZE,
    color = DEFAULT_COLOR,
    strokeWidth = DEFAULT_STROKE_WIDTH,
  } = options;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}
