#!/usr/bin/env python3
"""Gera o blog estático a partir de posts/*.md.

Emite:
  blog/index.html
  blog/<slug>/index.html
  blog/posts.json
  sitemap.xml (home + blog + posts)

Deps: pip3 install markdown PyYAML --break-system-packages
"""
from __future__ import annotations

import html
import json
import re
import sys
from datetime import date, datetime
from pathlib import Path
from urllib.parse import quote
from xml.sax.saxutils import escape as xml_escape

try:
    import markdown
    import yaml
except ImportError as e:
    raise ImportError(
        "instale as dependências do blog: "
        "pip3 install markdown PyYAML --break-system-packages"
    ) from e

ROOT = Path(__file__).parent
POSTS_DIR = ROOT / "posts"
BLOG_DIR = ROOT / "blog"
SITE = "https://anglicanario.com.br"
STYLES_CSS = ROOT / "styles.css"
BLOG_CSS = ROOT / "blog-styles.css"

FRONTMATTER_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n(.*)\Z", re.S)


def abs_url(path: str) -> str:
    if path.startswith("http://") or path.startswith("https://"):
        return path
    if not path.startswith("/"):
        path = "/" + path
    return SITE + path


def parse_date(value) -> date:
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    return date.fromisoformat(str(value))


def format_date_pt(d: date) -> str:
    meses = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
    ]
    return f"{d.day} de {meses[d.month - 1]} de {d.year}"


def strip_html(text: str) -> str:
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def load_posts():
    if not POSTS_DIR.exists():
        return []
    posts = []
    for path in sorted(POSTS_DIR.glob("*.md")):
        raw = path.read_text(encoding="utf-8")
        m = FRONTMATTER_RE.match(raw)
        if not m:
            sys.exit(f"ERRO: {path.name} precisa de frontmatter YAML entre ---")
        meta = yaml.safe_load(m.group(1)) or {}
        body_md = m.group(2).strip()
        for key in ("title", "date", "description"):
            if not meta.get(key):
                sys.exit(f"ERRO: {path.name} sem campo obrigatório '{key}'")
        body_html = markdown.markdown(
            body_md,
            extensions=["extra", "sane_lists", "smarty"],
        )
        d = parse_date(meta["date"])
        cover = meta.get("cover") or "/assets/photo-culto-pregacao.jpg"
        posts.append({
            "slug": path.stem,
            "title": str(meta["title"]),
            "date": d,
            "date_iso": d.isoformat(),
            "date_label": format_date_pt(d),
            "description": str(meta["description"]),
            "cover": cover,
            "cover_abs": abs_url(cover),
            "author": str(meta.get("author") or "Igreja Anglicana Rio"),
            "body_html": body_html,
            "body_text": strip_html(body_html),
            "url": f"/blog/{path.stem}/",
            "url_abs": f"{SITE}/blog/{path.stem}/",
        })
    posts.sort(key=lambda p: p["date"], reverse=True)
    return posts


def shell(title: str, description: str, canonical: str, og_type: str, image: str, body: str, extra_head: str = "") -> str:
    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(description)}">
  <link rel="canonical" href="{html.escape(canonical)}">
  <meta property="og:type" content="{html.escape(og_type)}">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Igreja Anglicana Rio">
  <meta property="og:title" content="{html.escape(title)}">
  <meta property="og:description" content="{html.escape(description)}">
  <meta property="og:url" content="{html.escape(canonical)}">
  <meta property="og:image" content="{html.escape(image)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{html.escape(title)}">
  <meta name="twitter:description" content="{html.escape(description)}">
  <meta name="twitter:image" content="{html.escape(image)}">
  <meta name="theme-color" content="#0E2A47">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/blog-styles.css">
  {extra_head}
</head>
<body class="blog-body">
{body}
</body>
</html>
"""


def nav_html(active: str = "blog") -> str:
    def cls(name):
        return ' aria-current="page"' if name == active else ""
    return f"""  <header class="blog-nav">
    <div class="blog-nav__inner">
      <a class="blog-nav__brand" href="/">
        <img src="/assets/logo-iar-symbol.png" alt="">
        Igreja Anglicana Rio
      </a>
      <nav class="blog-nav__links">
        <a href="/" {cls("home")}>Início</a>
        <a href="/blog/" {cls("blog")}>Blog</a>
        <a href="/#visite">Visite</a>
        <a href="https://instagram.com/igrejaanglicanario" target="_blank" rel="noopener">Instagram</a>
      </nav>
    </div>
  </header>
"""


def footer_html() -> str:
    year = date.today().year
    return f"""  <footer class="blog-footer">
    <div class="blog-footer__inner">
      <span>© {year} Igreja Anglicana Rio</span>
      <span>
        <a href="/">Início</a> ·
        <a href="/blog/">Blog</a> ·
        <a href="/#visite">Onde e quando</a> ·
        <a href="https://www.facebook.com/profile.php?id=61592071237853" target="_blank" rel="noopener">Facebook</a> ·
        <a href="https://open.spotify.com/show/033T0C1VDMI4sJINnQfGGj" target="_blank" rel="noopener">Podcast</a> ·
        <a href="https://www.youtube.com/@AnglicanaRio" target="_blank" rel="noopener">YouTube</a>
      </span>
    </div>
  </footer>
"""


SEARCH_JS = r"""
<script>
(function () {
  var input = document.getElementById("blog-search");
  var empty = document.getElementById("blog-search-empty");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-blog-card]"));
  if (!input || !cards.length) return;

  function norm(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  input.addEventListener("input", function () {
    var q = norm(input.value.trim());
    var visible = 0;
    cards.forEach(function (card) {
      var hay = norm(card.getAttribute("data-search") || "");
      var show = !q || hay.indexOf(q) !== -1;
      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });
    if (empty) empty.classList.toggle("is-visible", visible === 0);
  });
})();
</script>
"""

SHARE_JS = r"""
<script>
(function () {
  var btn = document.getElementById("share-copy");
  if (!btn) return;
  btn.addEventListener("click", function () {
    var url = btn.getAttribute("data-url") || window.location.href;
    function done() {
      var prev = btn.textContent;
      btn.textContent = "Link copiado";
      setTimeout(function () { btn.textContent = prev; }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(function () {
        window.prompt("Copie o link:", url);
      });
    } else {
      window.prompt("Copie o link:", url);
    }
  });
})();
</script>
"""


def render_index(posts) -> str:
    cards = []
    for p in posts:
        search_blob = " ".join([p["title"], p["description"], p["body_text"], p["author"]])
        cards.append(f"""    <a class="blog-card" href="{html.escape(p["url"])}" data-blog-card data-search="{html.escape(search_blob, quote=True)}">
      <div class="blog-card__cover"><img src="{html.escape(p["cover"])}" alt="" loading="lazy"></div>
      <div class="blog-card__body">
        <div class="blog-card__date">{html.escape(p["date_label"])}</div>
        <h2 class="blog-card__title">{html.escape(p["title"])}</h2>
        <p class="blog-card__desc">{html.escape(p["description"])}</p>
      </div>
    </a>""")
    grid = "\n".join(cards) if cards else '    <p class="blog-lede">Em breve, novos textos.</p>'
    body = f"""{nav_html("blog")}
  <main class="blog-main">
    <header class="blog-header">
      <div class="blog-eyebrow">Blog</div>
      <h1 class="blog-title">Palavras para o caminho</h1>
      <p class="blog-lede">Reflexões, notícias e convites da Igreja Anglicana Rio.</p>
    </header>
    <div class="blog-search">
      <label class="visually-hidden" for="blog-search" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">Buscar</label>
      <input id="blog-search" type="search" placeholder="Buscar…" autocomplete="off">
      <p id="blog-search-empty" class="blog-search__empty">Nenhum texto encontrado.</p>
    </div>
    <div class="blog-grid">
{grid}
    </div>
  </main>
{footer_html()}
{SEARCH_JS}
"""
    return shell(
        title="Blog — Igreja Anglicana Rio",
        description="Reflexões, notícias e convites da Igreja Anglicana Rio.",
        canonical=f"{SITE}/blog/",
        og_type="website",
        image=abs_url("/assets/photo-culto-pregacao.jpg"),
        body=body,
    )


def render_post(p) -> str:
    wa = "https://wa.me/?text=" + quote(f"{p['title']} — {p['url_abs']}")
    fb = "https://www.facebook.com/sharer/sharer.php?u=" + quote(p["url_abs"])
    tw = "https://twitter.com/intent/tweet?text=" + quote(p["title"]) + "&url=" + quote(p["url_abs"])
    body = f"""{nav_html("blog")}
  <main class="blog-main">
    <article>
      <header class="blog-article-header">
        <div class="blog-eyebrow">Blog</div>
        <h1 class="blog-title">{html.escape(p["title"])}</h1>
        <p class="blog-article-meta">{html.escape(p["date_label"])} · {html.escape(p["author"])}</p>
      </header>
      <div class="blog-article-cover">
        <img src="{html.escape(p["cover"])}" alt="">
      </div>
      <div class="blog-prose">
{p["body_html"]}
      </div>
      <div class="blog-share">
        <div class="blog-share__label">Compartilhar</div>
        <div class="blog-share__actions">
          <a class="blog-share__btn" href="{html.escape(wa)}" target="_blank" rel="noopener">WhatsApp</a>
          <a class="blog-share__btn" href="{html.escape(fb)}" target="_blank" rel="noopener">Facebook</a>
          <a class="blog-share__btn" href="{html.escape(tw)}" target="_blank" rel="noopener">X</a>
          <button type="button" class="blog-share__btn" id="share-copy" data-url="{html.escape(p["url_abs"])}">Copiar link</button>
        </div>
      </div>
    </article>
  </main>
{footer_html()}
{SHARE_JS}
"""
    return shell(
        title=f"{p['title']} — Igreja Anglicana Rio",
        description=p["description"],
        canonical=p["url_abs"],
        og_type="article",
        image=p["cover_abs"],
        body=body,
        extra_head=f'<meta property="article:published_time" content="{p["date_iso"]}">',
    )


def write_sitemap(posts):
    urls = [
        ("/", "1.0", "weekly"),
        ("/blog/", "0.8", "weekly"),
    ]
    for p in posts:
        urls.append((p["url"], "0.7", "monthly"))
    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc, pri, freq in urls:
        parts.append("  <url>")
        parts.append(f"    <loc>{xml_escape(SITE + loc)}</loc>")
        parts.append(f"    <changefreq>{freq}</changefreq>")
        parts.append(f"    <priority>{pri}</priority>")
        parts.append("  </url>")
    parts.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(parts) + "\n", encoding="utf-8")


def write_posts_json(posts):
    payload = [
        {
            "slug": p["slug"],
            "title": p["title"],
            "date": p["date_iso"],
            "dateLabel": p["date_label"],
            "description": p["description"],
            "cover": p["cover"],
            "author": p["author"],
            "url": p["url"],
            "bodyText": p["body_text"],
        }
        for p in posts
    ]
    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    (BLOG_DIR / "posts.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def clean_generated(posts):
    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    keep_slugs = {p["slug"] for p in posts}
    for child in BLOG_DIR.iterdir():
        if child.name in ("index.html", "posts.json"):
            continue
        if child.is_dir() and child.name not in keep_slugs:
            for f in child.rglob("*"):
                if f.is_file():
                    f.unlink()
            child.rmdir()


def main():
    if not STYLES_CSS.exists() or not BLOG_CSS.exists():
        sys.exit("ERRO: styles.css e blog-styles.css precisam existir na raiz")

    posts = load_posts()
    clean_generated(posts)

    (BLOG_DIR / "index.html").write_text(render_index(posts), encoding="utf-8")
    for p in posts:
        d = BLOG_DIR / p["slug"]
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(render_post(p), encoding="utf-8")

    write_posts_json(posts)
    write_sitemap(posts)
    print(f"OK: blog gerado — {len(posts)} post(s) em blog/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
