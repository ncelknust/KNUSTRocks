# KNUSTRocks

## Ghana Rock Enhanced Weathering Opportunity Index

**KNUSTRocks Application v2.0** is an interactive national evidence and planning platform for enhanced rock weathering (ERW) research in Ghana. It presents the **Ghana Rock Enhanced Weathering Opportunity Index (GREW-OI)** as a continuous grid-cell surface and provides area-weighted reporting profiles for all 261 districts.

The application is designed for national reconnaissance, research prioritisation, field-validation planning and scientific due diligence. It does **not** estimate verified carbon dioxide removal, feedstock safety or reserves, project economics, deployment readiness or carbon-credit eligibility.

KNUSTRocks was developed under the **KNUST Rock Enhanced Weathering (KREW)** project and is owned and operated by the **Net-Zero Carbon Emission Lab (NCEL)** at the Kwame Nkrumah University of Science and Technology (KNUST), Ghana.

**Application:** [https://ncelknust.github.io/KNUSTRocks/](https://ncelknust.github.io/KNUSTRocks/)  
**Product version:** KNUSTRocks Application v2.0  
**Scientific model:** GREW-OI  
**Analytical build:** 7.0  
**Release date:** 8 August 2026

> **Interpretation boundary**  
> GREW-OI measures the relative co-location of specified hydroclimatic, acid-soil co-benefit and mapped feedstock-access conditions. Opportunity is not the same as feasibility, measured weathering, net carbon removal or investment readiness.

## What changed in Application v2.0

Application v2.0 is a new analytical and software release rather than a visual update to the original district-level ERW Suitability Index.

| Earlier KNUSTRocks release | KNUSTRocks Application v2.0 |
|---|---|
| One ERW-SI value for each of 216 districts | 10,680 grid cells, with 261 districts retained only as reporting overlays |
| District-level soil, climate and geology suitability | Hydroclimatic opportunity, acid-soil co-benefit and mapped feedstock access |
| Additive weighted index | Noncompensatory weighted geometric mean |
| Four weighting scenarios | 400-draw epistemic scenario ensemble plus structural sensitivity tests |
| District ranking, threshold screening and indicative CDR outputs | Cell evidence profiles, uncertainty layers, district distributions, evidence boundaries and validation planning |
| Public data export | Controlled public payload; complete analytical tables and unpublished research materials remain internal |

The change from *suitability* to *opportunity* is deliberate. National secondary data can identify conditions that warrant investigation, but project suitability requires field evidence, verified feedstock properties, land and environmental screening, logistics, economics and defensible monitoring, reporting and verification (MRV).

## Model at a glance

| Property | Current release |
|---|---:|
| Complete national grid cells | 10,680 |
| Analytical grid | WorldClim 2.1, 2.5 arc-minutes |
| Nominal north–south cell dimension | approximately 4.6 km |
| District reporting overlays | 261 |
| Default GREW-OI weights | H 45% · B 25% · F 30% |
| Epistemic scenario draws | 400 |
| Default score range | 19.29–95.92 |
| National median | 43.89 |
| Cells at or above the illustrative score of 70 | 4.76% |
| Cells at or above 70 in every structural test | 1.24% |
| Median P10–P90 scenario-envelope width | 18.27 index points |

The score of 70 is an analytical reporting convention. It is not a validated feasibility, deployment or carbon-removal threshold.

## Application capabilities

### National grid-cell explorer

- Display the default GREW-OI surface and its three component indices.
- Examine the scenario-envelope width and the minimum score across structural tests.
- Review supporting pH, cation-exchange capacity, precipitation and mapped-source-distance layers.
- Select any mapped cell to inspect its H, B and F components, default score, P10–P90 scenario envelope, structural minimum and source variables.
- Locate a district and retain its boundary as a reporting context without replacing the underlying cell evidence.
- Emphasise cells that remain at or above the illustrative score of 70 across all structural tests.

### Exploratory decision weights

Users can adjust the relative weights assigned to H, B and F. The three controls are renormalised to 100%, and the map is recalculated in the browser using the same geometric aggregation rule.

These controls support decision exploration only. Stored P10, P50, P90 and structural statistics apply to the published default model and are not recomputed for user-defined weights.

### District reporting profiles

- Search, filter and sort all 261 district profiles.
- Compare area-weighted mean opportunity, area at or above 70, structurally robust area, scenario-envelope width and within-district heterogeneity.
- Inspect the number of intersecting cells, effective cell coverage and any boundary-cell interpolation disclosed by the application.
- Retain district variation rather than replacing it with a single administrative lookup value.

### Method and evidence register

The application documents the component equations, evidence sources, analytical roles and limitations. A claims register distinguishes:

- inferences supported by the current national evidence;
- provisional inferences that require field verification; and
- claims that the model cannot support.

### MRV planning workspace

The MRV Planner translates a reconnaissance shortlist into six next-stage evidence workstreams:

1. land and environmental eligibility;
2. feedstock qualification;
3. supply-chain accounting;
4. baseline and field design;
5. carbon attribution and fate; and
6. net-removal accounting and independent assurance.

The checklist measures planning completeness only. It is not a readiness score, verification result or certification pathway.

### Interface and accessibility

- Responsive light and dark KREW/NCEL themes.
- Persistent appearance preference stored locally in the browser.
- Keyboard-operable navigation, district rows and map controls.
- Explicit map legends, scale information, north indicator and interpretation notices.
- No account or login requirement.

## How GREW-OI works

GREW-OI integrates three conceptually distinct opportunity components. Each component is constructed on a 0–1 scale and displayed in the application on a 0–100 scale.

### 1. Hydroclimatic opportunity, H

H combines continuous membership functions for mean annual precipitation and mean annual temperature:

$$
H = (0.10 + 0.90\mu_M)^{0.80}(0.55 + 0.45\mu_T)^{0.20}
$$

Here, $\mu_M$ and $\mu_T$ are precipitation and temperature memberships. H describes broad hydroclimatic conditions for further investigation; it is not a weathering-rate or carbon-removal model.

### 2. Acid-soil co-benefit opportunity, B

B combines soil-acidity and cation-retention memberships:

$$
B = (0.10 + 0.90\mu_A)^{0.70}(0.20 + 0.80\mu_R)^{0.30}
$$

$\mu_A$ represents acid-soil amendment relevance and $\mu_R$ represents the cation-exchange-capacity context. Soil pH is used only in B, preventing acidity from serving simultaneously as evidence for carbonic-acid CDR and agronomic need.

### 3. Mapped feedstock-access opportunity, F

F combines reconstructed candidate-lithology quality with straight-line distance:

$$
F = \max\left[0.01,\;q\exp\left(-\frac{d}{75}\right)\right]
$$

$q$ is mapped source quality and $d$ is straight-line distance in kilometres. F is a low-confidence reconnaissance proxy. It is not a road-haul estimate and does not establish mineralogy, quarry status, reserves, production capacity or safety.

### Composite opportunity index

The default model uses a weighted geometric mean:

$$
\mathrm{GREW\text{-}OI} = 100\exp\left[0.45\ln(H) + 0.25\ln(B) + 0.30\ln(F)\right]
$$

The geometric form is intentionally noncompensatory: a very low component constrains the composite instead of being fully offset by high values elsewhere. The weights express a declared decision structure, not measured causal effects.

## Uncertainty and robustness

The current release separates parameter-related uncertainty from model-structure dependence.

### Epistemic scenario ensemble

Four hundred reproducible draws vary:

- SoilGrids predictions;
- climate inputs;
- continuous-membership breakpoints;
- mapped source quality;
- haul-distance decay assumptions; and
- decision weights.

Cell-level P10, P50 and P90 values form an **epistemic scenario envelope**. They are not calibrated statistical confidence limits or posterior probabilities.

### Structural sensitivity

The default model is compared with balanced, hydroclimate-led, soil-benefit-led and access-led weight structures, together with alternative 50, 100 and 125 km feedstock-distance decay lengths. The application reports the minimum cell score across these tests and identifies areas that remain above the illustrative threshold under every structure.

## Spatial support and district aggregation

The analytical support is the WorldClim 2.1 grid at 2.5 arc-minutes. A cell is retained when its centre lies within an official Ghana district and all required national input values are finite.

Districts do not determine the environmental calculation. District statistics are produced afterwards using cell–polygon intersection and area weighting, including a cosine-latitude correction. The application discloses boundary areas that require nearest-complete-cell evidence. This approach reduces the ecological fallacy created by assigning one environmental value to an entire district.

## Data sources and evidentiary roles

| Evidence | Native support | Role in GREW-OI | Principal limitation |
|---|---|---|---|
| SoilGrids 2.0 pH and CEC | 250 m predictions; depth-weighted to 0–15 cm | Acid-soil co-benefit and scenario ensemble | Predicted national surfaces; not field chemistry or measured crop response |
| SoilGrids 2.0 SOC | 250 m predictions; depth-weighted to 0–15 cm | Contextual evidence only | Not used in the composite score |
| WorldClim 2.1 BIO1 and BIO12 | 2.5 arc-minutes; 1970–2000 climatology | Hydroclimatic component and output grid | Does not represent soil moisture, future climate or event-scale hydrology |
| Geological Survey of Ghana national map | 1:1,000,000 colour-classified reconstruction | Candidate-source quality and distance | Low-confidence reconnaissance; not mineralogy, quarry inventory, reserves or safety |
| Ghana Statistical Service Districts_261 | 261 polygons; published 2023 | Search and area-weighted reporting | Administrative geography is not environmentally homogeneous |

The effective national resolution is controlled by the coarsest primary environmental input, not by the native 250 m SoilGrids resolution.

## Appropriate use

KNUSTRocks can support:

- national and regional ERW research prioritisation;
- selection of contrasting sites for field validation;
- examination of mapped environmental gradients and within-district variation;
- preliminary evidence review by researchers, project developers, investors and public institutions; and
- design of feedstock, field, life-cycle and MRV work programmes.

KNUSTRocks must not be used as evidence of:

- verified gross or net carbon dioxide removal;
- carbon-credit issuance or protocol conformity;
- acceptable feedstock mineralogy, trace-element content or occupational safety;
- quarry availability, reserves, production capacity or legal access;
- cropland availability, tenure, consent or environmental eligibility;
- road-network haul distance, logistics cost or project economics;
- crop response at an untested site; or
- deployment authorisation or investment performance.

## Public-release boundary

The deployed application contains only the fields required for interactive mapping, cell inspection and district reporting. It intentionally excludes the complete analytical tables, sensitivity tables, model-development diagnostics, manuscripts, supporting information and internal validation records until the research team authorises their release.

There is no downloads page or public bulk-data export in Application v2.0. Repository maintainers should not publish `data/`, `outputs/`, `manuscript/`, `spec/`, `review/` or other internal research directories as website assets.

## Repository structure

```text
GREW-OI/
├── site/           KNUSTRocks Application v2.0 and its controlled public payload
├── code/           Model, application-data, figure, manuscript and validation workflows
├── data/           Internal analytical data package
├── outputs/        Cell, district, sensitivity and national-summary outputs
├── spec/           Versioned scientific model specification
├── figures/        Research and manuscript figures
├── manuscript/     Article, supporting information, audit and submission documents
├── review/         Critical review records
├── funding/        Validation-proposal materials
├── communications/ Public-communication assets
└── manifest_sha256.txt
```

The public application exists in `site/index.html`, with its controlled data and interface assets in `site/assets/`. Matching copies are retained in `site/public/` for the configured application build.

## Local development

The current application uses React 19, vinext, Vite and the configured Cloudflare-compatible worker environment. Node.js 22.13 or later is required.

```bash
cd site
npm ci
npm run dev
```

The development server prints the local address when it starts.

### Build and validation

```bash
npm run build
npm test
npm run lint
```

The application tests verify the v2.0 identity, required views, public-release boundary, map proportions, cartographic overlays, brand assets and accessible persistent theme control.

### Static hosting

The browser application is self-contained within `site/index.html` and `site/assets/`. For static hosting, publish only the approved contents of `site/`; do not expose the repository's internal research directories.

The production KNUSTRocks address is:

[https://ncelknust.github.io/KNUSTRocks/](https://ncelknust.github.io/KNUSTRocks/)

## Version convention

- **Application v2.0** identifies the public KNUSTRocks product generation.
- **GREW-OI** identifies the scientific index presented in the application.
- **Analytical build 7.0** is retained in internal filenames and metadata for computational provenance and is not presented as the public application version.

Historical analytical files may use the earlier abbreviation **GERW-OI**. The public project and application convention is **GREW-OI — Ghana Rock Enhanced Weathering Opportunity Index**.

## Citation

The accompanying manuscript is not yet published. Do not describe KNUSTRocks Application v2.0 or GREW-OI as peer reviewed until publication is confirmed.

Until a repository DOI and journal citation are available, cite the application as:

> Sokama-Neuyam, Y. A.; Quinoo, T. A.; Boakye, P. (2026). *KNUSTRocks Application v2.0: Ghana Rock Enhanced Weathering Opportunity Index (GREW-OI).* Net-Zero Carbon Emission Lab, Kwame Nkrumah University of Science and Technology, Ghana. [https://ncelknust.github.io/KNUSTRocks/](https://ncelknust.github.io/KNUSTRocks/)

Accompanying manuscript:

> Sokama-Neuyam, Y. A.; Quinoo, T. A.; Boakye, P. *Mapping Enhanced Rock Weathering Opportunity in Ghana: An Uncertainty-Aware, Subdistrict Framework for Reconnaissance and Field Validation.* Manuscript in preparation.

Replace the provisional application citation with the final DOI and journal citation after publication.

## Ownership, contact and acknowledgement

**Net-Zero Carbon Emission Lab**  
College of Engineering, KNUST  
New Engineering Building FF1  
Kumasi, Ghana

- Laboratory: [ncel@knust.edu.gh](mailto:ncel@knust.edu.gh)
- NCEL website: [https://www.ncel.knust.edu.gh](https://www.ncel.knust.edu.gh)
- Principal investigator: **Dr. Yen Adams Sokama-Neuyam**
- Email: [asokama@knust.edu.gh](mailto:asokama@knust.edu.gh)
- Telephone: [+233 24 593 7358](tel:+233245937358)

Users should acknowledge the Net-Zero Carbon Emission Lab, KNUST, and the original SoilGrids, WorldClim, Geological Survey of Ghana and Ghana Statistical Service data sources in derivative research or reporting.

## Licence and reuse

No open-source software or data licence has been assigned to this release. Unless a later `LICENSE` file states otherwise, access to this repository or application does not grant permission to redistribute, republish, modify or commercially reuse its code, model outputs, application data, figures or manuscripts.

Third-party source products remain subject to their respective terms and attribution requirements. Contact NCEL before any proposed reuse beyond ordinary viewing, evaluation or citation of the public application.

## Disclaimer

KNUSTRocks is a research decision-support application. Its outputs depend on secondary national datasets, continuous-membership functions, mapped-source assumptions, uncertainty scenarios and declared decision weights. Local conditions may differ materially from mapped values.

Any proposed ERW project requires independent land and environmental screening, representative feedstock mineralogy and geochemistry, quarry and logistics verification, controlled field trials, life-cycle assessment, carbon attribution, uncertainty propagation and an appropriate MRV and assurance framework.
