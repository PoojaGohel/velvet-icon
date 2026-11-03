import { lookupIcon } from "./registry.ts";
import { renderIcon } from "./renderIcon.ts";
import type { IconName, IconOptions } from "./types.ts";

/**
 * Renders the icon identified by `name` as a self-contained SVG string,
 * customized by the given size, color, and stroke width.
 *
 * Looking icons up by name pulls in the full registry. For the smallest
 * bundles, import the icons you need and use {@link renderIcon} instead.
 */
export function getIcon(name: IconName, options: IconOptions = {}): string {
  return renderIcon(lookupIcon(name), options);
}
