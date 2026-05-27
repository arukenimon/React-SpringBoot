import { z } from 'zod';

export const profileSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  firstName: z.string().trim().min(1, 'Required').max(80),
  lastName: z.string().trim().min(1, 'Required').max(80),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
