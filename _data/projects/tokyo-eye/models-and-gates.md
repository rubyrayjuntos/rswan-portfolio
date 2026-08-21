# Tokyo Eye — models and gates

## The miss and the pivot

The first PyTorch GNN did not clear the gate. It was not kept as the public model with a footnote. It was replaced the same day with an atom-level Transformer / Mixture-of-Experts architecture, trained and evaluated in that window.

**Same-day Pearson correlation: 0.407** on the evaluation that counted. That number is a registered result, not a slide.

## What “governed” means here

MLflow is used as a contract:

- Estimates preregistered before the run
- Immutable metric gates
- Ablations stored with the run
- Failed experiments preserved (so the next architecture cannot pretend the GNN never happened)

## Agents are not the model card

Scientist-facing LLM flows sit behind:

- **XState** — allowed transitions only
- **Hypothesis** — property tests on structured output
- **Deterministic structural-biology checks** — geometry and chemistry the model does not get to vibe
- **RCSB semantic search** — structures and papers retrieved, not recalled from training data

If a capability is unproven, it is labeled unproven. The architecture doc and this page keep that split explicit.
