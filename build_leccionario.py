#!/usr/bin/env python3
"""Gera JSON mensal do lecionário para o widget da home.

Uso:
    python3 build_leccionario.py --year 2026
    python3 build_leccionario.py --month 2026-07
    python3 build_leccionario.py --preview 2026-07-27

Requer ESTEVAO_API_KEY em .env ou variável de ambiente.
"""
from __future__ import annotations

import calendar
import json
import sys
from datetime import date
from pathlib import Path

from build_folheto import (
    BIBLE_VERSION,
    PRAYER_BOOK,
    fetch_calendar,
    load_api_key,
    main_collect,
)

ROOT = Path(__file__).parent
LECIONARIO = ROOT / "lecionario"


def day_entry(data: dict) -> dict:
    readings = data.get("readings") or {}
    desc = data.get("description") or []
    proper = next((d for d in desc if d.lower().startswith("próprio")), None)
    lit_year = data.get("liturgical_year", "")
    subtitle_parts = [p for p in [proper, f"Ano {lit_year}" if lit_year else ""] if p]
    subtitle = " · ".join(subtitle_parts) if subtitle_parts else " · ".join(desc[:2])
    celebration = data.get("celebration") or {}
    return {
        "title": data.get("sunday_name") or celebration.get("name") or data.get("liturgical_season", ""),
        "subtitle": subtitle,
        "day_of_week": data.get("day_of_week"),
        "liturgical_season": data.get("liturgical_season"),
        "liturgical_color": data.get("liturgical_color"),
        "liturgical_year": lit_year,
        "collect": main_collect(data),
        "readings": {
            key: readings[key].get("reference")
            for key in ("first_reading", "psalm", "second_reading", "gospel")
            if key in readings
        },
        "is_sunday": bool(data.get("is_sunday")),
    }


def month_path(year: int, month: int) -> Path:
    return LECIONARIO / f"{year:04d}" / f"{month:02d}.json"


def load_month_file(path: Path, year: int, month: int) -> dict:
    if path.exists():
        data = json.loads(path.read_text(encoding="utf-8"))
        if data.get("year") == year and data.get("month") == month:
            return data
    return {
        "year": year,
        "month": month,
        "prayer_book": PRAYER_BOOK,
        "bible_version": BIBLE_VERSION,
        "days": {},
    }


def build_month(year: int, month: int, api_key: str, *, skip_existing: bool = True) -> Path:
    path = month_path(year, month)
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = load_month_file(path, year, month)
    days_in_month = calendar.monthrange(year, month)[1]
    updated = 0

    for day in range(1, days_in_month + 1):
        iso = f"{year:04d}-{month:02d}-{day:02d}"
        if skip_existing and iso in payload["days"]:
            continue
        data = fetch_calendar(date(year, month, day), api_key)
        payload["days"][iso] = day_entry(data)
        updated += 1

    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"OK: {path.relative_to(ROOT)} ({updated} dias atualizados)")
    return path


def build_year(year: int, api_key: str, *, skip_existing: bool = True) -> None:
    for month in range(1, 13):
        build_month(year, month, api_key, skip_existing=skip_existing)


def parse_month_arg(arg: str) -> tuple[int, int]:
    try:
        y, m = arg.split("-", 1)
        year, month = int(y), int(m)
        if month < 1 or month > 12:
            raise ValueError
        return year, month
    except ValueError:
        sys.exit(f"ERRO: mês inválido {arg!r} (use AAAA-MM)")


def main(argv: list[str] | None = None) -> int:
    args = argv if argv is not None else sys.argv[1:]
    api_key = load_api_key()
    preview = "--preview" in args
    positional = [a for a in args if not a.startswith("--")]
    skip_existing = "--force" not in args

    if preview:
        if not positional:
            sys.exit("ERRO: --preview requer uma data (AAAA-MM-DD)")
        d = date.fromisoformat(positional[0])
        data = fetch_calendar(d, api_key)
        print(json.dumps(day_entry(data), ensure_ascii=False, indent=2))
        return 0

    if "--year" in args:
        idx = args.index("--year")
        if idx + 1 >= len(args):
            sys.exit("ERRO: --year requer um valor (ex.: 2026)")
        build_year(int(args[idx + 1]), api_key, skip_existing=skip_existing)
        return 0

    if "--month" in args:
        idx = args.index("--month")
        if idx + 1 >= len(args):
            sys.exit("ERRO: --month requer um valor (ex.: 2026-07)")
        year, month = parse_month_arg(args[idx + 1])
        build_month(year, month, api_key, skip_existing=skip_existing)
        return 0

    if not positional:
        print(__doc__)
        return 1

    if len(positional) == 1 and positional[0].isdigit() and len(positional[0]) == 4:
        build_year(int(positional[0]), api_key, skip_existing=skip_existing)
        return 0

    print(__doc__)
    return 1


if __name__ == "__main__":
    sys.exit(main())
