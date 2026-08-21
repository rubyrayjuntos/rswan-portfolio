# AI/ML Ops Factory — architecture

The factory is three kinds of repo. Mixing them is how MLOps platforms become unmaintainable.

| Repository | Role |
| --- | --- |
| **AIML-SCAFFOLD** | Platform product: contracts, deterministic generator, templates, policy, releases |
| **azure-mlops** | Proven Azure ML reference (taxi fare). Dev and Prod infra, registered model, working batch endpoints |
| **Generated project** | Product-specific manifest, code, workflows, Terraform, evidence |

Microsoft’s [MLOps v2 accelerator](https://github.com/Azure/mlops-v2) is the conceptual ancestor. The taxi instance is **not** the platform.

## R1 generated lifecycle

`provision → train → evaluate → conditionally register → deploy explicit model version → invoke batch endpoint → emit evidence`

Terraform is the sole generated Azure IaC for R1. Bicep, Databricks-native registry, Foundry, Search, online serving, monitoring, and retraining remain reference or future-release work. Bicep must never target a Terraform-owned R1 environment.

## Local-first Dev

Dev execution defaults to local and invokes the **same** prepare, train, evaluate, promotion, packaging, and scoring implementation as the Azure adapter. Azure training and batch compute are independent opt-ins with explicit instance types and a one-node Dev ceiling. The factory never silently substitutes an unavailable SKU.

## Identity

Factory / platform identities are separated from generated-project identities. Generated workloads cannot inherit platform-administration privileges. GitHub OIDC is the CI path (no long-lived client secrets in the taxi reference).

## Provenance artifacts

- `platform/source-manifest.yaml` — normalized user intent
- `platform/resolved-plan.json` — every applied decision
- `generation-receipt.json` — verifies those artifacts, pinned constraints, templates, and the generated tree
