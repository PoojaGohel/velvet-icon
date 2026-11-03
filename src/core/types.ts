export type { IconName } from "../generated/icons.ts";

/** Raw icon data extracted from an SVG source file. */
export interface IconDefinition {
  /** The `viewBox` attribute copied from the source SVG. */
  viewBox: string;
  /** The inner markup of the source SVG (everything between `<svg>` and `</svg>`). */
  path: string;
}

/** Customization options accepted by {@link getIcon}. */
export interface IconOptions {
  /** Width/height, in pixels, applied to the rendered `<svg>`. Defaults to `24`. */
  size?: number;
  /** Value applied to `stroke` and `color`. Defaults to `currentColor`. */
  color?: string;
  /** Value applied to `stroke-width`. Defaults to `2`. */
  strokeWidth?: number;
}
