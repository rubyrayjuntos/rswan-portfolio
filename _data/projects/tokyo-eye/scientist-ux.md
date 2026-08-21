# Tokyo Eye — scientist UX

## Two demos, one product

**Discovery Story** is the primary link on this case study. It is a narrative walkthrough: how a discovery is supposed to feel when evidence, geometry, and the model agree.

**Discovery Cockpit** is the control plane: the scientist drives selection, views, and gates. Use it when you want to see the product as an instrument, not a story.

Both files are bundled static HTML in `demos/tokyo-eye/` on this site.

## Design rule

The assistant may only operate on:

- the currently loaded structures
- the currently selected residues / fragments
- the current workflow stage
- the current visual state

A generic “explain this protein” answer that ignores the open session is a failed interaction, even if the prose is fluent.

## Why this is on a Systems page

Tokyo Eye is the scientific twin of Kitchen Kontrol’s rule: AI writes **evidence inside the job**, or it does not ship. Here the job is structural inference and ligand–protein investigation, not cafeteria logs.
