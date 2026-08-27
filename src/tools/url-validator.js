const IP=/^(\d{1,3}\.){3}\d{1,3}$/;
export function validateURL(value='') {
  const flags=[]; let url; try { url=new URL(value.match(/^https?:\/\//i)?value:`https://${value}`); } catch { return { riskLevel:'High Risk', flags:['The value is not a valid web address.'], parts:{}, educationalAssessment:'A malformed address should not be opened or trusted.', recommendedAction:'Use a known bookmark or type the official domain manually.' }; }
  const host=url.hostname.toLowerCase(), labels=host.split('.'), domain=labels.length>1?labels.at(-2):host, tld=labels.length>1?labels.at(-1):'';
  if (url.protocol !== 'https:') flags.push('HTTPS is not being used.');
  if (IP.test(host)) flags.push('An IP address is used instead of a recognizable domain.');
  if (labels.length>3) flags.push('The URL has multiple subdomain levels that may disguise the real domain.');
  if (/(login|verify|secure|account|update|wallet|payment|unlock)/i.test(url.pathname+url.search)) flags.push('The path contains a sensitive-action keyword; verify the destination first.');
  if (/[а-яА-Я]/.test(host) || /xn--/i.test(host)) flags.push('The domain may use look-alike internationalized characters.');
  if (/[0-9]/.test(domain) || /[-_]{2,}|(paypa1|micros0ft|g00gle|faceb00k|amaz0n)/i.test(domain)) flags.push('The domain resembles a typo-squatting or look-alike pattern.');
  return { riskLevel:flags.length>=3?'High Risk':flags.length?'Medium Risk':'Low Risk', flags, parts:{subdomain:labels.slice(0,-2).join('.') ,domain,tld,hostname:host}, educationalAssessment:'HTTPS protects the connection but does not prove that the site itself is legitimate. Read the registrable domain and treat look-alikes, IP hosts, and misleading paths cautiously.', recommendedAction:flags.length?'Do not sign in or download anything until you verify the domain through a trusted source.':'Still confirm the domain independently before entering sensitive information.' };
}
