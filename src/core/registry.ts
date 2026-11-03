import { icons } from "../generated/icons.ts";
import type { IconDefinition, IconName } from "./types.ts";

/** Returns the raw icon definition for `name`, throwing if it isn't registered. */
export function lookupIcon(name: IconName): IconDefinition {
  const icon = (icons as Record<string, IconDefinition>)[name];

  if (!icon) {
    const available = Object.keys(icons).join(", ");
    throw new Error(
      `[velvet-icon] Unknown icon name: "${name}". Available icons: ${available}`,
    );
  }

  return icon;
}
