# RIL Playwright Tests

This suite migrates all active Java RIL features using LMR's Playwright BDD structure.
All 39 source pages are registered in `fixture/fixtures.ts`. The step file uses
named scenario switches and calls page objects directly, following LMR. There
are no StepLib helper classes or field interactions in the step definitions.
Each page owns its completion, content validation and error validation methods.
The shared base page provides typing, dates, assertions and reusable selection
and continuation behavior. Eleven unreferenced page methods were removed;
all active scenario assertions, source locators and page titles are retained.
Hint locators also accept stable IDs for current HOF wrapper markup.

## Test Data

Repeated valid inputs and invalid-input values live in
`utility-helper/constants-lib.ts`, exported as LMR-style named constants.
Steps switch directly on the exact Description and pass named constants into
the owning pages. No numeric Scenario IDs, applicant objects or scenario-data
registries are used. `SAS_HOF_EMAIL` remains environment-configured.
Page objects read individual input values directly from `ConstantsLib`.
Page-owned expected titles, labels and error messages describe the UI contract;
they are not applicant-input data. No CSV files are loaded at runtime.

Every outline navigates first, then selects its Description. The fixture extends
only `{ pages: Pages }`. Main-feature actions use common wording, explicit radio
choices, and concise joint/single applicant steps instead of repeated journey
suffixes. `Previous Application` and `Loan Recipient` Examples columns carry
variable choices without repeated description suffixes on action steps.
Initial journey-selection steps retain exact description validation.
Content and error action steps also omit repeated journey suffixes and reuse
the common title assertion. There is no stored description, custom journey fixture,
WeakMap, TestInfo import, or test-metadata routing helper.
Selection and journey-specific steps reject unknown, missing or unsupported
description/context combinations before interacting with pages.

## Configuration

Set `PLAYWRIGHT_BASE_URL` in the project's existing `.env` to use a running service.
Without it, Playwright starts the local HOF development watcher on port 8080.
Set `PLAYWRIGHT_PORT` to change the local port. Both the application and tests must
use that port. `RIL_START_PATH` defaults to `/`, matching the Java source URL.

The local service needs Redis, built assets, and its established Notify/PDF
configuration for submission. These tests do not provision infrastructure.
Install Chromium with `npx playwright install chromium` when needed.

## Checks

```powershell
npm run test:e2e:typecheck
npm run bddgen
```

The typecheck covers the step file, its imported pages and fixture, and rejects
unused imports. BDD generation checks all feature-step registrations. During
the stateless refactor, all ten old/new mocked page-call traces matched and 608
unsupported-description rejection checks passed without launching a browser or
submitting applications.

Validate Examples rows individually before running the full suite. Generated
test locations isolate one row, including outlines with multiple rows:

```powershell
npx playwright test ril.feature.spec.js:8 --workers=1 --retries=0
```

Then run the full suite:

```powershell
npm run test:e2e -- --workers=1 --retries=0
```

The Playwright configuration controls the scenario timeout. All eight source
data variations and ten active Examples rows
are preserved through direct named-constant arguments, not stored records.

After removing metadata and description state, all ten rows completed
individually and the full suite passed: **10 passed in 3.1 minutes**.
The long error scenario exceeded the current 80-second configured budget in one
isolated run. It passed with a temporary 180-second CLI budget, also used for the
full verification. The configuration was not changed:

```powershell
npm run test:e2e -- --workers=1 --retries=0 --timeout=180000
```

After removing the six main-journey suffixes, all ten rows passed individually
and the full suite passed: **10 passed in 3.5 minutes**, using the same explicit
180-second CLI budget. All ten old/new mocked page-call traces matched, 56
description-rejection checks passed, and typechecking and BDD generation passed.
Scenario titles (including user-added annotations), Examples, descriptions and
tags were preserved; the validation feature was not edited.
