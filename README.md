# Customize New Tab to AI & More

Microsoft Edge extension that replaces the MSN new-tab feed with the AI you
actually use — **Grok**, **Claude**, **ChatGPT**, **Gemini** — or **any custom
URL**.

**Repo:** https://github.com/davcall/edge-start-page

## Tagline

> Replace Edge’s MSN new tab with Grok, Claude, ChatGPT, Gemini, or any custom URL. Switch anytime.

## Features

- One-click presets: Grok · Claude · ChatGPT · Gemini · Custom
- Full-width Custom button shows your URL (truncated when long)
- Toolbar popup for instant switching
- **Clear all defaults** → blank new tab (`about:blank`)
- Redirect mode (default) or embed (iframe) mode
- **Supply-chain transparency:** GitHub Actions builds a deterministic zip,
  publishes SHA-256, and attaches a **Sigstore-backed attestation**

## Install (development)

1. Open `edge://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → this folder
4. Open a new tab → pick your destination

## Install (store / verified release)

1. Download `ai-new-tab.zip` from
   [Releases](https://github.com/davcall/edge-start-page/releases)
2. Verify: see **[VERIFY.md](VERIFY.md)**
3. Upload that zip to Partner Center, or sideload after unpacking

## Package locally

```bash
python scripts/package.py
# dist/ai-new-tab.zip
# dist/ai-new-tab.zip.sha256
# dist/build-meta.json
```

## Release (signed transparency)

```bash
# after bumping version in manifest.json
git tag v2.3.0
git push origin v2.3.0
```

```bash
gh attestation verify ai-new-tab.zip --repo davcall/edge-start-page
```

## Edge limitation

Extensions can override **new tab** only. Home button and “open Edge with”
are set under **Settings → Start, home, and new tabs**.

## Privacy

No analytics. Only stores your preset choice / custom URL via `chrome.storage.sync`.  
Policy: https://davcall.github.io/edge-start-page/privacy.html

## License

MIT
