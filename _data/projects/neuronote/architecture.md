# NeuroNote — dual-kernel architecture

NeuroNote is a reference implementation of **Proposal–Verification** architecture for malleable software. AI may propose a change to structure or behavior. It may not become that change until a trusted host admits it.

This is not a general-purpose coding agent, and it is not autonomy. The goal is **controlled malleability**: software that can evolve at runtime without treating generated logic as a peer of the application.

## Three zones

```
Guest (untrusted)     Gatekeeper              Host (trusted)
AI synthesis     →    six-layer verify   →    execute / persist / recover
AppDefinition IR      trust boundary          WASM + worker operators
```

### Guest kernel — synthesis only

The Guest produces declarative `AppDefinition` IR. Providers are swappable: Gemini 2.5 Flash, or Claude / Llama / Mistral through AWS Bedrock. The Guest does **not** participate in the runtime control loop.

### Gatekeeper — the product

Every proposal crosses:

1. Structural validation
2. Semantic verification
3. Honesty oracle (declared intent vs structural effects vs simulated traces)
4. Resource budgets
5. Capability manifest
6. Test-vector simulation

A fluent, on-distribution proposal that fails a gate is rejected. That is the architecture working.

### Host kernel — application authority

- **Tier 1:** QuickJS in WASM, fuel-metered, no ambient capabilities
- **Tier 2:** Web Worker with 46 verified operators (text, math, image, audio, CV), dataflow pipelines, FoldN capped at 1000
- **State:** bidirectional lenses for schema migration, automatic rollback on runtime error, persistent change journal

## What this portfolio cannot host

`rswan-portfolio` is static HTML/CSS/JS. It can show this case study and these markdown artifacts. It cannot serve the Vite runtime or hold a model key.
