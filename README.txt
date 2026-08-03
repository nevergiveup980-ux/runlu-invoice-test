RUNLU Universal Invoice Engine v1.0 — Build014 Universal Model Core

This is the first neutral, reusable model build.

Implemented:
- New independent local-storage namespace for the universal test model.
- No GIMEX, Parkdale, or WTLC data is used as the starting profile.
- Generic business profile: company name, legal name, tax number, address,
  phone, email, currency, business type, country, and uploaded logo.
- Two neutral starter customer/service profiles for testing.
- First-run Universal Model setup card.
- Generic placeholder logo in the app, previews, and embedded Word templates.
- Existing monthly workflow, smart month transition, Word generation,
  review, email preparation, reminders, and history remain available.

Test sequence:
1. Open index.html or deploy all files to GitHub Pages.
2. Tap Start Business Setup.
3. Enter a new company name and upload a logo.
4. Configure the two starter customers/services and email contacts.
5. Generate a test month package and inspect both Word files.

Note: this build still uses two starter invoice profiles. Unlimited customer
management is planned for the next universal-model milestone.
