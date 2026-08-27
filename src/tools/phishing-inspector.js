export function inspectEmail({ sender='', subject='', body='', links=[] } = {}) {
  const text = `${sender} ${subject} ${body}`; const indicators=[];
  const add=(test,msg)=>{if(test) indicators.push(msg)};
  add(/urgent|immediately|within \d+|last warning|action required/i.test(text),'Urgency or pressure discourages careful verification.');
  add(/password|one[- ]time|verification code|otp|mfa|credit card|bank|payment/i.test(text),'The message requests sensitive information or a high-risk action.');
  add(/suspend|close|blocked|legal action|penalty/i.test(text),'Threats or fear-based consequences are used.');
  add(/dear customer|valued user|kindly|congratulations|gift card/i.test(text),'Generic or unusual wording may indicate social engineering.');
  add(sender && /@(gmail|outlook|mail)\./i.test(sender) && /it|security|finance|support/i.test(text),'The sender identity and claimed organization may not match.');
  add(links.length > 0,'Links are present; inspect their destination before opening.');
  return { riskLevel:indicators.length>=3?'High Risk':indicators.length?'Medium Risk':'Low Risk', indicators, links, explanation:indicators.length?'Attackers combine urgency, authority, sensitive requests, and links to prompt unsafe action.':'No common pattern was detected, but a clean scan cannot prove a message is safe.', recommendedAction:indicators.length?'Do not click, reply, or share information. Verify through a known channel and report it using your organization’s process.':'Verify unexpected requests independently before acting.' };
}
