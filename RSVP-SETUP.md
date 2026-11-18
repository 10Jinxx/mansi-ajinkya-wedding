# Mansi-side RSVP setup

This invitation intentionally has RSVP disabled until a separate bride-side Google Sheet is connected.

1. Create a **new** Google Sheet for Mansi's guests (do not reuse Ajinkya's RSVP sheet).
2. Name the response tab **RSVP Responses** and use columns: Submitted at, Guest name, Attendance, Guest count, Celebrations, Source.
3. In the new Sheet, go to Extensions → Apps Script and paste `google-apps-script-rsvp.gs`.
4. Deploy → New deployment → Web app; execute as Me and grant access to Anyone.
5. Paste the resulting /exec URL into `const RSVP_ENDPOINT='';` in index.html.
6. Submit a test RSVP and verify a new row appears in the new sheet before distributing the link.

Note: The four photographs and Sajdaa MP3 currently load from the original Ajinkya-side GitHub Pages site's public asset URLs. This preserves media playback and image display but is not yet a self-contained media clone. Copy those binary files into this repository and change URLs to local assets before making the sites fully independent.
