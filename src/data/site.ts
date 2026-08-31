export const SITE = {
  name: "Ray Swan",
  role: "AI/ML System Architect",
  headline: "GenAI / ML Architect  ·  AI Platform Architect  ·  MLOps / LLMOps",
  city: "Houston, TX",
  revision: "Rev. 2026.08",
  email: "rswan@rswan.org",
  resumeEmail: "intoarts@gmail.com",
  phone: "(409) 264 - 5074",
  phoneHref: "tel:+14092645074",
  github: "https://github.com/rubyrayjuntos",
  linkedin: "https://www.linkedin.com/in/ray-swan-b973525/",
} as const;

export const CLIENTS = [
  "Mazda North America",
  "Revlon",
  "Black & Decker",
  "Fox Sports",
  "Therabody",
] as const;

export const HOME_SECTIONS = ["Position", "Contrast", "Arc", "Proof"] as const;

export const POSITION = {
  kicker: "AI/ML System Architect",
  line1: "I architect AI systems",
  line2: "the way enterprises actually run —",
  punch: "production-grade reliability",
  against: "research-grade hope",
} as const;

export const CONTRASTS = [
  { them: "Think in models & papers", ray: "Think in systems & constraints" },
  { them: "Built demos that worked once", ray: "Built platforms that run 24/7" },
  { them: "Know Jupyter notebooks", ray: "Know production MLOps at scale" },
  { them: "Learned AI first, enterprise second", ray: "Did enterprise 15 years, then layered AI on top" },
  { them: "Optimize for accuracy", ray: "Optimize for reliability, cost, and time-to-value" },
] as const;

export const ARC = [
  { n: "15 yrs", title: "Building enterprise systems", body: "Mazda, Revlon, Black & Decker, Fox Sports, Therabody — where downtime is measured in millions." },
  { n: "Then", title: "I saw AI coming", body: "And realized most teams were building it wrong: research-grade demos in rooms that needed operations." },
  { n: "3 yrs", title: "Enterprise discipline, applied to AI", body: "Platforms, governance, MLOps, agent runtimes — the full lifecycle, not a notebook." },
  { n: "Now", title: "Systems that survive production", body: "Governed AI from infrastructure through the write path. The unproven stays labeled unproven." },
] as const;

export const KEYWORDS = [
  "AI Architect",
  "ML System Architect",
  "Enterprise AI",
  "Production ML",
  "MLOps",
  "LLMOps",
  "Agentic AI",
  "AI Safety",
  "Generative AI",
  "Graph Neural Networks",
  "Scientific AI",
  "Azure ML",
] as const;

export const SUMMARY =
  "GenAI/ML Architect and hands-on AI Platform Architect with 25 years delivering enterprise software, data, integration, and transformation programs. Builds governed AI systems from infrastructure through model and agent runtime: Azure ML, Azure Databricks, Microsoft Foundry, MLflow, Terraform, GitHub Actions, Entra/OIDC, RAG/vector retrieval, and production lifecycle automation. Combines architecture, implementation, product leadership, and evidence-based governance across Azure, GCP, and AWS.";

export const EXPERTISE = [
  {
    title: "AI Platforms & GenAI",
    items:
      "Azure ML; Azure Databricks; Microsoft Foundry; MLflow; RAG; vector retrieval; grounded assistants; agentic systems; MCP-oriented tool boundaries; model evaluation",
  },
  {
    title: "MLOps / LLMOps",
    items:
      "Local-to-cloud lifecycle; champion/challenger; model registry; promotion/retain gates; drift monitoring; retraining; rollback-ready versioning; observability-ready contracts",
  },
  {
    title: "Cloud & IaC",
    items:
      "Terraform; GitHub Actions; Entra ID/OIDC; RBAC; Docker; Azure; GCP/Vertex AI; AWS/SageMaker; APIs; microservices; PostgreSQL",
  },
  {
    title: "Governance & Security",
    items:
      "Digest-bound saved plans; least-privilege identity separation; immutable evidence/provenance; state-machine guardrails; deterministic validation; bounded permissions",
  },
] as const;

export const FEATURED_ARCHITECTURE = {
  title: "Azure GenAI/ML Ops Factory",
  role: "Architect & Hands-on Engineer",
  year: "2026",
  glyph: "cloud" as const,
  bullets: [
    "Re-engineered Microsoft’s Azure MLOps v2 Accelerator concept into a factory that generates modular, self-contained AI/ML project repositories with governed infrastructure and configurable project behavior.",
    "Proved a local-first Azure ML lifecycle using shared Python logic locally and as a four-stage Azure ML pipeline (prepare → train → evaluate → register); live run completed and registered an MLflow model.",
    "Implemented Terraform-managed Azure ML infrastructure with keyless storage, Key Vault, Log Analytics/Application Insights, scale-to-zero compute, Entra/OIDC GitHub CI/CD, and evidence-bound plan/apply governance.",
    "Detected and blocked destructive Container Registry ownership drift before apply; every infrastructure mutation is reviewed through saved-plan and digest verification rather than portal changes.",
    "Established a separate platform-foundation Terraform state and live Azure Databricks Premium workspace; adopted existing Microsoft Foundry resources into Terraform with zero unintended mutation.",
    "Separated factory and generated-project deployment identities so generated workloads cannot inherit platform-administration privileges.",
    "Built Databricks retrieval proof with governed Gold data and three Vector Search indexes for notes, tickets, and playbooks; live filtered retrieval returned the correct customer evidence and ranked the relevant intervention first.",
    "Current roadmap extends the proven foundation into governed retrieval/agent runtime, OpenTelemetry/SLO observability, and automated recovery; unproven capabilities remain explicitly separated from completed evidence.",
  ],
} as const;

export const ADDITIONAL_SYSTEMS = [
  {
    title: "Tokyo Eye — Scientific AI / Drug Discovery",
    org: "Eidetix Bio Research · 2025–present",
    glyph: "eye" as const,
    bullets: [
      "Architected a governed scientific-AI platform using hyperbolic GNN and atom-level Transformer/Mixture-of-Experts architectures for structural inference and ligand-protein binding prediction.",
      "Pivoted from an underperforming PyTorch GNN to a replacement atom-level Transformer architecture; designed, trained, and evaluated it in one day, producing same-day Pearson correlation of 0.407.",
      "Built MLflow governance with preregistered estimates, immutable metric gates, ablations, provenance, and preservation of failed experiments; scientist-facing LLM workflows use XState guardrails, Python Hypothesis validation, deterministic structural-biology checks, and RCSB semantic search.",
    ],
  },
  {
    title: "NeuroNote — Governed Agent Runtime",
    org: "2025",
    glyph: "brain" as const,
    bullets: [
      "Designed a dual-kernel AI governance architecture that separates generative reasoning from controlled runtime state and deterministic execution, limiting agent authority while preserving useful interaction.",
    ],
  },
  {
    title: "Kitchen Kontrol — Production Operations",
    org: "Sodexo · 2025–present",
    glyph: "chef" as const,
    bullets: [
      "Built an operational platform with voice capture, structured audit logging, HACCP evidence, and workflow automation designed for gloved, bilingual, mid-service use. Product-vision overlays not in the public GitHub family are not claimed on the case study.",
    ],
  },
] as const;

export const ROLES = [
  {
    dates: "Aug 2025 — present",
    title: "Area Supervisor & Operations Applications Developer",
    org: "Sodexo",
    note: "Translates frontline operational problems into deployable AI-enabled products, combining product ownership, application development, integration design, and adoption. HACCP evidence capture, planograms, and voice input designed for gloved, bilingual, mid-service use.",
  },
  {
    dates: "Jan 2024 — Jan 2025",
    title: "Technical Business Analyst & Project Manager",
    org: "International Real Estate Services",
    note: "Led CRM, analytics, commercial-loan origination, API integration, ETL, process mapping, roadmap planning, and acceptance criteria for audit-ready enterprise workflows.",
  },
  {
    dates: "1999 — 2024",
    title: "Senior Enterprise Program / Product / Architecture Leadership",
    org: "Theragun · Sunrun · Mazda · Fox Sports · agencies",
    note: "Led application modernization, CRM, e-commerce, data, integration, and platform programs for Slumberland Furniture, Sunrun, Mazda North American Operations, Fox Sports, Theragun, Lakeshore Learning, Kayne Anderson Rudnick, and HomePlus Mortgage. Directed cross-functional teams, platform/vendor evaluation, source-of-truth design, governance, rollout planning, and production adoption in complex Fortune 500 environments.",
  },
] as const;

export const SKILLS = [
  "Azure ML",
  "Azure Databricks",
  "Microsoft Foundry",
  "MLflow",
  "Terraform",
  "GitHub Actions",
  "Entra / OIDC",
  "MLOps / LLMOps",
  "RAG / vector retrieval",
  "Agents / MCP",
  "Model evaluation",
  "Drift & retrain",
  "PostgreSQL",
  "Product strategy",
] as const;

export const EDUCATION = [
  {
    credential: "M.A., Humanities",
    org: "California State University, Dominguez Hills",
  },
  {
    credential: "B.A., Economics",
    org: "University of California, Irvine",
  },
  {
    credential: "Certified ScrumMaster (CSM)",
    org: "Scrum Alliance",
  },
] as const;

export const RESUME_SECTIONS = [
  "Summary",
  "Expertise",
  "Factory",
  "Systems",
  "Experience",
  "Education",
] as const;

export const PILLARS = [
  {
    slug: "platform",
    title: "Platform",
    body: "Terraform-generated Azure ML project repos, OIDC CI, promotion gates, and a live reference model that trained, registered, and served in Dev and Prod. The factory is the deliverable, not one notebook.",
    detail:
      "Platform work is the part nobody demos: the repo scaffold, the identity boundary, the promotion gate, the registry that makes a model reproducible six months later. I build the factory first so every model after it costs a fraction of the first — infrastructure as code, environments that differ only by variable, and a reference model kept alive end-to-end as proof the path still works.",
    lens: {
      "tokyo-eye":
        "Platform lens — isolated lab packaging, pinned scientific dependencies, and reproducible runs so hyperbolic and MoE experiments can be re-run, not just reported.",
      "ai-ml-ops-factory":
        "Platform lens — the reference implementation: Terraform-generated project repos, OIDC-authenticated CI, promotion gates, and a model that trained, registered, and served in both Dev and Prod.",
      "ai-ml-engineer-academy":
        "Platform lens — isolated labs per module with pytest gates, so every teaching artifact runs the same way on any machine.",
    },
  },
  {
    slug: "governance",
    title: "Governance",
    body: "A dual-kernel runtime where the model proposes and only a verified host executes: structural validation, semantic checks, an honesty oracle, a journal of every accepted mutation.",
    detail:
      "Governance here is architectural, not a policy PDF. Authority stays with the host: the model proposes, a verified kernel validates structure and semantics, an honesty oracle checks the claim against the evidence, and every accepted mutation lands in an append-only journal. Unproven capability is named as unproven — the ledger refuses to carry it.",
    lens: {
      neuronote:
        "Governance lens — the dual-kernel control plane itself: propose/verify separation, structural and semantic validation, honesty oracle, and a journal of every accepted mutation.",
      "ai-ml-ops-factory":
        "Governance lens — promotion gates and digest-bound apply: nothing reaches Prod that CI has not signed and recorded.",
    },
  },
  {
    slug: "generative",
    title: "Generative",
    body: "Identity locks and shot contracts so image and video models render inside canon; hyperbolic and MoE inference where the science needs structure, not vibes.",
    detail:
      "Generative systems are only useful when their output is bound. I put contracts between the intent and the model: identity locks that hold a character across shots, shot specs that constrain composition before a frame renders, retrieval that grounds the answer in a source. The creative surface stays loose; the guarantees underneath do not.",
    lens: {
      "canon-forge":
        "Generative lens — identity locks and shot contracts hold characters and continuity across image and video generations instead of re-rolling for luck.",
      "ai-ml-engineer-academy":
        "Generative lens — curriculum built on RAG and agent patterns where each claim ships with a runnable artifact that demonstrates it.",
    },
  },
  {
    slug: "product",
    title: "Product",
    body: "Requirements taken from wet-hands, bilingual, multi-station reality — then HACCP evidence, planograms, and voice capture staff can finish during service.",
    detail:
      "The product judgement is where AI stops being a demo. I take requirements from the actual floor — wet hands, gloves, bilingual crews, a station that cannot pause — and put the intelligence inside the task rather than beside it. If a worker cannot finish it during service, it does not ship, however good the model is.",
    lens: {
      "kitchen-kontrol":
        "Product lens — phase-based kitchen work, HACCP evidence capture, and planograms designed for gloved, bilingual, mid-service use.",
      neuronote:
        "Product lens — governance surfaced as an operator-legible journal, so a reviewer can see what the system accepted and why.",
    },
  },
] as const;

export type PillarSlug = (typeof PILLARS)[number]["slug"];

export function pillarBySlug(slug: string) {
  return PILLARS.find((p) => p.slug === slug);
}
