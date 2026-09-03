# Currency Converter

A full-stack currency converter built with a React/Vite frontend, Node/Express backend, and SQLite persistence.

The main rule of the app is that all conversion math, validation, caching, and business logic happen on the backend. The frontend only manages interaction and renders API responses.

## What Is Built

- Live currency conversion with server-side calculation.
- Supported currency list aligned with Frankfurter historical-rate coverage.
- 30-day exchange-rate trend chart.
- Anonymous user identity using a browser-generated UUID.
- Display-name sign-in with no passwords, JWT, sessions, or email flow.
- Conversion history for anonymous and signed-in users.
- Reusable history entries that can be loaded back into the converter.
- Saved favorite currency pairs for signed-in users.
- Favorites page with live current rate and a Use action to load the pair into the converter.
- Travel budgeting mode with 5 selectable currencies.
- Save/reset travel currency sets in local storage.
- SQLite-backed users, favorites, history, and rate cache.

## Tech Stack

Frontend:
- React 18
- Vite
- Plain JavaScript
- Tailwind CSS
- React Router v6
- Zustand for UI/local state
- TanStack Query for server state
- Axios API client with `X-User-Id` interceptor
- Recharts for trend charts
- Lucide icons

Backend:
- Node.js
- Express
- better-sqlite3
- SQLite
- dotenv
- cors
- morgan
- zod

## Project Structure

```text
Backend/
  src/
    controllers/
    data/
    db/
    middleware/
    repositories/
    routes/
    services/
    validators/

Frontend/
  src/
    api/
    components/
    hooks/
    pages/
    store/
```

Backend flow:

```text
routes -> controllers -> services -> repositories -> SQLite
```

## Rate Providers

Latest/live conversion rates:
- Primary: ExchangeRate-API v6 using `EXCHANGE_RATE_API_KEY`
- Fallback: `open.er-api.com`

Historical trend data:
- Frankfurter time-series API

Latest rates are cached in SQLite for about 10 minutes in the `rate_cache` table.

## Identity Model

There is no traditional auth system.

On first frontend load:
- The browser creates a UUID.
- It stores it in localStorage.
- Axios sends it on every request as `X-User-Id`.
- The backend creates a user row when it sees a new UUID.

Signing in:
- The user enters only a display name.
- The same anonymous user row is upgraded with `is_registered = 1`.
- Favorites require this registered state.

Changing the name later updates the same user. It does not create a new account or erase history/favorites.

## API Summary

Base URL:

```text
http://localhost:4000/api
```

Routes:

```text
GET    /api/currencies
POST   /api/convert
POST   /api/convert/travel-budget
GET    /api/rates/trend?base=USD&target=EUR&days=30
GET    /api/history?limit=30
DELETE /api/history/:id
DELETE /api/history
POST   /api/auth/signin
GET    /api/auth/me
GET    /api/favorites
POST   /api/favorites
DELETE /api/favorites/:id
```

All API errors return:

```json
{ "error": "message" }
```

## Environment Files

Backend `.env`:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
DATABASE_PATH=./data/currency_converter.sqlite
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key_here
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## Run Locally

Install backend dependencies:

```powershell
cd C:\Users\Pranav\Desktop\currencyconverter\Backend
npm install
copy .env.example .env
```

Start backend:

```powershell
npm start
```

For auto-restart while developing:

```powershell
npm run dev
```

Install frontend dependencies:

```powershell
cd C:\Users\Pranav\Desktop\currencyconverter\Frontend
npm install
copy .env.example .env
```

Start frontend:

```powershell
npm run dev
```

Open:

```text
http://localhost:5173
```

Backend health check:

```powershell
Invoke-RestMethod http://localhost:4000/health
```

## Build

Frontend production build:

```powershell
cd Frontend
npm run build
```

Backend import check:

```powershell
cd Backend
node -e "import('./src/app.js').then(() => console.log('backend app imports'))"
```

## Database

SQLite database file:

```text
Backend/data/currency_converter.sqlite
```

Tables are created on backend boot from:

```text
Backend/src/db/schema.sql
```

Main tables:
- `users`
- `favorites`
- `conversion_history`
- `rate_cache`

The `Backend/data/` directory is ignored by git.

## Notes

- The frontend does not calculate converted amounts.
- Travel budgeting sends selected currencies to the backend and renders the server response.
- Saved travel sets are stored in localStorage because they are UI preferences, not financial records.
- Favorites and history are stored in SQLite against the current local `userId`.
- If the browser localStorage is cleared, the app creates a new anonymous user ID.
