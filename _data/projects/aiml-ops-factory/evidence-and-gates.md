# AI/ML Ops Factory — evidence and gates

Unproven capability stays off the ledger.

## What is evidenced

- **azure-mlops taxi reference:** Dev and Prod resource groups (`rg-azmlops-0001dev` / `prod`), `taxi-model` registered in both, working batch endpoints. Pipelines were actually run. Online endpoint not deployed.
- **Fixes inherited by the next MLOps v2 project:** GitHub Actions `id-token: write` on callers, removal of deprecated `AZURE_CREDENTIALS` where OIDC is required, `setuptools` in `train-conda.yml`, valid batch-scoring SKU.
- **azure-mlops monitor-and-retrain:** scheduled workflow + `check_drift.py` (KS). `DRIFT_DETECTED` dispatches training. Healthy/no-retrain vs incomplete reaction-path is still called out in the scaffold capability ledger as not extracted to R1.
- **AIML-SCAFFOLD R1:** contract kernel, deterministic generator, local lifecycle, conditional Terraform/Azure ML batch templates, local evidence. CLI does **not** deploy resources by itself.
- **azure-aiml-ops:** generated tree with receipt, local lifecycle runner, digest-bound Terraform plan/apply, KS drift **without** auto-retrain.
- **azuredev-3d78:** IBM Telco corpus in `cust-churn/data/telco_customer_churn.csv`. Databricks notebooks ingest → silver → gold_feature_snapshots / gold_churn_labels; `04_train_model.py` fits sklearn, logs MLflow, registers. Inference: `AzureDatabricksClient.score_churn` POSTs the same feature contract to `/serving-endpoints/{endpoint}/invocations`; FastAPI `/churn-score` uses that backend when Azure is wired. Tests cover the serving contract with fakes; `scripts/smoke_test_databricks_serving.py` is the live check. Foundry client with `foundry_llm` vs `deterministic_fallback`. Retraining notebook computes drift; source comment says it is not yet a scheduled job.

## What local tests do not prove

Local pytest and `terraform validate` do not establish Azure ML execution, lineage, identity, registration, or endpoint behavior. `doctor --no-cloud` reports context and intended identity; it does not pretend a GitHub token exchange or a state write already happened.

## Foundry / GenAI ops (in process)

Not R1 generated. Scaffold has agent YAML and evaluation fixtures. azuredev has a real HTTP client to a Foundry chat deployment plus tests against fakes and an honest fallback. Do not claim a shipped Foundry-mediated agent runtime as factory output.

## Operator-only live path

Protected publication, replacement saved planning, Terraform apply, charged Azure compute, and live Dev acceptance remain explicit operator actions. Test and Prod stay unvalidated for generated R1 until independently evidenced.

Destructive Container Registry ownership drift was detected and blocked **before apply**. That incident is part of the evidence story: the change process is saved-plan digest review, not the portal.
