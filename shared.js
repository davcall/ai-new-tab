/** Shared helpers for Custom Start Page */

const DEFAULTS = {
  startUrl: "https://grok.com",
  openMode: "redirect", // "redirect" | "iframe"
};

/**
 * Normalize user input into a full URL.
 * Accepts "example.com", "https://example.com", etc.
 */
function normalizeUrl(raw) {
  const value = (raw || "").trim();
  if (!value) return "";

  try {
    // Already absolute
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

async function getSettings() {
  const stored = await chrome.storage.sync.get(DEFAULTS);
  return {
    startUrl: stored.startUrl || DEFAULTS.startUrl,
    openMode: stored.openMode === "iframe" ? "iframe" : "redirect",
  };
}

async function saveSettings(partial) {
  const current = await getSettings();
  const next = {
    startUrl:
      partial.startUrl !== undefined
        ? normalizeUrl(partial.startUrl)
        : current.startUrl,
    openMode:
      partial.openMode === "iframe" || partial.openMode === "redirect"
        ? partial.openMode
        : current.openMode,
  };

  if (next.startUrl && !isValidHttpUrl(next.startUrl)) {
    throw new Error("Enter a valid http(s) URL, e.g. https://news.ycombinator.com");
  }

  await chrome.storage.sync.set(next);
  return next;
}
