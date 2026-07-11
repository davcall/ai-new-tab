# Submit to Microsoft Edge Add-ons

## Package for this release

Use **only** the GitHub Release asset (not a hand-zipped folder):

| File | Purpose |
|------|---------|
| `ai-new-tab.zip` | Upload to Partner Center |
| `ai-new-tab.zip.sha256` | Checksum |
| `build-meta.json` | Commit / version / file list |

**Release:** https://github.com/davcall/ai-new-tab/releases/latest  

**Website (store form):**  
https://davcall.github.io/ai-new-tab/  

**Privacy policy URL (store form):**  
https://davcall.github.io/ai-new-tab/privacy.html  

**Source / support:**  
https://github.com/davcall/ai-new-tab  
https://github.com/davcall/ai-new-tab/issues  

**Author:**  
https://www.linkedin.com/in/david-callaghan-4260a91/  


## Partner Center checklist

1. Sign in: https://partner.microsoft.com/dashboard/microsoftedge/overview  
2. Create new extension (or update existing)  
3. Upload `ai-new-tab.zip` from the latest GitHub Release  
4. Availability: Public, markets as desired  
5. Category: Productivity  
6. Privacy: no remote data collection by publisher; `storage` only for prefs  
7. Privacy policy URL: above  
8. Store listing: paste from `store/STORE_LISTING.md`  
9. Logo: `store/logo-300.png`  
10. Publish → wait for certification (~up to 7 business days)  

## Verify before upload

```bash
gh release download --repo davcall/ai-new-tab --pattern "ai-new-tab.zip*"
gh attestation verify ai-new-tab.zip --repo davcall/ai-new-tab
```

Full guide: [VERIFY.md](../VERIFY.md)
