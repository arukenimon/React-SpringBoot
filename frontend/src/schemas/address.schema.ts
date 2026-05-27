import { z } from 'zod';

export const addressSchema = z.object({
  label: z.string().trim().min(1, 'Required').max(40),
  line1: z.string().trim().min(1, 'Required').max(120),
  line2: z.string().trim().max(120).optional().or(z.literal('')),
  city: z.string().trim().min(1, 'Required').max(80),
  state: z.string().trim().max(80).optional().or(z.literal('')),
  postalCode: z.string().trim().min(1, 'Required').max(20),
  country: z.string().trim().min(1, 'Required').max(80),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
