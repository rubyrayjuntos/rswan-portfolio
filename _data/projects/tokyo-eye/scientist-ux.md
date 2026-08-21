# Tokyo Eye — scientist UX

## Three surfaces, different jobs

**`visualizer/frontend` in tokyo-eye-agenticpoincare** is the scientist dashboard: React 19, Vite, Three.js, Chart.js, and three XState machines (`viewportMachine`, `discoveryPhaseMachine`, `hypothesisLifecycleMachine`). It talks to the FastAPI coordinator and the WebSocket viewport. That is the control plane in source.

**Discovery Story** (this site) is a narrative walkthrough: how a discovery is supposed to feel when evidence, geometry, and the model agree.

**Discovery Cockpit** (this site) is a static control-plane metaphor. Use it when you want the *idea* of the instrument without claiming the HTML file is the FastAPI app.

**eidetix-bio** is a separate Three.js dehydron viewer (Vite + React + Gemini in package.json). It is not the Poincaré XState dashboard.

## Design rule

The assistant may only operate on:

- the currently loaded structures
- the currently selected residues / fragments
- the current workflow stage
- the current visual state

A generic “explain this protein” answer that ignores the open session is a failed interaction, even if the prose is fluent. Viewport tools (`highlight_residues`, `focus_residues`, `set_metric`) exist so the agent moves the same camera the scientist sees.

## Why this is on a Systems page

Tokyo Eye is the scientific twin of Kitchen Kontrol’s rule: AI writes **evidence inside the job**, or it does not ship. Here the job is structural inference and ligand–protein investigation, not HACCP logs.
