(async function initOptions() {
  const grid = document.getElementById("preset-grid");
  const customField = document.getElementById("custom-field");
  const urlInput = document.getElementById("url");
  const saveBtn = document.getElementById("save");
  const clearBtn = document.getElementById("clear");
  const statusEl = document.getElementById("status");
  const errorEl = document.getElementById("error");

  /** @type {string|null} */
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
    if (id === "custom") urlInput.focus();
  }

  function paint(settings) {
    selectedId =
      settings.presetId === PRESET_NONE ? null : settings.presetId;
    urlInput.value = settings.customUrl || "";
    const radio = document.querySelector(
      `input[name="mode"][value="${settings.openMode || "redirect"}"]`
    );
    if (radio) radio.checked = true;
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
        showError("Pick an AI or Custom, or use Clear all defaults for a blank tab.");
        return;
      }
      const mode =
        document.querySelector('input[name="mode"]:checked')?.value || "redirect";
      const next = await saveSettings({
        presetId: selectedId,
        customUrl: urlInput.value,
        openMode: mode,
      });
      paint(next);
      showStatus(`Saved: ${resolveLabel(next)}`);
    } catch (err) {
      showError(err.message || String(err));
    }
  });

  clearBtn.addEventListener("click", async () => {
    const next = await clearAllDefaults();
    // Deselect every preset radio; hide custom field; wipe URL
    selectedId = null;
    urlInput.value = "";
    document.querySelector('input[name="mode"][value="redirect"]').checked = true;
    applyPresetSelection(grid, null);
    syncCustomFieldVisibility(customField, PRESET_NONE);
    updateCustomCardPreview(grid, "");
    showStatus("Cleared. New tabs open a blank page.");
  });

  urlInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") saveBtn.click();
  });
})();
