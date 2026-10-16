# Android app — planning documents

Documentation for the planned offline Android version of Misi Bijak Bahasa Melayu. The Android project (M0 + UI-01) lives in `../../android/`; later screens are specification only. The web game at the repository root is unaffected.

| Read first | |
|---|---|
| [`PHASE2_REPORT.md`](PHASE2_REPORT.md) | Review summary, evidence table (VERIFIED / ASSUMED / UNKNOWN), blockers, questions |
| [`UI01_REPORT.md`](UI01_REPORT.md) | **Latest:** M0 + UI-01 review with CI links, screenshots and visual differences |
| [`PHASE1_RECON_REPORT.md`](PHASE1_RECON_REPORT.md) | Repository reconnaissance and first plan |

| Document | Topic |
|---|---|
| [`01-decisions.md`](01-decisions.md) | Approved decisions, provisional proposals, open questions |
| [`02-architecture.md`](02-architecture.md) | Layers, packages, runtime flows (diagrams) |
| [`03-navigation-contracts.md`](03-navigation-contracts.md) | Routes, guards, back-stack rules |
| [`04-domain-and-content.md`](04-domain-and-content.md) | Domain model, Room model, content JSON |
| [`05-screen-spec.md`](05-screen-spec.md) | Screens, states, accessibility, copy draft (from Design Board V1) |
| [`06-pages-isolation-plan.md`](06-pages-isolation-plan.md) | Keeping non-web files off GitHub Pages |
| [`07-privacy-remediation-proposal.md`](07-privacy-remediation-proposal.md) | Web app data-handling proposal |
| [`08-licensing-audit.md`](08-licensing-audit.md) | Audio, pictures, fonts; [`asset-register.csv`](asset-register.csv) |
| [`09-ci-gates.md`](09-ci-gates.md) | CI acceptance gates |
| [`10-milestone-checklist.md`](10-milestone-checklist.md) | Milestones M0–M9 |
| [`design/`](design/) | Design Board V1, per-screen crops, asset manifest, UI-01 screenshots and comparisons |
| [`schemas/`](schemas/) | JSON Schemas, examples, prototype export/validate scripts |

Prototype scripts in `schemas/tools/` are not product code. To re-run them: `node schemas/tools/prototype-export.js`, then `NODE_PATH=<dir containing node_modules with ajv@8> node schemas/tools/validate-examples.js`.
