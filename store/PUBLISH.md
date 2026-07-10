# Publish AI New Tab (with transparency)

## 1. Cut a verified release on GitHub

```bash
# ensure main is clean and version bumped in manifest.json
git tag v2.0.0
git push origin v2.0.0
```

Wait for **Release package** workflow → GitHub Release includes:

- `ai-new-tab.zip` ← **upload this to Partner Center**
- `ai-new-tab.zip.sha256`
- `build-meta.json`

## 2. Partner Center

1. https://partner.microsoft.com/dashboard/microsoftedge/overview  
2. Create / update extension  
3. Upload **exactly** the release zip  
4. Listing copy: `store/STORE_LISTING.md`  
5. Privacy URL: https://davcall.github.io/ai-new-tab/privacy.html  

## 3. Announce the hash

In store support text or your site, publish:

- Release URL  
- SHA-256 of `ai-new-tab.zip`  
- Link to VERIFY.md  

## 4. Never

- Do not re-zip the folder by hand for store upload (breaks hash match)  
- Do not rebuild on a dirty tree for a “release” package  
