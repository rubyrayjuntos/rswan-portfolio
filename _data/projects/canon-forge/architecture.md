# Canon Forge — production architecture

Canon Forge is a **character-reference architect**, not a prompt playground and not a workflow-orchestration engine. Identity, set, and camera are locked as data. Image and video models render inside that box.

## Forges

| Surface | Owns |
| --- | --- |
| **CharacterForge** | `CharacterProfile` plus approved stills (canon headshot is the identity kernel) |
| **SetForge** | Location, lighting, spatial invariants, landmarks, forbidden changes, lighting-rig lock, canon wide/medium |
| **CompositorForge** | Bind character to set with action, shot type, angle, lens, distance, emotion, landmark lock |
| **SceneForge** | Keyframe sequences (`KeyframeScene`) and a flipbook player; compositor can also request an 8s Veo clip |

## Runtime

- **Client:** TypeScript, React 19, Vite 6. Profiles in `localStorage`. No Zustand / XState.
- **Server:** Express on port 3001. Routes: `/api/generate`, `/api/generate-video`, `/api/generate-text`, `/api/models`. Keys stay on the server (`vite.config.ts` no longer inlines `GEMINI_API_KEY`).
- **Image providers:** Gemini, xAI Grok Imagine (client default in `geminiService.ts`), Venice, Amazon Bedrock (Titan / SD family), local Stable Diffusion / Ollama for text. Init-image / reference-image behavior is provider-specific (`shouldUseInitImage`).
- **Video:** Veo via `ai.models.generateVideos` (default `veo-3.0-fast-generate-001`), 8 seconds, 16:9.
- **Identity lock:** `utils/identityLock.js` — prompt contracts plus optional attached stills. Unit-tested. Not a face-embedding model.
- **Delivery:** GitHub Actions lint + `vite build`. Separate workflow publishes to GHCR. `render.yaml` for a Node web service. The `Dockerfile` in tree is a **dev** stage only.

## What this portfolio cannot host

Static HTML cannot keep provider keys or run the Vite+Express app.

## Not in this repo

- Temporal / Airflow / any orchestration product
- InstantID, IP-Adapter, or similar identity networks
- Pollinations (file present, not imported by `App.tsx`)
- Multi-tenant SaaS / auth beyond optional AWS credential dialog for Bedrock
- A finished editorial NLE
