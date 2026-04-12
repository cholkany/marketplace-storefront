import { z } from "zod";

export const vendorLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const vendorSignupSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  storeName: z.string().min(3),
});

export const productSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.string().min(1), // Medusa expects number, we'll convert it
});
