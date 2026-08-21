# Kitchen Kontrol — system architecture

Kitchen Kontrol is an operations product for school nutrition: HACCP temperature evidence, inventory, USDA recipes, planograms, and meal scheduling. The architecture is **offline-first**. AI sits on the same workflows, with a separate production boundary for cloud models.

## Layers

### 1. Frontline client (this demo)

- **Stack:** TypeScript, React 19, Vite 6, Tailwind
- **Surfaces:** daily dashboard, HACCP logs, recipe scaler, planogram builder, inventory/milk tracking, meal calendar, bilingual + light/dark
- **Local sync:** browser `BroadcastChannel` so a tablet log and a “scanner” viewport stay consistent without a round trip

The interactive demo in Downloads is this layer: a full Vite app, not a mock screenshot pack.

### 2. Evidence and ops data

- Temperature logs with electronic signature, pass/fail, corrective action
- Recipe book with portion scale, allergens, batch cost, CCP steps
- Inventory with expiration and forecast bands
- Meal schedule with USDA reimbursement rates used in the demo ($2.15 breakfast / $3.25 lunch)

### 3. AI services (production design)

| Capability | Intended cloud pieces |
| --- | --- |
| Voice HACCP / inventory | Amazon Transcribe, Lex, Lambda |
| Compliance assistant | Bedrock, Lambda, DynamoDB |
| Demand forecast | SageMaker, Forecast, S3 |
| Alerts | SNS, EventBridge, Lambda |
| Adaptive training | Bedrock, Personalize |
| Line vision / planogram | Rekognition, Bedrock, S3 |

The demo proves the **workflow**. Cloud calls are the production overlay; they are not required for GitHub Pages static hosting of the Vite `dist/`.

### 4. What this portfolio cannot host

`rswan-portfolio` is static HTML/CSS/JS. It can show this case study, the gallery, and these markdown artifacts. It cannot compile or serve the Vite demo. Host the demo with:

1. `vite build` and GitHub Pages from `dist/` (set `base` to `/<repo>/` for project Pages), or
2. A dedicated repo on Render if the build needs a Node server or secrets (`GEMINI_API_KEY` for the assistant widget).
