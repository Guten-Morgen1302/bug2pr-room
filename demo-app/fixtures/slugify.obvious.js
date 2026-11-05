// The tempting patch: unicode-aware regex. Fixes bug #1, but rewrites v1 slugs ("Café" -> "café").
export function slugify(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}
