# Español Vivo — web frontend

Vite + React + TypeScript SPA for the Spanish class API.

| Mode | Command | API |
|------|---------|-----|
| **dev** | `npm run dev` | Vite proxies `/api` → `VITE_DEV_PROXY_TARGET` (default `http://localhost:8080`) |
| **prod build** | `npm run build` | Uses `.env.production` (`VITE_API_BASE_URL` empty = same origin) |
| **prod Docker** | `docker compose up --build` | nginx serves static files and proxies `/api` → `backend:8080` |

## Quick start (this laptop)

```bash
# Terminal 1 — API
cd ../app-back/spanish-class-app   # or your API path
mvn spring-boot:run

# Terminal 2 — web
cd spanish-class-web
npm install
npm run dev
```

Open http://localhost:5173

## Environments

- `.env.development` — local Vite
- `.env.production` — baked into `npm run build` / Docker image
- `.env.*.local` — gitignored overrides

If the API is not on the same host in production:

```env
# .env.production.local (or build arg)
VITE_API_BASE_URL=http://YOUR_DEBIAN_IP:8080
```

Recommended on Debian: keep `VITE_API_BASE_URL` empty and put nginx in front of both (see `deploy/nginx.conf`).

## Debian server (prod)

1. Clone this repo and the API repo on the server.
2. Run the API (Docker or systemd) on port 8080, named/reachable as `backend` from the web container, **or** edit `deploy/nginx.conf` `proxy_pass` to `http://127.0.0.1:8080`.
3. Build and run the web container:

```bash
docker compose up -d --build
```

Or without Docker:

```bash
npm ci
npm run build
# serve ./dist with nginx/caddy; proxy /api to localhost:8080
```

4. Point `APP_CORS_ALLOWED_ORIGINS` on the API to your public front origin (e.g. `http://server-ip` or your domain).

## What’s included so far

- Login / register (professor or student)
- JWT session + refresh
- Professor roster list
- Student “my professors” list
- `X-Request-Id` on API calls (matches backend SIEM logs)

## Scripts

```bash
npm run dev          # development
npm run build        # production bundle → dist/
npm run preview      # preview production build locally
npm run lint
```
