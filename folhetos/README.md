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

- [27/09/2026 — 26º Domingo do Tempo Comum](https://anglicanario.com.br/folhetos/2026/09/27/)
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

Os novos folhetos seguem a **Santa Comunhão sob Circunstâncias Especiais** do *Livro de Oração Comum da Igreja Episcopal Anglicana do Brasil* (2015, reimpressão de 2021), páginas 355–366. A distribuição do Sacramento Reservado depende de autorização episcopal. Os folhetos anteriores a outubro de 2026 preservam a forma em que foram publicados.

## Textos litúrgicos (API Estêvão)

O modelo permanente está em `template/loc-ieab-2015.html`. Cabeçalho, celebração menor, coleta e leituras da trilha semicontínua são buscados da [API Estêvão](https://api.caminhoanglicano.com.br/api/v1) com `loc_2015`:

```bash
cp .env.example .env   # configure ESTEVAO_API_KEY
python3 build_folheto.py --new 2026-10-04
python3 build_folheto.py 2026-10-04
```

`--new` cria o folheto sem publicá-lo como índice. Louvores, sermão, intercessões e a identificação da comunidade onde o Sacramento foi consagrado continuam editados manualmente. `--all` atualiza apenas folhetos criados pelo novo modelo e não reprocessa o arquivo histórico.
