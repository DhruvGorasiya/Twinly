# 🧠 Twinly — Your AI-Powered Cognitive Twin

Twinly is your personalized AI assistant that connects to your digital life — Gmail, Notion, Slack, GitHub, Google Calendar — to help you **remember**, **reason**, and **act**. 

It functions as a long-term cognitive twin, built to eliminate app fatigue, reduce context switching, and help you stay in flow.

---

## 🚀 Features

- 🔗 **Smart Integrations**: Connects with Gmail, Slack, Notion, GitHub, Google Calendar (OAuth + API).
- 🧠 **Memory Ingestion**: Embeds emails, notes, chats, and meetings into long-term memory (via Pinecone).
- 🔎 **Intelligent Retrieval**: Uses RAG (Retrieval Augmented Generation) to answer questions contextually.
- 💬 **Natural Language Commands**: Ask Twinly to summarize, plan, or execute — all through simple chat.
- 📆 **Weekly Digest + Timeline**: See a memory timeline and task digest curated by your digital twin.
- 🛠️ **Action Execution**: Send emails, create Notion pages, open GitHub issues, schedule meetings, and more — all from one interface.

---

## 🧱 Tech Stack

**Frontend**
- Next.js + Tailwind CSS
- Clerk (Authentication)
- tRPC for typed API routes

**Backend**
- FastAPI (Python)
- LangChain + GPT-4o
- Celery + Redis (Async Task Queue)
- PostgreSQL (via Supabase or Neon)
- Pinecone (Vector Database for Memory)

**DevOps**
- Vercel (Frontend Hosting)
- Fly.io (Backend Hosting)
- Docker + Cloud Build (CI/CD)

---

## 🧪 Current Status

🛠️ **MVP in development**

- [x] Gmail OAuth + memory embedding  
- [x] Notion page extraction + summarization  
- [x] Chat UI connected to vector + LLM pipeline  
- [ ] Action execution across integrations  
- [ ] Memory timeline view and digest module

---

## 🧠 Vision

Twinly isn't just another productivity tool — it's a **persistent, personalized, execution-capable second brain**. It helps you think clearer, act faster, and never forget what matters.

- Memory-first
- Privacy-conscious
- Action-driven

---

## 🛡️ Security & Privacy

- OAuth 2.0 for all third-party integrations
- End-to-end encryption in transit
- No third-party data shared without explicit user consent

---

## 🗺️ Roadmap

- ✅ Initial integrations (Gmail, Notion, Slack)
- 🚧 Memory ranking + clustering
- ⏳ Autonomous agent loop
- 🔐 Secure workspace switching
- 📊 Analytics and usage patterns (opt-in only)

---

## 🤝 Contributing

We’re in early development — contributions, feedback, and ideas are welcome!

1. Clone the repo
2. Set up `.env` files for frontend and backend
3. Run the dev servers
4. Submit pull requests or open issues 🚀

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && poetry install && uvicorn app.main:app --reload
```

Created with ❤️ by @dhruvgorasiya.
For access, collaboration, or feedback — open an issue or reach out directly.
