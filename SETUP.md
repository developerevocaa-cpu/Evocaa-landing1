# Evocaa — Setup & Deployment Guide

This guide deploys the Evocaa booking flow end to end:
**Google Sheet → Apps Script Web App → `VITE_GOOGLE_SCRIPT_URL` → `booking.html`**.

Everything here is kept in sync with the field contract defined in
[`google-script.gs`](google-script.gs).

---

## 1. Prepare your Google Sheet

1. Go to <https://sheets.google.com> and create a new spreadsheet (e.g. **Evocaa Leads**).
2. Add headers in **Row 1** in this exact order (matches the script's append order):

   | A | B | C | D | E | F | G |
   |---|---|---|---|---|---|---|---|
   | Timestamp | Name | Email | Phone | Business Name | Monthly Revenue | Bottleneck |

3. Save the sheet.

---

## 2. Create the Apps Script (bound to the sheet)

1. Inside that sheet go to **Extensions → Apps Script**.
   (Opening it from the sheet **binds** the script — `getActiveSpreadsheet()` needs this.)
2. Delete any existing code and paste the **entire contents of `google-script.gs`**.
3. Click **Save**.

> The owner notification email goes to the **account that runs the script**
> (`Session.getActiveUser()`), so deploy with **Execute as: Me** and it will
> automatically use your email. No hardcoded email is needed.

---

## 3. Test the script

1. In the Apps Script editor, select **`testFormSubmission`** from the function dropdown.
2. Click **▶ Run**; authorize if prompted.
3. Check the **Execution log** and the confirmation/owner emails in your inbox.

---

## 4. Deploy as a Web App

1. Click **Deploy → New Deployment**.
2. **Type:** Web App.
3. **Execute as:** Me.
4. **Who has access:** Anyone.
5. Click **Deploy**, authorize, then **copy the Web App URL** (looks like
   `https://script.google.com/macros/d/ABC123XYZ/userweb`).

---

## 5. Configure the frontend

The frontend reads the URL from `VITE_GOOGLE_SCRIPT_URL`.

**Local development** — copy `.env.example` to `.env.local` and set:

```
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/d/YOUR_SCRIPT_ID/userweb
```

**Production (Vercel)**
1. Vercel Dashboard → your project → **Settings → Environment Variables**.
2. Add `VITE_GOOGLE_SCRIPT_URL` = your Web App URL.
3. **Redeploy**.

> `VITE_GOOGLE_SHEET_ID` and `VITE_OWNER_EMAIL` are **informational only** — the
> Apps Script auto-detects its bound sheet and owner email, so they are not
> required by the form.

---

## 6. Test end to end

Open `booking.html`, fill the form, and submit. New leads appear in the sheet,
and the owner + user confirmation emails are sent.

---

## Field contract (keep in sync everywhere)

| Sheet column | Form field (`booking.html`) | Payload key (`js/form-handler.js`) | Apps Script (`e.parameter`) |
|---|---|---|---|
| B: Name | `name` | `name` | `formData.name` |
| C: Email | `email` | `email` | `formData.email` |
| D: Phone | `phone` | `phone` | `formData.phone` |
| E: Business Name | `business` | `business` | `formData.business` |
| F: Monthly Revenue | `revenue` | `revenue` | `formData.revenue` |
| G: Bottleneck | `bottleneck` | `bottleneck` | `formData.bottleneck` |

Column A (`Timestamp`) is added automatically by the script.

Response JSON: `{ status, message, timestamp, httpCode }`.

---

## Known limitation: `no-cors`

`js/form-handler.js` posts with `mode: 'no-cors'` because Google Apps Script web
apps do **not** send CORS headers, so the browser cannot read the response. The
frontend treats a successfully-sent request as success. **No data is lost** — the
Apps Script logs the submission/errors in **Execution Logs** and emails the owner.
If a lead isn't saved, check Apps Script logs and the owner's inbox.

---

## Troubleshooting

- **Sheet shows `N/A` for a field** → that field name in the form/payload doesn't
  match `google-script.gs` (e.g. a missing `business`).
- **Emails not sent** → Gmail quota (100/day), spam folder, or Gmail disabled on the account.
- **Data not in sheet** → sheet not editable, or the script isn't bound to the correct spreadsheet.
- **Frontend shows success but nothing saved** → expected with `no-cors`; check
  the Apps Script Execution log.