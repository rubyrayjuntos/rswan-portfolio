export type Spec = { title: string; description: string };
export type Step = { title: string; description: string };
export type Plate = { title: string; description: string; image: string };
export type Artifact = { name: string; description: string; url: string };

export type Project = {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  value: string;
  arch: string;
  domain: string;
  cap: string;
  year: number;
  role: string;
  status: string;
  tech: string[];
  challenge: string;
  development: string;
  outcome: string;
  outcomeLine: string;
  proofClaim: string;
  journey: Step[];
  specs: Spec[];
  gallery: Plate[];
  artifacts: Artifact[];
};

export const projects: Project[] = [
  {
    id: 26,
    slug: "neuronote",
    title: "NeuroNote",
    tagline: "AGENTIC AI SAFETY ARCHITECTURE",
    value: "AI that can invent software, but never owns the runtime — proposals stay proposals until a state machine proves them safe.",
    arch: "Dual-kernel: Guest proposes, Gatekeeper verifies (structure → semantics → honesty), Host executes in WASM. Authority stays with the host.",
    domain: "safety",
    cap: "Governance",
    year: 2025,
    role: "Architect, Engineer & Technical Product Lead",
    status: "in-progress",
    tech: ["PVA / Dual Kernel", "QuickJS WASM", "Honesty Oracle", "Zod", "Gemini"],
    challenge:
      "AI-generated logic is usually treated as a peer of the application: it writes code, mutates state, and hopes the prompt was honest. That fails the moment the model drifts, injects, or exceeds the capability it declared. NeuroNote had to make runtime-generated behavior a guest — verified, sandboxed, and reversible — without giving up malleability.",
    development:
      "Built a TypeScript/React/Vite reference implementation of Proposal–Verification architecture. Guest kernel (Gemini, or Claude/Llama/Mistral via Bedrock, plus Groq) synthesizes AppDefinition IR only. A three-phase Gatekeeper — structural validation, semantic verification, honesty oracle (including test-vector simulation) — sits on the trust boundary, with resource budgets and a capability manifest as additional Host constraints. The Host kernel executes in a fuel-metered QuickJS WASM sandbox and a worker with 40 registered operators. Bidirectional lenses migrate schema; a custom JSON FSM owns application state; runtime errors roll back; a change journal keeps the audit.",
    outcome:
      "A working dual-kernel control plane where AI proposes, the gatekeeper validates, and the host executes. Interactive app needs a model key and is not hosted on this static portfolio. Source: github.com/rubyrayjuntos/Neuronote.",
    outcomeLine:
      "Proves: I can design a governed agent runtime from first principles — Guest, Gatekeeper, and Host kernel.",
    proofClaim:
      "PVA dual-kernel architecture with three-phase gatekeeper, QuickJS WASM sandbox, 40 registered operators, and model-agnostic provider routing.",
    journey: [
      { title: "Treat the model as hostile by default", description: "Stopped implying that generated logic is application code. Every AI artifact is untrusted input until it survives verification." },
      { title: "Host–Guest, not prompt–hope", description: "Split the runtime: Guest synthesizes declarative AppDefinitions. Host owns validation, rendering, persistence, and recovery. Guest never joins the control loop." },
      { title: "Gatekeeper as the product", description: "Three verification phases sit on the trust boundary — structure, semantics, honesty — so a fluent proposal cannot skip the gate. Budgets and the capability lattice further constrain what the Host will execute." },
      { title: "Execute only what was admitted", description: "WASM fuel metering, worker isolation, and 40 registered operators. No ambient capabilities. Bounded iteration. Rollback on runtime error." },
      { title: "Journal the change, not the vibe", description: "Every accepted mutation leaves a diff, a verification score, and a recoverable prior state. Observability is how you prove the boundary held." },
    ],
    specs: [
      { title: "Untrusted reasoning, trusted authority", description: "The Guest kernel produces IR. It does not execute, persist, or talk to operators. Application authority lives only in the Host." },
      { title: "Three-phase gatekeeper", description: "Structural validation, semantic verification, and honesty oracle (intent vs effects vs traces, including test-vector simulation) before any proposal is adopted. Resource budgets and a capability manifest constrain Host execution." },
      { title: "WASM + worker isolation", description: "QuickJS with fuel metering in WASM; 40 registered operators (text, math, image, audio, CV) behind a worker with no ambient capabilities and a FoldN cap of 1000." },
      { title: "Logic-as-data, not eval", description: "Behavior is JSON schema, not generated source. Bidirectional lenses migrate state; failed runtime automatically reverts." },
      { title: "Model-agnostic guest", description: "Provider interface for Gemini 2.5 Flash, Groq, and Bedrock-hosted Claude, Llama, and Mistral. Swap the synthesizer without rewriting the Host." },
      { title: "This site cannot host the runtime", description: "Vite + React app with a model key. GitHub is the public source until a keyed host exists." },
    ],
    gallery: [
      { title: "Trust boundary", description: "The old way let AI touch core logic directly. NeuroNote treats every proposal as untrusted logic-as-data until the host safety pipeline admits it.", image: "/surfaces/neuronote-comparison.jpg" },
    ],
    artifacts: [
      { name: "GitHub Repository", description: "Public source for NeuroNote", url: "https://github.com/rubyrayjuntos/Neuronote" },
    ],
  },
  {
    id: 22,
    slug: "tokyo-eye",
    title: "Tokyo Eye",
    tagline: "HYPERBOLIC SCIENTIFIC PLATFORM",
    value: "AI as lab partner, not oracle — hyperbolic GNN + provenance that makes every inference retraceable, not plausible.",
    arch: "Poincaré embeddings, MoE routing, pgvector control plane, and a 20-tool coordinator bound to the open structure and MLflow gates.",
    domain: "science",
    cap: "Platform",
    year: 2025,
    role: "Architect, Engineer & Technical Product Lead",
    status: "in-progress",
    tech: ["Hyperbolic GNN", "e3nn", "MoE", "FastAPI", "pgvector", "Terraform"],
    challenge:
      "Scientific assistants fail when they sit next to the work instead of in it — inventing plausible chemistry, ignoring the open structure, and leaving no provenance. Tokyo Eye had to bind agents to the current graph, selected residues, and preregistered metric gates, and keep geometry, data, and session state on one governed write path.",
    development:
      "Built the platform in tokyo-eye-agenticpoincare. Science extra: PyTorch/PyG, geoopt Poincaré, e3nn SE(3), GUDHI TDA, MoE routing, evidential heads, RDKit, OpenMM, PDB/dehydron ingestion. Agent: FastAPI, JWT, rate-limited sessions, WebSocket viewport directives, 20-tool coordinator, Bedrock → Anthropic → Mock, hypothesis + literature tools. Data: pgvector hyperbolic similarity, 30-schema migrations local↔Aurora, dimensional model, single-write-path normalizer, provenance_run. Infra: Terraform Aurora+S3, MLflow+Optuna, property-gate CI (corpus/smoke/curv). Visualizer: three XState machines (viewport, discovery phase, hypothesis lifecycle).",
    outcome:
      "Private source of truth is tokyo-eye-agenticpoincare. Public research showcase is hgnn-protein-ligand. Findings docs include abandoned claims as well as surviving physics; unproven capability stays labeled unproven.",
    outcomeLine:
      "Proves: I can bind scientific agents to a governed write path — hyperbolic geometry, provenance, and property gates in one platform.",
    proofClaim:
      "FastAPI / pgvector control plane, 20-tool coordinator, Terraform Aurora+S3, MLflow property-gate CI, and Poincaré GNN + MoE science extra.",
    journey: [
      { title: "Put AI in the scientist’s actual context", description: "Rejected chatbot-beside-the-work. The agent must see current structures, selected residues, workflow stage, and visual state before it is allowed to speak." },
      { title: "Hyperbolic geometry as the spatial prior", description: "Poincaré / geoopt embeddings so hierarchical residue, fragment, and pocket structure stay continuous instead of flattening into a Euclidean bag of atoms." },
      { title: "Versioned science, not a frozen miss", description: "DTIE v3–v6 live in tree. Production inference is the V5 GNN path; training continues on v6 with MLflow governance. MoE and e3nn are in the science extra, not a slide overlay." },
      { title: "One write path, then the agent", description: "All data writes go through the normalizer. provenance_run is recorded before results. The 20-tool coordinator cannot skip that contract." },
      { title: "Session machine vs portfolio HTML", description: "XState owns the React Poincaré dashboard in the platform repo. This site is the write-up, not the live visualizer." },
    ],
    specs: [
      { title: "Context-bound scientific agents", description: "FastAPI coordinator with JWT, rate limits, and a WebSocket viewport. XState in the visualizer plus the open structure constrain what the LLM may say." },
      { title: "Hyperbolic GNN + MoE science", description: "PyTorch, geoopt Poincaré, e3nn SE(3), GUDHI persistence, MoE routing, evidential (epistemic + aleatoric) heads, RDKit/OpenMM, PDB/dehydron ingestion. Agent container stays lightweight — no PyTorch on the API image." },
      { title: "Governed data plane", description: "PostgreSQL 16 / pgvector hyperbolic similarity, 30-schema migrations local↔Aurora, dimensional model, single-write-path normalizer, provenance_run lineage, Terraform Aurora + S3." },
      { title: "MLflow as a contract", description: "MLflow + Optuna. Mandatory training schema in mlflow_governance.py. Smoke proves field emission. Multi-stage parent/child lineage is documented as not yet proved. Property-gate CI: corpus / smoke / curv." },
      { title: "Property gates and honest findings", description: "gates.yml property tests (corpus / smoke / curvature). Findings markdown records abandoned claims (λ₂ as cancer discriminator) alongside surviving dehydron physics." },
    ],
    gallery: [
      { title: "Scientist control plane", description: "Hypergraph spectrum, protein geometry, contact maps, and energy landscape on one immersive console.", image: "/plates/tokyo-eye-scientist-console.svg" },
      { title: "Hyperbolic scientific engine", description: "Protein in a Poincaré-style field with residue focus, fragment screening, epistemic uncertainty, and literature DOIs.", image: "/plates/tokyo-eye-hyperbolic-engine.svg" },
    ],
    artifacts: [
      { name: "hgnn-protein-ligand", description: "Public research showcase", url: "https://github.com/rubyrayjuntos/hgnn-protein-ligand" },
    ],
  },
  {
    id: 21,
    slug: "kitchen-kontrol",
    title: "Kitchen Kontrol",
    tagline: "HACCP OPERATIONS PLATFORM",
    value: "AI that disappears into the work — staff finish logs with wet hands, bilingual, mid-service, because the kitchen can't pause for software.",
    arch: "Phase-based ops surface + HACCP-mapped forms + voice where hands are full. Evidence, not theater.",
    domain: "ops",
    cap: "Product",
    year: 2025,
    role: "Architect, Engineer & Technical Product Lead",
    status: "in-progress",
    tech: ["HACCP Ops", "PostgreSQL", "JWT", "Ajv", "Express", "React"],
    challenge:
      "Paper HACCP logs were eating shift time and still missing Texas TFER and USDA 7 CFR 210 requirements. The product had to work on wet-hands, bilingual, multi-station shifts — and still produce audit-ready evidence without pretending a cafeteria network is a control.",
    development:
      "Shipped a React/Express ops platform (kitchen-kontrol) with JWT auth, Postgres migrations, Ajv JSON-schema HACCP forms, planogram CRUD, weekly log-status SQL, Docker/nginx, and GitHub Actions. Companion repos: kk-logger (Vite/TS HACCP SPA with TFER range validators and EN/ES), MilkTrace-Voice (Web Speech API + keyword parser for milk inventory), and MyKitchen (single-file HTML hub). Browser STT is real. Gemini Live, Bedrock, SageMaker, Transcribe, Lex, and Rekognition are not in these repos.",
    outcome:
      "Public proof is the GitHub family, not a cloud overlay. kitchen-kontrol is a Node ops app (private); kk-logger and MyKitchen are public. Site-count and waste figures from earlier product copy are not reproduced in these repositories.",
    outcomeLine:
      "Proves: I can ship a production ops platform end-to-end — from database schema to CI to Docker deploy.",
    proofClaim:
      "Full-stack ops platform with JWT auth, Postgres migrations, Ajv forms, Docker/nginx, and GitHub Actions CI.",
    journey: [
      { title: "Watch the line, not the backlog", description: "Observed school nutrition shifts where paper HACCP and inventory ate shift time and still failed audits. Requirements came from wet-hands, bilingual, multi-station reality." },
      { title: "Make HACCP a product, not a PDF", description: "Turned TFER temperature rules into digital logs with Ajv schemas, pass/fail gates, and corrective-action flows staff can complete during service." },
      { title: "Ops platform, not a mock", description: "Built kitchen-kontrol as Express + Postgres: JWT, roles, phases, tasks, log templates/submissions, planograms, weekly compliance SQL, Docker, and CI." },
      { title: "Evidence UX in TypeScript", description: "kk-logger is the HACCP SPA: traffic-light tasks, sanitizer/hot/cold/calibration validators, English/Spanish. SharePoint and SSO are written as plans, not wired." },
      { title: "Voice where hands are full", description: "MilkTrace-Voice logs milk inventory with the browser SpeechRecognition API and a keyword/number parser. The hook is named Gemini Live; the runtime is not." },
      { title: "Claim only what GitHub holds", description: "Cafeteria-server and Azure overlay work was not transferred into these repos. This case study stops at the public proof." },
    ],
    specs: [
      { title: "JWT-authenticated ops API", description: "Express 5 with bcrypt login, JWT, rate limits, Winston, Sentry, and a transactional outbox. Postgres 15 with node-pg-migrate; sqlite3 for local/dev." },
      { title: "Ajv HACCP form engine", description: "JSON Schema log templates rendered with React Hook Form. Equipment temps, food temps, planograms, sanitation, reimbursable meals." },
      { title: "Weekly compliance reports", description: "CTE queries for log-template completion rates, date-range filters, and checkCompliance() on temp, planogram, sanitation, and meal records." },
      { title: "Planogram CRUD", description: "Serving-line wells persisted through /api/planograms. Not computer vision. Rekognition is not in source." },
      { title: "Browser STT milk logging", description: "MilkTrace-Voice: Web Speech API plus a deterministic parser for school, milk type, and quantity. Not Amazon Transcribe or Lex." },
      { title: "HACCP range validators", description: "kk-logger encodes sanitizer ppm, cold holding, hot holding, and thermometer calibration limits with corrective-action UI. Offline sync is simulated, not a service worker." },
    ],
    gallery: [
      { title: "Line operations HUD", description: "Frontline kitchen as the product surface: inventory, HACCP, and alerts on the work staff already do.", image: "/plates/kitchen-line-hud.svg" },
      { title: "Daily operations dashboard", description: "Kitchen phases, role assignments, and quick actions for logs, reports, training, and planograms.", image: "/surfaces/kitchen-dashboard.jpg" },
      { title: "Daily logs", description: "Digital HACCP and operations logs replacing clipboard temperature sheets.", image: "/surfaces/kitchen-daily-logs.jpg" },
      { title: "HACCP temperature logging", description: "Walk-in, freezer, and warmer logs with pass/fail status and corrective-action capture.", image: "/plates/kitchen-haccp-temp.svg" },
      { title: "Regulatory compliance", description: "Texas TFER §228.75 and USDA 7 CFR 210 mapped into log types and range checks.", image: "/plates/kitchen-regulatory.svg" },
      { title: "Planogram builder", description: "Serving-line planogram with pan wells. kitchen-kontrol persists planograms through the Express API.", image: "/plates/kitchen-planogram.svg" },
      { title: "Manager reports", description: "Weekly log-status completion rates from Postgres CTE queries in kitchen-kontrol.", image: "/surfaces/kitchen-manager-reports.jpg" },
      { title: "Staff training & rewards", description: "MyKitchen rewards dashboard tracking employee training progress across stations.", image: "/surfaces/kitchen-training.jpg" },
      { title: "Capability board (vision, not GitHub)", description: "Product-vision board for voice, assistant, forecast, and vision. Those AWS services are not in the four GitHub repos.", image: "/plates/kitchen-capability-board.svg" },
    ],
    artifacts: [
      { name: "Ops platform (private)", description: "React + Express + Postgres kitchen-kontrol source", url: "https://github.com/rubyrayjuntos/kitchen-kontrol" },
      { name: "kk-logger (public)", description: "Vite/TypeScript HACCP SPA with TFER validators", url: "https://github.com/rubyrayjuntos/kk-logger" },
      { name: "MyKitchen (public)", description: "Single-file HTML ops hub prototype", url: "https://github.com/rubyrayjuntos/MyKitchen" },
      { name: "MilkTrace-Voice (private)", description: "Browser SpeechRecognition milk inventory logging", url: "https://github.com/rubyrayjuntos/MilkTrace-Voice" },
    ],
  },
  {
    id: 24,
    slug: "ai-ml-ops-factory",
    title: "AI/ML Ops Factory",
    tagline: "AZURE ML PROJECT FACTORY",
    value: "The opinionated factory so teams stop reinventing scaffolding and start where the value is — manifest in, governed Azure ML repo out.",
    arch: "Terraform, OIDC, digest-bound apply, live taxi reference that trained and served in Dev/Prod. The factory is the product.",
    domain: "mlops",
    cap: "Platform",
    year: 2026,
    role: "Architect, Engineer & Technical Product Lead",
    status: "in-progress",
    tech: ["Terraform", "Azure ML", "OIDC", "GitHub Actions", "Generator"],
    challenge:
      "Enterprise MLOps usually collapses into a notebook, a portal click, or a generator that pretends Databricks, Foundry, and Azure ML are one lifecycle. The factory had to generate self-contained project repos without importing a taxi demo or a churn prototype as the platform, and without claiming live Azure proof from local tests.",
    development:
      "Started as a Databricks medallion + telecom-churn product (azuredev-3d78, private): bronze/silver/gold, MLflow train/register (sklearn on gold_feature_snapshots from the IBM Telco corpus), FastAPI /churn-score that calls a Databricks model-serving endpoint, Foundry explanation client. Then stood up Microsoft’s MLOps v2 accelerator as a live taxi instance (azure-mlops) and added scheduled KS drift → retrain. Re-engineered a separate generator, AIML-SCAFFOLD: manifest in, deterministic generate, doctor. Public generated project is azure-aiml-ops. R1 does not generate Databricks, Foundry, online serving, or auto-retrain. Foundry GenAI ops remains in process on the churn prototype.",
    outcome:
      "Three evidenced slices: AIML-SCAFFOLD generates Terraform Azure ML repos; azure-aiml-ops is a generated Dev tree; azure-mlops is the taxi instance that trained, registered, and batch-served in Dev and Prod. Separately, azuredev-3d78 is the Databricks telecom-churn path (train on gold features, infer via model serving + FastAPI). This portfolio hosts the write-up, not a fake factory UI.",
    outcomeLine:
      "Proves: I can build a deterministic ML project factory — Terraform, OIDC, and digest-bound apply — and run a live MLOps v2 taxi with scheduled drift retrain.",
    proofClaim:
      "AIML-SCAFFOLD generator (validate → plan → generate → doctor), live azure-mlops taxi with Dev/Prod RGs, and azuredev-3d78 Databricks medallion with FastAPI serving.",
    journey: [
      { title: "Churn prototype first, not the factory", description: "azuredev-3d78 runs IBM Telco churn through Databricks bronze/silver/gold, trains sklearn in MLflow from gold_feature_snapshots, registers the candidate, and scores through FastAPI → Databricks serving. No project generator." },
      { title: "Run the Microsoft accelerator for real", description: "azure-mlops is a live MLOps v2 taxi project. Dev and Prod resource groups, registered taxi-model, working batch endpoints. Template bugs (OIDC id-token, conda setuptools, SKU) were fixed. Online endpoint was not deployed." },
      { title: "Opinionated monitor and retrain on the taxi path", description: "Added check_drift.py plus a Monday cron workflow: DRIFT_DETECTED dispatches training. That path is on azure-mlops. AIML-SCAFFOLD’s own ledger still marks drift/retrain experimental and excluded from R1 generate." },
      { title: "A generator that is not the taxi", description: "AIML-SCAFFOLD is independent of the churn prototype and is not how azure-mlops was created. Manifest → validate → plan → generate → doctor. Terraform only for R1. Generated example: azure-aiml-ops." },
      { title: "Foundry stays in process", description: "Scaffold holds Foundry YAML contracts. azuredev holds a Foundry chat client with explicit foundry_llm vs deterministic_fallback. Neither is R1 generated output." },
    ],
    specs: [
      { title: "Deterministic project generator", description: "aiml-scaffold validate / plan / generate / doctor. source-manifest.yaml, resolved-plan.json, generation-receipt.json. CLI does not deploy Azure resources." },
      { title: "Terraform as the R1 setup path", description: "Generated Azure ML workspace, identity-based storage, Key Vault/Log Analytics as configured, GitHub OIDC. Digest-bound plan artifacts; apply is a separate manual dispatch." },
      { title: "Local-first, cloud-honest lifecycle", description: "Same Python modules for prepare → train → evaluate → conditionally register → explicit-version batch score. Local green does not count as Azure ML execution." },
      { title: "Live taxi reference (not generated by SCAFFOLD)", description: "azure-mlops: rg-azmlops-0001dev/prod, taxi-model in both, working batch endpoints. GitHub Actions + OIDC. Scheduled KS drift can trigger retrain. Online serving deferred." },
      { title: "Generated R1 project", description: "azure-aiml-ops: local lifecycle runner, Terraform, OIDC smoke, train/deploy-batch workflows when enabled, KS drift workflow that does not auto-retrain." },
      { title: "Databricks telecom churn (not generated)", description: "azuredev-3d78: medallion tables, MLflow train/validate/promote on Telco features, inference via Databricks model serving invoked from FastAPI /churn-score." },
      { title: "Not R1 (yet)", description: "Databricks, Foundry agents, Azure AI Search, online endpoints, and auto-retrain are not AIML-SCAFFOLD generate output." },
    ],
    gallery: [
      { title: "Factory control plane", description: "Intake through monitoring as a product metaphor. The generator instantiates Terraform + lifecycle repos, not a hologram UI.", image: "/plates/factory-control-plane.svg" },
    ],
    artifacts: [
      { name: "AIML-SCAFFOLD", description: "Factory: contracts, generator, Terraform, policy", url: "https://github.com/rubyrayjuntos/AIML-SCAFFOLD" },
      { name: "azure-aiml-ops", description: "Public generated R1 Dev project from the scaffold", url: "https://github.com/rubyrayjuntos/azure-aiml-ops" },
      { name: "azure-mlops", description: "Live MLOps v2 taxi: Dev/Prod, registered model, batch endpoints", url: "https://github.com/rubyrayjuntos/azure-mlops" },
      { name: "azuredev-3d78", description: "Private Databricks/Foundry churn prototype (origin, not the generator)", url: "https://github.com/rubyrayjuntos/azuredev-3d78" },
    ],
  },
  {
    id: 23,
    slug: "canon-forge",
    title: "Canon Forge",
    tagline: "CHARACTER-REFERENCE ARCHITECT",
    value: "Creative velocity without drift — identity, set, and shot locks that hold canon across providers, models, and cuts.",
    arch: "Express proxy with identity-lock prompts + canon stills in front of Gemini, xAI, Bedrock, Venice. The model renders inside the contract.",
    domain: "genai",
    cap: "Generative",
    year: 2025,
    role: "Architect, Engineer & Technical Product Lead",
    status: "in-progress",
    tech: ["Identity Lock", "Shot Contracts", "Gemini", "xAI", "Veo", "Express"],
    challenge:
      "Image models drift. A headshot, a wardrobe turn, a library interior, and a medium shot of the same figure will not stay one canon unless identity, set, and camera are locked assets — not a prompt you hope the model remembers.",
    development:
      "Built a TypeScript/React/Vite suite (CharacterForge, SetForge, CompositorForge, SceneForge) with an Express proxy. Generations go through /api/generate (Gemini, xAI Grok Imagine, Venice, Bedrock Titan/SD, local SD). Default client provider is xAI. Canon stills attach as reference or init images where the provider allows it. SceneForge builds keyframe sequences and a flipbook; /api/generate-video calls Veo for 8-second clips. Profiles persist in localStorage. GitHub Actions lint and build; node:test covers identityLock and provider helpers.",
    outcome:
      "Public source at github.com/rubyrayjuntos/canon-forge. Needs provider keys on the Express server. This static portfolio cannot host it. Render.yaml and a GHCR Docker workflow exist; the Dockerfile in tree is a dev stage. Not a multi-tenant SaaS.",
    outcomeLine:
      "Proves: I can design a generative production pipeline that keeps identity, set, and shot canon locked across providers.",
    proofClaim:
      "Four-forge architecture (Character, Set, Compositor, Scene) with identity-lock prompt contracts, multi-provider routing (Gemini, xAI, Bedrock, Venice, local SD), and Veo video.",
    journey: [
      { title: "Stop asking the model to remember the person", description: "Treated identity as an approved asset plus a written identity-lock block. The canon headshot is attached when the provider accepts a reference image." },
      { title: "Lock the room the same way", description: "Sets declare spatial invariants, landmarks, forbidden changes, and a lighting-rig lock. Wide/medium stills become the set’s reference the same way the headshot does for a face." },
      { title: "Compose, then generate", description: "CompositorForge only fires after character, set, action, lens, and landmark lock are specified. The model is a renderer inside a shot list." },
      { title: "Four forges, one production grammar", description: "Character, Set, Compositor, and Scene tabs share CharacterProfile / SetProfile / CompositeConfig / KeyframeScene so a later frame cannot quietly become a different actor in a different room." },
      { title: "Provider is a swap, not the product", description: "Moved keys server-side. Gemini, xAI, Venice, Bedrock, and local SD share one generate path. Veo is the video path." },
    ],
    specs: [
      { title: "Canon headshot as identity kernel", description: "Approved reference stills live on the character profile. Later prompts include an identity-lock block. This is not a face-embedding or InstantID model." },
      { title: "Set invariants and lighting lock", description: "Indoor/outdoor sets declare spatial invariants, fixed landmarks, forbidden changes, and a lighting-rig lock in the prompt." },
      { title: "Shot grammar before pixels", description: "Compositor specs encode shot type, camera angle, lens preset, subject distance, emotion, and landmark lock — production language, not a vibes prompt." },
      { title: "Multi-provider renderer", description: "Express /api/generate routes Gemini, xAI Grok Imagine, Venice, Amazon Bedrock (Titan / SD), and local Stable Diffusion. Client default in source is xAI." },
      { title: "Veo clips and SceneForge keyframes", description: "/api/generate-video calls Veo (default veo-3.0-fast-generate-001) for an 8-second 16:9 clip. SceneForge generates a timed still sequence and plays it as a flipbook. Not an NLE." },
      { title: "Vite app + Express, not this site", description: "React 19 + Vite 6 + TypeScript + Express. Keys stay on the server. This portfolio cannot host it." },
    ],
    gallery: [
      { title: "Production control plane", description: "Face mesh, set wireframe, locked composite, and frame strip on one console — identity through the cut.", image: "/surfaces/canon-command-center.webp" },
    ],
    artifacts: [
      { name: "GitHub Repository", description: "Public source for Canon Forge", url: "https://github.com/rubyrayjuntos/canon-forge" },
    ],
  },
  {
    id: 27,
    slug: "governed-lora-factory",
    title: "Llora Workbench",
    tagline: "GOVERNED LORA WORKBENCH",
    value: "Standardized, auditable fine-tuning — declarative playbook, gated MLflow registry, full provenance on a 4GB T1000 — so the small model you ship is the model you can prove.",
    arch: "corpus25_playbook.yaml declares datasets, thresholds, and stages; trainer.py stays untouched. CE→BCE without code change, r=4 beats r=8.",
    domain: "mlops",
    cap: "Platform",
    year: 2026,
    role: "Architect, Engineer & Technical Product Lead",
    status: "in-progress",
    tech: ["MLflow", "PyTorch", "PEFT LoRA", "Optuna", "HF Hub", "Qwen2-0.5B"],
    challenge:
      "Small-model fine-tuning collapses when every run invents its own data, thresholds, and lineage. Llora had to make the adapter auditable — one trainer.py, one playbook, every promotion gated — and prove it on a 4GB Quadro T1000 without pretending the lab is the cloud.",
    development:
      "Built a governed micro-factory: Qwen2-0.5B-Instruct + PEFT LoRA (r=4) under MLflow hermes/llm-lora isolation (batch2 eff8, seq 64/32/128, BF16). corpus25_playbook.yaml declares SST-2, 4-way intent, and 16-tag BCE, with thresholds ln4→1.5 and BCE 0.693→0.48. One trainer.py routes CE to BCE via task head; corpus25_playbook is the only change. Optuna parent run + child trials, disk + Hub lineage, and assert_promotable(val/loss ≤ threshold) before any registry promotion.",
    outcome:
      "v3 binary CE 0.5804 and v6 16-head BCE 0.464 / 80.5% Hamming, both registered. Optuna parent 919de78a best 0.5804 (trial 004, r=4 beats r=8). Local 4GB proof that a declarative, gated factory works — the same discipline the Factory applies at platform scale.",
    outcomeLine:
      "Proves: I can ship auditable fine-tuning — one trainer, one playbook, every adapter gated and lineaged.",
    proofClaim:
      "Governed LoRA factory: declarative playbook, gated MLflow registry, 4GB guardrails, parent/child lineage, disk+Hub provenance.",
    journey: [
      { title: "Probe on 4GB (200/40 @64)", description: "Proved the loop on a Quadro T1000 before claiming it works." },
      { title: "Intent 24→200 proves both sides of the gate", description: "Showed the gate blocks and the gate passes — same code, different data." },
      { title: "Tags 60→180 → 5ep earns 0.48 honestly", description: "No threshold hacking. Valid loss 0.464 is the receipt." },
      { title: "Disk, Hub, and playbook lock", description: "Every adapter has a lineage you can re-run from the playbook, not a notebook you have to believe." },
    ],
    specs: [
      { title: "Declarative playbook", description: "corpus25_playbook.yaml declares datasets (SST-2, 4-way intent, 16-tag BCE), thresholds (ln4→1.5, BCE 0.693→0.48), and stages; trainer.py stays untouched." },
      { title: "Gated registry", description: "assert_promotable(val/loss ≤ threshold) — nothing registers that didn't earn it. Optuna parent 919de78a + child trials under hermes/llm-lora." },
      { title: "4GB guardrails", description: "batch2 eff8, seq 64/32/128, BF16 — proved on a 4GB Quadro T1000, not a rented A100." },
      { title: "Parent/child lineage", description: "Optuna sweep parent run + child trials, disk + Hub, playbook digest — every adapter is provenance-complete." },
      { title: "CE→BCE without code change", description: "One trainer.py routes binary CE to 16-head BCE via head config. Playbook is the variant, not the code." },
    ],
    gallery: [
      { title: "Governed lineage", description: "Playbook → trainer → MLflow gated registry → Hub. One factory, every adapter auditable.", image: "/plates/factory-control-plane.svg" },
    ],
    artifacts: [
      { name: "GitHub Repository", description: "Governed LoRA micro-factory", url: "https://github.com/rubyrayjuntos/governed-lora-factory" },
      { name: "Hugging Face", description: "rswan-llm-lora adapters (v3 + v6)", url: "https://huggingface.co/TokyoEye/rswan-llm-lora" },
      { name: "Spec", description: "Governed trainer spec", url: "https://github.com/rubyrayjuntos/governed-lora-factory/blob/main/docs/GOVERNED_TRAINER_SPEC.md" },
    ],
  },
  {
    id: 28,
    slug: "hermes-memory",
    title: "The Hermes Librarian",
    tagline: "LOCAL INSPECTABLE MEMORY FOR HERMES AGENT",
    value: "Vector recall and a knowledge graph in one Postgres — the model can find what you said, and you can see the walk.",
    arch: "Two stores, one semantic topology. Apache AGE keeps the session flower; Postgres holds the shared noun manifold with ordered mentions. One bounded walker scores both prefetch and /search.",
    domain: "memory",
    cap: "Platform",
    year: 2026,
    role: "Sole designer & engineer (schema, walker, provider, pane)",
    status: "shipped",
    tech: ["Apache AGE", "pgvector", "Postgres 17", "Python", "Ollama", "Hermes Agent"],
    challenge: "Agent memory is usually a vector dump or a hidden graph. Hubs collapse into a few Title-Case 'Concepts,' sessions leak into each other, and you cannot tell whether injection came from this chat or someone else's nouns. I needed durable local recall that grows with real conversation, stays inspectable, and does not pretend to be a hosted brain.",
    development: "Two stores, one semantic topology. Apache AGE (PG17) is episodic only — this session, this turn, order in time. Postgres is the manifold: global `noun` rows, per-turn passports on `memory_chunk_nodes`, bivalent `semantic_edge` poles (`mentions` = co-occurrence, not theme). ANN entry is `conversations.embedding` (Ollama `nomic-embed-text`, 768-d). One bounded walker scores both prefetch and `/search`: `score = (0.4·sim + 0.4·align·provenance + 0.2·decay) × (magnitude / 8)`. Fountain docks nouns onto their turns and draws teal mention threads. Loopback only (`127.0.0.1:5450` / `:7890`). MIT. Alpha.",
    outcome: "Shipped as `hermes-memory` on GitHub (PR #67): V9 schema, mention-order extractor, drain that stops conversation `Concept`/`ABOUT`, passport isolation tests, Garden-only pane. A real chat seeds the first graph; verify uses synthetics on purpose. Live DB migrate remains an ops step so nouns appear in production memory.",
    outcomeLine: "Proves: I can build inspectable agent memory — episodic flower in AGE, semantic manifold in SQL, one walker for recall.",
    proofClaim: "hybrid-age MemoryProvider with V9 schema, pgvector ANN, AGE Session/Turn flower, ordered mentions, bounded walker, and optional Fountain 3D inspector.",
    journey: [
      { title: "Hybrid store", description: "Postgres + AGE + pgvector as one MemoryProvider; loopback; honest install (you set the password, you seed three facts)." },
      { title: "Flower vs hub", description: "AGE `Turn → ABOUT → Concept` was the wrong semantic layer; hubs and session bleed." },
      { title: "Manifold cutover", description: "Spec → V9 `noun` / passports / `mentions`; AGE keeps only Session/Turn/NEXT." },
      { title: "One walker, one pane", description: "Same beam for prefetch and Fountain; nouns sit on their turn; cockpit/ghost levels taken off the ship surface." },
      { title: "Ship & inspect", description: "Merge to `main`; Garden live at the pane URL; production V9 still a human migrate." },
    ],
    specs: [
      { title: "One topology", description: "Episodic flower in AGE; semantic switches in SQL. No dual Concept/ABOUT + noun graph for the same labels." },
      { title: "Shared nouns, private passports", description: "`noun.label` is global; two sessions can mention Postgres; they do not share the walk's provenance." },
      { title: "Same score everywhere", description: "Prefetch, `/search`, and the pane use one 7-tuple beam; no second ranking in the UI." },
      { title: "Recall without the spectacle", description: "Fountain is optional grammar. Vector + graph injection works if you never open the pane." },
    ],
    gallery: [
      { title: "The Hermes Librarian", description: "Persistent memory & context injection for Hermes Agent — pgvector for semantic recall + Apache AGE knowledge graph for entity expansion", image: "/plates/hermes-librarian.svg" },
    ],
    artifacts: [
      { name: "GitHub — hermes-memory", description: "Memory provider: schema, walker, provider, pane, install CLI", url: "https://github.com/rubyrayjuntos/hermes-memory" },
      { name: "README", description: "Architecture table, quick start, configuration reference, troubleshooting", url: "https://github.com/rubyrayjuntos/hermes-memory#readme" },
      { name: "Conversation manifold design", description: "Nouns, mentions, and Garden pane design spec", url: "https://github.com/rubyrayjuntos/hermes-memory/blob/main/docs/superpowers/specs/2026-09-03-conversation-manifold-design.md" },
      { name: "Architecture docs", description: "Layer map, walker scoring, drain pipeline", url: "https://github.com/rubyrayjuntos/hermes-memory/blob/main/docs/architecture.md" },
      { name: "Fountain pane", description: "3D Garden inspector for Session/Turn/Noun walks", url: "https://github.com/rubyrayjuntos/hermes-memory/blob/main/docs/graph/fountain.html" },
    ],
  },
];

export function projectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const CATALOG_SLUGS = [
  "kitchen-kontrol",
  "neuronote",
  "tokyo-eye",
  "canon-forge",
  "ai-ml-ops-factory",
  "governed-lora-factory",
  "hermes-memory",
] as const;

export const catalog = CATALOG_SLUGS.map((slug) => {
  const p = projectBySlug(slug);
  if (!p) throw new Error(`Missing project ${slug}`);
  return p;
});

const REPOS: Record<string, { label: string; url: string }> = {
  "kitchen-kontrol": {
    label: "kk-logger",
    url: "https://github.com/rubyrayjuntos/kk-logger",
  },
  neuronote: {
    label: "Neuronote",
    url: "https://github.com/rubyrayjuntos/Neuronote",
  },
  "tokyo-eye": {
    label: "hgnn-protein-ligand",
    url: "https://github.com/rubyrayjuntos/hgnn-protein-ligand",
  },
  "canon-forge": {
    label: "canon-forge",
    url: "https://github.com/rubyrayjuntos/canon-forge",
  },
  "ai-ml-ops-factory": {
    label: "AIML-SCAFFOLD",
    url: "https://github.com/rubyrayjuntos/AIML-SCAFFOLD",
  },
  "governed-lora-factory": {
    label: "governed-lora-factory",
    url: "https://github.com/rubyrayjuntos/governed-lora-factory",
  },
  "hermes-memory": {
    label: "hermes-memory",
    url: "https://github.com/rubyrayjuntos/hermes-memory",
  },
};

export function repoOf(p: Project) {
  return (
    REPOS[p.slug] ?? {
      label: "GitHub",
      url: "https://github.com/rubyrayjuntos",
    }
  );
}

export function neighbors(slug: string) {
  const i = catalog.findIndex((p) => p.slug === slug);
  if (i < 0) return { prev: undefined, next: undefined, index: -1 };
  return {
    prev: catalog[(i - 1 + catalog.length) % catalog.length],
    next: catalog[(i + 1) % catalog.length],
    index: i,
  };
}

export function figOf(p: Project) {
  const i = catalog.findIndex((x) => x.slug === p.slug);
  return String(i + 1).padStart(2, "0");
}
