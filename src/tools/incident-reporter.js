export function calculateSeverity({ impact='Low', affectedUsers=0, category='' } = {}) {
  const n = Number(affectedUsers) || 0;
  const critical = impact === 'High' || n >= 100;
  const medium = impact === 'Medium' || n >= 10;
  const takeover = category === 'Account compromise';
  const severity = critical ? 'Critical' : medium ? 'Medium' : takeover ? 'High' : 'Low';
  const checks = [
    { label: 'Not high impact and under 100 affected users', pass: !critical },
    { label: 'Not medium impact and under 10 affected users', pass: !medium },
    { label: 'Not an account compromise', pass: !takeover }
  ];
  return { severity, checks };
}
export function generateReportDraft({ category='Not specified', severity='Not assessed', description='', timeline='' } = {}) { return `INCIDENT REPORT\\nCategory: ${category}\\nSeverity: ${severity}\\nWhat happened: ${description || 'Not provided'}\\nTimeline:\\n${timeline || 'Not provided'}\\nImmediate action: Stop interacting with the suspected threat, preserve useful evidence, and report through the approved channel.`; }
