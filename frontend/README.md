# FinGuard AI Frontend

FinGuard AI is a React dashboard for exploring revenue forecasts and assessing
company bankruptcy risk. The frontend is built with Vite and currently uses
mock services to generate demo results.

## Features

- Overview dashboard for the available financial analytics workflows.
- Revenue forecasting from manually entered data or an imported file.
- Bankruptcy-risk assessment from manually entered financial statements or an
  imported file.
- CSV, XLS, and XLSX file import with validation and a data preview.
- Responsive layout with lazy-loaded application pages.

## Requirements

- Node.js 18 or later
- npm

## Getting started

From this directory:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually
`http://localhost:5173`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module replacement. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run ESLint against the frontend source. |

## Environment configuration

Copy the example environment file before configuring a local API:

```bash
cp .env.example .env.local
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env.local
```

The available variable is:

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Base URL used by the shared API request helper. | `http://localhost:5000` |

Only variables prefixed with `VITE_` are exposed to browser code. Do not put
secrets in frontend environment files.

## Demo mode and API integration

Demo mode is enabled in `src/services/config.js`:

```js
export const USE_MOCK_API = true;
```

In this mode, revenue and bankruptcy requests use the local mock service and
return simulated results after a short delay. The demo forecast uses INR and
calculates future revenue from the supplied revenue, growth rate, and forecast
horizon. The demo bankruptcy assessment returns a sample risk level and
probability.

`VITE_API_BASE_URL` is available for the shared request helper, but setting it
alone does not enable real predictions. The service modules currently throw an
explicit error when mock mode is disabled; backend endpoints must be
implemented in `src/services/revenueApi.js` and
`src/services/bankruptcyApi.js` before switching to live predictions.

## Application routes

| Route | Page |
| --- | --- |
| `/` | Overview |
| `/revenue-forecast` | Revenue forecasting |
| `/bankruptcy-risk` | Bankruptcy-risk assessment |
| `/settings` | Settings |

Unknown routes redirect to `/`.

## Importing financial data

Both analytics pages accept files up to 10 MB in CSV, XLS, or XLSX format.
The first worksheet is read, and when a `Year` or `FinancialYear` column is
present, the latest year is used.

### Revenue forecast columns

Required columns:

- `CompanyName` (also accepts `Company` or `CompanyTitle`)
- `Revenue` (also accepts `LatestRevenue` or `HistoricalRevenue`)
- `GrowthRate` (also accepts `AnnualGrowthRate` or `EstimatedGrowthRate`)

Optional columns:

- `ForecastYears` (also accepts `ForecastHorizon` or `ForecastPeriod`)
- `Year` or `FinancialYear`

`ForecastYears` must be `1`, `2`, or `3`. Growth rates must be between `-100`
and `1000`.

### Bankruptcy-risk columns

Required columns:

- `CompanyName` (also accepts `Company` or `CompanyTitle`)
- `TotalAssets`
- `TotalLiabilities`
- `CurrentAssets`
- `CurrentLiabilities`
- `Revenue`
- `NetIncome`

The importer accepts comma-separated numbers and common header formatting
variations such as spaces, underscores, and capitalization.

## Project structure

```text
src/
├── components/layout/   Shared sidebar and header
├── pages/               Overview, forecast, risk, and settings pages
├── routes/              React Router route definitions
├── services/            API helpers and mock services
├── App.jsx              Application shell
├── index.css            Global styles and Tailwind theme
└── main.jsx             Application entry point
```

## Production build

Build the frontend with:

```bash
npm run build
```

The generated static assets are written to `dist/` and can be deployed to
any static hosting provider. Configure the hosting provider to serve
`index.html` for client-side routes.
