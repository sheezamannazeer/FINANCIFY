// Returns true if the email is valid, false otherwise
export function validEmail(email) {
  // Simple email regex for validation
  return /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email);
}
