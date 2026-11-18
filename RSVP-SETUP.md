# Mansi's RSVP — deployment checklist

## Dedicated response sheet (already created)

[Open Mansi's RSVP Responses](https://docs.google.com/spreadsheets/d/1Tk8-6D-ZVWqF1QSLuVsOcVFMXm9-lDuXI4hAhmeORmM/edit)

The sheet is separate from Ajinkya's RSVP data. It has an **RSVP Responses** tab with columns: Submitted at, Guest name, Attendance, Guest count, Celebrations, Source, Receipt ID.

## One-time deployment (Google Apps Script)

1. Open [script.google.com](https://script.google.com/home/projects/create) while signed into the Google account that owns or can edit Mansi's response sheet.
2. Delete the starter code and paste the full contents of [google-apps-script-rsvp.gs](google-apps-script-rsvp.gs) from this repository.
3. Click **Save**, name the project **Mansi Wedding RSVP**.
4. Click **Deploy → New deployment → Select type: Web app**.
5. Set **Execute as: Me** and **Who has access: Anyone**. Authorize Google permissions and deploy.
6. Copy the Web app URL ending in **/exec**. Send it to ChatGPT or replace the empty `RSVP_ENDPOINT` in [index.html](index.html) with the URL.
7. Submit a test RSVP from the invitation, then verify a new row appears in the dedicated Sheet. Only then share the RSVP link with guests.

**Important:** The response sheet should remain private. Anyone with the public web-app URL can submit RSVP data, but they should not have direct spreadsheet edit access. Avoid sharing personal guest data publicly. Do not reuse Ajinkya's endpoint.

The invitation's submit button is intentionally disabled until the separate /exec endpoint is configured. The RSVP form collects name, attendance, guest count and the selected ceremonies (Vidhaan, Mehendi, Haldi, Tilak, Reception, Wedding).

## Updating an already deployed web app (required after RSVP fix)

1. Open the existing **Mansi Wedding RSVP** project in [Apps Script](https://script.google.com/home).
2. Replace its entire `Code.gs` contents with the latest [google-apps-script-rsvp.gs](google-apps-script-rsvp.gs) from **main** and **Save**.
3. Go to **Deploy → Manage deployments**, edit the existing Web app deployment (pencil icon), choose **Version → New version**, then **Deploy**. Keep **Execute as: Me** and **Who has access: Anyone**. This preserves the existing `/exec` URL.
4. Test the invitation RSVP. It now shows success **only after** the script confirms a matching receipt ID exists in the spreadsheet. Verify the new row in the private [RSVP Responses Sheet](https://docs.google.com/spreadsheets/d/1Tk8-6D-ZVWqF1QSLuVsOcVFMXm9-lDuXI4hAhmeORmM/edit).
5. If no row appears, check **Apps Script → Executions** for permission, deployment or spreadsheet-access errors. The deployment must run as a Google account with edit access to this sheet.

**Important:** GitHub updates do not automatically deploy Apps Script. If the web app is not redeployed as a new version, the updated website cannot verify submissions. The website uses a cross-origin opaque POST plus a receipt-only JSONP status lookup; it does not expose guest details through the status endpoint.
