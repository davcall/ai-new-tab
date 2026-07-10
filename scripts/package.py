#!/usr/bin/env python3
"""
Build a deterministic Edge/Chrome extension package (.zip).

Why deterministic?
  Store uploads and GitHub release assets should produce the same SHA-256 when
  built from the same commit (same file set, sorted paths, fixed timestamps).
  That hash is what we attest on GitHub so users can verify the store payload.

Usage:
  python scripts/package.py
  python scripts/package.py --out dist/ai-new-tab.zip
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path

# Fixed timestamp inside the zip (1980-01-01) so rebuilds don't change hashes.
ZIP_DATE_TIME = (1980, 1, 1, 0, 0, 0)

# Files that ship in the store package (paths relative to repo root).
PACKAGE_FILES = [
    "manifest.json",
    "newtab.html",
    "newtab.js",
    "options.html",
    "options.js",
    "popup.html",
    "popup.js",
    "shared.js",
    "ui-presets.js",
    "styles.css",
    "icons/icon16.png",
    "icons/icon32.png",
    "icons/icon48.png",
    "icons/icon128.png",
]


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def git_meta(root: Path) -> dict:
    def run(args: list[str]) -> str:
        try:
            out = subprocess.check_output(
                args, cwd=root, stderr=subprocess.DEVNULL, text=True
            )
            return out.strip()
        except (subprocess.CalledProcessError, FileNotFoundError):
            return ""

    return {
        "commit": run(["git", "rev-parse", "HEAD"]),
        "commit_short": run(["git", "rev-parse", "--short", "HEAD"]),
        "branch": run(["git", "rev-parse", "--abbrev-ref", "HEAD"]),
        "dirty": bool(run(["git", "status", "--porcelain"])),
        "describe": run(["git", "describe", "--tags", "--always", "--dirty"]),
    }


def build_zip(root: Path, out_path: Path, meta: dict) -> str:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    if out_path.exists():
        out_path.unlink()

    # Write build provenance into the package (not used at runtime; for auditors).
    provenance = {
        "name": "New Tab: Choose Claude, Gemini, ChatGPT, Grok or a Custom URL",
        "built_at_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "https://github.com/davcall/edge-start-page",
        "git": meta,
        "files": PACKAGE_FILES,
    }
    # Note: provenance includes wall-clock time, which would break determinism.
    # We deliberately EXCLUDE provenance from the hashed store zip for hash
    # stability. Instead we publish provenance next to the zip on GitHub Releases.

    missing = [f for f in PACKAGE_FILES if not (root / f).is_file()]
    if missing:
        raise SystemExit(f"Missing package files: {missing}")

    with zipfile.ZipFile(out_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for rel in sorted(PACKAGE_FILES):
            full = root / rel
            # Normalize path separators for zip (forward slashes).
            arcname = rel.replace("\\", "/")
            info = zipfile.ZipInfo(filename=arcname, date_time=ZIP_DATE_TIME)
            info.compress_type = zipfile.ZIP_DEFLATED
            # Fixed permissions: regular file
            info.external_attr = 0o644 << 16
            data = full.read_bytes()
            # Normalize line endings for text-like files so Windows/Linux match.
            if full.suffix.lower() in {".js", ".html", ".css", ".json", ".md", ".txt"}:
                text = data.decode("utf-8")
                text = text.replace("\r\n", "\n").replace("\r", "\n")
                data = text.encode("utf-8")
            zf.writestr(info, data)

    digest = hashlib.sha256(out_path.read_bytes()).hexdigest()
    return digest


def main() -> int:
    parser = argparse.ArgumentParser(description="Package New Tab extension")
    parser.add_argument(
        "--out",
        default="dist/ai-new-tab.zip",
        help="Output zip path (relative to repo root)",
    )
    parser.add_argument(
        "--meta-out",
        default="dist/build-meta.json",
        help="Write build metadata JSON next to the package",
    )
    args = parser.parse_args()

    root = repo_root()
    out_path = (root / args.out).resolve()
    meta_path = (root / args.meta_out).resolve()

    meta = git_meta(root)
    digest = build_zip(root, out_path, meta)

    manifest = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
    payload = {
        "extension_name": manifest.get("name"),
        "extension_version": manifest.get("version"),
        "package": str(out_path.relative_to(root)).replace("\\", "/"),
        "sha256": digest,
        "git": meta,
        "source_repository": "https://github.com/davcall/edge-start-page",
        "verify_docs": "https://github.com/davcall/edge-start-page/blob/main/VERIFY.md",
        "files": PACKAGE_FILES,
        "built_at_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    meta_path.parent.mkdir(parents=True, exist_ok=True)
    meta_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    # Companion checksum file (sha256sum format)
    sums_path = out_path.with_suffix(out_path.suffix + ".sha256")
    sums_path.write_text(
        f"{digest}  {out_path.name}\n", encoding="utf-8"
    )

    print(f"package:  {out_path}")
    print(f"sha256:   {digest}")
    print(f"meta:     {meta_path}")
    print(f"checksum: {sums_path}")
    if meta.get("dirty"):
        print("warning: working tree has uncommitted changes", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
