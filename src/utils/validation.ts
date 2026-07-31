export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const indianMobilePattern = /^[6-9]\d{9}$/;

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizeMobile(value: string) {
  const digits = onlyDigits(value);
  if (!digits) return "";
  if (!/^[6-9]/.test(digits)) return "";
  return digits.slice(0, 10);
}

export function isValidEmail(value: string) {
  return emailPattern.test(value.trim());
}

export function isValidIndianMobile(value: string) {
  return indianMobilePattern.test(value.trim());
}
