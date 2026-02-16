const MEMBER_SPLITTER = /[\n,]+/;

function normalizeToken(token) {
  return token.trim();
}

function normalizeTitle(title, fallbackIndex) {
  const value = String(title || "").trim();
  if (value.length > 0) {
    return value;
  }
  return `Category ${fallbackIndex + 1}`;
}

function parseMembers(rawText) {
  return String(rawText || "")
    .split(MEMBER_SPLITTER)
    .map(normalizeToken)
    .filter((value) => value.length > 0);
}

export function parseCategories(rawCategories, options = {}) {
  const removeDuplicates = Boolean(options.removeDuplicates);
  const categories = Array.isArray(rawCategories) ? rawCategories : [];
  const seen = new Set();

  return categories
    .map((category, index) => {
      const members = parseMembers(category?.text);
      const dedupedMembers = removeDuplicates
        ? members.filter((name) => {
            const dedupeKey = name.toLocaleLowerCase();
            if (seen.has(dedupeKey)) {
              return false;
            }
            seen.add(dedupeKey);
            return true;
          })
        : members;

      return {
        id: Number.isFinite(category?.id) ? category.id : index + 1,
        title: normalizeTitle(category?.title, index),
        members: dedupedMembers,
      };
    })
    .filter((category) => category.members.length > 0);
}

export function countParticipants(parsedCategories) {
  if (!Array.isArray(parsedCategories)) {
    return 0;
  }

  return parsedCategories.reduce((total, category) => total + category.members.length, 0);
}
