# AI/ML Engineer Academy — curriculum map

Modules below match `src/data/curriculumData.ts` and `labs/`, not an older outline.

| Module | Required lab (CPU / default CI) | Survey or optional |
| --- | --- | --- |
| **1. Foundations** | FastAPI SSE, multi-stage Dockerfile, sklearn TF-IDF, leakage/PII clinics, hashed bag-of-words RAG citation | Neural embeddings, vector DBs, gRPC/WebSocket |
| **2. LLM architectures** | NumPy mechanics: attention mask, KV accounting, LoRA, quant, GRPO, MoE, diffusion/DPO toys | FlashAttention-3 / Hopper as lecture; QLoRA GPU track (`ACADEMY_GPU`) |
| **3. Agent orchestration** | HITL CS agent, read-only SQL + MCP stdio, Dual-LLM stub over fixture HTML, DSPy-style compile stub | LangGraph (no dependency). Live PydanticAI, Playwright, live Dual-LLM sanitizer |
| **4. Secure serving** | Authenticated FastAPI, rate limits, timeouts, CPU p50/p95/p99 bench, speculative-decoding *math* | PagedAttention / vLLM unless `ACADEMY_GPU=1` |
| **5. Production operations** | Immutable versions, offline eval gates, canary → production, bad-canary reject, rollback, telemetry | DeepEval, Promptfoo, Hugging Face / Render live deploy; Azure/Databricks remain plan adapters |

System design is an in-app canvas (`SystemDesignCanvas`), not module 4.

## Design rules

- **Evidence over attendance.** Labs produce pytest output and often `artifacts/evidence.json` with explicit `claims.*` flags. The UI cannot *see* those files; it only stores a confirm.
- **Survey vs proved.** The atlas and competency contracts mark lecture-only topics. Do not imply they were lab-proved.
- **Mentor is optional.** The model sits on the workflow; the workflow still exists if the key is missing.
