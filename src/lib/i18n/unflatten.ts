/** Converts a flat { "a.b.c": value } map into a nested { a: { b: { c: value } } } object. */
export function unflatten(flat: Record<string, string>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [path, value] of Object.entries(flat)) {
    const keys = path.split(".");
    let node = result;
    keys.forEach((key, i) => {
      if (i === keys.length - 1) {
        node[key] = value;
      } else {
        node[key] = (node[key] as Record<string, unknown>) ?? {};
        node = node[key] as Record<string, unknown>;
      }
    });
  }

  return result;
}
