# Verify what you install matches GitHub

**Extension:** AI New Tab: Claude, Gemini, ChatGPT, Grok or Custom URL

This project publishes a **deterministic** Edge extension zip built by
**GitHub Actions**, with a **SHA-256 checksum** and a **GitHub Artifact
Attestation** (Sigstore-backed provenance). That is how you can trust that the
file uploaded to Microsoft Edge Add-ons is the same bytes produced from this
repository.

> Microsoft Partner Center does not re-sign or replace your zip with a different
> payload when you publish — you upload the package, they review it. Our
> transparency story is: **same zip on GitHub Releases ↔ same zip to Microsoft**.

## What gets signed / attested

| Artifact | Purpose |
|----------|---------|
| `ai-new-tab.zip` | Extension package (upload this to Partner Center) |
| `ai-new-tab.zip.sha256` | SHA-256 of the zip |
| `build-meta.json` | Version, git commit, file list |
| GitHub attestation | Cryptographic provenance: built by this repo’s Actions from commit SHA |

Attestations use GitHub’s OIDC → Sigstore. **No long-lived private keys** are
stored in the repo. Verification proves:

1. The zip was built by a GitHub Actions workflow in `davcall/ai-new-tab`
2. Which commit produced it
3. The bytes have not been altered since attestation

## Quick verify (recommended)

Requires [GitHub CLI](https://cli.github.com/) (`gh`) authenticated optionally.

```bash
# Download the release assets (example version)
gh release download v2.0.0 --repo davcall/ai-new-tab \
  --pattern "ai-new-tab.zip*" \
  --pattern "build-meta.json"

# 1) Checksum
sha256sum -c ai-new-tab.zip.sha256
# Windows (PowerShell):
# (Get-FileHash ai-new-tab.zip -Algorithm SHA256).Hash.ToLower()
# Compare to the hash inside ai-new-tab.zip.sha256

# 2) Attestation / provenance
gh attestation verify ai-new-tab.zip --repo davcall/ai-new-tab
```

Expected: attestation verification **succeeds** and names this repository and
workflow.

## Verify against Microsoft store upload

When the publisher uploads to Partner Center, they must use the **exact**
`ai-new-tab.zip` from the matching GitHub Release.

Anyone can:

1. Download `ai-new-tab.zip` from the [Releases](https://github.com/davcall/ai-new-tab/releases) page
2. Note the SHA-256
3. Ask the publisher (or check release notes / store support text) to confirm
   the Partner Center package hash matches

If you obtained a zip from elsewhere, hash it and compare:

```bash
sha256sum path/to/mystery.zip
# must equal the release’s ai-new-tab.zip.sha256
```

## Build the package yourself (reproducible)

```bash
git clone https://github.com/davcall/ai-new-tab.git
cd ai-new-tab
git checkout v2.0.0   # or the release tag
python scripts/package.py
# → dist/ai-new-tab.zip + dist/ai-new-tab.zip.sha256
```

The SHA-256 should match the release asset for that tag (same OS-independent
normalization: sorted paths, fixed zip timestamps, LF line endings for text).

## How releases are cut

1. Bump `version` in `manifest.json`
2. Commit and tag: `git tag v2.0.0 && git push origin v2.0.0`
3. Workflow [`.github/workflows/release.yml`](.github/workflows/release.yml):
   - builds the zip
   - attests it with `actions/attest-build-provenance`
   - publishes a GitHub Release with zip + checksum + meta
4. Upload **that same** `ai-new-tab.zip` to Partner Center

## Trust boundaries (honest)

| Layer | What it proves |
|-------|----------------|
| GitHub attestation | Build came from this repo’s Actions at a given commit |
| SHA-256 | File integrity after download |
| Source code on GitHub | You can read what the extension does |
| Microsoft certification | Policy review by Edge Add-ons (separate process) |

This does **not** stop a malicious publisher from uploading a *different* zip to
Microsoft later — transparency only works if the published hash is checked.
Release notes always include the SHA-256; prefer installs from the store after
matching that hash, or sideload the verified GitHub zip.

## Privacy note

The extension itself does not phone home. Verification tools (`gh`, Sigstore)
contact GitHub/Sigstore only when *you* run verification.
