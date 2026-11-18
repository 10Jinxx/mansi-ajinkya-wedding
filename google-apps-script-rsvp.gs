/**
 * Wedding RSVP receiver — paste into Extensions > Apps Script
 * in a private Google Sheet. Deploy as Web app:
 * Execute as: Me | Who has access: Anyone
 * Keep the spreadsheet private. Do not share edit access with guests.
 */
const SHEET_NAME = 'RSVP Responses';
function doPost(e) {
  const p = e && e.parameter ? e.parameter : {};
  const name = String(p.guest_name || '').trim().slice(0, 100);
  const attendance = String(p.attendance || '');
  const guests = Number(p.guest_count || 0);
  const events = String(p.events || '').slice(0, 500);
  if (!name || !['Yes','No'].includes(attendance) || !Number.isInteger(guests) || guests < 1 || guests > 20) {
    return ContentService.createTextOutput('Invalid RSVP');
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Submitted at', 'Guest name', 'Attendance', 'Guest count', 'Celebrations', 'Source']);
      sheet.setFrozenRows(1);
    }
    // Prefix dangerous spreadsheet formula starts to avoid formula injection.
    const safe = value => /^[=+@\-]/.test(value) ? "'" + value : value;
    sheet.appendRow([new Date(), safe(name), attendance, guests, safe(events), 'wedding-website']);
    SpreadsheetApp.flush();
    return ContentService.createTextOutput('OK');
  } finally { lock.releaseLock(); }
}
