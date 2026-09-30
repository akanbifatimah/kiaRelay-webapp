// Mock SMS verification for KiaRelay Business sign-up. It uses the same demo
// code as the mobile app, and the code is shown on screen since no SMS is sent.
// TODO: POST /auth/phone/send and /auth/phone/verify once the backend exists.
export const MOCK_PHONE_CODE = "123456";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendPhoneCode(phone: string): Promise<void> {
  await wait(400);
  void phone;
}

export async function verifyPhoneCode(code: string): Promise<boolean> {
  await wait(500);
  return code === MOCK_PHONE_CODE;
}
