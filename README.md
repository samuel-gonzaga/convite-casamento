# Convite de Casamento — Paula & Fernando

[**Acessar o convite**](https://casamentopaulaefernado.com.br/)

## 📸 Preview

<p align="center">
  <img src="./public/demo.png" alt="Preview do convite" width="800"/>
</p>

Página de convite digital para o casamento de Paula e Fernando, desenvolvida com WordPress e Elementor.

## Visão Geral

O site é uma landing page de página única com seções complementares para confirmação de presença e lista de presentes. Foi construído utilizando o construtor visual Elementor sobre WordPress, sem necessidade de código personalizado ou funcionalidades complexas.

## Estrutura do Site

### Página Inicial (`/`)

A página principal apresenta as seguintes seções:

- **Versículo bíblico** — Rute 1:16-17, como abertura do convite.
- **Foto dos noivos** — Imagem principal em destaque.
- **Nomes dos noivos** — Paula e Fernando.
- **Benção dos pais** — Nomes dos pais dos noivos.
- **Chamada para o evento** — "Convidamos você para nosso casamento…"
- **Data e horário** — 01 de Maio de 2026, às 16h00.
- **Local** — Cerimônia no Santuário São Geraldo Manjella e recepção na Chácara Happy Day.
- **Links de ação** — Ícones que direcionam para as páginas de confirmação de presença, lista de presentes e localização.

### Confirmação de Presença (`/confirmar-presenca`)

Formulário construído com **Forminator**, com os seguintes campos:

- Nome completo (obrigatório)
- Telefone / WhatsApp (obrigatório)
- Confirmação de presença (sim/não)
- Quantidade de convidados (1 a 4 pessoas)
- Restrição alimentar (opcional)
- Mensagem para os noivos (opcional)

Os dados submetidos são enviados automaticamente para uma planilha no **Google Sheets** via integração do Forminator, mantendo-a atualizada a cada nova submissão. Isso elimina a necessidade de os noivos organizarem manualmente as confirmações de quem vai, quem não vai, restrições alimentares e demais informações.

### Presentear (`/presentear`)

Página com a chave PIX para quem desejar contribuir com um presente em dinheiro.

## Tecnologias Utilizadas

- **WordPress** 6.9.4 — CMS e gerenciamento de conteúdo.
- **Elementor** 4.0.3 — Construtor visual de páginas (drag-and-drop).
- **Forminator** — Plugin de formulários com integração nativa a Google Sheets.
- **Google Sheets** — Planilha online para centralizar e organizar as confirmações de presença em tempo real.
- **Hospedagem** — Hostinger.

## Funcionalidades

- Layout mobile first
- Formulário de confirmação de presença integrado via Elementor.
- Navegação entre páginas com links de ação na página inicial.

## Como este repositório foi criado

Este repositório foi criado com o objetivo de centralizar e documentar essa landing page desenvolvida com WordPress e Elementor. O código-fonte do tema e plugins não está versionado aqui, o foco é a documentação do projeto e do que foi construído.
