# 07 — Privacy remediation proposal for the existing web application

**Status: PROPOSAL ONLY.** Nothing in this document has been applied. I did not connect to Supabase, did not read production data, and did not alter policies, functions, migrations, or the teacher dashboard. Everything about the live database comes from the SQL files in the repo, so what is actually deployed there is **UNKNOWN**.

This is an engineering assessment, not legal advice. Whether the data flows below meet Malaysian or school requirements (for example the Personal Data Protection Act 2010 and Ministry/school policy) is a question for the data controller and counsel (UNKNOWN).

## 1. Data inventory (from code)

| Data | Where collected | Sent to | When | Evidence |
|---|---|---|---|---|
| `student_name` (free text, ≤ 30) | Name input on home screen | Supabase `results` table | After every finished mission | `js/app.js` `finishGame`/`flushResults` — VERIFIED |
| `class_name` (≤ 30) | Class dropdown | Supabase `results` | same | VERIFIED |
| `mission_id`, `score`, `total`, `stars`, `attempt_id` (random UUID) | Game logic | Supabase `results` | same | VERIFIED |
| `created_at` | Server default | stored in `results` | on insert | `create_results.sql` — VERIFIED |
| Class list | Fetched from Supabase | Browser | **On every page load, before any play, by every visitor** | `loadClasses()` called at init — VERIFIED |
| IP address, user agent, timing | Inherent to any HTTPS request | Supabase / its hosting | each request | ASSUMED (standard HTTP); retention UNKNOWN |
| Outbox of unsent results | `localStorage` `misiBijakBM.pendingResults` | stays on device until sent | offline | VERIFIED |
| Teacher e-mail + password | Teacher login | Supabase Auth | teacher login | `js/teacher.js` — VERIFIED; token kept in `sessionStorage` |

Retention, deletion, backups, region of the Supabase project, access logs, and who administers the project: **UNKNOWN**.

## 2. Findings

| ID | Finding | Evidence | Severity (my judgement) |
|---|---|---|---|
| PR1 | README states "Projek ini tidak menghantar data ke server dan tidak menggunakan analitik." The code sends names, classes and scores to a third-party service. The statement is inaccurate. | `README.md` vs `js/app.js` — VERIFIED | High (honesty/trust; cheap to fix) |
| PR2 | No privacy notice or consent is shown in the game. The only message is "Menyimpan markah untuk guru…". | `index.html`, `js/app.js` — VERIFIED | High |
| PR3 | Children are asked for a name in a free-text field with `autocomplete="name"`; nothing steers towards a nickname. | `index.html` — VERIFIED | Medium |
| PR4 | Opening the page contacts Supabase (class list) even if the child never plays or the school has not agreed to sync. | VERIFIED | Medium |
| PR5 | Insert policy for `results` is `with check (true)` for anonymous clients; the table constraints limit shape but not authenticity or volume. Anyone with the (public) key can insert fake or abusive rows, including arbitrary `student_name`/`class_name` text. | `create_results.sql` — VERIFIED (policy text); live state UNKNOWN | Medium |
| PR6 | Anonymous clients cannot read `results` (select is granted only to `authenticated` and filtered by `is_teacher()`). This is a good property. | SQL — VERIFIED (text); live state UNKNOWN | — (positive) |
| PR7 | Teacher authorisation includes a hard-coded personal e-mail address in a committed SQL function and migrations in a public repo. | `*_allow_teacher_email.sql`, `*_add_teacher.sql`, `*_reauthorize_teacher.sql` — VERIFIED | Medium (personal data of an adult; also brittle) |
| PR8 | No delete/retention mechanism for pupil data: no delete grants, no scheduled clean-up in the migrations. | SQL — VERIFIED (absence in repo) | Medium |
| PR9 | Anyone can list the school's class names (select `using (true)`). Low sensitivity but reveals school structure. | `create_classes.sql` — VERIFIED | Low |
| PR10 | Teacher dashboard shows pupil full names and scores; PDF export is browser print. Screen/print handling is outside code control. | `teacher.html`, `teacher.js` — VERIFIED | Low–Medium |

## 3. Constraints

- **Do not alter production Supabase policies** and **do not remove teacher functionality** without separate approval (handoff).
- Android V1 ships without any of this (decision A2); this proposal concerns the *web* app only.
- The web game must remain usable by a teacher who wants class dashboards today. Therefore the goal is *honest, minimal, opt-in, and tighter* — not removal.

## 4. Remediation tiers

Each tier is independent and separately approvable. "Reversible" means one commit revert or one setting flip.

### T0 — Text only, no behaviour change (lowest risk)

| Change | Files | Reversible |
|---|---|---|
| Replace the inaccurate README privacy section with an accurate description: what is sent, to whom, why, what is kept locally | `README.md` | yes |
| Add a short privacy page (`privacy.html`, linked from the footer) written in Bahasa Melayu for parents/teachers; includes the controller's contact (UNKNOWN who) | new file + allowlist entry in Pages plan | yes |
| Add one line under the name field: "Guna nama panggilan sahaja." | `index.html` | yes |

Effort: small. Risk to production: none beyond content. This is the one tier I recommend doing **immediately** once approved, because PR1 is a factual error.

### T1 — Client-side, behind a flag (default preserves today's behaviour)

| Change | Purpose | Reversible |
|---|---|---|
| `SYNC_MODE` in `js/supabase-config.js`: `off` / `ask` / `on` | Lets the owner decide per deployment. Default `on` keeps current behaviour; recommended target `ask` | yes |
| In `ask` mode, show a one-time notice + checkbox (stored locally) before any request to Supabase, including the class-list fetch | Fixes PR2, PR4 | yes |
| Relabel the field "Nama panggilan"; reject digits and `@`; keep ≤ 20 chars client-side | PR3 | yes |
| Show "Data dihantar kepada guru: nama panggilan, kelas, markah" on the result screen when syncing | Transparency | yes |
| Teacher-facing: add a visible "Padam data murid" request instruction (manual process until T2) | PR8 interim | yes |

Test impact: existing 13 tests stay valid; new tests for `SYNC_MODE` branches. Regression checklist (must pass before merge): home loads, a mission completes, result screen shows, offline outbox still flushes when `on`, teacher login and results table work, class filter works.

### T2 — Server-side hardening (needs explicit approval and a staging project)

I recommend a **separate Supabase project** (or branch) for rehearsal. None of these have been run anywhere.

| Change | Addresses | Notes |
|---|---|---|
| Restrict inserts: require `class_name` to exist in `classes`; add length/charset checks; consider routing inserts through a `security definer` function that validates input instead of open table insert | PR5 | Must keep `attempt_id` uniqueness (client treats 409 as success — VERIFIED in `core.js`) |
| Rate limiting at the API edge or per-attempt checks | PR5 | Mechanism depends on Supabase plan (UNKNOWN) |
| Remove the hard-coded e-mail from `is_teacher()`; rely only on the `teachers` table | PR7 | Requires the table row to exist first; sequence matters or the teacher is locked out. History keeps the old value |
| Retention job: delete rows older than N days (N is a policy decision — UNKNOWN) | PR8 | |
| Documented deletion procedure per pupil/class | PR8 | |
| Restrict class listing to rows flagged public, or require a class code | PR9 | Changes how pupils pick a class; UX decision |
| Review project region, backups, log retention, admin access list, and 2FA for the project owner/teacher accounts | inventory gaps | Owner action |

Rollback: each SQL change gets a paired down-migration written *before* it is applied; keep the previous function definitions in a migration file.

### T3 — Governance (owner/school)

Identify the data controller, obtain school/parent notification as required, define retention, record processing description, and decide whether names should exist on the server at all (a class-scoped code per pupil would remove names from the server entirely while keeping the dashboard useful — design needed, not proposed in detail).

## 5. Recommendation and sequencing

1. **T0 now** (after approval) — corrects a false claim at no risk.
2. **T1** next — adds consent/transparency; ship with `SYNC_MODE=ask`.
3. **T2** only after a rehearsal on a non-production project and an explicit go from Cowlick and the project owner.
4. **T3** in parallel by the owner.

Android: keep the stronger stance (no network, nickname-only, on-device only). If teacher reporting for Android is later desired, it should be a *new* decision (D1 was resolved as "no sync in V1") and likely a local export, not a server.

## 6. What I did not do

- No queries against Supabase (not even read-only); no use of the publishable key.
- No edits to `supabase/`, `js/`, `index.html`, `teacher.*`, or `README.md`.
- No assessment of the live RLS state — only of the SQL in the repo.
