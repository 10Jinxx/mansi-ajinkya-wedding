/** Mansi's wedding RSVP receiver — deploy as a new Web app version.
 * Execute as: Me; Who has access: Anyone.
 * Spreadsheet must remain private. Never expose guest data through doGet.
 */
const SHEET_NAME='RSVP Responses';
const SPREADSHEET_ID='1Tk8-6D-ZVWqF1QSLuVsOcVFMXm9-lDuXI4hAhmeORmM';
const HEADERS=['Submitted at','Guest name','Attendance','Guest count','Celebrations','Source','Receipt ID'];
function safeCell(value){const s=String(value||'');return /^[=+@\\-]/.test(s)?"'"+s:s;}
function doPost(e){
 try{
  const p=e&&e.parameter?e.parameter:{};
  const name=String(p.guest_name||'').trim().slice(0,100);
  const attendance=String(p.attendance||'');
  const count=Number(p.guest_count||0);
  const events=String(p.events||'').slice(0,500);
  const receipt=String(p.receipt_id||'').trim();
  if(!name||!['Yes','No'].includes(attendance)||!Number.isInteger(count)||count<1||count>20||!/^mansi-[0-9]{10,16}-[a-z0-9]{4,20}$/.test(receipt)||(attendance==='Yes'&&!events))return ContentService.createTextOutput('INVALID');
  const lock=LockService.getScriptLock();lock.waitLock(15000);
  try{
   const ss=SpreadsheetApp.openById(SPREADSHEET_ID);
   let sheet=ss.getSheetByName(SHEET_NAME);
   if(!sheet){sheet=ss.insertSheet(SHEET_NAME);sheet.appendRow(HEADERS);sheet.setFrozenRows(1);}
   if(sheet.getRange(1,7).getValue()!=='Receipt ID')sheet.getRange(1,7).setValue('Receipt ID');
   const last=sheet.getLastRow();
   if(last>1){const ids=sheet.getRange(2,7,last-1,1).createTextFinder(receipt).matchEntireCell(true).findNext();if(ids)return ContentService.createTextOutput('OK');}
   sheet.appendRow([new Date(),safeCell(name),attendance,count,safeCell(events),'mansi-invitation',receipt]);
   SpreadsheetApp.flush();
   return ContentService.createTextOutput('OK');
  }finally{lock.releaseLock();}
 }catch(error){console.error('RSVP write failed',error);return ContentService.createTextOutput('ERROR');}
}
function doGet(e){
 const p=e&&e.parameter?e.parameter:{};
 const callback=String(p.callback||'');
 const receipt=String(p.receipt_id||'');
 if(p.action!=='status'||!/^mansi-[0-9]{10,16}-[a-z0-9]{4,20}$/.test(receipt)||!/^mansiRsvpCheck_[a-z0-9]{1,32}$/.test(callback))return ContentService.createTextOutput('Invalid request');
 let saved=false;
 try{
  const sheet=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if(sheet&&sheet.getLastRow()>1&&sheet.getRange(1,7).getValue()==='Receipt ID')saved=!!sheet.getRange(2,7,sheet.getLastRow()-1,1).createTextFinder(receipt).matchEntireCell(true).findNext();
 }catch(error){console.error('RSVP status lookup failed',error);}
 return ContentService.createTextOutput(callback+'('+JSON.stringify({receipt_id:receipt,saved:saved})+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
}
