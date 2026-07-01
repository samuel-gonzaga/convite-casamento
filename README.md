# Convite de Casamento — Ana & Lucas

[**Acessar o convite**](https://exemplo.com.br/)

## 📸 Preview

<p align="center">
  <img src="./public/demo.png" alt="Preview do convite" width="800"/>
</p>

Página de convite digital de casamento, construída como um site estático leve (HTML, CSS e JavaScript puros) com backend serverless no **Supabase** e deploy na **Vercel**. Sem frameworks, sem build pesado — apenas o essencial para carregar rápido no celular.

> Os dados exibidos (nomes, pais, local e chave PIX) são **fictícios**, usados apenas para demonstração.

## Visão Geral

Landing page mobile-first de página única, com páginas complementares para **confirmação de presença (RSVP)**, **lista de presentes (PIX)** e um **painel administrativo** para os noivos acompanharem as respostas em tempo real.

As confirmações são gravadas diretamente numa tabela do Supabase (Postgres) a partir do navegador, protegidas por políticas de **Row Level Security (RLS)**: qualquer visitante pode enviar uma confirmação, mas somente os noivos autenticados conseguem ler as respostas.

## Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| **Frontend** | HTML5, CSS3 e JavaScript (vanilla, sem framework) |
| **Backend / Banco** | [Supabase](https://supabase.com/) (Postgres + Row Level Security) |
| **Autenticação** | Supabase Auth (e-mail/senha, para o painel dos noivos) |
| **SDK** | `@supabase/supabase-js` v2 (via CDN jsDelivr) |
| **Tipografia** | Google Fonts — Montserrat, Playfair Display e Parisienne |
| **Ícones** | [Lucide](https://lucide.dev/) (SVG inline) |
| **Build** | `generate-config.js` (Node) — injeta as variáveis de ambiente em `js/config.js` |
| **Hospedagem** | [Vercel](https://vercel.com/) |

## Estrutura do Projeto

```
convite-casamento/
├── index.html              # Convite principal (página inicial)
├── confirmar-presenca/     # Formulário de RSVP
│   └── index.html
├── presentear/             # Página com a chave PIX
│   └── index.html
├── admin/                  # Painel dos noivos (login + confirmações)
│   └── index.html
├── css/
│   ├── style.css           # Estilos do convite
│   └── forms.css           # Estilos dos formulários e do admin
├── js/
│   ├── rsvp.js             # Envio do RSVP para o Supabase
│   ├── admin.js            # Login + dashboard de confirmações
│   └── config.js           # Gerado no build (NÃO versionado)
├── public/                 # Imagens (fotos, enfeites florais, preview)
├── generate-config.js      # Gera js/config.js a partir do .env
├── supabase-setup.sql      # Script de criação da tabela e políticas RLS
├── vercel.json             # Configuração de build/deploy
└── .env.example            # Modelo das variáveis de ambiente
```

## Páginas

### Página Inicial (`/`)
- **Versículo bíblico** — Rute 1:16-17, como abertura do convite.
- **Fotos dos noivos** — imagens em destaque ao longo da página.
- **Nomes dos noivos** — Ana e Lucas.
- **Benção dos pais** — nomes dos pais dos noivos.
- **Data e horário** — 01 de Maio de 2026, às 16h00.
- **Local** — cerimônia e recepção.
- **Links de ação** — atalhos para confirmar presença, presentear e ver a localização.

### Confirmação de Presença (`/confirmar-presenca`)
Formulário com nome, telefone/WhatsApp e confirmação de presença (sim/não). Ao confirmar, revela campos condicionais de quantidade de convidados (1 a 4), restrição alimentar e mensagem para os noivos. O envio grava a resposta na tabela `rsvp` do Supabase e exibe uma tela de agradecimento.

### Presentear (`/presentear`)
Página com a chave PIX dos noivos e botão para copiar a chave para a área de transferência.

### Admin (`/admin`)
Área restrita dos noivos. Após login (Supabase Auth), exibe contadores (confirmados, ausentes, total de respostas e total de pessoas), filtros (todos / quem vai / quem não vai) e a lista completa das confirmações. Protegido por RLS — só usuários autenticados leem os dados.

## Rodando Localmente

Pré-requisitos: [Node.js](https://nodejs.org/) e uma conta no [Supabase](https://supabase.com/).

1. **Configure o Supabase**
   Crie um projeto no Supabase e rode o conteúdo de [`supabase-setup.sql`](./supabase-setup.sql) em **SQL Editor → New query**. Depois, em **Authentication → Users**, crie o usuário (e-mail + senha) que os noivos usarão no `/admin`.

2. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   Preencha o `.env` com a URL e a chave anônima (anon) do seu projeto Supabase:
   ```
   SUPABASE_URL=https://SEU-PROJETO.supabase.co
   SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```

3. **Gere o config e sirva os arquivos**
   ```bash
   node generate-config.js      # gera js/config.js a partir do .env
   npx serve .                  # ou qualquer servidor estático
   ```

## Deploy (Vercel)

O deploy é automático a partir do repositório. Em **Settings → Environment Variables**, defina `SUPABASE_URL` e `SUPABASE_ANON_KEY`. No build, a Vercel executa o `buildCommand` (`node generate-config.js`), que gera o `js/config.js` com as chaves do ambiente — por isso esse arquivo **nunca** é versionado.

## Segurança

- **`.env` e `js/config.js` não são versionados** (ver `.gitignore`) — as chaves reais ficam apenas no ambiente local e nas variáveis da Vercel.
- A **chave anônima (anon)** do Supabase é pública por design; o acesso aos dados é controlado pelas **políticas de RLS**, não pela chave.
- Visitantes só têm permissão de **inserir** RSVP; a **leitura** exige autenticação.
