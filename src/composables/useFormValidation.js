import { z } from 'zod';

export const personalDetailsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone number is required'),
  profileImage: z.instanceof(File).refine(file => {
    return file.size <= 2 * 1024 * 1024 && (file.type === 'image/jpeg' || file.type === 'image/png');
  }, {
    message: 'Profile image must be a JPG or PNG and less than 2MB',
  }),
});

export const businessDetailsSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessLogo: z.union([
    z.instanceof(File).refine(file => {
      return file.size <= 5 * 1024 * 1024 && file.type === 'image/png';
    }, {
      message: 'Business logo must be a PNG and less than 5MB',
    }),
    z.string().optional(),
    z.null()
  ]).optional(),
  industry: z.string().min(1, 'Industry is required'),
  companySize: z.string().min(1, 'Company size is required'),
  businessDocument: z.union([
    z.instanceof(File).refine(file => {
      return file.size <= 5 * 1024 * 1024 && file.type === 'application/pdf';
    }, {
      message: 'Business document must be a PDF and less than 5MB',
    }),
    z.string().optional(),
    z.null()
  ]).optional(),
});

export const verificationSchema = z.object({
  verificationCode: z.string().min(1, 'Verification code is required'),
});

export const useFormValidation = () => {
  const validate = (data, schema) => {
    try {
      schema.parse(data);
      return true;
    } catch (error) {
      return error.errors;
    }
  };

  return { validate };
};