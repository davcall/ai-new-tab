(async function initPopup() {
  const current = document.getElementById("current");
  const grid = document.getElementById("preset-grid");
  const customField = document.getElementById("custom-field");
  const urlInput = document.getElementById("url");
  const saveBtn = document.getElementById("save");
  const settingsBtn = document.getElementById("settings");
  const statusEl = document.getElementById("status");
  const errorEl = document.getElementById("error");

  let selectedId = DEFAULTS.presetId;

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
  }

  renderPresetGrid(grid, {
    selectedId,
    onSelect: selectPreset,
  });

  const settings = await getSettings();
  selectedId = settings.presetId;
  urlInput.value = settings.customUrl || "";
  current.textContent = resolveLabel(settings);
  applyPresetSelection(grid, selectedId);
  syncCustomFieldVisibility(customField, selectedId);

  saveBtn.addEventListener("click", async () => {
    try {
      const next = await saveSettings({
        presetId: selectedId,
        customUrl: urlInput.value,
        openMode: settings.openMode,
      });
      current.textContent = resolveLabel(next);
      showStatus("Saved. New tabs will use this.");
    } catch (err) {
      showError(err.message || String(err));
    }
  });

  settingsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
})();
