/** Joins class names, skipping empty ones. Small enough not to need a library. */
export function cx(...names: ReadonlyArray<string | false | null | undefined>): string {
  return names.filter(Boolean).join(' ');
}
