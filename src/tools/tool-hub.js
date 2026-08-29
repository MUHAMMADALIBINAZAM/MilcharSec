/* Shared, local-only tool registry. Tool views are rendered in Standalone or Portal mode. */
import { analyzePassword } from './password-evaluator.js';
import { inspectEmail } from './phishing-inspector.js';
import { validateURL } from './url-validator.js';
import { calculateSeverity, generateReportDraft } from './incident-reporter.js';
import { analyzeLog, SAMPLES as LOG_SAMPLES } from './log-analyzer.js';
import { scoreDeviceChecklist, CHECKLIST_ITEMS, DEVICE_TIPS } from './device-checklist.js';

export { LOG_SAMPLES as SAMPLES };

let module07Guidance = null;
export function setIncidentGuidance(module) { module07Guidance = module; }

export const TOOL_DEFINITIONS = {
  'tool-01': { name: 'Password Strength Evaluator', icon: 'key-round', kind: 'password', note: 'Safe for real daily use: your password is analyzed entirely in this browser and never transmitted or stored.' },
  'tool-02': { name: 'Phishing Email Inspector', icon: 'mail-warning', kind: 'phishing', note: 'Safe for real daily use: messages are analyzed entirely in this browser and never transmitted or stored.' },
  'tool-03': { name: 'Safe URL & Link Validator', icon: 'link-2', kind: 'url', note: 'Safe for real daily use: the address is checked entirely in this browser and never transmitted or stored.' },
  'tool-04': { name: 'Cybersecurity Quick Check', icon: 'clipboard-pen-line', kind: 'incident', note: 'Safe for real daily use: incident details are assessed entirely in this browser and never transmitted or stored.' },
  'tool-05': { name: 'Incident Report Assistant', icon: 'file-text', kind: 'incident-assistant', note: 'Safe for real daily use: report details stay in this browser and are never transmitted or stored. This tool never submits reports or contacts anyone.' },
  'tool-06': { name: 'QR Code Safety Checker', icon: 'qr-code', kind: 'qr', note: 'Safe for real daily use: QR images and decoded content are processed entirely in this browser and never transmitted or stored.' },
  'tool-07': { name: 'Security Log Analyzer', icon: 'scroll-text', kind: 'log', note: 'Safe for real daily use: your log text is analyzed entirely in this browser and never transmitted or stored.' },
  'tool-08': { name: 'Device Security Checklist', icon: 'clipboard-check', kind: 'device', note: 'Self-assessment checklist: your answers are processed in this browser and never transmitted or stored. This tool does not scan your device automatically.' }
};

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const icon = (name, cls = 'w-5 h-5') => `<i data-lucide="${name}" class="${cls}"></i>`;
const list = (items) => items.length ? `<ul class="tool-findings">${items.map((x) => `<li>${icon('circle-alert','w-4 h-4')}${esc(x)}</li>`).join('')}</ul>` : '<p class="tool-muted">No obvious indicators detected. Continue verifying through a trusted channel.</p>';

export function analyze(id, input) {
  if (id === 'tool-01') return analyzePassword(input.password || '');
  if (id === 'tool-02') return inspectEmail(input);
  if (id === 'tool-03') return validateURL(input.url || '');
  if (id === 'tool-05') return analyzeAssistant(input);
  if (id === 'tool-07') return analyzeLog(input.logText || LOG_SAMPLES.compromised.text);
  if (id === 'tool-08') return scoreDeviceChecklist(input.checkedItems || []);
  const assessment = calculateSeverity(input);
  return { ...assessment, draft: generateReportDraft({ ...input, severity: assessment.severity }) };
}

export function analyzeDecodedQR(decoded) {
  const value = String(decoded || '').trim();
  let url = null;
  try { const candidate = new URL(value); if (candidate.protocol === 'http:' || candidate.protocol === 'https:') url = value; } catch { /* QR content is classified below. */ }
  if (url) return { contentType:'URL', value, url, analysis:validateURL(url) };
  const contentType = /^WIFI:/i.test(value) ? 'Wi‑Fi network credentials' : /^(tel:|\+?[\d ()-]{7,}$)/i.test(value) ? 'Phone number' : /^(mailto:|[^\s@]+@[^\s@]+\.[^\s@]+$)/i.test(value) ? 'Email address' : 'Plain text';
  return { contentType, value, url:null };
}

function assistantReport(input) {
  const sections = module07Guidance?.sections || [];
  const definition = sections[0]?.content || '';
  const process = sections.find((x) => x.title === 'The Reporting Process') || {};
  const role = sections.find((x) => x.title === 'Your Role During an Incident') || {};
  const steps = process.steps || [];
  const checklist = [
    `Recognize: ${definition}`,
    `Stop: ${steps[0] || ''}`,
    `Preserve: ${steps[1] || ''}${role.bulletPoints?.find((x) => /delete evidence/i.test(x)) ? ` ${role.bulletPoints.find((x) => /delete evidence/i.test(x))}` : ''}`,
    `Report: ${steps[2] || ''}`,
    `Follow Instructions: ${steps[3] || ''}`
  ].filter((x) => x.trim().length > 12);
  const report = [`INCIDENT REPORT SUMMARY`, `Incident type: ${input.incidentType || 'Not provided'}`, `When it happened: ${input.when || 'Not provided'}`, `Affected system/device: ${input.system || 'Not provided'}`, `Actions already taken: ${input.actions || 'Not provided'}`, `Relevant details: ${input.details || 'Not provided'}`, '', 'RECOMMENDED NEXT STEPS (MODULE 7)', ...checklist.map((x) => `[ ] ${x}`), '', 'Use your organization’s designated reporting process. This tool does not submit or contact anyone.'].join('\n');
  return { report, checklist };
}

export function analyzeAssistant(input) { return assistantReport(input); }

function resultPanel(result, id) {
  if (!result) return '';
  if (id === 'tool-01') return `<div class="tool-result-panel strength-result"><h3>Strength analysis</h3><div class="tool-result-heading"><span class="risk-badge ${result.strength.toLowerCase().replace(' ','-')}">${esc(result.strength)}</span><strong>${result.entropyBits} bits estimated entropy</strong></div><p>${esc(result.timeToCrack)}</p>${list(result.weaknesses)}<h4>Improve it</h4>${list(result.recommendations)}<p class="tool-privacy">${esc(result.educationalExplanation)} Your password is evaluated locally and is never transmitted or stored.</p></div>`;
  if (id === 'tool-02') return `<div class="tool-result-panel"><div class="tool-result-heading"><span class="risk-badge ${result.riskLevel.toLowerCase().replace(' ','-')}">${esc(result.riskLevel)}</span><strong>${result.indicators.length} red flag${result.indicators.length === 1 ? '' : 's'}</strong></div>${list(result.indicators)}<h4>Why this matters</h4><p>${esc(result.explanation)}</p><h4>Recommended action</h4><p>${esc(result.recommendedAction)}</p>${result.links?.length ? `<h4>Link hover reveal</h4><ul class="tool-links">${result.links.map((l) => `<li><code>${esc(l)}</code></li>`).join('')}</ul>` : ''}</div>`;
  if (id === 'tool-03') return `<div class="tool-result-panel"><div class="tool-result-heading"><span class="risk-badge ${result.riskLevel.toLowerCase().replace(' ','-')}">${esc(result.riskLevel)}</span><strong>${esc(result.parts.hostname || 'Unrecognized host')}</strong></div><div class="domain-breaker"><span>Subdomain <b>${esc(result.parts.subdomain || '—')}</b></span><span>Domain <b>${esc(result.parts.domain || '—')}</b></span><span>TLD <b>${esc(result.parts.tld || '—')}</b></span></div>${list(result.flags)}<h4>Assessment</h4><p>${esc(result.educationalAssessment)}</p><h4>Recommended action</h4><p>${esc(result.recommendedAction)}</p></div>`;
  if (id === 'tool-05') return `<div class="tool-result-panel"><div class="tool-result-heading"><span class="risk-badge low">Report summary ready</span></div><p>Your report stays in this page session and is never transmitted or stored by this tool. Review it, then use your organization’s approved reporting channel yourself.</p><pre class="report-preview" data-report-text>${esc(result.report)}</pre><div class="report-actions"><button class="secondary-btn" data-copy-report>Copy report</button><button class="secondary-btn" data-download-report>Download .txt</button></div></div>`;
  if (id === 'tool-07') {
    const lineRows = result.entries.map((entry, i) => {
      const flagged = entry.flags.length > 0;
      const pills = entry.flags.map((f) => `<span class="log-rule-pill log-risk-${f.risk}">${esc(result.ruleLabels[f.rule] || f.rule)}</span>`).join('');
      const reasons = entry.flags.map((f) => `<p class="log-reason">${esc(f.why)}</p>`).join('');
      return `<li class="log-line ${flagged ? 'log-line-flagged' : 'log-line-clean'}"><span class="log-line-no">${i + 1}</span><code class="log-line-text">${esc(entry.line)}</code><div class="log-line-meta">${pills}${reasons}</div></li>`;
    }).join('');
    const ruleRows = Object.keys(result.ruleCounts).length
      ? `<ul class="log-rule-summary">${Object.entries(result.ruleCounts).map(([k, v]) => `<li><span class="log-rule-pill log-risk-${result.entries.some((e) => e.flags.some((f) => f.rule === k && f.risk === 'critical')) ? 'critical' : result.entries.find((e) => e.flags.some((f) => f.rule === k))?.flags.find((f) => f.rule === k)?.risk || 'medium'}">${esc(result.ruleLabels[k] || k)}</span><strong>${v} hit${v === 1 ? '' : 's'}</strong></li>`).join('')}</ul>`
      : '<p class="tool-muted">No detection rules triggered. This log looks clean.</p>';
    return `<div class="tool-result-panel"><div class="tool-result-heading"><span class="log-risk-badge log-risk-${esc(result.risk)}">${esc(result.risk)} risk</span><strong>${result.flaggedCount} of ${result.totalLines} lines flagged</strong></div><p>${esc(result.headline)}</p>${ruleRows}<h4>Line-by-line review</h4><ol class="log-lines">${lineRows}</ol><p class="tool-privacy">This log was analyzed locally and is never transmitted or stored.</p></div>`;
  }
  if (id === 'tool-08') {
    const breakdown = result.loweredBy.length
      ? `<div class="device-breakdown"><h4>Your score is lowered by</h4><ul class="device-breakdown-list">${result.loweredBy.map((x) => `<li>${icon('circle-alert','w-4 h-4')}${esc(x)}</li>`).join('')}</ul></div>`
      : `<p class="device-perfect">All checklist items are addressed — strong device security posture.</p>`;
    const tips = result.tips.map((t) => `<li>${icon('lightbulb','w-4 h-4')}${esc(t)}</li>`).join('');
    const badge = result.score >= 80 ? 'low' : result.score >= 50 ? 'medium' : 'high';
    const label = result.score >= 80 ? 'Strong' : result.score >= 50 ? 'Moderate' : 'Weak';
    return `<div class="tool-result-panel device-result"><div class="tool-result-heading"><span class="risk-badge ${badge}">${label}</span><strong>Device Security Score</strong></div><div class="device-score-display"><strong>${result.score}</strong><em>/100</em></div><p>${result.checked.length} of ${result.total} checklist items addressed.</p>${breakdown}<div class="device-tips"><h4>Security tips from Module 6</h4><ul>${tips}</ul></div><p class="tool-privacy">This result was calculated locally and is never transmitted or stored by the tool.</p></div>`;
  }
  return `<div class="tool-result-panel"><div class="tool-result-heading"><span class="risk-badge ${result.severity.toLowerCase()}">${esc(result.severity)} severity</span></div><p>Your incident details were assessed locally and are never transmitted or stored by this tool.</p><pre class="report-preview">${esc(result.draft)}</pre></div>`;
}

function form(id, instance) {
  if (id === 'tool-01') return `<label>Password<input type="password" data-tool-input="password" autocomplete="new-password" placeholder="Enter a password to evaluate"></label><button class="primary-btn" data-analyze-tool="${id}">Evaluate locally ${icon('arrow-right','w-4 h-4')}</button>`;
  if (id === 'tool-02') return `<div class="tool-grid"><label>Sender email<input data-tool-input="sender" placeholder="security@example.test"></label><label>Subject<input data-tool-input="subject" placeholder="Action required"></label></div><label>Message body<textarea data-tool-input="body" placeholder="Paste the message to inspect"></textarea></label><label>Visible links (one per line)<textarea data-tool-input="links" placeholder="https://example.test/login"></textarea></label><button class="primary-btn" data-analyze-tool="${id}">Inspect message ${icon('scan-search','w-4 h-4')}</button>`;
  if (id === 'tool-03') return `<label>Website address<input data-tool-input="url" inputmode="url" placeholder="https://example.test/account"></label><button class="primary-btn" data-analyze-tool="${id}">Validate URL ${icon('scan-search','w-4 h-4')}</button>`;
  if (id === 'tool-05') return `<p class="assistant-disclaimer">This form helps structure a report for your organization’s process. Your entries are processed in this browser and never transmitted or stored; it does not submit anything or contact anyone.</p><div class="assistant-steps"><fieldset data-assistant-step="0"><legend>1. Identify the event</legend><label>What happened?<select data-tool-input="incidentType"><option value="">Choose an incident type</option><option>Suspicious email</option><option>Lost/stolen device</option><option>Accidental data exposure</option><option>Malware warning</option><option>Suspicious login</option><option>Other</option></select></label><button type="button" class="primary-btn" data-assistant-next>Next</button></fieldset><fieldset data-assistant-step="1" hidden><legend>2. Add context</legend><label>When did it happen?<input data-tool-input="when" placeholder="Date and time, if known"></label><label>What device or system was involved?<input data-tool-input="system" placeholder="Work laptop, email account, phone…"></label><div class="assistant-actions"><button type="button" class="secondary-btn" data-assistant-back>Back</button><button type="button" class="primary-btn" data-assistant-next>Next</button></div></fieldset><fieldset data-assistant-step="2" hidden><legend>3. Record your response</legend><label>What have you already done?<textarea data-tool-input="actions" placeholder="For example: stopped interacting, saved the message"></textarea></label><label>Relevant details<textarea data-tool-input="details" placeholder="Add the facts needed for your report"></textarea></label><div class="assistant-actions"><button type="button" class="secondary-btn" data-assistant-back>Back</button><button type="button" class="primary-btn" data-analyze-tool="${id}">Generate report</button></div></fieldset></div>`;
  if (id === 'tool-07') {
    const sampleKeys = Object.keys(LOG_SAMPLES);
    const sampleButtons = sampleKeys.map((k, i) => `<button type="button" class="secondary-btn log-sample-btn ${i === 1 ? 'active' : ''}" data-log-sample="${k}">${esc(LOG_SAMPLES[k].label)}</button>`).join('');
    return `<p class="assistant-disclaimer">Paste or edit a plain-text activity log. The detection rules run only in this browser — nothing is transmitted or stored. Try the sample logs to see how different patterns are interpreted.</p><div class="log-samples"><strong>Sample logs</strong><div class="log-sample-toolbar">${sampleButtons}</div></div><label>Activity log (one event per line)<textarea data-tool-input="logText" class="log-textarea" spellcheck="false" placeholder="08:41 Login successful&#10;08:43 Login failed&#10;…">${esc(LOG_SAMPLES.compromised.text)}</textarea></label><button class="primary-btn" data-analyze-tool="${id}">Analyze log ${icon('scan-search','w-4 h-4')}</button>`;
  }
  if (id === 'tool-08') {
    const items = CHECKLIST_ITEMS.map((item) => `<label class="device-checklist-item"><input type="checkbox" data-device-item="${esc(item.id)}"><span class="device-checklist-label">${esc(item.label)}</span></label>`).join('');
    return `<p class="assistant-disclaimer">This is a self-assessment checklist. It does not scan your device or check anything automatically — you are self-reporting your current device security settings.</p><div class="device-checklist">${items}</div><div class="device-score-live" data-device-score></div><button class="primary-btn" data-analyze-tool="${id}">Calculate score ${icon('clipboard-check','w-4 h-4')}</button>`;
  }
  return `<div class="tool-grid"><label>Incident category<select data-tool-input="category"><option>Phishing or social engineering</option><option>Account compromise</option><option>Lost or stolen device</option><option>Accidental data exposure</option><option>Malware or suspicious file</option></select></label><label>Potential impact<select data-tool-input="impact"><option>Low</option><option>Medium</option><option>High</option></select></label></div><label>Affected users<input data-tool-input="affectedUsers" type="number" min="0" placeholder="0"></label><label>What happened?<textarea data-tool-input="description" placeholder="Describe the incident"></textarea></label><div class="timeline-builder"><strong>Build a timeline</strong><div class="tool-grid"><input data-timeline-time placeholder="Time or date"><input data-timeline-event placeholder="What happened?"></div><button type="button" class="secondary-btn" data-add-timeline>Add timeline event</button><ol data-timeline-list></ol></div><button class="primary-btn" data-analyze-tool="${id}">Generate incident report ${icon('file-check-2','w-4 h-4')}</button>`;
}

export function renderTool(id, { mode = 'standalone', instance = 'standalone' } = {}) {
  const def = TOOL_DEFINITIONS[id];
  if (!def) return `<p>Tool unavailable.</p>`;
  if (id === 'tool-06') return `<section class="tool-view ${mode === 'portal' ? 'tool-portal' : ''}" data-tool-view="${id}" data-tool-instance="${instance}"><div class="tool-view-heading"><div class="tool-icon">${icon(def.icon)}</div><div><p class="eyebrow">${mode === 'portal' ? 'Interactive Portal' : 'MilcharSec tool'}</p><h1>${esc(def.name)}</h1></div></div><p class="tool-lead">${esc(def.note)} <strong>Powered by the same engine as URL Safety Checker.</strong></p><div class="qr-actions"><label class="qr-upload">Upload QR image<input type="file" accept="image/*" data-qr-file></label><button type="button" class="secondary-btn" data-qr-camera>Use device camera</button><button type="button" class="secondary-btn" data-qr-stop hidden>Stop camera</button></div><video data-qr-video autoplay playsinline muted hidden></video><canvas data-qr-canvas hidden></canvas><p class="tool-muted" data-qr-status>Choose an image or start a camera scan. Images are decoded only in this browser.</p><div class="qr-result" data-qr-result></div></section>`;
  return `<section class="tool-view ${mode === 'portal' ? 'tool-portal' : ''}" data-tool-view="${id}" data-tool-instance="${instance}"><div class="tool-view-heading"><div class="tool-icon">${icon(def.icon)}</div><div><p class="eyebrow">${mode === 'portal' ? 'Interactive Portal' : 'MilcharSec tool'}</p><h1>${esc(def.name)}</h1></div></div><p class="tool-lead">${esc(def.note)}</p><div class="tool-form">${form(id, instance)}<div data-tool-result="${instance}"></div></div></section>`;
}

export function collectInput(view) {
  const get = (key) => view.querySelector(`[data-tool-input="${key}"]`)?.value.trim() || '';
  return { password:get('password'), sender:get('sender'), subject:get('subject'), body:get('body'), links:get('links').split(/\n/).map((x) => x.trim()).filter(Boolean), url:get('url'), category:get('category'), impact:get('impact'), affectedUsers:Number(get('affectedUsers')) || 0, description:get('description'), timeline:[...view.querySelectorAll('[data-timeline-list] li')].map((x) => x.textContent).join('\n'), incidentType:get('incidentType'), when:get('when'), system:get('system'), actions:get('actions'), details:get('details'), logText:get('logText'), checkedItems:[...view.querySelectorAll('[data-device-item]:checked')].map((x) => x.dataset.deviceItem) };
}

export function renderResult(view, result, id) { const target = view.querySelector('[data-tool-result]'); if (target) target.innerHTML = resultPanel(result, id); }
export function renderQRAnalysis(result) { return result.url ? `<div class="qr-decoded"><strong>Decoded URL</strong><code>${esc(result.value)}</code></div>${resultPanel(result.analysis, 'tool-03')}` : `<div class="qr-decoded"><strong>Decoded content</strong><code>${esc(result.value || '(empty content)')}</code><span>Content type: ${esc(result.contentType)}</span></div><p class="tool-muted">This content is not an HTTP(S) URL, so URL Safety Checker analysis was not applied.</p>`; }
