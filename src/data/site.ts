export const SITE = {
  name: "Ray Swan",
  role: "AI/ML System Architect",
  headline: "GenAI / ML Architect  ·  AI Platform Architect  ·  MLOps / LLMOps",
  city: "Houston, TX",
  revision: "Rev. 2026.08",
  email: "rswan@rswan.org",
  resumeEmail: "rswan@rswan.org",
  phone: "(409) 264-5074",
  phoneHref: "tel:+14092645074",
  github: "https://github.com/rubyrayjuntos",
  linkedin: "https://www.linkedin.com/in/ray-swan-b973525/",
} as const;

export const CLIENTS = [
  "Mazda North America",
  "Revlon",
  "Black & Decker",
  "Fox Sports",
  "Theragun",
] as const;

export const HOME_SECTIONS = ["Position", "Contrast", "Arc", "Proof"] as const;

export const POSITION = {
  kicker: "AI/ML System Architect",
  line1: "ENTERPRISE AI THAT SHIPS",
  line2: "Not a notebook. A system.",
  punch: "governed systems that ship",
  against: "research-grade hope",
} as const;

export const CONTRASTS = [
  { them: "Not demos that worked once", ray: "24/7 PLATFORMS" },
  { them: "Not a policy PDF", ray: "GOVERNANCE IS ARCHITECTURE" },
  { them: "Digest-bound. OIDC. No portal clicks.", ray: "PROMOTION GATES, NOT HOPES" },
  { them: "Not the other way around", ray: "15+ YEARS ENTERPRISE, THEN AI" },
  { them: "Not just accuracy", ray: "OPTIMIZED FOR TIME-TO-VALUE" },
] as const;

export const ARC = [
  { n: "15+ YRS", title: "MAZDA → THERAGUN", body: "Downtime measured in millions." },
  { n: "THEN", title: "SAW AI COMING", body: "Most teams built it wrong." },
  { n: "3 YRS", title: "ENTERPRISE DISCIPLINE → AI", body: "Platforms, MLOps, agent runtime." },
  { n: "NOW", title: "SYSTEMS THAT SURVIVE PRODUCTION", body: "Receipts in repos — not slides." },
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
  "Twenty-five years delivering enterprise software, data, integration, and platform programs — then three years architecting deterministic safety frameworks and multi-agent runtime environments — has redefined how I approach production artificial intelligence. Rather than treating large language models as black-box oracles, I engineer the rigorous structural scaffolding required to make them reliable enterprise assets—focusing on dual-kernel proposal-verification pipelines, hyperbolic graph neural networks, and fault-tolerant cloud orchestration.\n\nMy technical foundation is built on full-stack mastery across React, TypeScript, Python, and cloud infrastructure on AWS and GCP, allowing me to bridge the gap between low-level algorithmic research and scalable software architecture. But what makes me an exceptional candidate for an AI/ML Systems Architect role is the operational discipline I bring from the real world. Managing enterprise-grade software integrations alongside high-throughput physical operations—from full-stack platform launches to directing complex school nutrition logistics—has trained me to design systems that are not only theoretically sound under pressure, but structurally resilient, regulatorily compliant, and built for humans to actually use.";

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
  title: "Tokyo Eye — Scientific AI / Drug Discovery",
  role: "Founder & Technical Product Lead, AI/ML",
  year: "Eidetix Bio Research · 2025–present",
  slug: "tokyo-eye",
  glyph: "eye" as const,
  bullets: [
    "Architected Tokyo Eye, a physics-constrained AI drug-discovery pipeline with MLflow-native governance and ligand-interface affinity modeling for structural inference and binding prediction.",
    "Pivoted from an underperforming PyTorch GNN to a replacement atom-level Transformer architecture; designed, trained, and evaluated it in one day, producing same-day Pearson correlation of 0.407.",
    "Identified five therapeutic targets with 100% rejection of invalid states. Filed two patents and advanced NCI SBIR Phase I work — filings and Phase I advancement, not granted patents or a commercial award.",
  ],
} as const;

export const ADDITIONAL_SYSTEMS = [
  {
    title: "Azure GenAI/ML Ops Factory",
    org: "2026 · public proof: AIML-SCAFFOLD",
    glyph: "cloud" as const,
    bullets: [
      "Re-engineered Microsoft's Azure MLOps v2 Accelerator into a factory that generates modular, self-contained Azure ML project repos with governed infrastructure and configurable behavior. Public GitHub proof is AIML-SCAFFOLD.",
      "Terraform-managed Azure ML: keyless storage, Key Vault, Log Analytics, scale-to-zero compute, Entra/OIDC GitHub CI, and evidence-bound plan/apply — destructive drift blocked before apply.",
      "Proved a local-first lifecycle — shared Python logic locally and as a four-stage Azure ML pipeline (prepare → train → evaluate → register) — live MLflow run registered in Dev.",
    ],
  },
  {
    title: "NeuroNote — Governed Agent Runtime",
    org: "2025",
    glyph: "brain" as const,
    bullets: [
      "Designed a dual-kernel AI governance architecture that separates generative reasoning from controlled runtime state and deterministic execution. Forms the theoretical basis for the hostile-by-default agent governance model in production use at Eidetix Bio.",
    ],
  },
  {
    title: "Kitchen Kontrol — Production Operations",
    org: "Independent product · scaled 7→23 Sodexo school cafeterias",
    glyph: "chef" as const,
    bullets: [
      "Independent operations product scaled 7→23 Sodexo school cafeterias: reporting 30 min/day → 15 min/week, compliance 95%, food waste 3%. Public GitHub proof is kk-logger (and MyKitchen) — the full Azure codebase is not public.",
    ],
  },
] as const;

export type Role = {
  dates: string;
  title: string;
  org: string;
  note: string;
  section?: string;
};

export const ROLES: Role[] = [
  {
    dates: "Oct 2025 — present",
    title: "Founder & Technical Product Lead, AI/ML",
    org: "Eidetix Bio Research",
    note: "Architected Tokyo Eye, a physics-constrained AI drug-discovery pipeline with MLflow-native governance and ligand-interface affinity modeling. Identified five therapeutic targets; 100% rejection of invalid states. Filed two patents and advanced NCI SBIR Phase I work — filings and Phase I advancement, not granted patents.",
  },
  {
    dates: "Aug 2025 — present",
    title: "Operations Applications Developer & Area Supervisor",
    org: "Sodexo",
    note: "Kitchen Kontrol, an independent operations product, scaled 7→23 school cafeteria sites; reporting 30 min/day → 15 min/week; compliance 95%; food waste 3%. Public GitHub proof is kk-logger and MyKitchen — the full Azure codebase is not public.",
  },
  {
    dates: "Jan 2024 — Jan 2025",
    title: "Technical Business Analyst & Project Manager",
    org: "International Real Estate Services",
    note: "Addressed fragmented data silos and manual CRM workflows slowing loan origination and property management. Implemented automated API integrations and ETL, reducing manual data entry by 25% and establishing audit-ready reproducible data flows for analytics.",
  },
  {
    section:
      "2016–2024 · specialist contract engagements for Fortune 500 and mid-market firms, typically 6–18 months from engagement through release.",
    dates: "Jan 2024 — Jul 2024",
    title: "Senior Salesforce Program Manager",
    org: "Slumberland Furniture",
    note: "Led a team of 18 through UI/UX redesign, vendor selection, and Zendesk → Salesforce Service Cloud, reducing vendor costs 30% and lifting sales conversion 5%.",
  },
  {
    dates: "2021 — 2022",
    title: "Senior Project Manager & Business Analyst, Sales Cloud",
    org: "Sunrun",
    note: "Consolidated 12 independent CRM workflows into 3 validated processes, deployed KPI dashboards, and reduced territory launch from 2 months to 4 days.",
  },
  {
    dates: "2020 — 2021",
    title: "Senior Project Manager & Business Analyst",
    org: "XCentium / Revlon",
    note: "Optimized ETL pipelines and led Japan/Hong Kong e-commerce launch strategy, reducing KPI reporting lag from 12 hours to 5 minutes.",
  },
  {
    dates: "2019 — 2020",
    title: "Senior Project Manager & Business Analyst",
    org: "Mazda North American Operations",
    note: "Consolidated ERP/CRM data into a master governance document, migrated Service and Marketing Clouds across North America, achieved 100% adoption at go-live, and established the first unified source of truth for North American data systems.",
  },
  {
    dates: "2018 — 2019",
    title: "Lead Business Analyst",
    org: "Stanley Black & Decker",
    note: "Defined requirements for the company's first direct-to-consumer platform on Salesforce Commerce Cloud and established a repeatable Agile sprint framework via Azure DevOps.",
  },
  {
    dates: "2017 — 2018",
    title: "Senior Project Manager & Business Analyst",
    org: "Fox Sports",
    note: "Deployed Salesforce Field Service Lightning with integrated scheduling logic and full user training; delivered a $3M+ program 5% under budget, reduced CI/CD time 50%, and standardized operations globally.",
  },
  {
    dates: "2017",
    title: "Senior Project Manager & Business Analyst",
    org: "Theragun",
    note: "Managed five simultaneous projects including Shopify → Salesforce migration, NetSuite integration, and app development, establishing data flow across web, mobile, and retail channels.",
  },
  {
    dates: "2016 — 2017",
    title: "Senior Project Manager & Business Analyst",
    org: "Guthy | Renker",
    note: "Orchestrated in-house and offshore teams to integrate inventory, membership, and fulfillment systems for a Salesforce Commerce Cloud re-platform and standardized critical business processes across entities.",
  },
  {
    dates: "2014 — 2016",
    title: "Sr. E-Commerce Program Manager",
    org: "Lakeshore Learning Materials",
    note: "Built a standardized client ingestion system, owned the department roadmap for projects up to $8M, and reduced district portal customization time from 2 days to 0.5 days.",
  },
  {
    dates: "2007 — 2013",
    title: "Project Manager / Director of Software Development",
    org: "Kayne Anderson Rudnick Wealth Management",
    note: "Spearheaded Salesforce migration, transitioned back-office trading operations between sister companies, transformed operations into a normalized Agile-driven department, and secured a $10B net flow transition.",
  },
  {
    section: "Earlier career available upon request.",
    dates: "2000 — 2007",
    title: "Earlier roles",
    org: "Attorneys Software Inc. · Vivendi Universal",
    note: "Attorneys Software Inc. (2002–2007) and Vivendi Universal (2000–2002).",
  },
];

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
  "Salesforce",
  "Product strategy",
] as const;

export const EDUCATION = [
  {
    credential: "M.A., Humanities",
    org: "California State University, Dominguez Hills · 2008",
  },
  {
    credential: "B.A., Economics",
    org: "University of California, Irvine · 2004",
  },
] as const;

export const RESUME_SECTIONS = [
  "Summary",
  "Expertise",
  "Tokyo Eye",
  "Systems",
  "Experience",
  "Education",
] as const;

export const PILLARS = [
  {
    slug: "platform",
    title: "Platform",
    body: "Terraform-generated Azure ML project repos, OIDC CI, promotion gates, and a public generator (AIML-SCAFFOLD) plus a live taxi reference that trained and registered. The factory is the deliverable, not one notebook.",
    detail:
      "Platform work is the part nobody demos: the repo scaffold, the identity boundary, the promotion gate, the registry that makes a model reproducible six months later. I build the factory first so every model after it costs a fraction of the first — infrastructure as code, environments that differ only by variable, and a reference model kept alive end-to-end as proof the path still works.",
    lens: {
      "tokyo-eye":
        "Platform lens — isolated lab packaging, pinned scientific dependencies, and reproducible runs so hyperbolic and MoE experiments can be re-run, not just reported.",
      "ai-ml-ops-factory":
        "Platform lens — the reference implementation: AIML-SCAFFOLD generates Terraform project repos with OIDC-authenticated CI and promotion gates; a separate live taxi path trained and registered on Azure ML.",
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
