# AI Skill Coach — Frontend Prototype

This is a frontend-only clickable prototype of an enterprise skill-management platform called AI Skill Coach. Everything is mocked — no backend, no database, no auth.

Tech stack
- React + TypeScript (Vite)
- TailwindCSS
- Zustand (local state)
- Framer Motion (animations)
- Recharts (charts)

Run locally

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

Open `http://localhost:5173`.

Project structure
- `src/services/mockData.ts` — mock DB-like JSON
- `src/services/mockLLM.ts` — mocked AI responses
- `src/store` — Zustand stores
- `src/pages` — Landing, Employee, Manager, Upload
- `src/components` — reusable UI pieces

How to evolve to real product
- Replace `mockLLM.ts` with a server-side LLM service (with auth & rate-limiting).
- Add a backend (Node/Next) with normalized DB (Postgres) and APIs for employees/skills/learning.
- Add real CSV ingestion pipeline in `UploadSimulator` to persist mappings.
- Add auth (SSO), RBAC, telemetry, and observability.

How to use the new features
1. Configure Azure credentials:
	- Open `Settings` from the header.
	- Paste `Azure OpenAI API Key`, `Azure OpenAI Endpoint` (e.g., `https://your-resource.openai.azure.com`), and `Deployment Name`.
	- Save.

Security note
- Storing API keys in `localStorage` is convenient for a frontend-only prototype but insecure for production — anyone with access to the browser can read them. For any real deployment, place secrets on a backend and call the LLM from the server (or use a short-lived token exchange flow).

How to test the Azure connection
1. Fill in Settings (Key, Endpoint, Deployment) and save.
2. Check the header: a small `LLM` dot will be green when configuration is detected.
3. Open the AI Coach (bottom-right floating button) and send a message. If configured, the app will call Azure OpenAI. If not, it will return the mock response.

Troubleshooting
- If the LLM call fails with CORS or network errors when calling Azure from the browser, create a simple server-side proxy to keep the API key secret and forward requests to Azure. This is strongly recommended for production.

Local proxy server (recommended for local/testing)
1. A small Express proxy is included at `server/index.ts` which uses the official `openai` npm package. It forwards POST `/api/ask` to the OpenAI API and returns the response. This keeps your API key out of browser storage.
2. To run the proxy locally:

```bash
# set your OpenAI key in the environment (macOS / zsh)
export OPENAI_API_KEY="sk-..."
export OPENAI_MODEL="gpt-4.1-mini" # optional
node server/index.js
```

Or during development (TypeScript):

```bash
npx ts-node server/index.ts
```

3. Start the frontend dev server as usual (`npm run dev`). The frontend will call `POST /api/ask` on the same host and port where the frontend is served (Vite dev server proxies static files) — if your proxy runs on a different port, adjust the fetch URL in `src/services/mockLLM.ts`.
