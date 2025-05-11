import { describe, it, expect } from 'vitest';
import { verificationSchema } from './verificationSchema';

describe('verificationSchema', () => {
  it('should validate a correct verification code', () => {
    const validData = { verificationCode: '123456' };
    const result = verificationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should invalidate a verification code that is too short', () => {
    const invalidData = { verificationCode: '12345' };
    const result = verificationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Verification code must be at least 6 characters long');
  });

  it('should invalidate a verification code that is too long', () => {
    const invalidData = { verificationCode: '1234567' };
    const result = verificationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Verification code must be exactly 6 characters long');
  });

  it('should invalidate a verification code that is not numeric', () => {
    const invalidData = { verificationCode: 'abcdef' };
    const result = verificationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Verification code must be numeric');
  });

  it('should invalidate a verification code that is mixed alpha-numeric', () => {
    const invalidData = { verificationCode: '123ab6' };
    const result = verificationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Verification code must be numeric');
  });

  it('should invalidate an empty verification code', () => {
    const invalidData = { verificationCode: '' };
    const result = verificationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Verification code must be at least 6 characters long');
  });

   it('should invalidate if verificationCode is missing', () => {
    const invalidData = {};
    const result = verificationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Required');
  });
});
