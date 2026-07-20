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

const HERO_SLIDES = [
  {
    src: "assets/hero-sala.jpg",
    alt: "Sala de culto da Igreja Anglicana Rio em Irajá, com altar, cruz e cadeiras prontas para a celebração",
  },
  {
    src: "assets/photo-adoracao.jpg",
    alt: "Comunidade em adoração na Igreja Anglicana Rio",
  },
  {
    src: "assets/photo-culto-pregacao.jpg",
    alt: "Pregação durante o culto da Igreja Anglicana Rio",
  },
  {
    src: "assets/photo-comunidade-ouvindo.jpg",
    alt: "Irmãos acompanhando a celebração na Igreja Anglicana Rio",
  },
];

function Hero() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || HERO_SLIDES.length < 2) return undefined;
    const id = window.setInterval(
      () => setSlide((n) => (n + 1) % HERO_SLIDES.length),
      5500,
    );
    return () => window.clearInterval(id);
  }, []);
  return (
    <header className="hero-site" id="topo" data-screen-label="01 Hero">
      <div className="hero-site__bg" aria-hidden="true">
        {HERO_SLIDES.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt=""
            width={i === 0 ? 768 : 1600}
            height={i === 0 ? 1024 : 1200}
            className={i === slide ? "is-active" : undefined}
            fetchpriority={i === 0 ? "high" : undefined}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
      </div>
      <div className="hero-site__overlay" style={{ opacity: 1 }} />
      <div className="hero-site__content">
        <div>
          <div className="hero-site__kicker" style={{ color: "#F5BD24" }}>Rede Episcopal Brasileira</div>
          <h1 className="hero-site__title">
            Igreja Anglicana Rio: sacramental, litúrgica e <em>carioca</em>.
          </h1>
        </div>
        <div className="hero-site__meta hero-site__meta--spotlight">
          <div>
            <strong>Quando</strong>
            <div className="hero-site__meta-val">Domingo · 9h</div>
          </div>
          <div>
            <strong>Onde</strong>
            <div className="hero-site__meta-val">Irajá · Zona Norte</div>
          </div>
        </div>
        <div className="hero-site__ctas" style={{ gap: 8 }}>
          <a href="#visite" className="btn btn--primary" style={{ padding: "12px 20px", fontSize: 14, gap: 8 }}>
            Planeje sua visita
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M3 9 H15 M10 4 L15 9 L10 14" />
            </svg>
          </a>
          <a href="#primeira-vez" className="btn btn--ghost" style={{ padding: "12px 20px", fontSize: 14 }}>É minha primeira visita</a>
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
    { Icon: IconLivro, title: "Domingo às 9h", desc: "Começamos às 9h com o café comunitário e seguimos juntos no culto — Palavra, oração e Eucaristia." },
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
            Somos uma comunidade cristã sediada em Irajá, Zona Norte do Rio de Janeiro, <strong><a href="https://redeepiscopalbrasileira.com.br/" target="_blank" rel="noopener">integrante da Rede Episcopal Brasileira</a></strong>.
          </p>
          <p>
            Somos uma igreja <strong>sacramental, liturgica, contemporanea e carismática</strong>, centrada na Eucaristia e na Palavra.
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
          <p style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a href="https://redeepiscopalbrasileira.com.br/" target="_blank" rel="noopener" className="btn btn--dark" style={{ color: "rgb(245, 189, 36)" }}>
              Conhecer a REB
            </a>
            <a href="https://caminhoanglicano.com.br/" target="_blank" rel="noopener" className="btn btn--dark" style={{ color: "rgb(245, 189, 36)" }}>
              Indicamos: O Caminho Anglicano
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Cremos() {
  const itens = [
    { Icon: IconLivro, title: "Fidelidade às Escrituras", desc: "A Bíblia é a história verdadeira do mundo — e nos convoca a entrar nela. Nela, Cristo nos encontra, a graça nos justifica e somos enviados a anunciar boas novas." },
    { Icon: IconCruzCelta, title: "Fé Católica e Universal", desc: "Recebemos a fé dos apóstolos — credos, sacramentos e ministério — não como relíquia, mas como herança viva a ser compartilhada com todos os povos e gerações." },
    { Icon: IconCalice, title: "Via-média anglicana", desc: "Raízes antigas, linguagem de hoje. Uma tradição que une razão e reverência para traduzir o Evangelho ao coração e à mente do nosso tempo e da nossa cidade." },
    { Icon: IconPomba, title: "Vida no Espírito", desc: "O Espírito que ressuscitou Jesus nos capacita e nos envia: uma comunidade transformada, com poder e com ordem, testemunha viva do Reino no mundo." },
  ];
  return (
    <section id="cremos" className="site-section site-section--alt" data-screen-label="05 Cremos">
      <div className="section-eyebrow">No que cremos</div>
      <h2 className="section-title">
        Os fundamentos da <em>nossa fé</em>.
      </h2>
      <p className="section-lede">
        Quatro fundamentos, uma vocação: ser igreja em missão.
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
      bio: "Pastor, Engenheiro de Software e mestrando em Estudos Teológicos pelo Gordon-Conwell Theological Seminary. Há mais de 10 anos dedica seu ministério à plantação de igrejas. Nas horas vagas, gosta de tocar guitarra e escrever poemas.",
      instagram: "ofantasticomundodejorge",
    },
    {
      cargo: "Pastora",
      nome: "Raquel Fernandes",
      bio: (
        <>
          Pastora, Gerente de Projetos e graduanda em Teologia pela FTSA. Há mais de 10 anos serve na plantação de igrejas e no cuidado de pessoas. É fã de <em>Harry Potter</em> e <em>Friends</em>.
        </>
      ),
      instagram: "raquel.fernandessss",
    },
  ];
  return (
    <section id="lideranca" className="site-section" data-screen-label="07 Lideranca">
      <div className="section-eyebrow">Liderança</div>
      <h2 className="section-title">
        Pastores da <em>comunidade</em>.
      </h2>

      {/* .lideres is already a 1fr 1fr grid at >=720px: photo left, merged text
          right. .lider__photo carries the 4/3 crop on mobile and stretches to
          the card's height on desktop. */}
      <div className="lideres" style={{ marginTop: 28 }}>
        <div className="lider__photo" style={{ borderRadius: 24, border: "1px solid var(--linha)" }}>
          <img
            src="assets/photo-pastores-eucaristia.png"
            alt="Pastor Jorge Alcino e Pastora Raquel Fernandes com os elementos da Eucaristia"
            loading="lazy"
            // Portrait source: anchor the top so the faces survive and the crop
            // eats the bottom of the frame.
            style={{ objectPosition: "center top" }}
          />
        </div>

        {/* .lider is a 1fr 1.4fr grid for the photo layout; this card holds only
            text, so collapse it or the body sits in the narrow column. */}
        <article className="lider" style={{ gridTemplateColumns: "1fr" }}>
          <div className="lider__body">
            {pastores.map((p, i) => (
              <div
                key={p.nome}
                style={i > 0 ? { marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--linha)" } : undefined}
              >
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
            ))}
            <p
              style={{
                marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--linha)",
                color: "var(--grafite-2)", fontSize: 15, lineHeight: 1.6,
              }}
            >
              Jorge e Raquel são casados há 15 anos, pais de Asaphe, Liz e Bento, e tutores da gatinha Lili. Já moraram no Sul do Brasil, mas é o calor do Rio de Janeiro que chamam de lar.
            </p>
          </div>
        </article>
      </div>
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
              <strong style={{ color: "#F5BD24" }}>Culto</strong>
              <span style={{ color: "#F5BD24" }}>Domingo · 9h</span>
            </li>
          </ul>
          <p className="visite__card-text" style={{ marginTop: 16, opacity: 0.85 }}>
            Começamos com o café comunitário e seguimos na Eucaristia da família.
          </p>
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
          Domingo às 9h em Irajá. Venha conosco.
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
          <a href="mailto:igrejaanglicanario@gmail.com">E-mail</a>
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
