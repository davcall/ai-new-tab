# AI New Tab: Claude, Gemini, ChatGPT, Grok or Custom URL

Microsoft Edge extension that replaces the MSN new-tab feed with **Claude**,
**Gemini**, **ChatGPT**, **Grok**, or **any custom URL**.

**Repo:** https://github.com/davcall/ai-new-tab

## Tagline / store short description

> Replace Edge's MSN new tab with Claude, Gemini, ChatGPT, Grok, or any custom URL. Switch anytime.

## Features

- One-click presets: Claude · Gemini · ChatGPT · Grok · Custom
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
   [Releases](https://github.com/davcall/ai-new-tab/releases)
2. Verify: see **[VERIFY.md](VERIFY.md)**
3. Upload that zip to Partner Center, or sideload after unpacking

## Package locally

```bash
python scripts/package.py
```

## Release (signed transparency)

```bash
git tag v2.4.0
git push origin v2.4.0
```

```bash
gh attestation verify ai-new-tab.zip --repo davcall/ai-new-tab
```

## Edge limitation

Extensions can override **new tab** only. Home button and “open Edge with”
are set under **Settings → Start, home, and new tabs**.

## Privacy

No analytics. Only stores your preset choice / custom URL via `chrome.storage.sync`.  
Policy: https://davcall.github.io/ai-new-tab/privacy.html

## License

MIT
