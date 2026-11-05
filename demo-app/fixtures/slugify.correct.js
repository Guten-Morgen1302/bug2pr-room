// The correct patch: v1 output is untouched; only an otherwise-empty slug gets a stable fallback.
export function slugify(title) {
  const v1 = String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (v1 !== '') return v1;
  let h = 5381;
  for (const ch of String(title)) h = ((h * 33) ^ ch.codePointAt(0)) >>> 0;
  return `untitled-${h.toString(36)}`;
}
