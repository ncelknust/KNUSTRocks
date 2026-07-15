# Ghana ERW Suitability — Technical Siting Tool · NCEL, KNUST

A focused, self-contained web tool for a **technical ERW practitioner** using the suitability map to
make siting decisions. Built on the peer-reviewed geospatial study (SoilGrids, WorldClim, Geological
Survey of Ghana 1:1,000,000). **All economics removed** — this version is about suitability, drivers,
feedstock and weathering potential only.

## How to open
Double-click **`ncel_erw_dashboard_v3.html`** — opens in any browser, no internet or install. One file
(~260 KB); the NCEL logo and all data are embedded. On first open a short **welcome panel** explains
what the tool is, the three drivers, and a 4-step how-to (reopen any time via the **?** in the header).

## Review notes (this build)
Audited for redundancy and first-run clarity: removed the standalone "Priority rank" layer (it was a
monotonic copy of the ERW-SI layer — ranking is still shown by the index colour, the priority tiers,
and the exact rank number on hover/click); merged a duplicated geology column in the CSV export; added
the welcome/help panel and clearer section labels so a first-time user knows what the dashboard is and
where to start.

## Built for technical ERW decisions
- **Site screening (the core tool).** Turn on screening and set your criteria — minimum ERW-SI,
  minimum feedstock outcrop %, minimum geology reactivity, maximum soil pH (target acidic soils),
  minimum rainfall, maximum haul distance to feedstock. Districts that fail are greyed out; those
  that pass are highlighted and listed (ranked) in the **Shortlist** tab. A live counter shows how
  many qualify. Export keeps your filter. (Example: SI≥60 · feedstock≥5% · pH≤5.5 · rain≥1200 mm ·
  haul≤40 km → 14 districts, the Sefwi/Wassa Amenfi belt.)
- **Per-district diagnostics.** Click a district for the S/C/G **driver decomposition** (what makes
  its score), every input (pH, CEC, SOC, temperature, rainfall, geology reactivity, feedstock %,
  dominant feedstock type, haul distance) with its **national percentile**, and auto-generated
  **ERW interpretation flags** (acidic soil / ANC benefit, moisture-limited, local reactive
  feedstock, low-CEC leaching risk, ultramafic Ni-Cr screening, etc.).
- **Live weighting & priority.** Move the S/C/G weight sliders (or use the paper's presets) and the
  map, ranking and priority tiers recompute in real time.
- **Feedstock focus.** Dedicated layers for feedstock outcrop %, dominant feedstock tier
  (greenstone → ultramafic) and haul distance to the nearest real reactive outcrop.
- **Weathering CDR potential (technical).** One application-rate slider drives a tCO₂/ha/yr
  weathering-flux layer and per-district value — no cost or price assumptions.
- **Search, compare, export.** Find-and-zoom to any district; pin two for a side-by-side technical
  compare; export the current map (PNG) and the full live table incl. pass/fail (CSV).

## Layers
Suitability & priority: ERW-SI · rank · tiers · robust priority.
Soil: soil-need S · pH · CEC · SOC. Climate: climate C · rainfall · temperature.
Geology & feedstock: reactivity G · outcrop % · dominant tier · haul distance.
Carbon removal: weathering CDR potential.

## Verification
Composite `ERW-SI = 100·(wS·S + wC·C + wG·G)`; reproduces the published values at the primary
weighting (mean 60.4). Screening and ranking checked against `district_v4_scored.csv`; the example
technical screen returns the expected sweet-spot districts (Bodi, Ahafo Ano North, Suaman, the Wassa
Amenfi and Sefwi districts).

## Versions
- `ncel_erw_dashboard_v3.html` — **current**, technical siting tool (no economics).
- `ncel_erw_dashboard.html` — v2 (includes economics tab), kept for reference.

## Honest caveats
A decision-support screen, not a substitute for quarry-scale feedstock sampling, soil verification and
field trials. Feedstock tiering is mapped at 1:1,000,000; ultramafics need Ni/Cr screening before
food-soil use. Haul distance is a straight-line×1.3 road proxy to the nearest mapped reactive outcrop.
