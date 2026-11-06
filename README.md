# Trading Research Lab (TRL)

A personal trading research workstation for:

- Trading plans
- Trading journal
- Strategy development
- Backtesting
- Paper trading
- Analytics
- Algorithmic trading research

---

## 📌 Project Status

- **Current Phase**: Phase 1.5
- **Status**: Workstation foundation + authentication/database foundation
- **Live Deployment**: Hosted on [GitHub Pages](https://jatin-cm.github.io/trading-research-lab/)

---

## 🚀 Development & Build

### Install Dependencies
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your Supabase public frontend credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ENABLE_DEMO_AUTH=true
```

> **Security Note**: Never commit `.env` or real API credentials to Git. Only safe public client keys should be exposed to the browser. The application includes a fallback **Local Demo Authentication Mode** allowing full local inspection without active credentials.

---

## 🗺️ Module Roadmap

| Module | Status | Phase |
|---|---|---|
| **Workstation Shell & UI Design System** | Completed | Phase 1 |
| **Authentication & Database Foundation** | Completed | Phase 1.5 |
| **Trading Plan Editor** | Planned | Phase 2 |
| **Trading Journal & Debrief Database** | Planned | Phase 3 |
| **Strategy Builder** | Planned | Phase 4 |
| **Manual Backtesting Workstation** | Planned | Phase 5 |
| **Historical Data & Automated Backtester** | Planned | Phase 6 |
| **Paper Trading Execution Sandbox** | Planned | Phase 7 |
| **Advanced Performance Analytics** | Planned | Phase 8 |
| **Strategy Versioning & Optimizer** | Planned | Phase 9 |
| **Algo Strategy Runtime Framework** | Planned | Phase 10 |
| **Broker & Exchange API Gateway** | Planned | Phase 11 |
| **Live Algorithmic Execution Engine** | Planned | Phase 12 |

---

## 🗄️ Database Migrations

Database migrations are version-controlled in `supabase/migrations/`:
- `001_initial_schema.sql`: Profiles, trading plans, strategies, versions, journal entries, trades.
- `002_rls_policies.sql`: Row Level Security (RLS) policies guaranteeing multi-tenant user isolation.
- `003_storage_policies.sql`: Private `trade-screenshots` bucket policies restricted by user ID.
