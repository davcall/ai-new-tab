(async function initOptions() {
  const grid = document.getElementById("preset-grid");
  const customField = document.getElementById("custom-field");
  const urlInput = document.getElementById("url");
  const saveBtn = document.getElementById("save");
  const doneBtn = document.getElementById("done");
  const clearBtn = document.getElementById("clear");
  const statusEl = document.getElementById("status");
  const errorEl = document.getElementById("error");

  /** @type {string|null} */
  let selectedId = DEFAULTS.presetId;

  /** Last settings written to storage (or loaded). Used for dirty checks. */
  let savedSnapshot = null;

  function closeOptionsPage() {
    window.close();
    setTimeout(() => {
      if (!document.hidden) {
        location.href = "about:blank";
      }
    }, 150);
  }

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

  function clearMessages() {
    statusEl.classList.add("hidden");
    errorEl.classList.add("hidden");
  }

  function currentOpenMode() {
    return (
      document.querySelector('input[name="mode"]:checked')?.value || "redirect"
    );
  }

  /**
   * Draft settings from the form (not necessarily saved).
   */
  function draftFromUi() {
    const presetId =
      !selectedId || selectedId === PRESET_NONE ? PRESET_NONE : selectedId;
    return {
      presetId,
      // Keep typed custom URL in the draft even if another preset is selected,
      // so switching back to Custom doesn't feel like a silent loss — but only
      // persist it when Custom is selected (see saveCurrent).
      customUrl: normalizeUrl(urlInput.value),
      openMode: currentOpenMode() === "iframe" ? "iframe" : "redirect",
    };
  }

  function snapshotsEqual(a, b) {
    if (!a || !b) return false;
    return (
      a.presetId === b.presetId &&
      (a.customUrl || "") === (b.customUrl || "") &&
      a.openMode === b.openMode
    );
  }

  /**
   * Compare UI to last saved snapshot.
   * When not on Custom, ignore custom URL text for dirty (unless saved was custom).
   */
  function isDirty() {
    if (!savedSnapshot) return false;
    const draft = draftFromUi();
    const saved = savedSnapshot;

    if (draft.presetId !== saved.presetId) return true;
    if (draft.openMode !== saved.openMode) return true;

    // Custom URL only matters when Custom is selected (draft or saved).
    if (draft.presetId === "custom" || saved.presetId === "custom") {
      if ((draft.customUrl || "") !== (saved.customUrl || "")) return true;
    }
    // Cleared vs any previous with custom text wiped in UI
    if (draft.presetId === PRESET_NONE && saved.presetId === PRESET_NONE) {
      return false;
    }
    return false;
  }

  function selectPreset(id) {
    selectedId = id;
    applyPresetSelection(grid, id);
    syncCustomFieldVisibility(customField, id);
    clearMessages();
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

  function markSaved(settings) {
    savedSnapshot = {
      presetId: settings.presetId,
      customUrl: settings.customUrl || "",
      openMode: settings.openMode === "iframe" ? "iframe" : "redirect",
    };
  }

  /**
   * Persist current form state.
   * - No preset selected → clear defaults (blank new tab)
   * - Custom / AI preset → saveSettings
   */
  async function saveCurrent() {
    const draft = draftFromUi();

    if (draft.presetId === PRESET_NONE) {
      const next = await clearAllDefaults();
      return next;
    }

    if (draft.presetId === "custom" && !draft.customUrl) {
      throw new Error("Enter a custom URL, e.g. https://example.com");
    }

    return saveSettings({
      presetId: draft.presetId,
      customUrl: draft.presetId === "custom" ? draft.customUrl : "",
      openMode: draft.openMode,
    });
  }

  const unsavedDialog = document.getElementById("unsaved-dialog");

  /**
   * One dialog, three choices: save | discard | continue
   * @returns {Promise<"save"|"discard"|"continue">}
   */
  function askUnsavedChanges() {
    return new Promise((resolve) => {
      unsavedDialog.classList.remove("hidden");

      const previouslyFocused = document.activeElement;
      const saveBtnEl = unsavedDialog.querySelector('[data-action="save"]');
      if (saveBtnEl) saveBtnEl.focus();

      function finish(choice) {
        unsavedDialog.classList.add("hidden");
        unsavedDialog.removeEventListener("click", onClick);
        document.removeEventListener("keydown", onKey);
        if (previouslyFocused && previouslyFocused.focus) {
          previouslyFocused.focus();
        }
        resolve(choice);
      }

      function onClick(event) {
        const action = event.target.closest("[data-action]")?.dataset?.action;
        if (action === "save" || action === "discard" || action === "continue") {
          finish(action);
        }
      }

      function onKey(event) {
        if (event.key === "Escape") {
          event.preventDefault();
          finish("continue");
        }
      }

      unsavedDialog.addEventListener("click", onClick);
      document.addEventListener("keydown", onKey);
    });
  }

  /** Close flow: clean → close; dirty → one popup with 3 options. */
  async function handleDone() {
    clearMessages();

    if (!isDirty()) {
      closeOptionsPage();
      return;
    }

    const choice = await askUnsavedChanges();

    if (choice === "continue") {
      return;
    }

    if (choice === "discard") {
      paint(savedSnapshot);
      closeOptionsPage();
      return;
    }

    // save
    try {
      const next = await saveCurrent();
      paint(next);
      markSaved(next);
      closeOptionsPage();
    } catch (err) {
      showError(err.message || String(err));
    }
  }

  renderPresetGrid(grid, {
    selectedId,
    customUrl: "",
    onSelect: selectPreset,
  });

  const settings = await getSettings();
  paint(settings);
  markSaved(settings);

  urlInput.addEventListener("input", () => {
    updateCustomCardPreview(grid, urlInput.value);
    clearMessages();
  });

  document.querySelectorAll('input[name="mode"]').forEach((el) => {
    el.addEventListener("change", () => clearMessages());
  });

  saveBtn.addEventListener("click", async () => {
    try {
      const next = await saveCurrent();
      paint(next);
      markSaved(next);
      showStatus(`Saved: ${resolveLabel(next)}`);
    } catch (err) {
      showError(err.message || String(err));
    }
  });

  doneBtn.addEventListener("click", () => {
    handleDone();
  });

  // Clear is UI-only until Save — so you can inspect without changing live behavior.
  clearBtn.addEventListener("click", () => {
    selectedId = null;
    urlInput.value = "";
    document.querySelector('input[name="mode"][value="redirect"]').checked = true;
    applyPresetSelection(grid, null);
    syncCustomFieldVisibility(customField, PRESET_NONE);
    updateCustomCardPreview(grid, "");
    showStatus(
      "Cleared in this form only — click Save to apply (blank new tabs), or Done to discard."
    );
  });

  urlInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") saveBtn.click();
  });
})();
