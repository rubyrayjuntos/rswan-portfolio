# Tokyo Eye — scientific architecture

Tokyo Eye is a discovery **platform**, not a chatbot with a molecule wallpaper. The scientist’s current structure, selection, and workflow stage are the runtime context. Generative AI is allowed only inside that box.

The source of truth is [tokyo-eye-agenticpoincare](https://github.com/rubyrayjuntos/tokyo-eye-agenticpoincare) (private). Public research showcase: [hgnn-protein-ligand](https://github.com/rubyrayjuntos/hgnn-protein-ligand). [tokyo-eye---eidetix-bio](https://github.com/rubyrayjuntos/tokyo-eye---eidetix-bio) is a Three.js dehydron visualizer — not this stack.

The hiring card shows six chips. This page is the full inventory from the platform repo.

## Core ML / AI

| Technology | Role |
| --- | --- |
| PyTorch | Deep learning framework (science container) |
| Hyperbolic GNNs (Poincaré / `geoopt`) | GNNs in hyperbolic space for protein-ligand / allostery work |
| SE(3) equivariant convolutions (`e3nn`) | Rotation/translation-equivariant convolutions for 3D molecular data |
| Mixture of Experts (MoE) routing | Topological gate, capacity, dropout |
| Evidential uncertainty | Epistemic + aleatoric heads |

## Scientific computing

| Technology | Role |
| --- | --- |
| TDA / GUDHI | Persistence barcodes |
| RDKit | Cheminformatics |
| OpenMM | Molecular dynamics (science extra; G12D is a separate KRAS OpenMM app) |
| Protein / PDB ingestion | Dehydron analysis, allostery detection |

## Backend and API

| Technology | Role |
| --- | --- |
| FastAPI | Coordinator API |
| JWT + rate-limited sessions | Auth |
| pgvector | Hyperbolic similarity (Postgres 16 image) |
| 30-schema migrations | Local ↔ Aurora |
| Dimensional model + single-write path | `data/normalizer/core.py` is the only write door |
| `provenance_run` lineage | Experiment provenance before results |

## LLM / agent orchestration

| Technology | Role |
| --- | --- |
| 20-tool LLM coordinator + policies | DTIE, data, viewport, plotting tools |
| Bedrock → Anthropic → Mock routing | Provider fallback |
| Hypothesis engine + literature tools | Hypothesis lifecycle + RCSB-adjacent retrieval |
| WebSocket viewport directives | Real-time camera / highlight / metric |

## MLOps / infrastructure

| Technology | Role |
| --- | --- |
| Terraform (Aurora + S3) | AWS IaC |
| MLflow + Optuna | Tracking and HPO (`training` extra) |
| Property-gate CI (corpus / smoke / curv) | `gates.yml` |
| Multi-stage Docker | Agent (no torch) / science CUDA / pgvector db |

## Scientist session (XState — this is in the code)

An earlier canvas note said XState was spec-only. That was wrong. `visualizer/frontend` imports `xstate` / `@xstate/react` and ships three machines:

| Machine | File | Job |
| --- | --- | --- |
| Viewport | `src/lib/viewportMachine.ts` | Directives, highlights, panels |
| Discovery phase | `src/lib/discoveryPhaseMachine.ts` | Residue → report phase + tool policy |
| Hypothesis lifecycle | `src/lib/hypothesisLifecycleMachine.ts` | Emergent → synthesized speech-act policy |

Tests use `createActor` from XState (`viewportMachine.test.ts`). `state-machine-audit.txt` records wiring gaps (e.g. `activeStructure` not always mirrored into the machines). Claim the machines; do not claim every field is hydrated.

## Control plane vs this portfolio

Two HTML files on **this** site are walkthroughs, not the running platform:

- **Discovery Story** — narrative of a finding
- **Discovery Cockpit** — control-plane metaphor

This static portfolio cannot serve FastAPI, Postgres, or GPU science.
