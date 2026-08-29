/* Device Security Checklist scoring module (tool-08). */

export const CHECKLIST_ITEMS = [
  { id: 'screen-lock', label: 'Screen lock enabled' },
  { id: 'os-updated', label: 'OS updated' },
  { id: 'apps-updated', label: 'Apps updated' },
  { id: 'antivirus', label: 'Antivirus/security protection enabled' },
  { id: 'backup', label: 'Backup configured' },
  { id: 'firewall', label: 'Firewall enabled' },
  { id: 'encryption', label: 'Device encryption enabled' },
  { id: 'unused-apps', label: 'Unused applications removed' },
  { id: 'bluetooth-wifi', label: 'Bluetooth/Wi-Fi settings reviewed' }
];

export const DEVICE_TIPS = [
  'Always use a PIN, password, or biometric lock. A device without a lock screen is an open door to your data.',
  'Be wary of apps that ask for more access than they need (e.g., a calculator asking for your location and contacts).',
  'Secure your home Wi-Fi with a strong password.'
];

export function scoreDeviceChecklist(checkedIds) {
  const ids = Array.isArray(checkedIds) ? checkedIds : [];
  const checked = CHECKLIST_ITEMS.filter((i) => ids.includes(i.id));
  const unchecked = CHECKLIST_ITEMS.filter((i) => !ids.includes(i.id));
  const score = Math.min(100, Math.round((checked.length / CHECKLIST_ITEMS.length) * 100));
  return {
    score,
    total: CHECKLIST_ITEMS.length,
    checked,
    unchecked,
    loweredBy: unchecked.map((i) => i.label),
    tips: DEVICE_TIPS
  };
}
