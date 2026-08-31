# Frontend Architecture Design — MilcharSec Learning Engine

This document describes the **as-built** architecture of the MilcharSec frontend (verified against the source tree on 2026-08-30). The original design sketch proposed a React/TypeScript component tree with Zustand state management; that stack was not used. The shipped implementation is a dependency-free static application built with HTML5, vanilla JavaScript ES modules, plain CSS, and local JSON data. Sections below describe what actually exists, and call out the original design direction where it diverged.

---

## 1. Directory Structure

The project separates the generic engine from the data it renders:

```text
index.html                  # Static app shell: header nav, loader, view containers, toast host
modules/
└── module-engine.js        # The ModuleEngine class: routing, dashboard, module player,
                            #   assessment flow, scoring, persistence, recommendations
src/
├── auth/                   # Empty placeholder (future access-gate work)
├── components/common/      # Empty placeholder
└── tools/
    ├── tool-hub.js         # Authoritative TOOL_DEFINITIONS registry (8 tools), form/result
    │                       #   dispatchers, shared checklist helpers, QR analysis
    ├── password-evaluator.js
    ├── phishing-inspector.js
    ├── url-validator.js
    ├── incident-reporter.js
    ├── log-analyzer.js
    └── device-checklist.js
css/
├── style.css               # Module player and shared styles
├── dashboard.css           # Dashboard, modules grid, assessment styles
└── tools.css               # Tool hub, tool forms, result panels, checklists
data/
├── project.json            # Platform catalog: 10 modules, 8 tools, assessment/recommendation config
└── module-01..10.json      # One standalone curriculum document per module
docs/                       # Requirements, architecture, curriculum index/audit documents
validate_config.js          # Node script enforcing catalog/registry consistency
manifest.json               # PWA manifest (icons referenced but not yet committed)
```

There is no package manifest, build step, or test suite. Tailwind CSS, Animate.css, Lucide icons, and jsQR are loaded from CDNs by `index.html`.

---

## 2. Data Flow (JSON → Engine → UI)

The system treats module data as "configuration" that drives the UI.

1. **Bootstrap**: `index.html` loads `modules/module-engine.js` as an ES module; the engine fetches `data/project.json` (and `data/module-07.json` for incident-report guidance used by tool-05).
2. **Routing**: Query-string routes — `?modules`, `?tools`, `?tool=<id>`, `?module=<id|number>`, `?assessment` — drive view switching, with History API integration for back/forward.
3. **Fetch**: Opening a module fetches the corresponding JSON (e.g., `data/module-10.json`) and hydrates a per-module state object from saved progress.
4. **Parsing**: The engine derives a checkpoint list (sections, exercises, scenarios, quiz, reflections) and a step path for the sidebar.
5. **Rendering**: Views are rendered as HTML strings into `#module-container`, `#assessment-view`, or `#dashboard-view`; event handlers are rebound after each render; `lucide.createIcons()` initializes icons.
6. **Interaction**: User progress and answers update engine state and persist to localStorage on every checkpoint change.

---

## 3. Module Rendering Architecture (Step-Based)

The engine decomposes each module into a linear step path:

1. **Introduction**: `moduleMetadata` + `learningObjectives`.
2. **Learning**: `sections` (supports content blocks, bullet lists, tables, frameworks, evidence checklists, callouts, and subsections).
3. **Practice**: `interactiveExercises` (choice/simulation/analysis/categorization questions, sorting/mapping review lists, tool-interaction portals, and report-field builders).
4. **Application**: `scenarios` (choice-based, one at a time, with attempts, feedback, hints, retry, and a summary view).
5. **Assessment**: `quiz` (one question at a time, explanations, retry, submission gating).
6. **Consolidation**: `keyTakeaways` + `reflectApply` (selectable reflection states), then module completion.

Unknown exercise types render an explicit "not yet supported" fallback rather than failing silently.

---

## 4. State Model

The engine maintains a localized state object for the active module attempt (JavaScript, not TypeScript):

```javascript
{
  id,                       // module id
  currentSection,           // current section index
  view,                     // current step view (intro/sections/exercises/scenarios/quiz/reflection/done)
  completed: {},            // checkpoint status, keyed by checkpoint id
  exerciseAnswers: {},      // exercise id -> selected answer / completed marker
  scenarioAnswers: {},      // scenario id -> selected choice
  scenarioAttempts: {},     // scenario id -> attempt count
  scenarioHints: {},        // scenario id -> hint shown
  scenarioIndex,            // current scenario index
  scenarioSummary,          // summary screen reached
  quizAnswers: {},          // question id -> selected option
  quizSubmitted, quizIndex, // quiz state
  reflectionStates: {},     // reflection index -> selected state
  moduleCompleted,          // module finished
  moduleScore               // final score
}
```

---

## 5. Progress Model (Completion Formula)

Completion is calculated from "logical checkpoints" rather than page views.

**Formula**:
$$Progress\% = \left( \frac{\text{Completed Checkpoints}}{\text{All Applicable Checkpoints}} \right) \times 100$$

**Definitions**:
-   **All Applicable Checkpoints ($N$):** One for every section, every interactive exercise, every scenario, the quiz when present, and every reflection prompt. Empty JSON collections add no checkpoint.
-   **Completed checkpoint:** A section is opened; an exercise is answered or explicitly completed; a scenario is answered or reviewed; every quiz answer is submitted; a reflection prompt has one of its declared UI states selected.
-   **Module completion:** The learner explicitly completes the module after progress reaches 100%. The final module score is `(quiz score × 0.7) + (scenario score × 0.3)`.

---

## 6. Scoring Model

*Individual Module Score:* `(Quiz Score × 0.7) + (Scenario Score × 0.3)`.

The dashboard awareness score is the arithmetic mean of submitted module quiz scores. The curriculum does not provide a Quick Check result or category benchmarks for every module attempt, so the engine does not fabricate a weighted calculation.

Scenario scoring grades only scenarios that declare `correctAnswer`; all 30 current scenarios declare it. A module whose scenarios lack the field would fall back to completion-based scoring, but no current module is in that state.

---

## 7. Quiz & Scenario Models

### Quiz Engine
-   **Input**: `quiz` array from JSON.
-   **Logic**: One question at a time, immediate per-question feedback with explanations, navigation between questions.
-   **Validation**: All questions must be answered before submission; submission gates completion.

### Scenario Engine
-   **Input**: `scenarios` array (choice-based schema: `content`, `choices`, `correctAnswer`, feedback, hints).
-   **Logic**: Presents one situation at a time; the user chooses an action; attempts and hints are tracked.
-   **Feedback**: Explains the impact of the choice; retry is offered; a summary screen scores the scenario set.

---

## 8. Tool Integration Model

The 8 core tools are defined once in `TOOL_DEFINITIONS` (`src/tools/tool-hub.js`) and are rendered standalone from the Tools navigation (`?tools`, `?tool=<id>`).

-   **Registry**: `TOOL_DEFINITIONS` is the single authoritative tool list; the Tools page, tool tabs, and the project catalog (`data/project.json`) all render from it or are validated against it by `validate_config.js`.
-   **Deep Linking**: Module JSON exercises can reference a tool by `toolId`.
-   **Portal Rendering**: An `interactiveExercise` of type `tool-interaction` renders the full tool inline inside the module player (portal slot) with a "Mark tool activity complete" control.
-   **Shared Analysis**: The QR Code Safety Checker decodes images/camera input with jsQR and reuses the URL analysis engine; the Cybersecurity Quick Check reuses the Incident Report Assistant's draft generator.

All tool analysis runs client-side; tool inputs are never persisted or transmitted.

---

## 9. localStorage Strategy

To support offline-first/MVP persistence, all data is stored under a namespace:

**Key**: `milchar_sec_v2_storage`

**Shape**:
```json
{
  "version": 2,
  "currentModule": "module-02",
  "progress": {
    "module-01": { "status": "completed", "percent": 100, "moduleScore": 90 },
    "module-02": { "status": "in-progress", "currentSection": 3 }
  },
  "scores": {
    "quizzes": { "module-01": [80, 90] },
    "scenarios": { "module-01": [100] }
  },
  "toolUsage": { "tool-01": 3 },
  "activity": [],
  "global": { "awarenessScore": 74 },
  "assessments": { "pre": null, "post": null }
}
```

The engine persists current module and section, checkpoint completion, non-sensitive exercise/scenario/quiz selections, quiz state and score, reflection states, module completion, tool usage counts, up to 25 recent activity records, and pre/post assessment results. It never persists tool input or free-text reporting practice, so real passwords and credentials are not retained even if entered by mistake.

---

## 10. Backend Integration Strategy (Future Scope)

No backend exists today. The original design proposed a Repository Pattern (`ApiService` over `LocalStorageProvider`, later swapped to a `RestApiProvider`); the shipped engine instead reads/writes `localStorage` directly in its `store()`/`save()` methods.

-   **Current**: static hosting only (the site is served as-is from the repository root).
-   **Future**: introduce the planned FastAPI/Node.js backend and database, then migrate persistence and add authentication. Because all state flows through the engine's store/save layer, that migration is a contained change.
-   **Placeholders**: `src/auth/` exists as an empty directory reserved for future authentication work.

---

## 11. Rendering & Styling Conventions

-   **Views as HTML strings**: The engine builds views with template literals and rebinds handlers after each render; `this.esc()` escapes all user/content strings before insertion.
-   **Shared UI vocabulary**: Reusable styling is provided by CSS classes (`primary-btn`, `secondary-btn`, `activity-card`, `tool-result-panel`, `risk-badge`, `module-card`, etc.) rather than framework components.
-   **Icons**: Lucide icons via `<i data-lucide="...">` elements, initialized after each render.
-   **Feedback**: A shared toast system (`#toast-container`) reports successes and errors.

---

## 12. Scalability: Adding Modules 9 and 10

This section originally described "Adding Module 9" as a future step. Modules 9 (Women's Digital Safety & Online Privacy) and 10 (Industrial & Workplace Cybersecurity) have since been added — the process matched the prediction:

1.  Added `data/module-09.json` / `data/module-10.json` following the module schema.
2.  Added the module entries to the `modules` array in `data/project.json`.
3.  **Engine behavior**: The engine picked both modules up automatically — dashboard cards, routing, rendering, progress tracking, and scoring all worked with no engine code changes.

Module 10 additionally required its original grouped-exercise format and original scenario format to be converted to the engine's supported schemas (`simulation` exercises and choice-based scenarios); the originals are preserved under each converted item's `conversionSource` field. `validate_config.js` was updated to expect 10 modules and 8 tools and to enforce that the project catalog and the `TOOL_DEFINITIONS` registry stay in sync, so future module/tool additions that skip step 2 will fail validation.
