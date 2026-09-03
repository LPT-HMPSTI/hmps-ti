/**
 * Converts any string into a clean, URL-safe slug.
 * Removes special non-alphanumeric characters, replaces spaces/underscores with hyphens,
 * and strips leading/trailing hyphens.
 *
 * @param text - The raw string to slugify.
 * @returns Clean, URL-safe slugified string.
 */
export const slugify = (text: string): string => {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
