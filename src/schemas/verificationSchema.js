import { z } from 'zod';

export const verificationSchema = z.object({
  verificationCode: z.string()
    .min(6, 'Verification code must be at least 6 characters long')
    .max(6, 'Verification code must be exactly 6 characters long')
    .regex(/^\d{6}$/, 'Verification code must be numeric'),
});