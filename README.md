# JW Planner 📅✨

Um planner pessoal desenvolvido em **React Native (Expo + TypeScript)**, pensado para Testemunhas de Jeová — com foco em **planejamento espiritual, serviço de campo e rotinas diárias**.  
Inclui **planner com alarme**, **calendário**, **cronômetro de campo** e **anotações rápidas**, tudo **offline** usando SQLite.

---

## 🚀 Recursos

- 🕒 **Cronômetro de campo:** registre suas sessões e metas mensais  
- 📆 **Calendário:** reuniões, saídas de campo e discursos  
- ⏰ **Planner com alarmes:** tarefas com notificações locais  
- 🗒️ **Anotações rápidas:** ideias, revisitas, estudos  
- 🌗 **Tema escuro:** estilo “liquidglass / radioativo”  
- 💾 **Offline-first:** todos os dados salvos localmente via SQLite

---

## 📦 Stack Técnica

- [Expo](https://expo.dev) (TypeScript)
- [React Navigation](https://reactnavigation.org/)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [@shopify/flash-list](https://shopify.github.io/flash-list/)
- [dayjs](https://day.js.org/)

---

## 🏗️ Estrutura

app/
_layout.tsx → stack/tab navigator + inicialização do banco
index.tsx → Tabs principais (Planner, Calendário, Cronômetro, Notas)
planner/
calendar/
timer/
notes/
lib/
db.ts → conexão e criação das tabelas SQLite
notifications.ts → agendamento de alarmes locais
date.ts → utilidades de data
components/
Stopwatch.tsx → cronômetro de campo
TaskItem.tsx, EventCard.tsx, etc.
theme/
tokens.ts → cores, bordas e tema
models/
task.ts, event.ts, session.ts, note.ts

---

## 🧩 Scripts disponíveis

```bash
# Inicia o app no modo desenvolvimento
npm start

# Roda no emulador Android
npm run android

# Roda no simulador iOS
npm run ios

# Gera build de preview (EAS)
npm run build
