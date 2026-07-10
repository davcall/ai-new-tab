# Microsoft Edge Add-ons — listing copy (AI New Tab v2)

## Extension name
AI New Tab

## Short description (from manifest)
Open Grok, Claude, ChatGPT, Gemini, or any custom URL on every new tab instead of Edge's MSN feed.

## Full description (250+ chars)

Tired of Microsoft Edge opening a new tab full of MSN news and clutter?

**AI New Tab** lets you open the AI you actually use — or any site you want — every time you hit Ctrl+T.

### Built-in presets
- **Grok** (xAI) — grok.com
- **Claude** (Anthropic) — claude.ai
- **ChatGPT** (OpenAI) — chatgpt.com
- **Gemini** (Google) — gemini.google.com
- **Custom** — any https URL you choose

Switch from the toolbar popup in one click. Settings page for open mode (redirect vs embed).

### Transparency you can verify
Store packages are built from public source on GitHub, with SHA-256 checksums and GitHub Artifact Attestations (Sigstore). Verify a release with:

`gh attestation verify ai-new-tab.zip --repo davcall/edge-start-page`

Source and verify guide: https://github.com/davcall/edge-start-page

### Privacy
Only stores your preset/URL preference locally (browser sync storage). No analytics. No publisher backend.

### Note
This controls the **new tab** page. Edge Home/startup are separate under Settings → Start, home, and new tabs.

## Category
Productivity

## Website
https://github.com/davcall/edge-start-page

## Support
https://github.com/davcall/edge-start-page/issues

## Privacy Policy URL
https://davcall.github.io/edge-start-page/privacy.html

## Single purpose
Replace the Edge new-tab page with a user-selected AI assistant site (Grok, Claude, ChatGPT, Gemini) or a custom URL.

## Permission justification
**storage** — Save the selected preset, custom URL, and open mode so preferences persist.

## Remote code?
No. All extension code is in the package. Navigating to Grok/Claude/ChatGPT/custom is normal browser navigation.

## Search terms
new tab, AI, ChatGPT, Claude, Grok, Gemini, MSN, custom new tab, OpenAI, Anthropic, xAI, Google

## Notes for certification
1. Install → new tab should open Grok by default (or setup if custom incomplete).
2. Popup: switch to Claude, ChatGPT, Gemini, Custom.
3. Custom requires a valid https URL.
4. No login/backend.
5. Package should match GitHub Release `ai-new-tab.zip` for the submitted version (SHA-256 in release notes).

## Upload package
Use the **GitHub Release** asset `ai-new-tab.zip` for the version you submit — not a hand-zipped local folder — so attestation and store payload match.
