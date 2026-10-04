#!/usr/bin/env python3
"""Atualiza folhetos litúrgicos com textos da API Estêvão.

Busca cabeçalho, coleta e leituras bíblicas em build time e injeta
nos HTMLs entre marcadores <!-- estevao:... -->.

Uso:
    python3 build_folheto.py --new 2026-10-04
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
TRADITIONAL_TEMPLATE = FOLHETOS / "template" / "loc-ieab-2015.html"
API_BASE = "https://api.caminhoanglicano.com.br/api/v1"
PRAYER_BOOK = "loc_2015"
LEGACY_PRAYER_BOOK = "loc_2027"
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


def fetch_calendar(d: date, api_key: str, prayer_book: str | None = None) -> dict:
    prefs = json.dumps(
        {
            "prayer_book_code": prayer_book or PRAYER_BOOK,
            "bible_version": BIBLE_VERSION,
        },
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
        joined = re.sub(r"\s+([,.;:!?])", r"\1", " ".join(chunk))
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


def traditional_header(data: dict) -> str:
    season = data.get("liturgical_season") or "Tempo Comum"
    season_parts = season.split(maxsplit=1)
    season_html = "".join(
        f"<span>{html.escape(part)}</span>" for part in season_parts
    )
    color = (data.get("liturgical_color") or "verde").lower()
    color_hex = {
        "verde": "#287047",
        "branco": "#d2c19a",
        "roxo": "#67456f",
        "vermelho": "#9d3a35",
        "rosa": "#bd7182",
    }.get(color, "#287047")
    year = data.get("liturgical_year", "")
    descriptions = " · ".join(data.get("description") or [])
    date_label = data.get("date", "")
    date_match = re.match(r"(\d{2})/(\d{2})/(\d{4})", date_label)
    if date_match:
        day, month, year_num = map(int, date_match.groups())
        date_label = f"{day} de {MESES[month - 1].lower()} de {year_num}"
    celebration = data.get("celebration") or {}
    celebration_html = ""
    if celebration and celebration.get("name"):
        art_asset = {
            "celebration-francis-of-assisi": "/assets/sao-francisco-assis.png",
        }.get(celebration.get("post_slug"))
        art_html = (
            f'<img src="{art_asset}" alt="{html.escape(celebration["name"])}">'
            if art_asset
            else "✦"
        )
        rank = {
            "lesser_feast": "Festa menor",
            "principal_feast": "Festa principal",
            "holy_day": "Dia santo",
        }.get(celebration.get("type"), "Celebração")
        detail = " · ".join(
            value
            for value in [
                celebration.get("description"),
                str(celebration.get("description_year") or ""),
            ]
            if value
        )
        celebration_html = (
            '    <aside class="celebration">\n'
            f'      <div class="celebration__art">{art_html}</div>\n'
            f'      <div class="celebration__label">{html.escape(rank)}</div>\n'
            f'      <div class="celebration__name">{html.escape(celebration["name"])}</div>\n'
            f'      <div class="date">{html.escape(detail)}</div>\n'
            "    </aside>\n"
        )
    return (
        '<header class="masthead" '
        f'style="--liturgical-color:{color_hex}">\n'
        '  <div class="masthead__church">Igreja Anglicana Rio</div>\n'
        f'  <div class="masthead__grid{" masthead__grid--solo" if not celebration_html else ""}">\n'
        "    <div>\n"
        f'      <h1 class="season">{season_html}</h1>\n'
        '      <div class="badges">'
        '<span class="badge"><span class="badge__dot" aria-hidden="true">&nbsp;</span>'
        f"{html.escape(color)}</span>"
        f"<span>Ano {html.escape(year)}</span></div>\n"
        "    </div>\n"
        f"{celebration_html}"
        "  </div>\n"
        f'  <p class="proper">{html.escape(descriptions)}</p>\n'
        f'  <p class="date">{html.escape(date_label)}</p>\n'
        "</header>"
    )


def traditional_ordinary(data: dict) -> str:
    season = (data.get("liturgical_season") or "").lower()
    if "quaresma" in season or "advento" in season:
        return (
            '  <div class="act">\n'
            "    <h3>Kyrie Eleison</h3>\n"
            '    <div class="prayer prayer--all">'
            "Senhor, tem piedade de nós.<br>"
            "Cristo, tem piedade de nós.<br>"
            "Senhor, tem piedade de nós.</div>\n"
            "  </div>"
        )
    return (
        '  <div class="act">\n'
        "    <h3>Gloria in Excelsis</h3>\n"
        '    <div class="prayer prayer--all">'
        "Glória a Deus nas alturas, e na terra paz, boa vontade entre os povos! "
        "Nós te louvamos, bendizemos, adoramos, glorificamos e te damos graças "
        "por tua grande glória. Ó Senhor Deus, Rei do Céu, Deus Pai Onipotente. "
        "Ó Senhor, Unigênito Filho, Jesus Cristo; ó Senhor Deus, Cordeiro de Deus, "
        "Filho do Eterno Pai, que tiras os pecados do mundo, tem misericórdia de nós. "
        "Tu, que tiras os pecados do mundo, recebe a nossa oração. Tu, que estás à "
        "destra de Deus Pai, tem misericórdia de nós. Porque só tu és santo; só tu és "
        "o Senhor; só tu, ó Cristo, com o Espírito Santo, és altíssimo na glória de "
        "Deus Pai. <strong>Amém.</strong></div>\n"
        "  </div>"
    )


def traditional_collect(data: dict) -> str:
    text = main_collect(data).strip()
    text = re.sub(r"\s+Amém\.?$", "", text, flags=re.I)
    return (
        '    <div class="dialogue">\n'
        '      <p><span class="role">Ministro</span>'
        "<span>O Senhor seja com vocês.</span></p>\n"
        '      <p class="people"><span class="role">Povo</span>'
        "<span>Seja também contigo.</span></p>\n"
        '      <p><span class="role">Ministro</span><span>Oremos.</span></p>\n'
        "    </div>\n"
        f'    <div class="prayer">{html.escape(text)} '
        "<strong>Amém.</strong></div>"
    )


def traditional_reading(reading: dict, kind: str, gospel: bool = False) -> str:
    reference = reading.get("reference", "")
    translation = (reading.get("translation") or BIBLE_VERSION).upper()
    verses = (reading.get("content") or {}).get("verses") or []
    body = "\n".join(
        f"        <p>{html.escape(paragraph)}</p>"
        for paragraph in verses_to_paragraphs(verses)
    )
    if gospel:
        book = reference.split()[0] if reference else ""
        opening = (
            '        <div class="dialogue reading__response">\n'
            '          <p><span class="role">Ministro</span>'
            f"<span>O Santo Evangelho de nosso Senhor Jesus Cristo, conforme {html.escape(book)}.</span></p>\n"
            '          <p class="people"><span class="role">Povo</span>'
            "<span>Glória te seja dada, ó Senhor.</span></p>\n"
            "        </div>\n"
        )
        closing = (
            '        <div class="dialogue reading__response">\n'
            '          <p><span class="role">Ministro</span>'
            "<span>Evangelho do Senhor!</span></p>\n"
            '          <p class="people"><span class="role">Povo</span>'
            "<span>Louvado sejas, ó Cristo.</span></p>\n"
            "        </div>\n"
        )
    elif kind == "Salmo":
        opening = closing = ""
    else:
        opening = ""
        closing = (
            '        <div class="dialogue reading__response">\n'
            '          <p><span class="role">Leitor</span>'
            "<span>Palavra do Senhor.</span></p>\n"
            '          <p class="people"><span class="role">Povo</span>'
            "<span>Demos graças a Deus.</span></p>\n"
            "        </div>\n"
        )
    return (
        '    <details class="reading">\n'
        "      <summary><span>"
        f'<span class="reading__kind">{html.escape(kind)} · {html.escape(translation)}</span>'
        f'<span class="reading__ref">{html.escape(reference)}</span>'
        "</span></summary>\n"
        '      <div class="reading__body">\n'
        f"{opening}{body}\n{closing}"
        "      </div>\n"
        "    </details>"
    )


def traditional_readings(data: dict) -> str:
    readings = data.get("readings") or {}
    blocks = []
    config = [
        ("first_reading", "Primeira Leitura", False),
        ("psalm", "Salmo", False),
        ("second_reading", "Segunda Leitura", False),
        ("gospel", "Santo Evangelho", True),
    ]
    for key, kind, gospel in config:
        if key in readings:
            blocks.append(traditional_reading(readings[key], kind, gospel))
    return '    <div class="reading-list">\n' + "\n".join(blocks) + "\n    </div>"


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
        traditional_header(data),
        "<!-- /header -->",
        "",
        "<!-- ordinary -->",
        traditional_ordinary(data),
        "<!-- /ordinary -->",
        "",
        "<!-- collect -->",
        traditional_collect(data),
        "<!-- /collect -->",
        "",
        "<!-- readings -->",
        traditional_readings(data),
        "<!-- /readings -->",
    ]
    return "\n".join(parts)


def run_preview(d: date, api_key: str, fmt: str) -> None:
    data = fetch_calendar(d, api_key, PRAYER_BOOK)
    if fmt == "json":
        print(json.dumps(data, ensure_ascii=False, indent=2))
    elif fmt == "html":
        print(preview_html(data))
    else:
        print(json.dumps(preview_summary(data), ensure_ascii=False, indent=2))


def render_traditional(content: str, data: dict) -> str:
    content = replace_marker(
        content, "traditional_header", traditional_header(data)
    )
    if 'data-ordinary="manual"' not in content:
        content = replace_marker(
            content, "traditional_ordinary", traditional_ordinary(data)
        )
    content = replace_marker(
        content, "traditional_collect", traditional_collect(data)
    )
    content = replace_marker(
        content, "traditional_readings", traditional_readings(data)
    )
    title = html.escape(page_title(data))
    return re.sub(
        r"(<title>)(.*?)(</title>)",
        rf"\1{title}\3",
        content,
        count=1,
    )


def create_folheto(d: date, api_key: str) -> None:
    if not TRADITIONAL_TEMPLATE.exists():
        sys.exit(f"ERRO: template não encontrado: {TRADITIONAL_TEMPLATE}")
    path = FOLHETOS / f"{d.year:04d}" / f"{d.month:02d}" / f"{d.day:02d}" / "index.html"
    if path.exists():
        sys.exit(f"ERRO: {path} já existe")
    data = fetch_calendar(d, api_key, PRAYER_BOOK)
    content = render_traditional(
        TRADITIONAL_TEMPLATE.read_text(encoding="utf-8"),
        data,
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    try:
        display_path = path.relative_to(ROOT)
    except ValueError:
        display_path = path
    print(f"OK: criado {display_path} com {PRAYER_BOOK}")


def update_folheto(path: Path, api_key: str) -> None:
    m = re.search(r"(\d{4})/(\d{2})/(\d{2})/index\.html$", str(path))
    if not m:
        sys.exit(f"ERRO: caminho inválido {path}")
    d = date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    content = path.read_text(encoding="utf-8")
    traditional = 'data-folheto-format="loc-ieab-2015"' in content
    prayer_book = PRAYER_BOOK if traditional else LEGACY_PRAYER_BOOK
    data = fetch_calendar(d, api_key, prayer_book)
    if traditional:
        readings_match = re.search(r'data-readings-book="([^"]+)"', content)
        readings_book = readings_match.group(1) if readings_match else prayer_book
        if readings_book != prayer_book:
            readings_data = fetch_calendar(d, api_key, readings_book)
            data["readings"] = readings_data.get("readings") or {}
        content = render_traditional(content, data)
    else:
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
    print(f"OK: {path.relative_to(ROOT)} com {prayer_book}")


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
    create = "--new" in sys.argv
    fmt = "html" if "--html" in sys.argv else "json" if "--json" in sys.argv else "summary"
    args = [a for a in sys.argv[1:] if not a.startswith("--")]

    if create:
        if not args:
            sys.exit("ERRO: --new requer uma data (AAAA-MM-DD)")
        for arg in args:
            create_folheto(parse_date_arg(arg), api_key)
        return 0

    if preview:
        if not args:
            sys.exit("ERRO: --preview requer uma data (AAAA-MM-DD)")
        run_preview(parse_date_arg(args[0]), api_key, fmt)
        return 0

    if "--all" in sys.argv:
        paths = [
            path
            for path in sorted(FOLHETOS.glob("????/??/??/index.html"))
            if 'data-folheto-format="loc-ieab-2015"'
            in path.read_text(encoding="utf-8")
        ]
        if not paths:
            sys.exit("ERRO: nenhum folheto LOC IEAB 2015 encontrado")
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
