export function inspectEmail({ sender='', subject='', body='', links=[] } = {}) {
  const text = `${sender} ${subject} ${body}`; const indicators=[]; const checks=[];
  const add=(test,msg,label)=>{const hit=!!test;if(hit) indicators.push(msg);checks.push({label,pass:!hit})};
  add(/urgent|immediately|within \d+|last warning|action required/i.test(text),'Urgency or pressure discourages careful verification.','No urgency or pressure language');
  add(/password|one[- ]time|verification code|otp|mfa|credit card|bank|payment/i.test(text),'The message requests sensitive information or a high-risk action.','No request for sensitive information');
  add(/suspend|close|blocked|legal action|penalty/i.test(text),'Threats or fear-based consequences are used.','No threats or fear-based consequences');
  add(/dear customer|valued user|kindly|congratulations|gift card/i.test(text),'Generic or unusual wording may indicate social engineering.','No generic or unusual wording');
  add(sender && /@(gmail|outlook|mail)\./i.test(sender) && /it|security|finance|support/i.test(text),'The sender identity and claimed organization may not match.','Sender identity matches the claimed organization');
  add(links.length > 0,'Links are present; inspect their destination before opening.','No links requiring destination checks');
  return { riskLevel:indicators.length>=3?'High Risk':indicators.length?'Medium Risk':'Low Risk', indicators, checks, links, explanation:indicators.length?'Attackers combine urgency, authority, sensitive requests, and links to prompt unsafe action.':'No common pattern was detected, but a clean scan cannot prove a message is safe.', recommendedAction:indicators.length?'Do not click, reply, or share information. Verify through a known channel and report it using your organization\u2019s process.':'Verify unexpected requests independently before acting.' };
}
