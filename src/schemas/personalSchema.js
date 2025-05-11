import { z } from 'zod';

export const personalSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  profileImage: z
    .instanceof(File, { message: "Required" })
    .refine(file => file.size <= 2 * 1024 * 1024, 'Profile image must be less than 2MB')
    .refine(file => ['image/jpeg', 'image/png'].includes(file.type), 'Only JPG and PNG formats are allowed'),
});