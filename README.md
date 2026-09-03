# Currency Converter

Production-style full-stack currency converter with a React/Vite frontend, Express API, SQLite persistence, anonymous identity, favorites, history, live conversion, trend charts, and travel budgeting.

## Backend setup

```bash
cd Backend
npm install
copy .env.example .env
npm run dev
```

Set `EXCHANGE_RATE_API_KEY` in `Backend/.env` for the primary latest-rate provider. The backend will fall back to the open ExchangeRate API endpoint when the key is missing or the primary call fails.

## Frontend setup

```bash
cd Frontend
npm install
copy .env.example .env
npm run dev
```

The app expects the API at `http://localhost:4000/api` by default. Open the Vite URL shown in the frontend terminal, usually `http://localhost:5173`.

## Notes

- The frontend never computes conversions. It only sends amount and currencies to the API and renders the server response.
- A UUID is generated in local storage and attached as `X-User-Id` on every API request.
- Favorites require a display-name sign-in. This upgrades the same anonymous user row without passwords, JWTs, or sessions.
- SQLite tables are created on backend boot from `Backend/src/db/schema.sql`.
