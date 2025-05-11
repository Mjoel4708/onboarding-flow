import { z } from 'zod';

export const businessSchema = z.object({
  businessName: z.string({ required_error: 'Business name is required' }).min(1, 'Business name is required'),
  businessLogo: z.instanceof(File).refine(file => 
    ['image/jpeg', 'image/png'].includes(file.type) && file.size <= 2 * 1024 * 1024, 
    {
      message: 'Business logo must be a JPG or PNG file and less than 2MB',
    }
  ),
  industry: z.string({ required_error: 'Industry is required' }).min(1, 'Industry is required'),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-500', '500+'], {
    errorMap: () => ({ message: 'Company size is required' }),
  }),
  businessDocument: z.instanceof(File).refine(file => 
    file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024, 
    {
      message: 'Business document must be a PDF file and less than 5MB',
    }
  ),
});