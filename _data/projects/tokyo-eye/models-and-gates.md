# Tokyo Eye — models and gates

## What is in the science extra

Pinned in `pyproject.toml` / `requirements-science.txt`:

- PyTorch 2.3 + PyG
- `geoopt` (Poincaré / hyperbolic)
- `e3nn` (SE(3) equivariance)
- GUDHI (persistence)
- RDKit, Biotite, Biopython, OpenMM
- scikit-learn, HDBSCAN

MoE routing and evidential uncertainty heads live in the DTIE science tree. The hiring card names **Hyperbolic GNN, e3nn, MoE** plus the platform chips. Evidential, GUDHI, RDKit, and OpenMM stay on this page.

## Versioned DTIE, not one frozen number

`AGENTS.md` is explicit: **V5 is production inference**. V3/V4 remain for adapters. Training continues on **v6** with MLflow governance (`science/training/mlflow_governance.py`). Checkpoints for v5 and v6 variants are in the repo.

A resume line about a same-day Pearson 0.407 is **not** reproduced here. Claim registered MLflow schema and property gates, not a correlation that is not sitting in these docs.

## What “governed” means here

MLflow is a contract (`docs/TRAINING_GOVERNANCE_AND_MLFLOW_SCHEMA.md`):

- Curvature (`log_c`, `curvature_final`) emitted on smoke
- Poincaré disc overlay + angular stats at run end
- Multi-stage parent/child lineage (**P_MLFLOW_02**) documented as not yet proved

Property-gate CI: `.github/workflows/gates.yml` (corpus / smoke / curvature markers in pytest).

## Agents are not the model card

Scientist-facing LLM flows sit behind:

- **FastAPI coordinator** — JWT, bounded sessions, rate limits, WebSocket viewport
- **XState (in code)** — `viewportMachine`, `discoveryPhaseMachine`, `hypothesisLifecycleMachine` in `visualizer/frontend`. Not spec fiction. Not the eidetix-bio Three.js app.
- **20 tools** — GNN inference, provenance, RCSB-adjacent data tools, viewport directives
- **Provider fallback** — Bedrock → Anthropic → Mock
- **Findings honesty** — `docs/findings/` includes abandoned claims (λ₂ as cancer discriminator) and surviving dehydron physics

If a capability is unproven, it is labeled unproven.
