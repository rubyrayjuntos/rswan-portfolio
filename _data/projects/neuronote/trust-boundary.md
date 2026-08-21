# NeuroNote — trust boundary

The design rule is one sentence from the source repo:

> Malleability becomes safe when runtime-generated behavior is treated as a guest, not a peer.

## Hostile by default

AI output is untrusted input. There is no path from prompt to operator that skips verification. NeuroNote does not eval generated source; behavior is **logic-as-data** (JSON schemas) composed from a closed operator library.

## Honesty oracle

The oracle looks for disagreement among three stories:

- what the proposal *says* it will do
- what the schema *structurally* does
- what simulation *traces* actually did

Prompt injection, scope creep, and intent drift show up as that disagreement.

## Isolation and recovery

Admitted logic still runs in a sandbox. Fuel metering stops runaway loops. Operators declare permissions; they do not inherit the page. Runtime errors revert state. The change journal keeps diffs and verification scores so you can prove what crossed the boundary and what did not.

## Non-goals

NeuroNote is not a self-executing agent, not a replacement for application logic, and not a claim that the model is aligned. It is a control plane that keeps reasoning on one side of the wall and authority on the other.
