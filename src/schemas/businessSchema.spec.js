import { describe, it, expect } from 'vitest';
import { businessSchema } from './businessSchema';
import { z } from 'zod';

describe('businessSchema', () => {
  it('should validate a correct business details object', () => {
    const validData = {
      businessName: 'Acme Corp',
      businessLogo: new File(['logo'], 'logo.png', { type: 'image/png' }),
      industry: 'Technology',
      companySize: '11-50',
      businessDocument: new File(['doc'], 'document.pdf', { type: 'application/pdf' }),
    };
    const result = businessSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should invalidate an object with a missing business name', () => {
    const invalidData = {
      businessLogo: new File(['logo'], 'logo.png', { type: 'image/png' }),
      industry: 'Technology',
      companySize: '11-50',
      businessDocument: new File(['doc'], 'document.pdf', { type: 'application/pdf' }),
    };
    const result = businessSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Business name is required');
  });

  it('should invalidate an object with an invalid business logo type', () => {
    const invalidData = {
      businessName: 'Acme Corp',
      businessLogo: new File(['logo'], 'logo.gif', { type: 'image/gif' }),
      industry: 'Technology',
      companySize: '11-50',
      businessDocument: new File(['doc'], 'document.pdf', { type: 'application/pdf' }),
    };
    const result = businessSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Business logo must be a JPG or PNG file and less than 2MB');
  });

  it('should invalidate an object with a large business logo', () => {
    const largeLogo = new File(new Array(3 * 1024 * 1024).fill('a'), 'large.png', { type: 'image/png' });
    const invalidData = {
      businessName: 'Acme Corp',
      businessLogo: largeLogo,
      industry: 'Technology',
      companySize: '11-50',
      businessDocument: new File(['doc'], 'document.pdf', { type: 'application/pdf' }),
    };
    const result = businessSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Business logo must be a JPG or PNG file and less than 2MB');
  });

  it('should invalidate an object with a missing industry', () => {
    const invalidData = {
      businessName: 'Acme Corp',
      businessLogo: new File(['logo'], 'logo.png', { type: 'image/png' }),
      companySize: '11-50',
      businessDocument: new File(['doc'], 'document.pdf', { type: 'application/pdf' }),
    };
    const result = businessSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Industry is required');
  });

  it('should invalidate an object with an invalid company size', () => {
    const invalidData = {
      businessName: 'Acme Corp',
      businessLogo: new File(['logo'], 'logo.png', { type: 'image/png' }),
      industry: 'Technology',
      companySize: 'invalid-size',
      businessDocument: new File(['doc'], 'document.pdf', { type: 'application/pdf' }),
    };
    const result = businessSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Company size is required');
  });

  it('should invalidate an object with an invalid business document type', () => {
    const invalidData = {
      businessName: 'Acme Corp',
      businessLogo: new File(['logo'], 'logo.png', { type: 'image/png' }),
      industry: 'Technology',
      companySize: '11-50',
      businessDocument: new File(['doc'], 'document.txt', { type: 'text/plain' }),
    };
    const result = businessSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Business document must be a PDF file and less than 5MB');
  });

  it('should invalidate an object with a large business document', () => {
    const largeDoc = new File(new Array(6 * 1024 * 1024).fill('a'), 'large.pdf', { type: 'application/pdf' });
    const invalidData = {
      businessName: 'Acme Corp',
      businessLogo: new File(['logo'], 'logo.png', { type: 'image/png' }),
      industry: 'Technology',
      companySize: '11-50',
      businessDocument: largeDoc,
    };
    const result = businessSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Business document must be a PDF file and less than 5MB');
  });

});
