# AI/ML Ops Factory — artifact index

Systems case study for the Azure ML project factory. Two factories plus an origin prototype. No fake factory UI on this static site.

| Artifact | Path | What it covers |
| --- | --- | --- |
| Factory architecture | `../architecture.md` | Four repos, two factories, R1 Terraform boundary |
| Evidence and gates | `../evidence-and-gates.md` | Taxi-live vs generated vs Foundry-in-process |

**Repos**

- [AIML-SCAFFOLD](https://github.com/rubyrayjuntos/AIML-SCAFFOLD) — generator
- [azure-aiml-ops](https://github.com/rubyrayjuntos/azure-aiml-ops) — generated R1 project
- [azure-mlops](https://github.com/rubyrayjuntos/azure-mlops) — live MLOps v2 taxi
- [azuredev-3d78](https://github.com/rubyrayjuntos/azuredev-3d78) — private Databricks/Foundry origin (not the generator)
