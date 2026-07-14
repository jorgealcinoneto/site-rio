/* ============================================
   IAR — Landing (SEO-first)
   Reusa tokens e classes de styles.css + site-styles
============================================ */

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
    { href: "#primeira-vez", label: "Primeira vez?" },
    { href: "#quem-somos", label: "Quem somos" },
    { href: "#celebracao", label: "A celebração" },
    { href: "#cremos", label: "No que cremos" },
    { href: "#lideranca", label: "Nossa liderança" },
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
            <a href="#visite" className="site-nav__cta">Venha nos conhecer →</a>
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
        <a href="#visite" onClick={close}>Venha nos conhecer</a>
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
        <p className="hero-site__sub">
          Comunidade cristã na Zona Norte do Rio de Janeiro. Litúrgica e contemporânea, aberta à obra do Espírito. Domingos: café comunitário às 9h e Eucaristia às 10h.
        </p>
        <div className="hero-site__ctas">
          <a href="#visite" className="btn btn--primary">
            Venha nos conhecer
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M3 9 H15 M10 4 L15 9 L10 14" />
            </svg>
          </a>
          <a href="#primeira-vez" className="btn btn--ghost">É minha primeira vez</a>
        </div>
        <div className="hero-site__meta">
          <div>
            <strong>Domingo</strong>
            <div className="hero-site__meta-val">Café 9h · Culto 10h</div>
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
    { Icon: IconComunidade, title: "Você é bem-vindo(a) como está", desc: "Não há dress code. Não é preciso já ser anglicano, nem saber as orações de cor. Oramos juntos." },
    { Icon: IconCoracao, title: "Tem criança? Ótimo", desc: "Crianças fazem parte da celebração e da vida da comunidade." },
    { Icon: IconLivro, title: "Café às 9h · celebração às 10h", desc: "Café comunitário antes do culto. A celebração dura cerca de 1h: Palavra, oração e Eucaristia." },
  ];
  return (
    <section id="primeira-vez" className="site-section" data-screen-label="02 Primeira vez">
      <div className="section-eyebrow">Primeira vez?</div>
      <h2 className="section-title">
        Não precisa saber tudo. <em>Venha conosco.</em>
      </h2>
      <p className="section-lede">
        A Igreja Anglicana Rio é uma comunidade reformada e evangélica, que confessa a fé católica dos apóstolos e dos credos da Igreja. Não somos uma comunidade da Igreja Católica Romana.
      </p>
      <p className="section-lede" style={{ marginTop: 16 }}>
        Valorizamos a herança litúrgica, católica, reformada e evangélica, e vivemos o Evangelho de forma relevante e contextualizada — com acolhida carioca e abertura à obra do Espírito Santo.
      </p>
      <div className="atividades-grid">
        {pontos.map((p) => (
          <div className="atividade" key={p.title} style={{ gridTemplateColumns: "64px 1fr" }}>
            <div className="atividade__icon"><p.Icon /></div>
            <div className="atividade__body">
              <h3 className="atividade__title">{p.title}</h3>
              <p className="atividade__desc">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="triagem" style={{ marginTop: 40, display: "flex", flexWrap: "wrap", gap: 12 }}>
        <a href="#cremos" className="btn btn--dark">Sobre o anglicanismo</a>
        <a href="#cremos" className="btn btn--ghost" style={{ color: "var(--marinho)", borderColor: "var(--marinho)" }}>No que cremos</a>
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
          <div className="sobre__photo" style={{ marginTop: 28, borderRadius: 16, overflow: "hidden" }}>
            <img
              src="assets/photo-bispo-imposicao.png"
              alt="Revmo. Eric Rodrigues em oração com imposição de mãos"
              style={{ width: "100%", display: "block", aspectRatio: "4/5", objectFit: "cover" }}
              loading="lazy"
            />
          </div>
        </div>
        <div className="sobre__body">
          <p>
            Somos uma comunidade cristã em Irajá, Zona Norte do Rio de Janeiro, <strong>integrante da Rede Episcopal Brasileira</strong>. Somos chamados a discipular e a amar a Deus e ao próximo — um sinal do Reino nesta cidade.
          </p>
          <p>
            Uma igreja <strong>sacramental e contemporânea</strong>: celebramos a Eucaristia, proclamamos a Palavra e vivemos abertos à obra do Espírito Santo.
          </p>
          <div className="bispo-card" style={{ marginTop: 28, padding: 24, background: "var(--vela)", border: "1px solid var(--linha)", borderRadius: 16 }}>
            <div className="section-eyebrow" style={{ marginBottom: 8 }}>Nosso bispo</div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--marinho)", margin: "0 0 8px", fontWeight: 500 }}>
              Revmo. Eric Rodrigues
            </h3>
            <p style={{ margin: 0, color: "var(--grafite-2)", lineHeight: 1.55 }}>
              A Igreja Anglicana Rio está em comunhão com o bispo da Rede Episcopal Brasileira.
            </p>
          </div>
          <p style={{ marginTop: 24 }}>
            <a href="https://redeepiscopalbrasileira.com.br/" target="_blank" rel="noopener" className="btn btn--dark">
              Conhecer a REB
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Celebracao() {
  return (
    <section id="celebracao" className="site-section" data-screen-label="04 Celebracao">
      <div className="sobre">
        <div>
          <div className="section-eyebrow">A celebração dominical</div>
          <h2 className="sobre__lead">
            Eucaristia da família, <em>todo domingo às 10h</em>.
          </h2>
          <p style={{ marginTop: 16, color: "var(--grafite-2)", lineHeight: 1.55 }}>
            Café comunitário às <strong>9h</strong>, antes da celebração.
          </p>
          <p style={{ marginTop: 24 }}>
            <a href="#visite" className="btn btn--dark">
              Como chegar
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M3 8 H13 M9 4 L13 8 L9 12" />
              </svg>
            </a>
          </p>
        </div>
        <div className="sobre__body">
          <p>
            Nossas celebrações unem <strong>solenidade e beleza litúrgica</strong> com <strong>contemporaneidade e liberdade de expressão</strong>, em abertura à vida no Espírito.
          </p>
          <p>
            Seguem a estrutura do <em>Livro de Oração Comum</em>, em dois movimentos:
          </p>
          <p>
            <strong>Serviço da Palavra</strong> — leitura das Escrituras, sermão, credo e orações.<br />
            <strong>Serviço do Sacramento</strong> — Santa Eucaristia (pão e vinho), conforme o mandamento de Cristo.
          </p>
          <p>
            Convidamos você a participar conosco.
          </p>
        </div>
      </div>
    </section>
  );
}

function Cremos() {
  const itens = [
    { Icon: IconLivro, title: "Fiel às Escrituras", desc: "Confessamos o Evangelho da graça e a justificação pela fé — a Palavra como autoridade para a fé e a vida." },
    { Icon: IconCruzCelta, title: "Fé católica (universal)", desc: "Credos da Igreja, ministério episcopal, sacramentos e calendário litúrgico — a fé dos apóstolos." },
    { Icon: IconCalice, title: "Via-média anglicana", desc: "Tradição e contemporaneidade: herança litúrgica vivida de forma acessível e contextualizada." },
    { Icon: IconPomba, title: "Vida no Espírito", desc: "Igreja carismática com ordem e reverência — abertos à obra do Espírito Santo, sem espetáculo." },
  ];
  return (
    <section id="cremos" className="site-section site-section--alt" data-screen-label="05 Cremos">
      <div className="section-eyebrow">No que cremos</div>
      <h2 className="section-title">
        O que <em>somos</em>.
      </h2>
      <p className="section-lede">
        Unidos pela fé, guiados pelo Espírito e fundamentados na Palavra.
      </p>
      <div className="crencas">
        {itens.map((p) => (
          <div className="crenca" key={p.title}>
            <div className="atividade__icon"><p.Icon /></div>
            <h3 className="atividade__title">{p.title}</h3>
            <p className="atividade__desc">{p.desc}</p>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 32, fontSize: 15, color: "var(--grafite-3)" }}>
        Saiba mais sobre a Rede Episcopal Brasileira no{" "}
        <a href="https://redeepiscopalbrasileira.com.br/faq/" target="_blank" rel="noopener" style={{ color: "var(--estola)" }}>
          FAQ da REB
        </a>.
      </p>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="manifesto" data-screen-label="06 Manifesto">
      <div className="manifesto__inner">
        <span className="manifesto__mark" aria-hidden="true">&ldquo;</span>
        <blockquote className="manifesto__quote">
          Buscamos uma expressão de fé que honre os <em>símbolos</em>, reconheça a riqueza da
          <em> liturgia</em>, dialogue com a cultura e expresse a <em>beleza de Cristo</em> —
          com esperança, sem medo.
        </blockquote>
        <div className="manifesto__attr">O QUE SOMOS</div>
      </div>
    </section>
  );
}

function Lideranca() {
  return (
    <section id="lideranca" className="site-section" data-screen-label="07 Lideranca">
      <div className="section-eyebrow">Nossa liderança</div>
      <h2 className="section-title">
        Pastores da <em>comunidade</em>.
      </h2>
      <p className="section-lede">
        Ministério pastoral exercido em comunhão com o Revmo. Eric Rodrigues, da Rede Episcopal Brasileira.
      </p>

      <div className="lider-duo" style={{ marginTop: 40, borderRadius: 20, overflow: "hidden", border: "1px solid var(--linha)" }}>
        <img
          src="assets/photo-pastores-eucaristia.png"
          alt="Pastor Jorge Alcino e Pastora Raquel Fernandes com os elementos da Eucaristia"
          style={{ width: "100%", display: "block", aspectRatio: "4/5", objectFit: "cover", maxHeight: 560 }}
          loading="lazy"
        />
      </div>

      <div className="lideres">
        <article className="lider">
          <div className="lider__photo">
            <img src="assets/photo-pastor-jorge-pregando.png" alt="Pastor Jorge Alcino" loading="lazy" />
          </div>
          <div className="lider__body">
            <div className="lider__role">Pastor</div>
            <h3 className="lider__name">Jorge Alcino</h3>
            <p className="lider__bio">
              Pastor da Igreja Anglicana Rio. Cuida da proclamação da Palavra, da liturgia e do pastoreio da comunidade.
            </p>
          </div>
        </article>
        <article className="lider">
          <div className="lider__photo">
            <img src="assets/photo-pastores-eucaristia.png" alt="Pastora Raquel Fernandes" loading="lazy" style={{ objectPosition: "78% 20%" }} />
          </div>
          <div className="lider__body">
            <div className="lider__role">Pastora</div>
            <h3 className="lider__name">Raquel Fernandes</h3>
            <p className="lider__bio">
              Pastora da Igreja Anglicana Rio. Cuida do acolhimento e da vida da comunidade.
            </p>
          </div>
        </article>
      </div>

      <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "120px 1fr", gap: 20, alignItems: "center", padding: 20, background: "var(--vela)", borderRadius: 16, border: "1px solid var(--linha)" }}>
        <img
          src="assets/photo-pastor-imposicao.png"
          alt="Pastor Jorge Alcino recebendo imposição de mãos"
          style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 12 }}
          loading="lazy"
        />
        <p style={{ margin: 0, color: "var(--grafite-2)", lineHeight: 1.55, fontSize: 15 }}>
          <strong style={{ color: "var(--marinho)" }}>Nosso bispo · Revmo. Eric Rodrigues</strong><br />
          Comunhão episcopal na Rede Episcopal Brasileira.
        </p>
      </div>
    </section>
  );
}

function Visite() {
  return (
    <section id="visite" className="site-section site-section--alt" data-screen-label="08 Visite">
      <div className="section-eyebrow">Onde e quando</div>
      <h2 className="section-title">
        Onde nos reunimos e <em>quando</em>.
      </h2>
      <p className="section-lede">
        Em Irajá, Zona Norte do Rio — perto do metrô Irajá e do polo gastronômico de Vista Alegre.
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
            Perto do metrô Irajá (cerca de 10 minutos a pé) e do polo gastronômico de Vista Alegre. Há estacionamento na rua.
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
          <h3 className="visite__card-title" style={{ color: "var(--marinho)" }}>Deseja visitar?</h3>
          <p className="visite__card-text" style={{ color: "var(--grafite-2)" }}>
            Escreva no Instagram <strong style={{ color: "var(--marinho)" }}>@igrejaanglicanario</strong> ou pelo WhatsApp.
            Teremos prazer em ajudá-lo(a) a chegar.
          </p>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
            <a href="https://instagram.com/igrejaanglicanario" target="_blank" rel="noopener" className="btn btn--primary" style={{ justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              Instagram
            </a>
            <a href="https://wa.me/5521971500286" target="_blank" rel="noopener" className="btn btn--dark" style={{ justifyContent: "center" }}>
              Falar conosco no WhatsApp
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
          Domingo: café 9h · celebração 10h.
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
            <img src="assets/logo-rede-episcopal-brasileira.png" alt="Rede Episcopal Brasileira" style={{ height: 110, width: 140, display: "block" }} />
          </a>
        </div>
        <div className="site-footer__col">
          <div className="site-footer__col-title">Navegue</div>
          <a href="#primeira-vez">Primeira vez?</a>
          <a href="#quem-somos">Quem somos</a>
          <a href="#celebracao">A celebração</a>
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
          <a href="#lideranca">Nossa liderança</a>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Igreja Anglicana Rio (RIO) · Irajá, RJ · Rede Episcopal Brasileira</span>
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
        <Celebracao />
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
