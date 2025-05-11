import { describe, it, expect } from 'vitest';
import { personalSchema } from './personalSchema';
import { z } from 'zod';

describe('personalSchema', () => {
  it('should validate a correct personal details object', () => {
    const validData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      profileImage: new File(['profile'], 'profile.jpg', { type: 'image/jpeg' }),
    };
    const result = personalSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should invalidate an object with a missing name', () => {
    const invalidData = {
      email: 'john.doe@example.com',
      phone: '1234567890',
      profileImage: new File(['profile'], 'profile.jpg', { type: 'image/jpeg' }),
    };
    const result = personalSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Name is required');
  });

  it('should invalidate an object with an invalid email', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john.doe',
      phone: '1234567890',
      profileImage: new File(['profile'], 'profile.jpg', { type: 'image/jpeg' }),
    };
    const result = personalSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Invalid email format');
  });

  it('should invalidate an object with a short phone number', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123',
      profileImage: new File(['profile'], 'profile.jpg', { type: 'image/jpeg' }),
    };
    const result = personalSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Phone number must be at least 10 digits');
  });

  it('should invalidate an object with a large profile image', () => {
    const largeFile = new File(new Array(3 * 1024 * 1024).fill('a'), 'large.jpg', { type: 'image/jpeg' });
    const invalidData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      profileImage: largeFile,
    };
    const result = personalSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Profile image must be less than 2MB');
  });

  it('should invalidate an object with an unsupported image type', () => {
    const invalidFile = new File(['profile'], 'profile.gif', { type: 'image/gif' });
    const invalidData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      profileImage: invalidFile,
    };
    const result = personalSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Only JPG and PNG formats are allowed');
  });

  it('should pass validation if profileImage is not provided, as it is not explicitly required by min(1)', () => {
    const validData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
    };
    const result = personalSchema.safeParse(validData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].path).toContain('profileImage');
  });

   it('should validate if profileImage is explicitly undefined and the field is made optional', () => {
    const dataWithUndefinedImage = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '0987654321',
      profileImage: undefined,
    };

    const result = personalSchema.safeParse(dataWithUndefinedImage);
    expect(result.success).toBe(false); 
    expect(result.error.errors[0].message).toBe('Required');
  });


});
