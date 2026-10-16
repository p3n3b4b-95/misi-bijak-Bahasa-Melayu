# 06 — Plan: isolate GitHub Pages from Android and non-public files

**Status: PLAN ONLY.** `.github/workflows/deploy-pages.yml` is unchanged. Changing it needs separate approval (Q7). Nothing here was deployed.

## 1. Current state

| Fact | Evidence | Status |
|---|---|---|
| Deploy triggers: `push` to `main`, `workflow_dispatch` | workflow file | VERIFIED |
| Pipeline: checkout → Node 22 → `npm test` → `upload-pages-artifact` with `path: .` → `deploy-pages` | workflow file | VERIFIED |
| `path: .` uploads the whole repo working tree | workflow file | VERIFIED |
| Latest run (#27, 2026-10-13) succeeded | GitHub Actions API | VERIFIED |
| Hidden folders (`.git`, `.github`) are excluded from the artifact | action behaviour from general knowledge | ASSUMED |
| Which files are actually reachable on the live site | Could not probe — `github.io` is blocked by this sandbox's proxy | UNKNOWN |
| Repository is public (README says "repository awam"; Pages on a free account needs public) | README text | ASSUMED |

### Tracked files that are *not* part of the website but would be published today

At the time of the prototype run, 14 of 107 tracked files were outside the site (VERIFIED by listing): `README.md`, `MAINTENANCE.md`, `TESTING.md`, `package.json`, `.gitignore`, `tests/*.test.js` (2), `supabase/migrations/*.sql` (5), the workflow file and the Phase 1 report. The Phase 2 documents and, once merged, all of `android/` and `tools/` add to that set; any APK-related artefact committed by accident would too.

The sensitive item is `supabase/migrations/*` : two migrations and one SQL function contain a teacher's personal e-mail address (VERIFIED in Phase 1, finding F3). Isolating Pages removes it from the *site*; it remains in the public repository and in Git history (see §6).

## 2. Goal

The published site contains **only** what the browser needs:

```text
index.html  teacher.html  css/  js/  assets/
```

Everything else stays in the repo but never reaches Pages. Android work (new folders, large files, docs) can never leak to the site by being added.

## 3. Proposed mechanism: allowlist staging

Replace `path: .` with a staged directory built from an explicit allowlist.

```yaml
# PROPOSED CHANGE — not applied
      - name: Stage public site files
        run: |
          set -euo pipefail
          rm -rf _site
          mkdir _site
          cp -R index.html teacher.html css js assets _site/
      - name: Verify staged files
        run: node tools/verify-pages-stage.js _site     # see §4
      - uses: actions/upload-pages-artifact@<pinned SHA>
        with:
          path: _site
```

Why an allowlist (not a denylist): a new top-level folder is excluded by default. The failure mode of a forgotten entry is a 404 on the site (caught by the verify step), not a data leak.

Also add `paths-ignore` to the push trigger so Android- or docs-only merges do not redeploy the site:

```yaml
on:
  push:
    branches: [main]
    paths-ignore: ["android/**", "docs/**", "tools/**", "supabase/**", "**/*.md"]
```

(`workflow_dispatch` remains for manual redeploys.)

## 4. Verification gate (what "isolated" means, testably)

`tools/verify-pages-stage.js` (to be written in M0 after approval) fails the build if:

1. the staged tree contains any path outside the allowlist regexes (`^index\.html$`, `^teacher\.html$`, `^css/`, `^js/`, `^assets/`);
2. any file referenced by `index.html`/`teacher.html` (`href`/`src`) is missing from the stage;
3. any audio file named by the content bank is missing;
4. the stage contains `*.sql`, `*.md`, `*.apk`, `*.aab`, `*.jks`, `*.keystore`, `local.properties`, `.env*`;
5. a staged file is larger than a budget (provisional: 2 MB; the largest today is 24 KB audio — VERIFIED).

### Prototype result (this environment)

I staged the allowlist into a scratch directory, served it with a static server, and requested every reference.

| Check | Result |
|---|---|
| Staged files | 93 (of 107 tracked) |
| References from both HTML files plus all 75 bundled audio paths requested | **86 distinct URLs checked, 0 non-200** — VERIFIED |
| `supabase/migrations/…allow_teacher_email.sql`, `docs/android/PHASE1_RECON_REPORT.md`, `package.json`, `README.md` | **404 on the staged site** — VERIFIED |
| Real Pages deployment behaviour with the new workflow | NOT TESTED — cannot deploy from here, and the workflow only runs on `main` |

Note that `README.md`, `MAINTENANCE.md`, `TESTING.md` are currently published (ASSUMED, same reason as above) and would stop being published. The site does not link to them (VERIFIED: no reference in either HTML file). If the owner wants them online, add them to the allowlist.

## 5. Rollout and rollback

| Step | Action | Who | Reversible? |
|---|---|---|---|
| 1 | Approve this plan (Q7) | Cowlick | — |
| 2 | Add a PR-time job `pages-stage-check` that stages and verifies **without deploying** | Claude, in M0 | yes (delete job) |
| 3 | Run it on the feature branch; attach the log | Claude | — |
| 4 | Change `deploy-pages.yml` (stage + verify + `paths-ignore`) in the same PR | Claude, after approval | yes (revert commit) |
| 5 | After merge, human opens the live URL and walks the web part of `TESTING.md` (home, a mission, result, teacher login page loads, audio plays) | Owner | — |
| Rollback | `git revert` the workflow commit and re-run **Deploy GitHub Pages** via `workflow_dispatch` | Owner/Claude | — |

I will not merge to `main` or trigger a deployment; step 4 lands only through a PR the owner merges.

## 6. What this does not fix

- **Git history and the repo itself remain public**, including the teacher's e-mail in the migrations. Removing it from history means a history rewrite on a public repo — out of scope and not proposed without explicit approval. Practical mitigation belongs to the privacy plan (07): stop relying on a hard-coded e-mail, and let the owner decide whether the address is acceptable to leave public.
- Pages serves `js/supabase-config.js` (URL + publishable key) by design; that key is meant to be public (ASSUMED from Supabase's model). The protection is Row Level Security, which this plan does not touch.
- Nothing here changes behaviour of the live web game: the staged tree is byte-identical for the files the site uses (copy, no transformation).

## 7. Android-specific hygiene

- `.gitignore` additions before the first Android commit: `*.jks`, `*.keystore`, `local.properties`, `android/**/build/`, `android/.gradle/`, `*.apk`, `*.aab`, `.idea/`.
- Release binaries are CI artefacts or draft GitHub Releases — never committed (gate G12).
- Android CI path filters keep web-only changes from running Android jobs and vice-versa.
