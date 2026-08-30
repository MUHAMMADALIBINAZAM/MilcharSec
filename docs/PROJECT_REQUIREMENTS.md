# MilcharSec — Project Requirements

## Current Implementation Status (verified 2026-08-30)

This section states what actually exists in the codebase today, verified by reading the source and data files. It supersedes any older counts elsewhere in this document. The requirement sections below it retain the original planning text for context.

**Verified platform totals:**

| Item | Count |
|---|---:|
| Learning modules | 10 |
| Quiz questions (all modules) | 79 |
| Scenarios | 30 |
| Interactive exercises (original curriculum units) | 20 |
| Interactive exercise entries in module JSON | 36 |
| Runtime tools (catalog and code registry, in sync) | 8 |

The 36 exercise entries derive from the 20 original curriculum units: Modules 1–8 contain 15 exercises, Module 9 contains none, and Module 10's five original grouped exercises were structurally converted into 21 single-answer simulation entries.

**Feature implementation status:**

| Feature | Status | Notes |
|---|---|---|
| Pre/post assessment | Implemented | Deterministic 12-question pool drawn from all module quizzes; initial assessment available from the start; the post-learning assessment unlocks after all 10 modules are complete; improvement is displayed on the dashboard. |
| Scenario engine | Implemented | All 30 scenarios use the choice-based schema with `correctAnswer`, attempts, per-choice feedback, hints, retry, summary, and scoring. |
| Progress tracking | Implemented | Checkpoint-based completion (sections, exercises, scenarios, quiz, reflections) persisted to browser `localStorage` under `milchar_sec_v2_storage`, together with answers, scores, activity (last 25 events), and tool usage. |
| Recommendation engine | Partially implemented | Recommends the lowest-scoring module (below 70%) or the next incomplete module, using seven catalog relationships. Falls back to "continue this module" when no relationship exists. Does not yet map weak categories to specific tools or scenarios as described in the Recommendation System section. |
| Dashboard analytics | Partially implemented | Shows overall progress, awareness score, completed modules, tool usage, resume target, strongest module, weak areas (quiz scores below 70%), quiz/scenario averages, recent activity, and recommendations. No group-level analytics. |
| Risk profile | Future scope | No user risk-profile model or risk-profile UI exists. The weak-area panel on the dashboard covers part of the intent, but a dedicated risk profile is not built. |
| Access gate (login/registration) | Future scope | No authentication code exists. `src/auth/` is an empty placeholder directory. |
| Admin capabilities | Future scope | No admin UI or functions. `supabase/functions/notify-access-request/` is an empty placeholder directory. |
| Backend / database | Future scope | The platform is entirely client-side (static HTML/JS + JSON data + localStorage). The `supabase/` directory is empty scaffolding; no backend service or database is implemented. |

**Known data inconsistencies (verified):**

- `data/project.json` has `study_time_minutes: null` for Modules 1–8 even though each module's JSON metadata carries a study time (30–40 minutes), so module cards show "— min".
- Module 9's catalog study time (45 minutes) disagrees with its module JSON metadata (75 minutes); Module 10 agrees (90 minutes) in both places.
- `manifest.json` references `icon-192x192.png` and `icon-512x512.png`, which do not exist in the repository.

## Project Overview
**MilcharSec** is an interactive web-based cybersecurity learning and awareness platform designed specifically to help non-technical users understand, recognize, and respond effectively to common cybersecurity threats. 

Unlike traditional e-learning websites that rely solely on passive reading materials and standard multiple-choice quizzes, MilcharSec combines structured cybersecurity learning modules, interactive lessons, knowledge quizzes, practical cybersecurity scenarios, simple security analysis tools, user progress tracking, cybersecurity awareness scoring, and personalized learning recommendations. 

The platform is designed around a continuous learning cycle:
$$\text{Learn} \rightarrow \text{Practice} \rightarrow \text{Analyze} \rightarrow \text{Quiz} \rightarrow \text{Assess} \rightarrow \text{Track Progress} \rightarrow \text{Improve}$$

The initial version focuses on **Digital Security Basics** and **Cybersecurity Awareness** for non-technical users, establishing a scalable foundation that can expand in future versions into specialized career paths such as SOC Analysis, Web Security, Digital Forensics, and Incident Response.

## Problem Statement
Cybersecurity incidents are not caused solely by technical vulnerabilities; human behavior is a major security factor. Many employees and non-technical users commonly commit critical security mistakes, including:
* Using weak or reused passwords.
* Failing to enable multi-factor authentication (MFA).
* Clicking on suspicious links.
* Opening unsafe attachments.
* Falling victim to phishing or social engineering.
* Sharing sensitive information incorrectly.
* Using insecure public networks.
* Ignoring software updates.
* Oversharing personal or organizational information.
* Failing to recognize active cybersecurity incidents.
* Not knowing how or when to report security issues.

Traditional cybersecurity training is passive and theoretical. Users typically read information or watch presentations but receive limited, if any, opportunities to apply what they have learned. This passive training model fails to change behavior or build measurable, practical habits.

## Target Users
The initial version of MilcharSec is designed primarily for non-technical users. The target audience is divided into three primary user groups:
1. **Employees:** Corporate, organizational, or academic staff who use email, computers, mobile phones, cloud applications, and handle organizational data, but have no technical background in cybersecurity.
2. **Students:** Learners who want to understand the fundamentals of cybersecurity and safe digital behavior in their academic and personal lives.
3. **General Users:** Individuals seeking to improve their personal digital security, protect their online accounts, and learn how to recognize common online threats.

*Future Users:* Subsequent versions of the platform plan to introduce specialized role-based learning tracks for technical roles such as SOC Analysts, Security Analysts, Web Security Analysts, Digital Forensics Investigators, Incident Responders, and Cybersecurity Interns.

## Project Objectives
The main objectives of the MilcharSec platform are:
* **Improve Awareness:** Measurably increase cybersecurity awareness among non-technical users.
* **Structured Education:** Provide easily understandable, well-structured, and beginner-friendly cybersecurity education.
* **Threat Recognition:** Teach users how to proactively recognize common digital threats.
* **Practical Learning:** Provide hands-on interactive tools that support practical application of concepts.
* **Comprehensive Assessment:** Assess users' understanding and decision-making through module quizzes and scenario-based exercises.
* **Progress Tracking:** Track and visualize user learning progress, activity, and scoring over time.
* **Weak-Area Identification:** Automatically determine specific areas where a user requires improvement.
* **Personalized Recommendations:** Provide performance-based recommendations on what to study next.
* **Engaging Alternative:** Deliver an interactive, engaging alternative to passive, lecture-based compliance training.

## Core Learning Workflow
The platform orchestrates the user's journey through a structured, highly integrated core workflow:
1. **User Registration/Login:** Secure access to the personal user space. *(Future scope — not yet built; the current platform is a local, single-profile client-side application with no login.)*
2. **User Dashboard:** The central hub showing overall progress, awareness score, weak areas, and recommendations.
3. **Select or Continue Learning Module:** The user selects a module or resumes from their last saved position.
4. **Interactive Lesson Content:** The user studies cybersecurity concepts with structured, beginner-friendly material and "Quick Check" prompts.
5. **Use Related Cybersecurity Tool:** The user interacts with an integrated security checker (e.g., checking a password's strength or analyzing a suspicious URL) to see the concept in action.
6. **Complete Practical Exercise or Scenario:** The user applies knowledge to safe, simulated environments (e.g., inspecting a simulated suspicious email or website).
7. **Attempt Quiz:** A 5-to-10 question assessment focusing on practical decision-making.
8. **Receive Score and Feedback:** Immediate detailed feedback on the quiz performance, explaining why answers are correct or incorrect.
9. **Update Progress and Awareness Score:** The platform recalculates the user's progress metrics and overall Cybersecurity Awareness Score.
10. **Identify Weak Areas:** The system analyzes scores to identify specific security categories requiring reinforcement.
11. **Recommend Next Module:** The system generates a personalized recommendation for the next learning steps, creating an integrated learning loop.

## Complete Module List
The platform includes 10 learning modules. Modules 1–8 form the Digital Security Basics curriculum from "Module Content.pdf"; Modules 9 and 10 were added later from separate curriculum sources and are built and shipped:
1. **Module 1 — Cybersecurity Fundamentals:** Introduces the basic purpose of cybersecurity, why it matters, the CIA Triad (Confidentiality, Integrity, Availability), the threat landscape (cybercriminals, insiders, nation-states, opportunistic attackers), malware basics, social engineering basics, and the crucial human role in security.
2. **Module 2 — Password & Account Security:** Focuses on protecting user accounts. Covers strong vs. weak passwords, length and uniqueness, common mistakes, password managers, Multi-Factor Authentication (MFA), account takeover, credential theft, fake login pages, password reset scams, and protecting high-priority email accounts.
3. **Module 3 — Phishing & Social Engineering:** Teaches how attackers manipulate people using urgency and fear tactics, authority impersonation, smishing (SMS), vishing (voice), pretexting, baiting, fake login pages, suspicious links, and unexpected attachments. Outlines the STOP verification method.
4. **Module 4 — Safe Browsing & Device Hygiene:** Focuses on secure internet and device usage. Topics include safe browsing practices, understanding HTTPS limitations, checking domains, spotting look-alike websites, avoiding suspicious URL structures, IP-address-based URLs, misleading subdomains, managing browser security/notifications, pop-ups, avoiding unsafe downloads, applying software/OS updates, and basic device protection.
5. **Module 5 — Data Handling & Privacy at Work:** Focuses on protecting personal and organizational data. Covers sensitive information types, personal data (PII), confidential business information, data classification (Public, Internal, Confidential, Highly Confidential/Restricted), email data-sharing mistakes, accidental disclosure vs. data leakage, cloud storage sharing settings, the principle of Least Privilege, data minimization, and screen lock awareness.
6. **Module 6 — Mobile & Remote Work Security:** Focuses on security outside the office. Covers mobile device risks, screen locking, application permissions, software updates on mobile/laptops, public Wi-Fi risks (fake networks), safer remote working practices, secure remote access (VPN/MFA), physical laptop security, shoulder surfing, and lost/stolen device reporting (BYOD policies).
7. **Module 7 — Security Incident Recognition & Reporting:** Teaches users how to recognize possible security incidents (unusual login alerts, lost devices, sudden password changes, malware warnings, suspicious files, accidental exposure) and follow a simple 5-step response process: Recognize $\rightarrow$ Stop $\rightarrow$ Preserve Information $\rightarrow$ Report $\rightarrow$ Follow Instructions.
8. **Module 8 — Email & Business Communication Security:** Focuses on professional communication. Topics include business email security, identifying suspicious attachments/links/fake invoices, executive impersonation, Business Email Compromise (BEC) concepts, sender address and domain verification, safe use of CC and BCC, and misaddressed emails.
9. **Module 9 — Women's Digital Safety & Online Privacy:** Covers digital safety topics specific to women's online experiences, including privacy protection, account security, online harassment recognition and response, and safe social media practices. (23 sections, 8 quiz questions; contains no exercises or scenarios.)
10. **Module 10 — Industrial & Workplace Cybersecurity:** Cybersecurity awareness for industrial, manufacturing, engineering, and workplace personnel. Covers OT/ICS-awareness topics, physical and process safety intersections with cybersecurity, removable media, workplace reporting culture, and industrial incident response, with an educational (non-scanning, non-connecting) disclaimer. (32 sections, 21 converted simulation exercises, 1 scenario, 10 quiz questions.)

## Complete Tool List
The platform includes 8 interactive tools. The authoritative registry is `TOOL_DEFINITIONS` in `src/tools/tool-hub.js`, and `data/project.json` declares the same 8 tools with matching IDs and names (enforced by `validate_config.js`):
1. **Tool 1 — Password Strength Evaluator:** Evaluates entered passwords locally on length, character variety, repeated characters, keyboard sequences, common words, and predictability. Provides a strength rating, pass/fail reasoning checklist, and improvement recommendations. Passwords are analyzed in-memory in the browser and never stored.
2. **Tool 2 — Phishing Email Inspector:** Analyzes a pasted sender, subject, message body, and links for urgent language, sensitive requests, threats, generic wording, sender mismatch, and other phishing indicators. Returns an educational risk level (Low/Medium/High) with a pass/fail reasoning checklist.
3. **Tool 3 — Safe URL & Link Validator:** Educational analysis of a URL's HTTPS usage, raw-IP use, subdomain nesting, sensitive path keywords, look-alike characters, and typo-squatting patterns. Returns a risk level with explanations; not a guarantee of safety.
4. **Tool 4 — Cybersecurity Quick Check:** An incident severity assessment. The user describes an incident (category, potential impact, affected users, description) and the tool grades severity (Low/Medium/High/Critical) with a reasoning checklist and a locally generated report draft.
5. **Tool 5 — Incident Report Assistant:** A guided three-step builder that collects incident details (type, when, system, actions, details plus an optional timeline) and generates a client-side report draft with copy and download actions. Nothing is submitted anywhere.
6. **Tool 6 — QR Code Safety Checker:** Decodes an uploaded QR image or camera stream entirely in the browser (jsQR) and passes decoded HTTP(S) URLs through the URL analysis engine.
7. **Tool 7 — Security Log Analyzer:** Parses timestamped log text (three built-in samples: normal, compromised, ambiguous) and applies fixed detection rules for brute force, account takeover, MFA changes, off-hours activity, new devices, recovery-detail changes, and bulk exports, returning findings and an overall risk level.
8. **Tool 8 — Device Security Checklist:** A nine-item manual self-assessment of device security controls (screen lock, updates, apps, antivirus, backup, and similar). Scores the checked items and lists unchecked items with static security tips. It does not scan the device.

The original requirement's "Email Security Checker (Tool 5)" concept is covered by the Phishing Email Inspector (tool-02), which analyzes sender, subject, body, and links.

## Assessment System
Each learning module is designed with a robust, integrated assessment system configured as follows:
* **Module Structure:** Lesson Content $\rightarrow$ Interactive Activity $\rightarrow$ Mini Quiz $\rightarrow$ Scenario-Based Question $\rightarrow$ Module Score.
* **Module Quizzes:** Approximately 5 to 10 quiz questions per module to test understanding and practical decision-making rather than simple memorization.
* **Question Types:**
  * Multiple-choice questions.
  * Scenario-based questions.
  * Identifying suspicious behavior vs. safe behavior.
  * Matching threats with appropriate responses.
  * Decision-based security scenarios (e.g., selecting whether a situation is SAFE, SUSPICIOUS, or REPORT).

## Practical Scenario System
The platform provides controlled, safe, and realistic practical scenarios to transform theoretical knowledge into actionable decision-making:
* **Scenario 1 — Suspicious Email:** The user receives a simulated email and must identify the suspicious sender info, urgency tactics, suspicious links, requests for sensitive information, and select the appropriate response.
* **Scenario 2 — Password Security:** The user is presented with several password examples and must analyze and identify safer practices (such as passphrases vs. short passwords).
* **Scenario 3 — Suspicious Website:** The user analyzes a simulated website URL and layout to identify look-alike domains, mismatched branding, and other warning signs.
* **Scenario 4 — Security Incident:** The user is presented with a situation (e.g., receiving an unexpected login notification or accidentally sharing sensitive data) and must decide:
  * Whether the situation represents a security incident.
  * What immediate action should be taken.
  * Whether the incident should be reported.

*(Implementation note: implemented. The platform ships 30 choice-based scenarios distributed across the modules — every scenario follows the choice/feedback/hint/retry flow described here, and all 30 are graded via `correctAnswer`. The four scenario concepts above are covered by the module scenarios rather than existing as four standalone scenario types.)*

## Scoring System
MilcharSec tracks and evaluates user performance across all components of the platform:
* **Metrics Tracked:**
  * Module completion percentages.
  * Quiz scores.
  * Practical scenario scores.
  * Interactive tool-based activity.
  * Cybersecurity Awareness Score.
  * Overall progress.
* **Score Category Mapping:** Scoring is grouped into distinct awareness categories, including:
  * Password & Account Security (Target Benchmark: e.g., 85%)
  * Phishing Awareness (Target Benchmark: e.g., 62%)
  * Safe Browsing (Target Benchmark: e.g., 78%)
  * Data Handling & Privacy (Target Benchmark: e.g., 70%)
  * Mobile Security (Target Benchmark: e.g., 81%)
  * Incident Recognition (Target Benchmark: e.g., 55%)

## Progress Tracking
Progress tracking is maintained per user and visualized on the central dashboard. The tracking system records:
* Which of the 10 modules are started, in progress, or completed.
* Historical scores for each quiz attempt.
* Completed practical scenarios and associated performance data.
* Usage of the integrated interactive tools.
* Date and time of recent learning activity.

*(Implemented — see the status table at the top of this document. Progress is stored per browser in `localStorage`; server-side per-user tracking awaits the backend.)*

## Awareness Score
The **Cybersecurity Awareness Score** is a dynamic, platform-wide metric rated on a scale of **0 to 100** (e.g., 74/100). It is calculated based on:
1. The user's initial or periodic attempts on the *Cybersecurity Quick Check* assessment.
2. The user's ongoing performance on individual module quizzes and practical scenario-based questions.
3. Successful completion of learning activities.
This score provides a tangible, measurable representation of the user's practical security posture and decision-making capabilities.

*(Implementation note: the shipped engine computes the awareness score as the arithmetic mean of all submitted module quiz scores. The Quick Check (tool-04) is an incident severity assessor rather than a habit survey, so bullet 1 above is not part of the current calculation.)*

## Weak-Area Identification
The system analyzes performance data across the different scoring categories to automatically identify the user's lowest-performing security areas. 
* **Mechanism:** If a user's quiz or scenario scores in a specific category (e.g., *Phishing Awareness* or *Incident Recognition*) fall below a established threshold or are significantly lower than their other category scores, the platform flags this category as a "Weak Area" or "Area for Improvement."

*(Implementation note: the shipped engine identifies weak areas per module — any module whose latest quiz score is below 70% is listed under "Areas for improvement" on the dashboard. Category-level benchmarking across the example categories above is not implemented.)*

## Recommendation System
The personalized recommendation system creates a custom learning path based on the user's assessed performance:
* **Logic:** When the system flags a "Weak Area," it automatically triggers a targeted recommendation pointing the user directly to the module, tool, or scenario designed to address that vulnerability.
* **Example:** If a user's Phishing Awareness score is below other scores, the system displays:
  > *"Your score in Phishing & Social Engineering is below your other module scores. It is recommended that you review phishing indicators and complete the practical phishing scenario."*

*(Implementation note: partially implemented. The shipped engine recommends the user's lowest-scoring module below 70% (or the next incomplete module) and enriches the recommendation using seven module relationships declared in `data/project.json`; when no relationship matches, it falls back to "continue this module." Recommendations do not yet point to specific tools or scenarios.)*

## Dashboard Requirements
The learner's central dashboard must be a clear, visually appealing interface displaying the following key elements:
* **Overall Progress Percentage:** (e.g., "Overall Progress: 62%")
* **Overall Cybersecurity Awareness Score:** (e.g., "74/100")
* **Modules Completed/Status:** (e.g., "Modules Completed: 5/10")
* **Current/Resumable Module:** Direct link to continue the active module.
* **Strongest Area:** The user's highest-scoring security category.
* **Areas for Improvement / Weak Areas:** Clearly highlighted security vulnerabilities.
* **Recommended Next Module:** Personalized learning suggestion based on performance.
* **Recent Activity Feed:** Log of completed quizzes, scenarios, and tool usage.

## Administrator Requirements
For instructors, administrators, or organization managers, the system requires features to oversee and manage the e-learning ecosystem:
* **User Management:** View, add, deactivate, or manage learner accounts.
* **Content Management:** Ability to add or edit modules, and update structured lesson content.
* **Quiz & Assessment Control:** Create, edit, or delete module quiz questions and answers.
* **Scenario Management:** Manage the configurations of simulated practical scenarios.
* **Learner Progress Tracking:** View individual and group completion rates.
* **Quiz Results Analytics:** Review granular scoring reports on quiz attempts.
* **Group Vulnerability Analysis:** Identify common weak areas and collective knowledge gaps among the user base to inform organizational security policies.
* *Note:* For the initial MVP, the learner experience must receive higher priority than building an extensive administration system.

*(Status: future scope. No administrator features exist in the codebase — no user management, content management, quiz control, scenario management, or group analytics. The `supabase/functions/notify-access-request/` directory is empty placeholder scaffolding.)*

## Architecture
A secure, scalable, and modular architecture is required to decouple components and allow future expansion:
1. **Frontend Layer:** Web-based user interface responsible for rendering learning modules, the dashboard, interactive quizzes, scenarios, security tools, and managing client-side user interactions.
2. **Backend Service Layer:** Handles core system processes including authentication, user management, quiz scoring calculations, progress tracking, logging, processing tool inputs, and executing the recommendation engine.
3. **Database Layer:** A relational database storing user information, credentials, module progress, detailed quiz results, category scores, and generated recommendations.
4. **Analysis Layer (Security Engine):** A dedicated logic layer handling:
   * Password strength evaluation.
   * Phishing and message indicator parsing.
   * URL pattern and domain analysis.
   * Dynamic calculation of the Cybersecurity Awareness Score.

*(Status: layers 2 and 3 are future scope — the shipped platform is client-only. Layer 1 is implemented as a static HTML/ES-module JavaScript application, and layer 4 is implemented as client-side analysis modules in `src/tools/` — all tool analysis runs locally in the browser. See `docs/FRONTEND-ARCHITECTURE.md` for the as-built architecture.)*

## MVP Scope
The initial MVP was scoped as follows; its current build status is noted per item:
* **8 Core Modules → exceeded:** the platform now ships 10 modules (the 8 PDF-derived Digital Security Basics modules plus Women's Digital Safety & Online Privacy and Industrial & Workplace Cybersecurity).
* **4 Core Interactive Tools → exceeded:** 8 tools now ship (Password Strength Evaluator, Phishing Email Inspector, Safe URL & Link Validator, Cybersecurity Quick Check, Incident Report Assistant, QR Code Safety Checker, Security Log Analyzer, Device Security Checklist).
* **Assessment & Scenario Features:** implemented — module quizzes, 30 choice-based graded scenarios, module scoring (70/30 quiz/scenario), awareness scoring, and a pre/post platform assessment.
* **Learner Dashboard:** implemented — progress tracking, module completion tracking, quiz results display, overall awareness score, weak-area identification, and recommendation display.
* **Simplified Admin:** not built — future scope (see Administrator Requirements above).

## Future Development
Subsequent versions of MilcharSec are designed to expand beyond basic security awareness into:
* **Specialized Role-Based Tracks:**
  * **SOC Analyst Track:** Features on security log analysis, alert triage, IOC (Indicators of Compromise) identification, and incident investigation scenarios.
  * **Web Security Track:** Web security fundamentals, OWASP learning modules, security configuration analysis, and secure development education.
  * **Digital Forensics Track:** File integrity analysis, hash analysis, evidence handling, and timeline investigation.
* **AI Integration:** 
  * AI-driven explanations of complex cybersecurity concepts.
  * Dynamically generated personalized learning recommendations.
  * AI-guided walkthroughs and adaptive explanations of security scenarios.
  * AI-assisted, constructive educational feedback on user exercises.
  * *Constraint:* AI must be utilized strictly to improve explanation and learning outcomes, rather than being added as a superficial marketing feature.

## Technology Requirements
Based on the suggested tech stack, the recommended implementation environment consists of:
* **Frontend:** HTML, CSS, JavaScript, with React or Next.js for a responsive, interactive component model, styled with Vanilla CSS for layouts.
* **Backend:** Python FastAPI (highly efficient for analysis tools) or Node.js/Express.
* **Database:** PostgreSQL or a managed backend-as-a-service like Supabase for rapid MVP development.
* **Deployment:** Vercel (frontend hosting), Render or similar (backend hosting), and cloud-hosted database services. 
* *Constraint:* To meet timeline constraints, the team must avoid unnecessary infrastructure complexity.

*(As-built note: the shipped implementation is a dependency-free static frontend — HTML5, vanilla JavaScript ES modules, and plain CSS, with Tailwind CSS, Animate.css, Lucide icons, and jsQR loaded from CDNs; all data is local JSON and `localStorage`. There is no package manifest, build step, backend, or database. The React/FastAPI/PostgreSQL stack above remains the plan for the backend-enabled version.)*

## Security Requirements
As a security training platform, MilcharSec must adhere to rigorous security standards:
1. **Password Safety:** The *Password Strength Checker* tool must **NEVER** permanently store user-entered passwords. Passwords must be analyzed securely in-memory or locally in the client browser, and immediately discarded.
2. **Fictional Testing Data:** The platform must explicitly instruct and require users to test only fictional passwords and sanitized messaging data, never entering their real credentials or sensitive organization documents.
3. **Data Protection:** All user data, progress tracking, and quiz scores must be stored securely, utilizing industry-standard encryption for data-at-rest and TLS/HTTPS for data-in-transit.
4. **Least Privilege:** Secure role separation between standard Learners and Administrators.

*(Status of security requirements 1–2: implemented — all tool analysis, including the Password Strength Evaluator, runs client-side in the browser; tool inputs and free-text reflections are deliberately never persisted. Requirement 3 is future scope: there is no server-side storage yet, and the platform currently relies on the browser's own storage. Requirement 4 is future scope: no roles exist because there is no login or admin capability.)*

## Important Constraints
* **Curriculum Preservation:** All curriculum content, scenarios, questions, and takeaways from the authoritative PDFs must be fully captured and indexable. Generic cybersecurity information must not replace the specified syllabus.
* **No Speculative Additions:** If technical rules or content are not specified in the source PDFs, they must be explicitly noted as ambiguities or open implementation details rather than filled with speculative guesses.
* *(Historical note: an earlier phase constrained the project to research and documentation only, with no frontend code. That phase has concluded — the frontend described throughout this document is built and shipping.)*
