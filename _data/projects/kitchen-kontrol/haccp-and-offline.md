# HACCP and offline-first design

## Why offline is a product requirement

Cafeteria Wi-Fi is not a control. If logging dies when the network dies, staff go back to paper and the digital product is decoration.

Kitchen Kontrol treats the device as the system of record until sync is possible:

- HACCP logs, recipes, and planograms available locally
- Multi-device consistency via `BroadcastChannel` in the demo (tablet vs scanner viewport)
- Sync when a connection returns — the interactive demo shows live propagation without a server

## Regulations in the workflow

Not a policy PDF. The demo encodes:

- **Texas TFER §228.75** — temperature control
- **USDA 7 CFR 210** — National School Lunch Program operational requirements

Digital logs include:

- Equipment (walk-in, freezer, warmer)
- Pass / fail against range
- Electronic signature
- Corrective-action modal when out of range

## Bilingual, wet-hands, multi-station

English/Spanish toggle and light/dark theme are in the demo because a single “desktop English manager” UI will not get adopted on the line.
