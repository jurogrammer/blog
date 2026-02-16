export const STORAGE_KEY = "team-generator.state";

const STORAGE_VERSION = 2;

const DEFAULT_NAMES = [
  "Bruce",
  "Richard",
  "Jason",
  "Damian",
  "Alfred",
  "Lucius",
  "James",
  "Barbara",
  "Selina",
  "Pamela",
  "Harvey",
  "Rachel",
  "Oswald",
  "Edward",
  "Jonathan",
  "Tim",
].join("\n");

function defaultCategories() {
  return [
    {
      id: 1,
      title: "Category 1",
      text: DEFAULT_NAMES,
    },
  ];
}

export function createDefaultState() {
  return {
    version: STORAGE_VERSION,
    categories: defaultCategories(),
    nextCategoryId: 2,
    mode: "team-count",
    teamCount: 4,
    teamSize: 2,
    removeDuplicates: false,
    groups: [],
    tooltipDismissed: false,
  };
}

function sanitizeGroups(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((group) => Array.isArray(group))
    .map((group) =>
      group
        .map((name) => String(name || "").trim())
        .filter((name) => name.length > 0)
    )
    .filter((group) => group.length > 0);
}

function sanitizeCategories(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((category, index) => ({
    id: Number.isFinite(category?.id) ? category.id : index + 1,
    title: String(category?.title || "").trim() || `Category ${index + 1}`,
    text: String(category?.text || ""),
  }));
}

function migrateCategories(parsed, defaults) {
  const fromCategories = sanitizeCategories(parsed.categories);
  if (fromCategories.length > 0) {
    return fromCategories;
  }

  if (typeof parsed.namesText === "string") {
    return [
      {
        id: 1,
        title: "Category 1",
        text: parsed.namesText,
      },
    ];
  }

  return defaults.categories;
}

function resolveNextCategoryId(parsed, categories) {
  const maxId = categories.reduce((max, category) => Math.max(max, category.id), 0);
  const requested = Number.isFinite(parsed.nextCategoryId) ? parsed.nextCategoryId : 0;
  return Math.max(maxId + 1, requested, 2);
}

function parseStoredState(raw) {
  if (!raw) {
    return createDefaultState();
  }

  try {
    const parsed = JSON.parse(raw);
    const defaults = createDefaultState();
    const categories = migrateCategories(parsed, defaults);

    return {
      ...defaults,
      version: STORAGE_VERSION,
      categories: categories.length > 0 ? categories : defaults.categories,
      nextCategoryId: resolveNextCategoryId(parsed, categories.length > 0 ? categories : defaults.categories),
      mode: parsed.mode === "team-size" ? "team-size" : "team-count",
      teamCount: Number.isFinite(parsed.teamCount) ? parsed.teamCount : defaults.teamCount,
      teamSize: Number.isFinite(parsed.teamSize) ? parsed.teamSize : defaults.teamSize,
      removeDuplicates: Boolean(parsed.removeDuplicates),
      groups: sanitizeGroups(parsed.groups),
      tooltipDismissed: Boolean(parsed.tooltipDismissed),
    };
  } catch (error) {
    return createDefaultState();
  }
}

export function loadState() {
  if (typeof window === "undefined" || !window.localStorage) {
    return createDefaultState();
  }

  return parseStoredState(window.localStorage.getItem(STORAGE_KEY));
}

export function saveState(state) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  const categories = sanitizeCategories(state.categories);

  const payload = {
    version: STORAGE_VERSION,
    categories: categories.length > 0 ? categories : defaultCategories(),
    nextCategoryId: Number.parseInt(state.nextCategoryId, 10) || 2,
    mode: state.mode === "team-size" ? "team-size" : "team-count",
    teamCount: Number.parseInt(state.teamCount, 10) || 1,
    teamSize: Number.parseInt(state.teamSize, 10) || 1,
    removeDuplicates: Boolean(state.removeDuplicates),
    groups: sanitizeGroups(state.groups),
    tooltipDismissed: Boolean(state.tooltipDismissed),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
