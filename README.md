# FINART

FINART is a React-based personal finance application intended to help people record income, expenses, and investments, plan category budgets, review spending patterns, and keep recurring financial commitments visible. The goal is to give users a clearer picture of the activity they have entered, without presenting recorded transactions as verified bank balances or professional financial advice.

> **Project status:** FINART is an actively developed frontend. Authentication and user-scoped finance features are implemented, but Firebase services must be configured before they can be used. Staff operations, subscription billing, and a live AI advisor backend are not configured. This repository does not include automated tests or a production deployment configuration.

## Contents

- [Features and implementation status](#features-and-implementation-status)
- [Technology](#technology)
- [Application routes](#application-routes)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Firebase setup](#firebase-setup)
- [Data model and calculations](#data-model-and-calculations)
- [Development commands and validation](#development-commands-and-validation)
- [Deployment](#deployment)
- [Security and privacy](#security-and-privacy)
- [Limitations and future work](#limitations-and-future-work)
- [Contributing](#contributing)
- [License and project links](#license-and-project-links)

## Features and implementation status

| Area | Current status |
| --- | --- |
| Public landing page | Implemented. Includes product information, feature and pricing sections, FAQ, and a dashboard preview. |
| Authentication | Implemented with Firebase Authentication: email/password registration and sign-in, Google popup sign-in, email verification, password-reset emails, and protected customer routes. Live behavior depends on Firebase project configuration. |
| Customer dashboard | Implemented at `/dashboard`. Includes an overview, transaction management, budgets, recurring schedule previews, analytics, reports, advisor page, and settings. Finance data is scoped to the signed-in account in the client service; deployed Firestore rules must be reviewed and verified. |
| Transactions | Create, edit, delete, search, filter, sort, and paginate the currently loaded records. Income, expense, and investment contributions can be recorded. |
| Budgets | Create, edit, and delete monthly category budgets. Spending is calculated from matching expense transactions only. |
| Recurring schedules | Create, edit, pause/resume, and delete schedule records and preview upcoming dates. Schedules do not create transactions or move money automatically. |
| Personal analytics | Date/type/category filtering, expense-by-category summaries, monthly income/expense trends, budget comparisons, and a rule-based spending comparison based on loaded records. These figures are not financial advice. |
| Customer reports | Export filtered, currently loaded transaction records as CSV in the browser. XLSX/PDF and persisted download history are not implemented. |
| Preferences | Light/dark theme, display currency, and dashboard alert preferences. Currency and alert preferences are stored in the current browser. Amounts are not converted between currencies. |
| AI financial advisor | The interface is present, but responses are unavailable unless `VITE_FINART_ADVISOR_ENDPOINT` points to a same-origin server endpoint. No provider key or AI service is bundled in this frontend. |
| Staff workspace | Routes under `/staff` require a refreshed Firebase ID token with the trusted `staff: true` custom claim. Staff overview/settings are present. User management, billing, platform analytics, support, staff reports, audit logs, and system health show unavailable states because their backend services do not exist here. |
| Subscriptions and payments | Plan descriptions/prices appear in public pricing content. Checkout, subscription persistence, and Paystack payment processing are not implemented. |

The app does not currently provide bank synchronization, exchange-rate conversion, investment valuation, net-worth calculation, automated recurring payments, account deletion, all-session revocation, or avatar upload.

## Technology

| Technology | Use in this repository |
| --- | --- |
| React 19 and JavaScript | User interface |
| Vite 8 | Development server and production build |
| React Router | Client-side routes |
| Tailwind CSS 4 | Styling, through the Tailwind Vite plugin |
| Firebase 12 | Firebase Authentication and Firestore client |
| React Hook Form and Zod | Authentication form state and validation |
| Radix UI, Lucide React | UI primitives and icons |
| React Toastify | User-facing notifications |
| Oxlint | Linting |

The repository does not configure Jest, another test runner, CI workflows, Sentry, Framer Motion, Paystack, or an OpenAI server integration. Product references to these services should not be interpreted as active integrations.

## Application routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/sign-up` | Guest route | Create an account |
| `/sign-in` | Guest route | Sign in |
| `/forgot-password` | Guest route | Request a password-reset email |
| `/email-verify` | Authentication flow | Verify an account |
| `/dashboard` | Verified authenticated user | Customer finance overview |
| `/dashboard/transactions` | Verified authenticated user | Transaction records |
| `/dashboard/budgets` | Verified authenticated user | Monthly budgets |
| `/dashboard/recurring` | Verified authenticated user | Recurring schedule previews |
| `/dashboard/analytics` | Verified authenticated user | Personal finance analytics |
| `/dashboard/advisor` | Verified authenticated user | Advisor interface; requires an external server endpoint to answer |
| `/dashboard/reports` | Verified authenticated user | CSV export of loaded customer records |
| `/dashboard/settings` | Verified authenticated user | Profile and local preferences |
| `/staff` | Verified authenticated user with `staff: true` custom claim | Staff workspace overview |
| `/staff/users`, `/staff/subscriptions`, `/staff/analytics`, `/staff/support`, `/staff/reports`, `/staff/audit-logs`, `/staff/system-health` | Same staff claim required | Explicitly unavailable until corresponding trusted backend services are implemented |
| `/staff/settings` | Same staff claim required | Staff member's own display name, appearance, and password-reset email |

Client route guards improve navigation and prevent ordinary UI access; they are not authorization for database or server operations. Firebase Security Rules and any future staff API must enforce access independently.

## Project structure

```text
.
├── index.html
├── public/
├── src/
│   ├── assets/                 # Imported visual assets
│   ├── components/             # Shared UI, landing, dashboard, and staff components
│   ├── constants/              # Product content such as plan descriptions and FAQs
│   ├── hooks/                  # Authentication guards and data hooks
│   ├── layout/
│   │   ├── context/            # App, authentication, and theme providers
│   │   └── dashboard/          # Shared dashboard context and layouts
│   ├── lib/                    # Shared UI helpers
│   ├── pages/
│   │   ├── auth/               # Sign-in, sign-up, verification, and reset flows
│   │   ├── dashboard/          # Customer finance pages
│   │   ├── landing/            # Public landing page
│   │   └── staff/              # Staff workspace
│   ├── services/               # Firebase auth, Firestore data, advisor endpoint client
│   ├── utils/                  # Schemas, navigation, and finance calculations
│   ├── App.jsx                 # Route configuration
│   ├── index.css               # Global styles and Tailwind entry point
│   └── main.jsx                # React application entry point
├── firestore.indexes.json      # Firestore index source configuration
├── firestore.rules             # Firestore rules source configuration
├── package.json
└── vite.config.js
```

The `@` import alias maps to `src/`, as configured in `vite.config.js`.

## Prerequisites

- Git
- Node.js and npm versions compatible with the installed Vite 8 toolchain. This repository does not declare a pinned Node.js version in `.nvmrc`, `.node-version`, or `package.json`; use a currently supported Node.js release that satisfies Vite's requirements.
- A Firebase project for real authentication and Firestore-backed dashboard use.

## Getting started

```bash
git clone https://github.com/geliettech/fina.git
cd fina
npm install
```

Copy the example environment file and populate the required Firebase web-app configuration:

```bash
cp .env.sample .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.sample .env
```

Start the local development server:

```bash
npm run dev
```

Vite prints the local URL in the terminal. Restart the development server after changing `.env`.

## Environment variables

The repository provides `.env.sample`. The following values are Firebase **web client** configuration:

| Variable | Required by current Firebase initialization | Purpose |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Yes | Firebase web app configuration |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Firebase Authentication domain |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase project identifier |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase web app identifier |
| `VITE_FIREBASE_STORAGE_BUCKET` | No | Optional Firebase app configuration; Storage upload is not implemented |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | No | Optional Firebase app configuration |
| `VITE_FIREBASE_MEASUREMENT_ID` | No | Optional Firebase app configuration |
| `VITE_FINART_ADVISOR_ENDPOINT` | No | Optional same-origin server endpoint for the advisor; not set by default |

Values prefixed with `VITE_` are included in browser-delivered code and must never contain service-account credentials, private API keys, or other server secrets. The optional advisor endpoint must be a same-origin route whose server verifies Firebase ID tokens, applies authorization and rate limits, and protects any AI provider credentials.

Never commit a populated `.env` file. `.gitignore` excludes `.env` and local environment variants.

## Firebase setup

1. Create or select a Firebase project and register a web app.
2. Copy its web app configuration into the corresponding variables in `.env`.
3. In Firebase Authentication, enable **Email/Password** and **Google** sign-in as required by the app.
4. Configure authorized domains for local development and each deployed domain.
5. Review the verification and password-reset email templates and ensure the configured Firebase Auth domain is available.
6. Create Firestore in the project.
7. Review and publish [firestore.rules](./firestore.rules) to the intended project. The file is source configuration only; it is not automatically deployed by this repository.
8. Create the transaction index described in [firestore.indexes.json](./firestore.indexes.json) (`transactions`: `userId` ascending and `createdAt` descending). The repository does not include a `firebase.json` deployment configuration.
9. Test authentication and Firestore access with separate accounts before storing real financial data.

The Firestore rules allow verified users to access their own `transactions`, `budgets`, and `recurring` documents. They do not provide cross-user staff access. Do not deploy financial data use before reviewing and testing the rules against the intended project.

### Staff access setup

Staff access requires a Firebase custom claim whose signed token includes `staff: true`. A trusted operator must assign this claim from a secure server environment using Firebase Admin SDK after verifying the staff member. The browser never assigns roles. No backend role-provisioning endpoint, staff API, or granular staff permission model is included.

The client-side staff route forces a token refresh and checks the claim before rendering staff pages. This check is a UI gate only. Every future staff data endpoint must independently verify the Firebase ID token, staff authorization, and resource-level permissions on the server. Do not broaden the customer Firestore rules to expose all customer records to staff.

## Data model and calculations

- **Transactions:** existing documents use `userId`, `description`, `transactionAmount`, `transactionType`, and `createdAt`. New records also use `category`, `currency`, `transactionDate`, optional `notes`, and `updatedAt`.
- **Budgets:** user-owned `category`, `amount`, `currency`, `month`, and timestamps.
- **Recurring schedules:** user-owned `description`, `amount`, `currency`, `category`, `transactionType`, `frequency`, `nextDate`, optional `endDate`, `status`, and timestamps.
- **Limits:** the client subscribes to up to 500 newest transactions by `createdAt` and 200 budgets and 200 recurring schedules. Totals, analytics, and CSV exports use the loaded records only; older records may be omitted.
- **Currency:** the UI supports NGN, USD, GBP, EUR, CAD, AUD, JPY, and ZAR. Currency preferences are stored in the current browser. Values are not exchanged or combined across currencies.
- **Cash flow:** displayed cash flow is recorded income minus expenses and investment contributions. It is not an account balance, net worth, or investment valuation.
- **Budgets:** spending totals use matching expense records only.
- **Recurring:** schedules only preview upcoming dates. They do not create transactions, initiate payments, or move money.

## Development commands and validation

Available scripts from `package.json`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the built application locally |
| `npm run lint` | Run Oxlint |

There is no `test` script, configured Jest setup, or test suite in this repository. Do not use `npm test` unless a test runner is added.

## Deployment

The production build command is:

```bash
npm run build
```

The generated static assets are written to `dist/`. Configure a static hosting provider to serve the build and rewrite application routes to `index.html` as required by the hosting platform. No Vercel configuration, deployment workflow, Firebase deployment configuration, or GitHub Actions workflow was found in this repository; deployment is not automated here.

Set the Firebase web-app environment variables in the hosting provider's build environment. Configure Firebase Authentication authorized domains and publish/verify Firestore rules and indexes separately. Configure the advisor endpoint only after its trusted server implementation is deployed. Do not deploy using placeholder environment values.

## Security and privacy

- Never commit `.env` files, private API keys, service-account files, authentication tokens, or customer data.
- Firebase web configuration is client-visible; it is not a substitute for Firestore Security Rules.
- Review and test `firestore.rules` and the required index before using real financial information. The client route guard does not authorize database access.
- Staff access is based on a signed Firebase custom claim provisioned outside the browser. Staff capabilities that require backend data or actions are not implemented.
- Keep private AI, payment, and administrative credentials on trusted servers. Verify Firebase ID tokens and permissions server-side for every privileged API request.
- Do not place secrets in `VITE_` variables. Do not treat client-provided payment status or browser-created audit entries as authoritative.
- This project has not been represented as security-audited or certified.

## Limitations and future work

- Configure Firebase and validate authentication, deployed rules, indexes, and authenticated data flows against a test project or emulator.
- Add trusted backend endpoints and authorization for staff user management, subscriptions/payments, platform analytics, support, operational reports, audit logs, and health status.
- Add a secure server implementation before enabling the AI advisor.
- Subscription checkout, Paystack processing, bank connections, currency conversion, investment valuation, and automatic recurring payment processing are not implemented.
- CSV is the only implemented report export. XLSX/PDF and download history are not available.
- Customer settings do not implement avatar upload, email changes, all-session revocation, or account/data deletion.
- There is no configured automated test runner, CI workflow, monitoring integration, or deployment pipeline.

## Contributing

1. Open an issue to discuss a substantial change before beginning work.
2. Create a focused branch and keep changes scoped to the intended feature.
3. Install dependencies with `npm install`.
4. Run `npm run lint` and `npm run build` before submitting a pull request.
5. Include tests when adding a test setup or when a suitable test runner is introduced. Do not include secrets or real customer data.

## License and project links

No `LICENSE` file was found in this repository. No open-source license is asserted by this README.

- Repository: [geliettech/fina](https://github.com/geliettech/fina)
- Issues: [GitHub Issues](https://github.com/geliettech/fina/issues)
