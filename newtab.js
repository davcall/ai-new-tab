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
    selectedId = settings.presetId;
    urlInput.value = settings.customUrl || "";
    const mode = settings.openMode || "redirect";
    const radio = document.querySelector(`input[name="mode"][value="${mode}"]`);
    if (radio) radio.checked = true;
    applyPresetSelection(grid, selectedId);
    syncCustomFieldVisibility(customField, selectedId);
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
      document.title = getPreset(settings.presetId).label || "Start";
    }
  }

  renderPresetGrid(grid, {
    selectedId,
    onSelect: selectPreset,
  });

  const settings = await getSettings();
  const url = resolveStartUrl(settings);

  // First run / invalid custom → setup. Otherwise open immediately.
  if (url && isValidHttpUrl(url)) {
    navigate(settings);
  } else {
    showSetup(settings);
  }

  saveBtn.addEventListener("click", async () => {
    clearError();
    try {
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
