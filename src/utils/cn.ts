/**
 * Combines multiple class names into a single string,
 * filtering out falsy values like undefined, null, false, and empty strings.
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}