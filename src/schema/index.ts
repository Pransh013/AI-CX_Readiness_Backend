import { z } from "zod";

export const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(100, { message: "Email must be less than 100 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(50, { message: "Password must be less than 50 characters" }),
  role: z
    .string()
    .min(1, "Role is required")
    .max(50, { message: "Role must be less than 50 characters" }),
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(100, { message: "Company name must be less than 100 characters" }),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" }),
});
