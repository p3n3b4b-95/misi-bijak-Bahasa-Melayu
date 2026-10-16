# 04 — Kotlin domain model and content JSON schemas

Specification only. Kotlin snippets are contracts to implement in M1/M2; they are not compiled here (no Android toolchain in this environment — VERIFIED in Phase 1). Schema files and example content live in `schemas/` and **were validated** (§5).

## 1. Vocabulary

| BM term | Meaning | Where |
|---|---|---|
| Mata | Points. 10 per correct answer. Cumulative total drives rank | `Attempt.score`, profile total |
| Bintang | Stars 0–3 per finished round, from score ratio | `Attempt.stars`, `LevelProgress.bestStars` |
| Tahap | Rank (4 ranks), by cumulative mata | `RankPolicy` |
| Lencana | Achievement badge | `AchievementUnlock` |
| Misi / Peringkat | Mission (6) / level (3 per mission) | content |

This resolves the web app's overloaded "bintang" (VERIFIED in Phase 1 §1.2).

## 2. Domain model (contract)

```kotlin
@JvmInline value class ProfileId(val value: String)      // UUID
@JvmInline value class MissionId(val value: String)      // "vokal" | "kv" | "kvk" | "padan" | "susun" | "ayat"
@JvmInline value class CharacterId(val value: String)    // "char_..."

enum class WordType { VOKAL, KV, KVK }
enum class ActivityType { VOKAL, KV, KVK, PADAN, SUSUN, AYAT }   // 1:1 with MissionId

data class Word(val id: String, val text: String, val type: WordType,
                val imageId: String, val audioId: String, val exampleSentence: String)

data class SentenceItem(val id: String, val textWithBlank: String, val answer: String,
                        val acceptableAnswers: Set<String>, val distractors: List<String>,
                        val imageId: String, val audioId: String)

data class LevelSpec(val index: Int, val questionCount: Int, val optionCount: Int,
                     val showPicture: Boolean, val autoPlayVoice: Boolean)

data class Mission(val id: MissionId, val order: Int, val activity: ActivityType,
                   val unlockAfter: UnlockRef?, val levels: List<LevelSpec>)   // levels.size == 3

data class UnlockRef(val missionId: MissionId, val levelIndex: Int)             // needs >= 1 star

// A generated question. Sealed so the UI must handle every activity.
sealed interface Question { val id: String; val imageId: String; val audioId: String; val correct: Answer }
data class ChoiceQuestion(…, val prompt: PromptKind, val options: List<String>) : Question   // vokal, kv, kvk, padan, ayat
data class ArrangeQuestion(…, val letters: List<Tile>) : Question                            // susun
data class Tile(val letter: Char, val originalIndex: Int)

sealed interface Answer { data class Choice(val value: String) : Answer
                          data class Sequence(val letters: String) : Answer }

data class RoundResult(val total: Int, val correct: Int) {
    val score get() = correct * 10                  // mata
}

enum class Rank(val minPoints: Int) { TUNAS(0), BINTANG(80), JAGUH(240), WIRA(480) }   // parity with core.js
```

### Domain services (pure Kotlin, JVM-testable)

| Service | Contract | Parity requirement |
|---|---|---|
| `QuestionGenerator` | `build(mission, level, content, random, recentWordIds): List<Question>` | Same invariants as `core.js` tests: requested count, no repeated word in a round, unique options, exactly one correct option |
| `ScoringPolicy` | `stars(correct, total): Int` | ratio ≥ .875→3, ≥ .625→2, ≥ .375→1, else 0 (VERIFIED in `core.js`) |
| `RankPolicy` | `rankFor(points): Rank`, `nextAt(points)` | thresholds 0/80/240/480 |
| `UnlockPolicy` | `unlocked(progress, missions): Set<LevelKey>`; mission *k+1* by `unlockAfter`; level *n+1* by ≥ 1 star on level *n* | Rule is PROVISIONAL (Q1) and lives in content, not code |
| `AchievementEvaluator` | `evaluate(before, after, rules): List<AchievementId>` | idempotent: never re-awards |
| `NicknamePolicy` | `validate(raw): Result<Nickname, NicknameError>` | P7 rules; unit-tested with Malay names (e.g. names with `'` or `-` are an open question — UNKNOWN) |

Generation rules that deviate from the web game (all need Q9 sign-off):

1. `ayat` options = `answer` + curated `distractors` (sampled), never the global word bank → removes ambiguous sentences (F7).
2. `kvk` hidden letter position varies among positions 1–3 across a round, but always keeps exactly one blank (F8).
3. Level difficulty (P5): L1 = `optionCount 3`, picture shown, voice auto-plays; L2 = `optionCount 4` (5 for vokal), picture shown; L3 = `optionCount 4`, **picture hidden** (voice only). For `padan`, "picture hidden" is not meaningful and the mission definition should override (UNKNOWN — needs design input).
4. Recent-word avoidance is per `(profile, mission, level)` and best-effort: with a 16-word pool and 8 questions the next round can avoid the previous 8 exactly (VERIFIED by the existing web test), but shared pools across levels can repeat words between levels.

## 3. Persistence model (Room v1)

```text
StudentProfile   id TEXT PK, nickname TEXT NOT NULL, characterId TEXT NOT NULL,
                 createdAt INTEGER NOT NULL, lastPlayedAt INTEGER
LevelProgress    profileId TEXT FK→StudentProfile ON DELETE CASCADE, missionId TEXT, levelIndex INTEGER,
                 bestScore INTEGER NOT NULL, bestStars INTEGER NOT NULL, attempts INTEGER NOT NULL,
                 completedAt INTEGER, PRIMARY KEY (profileId, missionId, levelIndex)
Attempt          id TEXT PK (UUID), roundId TEXT NOT NULL UNIQUE, profileId FK CASCADE,
                 missionId, levelIndex, score INTEGER, total INTEGER, stars INTEGER,
                 startedAt INTEGER, durationMs INTEGER
AchievementUnlock profileId FK CASCADE, achievementId TEXT, unlockedAt INTEGER, PRIMARY KEY (profileId, achievementId)
RecentWord       profileId FK CASCADE, missionId, levelIndex, wordId, roundId
```

Rules:

- `exportSchema = true`; schema JSON files are committed and a migration test runs from v1 upward (gate G5).
- Foreign keys enabled; deleting a profile cascades to everything about that pupil (this *is* the deletion mechanism — important for privacy).
- Total points and rank are **derived** (`SUM(Attempt.score)`), never stored, so they cannot drift.
- `bestStars` only increases; `attempts` always increments.
- DataStore (device-wide): `soundEffects`, `voice`, `reducedMotion`, `haptics`, `lastProfileId`. `music` is omitted until a licensed track exists.
- Nothing is sent anywhere; there is no export in V1 (a local CSV/print export for teachers is a post-V1 candidate — not scoped).

## 4. Content JSON

Five files in `assets/content/`, each with `schemaVersion: 1` and `contentVersion` (semver). Schemas: `schemas/*.schema.json` (JSON Schema 2020-12).

| File | Contents | V1 size |
|---|---|---|
| `words.json` | id, text, type, imageId, audioId, exampleSentence, status | 48 words (16/16/16) |
| `sentences.json` | id, textWithBlank (exactly one `____`), answer, acceptableAnswers?, distractors[], imageId, audioId, status | 24 sentences |
| `missions.json` | 6 missions × 3 levels, pool selector, `unlockAfter` | 6 |
| `characters.json` | exactly 3 characters, 3 poses each | 3 |
| `achievements.json` | rules + status (`proposed`/`approved`) | 9 proposed |

`status` supports an editorial workflow: items are `draft` until a teacher/linguist reviews them. A **reviewed** sentence must have ≥ 3 curated distractors (enforced by the schema). Release builds fail if any shipped item is `draft` (gate G9).

### Semantic validator rules (JSON Schema cannot express these)

Implemented in `validate-examples.js` for the prototype and to be re-implemented in the Kotlin `ContentValidator` (runs in unit tests and at debug startup):

1. Unique `id`, `imageId` per word; unique sentence ids.
2. `vokal` words start with a vowel (a, e, i, o, u).
3. `kvk` words are exactly consonant–vowel–consonant.
4. Every `audioId` resolves to a bundled file; every `imageId` resolves to a bundled image (image check is deferred until illustrations exist).
5. Example sentence contains the word.
6. A sentence's distractors never equal the answer or any `acceptableAnswers`.
7. For each mission level, `questionCount` ≤ size of its pool.
8. `order` equals position; first mission has no `unlockAfter`; every other mission's `unlockAfter.missionId` is the previous mission.
9. Strings referenced by `*Key` fields exist in `strings.xml` (Android lint covers missing resources at build).

## 5. Verification performed (this environment)

| Check | Result |
|---|---|
| 5 schemas compile under Ajv 8 (2020-12, `strict: true`) | VERIFIED — passes |
| Example content generated from the *current* `js/questions.js` (48 words, 24 sentences, 6 missions, 3 placeholder characters, 9 proposed achievements) validates against the schemas | VERIFIED — "ALL CHECKS PASSED" |
| Semantic rules 2, 3, 4, 5, 7, 8 hold for today's data | VERIFIED (all 16 KVK words are CVC; all 16 vokal words start with a vowel; all 72 voice files exist) |
| Schemas reject: reviewed sentence without distractors, missing blank, two blanks, 2 levels, 2 characters | VERIFIED — all rejected |
| Semantic rule 6 against *real* distractors | NOT TESTED — no curated distractors exist yet (`distractors: []` in the generated example) |
| Kotlin domain model compiles | NOT DONE — no code written, no SDK |

Re-run: `node docs/android/schemas/tools/prototype-export.js` then `NODE_PATH=<dir with ajv@8> node docs/android/schemas/tools/validate-examples.js`. These scripts are prototypes; the product exporter/validator is M0/M1.

## 6. Parity with the web game (what must stay equal)

Points per correct (10), questions per level (8), star thresholds, rank thresholds, the 48-word/24-sentence content. Anything else may legitimately differ. Parity is asserted by gate G9 using `tools/export-content.js --check` and Kotlin tests that load the same JSON.
