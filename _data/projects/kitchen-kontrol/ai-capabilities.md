# Kitchen Kontrol — AI capabilities

AI is in the product loop, not a sidebar novelty. Each capability is attached to a frontline task that already exists without a model.

## In the interactive demo

- **Compliance assistant widget** — USDA / TFER questions and out-of-range remediation. The Vite app can call Gemini when `GEMINI_API_KEY` is present (AI Studio / Render). Without a key, the rest of the ops demo still runs.
- **Interactive demo hub** — planogram, recipes, inventory, meals, HACCP, multi-device sync: the behaviors the models are supposed to accelerate.
- **AI roadmap section** — voice and vision as the next layer on those same screens.

## Production mapping (called out on the AI-features gallery card)

1. **Voice-activated logging** — “log walk-in fridge at 38 degrees” with wet or full hands.
2. **AI compliance assistant** — chat that cites food-safety rules and suggests corrective action.
3. **Predictive inventory** — milk and supply forecast from history, weather, and school calendar.
4. **Intelligent alerts** — overdue logs, drift, SMS/push.
5. **Adaptive training** — modules from error patterns in the log history.
6. **Visual compliance checks** — photo of the serving line vs the digital planogram.

## Design rule

The model operates in **current workflow state** (open log, selected pan, last temperature). It does not replace the evidence store. Failed or out-of-range events stay in the log.
