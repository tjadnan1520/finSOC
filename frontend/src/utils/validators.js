export function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidAmount(amount) {
  const value = Number(amount);
  return !isNaN(value) && value > 0;
}

export function isRequired(value) {
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return true;
  if (value === null || value === undefined) return false;
  return true;
}

export function isValidLength(value, min, max) {
  if (typeof value !== 'string') return false;
  const len = value.trim().length;
  if (min !== undefined && len < min) return false;
  if (max !== undefined && len > max) return false;
  return true;
}
