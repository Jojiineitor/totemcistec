/**
 * Generates customer queue/ticket code based on customer's name and document (CI/CPF).
 * 
 * Rules:
 * - If customer provides first and last name (>= 2 words):
 *     1st letter of first name + 1st letter of last name (e.g. "Rodrigo Coronel" -> "RC")
 * - If customer provides only 1 name:
 *     First 2 letters of name (e.g. "Rodrigo" -> "RO")
 * - Digits:
 *     Last 3 digits of CI or CPF (e.g. "6542518" -> "518")
 * 
 * Result: "RC-518" or "RO-518"
 */
export function generateTicketCode(fullName: string, docNumber: string): string {
  const cleanName = fullName.trim().toUpperCase();
  const nameParts = cleanName.split(/\s+/).filter(Boolean);

  let letterCode = "";
  if (nameParts.length >= 2) {
    const firstInitial = nameParts[0].charAt(0);
    // Take the first character of the second word (surname)
    const secondInitial = nameParts[1].charAt(0);
    letterCode = `${firstInitial}${secondInitial}`;
  } else if (nameParts.length === 1) {
    const singleName = nameParts[0];
    letterCode = singleName.substring(0, 2).padEnd(2, "X");
  } else {
    letterCode = "--";
  }

  // Extract only digits from document
  const digits = docNumber.replace(/\D/g, "");
  let digitCode = "---";
  if (digits.length >= 3) {
    digitCode = digits.slice(-3);
  } else if (digits.length > 0) {
    digitCode = digits.padStart(3, "0");
  }

  return `${letterCode}-${digitCode}`;
}

/**
 * Checks whether customer data is complete enough for code generation.
 */
export function isValidCustomerData(fullName: string, docNumber: string): boolean {
  const cleanName = fullName.trim();
  const digits = docNumber.replace(/\D/g, "");
  return cleanName.length >= 2 && digits.length >= 3;
}
