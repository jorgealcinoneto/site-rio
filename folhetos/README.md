# Folhetos · Igreja Anglicana Rio

Folhetos litúrgicos dos cultos dominicais da Igreja Anglicana Rio, vinculada à Rede Episcopal Brasileira.

## Acesso

- **Folheto da semana**: <https://anglicanario.com.br/folhetos/>
- **Arquivo por data**: `https://anglicanario.com.br/folhetos/AAAA/MM/DD/`

## Impressão

No navegador, use o botão **Imprimir folheto (A4 frente e verso)** ou `Cmd/Ctrl+P`.

Configuração sugerida: **A4**, **frente e verso**, margens padrão. O CSS de impressão compacta tipografia e esconde elementos só de tela.
## Estrutura

```
.
├── index.html           ← último folheto (sempre actualizado)
└── AAAA/MM/DD/index.html ← arquivo permanente de cada domingo
```

## Domingos publicados

- [20/09/2026 — 25º Domingo do Tempo Comum](https://anglicanario.com.br/folhetos/2026/09/20/)
- [13/09/2026 — 24º Domingo do Tempo Comum](https://anglicanario.com.br/folhetos/2026/09/13/)
- [06/09/2026 — 23º Domingo do Tempo Comum](https://anglicanario.com.br/folhetos/2026/09/06/)
- [23/08/2026 — 21º Domingo do Tempo Comum](https://anglicanario.com.br/folhetos/2026/08/23/)
- [16/08/2026 — 20º Domingo do Tempo Comum](https://anglicanario.com.br/folhetos/2026/08/16/)
- [09/08/2026 — 19º Domingo do Tempo Comum](https://anglicanario.com.br/folhetos/2026/08/09/)
- [02/08/2026 — 18º Domingo do Tempo Comum](https://anglicanario.com.br/folhetos/2026/08/02/)
- [19/07/2026 — 7º Domingo no Tempo Comum · Culto inaugural](https://anglicanario.com.br/folhetos/2026/07/19/)
- [12/07/2026 — 6º Domingo no Tempo Comum](https://anglicanario.com.br/folhetos/2026/07/12/)
- [05/07/2026 — 5º Domingo no Tempo Comum](https://anglicanario.com.br/folhetos/2026/07/05/)
- [28/06/2026 — 4º Domingo no Tempo Comum](https://anglicanario.com.br/folhetos/2026/06/28/)
- [21/06/2026 — 3º Domingo no Tempo Comum](https://anglicanario.com.br/folhetos/2026/06/21/)
- [14/06/2026 — 2º Domingo no Tempo Comum](https://anglicanario.com.br/folhetos/2026/06/14/)
- [31/05/2026 — Trindade Santa](https://anglicanario.com.br/folhetos/2026/05/31/)
- [24/05/2026 — Dia de Pentecostes](https://anglicanario.com.br/folhetos/2026/05/24/)

---

Liturgia baseada no *Livro de Oração Comum REB 2027* (`loc_2027`) e na *Portaria Episcopal 01/2025* da Rede Episcopal Brasileira.

## Textos litúrgicos (API Estêvão)

Cabeçalho, coleta e leituras bíblicas são buscados da [API Estêvão](https://api.caminhoanglicano.com.br/api/v1) em build time:

```bash
cp .env.example .env   # configure ESTEVAO_API_KEY
python3 build_folheto.py 2026-07-26
python3 build_folheto.py --all
```

Louvores, rubricas, sermão e liturgia fixa continuam editados manualmente no HTML.
