// store.ts
export const otpStore = new Map<string, { otp: string; phone: string; expiresAt: number }>();