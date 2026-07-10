/** Shared helpers for AI New Tab */

const PRESETS = [
  {
    id: "grok",
    label: "Grok",
    subtitle: "xAI",
    url: "https://grok.com",
  },
  {
    id: "claude",
    label: "Claude",
    subtitle: "Anthropic",
    url: "https://claude.ai",
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    subtitle: "OpenAI",
    url: "https://chatgpt.com",
  },
  {
    id: "gemini",
    label: "Gemini",
    subtitle: "Google",
    url: "https://gemini.google.com",
  },
  {
    id: "custom",
    label: "Custom",
    subtitle: "Your URL",
    url: "",
  },
];

const DEFAULTS = {
  presetId: "grok",
  customUrl: "",
  openMode: "redirect", // "redirect" | "iframe"
};

function getPreset(id) {
  return PRESETS.find((p) => p.id === id) || PRESETS[0];
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
 */
function resolveStartUrl(settings) {
  const preset = getPreset(settings.presetId);
  if (preset.id === "custom") {
    return settings.customUrl || "";
  }
  return preset.url;
}

/**
 * Human label for the current selection.
 */
function resolveLabel(settings) {
  const preset = getPreset(settings.presetId);
  if (preset.id === "custom") {
    return settings.customUrl ? `Custom · ${settings.customUrl}` : "Custom (not set)";
  }
  return `${preset.label} · ${preset.url}`;
}

/**
 * Migrate v1 settings (startUrl only) → v2 (presetId + customUrl).
 */
function migrateFromV1(stored) {
  if (stored.presetId) return null;
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
  const stored = await chrome.storage.sync.get({
    ...DEFAULTS,
    // legacy v1 key
    startUrl: "",
  });

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

  const presetId = PRESETS.some((p) => p.id === stored.presetId)
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
  const next = {
    presetId:
      partial.presetId !== undefined && PRESETS.some((p) => p.id === partial.presetId)
        ? partial.presetId
        : current.presetId,
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
  // Drop legacy key if still present
  await chrome.storage.sync.remove("startUrl");
  return next;
}

function openStartPage(settings) {
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
