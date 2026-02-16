export const STORAGE_KEY = "team-generator.state";

const STORAGE_VERSION = 1;

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

export function createDefaultState() {
  return {
    version: STORAGE_VERSION,
    namesText: DEFAULT_NAMES,
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

function parseStoredState(raw) {
  if (!raw) {
    return createDefaultState();
  }

  try {
    const parsed = JSON.parse(raw);
    const defaults = createDefaultState();

    return {
      ...defaults,
      version: STORAGE_VERSION,
      namesText: typeof parsed.namesText === "string" ? parsed.namesText : defaults.namesText,
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

  const payload = {
    version: STORAGE_VERSION,
    namesText: String(state.namesText || ""),
    mode: state.mode === "team-size" ? "team-size" : "team-count",
    teamCount: Number.parseInt(state.teamCount, 10) || 1,
    teamSize: Number.parseInt(state.teamSize, 10) || 1,
    removeDuplicates: Boolean(state.removeDuplicates),
    groups: sanitizeGroups(state.groups),
    tooltipDismissed: Boolean(state.tooltipDismissed),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
