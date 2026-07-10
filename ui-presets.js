/**
 * Renders preset picker cards into #preset-grid.
 * Custom spans full width and shows truncated URL when configured.
 */

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function customSubtitle(customUrl) {
  const preview = truncateUrlPreview(customUrl);
  return preview || "Your URL";
}

/**
 * @param {HTMLElement} container
 * @param {{ selectedId?: string|null, customUrl?: string, onSelect?: (id: string) => void }} opts
 */
function renderPresetGrid(container, { selectedId, customUrl = "", onSelect } = {}) {
  container.innerHTML = "";
  PRESETS.forEach((preset) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "preset-card";
    if (preset.wide) btn.classList.add("preset-wide");
    btn.dataset.presetId = preset.id;
    btn.setAttribute("role", "radio");
    const active = selectedId && preset.id === selectedId;
    btn.setAttribute("aria-checked", active ? "true" : "false");
    if (active) btn.classList.add("selected");

    const sub =
      preset.id === "custom" ? customSubtitle(customUrl) : preset.subtitle;

    btn.innerHTML = `
      <span class="preset-label">${escapeHtml(preset.label)}</span>
      <span class="preset-sub muted">${escapeHtml(sub)}</span>
    `;

    btn.addEventListener("click", () => {
      onSelect?.(preset.id);
    });

    container.appendChild(btn);
  });
}

/**
 * Update selection highlight. Pass null / PRESET_NONE to deselect all.
 */
function applyPresetSelection(container, selectedId) {
  container.querySelectorAll(".preset-card").forEach((card) => {
    const active = Boolean(selectedId) &&
      selectedId !== PRESET_NONE &&
      card.dataset.presetId === selectedId;
    card.classList.toggle("selected", active);
    card.setAttribute("aria-checked", active ? "true" : "false");
  });
}

/**
 * Refresh the Custom card subtitle with the current URL (truncated).
 */
function updateCustomCardPreview(container, customUrl) {
  const card = container.querySelector('.preset-card[data-preset-id="custom"]');
  if (!card) return;
  const sub = card.querySelector(".preset-sub");
  if (sub) sub.textContent = customSubtitle(customUrl);
}

function syncCustomFieldVisibility(customField, presetId) {
  if (presetId === "custom") {
    customField.classList.remove("hidden");
  } else {
    customField.classList.add("hidden");
  }
}
