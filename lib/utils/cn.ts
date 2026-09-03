import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple Tailwind CSS class names cleanly, resolving conflicts using tailwind-merge.
 *
 * @param inputs - Class values, conditionally enabled classes, objects, or arrays.
 * @returns Clean, deduplicated Tailwind CSS class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
