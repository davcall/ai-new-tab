# Custom Start Page (Edge)

Minimal **Manifest V3** Edge extension that replaces the default MSN new-tab feed with a URL you choose.

## Features

- Overrides Edge **new tab** page
- First open shows a setup form if no URL is saved
- Settings page + toolbar popup
- Two open modes:
  - **Redirect** (default, most reliable)
  - **Embed (iframe)** for sites that allow framing

## Install in Microsoft Edge

1. Open `edge://extensions`
2. Turn on **Developer mode** (bottom left)
3. Click **Load unpacked**
4. Select this folder:
   `C:\Users\dcall\Documents\dev\edge-start-page`
5. Open a new tab — set your preferred start URL (e.g. `https://duckduckgo.com`)
6. Change later via the extension icon → **Settings**, or right-click the extension → **Extension options**

## Pin it (optional)

On `edge://extensions`, enable the extension and pin it to the toolbar for quick access to the current URL / settings.

## Edge settings note

This extension owns the **new tab** page. Separately, Edge can still open MSN-ish content for:

- **Home button**
- **What to open when Edge starts**

Set those under **Settings → Start, home, and new tabs** if you want the same experience everywhere.

## Files

| File | Role |
|------|------|
| `manifest.json` | MV3 extension config + new-tab override |
| `newtab.html` / `newtab.js` | New tab page + first-run setup |
| `options.html` / `options.js` | Full settings page |
| `popup.html` / `popup.js` | Toolbar popup |
| `shared.js` | URL normalize + `chrome.storage.sync` |
| `styles.css` | Shared UI |
| `icons/` | Extension icons |

## Develop

Edit files in this folder, then on `edge://extensions` click **Reload** on the extension card. Open a new tab to test.
