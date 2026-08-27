# Frontend Architecture Design — MilcharSec Learning Engine

This document defines the architectural standards, data flow, and state models for the MilcharSec frontend, specifically focusing on the reusable **Module Learning Engine**.

---

## 1. Directory Structure

The project follows a component-based modular structure to ensure clear separation between the generic "Engine" and the specific "Data".

```text
src/
├── api/                # Data fetching and future backend abstraction
├── components/         # Shared UI components (Button, Card, Progress, etc.)
│   └── common/
├── engine/             # The Reusable Module-Learning Engine
│   ├── components/     # Internal engine sub-components
│   │   ├── StepRenderer.tsx
│   │   ├── ContentSection.tsx
│   │   ├── InteractivePortal.tsx
│   │   ├── ScenarioWrapper.tsx
│   │   └── QuizEngine.tsx
│   ├── hooks/          # Engine-specific logic (useModuleState, useScoring)
│   ├── types/          # Shared interfaces for Module JSON
│   └── ModuleEngine.tsx # Main entry point
├── services/           # Business logic (Scoring, Progress, Storage)
├── state/              # Global state management (Zustand or Redux)
├── tools/              # The 4 core platform tools (isolated components)
└── views/              # Page-level components (Dashboard, ModuleView)
```

---

## 2. Data Flow (JSON → Engine → UI)

The system treats module data as a "configuration" that drives the UI.

1.  **Selection**: The user selects a module on the Dashboard.
2.  **Fetch**: The `ModuleView` fetches the corresponding JSON (e.g., `data/module-01.json`).
3.  **Initialization**: The `ModuleEngine` receives the JSON as a prop and initializes the `useModuleState` hook.
4.  **Parsing**: The engine maps the JSON structure into a sequence of "Steps".
5.  **Rendering**: The `StepRenderer` identifies the current step type (Section, Quiz, Scenario, etc.) and renders the appropriate child component.
6.  **Interaction**: User progress and answers are captured and pushed to the **State Model**.

---

## 3. Module Rendering Architecture (Step-Based)

The engine decomposes the JSON into a linear array of steps to simplify navigation:

1.  **Introduction**: `moduleMetadata` + `learningObjectives`.
2.  **Learning**: `sections` (mapped 1:1 to steps or grouped).
3.  **Practice**: `interactiveExercises`.
4.  **Application**: `scenarios`.
5.  **Assessment**: `quiz`.
6.  **Consolidation**: `keyTakeaways` + `reflectApply`.

---

## 4. State Model

The engine maintains a localized state for the active module attempt:

```typescript
interface ModuleAttemptState {
  moduleId: string;
  currentSection: number;
  completed: Record<string, boolean>; // Checkpoint status, keyed by content ID
  exerciseAnswers: Record<string, string | "completed">;
  quizAnswers: Record<string, any>;
  scenarioAnswers: Record<string, any>;
  reflectionStates: Record<string, "I Will Check This" | "Completed" | "Review Later">;
  quizSubmitted: boolean;
  isCompleted: boolean;
  score: number;
}
```

---

## 5. Progress Model (Completion Formula)

Completion is calculated based on "logical checkpoints" rather than just page views to ensure users interact with all content.

**Formula**:
$$Progress\% = \left( \frac{\text{Completed Checkpoints}}{\text{All Applicable Checkpoints}} \right) \times 100$$

**Definitions**:
-   **All Applicable Checkpoints ($N$):** One for every section, every interactive exercise, every scenario, the quiz when present, and every reflection prompt. Empty JSON collections add no checkpoint.
-   **Completed checkpoint:** A section is opened; an exercise is answered or explicitly completed; a scenario is answered or reviewed; every quiz answer is submitted; a reflection prompt has one of its declared UI states selected.
-   **Module completion:** The learner explicitly completes the module after progress reaches 100%. The final module score is `(quiz score × 0.7) + (scenario score × 0.3)`.

---

## 6. Scoring Model

*Individual Module Score:* `(Quiz Score × 0.7) + (Scenario Score × 0.3)`.

The dashboard awareness score is the arithmetic mean of submitted module quiz scores. The curriculum does not currently provide a Quick Check result or category benchmarks for every module attempt, so the engine does not fabricate a weighted CAS calculation.

---

## 7. Quiz & Scenario Models

### Quiz Engine
-   **Input**: `quiz` array from JSON.
-   **Logic**: One question at a time. Immediate feedback on each.
-   **Validation**: Must answer all to "complete" the step.

### Scenario Wrapper
-   **Input**: `scenarios` array.
-   **Logic**: Presents a situation (image/text). User chooses an action.
-   **Feedback**: Explains the impact of the choice (Confidentiality hit, Integrity hit, etc.).

---

## 8. Tool Integration Model

Core tools (e.g., `Tool 1 — Password Checker`) are built as standalone, reusable components.

-   **Deep Linking**: Module JSON can include a `toolId`.
-   **Portal Rendering**: When the Engine hits an `interactiveExercise` with a `toolId`, it renders the tool inside a modal or inline "Interactive Portal".
-   **Context Passing**: Tools can receive pre-filled values from the module (e.g., a "Weak Password" to analyze in the checker).

---

## 9. localStorage Strategy

To support offline-first/MVP persistence, all data is stored under a namespace:

**Key**: `milchar_sec_v2_storage`

**Shape**:
```json
{
  "user": { "name": "...", "preferences": {} },
  "progress": {
    "module-01": { "status": "completed", "percent": 100, "moduleScore": 90 },
    "module-02": { "status": "in-progress", "currentSection": 3 }
  },
  "scores": {
    "quizzes": { "module-01": [80, 90] },
    "scenarios": { "module-01": [100] }
  },
  "global": { "awarenessScore": 74 }
}
```

The shipped engine uses `milchar_sec_v2_storage` to avoid changing legacy attempts. It persists current module and section, checkpoint completion, non-sensitive exercise/scenario/quiz selections, quiz state and score, reflection states, and module completion. It never persists tool input or free-text reporting practice, so real passwords and credentials are not retained even if entered by mistake.

---

## 10. Future Backend Integration Strategy

The architecture uses a **Repository Pattern** to shield the UI from data-source changes.

-   **Current**: `ApiService` calls `LocalStorageProvider`.
-   **Future**: `ApiService` is updated to call a `RestApiProvider` (FastAPI/Node.js).
-   **Minimal Change**: Only the `Provider` implementations and `AuthService` need to change. The `ModuleEngine` and `Dashboard` remain untouched as they consume data from the same `ApiService` interfaces.

---

## 11. Reusable Component Strategy

To ensure consistency, the engine utilizes a set of "Dumb" components:

-   **ModuleLayout**: Frame with navigation, progress bar, and exit button.
-   **ContentBlock**: Renders markdown/text, images, and bullet points.
-   **DecisionButton**: Standardized buttons for scenarios and quizzes.
-   **FeedbackPanel**: Shared component for success/error/explanation messages.

---

## 12. Scalability: Adding Module 9

To add "Module 9 — Advanced Forensics":
1.  Add `data/module-09.json` following the schema.
2.  Update `data/project.json` list of modules.
3.  **Engine behavior**: The engine automatically detects the new file, adds it to the Dashboard, and handles its rendering, progress tracking, and scoring using existing logic. **No code change required.**
