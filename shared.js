/** Shared helpers for AI New Tab */

/** No preset selected — new tabs open a blank page. */
const PRESET_NONE = "none";

const CUSTOM_URL_PREVIEW_MAX = 80;

// Order matches product name: Claude, Gemini, ChatGPT, Grok, Custom
const PRESETS = [
  {
    id: "claude",
    label: "Claude",
    subtitle: "Anthropic",
    url: "https://claude.ai",
  },
  {
    id: "gemini",
    label: "Gemini",
    subtitle: "Google",
    url: "https://gemini.google.com",
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    subtitle: "OpenAI",
    url: "https://chatgpt.com",
  },
  {
    id: "grok",
    label: "Grok",
    subtitle: "xAI",
    url: "https://grok.com",
  },
  {
    id: "custom",
    label: "Custom",
    subtitle: "Your URL",
    url: "",
    wide: true,
  },
];

const DEFAULTS = {
  // First AI in the product name after "Choose"
  presetId: "claude",
  customUrl: "",
  openMode: "redirect", // "redirect" | "iframe"
};

function isValidPresetId(id) {
  return id === PRESET_NONE || PRESETS.some((p) => p.id === id);
}

function getPreset(id) {
  return PRESETS.find((p) => p.id === id) || null;
}

/**
 * Truncate a URL for display on the Custom button.
 * Short URLs show in full; long ones keep the first ~80 chars + ellipsis.
 */
function truncateUrlPreview(url, maxLen = CUSTOM_URL_PREVIEW_MAX) {
  const value = (url || "").trim();
  if (!value) return "";
  if (value.length <= maxLen) return value;
  return `${value.slice(0, maxLen)}…`;
}

/**
 * Normalize user input into a full http(s) URL.
 * Accepts "example.com", "https://example.com", etc.
 */
function normalizeUrl(raw) {
  const value = (raw || "").trim();
  if (!value) return "";

  try {
    const absolute = new URL(value);
    if (absolute.protocol === "http:" || absolute.protocol === "https:") {
      return absolute.href;
    }
  } catch {
    // fall through
  }

  try {
    return new URL(`https://${value}`).href;
  } catch {
    return "";
  }
}

function isValidHttpUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Resolve the effective start URL from settings.
 * Returns "" when cleared (no preset) — caller opens a blank tab.
 */
function resolveStartUrl(settings) {
  if (!settings || settings.presetId === PRESET_NONE || !settings.presetId) {
    return "";
  }
  const preset = getPreset(settings.presetId);
  if (!preset) return "";
  if (preset.id === "custom") {
    return settings.customUrl || "";
  }
  return preset.url;
}

/**
 * Human label for the current selection.
 */
function resolveLabel(settings) {
  if (!settings || settings.presetId === PRESET_NONE || !settings.presetId) {
    return "None — blank new tab";
  }
  const preset = getPreset(settings.presetId);
  if (!preset) return "None — blank new tab";
  if (preset.id === "custom") {
    return settings.customUrl
      ? `Custom · ${truncateUrlPreview(settings.customUrl)}`
      : "Custom (not set)";
  }
  return `${preset.label} · ${preset.url}`;
}

/**
 * Migrate v1 settings (startUrl only) → v2 (presetId + customUrl).
 */
function migrateFromV1(stored) {
  // Only migrate when presetId was never written (v1 only had startUrl).
  if (Object.prototype.hasOwnProperty.call(stored, "presetId")) {
    return null;
  }
  if (!stored.startUrl) return null;

  const url = stored.startUrl;
  const match = PRESETS.find((p) => p.id !== "custom" && p.url === url);
  if (match) {
    return { presetId: match.id, customUrl: "", openMode: stored.openMode || "redirect" };
  }
  return {
    presetId: "custom",
    customUrl: url,
    openMode: stored.openMode || "redirect",
  };
}

async function getSettings() {
  // Read raw keys first so defaults don't hide v1 `startUrl`-only installs.
  const stored = await chrome.storage.sync.get([
    "presetId",
    "customUrl",
    "openMode",
    "startUrl",
  ]);

  const migrated = migrateFromV1(stored);
  if (migrated) {
    await chrome.storage.sync.set(migrated);
    await chrome.storage.sync.remove("startUrl");
    return {
      presetId: migrated.presetId,
      customUrl: migrated.customUrl || "",
      openMode: migrated.openMode === "iframe" ? "iframe" : "redirect",
    };
  }

  // First install: nothing stored → DEFAULTS (Grok).
  if (stored.presetId === undefined || stored.presetId === null) {
    return {
      presetId: DEFAULTS.presetId,
      customUrl: stored.customUrl || "",
      openMode: stored.openMode === "iframe" ? "iframe" : DEFAULTS.openMode,
    };
  }

  const presetId = isValidPresetId(stored.presetId)
    ? stored.presetId
    : DEFAULTS.presetId;

  return {
    presetId,
    customUrl: stored.customUrl || "",
    openMode: stored.openMode === "iframe" ? "iframe" : "redirect",
  };
}

async function saveSettings(partial) {
  const current = await getSettings();

  let presetId = current.presetId;
  if (partial.presetId !== undefined) {
    if (!isValidPresetId(partial.presetId)) {
      throw new Error("Invalid preset selection.");
    }
    presetId = partial.presetId;
  }

  const next = {
    presetId,
    customUrl:
      partial.customUrl !== undefined
        ? normalizeUrl(partial.customUrl)
        : current.customUrl,
    openMode:
      partial.openMode === "iframe" || partial.openMode === "redirect"
        ? partial.openMode
        : current.openMode,
  };

  if (next.presetId === "custom") {
    if (!next.customUrl) {
      throw new Error("Enter a custom URL, e.g. https://example.com");
    }
    if (!isValidHttpUrl(next.customUrl)) {
      throw new Error("Enter a valid http(s) URL, e.g. https://example.com");
    }
  }

  await chrome.storage.sync.set(next);
  await chrome.storage.sync.remove("startUrl");
  return next;
}

/**
 * Clear all defaults: no preset selected, custom URL wiped.
 * New tabs open a blank page (about:blank).
 */
async function clearAllDefaults() {
  const next = {
    presetId: PRESET_NONE,
    customUrl: "",
    openMode: "redirect",
  };
  await chrome.storage.sync.set(next);
  await chrome.storage.sync.remove("startUrl");
  return next;
}

/**
 * Open the configured start page, or a blank tab when cleared.
 * Returns false only when custom is selected but URL is missing/invalid
 * (caller should show setup). Blank (none) returns { mode: "blank" }.
 */
function openStartPage(settings) {
  if (!settings || settings.presetId === PRESET_NONE || !settings.presetId) {
    location.replace("about:blank");
    return { mode: "blank", url: "about:blank" };
  }

  const url = resolveStartUrl(settings);
  if (!url || !isValidHttpUrl(url)) {
    return false;
  }
  if (settings.openMode === "iframe") {
    return { mode: "iframe", url };
  }
  location.replace(url);
  return { mode: "redirect", url };
}
