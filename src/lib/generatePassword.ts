import { meetsPasswordRules } from "./passwordRules";

const LOWER = "abcdefghijkmnopqrstuvwxyz";
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const DIGITS = "23456789";
const SYMBOLS = "!@#$%^&*?-_";
const ALL = LOWER + UPPER + DIGITS + SYMBOLS;

function pick(chars: string, random: number): string {
  return chars[random % chars.length];
}

/**
 * A random temporary password that always passes passwordRules. It uses
 * crypto.getRandomValues, never Math.random, and leaves out look-alike
 * characters (l/1, O/0) since people may read it off a screen.
 * TODO: the backend generates and emails this once POST /admin/users exists;
 * the client should never see it.
 */
export function generatePassword(length = 14): string {
  const random = crypto.getRandomValues(new Uint32Array(length + length));
  // One of each required class, then fill, then shuffle (Fisher–Yates).
  const chars = [pick(LOWER, random[0]), pick(UPPER, random[1]), pick(DIGITS, random[2]), pick(SYMBOLS, random[3])];
  for (let i = chars.length; i < length; i += 1) chars.push(pick(ALL, random[i]));
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = random[length + i] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  const password = chars.join("");
  return meetsPasswordRules(password) ? password : generatePassword(length);
}
