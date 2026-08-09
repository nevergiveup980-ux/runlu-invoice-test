RUNLU Universal Invoice
Version 1.0 · Build018 · Legacy State Migration

Purpose
-------
Fix a browser-upgrade issue where Build016 localStorage could make the cleaned
Build017 template immediately reopen August 2026.

Build018 changes
----------------
1. Adds a one-time migration for untouched legacy test workspaces.
2. Removes the inherited auto-selected billing period and previous invoice #0.
3. First open now remains at "No billing period selected".
4. Real configured business/contact/client data is preserved.
5. Generated, sent, archived or actively configured workspaces are not reset.
6. Build017 Generic Clean changes remain intact.
