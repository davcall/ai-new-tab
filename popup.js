(async function initPopup() {
  const current = document.getElementById("current");
  const grid = document.getElementById("preset-grid");
  const customField = document.getElementById("custom-field");
  const urlInput = document.getElementById("url");
  const saveBtn = document.getElementById("save");
  const clearBtn = document.getElementById("clear");
  const settingsBtn = document.getElementById("settings");
  const statusEl = document.getElementById("status");
  const errorEl = document.getElementById("error");

  /** @type {string|null} */
  let selectedId = DEFAULTS.presetId;
  let openMode = DEFAULTS.openMode;

  function showStatus(message) {
    statusEl.textContent = message;
    statusEl.classList.remove("hidden");
    errorEl.classList.add("hidden");
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
    statusEl.classList.add("hidden");
  }

  function selectPreset(id) {
    selectedId = id;
    applyPresetSelection(grid, id);
    syncCustomFieldVisibility(customField, id);
    if (id === "custom") urlInput.focus();
  }

  function paint(settings) {
    selectedId =
      settings.presetId === PRESET_NONE ? null : settings.presetId;
    openMode = settings.openMode;
    urlInput.value = settings.customUrl || "";
    current.textContent = resolveLabel(settings);
    applyPresetSelection(grid, selectedId);
    syncCustomFieldVisibility(customField, selectedId);
    updateCustomCardPreview(grid, settings.customUrl || "");
  }

  renderPresetGrid(grid, {
    selectedId,
    customUrl: "",
    onSelect: selectPreset,
  });

  const settings = await getSettings();
  paint(settings);

  urlInput.addEventListener("input", () => {
    updateCustomCardPreview(grid, urlInput.value);
  });

  saveBtn.addEventListener("click", async () => {
    try {
      if (!selectedId || selectedId === PRESET_NONE) {
        showError("Pick an AI or Custom, or Clear for a blank tab.");
        return;
      }
      const next = await saveSettings({
        presetId: selectedId,
        customUrl: urlInput.value,
        openMode,
      });
      paint(next);
      showStatus("Saved. New tabs will use this.");
    } catch (err) {
      showError(err.message || String(err));
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", async () => {
      const next = await clearAllDefaults();
      paint(next);
      showStatus("Cleared. New tabs open blank.");
    });
  }

  settingsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
})();
