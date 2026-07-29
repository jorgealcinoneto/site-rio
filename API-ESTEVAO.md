# API Estêvão - Documentação Completa

**Infraestrutura Digital do Caminho Anglicano**

> "Sede firmes e constantes, sempre abundantes na obra do Senhor."

## 📋 Índice

1. [Introdução](#introdução)
2. [Autenticação](#autenticação)
3. [Calendário Litúrgico](#calendário-litúrgico)
4. [Livros de Oração](#livros-de-oração)
5. [Versões da Bíblia](#versões-da-bíblia)
6. [Uso neste projeto](#uso-neste-projeto)

---

## Introdução

### O que é a API Estêvão?

Estêvão é a infraestrutura digital do Caminho Anglicano. Desenvolvida para ser o alicerce técnico de comunidades que buscam unir tradição e tecnologia, a API centraliza dados litúrgicos complexos em uma interface simples e moderna.

### Características Principais

- **Performante**: Respostas JSON leves e otimizadas para carregamento instantâneo em qualquer dispositivo.
- **Fiel à Tradição**: Cálculos baseados rigorosamente nos Livros de Oração e tradições históricas anglicanas.

### URL Base

Todas as requisições devem ser feitas para a URL base abaixo. Recomenda-se o uso de HTTPS em todos os ambientes:

```
https://api.caminhoanglicano.com.br/api/v1
```

### Início Rápido

1. **Crie sua conta**: Acesse o portal e entre com seu e-mail para receber acesso imediato.
2. **Gere sua primeira Key**: No painel de chaves, crie uma chave identificada para seu projeto.
3. **Teste no Playground**: Use a ferramenta interativa para validar os endpoints.
4. **Implemente**: Conecte sua aplicação e comece a servir dados litúrgicos reais.

---

## Autenticação

### Segurança & Acesso

#### Chave de API (X-API-Key)

Este é o método padrão para suas aplicações finais. Sites paroquiais, aplicativos móveis e sistemas de sinalização devem usar a `X-API-Key` enviada no cabeçalho da requisição.

**Exemplo de Requisição:**

```bash
curl -X GET "https://api.caminhoanglicano.com.br/api/v1/calendar/today" \
  -H "X-API-Key: estevao_sua_chave_secreta"
```

**⚠️ Proteja sua chave**

Nunca exponha suas chaves de API em ambientes que o usuário final possa inspecionar, como código JavaScript no navegador. Utilize sempre um backend intermediário (Proxy) para maior segurança.

---

## Calendário Litúrgico

### RECURSOS CORE

> "Ensina-nos a contar os nossos dias, para que alcancemos coração sábio."

#### Dia Litúrgico

Retorna a verdade litúrgica consolidada para uma data, processando cores, tempos, celebrações e lecionário.

**Endpoints:**

- `GET /api/v1/calendar/today` — data de hoje
- `GET /api/v1/calendar/:year/:month/:day` — data específica

**Dica:** `/today` é um atalho para a data atual. Para consultar qualquer outra data, use `/calendar/2026/03/25` — o formato é sempre `YYYY/MM/DD`.

**Resposta JSON (200 OK):**

```json
{
  "date": "24/02/2026",
  "day_of_week": "Terça-feira",
  "liturgical_season": "Quaresma",
  "liturgical_color": "vermelho",
  "liturgical_year": "A",
  "description": ["1ª Semana da Quaresma"],
  "celebration": {
    "name": "Matias",
    "type": "festival",
    "description": "Apóstolo"
  },
  "collect": [
    {
      "title": "Matias",
      "text": "Senhor Deus, o teu servo Matias foi escolhido..."
    }
  ],
  "readings": {
    "first_reading": {
      "reference": "Gênesis 4.1-16",
      "book_name": "Gênesis"
    },
    "psalm": {
      "reference": "Salmo 32"
    }
  }
}
```

#### Parâmetro Preferences

Você pode customizar o lecionário e as traduções bíblicas enviando um objeto JSON (URL encoded) no parâmetro `preferences`.

| Chave | Descrição |
|-------|-----------|
| `prayer_book_code` | O código do livro (ex: `loc_2027`, `loc_2015`). Define a regra litúrgica e as coletas. |
| `bible_version` | O código da versão bíblica (ex: `nvi`, `esv`). Define a tradução dos textos das leituras. |

#### Descrição dos Campos

| Campo | Descrição |
|-------|-----------|
| `date` | Data da resposta formatada (DD/MM/YYYY). |
| `day_of_week` | Nome do dia da semana por extenso em português. |
| `liturgical_season` | O tempo litúrgico atual (ex: Quaresma, Advento, Tempo Comum). |
| `liturgical_color` | A cor das vestes e ornamentos recomendada (verde, vermelho, roxo, branco). |
| `liturgical_year` | O ciclo anual do lecionário (A, B ou C). |
| `description` | Lista de strings descrevendo a semana ou dia específico (ex: "1ª Semana da Quaresma"). |
| `celebration` | Objeto contendo detalhes da festa ou santo principal do dia. |
| `collect` | Lista de orações ("coletas") específicas para o dia. |
| `readings` | Referências bíblicas estruturadas para o lecionário do dia. |

---

### Visão Geral do Ano Litúrgico

Um conjunto de endpoints escopados por ano para responder perguntas como "quando é a Páscoa em 2027?" ou "quais são as Festas Principais deste ano?". Todos requerem o parâmetro `preferences` com `prayer_book_code` e fazem cache de 1 mês.

**Endpoint Base:** `GET /api/v1/calendar/:year/<endpoint>`

#### 1. `/overview`

Consolida tudo numa única requisição: ciclo litúrgico, quadras, datas móveis e celebrações. Ideal para gerar um calendário anual completo.

**Requisição:**

```
GET /api/v1/calendar/2026/overview?preferences={"prayer_book_code":"loc_2027"}
```

**Resposta JSON (200 OK):**

```json
{
  "year": 2026,
  "prayer_book": "loc_2027",
  "liturgical_year": "C",
  "seasons": [ /* quadras litúrgicas */ ],
  "key_dates": { /* datas móveis */ },
  "celebrations": [ /* todas as celebrações, ordem cronológica */ ],
  "celebrations_by_type": {
    "principal_feast": [ /* ... */ ],
    "major_holy_day": [ /* ... */ ],
    "festival": [ /* ... */ ],
    "lesser_feast": [ /* ... */ ],
    "commemoration": [ /* ... */ ]
  }
}
```

#### 2. `/seasons`

As seis quadras litúrgicas do ano com datas de início e fim. A quadra do Natal começa em 25 de dezembro do ano anterior — isso é esperado.

**Requisição:**

```
GET /api/v1/calendar/2026/seasons?preferences={"prayer_book_code":"loc_2027"}
```

**Resposta JSON (200 OK):**

```json
[
  {
    "name": "Natal",
    "slug": "season-christmas",
    "start_date": "2025-12-25",
    "end_date": "2026-01-10"
  },
  {
    "name": "Epifania",
    "slug": "season-epiphany",
    "start_date": "2026-01-11",
    "end_date": "2026-02-17"
  },
  {
    "name": "Quaresma",
    "slug": "season-lent",
    "start_date": "2026-02-18",
    "end_date": "2026-04-04"
  },
  {
    "name": "Páscoa",
    "slug": "season-easter",
    "start_date": "2026-04-05",
    "end_date": "2026-05-24"
  },
  {
    "name": "Tempo Comum",
    "slug": "season-ordinary-time",
    "start_date": "2026-05-25",
    "end_date": "2026-11-28"
  },
  {
    "name": "Advento",
    "slug": "season-advent",
    "start_date": "2026-11-29",
    "end_date": "2026-12-24"
  }
]
```

**Descrição dos Campos:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `name` | string | Nome da quadra em português |
| `slug` | string | Identificador URL-friendly para links e posts |
| `start_date` | string (YYYY-MM-DD) | Data de início (inclusive) |
| `end_date` | string (YYYY-MM-DD) | Data de fim (inclusive) |

#### 3. `/key_dates`

As datas móveis mais importantes do ano, todas calculadas em relação à Páscoa pelo algoritmo de Computus.

**Requisição:**

```
GET /api/v1/calendar/2026/key_dates?preferences={"prayer_book_code":"loc_2027"}
```

**Resposta JSON (200 OK):**

```json
{
  "baptism_of_the_lord": {
    "date": "2026-01-11",
    "name": "Batismo do Senhor",
    "post_slug": "baptism-of-the-lord"
  },
  "ash_wednesday": {
    "date": "2026-02-18",
    "name": "Quarta-Feira de Cinzas",
    "post_slug": "ash-wednesday"
  },
  "palm_sunday": {
    "date": "2026-03-22",
    "name": "Domingo de Ramos",
    "post_slug": "palm-sunday"
  },
  "maundy_thursday": {
    "date": "2026-03-26",
    "name": "Quinta-Feira Santa",
    "post_slug": "maundy-thursday"
  },
  "good_friday": {
    "date": "2026-03-27",
    "name": "Sexta-Feira da Paixão",
    "post_slug": "good-friday"
  },
  "holy_saturday": {
    "date": "2026-03-28",
    "name": "Sábado Santo",
    "post_slug": "holy-saturday"
  },
  "easter": {
    "date": "2026-04-05",
    "name": "Páscoa",
    "post_slug": "easter-sunday"
  },
  "ascension": {
    "date": "2026-05-14",
    "name": "Ascensão",
    "post_slug": "ascension"
  },
  "pentecost": {
    "date": "2026-05-24",
    "name": "Pentecostes",
    "post_slug": "pentecost"
  },
  "trinity_sunday": {
    "date": "2026-05-31",
    "name": "Santíssima Trindade",
    "post_slug": "trinity-sunday"
  },
  "christ_the_king": {
    "date": "2026-11-22",
    "name": "Cristo Rei",
    "post_slug": "christ-the-king"
  },
  "first_sunday_of_advent": {
    "date": "2026-11-29",
    "name": "1º Domingo do Advento",
    "post_slug": "advent-sunday"
  }
}
```

**Observação:** Os campos `name` e `post_slug` são opcionais. Se o prayer book não tiver uma celebração cadastrada para aquela data, a entrada retorna apenas `{"date": "..."}`.

#### 4. `/celebrations`

Todas as celebrações do ano cadastradas no prayer book. Suporta filtro por tipo e agrupamento.

**Requisição:**

```
GET /api/v1/calendar/2026/celebrations?preferences={"prayer_book_code":"loc_2027"}
```

**Parâmetros:**

| Parâmetro | Tipo | Valores | Default |
|-----------|------|--------|---------|
| `type` | string | `principal_feast` · `major_holy_day` · `festival` · `lesser_feast` · `commemoration` | todos |
| `grouped` | boolean | `true` · `false` | false |

**Resposta JSON — Lista Cronológica (DEFAULT):**

```json
[
  {
    "date": "2026-01-01",
    "name": "A Circuncisão de Cristo",
    "type": "principal_feast",
    "color": "branco",
    "post_slug": "circumcision-of-christ",
    "transferred": false
  }
  // ... todas as celebrações do ano em ordem cronológica
]
```

**Resposta JSON — Agrupado (?GROUPED=TRUE):**

```json
{
  "principal_feast": [ /* ... */ ],
  "major_holy_day": [ /* ... */ ],
  "festival": [ /* ... */ ],
  "lesser_feast": [ /* ... */ ],
  "commemoration": [ /* ... */ ]
  // tipos sem celebrações são omitidos
}
```

**Descrição dos Campos:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `date` | string (YYYY-MM-DD) | Data observada (pode diferir da original em caso de transferência) |
| `name` | string | Nome conforme o prayer book |
| `type` | string | Tipo da celebração (principal_feast, major_holy_day, festival, lesser_feast, commemoration) |
| `color` | string | Cor litúrgica em português |
| `post_slug` | string \| null | Slug para link a post/conteúdo |
| `transferred` | boolean | true se a data foi transferida por conflito litúrgico; `date` já reflete a data observada |

#### Erros - Calendário

| Status | Mensagem |
|--------|----------|
| 400 | "Ano inválido: ..." |
| 400 | "prayer_book_code é obrigatório" |
| 400 | "Tipo inválido. Valores aceitos: principal_feast, major_holy_day, festival, lesser_feast, commemoration" |

---

## Livros de Oração

### RECURSOS CORE

> "Guarda o padrão das sãs palavras que de mim ouviste."

#### Estrutura Litúrgica

A API fornece acesso estruturado a diversos Livros de Oração Comum, permitindo que você construa aplicações de Ofício Diário com fidelidade às rubricas.

**Endpoint:**

```
GET /api/v1/prayer_books
```

**Resposta JSON (200 OK):**

```json
{
  "data": [
    {
      "id": "loc_2015",
      "name": "IEAB - 2015",
      "description": "LOC atual da IEAB...",
      "language": "pt-BR",
      "jurisdiction": "Igreja Episcopal Anglicana do Brasil",
      "year": 2015,
      "thumbnail_url": "https://...",
      "pdf_url": "https://...",
      "available_offices": ["morning", "midday", "evening", "compline"],
      "office_definitions": {
        "standard": [
          { "key": "morning", "name": "Matutino" }
        ],
        "family": [
          { "key": "morning", "name": "De Manhã" }
        ]
      },
      "is_recommended": true,
      "premium_required": false,
      "is_accessible": true
    }
  ]
}
```

#### Descrição dos Campos

| Campo | Descrição |
|-------|-----------|
| `id` / `code` | Identificador único do livro (ex: `loc_2015`). |
| `jurisdiction` | Entidade eclesiástica autorizadora (Igreja, Diocese ou Província). |
| `thumbnail_url` | Link para a imagem da capa do livro. |
| `pdf_url` | Link para o arquivo PDF oficial do livro de oração. |
| `available_offices` | Lista técnica dos ofícios contidos no livro (`morning`, `midday`, `evening`, `compline`). |
| `office_definitions` | Mapeamento de nomes amigáveis para cada ofício em diferentes modos de oração. |
| `is_recommended` | Indica se este é o livro padrão sugerido para o idioma. |
| `premium_required` | Se true, o acesso requer conta premium no app Estêvão. |
| `is_accessible` | Indica se o livro está disponível para o nível de acesso da chave atual. |

---

## Versões da Bíblia

### RECURSOS CORE

> "Lâmpada para os meus pés é a tua palavra e, luz para o meu caminho."

#### O Cânon Digital

A API oferece acesso a mais de 20 traduções bíblicas, abrangendo tanto versões de domínio público quanto traduções modernas sob licença proprietária.

**Endpoint:**

```
GET /api/v1/bible_versions
```

**Resposta JSON (200 OK):**

```json
{
  "data": [
    {
      "id": "nvi",
      "code": "NVI",
      "full_name": "Nova Versão Internacional",
      "language": "pt-BR",
      "publisher": "Vida",
      "year": 2011,
      "license": "proprietary",
      "is_recommended": true
    }
  ],
  "metadata": {
    "total": 24,
    "last_updated": "2026-02-09T23:16:23Z"
  }
}
```

#### Descrição dos Campos

| Campo | Descrição |
|-------|-----------|
| `id` / `code` | Identificador único da versão (ex: `nvi`, `esv`). |
| `full_name` | Nome completo e oficial da tradução bíblica. |
| `language` | Código do idioma (ISO 639-1) da versão (ex: `pt-BR`, `en`). |
| `publisher` | Editora responsável pela publicação e licenciamento. |
| `license` | Tipo de licença: `open` (livre) ou `proprietary` (restrita). |
| `is_recommended` | Indica se é uma versão recomendada para uso litúrgico padrão. |

---

## Uso neste projeto

Este repositório consome a API Estêvão via `build_folheto.py` para gerar folhetos dominicais em `folhetos/`.

### Configuração

```bash
cp .env.example .env
# edite ESTEVAO_API_KEY
```

### Consultar liturgia (sem gravar)

```bash
python3 build_folheto.py --preview 2026-08-02           # resumo: título, coleta, refs
python3 build_folheto.py --preview 2026-08-02 --json      # JSON completo da API
python3 build_folheto.py --preview 2026-08-02 --html      # fragmentos HTML
```

### Atualizar folhetos

```bash
python3 build_folheto.py 2026-08-02    # um domingo (HTML deve existir)
python3 build_folheto.py --all         # todos + sincroniza folhetos/index.html
```

### Widget lecionário na home

Gera JSON mensal em `lecionario/AAAA/MM.json`, consumido por `LiturgyWidget` em `landing-app.jsx`:

```bash
python3 build_leccionario.py --year 2026
python3 build_leccionario.py --month 2026-07
python3 build_leccionario.py --preview 2026-07-27
```

`python3 build.py` atualiza o ano corrente automaticamente (`--skip-leccionario` para pular).

### O que vem da API vs. manual

| Seção | Fonte |
|-------|-------|
| Cabeçalho (título, data, cor) | API |
| Coleta do dia | API |
| Leituras bíblicas (texto NVI) | API (folhetos) / refs (widget home) |
| Widget home (`/lecionario/*.json`) | API via `build_leccionario.py` |
| Louvores, rubricas, sermão | HTML manual |
| Confissão, credo, eucaristia | HTML manual (LOC 2015) |

Marcadores no HTML: `<!-- estevao:header -->`, `<!-- estevao:collect -->`, `<!-- estevao:readings -->`.

### Curl equivalente

```bash
curl -s "https://api.caminhoanglicano.com.br/api/v1/calendar/2026/08/02?preferences=%7B%22prayer_book_code%22%3A%22loc_2027%22%2C%22bible_version%22%3A%22nvi%22%7D" \
  -H "X-API-Key: $ESTEVAO_API_KEY"
```

Neste projeto o padrão é **`loc_2027`** (REB — Rede Episcopal Brasileira, 2027).

Regra Cursor: `.cursor/rules/liturgia-estevao.mdc`.

---

## 📚 Recursos Adicionais

- **Playground**: Teste todos os endpoints interativamente
- **Status da API**: Verifique a saúde da infraestrutura
- **Suporte**: Entre em contato com a equipe de desenvolvimento

---

**Última atualização:** 27/07/2026  
**API Version:** v1  
**Base URL:** `https://api.caminhoanglicano.com.br/api/v1`
