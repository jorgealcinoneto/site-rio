#!/usr/bin/env python3
"""Rebuild index.html from the source files on disk.

index.html is a self-contained bundle: the .jsx sources are embedded in it as
gzip+base64 inside a manifest, and styles.css is inlined as a <style> block.
The page loads those embedded copies, never the files next to it. Editing a
source file therefore changes NOTHING on the live site until this script runs.

Run it after touching any file listed in SOURCES, then commit index.html
together with the source file. Skipping it is how icons.jsx silently shipped a
logo glow that existed in no commit for the entire life of the repo.

    python3 build.py            # rebuild
    python3 build.py --check    # report drift, change nothing (exit 1 if any)

NOT handled here, because they have no on-disk source and are edited directly
inside index.html: the site-styles <style> block (.site-nav__*, .hero-site__*,
.manifesto__*, .lider*), the meta tags, and the JSON-LD. If you touch those,
edit index.html itself.
"""
import base64
import gzip
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
INDEX = ROOT / "index.html"

# manifest uuid -> source file. The uuids are stable; the bundler only mints new
# ones when the bundle is regenerated from scratch.
SOURCES = {
    "b1528640-e76f-4677-a250-60b19c5d125e": "landing-app.jsx",
    "1a9e79dd-e808-4610-be96-d2a6b0d4403d": "icons.jsx",
}
# The inlined stylesheet is found by this marker rather than by position.
CSS_FILE = "styles.css"
CSS_MARKER = "IAR — Sistema Visual"

MANIFEST_RE = re.compile(r'(<script type="__bundler/manifest">)(.*?)(</script>)', re.S)
TEMPLATE_RE = re.compile(r'(<script type="__bundler/template">)(.*?)(</script>)', re.S)


def load(src):
    m = MANIFEST_RE.search(src)
    t = TEMPLATE_RE.search(src)
    if not m or not t:
        sys.exit("ERRO: index.html não tem os blocos manifest/template esperados")
    return m, json.loads(m.group(2).strip()), t, json.loads(t.group(2).strip())


def bundled_bytes(entry):
    raw = base64.b64decode(entry["data"])
    return gzip.decompress(raw) if entry.get("compressed") else raw


def css_blocks(tpl):
    return [b for b in re.findall(r"<style>(.*?)</style>", tpl, re.S) if CSS_MARKER in b[:200]]


def main():
    check = "--check" in sys.argv
    src = INDEX.read_text(encoding="utf-8")
    m, manifest, t, tpl = load(src)

    drift = []

    for uuid, name in SOURCES.items():
        if uuid not in manifest:
            sys.exit(f"ERRO: uuid {uuid} ({name}) sumiu do manifesto")
        disk = (ROOT / name).read_bytes()
        if bundled_bytes(manifest[uuid]) != disk:
            drift.append(name)
        if not check:
            # mtime=0 keeps the output reproducible across runs.
            manifest[uuid]["data"] = base64.b64encode(gzip.compress(disk, mtime=0)).decode("ascii")
            manifest[uuid]["compressed"] = True

    blocks = css_blocks(tpl)
    if len(blocks) != 1:
        sys.exit(f"ERRO: esperava 1 bloco <style> com '{CSS_MARKER}', achei {len(blocks)}")
    disk_css = (ROOT / CSS_FILE).read_text(encoding="utf-8")
    if blocks[0].strip() != disk_css.strip():
        drift.append(CSS_FILE)
    if not check:
        tpl = tpl.replace(f"<style>{blocks[0]}</style>", f"<style>{disk_css}</style>", 1)

    if check:
        if drift:
            print("DRIFT: bundle diverge do disco em: " + ", ".join(drift))
            print("Rode: python3 build.py")
            return 1
        print(f"OK: bundle em sincronia com {', '.join(list(SOURCES.values()) + [CSS_FILE])}")
        return 0

    new_manifest = json.dumps(manifest, ensure_ascii=False, separators=(",", ":"))
    # Escape '<' so the JSON string can't terminate the enclosing <script>.
    new_tpl = json.dumps(tpl, ensure_ascii=False).replace("<", "\\u003c")
    out = src[: m.start(2)] + new_manifest + src[m.end(2) : t.start(2)] + new_tpl + src[t.end(2) :]
    INDEX.write_text(out, encoding="utf-8")

    # Read back and prove the bundle now matches disk.
    m2, manifest2, _, tpl2 = load(INDEX.read_text(encoding="utf-8"))
    for uuid, name in SOURCES.items():
        assert bundled_bytes(manifest2[uuid]) == (ROOT / name).read_bytes(), f"{name} não bateu"
    assert css_blocks(tpl2)[0].strip() == disk_css.strip(), "styles.css não bateu"
    assert json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', tpl2, re.S).group(1))
    print(f"OK: {len(SOURCES)} fontes + {CSS_FILE} empacotados; {len(manifest2)} assets; JSON-LD válido")
    if drift:
        print("  corrigiu drift em: " + ", ".join(drift))
    return 0


sys.exit(main())
