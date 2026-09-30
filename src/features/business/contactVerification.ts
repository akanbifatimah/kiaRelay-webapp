// Mock email + SMS verification for KiaRelay Business sign-up (email added
// 2026-09-30, since email is the sign-in and password-reset identifier). It
// uses the same demo code as the mobile app, and the code is shown on screen
// since nothing is actually sent.
// TODO: POST /auth/email/send, /auth/email/verify, /auth/phone/send and
// /auth/phone/verify once the backend exists.
export const MOCK_VERIFICATION_CODE = "123456";

export type VerificationChannel = "email" | "phone";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendVerificationCode(channel: VerificationChannel, target: string): Promise<void> {
  await wait(400);
  void channel;
  void target;
}

export async function verifyCode(channel: VerificationChannel, code: string): Promise<boolean> {
  await wait(500);
  void channel;
  return code === MOCK_VERIFICATION_CODE;
}
