#!/usr/bin/env python3
"""Atualiza folhetos litúrgicos com textos da API Estêvão.

Busca cabeçalho, coleta e leituras bíblicas em build time e injeta
nos HTMLs entre marcadores <!-- estevao:... -->.

Uso:
    python3 build_folheto.py 2026-07-26
    python3 build_folheto.py --all
    python3 build_folheto.py --all --sync-index
    python3 build_folheto.py --preview 2026-08-02
    python3 build_folheto.py --preview 2026-08-02 --json
    python3 build_folheto.py --preview 2026-08-02 --html

Requer ESTEVAO_API_KEY em .env ou variável de ambiente.
"""
from __future__ import annotations

import html
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent
FOLHETOS = ROOT / "folhetos"
API_BASE = "https://api.caminhoanglicano.com.br/api/v1"
PRAYER_BOOK = "loc_2015"
BIBLE_VERSION = "nvi"

MESES = [
    "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
    "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO",
]

COR_EMOJI = {
    "verde": "🟢",
    "branco": "⚪",
    "roxo": "🟣",
    "vermelho": "🔴",
    "rosa": "🌸",
}

MARKER = re.compile(
    r"<!-- estevao:(\w+) -->(.*?)<!-- /estevao:\1 -->",
    re.S,
)


def load_api_key() -> str:
    key = os.environ.get("ESTEVAO_API_KEY", "").strip()
    if key:
        return key
    env_file = ROOT / ".env"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("ESTEVAO_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("ERRO: defina ESTEVAO_API_KEY em .env ou no ambiente")


def fetch_calendar(d: date, api_key: str) -> dict:
    prefs = json.dumps(
        {"prayer_book_code": PRAYER_BOOK, "bible_version": BIBLE_VERSION},
        separators=(",", ":"),
    )
    url = (
        f"{API_BASE}/calendar/{d.year}/{d.month:02d}/{d.day:02d}"
        f"?preferences={urllib.parse.quote(prefs)}"
    )
    req = urllib.request.Request(url, headers={"X-API-Key": api_key})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        sys.exit(f"ERRO API {e.code}: {body}")
    except urllib.error.URLError as e:
        sys.exit(f"ERRO de rede: {e.reason}")


def fmt_ref(reference: str, translation: str, label: str) -> str:
    ref = reference.replace(":", ".")
    return f"{ref} · {translation.upper()} · {label}"


def verses_to_paragraphs(verses: list[dict], per_para: int = 4) -> list[str]:
    if not verses:
        return []
    chunks: list[list[str]] = []
    current: list[str] = []
    for v in verses:
        text = v.get("text", "").strip()
        if not text:
            continue
        if current and text[0].isupper() and len(current) >= 2:
            chunks.append(current)
            current = []
        current.append(text)
        if len(current) >= per_para:
            chunks.append(current)
            current = []
    if current:
        chunks.append(current)
    paragraphs = []
    for chunk in chunks:
        joined = " ".join(chunk)
        if joined and joined[0].islower():
            joined = joined[0].upper() + joined[1:]
        paragraphs.append(joined)
    return paragraphs


def scripture_block(reading: dict, label: str, extra_html: str = "") -> str:
    ref = fmt_ref(
        reading.get("reference", ""),
        reading.get("translation", BIBLE_VERSION),
        label,
    )
    content = reading.get("content") or {}
    verses = content.get("verses") or []
    paras = verses_to_paragraphs(verses)
    body = "".join(f"      <p>{html.escape(p)}</p>\n" for p in paras)
    extra = f"\n      {extra_html}" if extra_html else ""
    return (
        f"    <div class=\"scripture\">\n"
        f"      <span class=\"ref\">{html.escape(ref)}</span>\n"
        f"{extra}{body}"
        f"    </div>"
    )


def reader_response() -> str:
    return (
        "    <div class=\"dialogue\">\n"
        "      <p><span class=\"role\">Leitor:</span> Palavra do Senhor.</p>\n"
        "      <p><span class=\"role\">Povo:</span> Graças a Deus.</p>\n"
        "    </div>"
    )


def build_readings(data: dict) -> str:
    readings = data.get("readings") or {}
    parts = ['    <h2><span class="step-num">8</span> Leituras das Escrituras</h2>\n']

    if "first_reading" in readings:
        parts.append(scripture_block(readings["first_reading"], "Primeira Leitura"))
        parts.append("")
        parts.append(reader_response())
        parts.append("")

    if "psalm" in readings:
        ps = readings["psalm"]
        parts.append(scripture_block(ps, "Salmo responsorial"))
        parts.append("")

    if "second_reading" in readings:
        parts.append(scripture_block(readings["second_reading"], "Segunda Leitura"))
        parts.append("")
        parts.append(reader_response())
        parts.append("")

    parts.append(
        '    <p class="rubric">✠ Antes da leitura do Evangelho, um sinal da cruz '
        "sobre si — pedindo que a Palavra de Cristo habite em nós.</p>\n"
    )

    if "gospel" in readings:
        parts.append(scripture_block(
            readings["gospel"],
            "Santo Evangelho de nosso Senhor Jesus Cristo",
        ))
        parts.append("")
        parts.append(reader_response())

    return "\n".join(parts)


def main_collect(data: dict) -> str:
    collects = data.get("collect") or []
    for c in collects:
        if c.get("sunday_reference") != "common_saints":
            return c.get("text", "")
    return collects[0]["text"] if collects else ""


def build_collect(data: dict) -> str:
    text = main_collect(data)
    if text.lower().endswith("amém."):
        text = text[:-5].rstrip() + " "
        amen = "<strong>Amém.</strong>"
    elif text.lower().endswith("amém"):
        text = text[:-4].rstrip() + " "
        amen = "<strong>Amém.</strong>"
    else:
        amen = ""
    return (
        "    <div class=\"dialogue\">\n"
        "      <p><span class=\"role\">Ministro:</span> O Senhor seja convosco.</p>\n"
        "      <p><span class=\"role\">Povo:</span> E também contigo.</p>\n"
        "      <p><span class=\"role\">Ministro:</span> Oremos.</p>\n"
        "    </div>\n"
        f"    <div class=\"prayer\">\n"
        f"      {html.escape(text)}{amen}\n"
        "    </div>"
    )


def build_header(data: dict) -> str:
    title = data.get("sunday_name") or data.get("celebration", {}).get("name", "")
    desc = data.get("description") or []
    proper = next((d for d in desc if d.lower().startswith("próprio")), None)
    year = data.get("liturgical_year", "")
    subtitle_parts = [p for p in [proper, f"Ano {year}" if year else ""] if p]
    subtitle = " · ".join(subtitle_parts) if subtitle_parts else " · ".join(desc[:2])

    date_str = data.get("date", "")
    date_label = date_str
    m = re.match(r"(\d{2})/(\d{2})/(\d{4})", date_str)
    if m:
        day, month, year_num = int(m.group(1)), int(m.group(2)), m.group(3)
        date_label = f"{day} DE {MESES[month - 1]} DE {year_num}"

    color = (data.get("liturgical_color") or "verde").lower()
    emoji = COR_EMOJI.get(color, "🟢")
    color_label = color.capitalize()

    return (
        "    <div class=\"church\">Igreja Anglicana Rio</div>\n"
        f"    <h1>{html.escape(title)}</h1>\n"
        f"    <div class=\"subtitle\">{html.escape(subtitle)}</div>\n"
        f"    <div class=\"date\">{html.escape(date_label)}</div>\n"
        f"    <span class=\"cor-tag\">{emoji} Cor litúrgica: {html.escape(color_label)}</span>"
    )


def page_title(data: dict) -> str:
    title = data.get("sunday_name") or data.get("celebration", {}).get("name", "Culto")
    return f"Culto Dominical · {title}"


def replace_marker(content: str, name: str, replacement: str) -> str:
    pattern = re.compile(
        rf"<!-- estevao:{name} -->.*?<!-- /estevao:{name} -->",
        re.S,
    )
    block = f"<!-- estevao:{name} -->\n{replacement}\n<!-- /estevao:{name} -->"
    if not pattern.search(content):
        sys.exit(f"ERRO: marcador estevao:{name} não encontrado")
    return pattern.sub(block, content, count=1)


def parse_date_arg(arg: str) -> date:
    try:
        return date.fromisoformat(arg)
    except ValueError:
        sys.exit(f"ERRO: data inválida {arg!r} (use AAAA-MM-DD)")


def preview_summary(data: dict) -> dict:
    readings = data.get("readings") or {}
    return {
        "date": data.get("date"),
        "day_of_week": data.get("day_of_week"),
        "title": data.get("sunday_name") or (data.get("celebration") or {}).get("name"),
        "subtitle": data.get("description"),
        "liturgical_season": data.get("liturgical_season"),
        "liturgical_color": data.get("liturgical_color"),
        "liturgical_year": data.get("liturgical_year"),
        "collect": main_collect(data),
        "readings": {
            key: readings[key].get("reference")
            for key in ("first_reading", "psalm", "second_reading", "gospel")
            if key in readings
        },
    }


def preview_html(data: dict) -> str:
    parts = [
        "<!-- header -->",
        build_header(data),
        "<!-- /header -->",
        "",
        "<!-- collect -->",
        build_collect(data),
        "<!-- /collect -->",
        "",
        "<!-- readings -->",
        build_readings(data),
        "<!-- /readings -->",
    ]
    return "\n".join(parts)


def run_preview(d: date, api_key: str, fmt: str) -> None:
    data = fetch_calendar(d, api_key)
    if fmt == "json":
        print(json.dumps(data, ensure_ascii=False, indent=2))
    elif fmt == "html":
        print(preview_html(data))
    else:
        print(json.dumps(preview_summary(data), ensure_ascii=False, indent=2))


def update_folheto(path: Path, api_key: str) -> None:
    m = re.search(r"(\d{4})/(\d{2})/(\d{2})/index\.html$", str(path))
    if not m:
        sys.exit(f"ERRO: caminho inválido {path}")
    d = date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    data = fetch_calendar(d, api_key)

    content = path.read_text(encoding="utf-8")
    content = replace_marker(content, "header", build_header(data))
    content = replace_marker(content, "collect", build_collect(data))
    content = replace_marker(content, "readings", build_readings(data))

    title = html.escape(page_title(data))
    content = re.sub(
        r"(<title>)(.*?)(</title>)",
        rf"\1{title}\3",
        content,
        count=1,
    )

    path.write_text(content, encoding="utf-8")
    print(f"OK: {path.relative_to(ROOT)}")


def sync_index() -> None:
    dated = sorted(FOLHETOS.glob("????/??/??/index.html"), reverse=True)
    if not dated:
        return
    latest = dated[0]
    (FOLHETOS / "index.html").write_text(
        latest.read_text(encoding="utf-8"),
        encoding="utf-8",
    )
    print(f"OK: folhetos/index.html ← {latest.relative_to(ROOT)}")


def main() -> int:
    api_key = load_api_key()
    sync = "--sync-index" in sys.argv
    preview = "--preview" in sys.argv
    fmt = "html" if "--html" in sys.argv else "json" if "--json" in sys.argv else "summary"
    args = [a for a in sys.argv[1:] if not a.startswith("--")]

    if preview:
        if not args:
            sys.exit("ERRO: --preview requer uma data (AAAA-MM-DD)")
        run_preview(parse_date_arg(args[0]), api_key, fmt)
        return 0

    if "--all" in sys.argv:
        paths = sorted(FOLHETOS.glob("????/??/??/index.html"))
        if not paths:
            sys.exit("ERRO: nenhum folheto encontrado")
        for p in paths:
            update_folheto(p, api_key)
        sync_index()
        return 0

    if not args:
        print(__doc__)
        return 1

    for arg in args:
        d = parse_date_arg(arg)
        path = FOLHETOS / f"{d.year:04d}" / f"{d.month:02d}" / f"{d.day:02d}" / "index.html"
        if not path.exists():
            sys.exit(f"ERRO: {path} não existe")
        update_folheto(path, api_key)

    if sync:
        sync_index()
    return 0


if __name__ == "__main__":
    sys.exit(main())
