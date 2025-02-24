import { z } from "zod";

export const userDetailsSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(100, { message: "First name cannot exceed 100 characters" }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(100, { message: "Last name cannot exceed 100 characters" }),
  billingAddress: z.string().min(1, { message: "Billing address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  postcode: z.string().min(1, { message: "Postcode is required" }),
  email: z
    .string()
    .email("Invalid email address")
    .min(1, { message: "Email is required" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number cannot exceed 15 digits" }),
});

export type UserDetails = z.infer<typeof userDetailsSchema>;
