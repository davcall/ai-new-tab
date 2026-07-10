(async function initNewTab() {
  const setup = document.getElementById("setup");
  const frameWrap = document.getElementById("frame-wrap");
  const frame = document.getElementById("frame");
  const grid = document.getElementById("preset-grid");
  const customField = document.getElementById("custom-field");
  const urlInput = document.getElementById("url");
  const errorEl = document.getElementById("error");
  const saveBtn = document.getElementById("save");
  const optionsBtn = document.getElementById("options");

  /** @type {string|null} */
  let selectedId = DEFAULTS.presetId;

  function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  function clearError() {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  }

  function selectPreset(id) {
    selectedId = id;
    applyPresetSelection(grid, id);
    syncCustomFieldVisibility(customField, id);
    if (id === "custom") urlInput.focus();
  }

  function showSetup(settings) {
    setup.classList.remove("hidden");
    frameWrap.classList.add("hidden");
    selectedId =
      settings.presetId === PRESET_NONE ? null : settings.presetId;
    urlInput.value = settings.customUrl || "";
    const mode = settings.openMode || "redirect";
    const radio = document.querySelector(`input[name="mode"][value="${mode}"]`);
    if (radio) radio.checked = true;
    applyPresetSelection(grid, selectedId);
    syncCustomFieldVisibility(customField, selectedId);
    updateCustomCardPreview(grid, settings.customUrl || "");
  }

  function navigate(settings) {
    const result = openStartPage(settings);
    if (!result) {
      showSetup(settings);
      return;
    }
    if (result.mode === "iframe") {
      setup.classList.add("hidden");
      frameWrap.classList.remove("hidden");
      frame.src = result.url;
      const preset = getPreset(settings.presetId);
      document.title = (preset && preset.label) || "Start";
    }
    // blank + redirect already navigated via location.replace
  }

  renderPresetGrid(grid, {
    selectedId,
    customUrl: "",
    onSelect: selectPreset,
  });

  urlInput.addEventListener("input", () => {
    updateCustomCardPreview(grid, urlInput.value);
  });

  const settings = await getSettings();

  // Cleared → blank tab immediately. Valid URL → open it. Else setup UI.
  if (settings.presetId === PRESET_NONE || !settings.presetId) {
    openStartPage(settings);
  } else {
    const url = resolveStartUrl(settings);
    if (url && isValidHttpUrl(url)) {
      navigate(settings);
    } else {
      showSetup(settings);
    }
  }

  saveBtn.addEventListener("click", async () => {
    clearError();
    try {
      if (!selectedId || selectedId === PRESET_NONE) {
        showError("Pick an AI or Custom before saving.");
        return;
      }
      const mode =
        document.querySelector('input[name="mode"]:checked')?.value || "redirect";
      const next = await saveSettings({
        presetId: selectedId,
        customUrl: urlInput.value,
        openMode: mode,
      });
      navigate(next);
    } catch (err) {
      showError(err.message || String(err));
    }
  });

  urlInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") saveBtn.click();
  });

  optionsBtn.addEventListener("click", () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      location.href = "options.html";
    }
  });
})();
