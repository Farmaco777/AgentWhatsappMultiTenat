/**
 * Normalizes a phone number to E.164 format.
 * Examples:
 * +57 312 456 7890 -> 573124567890
 * 312-456-7890 -> 573124567890 (assuming default country)
 */
export function normalizePhoneNumber(phone: string, defaultCountryCode: string = '57'): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');

  // If it starts with 00, replace with nothing (standard international prefix)
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }

  // If it doesn't have a country code (e.g. 10 digits in Colombia), add defaultCountryCode
  if (cleaned.length === 10 && !cleaned.startsWith(defaultCountryCode)) {
    cleaned = defaultCountryCode + cleaned;
  }

  return cleaned;
}

/**
 * Validates if a string is a valid E.164 phone number.
 */
export function isValidE164(phone: string): boolean {
  const regex = /^\d{10,15}$/;
  return regex.test(phone);
}
