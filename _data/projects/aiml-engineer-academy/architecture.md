# AI/ML Engineer Academy — platform architecture

The academy is a training **applet**, not a paid LMS and not a vendor certificate. The GitHub repository is **public**.

## Layers

### 1. Web app

- React 19 + Vite 6 SPA
- Express (`server.ts`) on port 3000
- Optional AI mentor: xAI Grok via `XAI_API_KEY` (`grok-4.6` default), IP rate limit, 8k prompt cap. Curriculum still runs without a key (keyword fallback).
- `/api/simulate-code` returns **canned logs**. It does not execute Python, Docker, or pytest.
- In-browser simulators (vLLM, ReAct, MCP, diffusion, etc.) are teaching toys.

### 2. Labs

`labs/module-1-foundations` … `labs/module-5-production-operations`. Each has its own `requirements.txt` and is meant to run in its own venv. Extra files (`requirements-gpu.txt`, `requirements-live.txt`, `requirements-browser.txt`, `requirements-eval.txt`, `requirements-deploy.txt`) are optional tracks.

Passing `pytest` is the lab evidence. The SPA **confirms** that the learner says they ran it (`labCompletions` boolean in `localStorage`). It does not ingest JUnit XML.

GitHub Actions: `frontend.yml` (lint, vitest, build) plus one workflow per lab. Module 1 CI also `docker build`s. Module 2 CI sets `ACADEMY_SOLUTION=1` so the content repo grades reference mechanics; learners leave that unset.

### 3. Field atlas

Standalone static page in `atlas/`, also served at `/atlas/`. Audience, contents, non-goals, filterable CPU-proved vs survey vs optional-live. Does not import the React applet.

### 4. Certificate unlock

Browser `localStorage` keepsake. Requires all modules marked complete, lab checkboxes for every module, and module quizzes **or** the program quiz at ≥60%. Not an accredited credential.

## What this portfolio cannot host

Static HTML cannot run Express or the lab virtualenvs.
