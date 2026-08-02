RUNLU Invoice V5.0 Build013 — Universal Foundation

This is the first generalization pilot built from the stable Build012 codebase.

NEW
- Business Profile settings: display name, legal company name, tax number, address, phone, email and currency.
- Custom company logo upload. The logo is converted to PNG and stored locally on the device.
- Uploaded logo is used in the app header, invoice preview and generated Word documents.
- Two reusable Invoice Profiles can now be renamed and configured without editing code.
- Each invoice profile supports its own Bill To, service description, filename prefix and amount.
- Email headings, document names, email subjects and previews now follow the configured invoice profile names.
- Company footer details in generated Word documents are replaced from the Business Profile.
- Existing GIMEX / Parkdale / WTLC configuration remains as the default, so current use is preserved.
- Existing smart month transition, reminders, contacts, review/send workflow and history remain intact.

DESCRIPTION VARIABLES
- {MONTH} inserts the invoice month and year.
- {YEAR} inserts the invoice year.
- {COMPANY} inserts the configured business display name.

SCOPE OF THIS PILOT
- The workflow is still monthly and still supports two invoice profiles.
- Flexible weekly, biweekly, quarterly and custom schedules will be a later generalization phase.
- Data is stored locally in the browser on the current device.
