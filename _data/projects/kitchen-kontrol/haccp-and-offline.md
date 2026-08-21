# Kitchen Kontrol — HACCP evidence design

## What GitHub actually does for connectivity

Cafeteria Wi-Fi is still a product constraint. These repos do **not** implement a full offline-first sync fabric.

- **kitchen-kontrol** is server-backed (Express + Postgres). No service worker cache of logs. No `BroadcastChannel`.
- **kk-logger** stores session and language in `localStorage` and **simulates** an online/offline sync queue (random delay, fake failures). SharePoint sync is a written plan, not an API.
- **BroadcastChannel** tablet/scanner sync exists in a local Vite demo that was not pushed to GitHub.

Do not read the gallery “offline-first” frame as a shipped GitHub capability.

## Regulations in the workflow

Encoded as log types and validators, not as a policy PDF:

- **Texas TFER §228.75** — temperature control (kk-logger: cold holding, hot holding, sanitizer ppm, thermometer calibration)
- **USDA 7 CFR 210** — NSLP operational requirements appear as reimbursable-meal log types and report copy in kitchen-kontrol

Digital logs include:

- Equipment (walk-in, freezer, warmer) and food temps
- Pass / fail against range
- Corrective-action flow when out of range
- Assignment by user, role, or kitchen phase (kitchen-kontrol)

Electronic signature as a legal-control claim is only as strong as what the form schema stores. Do not upgrade that to a PKI or 21 CFR Part 11 stack — it is not in these repos.

## Bilingual

kk-logger has a full English/Spanish translation map. kitchen-kontrol has a small i18n helper; it is not a complete line-ready locale pack.
