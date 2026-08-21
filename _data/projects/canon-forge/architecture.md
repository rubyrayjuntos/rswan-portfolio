# Canon Forge — production architecture

Canon Forge is a **character-reference architect**, not a prompt playground. The product treats identity, set, and camera as locked assets. Gemini image models render inside that box.

## Forges

| Surface | Owns |
| --- | --- |
| **CharacterForge** | Profile (age, features, wardrobe) plus approved canon stills: headshot, body, wardrobe, expression |
| **SetForge** | Location type, lighting, ambiance, spatial invariants, fixed landmarks, forbidden changes, lighting-rig lock, canon wide/medium |
| **CompositorForge** | Bind a character to a set with action, extras, shot type, angle, lens, distance, emotion, landmark lock |
| **SceneForge** | Sequence those locked shots so a later frame cannot quietly become a different person in a different room |

## Runtime

- **Stack:** TypeScript, React 19, Vite 6
- **Model:** Gemini image generation, called from the app (key must stay server-side; an earlier client-bundle leak is documented in the repo review)
- **Canon objects:** `CharacterProfile`, `SetProfile`, `CompositeConfig` — the shot list is data, not prose

## What this portfolio cannot host

`rswan-portfolio` is static. It can show this case study and the hero. It cannot keep a Gemini key or run the Vite app. Host with `vite build` on GitHub Pages (correct `base`) or Render if the API server is required.
