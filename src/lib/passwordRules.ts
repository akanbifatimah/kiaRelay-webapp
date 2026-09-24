/** Password strength rules shared by every place a password is set
 * (My Account's change-password card, Add/Edit Team Member). */
export const PASSWORD_CHECKS: { label: string; test: (value: string) => boolean }[] = [
  { label: "At least 8 characters", test: (value) => value.length >= 8 },
  { label: "Upper and lower case letters", test: (value) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { label: "A number", test: (value) => /\d/.test(value) },
  { label: "A symbol", test: (value) => /[^A-Za-z0-9]/.test(value) },
];

export const meetsPasswordRules = (value: string) => PASSWORD_CHECKS.every((check) => check.test(value));
