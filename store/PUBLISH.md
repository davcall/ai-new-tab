# Publish to Microsoft Edge Add-ons

I can’t complete Partner Center login/submission for you (it requires your
Microsoft account). Everything below is prepared so you can submit in ~15–30
minutes after the free developer registration.

**Fee:** $0 for the Microsoft Edge extensions program  
**Review:** typically up to ~7 business days  
**Dashboard:** https://partner.microsoft.com/dashboard/microsoftedge/overview

---

## 1. Register as an Edge extension developer (one-time)

1. Open https://partner.microsoft.com/dashboard/microsoftedge/public/login  
2. Sign in with a **personal Microsoft account** (Outlook/Live/Hotmail/MSA).  
   Work/school accounts are not accepted as Primary Owner.
3. Complete **Microsoft Edge Developer Account Registration**:
   - Country/region
   - Account type: **Individual** (simplest)
   - Publisher display name (shown on the store)
   - Accept the developer agreement
4. Wait for verification email if prompted.

Docs: https://learn.microsoft.com/microsoft-edge/extensions/publish/create-dev-account

---

## 2. Upload package

Package ready at:

`store/CustomStartPage-1.0.1.zip`

1. Partner Center → Edge workspace → **Create new extension**
2. Drag/drop the zip
3. Confirm name/description look right (they come from `manifest.json`)

---

## 3. Availability

- Visibility: **Public**
- Markets: all (default) unless you want to limit

---

## 4. Properties

| Field | Value |
|-------|--------|
| Category | Productivity |
| Website | https://github.com/davcall/edge-start-page |
| Support | https://github.com/davcall/edge-start-page/issues |
| Mature content | No |

---

## 5. Privacy (use `store/STORE_LISTING.md` for full paste text)

| Field | Answer |
|-------|--------|
| Single purpose | Replace Edge new tab with a user-chosen start URL |
| storage permission | Save start URL + open mode |
| Remote code | **No** |
| Data collected by publisher | **None** (only local browser storage) |
| Privacy policy URL | https://davcall.github.io/edge-start-page/privacy.html |

---

## 6. Store listing (English)

Assets in `store/`:

- `logo-300.png` (required)
- `promo-small-440x280.png` / `promo-large-1400x560.png` (optional)
- `screenshot-*.png` (optional placeholders — real screenshots from Edge are better)

Description + search terms: copy from `STORE_LISTING.md`.

Description must be **≥ 250 characters**.

---

## 7. Submit

1. **Publish**
2. Paste certification notes from `STORE_LISTING.md`
3. Wait for certification → status **In the Store**

---

## After it’s live

- Share the listing URL from Partner Center Overview  
- For updates: bump `version` in `manifest.json`, rebuild zip, upload new package
