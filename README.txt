RUNLU Universal Invoice
Version 1.0 · Build017 · Generic Clean

Purpose
-------
A clean universal invoice template for recurring-service businesses.

Build017 changes
----------------
1. No month/year is shown on first open.
2. The user must explicitly select a Billing Period before a month appears.
3. Removed the fixed August 2026 pricing rule and all fixed price defaults.
4. Removed old customer/business names from the embedded Word templates.
5. Replaced old business branding inside Word templates with neutral placeholders.
6. Replaced the embedded document logo with the generic RUNLU universal logo.
7. Removed legacy GIMEX image assets and renamed external invoice templates generically.
8. Existing core workflow remains: business setup, client profiles, Word generation,
   email preparation, reminders, history, and local-device storage.

Notes
-----
Internal legacy variable names are intentionally retained in Build017 to minimize
regression risk. They are not shown to users and can be refactored in a later build.
