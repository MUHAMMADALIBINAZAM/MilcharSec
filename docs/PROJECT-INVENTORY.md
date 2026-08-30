# MilcharSec Project Inventory

Audited from the current working tree on 2026-08-30. Counts below were read directly from every existing `data/module-*.json` file. Statuses are based on source inspection; all 8 tools were additionally browser-tested individually on 2026-08-30 (each loads, accepts input, produces a result, with no console errors beyond the benign Tailwind CDN warning).

## 1. Modules

| Module | Title | Sections | Catalog topics | Interactive exercises | Scenarios | Quiz questions | Module-specific tools/resources |
|---|---|---:|---:|---:|---:|---:|---|
| 01 | Cybersecurity Fundamentals | 5 | 10 | 1 | 4 | 5 | None |
| 02 | Password & Account Security | 5 | 10 | 2 | 3 | 8 | `spotlight-02-01` in module JSON; catalog links `tool-01` |
| 03 | Phishing & Social Engineering | 4 | 11 | 2 | 4 | 8 | None in module JSON; catalog links `tool-02`, `tool-03` |
| 04 | Safe Browsing & Device Hygiene | 4 | 11 | 2 | 3 | 8 | None in module JSON; catalog links `tool-03` |
| 05 | Data Handling & Privacy at Work | 4 | 11 | 2 | 4 | 8 | None |
| 06 | Mobile & Remote Work Security | 4 | 11 | 2 | 4 | 8 | None |
| 07 | Security Incident Recognition & Reporting | 4 | 11 | 2 | 3 | 8 | None |
| 08 | Email & Business Communication Security | 4 | 12 | 2 | 4 | 8 | None |
| 09 | Women's Digital Safety & Online Privacy | 23 | 8 | 0 | 0 | 8 | None |
| 10 | Industrial & Workplace Cybersecurity | 32 | 22 | 21 | 1 | 10 | None |

Notes:

- Module JSON files use `sections`; the catalog in `data/project.json` separately supplies `topics`.
- Module 10's original five grouped exercises were structurally converted into 21 supported `simulation` exercises. Original nested records remain under each converted exercise's `conversionSource` field.
- Module 10's original `description`/`steps` scenario was converted to the existing `content`/`choices`/`correctAnswer` scenario shape; the original scenario remains under `conversionSource`.

## 2. Core Platform Tools

The single authoritative tool registry is `TOOL_DEFINITIONS` in `src/tools/tool-hub.js`. The Tools index page, the per-tool tab navigation, and every rendered tool view derive from this registry; no other file hardcodes a tool list. `data/project.json` declares the same eight tools with matching IDs and names as catalog metadata, and `validate_config.js` cross-checks that the two stay in sync.

| ID | Name | Description |
|---|---|---|
| `tool-01` | Password Strength Evaluator | Evaluates a password locally for length, character variety, predictable patterns, common words, estimated entropy, weaknesses, and improvement suggestions. |
| `tool-02` | Phishing Email Inspector | Inspects sender, subject, message text, and links for urgency, sensitive requests, threats, generic wording, sender mismatch, and other phishing indicators. |
| `tool-03` | Safe URL & Link Validator | Parses a URL and checks HTTPS, raw IP use, subdomain depth, sensitive path keywords, look-alike characters, and typo-squatting patterns. |
| `tool-04` | Cybersecurity Quick Check | Assesses a described incident (category, impact, affected users) and returns a severity level, a pass/fail checklist of the escalation conditions, and an incident report draft. `analyze()`, `form()`, and `resultPanel()` in `tool-hub.js` each have an explicit `tool-04` branch. |
| `tool-05` | Incident Report Assistant | Collects incident type and context, generates a client-side report draft, and provides copy/download actions without submitting the report. |
| `tool-06` | QR Code Safety Checker | Decodes an uploaded QR image or camera stream in the browser and passes decoded HTTP(S) URLs through URL analysis. |
| `tool-07` | Security Log Analyzer | Parses timestamped log text, applies fixed rules for brute force, takeover, MFA changes, off-hours activity, new devices, and bulk exports, then returns findings and overall risk. |
| `tool-08` | Device Security Checklist | Scores nine manually checked device-security controls and returns unchecked items and static security tips; it does not scan the device. |

The tool catalog in `data/project.json` and the runtime registry in `src/tools/tool-hub.js` declare the same eight tools with matching IDs and names; `validate_config.js` fails the build check if they ever diverge.

## 3. Features

The following 14 platform-level feature categories are present in the implementation.

| Feature | Status | Evidence and known issues |
|---|---|---|
| Static application bootstrap and query-string routing | Fully implemented in source | `module-engine.js` loads `project.json`, routes dashboard/modules/tools/assessments, handles browser history, and has an error view. External CDN dependencies are required by `index.html`. |
| Dashboard | Fully implemented in source | Renders overall progress, awareness score, completed modules, tool usage, assessment results, current module, performance, strengths, weak areas, activity, recommendations, and module cards. |
| Module catalog and navigation | Fully implemented in source | Reads the catalog and renders all ten modules; numeric and ID module routes are supported. |
| Step-based module renderer | Fully implemented in source | Supports intro, sections, exercises, scenarios, quizzes, reflections, and completion. Module 10 was converted to the renderer's supported `simulation` and choice-based scenario schemas (originals preserved under `conversionSource`). |
| Interactive exercise engine | Fully implemented in source | Supports the choice (`scenario-analysis`, `simulation`, `analysis`, `categorization`), sorting/mapping review, tool-interaction portal, and report-field paths. Unknown exercise types render an explicit unsupported-type fallback; all exercise types present in the current data are supported. |
| Scenario engine | Fully implemented in source | Choice-based scenarios provide attempts, feedback, hints, retry, summary, and scoring. All 30 current scenarios, including Module 10's, use the supported choice-based schema with `correctAnswer`. |
| Quiz engine | Fully implemented in source | Supports one-question-at-a-time navigation, answer selection, submission, scoring, explanations, retry, and completion gating. All 79 current quiz IDs are unique. |
| Reflection and module completion | Fully implemented in source | Reflection states are selectable; completion is gated on all generated checkpoints and displays score/takeaways/next module. Free-text reflection is intentionally not saved. |
| Progress, state, activity, and tool-usage persistence | Fully implemented in source | Stored under `localStorage` key `milchar_sec_v2_storage`; module progress, answers, scores, activity, assessments, and tool usage are serialized locally. |
| Module scoring and awareness score | Fully implemented in source | Quiz score and a 70/30 quiz/scenario module score are implemented; all current scenarios, including Module 10's, declare `correctAnswer` and are graded through the normal path. The awareness score is the mean of submitted quiz scores. |
| Dashboard analytics / risk profile | Partially implemented | Analytics identifies resume target, strongest score, scores below 70%, quiz average, scenario average, and tool count. No separate user risk-profile model or risk-profile UI is implemented. |
| Recommendation engine | Partially implemented | Uses the lowest-scoring module or next incomplete module and seven catalog relationships. Recommendations fall back to continuing the target module when no relationship exists. |
| Pre/post assessment | Fully implemented in source | Builds a deterministic 12-question pool, stores `pre`/`post` results, unlocks the current assessment after all modules are complete, and displays improvement. |
| Access gate, authentication, help/support panel | Not implemented | No login, registration, authorization/access gate, help panel, support workflow, user account, backend, or administrator UI was found in the current codebase. |

Feature count for the totals below is 14: the feature categories listed in this table, including partially implemented and explicitly absent requested feature areas.

## 4. Architecture Summary

### Module structure and rendering

Each module is a standalone JSON document with `moduleMetadata`, learning objectives, `sections`, `interactiveExercises`, `scenarios`, `tools`, `quiz`, `keyTakeaways`, and `reflectApply` fields. `modules/module-engine.js` fetches the selected JSON file, stores a per-module state object, renders the current view as HTML, and binds event handlers after each render.

Section rendering supports content, bullet/list fields, tables, frameworks, evidence checklists, callouts, and subsections. Exercises and scenarios are rendered according to hard-coded type/schema branches.

### Progress and persistence

Progress is checkpoint-based. Checkpoints include sections, exercises, scenarios, submitted quiz, and reflections. State is persisted to browser `localStorage` under `milchar_sec_v2_storage`. Stored data includes current module, per-module answers and completion flags, quiz/scenario scores, assessment results, tool usage, global awareness score, and up to 25 activity records.

### Technology stack

- HTML5 static shell
- Vanilla JavaScript ES modules
- JSON content/configuration files
- CSS in `css/style.css`, `css/dashboard.css`, and `css/tools.css`
- Tailwind CSS CDN
- Animate.css CDN
- Lucide icon CDN
- jsQR CDN for QR decoding
- Browser `localStorage`, History API, Clipboard API, Blob downloads, and camera media APIs
- PWA manifest in `manifest.json`

There is no package manifest, build configuration, backend service, database, API, authentication implementation, or automated test suite in the current tree.

## 5. Totals

All totals below are direct counts from the current source/data files.

| Item | Exact count |
|---|---:|
| Total modules | 10 |
| Total quiz questions across all modules | 79 |
| Total scenarios | 30 |
| Total interactive exercise entries in module JSON | 36 |
| Total original interactive exercise units (curriculum) | 20 |
| Total runtime tools in `src/tools/tool-hub.js` / Tools navigation | 8 |
| Total platform-level feature categories inventoried | 14 |

The 36 exercise entries derive from the 20 original curriculum exercise units: Modules 1–8 contain 15 exercises, Module 9 contains none, and Module 10's five original grouped exercises were converted into 21 single-answer `simulation` entries.

## Explicit inconsistencies and known issues

- `data/project.json` has `study_time_minutes: null` for Modules 1–8 even though their module JSON metadata contains study times (30–40 minutes), so module cards render "— min" for those modules.
- Module 9's catalog study time (45 minutes) disagrees with its module JSON metadata (75 minutes). Module 10 agrees in both places (90 minutes).
- `manifest.json` currently has no icon declarations; icon assets can be added when finalized branding artwork is available.
- Module 10's original grouped exercise format included multi-answer scenarios; the conversion preserves the original accepted-option IDs in `conversionSource` and uses the first accepted option for the existing single-answer renderer.
- The project is client-only. Requirements mention backend, database, authentication, and administrator capabilities, but no implementations for those capabilities exist. `src/auth/`, `src/components/common/`, `scripts/`, and `supabase/functions/notify-access-request/` are empty placeholder directories.
- Project documentation was updated on 2026-08-30 to reflect the ten-module, eight-tool state and per-feature implementation status (see `docs/PROJECT_REQUIREMENTS.md`).
