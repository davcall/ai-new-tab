(async function initNewTab() {
  const setup = document.getElementById("setup");
  const frameWrap = document.getElementById("frame-wrap");
  const frame = document.getElementById("frame");
  const urlInput = document.getElementById("url");
  const errorEl = document.getElementById("error");
  const saveBtn = document.getElementById("save");
  const optionsBtn = document.getElementById("options");

  function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  function clearError() {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  }

  function showSetup(settings) {
    setup.classList.remove("hidden");
    frameWrap.classList.add("hidden");
    if (settings.startUrl) urlInput.value = settings.startUrl;
    const mode = settings.openMode || "redirect";
    const radio = document.querySelector(`input[name="mode"][value="${mode}"]`);
    if (radio) radio.checked = true;
    urlInput.focus();
  }

  function openStartPage(settings) {
    if (settings.openMode === "iframe") {
      setup.classList.add("hidden");
      frameWrap.classList.remove("hidden");
      frame.src = settings.startUrl;
      document.title = "Start";
      return;
    }
    // Full navigation — most sites work, no framing restrictions.
    location.replace(settings.startUrl);
  }

  const settings = await getSettings();
  // Prefer saved value; fall back to default (grok.com) so a fresh install
  // never lands on Edge's MSN tab.
  const url = settings.startUrl && isValidHttpUrl(settings.startUrl)
    ? settings.startUrl
    : DEFAULTS.startUrl;
  if (url && isValidHttpUrl(url)) {
    openStartPage({ ...settings, startUrl: url });
  } else {
    showSetup(settings);
  }

  saveBtn.addEventListener("click", async () => {
    clearError();
    try {
      const mode =
        document.querySelector('input[name="mode"]:checked')?.value || "redirect";
      const next = await saveSettings({
        startUrl: urlInput.value,
        openMode: mode,
      });
      if (!next.startUrl) {
        showError("Enter a URL first.");
        return;
      }
      openStartPage(next);
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
