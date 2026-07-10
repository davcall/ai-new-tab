/**
 * Renders preset picker cards into #preset-grid.
 * Call applyPresetSelection(id) to set UI state.
 */
function renderPresetGrid(container, { selectedId, onSelect } = {}) {
  container.innerHTML = "";
  PRESETS.forEach((preset) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "preset-card";
    btn.dataset.presetId = preset.id;
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", preset.id === selectedId ? "true" : "false");
    if (preset.id === selectedId) btn.classList.add("selected");

    btn.innerHTML = `
      <span class="preset-label">${preset.label}</span>
      <span class="preset-sub muted">${preset.subtitle}</span>
    `;

    btn.addEventListener("click", () => {
      onSelect?.(preset.id);
    });

    container.appendChild(btn);
  });
}

function applyPresetSelection(container, selectedId) {
  container.querySelectorAll(".preset-card").forEach((card) => {
    const active = card.dataset.presetId === selectedId;
    card.classList.toggle("selected", active);
    card.setAttribute("aria-checked", active ? "true" : "false");
  });
}

function syncCustomFieldVisibility(customField, presetId) {
  if (presetId === "custom") {
    customField.classList.remove("hidden");
  } else {
    customField.classList.add("hidden");
  }
}
