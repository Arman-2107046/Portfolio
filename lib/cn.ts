type ClassValue = string | number | false | null | undefined;

/**
 * Joins class names, dropping anything falsy.
 *
 * Deliberately not clsx or tailwind-merge: the layout primitives compose by
 * appending a `className` at the end, and Tailwind's own cascade order settles
 * the rest. A merge library would be a dependency bought to solve a conflict
 * this codebase does not create.
 */
export function cn(...values: ClassValue[]): string {
  let out = "";
  for (const value of values) {
    if (!value && value !== 0) continue;
    out = out ? `${out} ${value}` : String(value);
  }
  return out;
}
