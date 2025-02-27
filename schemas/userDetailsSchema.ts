import { z } from "zod";

export const userDetailsSchema = z.object({
  userFirstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(100, { message: "First name cannot exceed 100 characters" }),
  userLastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(100, { message: "Last name cannot exceed 100 characters" }),
  userEmail: z
    .string()
    .email("Invalid email address")
    .min(1, { message: "Email is required" }),
  userPhone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number cannot exceed 15 digits" }),
  userPassword: z
    .string()
    // .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
  userAddress: z.string().min(1, { message: "Address is required" }),
  userCity: z.string().min(1, { message: "City is required" }),
  userPostcode: z.string().min(1, { message: "Postcode is required" }),
  userCountry: z.string().min(1, { message: "Country is required" }),
  userType: z.enum(["tenant", "landlord"], { 
    errorMap: () => ({ message: "User type must be either tenant or landlord" }) 
  })
}).refine((data) => data.userPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type UserDetails = z.infer<typeof userDetailsSchema>;