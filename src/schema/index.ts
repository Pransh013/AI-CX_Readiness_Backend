import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .min(1, "Password is required"),
  fullName: z.string().min(1, "Full name is required"),
  role: z.string().min(1, "Role is required"),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});