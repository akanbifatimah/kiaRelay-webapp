// TODO: replace with the real backend once it exists:
//   POST /auth/forgot-password  { email }
//   POST /auth/verify-reset-code { email, code }  (or fold into reset-password)
//   POST /auth/reset-password   { email, newPassword }
// Flow shape (email -> verify code screen with a resend timer -> new
// password screen) mirrors colcare-mobile's 3-step wizard, per the user's
// explicit correction — not colcare-webapp's single combined screen.
// Mirrors colcare-api's real anti-enumeration behavior too: forgot-password
// always "succeeds" regardless of whether the email exists — there's just no
// real email to send here, so the mock code is handed back to the caller
// instead so the flow is actually completable.
export const MOCK_RESET_CODE = "123456";

export async function requestPasswordReset(email: string): Promise<{ mockCode: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  void email;
  return { mockCode: MOCK_RESET_CODE };
}

export async function verifyResetCode(email: string, code: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  void email;
  return code === MOCK_RESET_CODE;
}

export async function resetPassword(email: string, newPassword: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  void email;
  void newPassword;
}
