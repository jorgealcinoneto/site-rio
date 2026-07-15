/* ============================================
   IAR — Landing (SEO-first)
   Reusa tokens e classes de styles.css + site-styles
============================================ */

const { useState, useEffect } = React;

const CHURCH_LAT = -22.83816;
const CHURCH_LNG = -43.32026;
const MAPS_EMBED =
  `https://www.google.com/maps?q=${CHURCH_LAT},${CHURCH_LNG}&hl=pt-BR&z=17&output=embed`;
const MAPS_LINK =
  `https://www.google.com/maps/search/?api=1&query=${CHURCH_LAT},${CHURCH_LNG}`;

const {
  IconCalice, IconLivro, IconCoracao, IconComunidade,
  IconLocal, IconLogoMarca, IconOndas, IconPomba, IconCruzCelta,
} = window.IARIcons;

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const close = () => setOpen(false);
  const dark = scrolled || open;
  const links = [
    { href: "#primeira-vez", label: "Primeira visita" },
    { href: "#quem-somos", label: "Quem somos" },
    { href: "#cremos", label: "No que cremos" },
    { href: "#lideranca", label: "Liderança" },
    { href: "#visite", label: "Onde e quando" },
  ];
  return (
    <>
      <nav className={`site-nav ${dark ? "site-nav--scrolled" : ""}`}>
        <div className="site-nav__inner">
          <a href="#topo" className="site-nav__brand" onClick={close}>
            <IconLogoMarca width={36} height={42} variant={dark ? "dark" : "light"} />
            <div className="site-nav__brand-text" style={{ color: dark ? "var(--marinho)" : "var(--papel)" }}>
              <span>Igreja Anglicana</span>
              Rio
            </div>
          </a>
          <div className="site-nav__links" style={{ color: dark ? "var(--marinho)" : "var(--papel)" }}>
            {links.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
            <a href="#visite" className="site-nav__cta">Planeje sua visita →</a>
          </div>
          <button
            type="button"
            className="site-nav__toggle"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
            style={{ color: dark ? "var(--marinho)" : "var(--papel)" }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <path d="M6 6 L22 22" />
                  <path d="M22 6 L6 22" />
                </>
              ) : (
                <>
                  <path d="M5 9 H23" />
                  <path d="M5 19 H23" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>
      <div className={`site-mobile-menu ${open ? "site-mobile-menu--open" : ""}`}>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={close}>{l.label}</a>
        ))}
        <a href="#visite" onClick={close}>Planeje sua visita</a>
      </div>
    </>
  );
}

function Hero() {
  return (
    <header className="hero-site" id="topo" data-screen-label="01 Hero">
      <div className="hero-site__bg">
        <img src="assets/hero-mosaico.jpg" alt="Mosaico de fotos da comunidade da Igreja Anglicana Rio reunida em celebrações e confraternizações" width="1600" height="1200" fetchpriority="high" decoding="async" />
      </div>
      <div className="hero-site__overlay" style={{ opacity: 1 }} />
      <div className="hero-site__content">
        <div>
          <div className="hero-site__kicker" style={{ color: "#F5BD24" }}>Igreja Anglicana Rio · Rede Episcopal Brasileira</div>
          <h1 className="hero-site__title">
            Igreja Anglicana Rio: sacramental, litúrgica e <em>carioca</em>.
          </h1>
        </div>
        <div className="hero-site__ctas">
          <a href="#visite" className="btn btn--primary">
            Planeje sua visita
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M3 9 H15 M10 4 L15 9 L10 14" />
            </svg>
          </a>
          <a href="#primeira-vez" className="btn btn--ghost">É minha primeira visita</a>
        </div>
        <div className="hero-site__meta">
          <div>
            <strong>Domingo</strong>
            <div className="hero-site__meta-val">Café 9h · Eucaristia 10h</div>
          </div>
          <div>
            <strong>Onde</strong>
            <div className="hero-site__meta-val">Irajá · Zona Norte</div>
          </div>
          <div>
            <strong>Acolhida</strong>
            <div className="hero-site__meta-val">Café comunitário</div>
          </div>
        </div>
      </div>
      <a href="#primeira-vez" className="hero-site__scroll" aria-label="Rolar para baixo">
        rolar
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 6 L8 11 L13 6" />
        </svg>
      </a>
    </header>
  );
}

function PrimeiraVez() {
  const pontos = [
    { Icon: IconComunidade, title: "Acolhimento sem pré-requisitos", desc: "Não há exigência de traje, filiação prévia ou familiaridade com a liturgia. Recebemos cada visitante como está." },
    { Icon: IconCoracao, title: "Famílias e crianças", desc: "As crianças participam integralmente da celebração e da vida da comunidade." },
    { Icon: IconLivro, title: "Café 9h · Eucaristia 10h", desc: "O café comunitário antecede a celebração, que dura cerca de uma hora e reúne Palavra, oração e Eucaristia." },
  ];
  return (
    <section id="primeira-vez" className="site-section" data-screen-label="02 Primeira vez">
      <div className="section-eyebrow">Primeira visita</div>
      <h2 className="section-title">
        O que esperar da <em>sua primeira visita</em>.
      </h2>
      <div className="atividades-grid" style={{ marginTop: 28 }}>
        {pontos.map((p) => (
          <div className="atividade" key={p.title} style={{ gridTemplateColumns: "56px 1fr" }}>
            <div className="atividade__icon"><p.Icon /></div>
            <div className="atividade__body">
              <h3 className="atividade__title">{p.title}</h3>
              <p className="atividade__desc">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="triagem" style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 12 }}>
        <a href="#cremos" className="btn btn--dark">No que cremos</a>
        <a href="https://wa.me/5521971500286" target="_blank" rel="noopener" className="btn btn--ghost" style={{ color: "var(--marinho)", borderColor: "var(--marinho)" }}>Fale conosco</a>
      </div>
    </section>
  );
}

function QuemSomos() {
  return (
    <section id="quem-somos" className="site-section site-section--alt" data-screen-label="03 Quem somos">
      <div className="sobre">
        <div>
          <div className="section-eyebrow">Quem somos</div>
          <h2 className="sobre__lead">
            A Igreja Anglicana <em>Rio</em>
          </h2>
          <div className="sobre__photo" style={{ marginTop: 20, borderRadius: 16, overflow: "hidden", maxHeight: 380 }}>
            <img
              src="assets/photo-bispo-imposicao.png"
              alt="Celebração com imposição de mãos na Igreja Anglicana Rio"
              style={{ width: "100%", height: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover", objectPosition: "center 35%" }}
              loading="lazy"
            />
          </div>
        </div>
        <div className="sobre__body">
          <p>
            Somos uma comunidade cristã sediada em Irajá, Zona Norte do Rio de Janeiro, <strong>integrante da Rede Episcopal Brasileira</strong>. Nossa vocação é o discipulado e o amor a Deus e ao próximo — um sinal do Reino nesta cidade.
          </p>
          <p>
            Somos uma igreja <strong>sacramental e contemporânea</strong>, centrada na Eucaristia e na Palavra, e aberta à obra do Espírito Santo.
          </p>
          <div className="bispo-card" style={{ marginTop: 20, padding: 20, background: "var(--vela)", border: "1px solid var(--linha)", borderRadius: 14 }}>
            <div className="section-eyebrow" style={{ marginBottom: 6 }}>Nosso bispo</div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, color: "var(--marinho)", margin: "0 0 6px", fontWeight: 500 }}>
              Revmo. Eric Rodrigues
            </h3>
            <p style={{ margin: 0, color: "var(--grafite-2)", lineHeight: 1.5, fontSize: 15 }}>
              Bispo da Rede Episcopal Brasileira, com quem nossa comunidade está em comunhão.
            </p>
          </div>
          <p style={{ marginTop: 20 }}>
            <a href="https://redeepiscopalbrasileira.com.br/" target="_blank" rel="noopener" className="btn btn--dark">
              Conhecer a REB
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Cremos() {
  const itens = [
    { Icon: IconLivro, title: "Fidelidade às Escrituras", desc: "O Evangelho da graça e a justificação pela fé. A Palavra é a autoridade para a fé e para a vida." },
    { Icon: IconCruzCelta, title: "Fé católica e universal", desc: "Credos, ministério episcopal, sacramentos e calendário litúrgico: a fé recebida dos apóstolos." },
    { Icon: IconCalice, title: "Via-média anglicana", desc: "Tradição e contemporaneidade: a herança litúrgica vivida de forma acessível." },
    { Icon: IconPomba, title: "Vida no Espírito", desc: "Abertura à obra do Espírito Santo, exercida com ordem e reverência." },
  ];
  return (
    <section id="cremos" className="site-section site-section--alt" data-screen-label="05 Cremos">
      <div className="section-eyebrow">No que cremos</div>
      <h2 className="section-title">
        Os fundamentos da <em>nossa fé</em>.
      </h2>
      <p className="section-lede">
        Unidos pela fé, guiados pelo Espírito e fundamentados na Palavra.
      </p>
      <div className="crencas" style={{ marginTop: 28 }}>
        {itens.map((p) => (
          <div className="crenca" key={p.title}>
            <div className="atividade__icon"><p.Icon /></div>
            <h3 className="atividade__title">{p.title}</h3>
            <p className="atividade__desc">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="manifesto" data-screen-label="06 Manifesto">
      <div className="manifesto__inner">
        <blockquote className="manifesto__quote">
          Buscamos uma expressão de fé que honre os <em>símbolos</em>, reconheça a riqueza da
          <em> liturgia</em>, dialogue com a cultura e expresse a <em>beleza de Cristo</em>.
        </blockquote>
        <div className="manifesto__attr">NOSSA VISÃO</div>
      </div>
    </section>
  );
}

// Inline rather than in icons.jsx: the bundled copy of that file has drifted
// from disk, so repacking it would also ship an unrelated logo change.
function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Lideranca() {
  const pastores = [
    {
      cargo: "Pastor",
      nome: "Jorge Alcino",
      bio: "Atua como pastor há 10 anos, sempre envolvido na plantação de igrejas. Engenheiro de Software e mestrando em Estudos Teológicos no Gordon-Conwell Theological Seminary.",
      instagram: "ofantasticomundodejorge",
    },
    {
      cargo: "Pastora",
      nome: "Raquel Fernandes",
      bio: "Atua como pastora há 10 anos, sempre envolvida na plantação de igrejas. Gerente de Projetos e graduanda em Teologia pela FTSA.",
      instagram: "raquel.fernandessss",
    },
  ];
  return (
    <section id="lideranca" className="site-section" data-screen-label="07 Lideranca">
      <div className="section-eyebrow">Liderança</div>
      <h2 className="section-title">
        Pastores da <em>comunidade</em>.
      </h2>

      {/* The source is 572x694 portrait and its subject spans the full height
          (faces up top, chalice and paten below). Cropping it to a landscape
          band cuts the eucharistic elements off and upscales it ~2x, so keep
          the native ratio and cap the width below 572 to stay sharp. */}
      <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
        <img
          src="assets/photo-pastores-eucaristia.png"
          alt="Pastor Jorge Alcino e Pastora Raquel Fernandes com os elementos da Eucaristia"
          width="572"
          height="694"
          style={{
            width: "100%", maxWidth: 460, height: "auto", display: "block",
            borderRadius: 16, border: "1px solid var(--linha)",
          }}
          loading="lazy"
        />
      </div>

      <div className="lideres" style={{ marginTop: 24 }}>
        {pastores.map((p) => (
          // .lider is a 1fr 1.4fr grid for the photo layout; these cards have no
          // photo, so collapse it or the body sits in the narrow column.
          <article className="lider" key={p.nome} style={{ gridTemplateColumns: "1fr" }}>
            <div className="lider__body">
              <div className="lider__role">{p.cargo}</div>
              <h3 className="lider__name">{p.nome}</h3>
              <p className="lider__bio">{p.bio}</p>
              <a
                href={`https://instagram.com/${p.instagram}`}
                target="_blank"
                rel="noopener"
                style={{
                  marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8,
                  color: "var(--estola)", textDecoration: "none", fontSize: 15, fontWeight: 500,
                }}
              >
                <IconInstagram />
                @{p.instagram}
              </a>
            </div>
          </article>
        ))}
      </div>

      <p style={{ marginTop: 24, color: "var(--grafite-2)", fontSize: 16, lineHeight: 1.6, textAlign: "center" }}>
        Jorge e Raquel são casados há 15 anos e têm três filhos — Asaphe, Liz e Bento — e a gatinha Lili.
      </p>
    </section>
  );
}

function Visite() {
  return (
    <section id="visite" className="site-section site-section--alt" data-screen-label="08 Visite">
      <div className="section-eyebrow">Onde e quando</div>
      <h2 className="section-title">
        Onde e quando nos <em>reunimos</em>.
      </h2>
      <p className="section-lede">
        Irajá, Zona Norte do Rio de Janeiro — próximo à estação Irajá do metrô e ao polo gastronômico de Vista Alegre.
      </p>
      <div className="visite__map">
        <iframe
          title="Mapa — Igreja Anglicana Rio, Irajá"
          src={MAPS_EMBED}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <p className="visite__map-link">
        <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer">
          Abrir no Google Maps
        </a>
      </p>
      <div className="visite">
        <div className="visite__card">
          <IconOndas className="visite__card-wave" />
          <div className="visite__card-icon"><IconLocal /></div>
          <h3 className="visite__card-title">Rio de Janeiro</h3>
          <p className="visite__card-text">
            <strong>Zona Norte · Irajá</strong><br />
            Rua Soldado Elias dos Santos, 55 — CEP 21235-513.<br />
            Aproximadamente 10 minutos a pé da estação Irajá. Estacionamento disponível na via.
          </p>
          <ul className="horarios">
            <li>
              <strong style={{ color: "#F5BD24" }}>Café comunitário</strong>
              <span style={{ color: "#F5BD24" }}>Dom · 9h</span>
            </li>
            <li>
              <strong style={{ color: "#F5BD24" }}>Eucaristia da família</strong>
              <span style={{ color: "#F5BD24" }}>Dom · 10h</span>
            </li>
          </ul>
        </div>
        <div className="visite__card" style={{ background: "var(--vela)", border: "1px solid var(--linha)" }}>
          <h3 className="visite__card-title" style={{ color: "var(--marinho)" }}>Planeje sua visita</h3>
          <p className="visite__card-text" style={{ color: "var(--grafite-2)" }}>
            Entre em contato pelo Instagram <strong style={{ color: "var(--marinho)" }}>@igrejaanglicanario</strong> ou pelo WhatsApp — será um prazer receber você.
          </p>
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="https://instagram.com/igrejaanglicanario" target="_blank" rel="noopener" className="btn btn--primary" style={{ justifyContent: "center" }}>
              Instagram
            </a>
            <a href="https://wa.me/5521971500286" target="_blank" rel="noopener" className="btn btn--dark" style={{ justifyContent: "center" }}>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaFinal() {
  return (
    <section className="cta-banner" data-screen-label="09 CTA">
      <div className="cta-banner__inner">
        <h2 className="cta-banner__title">
          Domingo: café comunitário às 9h, Eucaristia às 10h.
        </h2>
        <p className="cta-banner__sub">
          Unidos pela fé, guiados pelo Espírito e fundamentados na Palavra.
        </p>
        <a href="https://wa.me/5521971500286" target="_blank" rel="noopener" className="btn btn--primary" style={{ fontSize: 17 }}>
          Falar conosco
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 9 H15 M10 4 L15 9 L10 14" />
          </svg>
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div style={{ width: 230, display: "flex", alignItems: "center" }}>
          <div className="site-footer__brand" style={{ marginBottom: 0 }}>
            <IconLogoMarca width={40} height={46} variant="light" />
            <div className="site-footer__brand-text">
              <span>Igreja Anglicana</span>
              Rio
            </div>
          </div>
        </div>
        <div className="site-footer__col" style={{ display: "flex", alignItems: "center" }}>
          <a href="https://redeepiscopalbrasileira.com.br/" target="_blank" rel="noopener" style={{ display: "inline-flex" }}>
            <img src="assets/logo-rede-episcopal-brasileira.png" alt="Rede Episcopal Brasileira" style={{ height: 90, width: 116, display: "block" }} />
          </a>
        </div>
        <div className="site-footer__col">
          <div className="site-footer__col-title">Navegue</div>
          <a href="#primeira-vez">Primeira visita</a>
          <a href="#quem-somos">Quem somos</a>
          <a href="#visite">Onde e quando</a>
        </div>
        <div className="site-footer__col">
          <div className="site-footer__col-title">Conecte-se</div>
          <a href="https://instagram.com/igrejaanglicanario" target="_blank" rel="noopener">Instagram</a>
          <a href="https://wa.me/5521971500286" target="_blank" rel="noopener">WhatsApp</a>
          <a href="mailto:contato@igrejaanglicanario.com.br">E-mail</a>
        </div>
        <div className="site-footer__col">
          <div className="site-footer__col-title">A igreja</div>
          <a href="#quem-somos">Quem somos</a>
          <a href="#cremos">No que cremos</a>
          <a href="#lideranca">Liderança</a>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Igreja Anglicana Rio · Rua Soldado Elias dos Santos, 55 — Irajá, Rio de Janeiro/RJ · Integrante da Rede Episcopal Brasileira</span>
        <span></span>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PrimeiraVez />
        <QuemSomos />
        <Cremos />
        <Manifesto />
        <Lideranca />
        <Visite />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
