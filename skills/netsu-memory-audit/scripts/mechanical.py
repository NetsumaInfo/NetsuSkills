#!/usr/bin/env python3
"""Mechanical rungs of a memory/docs audit: 1 (dead refs), 4 (dead links), 6 (recency).

Reads documents, extracts every reference that can be checked without judgement, and reports
the ones that do not resolve. Produces candidates, not verdicts: the skill decides.

Usage:
    python mechanical.py --level memory            # memory files only
    python mechanical.py --level docs              # README, docs/, ADRs, CHANGELOG
    python mechanical.py --level memory --level docs
    python mechanical.py --paths CLAUDE.md docs/   # explicit set instead of a level
    python mechanical.py --level docs --json       # machine-readable

Exit code is 0 even with findings: this is an audit, not a gate.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

LEVELS = {
    "memory": [
        "CLAUDE.md", "AGENTS.md", "MEMORY.md", ".claude/rules", ".claude/memory",
        "memory", ".cursorrules", ".github/copilot-instructions.md",
    ],
    "docs": [
        "README.md", "CONTRIBUTING.md", "CHANGELOG.md", "docs", "doc", "adr", "docs/adr",
    ],
}

# A path-looking token: has a slash or a known code extension, no spaces.
PATH_RE = re.compile(r"`([^`\s]*?(?:/[^`\s]+|\.(?:py|js|ts|tsx|jsx|mjs|cjs|go|rs|rb|java|kt|swift|sh|ps1|toml|ya?ml|json|md|sql|css|scss|html))[^`\s]*)`")
LINK_RE = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
COUNT_RE = re.compile(r"\b(\d{1,4})\s+(skills?|commands?|routes?|endpoints?|tools?|tests?|packages?|agents?|hooks?|scripts?|models?|components?)\b", re.I)
# Things that look like paths but are not: URLs, globs, placeholders.
SKIP_PREFIX = ("http://", "https://", "mailto:", "#", "<", "$", "~")


def run(args: list[str], cwd: Path) -> str:
    try:
        out = subprocess.run(args, cwd=cwd, capture_output=True, text=True, timeout=60)
    except (OSError, subprocess.TimeoutExpired):
        return ""
    return out.stdout if out.returncode == 0 else ""


def tracked_files(root: Path) -> set[str]:
    listing = run(["git", "ls-files"], root)
    return {line.strip().replace("\\", "/") for line in listing.splitlines() if line.strip()}


def last_commit_epoch(root: Path, rel: str) -> int | None:
    out = run(["git", "log", "-1", "--format=%ct", "--", rel], root).strip()
    return int(out) if out.isdigit() else None


def collect_documents(root: Path, levels: list[str], explicit: list[str]) -> list[Path]:
    seeds = explicit or [s for level in levels for s in LEVELS[level]]
    found: list[Path] = []
    for seed in seeds:
        target = root / seed
        if target.is_file():
            found.append(target)
        elif target.is_dir():
            found.extend(p for p in sorted(target.rglob("*.md")) if p.is_file())
    # Never audit the audit's own output.
    return [p for p in dict.fromkeys(found) if "docs/audit/" not in p.as_posix()]


def resolve(root: Path, doc: Path, raw: str, tracked: set[str]) -> bool:
    """True when the reference resolves, or is not ours to check.

    Precision beats recall here. A reference is only checked when it is unambiguously a path
    inside this repository: it contains a slash and its first segment exists at the root. Bare
    filenames (`SKILL.md`, `panel.js`), slash commands (`/plugin`), other repositories
    (`owner/name`) and schemeless hosts (`skills.sh/docs`) are not checkable from here, so they
    are passed. A false rung-1 finding costs more trust than a missed one buys.
    """
    ref = raw.split("#", 1)[0].split("?", 1)[0].strip().rstrip(".,;:)")
    ref = re.sub(r":\d+(-\d+)?$", "", ref)  # a file:line pointer
    if not ref or ref.startswith(SKIP_PREFIX) or "*" in ref or "<" in ref:
        return True
    normalised = ref.lstrip("./").replace("\\", "/")
    if "/" not in normalised:
        return True
    first = normalised.split("/", 1)[0]
    root_entries = {t.split("/", 1)[0] for t in tracked} | {p.name for p in root.iterdir()}
    if first not in root_entries:
        return True  # not a path into this repository
    if (root / normalised).exists() or (doc.parent / ref).exists():
        return True
    if normalised in tracked:
        return True
    prefix = normalised.rstrip("/") + "/"
    return any(t.startswith(prefix) for t in tracked)


def audit(root: Path, docs: list[Path], tracked: set[str]) -> list[dict]:
    findings: list[dict] = []
    now_sources = {d: last_commit_epoch(root, d.relative_to(root).as_posix()) for d in docs}

    for doc in docs:
        rel = doc.relative_to(root).as_posix()
        try:
            lines = doc.read_text(encoding="utf-8", errors="replace").splitlines()
        except OSError as exc:
            findings.append({"rung": 0, "file": rel, "line": 0, "kind": "unreadable", "detail": str(exc)})
            continue

        newest_referenced = 0
        for n, line in enumerate(lines, 1):
            for raw in PATH_RE.findall(line):
                if resolve(root, doc, raw, tracked):
                    stamp = last_commit_epoch(root, raw.lstrip("./"))
                    if stamp:
                        newest_referenced = max(newest_referenced, stamp)
                else:
                    findings.append({"rung": 1, "file": rel, "line": n, "kind": "dead-ref",
                                     "detail": raw, "quote": line.strip()[:200]})
            for raw in LINK_RE.findall(line):
                if not resolve(root, doc, raw, tracked):
                    findings.append({"rung": 4, "file": rel, "line": n, "kind": "dead-link",
                                     "detail": raw, "quote": line.strip()[:200]})
            for number, noun in COUNT_RE.findall(line):
                findings.append({"rung": 3, "file": rel, "line": n, "kind": "count-claim",
                                 "detail": f"{number} {noun}", "quote": line.strip()[:200]})

        doc_stamp = now_sources.get(doc)
        if doc_stamp and newest_referenced > doc_stamp:
            days = (newest_referenced - doc_stamp) // 86400
            findings.append({"rung": 6, "file": rel, "line": 0, "kind": "stale-by-recency",
                             "detail": f"referenced code is {days}d newer than this document"})
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--level", action="append", choices=sorted(LEVELS), default=[])
    parser.add_argument("--paths", nargs="*", default=[])
    parser.add_argument("--root", default=".")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not args.level and not args.paths:
        args.level = ["memory"]

    tracked = tracked_files(root)
    if not tracked:
        print("warning: no git index here - rungs 1, 4 and 6 run on the filesystem only",
              file=sys.stderr)

    docs = collect_documents(root, args.level, args.paths)
    if not docs:
        print("no documents found for that level", file=sys.stderr)
        return 0

    findings = audit(root, docs, tracked)
    findings.sort(key=lambda f: (f["rung"], f["file"], f["line"]))

    if args.json:
        json.dump({"root": str(root), "documents": len(docs), "findings": findings},
                  sys.stdout, indent=2)
        print()
        return 0

    print(f"{len(docs)} documents read under {root}\n")
    labels = {0: "unreadable", 1: "rung 1 - dead reference (critical)",
              3: "rung 3 - count to verify (moderate)", 4: "rung 4 - dead link (moderate)",
              6: "rung 6 - queue order only, NEVER a finding"}
    for rung in (0, 1, 4, 3, 6):
        bucket = [f for f in findings if f["rung"] == rung]
        if not bucket:
            continue
        print(f"## {labels[rung]}  ({len(bucket)})")
        for f in bucket:
            where = f"{f['file']}:{f['line']}" if f["line"] else f["file"]
            print(f"  {where}  {f['detail']}")
        print()
    if not findings:
        print("no mechanical findings. Rungs 2 and 5 still need a reading pass.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
