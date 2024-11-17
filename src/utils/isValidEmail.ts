function isValidEmail(email: string): boolean {
  // Basic email validation using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
export default isValidEmail
