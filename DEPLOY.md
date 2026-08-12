# KNUSTRocks — deploy to the web (free)

`index.html` is the whole tool: the landing page + interactive dashboard, with the map, all data and the
KNUSTRocks logo embedded. It is one self-contained file with **no external dependencies** — nothing to
build, no server, no database, no cost. To publish it you just put this one file online.

---

## Option 1 — Netlify Drop (fastest, live link in ~60 seconds, no account needed)

1. Open **https://app.netlify.com/drop** in your browser.
2. Drag the file **`index.html`** (or this whole `KNUSTRocks_Deploy` folder) onto the page.
3. Netlify uploads it and instantly gives you a live link, e.g. `https://gentle-rock-1234.netlify.app`.
4. Share that link — it works on phones and laptops.
5. (Optional, recommended) Click **"Sign up"** (free) to keep the site permanent and rename it:
   Site settings → **Change site name** → e.g. `knustrocks` → your link becomes
   `https://knustrocks.netlify.app`.

To update later: drag a new `index.html` onto the same site (Deploys tab → drag-and-drop). The link stays the same.

---

## Option 2 — GitHub Pages (best for a permanent, citable KNUST/NCEL link — free forever)

1. Create a free account at **https://github.com** (an NCEL/KNUST org account is ideal).
2. Click **New repository** → name it `knustrocks` → **Public** → **Create repository**.
3. On the repo page click **Add file → Upload files** → upload `index.html` → **Commit changes**.
4. Go to **Settings → Pages** → under *Build and deployment* set **Source = Deploy from a branch**,
   **Branch = `main`**, folder **`/ (root)`** → **Save**.
5. Wait ~1 minute, then reload the Pages settings — your live link appears:
   `https://<your-username>.github.io/knustrocks/`.
6. (Optional) Add a custom domain (e.g. `knustrocks.knust.edu.gh`) under the same **Pages** settings once
   your IT team points a DNS record to GitHub.

To update later: upload a new `index.html` to the repo (same steps); the link stays the same.

---

## Option 3 — Cloudflare Pages / tiiny.host / Vercel
All three take a single HTML file the same drag-and-drop way and give a free link. Cloudflare Pages and
Vercel are good if you already use them; **tiiny.host** is the simplest one-file drop after Netlify.

---

## Quick checklist before you publish
- [ ] Open `index.html` locally once and click **Explore the map** to confirm it loads.
- [ ] Publish via Option 1 (fast) or Option 2 (permanent).
- [ ] Test the live link on a phone.
- [ ] Put the link on the KNUSTRocks / NCEL page, LinkedIn, and in the paper's data-availability statement.

*The tool is a decision-support screen — not a substitute for quarry-scale sampling and field trials.*
