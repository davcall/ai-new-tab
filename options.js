(async function initOptions() {
  const urlInput = document.getElementById("url");
  const saveBtn = document.getElementById("save");
  const clearBtn = document.getElementById("clear");
  const statusEl = document.getElementById("status");
  const errorEl = document.getElementById("error");

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

  const settings = await getSettings();
  urlInput.value = settings.startUrl || "";
  const radio = document.querySelector(
    `input[name="mode"][value="${settings.openMode}"]`
  );
  if (radio) radio.checked = true;

  saveBtn.addEventListener("click", async () => {
    try {
      const mode =
        document.querySelector('input[name="mode"]:checked')?.value || "redirect";
      const next = await saveSettings({
        startUrl: urlInput.value,
        openMode: mode,
      });
      urlInput.value = next.startUrl;
      showStatus(next.startUrl ? `Saved: ${next.startUrl}` : "Saved (empty URL).");
    } catch (err) {
      showError(err.message || String(err));
    }
  });

  clearBtn.addEventListener("click", async () => {
    await saveSettings({ startUrl: "", openMode: "redirect" });
    urlInput.value = "";
    document.querySelector('input[name="mode"][value="redirect"]').checked = true;
    showStatus("Cleared. New tabs will show the setup screen.");
  });

  urlInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") saveBtn.click();
  });
})();
