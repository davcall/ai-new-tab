(async function initOptions() {
  const grid = document.getElementById("preset-grid");
  const customField = document.getElementById("custom-field");
  const urlInput = document.getElementById("url");
  const saveBtn = document.getElementById("save");
  const resetBtn = document.getElementById("reset");
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
    if (id === "custom") urlInput.focus();
  }

  renderPresetGrid(grid, {
    selectedId,
    onSelect: selectPreset,
  });

  const settings = await getSettings();
  selectedId = settings.presetId;
  urlInput.value = settings.customUrl || "";
  const radio = document.querySelector(
    `input[name="mode"][value="${settings.openMode}"]`
  );
  if (radio) radio.checked = true;
  applyPresetSelection(grid, selectedId);
  syncCustomFieldVisibility(customField, selectedId);

  saveBtn.addEventListener("click", async () => {
    try {
      const mode =
        document.querySelector('input[name="mode"]:checked')?.value || "redirect";
      const next = await saveSettings({
        presetId: selectedId,
        customUrl: urlInput.value,
        openMode: mode,
      });
      showStatus(`Saved: ${resolveLabel(next)}`);
    } catch (err) {
      showError(err.message || String(err));
    }
  });

  resetBtn.addEventListener("click", async () => {
    const next = await saveSettings({
      presetId: "grok",
      customUrl: "",
      openMode: "redirect",
    });
    selectedId = next.presetId;
    urlInput.value = "";
    document.querySelector('input[name="mode"][value="redirect"]').checked = true;
    applyPresetSelection(grid, selectedId);
    syncCustomFieldVisibility(customField, selectedId);
    showStatus(`Reset: ${resolveLabel(next)}`);
  });

  urlInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") saveBtn.click();
  });
})();
