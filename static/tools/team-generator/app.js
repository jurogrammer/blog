import { parseCategories, countParticipants } from "./parser.js";
import { fisherYatesShuffle } from "./shuffle.js";
import { allocateTeams } from "./allocator.js";
import { STORAGE_KEY, createDefaultState, loadState, saveState } from "./storage.js";
import { groupsToPlainText, renderError, renderGroups } from "./render.js";

const GROUPS_MOVE_HINT_STORAGE_KEY = "team-generator.groups-move-tooltip-dismissed";
const GROUPS_MOVE_HINT_STORAGE_VALUE = "1";

function toPositiveInteger(value, fallback = 1) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
}

function createCategory(id, index, text = "") {
  return {
    id,
    title: `Category ${index + 1}`,
    text: String(text || ""),
  };
}

function normalizeCategories(categories, nextIdRef) {
  if (!Array.isArray(categories) || categories.length === 0) {
    const fallback = createCategory(1, 0);
    nextIdRef.value = Math.max(nextIdRef.value, 2);
    return [fallback];
  }

  const normalized = categories.map((category, index) => ({
    id: Number.isFinite(category?.id) ? category.id : index + 1,
    title: String(category?.title || "").trim() || `Category ${index + 1}`,
    text: String(category?.text || ""),
  }));

  const maxId = normalized.reduce((max, category) => Math.max(max, category.id), 0);
  nextIdRef.value = Math.max(nextIdRef.value, maxId + 1, 2);
  return normalized;
}

function copyTextToClipboard(text) {
  if (!text) {
    return Promise.resolve(false);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => false);
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "absolute";
  helper.style.opacity = "0";
  document.body.appendChild(helper);
  helper.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }

  document.body.removeChild(helper);
  return Promise.resolve(copied);
}

function hasExistingToolState() {
  return typeof window !== "undefined" && Boolean(window.localStorage && window.localStorage.getItem(STORAGE_KEY));
}

function hasSeenGroupsMoveTooltip() {
  if (typeof window === "undefined" || !window.localStorage) {
    return true;
  }

  return window.localStorage.getItem(GROUPS_MOVE_HINT_STORAGE_KEY) === GROUPS_MOVE_HINT_STORAGE_VALUE;
}

function markGroupsMoveTooltipSeen() {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  window.localStorage.setItem(GROUPS_MOVE_HINT_STORAGE_KEY, GROUPS_MOVE_HINT_STORAGE_VALUE);
}

function initialize() {
  const root = document.querySelector("[data-team-generator]");
  if (!root) {
    return;
  }

  const form = root.querySelector("#team-generator-form");
  const categoriesContainer = root.querySelector("#categories-container");
  const addCategoryButton = root.querySelector("#add-category-btn");
  const modeSelect = root.querySelector("#mode-select");
  const teamCountInput = root.querySelector("#team-count-input");
  const teamSizeInput = root.querySelector("#team-size-input");
  const removeDuplicatesInput = root.querySelector("#remove-duplicates");
  const teamCountRow = root.querySelector("#team-count-row");
  const teamSizeRow = root.querySelector("#team-size-row");
  const resultsNode = root.querySelector("#group-results");
  const errorNode = root.querySelector("#team-error");
  const stageNode = root.querySelector("#team-stage");
  const tooltipNode = root.querySelector("[data-role='edit-tooltip']");
  const settingsPanel = root.querySelector("#settings-panel");
  const groupsMoveTooltip = root.querySelector("[data-role='groups-move-tooltip']");
  const groupsMoveTooltipClose = root.querySelector("[data-action='dismiss-groups-tip']");
  const rerunButtons = root.querySelectorAll("[data-action='rerun']");
  const editButtons = root.querySelectorAll("[data-action='edit']");
  const copyButton = root.querySelector("[data-action='copy']");
  const resetButton = root.querySelector("[data-action='reset']");

  function shouldShowGroupsMoveTooltip() {
    return hasExistingToolState() && !hasSeenGroupsMoveTooltip();
  }

  let state = loadState();

  function renderCategories() {
    categoriesContainer.replaceChildren();

    state.categories.forEach((category, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "tg-category-item";
      wrapper.dataset.categoryId = String(category.id);

      const header = document.createElement("div");
      header.className = "tg-category-header";

      const titleInput = document.createElement("input");
      titleInput.type = "text";
      titleInput.className = "tg-category-title-input";
      titleInput.value = category.title;
      titleInput.setAttribute("data-category-field", "title");
      titleInput.setAttribute("aria-label", `Category ${index + 1} title`);

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "tg-category-remove-btn";
      removeButton.textContent = "Delete";
      removeButton.setAttribute("data-action", "remove-category");
      removeButton.setAttribute("aria-label", `Delete ${category.title}`);
      if (index === 0) {
        removeButton.hidden = true;
      }

      const textarea = document.createElement("textarea");
      textarea.className = "tg-category-textarea";
      textarea.value = category.text;
      textarea.spellcheck = false;
      textarea.setAttribute("autocomplete", "off");
      textarea.setAttribute("data-category-field", "text");
      textarea.setAttribute("aria-label", `${category.title} names`);

      header.append(titleInput, removeButton);
      wrapper.append(header, textarea);
      categoriesContainer.appendChild(wrapper);
    });
  }

  function syncModeFieldVisibility() {
    const mode = modeSelect.value === "team-size" ? "team-size" : "team-count";
    teamCountRow.hidden = mode !== "team-count";
    teamSizeRow.hidden = mode !== "team-size";

    if (teamCountRow.hidden && groupsMoveTooltip) {
      groupsMoveTooltip.hidden = true;
      return;
    }

    if (shouldShowGroupsMoveTooltip() && groupsMoveTooltip) {
      groupsMoveTooltip.hidden = false;
    }
  }

  function flashStage() {
    stageNode.classList.remove("tg-stage--flash");
    void stageNode.offsetWidth;
    stageNode.classList.add("tg-stage--flash");
    window.setTimeout(() => stageNode.classList.remove("tg-stage--flash"), 320);
  }

  function persistState(partial = {}) {
    const nextIdRef = { value: Number.parseInt(String(state.nextCategoryId || 2), 10) || 2 };
    const mergedCategories = partial.categories ?? state.categories;
    const categories = normalizeCategories(mergedCategories, nextIdRef);

    state = {
      ...state,
      ...partial,
      categories,
      nextCategoryId: partial.nextCategoryId ?? nextIdRef.value,
      mode: modeSelect.value === "team-size" ? "team-size" : "team-count",
      teamCount: toPositiveInteger(teamCountInput.value, 1),
      teamSize: toPositiveInteger(teamSizeInput.value, 1),
      removeDuplicates: removeDuplicatesInput.checked,
    };

    saveState(state);
  }

  function applyStateToInputs() {
    const nextIdRef = { value: Number.parseInt(String(state.nextCategoryId || 2), 10) || 2 };
    state.categories = normalizeCategories(state.categories, nextIdRef);
    state.nextCategoryId = nextIdRef.value;

    modeSelect.value = state.mode;
    teamCountInput.value = String(toPositiveInteger(state.teamCount, 1));
    teamSizeInput.value = String(toPositiveInteger(state.teamSize, 1));
    removeDuplicatesInput.checked = Boolean(state.removeDuplicates);
    renderCategories();

    if (state.tooltipDismissed) {
      tooltipNode.hidden = true;
    }
  }

  function buildSettingsFromInputs() {
    return {
      mode: modeSelect.value === "team-size" ? "team-size" : "team-count",
      teamCount: toPositiveInteger(teamCountInput.value, 1),
      teamSize: toPositiveInteger(teamSizeInput.value, 1),
      removeDuplicates: removeDuplicatesInput.checked,
    };
  }

  function generateTeams() {
    const settings = buildSettingsFromInputs();
    const parsedCategories = parseCategories(state.categories, {
      removeDuplicates: settings.removeDuplicates,
    });

    if (countParticipants(parsedCategories) === 0) {
      renderError(errorNode, "Enter at least one name in any category to create teams.");
      renderGroups(resultsNode, []);
      persistState({ groups: [] });
      return;
    }

    const shuffledCategories = parsedCategories.map((category) => ({
      ...category,
      members: fisherYatesShuffle(category.members),
    }));

    const groups = allocateTeams(shuffledCategories, settings);
    renderError(errorNode, "");
    renderGroups(resultsNode, groups);
    flashStage();
    persistState({ groups });
  }

  function moveToEditor() {
    tooltipNode.hidden = true;
    if (groupsMoveTooltip) {
      groupsMoveTooltip.hidden = true;
      markGroupsMoveTooltipSeen();
    }
    persistState({ tooltipDismissed: true });
    settingsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    const firstTextarea = categoriesContainer.querySelector(".tg-category-textarea");
    if (firstTextarea) {
      firstTextarea.focus({ preventScroll: true });
    }
  }

  function updateCategoryField(categoryId, field, value) {
    const categories = state.categories.map((category, index) => {
      if (category.id !== categoryId) {
        return category;
      }

      if (field === "title") {
        const text = String(value || "");
        return {
          ...category,
          title: text.length > 0 ? text : `Category ${index + 1}`,
        };
      }

      return {
        ...category,
        text: String(value || ""),
      };
    });

    persistState({ categories });
  }

  function addCategory() {
    const nextId = Number.parseInt(String(state.nextCategoryId || 2), 10) || 2;
    const newCategory = createCategory(nextId, state.categories.length);
    const categories = [...state.categories, newCategory];
    persistState({
      categories,
      nextCategoryId: nextId + 1,
    });
    renderCategories();

    const addedTextarea = categoriesContainer.querySelector(`[data-category-id="${newCategory.id}"] .tg-category-textarea`);
    if (addedTextarea) {
      addedTextarea.focus();
    }
  }

  function removeCategory(categoryId) {
    const index = state.categories.findIndex((category) => category.id === categoryId);
    if (index <= 0) {
      return;
    }

    const categories = state.categories.filter((category) => category.id !== categoryId);
    persistState({ categories });
    renderCategories();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    generateTeams();
  });

  modeSelect.addEventListener("change", () => {
    syncModeFieldVisibility();
    persistState();
  });

  [teamCountInput, teamSizeInput, removeDuplicatesInput].forEach((field) => {
    field.addEventListener("input", () => persistState());
    field.addEventListener("change", () => persistState());
  });

  categoriesContainer.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const field = target.getAttribute("data-category-field");
    if (!field) {
      return;
    }

    const item = target.closest("[data-category-id]");
    if (!item) {
      return;
    }

    const categoryId = Number.parseInt(item.getAttribute("data-category-id"), 10);
    if (!Number.isFinite(categoryId)) {
      return;
    }

    updateCategoryField(categoryId, field, target.value);
  });

  categoriesContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const button = target.closest("[data-action='remove-category']");
    if (!button) {
      return;
    }

    const item = button.closest("[data-category-id]");
    if (!item) {
      return;
    }

    const categoryId = Number.parseInt(item.getAttribute("data-category-id"), 10);
    if (!Number.isFinite(categoryId)) {
      return;
    }

    removeCategory(categoryId);
  });

  addCategoryButton.addEventListener("click", addCategory);

  rerunButtons.forEach((button) => {
    button.addEventListener("click", generateTeams);
  });

  editButtons.forEach((button) => {
    button.addEventListener("click", moveToEditor);
  });

  copyButton.addEventListener("click", async () => {
    const copied = await copyTextToClipboard(groupsToPlainText(state.groups));
    renderError(errorNode, copied ? "Copied results to clipboard." : "Unable to copy. Try again.");
    if (copied) {
      window.setTimeout(() => renderError(errorNode, ""), 1800);
    }
  });

  resetButton.addEventListener("click", () => {
    state = createDefaultState();
    applyStateToInputs();
    syncModeFieldVisibility();
    renderError(errorNode, "");
    generateTeams();
  });

  if (groupsMoveTooltipClose) {
    groupsMoveTooltipClose.addEventListener("click", () => {
      if (groupsMoveTooltip) {
        groupsMoveTooltip.hidden = true;
      }
      markGroupsMoveTooltipSeen();
    });
  }

  applyStateToInputs();
  syncModeFieldVisibility();
  if (shouldShowGroupsMoveTooltip() && !teamCountRow.hidden && groupsMoveTooltip) {
    groupsMoveTooltip.hidden = false;
  }

  if (state.groups.length > 0) {
    renderGroups(resultsNode, state.groups);
  } else {
    renderGroups(resultsNode, []);
    generateTeams();
  }
}

document.addEventListener("DOMContentLoaded", initialize);
