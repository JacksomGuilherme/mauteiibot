# 🤖 MauteiiBot — Twitch Chat Bot

Bot de chat para Twitch desenvolvido em Node.js com foco em automações de stream, comandos customizados e integração completa com a API oficial da Twitch.

O objetivo do projeto é ter um bot totalmente customizável e self-hosted.

---

## Comandos atuais

- !clip `[duração] [titulo]` - 🎬 Criação de clips via API
- !followage `[usuário]` - Mostra o tempo que o usuário segue o canal
- !videonovo - Envia no chat o video mais rescente do canal do youtube
- !comandos - Envia no chat o link para a página com a lista de comandos do bot

---

## 🌐 Acesse a página de comandos

👉 https://jacksomguilherme.github.io/mauteiibot/

---

## Features atuais

- 💬 Conexão ao chat via IRC (tmi.js)
- 🧠 Sistema modular de comandos (1 arquivo por comando)
- 🔁 Sistema automático de refresh de OAuth Token

---

## Tecnologias

- Node.js (v24+)
- tmi.js
- Axios
- SQLite nativo (`node:sqlite`)
- API oficial da Twitch
- Deploy via Discloud

---

