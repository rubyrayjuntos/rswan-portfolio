# AI/ML Engineer Academy — platform architecture

The academy is a training **applet**, not a paid LMS and not a vendor certificate.

## Layers

### 1. Web app

- React 19 + Vite 6 SPA
- Express (`server.ts`) on port 3000 in development
- Optional AI mentor: xAI Grok via `XAI_API_KEY` — curriculum still runs without a key

### 2. Labs

`labs/module-1` … `labs/module-5`, each with its own `requirements.txt` and venv. Dependencies conflict across labs on purpose (CUDA toolkits, vector drivers, classical ML stacks). Passing `pytest` is the evidence object the UI later confirms.

### 3. Field atlas

Standalone static page in `atlas/`: audience, what is inside, what not to expect, filterable map of CPU-proved vs survey vs optional-live vs thin topics. It does not import the React applet. Shared learning-space pitch, not a product marketing site.

### 4. Certificate unlock

Browser `localStorage` keepsake. Requires all modules complete, lab evidence confirmed for every module, and module quizzes or the program quiz at ≥60%. Not an accredited credential.

## What this portfolio cannot host

Static HTML cannot run Express or the lab virtualenvs. The case study and GitHub are the public surface until a separate host exists for the applet.
