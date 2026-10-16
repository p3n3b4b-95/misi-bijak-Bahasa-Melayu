# 05 — Screen specification (pending the design board)

**Status: PARTIAL. The Design Board V1 visual reference has not been supplied (UNKNOWN — Q2).** Task 1 of the handoff ("convert the approved design board into a screen-by-screen specification once the actual visual reference is supplied") cannot be completed. This file delivers everything that does not depend on the pictures — screen inventory, behaviour, states, accessibility, copy draft, intake checklist — and leaves every visual field as `PENDING-BOARD`.

Nothing here should be read as visual approval. Layout, colours, illustration, and exact wording come from the board.

## 1. What I need to finish this document

| # | Needed | Format that works | Used for |
|---|---|---|---|
| 1 | Frames for all five modules, every state (see §3) | Figma link with view access, or PNG/PDF per frame at 1× and a stated dp scale | Layout, spacing, hierarchy |
| 2 | Design tokens | Colours (hex), type scale, radii, elevation, spacing | `ui/theme` |
| 3 | The three characters | Names, art (vector preferred), poses idle/happy/encouraging | `characters.json`, S06 |
| 4 | Adventure map art | Background plus location icons for 6 missions, locked/unlocked/completed | S07 |
| 5 | Icon set | Mission, level, badge, rank, settings | all |
| 6 | Copy deck | Final Bahasa Melayu strings reviewed by a teacher/native speaker | `strings.xml` |
| 7 | Motion notes | Which animations exist and their reduced-motion equivalents | feedback, rewards |
| 8 | Tablet and landscape frames | Or confirmation to derive them | responsive rules |
| 9 | Licence statement for every visual asset | Per file | 08 |

Reconciliation procedure when the board arrives: for each screen below, fill `Board frame`, list deviations from this spec in a table, and mark each deviation **Spec wins (a11y/privacy/offline)** or **Board wins (visual)**. Accessibility, offline and privacy rules in §2 are not overridable by the board without a recorded decision.

## 2. Rules that apply to every screen

1. Touch targets ≥ 48×48 dp; primary actions and answer tiles ≥ 64 dp tall; ≥ 8 dp between targets.
2. Text contrast ≥ 4.5:1 (≥ 3:1 for text ≥ 24 dp or bold ≥ 18.66 dp). The web palette fails here: white on `#ff759f` is **2.53:1**, on `#ed607d` 3.20:1, on `#32ae74` 2.82:1 (VERIFIED, computed in Phase 1). Board colours must be checked before use; a failing pair gets dark text or a darker token.
3. Layouts must hold at 200% system font scale on 360 dp width without clipped text or unreachable buttons.
4. Breakpoints: compact (< 600 dp) single column; medium/expanded (≥ 600 dp) centred content with max width, or two-pane where noted. Landscape phone must not hide primary actions.
5. Every non-decorative element has a Bahasa Melayu `contentDescription`; decorative art is hidden from TalkBack.
6. Meaning is never colour-only: correct/incorrect always show an icon and text.
7. Respect system animator scale and the in-app `reducedMotion` setting (no confetti, static stars).
8. No links out, no network, no ads, no analytics, no permissions prompts.
9. No screen shows a pupil's name outside its own profile context, and the name is a nickname (A6).

## 3. Screen inventory

`Module` uses the five approved modules. `Board frame` is PENDING-BOARD for all rows.

| ID | Screen | Module | Purpose | Key states to design |
|---|---|---|---|---|
| S01 | Splash | 1 | Brand + init | loading, init-failed (retry) |
| S02 | MainMenu | 1 | Entry to play/profile/badges/settings | no profile, has profile |
| S03 | ProfileSelect | 2 | Choose who is playing (shared tablets) | empty, 1…20 profiles, full (max) |
| S04 | CreateProfile | 2 | Enter nickname | empty, invalid (each error), valid |
| S05 | CharacterSelect | 2 | Pick 1 of 3 characters | none selected, selected, TalkBack focus |
| S06 | AdventureMap | 2 | Mission overview with progress | per mission: locked / unlocked / in-progress / all-3-levels-done |
| S07 | LevelSelect | 3 | Three levels of a mission | per level: locked / unlocked / 1–3 stars |
| S08 | ActivityScaffold | 3 | Shared frame (back, progress, points, Dengar, Seterusnya) | loading, asking, answered-correct, answered-wrong, confirm-exit |
| S09 | Activity: Vokal | 3 | Pick the first vowel | as S08 |
| S10 | Activity: KV | 3 | Pick the first syllable | as S08 |
| S11 | Activity: KVK | 3 | Fill the missing letter | as S08 |
| S12 | Activity: Padan Gambar | 3 | Match word to picture | as S08; picture-hidden is N/A (P5) |
| S13 | Activity: Susun Huruf | 3 | Arrange letters (tap, no drag) | empty, partial, full, wrong, correct |
| S14 | Activity: Ayat Mudah | 3 | Complete the sentence | as S08 |
| S15 | FeedbackOverlay | 4 | Immediate right/wrong response | correct, incorrect |
| S16 | Result | 4 | Score, 0–3 stars, next actions | 0, 1, 2, 3 stars; next level unlocked or not |
| S17 | Reward | 4 | New badge / rank-up | badge, rank, multiple queued |
| S18 | StudentProfile | 5 | Totals, rank, per-mission summary | new profile (zeros), populated |
| S19 | Achievements | 5 | Badge grid | none earned, some, all |
| S20 | Settings | 5 | Sound, voice, motion, haptics, About, reset | defaults |
| S21 | ParentGate | 5 | Guard destructive actions | idle, holding, passed, cancelled |
| S22 | About / Licences | 5 | Version, privacy statement, third-party licences | — |
| S23 | ErrorRetry | all | Friendly failure for content/DB errors | content-invalid, db-failed |

## 4. Behaviour per screen (binding unless noted)

### Module 1

**S01 Splash.** Android 12+ system splash then a branded Compose screen. Maximum visible time ≈ 1.5 s *or* until init finishes, whichever is longer; no animation required. Init failure → S23. Removed from back stack.

**S02 MainMenu.** Four primary buttons: **Mula Bermain**, **Profil Saya**, **Pencapaian**, **Tetapan**. *Mula Bermain* → S03 if no `lastProfileId`, else S06. A global sound toggle is optional (the board decides); the setting itself lives in S20.

### Module 2

**S03 ProfileSelect.** Cards: avatar (character pose idle) + nickname. Selecting sets the active profile and goes to S06. "Murid baharu" is always visible. At the profile cap (P7) the button is disabled with a short reason. Long-press or an overflow action for "Padam murid" is **not** offered here (destructive actions are only in S20 behind S21).

**S04 CreateProfile.** One text field, label "Nama panggilan" (nickname). Validation per P7, errors shown inline with text (not colour only) and announced. Helper text: "Jangan guna nama penuh atau nombor telefon." No class, school, age or photo fields (A6).

**S05 CharacterSelect.** Three large selectable cards (single-select radio semantics for TalkBack). Confirm button "Pilih watak" enabled once selected. Character names/appearance: PENDING-BOARD (Q3).

**S06 AdventureMap.** Six locations in mission order. Each location shows title, stars earned out of 9 (3 levels × 3), and a lock if locked. Operable without gestures: TalkBack traversal follows mission order and announces "Misi 2, Suku Kata KV, terkunci" or "…dibuka, 4 daripada 9 bintang". Locked tap → hint (03 rule 4).

### Module 3

**S07 LevelSelect.** Three tiles. Level 1 of the first mission is always open; others per `UnlockPolicy` (A5/P9, Q1). Each tile shows stars (0–3) and best score. Replaying a finished level is always allowed.

**S08 ActivityScaffold.** Top: Back (→ confirm-exit), mission title, `n / total`, points. Middle: instruction, question, picture (if `showPicture`). Bottom: answer area. **Dengar** replays the word/sentence voice; **Seterusnya** appears after an answer. Answers are locked after the first selection (matches web behaviour).

| Activity | Prompt (draft) | Answer input | Notes |
|---|---|---|---|
| S09 Vokal | "Huruf vokal pertama dalam «{perkataan}» ialah…" | 3–5 vowel tiles | Level 1 shows 3 vowels (answer + 2) |
| S10 KV | "Suku kata awal bagi «{perkataan}» ialah…" | 3–4 syllable tiles | Distractor syllables from a curated list |
| S11 KVK | Word with one blank, e.g. "b _ s" | 3–4 letter tiles | Blank position varies (Q9) |
| S12 Padan Gambar | "Pilih gambar «{perkataan}»" | 3–4 picture tiles | Picture `contentDescription` must not reveal the answer: "Gambar 1…4"; voice button says the word |
| S13 Susun Huruf | "Susun huruf menjadi perkataan" | Tap tiles to fill slots; **Cuba semula**; **Semak** | No drag required; each placed letter is announced; tiles ≥ 64 dp |
| S14 Ayat Mudah | Sentence with blank | 3–4 word tiles | Exactly one acceptable answer among options |

### Module 4

**S15 FeedbackOverlay.** Correct: icon + "Hebat! Jawapan kamu betul!" + success sound + short confetti (skipped under reduced motion). Incorrect: icon + "Hampir! Jawapan betul ialah «{jawapan}»." + soft sound. The correct tile is highlighted using shape/icon as well as colour. Message is a live region. The tone is encouraging, never punitive; no loss of points beyond not earning them.

**S16 Result.** Shows `{skor} / {jumlah} mata`, 0–3 stars (static under reduced motion), a band message, and buttons: **Main lagi**, **Pilih tahap**, and **Tahap seterusnya** when unlocked. Data is read from the stored attempt (03 rule 1).

**S17 Reward.** Shown only for newly earned badge(s) or a rank-up, one at a time with **Teruskan**. Remaining rewards stay pending if the pupil leaves.

### Module 5

**S18 StudentProfile.** Character, nickname (editable), rank name + progress to next rank, total mata, total bintang, per-mission summary. Rank hint text is derived, matching the web wording pattern ("Kumpul N mata lagi untuk naik tahap").

**S19 Achievements.** Grid; locked badges show their hint, not a mystery. Earned badges show date. Initial list is PROPOSED (P13).

**S20 Settings.** Toggles: Kesan bunyi, Suara, Kurangkan gerakan, Getaran. About → S22. **Padam kemajuan murid ini** and **Padam semua** → S21 → confirm dialog. No account, login, network or "share" items.

**S21 ParentGate.** Press-and-hold for ~2 s (P10) with a visible progress ring and a TalkBack-friendly alternative (a labelled confirm that requires two deliberate activations — UNKNOWN whether this is acceptable; Cowlick/accessibility reviewer to confirm).

**S22 About / Licences.** App version, plain-language privacy statement ("Aplikasi ini tidak menghantar data keluar dari peranti."), third-party licences, font and audio credits as required by 08. The privacy statement is true only if gate G6 holds.

**S23 ErrorRetry.** One friendly message, a **Cuba lagi** button, and no technical text. Debug builds may show a code in a collapsed area.

## 5. Copy deck (DRAFT — unreviewed)

Strings below are my first draft in Bahasa Melayu, **not reviewed by a native speaker or teacher (UNKNOWN quality)**. The web app's existing wording is reused where it exists (VERIFIED in `js/app.js`/`index.html`).

| Key | Text | Source |
|---|---|---|
| `app_name` | Misi Bijak Bahasa Melayu | web |
| `menu_play` | Mula Bermain | new |
| `menu_profile` | Profil Saya | new |
| `menu_badges` | Pencapaian | new |
| `menu_settings` | Tetapan | new |
| `profile_new` | Murid baharu | new |
| `nickname_label` | Nama panggilan | new |
| `nickname_hint` | Jangan guna nama penuh atau nombor telefon. | new |
| `character_pick` | Pilih watak | new |
| `listen` | Dengar | web ("🔊 Dengar") |
| `next` | Seterusnya | web |
| `try_again` | Cuba semula | web |
| `check` | Semak | web |
| `feedback_correct` | Hebat! Jawapan kamu betul! | web |
| `feedback_wrong` | Hampir! Jawapan betul ialah “%1$s”. | web |
| `result_play_again` | Main lagi | web |
| `result_choose_level` | Pilih tahap | adapted from web "Pilih misi" |
| `locked_hint` | Dapatkan satu bintang di tahap sebelum ini. | new |
| `exit_confirm_title` | Keluar dari misi? | new |
| `reset_title` | Padam kemajuan? | adapted from web "Set semula kemajuan?" |
| `privacy_statement` | Aplikasi ini tidak menghantar data keluar dari peranti. | new |
| `rank_0..3` | Tunas Bahasa / Bintang Bahasa / Jaguh Membaca / Wira Bahasa | web |

## 6. Traceability

Every screen above maps to a milestone in `10-milestone-checklist.md` and to acceptance criteria AC-1…AC-5 from the Phase 1 report §8.2. Screens without a board frame stay unchecked in M3–M7 until the frame is attached.
