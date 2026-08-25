# MilcharSec — Project Requirements

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
1. **User Registration/Login:** Secure access to the personal user space.
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
The platform includes 8 foundational learning modules:
1. **Module 1 — Cybersecurity Fundamentals:** Introduces the basic purpose of cybersecurity, why it matters, the CIA Triad (Confidentiality, Integrity, Availability), the threat landscape (cybercriminals, insiders, nation-states, opportunistic attackers), malware basics, social engineering basics, and the crucial human role in security.
2. **Module 2 — Password & Account Security:** Focuses on protecting user accounts. Covers strong vs. weak passwords, length and uniqueness, common mistakes, password managers, Multi-Factor Authentication (MFA), account takeover, credential theft, fake login pages, password reset scams, and protecting high-priority email accounts.
3. **Module 3 — Phishing & Social Engineering:** Teaches how attackers manipulate people using urgency and fear tactics, authority impersonation, smishing (SMS), vishing (voice), pretexting, baiting, fake login pages, suspicious links, and unexpected attachments. Outlines the STOP verification method.
4. **Module 4 — Safe Browsing & Device Hygiene:** Focuses on secure internet and device usage. Topics include safe browsing practices, understanding HTTPS limitations, checking domains, spotting look-alike websites, avoiding suspicious URL structures, IP-address-based URLs, misleading subdomains, managing browser security/notifications, pop-ups, avoiding unsafe downloads, applying software/OS updates, and basic device protection.
5. **Module 5 — Data Handling & Privacy at Work:** Focuses on protecting personal and organizational data. Covers sensitive information types, personal data (PII), confidential business information, data classification (Public, Internal, Confidential, Highly Confidential/Restricted), email data-sharing mistakes, accidental disclosure vs. data leakage, cloud storage sharing settings, the principle of Least Privilege, data minimization, and screen lock awareness.
6. **Module 6 — Mobile & Remote Work Security:** Focuses on security outside the office. Covers mobile device risks, screen locking, application permissions, software updates on mobile/laptops, public Wi-Fi risks (fake networks), safer remote working practices, secure remote access (VPN/MFA), physical laptop security, shoulder surfing, and lost/stolen device reporting (BYOD policies).
7. **Module 7 — Security Incident Recognition & Reporting:** Teaches users how to recognize possible security incidents (unusual login alerts, lost devices, sudden password changes, malware warnings, suspicious files, accidental exposure) and follow a simple 5-step response process: Recognize $\rightarrow$ Stop $\rightarrow$ Preserve Information $\rightarrow$ Report $\rightarrow$ Follow Instructions.
8. **Module 8 — Email & Business Communication Security:** Focuses on professional communication. Topics include business email security, identifying suspicious attachments/links/fake invoices, executive impersonation, Business Email Compromise (BEC) concepts, sender address and domain verification, safe use of CC and BCC, and misaddressed emails.

## Complete Tool List
The platform includes 4 primary integrated interactive tools:
1. **Tool 1 — Password Strength Checker:** Evaluates entered passwords on length, repeated characters, common patterns, and predictability. Provides a strength rating (Weak, Moderate, Strong, Very Strong), highlights specific weaknesses, offers improvement recommendations, and provides educational explanations. *Rule: Passwords must be analyzed securely (ideally locally) and must not be permanently stored. Users are instructed to test only fictional passwords.*
2. **Tool 2 — Phishing and Message Checker:** Allows users to paste a suspicious message or email. The tool analyzes indicators (urgent language, requests for sensitive info, suspicious wording, impersonation, suspicious links, social engineering techniques), explains why specific elements are suspicious, and provides an educational risk level (Low, Medium, High Risk) with recommended actions.
3. **Tool 3 — URL Safety Checker:** Users enter a URL for educational analysis. The tool inspects characteristics such as HTTPS usage, URL structure, IP-address-based URLs, excessive or misleading subdomains, suspicious keywords, and look-alike domain patterns. Returns a risk level (Low, Medium, High Risk) and educational explanations of the flags found.
4. **Tool 4 — Cybersecurity Quick Check:** A platform-wide cybersecurity awareness assessment tool. Users answer habit-based questions across multiple categories (Password reuse, MFA usage, Software updates, Suspicious links, Data sharing, Public Wi-Fi awareness, Backups, Device security, Privacy awareness). It evaluates their overall security hygiene, generates an overall Cybersecurity Awareness Score (0–100), identifies specific weak areas, and recommends corresponding learning modules.

*Secondary/Optional Tool:*
* **Email Security Checker (Tool 5):** Detailed in Module 8, this tool allows users to enter a sender address, subject line, email body, link information, and attachment name. It analyzes sender details (unusual domain, look-alike domain, sender mismatch), message content (urgent language, unexpected requests, pressure tactics, sensitive requests), financial requests (payments, bank detail changes, invoice anomalies), links, and attachments to determine an educational risk level (Low, Medium, High Risk) and explain business email threats.

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
* Which of the 8 modules are started, in progress, or completed.
* Historical scores for each quiz attempt.
* Completed practical scenarios and associated performance data.
* Usage of the integrated interactive tools.
* Date and time of recent learning activity.

## Awareness Score
The **Cybersecurity Awareness Score** is a dynamic, platform-wide metric rated on a scale of **0 to 100** (e.g., 74/100). It is calculated based on:
1. The user's initial or periodic attempts on the *Cybersecurity Quick Check* assessment.
2. The user's ongoing performance on individual module quizzes and practical scenario-based questions.
3. Successful completion of learning activities.
This score provides a tangible, measurable representation of the user's practical security posture and decision-making capabilities.

## Weak-Area Identification
The system analyzes performance data across the different scoring categories to automatically identify the user's lowest-performing security areas. 
* **Mechanism:** If a user's quiz or scenario scores in a specific category (e.g., *Phishing Awareness* or *Incident Recognition*) fall below a established threshold or are significantly lower than their other category scores, the platform flags this category as a "Weak Area" or "Area for Improvement."

## Recommendation System
The personalized recommendation system creates a custom learning path based on the user's assessed performance:
* **Logic:** When the system flags a "Weak Area," it automatically triggers a targeted recommendation pointing the user directly to the module, tool, or scenario designed to address that vulnerability.
* **Example:** If a user's Phishing Awareness score is below other scores, the system displays:
  > *"Your score in Phishing & Social Engineering is below your other module scores. It is recommended that you review phishing indicators and complete the practical phishing scenario."*

## Dashboard Requirements
The learner's central dashboard must be a clear, visually appealing interface displaying the following key elements:
* **Overall Progress Percentage:** (e.g., "Overall Progress: 62%")
* **Overall Cybersecurity Awareness Score:** (e.g., "74/100")
* **Modules Completed/Status:** (e.g., "Modules Completed: 5/8")
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

## MVP Scope
To ensure a rapid, high-quality deployment, the initial MVP is strictly focused on:
* **8 Core Modules:** The complete Digital Security Basics curriculum.
* **4 Core Interactive Tools:** Password Strength Checker, Phishing & Message Checker, URL Safety Checker, and Cybersecurity Quick Check.
* **Assessment & Scenario Features:** Basic module quizzes, simulated scenarios (Email, Passwords, Website, Incident), module scoring, and dynamic awareness scoring.
* **Learner Dashboard:** Basic progress tracking, module completion tracking, quiz results display, overall awareness score, weak-area identification, and recommendation display.
* **Simplified Admin:** Basic monitoring capabilities, with complex content management deferred to future releases.

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

## Security Requirements
As a security training platform, MilcharSec must adhere to rigorous security standards:
1. **Password Safety:** The *Password Strength Checker* tool must **NEVER** permanently store user-entered passwords. Passwords must be analyzed securely in-memory or locally in the client browser, and immediately discarded.
2. **Fictional Testing Data:** The platform must explicitly instruct and require users to test only fictional passwords and sanitized messaging data, never entering their real credentials or sensitive organization documents.
3. **Data Protection:** All user data, progress tracking, and quiz scores must be stored securely, utilizing industry-standard encryption for data-at-rest and TLS/HTTPS for data-in-transit.
4. **Least Privilege:** Secure role separation between standard Learners and Administrators.

## Important Constraints
* **No Frontend Code/HTML in this Phase:** The current phase is strictly limited to research, architecture, and documentation. No frontend layouts or HTML mockups are to be generated.
* **Curriculum Preservation:** All curriculum content, scenarios, questions, and takeaways from the authoritative PDFs must be fully captured and indexable. Generic cybersecurity information must not replace the specified syllabus.
* **No Speculative Additions:** If technical rules or content are not specified in the source PDFs, they must be explicitly noted as ambiguities or open implementation details rather than filled with speculative guesses.
