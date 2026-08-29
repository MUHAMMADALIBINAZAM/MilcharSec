/**
 * Security Log Analyzer — educational, client-side only.
 *
 * Parses a plain-text activity log, runs a fixed set of detection rules,
 * and returns each line tagged with any rules that flagged it plus an
 * overall risk assessment. Nothing is transmitted or stored.
 */

export const SAMPLES = {
  normal: {
    label: 'Normal workday',
    text: [
      '09:02 Login successful from Chrome on Windows',
      '09:15 Document opened: Q3-Report.docx',
      '10:48 Email sent to accounts@supplier.example',
      '12:32 Login successful from Chrome on Windows',
      '13:05 Document opened: Team-Notes.pdf',
      '15:20 File downloaded: invoice-2026.pdf',
      '17:05 Logout'
    ].join('\n')
  },
  compromised: {
    label: 'Compromised account',
    text: [
      '08:41 Login successful',
      '08:43 Login failed',
      '08:44 Login failed',
      '08:44 Login failed',
      '08:45 Login successful',
      '08:46 Password changed',
      '08:47 MFA disabled',
      '08:49 New recovery email added',
      '08:52 Bulk file download started'
    ].join('\n')
  },
  ambiguous: {
    label: 'Ambiguous — review needed',
    text: [
      '02:14 Login successful from new device (iPhone)',
      '02:18 Password reset requested',
      '02:23 Password changed',
      '02:25 MFA disabled',
      '02:30 Login successful from new device (iPhone)',
      '09:02 Login successful from Chrome on Windows',
      '09:10 Document opened: Payroll.xlsx',
      '09:15 Bulk export: customer list (2,400 rows)'
    ].join('\n')
  }
};

const RULE_LABELS = {
  'brute-force': 'Possible brute force',
  'account-takeover': 'Possible account takeover',
  'mfa-disabled': 'MFA disabled',
  'off-hours': 'Unusual hours',
  'rapid-escalation': 'Rapid privilege change',
  'recovery-changed': 'Recovery details changed',
  'bulk-download': 'Bulk download / export'
};

function parseLog(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.map((line) => {
    const m = line.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\b/);
    if (!m) return { line, flags: [], hour: null, minute: null };
    const hour = Number(m[1]);
    const minute = Number(m[2]);
    return { line, flags: [], hour, minute };
  });
}

function withinMinutes(entries, i, j, minutes) {
  const a = entries[i], b = entries[j];
  if (a.hour === null || b.hour === null) return false;
  const diffMin = (b.hour * 60 + b.minute) - (a.hour * 60 + a.minute);
  return diffMin >= 0 && diffMin <= minutes;
}

function isFail(entry) { return /login\s*failed|failed\s*login|authentication\s*failed/i.test(entry.line); }
function isSuccess(entry) { return /login\s*successful|successful\s*login|logged\s*in/i.test(entry.line); }
function isPasswordChange(entry) { return /password\s*changed|password\s*reset\b|changed\s*password/i.test(entry.line); }
function isMfaDisabled(entry) { return /\bmfa\s*disabled|\b2fa\s*disabled|two[- ]factor\s*disabled/i.test(entry.line); }
function isRecoveryChange(entry) { return /recovery\s*(email|phone)|backup\s*(email|phone)/i.test(entry.line); }
function isBulkDownload(entry) { return /bulk\s*(download|export)|bulk\s*file|mass\s*download/i.test(entry.line); }
function isNewDevice(entry) { return /new\s*device|unrecognized\s*device|new\s*location/i.test(entry.line); }

export function analyzeLog(rawText) {
  const entries = parseLog(rawText);
  const findings = [];

  // Rule 1 — Brute force: 3+ failed logins in a 5-minute window followed by success.
  for (let i = 0; i < entries.length; i++) {
    if (!isFail(entries[i])) continue;
    let failCount = 1;
    const failIdxs = [i];
    for (let j = i + 1; j < entries.length && withinMinutes(entries, i, j, 5); j++) {
      if (isFail(entries[j])) { failCount++; failIdxs.push(j); }
    }
    if (failCount < 3) continue;
    let successIdx = -1;
    for (let j = failIdxs[failIdxs.length - 1] + 1; j < entries.length && withinMinutes(entries, i, j, 5); j++) {
      if (isSuccess(entries[j])) { successIdx = j; break; }
    }
    const flagged = successIdx >= 0 ? [...failIdxs, successIdx] : failIdxs;
    for (const idx of flagged) {
      const why = successIdx >= 0
        ? `Three or more failed logins in a short window followed by a successful login is a classic brute-force or credential-stuffing pattern — an attacker is likely guessing passwords and finally got in.`
        : `Three or more failed logins in a short window suggests someone is guessing passwords against this account.`;
      entries[idx].flags.push({ rule: 'brute-force', why, risk: 'high' });
    }
    i = failIdxs[failIdxs.length - 1];
  }

  // Rule 2 — Account takeover: password / MFA / recovery change within 10 minutes of suspicious activity.
  const suspiciousIdxs = entries
    .map((e, i) => (isFail(e) || (e.flags.length > 0) ? i : -1))
    .filter((i) => i >= 0);
  entries.forEach((entry, i) => {
    if (!(isPasswordChange(entry) || isMfaDisabled(entry) || isRecoveryChange(entry))) return;
    const preceding = suspiciousIdxs.find((j) => j < i && withinMinutes(entries, j, i, 10));
    if (!preceding) return;
    const rule = isMfaDisabled(entry) ? 'mfa-disabled'
      : isRecoveryChange(entry) ? 'recovery-changed'
      : 'account-takeover';
    const why = isMfaDisabled(entry)
      ? 'MFA was disabled right after suspicious activity — an attacker with the password often removes MFA so they can return without the second factor.'
      : isRecoveryChange(entry)
        ? 'Recovery details were changed right after suspicious activity. Attackers do this to lock the real owner out and to receive future password-reset links.'
        : 'A password change immediately after suspicious logins is a common takeover pattern — the attacker locks out the real owner.';
    entry.flags.push({ rule, why, risk: 'critical' });
  });

  // Rule 3 — MFA disabled standalone (not already flagged).
  entries.forEach((entry) => {
    if (!isMfaDisabled(entry)) return;
    if (entry.flags.some((f) => f.rule === 'mfa-disabled')) return;
    entry.flags.push({
      rule: 'mfa-disabled',
      why: 'MFA was disabled. Without MFA, the account relies on a password alone — much easier for an attacker to compromise.',
      risk: 'high'
    });
  });

  // Rule 4 — Off-hours activity (before 6 AM or after 10 PM).
  entries.forEach((entry) => {
    if (entry.hour === null) return;
    if (entry.hour < 6 || entry.hour >= 22) {
      entry.flags.push({
        rule: 'off-hours',
        why: `Activity recorded at ${String(entry.hour).padStart(2,'0')}:${String(entry.minute).padStart(2,'0')}, outside normal working hours. This can be legitimate, but attackers often strike when staff are unlikely to notice.`,
        risk: 'low'
      });
    }
  });

  // Rule 5 — Rapid privilege change: password change then MFA change within 5 minutes (standalone).
  for (let i = 0; i < entries.length; i++) {
    if (!isPasswordChange(entries[i])) continue;
    for (let j = i + 1; j < entries.length && withinMinutes(entries, i, j, 5); j++) {
      if (isMfaDisabled(entries[j]) && !entries[j].flags.some((f) => f.rule === 'rapid-escalation')) {
        entries[j].flags.push({
          rule: 'rapid-escalation',
          why: 'Password change followed within minutes by MFA being disabled is a textbook account-lockout sequence.',
          risk: 'critical'
        });
      }
      if (isRecoveryChange(entries[j]) && !entries[j].flags.some((f) => f.rule === 'rapid-escalation')) {
        entries[j].flags.push({
          rule: 'rapid-escalation',
          why: 'Password change followed within minutes by a recovery-address change is a classic way attackers take permanent control.',
          risk: 'critical'
        });
      }
    }
  }

  // Rule 6 — Login from new device.
  entries.forEach((entry) => {
    if (!isNewDevice(entry)) return;
    entry.flags.push({
      rule: 'account-takeover',
      why: 'Login from a device that has not been seen before on this account. Legitimate if the user really got a new device, but worth verifying.',
      risk: 'medium'
    });
  });

  // Rule 7 — Bulk download / export.
  entries.forEach((entry) => {
    if (!isBulkDownload(entry)) return;
    entry.flags.push({
      rule: 'bulk-download',
      why: 'A bulk download or export can signal data exfiltration — especially if it follows a takeover or comes from an unusual device.',
      risk: 'high'
    });
  });

  // Overall risk.
  const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  let overallRisk = 'low';
  let headline = 'No obvious red flags in this log.';
  entries.forEach((entry) => {
    entry.flags.forEach((f) => {
      if (riskOrder[f.risk] > riskOrder[overallRisk]) overallRisk = f.risk;
    });
  });
  const flaggedCount = entries.filter((e) => e.flags.length > 0).length;
  if (flaggedCount > 0) {
    headline = overallRisk === 'critical'
      ? 'Critical signs of account compromise — treat as an active incident.'
      : overallRisk === 'high'
        ? 'Multiple high-risk patterns detected — investigate promptly.'
        : overallRisk === 'medium'
          ? 'Some activity worth reviewing — verify with the account owner.'
          : 'Minor indicators flagged — keep monitoring.';
  }

  const ruleCounts = {};
  entries.forEach((entry) => entry.flags.forEach((f) => {
    ruleCounts[f.rule] = (ruleCounts[f.rule] || 0) + 1;
  }));

  return {
    risk: overallRisk,
    headline,
    flaggedCount,
    totalLines: entries.length,
    entries,
    ruleCounts,
    ruleLabels: RULE_LABELS
  };
}
