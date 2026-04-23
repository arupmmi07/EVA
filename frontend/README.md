# EVA frontend (POC)

## Running the app

```bash
cd frontend
npm install
npm run dev
```

## Optional: live EVA chat API

When **`VITE_EVA_USE_BACKEND=1`**, each chat submit calls **`POST /api/eva/chat`**. The Vite dev server proxies **`/api`** to **`http://127.0.0.1:5000`** (see `vite.config.ts`), so start the Flask backend first ([`../backend/README.md`](../backend/README.md)).

1. Copy env: `cp .env.example .env`
2. Set `VITE_EVA_USE_BACKEND=1` in **`.env`**
3. Restart `npm run dev` (Vite reads env at startup)

The chat pane shows a small **EVA API** badge when this mode is on. With the flag off (`0`), the demo keeps its scripted in-browser replies.

