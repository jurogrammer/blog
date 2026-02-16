import { parseParticipants } from "./parser.js";
import { fisherYatesShuffle } from "./shuffle.js";
import { allocateTeams } from "./allocator.js";
import { createDefaultState, loadState, saveState } from "./storage.js";
import { groupsToPlainText, renderError, renderGroups } from "./render.js";

function toPositiveInteger(value, fallback = 1) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
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

function initialize() {
  const root = document.querySelector("[data-team-generator]");
  if (!root) {
    return;
  }

  const form = root.querySelector("#team-generator-form");
  const namesInput = root.querySelector("#names-input");
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
  const rerunButtons = root.querySelectorAll("[data-action='rerun']");
  const editButtons = root.querySelectorAll("[data-action='edit']");
  const copyButton = root.querySelector("[data-action='copy']");
  const resetButton = root.querySelector("[data-action='reset']");

  let state = loadState();

  function applyStateToInputs() {
    namesInput.value = state.namesText;
    modeSelect.value = state.mode;
    teamCountInput.value = String(toPositiveInteger(state.teamCount, 1));
    teamSizeInput.value = String(toPositiveInteger(state.teamSize, 1));
    removeDuplicatesInput.checked = Boolean(state.removeDuplicates);
    if (state.tooltipDismissed) {
      tooltipNode.hidden = true;
    }
  }

  function syncModeFieldVisibility() {
    const mode = modeSelect.value === "team-size" ? "team-size" : "team-count";
    teamCountRow.hidden = mode !== "team-count";
    teamSizeRow.hidden = mode !== "team-size";
  }

  function flashStage() {
    stageNode.classList.remove("tg-stage--flash");
    void stageNode.offsetWidth;
    stageNode.classList.add("tg-stage--flash");
    window.setTimeout(() => stageNode.classList.remove("tg-stage--flash"), 320);
  }

  function persistState(partial = {}) {
    state = {
      ...state,
      ...partial,
      namesText: namesInput.value,
      mode: modeSelect.value === "team-size" ? "team-size" : "team-count",
      teamCount: toPositiveInteger(teamCountInput.value, 1),
      teamSize: toPositiveInteger(teamSizeInput.value, 1),
      removeDuplicates: removeDuplicatesInput.checked,
    };
    saveState(state);
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
    const participants = parseParticipants(namesInput.value, {
      removeDuplicates: settings.removeDuplicates,
    });

    if (participants.length === 0) {
      renderError(errorNode, "Enter at least one name to create teams.");
      renderGroups(resultsNode, []);
      persistState({ groups: [] });
      return;
    }

    const shuffled = fisherYatesShuffle(participants);
    const groups = allocateTeams(shuffled, settings);
    renderError(errorNode, "");
    renderGroups(resultsNode, groups);
    flashStage();
    persistState({ groups });
  }

  function moveToEditor() {
    tooltipNode.hidden = true;
    persistState({ tooltipDismissed: true });
    settingsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    namesInput.focus({ preventScroll: true });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    generateTeams();
  });

  modeSelect.addEventListener("change", () => {
    syncModeFieldVisibility();
    persistState();
  });

  [namesInput, teamCountInput, teamSizeInput, removeDuplicatesInput].forEach((field) => {
    field.addEventListener("input", () => persistState());
    field.addEventListener("change", () => persistState());
  });

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

  applyStateToInputs();
  syncModeFieldVisibility();

  if (state.groups.length > 0) {
    renderGroups(resultsNode, state.groups);
  } else {
    renderGroups(resultsNode, []);
    generateTeams();
  }
}

document.addEventListener("DOMContentLoaded", initialize);
