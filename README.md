# AI New Tab

Microsoft Edge extension that replaces the MSN new-tab feed with the AI you
actually use — **Grok**, **Claude**, **ChatGPT**, or any **custom URL**.

**Repo:** https://github.com/davcall/edge-start-page  

## Features

- One-click presets: Grok · Claude · ChatGPT · Custom
- Toolbar popup for instant switching
- Options page + first-run setup when needed
- Redirect mode (default) or embed (iframe) mode
- **Supply-chain transparency:** GitHub Actions builds a deterministic zip,
  publishes SHA-256, and attaches a **Sigstore-backed attestation** so anyone
  can prove the store package came from this repo

## Install (development)

1. Open `edge://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → this folder
4. Open a new tab → pick your AI

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
git tag v2.0.0
git push origin v2.0.0
```

GitHub Actions will:

1. Build a **deterministic** zip  
2. **Attest** it (`actions/attest-build-provenance`)  
3. Publish a **Release** with zip + checksum + metadata  

Upload **only** the release’s `ai-new-tab.zip` to Microsoft Edge Add-ons.

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

MIT (see repository; add `LICENSE` if you want an explicit file).
