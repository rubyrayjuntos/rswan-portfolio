# Kitchen Kontrol — voice and AI boundaries

AI is not the lead of this case study. What exists in GitHub is narrower than the product-vision board in the gallery.

## In source

- **MilkTrace-Voice** — browser `SpeechRecognition` plus a keyword/number parser for school, milk type, and quantity. Spoken confirmations use `speechSynthesis`. The file is named `useGeminiLive.ts`. It does not call Gemini Live. `@google/genai` is imported only to type PCM blobs.
- **MyKitchen** — `generateContent` against Gemini 2.5 Flash for out-of-range corrective actions and translation. The API key in source is an empty string, so the call cannot succeed until a key is supplied.
- **Downloads Vite demo (not on GitHub)** — compliance chat is a keyword/TFER FAQ. `@google/genai` is in `package.json` and unused. `BroadcastChannel` sync is here, not in the GitHub ops platform.

## Not in source

- Amazon Transcribe / Lex voice logging
- Bedrock compliance assistant
- SageMaker / Forecast demand bands
- Rekognition planogram vision
- NVIDIA Guardrails or any hosted safety product
- Untransferred Azure work from cafeteria servers

## Design rule that still holds

If a model is added later, it operates on **current workflow state** (open log, last temperature, selected school). It does not replace the evidence store. Failed or out-of-range events stay in the log.
