# Kitchen Kontrol — system architecture

Kitchen Kontrol is a school-nutrition operations product: HACCP temperature evidence, roles and kitchen phases, planograms, and manager reports. This page describes **what is in GitHub**, not cafeteria-server or Azure work that was not transferred.

## Four repositories

| Repo | Visibility | Stack | Role |
| --- | --- | --- | --- |
| [kitchen-kontrol](https://github.com/rubyrayjuntos/kitchen-kontrol) | Private | React 19 (CRA), Express 5, Postgres 15, sqlite3, JWT, Ajv, Docker, GitHub Actions | Ops platform and evidence API |
| [kk-logger](https://github.com/rubyrayjuntos/kk-logger) | Public | Vite 6, React 19, TypeScript | HACCP SPA: traffic-light tasks, range validators, EN/ES |
| [MyKitchen](https://github.com/rubyrayjuntos/MyKitchen) | Public | Single `index.html` (Tailwind CDN, Chart.js) | Early ops hub prototype |
| [MilkTrace-Voice](https://github.com/rubyrayjuntos/MilkTrace-Voice) | Private | Vite, TypeScript, Web Speech API | Hands-free milk inventory logging |

## kitchen-kontrol layers

### Client

React 19 with Zustand. Surfaces: daily phases, role assignments, tasks, dynamic HACCP forms (React Hook Form + Ajv), planogram view, training, weekly reports. Not TypeScript. Not Vite.

### API

Express 5: JWT auth, bcrypt, rate limits, Winston, Sentry. Routes for auth, users, logs (templates, assignments, submissions), operations (phases, tasks, ingredients, planograms), management (roles, absences, training), analytics/reports. Transactional outbox + relay for domain events.

### Data

Postgres 15 with `node-pg-migrate` (schema through tasks/phase relationship). sqlite3 remains for local/dev. Log submissions are the evidence store.

### Delivery

Docker Compose (client, server, nginx). Jest (frontend + API) and Cypress e2e. GitHub Actions CI/CD. Render documented as a host. This portfolio is static HTML and cannot serve the app.

## What is not in these repos

- Amazon Transcribe, Lex, Bedrock, SageMaker Forecast, Rekognition, SNS, Personalize
- Gemini Live (MilkTrace hook name only)
- `BroadcastChannel` multi-device sync (that lives in an unpushed local demo)
- A trained demand-forecast model
- Sodexo / Azure production servers
