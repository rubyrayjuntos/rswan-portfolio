# Tokyo Eye — scientific architecture

Tokyo Eye is a discovery environment, not a chatbot with a molecule wallpaper. The scientist’s current structure, selection, and workflow stage are the runtime context. Generative AI is allowed only inside that box.

## Control plane

The immersive console in the case-study hero is the product metaphor: hypergraph spectrum, protein geometry and energetics, contact-map prediction, energy landscape, conformational ensemble, manifold learning, literature.

Two HTML demos implement two ways in:

- **Discovery Story** — narrative walkthrough of a finding
- **Discovery Cockpit** — live scientist UI (selection, gates, views)

Both are static bundled HTML, so they run next to this portfolio (unlike Kitchen Kontrol’s Vite app).

## Geometry engine

Hierarchical molecular relationships are represented with hyperbolic / Poincaré embeddings so trees of residue, fragment, and pocket structure do not get crushed into Euclidean space. The Agentic Poincaré repo is the geometry/agent runtime; Eidetix Bio is the product shell.

## Model runtime

Training and evaluation are local-to-registered:

1. Candidate architecture (GNN, then atom-level Transformer / MoE)
2. Metric gate that was declared before the run
3. Register or reject — failed runs stay in MLflow

## Evidence store

- Immutable metrics and ablations
- RCSB retrieval for deposited structures and literature
- Deterministic structural-biology checks in front of LLM text
