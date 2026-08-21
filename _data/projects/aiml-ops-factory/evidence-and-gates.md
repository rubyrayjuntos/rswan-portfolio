# AI/ML Ops Factory — evidence and gates

Unproven capability stays off the ledger. That is the same rule as Tokyo Eye’s MLflow gates.

## What is evidenced

- **azure-mlops taxi reference:** Dev and Prod resource groups, `taxi-model` registered in both, working batch endpoints. Pipelines were actually run.
- **Fixes inherited by the next project:** GitHub Actions `id-token: write` on callers, removal of deprecated `AZURE_CREDENTIALS` where OIDC is required, `setuptools` in `train-conda.yml`, valid batch-scoring SKU.
- **AIML-SCAFFOLD R1:** contract kernel, deterministic generator, local lifecycle, conditional Terraform/Azure ML batch templates, local evidence implementation. CLI does **not** deploy resources by itself.

## What local tests do not prove

Local pytest and static Terraform validation do not establish Azure ML execution, lineage, identity, registration, or endpoint behavior. `doctor` reports context and intended identity; it does not pretend a GitHub token exchange or a state write already happened.

## Operator-only live path

Protected publication, replacement saved planning, Terraform apply, charged Azure compute, and live Dev acceptance remain explicit operator actions. Test and Prod stay unvalidated until independently evidenced.

## Roadmap (labeled, not claimed)

Governed retrieval / agent runtime (Foundry mediated by an application API, never as a privileged integration layer), OpenTelemetry/SLO observability, automated recovery. Databricks retrieval proof (Gold data + Vector Search indexes) exists as a separate evidence thread and is not R1 generated output.

Destructive Container Registry ownership drift was detected and blocked **before apply**. That incident is part of the evidence story: the change process is saved-plan digest review, not the portal.
