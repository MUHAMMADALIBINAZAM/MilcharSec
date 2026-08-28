const COMMON = ['password','qwerty','letmein','welcome','admin','123456','abc123','milchar','cybersecurity'];
export function analyzePassword(password) {
  const result = { strength:'Weak', entropyBits:0, timeToCrack:'Instantly or very quickly', weaknesses:[], recommendations:[], educationalExplanation:'Entropy is an estimate of how many guesses an attacker may need; length and uniqueness matter more than cosmetic complexity.' };
  if (!password) return result;
  const sets = (/[a-z]/.test(password)?26:0)+(/[A-Z]/.test(password)?26:0)+(/[0-9]/.test(password)?10:0)+(/[^A-Za-z0-9]/.test(password)?33:0);
  result.entropyBits = Math.round(password.length * Math.log2(Math.max(sets, 1)));
  if (password.length < 12) { result.weaknesses.push('It is shorter than a safer 12-character minimum.'); result.recommendations.push('Use a long, memorable passphrase of 14 or more characters.'); }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) result.weaknesses.push('It uses a limited mix of character types.');
  if (/(.)\1{2,}|1234|abcd|qwer/i.test(password)) { result.weaknesses.push('It contains repeated or predictable sequences.'); result.recommendations.push('Avoid keyboard walks, repeated characters, dates, and sequences.'); }
  if (COMMON.some((x) => password.toLowerCase().includes(x))) { result.weaknesses.push('It includes a common password or familiar word.'); result.recommendations.push('Choose unrelated words that are not personal or commonly used.'); }
  if (!result.weaknesses.length) result.recommendations.push('Keep it unique and store it in a reputable password manager.');
  if (result.entropyBits >= 70 && password.length >= 14 && result.weaknesses.length === 0) result.strength='Very Strong'; else if (result.entropyBits >= 55 && password.length >= 12) result.strength='Strong'; else if (result.entropyBits >= 35) result.strength='Moderate';
  result.timeToCrack = result.entropyBits < 35 ? 'Common guesses may succeed quickly.' : result.entropyBits < 55 ? 'Could resist basic guessing, but should be improved.' : result.entropyBits < 70 ? 'Estimated to resist common offline guessing for a meaningful period.' : 'Estimated to be highly resistant to offline guessing when unique.';
  return result;
}
