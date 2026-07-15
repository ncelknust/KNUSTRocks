# KNUSTRocks — KNUST Rock Enhanced Weathering Index

An interactive web map of **Enhanced Rock Weathering (ERW) suitability** across all **216 districts of
Ghana**. It turns a peer-reviewed geospatial study into a decision-support tool: explore the drivers of
suitability, re-weight the index to your priorities, screen districts against your own siting criteria,
and export the results — all in the browser, with no login.

Developed & hosted by the **Net-Zero Carbon Emission Lab (NCEL)**, Kwame Nkrumah University of Science
and Technology (KNUST), Ghana.

> **Live tool:** https://ncelknust.github.io/KNUSTRocks/

---

## Features

- **15 map layers** — the ERW Suitability Index (ERW-SI), its soil / climate / geology sub-indices, the
  raw inputs (pH, CEC, SOC, rainfall, temperature, geology reactivity), feedstock outcrop and dominant
  feedstock tier, haul distance, priority tiers, robust priority districts, and weathering CDR potential.
- **Live weighting** — slide the soil / climate / geology weights (or use the published scenarios); the
  map, ranking and priority tiers recompute instantly.
- **Site screening** — set thresholds (feedstock %, soil pH, rainfall, geology reactivity, haul distance,
  minimum ERW-SI) to grey out districts that fail and shortlist those that pass.
- **District diagnostics** — click any district for its S/C/G driver breakdown, every input versus the
  national percentile, and plain-language ERW interpretation flags.
- **Compare & rank**, **search**, and **export** the current map (PNG) and the full scored table (CSV).

## How the index works

`ERW-SI = 100 · (0.40·S + 0.30·C + 0.30·G)`  → a 0–100 score per district, where **S** = soil restoration
need, **C** = climate favourability, **G** = geology / feedstock reactivity. Each sub-index is rescaled to
0–1 by continuous membership functions on district-level values. Robustness is tested across four
weighting scenarios (Spearman ρ = 0.88–0.99), yielding 40 robust priority districts.

## Data sources

| Layer | Source | Resolution |
|---|---|---|
| Soil (pH, CEC, SOC) | SoilGrids 2.0 | 250 m |
| Climate (MAT, MAP) | WorldClim 2.1 | ~1 km |
| Geology / feedstock | Geological Survey of Ghana | 1:1,000,000 |
| District & region boundaries | Ghana admin units | 216 districts · 16 regions |

## Usage

This repository contains a **single self-contained file**, `index.html` — the landing page and the full
interactive dashboard, with the map, data and logo embedded. There is nothing to build and no server:
open the file in any modern browser, or host it as a static page.

## Deploy (free)

**GitHub Pages:** push `index.html` to this repo → **Settings → Pages** → Source *Deploy from a branch*,
Branch `main`, folder `/ (root)` → **Save**. Your site goes live at
`https://<username>.github.io/<repo>/` in about a minute.

**Netlify Drop (no account):** go to <https://app.netlify.com/drop> and drag `index.html` onto the page
for an instant link. See `DEPLOY.md` for full instructions and other options.

## Repository contents

- `index.html` — the KNUSTRocks tool (landing page + interactive dashboard).
- `DEPLOY.md` — step-by-step deployment guide.
- `README.md` — this file.

## Citation

If you use KNUSTRocks in research or reporting, please cite the accompanying study:

> [Author(s)], _A geospatial assessment of enhanced rock weathering suitability for CO₂ removal and
> agricultural soil restoration in Ghana_, [journal], [year]. KNUSTRocks interactive tool, Net-Zero
> Carbon Emission Lab (NCEL), KNUST.

## Disclaimer

KNUSTRocks is a **decision-support screen**, not a substitute for quarry-scale feedstock sampling, soil
verification and field trials. Economic and CDR figures are order-of-magnitude planning estimates.

## Credits & licence

Developed by the **Net-Zero Carbon Emission Lab (NCEL), KNUST**. Contains data derived from SoilGrids,
WorldClim and the Geological Survey of Ghana. _Add a licence (e.g. CC BY 4.0 for content, MIT for code)
here before publishing._
