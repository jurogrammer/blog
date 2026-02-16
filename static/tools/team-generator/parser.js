const TOKEN_SPLITTER = /[\n,]+/;

function normalizeToken(token) {
  return token.trim();
}

export function parseParticipants(raw, options = {}) {
  const removeDuplicates = Boolean(options.removeDuplicates);
  const normalized = String(raw || "")
    .split(TOKEN_SPLITTER)
    .map(normalizeToken)
    .filter((value) => value.length > 0);

  if (!removeDuplicates) {
    return normalized;
  }

  const seen = new Set();
  const unique = [];

  normalized.forEach((value) => {
    const dedupeKey = value.toLocaleLowerCase();
    if (!seen.has(dedupeKey)) {
      seen.add(dedupeKey);
      unique.push(value);
    }
  });

  return unique;
}
