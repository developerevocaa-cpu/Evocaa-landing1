# Evocaa Project - File Structure

```
evocaa-project/
│
├── index.html                    # Main landing page (hero, features, pricing, FAQ) — UI/CONTENT LOCKED
├── booking.html                  # Booking form page for lead capture (matches landing page style)
├── config.js                     # Environment variable loader -> window.CONFIG
├── js/
│   └── form-handler.js           # Form validation + submission to Google Apps Script
├── package.json                  # Build tooling (Vite) + npm scripts
├── vite.config.js                # Vite multi-page build config (index.html + booking.html)
├── .env.local                    # Local environment variables (DO NOT COMMIT)
├── .env.example                  # Template for environment variables
├── google-script.gs              # Google Apps Script code (paste & deploy as Web App)
├── SETUP.md                      # Setup & deployment guide (incl. Render)
├── .gitignore                    # Git ignore rules
└── PROJECT_STRUCTURE.md          # This file
```

> `node_modules/` and `dist/` are build artifacts — created locally by
> `npm install` / `npm run build` and ignored by Git.

---

## File Descriptions

### Core Files

| File | Purpose |
| :--- | :--- |
| `index.html` | Landing page with hero section, features, pricing, FAQ. **Do not change its UI or content.** |
| `booking.html` | Booking form page for lead capture. Collects: name, email, phone, business, revenue, bottleneck. |
| `config.js` | Loads environment variables and exposes them as `window.CONFIG`. |
| `js/form-handler.js` | Validates the booking form and POSTs the data to the Google Apps Script Web App URL. |
| `google-script.gs` | Apps Script that saves leads to a Google Sheet and sends owner + confirmation emails. |
| `.env.local` | Local development environment variables (git-ignored). |
| `.env.example` | Template showing required environment variables. |

### Directories

| Directory | Purpose |
| :--- | :--- |
| `js/` | JavaScript utilities (currently the form handler). |

### Documentation

| File | Purpose |
| :--- | :--- |
| `SETUP.md` | Step-by-step setup and deployment guide (sheet → script → env → test). |
| `PROJECT_STRUCTURE.md` | This file. |

---

## Environment Variables Required

| Variable | Required? | Purpose |
| :--- | :--- | :--- |
| `VITE_GOOGLE_SCRIPT_URL` | **Yes** | Deployed Apps Script Web App URL the form POSTs to. |
| `VITE_GOOGLE_SHEET_ID` | No | Informational only — the Apps Script auto-detects its bound sheet. |
| `VITE_OWNER_EMAIL` | No | Informational only — the Apps Script auto-detects the owner email. |

Add to Render dashboard (or `.env.local` for local dev):

```
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/d/YOUR_SCRIPT_ID/userweb
```

---

## Build & Deploy (Render)

1. Push the project to a Git repository (GitHub / GitLab / Bitbucket).
2. Render Dashboard → **New → Static Site** → connect the repository.
3. **Build Command:** `npm run build`
4. **Publish Directory:** `dist`
5. **Environment:** add `VITE_GOOGLE_SCRIPT_URL` = your Apps Script Web App URL.
6. Click **Create Static Site**.

The Vite build outputs both `index.html` and `booking.html` into `dist/`.

---

## Field Contract (keep in sync everywhere)

The form (`booking.html`), the payload (`js/form-handler.js`), and the Apps
Script (`google-script.gs`) all use the same fields:

| Sheet column | Field key | Example |
| :--- | :--- | :--- |
| B: Name | `name` | Priya Raghavan |
| C: Email | `email` | priya@example.com |
| D: Phone | `phone` | +91 98765 43210 |
| E: Business Name | `business` | Priya Interiors |
| F: Monthly Revenue | `revenue` | ₹5L – ₹15L |
| G: Bottleneck | `bottleneck` | Not enough new enquiries |

Column A (`Timestamp`) is added automatically by the Apps Script.

---

## How It Works

1. **User visits** `index.html` (landing page)
2. **User opens** `booking.html` (booking form)
3. **Form loads** `config.js` which reads environment variables
4. **User submits** the form (name, email, phone, business, revenue, bottleneck)
5. **`js/form-handler.js`** sends data to the Google Apps Script URL (from env)
6. **Apps Script** saves data to the Google Sheet (the sheet it is bound to)
7. **Apps Script** sends an owner notification + user confirmation email
8. **User sees** the success message

> Note: `index.html`'s "Book" buttons scroll to the pricing section (their
> original behavior). `index.html` is intentionally not modified.