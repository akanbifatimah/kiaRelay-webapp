// TODO: replace with POST /auth/forgot-password and POST /auth/reset-password
// once the backend exists. Flow shape (email -> 6-digit code + new password,
// one combined screen) mirrors colcare-webapp's ForgotPasswordPage/
// ResetPasswordPage. Mirrors colcare-api's real behavior too: forgot-password
// always "succeeds" regardless of whether the email exists, to avoid account
// enumeration — there's just no real email to send here, so the mock code is
// surfaced back to the caller instead so the flow is actually completable.
export const MOCK_RESET_CODE = "123456";

export async function requestPasswordReset(email: string): Promise<{ mockCode: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  void email;
  return { mockCode: MOCK_RESET_CODE };
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  void email;
  void newPassword;
  if (code !== MOCK_RESET_CODE) {
    throw new Error("Invalid or expired reset code.");
  }
}
