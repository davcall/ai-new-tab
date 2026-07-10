(async function initPopup() {
  const current = document.getElementById("current");
  const settingsBtn = document.getElementById("settings");

  const settings = await getSettings();
  current.textContent = settings.startUrl
    ? settings.startUrl
    : "Not set — open settings to choose a URL.";

  settingsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
})();
