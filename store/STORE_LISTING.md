# Microsoft Edge Add-ons — listing copy

Paste these into Partner Center during submission.

## Extension name
Custom Start Page

## Short description (from manifest)
Replace Edge's MSN new tab with a start page you choose.

## Full description (250+ chars)

Tired of Microsoft Edge opening a new tab full of MSN news, ads, and clutter?

**Custom Start Page** replaces Edge’s default new-tab experience with a website
you actually want—whether that’s Grok, your search engine, a dashboard, email,
or any other HTTPS page.

### What it does
- Overrides the **New Tab** page in Microsoft Edge
- Defaults to **https://grok.com** on first install (change anytime)
- Saves your preference with browser storage (syncs with your Edge profile if sync is on)
- Two open modes:
  - **Redirect** (recommended) — instantly opens your site
  - **Embed** — shows the site inside the new tab when the site allows framing

### How to use
1. Install the extension
2. Open a new tab
3. You’re taken to your start page (or a one-time setup if needed)
4. Change the URL anytime via the toolbar icon → Settings, or Extension options

### Privacy
This extension only stores the URL and open mode you set. It does not collect
analytics, does not sell data, and does not send your browsing data to the
publisher. See the Privacy Policy linked on this store page.

### Notes
- This controls the **new tab** page. Edge’s separate “Home button” and
  “Open Microsoft Edge with” startup settings can still be configured under
  Edge Settings → Start, home, and new tabs if you want the same URL there too.

## Category
Suggested: **Productivity** (or **Tools**)

## Website
https://github.com/davcall/edge-start-page

## Support contact
https://github.com/davcall/edge-start-page/issues

## Privacy Policy URL
https://davcall.github.io/edge-start-page/privacy.html

(If GitHub Pages is not enabled yet, use the raw path after enabling Pages:
Repository Settings → Pages → Deploy from branch `main` / root.)

## Single purpose description (Privacy form)
Replace the Microsoft Edge new-tab page with a user-configured start URL so the
user can open a preferred website (such as a search page or AI assistant)
instead of the default MSN feed.

## Permission justification
**storage** — Saves the user-selected start URL and open mode (redirect vs
iframe) so the preference persists across browser sessions.

## Remote code?
No. All extension code is packaged locally. Navigating to the user’s chosen
website is normal browser navigation, not remote code execution by the extension.

## Data usage
- Collects: none of the listed personal-data categories for publisher servers
- Stores locally only: start URL + open mode preference
- Certify: no selling data; no unexpected collection; disclosures match this policy

## Search terms
new tab, start page, homepage, MSN, replace new tab, custom new tab, grok,
productivity

## Notes for certification testers
1. Install the extension and open a new tab.
2. Expected: browser navigates to https://grok.com (default) or shows setup if
   storage was cleared.
3. Open Extension options, set start URL to https://example.com, save, open a
   new tab → should open example.com.
4. Switch open mode to “Embed” for a frame-friendly site if testing iframe path;
   redirect mode is the default and recommended path.
5. No account/login is required. No backend services.

## Assets in this folder
| File | Use |
|------|-----|
| `logo-300.png` | Extension logo (300×300) |
| `promo-small-440x280.png` | Small promotional tile |
| `promo-large-1400x560.png` | Large promotional tile |
| `screenshot-1280x800.png` | Screenshot (optional; placeholder mock) |
| `screenshot-640x480.png` | Screenshot alt size |
| `CustomStartPage-1.0.0.zip` | Upload package for Partner Center |
